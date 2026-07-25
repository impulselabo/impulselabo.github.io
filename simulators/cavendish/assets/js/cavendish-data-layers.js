/* CV079B02: separate original-table source values, source-printed calculations,
   and application reconstruction metadata. This module never mutates the
   CV079A02 transcription object. */
(function(){
  'use strict';

  const RAW = window.CAVENDISH_HISTORICAL_DATA_V1 || { experiments: [] };

  function numberValue(value){
    if (value === null || value === undefined || value === '') return null;
    const text = String(value).trim().replace(/,/g,'.').replace(/[^0-9+\-.]/g,'');
    if (!text || text === '+' || text === '-' || text === '.') return null;
    const parsed = Number(text);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function clockSeconds(value){
    if (!value) return null;
    const parts = String(value).trim().split(':').map(Number);
    if (parts.some(v=>!Number.isFinite(v))) return null;
    if (parts.length === 2) return parts[0] * 3600 + parts[1] * 60;
    if (parts.length >= 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return null;
  }

  function durationSeconds(value){
    if (!value) return null;
    const text = String(value).trim();
    let match = text.match(/(\d+)\s*[′']\s*(\d+)\s*[″"]/);
    if (match) return Number(match[1]) * 60 + Number(match[2]);
    match = text.match(/^(\d+)\s*[:：]\s*(\d+)$/);
    if (match) return Number(match[1]) * 60 + Number(match[2]);
    return null;
  }

  function eventClockSeconds(value){
    if (!value) return null;
    const match = String(value).match(/At\s+(\d+)\s*h\s*(\d+)\s*[′']/i);
    return match ? Number(match[1]) * 3600 + Number(match[2]) * 60 : null;
  }

  function freezeRecord(record){ return Object.freeze(record); }
  function freezeList(list){ return Object.freeze(list.map(freezeRecord)); }
  function locator(dataKey,rowId,kind,ordinal){
    return [dataKey || '', rowId || '', kind || '', Number(ordinal) || 0].join('|');
  }

  function buildExperimentLayers(experiment){
    const sourceRecords=[];
    const calculationRecords=[];
    const sourceIndex={};
    const calculationIndex={};
    let sourceSequence=0;
    let calculationSequence=0;

    function common(section,sectionIndex,row){
      return {
        experiment_id:experiment.id,
        data_key:experiment.data_key,
        experiment_label:experiment.label,
        section_index:sectionIndex,
        section_label:section ? (section.label || '') : '',
        position:section ? (section.mass_position || 'unknown') : 'summary',
        source_row_id:row ? (row.row_id || '') : '',
        source_page:row ? (row.source_page || '') : ((section && section.source_pages || experiment.source_pages || []).join('–')),
        source_type:row ? (row.source_type || 'historical') : 'historical',
        verification:row ? (row.verification || experiment.verification || 'visual_check_passed') : (experiment.verification || 'visual_check_passed'),
        raw_text:row ? (row.raw_text || '') : ''
      };
    }

    function addSource(section,sectionIndex,row,kind,rawValue,options){
      if (rawValue === null || rawValue === undefined || rawValue === '') return null;
      const opts=options || {};
      sourceSequence+=1;
      const recordId=`${experiment.data_key}-SRC-${String(sourceSequence).padStart(4,'0')}`;
      const ordinal=Number(opts.ordinal)||0;
      const record=Object.assign(common(section,sectionIndex,row),{
        record_id:recordId,
        record_layer:'historical_source',
        value_kind:kind,
        field_name:opts.fieldName || kind,
        ordinal,
        raw_value:String(rawValue),
        numeric_value:opts.numeric === false ? null : numberValue(rawValue),
        historical_time_original:opts.historicalTimeOriginal || '',
        historical_time_seconds:Number.isFinite(opts.historicalTimeSeconds) ? opts.historicalTimeSeconds : null,
        time_relation:opts.timeRelation || 'none',
        related_source_record_ids:Object.freeze((opts.relatedSourceRecordIds || []).slice()),
        historical_claim:true,
        provenance_note:opts.note || 'Original-table value preserved from CV079A02 transcription.'
      });
      sourceRecords.push(record);
      sourceIndex[locator(experiment.data_key,record.source_row_id,kind,ordinal)]=recordId;
      return record;
    }

    function addCalculation(section,sectionIndex,row,kind,rawValue,options){
      if (rawValue === null || rawValue === undefined || rawValue === '') return null;
      const opts=options || {};
      calculationSequence+=1;
      const recordId=`${experiment.data_key}-HCALC-${String(calculationSequence).padStart(4,'0')}`;
      const ordinal=Number(opts.ordinal)||0;
      const record=Object.assign(common(section,sectionIndex,row),{
        record_id:recordId,
        record_layer:'historical_printed_calculation',
        value_kind:kind,
        field_name:opts.fieldName || kind,
        ordinal,
        raw_value:String(rawValue),
        numeric_value:opts.numeric === false ? null : numberValue(rawValue),
        duration_seconds:Number.isFinite(opts.durationSeconds) ? opts.durationSeconds : null,
        calculation_origin:opts.origin || 'printed_in_original_source',
        input_source_record_ids:Object.freeze((opts.inputSourceRecordIds || []).slice()),
        historical_claim:true,
        provenance_note:opts.note || 'Calculated or summarized value printed in the historical source; not calculated by the application.'
      });
      calculationRecords.push(record);
      calculationIndex[locator(experiment.data_key,record.source_row_id,kind,ordinal)]=recordId;
      return record;
    }

    (experiment.sections || []).forEach((section,sectionIndex)=>{
      if (section.event) {
        addSource(section,sectionIndex,null,'mass_position_event',section.event,{
          fieldName:'event',
          ordinal:sectionIndex,
          numeric:false,
          historicalTimeOriginal:section.event,
          historicalTimeSeconds:eventClockSeconds(section.event),
          timeRelation:'printed_event_clock',
          note:'Mass-position event text and its printed clock are historical source data.'
        });
      }
      (section.rows || []).forEach(row=>{
        let rowClockRecord=null;
        if (row.time_hms !== undefined) {
          rowClockRecord=addSource(section,sectionIndex,row,'row_clock_time',row.time_hms,{
            fieldName:'time_hms',
            numeric:false,
            historicalTimeOriginal:row.time_hms,
            historicalTimeSeconds:clockSeconds(row.time_hms),
            timeRelation:'printed_row_clock',
            note:'Clock value printed in the row. Its exact relation to each numeric column is resolved separately by experiment semantics.'
          });
        }
        if (row.divisions !== undefined) {
          addSource(section,sectionIndex,row,'division_reading',row.divisions,{
            fieldName:'divisions',
            timeRelation:rowClockRecord ? 'linked_row_clock' : 'none',
            relatedSourceRecordIds:rowClockRecord ? [rowClockRecord.record_id] : []
          });
        }
        if (row.extreme_point !== undefined) {
          addSource(section,sectionIndex,row,'extreme_point',row.extreme_point,{
            fieldName:'extreme_point',
            timeRelation:rowClockRecord ? 'same_row_clock_semantics_unresolved' : 'clock_not_printed_for_extreme',
            relatedSourceRecordIds:rowClockRecord ? [rowClockRecord.record_id] : [],
            note:'Extreme-point value is historical. A clock printed in the same row is linked but is not automatically asserted to be the exact extreme time.'
          });
        }
        (row.division_crossings || []).forEach((crossing,index)=>{
          addSource(section,sectionIndex,row,'division_crossing',crossing.division,{
            fieldName:'division_crossings.division',
            ordinal:index,
            historicalTimeOriginal:crossing.time_hms || '',
            historicalTimeSeconds:clockSeconds(crossing.time_hms),
            timeRelation:crossing.time_hms ? 'same_crossing_printed_clock' : 'none'
          });
        });
        if (row.time_of_mid_vibration !== undefined) {
          addSource(section,sectionIndex,row,'middle_vibration_time',row.time_of_mid_vibration,{
            fieldName:'time_of_mid_vibration',
            numeric:false,
            historicalTimeOriginal:row.time_of_mid_vibration,
            historicalTimeSeconds:clockSeconds(row.time_of_mid_vibration),
            timeRelation:'printed_middle_vibration_clock'
          });
        }
        if (row.thermometer_air !== undefined) {
          addSource(section,sectionIndex,row,'thermometer_air',row.thermometer_air,{fieldName:'thermometer_air'});
        }
        if (row.thermometer_weight !== undefined) {
          addSource(section,sectionIndex,row,'thermometer_weight',row.thermometer_weight,{fieldName:'thermometer_weight'});
        }
        if (row.point_of_rest !== undefined) {
          addCalculation(section,sectionIndex,row,'point_of_rest',row.point_of_rest,{
            fieldName:'point_of_rest',
            origin:'printed_table_calculation',
            note:'Point of rest is printed in the original table and is kept separate from direct observed readings and from application reconstruction.'
          });
        }
        if (row.difference !== undefined) {
          addCalculation(section,sectionIndex,row,'vibration_interval',row.difference,{
            fieldName:'difference',
            numeric:false,
            durationSeconds:durationSeconds(row.difference),
            origin:'printed_table_difference',
            note:'Difference/time interval printed in the original table.'
          });
        }
      });
    });

    (((experiment.summary || {}).motions) || []).forEach((item,index)=>{
      addCalculation(null,-1,{row_id:`${experiment.data_key}-SUMMARY-MOTION-${index+1}`,source_page:(experiment.source_pages || []).join('–'),raw_text:''},'summary_motion',item.value,{
        ordinal:index,
        fieldName:'summary.motions',
        origin:'printed_experiment_summary',
        note:`Historical summary motion (${item.transition || 'transition'}; ${item.unit || 'divisions'}).`
      });
    });
    (((experiment.summary || {}).vibration_periods) || []).forEach((item,index)=>{
      addCalculation(null,-1,{row_id:`${experiment.data_key}-SUMMARY-PERIOD-${index+1}`,source_page:(experiment.source_pages || []).join('–'),raw_text:''},'summary_vibration_period',item.value,{
        ordinal:index,
        fieldName:'summary.vibration_periods',
        numeric:false,
        durationSeconds:durationSeconds(item.value),
        origin:'printed_experiment_summary',
        note:`Historical summary vibration period (${item.position || 'unspecified position'}).`
      });
    });

    return Object.freeze({
      experiment_id:experiment.id,
      data_key:experiment.data_key,
      source_records:freezeList(sourceRecords),
      historical_calculation_records:freezeList(calculationRecords),
      source_index:Object.freeze(sourceIndex),
      historical_calculation_index:Object.freeze(calculationIndex)
    });
  }

  const experiments=Object.freeze((RAW.experiments || []).map(buildExperimentLayers));
  const byKey=Object.freeze(experiments.reduce((index,item)=>{ index[item.data_key]=item; return index; },{}));
  const byId=Object.freeze(experiments.reduce((index,item)=>{ index[item.experiment_id]=item; return index; },{}));

  function findSourceRecordId(dataKey,rowId,kind,ordinal){
    const layer=byKey[dataKey];
    return layer ? (layer.source_index[locator(dataKey,rowId,kind,ordinal)] || '') : '';
  }
  function findHistoricalCalculationRecordId(dataKey,rowId,kind,ordinal){
    const layer=byKey[dataKey];
    return layer ? (layer.historical_calculation_index[locator(dataKey,rowId,kind,ordinal)] || '') : '';
  }

  window.CAVENDISH_DATA_LAYERS = Object.freeze({
    schema_version:'1.0.0',
    build:'CV079B02',
    raw_data_build:RAW.build || 'unknown',
    policy:Object.freeze({
      historical_source:'Directly printed observations, clocks, temperatures and mass-position events. No application model time is stored in this layer.',
      historical_printed_calculation:'Point of rest, printed differences, periods and summary motions as printed by Cavendish. These are historical source values but are not direct observations.',
      reconstruction:'Application-only placement, interpolation and playback compression. Reconstruction values must never be represented as historical clock data.'
    }),
    experiments,
    byKey,
    byId,
    findSourceRecordId,
    findHistoricalCalculationRecordId,
    locator,
    parseNumber:numberValue,
    parseClock:clockSeconds,
    parseDuration:durationSeconds,
    parseEventClock:eventClockSeconds
  });
})();
