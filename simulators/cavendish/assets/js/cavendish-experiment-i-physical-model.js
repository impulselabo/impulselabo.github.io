/* CV079B12: Experiment I phase-constrained physical revalidation.
   The four printed "time of middle of vibration" entries define phase markers.
   Their adjacent differences (896, 876, 913 s) are used segment by segment.
   Untimed extrema constrain amplitude only and never receive an absolute time.
   Direct division/clock pairs are retained as non-statistical closure checks.
   Sensitivity bands vary beta only and are not measurement uncertainty. */
(function(){
  'use strict';

  const BUILD='CV079B12';
  const SOURCE_RESOLUTION_DIV=0.1;
  const CAUTION_THRESHOLD_DIV=0.5;
  const SAMPLE_COUNT_PER_SEGMENT=361;

  function finite(value){ return Number.isFinite(Number(value)); }
  function clamp(value,min,max){ return Math.max(min,Math.min(max,value)); }
  function mean(values){
    const clean=(values||[]).map(Number).filter(Number.isFinite);
    return clean.length?clean.reduce((a,b)=>a+b,0)/clean.length:null;
  }
  function rms(values){
    const clean=(values||[]).map(Number).filter(Number.isFinite);
    return clean.length?Math.sqrt(clean.reduce((sum,value)=>sum+value*value,0)/clean.length):0;
  }

  function classifyClosureResidual(residual){
    const signed=Number(residual);
    const absolute=Math.abs(signed);
    let residualClass='large_deviation';
    let validationStatus='needs_revalidation';
    let labelJa='要再検証';
    if(absolute<=SOURCE_RESOLUTION_DIV+1e-12){
      residualClass='within_source_resolution';
      validationStatus='consistent';
      labelJa='記録分解能内';
    }else if(absolute<=CAUTION_THRESHOLD_DIV+1e-12){
      residualClass='moderate_deviation';
      validationStatus='caution';
      labelJa='残差注意';
    }
    return Object.freeze({
      signed_residual:signed,
      absolute_residual:absolute,
      source_resolution_div:SOURCE_RESOLUTION_DIV,
      caution_threshold_div:CAUTION_THRESHOLD_DIV,
      residual_in_resolution_units:absolute/SOURCE_RESOLUTION_DIV,
      residual_class:residualClass,
      validation_status:validationStatus,
      validation_label_ja:labelJa,
      statistical_test:false
    });
  }

  function estimateBetaFromHalfRanges(halfRanges,totalElapsedSeconds){
    const values=(halfRanges||[]).map(Number).filter(value=>Number.isFinite(value)&&value>0);
    const elapsed=Math.max(1,Number(totalElapsedSeconds)||1);
    if(values.length<2) return 0.00016;
    return Math.max(0,Math.log(values[0]/values[values.length-1])/elapsed);
  }

  function evaluatePhaseWave(time,params){
    const t=Number(time);
    const t0=Number(params.core_t0),t1=Number(params.core_t1);
    const duration=Math.max(1e-9,t1-t0);
    const tau=t-t0;
    const u=tau/duration;
    const middle=Number(params.middle_start)+(Number(params.middle_end)-Number(params.middle_start))*u;
    const oscillation=Number(params.sign)*Number(params.amplitude)*Math.exp(-Number(params.beta)*tau)*Math.sin(Math.PI*u);
    const x=middle+oscillation;
    const middleSlope=(Number(params.middle_end)-Number(params.middle_start))/duration;
    const omegaD=Math.PI/duration;
    const v=middleSlope+Number(params.sign)*Number(params.amplitude)*Math.exp(-Number(params.beta)*tau)*(omegaD*Math.cos(Math.PI*u)-Number(params.beta)*Math.sin(Math.PI*u));
    return {x,v,middle,u,tau};
  }

  function locateExtreme(params){
    let lo=Number(params.core_t0),hi=Number(params.core_t1);
    const sign=Number(params.sign)>=0?1:-1;
    for(let i=0;i<110;i+=1){
      const a=lo+(hi-lo)/3;
      const b=hi-(hi-lo)/3;
      const xa=evaluatePhaseWave(a,params).x;
      const xb=evaluatePhaseWave(b,params).x;
      if(sign>0){
        if(xa<xb) lo=a; else hi=b;
      }else{
        if(xa>xb) lo=a; else hi=b;
      }
    }
    const t=(lo+hi)/2;
    const state=evaluatePhaseWave(t,params);
    return {t,x:state.x,v:state.v};
  }

  function solveAmplitude(baseParams,targetExtreme){
    const target=Number(targetExtreme);
    const sign=Number(baseParams.sign)>=0?1:-1;
    let lo=0,hi=1;
    function value(amplitude){
      return locateExtreme(Object.assign({},baseParams,{amplitude})).x;
    }
    for(let guard=0;guard<80;guard+=1){
      const current=value(hi);
      if((sign>0&&current>=target)||(sign<0&&current<=target)) break;
      hi*=2;
    }
    for(let i=0;i<100;i+=1){
      const mid=(lo+hi)/2;
      const current=value(mid);
      if(sign>0){
        if(current<target) lo=mid; else hi=mid;
      }else{
        if(current>target) lo=mid; else hi=mid;
      }
    }
    return (lo+hi)/2;
  }

  function buildSegment(config,beta,meanHalfCycle){
    const startMarker=config.start_marker;
    const endMarker=config.end_marker;
    const coreT0=Number(startMarker.t),coreT1=Number(endMarker.t);
    const duration=coreT1-coreT0;
    const omegaD=Math.PI/duration;
    const omegaN=Math.sqrt(omegaD*omegaD+beta*beta);
    const zeta=omegaN>0?beta/omegaN:0;
    const base={
      core_t0:coreT0,
      core_t1:coreT1,
      middle_start:Number(startMarker.value),
      middle_end:Number(endMarker.value),
      sign:Number(config.sign)>=0?1:-1,
      beta,
      amplitude:1
    };
    const amplitude=solveAmplitude(base,config.extreme_value);
    const params=Object.assign({},base,{amplitude});
    const extreme=locateExtreme(params);
    const displayT0=finite(config.display_t0)?Number(config.display_t0):coreT0;
    const displayT1=finite(config.display_t1)?Number(config.display_t1):coreT1;
    const sampleCount=SAMPLE_COUNT_PER_SEGMENT;
    const samples=[];
    const sensitivityBetas=[beta*0.8,beta,beta*1.2];
    const sensitivityVariants=sensitivityBetas.map(betaVariant=>{
      const variantBase=Object.assign({},base,{beta:betaVariant,amplitude:1});
      const variantAmplitude=solveAmplitude(variantBase,config.extreme_value);
      return Object.assign({},variantBase,{amplitude:variantAmplitude});
    });
    for(let index=0;index<sampleCount;index+=1){
      const ratio=sampleCount<=1?0:index/(sampleCount-1);
      const t=displayT0+(displayT1-displayT0)*ratio;
      const state=evaluatePhaseWave(t,params);
      const sensitivityValues=sensitivityVariants.map(variant=>evaluatePhaseWave(t,variant).x);
      samples.push(Object.freeze({
        sample_index:index,
        t,
        x:state.x,
        v:state.v,
        middle:state.middle,
        sensitivity_min_x:Math.min(...sensitivityValues),
        sensitivity_max_x:Math.max(...sensitivityValues),
        parameter_sensitivity_only:true,
        confidence_interval:false
      }));
    }
    const checks=Object.freeze((config.direct_clock_checks||[]).map(check=>{
      const predicted=evaluatePhaseWave(check.t,params).x;
      const audit=classifyClosureResidual(predicted-Number(check.x));
      return Object.freeze({
        check_id:String(check.id||''),
        row_id:String(check.row_id||''),
        historical_time_hms:String(check.historical_time_hms||''),
        historical_abs_time_s:Number(check.t),
        observed_value:Number(check.x),
        predicted_value:predicted,
        residual:predicted-Number(check.x),
        absolute_residual:audit.absolute_residual,
        residual_in_resolution_units:audit.residual_in_resolution_units,
        residual_class:audit.residual_class,
        validation_status:audit.validation_status,
        validation_label_ja:audit.validation_label_ja,
        statistical_test:false
      });
    }));
    const checkResiduals=checks.map(item=>item.residual);
    const maxAbs=Math.max(0,...checks.map(item=>item.absolute_residual));
    const status=maxAbs<=SOURCE_RESOLUTION_DIV+1e-12?'consistent':(maxAbs<=CAUTION_THRESHOLD_DIV+1e-12?'caution':'needs_revalidation');
    const label=status==='consistent'?'記録分解能内':status==='caution'?'差に注意':'要再検証';
    const extremeConstraint=Object.freeze({
      source_row_id:String(config.extreme_row_id||''),
      expected_value:Number(config.extreme_value),
      predicted_value:extreme.x,
      amplitude,
      direction:params.sign>0?'maximum':'minimum',
      historical_time_claim:false,
      amplitude_constraint:true,
      residual:extreme.x-Number(config.extreme_value),
      extreme_model_time_s:null,
      note:'時刻未記載極値は振幅拘束としてのみ使用し、極値時刻を保存・表示しない。'
    });
    const segment={
      segment_id:String(config.segment_id),
      segment_index:Number(config.segment_index),
      start:Object.freeze(Object.assign({},config.start||{})),
      end:Object.freeze(Object.assign({},config.end||{})),
      start_marker:Object.freeze(Object.assign({},startMarker)),
      end_marker:Object.freeze(Object.assign({},endMarker)),
      t0:displayT0,
      t1:displayT1,
      display_t0:displayT0,
      display_t1:displayT1,
      core_t0:coreT0,
      core_t1:coreT1,
      duration,
      half_cycle_seconds:duration,
      mean_half_cycle_seconds:meanHalfCycle,
      full_period_seconds:duration*2,
      middle_start:params.middle_start,
      middle_end:params.middle_end,
      beta,
      omega_d:omegaD,
      omega_n:omegaN,
      zeta,
      amplitude,
      sign:params.sign,
      equilibrium:(params.middle_start+params.middle_end)/2,
      correction_rms:0,
      equation:"y'' + 2*beta*y' + (omega_d^2 + beta^2)*y = 0; x = m(t) + y; m(t) linear",
      expected_extreme_row_id:String(config.extreme_row_id||''),
      extreme_constraint:extremeConstraint,
      expected_extreme:extremeConstraint,
      direct_clock_checks:checks,
      validation:Object.freeze({
        comparison:'direct_clock_pair_closure_nonstatistical',
        check_count:checks.length,
        max_absolute_residual:maxAbs,
        rms_residual:rms(checkResiduals),
        mean_absolute_residual:mean(checks.map(item=>item.absolute_residual))||0,
        validation_status:status,
        validation_label_ja:label,
        source_resolution_div:SOURCE_RESOLUTION_DIV,
        statistical_test:false
      }),
      samples:Object.freeze(samples),
      sensitivity_samples:Object.freeze(samples),
      evaluate(time){ return evaluatePhaseWave(time,params); }
    };
    return Object.freeze(segment);
  }

  function buildOrdinalPhaseGroup(position,values,rowIds,equilibrium){
    return Object.freeze({
      position,
      axis_kind:'model_phase_order',
      historical_time_claim:false,
      equilibrium:Number(equilibrium),
      points:Object.freeze((values||[]).map((value,index)=>Object.freeze({
        phase_order:index+1,
        value:Number(value),
        source_row_id:(rowIds||[])[index]||'',
        historical_time_hms:'',
        historical_abs_time_s:null
      })))
    });
  }

  function buildExperimentIReaudit(config){
    const markers=(config.middle_phase_markers||[]).map(item=>Object.assign({},item,{t:Number(item.t),value:Number(item.value)}));
    if(markers.length!==4||markers.some(item=>!finite(item.t)||!finite(item.value))){
      throw new Error('CV079B12 requires four valid middle-vibration phase markers');
    }
    const durations=[markers[1].t-markers[0].t,markers[2].t-markers[1].t,markers[3].t-markers[2].t];
    const meanHalfCycle=mean(durations)||Number(config.half_cycle_seconds)||895;
    const halfRanges=(config.return_half_ranges||[]).map(Number).filter(value=>Number.isFinite(value)&&value>0);
    const beta=finite(config.beta)?Number(config.beta):estimateBetaFromHalfRanges(halfRanges,markers[3].t-markers[0].t);
    const segmentConfigs=config.phase_segments||[];
    if(segmentConfigs.length!==3) throw new Error('CV079B12 requires three phase segments');
    const segments=Object.freeze(segmentConfigs.map((item,index)=>buildSegment(Object.assign({},item,{
      segment_index:index+1,
      start_marker:markers[index],
      end_marker:markers[index+1]
    }),beta,meanHalfCycle)));
    function evaluate(time){
      const t=Number(time);
      const segment=segments.find(item=>t>=item.display_t0-1e-9&&t<=item.display_t1+1e-9)
        || segments.find(item=>t>=item.core_t0-120&&t<=item.core_t1+120);
      return segment?segment.evaluate(t):null;
    }
    const allChecks=segments.flatMap(segment=>segment.direct_clock_checks);
    const residuals=allChecks.map(item=>item.residual);
    const validationCounts=segments.reduce((acc,segment)=>{
      const key=segment.validation.validation_status;
      acc[key]=(acc[key]||0)+1;
      return acc;
    },{});
    const overall=(validationCounts.needs_revalidation||0)>0?'mixed_needs_revalidation':((validationCounts.caution||0)>0?'mixed_caution':'consistent');
    const phaseGroups=Object.freeze([
      buildOrdinalPhaseGroup('positive',config.positive_extrema_values||[],config.positive_extrema_row_ids||[],config.positive_equilibrium),
      buildOrdinalPhaseGroup('midway',config.return_extrema_values||[],config.return_extrema_row_ids||[],config.return_equilibrium)
    ]);
    return Object.freeze({
      build:BUILD,
      equation:"y'' + 2*beta*y' + (omega_d^2 + beta^2)*y = 0; x = m(t) + y; m(t) linear",
      half_cycle_seconds:meanHalfCycle,
      half_cycle_seconds_by_segment:Object.freeze(durations.slice()),
      full_period_seconds:meanHalfCycle*2,
      beta,
      middle_phase_markers:Object.freeze(markers.map(item=>Object.freeze(item))),
      clock_axis:Object.freeze({
        segments,
        evaluate,
        beta,
        half_cycle_seconds:meanHalfCycle,
        half_cycle_seconds_by_segment:Object.freeze(durations.slice()),
        full_period_seconds:meanHalfCycle*2,
        equilibrium:Number(config.return_equilibrium),
        equilibrium_range:Object.freeze({
          min:Math.min(...markers.map(item=>item.value)),
          max:Math.max(...markers.map(item=>item.value))
        })
      }),
      phase_groups:phaseGroups,
      residual_policy:Object.freeze({
        comparison:'direct_clock_pair_closure_nonstatistical',
        source_resolution_div:SOURCE_RESOLUTION_DIV,
        caution_threshold_div:CAUTION_THRESHOLD_DIV,
        thresholds_are_statistical:false,
        independent_validation:false,
        scope:'same_source_internal_closure_only',
        extreme_role:'amplitude_constraint_not_residual_test',
        labels:Object.freeze({consistent:'記録分解能内',caution:'差に注意',needs_revalidation:'要再検証'})
      }),
      model_provenance:Object.freeze({
        numeric_model_build:'CV079B10',
        interpretation_build:'CV079B12'
      }),
      assumption_policy:Object.freeze({
        phase_boundary:'printed_middle_vibration_times',
        amplitude_constraint:'untimed_extrema_without_time_claim',
        central_line:'linear_between_adjacent_middle_vibration_markers',
        damping:'single_global_beta_from_printed_half_ranges',
        correction_force:'none',
        independent_validation:false,
        physical_uniqueness:'unresolved'
      }),
      fix_scope:Object.freeze({
        fixed:Object.freeze(['historical_reconstruction_layer_separation','pseudo_time_removal','historical_clock_axis_display','same_source_numeric_closure_within_printed_resolution']),
        unresolved:Object.freeze(['physical_cause_of_linear_central_line','model_uniqueness','statistical_measurement_uncertainty','generalization_to_other_experiments'])
      }),
      sensitivity_policy:Object.freeze({
        variables:Object.freeze(['beta']),
        variation:Object.freeze({beta_fraction_minus:0.2,beta_fraction_plus:0.2}),
        extrema_reconstrained_for_each_variant:true,
        confidence_interval:false,
        probability_statement:false,
        interpretation:'parameter_sensitivity_only'
      }),
      diagnostics:Object.freeze({
        clock_segment_count:segments.length,
        direct_clock_check_count:allChecks.length,
        max_direct_constraint_error:Math.max(0,...allChecks.map(item=>item.absolute_residual)),
        max_direct_clock_closure_residual:Math.max(0,...allChecks.map(item=>item.absolute_residual)),
        mean_absolute_direct_clock_closure_residual:mean(allChecks.map(item=>item.absolute_residual))||0,
        rms_direct_clock_closure_residual:rms(residuals),
        validation_counts:Object.freeze(validationCounts),
        overall_validation_status:overall,
        internal_closure_only:true,
        independent_validation:false,
        physical_uniqueness_resolved:false,
        extreme_constraint_count:segments.length,
        extreme_time_claim_count:0
      }),
      status:'internal-source-closure-within-resolution-physical-uniqueness-unresolved'
    });
  }

  window.CAVENDISH_EXPERIMENT_I_PHYSICAL_MODEL=Object.freeze({
    build:BUILD,
    equation:"y'' + 2*beta*y' + (omega_d^2 + beta^2)*y = 0; x = m(t) + y; m(t) linear",
    classifyClosureResidual,
    estimateBetaFromHalfRanges,
    evaluatePhaseWave,
    solveAmplitude,
    buildExperimentIReaudit
  });
})();
