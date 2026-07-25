
(function(){
  const csvBtn = document.getElementById('reportCsvBtn');
  const csvMenu = document.getElementById('reportCsvMenu');
  const toolbar = document.querySelector('.report-actions');
  const pdfBtn = document.getElementById('reportPdfBtn');
  const printBtn = document.getElementById('reportPrintBtn');
  const actionStatus = document.getElementById('reportActionStatus');
  const csvTitle = document.getElementById('csvPreviewTitle');
  const csvMeta = document.getElementById('csvPreviewMeta');
  const csvNote = document.getElementById('csvPreviewNote');
  const csvPre = document.getElementById('csvPreviewPre');
  let currentCsvText = '';
  let currentCsvFilename = 'cavendish.csv';
  let currentCsvRecordId = '';
  let currentCsvGeneratedLabel = '';
  let reportPayload = null;
  let pdfExportBusy = false;
  let preparedPdfPackage = null;
  let pdfPreparePromise = null;
  let pdfPrepareTimer = 0;

  const REPORT_TIME_ZONE = 'Asia/Tokyo';
  function formatJstTimestamp(value = new Date()){
    const date = value instanceof Date ? value : new Date(value);
    const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;
    const formatted = new Intl.DateTimeFormat('ja-JP', {
      timeZone: REPORT_TIME_ZONE,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    }).format(safeDate);
    return formatted + ' JST (UTC+09:00)';
  }
  function getJstDateTimeParts(value = new Date()){
    const date = value instanceof Date ? value : new Date(value);
    const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: REPORT_TIME_ZONE,
      year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'
    }).formatToParts(safeDate);
    const values=Object.fromEntries(parts.filter(part=>part.type!=='literal').map(part=>[part.type,part.value]));
    return {year:values.year,month:values.month,day:values.day,hour:values.hour,minute:values.minute,second:values.second};
  }
  function formatJstCompactTimestamp(value = new Date()){
    const part=getJstDateTimeParts(value);
    return `${part.year}${part.month}${part.day}${part.hour}${part.minute}${part.second}`;
  }
  function formatJstIsoTimestamp(value = new Date()){
    const part=getJstDateTimeParts(value);
    return `${part.year}-${part.month}-${part.day}T${part.hour}:${part.minute}:${part.second}+09:00`;
  }

  function isOrderConstraintTimeBasis(value){
    const basis=String(value || '');
    return basis === 'reconstructed_order_time' || basis === 'physical_model_phase_time';
  }

  function isReconstructedTimeBasis(value){
    const basis=String(value || '');
    return basis.includes('reconstructed') || basis.includes('physical_model') || basis.includes('model_phase');
  }


  function isNoInstantTimeBasis(value){
    const basis=String(value || '');
    return basis === 'untimed_extreme_order' || basis === 'historical_table_calculation_no_instant' || basis === 'reconstructed_order_time';
  }

  function isReportClockRecord(record){
    if(!record || isNoInstantTimeBasis(record.time_basis)) return false;
    return Number.isFinite(Number(record.elapsed_time_s)) && Boolean(record.historical_time_hms || isReconstructedTimeBasis(record.time_basis));
  }

  function positionLabelJa(value, longForm=true){
    const map={positive:'正位置',negative:'負位置',midway:'中間位置'};
    return map[String(value||'')] || String(value || '位置不明');
  }
  function timeBasisLabelJa(value){
    if (String(value||'')==='physical_model_phase_time') return '時刻未記載・物理モデル位相';
    if (isOrderConstraintTimeBasis(value)) return '時刻未記載・順序拘束';
    if (String(value||'').includes('physical_model')) return '物理モデル';
    if (isReconstructedTimeBasis(value)) return '時刻補完';
    return '原表時刻';
  }

  function text(id, value){
    const el = document.getElementById(id);
    if (el) el.textContent = value == null ? '' : String(value);
  }

  function readReportPayload(){
    try {
      const raw = sessionStorage.getItem('cavendish_report_payload') || '';
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn('Report payload was not readable.', error);
      return null;
    }
  }

  function formatElapsed(value){
    const n = Number(value);
    return Number.isFinite(n) ? n.toFixed(1) : '';
  }

  function parseReadDiv(value){
    if (typeof value === 'number') return Number.isFinite(value) ? value : null;
    if (value == null) return null;
    const match = String(value).replace(/,/g, '').match(/[+-]?\d+(?:\.\d+)?/);
    if (!match) return null;
    const n = Number(match[0]);
    return Number.isFinite(n) ? n : null;
  }

  function formatReadDivNumber(value){
    const n = Number(value);
    if (!Number.isFinite(n)) return '-- div';
    return (n >= 0 ? '+' : '') + n.toFixed(3) + ' div';
  }

  function recordReadNumber(record){
    if (!record) return null;
    const fromValue = parseReadDiv(record.read_value);
    if (fromValue !== null) return fromValue;
    return parseReadDiv(record.read_div);
  }

  const REPORT_TELESCOPE_VERNIER_STEPS = 5;
  const REPORT_TELESCOPE_VERNIER_SPAN_MAIN_DIV = 4;
  const REPORT_TELESCOPE_WINDOW_DIV = 10;
  const REPORT_TELESCOPE_EXACT_FIFTH_TOLERANCE_DIV = 0.025;

  function decomposeReportTelescopeRead(value){
    const raw=Number(value);
    if(!Number.isFinite(raw)) return {defined:false};
    const read=Math.round(raw*1000)/1000;
    let main=Math.floor(read+1e-9);
    let fraction=read-main;
    if(fraction<0){main-=1;fraction=read-main;}
    if(Math.abs(fraction-1)<1e-9){main+=1;fraction=0;}
    const rawIndex=Math.round(fraction*REPORT_TELESCOPE_VERNIER_STEPS+1e-9);
    const nearNextInteger=rawIndex>=REPORT_TELESCOPE_VERNIER_STEPS;
    const nextIntegerExact=nearNextInteger&&Math.abs(fraction-1)<=REPORT_TELESCOPE_EXACT_FIFTH_TOLERANCE_DIV;
    if(nextIntegerExact){main+=1;fraction=0;}
    const index=nextIntegerExact?0:Math.max(0,Math.min(REPORT_TELESCOPE_VERNIER_STEPS-1,rawIndex));
    const exactFraction=index/REPORT_TELESCOPE_VERNIER_STEPS;
    const exact=nextIntegerExact||(!nearNextInteger&&Math.abs(fraction-exactFraction)<=REPORT_TELESCOPE_EXACT_FIFTH_TOLERANCE_DIV);
    return {
      defined:true,
      read_value:read,
      main_value:main,
      fraction_value:fraction,
      vernier_index:index,
      exact_fifth:exact,
      estimated_upper_wrap:nearNextInteger&&!nextIntegerExact,
      match_main_value:main+index
    };
  }

  function renderReportTelescope(records, waveform){
    const directRecords = records.filter(record=>String(record.value_class||'')==='historical_direct_value');
    const latest = directRecords.length ? directRecords[directRecords.length - 1] : (records.length ? records[records.length - 1] : null);
    const value = recordReadNumber(latest);
    const mainGroup = document.getElementById('reportTelescopeMainScale');
    const vernierGroup = document.getElementById('reportTelescopeVernierScale');
    const coincidenceGroup = document.getElementById('reportTelescopeCoincidence');
    const label = document.getElementById('reportTelescopeReadText');
    const pointerValue = document.getElementById('reportTelescopePointerValue');
    const note = document.getElementById('reportTelescopeNote');
    if (!mainGroup || !vernierGroup || !label) return;
    const parts=decomposeReportTelescopeRead(value);
    if (!parts.defined) {
      mainGroup.innerHTML='';
      vernierGroup.innerHTML='';
      if(coincidenceGroup){coincidenceGroup.innerHTML='';coincidenceGroup.hidden=true;}
      if(pointerValue) pointerValue.textContent='Read --';
      label.textContent = '読取値：-- div（最終史実読取）';
      if (note) note.textContent = '最終史実読取待ち / 固定主尺＋移動5分割副尺';
      return;
    }

    const scaleX=28;
    const scaleWidth=244;
    const windowStart=Math.floor(parts.read_value)-3;
    const windowEnd=windowStart+REPORT_TELESCOPE_WINDOW_DIV;
    const pitch=scaleWidth/REPORT_TELESCOPE_WINDOW_DIV;
    const xFor=value=>scaleX+(value-windowStart)*pitch;
    const mainPlateY=42;
    const mainPlateH=42;
    const boundaryY=85;
    const mainTickEndY=84;
    const vernierPlateY=86;
    const vernierPlateH=42;
    const zeroX=xFor(parts.read_value);
    const vernierWidth=pitch*REPORT_TELESCOPE_VERNIER_SPAN_MAIN_DIV;

    const mainItems=[`<rect class="report-main-plate" x="${scaleX}" y="${mainPlateY}" width="${scaleWidth}" height="${mainPlateH}" rx="4" fill="#dedede" stroke="#8d8d8d" stroke-width="1"/>`];
    for(let tickValue=windowStart;tickValue<=windowEnd;tickValue+=1){
      const x=xFor(tickValue);
      const major=tickValue%5===0;
      const matched=parts.exact_fifth&&tickValue===parts.match_main_value;
      mainItems.push(`<line class="report-main-tick${major?' report-major-tick':''}${matched?' report-match-tick':''}" x1="${x.toFixed(2)}" y1="${major?56:65}" x2="${x.toFixed(2)}" y2="${mainTickEndY}" stroke="${matched?'#c87416':'#555'}" stroke-width="${matched?2:(major?1.6:1)}"/>`);
      if(major) mainItems.push(`<text class="report-scale-number" x="${x.toFixed(2)}" y="53" text-anchor="middle" fill="#333" font-size="9.3" font-weight="700">${tickValue>0?'+':''}${tickValue}</text>`);
    }
    mainGroup.innerHTML=mainItems.join('');

    const vernierItems=[`<rect class="report-vernier-plate" x="${(zeroX-5).toFixed(2)}" y="${vernierPlateY}" width="${(vernierWidth+10).toFixed(2)}" height="${vernierPlateH}" rx="4" fill="#efefef" stroke="#8d8d8d" stroke-width="1"/>`];
    for(let index=0;index<=REPORT_TELESCOPE_VERNIER_STEPS;index+=1){
      const x=zeroX+(index/REPORT_TELESCOPE_VERNIER_STEPS)*vernierWidth;
      const edge=index===0||index===REPORT_TELESCOPE_VERNIER_STEPS;
      const matched=parts.exact_fifth&&index===parts.vernier_index;
      const classes=`report-vernier-tick${edge?' report-major-tick':''}${index===0?' report-vernier-zero':''}${matched?' report-match-tick':''}`;
      vernierItems.push(`<line class="${classes}" x1="${x.toFixed(2)}" y1="${vernierPlateY}" x2="${x.toFixed(2)}" y2="${edge?116:108}" stroke="${matched||index===0?'#c87416':'#555'}" stroke-width="${matched||index===0?2:(edge?1.6:1)}"/>`);
      vernierItems.push(`<text class="report-scale-number" x="${x.toFixed(2)}" y="140" text-anchor="middle" fill="#333" font-size="9.3" font-weight="700">${index}</text>`);
    }
    vernierGroup.innerHTML=vernierItems.join('');

    if(coincidenceGroup){
      if(parts.exact_fifth){
        const matchX=xFor(parts.match_main_value);
        coincidenceGroup.innerHTML=`<rect class="report-coincidence-dot" x="${(matchX-2.3).toFixed(2)}" y="${(boundaryY-2.3).toFixed(2)}" width="4.6" height="4.6" rx=".6" fill="#d88725" stroke="#9b5710" stroke-width=".5" transform="rotate(45 ${matchX.toFixed(2)} ${boundaryY})"/>`;
        coincidenceGroup.hidden=false;
      }else{
        coincidenceGroup.innerHTML='';
        coincidenceGroup.hidden=true;
      }
    }

    if(pointerValue) pointerValue.textContent='Read '+formatReadDivNumber(parts.read_value).replace(' div','');
    const position=latest ? positionLabelJa(latest.large_mass_position || latest.position || '最終') : '最終';
    label.textContent=`読取値：${formatReadDivNumber(parts.read_value)}（${position}・史実直接）`;
    if (note) {
      let vernier;
      if(parts.exact_fifth) vernier=`史実副尺 ${parts.vernier_index}/5`;
      else if(parts.estimated_upper_wrap) vernier='史実副尺 目測 4/5–次の0/5';
      else {
        const lower=Math.max(0,Math.floor(parts.fraction_value*5));
        const upper=Math.min(4,lower+1);
        vernier=`史実副尺 目測 ${lower}/5–${upper}/5`;
      }
      const clock=latest&&latest.historical_time_hms?`史実時刻 ${latest.historical_time_hms}`:'時計時刻なし';
      note.textContent=`${clock} / ${vernier} / 再構成値は波形側`;
    }
  }

  function renderReportWaveform(records, waveform, payload){
    const grid=document.getElementById('reportWaveGrid');
    const path=document.getElementById('reportWavePath');
    const reconstructionPath=document.getElementById('reportWaveReconstructionPath');
    const markers=document.getElementById('reportWaveMarkers');
    const empty=document.getElementById('reportWaveEmptyText');
    const note=document.getElementById('reportWaveNote');
    if(!grid||!path||!markers||!empty) return;
    const samples=waveform&&Array.isArray(waveform.samples)?waveform.samples.map(sample=>({
      time:Number(sample.elapsed_time_s), value:sample.wave_defined===false||sample.read_value===null?null:Number(sample.read_value), historical_time_hms:sample.historical_time_hms||'', line_kind:sample.line_kind||'', wave_defined:sample.wave_defined!==false
    })).filter(point=>Number.isFinite(point.time)):[];
    const readMarkers=records.filter(isReportClockRecord).map((record,index)=>({
      index,time:Number(record.elapsed_time_s),value:recordReadNumber(record),position:record.large_mass_position||record.position||'',
      label:record.read_div||'',historical_time_hms:record.historical_time_hms||'',time_basis:record.time_basis||''
    })).filter(point=>Number.isFinite(point.time)&&point.value!==null);
    const x0=48,x1=448,y0=20,y1=150;
    const maxTime=Math.max(72,Number(waveform&&waveform.observation_end_time_s)||72,...samples.map(p=>p.time),...readMarkers.map(p=>p.time));
    const allValues=[...samples.map(p=>p.value).filter(Number.isFinite),...readMarkers.map(p=>p.value)];
    let min=allValues.length?Math.min(...allValues):-1;
    let max=allValues.length?Math.max(...allValues):1;
    if(!(max>min)){min-=1;max+=1;}
    const pad=Math.max((max-min)*0.1,0.25); min-=pad; max+=pad;
    const yOf=value=>y1-((value-min)/(max-min))*(y1-y0);
    const xOf=t=>x0+(t/maxTime)*(x1-x0);
    const axisValues=[max,max-(max-min)*.25,(max+min)/2,min+(max-min)*.25,min];
    const timeValues=[0,maxTime/4,maxTime/2,maxTime*.75,maxTime];
    const fmt=value=>Math.abs(max-min)>=20?value.toFixed(1):(Math.abs(max-min)>=2?value.toFixed(2):value.toFixed(3));
    const timeLabel=value=>{
      if(!samples.length) return String(Math.round(value));
      const index=Math.max(0,Math.min(samples.length-1,Math.round((value/maxTime)*(samples.length-1))));
      const label=samples[index].historical_time_hms||Math.round(value);
      return String(label).slice(0,8);
    };
    const lines=[];
    axisValues.forEach(value=>{const y=yOf(value);lines.push(`<line class="svg-grid" x1="${x0}" y1="${y.toFixed(1)}" x2="${x1}" y2="${y.toFixed(1)}"/>`);lines.push(`<text class="svg-label" x="5" y="${(y+3).toFixed(1)}">${fmt(value)}</text>`);});
    timeValues.forEach(value=>{const x=xOf(value);lines.push(`<line class="svg-grid" x1="${x.toFixed(1)}" y1="${y0}" x2="${x.toFixed(1)}" y2="${y1}"/>`);lines.push(`<text class="svg-label" x="${(x-10).toFixed(1)}" y="162">${timeLabel(value)}</text>`);});
    grid.innerHTML=lines.join('');
    const definedSamples=samples.filter(point=>Number.isFinite(point.value)&&point.wave_defined!==false);
    if(!definedSamples.length){
      path.setAttribute('d','');
      if(reconstructionPath) reconstructionPath.setAttribute('d','');
      empty.textContent='史実再生波形なし';empty.style.display='block';
    }
    else{
      empty.style.display='none';
      const observedCommands=[];
      const reconstructionCommands=[];
      let observedStarted=false;
      let reconstructionStarted=false;
      samples.forEach(point=>{
        if(!Number.isFinite(point.value)||point.wave_defined===false){observedStarted=false;reconstructionStarted=false;return;}
        const observed=String(point.line_kind||'')==='historical_solid'||String(point.line_kind||'')==='historical_direct_point_guide';
        const commands=observed?observedCommands:reconstructionCommands;
        const started=observed?observedStarted:reconstructionStarted;
        commands.push(`${started?'L':'M'}${xOf(point.time).toFixed(1)} ${yOf(point.value).toFixed(1)}`);
        if(observed){observedStarted=true;reconstructionStarted=false;}
        else{reconstructionStarted=true;observedStarted=false;}
      });
      path.setAttribute('d',observedCommands.join(' '));
      if(reconstructionPath) reconstructionPath.setAttribute('d',reconstructionCommands.join(' '));
    }
    markers.innerHTML=readMarkers.map(point=>{
      const reconstructed=isReconstructedTimeBasis(point.time_basis);
      const cls=reconstructed?'svg-mark-b':'svg-mark-a';
      const x=xOf(point.time),y=yOf(point.value);
      const title=`${point.position} ${point.historical_time_hms||''} ${point.label}${reconstructed?` ${timeBasisLabelJa(point.time_basis)}`:''}`;
      return `<circle class="${cls}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4"><title>${title}</title></circle>`;
    }).join('');
    if(note){
      const pattern=payload&&payload.dataset?String(payload.dataset.display_pattern_id||''):'';
      const hasModelPhase=readMarkers.some(point=>String(point.time_basis||'')==='physical_model_phase_time');
      const hasReconstructed=readMarkers.some(point=>isReconstructedTimeBasis(point.time_basis));
      const hasGap=samples.some(point=>!Number.isFinite(point.value)||point.wave_defined===false);
      note.textContent=pattern==='P1'
        ? `赤：直接時計値 / 実線：直接観測点間 / 破線：条件付き物理補完${hasGap?' / 空白：未観測':''}`
        : (pattern==='P2'
          ? `赤：原表の直接時計値 / 実線：同一配置区間の観測点間ガイド${hasGap?' / 空白：欠測・遷移':''}`
          : (hasModelPhase
            ? `赤：直接時計 / 青：計算上の振動位置 / 破線：条件付き補完${hasGap?' / 空白：未観測':''}`
            : (hasReconstructed
              ? `赤：目盛通過時刻 / 青：再構成極値 / 破線：区分補完${hasGap?' / 空白：欠測・遷移':''}`
              : `赤：原表時計値 / 実線：観測点間ガイド${hasGap?' / 空白：欠測・遷移':''}`)));
    }
  }

  function setReportLargeMassVisual(groupIds, active){
    groupIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.setAttribute('class', active ? 'report-large' : 'report-large-muted');
    });
  }

  function renderReportWeightMotion(payload){
    const note=document.getElementById('reportWeightMotionNote');
    const stage=document.getElementById('reportWeightMotionStage');
    const explain=document.getElementById('reportWeightMotionExplain');
    const svg=document.getElementById('reportWeightMotionSvg');
    const arrangement=payload&&payload.mass_arrangement?payload.mass_arrangement:{};
    const sections=Array.isArray(arrangement.sections)?arrangement.sections:[];
    const summaryPositions=payload&&payload.summary&&Array.isArray(payload.summary.positions)?payload.summary.positions:[];
    const sequence=arrangement.sequence_label||sections.map(item=>item.label).join(' → ')||summaryPositions.map(item=>item.label).join(' / ')||'位置記録なし';
    const transitions=Array.isArray(arrangement.transitions)?arrangement.transitions:[];
    const untimedInitial=Boolean(arrangement.untimed_initial_record_order_only);
    if(note) note.textContent='Top view / '+sequence;
    if(explain) explain.textContent=untimedInitial
      ? '原表の配置順を表示します。初期配置は時計時刻なしで、Motion Viewの想定補間時間は含めません。'
      : '原表の大球位置順序を、途中位置を省略せず表示します。';
    if(stage) stage.textContent=untimedInitial
      ? `配置変更 ${transitions.length}件 / 初期時刻なし`
      : (transitions.length?`配置変更 ${transitions.length}件`:'配置変更記録なし');
    if(!svg) return;
    const sequenceItems=sections.length?sections:summaryPositions.map(item=>({position:item.position,label:item.label,historical_time_hms:'',record_order_only:false}));
    const count=Math.max(1,sequenceItems.length);
    const xAt=index=>count===1?160:24+(272*index/(count-1));
    const nodes=sequenceItems.map((item,index)=>{
      const x=xAt(index);
      const label=positionLabelJa(item.position,false);
      const time=item.record_order_only?'時刻なし':String(item.historical_time_hms||'').slice(0,5);
      const dash=item.record_order_only?' stroke-dasharray="2 2"':'';
      return `<circle cx="${x.toFixed(1)}" cy="139" r="7" fill="#fff" stroke="#333" stroke-width="1.2"${dash}/><text class="report-caption-strong" x="${x.toFixed(1)}" y="159" text-anchor="middle">${label}</text>${time?`<text class="report-note-mini" x="${x.toFixed(1)}" y="173" text-anchor="middle">${time}</text>`:''}`;
    }).join('');
    const arrows=sequenceItems.slice(0,-1).map((item,index)=>{
      const x1=xAt(index)+9,x2=xAt(index+1)-9;
      const dash=item.record_order_only?' stroke-dasharray="4 3"':'';
      return `<line x1="${x1.toFixed(1)}" y1="139" x2="${x2.toFixed(1)}" y2="139" stroke="#777" stroke-width="1.1"${dash} marker-end="url(#reportArrowHead)"/>`;
    }).join('');
    svg.innerHTML=`<defs><marker id="reportArrowHead" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8 Z" fill="#555"/></marker></defs>
      <rect x="0" y="0" width="320" height="180" fill="#fff"/>
      <text class="report-caption-strong" x="12" y="18">トーションバランス上面</text>
      <circle class="report-large-muted" cx="58" cy="53" r="17"/><circle class="report-large-muted" cx="262" cy="87" r="17"/>
      <line class="report-arm-shadow" x1="91" y1="91" x2="229" y2="49"/><line class="report-arm" x1="91" y1="91" x2="229" y2="49"/>
      <circle class="report-small" cx="94" cy="90" r="8"/><circle class="report-small" cx="226" cy="50" r="8"/><circle class="report-pivot" cx="160" cy="70" r="7"/>
      <text class="report-note-mini" x="160" y="112" text-anchor="middle">位置順序（原表記録）</text>
      ${arrows}${nodes}`;
  }

  function renderReportVisuals(records, waveform, payload){
    renderReportWeightMotion(payload);
    renderReportTelescope(records, waveform);
    renderReportWaveform(records, waveform, payload);
  }

  function renderReportPayload(payload){
    if(!payload||!payload.dataset) return;
    const dataset=payload.dataset||{};
    const summary=payload.summary||{};
    const records=Array.isArray(payload.records)?payload.records:[];
    text('reportVersion','Report Ver0.79');
    text('reportBuild','Build '+(payload.app_version||'CV081A05'));
    text('reportGenerated','Generated: '+(payload.generated_label||formatJstTimestamp()));
    text('reportRecordId','Record ID: '+(payload.record_id||''));
    text('reportResultMain',summary.resultMain||(records.length?'史実読取を記録':'史実記録なし'));
    text('reportResultReason',summary.resultReason||payload.report_judgement_reason||'Experiment別史実再生結果を表示します。');
    text('reportMainValues',summary.mainValues||'位置別平均 -- div / 移動量 -- div');
    text('reportNoticeText',payload.report_notice||'史実値と時刻区分を区別して記録します。');
    text('reportDatasetLabel',dataset.label||''); text('reportDatasetId',dataset.id||'');
    text('reportObservationMethod',payload.observation_method||'Experiment Historical Replay');
    text('reportReadingTest',payload.reading_test||'Auto Motion'); text('reportDatasetDate',dataset.date_label||'');
    text('reportObservationState',payload.observation_state_label||''); text('reportCsvMeta',dataset.csv_meta||'値・時刻・出典を記録');
    text('reportRowDataStatus',dataset.row_data_status||'史実原表数値');
    const body=document.getElementById('reportReadingRecordBody');
    const kindLabels={division_reading:'読取',division_crossing:'通過',extreme_point:'極値',point_of_rest:'静止点'};
    const reportRecordLimit=9;
    const displayRecords=records.length<=reportRecordLimit?records:Array.from({length:reportRecordLimit},(_,index)=>{
      const sourceIndex=Math.round(index*(records.length-1)/(reportRecordLimit-1));
      return records[sourceIndex];
    }).filter((record,index,array)=>array.indexOf(record)===index);
    text('reportReadingRecordTitle',records.length>displayRecords.length?`読取記録（代表${displayRecords.length}/${records.length}件・全件CSV）`:'読取記録');
    if(body) body.innerHTML=displayRecords.length?displayRecords.map((record,index)=>{
      const reconstructed=isReconstructedTimeBasis(record.time_basis);
      const clock=isOrderConstraintTimeBasis(record.time_basis)?'時刻未記載':((record.historical_time_hms||'—')+(reconstructed?' *':''));
      const pos=({positive:'正位置',negative:'負位置',midway:'中間位置'}[record.large_mass_position]||record.large_mass_position||'');
      return `<tr><td>${record.no||records.indexOf(record)+1}</td><td>${clock}</td><td>${pos}</td><td>${kindLabels[record.value_kind]||record.value_kind||'値'}</td><td>${record.read_div||''}</td></tr>`;
    }).join(''):'<tr><td colspan="5">史実読取記録なし</td></tr>';
    const summaryGrid=document.getElementById('reportSummaryGrid');
    const positions=Array.isArray(summary.positions)?summary.positions:[];
    const transitions=Array.isArray(summary.transitions)?summary.transitions:[];
    if(summaryGrid){
      const columnCount=Math.max(1,Math.min(3,positions.length||2));
      summaryGrid.style.setProperty('--summary-cols',String(columnCount));
      const positionCells=(positions.length?positions:[
        {label:summary.labelA||'位置1',count:summary.countA||0,average:parseReadDiv(summary.avgA)},
        {label:summary.labelB||'位置2',count:summary.countB||0,average:parseReadDiv(summary.avgB)}
      ]).map(item=>`<div class="summary-position"><b>${item.label||positionLabelJa(item.position)}</b><span>読取 ${Number(item.count)||0}件 / 平均 ${formatReadDivNumber(item.average)}</span></div>`).join('');
      const transitionText=transitions.length?transitions.map(item=>`${item.label||'位置差'} ${item.difference_text||formatReadDivNumber(item.difference)}`).join(' / '):(summary.gravityDiff||summary.diffAB||'-- div');
      summaryGrid.innerHTML=`${positionCells}<div class="summary-transitions"><b>配置変更による読取差</b><span>${transitionText}</span></div><div class="summary-interpretation"><b>解釈</b><span id="reportInterpretationText"></span></div>`;
    }
    text('reportInterpretationText',payload.report_interpretation||summary.interpretation||'史実読取値を位置別に集計します。');
    text('reportHistoricalRowStatus',dataset.row_data_label||'史実原表数値');
    text('reportHistoricalConnection',dataset.connection||'観測表示へ接続済み');
    text('reportHistoricalCheck',dataset.row_check||'原表確認済み');
    text('reportHistoricalCsvNote','Experiment ID・値区分・時刻区分・出典ページ・原表行IDをUTF-8 CSVへ記録します。');
    renderReportVisuals(records,payload.waveform||null,payload);
    text('reportObservationMemo',payload.report_meaning||payload.report_note||'Experiment別史実再生を記録します。');
    text('reportHistoricalMemo',payload.report_judgement_reason||dataset.note||'史実値と時刻区分を区別します。');
    text('reportNextCheck',payload.report_next_check||'角度・力・G換算は別工程で接続します。');
    text('reportBottomNotice',payload.report_notice||'Experiment別の史実Read値、大球位置、時刻区分を記録します。');
    text('reportFooter',`IMPULSE LABO / Cavendish Experiment / report_ver0.79_build_${String(payload.app_version||'CV081A05').toLowerCase()} / no personal device information is collected.`);
  }

  function closeMenu(){
    if (!csvMenu || !csvBtn) return;
    csvMenu.classList.remove('is-open');
    csvBtn.setAttribute('aria-expanded','false');
  }

  function readCachedCsvPackage(kind){
    try {
      const payload = JSON.parse(sessionStorage.getItem('cavendish_report_csv_payload') || '{}');
      const meta=payload&&payload[`${kind}_meta`]?payload[`${kind}_meta`]:{};
      return {
        csv:payload&&payload[kind]?payload[kind]:'',
        filename:meta.filename||'',
        record_id:meta.record_id||'',
        generated_label:meta.generated_label||payload.generated_label||'',
        generated_at:meta.generated_at||payload.generated_at||''
      };
    } catch (error) {
      return {csv:'',filename:'',record_id:'',generated_label:'',generated_at:''};
    }
  }

  function csvEscape(value){
    return '"' + String(value == null ? '' : value).replace(/"/g, '""') + '"';
  }

  function fallbackCsvContext(kind){
    const dataset=reportPayload&&reportPayload.dataset?reportPayload.dataset:{};
    const sourceDate=reportPayload&&reportPayload.generated_at?new Date(reportPayload.generated_at):new Date();
    const safeDate=Number.isNaN(sourceDate.getTime())?new Date():sourceDate;
    const datasetToken=String(dataset.id||'CAV').toUpperCase().replace(/[^A-Z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'CAV';
    const kindToken=kind==='analysis'?'RECON':'HIST';
    const stamp=formatJstCompactTimestamp(safeDate);
    return {
      generated_label:formatJstTimestamp(safeDate),
      generated_at:formatJstIsoTimestamp(safeDate),
      record_id:`CAV-CSV-${kindToken}-${datasetToken}-${stamp}`,
      filename:`${datasetToken}-${kindToken}-CV081A05-${stamp}.csv`
    };
  }

  function buildFallbackCsv(kind){
    const rows=[];
    const dataset=reportPayload&&reportPayload.dataset?reportPayload.dataset:{};
    const records=reportPayload&&Array.isArray(reportPayload.records)?reportPayload.records:[];
    const context=fallbackCsvContext(kind);
    rows.push(['__meta_key','__meta_value']);
    rows.push(['app_version',reportPayload&&reportPayload.app_version?reportPayload.app_version:'CV081A05']);
    rows.push(['csv_schema_version','1.0.0']);
    rows.push(['csv_record_id',context.record_id]);
    rows.push(['generated_at_jst',context.generated_label]);
    rows.push(['generated_at_iso8601',context.generated_at]);
    rows.push(['generated_time_zone','Asia/Tokyo (UTC+09:00)']);
    rows.push(['csv_filename',context.filename]);
    rows.push(['csv_encoding','UTF-8']);
    rows.push(['csv_bom','present']);
    rows.push(['csv_line_ending','CRLF']);
    rows.push(['csv_cell_quoting','all_cells_double_quoted']);
    rows.push(['csv_kind',kind==='analysis'?'historical_replay_support_records':'historical_reading_records']);
    rows.push(['fallback_source','report_preview_payload_records']);
    rows.push(['historical_dataset_label',dataset.label||'']); rows.push(['historical_dataset_id',dataset.id||'']);
    rows.push(['__data_section','']);
    if(kind==='analysis'){
      rows.push(['record_id','source_record_id','historical_time_hms','replay_elapsed_s','large_mass_position','value_kind','value_class','source_read_div','source_page','source_row_id','source_class','time_basis','reconstruction_note']);
      records.forEach((record,index)=>rows.push([`${context.record_id}-H-${String(index+1).padStart(3,'0')}`,record.record_id||'',record.historical_time_hms||'',record.elapsed_time_s||'',record.large_mass_position||'',record.value_kind||'',record.value_class||'',record.read_div||'',record.source_page||'',record.source_row_id||'',record.source_class||'',record.time_basis||'',String(record.time_basis||'')==='physical_model_phase_time'?'時刻未記載・物理モデル位相':(isOrderConstraintTimeBasis(record.time_basis)?'時刻未記載・順序拘束':(isReconstructedTimeBasis(record.time_basis)?'時刻補完':'原表時刻'))]));
    }else{
      rows.push(['record_id','timestamp','elapsed_time_s','historical_time_hms','historical_time_original','large_mass_position','value_kind','value_class','read_div','reading_set_id','source_page','source_row_id','source_class','time_basis','observation_note']);
      records.forEach(record=>rows.push([record.record_id||'',record.timestamp||'',record.elapsed_time_s||'',record.historical_time_hms||'',record.historical_time_original||'',record.large_mass_position||'',record.value_kind||'',record.value_class||'',record.read_div||'',record.reading_set_id||'',record.source_page||'',record.source_row_id||'',record.source_class||'',record.time_basis||'',record.observation_note||'']));
    }
    return {csv:'\ufeff'+rows.map(row=>row.map(csvEscape).join(',')).join('\r\n')+'\r\n',...context};
  }

  function csvInfo(kind){
    const isAnalysis=kind==='analysis';
    return {
      title:isAnalysis?'再構成詳細CSVプレビュー':'史実読取記録CSVプレビュー',
      note:isAnalysis?'史実値、時刻未記載極値、時刻再構成、条件付き再構成値を区分します。UTF-8 BOM・CRLF・全セル引用で保存します。角度・力・Gは含みません。':'Experiment別の史実読取値、原表時刻、時刻未記載・時刻補完区分、出典を記録します。UTF-8 BOM・CRLF・全セル引用で保存します。'
    };
  }

  function showCsvPreview(kind, csvPackage){
    const info = csvInfo(kind);
    const pack=csvPackage&&typeof csvPackage==='object'?csvPackage:{csv:String(csvPackage||'')};
    currentCsvText = pack.csv || '';
    currentCsvFilename = pack.filename || 'cavendish.csv';
    currentCsvRecordId = pack.record_id || '';
    currentCsvGeneratedLabel = pack.generated_label || formatJstTimestamp();
    if (csvTitle) csvTitle.textContent = 'IMPULSE LABO ｜ ' + info.title;
    if (csvMeta) csvMeta.innerHTML = 'CSV Preview Ver0.79 / Build ' + (reportPayload&&reportPayload.app_version?reportPayload.app_version:'CV081A05') + '<br>' + currentCsvGeneratedLabel + (currentCsvRecordId?'<br>'+currentCsvRecordId:'');
    if (csvNote) csvNote.textContent = info.note;
    if (csvPre) csvPre.textContent = String(currentCsvText).replace(/^﻿/, '');
    document.body.classList.add('csv-preview-mode');
    window.scrollTo({top:0, behavior:'auto'});
  }

  function saveCurrentCsv(){
    if (!currentCsvText) return;
    const blob = new Blob([currentCsvText], {type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentCsvFilename || 'cavendish.csv';
    a.style.display='none';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(()=>URL.revokeObjectURL(url),1000);
  }


  function setReportActionStatus(message, isError=false){
    if (!actionStatus) return;
    actionStatus.textContent = message || '';
    actionStatus.style.color = isError ? '#8b1e1e' : '#444';
  }

  function setPdfButtonMode(mode){
    pdfExportBusy = mode === 'saving';
    if (pdfBtn) {
      if (mode === 'preparing') {
        pdfBtn.disabled = true;
        pdfBtn.textContent = 'PDF準備中…';
      } else if (mode === 'saving') {
        pdfBtn.disabled = true;
        pdfBtn.textContent = '保存中…';
      } else {
        pdfBtn.disabled = false;
        pdfBtn.textContent = 'PDF保存';
      }
    }
    if (printBtn) printBtn.disabled = mode === 'saving';
  }

  function clearPdfStatusLater(delay=4200){
    if (pdfPrepareTimer) window.clearTimeout(pdfPrepareTimer);
    pdfPrepareTimer = window.setTimeout(() => {
      if (!pdfExportBusy && actionStatus) setReportActionStatus('');
    }, delay);
  }

  function safePdfFilename(){
    const rawRecord = reportPayload && reportPayload.record_id ? String(reportPayload.record_id) : 'CAV-REPORT';
    const safeRecord = rawRecord.replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'CAV-REPORT';
    return safeRecord + '_CV081A05.pdf';
  }

  function createPdfCaptureClone(){
    const source = document.querySelector('.report-paper');
    if (!source) throw new Error('Report paper was not found.');
    const host = document.createElement('div');
    host.className = 'pdf-capture-host';
    host.setAttribute('aria-hidden', 'true');
    const clone = source.cloneNode(true);
    clone.classList.add('pdf-capture-paper');
    host.appendChild(clone);
    document.body.appendChild(host);
    return {host, clone};
  }

  async function buildCleanPdfPackage(){
    if (typeof window.html2canvas !== 'function' || !window.jspdf || typeof window.jspdf.jsPDF !== 'function') {
      throw new Error('PDF generation libraries are unavailable.');
    }
    let capture = null;
    try {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      capture = createPdfCaptureClone();
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const canvas = await window.html2canvas(capture.clone, {
        backgroundColor: '#ffffff',
        scale: 2.5,
        useCORS: true,
        allowTaint: false,
        logging: false,
        width: capture.clone.scrollWidth,
        height: capture.clone.scrollHeight,
        windowWidth: Math.ceil(210 / 25.4 * 96),
        windowHeight: Math.ceil(297 / 25.4 * 96),
        scrollX: 0,
        scrollY: 0
      });
      const Pdf = window.jspdf.jsPDF;
      const pdf = new Pdf({orientation:'portrait', unit:'mm', format:'a4', compress:true, putOnlyUsedFonts:true});
      const jpeg = canvas.toDataURL('image/jpeg', 0.96);
      pdf.addImage(jpeg, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      pdf.setProperties({
        title: 'IMPULSE LABO - Cavendish Experiment Report',
        subject: 'Cavendish Experiment Report Ver0.79 / Build CV081A05',
        author: 'IMPULSE LABO',
        creator: 'IMPULSE LABO CV081A05'
      });
      const blob = pdf.output('blob');
      const filename = safePdfFilename();
      const file = typeof File === 'function'
        ? new File([blob], filename, {type:'application/pdf', lastModified:Date.now()})
        : null;
      return {blob, file, filename};
    } finally {
      if (capture && capture.host) capture.host.remove();
    }
  }

  function prepareCleanPdf(options={}){
    if (preparedPdfPackage) return Promise.resolve(preparedPdfPackage);
    if (pdfPreparePromise) return pdfPreparePromise;
    const announce = options.announce !== false;
    setPdfButtonMode('preparing');
    if (announce) setReportActionStatus('A4 PDFを準備しています…');
    pdfPreparePromise = buildCleanPdfPackage()
      .then(pdfPackage => {
        preparedPdfPackage = pdfPackage;
        setPdfButtonMode('ready');
        setReportActionStatus('PDF保存の準備ができました。');
        clearPdfStatusLater();
        return pdfPackage;
      })
      .catch(error => {
        console.error('Clean PDF preparation failed.', error);
        preparedPdfPackage = null;
        setPdfButtonMode('ready');
        setReportActionStatus('PDF準備に失敗しました。PDF保存を押して再試行してください。', true);
        throw error;
      })
      .finally(() => {
        pdfPreparePromise = null;
      });
    return pdfPreparePromise;
  }


  function saveCleanPdf(){
    if (pdfExportBusy) return;
    if (!preparedPdfPackage) {
      setReportActionStatus('PDFを準備しています。準備完了後にもう一度押してください。');
      prepareCleanPdf().catch(() => {});
      return;
    }

    setPdfButtonMode('saving');
    let downloadUrl = '';
    let anchor = null;
    try {
      const downloadBlob = new Blob([preparedPdfPackage.blob], {type:'application/octet-stream'});
      downloadUrl = URL.createObjectURL(downloadBlob);
      anchor = document.createElement('a');
      if (!('download' in anchor)) throw new Error('Direct file download is unavailable.');
      anchor.href = downloadUrl;
      anchor.download = preparedPdfPackage.filename;
      anchor.setAttribute('download', preparedPdfPackage.filename);
      anchor.rel = 'noopener';
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();
      setReportActionStatus('PDFのダウンロードを開始しました。Safariのダウンロード一覧を確認してください。');
      clearPdfStatusLater(5200);
    } catch (error) {
      console.error('Direct PDF download failed.', error);
      setReportActionStatus('PDF保存を開始できませんでした。Safariの設定を確認して再試行してください。', true);
    } finally {
      if (anchor) anchor.remove();
      if (downloadUrl) window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 60000);
      setPdfButtonMode('ready');
    }
  }

  function schedulePdfPreparation(){
    setPdfButtonMode('preparing');
    setReportActionStatus('A4 PDFを準備しています…');
    const run = () => prepareCleanPdf({announce:false}).catch(() => {});
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(run, {timeout:900});
    } else {
      window.setTimeout(run, 0);
    }
  }

  function showReport(){
    document.body.classList.remove('csv-preview-mode');
    closeMenu();
    window.scrollTo({top:0, behavior:'auto'});
  }

  function closePreview(){
    if (history.length > 1) {
      history.back();
      return;
    }
    window.location.href = 'cavendish-simulator.html';
  }

  reportPayload = readReportPayload();
  renderReportPayload(reportPayload);
  schedulePdfPreparation();

  if (csvBtn && csvMenu) {
    csvBtn.addEventListener('click', function(event){
      event.stopPropagation();
      if (document.body.classList.contains('csv-preview-mode')) {
        showReport();
        return;
      }
      const open = csvMenu.classList.toggle('is-open');
      csvBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    csvMenu.addEventListener('click', function(event){
      const target = event.target.closest('button[data-csv-kind]');
      if (!target) return;
      event.stopPropagation();
      const kind = target.getAttribute('data-csv-kind');
      closeMenu();
      let csvPackage = readCachedCsvPackage(kind);
      if (!csvPackage.csv) csvPackage = buildFallbackCsv(kind);
      showCsvPreview(kind, csvPackage);
    });
  }

  document.addEventListener('click', closeMenu);
  window.addEventListener('pagehide', closeMenu);

  if (toolbar) {
    toolbar.addEventListener('click', function(event){
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const action = target.getAttribute('data-report-action');
      if (!action) return;
      if (action === 'pdf-save') saveCleanPdf();
      if (action === 'print') window.print();
      if (action === 'csv-save') saveCurrentCsv();
      if (action === 'csv-back') showReport();
      if (action === 'close') closePreview();
    });
  }

  window.__CV081A05_PDF__ = { prepareCleanPdf, saveCleanPdf, safePdfFilename, getPreparedPdf:()=>preparedPdfPackage };
})();
