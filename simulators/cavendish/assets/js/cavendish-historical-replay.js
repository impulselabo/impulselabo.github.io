/* CV079B12: Experiment I segment 2/3 physical-condition revalidation.
   B09 display hierarchy and all historical source values are preserved. The reconstruction
   now uses the four printed middle-vibration times as phase markers, the printed adjacent
   differences as segment durations, untimed extrema as amplitude constraints only, and
   direct clock/division pairs as non-statistical closure checks. */
(function(){
  'use strict';

  const DATA = window.CAVENDISH_HISTORICAL_DATA_V1 || { experiments: [] };
  const DATA_LAYERS = window.CAVENDISH_DATA_LAYERS || { byKey:{}, findSourceRecordId:()=>'', findHistoricalCalculationRecordId:()=>'' };
  const EXPERIMENT_I_SEMANTICS = window.CAVENDISH_EXPERIMENT_I_SEMANTICS || null;
  const EXPERIMENT_I_PHYSICAL_MODEL = window.CAVENDISH_EXPERIMENT_I_PHYSICAL_MODEL || null;
  const DIRECT_CLOCK_SEMANTICS = window.CAVENDISH_DIRECT_CLOCK_SEMANTICS || {build:'missing',sets:{}};
  const CROSSING_TIME_SEMANTICS = window.CAVENDISH_CROSSING_TIME_SEMANTICS || {build:'missing',sets:{}};
  const EXPERIMENT_VI_SEMANTICS = window.CAVENDISH_EXPERIMENT_VI_SEMANTICS || (DIRECT_CLOCK_SEMANTICS.sets&&DIRECT_CLOCK_SEMANTICS.sets['CAV-1798-EXP-VI']) || null;
  const OBSERVATION_SET_REGISTRY = window.CAVENDISH_OBSERVATION_SET_REGISTRY || {sets:[]};
  const OBSERVATION_STRUCTURE = window.CAVENDISH_OBSERVATION_STRUCTURE || {build:'missing',sets:{}};
  const REGISTRATION_BY_KEY = Object.freeze((OBSERVATION_SET_REGISTRY.sets||[]).reduce((acc,item)=>{acc[item.data_key]=item;return acc;},{}));
  const PLAYBACK_DURATION_S = 72;

  function registrationFor(experiment){
    return REGISTRATION_BY_KEY[String(experiment&&experiment.data_key||'')] || Object.freeze({
      registration_status:'temporary_registered',
      registration_status_ja:'仮登録・構造確認中',
      formal_replay:false,
      display_pattern_id:'unclassified',
      display_pattern_name_ja:'未分類',
      marker_policy:'suppress_until_clock_axis_fixed',
      ui_note_ja:'仮登録：表示構造の確認用。時計軸・配置変更時刻・波形接続は未確定。'
    });
  }

  function num(value){
    if (value === null || value === undefined || value === '') return null;
    const text = String(value).trim().replace(/,/g,'.').replace(/[^0-9+\-.]/g,'');
    if (!text || text === '+' || text === '-' || text === '.') return null;
    const parsed = Number(text);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function hms(value){
    if (!value) return null;
    const parts = String(value).trim().split(':').map(Number);
    if (parts.some(v => !Number.isFinite(v))) return null;
    if (parts.length === 2) return parts[0] * 3600 + parts[1] * 60;
    if (parts.length >= 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return null;
  }

  function duration(value){
    if (!value) return null;
    const text = String(value).trim();
    let m = text.match(/(\d+)\s*[′']\s*(\d+)\s*[″"]/);
    if (m) return Number(m[1]) * 60 + Number(m[2]);
    m = text.match(/^(\d+)\s*[:：]\s*(\d+)$/);
    if (m) return Number(m[1]) * 60 + Number(m[2]);
    return null;
  }

  function eventClock(value){
    if (!value) return null;
    const text = String(value);
    const m = text.match(/At\s+(\d+)\s*h\s*(\d+)\s*[′']/i);
    if (!m) return null;
    return Number(m[1]) * 3600 + Number(m[2]) * 60;
  }

  function median(values){
    const sorted = values.filter(Number.isFinite).slice().sort((a,b)=>a-b);
    if (!sorted.length) return null;
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid-1] + sorted[mid]) / 2;
  }

  function mean(values){
    const clean = values.filter(Number.isFinite);
    return clean.length ? clean.reduce((a,b)=>a+b,0) / clean.length : null;
  }

  function formatHms(totalSeconds){
    if (!Number.isFinite(totalSeconds)) return '—';
    let s = Math.round(totalSeconds) % 86400;
    if (s < 0) s += 86400;
    const hh = Math.floor(s / 3600);
    const mm = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return [hh,mm,ss].map(v=>String(v).padStart(2,'0')).join(':');
  }

  function positionLabel(position){
    const labels = {
      midway: 'Midway position',
      positive: 'Positive position',
      negative: 'Negative position'
    };
    return labels[position] || String(position || 'Unknown position');
  }

  function positionShort(position){
    const labels = { midway:'Midway', positive:'Positive', negative:'Negative' };
    return labels[position] || String(position || 'Unknown');
  }

  function compactClockLabel(value){
    const text=String(value||'').trim();
    if(!text) return '—';
    return text.replace(/:00$/,'');
  }

  function compactClockRange(start,end){
    return `${compactClockLabel(start)}–${compactClockLabel(end)}`;
  }

  function timelineStage(time,label,reason,sourceClass,clockLabel,kind,basisLabel){
    return {
      time:Number(time)||0,
      label:String(label||'観測'),
      reason:String(reason||''),
      source_class:String(sourceClass||'historical_replay'),
      clock_label:String(clockLabel||'—'),
      timeline_kind:String(kind||'observation'),
      basis_label:String(basisLabel||'')
    };
  }

  function normalizeClock(raw, reference){
    if (!Number.isFinite(raw)) return null;
    if (!Number.isFinite(reference)) return raw;
    // Cavendish's tables use a 12-hour clock without AM/PM marks. Select the
    // nearest non-decreasing 12-hour occurrence, allowing small within-row offsets.
    let candidate = raw;
    while (candidate < reference - 1800) candidate += 43200;
    while (candidate - 43200 >= reference - 1800) candidate -= 43200;
    return candidate;
  }

  function layerFor(experiment){
    return (experiment && DATA_LAYERS.byKey && DATA_LAYERS.byKey[experiment.data_key]) || {
      source_records:Object.freeze([]),
      historical_calculation_records:Object.freeze([])
    };
  }

  function attachAnchorProvenance(experiment, anchors){
    const reconstructionRecords=[];
    anchors.forEach((anchor,index)=>{
      const ordinal=Number(anchor.source_ordinal)||0;
      const isHistoricalCalculation=anchor.value_kind==='point_of_rest';
      const sourceRecordId=isHistoricalCalculation ? '' : DATA_LAYERS.findSourceRecordId(experiment.data_key,anchor.row_id,anchor.value_kind,ordinal);
      const calculationRecordId=isHistoricalCalculation ? DATA_LAYERS.findHistoricalCalculationRecordId(experiment.data_key,anchor.row_id,anchor.value_kind,ordinal) : '';
      anchor.source_record_id=sourceRecordId || '';
      anchor.historical_calculation_record_id=calculationRecordId || '';
      anchor.provenance_layer=isHistoricalCalculation ? 'historical_printed_calculation' : 'historical_source';
      const reconstructionId=`${experiment.data_key}-RECON-ANCHOR-${String(index+1).padStart(4,'0')}`;
      anchor.reconstruction_record_id=reconstructionId;
      reconstructionRecords.push(Object.freeze({
        record_id:reconstructionId,
        record_layer:'reconstruction',
        reconstruction_kind:'anchor_placement',
        source_record_id:sourceRecordId || '',
        historical_calculation_record_id:calculationRecordId || '',
        value_kind:anchor.value_kind,
        placement_basis:anchor.time_basis,
        model_abs_time_s:Number.isFinite(Number(anchor.abs_time_s))?Number(anchor.abs_time_s):null,
        model_time_hms:Number.isFinite(Number(anchor.abs_time_s))?formatHms(anchor.abs_time_s):'',
        playback_time_s:Number.isFinite(Number(anchor.playback_time_s))?Number(anchor.playback_time_s):null,
        record_trigger_s:Number.isFinite(Number(anchor.record_trigger_s))?Number(anchor.record_trigger_s):null,
        phase_order:Number.isFinite(Number(anchor.phase_order))?Number(anchor.phase_order):null,
        historical_time_claim:false,
        provisional:true,
        note:String(anchor.observation_note || '')
      }));
    });
    return Object.freeze(reconstructionRecords);
  }

  function buildApplicationCalculationRecords(experiment,positionStats,transitionStats){
    const layer=layerFor(experiment);
    const allInputIds=(layer.source_records || []).map(item=>item.record_id)
      .concat((layer.historical_calculation_records || []).map(item=>item.record_id));
    const records=[];
    (positionStats || []).forEach((item,index)=>{
      records.push(Object.freeze({
        record_id:`${experiment.data_key}-APP-CALC-POS-${String(index+1).padStart(3,'0')}`,
        record_layer:'application_calculation',
        calculation_kind:'position_statistics',
        position:item.position,
        count:item.count,
        average:item.average,
        equilibrium:item.equilibrium,
        input_record_ids:Object.freeze(allInputIds.slice()),
        historical_claim:false,
        provisional:true
      }));
    });
    (transitionStats || []).forEach((item,index)=>{
      records.push(Object.freeze({
        record_id:`${experiment.data_key}-APP-CALC-TR-${String(index+1).padStart(3,'0')}`,
        record_layer:'application_calculation',
        calculation_kind:'transition_statistics',
        from_position:item.from_position,
        to_position:item.to_position,
        from_value:item.from_value,
        to_value:item.to_value,
        average_difference:item.average_difference,
        result_value:item.result_value,
        result_source:item.result_source,
        input_record_ids:Object.freeze(allInputIds.slice()),
        historical_claim:false,
        provisional:true
      }));
    });
    return Object.freeze(records);
  }

  function freezeReconstructionSegments(experiment,segments){
    return Object.freeze((segments || []).map((segment,index)=>Object.freeze(Object.assign({
      record_id:`${experiment.data_key}-RECON-SEG-${String(index+1).padStart(3,'0')}`,
      record_layer:'reconstruction',
      reconstruction_kind:'curve_segment',
      historical_time_claim:false,
      provisional:true
    },segment))));
  }


  function createPchipEvaluator(points){
    const deduped=[];
    points.filter(point=>Number.isFinite(point.x)&&Number.isFinite(point.y))
      .sort((a,b)=>a.x-b.x)
      .forEach(point=>{
        const last=deduped[deduped.length-1];
        if(last&&Math.abs(last.x-point.x)<0.001) deduped[deduped.length-1]={x:point.x,y:point.y};
        else deduped.push({x:point.x,y:point.y});
      });
    if(!deduped.length) return ()=>0;
    if(deduped.length===1) return ()=>deduped[0].y;
    const n=deduped.length;
    const h=[];
    const delta=[];
    for(let i=0;i<n-1;i+=1){
      h[i]=Math.max(0.001,deduped[i+1].x-deduped[i].x);
      delta[i]=(deduped[i+1].y-deduped[i].y)/h[i];
    }
    const slope=new Array(n).fill(0);
    slope[0]=delta[0];
    slope[n-1]=delta[n-2];
    for(let i=1;i<n-1;i+=1){
      if(delta[i-1]===0||delta[i]===0||delta[i-1]*delta[i]<=0){
        slope[i]=0;
      }else{
        const w1=2*h[i]+h[i-1];
        const w2=h[i]+2*h[i-1];
        slope[i]=(w1+w2)/(w1/delta[i-1]+w2/delta[i]);
      }
    }
    return function(x){
      const value=Number(x);
      if(value<=deduped[0].x) return deduped[0].y;
      if(value>=deduped[n-1].x) return deduped[n-1].y;
      let lo=0,hi=n-1;
      while(hi-lo>1){
        const mid=Math.floor((lo+hi)/2);
        if(deduped[mid].x<=value) lo=mid; else hi=mid;
      }
      const span=h[lo];
      const u=Math.max(0,Math.min(1,(value-deduped[lo].x)/span));
      const u2=u*u,u3=u2*u;
      const h00=2*u3-3*u2+1;
      const h10=u3-2*u2+u;
      const h01=-2*u3+3*u2;
      const h11=u3-u2;
      return h00*deduped[lo].y+h10*span*slope[lo]+h01*deduped[hi].y+h11*span*slope[hi];
    };
  }

  function buildExperimentOneProfile(experiment){
    const layer=layerFor(experiment);
    const sections=experiment.sections||[];
    const initialSection=sections[0]||{rows:[],mass_position:'midway',label:'Weights in midway position'};
    const positiveSection=sections[1]||{rows:[],mass_position:'positive',label:'Weights moved to positive position'};
    const returnSection=sections[2]||{rows:[],mass_position:'midway',label:'Weights returned back to midway position'};
    const initialRows=initialSection.rows||[];
    const positiveRows=positiveSection.rows||[];
    const returnRows=returnSection.rows||[];
    const periodCandidates=[];
    ((experiment.summary||{}).vibration_periods||[]).forEach(item=>{const parsed=duration(item.value);if(Number.isFinite(parsed))periodCandidates.push(parsed);});
    returnRows.forEach(row=>{const parsed=duration(row.difference);if(Number.isFinite(parsed))periodCandidates.push(parsed);});
    const printedSummaryHalfCycle=((experiment.summary||{}).vibration_periods||[]).map(item=>duration(item.value)).find(Number.isFinite);
    const halfCycleSeconds=printedSummaryHalfCycle||median(periodCandidates)||895;
    const fullPeriodSeconds=halfCycleSeconds*2;
    const startAbs=hms((initialRows[0]||{}).time_hms)||34920;
    const movePositive=normalizeClock(eventClock(positiveSection.event),startAbs)||36300;
    const returnMidway=normalizeClock(eventClock(returnSection.event),movePositive)||39960;
    const exactClockAfter=(value,reference)=>normalizeClock(hms(value),reference);

    const initialRest=num((initialRows[2]||{}).point_of_rest)??11.5;
    const positiveRestValues=positiveRows.map(row=>num(row.point_of_rest)).filter(Number.isFinite);
    const positiveEquilibrium=median(positiveRestValues)??26.0;
    const returnRestValues=returnRows.map(row=>num(row.point_of_rest)).filter(Number.isFinite);
    const returnEquilibrium=median(returnRestValues)??11.92;

    const initialDirect=initialRows.map((row,index)=>({
      id:`EXP-I-INITIAL-${index+1}`,
      row_id:row.row_id,
      t:normalizeClock(hms(row.time_hms),startAbs),
      x:num(row.divisions),
      kind:'division_reading',
      time_basis:'historical_direct_time',
      original_time:row.time_hms||'',
      row
    })).filter(item=>Number.isFinite(item.t)&&Number.isFinite(item.x));

    const crossingGroups=returnRows.map((row,rowIndex)=>{
      const points=(row.division_crossings||[]).map((crossing,crossingIndex)=>({
        id:`EXP-I-RET-CROSS-${rowIndex+1}-${crossingIndex+1}`,
        row_id:row.row_id,
        source_ordinal:crossingIndex,
        t:exactClockAfter(crossing.time_hms,returnMidway),
        x:num(crossing.division),
        kind:'division_crossing',
        time_basis:'historical_direct_time',
        original_time:crossing.time_hms||'',
        row,
        crossing
      })).filter(item=>Number.isFinite(item.t)&&Number.isFinite(item.x)).sort((a,b)=>a.t-b.t);
      const slope=points.length>=2?(points[points.length-1].x-points[0].x)/Math.max(1,points[points.length-1].t-points[0].t):0;
      points.forEach(point=>{point.v=slope;});
      return {row,rowIndex,points,slope};
    }).filter(group=>group.points.length);
    const directCrossings=crossingGroups.flatMap(group=>group.points);
    const lastDirectAbs=Math.max(...initialDirect.map(item=>item.t),...directCrossings.map(item=>item.t));
    const spanAbs=Math.max(1,lastDirectAbs-startAbs);
    function playbackFromAbs(absTime){return ((Number(absTime)-startAbs)/spanAbs)*PLAYBACK_DURATION_S;}
    function historicalAbsAt(playbackTime){const t=Math.max(0,Math.min(PLAYBACK_DURATION_S,Number(playbackTime)||0));return startAbs+(t/PLAYBACK_DURATION_S)*spanAbs;}

    const clockIntervals=[];
    for(let index=0;index<crossingGroups.length-1;index+=1){
      const left=crossingGroups[index];
      const right=crossingGroups[index+1];
      const start=left.points[left.points.length-1];
      const end=right.points[0];
      const expectedRow=returnRows[index+1]||{};
      if(end.t>start.t){
        clockIntervals.push({
          segment_id:`EXP-I-CLOCK-RECON-${String(index+1).padStart(2,'0')}`,
          start:{id:start.id,row_id:start.row_id,t:start.t,x:start.x,v:start.v,kind:start.kind,time_basis:start.time_basis},
          end:{id:end.id,row_id:end.row_id,t:end.t,x:end.x,v:end.v,kind:end.kind,time_basis:end.time_basis},
          expected_extreme_value:num(expectedRow.extreme_point),
          expected_extreme_row_id:expectedRow.row_id||''
        });
      }
    }

    const middlePhaseMarkers=[];
    for(let index=0;index<returnRows.length-1;index+=1){
      const currentExtreme=num(returnRows[index].extreme_point);
      const nextExtreme=num(returnRows[index+1].extreme_point);
      const markerTime=exactClockAfter(returnRows[index].time_of_mid_vibration,returnMidway);
      if(Number.isFinite(currentExtreme)&&Number.isFinite(nextExtreme)&&Number.isFinite(markerTime)){
        middlePhaseMarkers.push({
          marker_id:`EXP-I-MIDDLE-PHASE-${String(index+1).padStart(2,'0')}`,
          t:markerTime,
          value:(currentExtreme+nextExtreme)/2,
          source_row_ids:[returnRows[index].row_id||'',returnRows[index+1].row_id||''],
          source_time_row_id:returnRows[index].row_id||'',
          historical_time_hms:formatHms(markerTime),
          calculation:'arithmetic_mean_of_adjacent_extrema',
          historical_time_claim:true,
          historical_value_claim:false
        });
      }
    }
    if(middlePhaseMarkers.length!==4) throw new Error('CV079B12 requires four Experiment I middle-vibration phase markers');

    const phaseDirectChecks=[
      crossingGroups[0] ? crossingGroups[0].points.slice() : [],
      (crossingGroups[1] ? crossingGroups[1].points.slice() : []).concat(crossingGroups[2]&&crossingGroups[2].points[0]?[crossingGroups[2].points[0]]:[]),
      (crossingGroups[2] ? crossingGroups[2].points.slice(1) : []).concat(crossingGroups[3] ? crossingGroups[3].points.slice() : [])
    ];
    const phaseSegments=clockIntervals.map((interval,index)=>({
      segment_id:`EXP-I-PHASE-RECON-${String(index+1).padStart(2,'0')}`,
      start:interval.start,
      end:interval.end,
      display_t0:interval.start.t,
      display_t1:interval.end.t,
      sign:index%2===0?1:-1,
      extreme_value:num((returnRows[index+1]||{}).extreme_point),
      extreme_row_id:(returnRows[index+1]||{}).row_id||'',
      direct_clock_checks:(phaseDirectChecks[index]||[]).map(point=>({
        id:point.id,
        row_id:point.row_id,
        t:point.t,
        x:point.x,
        historical_time_hms:formatHms(point.t)
      }))
    }));
    const positiveExtremaValues=positiveRows.map(row=>num(row.extreme_point)).filter(Number.isFinite);
    const returnExtremaValues=returnRows.map(row=>num(row.extreme_point)).filter(Number.isFinite);
    const returnHalfRanges=[];
    for(let index=0;index<returnExtremaValues.length-1;index+=1){
      returnHalfRanges.push(Math.abs(returnExtremaValues[index+1]-returnExtremaValues[index])/2);
    }
    if(!EXPERIMENT_I_PHYSICAL_MODEL||typeof EXPERIMENT_I_PHYSICAL_MODEL.buildExperimentIReaudit!=='function'){
      throw new Error('CV079B12 requires the CV079B12 middle-vibration phase physical model module');
    }
    const physicalModel=EXPERIMENT_I_PHYSICAL_MODEL.buildExperimentIReaudit({
      half_cycle_seconds:halfCycleSeconds,
      positive_equilibrium:positiveEquilibrium,
      return_equilibrium:returnEquilibrium,
      positive_extrema_values:positiveExtremaValues,
      positive_extrema_row_ids:positiveRows.map(row=>row.row_id||''),
      return_extrema_values:returnExtremaValues,
      return_extrema_row_ids:returnRows.map(row=>row.row_id||''),
      return_half_ranges:returnHalfRanges,
      middle_phase_markers:middlePhaseMarkers,
      phase_segments:phaseSegments
    });

    const directAnchors=[];
    const untimedAnchors=[];
    let anchorSequence=0;
    function baseAnchor(row,sectionIndex,section,value,kind){
      anchorSequence+=1;
      return {
        anchor_id:`${experiment.data_key}-ANCHOR-${String(anchorSequence).padStart(3,'0')}`,
        row_id:row.row_id||`${experiment.data_key}-ROW-${String(anchorSequence).padStart(3,'0')}`,
        section_index:sectionIndex,
        section_label:section.label||'',
        position:section.mass_position||'unknown',
        value:Number(value),
        value_kind:kind,
        value_class:'historical_direct_value',
        source_page:row.source_page||(section.source_pages||[]).join('–')||(experiment.source_pages||[]).join('–'),
        source_type:row.source_type||'historical',
        verification:row.verification||'visual_check_passed',
        raw_text:row.raw_text||'',
        summary_eligible:false,
        source_ordinal:0
      };
    }
    initialDirect.forEach(item=>{
      const anchor=baseAnchor(item.row,0,initialSection,item.x,'division_reading');
      Object.assign(anchor,{
        abs_time_s:item.t,
        historical_time_hms:formatHms(item.t),
        historical_time_original:item.original_time,
        time_basis:'historical_direct_time',
        source_class:'historical_direct_value__historical_direct_time',
        playback_time_s:playbackFromAbs(item.t),
        record_trigger_s:playbackFromAbs(item.t),
        observation_note:'原表にdivisionとclock timeが併記された直接観測。',
        summary_eligible:true
      });
      directAnchors.push(anchor);
    });

    const positiveTriggerStart=playbackFromAbs(movePositive)+1.5;
    const positiveTriggerEnd=Math.max(positiveTriggerStart+1,playbackFromAbs(returnMidway)-1.5);
    positiveRows.forEach((row,index)=>{
      const value=num(row.extreme_point);
      if(!Number.isFinite(value))return;
      const anchor=baseAnchor(row,1,positiveSection,value,'extreme_point');
      const ratio=positiveRows.length<=1?0.5:index/(positiveRows.length-1);
      Object.assign(anchor,{
        abs_time_s:null,
        historical_time_hms:'—',
        historical_time_original:'',
        time_basis:'untimed_extreme_order',
        source_class:'historical_direct_value__untimed_extreme_order',
        playback_time_s:null,
        record_trigger_s:positiveTriggerStart+(positiveTriggerEnd-positiveTriggerStart)*ratio,
        phase_order:index+1,
        phase_group:'positive',
        observation_note:'原表は極値と記録順だけを確定。絶対時刻・等間隔・周期時刻を付与しない。'
      });
      untimedAnchors.push(anchor);
    });

    returnRows.forEach((row,index)=>{
      const value=num(row.extreme_point);
      const group=crossingGroups[index];
      if(Number.isFinite(value)){
        const anchor=baseAnchor(row,2,returnSection,value,'extreme_point');
        let trigger;
        if(index===0&&group) trigger=Math.max(playbackFromAbs(returnMidway)+1,playbackFromAbs(group.points[0].t)-1.1);
        else if(index>0&&crossingGroups[index-1]&&group){
          trigger=(playbackFromAbs(crossingGroups[index-1].points[crossingGroups[index-1].points.length-1].t)+playbackFromAbs(group.points[0].t))/2;
        }else trigger=PLAYBACK_DURATION_S-0.8;
        Object.assign(anchor,{
          abs_time_s:null,
          historical_time_hms:'—',
          historical_time_original:'',
          time_basis:'untimed_extreme_order',
          source_class:'historical_direct_value__untimed_extreme_order',
          playback_time_s:null,
          record_trigger_s:trigger,
          phase_order:index+1,
          phase_group:'midway',
          observation_note:'原表極値は値と順序だけを保持。middle-vibration timeから極値時刻を逆算しない。'
        });
        untimedAnchors.push(anchor);
      }
      (group?group.points:[]).forEach(point=>{
        const anchor=baseAnchor(row,2,returnSection,point.x,'division_crossing');
        anchor.source_ordinal=Number(point.source_ordinal)||0;
        Object.assign(anchor,{
          abs_time_s:point.t,
          historical_time_hms:formatHms(point.t),
          historical_time_original:point.original_time,
          time_basis:'historical_direct_time',
          source_class:'historical_direct_value__historical_direct_time',
          playback_time_s:playbackFromAbs(point.t),
          record_trigger_s:playbackFromAbs(point.t),
          observation_note:'原表にdivisionとclock timeが併記された直接観測。'
        });
        directAnchors.push(anchor);
      });
    });

    const anchors=directAnchors.concat(untimedAnchors).sort((a,b)=>Number(a.record_trigger_s)-Number(b.record_trigger_s)||a.anchor_id.localeCompare(b.anchor_id));
    anchors.forEach((anchor,index)=>{anchor.sequence=index+1;anchor.record_order=index+1;});
    const reconstructionRecords=attachAnchorProvenance(experiment,anchors);

    const historicalSolidSegments=[];
    function addSolid(start,end,role){
      if(!start||!end||!Number.isFinite(start.abs_time_s)||!Number.isFinite(end.abs_time_s)||end.abs_time_s<=start.abs_time_s)return;
      historicalSolidSegments.push(Object.freeze({
        segment_id:`${experiment.data_key}-WAVE-HIST-${String(historicalSolidSegments.length+1).padStart(2,'0')}`,
        role,
        playback_start_s:playbackFromAbs(start.abs_time_s),
        playback_end_s:playbackFromAbs(end.abs_time_s),
        model_start_abs_s:start.abs_time_s,
        model_end_abs_s:end.abs_time_s,
        source_class:'historical_direct_endpoint_relation',
        start_constraint_id:start.anchor_id,
        end_constraint_id:end.anchor_id,
        start_time_basis:'historical_direct_time',
        end_time_basis:'historical_direct_time',
        line_kind:'historical_solid',
        display_axis:'historical_clock',
        main_clock_visible:true,
        historical_time_claim:true,
        rendering_basis:'direct_historical_endpoint_connector'
      }));
    }
    const initialAnchorByRow=new Map(directAnchors.filter(a=>a.section_index===0).map(a=>[a.row_id,a]));
    for(let i=0;i<initialDirect.length-1;i+=1)addSolid(initialAnchorByRow.get(initialDirect[i].row_id),initialAnchorByRow.get(initialDirect[i+1].row_id),'initial_direct_readings');
    crossingGroups.forEach(group=>{
      if(group.points.length<2)return;
      const start=directAnchors.find(a=>a.row_id===group.points[0].row_id&&a.source_ordinal===group.points[0].source_ordinal&&a.value_kind==='division_crossing');
      const end=directAnchors.find(a=>a.row_id===group.points[group.points.length-1].row_id&&a.source_ordinal===group.points[group.points.length-1].source_ordinal&&a.value_kind==='division_crossing');
      addSolid(start,end,'direct_crossing_pair');
    });

    const reconstructionSegments=physicalModel.clock_axis.segments.map((segment,index)=>Object.freeze({
      segment_id:`${experiment.data_key}-WAVE-RECON-${String(index+1).padStart(2,'0')}`,
      model_segment_id:segment.segment_id,
      role:'middle_phase_constrained_reconstruction',
      segment_index:index,
      playback_start_s:playbackFromAbs(segment.display_t0),
      playback_end_s:playbackFromAbs(segment.display_t1),
      model_start_abs_s:segment.display_t0,
      model_end_abs_s:segment.display_t1,
      core_start_abs_s:segment.core_t0,
      core_end_abs_s:segment.core_t1,
      source_class:'physical_model_middle_phase_constrained',
      start_constraint_id:segment.start.id,
      end_constraint_id:segment.end.id,
      start_time_basis:'historical_direct_time',
      end_time_basis:'historical_direct_time',
      line_kind:'reconstruction_dashed',
      display_axis:'historical_clock',
      main_clock_visible:true,
      historical_time_claim:false,
      rendering_basis:'middle-vibration-phase-and-untimed-extreme-amplitude-constrained',
      expected_extreme_row_id:segment.extreme_constraint.source_row_id,
      expected_extreme_value:segment.extreme_constraint.expected_value,
      predicted_extreme_value:segment.extreme_constraint.predicted_value,
      expected_extreme_residual:segment.extreme_constraint.residual,
      expected_extreme_absolute_residual:Math.abs(segment.extreme_constraint.residual),
      residual_in_resolution_units:segment.validation.max_absolute_residual/segment.validation.source_resolution_div,
      residual_class:segment.validation.validation_status==='consistent'?'within_source_resolution':segment.validation.validation_status==='caution'?'moderate_deviation':'large_deviation',
      validation_status:segment.validation.validation_status,
      validation_label_ja:segment.validation.validation_label_ja,
      direct_clock_check_count:segment.validation.check_count,
      max_direct_clock_residual:segment.validation.max_absolute_residual,
      rms_direct_clock_residual:segment.validation.rms_residual
    }));
    const waveSegments=Object.freeze(historicalSolidSegments.concat(reconstructionSegments).sort((a,b)=>a.playback_start_s-b.playback_start_s||a.line_kind.localeCompare(b.line_kind)));

    const unresolvedIntervals=Object.freeze([
      Object.freeze({start_abs_s:movePositive,end_abs_s:returnMidway,reason:'positive extrema have values/order only; protective operations are not clocked'}),
      Object.freeze({start_abs_s:returnMidway,end_abs_s:crossingGroups[0].points[0].t,reason:'return protective procedure and first physical extremity are unobserved'})
    ]);

    const solidByAbs=historicalSolidSegments.map(segment=>({segment,start:segment.model_start_abs_s,end:segment.model_end_abs_s}));
    const modelByAbs=physicalModel.clock_axis.segments.map((segment,index)=>({segment,start:segment.display_t0,end:segment.display_t1,waveSegment:reconstructionSegments[index]}));
    function regionAtAbs(absTime){
      // Direct historical endpoint relations take priority at shared boundaries so
      // readouts remain exactly equal to the printed clock/value observations.
      const solid=solidByAbs.find(item=>absTime>=item.start&&absTime<=item.end);
      if(solid)return {kind:'historical_relation',item:solid};
      const model=modelByAbs.find(item=>absTime>=item.start&&absTime<=item.end);
      if(model)return {kind:'reconstruction',item:model};
      return null;
    }
    function valueAtAbs(absTime){
      const region=regionAtAbs(absTime);
      if(!region)return null;
      if(region.kind==='reconstruction')return region.item.segment.evaluate(absTime).x;
      const segment=region.item.segment;
      const startAnchor=directAnchors.find(a=>a.anchor_id===segment.start_constraint_id);
      const endAnchor=directAnchors.find(a=>a.anchor_id===segment.end_constraint_id);
      if(!startAnchor||!endAnchor)return null;
      const u=(absTime-segment.model_start_abs_s)/Math.max(1e-9,segment.model_end_abs_s-segment.model_start_abs_s);
      return startAnchor.value+(endAnchor.value-startAnchor.value)*Math.max(0,Math.min(1,u));
    }
    function isWaveDefinedAt(playbackTime){return Boolean(regionAtAbs(historicalAbsAt(playbackTime)));}
    function valueAt(playbackTime){return valueAtAbs(historicalAbsAt(playbackTime));}

    const sampled=[];
    directAnchors.forEach(anchor=>sampled.push(anchor.value));
    physicalModel.clock_axis.segments.forEach(segment=>segment.sensitivity_samples.forEach(sample=>{sampled.push(sample.sensitivity_min_x,sample.sensitivity_max_x);}));
    untimedAnchors.forEach(anchor=>sampled.push(anchor.value));
    let minValue=Math.min(...sampled.filter(Number.isFinite));
    let maxValue=Math.max(...sampled.filter(Number.isFinite));
    if(!(maxValue>minValue)){minValue-=1;maxValue+=1;}
    const padding=Math.max(0.8,(maxValue-minValue)*0.08);
    const scaleMin=minValue-padding,scaleMax=maxValue+padding,scaleCenter=(scaleMin+scaleMax)/2,scaleHalf=(scaleMax-scaleMin)/2;
    function yAtValue(value){const numeric=Number(value);if(!Number.isFinite(numeric))return 105;return 18+(scaleMax-numeric)/(scaleMax-scaleMin)*170;}
    function visualOffsetAt(playbackTime){const value=valueAt(playbackTime);return Number.isFinite(value)?Math.max(-42,Math.min(42,((value-scaleCenter)/Math.max(0.001,scaleHalf))*42)):0;}

    const motionValues=((experiment.summary||{}).motions||[]).map(item=>num(item.value)).filter(Number.isFinite);
    const transitionDuration=1.2;
    const transitionEvents=[
      {transition_id:`${experiment.data_key}-TRANSITION-01`,from_position:'midway',to_position:'positive',abs_time_s:movePositive,playback_time_s:playbackFromAbs(movePositive),historical_time_hms:formatHms(movePositive),event_text:positiveSection.event||'',source_class:'historical_event_time',historical_motion_value:motionValues[0]??null,source_record_id:DATA_LAYERS.findSourceRecordId(experiment.data_key,'','mass_position_event',1),provenance_layer:'historical_source'},
      {transition_id:`${experiment.data_key}-TRANSITION-02`,from_position:'positive',to_position:'midway',abs_time_s:returnMidway,playback_time_s:playbackFromAbs(returnMidway),historical_time_hms:formatHms(returnMidway),event_text:returnSection.event||'',source_class:'historical_event_time',historical_motion_value:motionValues[1]??null,source_record_id:DATA_LAYERS.findSourceRecordId(experiment.data_key,'','mass_position_event',2),provenance_layer:'historical_source'}
    ];
    const firstTimedCrossing=crossingGroups[0].points[0].t;
    function massFrameAt(playbackTime){
      const t=Math.max(0,Math.min(PLAYBACK_DURATION_S,Number(playbackTime)||0));
      const abs=historicalAbsAt(t);
      const first=transitionEvents[0],second=transitionEvents[1];
      if(t<first.playback_time_s)return {switching:false,position:'midway',progress:1,label:positionLabel('midway'),source_class:'historical_start',unresolved:false};
      if(t<first.playback_time_s+transitionDuration)return {switching:true,position:'midway',from_position:'midway',to_position:'positive',progress:(t-first.playback_time_s)/transitionDuration,label:'Midway to Positive',source_class:'historical_event_time',event_text:first.event_text,unresolved:false};
      if(t<second.playback_time_s)return {switching:false,position:'unknown',from_position:null,to_position:null,progress:1,label:'Protective intervention timing unresolved',source_class:'historical_unresolved_mass_interval',event_text:'10:05–11:06 includes unclocked midway/positive protective operations.',unresolved:true};
      if(t<second.playback_time_s+transitionDuration)return {switching:true,position:'positive',from_position:'positive',to_position:'midway',progress:(t-second.playback_time_s)/transitionDuration,label:'Positive to Midway',source_class:'historical_event_time',event_text:second.event_text,unresolved:false};
      if(abs<firstTimedCrossing)return {switching:false,position:'unknown',from_position:null,to_position:null,progress:1,label:'Return protective operation timing unresolved',source_class:'historical_unresolved_mass_interval',event_text:'11:06 to first timed crossing contains unclocked protective motion.',unresolved:true};
      return {switching:false,position:'midway',from_position:'midway',to_position:'midway',progress:1,label:positionLabel('midway'),source_class:'historical_section_position',unresolved:false};
    }

    const sectionModels=[
      {index:0,label:initialSection.label,position:'midway',event:'',eventAbsTime:null,eventTimeBasis:'historical_start',source_pages:initialSection.source_pages||[],startAbs,endAbs:movePositive,equilibrium:initialRest,playbackStart:0,playbackEnd:playbackFromAbs(movePositive)},
      {index:1,label:positiveSection.label,position:'positive',event:positiveSection.event||'',eventAbsTime:movePositive,eventTimeBasis:'historical_event_time',source_pages:positiveSection.source_pages||[],startAbs:movePositive,endAbs:returnMidway,equilibrium:positiveEquilibrium,playbackStart:playbackFromAbs(movePositive),playbackEnd:playbackFromAbs(returnMidway)},
      {index:2,label:returnSection.label,position:'midway',event:returnSection.event||'',eventAbsTime:returnMidway,eventTimeBasis:'historical_event_time',source_pages:returnSection.source_pages||[],startAbs:returnMidway,endAbs:lastDirectAbs,equilibrium:returnEquilibrium,playbackStart:playbackFromAbs(returnMidway),playbackEnd:PLAYBACK_DURATION_S}
    ];
    function sectionAt(playbackTime){
      const t=Math.max(0,Math.min(PLAYBACK_DURATION_S,Number(playbackTime)||0));
      const motion=massFrameAt(t);
      const abs=historicalAbsAt(t);
      const index=abs<movePositive?0:(abs<returnMidway?1:2);
      return Object.assign({},sectionModels[index],motion,{index});
    }

    const initialSummaryValues=initialRows.map(row=>num(row.divisions)).filter(Number.isFinite).concat(returnRestValues);
    const positionStats=[
      {position:'midway',label:positionLabel('midway'),short_label:positionShort('midway'),count:initialSummaryValues.length,average:mean(initialSummaryValues),equilibrium:returnEquilibrium},
      {position:'positive',label:positionLabel('positive'),short_label:positionShort('positive'),count:positiveRestValues.length,average:mean(positiveRestValues),equilibrium:positiveEquilibrium}
    ];
    const transitionStats=transitionEvents.map(event=>{
      const from=positionStats.find(item=>item.position===event.from_position);
      const to=positionStats.find(item=>item.position===event.to_position);
      const fromValue=from?(from.equilibrium??from.average):null;
      const toValue=to?(to.equilibrium??to.average):null;
      return Object.assign({},event,{from_value:fromValue,to_value:toValue,average_difference:Number.isFinite(fromValue)&&Number.isFinite(toValue)?toValue-fromValue:null,result_value:Number.isFinite(event.historical_motion_value)?event.historical_motion_value:(toValue-fromValue),result_source:Number.isFinite(event.historical_motion_value)?'historical_summary_motion':'calculated_position_average_difference'});
    });
    const applicationCalculationRecords=buildApplicationCalculationRecords(experiment,positionStats,transitionStats);

    const segmentRecords=[];
    physicalModel.clock_axis.segments.forEach(segment=>segmentRecords.push({
      method:'middle_vibration_phase_constrained_damped_oscillator',
      segment_role:'clock_axis_phase_reconstruction',
      model_start_abs_s:segment.display_t0,
      model_end_abs_s:segment.display_t1,
      core_start_abs_s:segment.core_t0,
      core_end_abs_s:segment.core_t1,
      placement_basis:'printed_middle_vibration_times_and_adjacent_extreme_amplitude',
      equation:segment.equation,
      beta:segment.beta,
      zeta:segment.zeta,
      omega_n:segment.omega_n,
      omega_d:segment.omega_d,
      half_cycle_seconds:segment.half_cycle_seconds,
      middle_start:segment.middle_start,
      middle_end:segment.middle_end,
      amplitude:segment.amplitude,
      source_constraint_start:segment.start.id,
      source_constraint_end:segment.end.id,
      expected_extreme_row_id:segment.extreme_constraint.source_row_id,
      expected_extreme_value:segment.extreme_constraint.expected_value,
      predicted_extreme_value:segment.extreme_constraint.predicted_value,
      expected_extreme_residual:segment.extreme_constraint.residual,
      expected_extreme_absolute_residual:Math.abs(segment.extreme_constraint.residual),
      direct_clock_check_count:segment.validation.check_count,
      max_direct_clock_residual:segment.validation.max_absolute_residual,
      rms_direct_clock_residual:segment.validation.rms_residual,
      residual_class:segment.validation.validation_status==='consistent'?'within_source_resolution':segment.validation.validation_status==='caution'?'moderate_deviation':'large_deviation',
      validation_status:segment.validation.validation_status,
      validation_label_ja:segment.validation.validation_label_ja,
      source_resolution_div:segment.validation.source_resolution_div,
      closure_check_is_statistical:false,
      extreme_role:'amplitude_constraint_no_time_claim',
      sensitivity_interpretation:'beta_parameter_sensitivity_only_not_uncertainty_or_confidence_interval',
      wave_visible:true
    }));
    unresolvedIntervals.forEach(interval=>segmentRecords.push({method:'none',segment_role:'unresolved_historical_interval',model_start_abs_s:interval.start_abs_s,model_end_abs_s:interval.end_abs_s,placement_basis:'historical_unresolved_interval',reason:interval.reason,wave_visible:false}));
    physicalModel.phase_groups.forEach(group=>segmentRecords.push({method:'ordinal_phase_connector',segment_role:`${group.position}_untimed_extrema_order`,model_start_abs_s:null,model_end_abs_s:null,placement_basis:'record_order_only_no_clock',phase_point_count:group.points.length,wave_visible:false}));
    const reconstructionLayerSegments=freezeReconstructionSegments(experiment,segmentRecords);

    const reconstructionSamples=Object.freeze(physicalModel.clock_axis.segments.flatMap((segment,segmentIndex)=>segment.sensitivity_samples.map(sample=>Object.freeze({
      sample_id:`${experiment.data_key}-RECON-SAMPLE-${String(segmentIndex+1).padStart(2,'0')}-${String(sample.sample_index+1).padStart(4,'0')}`,
      record_type:'reconstruction_sample',
      segment_id:reconstructionSegments[segmentIndex].segment_id,
      model_segment_id:segment.segment_id,
      sample_index:sample.sample_index,
      axis_kind:'historical_clock',
      line_kind:'reconstruction_dashed',
      historical_time_hms:formatHms(sample.t),
      historical_abs_time_s:sample.t,
      playback_time_s:playbackFromAbs(sample.t),
      read_value:sample.x,
      middle_value:sample.middle,
      sensitivity_min:sample.sensitivity_min_x,
      sensitivity_max:sample.sensitivity_max_x,
      parameter_sensitivity_only:true,
      confidence_interval:false,
      historical_time_claim:false,
      source_constraint_start:segment.start.id,
      source_constraint_end:segment.end.id,
      middle_start_hms:formatHms(segment.core_t0),
      middle_end_hms:formatHms(segment.core_t1),
      middle_start_value:segment.middle_start,
      middle_end_value:segment.middle_end,
      expected_extreme_row_id:segment.extreme_constraint.source_row_id,
      expected_extreme_value:segment.extreme_constraint.expected_value,
      predicted_extreme_value:segment.extreme_constraint.predicted_value,
      residual:segment.validation.max_absolute_residual,
      absolute_residual:segment.validation.max_absolute_residual,
      residual_in_resolution_units:segment.validation.max_absolute_residual/segment.validation.source_resolution_div,
      residual_class:segment.validation.validation_status==='consistent'?'within_source_resolution':segment.validation.validation_status==='caution'?'moderate_deviation':'large_deviation',
      validation_status:segment.validation.validation_status,
      validation_label_ja:segment.validation.validation_label_ja,
      direct_clock_check_count:segment.validation.check_count,
      max_direct_clock_residual:segment.validation.max_absolute_residual,
      rms_direct_clock_residual:segment.validation.rms_residual,
      equation:segment.equation,
      half_cycle_seconds:segment.half_cycle_seconds,
      full_period_seconds:segment.full_period_seconds,
      beta:segment.beta,
      zeta:segment.zeta,
      equilibrium:segment.equilibrium,
      amplitude:segment.amplitude,
      correction_rms:0
    }))));


    const flowStages=[
      timelineStage(0,'Midway時計読取','09:42〜10:05の原表時刻付き読取','historical_direct_time',compactClockRange('09:42:00','10:05:00'),'observation','史実時計範囲'),
      timelineStage(playbackFromAbs(movePositive),'Positiveへ移動','原表に10:05の配置変更時刻が明記されている','historical_event_time',compactClockLabel('10:05:00'),'transition_exact','史実移動時刻'),
      timelineStage((playbackFromAbs(movePositive)+playbackFromAbs(returnMidway))/2,'時計なし極値','正配置の極値5件は値と記録順だけを保持し、時計軸へ置かない','untimed_extreme_order','時刻なし','untimed','記録順のみ'),
      timelineStage(playbackFromAbs(returnMidway),'Midwayへ復帰','原表に11:06の復帰時刻が明記されている。保護操作の時刻は不明','historical_event_time',compactClockLabel('11:06:00'),'transition_exact','史実移動時刻'),
      timelineStage(playbackFromAbs(firstTimedCrossing),'時計読取再開','12:00:48以降の目盛・時計時刻を直接表示','historical_direct_time',compactClockLabel(formatHms(firstTimedCrossing)),'observation_resume','史実時計時刻'),
      timelineStage(PLAYBACK_DURATION_S,'観測終了','最後の時計付き記録までを表示','historical_direct_time',compactClockLabel(formatHms(lastDirectAbs)),'end','史実時計時刻')
    ].sort((a,b)=>a.time-b.time);

    const sourceCounts=anchors.reduce((acc,anchor)=>{const key=`${anchor.value_class} / ${anchor.time_basis}`;acc[key]=(acc[key]||0)+1;return acc;},{});
    function frameAt(playbackTime){
      const absolute=historicalAbsAt(playbackTime);
      const region=regionAtAbs(absolute);
      const section=sectionAt(playbackTime);
      if(!region)return {playback_time_s:Number(playbackTime)||0,historical_abs_time_s:absolute,historical_time_hms:formatHms(absolute),read_value:null,read_div:'—',visual_offset_px:0,wave_defined:false,position:section.position,position_label:section.label,switching:section.switching,from_position:section.from_position||null,to_position:section.to_position||null,source_class:'historical_unresolved_interval'};
      const value=valueAtAbs(absolute);
      return {playback_time_s:Number(playbackTime)||0,historical_abs_time_s:absolute,historical_time_hms:formatHms(absolute),read_value:value,read_div:`${value.toFixed(3)} div`,visual_offset_px:visualOffsetAt(playbackTime),wave_defined:true,position:section.position,position_label:section.label,switching:section.switching,from_position:section.from_position||null,to_position:section.to_position||null,source_class:region.kind==='reconstruction'?'physical_model_direct_clock_bounded':'historical_direct_endpoint_relation'};
    }

    return Object.freeze({
      experiment_id:experiment.id,
      data_key:experiment.data_key,
      label:experiment.label,
      date_iso:experiment.date_iso,
      date_label:experiment.date_label,
      source_pages:experiment.source_pages||[],
      playback_duration_s:PLAYBACK_DURATION_S,
      historical_start_abs_s:startAbs,
      historical_end_abs_s:lastDirectAbs,
      historical_start_hms:formatHms(startAbs),
      historical_end_hms:formatHms(lastDirectAbs),
      historical_span_s:spanAbs,
      period_seconds:halfCycleSeconds,
      full_period_seconds:fullPeriodSeconds,
      historical_source_records:layer.source_records,
      historical_calculation_records:layer.historical_calculation_records,
      application_calculation_records:applicationCalculationRecords,
      reconstruction_records:reconstructionRecords,
      reconstruction_segments:reconstructionLayerSegments,
      reconstruction_samples:reconstructionSamples,
      semantic_profile:EXPERIMENT_I_SEMANTICS,
      physical_model:physicalModel,
      physical_model_build:physicalModel.build,
      model_equation:physicalModel.equation,
      data_layer_status:'middle_vibration_phase_constrained_same_source_internal_closure_parameter_sensitivity_only',
      wave_display_policy:Object.freeze({
        build:'CV079B12',
        direct_marker:'red',
        untimed_extreme_marker:'blue_unconnected_record_order_points_only',
        historical_relation_line:'solid_direct_endpoint_connector',
        reconstruction_line:'dashed_middle_vibration_phase_constrained_model',
        parameter_sensitivity_display:'finalized_analysis_only_not_main_waveform',
        residual_display:'direct_clock_closure_status_on_waveform_numeric_detail_in_finalized_analysis',
        unresolved_interval:'blank_gap_band',
        main_clock_axis_rule:'printed clock/value pairs plus a model whose phase is fixed by printed middle-vibration times may use the clock axis; untimed extrema remain amplitude-only constraints'
      }),
      residual_validation:physicalModel.diagnostics,
      residual_policy:physicalModel.residual_policy,
      sensitivity_policy:physicalModel.sensitivity_policy,
      anchors:Object.freeze(anchors.map(item=>Object.freeze(item))),
      wave_anchors:Object.freeze(directAnchors.map(item=>Object.freeze(item))),
      untimed_extrema:Object.freeze(untimedAnchors.map(item=>Object.freeze(item))),
      wave_segments:waveSegments,
      sections:Object.freeze(sectionModels.map(item=>Object.freeze(item))),
      transitions:Object.freeze(transitionEvents.map(item=>Object.freeze(item))),
      position_stats:Object.freeze(positionStats.map(item=>Object.freeze(item))),
      transition_stats:Object.freeze(transitionStats.map(item=>Object.freeze(item))),
      flow_stages:Object.freeze(flowStages.map(item=>Object.freeze(item))),
      source_counts:Object.freeze(sourceCounts),
      unresolved_intervals:unresolvedIntervals,
      derived_guides:Object.freeze({initial_rest:initialRest,positive_rests:Object.freeze(positiveRestValues.slice()),return_rests:Object.freeze(returnRestValues.slice()),vibration_intervals:Object.freeze(periodCandidates.slice()),policy:'14m55s is an adjacent-extreme interval. Untimed extrema retain order only and are not assigned historical or model clock times.'}),
      reconstruction_policy:'Clock-axis dashed reconstruction uses printed middle-vibration times as phase markers, printed adjacent differences as segment durations, and untimed extrema as amplitude constraints without assigning extreme times. Printed division/clock pairs from the same source table are non-statistical internal-closure checks, not independent validation. The linear middle line and global beta remain model assumptions. Beta sensitivity is not uncertainty. Unresolved intervals remain gaps.',
      scale:Object.freeze({min:scaleMin,max:scaleMax,center:scaleCenter,half:scaleHalf}),
      valueAt,
      isWaveDefinedAt,
      visualOffsetAt,
      yAtValue,
      historicalAbsAt,
      sectionAt,
      massFrameAt,
      frameAt
    });
  }

  function buildDirectTimedExtremaProfile(experiment,semantics){
    const layer=layerFor(experiment);
    const sections=experiment.sections||[];
    const rowModels=[];
    const byRowId=new Map();
    let previousClock=null;

    sections.forEach((section,sectionIndex)=>{
      (section.rows||[]).forEach((row,rowIndex)=>{
        const rawClock=hms(row.time_hms);
        const absTime=Number.isFinite(rawClock)?normalizeClock(rawClock,previousClock):null;
        if(Number.isFinite(absTime)) previousClock=absTime;
        const model={
          section,
          sectionIndex,
          row,
          rowIndex,
          globalIndex:rowModels.length,
          absTime,
          originalClock:row.time_hms||''
        };
        rowModels.push(model);
        if(row.row_id) byRowId.set(row.row_id,model);
      });
    });

    const timedRows=rowModels.filter(model=>Number.isFinite(model.absTime));
    if(!timedRows.length) throw new Error(`${experiment.data_key}: direct-time profile requires printed row times`);
    const minTime=timedRows[0].absTime;
    const maxTime=timedRows[timedRows.length-1].absTime;
    const spanTime=Math.max(1,maxTime-minTime);
    const playbackFromAbs=absolute=>((Number(absolute)-minTime)/spanTime)*PLAYBACK_DURATION_S;
    const historicalAbsAt=playbackTime=>minTime+(Math.max(0,Math.min(PLAYBACK_DURATION_S,Number(playbackTime)||0))/PLAYBACK_DURATION_S)*spanTime;

    const anchors=[];
    let anchorSequence=0;
    function addAnchor(model,value,kind,options={}){
      if(!Number.isFinite(Number(value))||!Number.isFinite(model.absTime)) return;
      anchorSequence+=1;
      const directClock=options.directClock!==false;
      const absTime=model.absTime;
      const playbackTime=playbackFromAbs(absTime);
      anchors.push({
        anchor_id:`${experiment.data_key}-ANCHOR-${String(anchorSequence).padStart(3,'0')}`,
        row_id:model.row.row_id||`${experiment.data_key}-ROW-${String(model.globalIndex+1).padStart(3,'0')}`,
        section_index:model.sectionIndex,
        section_label:model.section.label||'',
        position:model.section.mass_position||'unknown',
        value:Number(value),
        value_kind:kind,
        source_ordinal:0,
        value_class:options.valueClass||'historical_direct_value',
        abs_time_s:absTime,
        playback_time_s:playbackTime,
        record_trigger_s:playbackTime,
        historical_time_hms:directClock?formatHms(absTime):'',
        historical_time_original:directClock?model.originalClock:'',
        associated_row_time_hms:directClock?'':formatHms(absTime),
        associated_row_time_original:directClock?'':model.originalClock,
        historical_time_claim:directClock,
        time_basis:directClock?'historical_direct_time':'historical_table_calculation_no_instant',
        source_class:directClock?'historical_direct_value__historical_direct_time':'historical_table_derived_value__no_instant_time',
        source_page:model.row.source_page||(model.section.source_pages||[]).join('–')||(experiment.source_pages||[]).join('–'),
        source_type:model.row.source_type||'historical',
        verification:model.row.verification||'visual_check_passed',
        raw_text:model.row.raw_text||'',
        observation_note:options.note||model.row.observation_note||'',
        summary_eligible:Boolean(options.summaryEligible)
      });
    }

    rowModels.forEach(model=>{
      const row=model.row;
      const divisionValue=num(row.divisions);
      const extremeValue=num(row.extreme_point);
      if(Number.isFinite(divisionValue)){
        addAnchor(model,divisionValue,'division_reading',{summaryEligible:true});
      }else if(Number.isFinite(extremeValue)){
        addAnchor(model,extremeValue,'extreme_point',{summaryEligible:false});
      }
      const restValue=num(row.point_of_rest);
      if(Number.isFinite(restValue)){
        addAnchor(model,restValue,'point_of_rest',{
          directClock:false,
          summaryEligible:true,
          valueClass:'historical_table_derived_value',
          note:'原表のPoint of rest欄に印刷された計算値。同じ行の時計時刻を瞬間観測時刻としては扱わない。'
        });
      }
    });

    const kindOrder={division_reading:0,extreme_point:0,point_of_rest:1};
    anchors.sort((a,b)=>a.abs_time_s-b.abs_time_s||(kindOrder[a.value_kind]??9)-(kindOrder[b.value_kind]??9)||a.anchor_id.localeCompare(b.anchor_id));
    anchors.forEach((anchor,index)=>{anchor.sequence=index+1;});
    const reconstructionRecords=attachAnchorProvenance(experiment,anchors);
    const waveAnchors=anchors.filter(anchor=>anchor.value_kind==='division_reading'||anchor.value_kind==='extreme_point');

    const sectionModels=sections.map((section,sectionIndex)=>{
      const models=rowModels.filter(model=>model.sectionIndex===sectionIndex&&Number.isFinite(model.absTime));
      const sectionWaveAnchors=waveAnchors.filter(anchor=>anchor.section_index===sectionIndex);
      const restValues=anchors.filter(anchor=>anchor.section_index===sectionIndex&&anchor.value_kind==='point_of_rest').map(anchor=>anchor.value);
      const fallbackValues=anchors.filter(anchor=>anchor.section_index===sectionIndex&&anchor.summary_eligible).map(anchor=>anchor.value);
      const startAbs=models.length?models[0].absTime:minTime;
      const endAbs=models.length?models[models.length-1].absTime:startAbs;
      return {
        index:sectionIndex,
        label:section.label||positionLabel(section.mass_position),
        position:section.mass_position||'unknown',
        source_pages:section.source_pages||experiment.source_pages||[],
        startAbs,
        endAbs,
        playbackStart:playbackFromAbs(startAbs),
        playbackEnd:playbackFromAbs(endAbs),
        equilibrium:median(restValues)??median(fallbackValues)??median(sectionWaveAnchors.map(anchor=>anchor.value))
      };
    });

    const summaryMotionMap=new Map((((experiment.summary||{}).motions)||[]).map(item=>[
      String(item.transition||'').toLowerCase(),
      {value:num(item.value),raw:item.value||'',unit:item.unit||'divisions'}
    ]));
    const transitionSpecs=(semantics&&semantics.transition_intervals)||[];
    const transitionUncertaintyRanges=transitionSpecs.map((spec,index)=>{
      const before=byRowId.get(spec.before_row_id);
      const after=byRowId.get(spec.after_row_id);
      if(!before||!after||!Number.isFinite(before.absTime)||!Number.isFinite(after.absTime)||after.absTime<=before.absTime){
        throw new Error(`${experiment.data_key}: invalid transition uncertainty range ${spec.transition_id||index+1}`);
      }
      return {
        transition_id:spec.transition_id||`${experiment.data_key}-TRANSITION-${String(index+1).padStart(2,'0')}`,
        transition_index:index,
        from_position:spec.from_position,
        to_position:spec.to_position,
        start_abs_s:before.absTime,
        end_abs_s:after.absTime,
        start_hms:formatHms(before.absTime),
        end_hms:formatHms(after.absTime),
        playback_start_s:playbackFromAbs(before.absTime),
        playback_end_s:playbackFromAbs(after.absTime),
        time_status:'uncertain_interval',
        source_class:'historical_transition_interval_only',
        before_row_id:spec.before_row_id,
        after_row_id:spec.after_row_id,
        display_rule:spec.display_rule||'配置変更時刻は前後の史実時計付き記録の間に限定されるが、正確な時刻は記録されていない。'
      };
    });

    const explicitMissedSpecs=Array.isArray(semantics&&semantics.missed_intervals)?semantics.missed_intervals:[];
    const fallbackMissedSpecs=((((semantics||{}).clock_axis||{}).missed_row_ids)||[]).map((rowId,index)=>({
      gap_id:`${experiment.data_key}-MISSED-${String(index+1).padStart(2,'0')}`,
      row_id:String(rowId)
    }));
    const missedSpecs=explicitMissedSpecs.length?explicitMissedSpecs:fallbackMissedSpecs;
    const missedObservationRanges=[];
    missedSpecs.forEach((gapSpec,index)=>{
      const rowId=String(gapSpec.row_id||'');
      const missed=byRowId.get(rowId);
      if(!missed) throw new Error(`${experiment.data_key}: missed row not found ${rowId}`);
      const sameSection=waveAnchors
        .map(anchor=>({anchor,model:byRowId.get(anchor.row_id)}))
        .filter(item=>item.model&&item.model.sectionIndex===missed.sectionIndex);
      const before=gapSpec.before_row_id
        ? sameSection.find(item=>item.anchor.row_id===gapSpec.before_row_id)
        : sameSection.filter(item=>item.model.globalIndex<missed.globalIndex).sort((a,b)=>b.model.globalIndex-a.model.globalIndex)[0];
      const after=gapSpec.after_row_id
        ? sameSection.find(item=>item.anchor.row_id===gapSpec.after_row_id)
        : sameSection.filter(item=>item.model.globalIndex>missed.globalIndex).sort((a,b)=>a.model.globalIndex-b.model.globalIndex)[0];
      if(!before||!after) throw new Error(`${experiment.data_key}: missed interval adjacency is incomplete for ${rowId}`);
      if(!(before.model.globalIndex<missed.globalIndex&&missed.globalIndex<after.model.globalIndex)){
        throw new Error(`${experiment.data_key}: missed interval row order mismatch for ${rowId}`);
      }
      if(before.model.sectionIndex!==after.model.sectionIndex||after.anchor.abs_time_s<=before.anchor.abs_time_s){
        throw new Error(`${experiment.data_key}: missed interval crosses section or time order for ${rowId}`);
      }
      const missedCount=Number(gapSpec.missed_extreme_count);
      const hasCount=Number.isFinite(missedCount)&&missedCount>0;
      missedObservationRanges.push({
        gap_id:gapSpec.gap_id||`${experiment.data_key}-MISSED-${String(index+1).padStart(2,'0')}`,
        row_id:rowId,
        section_index:missed.sectionIndex,
        position:missed.section.mass_position||'unknown',
        start_abs_s:before.anchor.abs_time_s,
        end_abs_s:after.anchor.abs_time_s,
        start_hms:formatHms(before.anchor.abs_time_s),
        end_hms:formatHms(after.anchor.abs_time_s),
        playback_start_s:playbackFromAbs(before.anchor.abs_time_s),
        playback_end_s:playbackFromAbs(after.anchor.abs_time_s),
        before_row_id:before.anchor.row_id,
        after_row_id:after.anchor.row_id,
        missed_extreme_count:hasCount?missedCount:null,
        display_style:gapSpec.display_style||'unfilled_gap_bracket',
        display_label_ja:gapSpec.display_label_ja||(hasCount?`欠測 ${missedCount}極値`:'欠測'),
        source_class:'historical_missed_observation_gap',
        label:gapSpec.display_label_ja||(hasCount?`欠測 ${missedCount}極値`:'欠測'),
        note:missed.row.observation_note||'原表に missed と記録されたため補間しない。'
      });
    });

    const transitions=transitionUncertaintyRanges.map((range,index)=>{
      const motion=summaryMotionMap.get(`${range.from_position}_to_${range.to_position}`)||null;
      const eventSourceRecordId=DATA_LAYERS.findSourceRecordId(experiment.data_key,'','mass_position_event',index+1);
      return {
        transition_index:index,
        transition_id:range.transition_id,
        playback_time_s:range.playback_end_s,
        historical_time_hms:'',
        historical_time_claim:false,
        historical_time_range:`${range.start_hms}–${range.end_hms}`,
        uncertainty_playback_start_s:range.playback_start_s,
        uncertainty_playback_end_s:range.playback_end_s,
        uncertainty_start_abs_s:range.start_abs_s,
        uncertainty_end_abs_s:range.end_abs_s,
        time_uncertain:true,
        from_position:range.from_position,
        to_position:range.to_position,
        label:`${positionShort(range.from_position)} → ${positionShort(range.to_position)}`,
        source_class:range.source_class,
        source_record_id:eventSourceRecordId||'',
        provenance_layer:eventSourceRecordId?'historical_source':'reconstruction',
        event_text:range.display_rule,
        historical_motion_value:motion&&Number.isFinite(motion.value)?motion.value:null,
        historical_motion_raw:motion?motion.raw:'',
        historical_motion_unit:motion?motion.unit:''
      };
    });

    const values=waveAnchors.map(anchor=>anchor.value).filter(Number.isFinite);
    let minValue=values.length?Math.min(...values):-1;
    let maxValue=values.length?Math.max(...values):1;
    if(!(maxValue>minValue)){minValue-=1;maxValue+=1;}
    const valuePadding=Math.max((maxValue-minValue)*0.12,0.5);
    const scaleMin=minValue-valuePadding;
    const scaleMax=maxValue+valuePadding;
    const scaleCenter=(scaleMin+scaleMax)/2;
    const scaleHalf=Math.max((scaleMax-scaleMin)/2,0.5);

    function uncertaintyAtAbs(absolute){
      return transitionUncertaintyRanges.find(range=>absolute>range.start_abs_s+1e-6&&absolute<range.end_abs_s-1e-6)||null;
    }
    function missedAtAbs(absolute){
      return missedObservationRanges.find(range=>absolute>range.start_abs_s+1e-6&&absolute<range.end_abs_s-1e-6)||null;
    }
    function sectionAtAbs(absolute){
      const uncertain=uncertaintyAtAbs(absolute);
      if(uncertain){
        const span=Math.max(1e-9,uncertain.end_abs_s-uncertain.start_abs_s);
        return {
          index:Math.max(0,uncertain.transition_index),
          switching:true,
          unresolved:true,
          time_uncertain:true,
          position:'unknown',
          from_position:uncertain.from_position,
          to_position:uncertain.to_position,
          progress:(absolute-uncertain.start_abs_s)/span,
          historical_time_range:`${uncertain.start_hms}–${uncertain.end_hms}`,
          source_class:uncertain.source_class,
          label:`${positionShort(uncertain.from_position)} → ${positionShort(uncertain.to_position)}（時刻不確定）`
        };
      }
      let selected=sectionModels[0]||{index:0,position:'unknown',label:'Unknown'};
      sectionModels.forEach(section=>{if(absolute>=section.startAbs-1e-6)selected=section;});
      return Object.assign({},selected,{switching:false,unresolved:false,time_uncertain:false});
    }
    function sectionAt(playbackTime){return sectionAtAbs(historicalAbsAt(playbackTime));}
    function massFrameAt(playbackTime){return sectionAt(playbackTime);}

    const sectionWaveMap=new Map(sectionModels.map(section=>[
      section.index,
      waveAnchors.filter(anchor=>anchor.section_index===section.index).sort((a,b)=>a.abs_time_s-b.abs_time_s)
    ]));
    function valueAt(playbackTime){
      const absolute=historicalAbsAt(playbackTime);
      if(uncertaintyAtAbs(absolute)||missedAtAbs(absolute)) return null;
      const section=sectionAtAbs(absolute);
      const points=sectionWaveMap.get(section.index)||[];
      if(!points.length) return null;
      if(absolute<=points[0].abs_time_s) return points[0].value;
      if(absolute>=points[points.length-1].abs_time_s) return points[points.length-1].value;
      let left=points[0],right=points[points.length-1];
      for(let index=0;index<points.length-1;index+=1){
        if(absolute>=points[index].abs_time_s&&absolute<=points[index+1].abs_time_s){
          left=points[index];right=points[index+1];break;
        }
      }
      const ratio=(absolute-left.abs_time_s)/Math.max(1e-9,right.abs_time_s-left.abs_time_s);
      return left.value+(right.value-left.value)*ratio;
    }
    function isWaveDefinedAt(playbackTime){const value=valueAt(playbackTime);return value!==null&&value!==undefined&&Number.isFinite(Number(value));}
    function visualOffsetAt(playbackTime){
      const value=valueAt(playbackTime);
      if(!Number.isFinite(Number(value))) return 0;
      return Math.max(-42,Math.min(42,((value-scaleCenter)/scaleHalf)*42));
    }
    function yAtValue(value){
      const normalized=Math.max(-1,Math.min(1,(Number(value)-scaleCenter)/scaleHalf));
      return 105-normalized*72;
    }
    function frameAt(playbackTime){
      const absolute=historicalAbsAt(playbackTime);
      const section=sectionAtAbs(absolute);
      const value=valueAt(playbackTime);
      const defined=value!==null&&value!==undefined&&Number.isFinite(Number(value));
      return {
        playback_time_s:Number(playbackTime)||0,
        historical_abs_time_s:absolute,
        historical_time_hms:formatHms(absolute),
        read_value:defined?value:null,
        read_div:defined?`${Number(value).toFixed(3)} div`:'—',
        visual_offset_px:defined?visualOffsetAt(playbackTime):0,
        wave_defined:defined,
        position:section.position,
        position_label:section.label,
        switching:section.switching,
        unresolved:section.unresolved,
        time_uncertain:section.time_uncertain,
        historical_time_range:section.historical_time_range||'',
        from_position:section.from_position||null,
        to_position:section.to_position||null,
        progress:Number(section.progress)||0,
        source_class:defined?'historical_direct_points_linear_guide':section.source_class||'historical_transition_interval_only'
      };
    }

    const positionStats=[];
    const positionsInOrder=[];
    sectionModels.forEach(section=>{if(!positionsInOrder.includes(section.position))positionsInOrder.push(section.position);});
    positionsInOrder.forEach(position=>{
      const eligible=anchors.filter(anchor=>anchor.position===position&&anchor.summary_eligible).map(anchor=>anchor.value);
      const rests=anchors.filter(anchor=>anchor.position===position&&anchor.value_kind==='point_of_rest').map(anchor=>anchor.value);
      positionStats.push({
        position,
        label:positionLabel(position),
        short_label:positionShort(position),
        count:eligible.length,
        average:mean(eligible),
        equilibrium:median(rests)??median(eligible)
      });
    });
    const transitionStats=transitions.map(transition=>{
      const from=positionStats.find(item=>item.position===transition.from_position);
      const to=positionStats.find(item=>item.position===transition.to_position);
      const fromValue=from?(from.equilibrium??from.average):null;
      const toValue=to?(to.equilibrium??to.average):null;
      return Object.assign({},transition,{
        from_value:fromValue,
        to_value:toValue,
        average_difference:Number.isFinite(fromValue)&&Number.isFinite(toValue)?toValue-fromValue:null,
        result_value:Number.isFinite(transition.historical_motion_value)?transition.historical_motion_value:(Number.isFinite(fromValue)&&Number.isFinite(toValue)?toValue-fromValue:null),
        result_source:Number.isFinite(transition.historical_motion_value)?'historical_summary_motion':'calculated_position_average_difference'
      });
    });
    const applicationCalculationRecords=buildApplicationCalculationRecords(experiment,positionStats,transitionStats);

    const waveSegments=[];
    sectionModels.forEach(section=>{
      const points=(sectionWaveMap.get(section.index)||[]).slice().sort((a,b)=>a.abs_time_s-b.abs_time_s);
      if(!points.length) return;
      let group=[points[0]];
      for(let index=1;index<points.length;index+=1){
        const previous=points[index-1];
        const current=points[index];
        const hasMissedGap=missedObservationRanges.some(range=>
          range.section_index===section.index&&
          range.before_row_id===previous.row_id&&
          range.after_row_id===current.row_id
        );
        if(hasMissedGap){
          if(group.length>=2) waveSegments.push(group);
          group=[current];
        }else{
          group.push(current);
        }
      }
      if(group.length>=2) waveSegments.push(group);
    });
    const normalizedWaveSegments=waveSegments.map((points,index)=>Object.freeze({
      segment_id:`${experiment.data_key}-DIRECT-${String(index+1).padStart(2,'0')}`,
      playback_start_s:points[0].playback_time_s,
      playback_end_s:points[points.length-1].playback_time_s,
      model_start_abs_s:points[0].abs_time_s,
      model_end_abs_s:points[points.length-1].abs_time_s,
      line_kind:'historical_direct_point_guide',
      main_clock_visible:true,
      wave_visible:true,
      position:points[0].position,
      start_row_id:points[0].row_id,
      end_row_id:points[points.length-1].row_id
    }));

    const flowStages=[];
    flowStages.push(timelineStage(0,`${positionShort(sectionModels[0].position)}配置観測`,'原表の最初の時計付き極値から観測開始','historical_direct_time',compactClockLabel(formatHms(minTime)),'observation_start','史実時計時刻'));
    transitionUncertaintyRanges.forEach(range=>{
      flowStages.push(timelineStage(range.playback_start_s,'配置変更時刻不確定',`${range.start_hms}〜${range.end_hms}の間に${positionShort(range.from_position)}から${positionShort(range.to_position)}へ変更。正確な移動時刻は未記載`,range.source_class,compactClockRange(range.start_hms,range.end_hms),'transition_uncertain','史実時計による上下限'));
      flowStages.push(timelineStage(range.playback_end_s,`${positionShort(range.to_position)}配置観測`,`${range.end_hms}の最初の時計付き極値で新しい配置を確認`,'historical_direct_time',compactClockLabel(range.end_hms),'observation_resume','史実時計時刻'));
    });
    missedObservationRanges.forEach(range=>{
      flowStages.push(timelineStage(range.playback_start_s,range.display_label_ja||'欠測',`${range.start_hms}〜${range.end_hms}は原表のmissed記録。前後を接続しない`,range.source_class,compactClockRange(range.start_hms,range.end_hms),'missed','史実時計で挟まれた欠測'));
      flowStages.push(timelineStage(range.playback_end_s,'観測再開',`${range.end_hms}の次の時計付き極値から表示を再開`,'historical_direct_time',compactClockLabel(range.end_hms),'observation_resume','史実時計時刻'));
    });
    flowStages.push(timelineStage(PLAYBACK_DURATION_S,'観測終了','最後の時計付き極値までを表示','historical_direct_time',compactClockLabel(formatHms(maxTime)),'end','史実時計時刻'));
    flowStages.sort((a,b)=>a.time-b.time||String(a.timeline_kind).localeCompare(String(b.timeline_kind)));

    const sourceCounts=anchors.reduce((acc,anchor)=>{
      const key=`${anchor.value_class||'unknown'} / ${anchor.time_basis||'unknown'}`;
      acc[key]=(acc[key]||0)+1;
      return acc;
    },{});

    return Object.freeze({
      experiment_id:experiment.id,
      data_key:experiment.data_key,
      label:experiment.label,
      date_iso:experiment.date_iso,
      date_label:experiment.date_label,
      source_pages:experiment.source_pages||[],
      playback_duration_s:PLAYBACK_DURATION_S,
      historical_start_abs_s:minTime,
      historical_end_abs_s:maxTime,
      historical_start_hms:formatHms(minTime),
      historical_end_hms:formatHms(maxTime),
      historical_span_s:spanTime,
      period_seconds:median(waveAnchors.slice(1).map((anchor,index)=>anchor.abs_time_s-waveAnchors[index].abs_time_s))||420,
      historical_source_records:layer.source_records,
      historical_calculation_records:layer.historical_calculation_records,
      application_calculation_records:applicationCalculationRecords,
      reconstruction_records:reconstructionRecords,
      reconstruction_segments:Object.freeze([]),
      data_layer_status:'direct_timed_values_transition_intervals_and_explicit_missed_row_gaps',
      semantics_build:semantics&&semantics.build||'missing',
      direct_clock_policy:'The printed Time belongs to the direct value in the same row. Extreme points are not shifted by a quarter period.',
      point_of_rest_policy:'Printed Point of rest values remain table calculations without an instantaneous clock claim.',
      transition_time_policy:'Movement times are bounded intervals between the last confirmed prior-position record and the first confirmed next-position record.',
      missed_observation_policy:'Printed missed rows cut only their explicitly audited adjacent direct-clock pair. They are displayed as unfilled gap brackets, separate from transition uncertainty bands.',
      direct_clock_connection_policy:'Reconnect every consecutive direct-clock value within one confirmed section except an explicit missed-row adjacency pair.',
      anchors:Object.freeze(anchors.map(anchor=>Object.freeze(anchor))),
      wave_anchors:Object.freeze(waveAnchors.map(anchor=>Object.freeze(anchor))),
      wave_segments:Object.freeze(normalizedWaveSegments),
      sections:Object.freeze(sectionModels.map(section=>Object.freeze(section))),
      transitions:Object.freeze(transitions.map(transition=>Object.freeze(transition))),
      transition_uncertainty_ranges:Object.freeze(transitionUncertaintyRanges.map(range=>Object.freeze(range))),
      missed_observation_ranges:Object.freeze(missedObservationRanges.map(range=>Object.freeze(range))),
      position_stats:Object.freeze(positionStats.map(item=>Object.freeze(item))),
      transition_stats:Object.freeze(transitionStats.map(item=>Object.freeze(item))),
      flow_stages:Object.freeze(flowStages.map(stage=>Object.freeze(stage))),
      source_counts:Object.freeze(sourceCounts),
      scale:Object.freeze({min:scaleMin,max:scaleMax,center:scaleCenter,half:scaleHalf}),
      valueAt,
      isWaveDefinedAt,
      visualOffsetAt,
      yAtValue,
      historicalAbsAt,
      sectionAt,
      massFrameAt,
      frameAt
    });
  }

  function buildCommonStructuredProfile(experiment){
    const structure=OBSERVATION_STRUCTURE&&OBSERVATION_STRUCTURE.sets?OBSERVATION_STRUCTURE.sets[experiment.data_key]:null;
    if(!structure) throw new Error(`${experiment.data_key}: common observation structure is missing`);
    const layer=layerFor(experiment);
    const bounds=structure.clock_bounds||{};
    const minTime=Number(bounds.start_abs_s);
    const maxTime=Number(bounds.end_abs_s);
    if(!Number.isFinite(minTime)||!Number.isFinite(maxTime)||maxTime<=minTime){
      throw new Error(`${experiment.data_key}: common observation structure has no usable clock bounds`);
    }
    const spanTime=Math.max(1,maxTime-minTime);
    const playbackFromAbs=absolute=>((Number(absolute)-minTime)/spanTime)*PLAYBACK_DURATION_S;
    const historicalAbsAt=playbackTime=>minTime+(Math.max(0,Math.min(PLAYBACK_DURATION_S,Number(playbackTime)||0))/PLAYBACK_DURATION_S)*spanTime;
    const sourceOrders=[];
    (structure.clock_values||[]).forEach(item=>sourceOrders.push(Number(item.source_order)||0));
    (structure.order_only_values||[]).forEach(item=>sourceOrders.push(Number(item.source_order)||0));
    (structure.table_calculations||[]).forEach(item=>sourceOrders.push(Number(item.source_order)||0));
    const minOrder=Math.min(...sourceOrders,0);
    const maxOrder=Math.max(...sourceOrders,1);
    const exactByOrder=(structure.clock_values||[]).map(item=>({order:Number(item.source_order)||0,trigger:playbackFromAbs(Number(item.abs_time_s))})).sort((a,b)=>a.order-b.order);
    function triggerFromOrder(order){
      const value=Number(order)||0;
      if(!exactByOrder.length) return ((value-minOrder)/Math.max(1,maxOrder-minOrder))*PLAYBACK_DURATION_S;
      let before=null,after=null;
      exactByOrder.forEach(item=>{
        if(item.order<=value&&(!before||item.order>before.order)) before=item;
        if(item.order>=value&&(!after||item.order<after.order)) after=item;
      });
      if(before&&after&&after.order>before.order){
        const ratio=(value-before.order)/(after.order-before.order);
        return before.trigger+(after.trigger-before.trigger)*ratio;
      }
      if(before){
        const remaining=Math.max(1,maxOrder-before.order);
        return before.trigger+(PLAYBACK_DURATION_S-before.trigger)*Math.max(0,Math.min(1,(value-before.order)/remaining));
      }
      if(after){
        const lead=Math.max(1,after.order-minOrder);
        return after.trigger*Math.max(0,Math.min(1,(value-minOrder)/lead));
      }
      return 0;
    }

    const anchors=[];
    const clockAnchorById=new Map();
    (structure.clock_values||[]).forEach((item,index)=>{
      const abs=Number(item.abs_time_s);
      const playback=playbackFromAbs(abs);
      const anchor={
        anchor_id:item.record_id||`${experiment.data_key}-CLOCK-${String(index+1).padStart(3,'0')}`,
        row_id:item.row_id||'',
        section_index:Number(item.section_index)||0,
        section_label:(structure.sections&&structure.sections[item.section_index]&&structure.sections[item.section_index].label)||'',
        position:item.position||'unknown',
        value:Number(item.value),
        value_kind:item.value_kind||'historical_direct_value',
        source_ordinal:Number(item.source_ordinal)||0,
        value_class:'historical_direct_value',
        abs_time_s:abs,
        playback_time_s:playback,
        record_trigger_s:playback,
        historical_time_hms:item.clock_hms||formatHms(abs),
        historical_time_original:item.clock_original||'',
        historical_time_claim:true,
        time_basis:'historical_direct_time',
        source_class:'historical_direct_value__historical_direct_time',
        source_page:item.source_page||'',
        source_type:'historical',
        verification:'visual_check_passed',
        raw_text:'',
        observation_note:'共通区間モデル：原表に時計時刻がある直接値。',
        summary_eligible:item.value_kind==='division_reading'
      };
      anchors.push(anchor);
      clockAnchorById.set(anchor.anchor_id,anchor);
    });
    const orderCountBySection={};
    (structure.order_only_values||[]).forEach((item,index)=>{
      const sectionIndex=Number(item.section_index)||0;
      orderCountBySection[sectionIndex]=(orderCountBySection[sectionIndex]||0)+1;
      anchors.push({
        anchor_id:item.record_id||`${experiment.data_key}-ORDER-${String(index+1).padStart(3,'0')}`,
        row_id:item.row_id||'',
        section_index:sectionIndex,
        section_label:(structure.sections&&structure.sections[sectionIndex]&&structure.sections[sectionIndex].label)||'',
        position:item.position||'unknown',
        value:Number(item.value),
        value_kind:item.value_kind||'extreme_point',
        source_ordinal:Number(item.source_ordinal)||0,
        value_class:'historical_direct_value',
        abs_time_s:null,
        playback_time_s:null,
        record_trigger_s:triggerFromOrder(item.source_order),
        historical_time_hms:'',
        historical_time_original:'',
        historical_time_claim:false,
        time_basis:'untimed_extreme_order',
        source_class:'historical_direct_value__untimed_extreme_order',
        source_page:item.source_page||'',
        source_type:'historical',
        verification:'visual_check_passed',
        raw_text:'',
        phase_group:`section-${sectionIndex+1}`,
        phase_order:orderCountBySection[sectionIndex],
        observation_note:'時計時刻は原表に記載されていない。値と記録順だけを保持し、主時計軸へ配置しない。',
        summary_eligible:false
      });
    });
    (structure.table_calculations||[]).forEach((item,index)=>{
      const sectionIndex=Number(item.section_index)||0;
      anchors.push({
        anchor_id:item.record_id||`${experiment.data_key}-CALC-${String(index+1).padStart(3,'0')}`,
        row_id:item.row_id||'',
        section_index:sectionIndex,
        section_label:(structure.sections&&structure.sections[sectionIndex]&&structure.sections[sectionIndex].label)||'',
        position:item.position||'unknown',
        value:Number(item.value),
        value_kind:item.value_kind||'point_of_rest',
        source_ordinal:Number(item.source_ordinal)||0,
        value_class:'historical_table_derived_value',
        abs_time_s:null,
        playback_time_s:null,
        record_trigger_s:Math.min(PLAYBACK_DURATION_S,triggerFromOrder(item.source_order)+0.01),
        historical_time_hms:'',
        historical_time_original:'',
        historical_time_claim:false,
        time_basis:'historical_table_calculation_no_instant',
        source_class:'historical_table_derived_value__historical_table_calculation_no_instant',
        source_page:item.source_page||'',
        source_type:'historical',
        verification:'visual_check_passed',
        raw_text:'',
        observation_note:'原表内の計算値。瞬間の観測時刻を主張せず、主波形へ接続しない。',
        summary_eligible:true
      });
    });
    anchors.sort((a,b)=>Number(a.record_trigger_s)-Number(b.record_trigger_s)||Number(a.section_index)-Number(b.section_index)||String(a.anchor_id).localeCompare(String(b.anchor_id)));
    anchors.forEach((anchor,index)=>{anchor.sequence=index+1;});
    const reconstructionRecords=attachAnchorProvenance(experiment,anchors);
    const waveAnchors=(structure.clock_values||[]).map(item=>clockAnchorById.get(item.record_id)).filter(Boolean).sort((a,b)=>a.abs_time_s-b.abs_time_s||a.sequence-b.sequence);

    const waveSegments=[];
    (structure.allowed_connections||[]).forEach((decision,index)=>{
      const from=clockAnchorById.get(decision.from_record_id);
      const to=clockAnchorById.get(decision.to_record_id);
      if(!from||!to||to.playback_time_s<=from.playback_time_s) return;
      waveSegments.push(Object.freeze({
        segment_id:decision.connection_id||`${experiment.data_key}-SEG-${String(index+1).padStart(3,'0')}`,
        playback_start_s:from.playback_time_s,
        playback_end_s:to.playback_time_s,
        model_start_abs_s:from.abs_time_s,
        model_end_abs_s:to.abs_time_s,
        line_kind:'historical_direct_point_guide',
        main_clock_visible:true,
        wave_visible:true,
        position:from.position,
        from_anchor_id:from.anchor_id,
        to_anchor_id:to.anchor_id,
        connection_reason:decision.reason||'allowed_same_section_confirmed_order'
      }));
    });
    function segmentAtPlayback(playbackTime){
      const t=Number(playbackTime)||0;
      return waveSegments.find(segment=>t>=segment.playback_start_s-1e-6&&t<=segment.playback_end_s+1e-6)||null;
    }
    function valueAt(playbackTime){
      const t=Number(playbackTime)||0;
      const segment=segmentAtPlayback(t);
      if(segment){
        const from=clockAnchorById.get(segment.from_anchor_id);
        const to=clockAnchorById.get(segment.to_anchor_id);
        if(from&&to){
          const ratio=Math.max(0,Math.min(1,(t-segment.playback_start_s)/Math.max(1e-9,segment.playback_end_s-segment.playback_start_s)));
          return from.value+(to.value-from.value)*ratio;
        }
      }
      const exact=waveAnchors.find(anchor=>Math.abs(anchor.playback_time_s-t)<=0.035);
      return exact?exact.value:null;
    }
    function isWaveDefinedAt(playbackTime){return Number.isFinite(Number(valueAt(playbackTime)));}

    const allDisplayValues=anchors.filter(anchor=>anchor.value_class==='historical_direct_value').map(anchor=>Number(anchor.value)).filter(Number.isFinite);
    let minValue=allDisplayValues.length?Math.min(...allDisplayValues):-1;
    let maxValue=allDisplayValues.length?Math.max(...allDisplayValues):1;
    if(!(maxValue>minValue)){minValue-=1;maxValue+=1;}
    const padding=Math.max((maxValue-minValue)*0.12,0.5);
    const scaleMin=minValue-padding,scaleMax=maxValue+padding,scaleCenter=(scaleMin+scaleMax)/2,scaleHalf=Math.max((scaleMax-scaleMin)/2,0.5);
    function visualOffsetAt(playbackTime){const value=valueAt(playbackTime);return Number.isFinite(Number(value))?Math.max(-42,Math.min(42,((Number(value)-scaleCenter)/scaleHalf)*42)):0;}
    function yAtValue(value){const normalized=Math.max(-1,Math.min(1,(Number(value)-scaleCenter)/scaleHalf));return 105-normalized*72;}

    const transitionUncertaintyRanges=[];
    const transitions=(structure.transitions||[]).map((item,index)=>{
      const startAbs=Number(item.start_abs_s),endAbs=Number(item.end_abs_s);
      const bounded=item.kind==='bounded_uncertain'&&Number.isFinite(startAbs)&&Number.isFinite(endAbs)&&endAbs>startAbs;
      const known=item.kind==='known'&&Number.isFinite(startAbs);
      let playbackTime;
      if(known) playbackTime=playbackFromAbs(startAbs);
      else if(bounded) playbackTime=playbackFromAbs(startAbs);
      else{
        const nextSection=(structure.sections||[])[Number(item.to_section_index)||0];
        const firstRowOrder=nextSection&&nextSection.row_ids&&nextSection.row_ids.length?((structure.order_only_values||[]).concat(structure.clock_values||[],structure.table_calculations||[]).filter(v=>v.row_id===nextSection.row_ids[0]).map(v=>Number(v.source_order)||0)[0]):null;
        playbackTime=triggerFromOrder(firstRowOrder===null?((index+1)/(Math.max(1,(structure.transitions||[]).length+1))*maxOrder):firstRowOrder);
      }
      const transition={
        transition_index:index,
        transition_id:item.transition_id||`${experiment.data_key}-TRANSITION-${index+1}`,
        playback_time_s:playbackTime,
        playback_end_s:bounded?playbackFromAbs(endAbs):playbackTime,
        historical_time_hms:known?formatHms(startAbs):'',
        historical_time_range:bounded?`${item.start_hms||formatHms(startAbs)}〜${item.end_hms||formatHms(endAbs)}`:'',
        from_position:item.from_position,
        to_position:item.to_position,
        label:`${positionShort(item.from_position)} → ${positionShort(item.to_position)}`,
        source_class:known?'historical_event_time':(bounded?'historical_transition_interval':'historical_transition_order_only'),
        time_uncertain:!known,
        event_text:item.event_text||'',
        transition_kind:item.kind||'unbounded',
        historical_motion_value:null,
        historical_motion_raw:'',
        historical_motion_unit:'',
        source_record_id:'',
        provenance_layer:'reconstruction'
      };
      if(bounded){
        transitionUncertaintyRanges.push(Object.freeze({
          transition_id:transition.transition_id,
          start_abs_s:startAbs,
          end_abs_s:endAbs,
          playback_start_s:playbackFromAbs(startAbs),
          playback_end_s:playbackFromAbs(endAbs),
          start_hms:item.start_hms||formatHms(startAbs),
          end_hms:item.end_hms||formatHms(endAbs),
          from_position:item.from_position,
          to_position:item.to_position,
          source_class:'historical_transition_interval'
        }));
      }
      return transition;
    });

    const sectionModels=(structure.sections||[]).map((section,index)=>{
      const exact=waveAnchors.filter(anchor=>anchor.section_index===index);
      const calculations=anchors.filter(anchor=>anchor.section_index===index&&anchor.value_kind==='point_of_rest').map(anchor=>anchor.value);
      const directSummary=anchors.filter(anchor=>anchor.section_index===index&&anchor.summary_eligible&&anchor.value_class==='historical_direct_value').map(anchor=>anchor.value);
      let playbackStart=0,playbackEnd=PLAYBACK_DURATION_S;
      if(index>0){const tr=transitions[index-1];playbackStart=Number(tr.playback_end_s)||Number(tr.playback_time_s)||0;}
      if(index<transitions.length){const tr=transitions[index];playbackEnd=Number(tr.playback_time_s)||playbackStart;}
      return {
        index,
        section_id:section.section_id,
        label:section.label||positionLabel(section.position),
        position:section.position||'unknown',
        event:section.event||'',
        source_pages:section.source_pages||experiment.source_pages||[],
        startAbs:exact.length?exact[0].abs_time_s:null,
        endAbs:exact.length?exact[exact.length-1].abs_time_s:null,
        playbackStart,
        playbackEnd,
        equilibrium:median(calculations)??median(directSummary)??median(exact.map(anchor=>anchor.value)),
        clock_value_count:exact.length,
        order_only_value_count:Number(section.order_only_value_count)||0
      };
    });
    function sectionAt(playbackTime){
      const t=Math.max(0,Math.min(PLAYBACK_DURATION_S,Number(playbackTime)||0));
      const bounded=transitionUncertaintyRanges.find(range=>t>=range.playback_start_s&&t<range.playback_end_s);
      if(bounded){
        const from=sectionModels.find(section=>section.position===bounded.from_position)||sectionModels[0];
        return Object.assign({},from,{switching:true,time_uncertain:true,unresolved:true,from_position:bounded.from_position,to_position:bounded.to_position,historical_time_range:`${bounded.start_hms}〜${bounded.end_hms}`,progress:(t-bounded.playback_start_s)/Math.max(1e-9,bounded.playback_end_s-bounded.playback_start_s),source_class:'historical_transition_interval'});
      }
      let selected=sectionModels[0]||{index:0,position:'unknown',label:'Unknown'};
      transitions.forEach((transition,index)=>{
        const threshold=Number(transition.playback_end_s)||Number(transition.playback_time_s)||0;
        if(t>=threshold) selected=sectionModels[index+1]||selected;
      });
      const unbounded=transitions.find(transition=>transition.transition_kind==='unbounded'&&Math.abs(t-Number(transition.playback_time_s))<0.8);
      if(unbounded){
        return Object.assign({},selected,{switching:true,time_uncertain:true,unresolved:true,from_position:unbounded.from_position,to_position:unbounded.to_position,historical_time_range:'',progress:0.5,source_class:'historical_transition_order_only'});
      }
      return Object.assign({},selected,{switching:false,time_uncertain:false,unresolved:false,progress:0});
    }
    function massFrameAt(playbackTime){return sectionAt(playbackTime);}
    function frameAt(playbackTime){
      const t=Number(playbackTime)||0;
      const section=sectionAt(t);
      const value=valueAt(t);
      const defined=Number.isFinite(Number(value));
      return {playback_time_s:t,historical_abs_time_s:historicalAbsAt(t),historical_time_hms:formatHms(historicalAbsAt(t)),read_value:defined?value:null,read_div:defined?`${Number(value).toFixed(3)} div`:'—',visual_offset_px:defined?visualOffsetAt(t):0,wave_defined:defined,position:section.position,position_label:section.label,switching:Boolean(section.switching),unresolved:Boolean(section.unresolved),time_uncertain:Boolean(section.time_uncertain),historical_time_range:section.historical_time_range||'',from_position:section.from_position||null,to_position:section.to_position||null,progress:Number(section.progress)||0,source_class:defined?'historical_direct_points_conservative_guide':section.source_class||'historical_record_order_only'};
    }

    const positionsInOrder=[];
    sectionModels.forEach(section=>{if(!positionsInOrder.includes(section.position))positionsInOrder.push(section.position);});
    const positionStats=positionsInOrder.map(position=>{
      const eligible=anchors.filter(anchor=>anchor.position===position&&anchor.summary_eligible).map(anchor=>anchor.value);
      const rests=anchors.filter(anchor=>anchor.position===position&&anchor.value_kind==='point_of_rest').map(anchor=>anchor.value);
      return {position,label:positionLabel(position),short_label:positionShort(position),count:eligible.length,average:mean(eligible),equilibrium:median(rests)??median(eligible)};
    });
    const summaryMotionMap=new Map((((experiment.summary||{}).motions)||[]).map(item=>[String(item.transition||'').toLowerCase(),{value:num(item.value),raw:item.value||'',unit:item.unit||'divisions'}]));
    transitions.forEach(transition=>{
      const motion=summaryMotionMap.get(`${transition.from_position}_to_${transition.to_position}`)||null;
      transition.historical_motion_value=motion&&Number.isFinite(motion.value)?motion.value:null;
      transition.historical_motion_raw=motion?motion.raw:'';
      transition.historical_motion_unit=motion?motion.unit:'';
    });
    const transitionStats=transitions.map(transition=>{
      const from=positionStats.find(item=>item.position===transition.from_position);
      const to=positionStats.find(item=>item.position===transition.to_position);
      const fromValue=from?(from.equilibrium??from.average):null;
      const toValue=to?(to.equilibrium??to.average):null;
      const motion=summaryMotionMap.get(`${transition.from_position}_to_${transition.to_position}`)||null;
      return Object.assign({},transition,{from_value:fromValue,to_value:toValue,average_difference:Number.isFinite(fromValue)&&Number.isFinite(toValue)?toValue-fromValue:null,result_value:motion&&Number.isFinite(motion.value)?motion.value:(Number.isFinite(fromValue)&&Number.isFinite(toValue)?toValue-fromValue:null),result_source:motion&&Number.isFinite(motion.value)?'historical_summary_motion':'calculated_position_average_difference'});
    });
    const applicationCalculationRecords=buildApplicationCalculationRecords(experiment,positionStats,transitionStats);
    const flowStages=[timelineStage(0,`${positionShort(sectionModels[0]&&sectionModels[0].position)}配置観測`,'原表の最初の配置区間','historical_section_order',compactClockLabel(formatHms(minTime)),'observation_start','史実時計時刻')];
    transitions.forEach(transition=>{
      const range=String(transition.historical_time_range||'').replace('–','〜');
      flowStages.push(timelineStage(Number(transition.playback_time_s)||0,transition.time_uncertain?'配置変更時刻不確定':`${positionShort(transition.to_position)}へ移動`,transition.time_uncertain?(range?`${range}の間に${positionShort(transition.from_position)}から${positionShort(transition.to_position)}へ変更`:'配置変更の記録順は確定しているが時計時刻は不明'):'原表に記載された配置変更時刻',transition.source_class,range||compactClockLabel(transition.historical_time_hms),transition.time_uncertain?'transition_uncertain':'transition_exact',transition.time_uncertain?'史実時計による上下限':'史実移動時刻'));
    });
    flowStages.push(timelineStage(PLAYBACK_DURATION_S,'観測終了','最後の時計付き記録までを表示','historical_direct_time',compactClockLabel(formatHms(maxTime)),'end','史実時計時刻'));
    flowStages.sort((a,b)=>a.time-b.time);
    const sourceCounts=anchors.reduce((acc,anchor)=>{const key=`${anchor.value_class||'unknown'} / ${anchor.time_basis||'unknown'}`;acc[key]=(acc[key]||0)+1;return acc;},{});

    return Object.freeze({
      experiment_id:experiment.id,data_key:experiment.data_key,label:experiment.label,date_iso:experiment.date_iso,date_label:experiment.date_label,source_pages:experiment.source_pages||[],playback_duration_s:PLAYBACK_DURATION_S,
      historical_start_abs_s:minTime,historical_end_abs_s:maxTime,historical_start_hms:formatHms(minTime),historical_end_hms:formatHms(maxTime),historical_span_s:spanTime,
      period_seconds:median(((experiment.summary||{}).vibration_periods||[]).map(item=>duration(item.value)).filter(Number.isFinite))||420,
      historical_source_records:layer.source_records,historical_calculation_records:layer.historical_calculation_records,application_calculation_records:applicationCalculationRecords,reconstruction_records:reconstructionRecords,reconstruction_segments:Object.freeze([]),
      common_structure_build:OBSERVATION_STRUCTURE.build||'missing',data_layer_status:'all_sets_common_placement_sections_conservative_connection_rules',
      clock_axis_policy:'原表に時計時刻がある直接値だけを共通時計軸へ配置する。時刻未記載値は記録順のみ保持し、時計軸へ置かない。',
      connection_policy:'同じ配置区間・確定順序・欠測なし・時計なし直接値をまたがない隣接点だけをガイド接続する。配置変更、欠測、同時刻、順序不明をまたぐ線は生成しない。',
      observation_clock_bounds:Object.freeze({start_confirmed:Boolean(bounds.observation_start_confirmed),end_confirmed:Boolean(bounds.observation_end_confirmed)}),
      anchors:Object.freeze(anchors.map(anchor=>Object.freeze(anchor))),wave_anchors:Object.freeze(waveAnchors.map(anchor=>Object.freeze(anchor))),wave_segments:Object.freeze(waveSegments),
      sections:Object.freeze(sectionModels.map(section=>Object.freeze(section))),placement_sections:Object.freeze(sectionModels.map(section=>Object.freeze(section))),transitions:Object.freeze(transitions.map(transition=>Object.freeze(transition))),transition_uncertainty_ranges:Object.freeze(transitionUncertaintyRanges),
      connection_decisions:Object.freeze((structure.connection_decisions||[]).map(item=>Object.freeze(Object.assign({},item)))),position_stats:Object.freeze(positionStats.map(item=>Object.freeze(item))),transition_stats:Object.freeze(transitionStats.map(item=>Object.freeze(item))),flow_stages:Object.freeze(flowStages.map(item=>Object.freeze(item))),source_counts:Object.freeze(sourceCounts),
      scale:Object.freeze({min:scaleMin,max:scaleMax,center:scaleCenter,half:scaleHalf}),valueAt,isWaveDefinedAt,visualOffsetAt,yAtValue,historicalAbsAt,sectionAt,massFrameAt,frameAt
    });
  }


  function buildCrossingTimeReconstructionProfile(experiment,semantics){
    const layer=layerFor(experiment);
    const edgeRepairEnabled=semantics.clock_axis_outside_marker_policy==='hide_order_only_on_main_axis';
    const visibleHistoricalSegmentBounds=semantics.clock_axis_segment_mapping==='visible_historical_bounds';
    const directValueClockBounds=semantics.clock_axis_edge_basis==='direct_value_clock_bounds';
    const reconstructedTransitionUpperBound=semantics.transition_end_boundary_policy==='first_reconstructed_post_move_extreme';
    const sections=experiment.sections||[];
    const initialSection=sections[Number(semantics.initial_section_index)||0]||{rows:[],mass_position:'unknown',label:'Initial section'};
    const timedSection=sections[Number(semantics.timed_section_index)||1]||{rows:[],mass_position:'unknown',label:'Timed section'};
    const initialRows=initialSection.rows||[];
    const timedRows=timedSection.rows||[];
    const printedHalfCycles=((experiment.summary||{}).vibration_periods||[]).map(item=>duration(item.value)).filter(Number.isFinite);
    const fallbackHalfCycle=median(printedHalfCycles)||420;

    function normalizeForward(raw,reference){
      if(!Number.isFinite(raw)) return null;
      if(!Number.isFinite(reference)) return raw;
      let value=normalizeClock(raw,reference);
      while(value<reference-1) value+=43200;
      return value;
    }

    const staticDirect=[];
    let staticReference=null;
    initialRows.forEach((row,rowIndex)=>{
      const value=num(row.divisions);
      const raw=hms(row.time_hms);
      if(!Number.isFinite(value)||!Number.isFinite(raw)) return;
      const abs=normalizeForward(raw,staticReference);
      staticReference=abs;
      staticDirect.push({row,rowIndex,value,abs,original_time:row.time_hms||''});
    });

    const middleMarkers=[];
    let markerReference=staticReference;
    timedRows.forEach((row,rowIndex)=>{
      const raw=hms(row.time_of_mid_vibration);
      if(!Number.isFinite(raw)) return;
      const abs=normalizeForward(raw,markerReference);
      markerReference=abs;
      middleMarkers.push({
        marker_id:`${experiment.data_key}-MID-${String(middleMarkers.length+1).padStart(2,'0')}`,
        row_id:row.row_id||'',
        row_index:rowIndex,
        phase:rowIndex+0.5,
        abs_time_s:abs,
        historical_time_hms:formatHms(abs),
        historical_time_original:row.time_of_mid_vibration||'',
        value_basis:'printed_time_of_middle_of_vibration',
        historical_time_claim:true
      });
    });
    if(!middleMarkers.length) throw new Error(`${experiment.data_key}: crossing-time reconstruction requires printed middle-vibration times`);

    function slopeBetween(left,right){
      const phaseSpan=Number(right.phase)-Number(left.phase);
      const timeSpan=Number(right.abs_time_s)-Number(left.abs_time_s);
      return phaseSpan>0&&timeSpan>0?timeSpan/phaseSpan:fallbackHalfCycle;
    }
    function phaseTimeAt(phase){
      const p=Number(phase);
      if(middleMarkers.length===1) return middleMarkers[0].abs_time_s+(p-middleMarkers[0].phase)*fallbackHalfCycle;
      if(p<=middleMarkers[0].phase){
        const slope=slopeBetween(middleMarkers[0],middleMarkers[1]);
        return middleMarkers[0].abs_time_s+(p-middleMarkers[0].phase)*slope;
      }
      for(let index=0;index<middleMarkers.length-1;index+=1){
        const left=middleMarkers[index];
        const right=middleMarkers[index+1];
        if(p<=right.phase){
          const ratio=(p-left.phase)/(right.phase-left.phase);
          return left.abs_time_s+(right.abs_time_s-left.abs_time_s)*ratio;
        }
      }
      const last=middleMarkers[middleMarkers.length-1];
      const previous=middleMarkers[middleMarkers.length-2];
      const slope=slopeBetween(previous,last);
      return last.abs_time_s+(p-last.phase)*slope;
    }

    const directCrossings=[];
    timedRows.forEach((row,rowIndex)=>{
      const marker=middleMarkers.find(item=>item.row_index===rowIndex);
      const reference=marker?marker.abs_time_s:phaseTimeAt(rowIndex+0.5);
      (row.division_crossings||[]).forEach((crossing,crossingIndex)=>{
        const value=num(crossing.division);
        const raw=hms(crossing.time_hms);
        if(!Number.isFinite(value)||!Number.isFinite(raw)) return;
        const abs=normalizeClock(raw,reference);
        directCrossings.push({
          id:`${experiment.data_key}-CROSS-${String(directCrossings.length+1).padStart(3,'0')}`,
          row,rowIndex,crossingIndex,value,abs,
          original_time:crossing.time_hms||''
        });
      });
    });

    const clockValues=staticDirect.map(item=>item.abs)
      .concat(middleMarkers.map(item=>item.abs_time_s))
      .concat(directCrossings.map(item=>item.abs))
      .filter(Number.isFinite);
    const directValueClockValues=staticDirect.map(item=>item.abs)
      .concat(directCrossings.map(item=>item.abs))
      .filter(Number.isFinite);
    const edgeClockValues=directValueClockBounds&&directValueClockValues.length?directValueClockValues:clockValues;
    const startAbs=Math.min(...edgeClockValues);
    const endAbs=Math.max(...edgeClockValues);
    const spanAbs=Math.max(1,endAbs-startAbs);
    function playbackFromAbs(absTime){return ((Number(absTime)-startAbs)/spanAbs)*PLAYBACK_DURATION_S;}
    function historicalAbsAt(playbackTime){
      const t=Math.max(0,Math.min(PLAYBACK_DURATION_S,Number(playbackTime)||0));
      return startAbs+(t/PLAYBACK_DURATION_S)*spanAbs;
    }

    const extremeSlots=timedRows.map((row,rowIndex)=>({
      row,rowIndex,
      value:num(row.extreme_point),
      abs_time_s:phaseTimeAt(rowIndex),
      phase:rowIndex,
      missed:!Number.isFinite(num(row.extreme_point))&&/missed/i.test(String(row.observation_note||row.raw_text||''))
    }));

    const firstPostClock=Math.min(...middleMarkers.map(item=>item.abs_time_s).concat(directCrossings.map(item=>item.abs)).filter(Number.isFinite));
    const lastPreClock=staticDirect.length?Math.max(...staticDirect.map(item=>item.abs)):null;
    const firstReconstructedPostMoveExtreme=extremeSlots.find(slot=>Number.isFinite(slot.value)&&Number.isFinite(slot.abs_time_s)&&(!Number.isFinite(lastPreClock)||slot.abs_time_s>lastPreClock));
    const transitionEndAbs=reconstructedTransitionUpperBound&&firstReconstructedPostMoveExtreme
      ? firstReconstructedPostMoveExtreme.abs_time_s
      : firstPostClock;
    const transitionRange=Number.isFinite(lastPreClock)&&Number.isFinite(transitionEndAbs)&&transitionEndAbs>lastPreClock
      ? {
          transition_id:`${experiment.data_key}-TRANSITION-01`,
          from_position:initialSection.mass_position||'unknown',
          to_position:timedSection.mass_position||'unknown',
          start_abs_s:lastPreClock,
          end_abs_s:transitionEndAbs,
          playback_start_s:playbackFromAbs(lastPreClock),
          playback_end_s:playbackFromAbs(transitionEndAbs),
          start_hms:formatHms(lastPreClock),
          end_hms:formatHms(transitionEndAbs),
          time_status:reconstructedTransitionUpperBound?'lower_bound_direct_pre_move_upper_bound_reconstructed_first_post_move_extreme':'bounded_by_pre_move_direct_and_post_move_clock',
          end_boundary_basis:reconstructedTransitionUpperBound?'reconstructed_first_post_move_extreme_time':'historical_post_move_clock',
          end_boundary_historical_claim:!reconstructedTransitionUpperBound,
          end_boundary_label_ja:reconstructedTransitionUpperBound?(semantics.transition_end_boundary_label_ja||'再構成による上限'):'',
          display_label_ja:semantics.transition_display_label_ja||'配置時刻不明',
          end_exclusive:Boolean(reconstructedTransitionUpperBound),
          time_uncertain:true,
          source_class:'historical_transition_interval',
          provenance_layer:'reconstruction'
        }
      : null;

    const middleMarkerByRow=new Map(middleMarkers.map(marker=>[marker.row_index,marker]));
    const reconstructionSegments=[];
    for(let index=0;index<extremeSlots.length-1;index+=1){
      const left=extremeSlots[index];
      const right=extremeSlots[index+1];
      if(!Number.isFinite(left.value)||!Number.isFinite(right.value)) continue;
      let segmentStart=left.abs_time_s;
      const segmentEnd=right.abs_time_s;
      if(transitionRange&&segmentStart<transitionRange.end_abs_s) segmentStart=Math.max(segmentStart,transitionRange.end_abs_s);
      const clippedStart=Math.max(startAbs,segmentStart);
      const clippedEnd=Math.min(endAbs,segmentEnd);
      if(clippedEnd<=clippedStart+0.001) continue;
      const exactMiddle=middleMarkerByRow.get(index)||null;
      const exactMiddleInside=Boolean(exactMiddle&&exactMiddle.abs_time_s>left.abs_time_s&&exactMiddle.abs_time_s<right.abs_time_s);
      reconstructionSegments.push({
        segment_id:`${experiment.data_key}-RECON-${String(reconstructionSegments.length+1).padStart(3,'0')}`,
        left_row_id:left.row.row_id||'',
        right_row_id:right.row.row_id||'',
        phase_start:left.phase,
        phase_end:right.phase,
        model_start_abs_s:left.abs_time_s,
        model_end_abs_s:right.abs_time_s,
        display_start_abs_s:clippedStart,
        display_end_abs_s:clippedEnd,
        middle_marker_id:exactMiddleInside?exactMiddle.marker_id:null,
        middle_marker_abs_s:exactMiddleInside?exactMiddle.abs_time_s:null,
        playback_start_s:playbackFromAbs(clippedStart),
        playback_end_s:playbackFromAbs(clippedEnd),
        wave_visible:true,
        line_kind:'crossing_time_reconstruction',
        placement_basis:exactMiddleInside?'printed_middle_vibration_exact_phase_constraint':'printed_middle_vibration_phase_interpolation',
        main_clock_visible:true,
        historical_time_claim:false,
        equation:exactMiddleInside
          ? 'piecewise half-cosine: y(t_mid)=(y0+y1)/2 at printed middle-vibration time'
          : 'y(t)=mid+(y0-y1)/2*cos(pi*(t-t0)/(t1-t0))'
      });
    }

    function segmentValueAtAbs(abs){
      if(transitionRange&&abs>=transitionRange.start_abs_s&&abs<transitionRange.end_abs_s) return null;
      for(let index=0;index<extremeSlots.length-1;index+=1){
        const left=extremeSlots[index];
        const right=extremeSlots[index+1];
        if(!Number.isFinite(left.value)||!Number.isFinite(right.value)) continue;
        if(abs<left.abs_time_s-0.001||abs>right.abs_time_s+0.001) continue;
        const midpoint=(left.value+right.value)/2;
        const exactMiddle=middleMarkerByRow.get(index)||null;
        if(exactMiddle&&exactMiddle.abs_time_s>left.abs_time_s&&exactMiddle.abs_time_s<right.abs_time_s){
          if(abs<=exactMiddle.abs_time_s){
            const ratio=Math.max(0,Math.min(1,(abs-left.abs_time_s)/Math.max(0.001,exactMiddle.abs_time_s-left.abs_time_s)));
            return midpoint+(left.value-midpoint)*Math.cos((Math.PI/2)*ratio);
          }
          const ratio=Math.max(0,Math.min(1,(abs-exactMiddle.abs_time_s)/Math.max(0.001,right.abs_time_s-exactMiddle.abs_time_s)));
          return midpoint+(right.value-midpoint)*Math.sin((Math.PI/2)*ratio);
        }
        const ratio=Math.max(0,Math.min(1,(abs-left.abs_time_s)/Math.max(0.001,right.abs_time_s-left.abs_time_s)));
        return midpoint+(left.value-right.value)*0.5*Math.cos(Math.PI*ratio);
      }
      return null;
    }
    function valueAt(playbackTime){return segmentValueAtAbs(historicalAbsAt(playbackTime));}
    function isWaveDefinedAt(playbackTime){return Number.isFinite(Number(valueAt(playbackTime)));}

    const sourceValues=[];
    sections.forEach(section=>(section.rows||[]).forEach(row=>{
      [row.extreme_point,row.divisions,row.point_of_rest].forEach(value=>{const parsed=num(value);if(Number.isFinite(parsed)) sourceValues.push(parsed);});
      (row.division_crossings||[]).forEach(crossing=>{const parsed=num(crossing.division);if(Number.isFinite(parsed)) sourceValues.push(parsed);});
    }));
    const rawMin=Math.min(...sourceValues);
    const rawMax=Math.max(...sourceValues);
    const rawSpan=Math.max(1,rawMax-rawMin);
    const scaleMin=rawMin-rawSpan*0.08;
    const scaleMax=rawMax+rawSpan*0.08;
    const scaleCenter=(scaleMin+scaleMax)/2;
    const scaleHalf=(scaleMax-scaleMin)/2;
    function yAtValue(value){return 177-((Number(value)-scaleMin)/Math.max(1e-9,scaleMax-scaleMin))*144;}
    function visualOffsetAt(playbackTime){
      const value=valueAt(playbackTime);
      return Number.isFinite(Number(value))?((Number(value)-scaleCenter)/Math.max(1e-9,scaleHalf))*36:0;
    }

    const anchors=[];
    let sequence=0;
    function addAnchor(row,sectionIndex,section,value,kind,extra){
      sequence+=1;
      anchors.push(Object.assign({
        anchor_id:`${experiment.data_key}-ANCHOR-${String(sequence).padStart(3,'0')}`,
        row_id:row.row_id||`${experiment.data_key}-ROW-${String(sequence).padStart(3,'0')}`,
        section_index:sectionIndex,
        section_label:section.label||'',
        position:section.mass_position||'unknown',
        value:Number(value),
        value_kind:kind,
        value_class:'historical_direct_value',
        source_page:row.source_page||(section.source_pages||[]).join('–')||(experiment.source_pages||[]).join('–'),
        source_type:row.source_type||'historical',
        verification:row.verification||'visual_check_passed',
        raw_text:row.raw_text||'',
        summary_eligible:false,
        source_ordinal:0
      },extra||{}));
    }

    initialRows.forEach((row,rowIndex)=>{
      const extreme=num(row.extreme_point);
      if(Number.isFinite(extreme)){
        addAnchor(row,0,initialSection,extreme,'extreme_point',{
          phase_order:rowIndex+1,
          time_basis:'untimed_extreme_order',
          source_class:'historical_direct_value__untimed_extreme_order',
          playback_time_s:null,
          record_trigger_s:0,
          historical_time_hms:'',
          observation_note:'移動前区間の極値。時計時刻は原表に記録されていないため、時計軸外で記録順だけを保持。'
        });
      }
    });
    staticDirect.forEach(item=>{
      addAnchor(item.row,0,initialSection,item.value,'division_reading',{
        abs_time_s:item.abs,
        historical_time_hms:formatHms(item.abs),
        historical_time_original:item.original_time,
        time_basis:'historical_direct_time',
        source_class:'historical_direct_value__historical_direct_time',
        playback_time_s:playbackFromAbs(item.abs),
        record_trigger_s:playbackFromAbs(item.abs),
        observation_note:'原表にdivisionとclock timeが同じ行で記録された移動前の直接読取。',
        summary_eligible:true
      });
    });
    directCrossings.forEach(item=>{
      addAnchor(item.row,1,timedSection,item.value,'division_crossing',{
        source_ordinal:item.crossingIndex,
        abs_time_s:item.abs,
        historical_time_hms:formatHms(item.abs),
        historical_time_original:item.original_time,
        time_basis:'historical_direct_time',
        source_class:'historical_direct_value__historical_direct_time',
        playback_time_s:playbackFromAbs(item.abs),
        record_trigger_s:playbackFromAbs(item.abs),
        observation_note:'原表にdivision通過値とclock timeが記録された直接時計イベント。極値時刻ではない。',
        summary_eligible:false
      });
    });
    extremeSlots.forEach(slot=>{
      if(!Number.isFinite(slot.value)) return;
      const inside=slot.abs_time_s>=startAbs-0.001&&slot.abs_time_s<=endAbs+0.001;
      addAnchor(slot.row,1,timedSection,slot.value,'extreme_point',inside?{
        abs_time_s:slot.abs_time_s,
        historical_time_hms:formatHms(slot.abs_time_s),
        historical_time_original:'',
        time_basis:'reconstructed_extreme_time_from_middle_vibration',
        source_class:'historical_direct_value__reconstructed_extreme_time',
        playback_time_s:playbackFromAbs(slot.abs_time_s),
        record_trigger_s:playbackFromAbs(slot.abs_time_s),
        phase_order:slot.phase+1,
        observation_note:'極値は史実読取値。時計時刻は原表の振動中央時刻を位相拘束として再構成した推定値で、史実直接時刻ではない。',
        summary_eligible:false
      }:{
        phase_order:slot.phase+1,
        time_basis:'untimed_extreme_order',
        source_class:'historical_direct_value__untimed_extreme_order_outside_clock_bounds',
        playback_time_s:null,
        record_trigger_s:0,
        historical_time_hms:'',
        observation_note:'時計軸の確認済み範囲外にある極値。値と記録順だけを保持し、推定時刻の点は表示しない。'
      });
    });
    anchors.sort((a,b)=>(Number(a.record_trigger_s)||0)-(Number(b.record_trigger_s)||0)||(Number(a.phase_order)||0)-(Number(b.phase_order)||0)||String(a.anchor_id).localeCompare(String(b.anchor_id)));
    const reconstructionRecords=attachAnchorProvenance(experiment,anchors);

    const missedObservationRanges=[];
    extremeSlots.forEach((slot,index)=>{
      if(!slot.missed) return;
      let before=null,after=null;
      for(let i=index-1;i>=0;i-=1){if(Number.isFinite(extremeSlots[i].value)){before=extremeSlots[i];break;}}
      for(let i=index+1;i<extremeSlots.length;i+=1){if(Number.isFinite(extremeSlots[i].value)){after=extremeSlots[i];break;}}
      if(!before||!after) return;
      const rangeStart=Math.max(startAbs,before.abs_time_s);
      const rangeEnd=Math.min(endAbs,after.abs_time_s);
      if(rangeEnd<=rangeStart) return;
      const singleExtremeStart=Math.max(rangeStart,(before.abs_time_s+slot.abs_time_s)/2);
      const singleExtremeEnd=Math.min(rangeEnd,(slot.abs_time_s+after.abs_time_s)/2);
      missedObservationRanges.push({
        gap_id:`${experiment.data_key}-MISSED-${String(missedObservationRanges.length+1).padStart(2,'0')}`,
        row_id:slot.row.row_id||'',
        before_row_id:before.row.row_id||'',
        after_row_id:after.row.row_id||'',
        missed_extreme_count:1,
        display_label_ja:'欠測 1極値',
        start_abs_s:rangeStart,
        end_abs_s:rangeEnd,
        display_start_abs_s:edgeRepairEnabled?singleExtremeStart:rangeStart,
        display_end_abs_s:edgeRepairEnabled?singleExtremeEnd:rangeEnd,
        playback_start_s:playbackFromAbs(rangeStart),
        playback_end_s:playbackFromAbs(rangeEnd),
        start_hms:formatHms(rangeStart),
        end_hms:formatHms(rangeEnd),
        display_start_hms:formatHms(edgeRepairEnabled?singleExtremeStart:rangeStart),
        display_end_hms:formatHms(edgeRepairEnabled?singleExtremeEnd:rangeEnd),
        display_style:edgeRepairEnabled?'single_extreme_bracket':'interval_bracket',
        time_status:'reconstructed_bounds_from_adjacent_extreme_phase',
        source_class:'historical_missed_row_reconstruction_gap'
      });
    });

    const positionStats=sections.map((section,index)=>{
      const rows=section.rows||[];
      let values=rows.map(row=>num(row.point_of_rest)).filter(Number.isFinite);
      if(!values.length) values=rows.map(row=>num(row.divisions)).filter(Number.isFinite);
      if(!values.length) values=rows.map(row=>num(row.extreme_point)).filter(Number.isFinite);
      return {section_index:index,position:section.mass_position||'unknown',count:values.length,average:mean(values),equilibrium:median(values)};
    });
    const motion=((experiment.summary||{}).motions||[])[0]||{};
    const motionValue=num(motion.value);
    const transitionStats=[{
      from_position:initialSection.mass_position||'unknown',
      to_position:timedSection.mass_position||'unknown',
      from_value:positionStats[0]&&positionStats[0].average,
      to_value:positionStats[1]&&positionStats[1].average,
      average_difference:Number.isFinite(Number(positionStats[0]&&positionStats[0].average))&&Number.isFinite(Number(positionStats[1]&&positionStats[1].average))?Number(positionStats[1].average)-Number(positionStats[0].average):null,
      result_value:Number.isFinite(motionValue)?motionValue:((positionStats[1]&&positionStats[1].average)-(positionStats[0]&&positionStats[0].average)),
      result_source:Number.isFinite(motionValue)?'historical_summary_motion':'calculated_position_average_difference'
    }];
    const applicationCalculationRecords=buildApplicationCalculationRecords(experiment,positionStats,transitionStats);

    const targetPosition=timedSection.mass_position||'unknown';
    function sectionAt(playbackTime){
      const t=Math.max(0,Math.min(PLAYBACK_DURATION_S,Number(playbackTime)||0));
      if(transitionRange){
        if(t<transitionRange.playback_start_s) return {index:0,position:initialSection.mass_position||'unknown',label:initialSection.label||'',switching:false,unresolved:false,time_uncertain:false,progress:1,source_class:'historical_direct_section'};
        if(transitionRange.end_exclusive?t<transitionRange.playback_end_s-1e-9:t<=transitionRange.playback_end_s){
          const progress=(t-transitionRange.playback_start_s)/Math.max(0.001,transitionRange.playback_end_s-transitionRange.playback_start_s);
          return {index:0,position:initialSection.mass_position||'unknown',label:'配置変更時刻不確定',switching:true,unresolved:false,time_uncertain:true,historical_time_range:`${transitionRange.start_hms}〜${transitionRange.end_hms}`,from_position:initialSection.mass_position||'unknown',to_position:targetPosition,progress,source_class:'historical_transition_interval'};
        }
      }
      return {index:1,position:targetPosition,label:timedSection.label||'',switching:false,unresolved:false,time_uncertain:false,progress:1,source_class:'historical_timed_section'};
    }
    function massFrameAt(playbackTime){return sectionAt(playbackTime);}
    function frameAt(playbackTime){
      const abs=historicalAbsAt(playbackTime);
      const value=valueAt(playbackTime);
      const section=sectionAt(playbackTime);
      return {
        playback_time_s:Number(playbackTime)||0,
        historical_abs_time_s:abs,
        historical_time_hms:formatHms(abs),
        read_value:value,
        read_div:Number.isFinite(Number(value))?Number(value).toFixed(3):'—',
        visual_offset_px:Number.isFinite(Number(value))?visualOffsetAt(playbackTime):0,
        wave_defined:Number.isFinite(Number(value)),
        position:section.position,
        position_label:section.label,
        switching:Boolean(section.switching),
        unresolved:false,
        time_uncertain:Boolean(section.time_uncertain),
        historical_time_range:section.historical_time_range||'',
        from_position:section.from_position||null,
        to_position:section.to_position||section.position,
        progress:Number(section.progress)||0,
        source_class:section.source_class||'crossing_time_reconstruction'
      };
    }

    const flowStages=[];
    if(transitionRange){
      flowStages.push(timelineStage(0,`${positionShort(initialSection.mass_position)}配置読取`,'移動前の時計付き静止読取','historical_direct_section',compactClockLabel(formatHms(startAbs)),'observation_start','史実時計時刻'));
      const rangeLabel=compactClockRange(transitionRange.start_hms,transitionRange.end_hms)+(transitionRange.end_boundary_historical_claim?'':'*');
      flowStages.push(timelineStage(transitionRange.playback_start_s,'配置変更時刻不確定',transitionRange.end_boundary_label_ja?`${transitionRange.start_hms}から${transitionRange.end_hms}（${transitionRange.end_boundary_label_ja}）までの間に配置変更`:`${transitionRange.start_hms}〜${transitionRange.end_hms}の間に配置変更`,'historical_transition_interval',rangeLabel,'transition_uncertain',transitionRange.end_boundary_label_ja||'史実時計による上下限'));
      flowStages.push(timelineStage(transitionRange.playback_end_s,`${positionShort(targetPosition)}配置観測`,'移動後の交差時刻型観測を開始',transitionRange.end_boundary_historical_claim?'historical_direct_time':'reconstructed_transition_upper_bound',compactClockLabel(transitionRange.end_hms)+(transitionRange.end_boundary_historical_claim?'':'*'),'observation_resume',transitionRange.end_boundary_label_ja||'史実時計時刻'));
    }else{
      flowStages.push(timelineStage(0,`${positionShort(targetPosition)}配置観測`,'最初の直接時計付き目盛通過から時計軸を開始。移動前値は時計軸外で記録順を保持','historical_direct_time',compactClockLabel(formatHms(startAbs)),'observation_start','史実時計時刻'));
    }
    missedObservationRanges.forEach(range=>{
      const displayStart=range.display_start_abs_s;
      const displayEnd=range.display_end_abs_s;
      flowStages.push(timelineStage(playbackFromAbs(displayStart),range.display_label_ja||'欠測',`${range.display_start_hms}〜${range.display_end_hms}は原表のmissed行から再構成した欠測範囲。前後を接続しない`,range.source_class,compactClockRange(range.display_start_hms,range.display_end_hms)+'*','missed_reconstructed','再構成した欠測範囲'));
      flowStages.push(timelineStage(playbackFromAbs(displayEnd),'観測再開','欠測範囲の後から再構成波形を再開','reconstructed_extreme_time_from_middle_vibration',compactClockLabel(range.display_end_hms)+'*','observation_resume','再構成時刻'));
    });
    flowStages.push(timelineStage(PLAYBACK_DURATION_S,'観測終了','最後の直接時計付き目盛通過までを表示','historical_direct_time',compactClockLabel(formatHms(endAbs)),'end','史実時計時刻'));
    flowStages.sort((a,b)=>a.time-b.time||String(a.timeline_kind).localeCompare(String(b.timeline_kind)));

    const waveSegments=reconstructionSegments.map(segment=>Object.freeze(Object.assign({},segment)));
    const reconstructionSegmentRecords=freezeReconstructionSegments(experiment,reconstructionSegments.map(segment=>Object.assign({},segment,{reconstruction_kind:'crossing_time_half_cycle_curve'})));
    const crossingChecks=directCrossings.map(item=>{
      const predicted=segmentValueAtAbs(item.abs);
      const residual=Number.isFinite(Number(predicted))?Number(predicted)-item.value:null;
      return Object.freeze({row_id:item.row.row_id||'',source_ordinal:item.crossingIndex,historical_time_hms:formatHms(item.abs),observed_value:item.value,predicted_value:predicted,residual,absolute_residual:Number.isFinite(Number(residual))?Math.abs(residual):null,interpretation:'same_source_internal_check_not_independent_validation'});
    });
    const sourceCounts=anchors.reduce((acc,anchor)=>{const key=`${anchor.value_class||'unknown'} / ${anchor.time_basis||'unknown'}`;acc[key]=(acc[key]||0)+1;return acc;},{});
    const placementSections=transitionRange?[
      {index:0,position:initialSection.mass_position||'unknown',label:initialSection.label||'',start_time_s:0,end_time_s:transitionRange.playback_start_s,equilibrium:positionStats[0]&&positionStats[0].equilibrium,switching:false,unresolved:false,time_uncertain:false,source_class:'historical_direct_section'},
      {index:1,position:targetPosition,label:timedSection.label||'',start_time_s:transitionRange.playback_end_s,end_time_s:PLAYBACK_DURATION_S,equilibrium:positionStats[1]&&positionStats[1].equilibrium,switching:false,unresolved:false,time_uncertain:false,source_class:'historical_timed_section'}
    ]:[
      {index:1,position:targetPosition,label:timedSection.label||'',start_time_s:0,end_time_s:PLAYBACK_DURATION_S,equilibrium:positionStats[1]&&positionStats[1].equilibrium,switching:false,unresolved:false,time_uncertain:false,source_class:'historical_timed_section'}
    ];

    return Object.freeze({
      experiment_id:experiment.id,
      data_key:experiment.data_key,
      label:experiment.label,
      date_iso:experiment.date_iso,
      date_label:experiment.date_label,
      source_pages:experiment.source_pages||[],
      playback_duration_s:PLAYBACK_DURATION_S,
      historical_start_abs_s:startAbs,
      historical_end_abs_s:endAbs,
      historical_start_hms:formatHms(startAbs),
      historical_end_hms:formatHms(endAbs),
      historical_span_s:spanAbs,
      period_seconds:fallbackHalfCycle,
      half_cycle_seconds:fallbackHalfCycle,
      historical_source_records:layer.source_records,
      historical_calculation_records:layer.historical_calculation_records,
      application_calculation_records:applicationCalculationRecords,
      reconstruction_records:Object.freeze(reconstructionRecords.concat(reconstructionSegmentRecords)),
      reconstruction_segments:Object.freeze(reconstructionSegments.map(item=>Object.freeze(Object.assign({},item)))),
      reconstruction_extrema:Object.freeze(extremeSlots.map(item=>Object.freeze({row_id:item.row.row_id||'',row_index:item.rowIndex,value:item.value,phase:item.phase,reconstructed_abs_time_s:item.abs_time_s,reconstructed_time_hms:formatHms(item.abs_time_s),missed:item.missed,historical_time_claim:false}))),
      middle_phase_markers:Object.freeze(middleMarkers.map(item=>Object.freeze(item))),
      direct_crossing_events:Object.freeze(directCrossings.map(item=>Object.freeze({row_id:item.row.row_id||'',source_ordinal:item.crossingIndex,value:item.value,abs_time_s:item.abs,historical_time_hms:formatHms(item.abs),historical_time_claim:true}))),
      crossing_closure_checks:Object.freeze(crossingChecks),
      common_structure_build:OBSERVATION_STRUCTURE.build||'missing',
      data_layer_status:'crossing_time_reconstruction_from_printed_middle_vibration_and_division_crossings',
      clock_axis_policy:'目盛通過時刻と原表記載の振動中央時刻だけを史実時計値として使用する。極値時刻は位相補間で再構成し、史実直接時刻として扱わない。',
      connection_policy:'隣接する記録済み極値間だけを半余弦で再構成する。missed行、配置変更不確定区間、時計軸外をまたいで接続しない。',
      observation_clock_bounds:Object.freeze({start_confirmed:true,end_confirmed:true}),
      anchors:Object.freeze(anchors.map(anchor=>Object.freeze(anchor))),
      wave_anchors:Object.freeze(anchors.filter(anchor=>anchor.value_kind==='division_crossing'||(anchor.value_kind==='extreme_point'&&anchor.time_basis==='reconstructed_extreme_time_from_middle_vibration')).map(anchor=>Object.freeze(anchor))),
      wave_segments:Object.freeze(waveSegments),
      sections:Object.freeze(placementSections.map(item=>Object.freeze(item))),
      placement_sections:Object.freeze(placementSections.map(item=>Object.freeze(item))),
      transitions:Object.freeze(transitionRange?[Object.freeze(Object.assign({},transitionRange))]:[]),
      transition_uncertainty_ranges:Object.freeze(transitionRange?[Object.freeze(Object.assign({},transitionRange))]:[]),
      missed_observation_ranges:Object.freeze(missedObservationRanges.map(item=>Object.freeze(item))),
      connection_decisions:Object.freeze(reconstructionSegments.map(item=>Object.freeze({from_row_id:item.left_row_id,to_row_id:item.right_row_id,decision:'connect_reconstructed_half_cycle',reason:'adjacent recorded extrema constrained by printed middle-vibration phase'}))),
      position_stats:Object.freeze(positionStats.map(item=>Object.freeze(item))),
      transition_stats:Object.freeze(transitionStats.map(item=>Object.freeze(item))),
      flow_stages:Object.freeze(flowStages.map(item=>Object.freeze(item))),
      source_counts:Object.freeze(sourceCounts),
      crossing_time_reconstruction:true,
      clock_axis_outside_marker_policy:edgeRepairEnabled?'hide_order_only_on_main_axis':'legacy',
      clock_axis_segment_mapping:visibleHistoricalSegmentBounds?'visible_historical_bounds':'legacy_model_bounds',
      clock_axis_edge_basis:directValueClockBounds?'direct_value_clock_bounds':'all_printed_clock_values',
      scale:Object.freeze({min:scaleMin,max:scaleMax,center:scaleCenter,half:scaleHalf}),
      valueAt,
      isWaveDefinedAt,
      visualOffsetAt,
      yAtValue,
      historicalAbsAt,
      sectionAt,
      massFrameAt,
      frameAt
    });
  }

  function buildMultiSectionCrossingTimeProfile(experiment,semantics){
    const layer=layerFor(experiment);
    const edgeRepairEnabled=semantics.clock_axis_outside_marker_policy==='hide_order_only_on_main_axis';
    const visibleHistoricalSegmentBounds=semantics.clock_axis_segment_mapping==='visible_historical_bounds';
    const directValueClockBounds=semantics.clock_axis_edge_basis==='direct_value_clock_bounds';
    const sections=experiment.sections||[];
    const configByIndex=new Map((semantics.section_modes||[]).map(item=>[Number(item.section_index),item]));
    const printedPeriods=((experiment.summary||{}).vibration_periods||[]).map(item=>({position:String(item.position||''),seconds:duration(item.value)})).filter(item=>Number.isFinite(item.seconds));
    const fallbackHalfCycle=median(printedPeriods.map(item=>item.seconds))||420;
    function halfCycleFor(position){
      const exact=printedPeriods.find(item=>item.position===position);
      return exact?exact.seconds:fallbackHalfCycle;
    }
    function inferMode(section){
      const rows=section&&section.rows||[];
      if(rows.some(row=>Number.isFinite(num(row.divisions))&&Number.isFinite(hms(row.time_hms)))) return 'static_direct';
      if(rows.some(row=>Number.isFinite(hms(row.time_of_mid_vibration))||(Array.isArray(row.division_crossings)&&row.division_crossings.length))) return 'timed_crossing';
      return 'order_only';
    }
    function normalizeLocalForward(raw,reference){
      if(!Number.isFinite(raw)) return null;
      if(!Number.isFinite(reference)) return raw;
      let value=normalizeClock(raw,reference);
      while(value<reference-1) value+=43200;
      return value;
    }
    function minimumInterveningDuration(previousIndex,currentIndex){
      let total=0;
      for(let index=previousIndex+1;index<currentIndex;index+=1){
        const section=sections[index]||{};
        const values=(section.rows||[]).map(row=>num(row.extreme_point)).filter(Number.isFinite);
        if(values.length>1) total+=(values.length-1)*halfCycleFor(section.mass_position||'');
      }
      return total;
    }
    function chooseClockShift(firstLocal,previousClockEnd,minimumGap){
      if(!Number.isFinite(firstLocal)||!Number.isFinite(previousClockEnd)) return 0;
      let shift=0;
      while(firstLocal+shift<previousClockEnd+Math.max(0,Number(minimumGap)||0)-1) shift+=43200;
      return shift;
    }

    const models=sections.map((section,sectionIndex)=>{
      const config=configByIndex.get(sectionIndex)||{};
      return {
        section_index:sectionIndex,
        section,
        label:section.label||positionLabel(section.mass_position),
        position:section.mass_position||'unknown',
        mode:config.mode||inferMode(section),
        rows:section.rows||[],
        config,
        static_direct:[],
        order_slots:[],
        extreme_slots:[],
        middle_markers:[],
        direct_crossings:[],
        half_cycle_seconds:halfCycleFor(section.mass_position||''),
        first_direct_abs:null,
        last_direct_abs:null,
        first_extreme_abs:null,
        last_extreme_abs:null
      };
    });

    let previousClockEnd=null;
    let previousClockedIndex=null;
    let middleSequence=0;
    let crossingSequence=0;
    models.forEach(model=>{
      const rows=model.rows;
      if(model.mode==='order_only'){
        rows.forEach((row,rowIndex)=>{
          const value=num(row.extreme_point);
          if(!Number.isFinite(value)) return;
          model.order_slots.push({row,rowIndex,value,phase:model.order_slots.length});
        });
        return;
      }
      if(model.mode==='static_direct'){
        let reference=null;
        const local=[];
        rows.forEach((row,rowIndex)=>{
          const value=num(row.divisions);
          const raw=hms(row.time_hms);
          if(!Number.isFinite(value)||!Number.isFinite(raw)) return;
          const abs=normalizeLocalForward(raw,reference);
          reference=abs;
          local.push({row,rowIndex,value,local_abs:abs,original_time:row.time_hms||''});
        });
        if(!local.length) return;
        const minGap=Number.isFinite(previousClockedIndex)?minimumInterveningDuration(previousClockedIndex,model.section_index):0;
        const shift=chooseClockShift(local[0].local_abs,previousClockEnd,minGap);
        model.static_direct=local.map(item=>Object.assign({},item,{abs:item.local_abs+shift}));
        model.first_direct_abs=model.static_direct[0].abs;
        model.last_direct_abs=model.static_direct[model.static_direct.length-1].abs;
        previousClockEnd=model.last_direct_abs;
        previousClockedIndex=model.section_index;
        return;
      }

      const rowToSlot=new Map();
      rows.forEach((row,rowIndex)=>{
        const value=num(row.extreme_point);
        const missed=!Number.isFinite(value)&&/missed/i.test(String(row.observation_note||row.raw_text||''));
        if(!Number.isFinite(value)&&!missed) return;
        const slot={row,rowIndex,value,missed,phase:model.extreme_slots.length,abs_time_s:null};
        model.extreme_slots.push(slot);
        rowToSlot.set(rowIndex,slot);
      });
      let localMarkerReference=null;
      const localMarkers=[];
      rows.forEach((row,rowIndex)=>{
        const raw=hms(row.time_of_mid_vibration);
        if(!Number.isFinite(raw)) return;
        const abs=normalizeLocalForward(raw,localMarkerReference);
        localMarkerReference=abs;
        const own=rowToSlot.get(rowIndex);
        let leftSlotIndex=own?own.phase:null;
        if(!Number.isFinite(leftSlotIndex)){
          for(let index=rowIndex-1;index>=0;index-=1){
            const previous=rowToSlot.get(index);
            if(previous){leftSlotIndex=previous.phase;break;}
          }
        }
        if(!Number.isFinite(leftSlotIndex)||leftSlotIndex>=model.extreme_slots.length-1) return;
        middleSequence+=1;
        localMarkers.push({
          marker_id:`${experiment.data_key}-MID-${String(middleSequence).padStart(3,'0')}`,
          row_id:row.row_id||'',
          row_index:rowIndex,
          left_slot_index:leftSlotIndex,
          phase:leftSlotIndex+0.5,
          local_abs:abs,
          historical_time_original:row.time_of_mid_vibration||'',
          value_basis:'printed_time_of_middle_of_vibration',
          historical_time_claim:true
        });
      });
      if(!localMarkers.length) throw new Error(`${experiment.data_key}: section ${model.section_index+1} requires printed middle-vibration times`);
      const rawDirect=[];
      rows.forEach((row,rowIndex)=>{
        const marker=localMarkers.find(item=>item.row_index===rowIndex)||null;
        (row.division_crossings||[]).forEach((crossing,crossingIndex)=>{
          const value=num(crossing.division);
          const raw=hms(crossing.time_hms);
          if(!Number.isFinite(value)||!Number.isFinite(raw)) return;
          let localAbs=marker?normalizeClock(raw,marker.local_abs):normalizeLocalForward(raw,localMarkerReference);
          if(Number.isFinite(marker&&marker.local_abs)){
            while(localAbs-marker.local_abs>21600) localAbs-=43200;
            while(marker.local_abs-localAbs>21600) localAbs+=43200;
          }
          rawDirect.push({row,rowIndex,crossingIndex,value,local_abs:localAbs,original_time:crossing.time_hms||''});
        });
      });
      const localClockValues=localMarkers.map(item=>item.local_abs).concat(rawDirect.map(item=>item.local_abs)).filter(Number.isFinite);
      const firstLocal=Math.min(...localClockValues);
      const lastLocal=Math.max(...localClockValues);
      const minGap=Number.isFinite(previousClockedIndex)?minimumInterveningDuration(previousClockedIndex,model.section_index):0;
      const shift=chooseClockShift(firstLocal,previousClockEnd,minGap);
      model.middle_markers=localMarkers.map(item=>Object.assign({},item,{abs_time_s:item.local_abs+shift,historical_time_hms:formatHms(item.local_abs+shift)}));
      model.direct_crossings=rawDirect.map(item=>{
        crossingSequence+=1;
        return Object.assign({},item,{id:`${experiment.data_key}-CROSS-${String(crossingSequence).padStart(3,'0')}`,abs:item.local_abs+shift});
      });
      function slopeBetween(left,right){
        const phaseSpan=Number(right.phase)-Number(left.phase);
        const timeSpan=Number(right.abs_time_s)-Number(left.abs_time_s);
        return phaseSpan>0&&timeSpan>0?timeSpan/phaseSpan:model.half_cycle_seconds;
      }
      function phaseTimeAt(phase){
        const markers=model.middle_markers;
        const p=Number(phase);
        if(markers.length===1) return markers[0].abs_time_s+(p-markers[0].phase)*model.half_cycle_seconds;
        if(p<=markers[0].phase){
          const slope=slopeBetween(markers[0],markers[1]);
          return markers[0].abs_time_s+(p-markers[0].phase)*slope;
        }
        for(let index=0;index<markers.length-1;index+=1){
          const left=markers[index],right=markers[index+1];
          if(p<=right.phase){
            const ratio=(p-left.phase)/(right.phase-left.phase);
            return left.abs_time_s+(right.abs_time_s-left.abs_time_s)*ratio;
          }
        }
        const last=markers[markers.length-1],previous=markers[markers.length-2];
        const slope=slopeBetween(previous,last);
        return last.abs_time_s+(p-last.phase)*slope;
      }
      model.extreme_slots.forEach(slot=>{slot.abs_time_s=phaseTimeAt(slot.phase);});
      const finiteExtremes=model.extreme_slots.filter(slot=>Number.isFinite(slot.value)&&Number.isFinite(slot.abs_time_s));
      model.first_extreme_abs=finiteExtremes.length?finiteExtremes[0].abs_time_s:null;
      model.last_extreme_abs=finiteExtremes.length?finiteExtremes[finiteExtremes.length-1].abs_time_s:null;
      const directAbs=model.direct_crossings.map(item=>item.abs).filter(Number.isFinite);
      model.first_direct_abs=directAbs.length?Math.min(...directAbs):Math.min(...model.middle_markers.map(item=>item.abs_time_s));
      model.last_direct_abs=directAbs.length?Math.max(...directAbs):Math.max(...model.middle_markers.map(item=>item.abs_time_s));
      previousClockEnd=Math.max(lastLocal+shift,model.last_direct_abs);
      previousClockedIndex=model.section_index;
    });

    const directClockValues=[];
    const allClockValues=[];
    models.forEach(model=>{
      model.static_direct.forEach(item=>{directClockValues.push(item.abs);allClockValues.push(item.abs);});
      model.direct_crossings.forEach(item=>{directClockValues.push(item.abs);allClockValues.push(item.abs);});
      model.middle_markers.forEach(item=>allClockValues.push(item.abs_time_s));
    });
    if(!allClockValues.length) throw new Error(`${experiment.data_key}: no clock values for multi-section reconstruction`);
    const edgeValues=directValueClockBounds&&directClockValues.length?directClockValues:allClockValues;
    const startAbs=Math.min(...edgeValues);
    const endAbs=Math.max(...edgeValues);
    const spanAbs=Math.max(1,endAbs-startAbs);
    function playbackFromAbs(absTime){return ((Number(absTime)-startAbs)/spanAbs)*PLAYBACK_DURATION_S;}
    function historicalAbsAt(playbackTime){
      const t=Math.max(0,Math.min(PLAYBACK_DURATION_S,Number(playbackTime)||0));
      return startAbs+(t/PLAYBACK_DURATION_S)*spanAbs;
    }

    const clockedModels=models.filter(model=>model.mode!=='order_only'&&Number.isFinite(model.first_direct_abs));
    const transitionRanges=[];
    for(let index=0;index<clockedModels.length-1;index+=1){
      const previous=clockedModels[index];
      const next=clockedModels[index+1];
      const lower=previous.last_direct_abs;
      const upper=next.first_direct_abs;
      if(!Number.isFinite(lower)||!Number.isFinite(upper)||upper<=lower+0.001) continue;
      const intermediate=models.filter(model=>model.section_index>previous.section_index&&model.section_index<next.section_index);
      const transitionCount=Math.max(1,next.section_index-previous.section_index);
      const intermediatePositions=intermediate.map(model=>model.position);
      const grouped=transitionCount>1||intermediate.length>0;
      transitionRanges.push({
        transition_id:`${experiment.data_key}-TRANSITION-${String(transitionRanges.length+1).padStart(2,'0')}`,
        from_section_index:previous.section_index,
        to_section_index:next.section_index,
        from_position:previous.position,
        to_position:next.position,
        intermediate_positions:Object.freeze(intermediatePositions),
        transition_count:transitionCount,
        grouped_unresolved_sequence:grouped,
        start_abs_s:Math.max(startAbs,lower),
        end_abs_s:Math.min(endAbs,upper),
        playback_start_s:playbackFromAbs(Math.max(startAbs,lower)),
        playback_end_s:playbackFromAbs(Math.min(endAbs,upper)),
        start_hms:formatHms(lower),
        end_hms:formatHms(upper),
        time_status:grouped?'multiple_ordered_sections_bounded_by_surrounding_direct_clock_records':'bounded_by_surrounding_direct_clock_records',
        end_boundary_basis:'historical_direct_clock',
        end_boundary_historical_claim:true,
        display_label_ja:grouped?'時計時刻なし区間':'配置時刻不明',
        timeline_label_ja:grouped?`${intermediatePositions.map(positionShort).join('・')}配置観測と${transitionCount}回の配置変更`:'配置変更時刻不確定',
        time_uncertain:true,
        source_class:grouped?'historical_order_only_sections_between_direct_clock_bounds':'historical_transition_interval',
        provenance_layer:'historical_source_bounds'
      });
    }
    function rangeContainingAbs(abs){return transitionRanges.find(range=>abs>=range.start_abs_s-0.001&&abs<=range.end_abs_s+0.001)||null;}
    function incomingRange(sectionIndex){return transitionRanges.find(range=>range.to_section_index===sectionIndex)||null;}
    function outgoingRange(sectionIndex){return transitionRanges.find(range=>range.from_section_index===sectionIndex)||null;}

    const reconstructionSegments=[];
    models.filter(model=>model.mode==='timed_crossing').forEach(model=>{
      const markerByLeft=new Map(model.middle_markers.map(marker=>[marker.left_slot_index,marker]));
      const incoming=incomingRange(model.section_index);
      const outgoing=outgoingRange(model.section_index);
      for(let index=0;index<model.extreme_slots.length-1;index+=1){
        const left=model.extreme_slots[index],right=model.extreme_slots[index+1];
        if(!Number.isFinite(left.value)||!Number.isFinite(right.value)) continue;
        let displayStart=Math.max(startAbs,left.abs_time_s);
        let displayEnd=Math.min(endAbs,right.abs_time_s);
        if(incoming) displayStart=Math.max(displayStart,incoming.end_abs_s);
        if(outgoing) displayEnd=Math.min(displayEnd,outgoing.start_abs_s);
        if(displayEnd<=displayStart+0.001) continue;
        const exactMiddle=markerByLeft.get(index)||null;
        const exactMiddleInside=Boolean(exactMiddle&&exactMiddle.abs_time_s>left.abs_time_s&&exactMiddle.abs_time_s<right.abs_time_s);
        reconstructionSegments.push({
          segment_id:`${experiment.data_key}-RECON-${String(reconstructionSegments.length+1).padStart(3,'0')}`,
          section_index:model.section_index,
          left_row_id:left.row.row_id||'',right_row_id:right.row.row_id||'',
          left_value:left.value,right_value:right.value,
          phase_start:left.phase,phase_end:right.phase,
          model_start_abs_s:left.abs_time_s,model_end_abs_s:right.abs_time_s,
          display_start_abs_s:displayStart,display_end_abs_s:displayEnd,
          middle_marker_id:exactMiddleInside?exactMiddle.marker_id:null,
          middle_marker_abs_s:exactMiddleInside?exactMiddle.abs_time_s:null,
          playback_start_s:playbackFromAbs(displayStart),playback_end_s:playbackFromAbs(displayEnd),
          wave_visible:true,line_kind:'crossing_time_reconstruction',
          placement_basis:exactMiddleInside?'printed_middle_vibration_exact_phase_constraint':'printed_middle_vibration_phase_interpolation',
          main_clock_visible:true,historical_time_claim:false,
          equation:exactMiddleInside?'piecewise half-cosine constrained at printed middle-vibration time':'half-cosine between adjacent recorded extrema'
        });
      }
    });
    function segmentValueAtAbs(abs){
      const segment=reconstructionSegments.find(item=>abs>=item.display_start_abs_s-0.001&&abs<=item.display_end_abs_s+0.001);
      if(!segment) return null;
      const left=segment.left_value,right=segment.right_value;
      const midpoint=(left+right)/2;
      const t0=segment.model_start_abs_s,t1=segment.model_end_abs_s,tm=segment.middle_marker_abs_s;
      if(Number.isFinite(tm)&&tm>t0&&tm<t1){
        if(abs<=tm){
          const ratio=Math.max(0,Math.min(1,(abs-t0)/Math.max(0.001,tm-t0)));
          return midpoint+(left-midpoint)*Math.cos((Math.PI/2)*ratio);
        }
        const ratio=Math.max(0,Math.min(1,(abs-tm)/Math.max(0.001,t1-tm)));
        return midpoint+(right-midpoint)*Math.sin((Math.PI/2)*ratio);
      }
      const ratio=Math.max(0,Math.min(1,(abs-t0)/Math.max(0.001,t1-t0)));
      return midpoint+(left-right)*0.5*Math.cos(Math.PI*ratio);
    }
    function valueAt(playbackTime){return segmentValueAtAbs(historicalAbsAt(playbackTime));}
    function isWaveDefinedAt(playbackTime){return Number.isFinite(Number(valueAt(playbackTime)));}

    const sourceValues=[];
    sections.forEach(section=>(section.rows||[]).forEach(row=>{
      [row.extreme_point,row.divisions,row.point_of_rest].forEach(value=>{const parsed=num(value);if(Number.isFinite(parsed)) sourceValues.push(parsed);});
      (row.division_crossings||[]).forEach(crossing=>{const parsed=num(crossing.division);if(Number.isFinite(parsed)) sourceValues.push(parsed);});
    }));
    const rawMin=Math.min(...sourceValues),rawMax=Math.max(...sourceValues),rawSpan=Math.max(1,rawMax-rawMin);
    const scaleMin=rawMin-rawSpan*0.08,scaleMax=rawMax+rawSpan*0.08,scaleCenter=(scaleMin+scaleMax)/2,scaleHalf=(scaleMax-scaleMin)/2;
    function yAtValue(value){return 177-((Number(value)-scaleMin)/Math.max(1e-9,scaleMax-scaleMin))*144;}
    function visualOffsetAt(playbackTime){const value=valueAt(playbackTime);return Number.isFinite(Number(value))?((Number(value)-scaleCenter)/Math.max(1e-9,scaleHalf))*36:0;}

    const anchors=[];
    let anchorSequence=0;
    function addAnchor(row,model,value,kind,extra){
      anchorSequence+=1;
      anchors.push(Object.assign({
        anchor_id:`${experiment.data_key}-ANCHOR-${String(anchorSequence).padStart(3,'0')}`,
        row_id:row.row_id||`${experiment.data_key}-ROW-${String(anchorSequence).padStart(3,'0')}`,
        section_index:model.section_index,section_label:model.label,position:model.position,
        value:Number(value),value_kind:kind,value_class:'historical_direct_value',
        source_page:row.source_page||(model.section.source_pages||[]).join('–')||(experiment.source_pages||[]).join('–'),
        source_type:row.source_type||'historical',verification:row.verification||'visual_check_passed',raw_text:row.raw_text||'',summary_eligible:false,source_ordinal:0
      },extra||{}));
    }
    function orderOnlyTrigger(model,order,count){
      const range=transitionRanges.find(item=>model.section_index>item.from_section_index&&model.section_index<item.to_section_index);
      if(range){
        const ratio=(order+1)/(Math.max(1,count)+1);
        return range.playback_start_s+(range.playback_end_s-range.playback_start_s)*ratio;
      }
      const firstClocked=clockedModels[0];
      if(firstClocked&&model.section_index<firstClocked.section_index) return 0;
      const lastClocked=clockedModels[clockedModels.length-1];
      if(lastClocked&&model.section_index>lastClocked.section_index) return PLAYBACK_DURATION_S;
      return 0;
    }
    models.forEach(model=>{
      model.static_direct.forEach(item=>addAnchor(item.row,model,item.value,'division_reading',{
        abs_time_s:item.abs,historical_time_hms:formatHms(item.abs),historical_time_original:item.original_time,
        time_basis:'historical_direct_time',source_class:'historical_direct_value__historical_direct_time',
        playback_time_s:playbackFromAbs(item.abs),record_trigger_s:playbackFromAbs(item.abs),summary_eligible:true,
        observation_note:'原表にdivisionとclock timeが同じ行で記録された直接読取。'
      }));
      model.order_slots.forEach((slot,index)=>addAnchor(slot.row,model,slot.value,'extreme_point',{
        phase_order:index+1,time_basis:'untimed_extreme_order',source_class:'historical_direct_value__untimed_extreme_order',
        playback_time_s:null,record_trigger_s:orderOnlyTrigger(model,index,model.order_slots.length),historical_time_hms:'',
        observation_note:'極値は史実読取値。時計時刻は原表に記録されていないため、時計軸外で記録順だけを保持。'
      }));
      model.direct_crossings.forEach(item=>addAnchor(item.row,model,item.value,'division_crossing',{
        source_ordinal:item.crossingIndex,abs_time_s:item.abs,historical_time_hms:formatHms(item.abs),historical_time_original:item.original_time,
        time_basis:'historical_direct_time',source_class:'historical_direct_value__historical_direct_time',
        playback_time_s:playbackFromAbs(item.abs),record_trigger_s:playbackFromAbs(item.abs),
        observation_note:'原表にdivision通過値とclock timeが記録された直接時計イベント。極値時刻ではない。'
      }));
      model.extreme_slots.forEach((slot,index)=>{
        if(!Number.isFinite(slot.value)) return;
        const insideAxis=slot.abs_time_s>=startAbs-0.001&&slot.abs_time_s<=endAbs+0.001;
        const inTransition=Boolean(rangeContainingAbs(slot.abs_time_s));
        if(insideAxis&&!inTransition){
          addAnchor(slot.row,model,slot.value,'extreme_point',{
            abs_time_s:slot.abs_time_s,historical_time_hms:formatHms(slot.abs_time_s),historical_time_original:'',
            time_basis:'reconstructed_extreme_time_from_middle_vibration',source_class:'historical_direct_value__reconstructed_extreme_time',
            playback_time_s:playbackFromAbs(slot.abs_time_s),record_trigger_s:playbackFromAbs(slot.abs_time_s),phase_order:index+1,
            observation_note:'極値は史実読取値。時計時刻は振動中央時刻から再構成した推定値で、史実直接時刻ではない。'
          });
        }else{
          const trigger=inTransition?Math.max(0,Math.min(PLAYBACK_DURATION_S,playbackFromAbs(slot.abs_time_s))):0;
          addAnchor(slot.row,model,slot.value,'extreme_point',{
            phase_order:index+1,time_basis:'untimed_extreme_order',source_class:inTransition?'historical_direct_value__reconstructed_extreme_inside_transition_interval':'historical_direct_value__untimed_extreme_order_outside_clock_bounds',
            playback_time_s:null,record_trigger_s:trigger,historical_time_hms:'',reconstructed_abs_time_s:slot.abs_time_s,
            observation_note:inTransition?'再構成時刻が配置変更不確定区間内に入るため、主時計軸へ置かず記録順だけを保持。':'時計軸の確認済み範囲外にある極値。値と記録順だけを保持。'
          });
        }
      });
    });
    anchors.sort((a,b)=>(Number(a.record_trigger_s)||0)-(Number(b.record_trigger_s)||0)||(Number(a.section_index)||0)-(Number(b.section_index)||0)||(Number(a.phase_order)||0)-(Number(b.phase_order)||0)||String(a.anchor_id).localeCompare(String(b.anchor_id)));
    const reconstructionRecords=attachAnchorProvenance(experiment,anchors);

    const middleMarkers=models.flatMap(model=>model.middle_markers.map(marker=>Object.assign({},marker,{section_index:model.section_index,position:model.position})));
    const directCrossings=models.flatMap(model=>model.direct_crossings.map(item=>Object.assign({},item,{section_index:model.section_index,position:model.position})));
    const reconstructionExtrema=models.flatMap(model=>model.extreme_slots.map(slot=>({
      section_index:model.section_index,position:model.position,row_id:slot.row.row_id||'',row_index:slot.rowIndex,value:slot.value,phase:slot.phase,
      reconstructed_abs_time_s:slot.abs_time_s,reconstructed_time_hms:Number.isFinite(slot.abs_time_s)?formatHms(slot.abs_time_s):'',missed:slot.missed,historical_time_claim:false
    })));

    const positionOrder=[];
    models.forEach(model=>{if(!positionOrder.includes(model.position)) positionOrder.push(model.position);});
    const positionStats=positionOrder.map(position=>{
      const related=models.filter(model=>model.position===position);
      let values=related.flatMap(model=>model.rows.map(row=>num(row.point_of_rest)).filter(Number.isFinite));
      if(!values.length) values=related.flatMap(model=>model.rows.map(row=>num(row.divisions)).filter(Number.isFinite));
      if(!values.length) values=related.flatMap(model=>model.rows.map(row=>num(row.extreme_point)).filter(Number.isFinite));
      return {position,label:positionLabel(position),short_label:positionShort(position),count:values.length,average:mean(values),equilibrium:median(values)};
    });
    const transitionStats=((experiment.summary||{}).motions||[]).map((motion,index)=>{
      const transition=String(motion.transition||'');
      const parts=transition.split('_to_');
      const fromPosition=parts[0]||models[index]&&models[index].position||'unknown';
      const toPosition=parts[1]||models[index+1]&&models[index+1].position||'unknown';
      const from=positionStats.find(item=>item.position===fromPosition),to=positionStats.find(item=>item.position===toPosition);
      const motionValue=num(motion.value);
      const fromValue=from?(from.equilibrium??from.average):null,toValue=to?(to.equilibrium??to.average):null;
      return {from_position:fromPosition,to_position:toPosition,from_value:fromValue,to_value:toValue,average_difference:Number.isFinite(fromValue)&&Number.isFinite(toValue)?toValue-fromValue:null,result_value:Number.isFinite(motionValue)?motionValue:(Number.isFinite(fromValue)&&Number.isFinite(toValue)?toValue-fromValue:null),result_source:Number.isFinite(motionValue)?'historical_summary_motion':'calculated_position_average_difference'};
    });
    const applicationCalculationRecords=buildApplicationCalculationRecords(experiment,positionStats,transitionStats);

    function sectionAt(playbackTime){
      const t=Math.max(0,Math.min(PLAYBACK_DURATION_S,Number(playbackTime)||0));
      const abs=historicalAbsAt(t);
      const activeRange=transitionRanges.find(range=>abs>=range.start_abs_s&&abs<range.end_abs_s);
      if(activeRange){
        if(activeRange.grouped_unresolved_sequence){
          return {index:activeRange.from_section_index,position:'unknown',label:'時計時刻なし区間',switching:false,unresolved:true,time_uncertain:true,historical_time_range:`${activeRange.start_hms}〜${activeRange.end_hms}`,from_position:activeRange.from_position,to_position:activeRange.to_position,progress:0,source_class:activeRange.source_class};
        }
        const progress=(abs-activeRange.start_abs_s)/Math.max(0.001,activeRange.end_abs_s-activeRange.start_abs_s);
        return {index:activeRange.from_section_index,position:activeRange.from_position,label:'配置変更時刻不確定',switching:true,unresolved:false,time_uncertain:true,historical_time_range:`${activeRange.start_hms}〜${activeRange.end_hms}`,from_position:activeRange.from_position,to_position:activeRange.to_position,progress,source_class:activeRange.source_class};
      }
      let selected=clockedModels[0]||models[0]||{section_index:0,position:'unknown',label:'Unknown'};
      transitionRanges.forEach(range=>{if(abs>=range.end_abs_s) selected=models[range.to_section_index]||selected;});
      return {index:selected.section_index,position:selected.position,label:selected.label,switching:false,unresolved:false,time_uncertain:false,progress:1,source_class:selected.mode==='static_direct'?'historical_direct_section':'historical_timed_section'};
    }
    function motionFrameAt(playbackTime){
      const t=Math.max(0,Math.min(PLAYBACK_DURATION_S,Number(playbackTime)||0));
      const abs=historicalAbsAt(t);
      const activeRange=transitionRanges.find(range=>abs>=range.start_abs_s&&abs<range.end_abs_s);
      if(!activeRange||!activeRange.grouped_unresolved_sequence) return sectionAt(t);

      const orderedModels=models.filter(model=>model.section_index>=activeRange.from_section_index&&model.section_index<=activeRange.to_section_index);
      if(orderedModels.length<2) return sectionAt(t);
      const phases=[];
      for(let index=0;index<orderedModels.length-1;index+=1){
        const from=orderedModels[index],to=orderedModels[index+1];
        phases.push({kind:'switch',from,to});
        if(index+1<orderedModels.length-1) phases.push({kind:'stable',model:to,from,to:orderedModels[index+2]});
      }
      const ratio=Math.max(0,Math.min(0.999999,(abs-activeRange.start_abs_s)/Math.max(0.001,activeRange.end_abs_s-activeRange.start_abs_s)));
      const phaseIndex=Math.min(phases.length-1,Math.floor(ratio*phases.length));
      const phase=phases[phaseIndex];
      const rangeLabel=`${activeRange.start_hms}〜${activeRange.end_hms}`;
      if(phase.kind==='stable'){
        return {
          index:phase.model.section_index,
          position:phase.model.position,
          label:phase.model.label,
          switching:false,
          unresolved:false,
          time_uncertain:true,
          record_order_only:true,
          historical_time_range:rangeLabel,
          from_position:phase.from.position,
          to_position:phase.to.position,
          progress:1,
          source_class:'historical_record_order_only_motion_view'
        };
      }
      return {
        index:phase.from.section_index,
        position:phase.from.position,
        label:'配置変更時刻不確定',
        switching:true,
        unresolved:false,
        time_uncertain:true,
        record_order_only:true,
        historical_time_range:rangeLabel,
        from_position:phase.from.position,
        to_position:phase.to.position,
        progress:0,
        source_class:'historical_record_order_motion_transition'
      };
    }
    function massFrameAt(playbackTime){return sectionAt(playbackTime);}
    function frameAt(playbackTime){
      const abs=historicalAbsAt(playbackTime),value=valueAt(playbackTime),section=sectionAt(playbackTime);
      return {playback_time_s:Number(playbackTime)||0,historical_abs_time_s:abs,historical_time_hms:formatHms(abs),read_value:value,read_div:Number.isFinite(Number(value))?Number(value).toFixed(3):'—',visual_offset_px:Number.isFinite(Number(value))?visualOffsetAt(playbackTime):0,wave_defined:Number.isFinite(Number(value)),position:section.position,position_label:section.label,switching:Boolean(section.switching),unresolved:Boolean(section.unresolved),time_uncertain:Boolean(section.time_uncertain),historical_time_range:section.historical_time_range||'',from_position:section.from_position||null,to_position:section.to_position||section.position,progress:Number(section.progress)||0,source_class:section.source_class||'multi_section_crossing_time_reconstruction'};
    }

    const flowStages=[];
    const firstClocked=clockedModels[0];
    const precedingOrderOnly=models.filter(model=>firstClocked&&model.section_index<firstClocked.section_index&&model.mode==='order_only');
    if(precedingOrderOnly.length){
      flowStages.push(timelineStage(0,`${positionShort(precedingOrderOnly[0].position)}配置観測`,'時計時刻のない極値は下段に記録順で保持','historical_record_order_only','時刻なし','untimed','記録順のみ'));
    }
    if(firstClocked){
      const firstLabel=firstClocked.mode==='static_direct'?`${positionShort(firstClocked.position)}配置読取`:`${positionShort(firstClocked.position)}配置観測`;
      flowStages.push(timelineStage(precedingOrderOnly.length?0.001:0,firstLabel,'最初の直接時計付き記録から主時計軸を開始',firstClocked.mode==='static_direct'?'historical_direct_section':'historical_direct_time',compactClockLabel(formatHms(startAbs)),'observation_start','史実時計時刻'));
    }
    transitionRanges.forEach(range=>{
      const rangeLabel=compactClockRange(range.start_hms,range.end_hms);
      const reason=range.grouped_unresolved_sequence
        ? `${range.start_hms}〜${range.end_hms}の間に時計時刻のない${range.intermediate_positions.map(positionShort).join('・')}配置観測と${range.transition_count}回の配置変更がある。個々の時刻は確定しない。`
        : `${range.start_hms}〜${range.end_hms}の間に${positionShort(range.from_position)}から${positionShort(range.to_position)}へ配置変更。正確な時刻は不明。`;
      flowStages.push(timelineStage(range.playback_start_s,range.timeline_label_ja,reason,range.source_class,rangeLabel,'transition_uncertain','史実直接時計による上下限'));
      flowStages.push(timelineStage(range.playback_end_s,`${positionShort(range.to_position)}配置観測`,'次の時計付き目盛通過記録から波形表示を再開','historical_direct_time',compactClockLabel(range.end_hms),'observation_resume','史実時計時刻'));
    });
    flowStages.push(timelineStage(PLAYBACK_DURATION_S,'観測終了','最後の直接時計付き目盛通過までを表示','historical_direct_time',compactClockLabel(formatHms(endAbs)),'end','史実時計時刻'));
    flowStages.sort((a,b)=>a.time-b.time||({untimed:0,observation_start:1,transition_uncertain:2,observation_resume:3,end:9}[a.timeline_kind]||5)-({untimed:0,observation_start:1,transition_uncertain:2,observation_resume:3,end:9}[b.timeline_kind]||5));

    const waveSegments=reconstructionSegments.map(segment=>Object.freeze(Object.assign({},segment)));
    const reconstructionSegmentRecords=freezeReconstructionSegments(experiment,reconstructionSegments.map(segment=>Object.assign({},segment,{reconstruction_kind:'multi_section_crossing_time_half_cycle_curve'})));
    const crossingChecks=directCrossings.map(item=>{
      const predicted=segmentValueAtAbs(item.abs),residual=Number.isFinite(Number(predicted))?Number(predicted)-item.value:null;
      return Object.freeze({section_index:item.section_index,row_id:item.row.row_id||'',source_ordinal:item.crossingIndex,historical_time_hms:formatHms(item.abs),observed_value:item.value,predicted_value:predicted,residual,absolute_residual:Number.isFinite(Number(residual))?Math.abs(residual):null,interpretation:'same_source_internal_check_not_independent_validation'});
    });
    const sourceCounts=anchors.reduce((acc,anchor)=>{const key=`${anchor.value_class||'unknown'} / ${anchor.time_basis||'unknown'}`;acc[key]=(acc[key]||0)+1;return acc;},{});
    const placementSections=models.map(model=>{
      const equilibrium=(positionStats.find(item=>item.position===model.position)||{}).equilibrium;
      if(model.mode==='order_only'){
        return {
          index:model.section_index,
          position:model.position,
          label:model.label,
          start_time_s:null,
          end_time_s:null,
          equilibrium,
          switching:false,
          unresolved:true,
          time_uncertain:true,
          record_order_only:true,
          source_class:'historical_record_order_only'
        };
      }
      const incoming=incomingRange(model.section_index),outgoing=outgoingRange(model.section_index);
      return {
        index:model.section_index,
        position:model.position,
        label:model.label,
        start_time_s:incoming?incoming.playback_end_s:0,
        end_time_s:outgoing?outgoing.playback_start_s:PLAYBACK_DURATION_S,
        equilibrium,
        switching:false,
        unresolved:false,
        time_uncertain:false,
        record_order_only:false,
        source_class:model.mode==='static_direct'?'historical_direct_section':'historical_timed_section'
      };
    });

    return Object.freeze({
      experiment_id:experiment.id,data_key:experiment.data_key,label:experiment.label,date_iso:experiment.date_iso,date_label:experiment.date_label,source_pages:experiment.source_pages||[],playback_duration_s:PLAYBACK_DURATION_S,
      historical_start_abs_s:startAbs,historical_end_abs_s:endAbs,historical_start_hms:formatHms(startAbs),historical_end_hms:formatHms(endAbs),historical_span_s:spanAbs,
      period_seconds:fallbackHalfCycle,half_cycle_seconds:fallbackHalfCycle,
      historical_source_records:layer.source_records,historical_calculation_records:layer.historical_calculation_records,application_calculation_records:applicationCalculationRecords,
      reconstruction_records:Object.freeze(reconstructionRecords.concat(reconstructionSegmentRecords)),reconstruction_segments:Object.freeze(reconstructionSegments.map(item=>Object.freeze(Object.assign({},item)))),
      reconstruction_extrema:Object.freeze(reconstructionExtrema.map(item=>Object.freeze(item))),middle_phase_markers:Object.freeze(middleMarkers.map(item=>Object.freeze(item))),
      direct_crossing_events:Object.freeze(directCrossings.map(item=>Object.freeze({section_index:item.section_index,row_id:item.row.row_id||'',source_ordinal:item.crossingIndex,value:item.value,abs_time_s:item.abs,historical_time_hms:formatHms(item.abs),historical_time_claim:true}))),
      crossing_closure_checks:Object.freeze(crossingChecks),common_structure_build:OBSERVATION_STRUCTURE.build||'missing',
      data_layer_status:'multi_section_crossing_time_reconstruction_from_printed_middle_vibration_and_division_crossings',
      clock_axis_policy:'目盛通過時刻と静止区間の直接読取時刻だけを主時計軸の境界に使用する。極値時刻は振動中央時刻から再構成し、配置変更不確定帯内または時計軸外の極値は記録順表示へ分離する。',
      connection_policy:'同一配置区間の隣接する記録済み極値間だけを半余弦で再構成する。配置変更不確定帯、時計時刻なし区間、空欄・missedをまたいで接続しない。',
      observation_clock_bounds:Object.freeze({start_confirmed:true,end_confirmed:true}),
      anchors:Object.freeze(anchors.map(anchor=>Object.freeze(anchor))),wave_anchors:Object.freeze(anchors.filter(anchor=>(anchor.value_kind==='division_reading'||anchor.value_kind==='division_crossing'||(anchor.value_kind==='extreme_point'&&anchor.time_basis==='reconstructed_extreme_time_from_middle_vibration'))).map(anchor=>Object.freeze(anchor))),
      wave_segments:Object.freeze(waveSegments),sections:Object.freeze(placementSections.map(item=>Object.freeze(item))),placement_sections:Object.freeze(placementSections.map(item=>Object.freeze(item))),
      transitions:Object.freeze(transitionRanges.map(item=>Object.freeze(Object.assign({},item)))),transition_uncertainty_ranges:Object.freeze(transitionRanges.map(item=>Object.freeze(Object.assign({},item)))),missed_observation_ranges:Object.freeze([]),
      connection_decisions:Object.freeze(reconstructionSegments.map(item=>Object.freeze({section_index:item.section_index,from_row_id:item.left_row_id,to_row_id:item.right_row_id,decision:'connect_reconstructed_half_cycle',reason:'adjacent recorded extrema in same placement section constrained by printed middle-vibration phase'}))),
      position_stats:Object.freeze(positionStats.map(item=>Object.freeze(item))),transition_stats:Object.freeze(transitionStats.map(item=>Object.freeze(item))),flow_stages:Object.freeze(flowStages.map(item=>Object.freeze(item))),source_counts:Object.freeze(sourceCounts),
      crossing_time_reconstruction:true,multi_section_crossing_reconstruction:true,
      clock_axis_outside_marker_policy:edgeRepairEnabled?'hide_order_only_on_main_axis':'legacy',clock_axis_segment_mapping:visibleHistoricalSegmentBounds?'visible_historical_bounds':'legacy_model_bounds',clock_axis_edge_basis:directValueClockBounds?'direct_value_clock_bounds':'all_printed_clock_values',
      scale:Object.freeze({min:scaleMin,max:scaleMax,center:scaleCenter,half:scaleHalf}),valueAt,isWaveDefinedAt,visualOffsetAt,yAtValue,historicalAbsAt,sectionAt,massFrameAt,motionFrameAt,frameAt
    });
  }


  function buildColumnReauditProfile(experiment){
    const layer=layerFor(experiment);
    const structure=OBSERVATION_STRUCTURE&&OBSERVATION_STRUCTURE.sets?OBSERVATION_STRUCTURE.sets[experiment.data_key]:null;
    const auditValues=[];
    if(structure){
      (structure.clock_values||[]).forEach(item=>{const value=Number(item.value);if(Number.isFinite(value))auditValues.push(value);});
      (structure.order_only_values||[]).forEach(item=>{const value=Number(item.value);if(Number.isFinite(value))auditValues.push(value);});
      (structure.table_calculations||[]).forEach(item=>{const value=Number(item.value);if(Number.isFinite(value))auditValues.push(value);});
    }
    if(!auditValues.length){
      (experiment.sections||[]).forEach(section=>(section.rows||[]).forEach(row=>{
        ['extreme_points','divisions','point_of_rest'].forEach(key=>{
          const value=num(row&&row[key]);
          if(Number.isFinite(value)) auditValues.push(value);
        });
      }));
    }
    const rawMin=auditValues.length?Math.min(...auditValues):0;
    const rawMax=auditValues.length?Math.max(...auditValues):1;
    const rawSpan=Math.max(1,rawMax-rawMin);
    const scaleMin=rawMin-rawSpan*0.08;
    const scaleMax=rawMax+rawSpan*0.08;
    const scaleCenter=(scaleMin+scaleMax)/2;
    const scaleHalf=(scaleMax-scaleMin)/2;
    const staticSection=Object.freeze({
      index:0,
      position:'unknown',
      label:'原表列意味再監査中',
      start_time_s:0,
      end_time_s:PLAYBACK_DURATION_S,
      equilibrium:null,
      switching:false,
      unresolved:true,
      time_uncertain:true,
      source_class:'column_reaudit_pending'
    });
    function valueAt(){return null;}
    function isWaveDefinedAt(){return false;}
    function visualOffsetAt(){return 0;}
    function yAtValue(value){
      const number=Number(value);
      if(!Number.isFinite(number)) return 105;
      return 177-((number-scaleMin)/Math.max(1e-9,scaleMax-scaleMin))*144;
    }
    function historicalAbsAt(){return null;}
    function sectionAt(){
      return {
        index:0,
        position:'unknown',
        label:'原表列意味再監査中',
        switching:false,
        unresolved:true,
        time_uncertain:true,
        historical_time_range:'',
        progress:0,
        source_class:'column_reaudit_pending'
      };
    }
    function massFrameAt(){return sectionAt();}
    function frameAt(playbackTime){
      return {
        playback_time_s:Number(playbackTime)||0,
        historical_abs_time_s:null,
        historical_time_hms:'—',
        read_value:null,
        read_div:'—',
        visual_offset_px:0,
        wave_defined:false,
        position:'unknown',
        position_label:'原表列意味再監査中',
        switching:false,
        unresolved:true,
        time_uncertain:true,
        historical_time_range:'',
        from_position:null,
        to_position:null,
        progress:0,
        source_class:'column_reaudit_pending'
      };
    }
    return Object.freeze({
      experiment_id:experiment.id,
      data_key:experiment.data_key,
      label:experiment.label,
      date_iso:experiment.date_iso,
      date_label:experiment.date_label,
      source_pages:experiment.source_pages||[],
      playback_duration_s:PLAYBACK_DURATION_S,
      historical_start_abs_s:0,
      historical_end_abs_s:1,
      historical_start_hms:'—',
      historical_end_hms:'—',
      historical_span_s:1,
      period_seconds:median(((experiment.summary||{}).vibration_periods||[]).map(item=>duration(item.value)).filter(Number.isFinite))||420,
      historical_source_records:layer.source_records,
      historical_calculation_records:layer.historical_calculation_records,
      application_calculation_records:Object.freeze([]),
      reconstruction_records:Object.freeze([]),
      reconstruction_segments:Object.freeze([]),
      common_structure_build:OBSERVATION_STRUCTURE.build||'missing',
      data_layer_status:'column_reaudit_pending_waveform_withdrawn',
      clock_axis_policy:'原表列意味の再監査完了まで時計軸へ接続しない。',
      connection_policy:'原表列意味の再監査完了まで点・線・配置変更帯を史実波形として表示しない。',
      observation_clock_bounds:Object.freeze({start_confirmed:false,end_confirmed:false}),
      anchors:Object.freeze([]),
      wave_anchors:Object.freeze([]),
      wave_segments:Object.freeze([]),
      sections:Object.freeze([staticSection]),
      placement_sections:Object.freeze([]),
      transitions:Object.freeze([]),
      transition_uncertainty_ranges:Object.freeze([]),
      connection_decisions:Object.freeze([]),
      position_stats:Object.freeze([]),
      transition_stats:Object.freeze([]),
      flow_stages:Object.freeze([
        Object.freeze(timelineStage(0,'再監査中','原表列意味・時刻所属・配置変更を再確認','column_reaudit_pending','時刻未確定','reaudit','表示保留'))
      ]),
      source_counts:Object.freeze({}),
      column_reaudit_pending:true,
      wave_display_withdrawn:true,
      scale:Object.freeze({min:scaleMin,max:scaleMax,center:scaleCenter,half:scaleHalf}),
      valueAt,
      isWaveDefinedAt,
      visualOffsetAt,
      yAtValue,
      historicalAbsAt,
      sectionAt,
      massFrameAt,
      frameAt
    });
  }

  function buildProfile(experiment){
    if (experiment && experiment.data_key === 'CAV-1798-EXP-I') return buildExperimentOneProfile(experiment);
    const directSemantics=experiment&&DIRECT_CLOCK_SEMANTICS.sets?DIRECT_CLOCK_SEMANTICS.sets[experiment.data_key]:null;
    if(directSemantics) return buildDirectTimedExtremaProfile(experiment,directSemantics);
    const crossingSemantics=experiment&&CROSSING_TIME_SEMANTICS.sets?CROSSING_TIME_SEMANTICS.sets[experiment.data_key]:null;
    if(crossingSemantics&&crossingSemantics.display_mode==='multi_section_crossing_time_reconstruction') return buildMultiSectionCrossingTimeProfile(experiment,crossingSemantics);
    if(crossingSemantics) return buildCrossingTimeReconstructionProfile(experiment,crossingSemantics);
    return buildColumnReauditProfile(experiment);
  }

  const profiles = Object.freeze((DATA.experiments || []).map(experiment=>{
    const profile=buildProfile(experiment);
    const registration=registrationFor(experiment);
    const structureSet=OBSERVATION_STRUCTURE&&OBSERVATION_STRUCTURE.sets?OBSERVATION_STRUCTURE.sets[experiment.data_key]:null;
    const structureByIndex=new Map(((structureSet&&structureSet.sections)||[]).map(section=>[Number(section.section_index),section]));
    const profileSections=Array.isArray(profile.sections)?profile.sections:[];
    const motionViewSections=Object.freeze((experiment.sections||[]).map((section,index)=>{
      const structureSection=structureByIndex.get(index)||null;
      const profileSection=profileSections.find(item=>Number(item.index??item.section_index)===index)||null;
      const clockValueCount=structureSection?Number(structureSection.clock_value_count)||0:null;
      const recordOrderOnly=structureSection?clockValueCount===0:Boolean(profileSection&&profileSection.record_order_only);
      return Object.freeze({
        index,
        position:section.mass_position||'unknown',
        label:section.label||positionLabel(section.mass_position),
        start_time_s:profileSection&&Number.isFinite(Number(profileSection.start_time_s))?Number(profileSection.start_time_s):null,
        end_time_s:profileSection&&Number.isFinite(Number(profileSection.end_time_s))?Number(profileSection.end_time_s):null,
        record_order_only:recordOrderOnly,
        time_uncertain:recordOrderOnly||Boolean(profileSection&&profileSection.time_uncertain),
        source_class:recordOrderOnly?'historical_record_order_only':String(profileSection&&profileSection.source_class||'historical_section_order')
      });
    }));
    const motionFrameAt=typeof profile.motionFrameAt==='function'?profile.motionFrameAt:(typeof profile.massFrameAt==='function'?profile.massFrameAt:profile.sectionAt);
    return Object.freeze(Object.assign({},profile,{
      motion_view_sections:motionViewSections,
      motionFrameAt,
      observation_set_registration:registration,
      registration_status:registration.registration_status,
      registration_status_ja:registration.registration_status_ja,
      formal_replay:Boolean(registration.formal_replay),
      display_pattern_id:registration.display_pattern_id,
      display_pattern_name_ja:registration.display_pattern_name_ja,
      marker_policy:registration.marker_policy,
      registration_note_ja:registration.ui_note_ja
    }));
  }));
  const byId = Object.freeze(profiles.reduce((acc,p)=>{acc[p.experiment_id]=p;return acc;},{}));
  const byKey = Object.freeze(profiles.reduce((acc,p)=>{acc[p.data_key]=p;return acc;},{}));

  window.CAVENDISH_HISTORICAL_REPLAY = Object.freeze({
    build:'CV080A12',
    raw_data_build:DATA.build || 'unknown',
    data_layer_build:DATA_LAYERS.build || 'missing',
    experiment_i_semantics_build:EXPERIMENT_I_SEMANTICS ? EXPERIMENT_I_SEMANTICS.build : 'missing',
    experiment_i_physical_model_build:EXPERIMENT_I_PHYSICAL_MODEL ? EXPERIMENT_I_PHYSICAL_MODEL.build : 'missing',
    experiment_vi_semantics_build:EXPERIMENT_VI_SEMANTICS ? EXPERIMENT_VI_SEMANTICS.build : 'missing',
    direct_clock_semantics_build:DIRECT_CLOCK_SEMANTICS.build||'missing',
    crossing_time_semantics_build:CROSSING_TIME_SEMANTICS.build||'missing',
    experiment_i_semantics:EXPERIMENT_I_SEMANTICS,
    observation_set_registry_build:OBSERVATION_SET_REGISTRY.build||'missing',
    observation_structure_build:OBSERVATION_STRUCTURE.build||'missing',
    replay_status:'all_17_experiments_formal_replay_experiment_i_protected_vi_viii_direct_clock_all_others_crossing_time_reconstruction',
    playback_duration_s:PLAYBACK_DURATION_S,
    profiles,
    byId,
    byKey,
    parseNumber:num,
    parseTime:hms,
    parseEventTime:eventClock,
    formatTime:formatHms,
    positionLabel,
    positionShort
  });
})();
