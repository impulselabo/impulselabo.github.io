(function(){
  'use strict';

  const EPSILON_SECONDS=0.02;

  function finiteNumber(value,fallback=null){
    const number=Number(value);
    return Number.isFinite(number)?number:fallback;
  }

  function clamp(value,min,max){
    return Math.max(min,Math.min(max,value));
  }

  function parseClock(value){
    if(value===null||value===undefined||value==='') return null;
    if(Number.isFinite(Number(value))) return Number(value);
    const parts=String(value).trim().split(':').map(Number);
    if(parts.length<2||parts.some(part=>!Number.isFinite(part))) return null;
    return parts[0]*3600+parts[1]*60+(parts[2]||0);
  }

  function formatClock(totalSeconds,format='hm'){
    if(!Number.isFinite(Number(totalSeconds))) return '—';
    let seconds=Math.round(Number(totalSeconds))%86400;
    if(seconds<0) seconds+=86400;
    const hh=Math.floor(seconds/3600);
    const mm=Math.floor((seconds%3600)/60);
    const ss=seconds%60;
    const values=[hh,mm,ss].map(value=>String(value).padStart(2,'0'));
    return format==='hms'?values.join(':'):values.slice(0,2).join(':');
  }

  function resolveClockToRange(value,startAbs,endAbs){
    const parsed=parseClock(value);
    if(!Number.isFinite(parsed)) return null;
    const candidates=[parsed-86400,parsed,parsed+86400,parsed+172800];
    const inside=candidates.find(candidate=>candidate>=startAbs-EPSILON_SECONDS&&candidate<=endAbs+EPSILON_SECONDS);
    if(Number.isFinite(inside)) return inside;
    return candidates.reduce((best,candidate)=>{
      const distance=candidate<startAbs?startAbs-candidate:(candidate>endAbs?candidate-endAbs:0);
      return !best||distance<best.distance?{value:candidate,distance}:best;
    },null).value;
  }

  function freezeArray(items){
    return Object.freeze(items.map(item=>Object.freeze(item)));
  }

  function defaultDefinition(profile,defaults){
    const startAbs=finiteNumber(profile&&profile.historical_start_abs_s,0);
    const endAbs=finiteNumber(profile&&profile.historical_end_abs_s,startAbs+1);
    const span=Math.max(1,endAbs-startAbs);
    const labels=[
      {abs:startAbs,kind:'observation_start',priority:100,format:'hm'},
      {abs:startAbs+span*0.25,kind:'minor',priority:30,format:'hm'},
      {abs:startAbs+span*0.5,kind:'minor',priority:35,format:'hm'},
      {abs:startAbs+span*0.75,kind:'minor',priority:30,format:'hm'},
      {abs:endAbs,kind:'observation_end',priority:100,format:'hm'}
    ].map(item=>Object.assign(item,{text:formatClock(item.abs,item.format)}));
    return Object.freeze({
      build:'generated-default',
      dataKey:String(profile&&profile.data_key||''),
      defaultMode:'full',
      startAbs,
      endAbs,
      segments:freezeArray([{id:'full-observation',type:'normal',startAbs,endAbs,waveVisible:true,gridVisible:true,duration:endAbs-startAbs}]),
      labels:freezeArray(labels),
      hasOmitted:false,
      defaults:Object.freeze(Object.assign({},defaults)),
      valid:true,
      errors:Object.freeze([])
    });
  }

  function normalizeDefinition(profile,configRoot){
    const root=configRoot||{};
    const defaults=Object.assign({},root.defaults||{});
    const startAbs=finiteNumber(profile&&profile.historical_start_abs_s,null);
    const endAbs=finiteNumber(profile&&profile.historical_end_abs_s,null);
    if(!Number.isFinite(startAbs)||!Number.isFinite(endAbs)||endAbs<=startAbs){
      return defaultDefinition(profile,defaults);
    }
    const setConfig=root.sets&&profile?root.sets[profile.data_key]:null;
    if(!setConfig||!Array.isArray(setConfig.segments)||!setConfig.segments.length){
      return defaultDefinition(profile,defaults);
    }

    const errors=[];
    const segments=setConfig.segments.map((raw,index)=>{
      const segmentStart=Number.isFinite(Number(raw.start_abs_s))?Number(raw.start_abs_s):resolveClockToRange(raw.start_clock,startAbs,endAbs);
      const segmentEnd=Number.isFinite(Number(raw.end_abs_s))?Number(raw.end_abs_s):resolveClockToRange(raw.end_clock,startAbs,endAbs);
      const type=raw.type==='omitted'?'omitted':'normal';
      if(!Number.isFinite(segmentStart)||!Number.isFinite(segmentEnd)||segmentEnd<=segmentStart){
        errors.push(`segment-${index+1}-invalid-range`);
      }
      return {
        id:String(raw.id||`segment-${index+1}`),
        type,
        startAbs:segmentStart,
        endAbs:segmentEnd,
        duration:Math.max(0,Number(segmentEnd)-Number(segmentStart)),
        waveVisible:raw.wave_visible!==false,
        gridVisible:raw.grid_visible!==false,
        recordPolicy:['hidden','boundary','inside'].includes(raw.record_policy)?raw.record_policy:'inside',
        widthCssPx:finiteNumber(raw.width_css_px,null),
        title:String(raw.title||''),
        sourceIndex:index,
        widthWeight:finiteNumber(raw.width_weight,null),
        boundaryMarkers:raw.boundary_markers!==false,
        compressionKind:String(raw.compression_kind||''),
        compressionLabel:String(raw.compression_label_ja||'')
      };
    });

    segments.sort((a,b)=>a.startAbs-b.startAbs||a.sourceIndex-b.sourceIndex);
    if(Math.abs(segments[0].startAbs-startAbs)>EPSILON_SECONDS) errors.push('segments-do-not-start-at-observation-start');
    if(Math.abs(segments[segments.length-1].endAbs-endAbs)>EPSILON_SECONDS) errors.push('segments-do-not-end-at-observation-end');
    segments.forEach((segment,index)=>{
      if(index===0) return;
      const previous=segments[index-1];
      if(Math.abs(segment.startAbs-previous.endAbs)>EPSILON_SECONDS) errors.push(`segment-${index}-boundary-gap-or-overlap`);
    });
    if(errors.length) return Object.freeze(Object.assign({},defaultDefinition(profile,defaults),{valid:false,errors:Object.freeze(errors)}));

    const rawLabels=Array.isArray(setConfig.labels)&&setConfig.labels.length?setConfig.labels:[];
    const labels=rawLabels.map((raw,index)=>{
      const abs=Number.isFinite(Number(raw.abs_s))?Number(raw.abs_s):resolveClockToRange(raw.clock,startAbs,endAbs);
      const format=raw.format==='hms'?'hms':'hm';
      return {
        id:String(raw.id||`label-${index+1}`),
        abs,
        kind:String(raw.kind||'minor'),
        priority:finiteNumber(raw.priority,50),
        format,
        text:String(raw.text||formatClock(abs,format)),
        modes:Array.isArray(raw.modes)?Object.freeze(raw.modes.map(String)):null
      };
    }).filter(label=>Number.isFinite(label.abs)&&label.abs>=startAbs-EPSILON_SECONDS&&label.abs<=endAbs+EPSILON_SECONDS);

    if(!labels.some(label=>label.kind==='observation_start')) labels.push({id:'auto-start',abs:startAbs,kind:'observation_start',priority:100,format:'hm',text:formatClock(startAbs,'hm')});
    if(!labels.some(label=>label.kind==='observation_end')) labels.push({id:'auto-end',abs:endAbs,kind:'observation_end',priority:100,format:'hm',text:formatClock(endAbs,'hm')});
    segments.filter(segment=>segment.type==='omitted'&&segment.boundaryMarkers!==false).forEach((segment,index)=>{
      const startFormat=Math.round(segment.startAbs)%60?'hms':'hm';
      const endFormat=Math.round(segment.endAbs)%60?'hms':'hm';
      if(!labels.some(label=>label.kind==='omission_start'&&Math.abs(label.abs-segment.startAbs)<=EPSILON_SECONDS)){
        labels.push({id:`auto-omission-start-${index+1}`,abs:segment.startAbs,kind:'omission_start',priority:120,format:startFormat,text:formatClock(segment.startAbs,startFormat)});
      }
      if(!labels.some(label=>label.kind==='omission_end'&&Math.abs(label.abs-segment.endAbs)<=EPSILON_SECONDS)){
        labels.push({id:`auto-omission-end-${index+1}`,abs:segment.endAbs,kind:'omission_end',priority:120,format:endFormat,text:formatClock(segment.endAbs,endFormat)});
      }
    });

    labels.sort((a,b)=>a.abs-b.abs||b.priority-a.priority);
    return Object.freeze({
      build:String(root.build||'unknown'),
      dataKey:String(profile.data_key||''),
      defaultMode:setConfig.default_mode==='full'?'full':(setConfig.default_mode==='folded'?'folded':(defaults.default_mode==='folded'?'folded':'full')),
      startAbs,
      endAbs,
      segments:freezeArray(segments),
      labels:freezeArray(labels),
      hasOmitted:segments.some(segment=>segment.type==='omitted'),
      defaults:Object.freeze(defaults),
      axisPurpose:String(setConfig.axis_purpose||''),
      foldedTitle:String(setConfig.folded_title_ja||''),
      foldedDetail:String(setConfig.folded_detail_ja||''),
      foldedToggleBackLabel:String(setConfig.folded_toggle_back_ja||''),
      valid:true,
      errors:Object.freeze([])
    });
  }

  function allocateNormalWidths(total,durations,minWidth){
    const count=durations.length;
    if(!count) return [];
    if(total<=0) return durations.map(()=>0);
    const positiveDurations=durations.map(value=>Math.max(1e-9,Number(value)||0));
    if(total<minWidth*count){
      const sum=positiveDurations.reduce((a,b)=>a+b,0);
      return positiveDurations.map(value=>total*value/sum);
    }
    const widths=new Array(count).fill(0);
    let remainingIndexes=positiveDurations.map((_,index)=>index);
    let remainingTotal=total;
    while(remainingIndexes.length){
      const durationSum=remainingIndexes.reduce((sum,index)=>sum+positiveDurations[index],0);
      const tooSmall=remainingIndexes.filter(index=>remainingTotal*positiveDurations[index]/durationSum<minWidth);
      if(!tooSmall.length){
        remainingIndexes.forEach(index=>{widths[index]=remainingTotal*positiveDurations[index]/durationSum;});
        break;
      }
      tooSmall.forEach(index=>{widths[index]=minWidth;remainingTotal-=minWidth;});
      remainingIndexes=remainingIndexes.filter(index=>!tooSmall.includes(index));
    }
    return widths;
  }

  function createLayout(options){
    const profile=options&&options.profile||{};
    const definition=options&&options.definition||normalizeDefinition(profile,options&&options.configRoot);
    const defaults=definition.defaults||{};
    const viewWidth=Math.max(1,finiteNumber(options&&options.viewWidth,1000));
    const cssWidth=Math.max(120,finiteNumber(options&&options.cssWidth,viewWidth));
    const requestedMode=options&&options.mode;
    const mode=definition.hasOmitted&&requestedMode!=='full'?'folded':'full';

    const narrowBreakpoint=finiteNumber(defaults.narrow_breakpoint_css_px,520);
    const narrow=cssWidth<=narrowBreakpoint;
    const leftRequested=finiteNumber(narrow?defaults.left_margin_narrow_css_px:defaults.left_margin_css_px,narrow?38:42);
    const leftMinimum=finiteNumber(defaults.left_margin_min_css_px,34);
    const leftMaxRatio=finiteNumber(defaults.left_margin_max_ratio,0.12);
    const leftMarginCss=clamp(leftRequested,Math.min(leftMinimum,cssWidth*0.10),Math.max(leftMinimum,cssWidth*leftMaxRatio));
    const rightRequested=finiteNumber(narrow?defaults.right_margin_narrow_css_px:defaults.right_margin_css_px,narrow?4:6);
    const rightMarginCss=clamp(rightRequested,3,Math.max(3,cssWidth*0.04));
    const plotWidthCss=Math.max(60,cssWidth-leftMarginCss-rightMarginCss);

    const sourceSegments=definition.segments.map(segment=>Object.assign({},segment));
    const omittedIndexes=[];
    const normalIndexes=[];
    sourceSegments.forEach((segment,index)=>{
      if(mode==='folded'&&segment.type==='omitted') omittedIndexes.push(index);
      else normalIndexes.push(index);
    });

    const widthsCss=new Array(sourceSegments.length).fill(0);
    let omittedTotal=0;
    if(omittedIndexes.length){
      const ratioWidth=cssWidth*finiteNumber(defaults.omitted_width_ratio,0.08);
      const targetDefault=clamp(ratioWidth,finiteNumber(defaults.omitted_width_min_css_px,44),finiteNumber(defaults.omitted_width_max_css_px,64));
      omittedIndexes.forEach(index=>{widthsCss[index]=sourceSegments[index].widthCssPx||targetDefault;});
      omittedTotal=omittedIndexes.reduce((sum,index)=>sum+widthsCss[index],0);
      const normalMin=finiteNumber(defaults.normal_segment_min_css_px,26);
      const availableForOmitted=Math.max(0,plotWidthCss-normalMin*normalIndexes.length);
      if(omittedTotal>availableForOmitted){
        const compressedMin=finiteNumber(defaults.omitted_width_compressed_min_css_px,24);
        const targetEach=Math.max(compressedMin,availableForOmitted/Math.max(1,omittedIndexes.length));
        omittedIndexes.forEach(index=>{widthsCss[index]=Math.min(widthsCss[index],targetEach);});
        omittedTotal=omittedIndexes.reduce((sum,index)=>sum+widthsCss[index],0);
      }
      if(omittedTotal>plotWidthCss*0.55){
        const targetEach=plotWidthCss*0.55/omittedIndexes.length;
        omittedIndexes.forEach(index=>{widthsCss[index]=targetEach;});
        omittedTotal=plotWidthCss*0.55;
      }
    }

    const normalTotal=Math.max(0,plotWidthCss-omittedTotal);
    const normalAllocationValues=normalIndexes.map(index=>{
      const segment=sourceSegments[index];
      return mode==='folded'&&Number.isFinite(Number(segment.widthWeight))&&Number(segment.widthWeight)>0
        ? Number(segment.widthWeight)
        : segment.duration;
    });
    const normalWidths=allocateNormalWidths(normalTotal,normalAllocationValues,mode==='full'?0:finiteNumber(defaults.normal_segment_min_css_px,26));
    normalIndexes.forEach((index,normalIndex)=>{widthsCss[index]=normalWidths[normalIndex];});

    const cssToView=viewWidth/cssWidth;
    const plotStartX=leftMarginCss*cssToView;
    const plotEndX=(cssWidth-rightMarginCss)*cssToView;
    let cursorCss=leftMarginCss;
    const segments=sourceSegments.map((segment,index)=>{
      const startCss=cursorCss;
      const endCss=index===sourceSegments.length-1?cssWidth-rightMarginCss:cursorCss+widthsCss[index];
      cursorCss=endCss;
      return Object.freeze(Object.assign({},segment,{
        layoutType:mode==='folded'?segment.type:'normal',
        xStart:startCss*cssToView,
        xEnd:endCss*cssToView,
        widthCssPx:endCss-startCss
      }));
    });

    return Object.freeze({
      build:definition.build,
      dataKey:definition.dataKey,
      mode,
      cssWidth,
      viewWidth,
      cssToView,
      viewToCss:cssWidth/viewWidth,
      plotStartX,
      plotEndX,
      plotStartCss:leftMarginCss,
      plotEndCss:cssWidth-rightMarginCss,
      plotWidthCss,
      labelGapCss:finiteNumber(defaults.label_gap_css_px,6),
      definition,
      segments:Object.freeze(segments),
      omittedSegments:Object.freeze(segments.filter(segment=>mode==='folded'&&segment.type==='omitted')),
      valid:definition.valid,
      errors:definition.errors
    });
  }

  function mapAbsoluteTime(layout,absoluteTime){
    if(!layout||!layout.segments||!layout.segments.length) return 0;
    const absolute=clamp(finiteNumber(absoluteTime,layout.definition.startAbs),layout.definition.startAbs,layout.definition.endAbs);
    let segment=layout.segments[layout.segments.length-1];
    for(let index=0;index<layout.segments.length;index+=1){
      const candidate=layout.segments[index];
      if(absolute<=candidate.endAbs+EPSILON_SECONDS){segment=candidate;break;}
    }
    const ratio=segment.endAbs>segment.startAbs?clamp((absolute-segment.startAbs)/(segment.endAbs-segment.startAbs),0,1):0;
    return segment.xStart+ratio*(segment.xEnd-segment.xStart);
  }

  function segmentAtAbsolute(layout,absoluteTime){
    if(!layout||!layout.segments||!layout.segments.length) return null;
    const absolute=finiteNumber(absoluteTime,null);
    if(!Number.isFinite(absolute)) return null;
    return layout.segments.find(segment=>absolute>=segment.startAbs-EPSILON_SECONDS&&absolute<=segment.endAbs+EPSILON_SECONDS)||null;
  }

  function labelAnchor(kind){
    if(kind==='observation_start'||kind==='omission_end') return 'start';
    if(kind==='observation_end'||kind==='omission_start') return 'end';
    return 'middle';
  }

  function getLabelCandidates(layout){
    if(!layout) return [];
    return layout.definition.labels
      .filter(label=>!label.modes||label.modes.includes(layout.mode))
      .map(label=>Object.freeze(Object.assign({},label,{
        x:mapAbsoluteTime(layout,label.abs),
        anchor:labelAnchor(label.kind)
      })));
  }

  function getGridTicks(layout){
    if(!layout) return [];
    const ticks=[];
    layout.segments.forEach((segment,index)=>{
      ticks.push({x:segment.xStart,abs:segment.startAbs,kind:index===0?'start':'boundary',major:true});
      if(segment.layoutType==='normal'&&segment.widthCssPx>=120){
        ticks.push({x:(segment.xStart+segment.xEnd)/2,abs:(segment.startAbs+segment.endAbs)/2,kind:'minor',major:false});
      }
      if(index===layout.segments.length-1) ticks.push({x:segment.xEnd,abs:segment.endAbs,kind:'end',major:true});
    });
    const deduped=[];
    ticks.sort((a,b)=>a.x-b.x).forEach(tick=>{
      const existing=deduped[deduped.length-1];
      if(existing&&Math.abs(existing.x-tick.x)<0.2){
        existing.major=existing.major||tick.major;
        existing.kind=existing.kind==='minor'?tick.kind:existing.kind;
      }else deduped.push(Object.assign({},tick));
    });
    return deduped;
  }

  window.CAVENDISH_TIME_AXIS=Object.freeze({
    build:'CV080A12',
    parseClock,
    formatClock,
    normalizeDefinition,
    createLayout,
    mapAbsoluteTime,
    segmentAtAbsolute,
    getLabelCandidates,
    getGridTicks
  });
})();
