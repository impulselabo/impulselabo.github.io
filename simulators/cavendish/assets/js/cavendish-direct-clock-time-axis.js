(function(){
  'use strict';

  const EPSILON_SECONDS=0.02;
  const BUILD='CV080A12';

  function finite(value){
    const number=Number(value);
    return Number.isFinite(number)?number:null;
  }

  function supports(profile){
    if(!profile) return false;
    const directStatus=String(profile.data_layer_status||'').startsWith('direct_timed_values_');
    const gaps=(Array.isArray(profile.transition_uncertainty_ranges)?profile.transition_uncertainty_ranges.length:0)
      +(Array.isArray(profile.missed_observation_ranges)?profile.missed_observation_ranges.length:0);
    return directStatus&&gaps>0&&Array.isArray(profile.wave_anchors)&&profile.wave_anchors.length>1;
  }

  function normalSegment(profile,startAbs,endAbs,index){
    const points=(profile.wave_anchors||[]).filter(anchor=>{
      const abs=finite(anchor&&anchor.abs_time_s);
      return abs!==null&&abs>=startAbs-EPSILON_SECONDS&&abs<=endAbs+EPSILON_SECONDS;
    });
    return {
      id:`${String(profile.data_key||'direct').toLowerCase()}-observed-${String(index).padStart(2,'0')}`,
      type:'normal',
      start_abs_s:startAbs,
      end_abs_s:endAbs,
      wave_visible:true,
      grid_visible:true,
      width_weight:Math.max(2,points.length),
      title:`時計付き直接観測 ${points.length}点`
    };
  }

  function normalizeGap(range,kind,index){
    const startAbs=finite(range&&range.start_abs_s);
    const endAbs=finite(range&&range.end_abs_s);
    if(startAbs===null||endAbs===null||endAbs<=startAbs) return null;
    const transition=kind==='transition';
    const label=transition
      ? '配置変更'
      : String(range.display_label_ja||range.label||(Number.isFinite(Number(range.missed_extreme_count))?`欠測 ${Number(range.missed_extreme_count)}極値`:'欠測'));
    const detail=transition
      ? `${String(range.start_hms||'')}〜${String(range.end_hms||'')}の間に配置変更（正確な時刻は不明）`
      : `${String(range.start_hms||'')}〜${String(range.end_hms||'')} ${label}`;
    return {
      id:String((transition?range.transition_id:range.gap_id)||`${kind}-${index+1}`),
      kind,
      startAbs,
      endAbs,
      widthCssPx:transition?14:16,
      label,
      title:detail
    };
  }

  function createSetConfig(profile){
    if(!supports(profile)) return null;
    const startAbs=finite(profile.historical_start_abs_s);
    const endAbs=finite(profile.historical_end_abs_s);
    if(startAbs===null||endAbs===null||endAbs<=startAbs) return null;

    const gaps=[];
    (profile.transition_uncertainty_ranges||[]).forEach((range,index)=>{
      const gap=normalizeGap(range,'transition',index);
      if(gap) gaps.push(gap);
    });
    (profile.missed_observation_ranges||[]).forEach((range,index)=>{
      const gap=normalizeGap(range,'missed',index);
      if(gap) gaps.push(gap);
    });
    gaps.sort((a,b)=>a.startAbs-b.startAbs||a.endAbs-b.endAbs);

    const segments=[];
    let cursor=startAbs;
    let observedIndex=1;
    gaps.forEach((gap,index)=>{
      if(gap.startAbs<cursor-EPSILON_SECONDS){
        throw new Error(`${profile.data_key}: direct-clock compressed gaps overlap at ${gap.id}`);
      }
      if(gap.startAbs>cursor+EPSILON_SECONDS){
        segments.push(normalSegment(profile,cursor,gap.startAbs,observedIndex++));
      }
      segments.push({
        id:gap.id,
        type:'omitted',
        start_abs_s:gap.startAbs,
        end_abs_s:gap.endAbs,
        wave_visible:false,
        grid_visible:false,
        record_policy:'boundary',
        width_css_px:gap.widthCssPx,
        boundary_markers:false,
        compression_kind:gap.kind,
        compression_label_ja:gap.label,
        title:gap.title
      });
      cursor=gap.endAbs;
    });
    if(cursor<endAbs-EPSILON_SECONDS){
      segments.push(normalSegment(profile,cursor,endAbs,observedIndex++));
    }
    if(!segments.length) return null;

    const transitionCount=(profile.transition_uncertainty_ranges||[]).length;
    const missedCount=(profile.missed_observation_ranges||[]).length;
    return {
      default_mode:'folded',
      axis_purpose:'direct_clock_observation_priority',
      folded_title_ja:'区間強調',
      folded_detail_ja:`配置変更 ${transitionCount}・欠測 ${missedCount}区間を短縮`,
      folded_toggle_back_ja:'区間強調に戻す',
      segments,
      labels:[
        {abs_s:startAbs,kind:'observation_start',priority:100,format:'hm'},
        {abs_s:endAbs,kind:'observation_end',priority:100,format:'hm'}
      ]
    };
  }

  function createConfigRoot(profile,baseRoot){
    const setConfig=createSetConfig(profile);
    if(!setConfig) return baseRoot||{defaults:{},sets:{}};
    const base=baseRoot||{defaults:{},sets:{}};
    return {
      build:BUILD,
      defaults:Object.assign({},base.defaults||{}, {
        normal_segment_min_css_px:32,
        omitted_width_compressed_min_css_px:14
      }),
      sets:Object.assign({},base.sets||{}, {[profile.data_key]:setConfig})
    };
  }

  window.CAVENDISH_DIRECT_CLOCK_TIME_AXIS=Object.freeze({
    build:BUILD,
    supports,
    createSetConfig,
    createConfigRoot
  });
})();
