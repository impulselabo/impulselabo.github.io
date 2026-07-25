const APP_BUILD = 'CV081A05';

const amplitudeSlider = document.getElementById('amplitudeSlider');
const dampingSlider = document.getElementById('dampingSlider');
const restShiftSlider = document.getElementById('restShiftSlider');
const restShiftAfterSlider = document.getElementById('restShiftAfterSlider');
const amplitudeSliderValue = document.getElementById('amplitudeSliderValue');
const dampingSliderValue = document.getElementById('dampingSliderValue');
const restShiftSliderValue = document.getElementById('restShiftSliderValue');
const restShiftAfterSliderValue = document.getElementById('restShiftAfterSliderValue');
const movingVernierScale = document.getElementById('movingVernierScale');
const fixedMainScale = document.getElementById('fixedMainScale');
const historicalCoincidenceMarker = document.getElementById('historicalCoincidenceMarker');
const historicalMainTicks = document.getElementById('historicalMainTicks');
const telescopeReadingBadge = document.getElementById('telescopeReadingBadge');
// Compatibility alias used by the existing resize observer.
const vernier = movingVernierScale;
const readValue = document.getElementById('readValue');
const vernierValue = document.getElementById('vernierValue');
const matchValue = document.getElementById('matchValue');
const summaryOffset = document.getElementById('summaryOffset');
const summaryRead = document.getElementById('summaryRead');
const motionMode = document.getElementById('motionMode');
const waveSvg = document.getElementById('waveSvg');
const waveCurrentLine = document.getElementById('waveCurrentLine');
const waveRecordMarkers = document.getElementById('waveRecordMarkers');
const waveObservedPath = document.getElementById('waveObservedPath');
const waveReconstructionPath = document.getElementById('waveReconstructionPath');
const waveReconstructionBand = document.getElementById('waveReconstructionBand');
const waveResidualAudit = document.getElementById('waveResidualAudit');
const modelValidationPanel = document.getElementById('modelValidationPanel');
const waveGapBands = document.getElementById('waveGapBands');
const waveTimeFoldMarker = document.getElementById('waveTimeFoldMarker');
const waveTimeAxisToolbar = document.getElementById('waveTimeAxisToolbar');
const waveTimeAxisMode = document.getElementById('waveTimeAxisMode');
const waveTimeAxisToggle = document.getElementById('waveTimeAxisToggle');
const wavePhaseLane = document.getElementById('wavePhaseLane');
const waveSupportDetails = document.getElementById('waveSupportDetails');
const waveSupportSummary = document.getElementById('waveSupportSummary');
const waveEquilibriumLine = document.getElementById('waveEquilibriumLine');
const waveEquilibriumLabel = document.getElementById('waveEquilibriumLabel');
const waveEquilibriumLineAlt = document.getElementById('waveEquilibriumLineAlt');
const waveEquilibriumLabelAlt = document.getElementById('waveEquilibriumLabelAlt');
const waveSwitchLine = document.getElementById('waveSwitchLine');
const waveSwitchLabel = document.getElementById('waveSwitchLabel');
const waveStatusText = document.getElementById('waveStatusText');
const waveMeaningStatus = document.getElementById('waveMeaningStatus');
const waveMeaningCurrent = document.querySelector('.meaning-current');
const waveMeaningHelp = document.getElementById('waveMeaningHelp');
const waveHistoricalGuideLegend = document.getElementById('waveHistoricalGuideLegend');
const waveReconstructionGuideLegend = document.getElementById('waveReconstructionGuideLegend');
const waveDirectClockGuideLegend = document.getElementById('waveDirectClockGuideLegend');
const waveCrossingTimeGuideLegend = document.getElementById('waveCrossingTimeGuideLegend');
const waveHistoricalMarkerLegend = document.getElementById('waveHistoricalMarkerLegend');
const waveReconstructedMarkerLegend = document.getElementById('waveReconstructedMarkerLegend');
const waveTransitionUncertaintyLegendText = document.getElementById('waveTransitionUncertaintyLegendText');
const waveMissedObservationLegendText = document.getElementById('waveMissedObservationLegendText');
const defaultWaveMeaningHelp = waveMeaningHelp ? waveMeaningHelp.getAttribute('data-help') : '';
const waveYLabels = [1,2,3,4,5].map(index => document.getElementById(`waveYLabel${index}`));
const waveTimeAxisGrid = document.getElementById('waveTimeAxisGrid');
const waveTimeAxisLabels = document.getElementById('waveTimeAxisLabels');
const waveTimeAxisMarkers = document.getElementById('waveTimeAxisMarkers');
const waveTimeMarkerLegend = document.getElementById('waveTimeMarkerLegend');
const waveTransitionUncertaintyLegend = document.getElementById('waveTransitionUncertaintyLegend');
const waveMissedObservationLegend = document.getElementById('waveMissedObservationLegend');
const waveIdleMessage = document.getElementById('waveIdleMessage');
const waveIdleTitle = document.getElementById('waveIdleTitle');
const waveIdleDetail = document.getElementById('waveIdleDetail');
const waveXAxisLabel = document.getElementById('waveXAxisLabel');
const arrangementLabelA = document.getElementById('arrangementLabelA');
const arrangementLabelB = document.getElementById('arrangementLabelB');
const topViewStage = document.getElementById('topViewStage');
const largeMassPositionLabel = document.getElementById('largeMassPositionLabel');
const massSwitchCue = document.getElementById('massSwitchCue');
const movingLargeMass1 = document.getElementById('movingLargeMass1');
const movingLargeMass2 = document.getElementById('movingLargeMass2');
const massStateCard = document.getElementById('massStateCard');
const weightArm = document.getElementById('weightArm');
const thetaReadout = document.getElementById('thetaReadout');
const debugTheta = document.getElementById('debugTheta');
const debugRead = document.getElementById('debugRead');
const debugVernier = document.getElementById('debugVernier');
const debugMatch = document.getElementById('debugMatch');
const debugLargeMass = document.getElementById('debugLargeMass');
const debugCycle = document.getElementById('debugCycle');
const debugTimelineSlot = document.getElementById('debugTimelineSlot');
const debugTime = document.getElementById('debugTime');
const readingRecordBody = document.getElementById('readingRecordBody');
const avgReadA = document.getElementById('avgReadA');
const avgReadB = document.getElementById('avgReadB');
const avgReadC = document.getElementById('avgReadC');
const livePositionCWrap = document.getElementById('livePositionCWrap');
const readDiffAB = document.getElementById('readDiffAB');
const gravityReadDiff = document.getElementById('gravityReadDiff');
const readingRecordPanel = document.getElementById('readingRecordPanel');
const readingRecordExperiment = document.getElementById('readingRecordExperiment');
const readingRecordCount = document.getElementById('readingRecordCount');
const readingRecordTimeRange = document.getElementById('readingRecordTimeRange');
const readingRecordReadRange = document.getElementById('readingRecordReadRange');
const resultSummaryPanel = document.getElementById('resultSummaryPanel');
const resultSummaryNote = document.getElementById('resultSummaryNote');
const resultSummaryGrid = document.getElementById('resultSummaryGrid');
const resultCountA = document.getElementById('resultCountA');
const resultCountB = document.getElementById('resultCountB');
const resultAvgA = document.getElementById('resultAvgA');
const resultAvgB = document.getElementById('resultAvgB');
const resultCountC = document.getElementById('resultCountC');
const resultAvgC = document.getElementById('resultAvgC');
const resultPositionCCountWrap = document.getElementById('resultPositionCCountWrap');
const resultPositionCAverageWrap = document.getElementById('resultPositionCAverageWrap');
const resultDiffAB = document.getElementById('resultDiffAB');
const resultDifferenceWrap = document.getElementById('resultDifferenceWrap');
const resultGravityDiffWrap = document.getElementById('resultGravityDiffWrap');
const resultGravityDiff = document.getElementById('resultGravityDiff');
const livePositionLabelA = document.getElementById('livePositionLabelA');
const livePositionLabelB = document.getElementById('livePositionLabelB');
const livePositionLabelC = document.getElementById('livePositionLabelC');
const liveDifferenceLabel = document.getElementById('liveDifferenceLabel');
const liveDifferenceDescription = document.getElementById('liveDifferenceDescription');
const resultCountLabelA = document.getElementById('resultCountLabelA');
const resultCountLabelB = document.getElementById('resultCountLabelB');
const resultCountLabelC = document.getElementById('resultCountLabelC');
const resultAverageLabelA = document.getElementById('resultAverageLabelA');
const resultAverageLabelB = document.getElementById('resultAverageLabelB');
const resultAverageLabelC = document.getElementById('resultAverageLabelC');
const resultDifferenceLabel = document.getElementById('resultDifferenceLabel');
const exportHistoricalCsvBtn = document.getElementById('exportHistoricalCsvBtn');
const exportAnalysisCsvBtn = document.getElementById('exportAnalysisCsvBtn');
const previewHistoricalCsvBtn = document.getElementById('previewHistoricalCsvBtn');
const previewAnalysisCsvBtn = document.getElementById('previewAnalysisCsvBtn');
const openReportPreviewBtn = document.getElementById('openReportPreviewBtn');
const pcCompletedOutputCommands = document.getElementById('pcCompletedOutputCommands');
const leftPreviewHistoricalCsvBtn = document.getElementById('leftPreviewHistoricalCsvBtn');
const leftExportHistoricalCsvBtn = document.getElementById('leftExportHistoricalCsvBtn');
const leftPreviewAnalysisCsvBtn = document.getElementById('leftPreviewAnalysisCsvBtn');
const leftExportAnalysisCsvBtn = document.getElementById('leftExportAnalysisCsvBtn');
const leftOpenReportPreviewBtn = document.getElementById('leftOpenReportPreviewBtn');
const toggleReadMetric = document.getElementById('toggleReadMetric');
const toggleVernierMetric = document.getElementById('toggleVernierMetric');
const toggleMatchMetric = document.getElementById('toggleMatchMetric');
const toggleVernierScale = document.getElementById('toggleVernierScale');
const toggleReadPointer = document.getElementById('toggleReadPointer');
const toggleWaveMarkers = document.getElementById('toggleWaveMarkers');
const toggleEquilibriumGuides = document.getElementById('toggleEquilibriumGuides');
const toggleWeightNote = document.getElementById('toggleWeightNote');
const toggleTimelineDetail = document.getElementById('toggleTimelineDetail');
const dataReportOutputPanel = document.getElementById('dataReportOutputPanel');
const outputStatusMessage = document.getElementById('outputStatusMessage');
const historicalCompactPanel = document.getElementById('historicalCompactPanel');
const historicalRowTrialPanel = document.getElementById('historicalRowTrialPanel');
const stateLabel = document.getElementById('stateLabel');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');
const clearBtn = document.getElementById('clearBtn');
const resetBtn = document.getElementById('resetBtn');
const experimentSetSelect = document.getElementById('experimentSetSelect');
const historicalDatasetSummary = document.getElementById('historicalDatasetSummary');
const historicalDatasetId = document.getElementById('historicalDatasetId');
const historicalDatasetInternalId = document.getElementById('historicalDatasetInternalId');
const historicalDatasetDate = document.getElementById('historicalDatasetDate');
const historicalDatasetStatus = document.getElementById('historicalDatasetStatus');
const historicalDatasetConnection = document.getElementById('historicalDatasetConnection');
const historicalDatasetCsvMeta = document.getElementById('historicalDatasetCsvMeta');
const historicalDatasetRegistryNote = document.getElementById('historicalDatasetRegistryNote');
const historicalRowDataStatusControl = document.getElementById('historicalRowDataStatusControl');
const historicalDatasetColumns = document.getElementById('historicalDatasetColumns');
const historicalRowTrialSummary = document.getElementById('historicalRowTrialSummary');
const historicalRowTrialNote = document.getElementById('historicalRowTrialNote');
const historicalRowTrialGrid = document.getElementById('historicalRowTrialGrid');

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
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(safeDate);
  const values = Object.fromEntries(parts.filter(part => part.type !== 'literal').map(part => [part.type, part.value]));
  return {year:values.year, month:values.month, day:values.day, hour:values.hour, minute:values.minute, second:values.second};
}
function formatJstIsoTimestamp(value = new Date()){
  const part = getJstDateTimeParts(value);
  return `${part.year}-${part.month}-${part.day}T${part.hour}:${part.minute}:${part.second}+09:00`;
}
function formatJstCompactTimestamp(value = new Date()){
  const part = getJstDateTimeParts(value);
  return `${part.year}${part.month}${part.day}${part.hour}${part.minute}${part.second}`;
}
const historicalRowTrialCaution = document.getElementById('historicalRowTrialCaution');


// CV067A: Row-data small trial CSV metadata correction.
// Fixes CSV metadata so Experiment I row-data small trial status/count are recorded separately from minimal transcription records.
// CV067: Experiment I Original Table Row Data Small Trial Entry.
// Adds a few visually transcribed Experiment I original-table rows for display/metadata verification only.
// The trial rows are not connected to observation motion, raw reading records, CSV data body columns, or physics.
// CV066: Experiment I Original Table Row Data Verification Method.
// Defines how Experiment I row data will be checked against the original table before actual row-value entry.
// No new historical row numbers are added and no observation/calculation connection is made.
// CV065: Experiment I Original Table Row Data Preparation.
// Prepares the row-data transcription container, columns, and verification rules before adding actual row values.
// No new historical row numbers are added and no observation/calculation connection is made.
// CV064: Historical Heading Date Organization.
// Organizes heading/date labels for Experiment V/VI/X/XIV before row-data entry.
// Heading/date labels remain reference metadata only and do not connect to observation motion, raw readings, or calculations.
// CV063: Experiment I CSV Metadata Check.
// Confirms that Experiment I transcription information is written to leading CSV metadata only.
// Reading-record data body columns remain unchanged and no physics/calculation connection is made.
// CV062A: Experiment I Visual Transcription Recheck.
// Rechecks the already-entered Experiment I minimal transcription display, CSV metadata, and non-connection policy.
// No new historical numbers are added and no physics/calculation connection is made.
// CV062: Historical Data Entry Order.
// Defines the staged order for entering historical table data before any calculation connection.
// CV061D: Clarify untranscribed Experiment display.
// CV061C: Clarify historical ID and observation date meaning.
// CAV-1798 identifies the 1798 published source series; the date label identifies the observation date for each Experiment.
// CV061B: Historical Date Year Label.
// Adds a year-supplied date label for Experiment I while preserving the original table heading.
// The original heading remains Aug. 5; the year is displayed as contextual supplemental information.
// CV061: Historical Data Minimal Transcription Rules.
// Adds a strict rule layer before entering historical table numbers.
// Direct transcription, blank handling, and derived/estimated data are separated.
// CV060C CSV metadata format is kept.
// CV060C: CSV Metadata Format Check.
// The observation-set selector maps to an internal historical dataset ID.
// The selected dataset reference is recorded in a leading CSV metadata block; data rows start after __data_section.
// Raw reading data columns remain unchanged; unverified historical table numbers remain unconnected.
// This does not replace simulated observation motion, physics, waveform, or result summary logic.
// The original Cavendish tables contain experiment labels, dates, observed divisions/times, points of rest,
// time of middle vibration, difference, and occasional thermometer/error notes.
// Unverified numeric table values are intentionally not asserted here as final historical values.
const HISTORICAL_DATA_COLUMNS = Object.freeze([
  'experiment_id',
  'date_label',
  'mass_position_label',
  'extreme_points',
  'divisions',
  'time_hms',
  'point_of_rest',
  'time_of_mid_vibration',
  'difference',
  'thermometer_air',
  'thermometer_weight',
  'observation_note'
]);

const HISTORICAL_TRANSCRIPTION_RULES = Object.freeze({
  direct_transcription: [
    'experiment_id',
    'date_label',
    'mass_position_label',
    'extreme_points',
    'divisions',
    'time_hms',
    'point_of_rest',
    'time_of_mid_vibration',
    'difference',
    'thermometer_air',
    'thermometer_weight',
    'observation_note'
  ],
  preserve_as_is: '原表の空欄・不明・未確認値は推定で埋めず、そのまま保持する。丸め直し、平均化、単位換算、補正値への置換はしない。',
  derived_data: 'middle-vibration位相で拘束した補完波形、β感度範囲、史実時計付き読取との差、時刻未記載極値の記録順を再構成詳細データとして扱う。この一致確認は独立検証ではない。時刻未記載極値に擬似時刻は付与せず、角度・力・G推定値は生成しない。',
  excluded_from_historical_table: '実験ごとのシールドON/OFF、遮蔽率、現代的な安定判定、画面内部状態は史実原表転記データへ混ぜない。'
});
window.CAVENDISH_HISTORICAL_TRANSCRIPTION_RULES = HISTORICAL_TRANSCRIPTION_RULES;

// CV072N: older historical detail-panel datasets are kept in the progress record, not in active UI code.


const IMPORTED_HISTORICAL_DATA = window.CAVENDISH_HISTORICAL_DATA_V1 || Object.freeze({
  experiments:[],
  conclusion_table:[],
  apparatus_parameters:[],
  observation_method_example:{rows:[],derived_examples:[]},
  supplemental_numeric_observations:[],
  computation_parameters:[],
  appendix_case_attraction:{table:[]},
  historical_comparisons:[],
  mean_density_statements:[]
});

const HISTORICAL_REPLAY = window.CAVENDISH_HISTORICAL_REPLAY || Object.freeze({
  profiles: [], byId: {}, byKey: {}, playback_duration_s: 72,
  formatTime: value => String(value ?? '—'),
  positionLabel: value => String(value || 'Unknown position'),
  positionShort: value => String(value || 'Unknown')
});

const OBSERVATION_SET_REGISTRY = window.CAVENDISH_OBSERVATION_SET_REGISTRY || Object.freeze({build:'missing',sets:[],patterns:{}});
const OBSERVATION_SET_REGISTRY_BY_KEY = Object.freeze((OBSERVATION_SET_REGISTRY.sets || []).reduce((acc,item)=>{acc[item.data_key]=item;return acc;},{}));

function getObservationSetRegistration(itemOrProfile){
  const key=String(itemOrProfile&&itemOrProfile.data_key||'');
  return OBSERVATION_SET_REGISTRY_BY_KEY[key] || Object.freeze({
    registration_status:'column_reaudit_pending',
    registration_status_ja:'原表列意味再監査中',
    formal_replay:false,
    display_pattern_id:'unclassified',
    display_pattern_name_ja:'未分類',
    marker_policy:'suppressed_during_reaudit',
    ui_note_ja:'原表の列意味・時刻所属・記録順・配置変更を再監査中です。確定するまで史実波形として表示しません。'
  });
}

function isTemporaryObservationSet(profile=getActiveReplayProfile()){
  const registration=getObservationSetRegistration(profile);
  return registration.registration_status==='temporary_registered';
}

function isCommonStructureObservationSet(profile=getActiveReplayProfile()){
  const registration=getObservationSetRegistration(profile);
  return registration.registration_status==='common_structure_connected';
}

function isColumnReauditObservationSet(profile=getActiveReplayProfile()){
  const registration=getObservationSetRegistration(profile);
  return registration.registration_status==='column_reaudit_pending' || Boolean(profile&&profile.column_reaudit_pending);
}

function getActiveReplayProfile(){
  const item = getSelectedHistoricalDataset();
  if (!item) return HISTORICAL_REPLAY.profiles[0] || null;
  return HISTORICAL_REPLAY.byId[item.id] || HISTORICAL_REPLAY.byKey[item.data_key] || HISTORICAL_REPLAY.profiles[0] || null;
}

function positionShortJa(position){
  return ({midway:'中間位置',positive:'正位置',negative:'負位置'}[position] || String(position || '不明'));
}

function positionLongJa(position){
  return ({midway:'中間位置',positive:'正位置',negative:'負位置'}[position] || String(position || '位置不明'));
}

function formatHistoricalRead(value){
  const number = Number(value);
  if (!Number.isFinite(number)) return '-- div';
  return `${number.toFixed(3)} div`;
}

// CV080A18R7: observer-facing telescope/wave readouts follow the historical
// scale readability (0.1 div). Internal calculations and CSV retain 0.001 div.
function formatObservedReadDisplay(value){
  const number = Number(value);
  if (!Number.isFinite(number)) return '—';
  return `${number.toFixed(1)} div`;
}

function isReconstructedTimeBasis(value){
  const basis=String(value || '');
  return basis.includes('reconstructed') || basis.includes('physical_model') || basis.includes('model_phase') || basis.includes('untimed_extreme');
}

function isOrderConstraintTimeBasis(value){
  const basis=String(value || '');
  return basis === 'reconstructed_order_time' || basis === 'physical_model_phase_time' || basis === 'untimed_extreme_order';
}

function isHistoricalTableCalculationNoInstant(value){
  return String(value || '') === 'historical_table_calculation_no_instant';
}

function hasHistoricalClockClaim(record){
  if(!record) return false;
  if(record.historical_time_claim===false) return false;
  if(isOrderConstraintTimeBasis(record.time_basis)||isHistoricalTableCalculationNoInstant(record.time_basis)) return false;
  return Boolean(record.historical_time_hms&&record.historical_time_hms!=='—');
}

function timeBasisLabelJa(value){
  const basis=String(value || '');
  if(basis==='untimed_extreme_order') return '時刻未記載・記録順';
  if(basis==='physical_model_phase_time') return '時刻未記載・計算上の振動位置';
  if(isHistoricalTableCalculationNoInstant(basis)) return '原表の計算値・瞬間時刻なし';
  if(isOrderConstraintTimeBasis(basis)) return '時刻未記載・記録順のみ';
  if(basis.includes('transition_interval')&&basis.includes('reconstruction')) return '配置変更範囲・再構成境界を含む';
  if(basis.includes('transition_interval')) return '配置変更の史実時刻範囲';
  if(basis.includes('missed')&&basis.includes('reconstruction')) return '原表欠測・範囲は再構成';
  if(basis.includes('missed')) return '原表欠測区間';
  if(basis.includes('physical_model')) return '補完計算';
  if(basis.includes('reconstructed')) return '時刻補完';
  if(basis.includes('event_time')) return '記録された移動時刻';
  if(basis.includes('table_derived')) return '当時の記録から算出';
  if(basis.includes('historical')) return '当時の時計時刻';
  if(basis.includes('reaudit')) return '表示保留';
  return '再生時刻';
}

function formatAxisValue(value, range){
  const number = Number(value);
  if (!Number.isFinite(number)) return '—';
  const absoluteRange = Math.abs(Number(range) || 0);
  const digits = absoluteRange >= 20 ? 1 : (absoluteRange >= 2 ? 2 : 3);
  return number.toFixed(digits);
}

function flattenHistoricalExperimentRows(experiment){
  const rows = [];
  (experiment.sections || []).forEach(section => {
    (section.rows || []).forEach(row => {
      const crossings = Array.isArray(row.division_crossings)
        ? row.division_crossings.map(item => `${item.division}@${item.time_hms}`).join(' / ')
        : '';
      rows.push({
        row_id: row.row_id || `${experiment.data_key}-ROW-${String(rows.length + 1).padStart(3,'0')}`,
        raw_text: row.raw_text || '',
        normalized_text: row.raw_text || '',
        section_label: section.label || '',
        mass_position_label: section.mass_position || '',
        extreme_points: row.extreme_point || 'blank',
        divisions: row.divisions || crossings || 'blank',
        time_hms: row.time_hms || 'blank',
        point_of_rest: row.point_of_rest || 'blank',
        time_of_mid_vibration: row.time_of_mid_vibration || 'blank',
        difference: row.difference || 'blank',
        thermometer_air: row.thermometer_air || 'blank',
        thermometer_weight: row.thermometer_weight || 'blank',
        thermometer_note: [row.thermometer_air ? `air ${row.thermometer_air}` : '', row.thermometer_weight ? `weight ${row.thermometer_weight}` : ''].filter(Boolean).join(' / ') || 'blank',
        observation_note: row.observation_note || '',
        source_page: row.source_page || (section.source_pages || []).join('–'),
        confidence:'confirmed',
        check_status:row.verification || 'visual_check_passed',
        verification_note:row.observation_note || '1798年原論文の原表画像と照合済み。'
      });
    });
  });
  return rows;
}

const HISTORICAL_DATASETS = Object.freeze((IMPORTED_HISTORICAL_DATA.experiments || []).map(experiment => {
  const rowRecords = flattenHistoricalExperimentRows(experiment);
  const records = [];
  (experiment.summary && experiment.summary.motions || []).forEach(item => records.push({
    field:`motion_${item.transition}`,
    value:`${item.value} ${item.unit || ''}`.trim(),
    confidence:'原表要約値確認'
  }));
  (experiment.summary && experiment.summary.vibration_periods || []).forEach(item => records.push({
    field:`vibration_${item.position}`,
    value:item.value,
    confidence:'原表要約値確認'
  }));
  return Object.freeze({
    id:experiment.id,
    data_key:experiment.data_key,
    id_meaning:'CAV-1798は1798年公表のCavendish原論文系列IDです。日付欄は各Experimentの観測日付を示します。',
    label:experiment.label,
    date_label:experiment.date_label,
    original_date_label:experiment.date_original,
    supplemented_date_label:experiment.date_iso,
    original_heading:experiment.heading_original,
    source_pages:experiment.source_pages,
    table_source_pages:experiment.table_source_pages || experiment.source_pages || [],
    narrative_source_pages:experiment.narrative_source_pages || [],
    source_page_note_ja:experiment.source_page_note_ja || '',
    status:'史実原表数値転記済み',
    connection:'史実原表データ・観測表示接続済み',
    transcription_status:'full_historical_table_imported',
    source_reference:'Cavendish 1798 original experiment table',
    row_trial_status:'full_historical_table_imported',
    row_trial_initial_count:rowRecords.length,
    row_trial_additional_count:0,
    row_trial_records:Object.freeze(rowRecords),
    row_trial_notice:`${experiment.label} 原表数値 ${rowRecords.length}行を転記。史実値を観測表示へ接続し、時刻未記載点は史実時計と分離して表示。`,
    records:Object.freeze(records),
    sections:experiment.sections || [],
    summary:experiment.summary || {},
    note:`原論文p.${(experiment.table_source_pages || experiment.source_pages || []).join('–')}の表を目視転記。${(experiment.narrative_source_pages || []).length ? `関連叙述 p.${experiment.narrative_source_pages.join('–')}。` : ''}小数点は原表のカンマ表記を保持。空欄・missed表記は推定で補わない。`
  });
}));

const EXPERIMENT_I_ROW_DATA_SMALL_TRIAL = Object.freeze(
  HISTORICAL_DATASETS.length ? HISTORICAL_DATASETS[0].row_trial_records : []
);
window.CAVENDISH_EXPERIMENT_I_ROW_DATA_SMALL_TRIAL = EXPERIMENT_I_ROW_DATA_SMALL_TRIAL;
window.CAVENDISH_HISTORICAL_DATASETS = HISTORICAL_DATASETS;
window.CAVENDISH_HISTORICAL_DATA_COLUMNS = HISTORICAL_DATA_COLUMNS;
window.CAVENDISH_HISTORICAL_ENTRY_ORDER = Object.freeze({
  purpose:'史実表データの投入順序を管理し、未確認値を観測値・計算値として扱わない。',
  stages:[
    '第1段階: 見出し・日付・重り位置',
    '第2段階: 移動時刻・motion・time of one vibrationなどの要約値',
    '第3段階: Extreme points / Divisions / Time / Point of rest / Time of mid. vibration / Difference の行データ',
    '第4段階: OCR依存値・曖昧値の目視再確認',
    '第5段階: 参照条件・表示・CSVメタへの接続判断。読取原本CSV本体列は維持する。'
  ],
  priority:['Experiment Iの目視再確認','見出し・日付整理済みのExperiment V/VI/X/XIV','残りのExperiment II〜XVII'],
  no_connection_until_verified:true
});

function getSelectedHistoricalDataset(){
  const selectedId = experimentSetSelect ? experimentSetSelect.value : 'experiment-i';
  return HISTORICAL_DATASETS.find(item => item.id === selectedId) || HISTORICAL_DATASETS[0];
}

function getHistoricalIdMeaning(item){
  if (item && item.id_meaning) return item.id_meaning;
  return 'CAV-1798は1798年公表のCavendish原論文系列IDです。日付欄は各実験の観測日付または当時の記録見出しを示し、ID内の1798とは役割が異なります。';
}

function experimentLabelJa(value){
  const text=String(value || '');
  const match=text.match(/^Experiment\s+([IVXLCDM]+)$/i);
  return match ? `実験${match[1].toUpperCase()}` : text.replace(/Experiment/g,'実験');
}

function getHistoricalTableSourcePages(item){
  if (item && Array.isArray(item.table_source_pages) && item.table_source_pages.length) return item.table_source_pages;
  return item && Array.isArray(item.source_pages) ? item.source_pages : [];
}

function getHistoricalNarrativeSourcePages(item){
  return item && Array.isArray(item.narrative_source_pages) ? item.narrative_source_pages : [];
}

function populateHistoricalDatasetOptions(){
  if (!experimentSetSelect) return;
  const current = experimentSetSelect.value || DEFAULT_CONTROL_VALUES.experimentSetSelect;
  experimentSetSelect.innerHTML = HISTORICAL_DATASETS.map(item => {
    return `<option value="${item.id}">${experimentLabelJa(item.label)}</option>`;
  }).join('');
  experimentSetSelect.value = HISTORICAL_DATASETS.some(item => item.id === current) ? current : DEFAULT_CONTROL_VALUES.experimentSetSelect;
}

function updateHistoricalDatasetPanel(){
  const item = getSelectedHistoricalDataset();
  if (!item) return;
  const registration=getObservationSetRegistration(item);
  const auditPending=registration.registration_status==='column_reaudit_pending';
  if (historicalDatasetSummary) historicalDatasetSummary.textContent = `史実データ：${experimentLabelJa(item.label)} / ${item.data_key || item.id}`;
  if (historicalDatasetId) historicalDatasetId.textContent = experimentLabelJa(item.label);
  if (historicalDatasetInternalId) historicalDatasetInternalId.textContent = item.data_key || item.id;
  if (historicalDatasetDate) historicalDatasetDate.textContent = item.date_label || '未入力';
  if (historicalDatasetStatus) historicalDatasetStatus.textContent = registration.registration_status_ja || (auditPending?'原表列意味再監査中':'正式接続済み');
  if (historicalDatasetConnection) historicalDatasetConnection.textContent = auditPending?'史実波形表示を保留':'史実再生へ正式接続';
  if (historicalDatasetCsvMeta) historicalDatasetCsvMeta.textContent = auditPending?'原表値・行順・出典を保持':'値・時刻・出典を記録';
  if (historicalDatasetRegistryNote) historicalDatasetRegistryNote.textContent = registration.ui_note_ja || '';
  if (historicalRowDataStatusControl) {
    const rowCount = Array.isArray(item.row_trial_records) ? item.row_trial_records.length : 0;
    const tablePages = getHistoricalTableSourcePages(item);
    const pages = tablePages.length ? ` / 原論文 p.${tablePages.join('–')}` : '';
    historicalRowDataStatusControl.textContent = `${rowCount}行${pages}`;
  }
  if (historicalDatasetColumns) historicalDatasetColumns.textContent = HISTORICAL_DATA_COLUMNS.join(' / ');
  updateHistoricalRowTrialPanel(item);
  updateHistoricalReplayScale();
  updateFlowTimelineLabels();
  updateWaveformStatus();
  updateObservationDetailVisibility();
  if (observationState === 'idle') update();
}

function historicalCheckStatusLabel(value){
  const labels = {
    needs_visual_check: '目視再確認が必要',
    visual_check_passed: '目視確認済み',
    confirmed: '確認済み',
    unclear: '判読不明'
  };
  return labels[value] || String(value || '—');
}

function updateHistoricalRowTrialPanel(item){
  if (!historicalRowTrialSummary || !historicalRowTrialGrid) return;
  const label = item && item.label ? experimentLabelJa(item.label) : '選択中の実験';
  const rows = item && Array.isArray(item.row_trial_records) ? item.row_trial_records : [];
  const tablePages = getHistoricalTableSourcePages(item);
  const narrativePages = getHistoricalNarrativeSourcePages(item);
  const pages = tablePages.length ? tablePages.join('–') : '—';
  historicalRowTrialSummary.textContent = `${label} 当時の観測記録：${rows.length}行`;
  if (historicalRowTrialNote) {
    const narrativeNote = narrativePages.length ? ` 関連叙述は p.${narrativePages.join('–')} です。` : '';
    historicalRowTrialNote.textContent = `原論文 p.${pages} の原表行に記録された振れ幅・目盛・時刻・静止点・振動中央時刻・差・温度を、当時の表記のまま収録しています。${narrativeNote}`;
  }
  historicalRowTrialGrid.innerHTML = rows.map(row => {
    const detail = [
      `振れ幅=${row.extreme_points || '空欄'}`,
      `目盛=${row.divisions || '空欄'}`,
      `時刻=${row.time_hms || '空欄'}`,
      `静止点=${row.point_of_rest || '空欄'}`,
      `振動中央=${row.time_of_mid_vibration || '空欄'}`,
      `差=${row.difference || '空欄'}`,
      row.thermometer_note && row.thermometer_note !== 'blank' ? row.thermometer_note : ''
    ].filter(Boolean).join(' / ');
    return `
      <div>
        <small>${escapeHtml(row.row_id)} / ${escapeHtml(row.section_label || '')} / p.${escapeHtml(row.source_page || pages)}</small>
        <b>${escapeHtml(row.raw_text || '—')}</b>
        <span>${escapeHtml(detail)}</span>
      </div>`;
  }).join('');
  if (historicalRowTrialCaution) {
    const registration=getObservationSetRegistration(item);
    historicalRowTrialCaution.textContent = registration.registration_status==='column_reaudit_pending'
      ? '原表の列意味・時刻の所属・記録順・配置変更を再監査中です。原表値と行順は保持しますが、確定するまで史実波形として表示しません。'
      : '当時の観測値は変更せず表示へ接続しています。時計時刻がない値は時計軸から分け、値そのものは変更しません。';
  }
}

function escapeHtml(value){
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// CV057: Align clear/reset semantics with IMPULSE LABO micro-thrust controls.
// 観測クリア = observation records/results only; current condition controls are kept.
// リセット = observation records/results plus condition controls return to initial defaults.
const DEFAULT_CONTROL_VALUES = Object.freeze({
  experimentSetSelect: 'experiment-i',
  motionMode: 'auto',
  amplitudeSlider: '34',
  dampingSlider: '7',
  restShiftSlider: '8',
  restShiftAfterSlider: '18'
});

// CV048: one observation run completes after the 9-step flow reaches 安定目安.
// The timeline no longer loops back to step 1 automatically.

// CV047: observation starts only after the Start button is pressed.
// Initial page load is an idle state; no automatic observation progress.
let running = false;
let paused = false;
let observationState = 'idle';
let time = 0;
let autoReportPreviewTriggered = false;
const MOTION_VIEW_UNTIMED_PRELUDE_MS = 2500;
const MOTION_VIEW_UNTIMED_TRANSITION_MS = 600;
let motionViewUntimedPreludeEndsAt = 0;
let motionViewUntimedPreludeRemainingMs = 0;

function hasUntimedInitialMotionPrelude(profile){
  const sections=profile&&Array.isArray(profile.motion_view_sections)?profile.motion_view_sections:[];
  return sections.length>1&&Boolean(sections[0].record_order_only)&&sections[0].position!==sections[1].position;
}
function getMotionViewUntimedPreludeRemainingMs(profile=getActiveReplayProfile()){
  if(!hasUntimedInitialMotionPrelude(profile)) return 0;
  if(observationState==='paused') return Math.max(0,Number(motionViewUntimedPreludeRemainingMs)||0);
  if(observationState!=='running'||motionViewUntimedPreludeEndsAt<=0) return 0;
  const remaining=Math.max(0,motionViewUntimedPreludeEndsAt-Date.now());
  motionViewUntimedPreludeRemainingMs=remaining;
  return remaining;
}
function isMotionViewUntimedPreludeActive(profile=getActiveReplayProfile()){
  return getMotionViewUntimedPreludeRemainingMs(profile)>0;
}
function getMotionViewUntimedPreludePhase(profile=getActiveReplayProfile()){
  if(!isMotionViewUntimedPreludeActive(profile)) return null;
  const sections=profile.motion_view_sections;
  const remaining=getMotionViewUntimedPreludeRemainingMs(profile);
  const elapsed=Math.max(0,MOTION_VIEW_UNTIMED_PRELUDE_MS-remaining);
  const transitionStart=Math.max(0,MOTION_VIEW_UNTIMED_PRELUDE_MS-MOTION_VIEW_UNTIMED_TRANSITION_MS);
  const transitionProgress=Math.max(0,Math.min(1,(elapsed-transitionStart)/MOTION_VIEW_UNTIMED_TRANSITION_MS));
  return {
    initial:sections[0],
    target:sections[1],
    elapsed_ms:elapsed,
    remaining_ms:remaining,
    transition_progress:transitionProgress,
    transitioning:transitionProgress>0
  };
}
function beginMotionViewUntimedPrelude(profile=getActiveReplayProfile()){
  motionViewUntimedPreludeRemainingMs=hasUntimedInitialMotionPrelude(profile)?MOTION_VIEW_UNTIMED_PRELUDE_MS:0;
  motionViewUntimedPreludeEndsAt=motionViewUntimedPreludeRemainingMs?Date.now()+motionViewUntimedPreludeRemainingMs:0;
}
function resetMotionViewUntimedPrelude(){
  motionViewUntimedPreludeEndsAt=0;
  motionViewUntimedPreludeRemainingMs=0;
}


function updateWaveformStatus(){
  const auditPending=isColumnReauditObservationSet();
  const states = auditPending ? {
    idle:{header:'表示保留：原表列意味を再監査中',meaning:'波形：非表示（史実解釈未確定）',currentLabel:'縦線：非表示',svgClass:'is-idle'},
    initial:{header:'表示保留：原表列意味を再監査中',meaning:'波形：非表示（史実解釈未確定）',currentLabel:'縦線：非表示',svgClass:'is-idle'},
    running:{header:'表示保留：原表列意味を再監査中',meaning:'波形：非表示（史実解釈未確定）',currentLabel:'縦線：非表示',svgClass:'is-idle'},
    paused:{header:'表示保留：原表列意味を再監査中',meaning:'波形：非表示（史実解釈未確定）',currentLabel:'縦線：非表示',svgClass:'is-idle'},
    stopped:{header:'表示保留：原表列意味を再監査中',meaning:'波形：非表示（史実解釈未確定）',currentLabel:'縦線：非表示',svgClass:'is-idle'},
    completed:{header:'表示保留：原表列意味を再監査中',meaning:'波形：非表示（史実解釈未確定）',currentLabel:'縦線：非表示',svgClass:'is-idle'}
  } : {
    idle:{header:'待機中：史実波形未再生',meaning:'波形：観測記録＋補完計算（未再生）',currentLabel:'縦線：現在',svgClass:'is-idle'},
    initial:{header:'初期配置確認中：時計軸未開始',meaning:'波形：未再生（初期配置のみ表示）',currentLabel:'縦線：開始位置',svgClass:'is-idle'},
    running:{header:'再生中：現在時刻まで表示',meaning:'波形：観測記録＋補完計算（現在まで）',currentLabel:'縦線：現在',svgClass:'is-running'},
    paused:{header:'一時停止：再生済み区間を保持',meaning:'波形：観測記録＋補完計算（保持中）',currentLabel:'縦線：一時停止位置',svgClass:'is-paused'},
    stopped:{header:'停止：再生済み区間を保持',meaning:'波形：観測記録＋補完計算（保持中）',currentLabel:'縦線：停止位置',svgClass:'is-stopped'},
    completed:{header:'観測完了：実験の史実波形を保持',meaning:'波形：観測記録＋補完計算（完了）',currentLabel:'縦線：終了位置',svgClass:'is-completed'}
  };
  const preludeActive=!auditPending&&isMotionViewUntimedPreludeActive(getActiveReplayProfile());
  const item=preludeActive
    ? (observationState==='paused'
      ? {header:'一時停止：想定補間',meaning:'波形：史実時計軸開始待ち',currentLabel:'縦線：非表示',svgClass:'is-paused'}
      : {header:'想定補間中',meaning:'波形：史実時計軸開始待ち',currentLabel:'縦線：非表示',svgClass:'is-idle'})
    : (states[observationState]||states.idle);
  if(waveStatusText) waveStatusText.textContent=item.header;
  if(waveMeaningStatus) waveMeaningStatus.textContent=item.meaning;
  if(waveMeaningCurrent) waveMeaningCurrent.textContent=item.currentLabel;
  if(waveSvg){
    waveSvg.classList.remove('is-idle','is-running','is-paused','is-stopped','is-completed');
    waveSvg.classList.add(item.svgClass);
    waveSvg.classList.toggle('is-temporary-observation-set',false);
    waveSvg.classList.toggle('is-common-structure-observation-set',false);
    waveSvg.classList.toggle('is-column-reaudit-observation-set',auditPending);
  }
}

function updateObservationDetailVisibility(){
  const hasRecords = readingRecords.length > 0;
  const showRecordPanels = hasRecords && (observationState === 'stopped' || observationState === 'completed');
  const auditPending=isColumnReauditObservationSet();
  if(historicalCompactPanel){
    historicalCompactPanel.hidden=!(showRecordPanels||auditPending);
    historicalCompactPanel.classList.toggle('is-hidden-during-observation',!(showRecordPanels||auditPending));
  }
  if(historicalRowTrialPanel){
    historicalRowTrialPanel.hidden=!(showRecordPanels||auditPending);
    historicalRowTrialPanel.classList.toggle('is-hidden-during-observation',!(showRecordPanels||auditPending));
  }
  [readingRecordPanel,resultSummaryPanel].forEach(panel=>{
    if(!panel) return;
    panel.hidden=!showRecordPanels;
    panel.classList.toggle('is-hidden-during-observation',!showRecordPanels);
  });
}

function updateResultSummaryMode(){
  // CV058A: Result Summary Auxiliary Separation.
  // Result summary remains direct reading-derived final results only.
  // Reading record panel is the place for live/ongoing readings and intermediate calculations.
  // Result summary is reserved for finalized results after stop/completion, avoiding simultaneous duplicate emphasis.
  const hasRecords = readingRecords.length > 0;
  const isFinalized = hasRecords && (observationState === 'stopped' || observationState === 'completed');

  if (readingRecordPanel) {
    readingRecordPanel.classList.toggle('is-finalized', isFinalized);
  }

  if (resultSummaryPanel) {
    resultSummaryPanel.classList.toggle('is-finalized', isFinalized);
    resultSummaryPanel.classList.toggle('is-pending', !isFinalized);
  }

  if (resultSummaryGrid) {
    resultSummaryGrid.hidden = !isFinalized;
  }

  if (resultSummaryNote) {
    if (isFinalized) {
      resultSummaryNote.textContent = observationState === 'completed'
        ? '観測完了後の最終結果です。上段は観測記録から直接得られる値、下段は補完計算と観測記録の比較結果です。'
        : '任意停止時点の保持結果です。上段は観測記録から直接得られる値、下段は補完計算と観測記録の比較結果です。';
    } else if (hasRecords) {
      resultSummaryNote.textContent = '観測中の途中集計は読取記録側に表示します。最終結果は停止または観測完了後に表示します。';
    } else {
      resultSummaryNote.textContent = '観測完了または停止後に、最終結果だけを表示します。';
    }
  }
}

function setObservationState(nextState){
  observationState = nextState;
  if (stateLabel) {
    const labels = {
      idle: '待機',
      initial: '初期配置確認',
      running: '観測中',
      paused: '一時停止',
      stopped: '停止',
      completed: '観測完了'
    };
    stateLabel.textContent = labels[nextState] || nextState;
  }
  updateResultSummaryMode();
  updateObservationDetailVisibility();
  updateControlButtons();
  updateWaveformStatus();
  updateWaveTimeAxisControl(getActiveReplayProfile());
  refreshTelescopeMatchHighlightForCurrentState();
}

function updateControlButtons(){
  // CV057: align with IL261 controls direction.
  // Start is only for a new run from idle/ready.
  // Pause button toggles pause/resume.
  // Observation clear keeps condition controls; reset restores condition controls too.
  const hasRecords = readingRecords.length > 0;
  const isIdle = observationState === 'idle';
  const isRunning = observationState === 'running';
  const isPaused = observationState === 'paused';
  const isStopped = observationState === 'stopped';
  const isCompleted = observationState === 'completed';

  if (experimentSetSelect) experimentSetSelect.disabled = !isIdle;
  if (motionMode) motionMode.disabled = true;
  updateObservationDetailVisibility();

  if (startBtn) {
    const auditPending=isColumnReauditObservationSet();
    startBtn.disabled = !isIdle || auditPending;
    const label = startBtn.querySelector('span');
    if (label) label.textContent = auditPending ? '再監査中' : '開始';
    startBtn.title = auditPending ? '原表列意味の再監査完了まで史実波形の再生を保留しています。' : '';
  }
  if (pauseBtn) {
    pauseBtn.disabled = !(isRunning || isPaused);
    const label = pauseBtn.querySelector('span');
    if (label) label.textContent = isPaused ? '再開' : '一時停止';
    const firstNode = pauseBtn.firstChild;
    if (firstNode && firstNode.nodeType === Node.TEXT_NODE) {
      firstNode.nodeValue = isPaused ? '▶' : 'Ⅱ';
    }
    pauseBtn.setAttribute('aria-pressed', String(isPaused));
  }
  if (stopBtn) {
    stopBtn.disabled = !(isRunning || isPaused);
  }
  if (clearBtn) {
    clearBtn.disabled = false;
  }
  if (resetBtn) {
    resetBtn.disabled = false;
  }
  // CSV export is enabled after observation is completed, or after an explicit stop with records kept.
  const csvEnabled = hasRecords && (isCompleted || isStopped);
  if (exportHistoricalCsvBtn) exportHistoricalCsvBtn.disabled = !csvEnabled;
  if (exportAnalysisCsvBtn) exportAnalysisCsvBtn.disabled = !csvEnabled;
  if (previewHistoricalCsvBtn) previewHistoricalCsvBtn.disabled = !csvEnabled;
  if (previewAnalysisCsvBtn) previewAnalysisCsvBtn.disabled = !csvEnabled;
  if (openReportPreviewBtn) openReportPreviewBtn.disabled = !csvEnabled;
  if (leftPreviewHistoricalCsvBtn) leftPreviewHistoricalCsvBtn.disabled = !csvEnabled;
  if (leftExportHistoricalCsvBtn) leftExportHistoricalCsvBtn.disabled = !csvEnabled;
  if (leftPreviewAnalysisCsvBtn) leftPreviewAnalysisCsvBtn.disabled = !csvEnabled;
  if (leftExportAnalysisCsvBtn) leftExportAnalysisCsvBtn.disabled = !csvEnabled;
  if (leftOpenReportPreviewBtn) leftOpenReportPreviewBtn.disabled = !csvEnabled;
  if (pcCompletedOutputCommands) {
    pcCompletedOutputCommands.hidden = !csvEnabled;
    pcCompletedOutputCommands.classList.toggle('is-output-ready', csvEnabled);
  }

  // CV072J: data/report output is shown only when a held result actually exists.
  // Idle/no-record, running, and paused states hide the output panel so disabled-looking
  // commands are not presented as available actions after report return or page reload.
  if (dataReportOutputPanel) {
    const outputVisible = csvEnabled;
    dataReportOutputPanel.hidden = !outputVisible;
    dataReportOutputPanel.classList.toggle('is-hidden-during-observation', !outputVisible);
    dataReportOutputPanel.classList.toggle('is-output-ready', outputVisible);
    if (outputVisible) hideOutputStatusMessage();
  }
}

function startObservation(){
  if (observationState !== 'idle' || isColumnReauditObservationSet()) return;
  clearObservationHold();
  hideOutputStatusMessage();
  autoReportPreviewTriggered = false;
  time = 0;
  resetReadingRecords();
  paused = false;
  beginMotionViewUntimedPrelude(getActiveReplayProfile());
  setObservationState('running');
  running = true;
  update();
}

function pauseObservation(){
  if (observationState === 'running') {
    const profile=getActiveReplayProfile();
    if(isMotionViewUntimedPreludeActive(profile)){
      motionViewUntimedPreludeRemainingMs=getMotionViewUntimedPreludeRemainingMs(profile);
      motionViewUntimedPreludeEndsAt=0;
    }
    running = false;
    paused = true;
    setObservationState('paused');
    return;
  }
  if (observationState === 'paused') {
    if(motionViewUntimedPreludeRemainingMs>0){
      motionViewUntimedPreludeEndsAt=Date.now()+motionViewUntimedPreludeRemainingMs;
    }
    running = true;
    paused = false;
    setObservationState('running');
  }
}

function stopObservation(){
  if (observationState !== 'running' && observationState !== 'paused') return;
  running = false;
  paused = false;
  resetMotionViewUntimedPrelude();
  setObservationState('stopped');
  persistFinalizedObservation('stopped');
}


// CV070B: visible slider values for Operation / Condition controls.
// Display only: values mirror existing slider inputs; the same slider values continue to drive waveform and weight motion.
function formatSignedPx(value){
  const n = Number(value || 0);
  return `${n >= 0 ? '+' : ''}${Math.round(n)} px`;
}
function updateSliderControlValues(){
  const profile = getActiveReplayProfile();
  if (!profile) return;
  const scale = profile.scale || {min:0,max:0};
  const range = Math.max(0, Number(scale.max) - Number(scale.min));
  const period = Number(profile.period_seconds) || 0;
  const sections = Array.isArray(profile.sections) ? profile.sections : [];
  const sequence = sections.map(section => positionShortJa(section.position));
  if (amplitudeSliderValue) {
    amplitudeSliderValue.textContent = `Δ${range.toFixed(range >= 10 ? 1 : 2)} div`;
    amplitudeSliderValue.title = `史実値範囲 ${formatAxisValue(scale.min, range)}〜${formatAxisValue(scale.max, range)} div`;
  }
  if (dampingSliderValue) {
    const minutes = Math.floor(period / 60);
    const seconds = Math.round(period % 60);
    dampingSliderValue.textContent = period ? `${minutes}m${String(seconds).padStart(2,'0')}s` : '自動';
    dampingSliderValue.title = '当時の観測記録にある振動周期の中央値';
  }
  if (restShiftSliderValue) {
    restShiftSliderValue.textContent = sequence[0] || '—';
    restShiftSliderValue.title = sections.length ? positionLongJa(sections[0].position) : '';
  }
  if (restShiftAfterSliderValue) {
    restShiftAfterSliderValue.textContent = sequence.length > 1 ? sequence.join('→') : (sequence[0] || '—');
    restShiftAfterSliderValue.title = sections.map(section => positionLongJa(section.position)).join(' → ');
  }
}
function handleSliderInput(){
  updateSliderControlValues();
}

function completeObservation(){
  const endTime=getActiveObservationEndTime();
  time=endTime;
  // Guarantee that the final historical anchor is frozen before the UI enters completed state.
  addHistoricalRecordsUpTo(endTime);
  running = false;
  paused = false;
  resetMotionViewUntimedPrelude();
  setObservationState('completed');
  update();
  renderFlowTimelineState(endTime,true);
  persistFinalizedObservation('completed');
  // CV072I/CV072J: when the observation naturally reaches completion, show the report preview automatically.
  // This uses same-tab navigation only. Manual stop does not auto-open the report.
  if (!autoReportPreviewTriggered) {
    autoReportPreviewTriggered = true;
    window.setTimeout(() => {
      openReportPreview({ source: 'auto-complete' });
    }, 250);
  }
}

function clearObservation(){
  // CV057: observation clear keeps the current condition controls.
  clearObservationHold();
  hideOutputStatusMessage();
  autoReportPreviewTriggered = false;
  time = 0;
  running = false;
  paused = false;
  resetMotionViewUntimedPrelude();
  resetReadingRecords();
  update();
  setObservationState('idle');
}

function resetConditionControls(){
  if (experimentSetSelect) experimentSetSelect.value = DEFAULT_CONTROL_VALUES.experimentSetSelect;
  if (motionMode) motionMode.value = DEFAULT_CONTROL_VALUES.motionMode;
  updateHistoricalDatasetPanel();
  if (amplitudeSlider) amplitudeSlider.value = DEFAULT_CONTROL_VALUES.amplitudeSlider;
  if (dampingSlider) dampingSlider.value = DEFAULT_CONTROL_VALUES.dampingSlider;
  if (restShiftSlider) restShiftSlider.value = DEFAULT_CONTROL_VALUES.restShiftSlider;
  if (restShiftAfterSlider) restShiftAfterSlider.value = DEFAULT_CONTROL_VALUES.restShiftAfterSlider;
  updateSliderControlValues();
  updateFlowTimelineLabels();
  updateHistoricalReplayScale();
}

function resetAll(){
  // CV057: reset restores condition controls and clears observation results.
  resetConditionControls();
  clearObservation();
}

// CV079A04: the natural observation end is resolved from the active Experiment profile.
// Completion is not declared until the final historical anchor and the final Timeline stage share this endpoint.
const OBSERVATION_END_TIME = Number(HISTORICAL_REPLAY.playback_duration_s) || 72;
function getActiveObservationEndTime(){
  const profile = getActiveReplayProfile();
  const profileEnd = Number(profile && profile.playback_duration_s);
  const finalAnchor = profile && Array.isArray(profile.anchors) && profile.anchors.length
    ? Number(profile.anchors[profile.anchors.length - 1].playback_time_s)
    : NaN;
  const finalStage = profile && Array.isArray(profile.flow_stages) && profile.flow_stages.length
    ? Number(profile.flow_stages[profile.flow_stages.length - 1].time)
    : NaN;
  return Math.max(
    Number.isFinite(profileEnd) ? profileEnd : 0,
    Number.isFinite(finalAnchor) ? finalAnchor : 0,
    Number.isFinite(finalStage) ? finalStage : 0,
    OBSERVATION_END_TIME
  );
}
const flowTimeline = document.getElementById('flowTimeline');
const flowDetailSummary = document.getElementById('flowDetailSummary');
const flowCurrentStage = document.getElementById('flowCurrentStage');
const flowReason = document.getElementById('flowReason');
let flowStepEls = [];

function getActiveFlowStages(){
  const profile = getActiveReplayProfile();
  if (profile && Array.isArray(profile.flow_stages) && profile.flow_stages.length) return profile.flow_stages;
  const endTime = getActiveObservationEndTime();
  return [
    {time:0,label:'観測開始',reason:'史実再生開始',source_class:'fallback',clock_label:'—',timeline_kind:'observation_start'},
    {time:endTime,label:'観測終了',reason:'史実再生完了',source_class:'fallback',clock_label:'—',timeline_kind:'end'}
  ];
}

function getFlowIndex(t){
  const stages=getActiveFlowStages();
  const endTime=getActiveObservationEndTime();
  const value=Math.max(0,Math.min(endTime,Number(t)||0));
  let index=0;
  stages.forEach((stage,i)=>{ if(value>=Number(stage.time||0)) index=i; });
  return Math.max(0,Math.min(stages.length-1,index));
}

function translateFlowLabel(label){
  return String(label || '')
    .replace(/Midway/g,'中間位置')
    .replace(/Positive/g,'正')
    .replace(/Negative/g,'負');
}

function flowStageSymbol(stage){
  const kind=String(stage&&stage.timeline_kind||'observation');
  if(kind==='transition_exact') return '⇄';
  if(kind==='transition_uncertain') return '↔';
  if(kind==='missed'||kind==='missed_reconstructed') return '×';
  if(kind==='untimed') return '#';
  if(kind==='observation_resume') return '↻';
  if(kind==='end') return '✓';
  if(kind==='reaudit') return '…';
  return '◎';
}

function flowStageClass(stage){
  const kind=String(stage&&stage.timeline_kind||'observation').replace(/[^a-z0-9_-]/gi,'');
  const reconstructed=isReconstructedTimeBasis(stage&&stage.source_class)||kind==='missed_reconstructed';
  return `flow-kind-${kind}${reconstructed?' is-reconstructed-time':''}`;
}

function rebuildFlowTimeline(stages=getActiveFlowStages()){
  if(!flowTimeline) return;
  const fragment=document.createDocumentFragment();
  stages.forEach((stage,index)=>{
    const element=document.createElement('span');
    element.dataset.flowStep=String(index);
    element.className=flowStageClass(stage);

    const symbol=document.createElement('em');
    symbol.className='flow-symbol';
    symbol.textContent=flowStageSymbol(stage);

    const number=document.createElement('small');
    number.className='flow-number';
    number.textContent=String(index+1);

    const label=document.createElement('b');
    label.className='flow-label';
    label.textContent=translateFlowLabel(stage.label);

    const clock=document.createElement('time');
    clock.className='flow-clock';
    clock.textContent=stage.clock_label||'—';

    element.append(symbol,number,label,clock);
    const basis=stage.basis_label||timeBasisLabelJa(stage.source_class);
    element.title=`${index+1} ${label.textContent} / ${clock.textContent} / ${basis}${stage.reason?` / ${stage.reason}`:''}`;
    fragment.appendChild(element);
  });
  flowTimeline.replaceChildren(fragment);
  flowTimeline.style.setProperty('--flow-count',String(Math.max(1,stages.length)));
  flowTimeline.dataset.stageCount=String(stages.length);
  const mainObservationArea=flowTimeline.closest('.main');
  if(mainObservationArea) mainObservationArea.dataset.timelineStageCount=String(stages.length);
  flowStepEls=Array.from(flowTimeline.querySelectorAll('[data-flow-step]'));
}

function updateFlowTimelineLabels(){
  rebuildFlowTimeline(getActiveFlowStages());
}

function renderFlowTimelineState(t, forceCompleted = false){
  const stages=getActiveFlowStages();
  if(flowStepEls.length!==stages.length) rebuildFlowTimeline(stages);
  const profile=getActiveReplayProfile();
  const preludePhase=getMotionViewUntimedPreludePhase(profile);
  if(preludePhase&&!forceCompleted){
    flowStepEls.forEach(element=>{
      element.classList.remove('active','is-complete');
      element.removeAttribute('aria-current');
    });
    const from=positionLongJa(preludePhase.initial.position);
    const to=positionLongJa(preludePhase.target.position);
    if(flowDetailSummary) flowDetailSummary.textContent='現在：想定補間 / 時計軸未開始';
    if(flowCurrentStage) flowCurrentStage.textContent='想定補間（時計時刻なし）';
    if(flowReason) flowReason.textContent=`${from} → ${to} / 約2.5秒の表示補間 / 史実時間ではありません`;
    if(debugTimelineSlot) debugTimelineSlot.textContent='想定補間 / 時計軸未開始';
    return {stages,flowIndex:-1,stage:null,stageLabel:'想定補間（時計時刻なし）',clockText:'時計軸未開始'};
  }
  const endTime=getActiveObservationEndTime();
  const timelineTime=forceCompleted ? endTime : Math.max(0,Math.min(endTime,Number(t)||0));
  const flowIndex=getFlowIndex(timelineTime);
  const stage=stages[flowIndex] || {label:'史実再生',reason:'',source_class:'fallback',clock_label:'—'};
  const stageLabel=translateFlowLabel(stage.label);
  const clockText=stage.clock_label || (isTemporaryObservationSet()? '時刻未確定' : (getReplayFrame(timelineTime).historical_time_hms || '—'));

  flowStepEls.forEach((element,index)=>{
    const isCurrent=index===flowIndex;
    const isPassed=index<flowIndex || (forceCompleted && index<=flowIndex);
    element.classList.toggle('active',isCurrent);
    element.classList.toggle('is-complete',isPassed);
    if(isCurrent) element.setAttribute('aria-current','step');
    else element.removeAttribute('aria-current');
  });

  if (flowDetailSummary) flowDetailSummary.textContent=`現在：${stageLabel} / ${clockText}`;
  if (flowCurrentStage) flowCurrentStage.textContent=stageLabel;
  if (flowReason) {
    const timeNote=stage.basis_label||timeBasisLabelJa(stage.source_class);
    const completionNote=forceCompleted?' / 再生完了':'';
    flowReason.textContent=`${stage.reason || '史実記録を再生'} / ${clockText} / ${timeNote}${completionNote}`;
  }
  if (debugTimelineSlot) debugTimelineSlot.textContent=`${flowIndex+1}/${stages.length} ${stageLabel}`;
  return {stages,flowIndex,stage,stageLabel,clockText};
}

let waveTimeAxisFull = false;
let waveTimeAxisProfileKey = '';
let waveTimeAxisLayoutCache = null;

const TIME_AXIS_ENGINE = window.CAVENDISH_TIME_AXIS;
const TIME_AXIS_CONFIG = window.CAVENDISH_TIME_AXIS_CONFIG || {defaults:{},sets:{}};
const DIRECT_CLOCK_TIME_AXIS = window.CAVENDISH_DIRECT_CLOCK_TIME_AXIS || null;

function getWaveTimeAxisDefinition(profile=getActiveReplayProfile()){
  if(!profile||!TIME_AXIS_ENGINE) return null;
  const configRoot=DIRECT_CLOCK_TIME_AXIS&&DIRECT_CLOCK_TIME_AXIS.supports(profile)
    ? DIRECT_CLOCK_TIME_AXIS.createConfigRoot(profile,TIME_AXIS_CONFIG)
    : TIME_AXIS_CONFIG;
  return TIME_AXIS_ENGINE.normalizeDefinition(profile,configRoot);
}

function syncWaveTimeAxisProfile(profile=getActiveReplayProfile()){
  const key=String(profile&&profile.data_key||'');
  if(key===waveTimeAxisProfileKey) return;
  waveTimeAxisProfileKey=key;
  const definition=getWaveTimeAxisDefinition(profile);
  waveTimeAxisFull=Boolean(definition&&definition.defaultMode==='full');
  waveTimeAxisLayoutCache=null;
}

function invalidateWaveTimeAxisLayout(){
  waveTimeAxisLayoutCache=null;
}

function getWaveTimeAxisMetrics(){
  const viewBox=waveSvg&&waveSvg.viewBox&&waveSvg.viewBox.baseVal;
  const viewWidth=viewBox&&viewBox.width?viewBox.width:1000;
  const rect=waveSvg&&waveSvg.getBoundingClientRect?waveSvg.getBoundingClientRect():null;
  const parentWidth=waveSvg&&waveSvg.parentElement?Number(waveSvg.parentElement.clientWidth)||0:0;
  const cssWidth=rect&&rect.width>120?rect.width:(parentWidth>120?parentWidth:500);
  return {viewWidth,cssWidth};
}

function getWaveTimeAxisLayout(profile=getActiveReplayProfile()){
  if(!profile||!TIME_AXIS_ENGINE) return null;
  syncWaveTimeAxisProfile(profile);
  const definition=getWaveTimeAxisDefinition(profile);
  const metrics=getWaveTimeAxisMetrics();
  const mode=definition&&definition.hasOmitted&&!waveTimeAxisFull?'folded':'full';
  const cacheKey=[profile.data_key,mode,metrics.viewWidth.toFixed(2),metrics.cssWidth.toFixed(2),definition&&definition.build].join('|');
  if(waveTimeAxisLayoutCache&&waveTimeAxisLayoutCache.key===cacheKey) return waveTimeAxisLayoutCache.layout;
  const layout=TIME_AXIS_ENGINE.createLayout({profile,definition,mode,viewWidth:metrics.viewWidth,cssWidth:metrics.cssWidth});
  waveTimeAxisLayoutCache={key:cacheKey,layout};
  return layout;
}

function isFoldedTimeAxis(profile=getActiveReplayProfile()){
  const layout=getWaveTimeAxisLayout(profile);
  return Boolean(layout&&layout.mode==='folded'&&layout.omittedSegments.length);
}

function getOmittedPlaybackIntervals(profile=getActiveReplayProfile()){
  const layout=getWaveTimeAxisLayout(profile);
  if(!layout||layout.mode!=='folded') return [];
  return layout.omittedSegments.map(segment=>({
    id:segment.id,
    start:Math.max(0,playbackFromHistoricalAbs(profile,segment.startAbs)),
    end:Math.min(getActiveObservationEndTime(),playbackFromHistoricalAbs(profile,segment.endAbs)),
    startAbs:segment.startAbs,
    endAbs:segment.endAbs,
    xStart:segment.xStart,
    xEnd:segment.xEnd,
    title:segment.title||`${TIME_AXIS_ENGINE.formatClock(segment.startAbs,'hms')}〜${TIME_AXIS_ENGINE.formatClock(segment.endAbs,'hms')}を短縮表示`,
    compressionKind:segment.compressionKind||'',
    compressionLabel:segment.compressionLabel||''
  }));
}


function updateWaveTimeFoldMarker(profile=getActiveReplayProfile()){
  if(!waveTimeFoldMarker) return;
  const intervals=getOmittedPlaybackIntervals(profile);
  if(!intervals.length){waveTimeFoldMarker.innerHTML='';return;}
  waveTimeFoldMarker.innerHTML=intervals.map(interval=>{
    const center=(interval.xStart+interval.xEnd)/2;
    const width=Math.max(8,interval.xEnd-interval.xStart);
    const halfMark=Math.min(10,width*0.18);
    const offset=Math.min(7,width*0.12);
    const kind=String(interval.compressionKind||'');
    const kindClass=kind?` is-${escapeHtml(kind)}`:'';
    if(kind==='transition'){
      const arm=Math.max(4,Math.min(8,width*0.22));
      return `<g class="wave-time-fold-marker${kindClass}"><path class="transition-compression-symbol" d="M${(center-arm).toFixed(1)} 24 H${(center+arm).toFixed(1)} M${(center-arm).toFixed(1)} 24 l3 -3 M${(center-arm).toFixed(1)} 24 l3 3 M${(center+arm).toFixed(1)} 31 H${(center-arm).toFixed(1)} M${(center+arm).toFixed(1)} 31 l-3 -3 M${(center+arm).toFixed(1)} 31 l-3 3"></path><title>${escapeHtml(interval.title)}。金色圧縮帯</title></g>`;
    }
    if(kind==='missed'){
      const arm=Math.max(3,Math.min(6,width*0.18));
      return `<g class="wave-time-fold-marker${kindClass}"><path class="missed-compression-symbol" d="M${(center-arm).toFixed(1)} 23 L${(center+arm).toFixed(1)} 31 M${(center+arm).toFixed(1)} 23 L${(center-arm).toFixed(1)} 31"></path><title>${escapeHtml(interval.title)}。青色圧縮括弧</title></g>`;
    }
    return `<g class="wave-time-fold-marker${kindClass}"><path d="M${(center-halfMark).toFixed(1)} 18 l${offset.toFixed(1)} 10 M${(center+2).toFixed(1)} 18 l${offset.toFixed(1)} 10 M${(center-halfMark).toFixed(1)} 188 l${offset.toFixed(1)} -10 M${(center+2).toFixed(1)} 188 l${offset.toFixed(1)} -10"></path><title>${escapeHtml(interval.title)}</title></g>`;
  }).join('');
}

function updateWaveTimeAxisControl(profile=getActiveReplayProfile()){
  if(isColumnReauditObservationSet(profile)){
    if(waveTimeAxisToolbar) waveTimeAxisToolbar.hidden=true;
    if(waveTimeFoldMarker) waveTimeFoldMarker.innerHTML='';
    if(waveSvg) waveSvg.classList.remove('is-folded-time-axis');
    return;
  }
  const definition=getWaveTimeAxisDefinition(profile);
  const hasOmitted=Boolean(definition&&definition.hasOmitted);
  if(waveTimeAxisToolbar) waveTimeAxisToolbar.hidden=!hasOmitted;
  if(!hasOmitted){
    if(waveSvg) waveSvg.classList.remove('is-folded-time-axis');
    if(waveTimeFoldMarker) waveTimeFoldMarker.innerHTML='';
    return;
  }
  const layout=getWaveTimeAxisLayout(profile);
  const folded=Boolean(layout&&layout.mode==='folded');
  const omitted=definition.segments.filter(segment=>segment.type==='omitted');
  const omittedSeconds=omitted.reduce((sum,segment)=>sum+segment.duration,0);
  const observationPriority=definition.axisPurpose==='direct_clock_observation_priority';
  if(waveTimeAxisMode){
    if(folded){
      if(observationPriority){
        waveTimeAxisMode.innerHTML=`<b>${escapeHtml(definition.foldedTitle||'区間強調')}</b><small>${escapeHtml(definition.foldedDetail||`配置変更・欠測 ${omitted.length}区間を短縮`)}</small>`;
      }else{
        const first=omitted[0];
        const range=omitted.length===1
          ? `${TIME_AXIS_ENGINE.formatClock(first.startAbs,'hm')}〜${TIME_AXIS_ENGINE.formatClock(first.endAbs,'hms')}`
          : `省略区間 ${omitted.length}件`;
        waveTimeAxisMode.innerHTML=`<b>省略表示</b><small>${range}（約${Math.round(omittedSeconds/60)}分）を短縮</small>`;
      }
    }else{
      waveTimeAxisMode.innerHTML=`<b>全時間軸</b><small>${TIME_AXIS_ENGINE.formatClock(definition.startAbs,'hm')}〜${TIME_AXIS_ENGINE.formatClock(definition.endAbs,'hm')}を実際の時刻間隔で表示</small>`;
    }
  }
  if(waveTimeAxisToggle){
    waveTimeAxisToggle.textContent=folded?'全時間軸を表示':(observationPriority?(definition.foldedToggleBackLabel||'区間強調に戻す'):'省略表示に戻す');
    waveTimeAxisToggle.setAttribute('aria-pressed',String(!folded));
  }
  if(waveSvg) waveSvg.classList.toggle('is-folded-time-axis',folded);
  updateWaveTimeFoldMarker(profile);
}

const WAVE_TIME_MARKER_ROLES=Object.freeze({
  observation_start:Object.freeze({label:'観測開始',className:'is-observation-start'}),
  omission_start:Object.freeze({label:'省略開始',className:'is-omission-start'}),
  omission_end:Object.freeze({label:'省略終了',className:'is-omission-end'}),
  observation_end:Object.freeze({label:'観測終了',className:'is-observation-end'})
});

function getWaveTimeMarkerEntries(layout){
  if(!layout||!TIME_AXIS_ENGINE) return [];
  const profile=getActiveReplayProfile();
  const registration=getObservationSetRegistration(profile);
  if(isColumnReauditObservationSet(profile) || registration.marker_policy==='suppress_until_clock_axis_fixed' || registration.marker_policy==='suppressed_during_reaudit') return [];
  const seen=new Set();
  return TIME_AXIS_ENGINE.getLabelCandidates(layout)
    .filter(candidate=>WAVE_TIME_MARKER_ROLES[candidate.kind])
    .filter(candidate=>{
      if(registration.marker_policy!=='confirmed_clock_bounds') return true;
      const bounds=profile&&profile.observation_clock_bounds||{};
      if(candidate.kind==='observation_start') return Boolean(bounds.start_confirmed);
      if(candidate.kind==='observation_end') return Boolean(bounds.end_confirmed);
      return true;
    })
    .sort((a,b)=>a.abs-b.abs||b.priority-a.priority)
    .filter(candidate=>{
      const key=`${candidate.kind}|${Number(candidate.abs).toFixed(3)}`;
      if(seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map(candidate=>{
      const role=WAVE_TIME_MARKER_ROLES[candidate.kind];
      const roundedSeconds=((Math.round(Number(candidate.abs))%60)+60)%60;
      const clock=TIME_AXIS_ENGINE.formatClock(candidate.abs,roundedSeconds?'hms':'hm');
      return Object.freeze(Object.assign({},candidate,role,{clock}));
    });
}

function renderWaveTimeMarkers(layout){
  const entries=getWaveTimeMarkerEntries(layout);
  if(waveTimeAxisLabels) waveTimeAxisLabels.innerHTML='';
  if(waveTimeAxisMarkers){
    waveTimeAxisMarkers.innerHTML=entries.map(entry=>{
      const x=Number(entry.x).toFixed(1);
      const title=`${entry.label} ${entry.clock}`;
      return `<g class="wave-time-marker ${entry.className}" transform="translate(${x} 0)" data-time-kind="${escapeHtml(entry.kind)}"><path d="M0 189 L-12 201 L12 201 Z"></path><title>${escapeHtml(title)}</title></g>`;
    }).join('');
  }
  if(waveTimeMarkerLegend){
    waveTimeMarkerLegend.hidden=!entries.length;
    waveTimeMarkerLegend.innerHTML=entries.map(entry=>`<span class="wave-time-marker-legend-item ${entry.className}"><span class="wave-time-marker-swatch" aria-hidden="true"></span><b>${escapeHtml(entry.label)}</b><time>${escapeHtml(entry.clock)}</time></span>`).join('');
  }
}


function isDirectClockObservationProfile(profile=getActiveReplayProfile()){
  return Boolean(profile&&String(profile.data_layer_status||'').startsWith('direct_timed_values_'));
}

function isCrossingTimeObservationProfile(profile=getActiveReplayProfile()){
  return Boolean(profile&&profile.crossing_time_reconstruction===true);
}

function isMultiSectionCrossingTimeProfile(profile=getActiveReplayProfile()){
  return Boolean(profile&&profile.multi_section_crossing_reconstruction===true);
}

function updateWaveMeaningLegend(profile=getActiveReplayProfile()){
  const directClock=isDirectClockObservationProfile(profile);
  const crossingTime=isCrossingTimeObservationProfile(profile);
  const multiSectionCrossing=isMultiSectionCrossingTimeProfile(profile);
  if(waveHistoricalGuideLegend){
    waveHistoricalGuideLegend.hidden=false;
    waveHistoricalGuideLegend.innerHTML='<i class="line-sample line-solid-sample"></i>実線：直接観測点間ガイド';
  }
  if(waveReconstructionGuideLegend){
    waveReconstructionGuideLegend.hidden=false;
    waveReconstructionGuideLegend.innerHTML='<i class="line-sample line-dashed-sample"></i>破線：補完・再構成波形';
  }
  if(waveDirectClockGuideLegend) waveDirectClockGuideLegend.hidden=true;
  if(waveCrossingTimeGuideLegend) waveCrossingTimeGuideLegend.hidden=true;
  if(waveHistoricalMarkerLegend){
    waveHistoricalMarkerLegend.innerHTML=crossingTime
      ? (multiSectionCrossing
        ? '<i class="marker-sample marker-a-sample"></i>赤点：原表の時計付き直接読取・目盛通過時刻'
        : '<i class="marker-sample marker-a-sample"></i>赤点：原表の目盛通過時刻')
      : '<i class="marker-sample marker-a-sample"></i>赤点：史実時計付き読取';
  }
  if(waveReconstructedMarkerLegend){
    waveReconstructedMarkerLegend.innerHTML=crossingTime
      ? '<i class="marker-sample marker-b-sample"></i>青点：史実極値・時刻は振動中央時刻から再構成'
      : '<i class="marker-sample marker-b-sample"></i>青点：時計時刻がない振れ幅の記録（記録順・線なし）';
  }
  if(waveMeaningHelp){
    const help=directClock
      ? '縦軸は読取値の目盛（div）です。赤点は、原表で極値と時計時刻が同じ行に記録された直接観測です。実線は、直接時計付き極値どうしの関係を追うための接続ガイドで、点と点の間を連続観測した意味ではありません。金色の帯は、大球の配置変更が前後の時計付き記録の間に起きたことだけ分かり、正確な時刻が不明な範囲です。青色の下端括弧は、原表に missed と記された欠測区間です。どちらも波形を接続しません。区間強調では配置変更と欠測の時間幅だけを短縮し、全時間軸では実際の時刻間隔を表示します。'
      : crossingTime
        ? (multiSectionCrossing
          ? '縦軸は読取値の目盛（div）です。赤点は、原表の静止区間に記録された時計付き直接読取、または振動中の目盛通過値と時計時刻です。青点は原表の極値読取値で、時計時刻は原表の振動中央時刻を位相の拘束として推定した再構成時刻です。破線は同一配置区間の隣接極値間だけを半余弦で結んだ再構成波形で、連続観測した史実波形ではありません。時計時刻のない極値は下段へ記録順で分離し、配置変更不確定帯をまたぐ波形は接続しません。原表の12時間時計は記録順と振動周期の拘束に従って前方へ正規化し、表示上の24時間値はAM／PMを史実へ追記したものではありません。'
          : '縦軸は読取値の目盛（div）です。赤点は、原表に記録された目盛通過値と時計時刻です。極値の時刻ではありません。青点は原表の極値読取値で、時計時刻は原表の振動中央時刻を位相の拘束として推定した再構成時刻です。破線は隣接する極値間を半余弦で結んだ再構成波形で、連続観測した史実波形ではありません。原表の振動中央時刻は計算済みの時計値として保持し、極値時刻と区別します。missed行は補間せず、青色の下端括弧と空白で示します。移動前後を直接時計記録で挟める場合だけ、配置変更時刻不確定帯を表示します。')
        : defaultWaveMeaningHelp;
    waveMeaningHelp.setAttribute('data-help',help);
  }
}

function updateCompressedGapLegend(profile=getActiveReplayProfile()){
  const layout=getWaveTimeAxisLayout(profile);
  const compressed=Boolean(layout&&layout.mode==='folded'&&layout.definition&&layout.definition.axisPurpose==='direct_clock_observation_priority');
  if(waveTransitionUncertaintyLegendText){
    waveTransitionUncertaintyLegendText.textContent=compressed
      ? '金色圧縮帯：配置変更時刻が不確定（波形を接続しない）'
      : '金色破線帯：配置変更時刻が不確定（波形を接続しない）';
  }
  if(waveMissedObservationLegendText){
    waveMissedObservationLegendText.textContent=compressed
      ? '青色圧縮括弧：原表の欠測（波形を接続しない）'
      : '青色下端括弧：原表の欠測（波形を接続しない）';
  }
}

function getWaveIdleGuidance(profile=getActiveReplayProfile()){
  if(isColumnReauditObservationSet(profile)){
    return {title:'史実波形の表示を保留しています',detail:'原表の列意味・時刻所属・記録順・配置変更を再監査中です'};
  }
  const temporary=isTemporaryObservationSet(profile);
  const title=temporary?'開始すると仮登録の表示構造を再生します':'開始すると観測波形を表示します';
  if(!profile||!TIME_AXIS_ENGINE) return {title,detail:'観測セットの時間構造を確認できません'};
  if(temporary){
    const registration=getObservationSetRegistration(profile);
    return {title,detail:`${registration.display_pattern_id||'—'} ${registration.display_pattern_name_ja||'表示パターン未分類'}。原表の配置順・行構造・時計情報の有無を比較する表示で、時刻位置と波形接続は未確定です`};
  }
  if(isCommonStructureObservationSet(profile)){
    const exact=Array.isArray(profile.wave_anchors)?profile.wave_anchors.length:0;
    const orderOnly=Array.isArray(profile.anchors)?profile.anchors.filter(anchor=>isOrderConstraintTimeBasis(anchor.time_basis)).length:0;
    const uncertain=Array.isArray(profile.transition_uncertainty_ranges)?profile.transition_uncertainty_ranges.length:0;
    return {title:'開始すると共通区間表示を再生します',detail:`時計付き直接値 ${exact}件を時計軸へ配置し、時計なし値 ${orderOnly}件は記録順へ分離。配置変更をまたぐ線は切断${uncertain?`し、不確定帯 ${uncertain}区間を表示`:''}します`};
  }

  const layout=getWaveTimeAxisLayout(profile);
  const definition=getWaveTimeAxisDefinition(profile);
  const uncertaintyRanges=Array.isArray(profile.transition_uncertainty_ranges)
    ? profile.transition_uncertainty_ranges.filter(range=>Number.isFinite(Number(range.start_abs_s))&&Number.isFinite(Number(range.end_abs_s)))
    : [];
  const missedRanges=Array.isArray(profile.missed_observation_ranges)
    ? profile.missed_observation_ranges.filter(range=>Number.isFinite(Number(range.start_abs_s))&&Number.isFinite(Number(range.end_abs_s)))
    : [];
  const omittedSegments=definition&&Array.isArray(definition.segments)
    ? definition.segments.filter(segment=>segment.type==='omitted')
    : [];

  let detail='時計時刻付きの観測記録を実時間軸で表示します';
  if(definition&&definition.axisPurpose==='direct_clock_observation_priority'){
    detail=layout&&layout.mode==='folded'
      ? `配置変更 ${uncertaintyRanges.length}区間と欠測 ${missedRanges.length}区間を短縮し、直接観測の波形区間を広く表示します`
      : `配置変更 ${uncertaintyRanges.length}区間と欠測 ${missedRanges.length}区間を、実際の時刻間隔で表示します`;
  }else if(uncertaintyRanges.length&&omittedSegments.length){
    const uncertaintyText=`配置変更時刻不明 ${uncertaintyRanges.length}区間`;
    const omissionText=layout&&layout.mode==='folded'
      ? `省略区間 ${omittedSegments.length}件を短縮`
      : `省略区間 ${omittedSegments.length}件を全時間軸表示`;
    detail=`${uncertaintyText}を不確定帯で示し、${omissionText}します`;
  }else if(uncertaintyRanges.length){
    detail=`配置変更時刻が不明な${uncertaintyRanges.length}区間を不確定帯で示し${missedRanges.length?`、missed記録 ${missedRanges.length}区間は欠測として波形を切断`:''}します`;
  }else if(missedRanges.length){
    detail=`原表のmissed記録 ${missedRanges.length}区間を欠測として波形を切断します`;
  }else if(omittedSegments.length){
    if(layout&&layout.mode==='folded'){
      if(omittedSegments.length===1){
        const segment=omittedSegments[0];
        const start=TIME_AXIS_ENGINE.formatClock(segment.startAbs,'hm');
        const end=TIME_AXIS_ENGINE.formatClock(segment.endAbs,'hms');
        detail=`連続波形のない${start}〜${end}を省略表示します`;
      }else{
        detail=`連続波形のない${omittedSegments.length}区間を省略表示します`;
      }
    }else{
      detail=`連続波形のない${omittedSegments.length}区間も実際の時刻間隔で表示します`;
    }
  }
  return {title,detail};
}

function updateWaveIdleMessage(profile=getActiveReplayProfile()){
  if(!waveIdleMessage) return;
  const guidance=getWaveIdleGuidance(profile);
  if(waveIdleTitle) waveIdleTitle.textContent=guidance.title;
  if(waveIdleDetail) waveIdleDetail.textContent=guidance.detail;
  waveIdleMessage.setAttribute('aria-label',`${guidance.title}。${guidance.detail}`);
}

function renderWaveTimeAxis(profile=getActiveReplayProfile()){
  if(isColumnReauditObservationSet(profile)){
    if(waveTimeAxisGrid) waveTimeAxisGrid.innerHTML='';
    if(waveTimeAxisLabels) waveTimeAxisLabels.innerHTML='';
    if(waveTimeAxisMarkers) waveTimeAxisMarkers.innerHTML='';
    if(waveTimeMarkerLegend){waveTimeMarkerLegend.hidden=true;waveTimeMarkerLegend.innerHTML='';}
    return;
  }
  const layout=getWaveTimeAxisLayout(profile);
  if(!layout) return;
  const horizontalLines=[...document.querySelectorAll('#waveSvg .wave-gridline-x, #waveSvg .wave-gridline-zero')];
  horizontalLines.forEach(line=>{
    line.setAttribute('x1',layout.plotStartX.toFixed(1));
    line.setAttribute('x2',layout.plotEndX.toFixed(1));
  });
  [waveEquilibriumLine,waveEquilibriumLineAlt].forEach(line=>{
    if(!line) return;
    line.setAttribute('x1',layout.plotStartX.toFixed(1));
    line.setAttribute('x2',layout.plotEndX.toFixed(1));
  });
  [waveEquilibriumLabel,waveEquilibriumLabelAlt].forEach(label=>{
    if(label) label.setAttribute('x',(layout.plotEndX-10).toFixed(1));
  });

  if(waveTimeAxisGrid){
    waveTimeAxisGrid.innerHTML=TIME_AXIS_ENGINE.getGridTicks(layout).map(tick=>`<line class="wave-gridline wave-gridline-y${tick.major?' wave-gridline-major':''}" x1="${tick.x.toFixed(1)}" x2="${tick.x.toFixed(1)}" y1="18" y2="188"></line>`).join('');
  }
  renderWaveTimeMarkers(layout);
  if(waveXAxisLabel){
    waveXAxisLabel.textContent='';
    waveXAxisLabel.setAttribute('aria-hidden','true');
  }
}

function updateHistoricalReplayScale(){
  const profile=getActiveReplayProfile();
  if(!profile) return;
  const scale=profile.scale||{min:-1,max:1,center:0};
  const range=Math.max(0.0001,Number(scale.max)-Number(scale.min));
  const values=[scale.max,scale.max-range*0.25,scale.center,scale.min+range*0.25,scale.min];
  waveYLabels.forEach((element,index)=>{ if(element) element.textContent=formatAxisValue(values[index],range); });
  renderWaveTimeAxis(profile);
  updateWaveTimeAxisControl(profile);
  updateWaveIdleMessage(profile);
  updateSliderControlValues();
}


// CV041: historical raw reading records feed A/B averages.
// One row is captured when the flow enters A読取 or B読取.
// Stored rows are frozen as observation originals: later display updates do not rewrite read_div.
// A/B averages and A-B difference are recalculated only from these frozen raw records.
const readingRecords = [];
window.historicalReadingRecords = readingRecords;
let lastRecordedFlowKey = '';
let readingRecordSequence = 0;
let lastHistoricalAnchorIndex = -1;
const observationSessionId = `CVOBS-${new Date().toISOString().replace(/[-:.TZ]/g,'').slice(0,14)}`;

const OBSERVATION_HOLD_STORAGE_KEY = 'cavendish_completed_observation_state_cv079b07';

function getControlSnapshot(){
  return {
    experimentSetSelect: experimentSetSelect ? experimentSetSelect.value : DEFAULT_CONTROL_VALUES.experimentSetSelect,
    motionMode: motionMode ? motionMode.value : DEFAULT_CONTROL_VALUES.motionMode,
    amplitudeSlider: amplitudeSlider ? amplitudeSlider.value : DEFAULT_CONTROL_VALUES.amplitudeSlider,
    dampingSlider: dampingSlider ? dampingSlider.value : DEFAULT_CONTROL_VALUES.dampingSlider,
    restShiftSlider: restShiftSlider ? restShiftSlider.value : DEFAULT_CONTROL_VALUES.restShiftSlider,
    restShiftAfterSlider: restShiftAfterSlider ? restShiftAfterSlider.value : DEFAULT_CONTROL_VALUES.restShiftAfterSlider
  };
}

function applyControlSnapshot(snapshot){
  const values = snapshot || {};
  if (experimentSetSelect) experimentSetSelect.value = values.experimentSetSelect || DEFAULT_CONTROL_VALUES.experimentSetSelect;
  if (motionMode) motionMode.value = values.motionMode || DEFAULT_CONTROL_VALUES.motionMode;
  if (amplitudeSlider) amplitudeSlider.value = values.amplitudeSlider || DEFAULT_CONTROL_VALUES.amplitudeSlider;
  if (dampingSlider) dampingSlider.value = values.dampingSlider || DEFAULT_CONTROL_VALUES.dampingSlider;
  if (restShiftSlider) restShiftSlider.value = values.restShiftSlider || DEFAULT_CONTROL_VALUES.restShiftSlider;
  if (restShiftAfterSlider) restShiftAfterSlider.value = values.restShiftAfterSlider || DEFAULT_CONTROL_VALUES.restShiftAfterSlider;
  updateHistoricalDatasetPanel();
  updateSliderControlValues();
}

function clearObservationHold(){
  try {
    sessionStorage.removeItem(OBSERVATION_HOLD_STORAGE_KEY);
  } catch (error) {
    console.warn('Observation hold cache was not cleared.', error);
  }
}

function persistFinalizedObservation(stateOverride){
  try {
    const stateToStore=stateOverride||observationState;
    const finalized=readingRecords.length>0&&(stateToStore==='completed'||stateToStore==='stopped');
    if(!finalized){ clearObservationHold(); return; }
    const payload={
      app_version:APP_BUILD,
      observation_state:stateToStore,
      time:Number(Number(time||0).toFixed(3)),
      reading_record_sequence:readingRecordSequence,
      last_historical_anchor_index:lastHistoricalAnchorIndex,
      last_recorded_flow_key:lastRecordedFlowKey,
      auto_report_preview_triggered:Boolean(autoReportPreviewTriggered),
      controls:getControlSnapshot(),
      records:readingRecords.map(record=>({
        record_id:record.record_id,
        timestamp:record.timestamp,
        elapsed_time_s:record.elapsed_time_s,
        record_trigger_s:record.record_trigger_s,
        historical_time_hms:record.historical_time_hms||'',
        historical_time_original:record.historical_time_original||'',
        large_mass_position:record.large_mass_position,
        position:record.position||record.large_mass_position,
        read_div:record.read_div,
        read_value:record.read_value,
        reading_set_id:record.reading_set_id,
        value_kind:record.value_kind||'',
        value_class:record.value_class||'',
        source_page:record.source_page||'',
        source_row_id:record.source_row_id||'',
        source_class:record.source_class||'',
        time_basis:record.time_basis||'',
        phase_group:record.phase_group||'',
        phase_order:record.phase_order!==null&&record.phase_order!==undefined&&record.phase_order!==''&&Number.isFinite(Number(record.phase_order))?Number(record.phase_order):null,
        summary_eligible:Boolean(record.summary_eligible),
        observation_note:record.observation_note||''
      }))
    };
    sessionStorage.setItem(OBSERVATION_HOLD_STORAGE_KEY,JSON.stringify(payload));
  }catch(error){ console.warn('Observation hold cache was not stored.',error); }
}

function updateReadingRecordOverview(){
  const item = getSelectedHistoricalDataset();
  if (readingRecordExperiment) readingRecordExperiment.textContent = item && item.label ? experimentLabelJa(item.label) : '選択中の実験';
  if (readingRecordCount) readingRecordCount.textContent = `${readingRecords.length}件`;

  if (!readingRecords.length) {
    if (readingRecordTimeRange) readingRecordTimeRange.textContent = '—';
    if (readingRecordReadRange) readingRecordReadRange.textContent = '—';
    return;
  }

  const exactTimeRecords = readingRecords.filter(record => hasHistoricalClockClaim(record)&&!isReconstructedTimeBasis(record.time_basis));
  const reconstructedTimeCount = readingRecords.filter(record => isReconstructedTimeBasis(record&&record.time_basis)&&!isOrderConstraintTimeBasis(record.time_basis)&&!isHistoricalTableCalculationNoInstant(record.time_basis)).length;
  const untimedCount = readingRecords.filter(record => isOrderConstraintTimeBasis(record&&record.time_basis)).length;
  const supplementalLabels=[];
  if(reconstructedTimeCount) supplementalLabels.push(`時刻再構成${reconstructedTimeCount}件`);
  if(untimedCount) supplementalLabels.push(`時刻未記載${untimedCount}件`);
  if (readingRecordTimeRange) {
    if (exactTimeRecords.length) {
      const firstExact = exactTimeRecords[0].historical_time_hms;
      const lastExact = exactTimeRecords[exactTimeRecords.length - 1].historical_time_hms;
      readingRecordTimeRange.textContent = `${firstExact}–${lastExact}${supplementalLabels.length ? ` / ${supplementalLabels.join(' / ')}` : ''}`;
    } else {
      readingRecordTimeRange.textContent = supplementalLabels.length ? supplementalLabels.join(' / ') : '—';
    }
  }

  const values = readingRecords
    .map(record => Number.isFinite(Number(record.read_value)) ? Number(record.read_value) : parseReadDiv(record.read_div))
    .filter(Number.isFinite);
  if (readingRecordReadRange) {
    if (!values.length) {
      readingRecordReadRange.textContent = '—';
    } else {
      const min = Math.min(...values);
      const max = Math.max(...values);
      readingRecordReadRange.textContent = `${min.toFixed(3)}–${max.toFixed(3)} div`;
    }
  }
}

function renderReadingRecordsTable(){
  updateReadingRecordOverview();
  if(!readingRecordBody) return;
  if(!readingRecords.length){
    readingRecordBody.innerHTML='<tr class="empty"><td colspan="5">読取記録待ち</td></tr>';
    return;
  }
  const kindLabels={division_reading:'読取',division_crossing:'通過',extreme_point:'極値',point_of_rest:'静止点'};
  readingRecordBody.innerHTML=readingRecords.map((record,index)=>{
    const reconstructed=isReconstructedTimeBasis(record.time_basis);
    const timeLabel=isHistoricalTableCalculationNoInstant(record.time_basis)?'行内計算値':(reconstructed?(isOrderConstraintTimeBasis(record.time_basis)?'時刻未記載':'時刻補完'):(record.historical_time_hms||'—'));
    return `<tr data-record-id="${escapeHtml(record.record_id)}" data-reading-set-id="${escapeHtml(record.reading_set_id)}"><td>${index+1}</td><td>${escapeHtml(timeLabel)}</td><td>${escapeHtml(positionShortJa(record.large_mass_position))}</td><td>${escapeHtml(kindLabels[record.value_kind]||record.value_kind||'値')}</td><td>${escapeHtml(record.read_div)}</td></tr>`;
  }).join('');
}

function restoreFinalizedObservation(){
  try {
    const raw=sessionStorage.getItem(OBSERVATION_HOLD_STORAGE_KEY);
    if(!raw) return false;
    const payload=JSON.parse(raw);
    const storedBuild=String(payload&&payload.app_version||'');
    if(storedBuild!==APP_BUILD){
      clearObservationHold();
      const reason=storedBuild
        ? `旧Build ${storedBuild} の保持結果は、現Build ${APP_BUILD} と一致しないため復元しませんでした。`
        : `Build情報のない保持結果は、現Build ${APP_BUILD} では復元しませんでした。`;
      showOutputStatusMessage(reason);
      console.info(reason);
      return false;
    }
    const restoredRecords=Array.isArray(payload.records)?payload.records:[];
    const restoredState=payload.observation_state==='stopped'?'stopped':'completed';
    if(!restoredRecords.length) return false;
    applyControlSnapshot(payload.controls||{});
    readingRecords.length=0;
    restoredRecords.forEach(record=>{
      readingRecords.push(Object.freeze({
        record_id:String(record.record_id||''),
        timestamp:String(record.timestamp||''),
        elapsed_time_s:record.elapsed_time_s!==null&&record.elapsed_time_s!==undefined&&record.elapsed_time_s!==''&&Number.isFinite(Number(record.elapsed_time_s))?Number(record.elapsed_time_s):null,
        record_trigger_s:record.record_trigger_s!==null&&record.record_trigger_s!==undefined&&record.record_trigger_s!==''&&Number.isFinite(Number(record.record_trigger_s))?Number(record.record_trigger_s):null,
        historical_time_hms:String(record.historical_time_hms||''),
        historical_time_original:String(record.historical_time_original||''),
        large_mass_position:String(record.large_mass_position||record.position||'unknown'),
        position:String(record.position||record.large_mass_position||'unknown'),
        read_div:String(record.read_div||''),
        read_value:Number.isFinite(Number(record.read_value))?Number(record.read_value):parseReadDiv(record.read_div),
        reading_set_id:String(record.reading_set_id||''),
        value_kind:String(record.value_kind||''),
        value_class:String(record.value_class||''),
        source_page:String(record.source_page||''),
        source_row_id:String(record.source_row_id||''),
        source_class:String(record.source_class||''),
        time_basis:String(record.time_basis||''),
        phase_group:String(record.phase_group||''),
        phase_order:record.phase_order!==null&&record.phase_order!==undefined&&record.phase_order!==''&&Number.isFinite(Number(record.phase_order))?Number(record.phase_order):null,
        summary_eligible:Boolean(record.summary_eligible),
        observation_note:String(record.observation_note||'')
      }));
    });
    readingRecordSequence=Math.max(Number(payload.reading_record_sequence)||0,readingRecords.length);
    lastHistoricalAnchorIndex=Number.isFinite(Number(payload.last_historical_anchor_index))?Number(payload.last_historical_anchor_index):(readingRecords.length-1);
    lastRecordedFlowKey=String(payload.last_recorded_flow_key||'');
    time=Number.isFinite(Number(payload.time))?Number(payload.time):(restoredState==='completed'?getActiveObservationEndTime():0);
    running=false; paused=false; autoReportPreviewTriggered=true;
    renderReadingRecordsTable();
    updateReadingAverages();
    updateWaveRecordMarkers();
    update();
    setObservationState(restoredState);
    if(restoredState==='completed'){
      time=getActiveObservationEndTime();
      update();
      renderFlowTimelineState(time,true);
    }
    return true;
  }catch(error){
    console.warn('Observation hold cache was not restored.',error);
    clearObservationHold();
    return false;
  }
}
function makeRecordId(){
  readingRecordSequence += 1;
  return `${observationSessionId}-${String(readingRecordSequence).padStart(3,'0')}`;
}
function makeReadingSetId(position){
  const setNo = Math.floor(time / 72) + 1;
  return `${position}-${String(setNo).padStart(2,'0')}`;
}
function parseReadDiv(readDivText){
  const n = Number(String(readDivText).replace(' div',''));
  return Number.isFinite(n) ? n : null;
}
function formatReadDivValue(value){
  if (value === null || !Number.isFinite(value)) return '-- div';
  return `${value >= 0 ? '+' : ''}${value.toFixed(3)} div`;
}
function formatAverageWithN(value, count){
  return `${formatReadDivValue(value)}（n=${count}）`;
}

function getReplayFrame(t){
  const profile=getActiveReplayProfile();
  if(profile&&typeof profile.frameAt==='function') return profile.frameAt(t);
  return {playback_time_s:Number(t)||0,historical_time_hms:'—',read_value:0,read_div:'0.000 div',visual_offset_px:0,position:'unknown',position_label:'Unknown',switching:false,source_class:'fallback'};
}

function playbackToHistoricalAbs(profile,playbackTime){
  const startAbs=Number(profile&&profile.historical_start_abs_s);
  const spanAbs=Number(profile&&profile.historical_span_s);
  const duration=Math.max(1e-9,Number(profile&&profile.playback_duration_s)||getActiveObservationEndTime());
  const clamped=Math.max(0,Math.min(duration,Number(playbackTime)||0));
  if(!Number.isFinite(startAbs)||!Number.isFinite(spanAbs)) return null;
  return startAbs+(clamped/duration)*spanAbs;
}

function historicalAbsToWaveX(profile,absoluteTime){
  const layout=getWaveTimeAxisLayout(profile);
  const absolute=Number(absoluteTime);
  if(layout&&Number.isFinite(absolute)) return TIME_AXIS_ENGINE.mapAbsoluteTime(layout,absolute);
  return 0;
}

function timeToWaveX(t){
  const profile=getActiveReplayProfile();
  const absolute=playbackToHistoricalAbs(profile,t);
  if(Number.isFinite(absolute)) return historicalAbsToWaveX(profile,absolute);
  const layout=getWaveTimeAxisLayout(profile);
  const endTime=getActiveObservationEndTime();
  const clamped=Math.max(0,Math.min(endTime,Number(t)||0));
  if(!layout||endTime<=0) return 0;
  return layout.plotStartX+(clamped/endTime)*(layout.plotEndX-layout.plotStartX);
}

function readValueToWaveY(value){
  const profile=getActiveReplayProfile();
  if(profile&&typeof profile.yAtValue==='function') return profile.yAtValue(Number(value));
  return 105;
}

function offsetToWaveY(){
  return readValueToWaveY(getReplayFrame(time).read_value);
}


const MASS_MOTION_GEOMETRY = Object.freeze({
  centerX: 50,
  centerY: 50,
  displayRadius: 35,
  largeOrbitRadiusIn: 36.65,
  largeNearOffsetIn: 8.85
});
const MASS_POSITION_ANGLES = Object.freeze({
  positive: Math.PI-Math.asin(MASS_MOTION_GEOMETRY.largeNearOffsetIn/MASS_MOTION_GEOMETRY.largeOrbitRadiusIn),
  midway: Math.PI/2,
  negative: Math.asin(MASS_MOTION_GEOMETRY.largeNearOffsetIn/MASS_MOTION_GEOMETRY.largeOrbitRadiusIn)
});
function massCoordinatePairAtAngle(angle){
  const cx=MASS_MOTION_GEOMETRY.centerX;
  const cy=MASS_MOTION_GEOMETRY.centerY;
  const r=MASS_MOTION_GEOMETRY.displayRadius;
  const dx=r*Math.cos(angle);
  const dy=r*Math.sin(angle);
  return [
    {x:cx+dx,y:cy-dy},
    {x:cx-dx,y:cy+dy}
  ];
}
const MASS_POSITION_COORDINATES = Object.freeze({
  positive: Object.freeze([{x:16.0357396192,y:41.5484311050},{x:83.9642603808,y:58.4515688950}]),
  negative: Object.freeze([{x:83.9642603808,y:41.5484311050},{x:16.0357396192,y:58.4515688950}]),
  midway: Object.freeze([{x:50,y:15},{x:50,y:85}]),
  unknown: Object.freeze([{x:50,y:15},{x:50,y:85}])
});
function smoothMassMotionProgress(value){
  const p=Math.max(0,Math.min(1,Number(value)||0));
  return p*p*(3-2*p);
}
function interpolateMassCoordinatePair(fromPosition,toPosition,progress){
  const fromAngle=MASS_POSITION_ANGLES[fromPosition];
  const toAngle=MASS_POSITION_ANGLES[toPosition];
  if(!Number.isFinite(fromAngle)||!Number.isFinite(toAngle)){
    return MASS_POSITION_COORDINATES[toPosition]||MASS_POSITION_COORDINATES.unknown;
  }
  const p=smoothMassMotionProgress(progress);
  return massCoordinatePairAtAngle(fromAngle+(toAngle-fromAngle)*p);
}
function setMovingMassCoordinate(element,coordinate){
  if(!element||!coordinate) return;
  element.style.left=`${Number(coordinate.x).toFixed(3)}%`;
  element.style.top=`${Number(coordinate.y).toFixed(3)}%`;
}

function getMassArrangementState(t){
  const profile=getActiveReplayProfile();
  let frame=null;
  const preludePhase=getMotionViewUntimedPreludePhase(profile);
  if(preludePhase){
    const initial=preludePhase.initial;
    const target=preludePhase.target;
    if(preludePhase.transitioning){
      frame={
        index:Number(initial.index)||0,
        position:initial.position||'unknown',
        label:`大球：${positionLongJa(initial.position)} → ${positionLongJa(target.position)}`,
        switching:true,
        unresolved:false,
        time_uncertain:true,
        record_order_only:true,
        historical_time_range:'時計時刻記録なし',
        from_position:initial.position||'unknown',
        to_position:target.position||'unknown',
        progress:preludePhase.transition_progress,
        source_class:'hypothetical_untimed_initial_transition'
      };
    }else{
      frame={
        index:Number(initial.index)||0,
        position:initial.position||'unknown',
        label:`大球：${positionLongJa(initial.position)}`,
        switching:false,
        unresolved:false,
        time_uncertain:true,
        record_order_only:true,
        historical_time_range:'時計時刻記録なし',
        from_position:initial.position||'unknown',
        to_position:target.position||'unknown',
        progress:0,
        source_class:'hypothetical_untimed_initial_hold'
      };
    }
  }else if(profile&&(observationState==='idle')&&Array.isArray(profile.motion_view_sections)&&profile.motion_view_sections.length){
    const initial=profile.motion_view_sections[0];
    frame={
      index:Number(initial.index)||0,
      position:initial.position||'unknown',
      label:initial.label||positionLongJa(initial.position),
      switching:false,
      unresolved:false,
      time_uncertain:Boolean(initial.time_uncertain),
      record_order_only:Boolean(initial.record_order_only),
      historical_time_range:'',
      from_position:null,
      to_position:initial.position||'unknown',
      progress:1,
      source_class:String(initial.source_class||'historical_initial_position')
    };
  }else if(profile&&typeof profile.motionFrameAt==='function'){
    frame=profile.motionFrameAt(t);
  }else if(profile&&typeof profile.frameAt==='function'){
    frame=profile.massFrameAt(t);
  }else if(profile&&typeof profile.sectionAt==='function'){
    frame=profile.sectionAt(t);
  }
  if(!frame) return {key:'unknown',position:'unknown',label:'観測記録なし',shortLabel:'位置と動きは不明',equilibriumLabel:'平衡不明',progress:1};
  if(frame.switching){
    const sourceClass=String(frame.source_class||'');
    const hypotheticalPrelude=sourceClass==='hypothetical_untimed_initial_transition';
    const timeUncertain=Boolean(frame.time_uncertain)||sourceClass.includes('transition_interval')||sourceClass.includes('record_order_motion_transition');
    const range=String(frame.historical_time_range||'');
    return {key:'switch',position:frame.from_position,from_position:frame.from_position,to_position:frame.to_position,progress:Math.max(0,Math.min(1,Number(frame.progress)||0)),source_class:sourceClass,time_uncertain:timeUncertain,record_order_only:Boolean(frame.record_order_only),historical_time_range:range,label:hypotheticalPrelude?`大球：${positionLongJa(frame.from_position)} → ${positionLongJa(frame.to_position)}`:(timeUncertain?`配置変更時刻不確定：${positionLongJa(frame.from_position)} → ${positionLongJa(frame.to_position)}`:`配置変更：${positionLongJa(frame.from_position)} → ${positionLongJa(frame.to_position)}`),shortLabel:hypotheticalPrelude?'想定補間':(timeUncertain?(range?`${range}の間に配置変更`:'配置変更時刻は不明'):'途中経路は記録なし'),equilibriumLabel:hypotheticalPrelude?'想定補間':(timeUncertain?'時刻不確定':'移動中')};
  }
  if(frame.unresolved||frame.position==='unknown') return {key:'unknown',position:'unknown',from_position:frame.from_position||null,to_position:frame.to_position||null,progress:1,source_class:String(frame.source_class||''),time_uncertain:Boolean(frame.time_uncertain),record_order_only:Boolean(frame.record_order_only),historical_time_range:String(frame.historical_time_range||''),label:'観測記録なし',shortLabel:'大球の位置と動きは表示しません',equilibriumLabel:'平衡不明'};
  const recordOrderOnly=Boolean(frame.record_order_only);
  const initialPrelude=String(frame.source_class||'').startsWith('hypothetical_untimed_initial_');
  const timeUncertain=Boolean(frame.time_uncertain);
  const shortLabel=initialPrelude
    ? `大球：${positionLongJa(frame.position)} → ${positionLongJa(frame.to_position)}`
    : (recordOrderOnly?`${positionLongJa(frame.position)}（時刻なし）`:`${positionLongJa(frame.position)}`);
  return {key:frame.position,position:frame.position,from_position:frame.from_position||null,to_position:frame.to_position||frame.position,progress:1,source_class:String(frame.source_class||''),time_uncertain:timeUncertain,record_order_only:recordOrderOnly,historical_time_range:String(frame.historical_time_range||''),label:initialPrelude?String(frame.label||`大球：${positionLongJa(frame.position)}`):`大球：${positionLongJa(frame.position)}`,shortLabel,equilibriumLabel:initialPrelude?'想定補間':`${positionShortJa(frame.position)}平衡`};
}

function updateMassArrangementDisplay(t){
  const profile=getActiveReplayProfile();
  if(isColumnReauditObservationSet(profile)){
    const coordinates=MASS_POSITION_COORDINATES.unknown;
    setMovingMassCoordinate(movingLargeMass1,coordinates[0]);
    setMovingMassCoordinate(movingLargeMass2,coordinates[1]);
    if(topViewStage){
      ['mass-phase-a','mass-phase-b','mass-phase-midway','mass-phase-switch-b','mass-state-transition','mass-motion-historical','mass-state-hypothetical'].forEach(name=>topViewStage.classList.remove(name));
      topViewStage.classList.add('mass-state-unknown');
    }
    if(largeMassPositionLabel) largeMassPositionLabel.textContent='配置表示保留';
    if(massSwitchCue){ massSwitchCue.hidden=false; massSwitchCue.textContent='原表列意味再監査中'; }
    if(massStateCard) massStateCard.hidden=true;
    if(weightMotionNote){ weightMotionNote.hidden=false; weightMotionNote.textContent='原表の配置区分と変更時刻を再監査中のため、大球の配置変化は表示していません。'; }
    if(debugLargeMass) debugLargeMass.textContent='表示保留';
    return {key:'unknown',position:'unknown',label:'配置表示保留',shortLabel:'原表列意味再監査中',equilibriumLabel:'表示保留',progress:1};
  }
  const state=getMassArrangementState(t);
  const experimentI=profile&&profile.data_key==='CAV-1798-EXP-I';
  const preludeHold=String(state.source_class||'')==='hypothetical_untimed_initial_hold';
  const preludeTransition=String(state.source_class||'')==='hypothetical_untimed_initial_transition';
  const uncertainTransition=state.key==='switch'&&Boolean(state.time_uncertain);
  const recordOrderPosition=state.key!=='switch'&&state.key!=='unknown'&&Boolean(state.record_order_only);
  let coordinates=MASS_POSITION_COORDINATES[state.position]||MASS_POSITION_COORDINATES.unknown;
  if(preludeTransition){
    coordinates=interpolateMassCoordinatePair(state.from_position,state.to_position,state.progress);
  }
  setMovingMassCoordinate(movingLargeMass1,coordinates[0]);
  setMovingMassCoordinate(movingLargeMass2,coordinates[1]);
  if(topViewStage){
    topViewStage.classList.toggle('mass-phase-a',state.key==='positive');
    topViewStage.classList.toggle('mass-phase-b',state.key==='negative');
    topViewStage.classList.toggle('mass-phase-midway',state.key==='midway');
    topViewStage.classList.toggle('mass-phase-switch-b',state.key==='switch');
    topViewStage.classList.toggle('mass-motion-historical',preludeHold||preludeTransition);
    topViewStage.classList.toggle('mass-state-hypothetical',preludeHold||preludeTransition);
    topViewStage.classList.toggle('mass-state-transition',!preludeTransition&&state.key==='switch'&&(experimentI||uncertainTransition));
    topViewStage.classList.toggle('mass-state-unknown',experimentI&&state.key==='unknown');
  }
  if(arrangementLabelA) arrangementLabelA.textContent='正位置';
  if(arrangementLabelB) arrangementLabelB.textContent='負位置';
  if(largeMassPositionLabel){
    const stablePosition=state.key==='positive'||state.key==='negative'||state.key==='midway';
    largeMassPositionLabel.textContent=stablePosition?`現在：${positionLongJa(state.position)}`:state.label;
  }
  if(massSwitchCue){
    const stablePosition=state.key==='positive'||state.key==='negative'||state.key==='midway';
    massSwitchCue.textContent=state.shortLabel;
    massSwitchCue.hidden=preludeHold||preludeTransition||stablePosition;
  }
  if(massStateCard){
    const initialPrelude=preludeHold||preludeTransition;
    const visible=initialPrelude||(experimentI&&(state.key==='switch'||state.key==='unknown'))||uncertainTransition||(recordOrderPosition&&observationState!=='idle');
    massStateCard.hidden=!visible;
    if(visible){
      const b=massStateCard.querySelector('b');
      const span=massStateCard.querySelector('span');
      const small=massStateCard.querySelector('small');
      if(state.key==='switch'){
        if(b) b.textContent=preludeTransition?'想定補間（時計時刻なし）':(state.time_uncertain?'配置変更時刻は不明':'配置変更');
        if(span) span.textContent=`${positionLongJa(state.from_position)} → ${positionLongJa(state.to_position)}`;
        if(small) small.textContent=preludeTransition?'時計記録がないため、約2.5秒の表示補間で移動しています。史実時間ではありません。':(state.time_uncertain?(state.historical_time_range?`${state.historical_time_range}の間に変更。正確な時刻は原表にありません。`:'前後の記録間に変更。正確な時刻は原表にありません。'):'途中経路は記録されていません');
      }else if(recordOrderPosition){
        if(b) b.textContent=preludeHold?'想定補間（時計時刻なし）':'時計時刻なし';
        if(span) span.textContent=preludeHold?`${positionLongJa(state.position)} → ${positionLongJa(state.to_position)}`:`${positionLongJa(state.position)}配置観測`;
        if(small) small.textContent=preludeHold?'初期配置を表示後、最初の時計付き配置へ移ります。約2.5秒はUI上の補間で、史実時間ではありません。':(state.historical_time_range?`${state.historical_time_range}内の記録順表示です。正確な時刻は原表にありません。`:'時計軸外の記録順表示です。正確な時刻は原表にありません。');
      }else{
        if(b) b.textContent='観測記録なし';
        if(span) span.textContent='大球の位置と動きは表示しません';
        if(small) small.textContent=isFoldedTimeAxis(profile)?'省略表示ではこの時間を短く通過します':'全時間軸で実際の経過を表示中';
      }
    }
  }
  if(debugLargeMass) debugLargeMass.textContent=state.label.replace('大球：','');
  if(weightMotionNote){
    weightMotionNote.hidden=preludeHold||preludeTransition;
    if(preludeHold||preludeTransition){
      weightMotionNote.textContent='';
    }else if(experimentI){
      if(state.key==='switch') weightMotionNote.textContent='配置変更の時刻は記録されていますが、途中経路は記録されていないため連続移動は描きません。';
      else if(state.key==='unknown') weightMotionNote.textContent='この時間は大球の位置と動きの記録がないため、推定表示しません。';
      else weightMotionNote.textContent='当時の記録から確認できる大球の配置だけを表示しています。';
    }else if(uncertainTransition){
      weightMotionNote.textContent=state.historical_time_range?`配置変更は${state.historical_time_range}の間です。正確な時刻と途中経路は記録されていません。`:'配置変更の正確な時刻と途中経路は記録されていません。';
    }else if(recordOrderPosition){
      const prefix=observationState==='idle'?'開始位置':'配置観測';
      weightMotionNote.textContent=state.historical_time_range?`${prefix}：${positionLongJa(state.position)}。${state.historical_time_range}内の記録順表示で、正確な時刻は原表にありません。`:`${prefix}：${positionLongJa(state.position)}。時計時刻なしの記録順表示です。`;
    }else{
      const motionSections=profile&&Array.isArray(profile.motion_view_sections)&&profile.motion_view_sections.length?profile.motion_view_sections:(profile&&profile.sections?profile.sections:[]);
      const sequence=motionSections.length?motionSections.map(section=>positionLongJa(section.position)).join(' → '):state.shortLabel;
      const hasUncertainRanges=profile&&Array.isArray(profile.transition_uncertainty_ranges)&&profile.transition_uncertainty_ranges.length;
      if(isTemporaryObservationSet(profile)){
        weightMotionNote.textContent=`仮登録の史実位置順：${sequence.replace(/位置/g,'')}。配置変更時刻と途中経路は未確定です。`;
      }else{
        weightMotionNote.textContent=hasUncertainRanges?`史実位置：${sequence.replace(/位置/g,'')}。配置変更時刻は前後の時計付き記録の間として表示します。`:`史実位置：${sequence.replace(/位置/g,'')}`;
      }
    }
  }
  return state;
}

function setWaveEquilibriumElement(line,label,y,text,opacity){
  if(line){
    line.setAttribute('y1',y.toFixed(1));
    line.setAttribute('y2',y.toFixed(1));
    line.style.opacity=String(opacity);
  }
  if(label){
    const labelY=Math.max(18,Math.min(186,y-8));
    label.setAttribute('y',labelY.toFixed(1));
    label.textContent=text;
    label.style.opacity=String(Math.min(1,opacity+0.08));
  }
}

function updateWaveEquilibriumGuide(t){
  const profile=getActiveReplayProfile();
  if(!profile||!profile.sections||!profile.sections.length) return;
  if(observationState==='idle'||isMotionViewUntimedPreludeActive(profile)){
    if(waveEquilibriumLine) waveEquilibriumLine.style.opacity='0';
    if(waveEquilibriumLineAlt) waveEquilibriumLineAlt.style.opacity='0';
    if(waveEquilibriumLabel) waveEquilibriumLabel.style.opacity='0';
    if(waveEquilibriumLabelAlt) waveEquilibriumLabelAlt.style.opacity='0';
    if(waveSwitchLine) waveSwitchLine.style.opacity='0';
    if(waveSwitchLabel) waveSwitchLabel.style.opacity='0';
    return;
  }
  if(typeof profile.isWaveDefinedAt==='function'&&!profile.isWaveDefinedAt(t)){
    if(waveEquilibriumLine) waveEquilibriumLine.style.opacity='0';
    if(waveEquilibriumLineAlt) waveEquilibriumLineAlt.style.opacity='0';
    if(waveEquilibriumLabel) waveEquilibriumLabel.style.opacity='0';
    if(waveEquilibriumLabelAlt) waveEquilibriumLabelAlt.style.opacity='0';
    return;
  }
  const current=profile.sectionAt(t);
  const currentSection=profile.sections[current.index]||profile.sections[0];
  const nextSection=profile.sections[current.index+1]||profile.sections[current.index-1]||currentSection;
  const currentEq=Number.isFinite(Number(currentSection.equilibrium))?Number(currentSection.equilibrium):profile.valueAt(t);
  const nextEq=Number.isFinite(Number(nextSection.equilibrium))?Number(nextSection.equilibrium):currentEq;
  setWaveEquilibriumElement(waveEquilibriumLine,waveEquilibriumLabel,readValueToWaveY(currentEq),`${positionShortJa(currentSection.position)}静止点`,current.switching?0.42:0.72);
  setWaveEquilibriumElement(waveEquilibriumLineAlt,waveEquilibriumLabelAlt,readValueToWaveY(nextEq),`${positionShortJa(nextSection.position)}静止点`,current.switching?0.42:0.16);
  const transitions=profile.transitions||[];
  const upcoming=transitions.find(item=>Number(item.playback_time_s)>=Number(t)-0.5)||transitions[transitions.length-1];
  const omittedIntervals=getOmittedPlaybackIntervals(profile);
  const hideFoldedTransition=Boolean(upcoming&&omittedIntervals.some(interval=>Number(upcoming.playback_time_s)>=interval.start&&Number(upcoming.playback_time_s)<=interval.end));
  const hidePointTransition=hideFoldedTransition||Boolean(upcoming&&upcoming.time_uncertain);
  if(waveSwitchLine){
    if(upcoming&&!hidePointTransition){
      const x=timeToWaveX(upcoming.playback_time_s);
      waveSwitchLine.setAttribute('x1',x.toFixed(1));
      waveSwitchLine.setAttribute('x2',x.toFixed(1));
      waveSwitchLine.style.opacity='0.65';
      if(waveSwitchLabel){
        const layout=getWaveTimeAxisLayout(profile);
        const labelX=layout?Math.max(layout.plotStartX+8,Math.min(layout.plotEndX-8,x+8)):x+8;
        waveSwitchLabel.setAttribute('x',labelX.toFixed(1));
      }
    }else waveSwitchLine.style.opacity='0';
  }
  if(waveSwitchLabel){
    waveSwitchLabel.textContent=upcoming?`${positionShortJa(upcoming.from_position)}→${positionShortJa(upcoming.to_position)}`:'位置維持';
    waveSwitchLabel.style.opacity=hidePointTransition?'0':'1';
  }
}

function recordToWavePoint(record){
  const readValueNumber=Number(record.read_value);
  const elapsed=Number(record.elapsed_time_s);
  if(!Number.isFinite(readValueNumber)||!Number.isFinite(elapsed)) return null;
  const profile=getActiveReplayProfile();
  const absolute=playbackToHistoricalAbs(profile,elapsed);
  const layout=getWaveTimeAxisLayout(profile);
  const axisSegment=layout&&Number.isFinite(absolute)?TIME_AXIS_ENGINE.segmentAtAbsolute(layout,absolute):null;
  if(axisSegment&&layout.mode==='folded'&&axisSegment.type==='omitted'){
    if(axisSegment.recordPolicy==='hidden') return null;
    if(axisSegment.recordPolicy==='boundary'){
      const midpoint=(axisSegment.startAbs+axisSegment.endAbs)/2;
      const boundaryX=absolute<=midpoint?axisSegment.xStart:axisSegment.xEnd;
      return {x:boundaryX,y:readValueToWaveY(readValueNumber),position:record.large_mass_position,sourceClass:record.time_basis||record.source_class||''};
    }
  }
  return {x:timeToWaveX(elapsed),y:readValueToWaveY(readValueNumber),position:record.large_mass_position,sourceClass:record.time_basis||record.source_class||''};
}

function playbackFromHistoricalAbs(profile,absoluteTime){
  const span=Math.max(1,Number(profile&&profile.historical_span_s)||1);
  const start=Number(profile&&profile.historical_start_abs_s)||0;
  const duration=Math.max(1,Number(profile&&profile.playback_duration_s)||getActiveObservationEndTime());
  return ((Number(absoluteTime)-start)/span)*duration;
}

function mergeWaveIntervals(intervals){
  const sorted=(intervals||[])
    .filter(item=>Number.isFinite(Number(item.start))&&Number.isFinite(Number(item.end))&&Number(item.end)>Number(item.start))
    .sort((a,b)=>a.start-b.start);
  const merged=[];
  sorted.forEach(item=>{
    const last=merged[merged.length-1];
    if(last&&last.kind===item.kind&&item.start<=last.end+0.02){
      last.end=Math.max(last.end,item.end);
      return;
    }
    merged.push(Object.assign({},item));
  });
  return merged;
}

function renderWaveGapBands(profile,tEnd){
  if(!waveGapBands) return;
  if(!profile){
    waveGapBands.innerHTML='';
    if(waveTransitionUncertaintyLegend) waveTransitionUncertaintyLegend.hidden=true;
    if(waveMissedObservationLegend) waveMissedObservationLegend.hidden=true;
    return;
  }
  const unresolved=(profile.reconstruction_segments||[])
    .filter(segment=>segment.wave_visible===false&&segment.placement_basis==='historical_unresolved_interval')
    .map(segment=>({
      kind:'unresolved',
      start:Math.max(0,playbackFromHistoricalAbs(profile,segment.model_start_abs_s)),
      end:playbackFromHistoricalAbs(profile,segment.model_end_abs_s),
      label:'未観測'
    }));
  const phaseOnly=(profile.wave_segments||[])
    .filter(segment=>segment.main_clock_visible===false&&segment.display_axis==='model_phase_order')
    .map(segment=>({
      kind:'phase',
      start:Number(segment.playback_start_s),
      end:Number(segment.playback_end_s),
      label:'時計軸外→下段'
    }));
  const folded=getOmittedPlaybackIntervals(profile)
    .filter(interval=>!interval.compressionKind)
    .map(interval=>({kind:'folded',start:interval.start,end:interval.end,x1:interval.xStart,x2:interval.xEnd,label:'',title:interval.title,staticBand:true}));
  const transitionUncertain=(profile.transition_uncertainty_ranges||[]).map(range=>({
    kind:'transition-uncertain',
    start:Number(range.playback_start_s),
    end:Number(range.playback_end_s),
    x1:historicalAbsToWaveX(profile,Number(range.start_abs_s)),
    x2:historicalAbsToWaveX(profile,Number(range.end_abs_s)),
    label:range.display_label_ja||'配置時刻不明',
    boundaryLabel:range.end_boundary_label_ja||'',
    title:`${positionShortJa(range.from_position)}→${positionShortJa(range.to_position)} 配置変更時刻不確定 ${range.start_hms||''}〜${range.end_hms||''}${range.end_boundary_label_ja?`（右端：${range.end_boundary_label_ja}）`:''}`,
    staticBand:true
  }));
  const missed=(profile.missed_observation_ranges||[]).map(range=>({
    kind:'missed',
    start:Number(range.playback_start_s),
    end:Number(range.playback_end_s),
    x1:historicalAbsToWaveX(profile,Number.isFinite(Number(range.display_start_abs_s))?Number(range.display_start_abs_s):Number(range.start_abs_s)),
    x2:historicalAbsToWaveX(profile,Number.isFinite(Number(range.display_end_abs_s))?Number(range.display_end_abs_s):Number(range.end_abs_s)),
    label:range.display_label_ja||range.label||(Number.isFinite(Number(range.missed_extreme_count))?`欠測 ${Number(range.missed_extreme_count)}極値`:'欠測'),
    title:`原表に missed と記録された欠測区間 ${range.start_hms||''}〜${range.end_hms||''}${Number.isFinite(Number(range.missed_extreme_count))?`（${Number(range.missed_extreme_count)}極値）`:''}`,
    displayStyle:range.display_style||'interval_bracket',
    staticBand:true
  }));
  if(waveTransitionUncertaintyLegend) waveTransitionUncertaintyLegend.hidden=!transitionUncertain.length;
  if(waveMissedObservationLegend) waveMissedObservationLegend.hidden=!missed.length;
  updateCompressedGapLegend(profile);
  const ordinary=folded.length?folded:mergeWaveIntervals(unresolved.concat(phaseOnly));
  const bands=ordinary.concat(transitionUncertain,missed);
  waveGapBands.innerHTML=bands.map((band,index)=>{
    const start=Math.max(0,Number(band.start)||0);
    const end=band.staticBand?Number(band.end)||0:Math.min(Number(tEnd)||0,Number(band.end)||0);
    if(end<=start+1e-6) return '';
    const x1=Number.isFinite(Number(band.x1))?Number(band.x1):timeToWaveX(start);
    const x2=Number.isFinite(Number(band.x2))?Number(band.x2):timeToWaveX(end);
    const width=Math.max(1,x2-x1);
    const layout=getWaveTimeAxisLayout(profile);
    const fullUnobserved=band.kind==='unresolved'&&layout&&layout.mode==='full';
    const label=band.kind!=='folded'&&width>82?'<text x="'+(x1+width/2).toFixed(1)+'" y="101" class="wave-gap-label">'+escapeHtml(band.label)+'</text>':'';
    const klass=band.kind==='phase'
      ?'wave-gap-band wave-phase-exclusion-band'
      :(band.kind==='folded'
        ?'wave-gap-band wave-folded-gap-band'
        :(band.kind==='transition-uncertain'
          ?'wave-gap-band wave-transition-uncertainty-band'
          :(band.kind==='missed'
            ?`wave-gap-band wave-missed-observation-band${band.displayStyle==='single_extreme_bracket'?' is-single-extreme':''}`
            :(fullUnobserved?'wave-gap-band wave-full-unobserved-gap':'wave-gap-band'))));
    const title=band.kind==='phase'
      ?'時計時刻がない振れ幅の記録は下段へ分離'
      :(band.kind==='folded'
        ?(band.title||'連続波形がない時間を短縮表示')
        :(band.kind==='transition-uncertain'||band.kind==='missed'
          ?band.title
          :'未観測・補完しない区間'));
    if(fullUnobserved){
      return '<g class="'+klass+'"><line x1="'+x1.toFixed(1)+'" x2="'+x1.toFixed(1)+'" y1="18" y2="188"></line><line x1="'+x2.toFixed(1)+'" x2="'+x2.toFixed(1)+'" y1="18" y2="188"></line>'+label+'<title>'+escapeHtml(title)+' '+(index+1)+'</title></g>';
    }
    if(band.kind==='transition-uncertain'){
      const transitionLabel=width>58?'<text x="'+(x1+width/2).toFixed(1)+'" y="92" class="wave-gap-label wave-transition-label">'+escapeHtml(band.label)+'</text>':'';
      const boundaryLabel=band.boundaryLabel&&width>62?'<text x="'+(x2-4).toFixed(1)+'" y="178" text-anchor="end" class="wave-transition-boundary-label">'+escapeHtml(band.boundaryLabel)+'</text>':'';
      return '<g class="'+klass+'"><rect x="'+x1.toFixed(1)+'" y="18" width="'+width.toFixed(1)+'" height="170" rx="2"></rect><line class="uncertainty-boundary" x1="'+x1.toFixed(1)+'" x2="'+x1.toFixed(1)+'" y1="18" y2="188"></line><line class="uncertainty-boundary" x1="'+x2.toFixed(1)+'" x2="'+x2.toFixed(1)+'" y1="18" y2="188"></line>'+transitionLabel+boundaryLabel+'<title>'+escapeHtml(title)+'</title></g>';
    }
    if(band.kind==='missed'){
      const singleExtreme=band.displayStyle==='single_extreme_bracket';
      const bracketY=singleExtreme?189:184;
      const capTop=singleExtreme?179:174;
      const center=x1+width/2;
      const labelWidth=Math.min(Math.max(0,width-6),Math.max(54,String(band.label||'').length*9+14));
      const labelBg=singleExtreme&&width>52?'<rect x="'+(center-labelWidth/2).toFixed(1)+'" y="158" width="'+labelWidth.toFixed(1)+'" height="17" rx="3" class="wave-missed-label-bg"></rect>':'';
      const gapLabel=width>(singleExtreme?52:58)?'<text x="'+center.toFixed(1)+'" y="170" class="wave-missed-label">'+escapeHtml(band.label)+'</text>':'';
      const centerNotch=singleExtreme?'<path class="missed-center-notch" d="M'+(center-4).toFixed(1)+' '+bracketY+'L'+center.toFixed(1)+' '+(bracketY+4)+'L'+(center+4).toFixed(1)+' '+bracketY+'"></path>':'';
      return '<g class="'+klass+'">'+labelBg+'<path class="missed-interval-bracket" d="M'+x1.toFixed(1)+' '+capTop+'V'+bracketY+'H'+x2.toFixed(1)+'V'+capTop+'"></path>'+centerNotch+gapLabel+'<title>'+escapeHtml(title)+'</title></g>';
    }
    return '<g class="'+klass+'"><rect x="'+x1.toFixed(1)+'" y="18" width="'+width.toFixed(1)+'" height="170" rx="2"></rect>'+label+'<title>'+escapeHtml(title)+' '+(index+1)+'</title></g>';
  }).join('');
}

function getWaveVisiblePlaybackIntervals(profile){
  const layout=getWaveTimeAxisLayout(profile);
  if(!layout||layout.mode!=='folded') return [{start:0,end:getActiveObservationEndTime()}];
  return layout.segments
    .filter(segment=>segment.type!=='omitted'&&segment.waveVisible!==false)
    .map(segment=>({
      start:Math.max(0,playbackFromHistoricalAbs(profile,segment.startAbs)),
      end:Math.min(getActiveObservationEndTime(),playbackFromHistoricalAbs(profile,segment.endAbs))
    }))
    .filter(interval=>interval.end>interval.start+1e-6);
}

function appendWaveSegmentCommands(target,profile,segment,segmentStart,segmentEnd,endTime,straightConnector){
  const span=Math.max(1e-6,segmentEnd-segmentStart);
  const samples=straightConnector?2:Math.max(3,Math.min(120,Math.ceil(span/endTime*220)));
  const useVisibleHistoricalBounds=Boolean(profile&&profile.clock_axis_segment_mapping==='visible_historical_bounds');
  const modelStartAbs=Number(segment&&segment.model_start_abs_s);
  const modelEndAbs=Number(segment&&segment.model_end_abs_s);
  const visibleStartAbs=Number(segment&&segment.display_start_abs_s);
  const visibleEndAbs=Number(segment&&segment.display_end_abs_s);
  const mappedStartAbs=useVisibleHistoricalBounds&&Number.isFinite(visibleStartAbs)?visibleStartAbs:modelStartAbs;
  const mappedEndAbs=useVisibleHistoricalBounds&&Number.isFinite(visibleEndAbs)?visibleEndAbs:modelEndAbs;
  const hasHistoricalBounds=Number.isFinite(mappedStartAbs)&&Number.isFinite(mappedEndAbs)&&mappedEndAbs>mappedStartAbs;
  const declaredPlaybackStart=Number(segment&&segment.playback_start_s);
  const declaredPlaybackEnd=Number(segment&&segment.playback_end_s);
  const declaredPlaybackSpan=Math.max(1e-9,declaredPlaybackEnd-declaredPlaybackStart);
  for(let index=0;index<samples;index+=1){
    const sampleTime=segmentStart+span*index/(samples-1);
    let value;
    if(straightConnector){
      const startValue=profile.valueAt(segmentStart);
      const endValue=profile.valueAt(segmentEnd);
      if(!Number.isFinite(Number(startValue))||!Number.isFinite(Number(endValue))) continue;
      value=Number(startValue)+(Number(endValue)-Number(startValue))*(index/(samples-1));
    }else{
      const defined=typeof profile.isWaveDefinedAt==='function'?profile.isWaveDefinedAt(sampleTime):true;
      value=defined?profile.valueAt(sampleTime):null;
    }
    if(!Number.isFinite(Number(value))) continue;
    let x=timeToWaveX(sampleTime);
    if(hasHistoricalBounds&&Number.isFinite(declaredPlaybackStart)&&Number.isFinite(declaredPlaybackEnd)){
      const segmentRatio=Math.max(0,Math.min(1,(sampleTime-declaredPlaybackStart)/declaredPlaybackSpan));
      const sampleAbs=mappedStartAbs+(mappedEndAbs-mappedStartAbs)*segmentRatio;
      x=historicalAbsToWaveX(profile,sampleAbs);
    }
    const y=readValueToWaveY(value);
    target.push(`${index===0?'M':'L'}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
}

function renderWaveReconstructionBand(profile,tEnd){
  // CV079B12: keep parameter-sensitivity samples in the audit CSV and result summary,
  // but do not draw the extremely narrow range over the main observation waveform.
  // It is not a measurement uncertainty or confidence interval, and at this scale it
  // competes with the historical and reconstruction lines without adding readable value.
  if(waveReconstructionBand) waveReconstructionBand.setAttribute('d','');
}

function isHistoricalObservationWaveSegment(segment){
  const lineKind=String(segment&&segment.line_kind||'');
  return lineKind==='historical_solid'||lineKind==='historical_direct_point_guide';
}

function isReconstructionWaveSegment(segment){
  const lineKind=String(segment&&segment.line_kind||'');
  return lineKind==='reconstruction_dashed'||lineKind==='crossing_time_reconstruction'||lineKind==='legacy_model'||lineKind.includes('reconstruction');
}

function updateObservedWavePath(t){
  if(!waveObservedPath) return;
  const profile=getActiveReplayProfile();
  if(isColumnReauditObservationSet(profile)){
    waveObservedPath.setAttribute('d','');
    if(waveReconstructionPath){waveReconstructionPath.setAttribute('d','');waveReconstructionPath.style.display='none';}
    if(waveReconstructionBand) waveReconstructionBand.setAttribute('d','');
    if(waveGapBands) waveGapBands.innerHTML='';
    if(waveTransitionUncertaintyLegend) waveTransitionUncertaintyLegend.hidden=true;
    if(waveMissedObservationLegend) waveMissedObservationLegend.hidden=true;
    return;
  }
  const endTime=getActiveObservationEndTime();
  const tEnd=Math.max(0,Math.min(endTime,Number(t)||0));
  if(!profile||tEnd<=0.01){
    waveObservedPath.setAttribute('d','');
    if(waveReconstructionPath) waveReconstructionPath.setAttribute('d','');
    if(waveReconstructionBand) waveReconstructionBand.setAttribute('d','');
    if(profile) renderWaveGapBands(profile,tEnd);
    else if(waveGapBands) waveGapBands.innerHTML='';
    return;
  }
  const declaredSegments=Array.isArray(profile.wave_segments)&&profile.wave_segments.length
    ? profile.wave_segments
    : [{playback_start_s:0,playback_end_s:endTime,line_kind:'legacy_model',main_clock_visible:true}];
  const historicalCommands=[];
  const reconstructionCommands=[];
  const visibleAxisIntervals=getWaveVisiblePlaybackIntervals(profile);
  declaredSegments.forEach(segment=>{
    if(segment.main_clock_visible===false) return;
    const declaredStart=Math.max(0,Number(segment.playback_start_s)||0);
    const declaredEnd=Number(segment.playback_end_s)||0;
    const availableEnd=Math.min(tEnd,declaredEnd);
    if(availableEnd<=declaredStart+1e-6) return;
    const historicalSegment=isHistoricalObservationWaveSegment(segment);
    const reconstructionSegment=isReconstructionWaveSegment(segment);
    const straightConnector=segment.line_kind==='historical_solid';
    if(straightConnector&&tEnd+1e-6<declaredEnd) return;
    const target=historicalSegment&&!reconstructionSegment?historicalCommands:reconstructionCommands;
    visibleAxisIntervals.forEach(interval=>{
      const segmentStart=Math.max(declaredStart,interval.start);
      const segmentEnd=Math.min(straightConnector?declaredEnd:availableEnd,interval.end);
      if(segmentEnd<=segmentStart+1e-6) return;
      appendWaveSegmentCommands(target,profile,segment,segmentStart,segmentEnd,endTime,straightConnector);
    });
  });
  waveObservedPath.setAttribute('d',historicalCommands.join(' '));
  waveObservedPath.classList.toggle('wave-historical-path',historicalCommands.length>0);
  waveObservedPath.classList.toggle('wave-legacy-model-path',false);
  if(waveReconstructionPath){
    waveReconstructionPath.setAttribute('d',reconstructionCommands.join(' '));
    waveReconstructionPath.style.display=reconstructionCommands.length?'':'none';
  }
  renderWaveGapBands(profile,tEnd);
  renderWaveReconstructionBand(profile,tEnd);
}

function renderWaveResidualAudit(profile){
  const experimentI=profile&&profile.data_key==='CAV-1798-EXP-I';
  const segments=experimentI&&profile.physical_model&&profile.physical_model.clock_axis
    ? profile.physical_model.clock_axis.segments
    : [];
  if(!segments.length){
    if(waveResidualAudit){waveResidualAudit.hidden=true;waveResidualAudit.innerHTML='';}
    if(modelValidationPanel){modelValidationPanel.hidden=true;modelValidationPanel.innerHTML='';}
    return;
  }
  const statusLabel=(status,compact=false)=>{
    if(status==='consistent') return compact?'0.1目盛以内':'記録の細かさ以内';
    if(status==='caution') return compact?'0.5目盛以内':'差に注意';
    return '要再検証';
  };
  const compactItems=segments.map((segment,index)=>{
    const audit=segment.validation||{};
    const status=String(audit.validation_status||'needs_revalidation');
    return `<span class="wave-model-status-item is-${escapeHtml(status)}" title="区間${index+1}：補完計算と時計付き読取値のいちばん大きな差 ${Number.isFinite(Number(audit.max_absolute_residual))?Number(audit.max_absolute_residual).toFixed(6):'—'} 目盛"><b>区間${index+1}</b><small>${escapeHtml(statusLabel(status,true))}</small></span>`;
  }).join('');
  const diagnostics=profile.physical_model.diagnostics||{};
  const overall=diagnostics.overall_validation_status||'mixed_needs_revalidation';
  if(waveResidualAudit){
    waveResidualAudit.hidden=false;
    waveResidualAudit.innerHTML=`<b class="wave-model-status-title">観測記録との比較</b><div class="wave-model-status-items">${compactItems}</div><i class="wave-model-status-overall is-${escapeHtml(overall)}">${overall==='consistent'?'3区間とも0.1目盛以内':overall==='mixed_caution'?'差に注意':'再確認あり'}</i>`;
  }

  const samples=Array.isArray(profile.reconstruction_samples)?profile.reconstruction_samples:[];
  const maxSensitivityWidth=samples.reduce((max,sample)=>{
    const width=Number(sample.sensitivity_max)-Number(sample.sensitivity_min);
    return Number.isFinite(width)?Math.max(max,width):max;
  },0);
  const maxDifference=Number(diagnostics.max_direct_clock_closure_residual);
  const rmsDifference=Number(diagnostics.rms_direct_clock_closure_residual);
  const segmentValues=segments.map(segment=>{
    const audit=segment.validation||{};
    const constraint=segment.extreme_constraint||{};
    return {
      duration:Number(segment.half_cycle_seconds),
      historicalExtreme:Number(constraint.expected_value),
      modelAmplitude:Number(constraint.amplitude),
      checkCount:Array.isArray(segment.direct_clock_checks)?segment.direct_clock_checks.length:0,
      maxDifference:Number(audit.max_absolute_residual),
      rmsDifference:Number(audit.rms_residual),
      status:String(audit.validation_status||'needs_revalidation')
    };
  });
  const matrixRow=(label,formatter,extraClass='')=>`<tr class="${escapeHtml(extraClass)}"><th scope="row">${escapeHtml(label)}</th>${segmentValues.map((value,index)=>`<td${extraClass==='model-validation-result-row'?` class="is-${escapeHtml(value.status)}"`:''}>${formatter(value,index)}</td>`).join('')}</tr>`;
  const matrixHtml=`<div class="model-validation-matrix-wrap"><table class="model-validation-matrix"><thead><tr><th scope="col">確認項目</th>${segmentValues.map((_,index)=>`<th scope="col">区間${index+1}</th>`).join('')}</tr></thead><tbody>${matrixRow('区間の長さ（秒）',value=>Number.isFinite(value.duration)?value.duration.toFixed(0):'—')}${matrixRow('記録された振れ幅（目盛）',value=>Number.isFinite(value.historicalExtreme)?value.historicalExtreme.toFixed(3):'—')}${matrixRow('計算した振れ幅（目盛）',value=>Number.isFinite(value.modelAmplitude)?value.modelAmplitude.toFixed(3):'—')}${matrixRow('比較した記録数（件）',value=>String(value.checkCount))}${matrixRow('いちばん大きな差（目盛）',value=>Number.isFinite(value.maxDifference)?value.maxDifference.toFixed(6):'—')}${matrixRow('差の平均的な大きさ（RMS・目盛）',value=>Number.isFinite(value.rmsDifference)?value.rmsDifference.toFixed(6):'—')}${matrixRow('記録との比較結果',value=>escapeHtml(statusLabel(value.status,true)),'model-validation-result-row')}</tbody></table></div>`;
  if(modelValidationPanel){
    modelValidationPanel.hidden=false;
    modelValidationPanel.innerHTML=`<div class="model-validation-head"><b>実験I 当時の観測記録と計算結果の比較</b><span>時計付きの読取値を使って確認</span></div><p class="model-validation-scope model-validation-conclusion"><b>3つの区間すべてで、計算結果と当時の観測記録との差は0.1目盛以内でした。</b></p>${matrixHtml}<p class="model-validation-scope"><b>確認できたこと</b><br>計算した波形は、当時の観測記録と大きく矛盾していません。全8件で、いちばん大きな差は${Number.isFinite(maxDifference)?maxDifference.toFixed(6):'—'}目盛、差の平均的な大きさ（RMS）は${Number.isFinite(rmsDifference)?rmsDifference.toFixed(6):'—'}目盛でした。</p><p class="model-assumption-note"><b>計算に使った主な仮定</b><br>振動中央時刻を振動の区切りに使用／時計時刻がない振れ幅を計算の基準に使用／中央線 m(t) は区間内で直線的に変化／減衰率 β は全区間で共通／補正する外力は加えない。減衰率 β を変えたときの最大幅：${maxSensitivityWidth.toFixed(6)}目盛（測定の不確かさ、確率、信頼区間ではありません）。</p><div class="model-fix-scope"><span><b>確定</b> 観測記録と補完計算の分離／根拠のない時刻を付けない／時計軸表示／記録との差が0.1目盛以内</span><span><b>未確定</b> 中央線が変化した物理的な原因／この計算方法だけが正しいか／統計的な不確かさ／他の実験にも同じ方法を使えるか</span></div>`;
  }
}

function renderWavePhaseLane(records,profile){
  if(!wavePhaseLane) return;
  const phaseRecords=(records||[])
    .filter(record=>record.value_class==='historical_direct_value'&&isOrderConstraintTimeBasis(record.time_basis))
    .sort((a,b)=>(Number(a.phase_order)||0)-(Number(b.phase_order)||0)||String(a.large_mass_position||'').localeCompare(String(b.large_mass_position||'')));
  if(!phaseRecords.length){
    wavePhaseLane.hidden=true;
    wavePhaseLane.innerHTML='';
    if(waveSupportSummary){
      const missedCount=profile&&Array.isArray(profile.missed_observation_ranges)?profile.missed_observation_ranges.length:0;
      const transitionCount=profile&&Array.isArray(profile.transition_uncertainty_ranges)?profile.transition_uncertainty_ranges.length:0;
      waveSupportSummary.textContent=[missedCount?`欠測 ${missedCount}区間`:'',transitionCount?`配置時刻不確定 ${transitionCount}区間`:'',isDirectClockObservationProfile(profile)?'直接極値ガイド':'','線種凡例'].filter(Boolean).join('・');
    }
    return;
  }
  const positionOrder={positive:0,midway:1,negative:2};
  phaseRecords.sort((a,b)=>(positionOrder[a.large_mass_position]??9)-(positionOrder[b.large_mass_position]??9)||(Number(a.phase_order)||0)-(Number(b.phase_order)||0));
  const rows=phaseRecords.map(record=>{
    const position=positionLongJa(record.large_mass_position||record.position||'unknown');
    const order=Number(record.phase_order)||Number(record.record_order)||'—';
    return `<tr class="wave-phase-record" data-record-trigger="${Number(record.record_trigger_s).toFixed(3)}"><td>${escapeHtml(String(order))}</td><td>${escapeHtml(position)}</td><td>${Number(record.read_value).toFixed(1)}目盛</td></tr>`;
  }).join('');
  wavePhaseLane.hidden=false;
  if(waveSupportSummary) waveSupportSummary.textContent=`時計時刻なし ${phaseRecords.length}件・線種凡例`;
  wavePhaseLane.innerHTML=`<div class="wave-phase-title"><b>時計時刻が記録されていない観測値</b><span>時間表ではありません。値と記録順だけが残っています。</span></div><p class="wave-phase-explanation">上の時間波形には配置せず、当時の記録順で一覧表示します。</p><table class="wave-phase-table"><thead><tr><th>配置内の順番</th><th>大球の配置</th><th>記録値</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function updateWavePhaseCurrent(playbackTime){
  if(!wavePhaseLane||wavePhaseLane.hidden) return;
  const points=[...wavePhaseLane.querySelectorAll('.wave-phase-record')];
  let active=null;
  points.forEach(point=>{
    const pointTime=Number(point.dataset.recordTrigger);
    const passed=Number.isFinite(pointTime)&&pointTime<=Number(playbackTime)+0.04;
    point.classList.toggle('is-passed',passed);
    point.classList.remove('is-active');
    if(passed&&(!active||pointTime>Number(active.dataset.recordTrigger))) active=point;
  });
  if(active) active.classList.add('is-active');
}

function updateWaveRecordMarkers(){
  if(!waveRecordMarkers) return;
  const profile=getActiveReplayProfile();
  updateWaveMeaningLegend(profile);
  if(isColumnReauditObservationSet(profile)){
    waveRecordMarkers.innerHTML='';
    if(wavePhaseLane){wavePhaseLane.hidden=true;wavePhaseLane.innerHTML='';}
    if(waveSupportSummary) waveSupportSummary.textContent='線種凡例';
    renderWaveResidualAudit(profile);
    return;
  }
  const experimentI=profile&&profile.data_key==='CAV-1798-EXP-I';
  const markerRecords=readingRecords.filter(record=>record.value_kind!=='point_of_rest');
  const hideOrderOnlyOnMainAxis=Boolean(profile&&profile.clock_axis_outside_marker_policy==='hide_order_only_on_main_axis');
  const mainRecords=experimentI
    ? markerRecords.filter(record=>!isReconstructedTimeBasis(record.time_basis))
    : (hideOrderOnlyOnMainAxis
      ? markerRecords.filter(record=>!isOrderConstraintTimeBasis(record.time_basis)&&record.elapsed_time_s!==null&&record.elapsed_time_s!==undefined&&record.elapsed_time_s!==''&&Number.isFinite(Number(record.elapsed_time_s)))
      : markerRecords);
  waveRecordMarkers.innerHTML=mainRecords.map((record,index)=>{
    const point=recordToWavePoint(record);
    if(!point) return '';
    const reconstructed=isReconstructedTimeBasis(point.sourceClass);
    const klass=reconstructed?'wave-record-b':'wave-record-a';
    const latest=index===mainRecords.length-1;
    const densityClass=latest?'wave-record-latest':'wave-record-past';
    const radius=latest?4.8:3.5;
    const label=reconstructed
      ? (isCrossingTimeObservationProfile(profile)?'史実極値・時計時刻は振動中央時刻から再構成':'記録された振れ幅・時計時刻なし（時計軸外）')
      : (isCrossingTimeObservationProfile(profile)
        ? (record.value_kind==='division_reading'?'原表の時計付き直接読取':'原表の目盛通過値・時計時刻あり')
        : '当時の観測値・時計時刻あり');
    return `<circle cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="${radius}" class="${klass} ${densityClass}"><title>${escapeHtml(label)} ${escapeHtml(record.historical_time_hms||'')} ${escapeHtml(record.read_div)}</title></circle>`;
  }).join('');
  renderWaveResidualAudit(profile);
  renderWavePhaseLane(markerRecords,profile);
  if(waveIdleMessage) waveIdleMessage.style.display=observationState==='idle'?'':'none';
  updateWaveTimeFoldMarker(getActiveReplayProfile());
  updateWavePhaseCurrent(time);
}

function getPositionSummary(records=readingRecords){
  const profile=getActiveReplayProfile();
  if(observationState==='completed'&&profile&&Array.isArray(profile.position_stats)&&profile.position_stats.length){
    const positions=profile.position_stats.map(item=>({position:item.position,label:positionLongJa(item.position),count:Number(item.count)||0,average:Number(item.average),values:[]}));
    const transitions=(profile.transition_stats||[]).map(item=>({label:`${positionShortJa(item.from_position)}→${positionShortJa(item.to_position)} 史実移動量`,difference:Number(item.result_value),difference_text:formatReadDivValue(Number(item.result_value)),source:item.result_source||'historical_summary_motion',from_position:item.from_position,to_position:item.to_position}));
    return {positions,transitions};
  }
  const positionOrder=profile&&profile.sections?profile.sections.map(section=>section.position).filter((value,index,array)=>array.indexOf(value)===index):[];
  const grouped={};
  records.filter(record=>record.summary_eligible!==false).forEach(record=>{
    const key=record.large_mass_position||'unknown';
    if(!grouped[key]) grouped[key]=[];
    const value=Number(record.read_value);
    if(Number.isFinite(value)) grouped[key].push(value);
  });
  const order=positionOrder.concat(Object.keys(grouped).filter(key=>!positionOrder.includes(key)));
  const positions=order.map(position=>{
    const values=grouped[position]||[];
    return {position,label:positionLongJa(position),short_label:positionShortJa(position),count:values.length,average:values.length?values.reduce((a,b)=>a+b,0)/values.length:null};
  }).filter(item=>item.count>0);
  const transitions=[];
  if(profile&&profile.transitions){
    profile.transitions.forEach(item=>{
      const historicalMotion=Number(item.historical_motion_value);
      if(Number.isFinite(historicalMotion)){
        transitions.push({label:`${positionShortJa(item.from_position)}→${positionShortJa(item.to_position)} 史実移動量`,difference:historicalMotion,difference_text:formatReadDivValue(historicalMotion),source:'historical_summary_motion',from_position:item.from_position,to_position:item.to_position});
        return;
      }
      const from=positions.find(position=>position.position===item.from_position);
      const to=positions.find(position=>position.position===item.to_position);
      if(from&&to&&Number.isFinite(from.average)&&Number.isFinite(to.average)){
        const difference=to.average-from.average;
        transitions.push({label:`${positionShortJa(item.from_position)}→${positionShortJa(item.to_position)} 平均差`,difference,difference_text:formatReadDivValue(difference),source:'calculated_position_average_difference',from_position:item.from_position,to_position:item.to_position});
      }
    });
  }
  return {positions,transitions};
}

function updateReadingAverages(){
  const summary=getPositionSummary();
  const first=summary.positions[0]||{label:'位置1',count:0,average:null};
  const second=summary.positions[1]||{label:'位置2',count:0,average:null};
  const third=summary.positions[2]||null;
  const firstTransition=summary.transitions[0]||{label:'位置差',difference_text:'-- div'};
  const allTransitionText=summary.transitions.length?summary.transitions.map(item=>`${item.label} ${item.difference_text}`).join(' / '):'-- div';
  if(livePositionLabelA) livePositionLabelA.textContent=`${first.label}平均`;
  if(livePositionLabelB) livePositionLabelB.textContent=`${second.label}平均`;
  if(livePositionCWrap) livePositionCWrap.hidden=!third;
  if(livePositionLabelC) livePositionLabelC.textContent=third?`${third.label}平均`:'位置3平均';
  if(liveDifferenceLabel) liveDifferenceLabel.textContent=firstTransition.label;
  if(avgReadA) avgReadA.textContent=formatAverageWithN(first.average,first.count);
  if(avgReadB) avgReadB.textContent=formatAverageWithN(second.average,second.count);
  if(avgReadC) avgReadC.textContent=third?formatAverageWithN(third.average,third.count):'-- div（n=0）';
  if(readDiffAB) readDiffAB.textContent=firstTransition.difference_text;
  if(gravityReadDiff) gravityReadDiff.textContent=allTransitionText;
  if(liveDifferenceDescription) liveDifferenceDescription.textContent=summary.transitions.some(item=>item.source==='historical_summary_motion')?'当時の記録にまとめられた移動量を表示します。':'位置別の観測値平均から計算した差です。';
  if(resultPositionCCountWrap) resultPositionCCountWrap.hidden=!third;
  if(resultPositionCAverageWrap) resultPositionCAverageWrap.hidden=!third;
  if(resultDifferenceWrap) resultDifferenceWrap.hidden=Boolean(third);
  if(resultGravityDiffWrap) resultGravityDiffWrap.classList.toggle('is-full-width',Boolean(third));
  if(resultCountLabelA) resultCountLabelA.textContent=`${first.label}読取数`;
  if(resultCountLabelB) resultCountLabelB.textContent=`${second.label}読取数`;
  if(resultCountLabelC) resultCountLabelC.textContent=third?`${third.label}読取数`:'位置3読取数';
  if(resultAverageLabelA) resultAverageLabelA.textContent=`${first.label}平均`;
  if(resultAverageLabelB) resultAverageLabelB.textContent=`${second.label}平均`;
  if(resultAverageLabelC) resultAverageLabelC.textContent=third?`${third.label}平均`:'位置3平均';
  if(resultDifferenceLabel) resultDifferenceLabel.textContent=firstTransition.label;
  if(resultCountA) resultCountA.textContent=`${first.count} 件`;
  if(resultCountB) resultCountB.textContent=`${second.count} 件`;
  if(resultCountC) resultCountC.textContent=third?`${third.count} 件`:'0 件';
  if(resultAvgA) resultAvgA.textContent=formatReadDivValue(first.average);
  if(resultAvgB) resultAvgB.textContent=formatReadDivValue(second.average);
  if(resultAvgC) resultAvgC.textContent=third?formatReadDivValue(third.average):'-- div';
  if(resultDiffAB) resultDiffAB.textContent=firstTransition.difference_text;
  if(resultGravityDiff) resultGravityDiff.textContent=allTransitionText;
  updateResultSummaryMode();
}

function addHistoricalRecordsUpTo(playbackTime){
  const profile=getActiveReplayProfile();
  if(!profile||!Array.isArray(profile.anchors)) return;
  let changed=false;
  while(lastHistoricalAnchorIndex+1<profile.anchors.length){
    const nextIndex=lastHistoricalAnchorIndex+1;
    const anchor=profile.anchors[nextIndex];
    const trigger=Number.isFinite(Number(anchor.record_trigger_s))?Number(anchor.record_trigger_s):(Number.isFinite(Number(anchor.playback_time_s))?Number(anchor.playback_time_s):Infinity);
    if(trigger>Number(playbackTime)+0.04) break;
    lastHistoricalAnchorIndex=nextIndex;
    readingRecordSequence+=1;
    const exactClock=anchor.time_basis==='historical_direct_time'&&profile.date_iso&&anchor.historical_time_hms&&anchor.historical_time_hms!=='—';
    const orderOnly=isOrderConstraintTimeBasis(anchor.time_basis);
    const hasPlaybackTime=!orderOnly&&anchor.playback_time_s!==null&&anchor.playback_time_s!==undefined&&anchor.playback_time_s!==''&&Number.isFinite(Number(anchor.playback_time_s));
    const timestamp=exactClock?`${profile.date_iso}T${anchor.historical_time_hms}`:'';
    readingRecords.push(Object.freeze({
      record_id:anchor.anchor_id||makeRecordId(),
      timestamp,
      elapsed_time_s:hasPlaybackTime?Number(Number(anchor.playback_time_s).toFixed(3)):null,
      record_trigger_s:Number(trigger.toFixed(3)),
      historical_time_hms:orderOnly?'':(anchor.historical_time_hms||'—'),
      historical_time_original:anchor.historical_time_original||'',
      large_mass_position:anchor.position,
      position:anchor.position,
      read_div:formatHistoricalRead(anchor.value),
      read_value:Number(anchor.value),
      reading_set_id:`${profile.data_key}-S${String(Number(anchor.section_index)+1).padStart(2,'0')}`,
      value_kind:String(anchor.value_kind||''),
      value_class:String(anchor.value_class||''),
      source_page:String(anchor.source_page||''),
      source_row_id:String(anchor.row_id||''),
      source_class:String(anchor.source_class||''),
      time_basis:String(anchor.time_basis||''),
      phase_group:String(anchor.phase_group||''),
      phase_order:anchor.phase_order!==null&&anchor.phase_order!==undefined&&anchor.phase_order!==''&&Number.isFinite(Number(anchor.phase_order))?Number(anchor.phase_order):null,
      summary_eligible:Boolean(anchor.summary_eligible),
      observation_note:`source_page=${anchor.source_page}; source_row_id=${anchor.row_id}; value_kind=${anchor.value_kind}; value_class=${anchor.value_class}; time_basis=${anchor.time_basis}`
    }));
    changed=true;
  }
  if(changed){
    renderReadingRecordsTable();
    updateReadingAverages();
    updateWaveRecordMarkers();
    hideOutputStatusMessage();
    updateControlButtons();
  }
}

function addReadingRecord(){
  addHistoricalRecordsUpTo(time);
}


// CV042: Export Historical Raw Record CSV from frozen reading records only.
// One CSV row equals one historical reading record.
// Derived values such as theta, torque, force, G, vernier px, match, averages and differences are intentionally excluded.
const HISTORICAL_CSV_COLUMNS = [
  'record_id',
  'timestamp',
  'elapsed_time_s',
  'historical_time_hms',
  'historical_time_original',
  'large_mass_position',
  'value_kind',
  'value_class',
  'read_div',
  'reading_set_id',
  'source_page',
  'source_row_id',
  'source_class',
  'time_basis',
  'observation_note'
];
function quoteCsvCell(value){
  const text = value === null || value === undefined ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

// CV060C: CSV metadata format confirmation.
// Metadata is written as a leading metadata block. Data rows begin after the __data_section marker.
// The reading-record data header and data columns remain the same as CV059/CV060A.
function getCsvReplayProfilePolicy(profile){
  if(profile&&profile.data_key==='CAV-1798-EXP-I'){
    return {
      type:'experiment_i_physical_reconstruction',
      numericModelBuild:profile.physical_model_build||'CV079B12',
      physicalModelUniqueness:'unresolved',
      middleLineAssumption:'linear_between_printed_middle_vibration_markers',
      dampingAssumption:'single_global_beta_from_printed_half_ranges',
      closureScope:'same_source_internal_nonstatistical',
      timePolicy:'Experiment Iは原表時刻付きdivision値だけを時計軸へ配置し、時刻未記載極値は絶対時刻・モデル時刻とも付与せず記録順だけを保持',
      interpolationPolicy:'Experiment Iは原表のmiddle-vibration時刻4点を位相境界、時刻未記載極値3点を振幅拘束として3区間を補完。時計時刻付きdivision読取8点との比較は同じ原表内での非統計的一致確認であり、独立検証ではない。極値時刻は生成しない'
    };
  }
  if(isDirectClockObservationProfile(profile)){
    return {
      type:'direct_clock_observation',
      numericModelBuild:'none_direct_clock_guide',
      physicalModelUniqueness:'not_applicable',
      middleLineAssumption:'none',
      dampingAssumption:'none',
      closureScope:'historical_source_provenance_only',
      timePolicy:'原表で時計時刻と同じ行に印刷されたdivision値または極値を直接時計値として配置し、Point of restは原表内計算値として瞬間時刻を主張しない',
      interpolationPolicy:'同一確認配置区間内の連続する直接時計値だけを表示ガイドで接続し、missed行と配置変更時刻不確定帯をまたいで接続しない'
    };
  }
  if(isCrossingTimeObservationProfile(profile)){
    return {
      type:'crossing_time_reconstruction',
      numericModelBuild:profile&&profile.common_structure_build||'crossing_time_half_cycle_reconstruction',
      physicalModelUniqueness:'not_claimed',
      middleLineAssumption:'piecewise_half_cosine_between_recorded_extrema',
      dampingAssumption:'not_used',
      closureScope:'same_source_internal_nonstatistical',
      timePolicy:'原表の目盛通過時刻を史実時計値として保持し、極値の時計位置は印刷された振動中央時刻を位相拘束として再構成する。時計時刻なし極値は記録順表示へ分離する',
      interpolationPolicy:'同一配置区間内の隣接史実極値を区分半余弦で接続し、印刷された振動中央時刻で隣接極値の中央値を通す。欠測、配置変更不確定帯、時計範囲外をまたいで接続しない'
    };
  }
  return {
    type:'unclassified',numericModelBuild:'none',physicalModelUniqueness:'unresolved',middleLineAssumption:'none',dampingAssumption:'none',closureScope:'not_evaluated',timePolicy:'再生方式未分類',interpolationPolicy:'再生方式未分類'
  };
}

const CSV_SCHEMA_VERSION = '1.0.0';
function csvDatasetToken(item){
  const raw=String(item&&((item.data_key||item.id))||'CAV').toUpperCase();
  return raw.replace(/[^A-Z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'CAV';
}
function csvKindToken(csvKind){
  return csvKind==='historical_reading_records'?'HIST':'RECON';
}
function createCsvExportContext(csvKind, generatedAt = new Date()){
  const item=getSelectedHistoricalDataset();
  const generatedDate=generatedAt instanceof Date?generatedAt:new Date(generatedAt);
  const safeDate=Number.isNaN(generatedDate.getTime())?new Date():generatedDate;
  const datasetToken=csvDatasetToken(item);
  const kindToken=csvKindToken(csvKind);
  const generatedStampJst=formatJstCompactTimestamp(safeDate);
  const csvRecordId=`CAV-CSV-${kindToken}-${datasetToken}-${generatedStampJst}`;
  return Object.freeze({
    csvKind,
    datasetToken,
    kindToken,
    generatedAt:safeDate,
    generatedLabel:formatJstTimestamp(safeDate),
    generatedIsoJst:formatJstIsoTimestamp(safeDate),
    generatedStampJst,
    csvRecordId,
    filename:`${datasetToken}-${kindToken}-${APP_BUILD}-${generatedStampJst}.csv`
  });
}

function buildCsvMetadataRows(csvKind, dataColumns, exportContext = null){
  const context=exportContext||createCsvExportContext(csvKind);
  const item = getSelectedHistoricalDataset();
  const profile = getActiveReplayProfile();
  const tableSourcePages = getHistoricalTableSourcePages(item);
  const narrativeSourcePages = getHistoricalNarrativeSourcePages(item);
  const sourcePages = tableSourcePages.join('–');
  const anchors = profile && Array.isArray(profile.anchors) ? profile.anchors : [];
  const directValueCount = anchors.filter(anchor => anchor.value_class === 'historical_direct_value').length;
  const derivedValueCount = anchors.filter(anchor => anchor.value_class === 'historical_table_derived_value').length;
  const reconstructedTimeCount = anchors.filter(anchor => isReconstructedTimeBasis(anchor.time_basis)&&!isOrderConstraintTimeBasis(anchor.time_basis)&&!isHistoricalTableCalculationNoInstant(anchor.time_basis)).length;
  const untimedExtremeCount = anchors.filter(anchor => isOrderConstraintTimeBasis(anchor.time_basis)).length;
  const directClockCount = anchors.filter(anchor => anchor.time_basis === 'historical_direct_time').length;
  const registration=getObservationSetRegistration(profile||item);
  const temporary=registration.registration_status==='temporary_registered';
  const auditPending=registration.registration_status==='column_reaudit_pending';
  const policy=getCsvReplayProfilePolicy(profile);
  const connectionText=auditPending
    ? '原表列意味再監査中・史実波形表示を保留'
    : (temporary
      ? '全17セット比較用の仮登録・構造確認表示'
      : `${item.label||'選択中Experiment'}の史実再生へ正式接続済み`);
  const timePolicy=auditPending
    ? '原表列意味の再監査完了まで時計軸へ接続せず、史実波形として表示しない'
    : (temporary
      ? '仮登録中。原表時刻・振動中央時刻・通過時刻の所属は実験別確認前であり、画面上の配置は表示構造確認用。正式な史実時計軸を主張しない'
      : policy.timePolicy);
  const interpolationPolicy=auditPending
    ? '原表列意味の再監査完了まで点・線・配置変更帯を生成しない'
    : (temporary
      ? '仮登録の比較表示に限る。現在のガイド接続は正式な物理波形・史実連続波形として確定しない'
      : policy.interpolationPolicy);
  return [
    ['__meta_key','__meta_value'],
    ['app_version',APP_BUILD],
    ['csv_schema_version',CSV_SCHEMA_VERSION],
    ['csv_record_id',context.csvRecordId],
    ['generated_at_jst',context.generatedLabel],
    ['generated_at_iso8601',context.generatedIsoJst],
    ['generated_time_zone','Asia/Tokyo (UTC+09:00)'],
    ['csv_filename',context.filename],
    ['csv_encoding','UTF-8'],
    ['csv_bom','present'],
    ['csv_line_ending','CRLF'],
    ['csv_delimiter','comma'],
    ['csv_cell_quoting','all_cells_double_quoted'],
    ['decimal_separator','period'],
    ['record_id_scope','csv_record_id identifies one export; source record IDs retain Experiment provenance'],
    ['historical_timestamp_semantics','local historical observation date/time; no UTC conversion'],
    ['observation_set_registry_build',OBSERVATION_SET_REGISTRY.build||'missing'],
    ['observation_structure_build',profile&&profile.common_structure_build||HISTORICAL_REPLAY.observation_structure_build||'missing'],
    ['observation_set_registration_status',registration.registration_status||'unknown'],
    ['observation_set_display_pattern',`${registration.display_pattern_id||''} ${registration.display_pattern_name_ja||''}`.trim()],
    ['formal_replay',String(Boolean(registration.formal_replay))],
    ['replay_profile_type',policy.type],
    ['numeric_model_build',policy.numericModelBuild],
    ['interpretation_build',APP_BUILD],
    ['closure_scope',policy.closureScope],
    ['independent_validation','false'],
    ['physical_model_uniqueness',policy.physicalModelUniqueness],
    ['model_assumption_middle_line',policy.middleLineAssumption],
    ['model_assumption_damping',policy.dampingAssumption],
    ['model_assumption_correction_force','none'],
    ['csv_kind', csvKind],
    ['historical_dataset_label', item.label || ''],
    ['historical_dataset_id', item.data_key || item.id || ''],
    ['historical_dataset_date_label', item.date_label || ''],
    ['historical_dataset_original_heading', item.original_heading || ''],
    ['historical_dataset_status', item.status || ''],
    ['historical_dataset_connection',connectionText],
    ['historical_source_pages', sourcePages],
    ['historical_narrative_source_pages', narrativeSourcePages.join('–')],
    ['historical_source_page_note', item.source_page_note_ja || (narrativeSourcePages.length ? `原表行 p.${sourcePages} / 関連叙述 p.${narrativeSourcePages.join('–')}` : `原表行 p.${sourcePages}`)],
    ['historical_source_doi','10.1098/rstl.1798.0022'],
    ['historical_data_schema_version', IMPORTED_HISTORICAL_DATA.schema_version || '1.2.0'],
    ['historical_replay_duration_s', profile ? String(profile.playback_duration_s) : String(OBSERVATION_END_TIME)],
    ['historical_clock_start', temporary?'':(profile ? profile.historical_start_hms || '' : '')],
    ['historical_clock_end', temporary?'':(profile ? profile.historical_end_hms || '' : '')],
    ['preview_axis_basis',auditPending?'withheld_pending_column_reaudit':(temporary?'temporary_structure_preview_not_formal_clock_axis':'formal_experiment_time_axis')],
    ['historical_anchor_count', String(anchors.length)],
    ['historical_direct_value_count', String(directValueCount)],
    ['historical_table_derived_value_count', String(derivedValueCount)],
    ['historical_direct_clock_count', String(directClockCount)],
    ['historical_reconstructed_time_count', String(reconstructedTimeCount)],
    ['untimed_extreme_count', String(untimedExtremeCount)],
    ['pseudo_time_count','0'],
    ['value_policy','原表に印刷された数値をhistorical_direct_value、原表内の数値から機械的に得た値をhistorical_table_derived_valueとして区分'],
    ['time_policy',timePolicy],
    ['interpolation_policy',interpolationPolicy],
    ['blank_policy','原表空欄・missedは推測値で埋めない'],
    ['unit_policy','Read値はdiv、時間は秒またはHH:MM:SS、数値小数点はperiodを使用'],
    ['metadata_format','leading_metadata_block'],
    ['data_section_marker','__data_section'],
    ['data_header_position','next row after __data_section'],
    ['data_columns', dataColumns.join(' / ')],
    ['__data_section', csvKind]
  ];
}

function appendCsvRows(lines, rows){
  rows.forEach(row => lines.push(row.map(quoteCsvCell).join(',')));
}
function buildHistoricalRecordCsv(exportContext = null){
  const context=exportContext||createCsvExportContext('historical_reading_records');
  const lines = [];
  appendCsvRows(lines, buildCsvMetadataRows('historical_reading_records', HISTORICAL_CSV_COLUMNS, context));
  lines.push(HISTORICAL_CSV_COLUMNS.map(quoteCsvCell).join(','));
  readingRecords.forEach(record => {
    lines.push(HISTORICAL_CSV_COLUMNS.map(col => quoteCsvCell(record[col])).join(','));
  });
  return '\ufeff' + lines.join('\r\n') + '\r\n';
}
function createHistoricalCsvPackage(generatedAt = new Date()){
  const context=createCsvExportContext('historical_reading_records',generatedAt);
  return Object.freeze({kind:'historical',csv:buildHistoricalRecordCsv(context),filename:context.filename,context});
}

function downloadCsvText(csv, filename){
  const safeFilename=String(filename||'cavendish.csv').toLowerCase().endsWith('.csv')?String(filename):`${filename}.csv`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = safeFilename;
  a.style.display='none';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(()=>URL.revokeObjectURL(url),1000);
}


function showOutputStatusMessage(message){
  // CV072N: strict no-popup policy. Use an inline status message instead of browser modal dialogs.
  if (!outputStatusMessage) {
    console.warn(message);
    return;
  }
  outputStatusMessage.textContent = message;
  outputStatusMessage.hidden = false;
  outputStatusMessage.classList.add('is-visible');
  window.clearTimeout(showOutputStatusMessage._timer);
  showOutputStatusMessage._timer = window.setTimeout(() => {
    outputStatusMessage.hidden = true;
    outputStatusMessage.classList.remove('is-visible');
  }, 4200);
}

function hideOutputStatusMessage(){
  if (!outputStatusMessage) return;
  outputStatusMessage.hidden = true;
  outputStatusMessage.classList.remove('is-visible');
  outputStatusMessage.textContent = '';
}

let inlineCsvPreviewState = {
  csv: '',
  filename: 'cavendish.csv',
  kind: '',
  context: null
};

function csvPreviewInfo(kind){
  const isAnalysis = kind === 'analysis';
  return {
    isAnalysis,
    title: isAnalysis ? '再構成詳細CSVプレビュー' : '史実読取記録CSVプレビュー',
    note: isAnalysis
      ? '史実点、時刻未記載極値、振動中央時刻、条件付き再構成値、同一資料内残差を区分して記録します。UTF-8 BOM・CRLF・全セル引用で保存します。角度・力・Gは含みません。'
      : 'Experiment別の史実読取記録です。史実直接時刻、再構成時刻、時刻未記載、原表計算値を区分し、出典ページと原表行IDを保持します。UTF-8 BOM・CRLF・全セル引用で保存します。'
  };
}

function renderInlineCsvPreview(kind, csvPackage){
  const panel = document.getElementById('inlineCsvPreview');
  const titleEl = document.getElementById('inlineCsvTitle');
  const metaEl = document.getElementById('inlineCsvMeta');
  const noteEl = document.getElementById('inlineCsvNote');
  const preEl = document.getElementById('inlineCsvPre');
  if (!panel || !preEl) {
    console.warn('Inline CSV preview DOM is missing.');
    return false;
  }
  const info = csvPreviewInfo(kind);
  const pack=csvPackage&&typeof csvPackage==='object'?csvPackage:{csv:String(csvPackage||''),filename:'cavendish.csv',context:null};
  inlineCsvPreviewState = { csv: pack.csv || '', filename:pack.filename||'cavendish.csv', kind, context:pack.context||null };
  if (titleEl) titleEl.textContent = 'IMPULSE LABO ｜ ' + info.title;
  if (metaEl) {
    const context=pack.context||{};
    const generated=context.generatedLabel||formatJstTimestamp();
    const recordId=context.csvRecordId||'';
    metaEl.innerHTML = `CSVプレビュー Ver0.79 / Build ${APP_BUILD}<br>${generated}${recordId?`<br>${recordId}`:''}`;
  }
  if (noteEl) noteEl.textContent = info.note;
  preEl.textContent = String(pack.csv || '').replace(/^\ufeff/, '');
  document.body.classList.add('csv-preview-active');
  panel.setAttribute('aria-hidden','false');
  window.scrollTo({ top: 0, behavior: 'auto' });
  return true;
}

function hideInlineCsvPreview(){
  const panel = document.getElementById('inlineCsvPreview');
  document.body.classList.remove('csv-preview-active');
  if (panel) panel.setAttribute('aria-hidden','true');
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function saveInlineCsvPreview(){
  if (!inlineCsvPreviewState.csv) return;
  downloadCsvText(inlineCsvPreviewState.csv, inlineCsvPreviewState.filename || 'cavendish.csv');
}

function showInlineCsvPreview(kind){
  if (!readingRecords.length) {
    showOutputStatusMessage(kind === 'analysis' ? '史実読取記録がありません。再構成詳細CSVは観測完了後に作成します。' : '史実読取記録がありません。観測開始後に確認してください。');
    return;
  }
  const pack = kind === 'analysis' ? createAnalysisCsvPackage() : createHistoricalCsvPackage();
  renderInlineCsvPreview(kind, pack);
}

window.showInlineCsvPreview = showInlineCsvPreview;

function exportHistoricalRecordCsv(){
  if (!readingRecords.length) {
    showOutputStatusMessage('史実読取記録がありません。観測開始後に出力してください。');
    return;
  }
  const pack=createHistoricalCsvPackage();
  downloadCsvText(pack.csv, pack.filename);
}


// CV043: Export Analysis Derived Data CSV from frozen historical reading records.
// This CSV is not the historical raw record. It contains calculated/support values only.
// Historical records remain unchanged and are linked by source_record_id.
const ANALYSIS_CSV_COLUMNS = [
  'record_type','record_id','source_record_id','segment_id','sample_index','axis_kind','line_kind',
  'historical_time_hms','historical_time_claim','replay_elapsed_s','phase_group','phase_order',
  'large_mass_position','value_kind','source_read_div','reconstruction_read_div',
  'sensitivity_min_div','sensitivity_max_div','sensitivity_is_confidence_interval','source_page','source_row_id','time_basis',
  'source_constraint_start','source_constraint_end','equation','half_cycle_seconds','full_period_seconds',
  'zeta','equilibrium_div','correction_rms','middle_start_hms','middle_end_hms','middle_start_div','middle_end_div',
  'beta_per_s','amplitude_div','expected_extreme_row_id','expected_extreme_div','predicted_extreme_div',
  'direct_clock_check_count','max_direct_clock_residual_div','rms_direct_clock_residual_div','residual_div','absolute_residual_div','residual_resolution_units',
  'residual_class','validation_status','validation_label','constraint_role','reconstruction_note'
];
function blankAnalysisRow(){return Object.fromEntries(ANALYSIS_CSV_COLUMNS.map(column=>[column,'']));}
function historicalAnalysisRows(analysisSessionId){
  return readingRecords.map((record,index)=>{
    const orderOnly=isOrderConstraintTimeBasis(record.time_basis);
    const tableCalculation=isHistoricalTableCalculationNoInstant(record.time_basis);
    const reconstructedTime=isReconstructedTimeBasis(record.time_basis)&&!orderOnly&&!tableCalculation;
    const clockClaim=hasHistoricalClockClaim(record)&&!isReconstructedTimeBasis(record.time_basis);
    return Object.assign(blankAnalysisRow(),{
      record_type:orderOnly?'untimed_historical_extreme':(tableCalculation?'historical_table_calculation':(reconstructedTime?'historical_value_reconstructed_time':'historical_direct_observation')),
      record_id:`${analysisSessionId}-H-${String(index+1).padStart(3,'0')}`,
      source_record_id:record.record_id,
      axis_kind:orderOnly?'record_order':(tableCalculation?'table_calculation':'historical_clock'),
      line_kind:tableCalculation?'none':'marker',
      historical_time_hms:(clockClaim||reconstructedTime)?(record.historical_time_hms||''):'',
      historical_time_claim:clockClaim?'true':'false',
      replay_elapsed_s:record.elapsed_time_s!==null&&record.elapsed_time_s!==undefined&&record.elapsed_time_s!==''&&Number.isFinite(Number(record.elapsed_time_s))?Number(record.elapsed_time_s).toFixed(3):'',
      phase_group:record.phase_group||'',
      phase_order:record.phase_order!==null&&record.phase_order!==undefined&&record.phase_order!==''&&Number.isFinite(Number(record.phase_order))?String(record.phase_order):'',
      large_mass_position:record.large_mass_position||'',
      value_kind:record.value_kind||'',
      source_read_div:record.read_div||'',
      source_page:record.source_page||'',
      source_row_id:record.source_row_id||'',
      time_basis:record.time_basis||'',
      reconstruction_note:orderOnly
        ? '史実極値。値と記録順だけを保持し、絶対時刻・モデル時刻・等間隔を付与しない。'
        :(tableCalculation
          ? '原表Point of rest欄の計算値。行の時計時刻を瞬間観測時刻としては主張しない。'
          :(reconstructedTime
            ? '値は原表の史実極値。表示時刻は原表の振動中央時刻を位相拘束として再構成したもので、史実直接時計値ではない。'
            :'史実直接観測。原表に値と時計時刻が同じ行で併記されている。'))
    });
  });
}
function reconstructionSampleRows(profile,analysisSessionId){
  if(!profile||!Array.isArray(profile.reconstruction_samples))return [];
  return profile.reconstruction_samples.map((sample,index)=>Object.assign(blankAnalysisRow(),{
    record_type:'reconstruction_sample',
    record_id:sample.sample_id||`${analysisSessionId}-S-${String(index+1).padStart(5,'0')}`,
    segment_id:sample.segment_id||'',
    sample_index:String(sample.sample_index),
    axis_kind:sample.axis_kind||'historical_clock',
    line_kind:sample.line_kind||'reconstruction_dashed',
    historical_time_hms:sample.historical_time_hms||'',
    historical_time_claim:'false',
    replay_elapsed_s:Number(sample.playback_time_s).toFixed(3),
    reconstruction_read_div:Number(sample.read_value).toFixed(6),
    sensitivity_min_div:Number(sample.sensitivity_min).toFixed(6),
    sensitivity_max_div:Number(sample.sensitivity_max).toFixed(6),
    sensitivity_is_confidence_interval:'false',
    source_constraint_start:sample.source_constraint_start||'',
    source_constraint_end:sample.source_constraint_end||'',
    equation:sample.equation||'',
    half_cycle_seconds:String(sample.half_cycle_seconds||''),
    full_period_seconds:String(sample.full_period_seconds||''),
    zeta:Number(sample.zeta).toFixed(9),
    equilibrium_div:Number(sample.equilibrium).toFixed(6),
    correction_rms:Number(sample.correction_rms).toExponential(9),
    middle_start_hms:sample.middle_start_hms||'',
    middle_end_hms:sample.middle_end_hms||'',
    middle_start_div:Number.isFinite(Number(sample.middle_start_value))?Number(sample.middle_start_value).toFixed(6):'',
    middle_end_div:Number.isFinite(Number(sample.middle_end_value))?Number(sample.middle_end_value).toFixed(6):'',
    beta_per_s:Number.isFinite(Number(sample.beta))?Number(sample.beta).toExponential(12):'',
    amplitude_div:Number.isFinite(Number(sample.amplitude))?Number(sample.amplitude).toFixed(9):'',
    expected_extreme_row_id:sample.expected_extreme_row_id||'',
    expected_extreme_div:Number.isFinite(Number(sample.expected_extreme_value))?Number(sample.expected_extreme_value).toFixed(6):'',
    predicted_extreme_div:Number.isFinite(Number(sample.predicted_extreme_value))?Number(sample.predicted_extreme_value).toFixed(6):'',
    residual_div:Number.isFinite(Number(sample.residual))?Number(sample.residual).toFixed(6):'',
    absolute_residual_div:Number.isFinite(Number(sample.absolute_residual))?Number(sample.absolute_residual).toFixed(6):'',
    residual_resolution_units:Number.isFinite(Number(sample.residual_in_resolution_units))?Number(sample.residual_in_resolution_units).toFixed(3):'',
    direct_clock_check_count:String(sample.direct_clock_check_count||''),
    max_direct_clock_residual_div:Number.isFinite(Number(sample.max_direct_clock_residual))?Number(sample.max_direct_clock_residual).toFixed(9):'',
    rms_direct_clock_residual_div:Number.isFinite(Number(sample.rms_direct_clock_residual))?Number(sample.rms_direct_clock_residual).toFixed(9):'',
    residual_class:sample.residual_class||'',
    validation_status:sample.validation_status||'',
    validation_label:sample.validation_label_ja||'',
    constraint_role:'middle_vibration_phase_and_untimed_extreme_amplitude',
    reconstruction_note:'原表のmiddle-vibration時刻を位相境界、時刻未記載極値を振幅拘束として生成した条件付きモデル値。中央線m(t)の区間内線形変化と全区間共通βは仮定であり、史実観測値・一意な物理解ではない。上下限はβの決定論的感度で、不確かさ・確率・信頼区間ではない。極値時刻は生成しない。'
  }));
}
function reconstructionSegmentRows(profile,analysisSessionId){
  if(!profile||!profile.physical_model||!profile.physical_model.clock_axis)return [];
  return profile.physical_model.clock_axis.segments.map((segment,index)=>Object.assign(blankAnalysisRow(),{
    record_type:'reconstruction_segment_summary',
    record_id:`${analysisSessionId}-SEG-${String(index+1).padStart(2,'0')}`,
    segment_id:(profile.wave_segments.find(item=>item.model_segment_id===segment.segment_id)||{}).segment_id||segment.segment_id,
    axis_kind:'historical_clock',
    line_kind:'reconstruction_dashed',
    historical_time_claim:'false',
    source_constraint_start:segment.start.id,
    source_constraint_end:segment.end.id,
    equation:segment.equation,
    half_cycle_seconds:String(segment.half_cycle_seconds),
    full_period_seconds:String(segment.full_period_seconds),
    zeta:Number(segment.zeta).toFixed(9),
    equilibrium_div:Number(segment.equilibrium).toFixed(6),
    correction_rms:'0.000000000e+0',
    middle_start_hms:HISTORICAL_REPLAY.formatTime(segment.core_t0),
    middle_end_hms:HISTORICAL_REPLAY.formatTime(segment.core_t1),
    middle_start_div:Number(segment.middle_start).toFixed(6),
    middle_end_div:Number(segment.middle_end).toFixed(6),
    beta_per_s:Number(segment.beta).toExponential(12),
    amplitude_div:Number(segment.amplitude).toFixed(9),
    expected_extreme_row_id:segment.extreme_constraint.source_row_id||'',
    expected_extreme_div:Number(segment.extreme_constraint.expected_value).toFixed(6),
    predicted_extreme_div:Number(segment.extreme_constraint.predicted_value).toFixed(6),
    direct_clock_check_count:String(segment.validation.check_count),
    max_direct_clock_residual_div:Number(segment.validation.max_absolute_residual).toFixed(9),
    rms_direct_clock_residual_div:Number(segment.validation.rms_residual).toFixed(9),
    residual_div:Number(segment.validation.max_absolute_residual).toFixed(9),
    absolute_residual_div:Number(segment.validation.max_absolute_residual).toFixed(9),
    residual_resolution_units:Number(segment.validation.max_absolute_residual/segment.validation.source_resolution_div).toFixed(3),
    residual_class:segment.validation.validation_status==='consistent'?'within_source_resolution':segment.validation.validation_status==='caution'?'moderate_deviation':'large_deviation',
    validation_status:segment.validation.validation_status,
    validation_label:segment.validation.validation_label_ja,
    sensitivity_is_confidence_interval:'false',
    constraint_role:'extreme_amplitude_constraint_no_time_claim',
    reconstruction_note:'middle-vibration時刻間隔を区間位相間隔として使用。時刻未記載極値は振幅拘束であり独立残差試験ではない。判定は同じ原表の直接clock/division読取との差を0.1 divと比較する非統計的な一致確認で、物理妥当性や一意性を示さない。'
  }));
}
function directClockClosureRows(profile,analysisSessionId){
  if(!profile||!profile.physical_model||!profile.physical_model.clock_axis)return [];
  return profile.physical_model.clock_axis.segments.flatMap((segment,segmentIndex)=>segment.direct_clock_checks.map((check,checkIndex)=>Object.assign(blankAnalysisRow(),{
    record_type:'direct_clock_closure_check',
    record_id:`${analysisSessionId}-CHK-${String(segmentIndex+1).padStart(2,'0')}-${String(checkIndex+1).padStart(2,'0')}`,
    source_record_id:check.row_id||'',
    segment_id:segment.segment_id,
    sample_index:String(checkIndex),
    axis_kind:'historical_clock',
    line_kind:'validation_point',
    historical_time_hms:check.historical_time_hms||'',
    historical_time_claim:'true',
    source_read_div:Number(check.observed_value).toFixed(6),
    reconstruction_read_div:Number(check.predicted_value).toFixed(6),
    source_row_id:check.row_id||'',
    time_basis:'historical_direct_time',
    equation:segment.equation,
    half_cycle_seconds:String(segment.half_cycle_seconds),
    full_period_seconds:String(segment.full_period_seconds),
    zeta:Number(segment.zeta).toFixed(9),
    beta_per_s:Number(segment.beta).toExponential(12),
    amplitude_div:Number(segment.amplitude).toFixed(9),
    residual_div:Number(check.residual).toFixed(9),
    absolute_residual_div:Number(check.absolute_residual).toFixed(9),
    residual_resolution_units:Number(check.residual_in_resolution_units).toFixed(3),
    residual_class:check.residual_class,
    validation_status:check.validation_status,
    validation_label:check.validation_label_ja,
    constraint_role:'direct_clock_pair_closure_check_nonstatistical',
    reconstruction_note:'原表に時計時刻とdivisionが併記された直接読取に対する補完モデルの一致確認。独立検証・統計検定・物理妥当性判定ではない。'
  })));
}

function crossingTimeMiddleMarkerRows(profile,analysisSessionId){
  if(!profile||!profile.crossing_time_reconstruction||!Array.isArray(profile.middle_phase_markers))return [];
  return profile.middle_phase_markers.map((item,index)=>Object.assign(blankAnalysisRow(),{
    record_type:'printed_middle_vibration_phase_marker',
    record_id:`${analysisSessionId}-MID-${String(index+1).padStart(3,'0')}`,
    source_record_id:item.row_id||'',
    sample_index:String(index),
    axis_kind:'historical_clock',
    line_kind:'phase_constraint_marker',
    historical_time_hms:item.historical_time_hms||'',
    historical_time_claim:'true',
    phase_order:Number.isFinite(Number(item.phase))?String(item.phase):'',
    source_row_id:item.row_id||'',
    time_basis:'historical_printed_middle_vibration_time',
    constraint_role:'half_cycle_middle_phase_time_constraint',
    reconstruction_note:'原表に印字された振動中央時刻。極値時刻ではなく、隣接する史実極値間の中央位相を拘束する時計値。'
  }));
}
function crossingTimeSegmentRows(profile,analysisSessionId){
  if(!profile||!profile.crossing_time_reconstruction||!Array.isArray(profile.reconstruction_segments))return [];
  return profile.reconstruction_segments.map((segment,index)=>Object.assign(blankAnalysisRow(),{
    record_type:'crossing_time_reconstruction_segment',
    record_id:`${analysisSessionId}-CTS-${String(index+1).padStart(3,'0')}`,
    segment_id:segment.segment_id||'',
    axis_kind:'historical_clock',
    line_kind:segment.line_kind||'crossing_time_reconstruction',
    historical_time_hms:`${HISTORICAL_REPLAY.formatTime(segment.model_start_abs_s)}–${HISTORICAL_REPLAY.formatTime(segment.model_end_abs_s)}`,
    historical_time_claim:'false',
    source_constraint_start:segment.left_row_id||'',
    source_constraint_end:segment.right_row_id||'',
    equation:segment.equation||'',
    half_cycle_seconds:String(profile.half_cycle_seconds||''),
    middle_start_hms:Number.isFinite(Number(segment.middle_marker_abs_s))?HISTORICAL_REPLAY.formatTime(segment.middle_marker_abs_s):'',
    constraint_role:segment.middle_marker_id?'printed_middle_vibration_exact_phase_constraint':'interpolated_half_cycle_phase_constraint',
    reconstruction_note:'両端の値は原表の史実極値。時計位置は振動中央時刻から再構成し、原表直接時刻としては扱わない。欠測行・配置変更不確定区間をまたぐ接続は生成しない。'
  }));
}
function crossingTimeClosureRows(profile,analysisSessionId){
  if(!profile||!profile.crossing_time_reconstruction||!Array.isArray(profile.crossing_closure_checks))return [];
  return profile.crossing_closure_checks.map((check,index)=>{
    const residual=Number(check.residual);
    const absolute=Number(check.absolute_residual);
    return Object.assign(blankAnalysisRow(),{
      record_type:'division_crossing_internal_closure_check',
      record_id:`${analysisSessionId}-CTC-${String(index+1).padStart(3,'0')}`,
      source_record_id:check.row_id||'',
      sample_index:String(check.source_ordinal??index),
      axis_kind:'historical_clock',
      line_kind:'validation_point',
      historical_time_hms:check.historical_time_hms||'',
      historical_time_claim:'true',
      source_read_div:Number.isFinite(Number(check.observed_value))?Number(check.observed_value).toFixed(6):'',
      reconstruction_read_div:Number.isFinite(Number(check.predicted_value))?Number(check.predicted_value).toFixed(6):'',
      source_row_id:check.row_id||'',
      time_basis:'historical_direct_time',
      residual_div:Number.isFinite(residual)?residual.toFixed(9):'',
      absolute_residual_div:Number.isFinite(absolute)?absolute.toFixed(9):'',
      constraint_role:'same_source_division_crossing_internal_check',
      reconstruction_note:'原表の目盛通過時刻・通過値に対する同一資料内の整合確認。独立検証、統計検定、史実極値時刻の主張ではない。'
    });
  });
}
function crossingTimeGapRows(profile,analysisSessionId){
  if(!profile||!profile.crossing_time_reconstruction)return [];
  const rows=[];
  (profile.missed_observation_ranges||[]).forEach((gap,index)=>rows.push(Object.assign(blankAnalysisRow(),{
    record_type:'historical_missed_extreme_gap',
    record_id:`${analysisSessionId}-MISS-${String(index+1).padStart(2,'0')}`,
    source_record_id:gap.row_id||'',
    axis_kind:'historical_clock',
    line_kind:'blank_gap',
    historical_time_hms:`${gap.start_hms||''}–${gap.end_hms||''}`,
    historical_time_claim:'false',
    source_constraint_start:gap.before_row_id||'',
    source_constraint_end:gap.after_row_id||'',
    constraint_role:'missed_observation_no_interpolation',
    reconstruction_note:'原表のmissed行に対応する欠測帯。前後の波形は接続せず、空白として保持する。'
  })));
  (profile.transition_uncertainty_ranges||[]).forEach((range,index)=>rows.push(Object.assign(blankAnalysisRow(),{
    record_type:'mass_position_transition_uncertainty',
    record_id:`${analysisSessionId}-MOVE-${String(index+1).padStart(2,'0')}`,
    axis_kind:'historical_clock',
    line_kind:'blank_gap',
    historical_time_hms:`${range.start_hms||''}–${range.end_hms||''}`,
    historical_time_claim:'true',
    constraint_role:'bounded_transition_time_uncertainty',
    reconstruction_note:'配置変更はこの時計範囲内に限定できるが、変更瞬間は原表から確定できないため波形を描かない。'
  })));
  return rows;
}

function unresolvedIntervalRows(profile,analysisSessionId){
  if(!profile||!Array.isArray(profile.unresolved_intervals))return [];
  return profile.unresolved_intervals.map((interval,index)=>Object.assign(blankAnalysisRow(),{
    record_type:'unresolved_interval',
    record_id:`${analysisSessionId}-GAP-${String(index+1).padStart(2,'0')}`,
    axis_kind:'historical_clock',
    line_kind:'blank_gap',
    historical_time_hms:`${HISTORICAL_REPLAY.formatTime(interval.start_abs_s)}–${HISTORICAL_REPLAY.formatTime(interval.end_abs_s)}`,
    historical_time_claim:'true',
    reconstruction_note:interval.reason||'未観測・再構成禁止区間'
  }));
}
function getAnalysisCsvKind(profile){
  if(profile&&profile.crossing_time_reconstruction) return 'crossing_time_reconstruction_audit_records';
  if(isDirectClockObservationProfile(profile)) return 'direct_clock_observation_audit_records';
  return 'experiment_i_reconstruction_audit_records';
}
function buildAnalysisDerivedCsv(exportContext = null){
  const profile=getActiveReplayProfile();
  const crossingTimeProfile=Boolean(profile&&profile.crossing_time_reconstruction);
  const directClockProfile=isDirectClockObservationProfile(profile);
  const csvKind=getAnalysisCsvKind(profile);
  const context=exportContext||createCsvExportContext(csvKind);
  const analysisSessionId=context.csvRecordId.replace(/^CAV-CSV-RECON-/,'CAV-RECON-');
  let rows;
  let metadata;
  if(crossingTimeProfile){
    rows=[...historicalAnalysisRows(analysisSessionId),...crossingTimeMiddleMarkerRows(profile,analysisSessionId),...crossingTimeSegmentRows(profile,analysisSessionId),...crossingTimeClosureRows(profile,analysisSessionId),...crossingTimeGapRows(profile,analysisSessionId)];
    metadata=[
      ['reconstruction_segment_count',String(profile&&profile.reconstruction_segments?profile.reconstruction_segments.length:0)],
      ['printed_middle_vibration_marker_count',String(profile&&profile.middle_phase_markers?profile.middle_phase_markers.length:0)],
      ['direct_division_crossing_count',String(profile&&profile.direct_crossing_events?profile.direct_crossing_events.length:0)],
      ['division_crossing_internal_check_count',String(profile&&profile.crossing_closure_checks?profile.crossing_closure_checks.length:0)],
      ['missed_observation_gap_count',String(profile&&profile.missed_observation_ranges?profile.missed_observation_ranges.length:0)],
      ['transition_uncertainty_range_count',String(profile&&profile.transition_uncertainty_ranges?profile.transition_uncertainty_ranges.length:0)],
      ['time_semantics','division_crossing_clock_is_historical;extreme_clock_is_reconstructed_from_middle_vibration_phase'],
      ['curve_constraint','recorded_extreme_values_and_printed_middle_vibration_times'],
      ['connection_policy','no_connection_across_missed_row_transition_uncertainty_or_clock_bounds'],
      ['validation_interpretation','same_source_internal_closure_only_not_independent_validation']
    ];
  }else if(directClockProfile){
    rows=[...historicalAnalysisRows(analysisSessionId)];
    metadata=[
      ['direct_clock_anchor_count',String(profile&&profile.anchors?profile.anchors.filter(anchor=>anchor.time_basis==='historical_direct_time').length:0)],
      ['table_calculation_no_instant_count',String(profile&&profile.anchors?profile.anchors.filter(anchor=>anchor.time_basis==='historical_table_calculation_no_instant').length:0)],
      ['missed_observation_gap_count',String(profile&&profile.missed_observation_ranges?profile.missed_observation_ranges.length:0)],
      ['transition_uncertainty_range_count',String(profile&&profile.transition_uncertainty_ranges?profile.transition_uncertainty_ranges.length:0)],
      ['time_semantics','printed_row_time_belongs_to_direct_value_in_same_row;point_of_rest_has_no_instant_clock_claim'],
      ['curve_constraint','consecutive_direct_clock_values_within_confirmed_position_section'],
      ['connection_policy','no_connection_across_missed_row_or_transition_uncertainty'],
      ['validation_interpretation','historical_source_provenance_only_no_reconstruction_residual_model']
    ];
  }else{
    rows=[...historicalAnalysisRows(analysisSessionId),...reconstructionSegmentRows(profile,analysisSessionId),...directClockClosureRows(profile,analysisSessionId),...reconstructionSampleRows(profile,analysisSessionId),...unresolvedIntervalRows(profile,analysisSessionId)];
    metadata=[
      ['reconstruction_sample_count',String(profile&&profile.reconstruction_samples?profile.reconstruction_samples.length:0)],
      ['clock_axis_model_segment_count',String(profile&&profile.physical_model&&profile.physical_model.diagnostics?profile.physical_model.diagnostics.clock_segment_count:0)],
      ['direct_clock_closure_check_count',String(profile&&profile.residual_validation?profile.residual_validation.direct_clock_check_count:0)],
      ['middle_vibration_phase_marker_count',String(profile&&profile.physical_model&&profile.physical_model.middle_phase_markers?profile.physical_model.middle_phase_markers.length:0)],
      ['extreme_constraint_time_claim_count',String(profile&&profile.residual_validation?profile.residual_validation.extreme_time_claim_count:0)],
      ['residual_comparison','direct_clock_pair_closure_nonstatistical'],
      ['residual_source_resolution_div',String(profile&&profile.residual_policy?profile.residual_policy.source_resolution_div:'')],
      ['residual_caution_threshold_div',String(profile&&profile.residual_policy?profile.residual_policy.caution_threshold_div:'')],
      ['residual_max_abs_div',String(profile&&profile.residual_validation?profile.residual_validation.max_direct_clock_closure_residual:'')],
      ['residual_rms_div',String(profile&&profile.residual_validation?profile.residual_validation.rms_direct_clock_closure_residual:'')],
      ['residual_overall_status',String(profile&&profile.residual_validation?profile.residual_validation.overall_validation_status:'')],
      ['residual_interpretation','same_source_internal_closure_only_not_independent_validation'],
      ['model_fix_scope','historical_reconstruction_separation;pseudo_time_removal;clock_axis_display;same_source_numeric_closure'],
      ['model_unresolved_scope','linear_middle_line_physical_cause;model_uniqueness;statistical_uncertainty'],
      ['sensitivity_interpretation','beta_parameter_sensitivity_only_not_uncertainty_or_confidence_interval'],
      ['untimed_extreme_pseudo_time_count','0']
    ];
  }
  const lines=[];
  appendCsvRows(lines,buildCsvMetadataRows(csvKind,ANALYSIS_CSV_COLUMNS,context));
  lines.splice(lines.length-1,0,...metadata.map(row=>row.map(quoteCsvCell).join(',')));
  lines.push(ANALYSIS_CSV_COLUMNS.map(quoteCsvCell).join(','));
  rows.forEach(row=>lines.push(ANALYSIS_CSV_COLUMNS.map(column=>quoteCsvCell(row[column])).join(',')));
  return '\ufeff'+lines.join('\r\n')+'\r\n';
}
function createAnalysisCsvPackage(generatedAt = new Date()){
  const profile=getActiveReplayProfile();
  const csvKind=getAnalysisCsvKind(profile);
  const context=createCsvExportContext(csvKind,generatedAt);
  return Object.freeze({kind:'analysis',csv:buildAnalysisDerivedCsv(context),filename:context.filename,context});
}

function exportAnalysisDerivedCsv(){
  if (!readingRecords.length) {
    showOutputStatusMessage('史実読取記録がありません。観測完了後に再構成詳細CSVを出力してください。');
    return;
  }
  const pack=createAnalysisCsvPackage();
  downloadCsvText(pack.csv,pack.filename);
}

window.__CV081A05_CSV__=Object.freeze({
  schemaVersion:CSV_SCHEMA_VERSION,
  historicalColumns:[...HISTORICAL_CSV_COLUMNS],
  analysisColumns:[...ANALYSIS_CSV_COLUMNS],
  createHistoricalCsvPackage,
  createAnalysisCsvPackage,
  buildHistoricalRecordCsv,
  buildAnalysisDerivedCsv,
  createCsvExportContext
});


function resetReadingRecords(){
  readingRecords.length = 0;
  if (readingRecordPanel && 'open' in readingRecordPanel) readingRecordPanel.open = false;
  lastRecordedFlowKey = '';
  lastHistoricalAnchorIndex = -1;
  readingRecordSequence = 0;
  renderReadingRecordsTable();
  updateReadingAverages();
  updateWaveRecordMarkers();
  updateControlButtons();
}


function currentParams(){
  const profile = getActiveReplayProfile();
  return {
    historical: true,
    profile,
    playbackDurationS: getActiveObservationEndTime(),
    periodSeconds: profile ? Number(profile.period_seconds) || null : null,
    scale: profile ? profile.scale : null
  };
}

function dampedOffset(t){
  const profile = getActiveReplayProfile();
  return profile && typeof profile.visualOffsetAt === 'function' ? profile.visualOffsetAt(t) : 0;
}

// CV080A18R Historical Telescope close-coupled, continuously tracked five-part vernier model.
// Cavendish described fixed ivory main scales divided into twentieths of an inch and
// small ivory slips on the moving arm serving as verniers, subdividing each main-scale
// division into five parts. The telescope therefore shows only discrete historical
// direct readings; the continuous waveform value remains a separately labelled reconstruction.
const TELESCOPE_VERNIER_STEPS = 5;
const TELESCOPE_VERNIER_SPAN_MAIN_DIV = 4;
const TELESCOPE_DIRECT_TRIGGER_TOLERANCE_S = 0.035;
const TELESCOPE_EXACT_FIFTH_TOLERANCE_DIV = 0.025;
const TELESCOPE_MIN_WINDOW_DIV = 20;

function formatSignedScaleNumber(value, digits=0){
  const number=Number(value);
  if(!Number.isFinite(number)) return '—';
  if(Math.abs(number)<1e-9) return digits ? Number(0).toFixed(digits) : '0';
  const text=Math.abs(number).toFixed(digits);
  return `${number>0?'+':'-'}${text}`;
}

function telescopeAnchorTrigger(anchor){
  if(!anchor) return null;
  // Telescopeの現在値は、実際に再生軸へ配置された史実直接値だけで更新する。
  // nullをNumber()へ渡すと0になるため、未時刻の直接値が開始時刻へ混入しないよう
  // 値の有無を先に確認し、record_trigger_sへのフォールバックも使用しない。
  const rawPlayback=anchor.playback_time_s;
  if(rawPlayback===null||rawPlayback===undefined||rawPlayback==='') return null;
  const playback=Number(rawPlayback);
  return Number.isFinite(playback)?playback:null;
}

function isHistoricalDirectTelescopeAnchor(anchor){
  return Boolean(anchor&&anchor.value_class==='historical_direct_value'&&Number.isFinite(Number(anchor.value))&&Number.isFinite(telescopeAnchorTrigger(anchor)));
}

function getHistoricalDirectTelescopeAnchors(profile=getActiveReplayProfile()){
  if(!profile||!Array.isArray(profile.anchors)) return [];
  return profile.anchors.filter(isHistoricalDirectTelescopeAnchor).slice().sort((a,b)=>telescopeAnchorTrigger(a)-telescopeAnchorTrigger(b));
}

function getHistoricalDirectTelescopeAnchor(profile=getActiveReplayProfile(), playbackTime=time){
  const anchors=getHistoricalDirectTelescopeAnchors(profile);
  if(!anchors.length) return null;
  const t=Number(playbackTime)||0;
  let selected=null;
  anchors.forEach(anchor=>{
    if(telescopeAnchorTrigger(anchor)<=t+TELESCOPE_DIRECT_TRIGGER_TOLERANCE_S) selected=anchor;
  });
  return selected||anchors[0];
}

function formatHistoricalDirectRead(value){
  const number=Number(value);
  if(!Number.isFinite(number)) return '—';
  const tenth=Math.round(number*10)/10;
  if(Math.abs(number-tenth)<1e-8) return `${tenth.toFixed(1)} div`;
  const hundredth=Math.round(number*100)/100;
  return `${hundredth.toFixed(2)} div`;
}

function decomposeHistoricalVernierRead(reading){
  const raw=Number(reading);
  if(!Number.isFinite(raw)){
    return Object.freeze({defined:false,read_value:null,main_value:0,fraction_value:0,vernier_index:0,exact_fifth:false,estimated:false,match_main_value:0});
  }
  const value=Math.round(raw*1000)/1000;
  let mainValue=Math.floor(value+1e-9);
  let fraction=value-mainValue;
  if(fraction<0){mainValue-=1;fraction=value-mainValue;}
  if(Math.abs(fraction-1)<1e-9){mainValue+=1;fraction=0;}
  const rawNearestIndex=Math.round(fraction*TELESCOPE_VERNIER_STEPS+1e-9);
  const nearNextInteger=rawNearestIndex>=TELESCOPE_VERNIER_STEPS;
  const nextIntegerExact=nearNextInteger&&Math.abs(fraction-1)<=TELESCOPE_EXACT_FIFTH_TOLERANCE_DIV;
  if(nextIntegerExact){
    mainValue+=1;
    fraction=0;
  }
  const nearestIndex=nextIntegerExact?0:Math.max(0,Math.min(TELESCOPE_VERNIER_STEPS-1,rawNearestIndex));
  const exactFraction=nearestIndex/TELESCOPE_VERNIER_STEPS;
  const exactFifth=nextIntegerExact||(!nearNextInteger&&Math.abs(fraction-exactFraction)<=TELESCOPE_EXACT_FIFTH_TOLERANCE_DIV);
  return Object.freeze({
    defined:true,
    read_value:value,
    main_value:mainValue,
    fraction_value:fraction,
    vernier_index:nearestIndex,
    vernier_value:exactFraction,
    exact_fifth:exactFifth,
    estimated:!exactFifth,
    estimated_upper_wrap:nearNextInteger&&!nextIntegerExact,
    match_main_value:mainValue+nearestIndex,
    source_resolution_div:0.2
  });
}

function formatHistoricalVernier(parts){
  if(!parts||!parts.defined) return '—';
  if(parts.exact_fifth) return `${parts.vernier_index}/5（${parts.vernier_value.toFixed(1)} div）`;
  if(parts.estimated_upper_wrap) return '目測 4/5–次の0/5';
  const lower=Math.max(0,Math.floor(parts.fraction_value*5));
  const upper=Math.min(4,lower+1);
  return `目測 ${lower}/5–${upper}/5`;
}

function formatReconstructedTelescopeValue(frame){
  const value=frame&&frame.wave_defined!==false?Number(frame.read_value):NaN;
  return Number.isFinite(value)?formatObservedReadDisplay(value):'—';
}

function formatTelescopeDecomposition(parts, frame){
  const direct=parts&&parts.defined?formatHistoricalDirectRead(parts.read_value):'—';
  const vernierText=parts&&parts.defined?formatHistoricalVernier(parts):'—';
  return `史実直接 ${direct} / 史実副尺 ${vernierText} / 再構成 ${formatReconstructedTelescopeValue(frame)}`;
}

let telescopeScaleGeometry=null;
let telescopeScaleProfileKey='';
let telescopeLastScaleReading=null;
let telescopeLastDirectReading=null;

function getTelescopeProfileKey(profile){
  return String(profile&&profile.data_key||profile&&profile.experiment_id||'unknown');
}

function buildHistoricalMainScaleGeometry(profile=getActiveReplayProfile()){
  const scale=profile&&profile.scale?profile.scale:{};
  const anchors=getHistoricalDirectTelescopeAnchors(profile);
  const values=anchors.map(anchor=>Number(anchor.value)).filter(Number.isFinite);
  const minValue=Number.isFinite(Number(scale.min))?Number(scale.min):(values.length?Math.min(...values):0);
  const maxValue=Number.isFinite(Number(scale.max))?Number(scale.max):(values.length?Math.max(...values):20);
  let start=Math.floor((minValue-3)/5)*5;
  let end=Math.ceil((maxValue+TELESCOPE_VERNIER_SPAN_MAIN_DIV+3)/5)*5;
  if(end-start<TELESCOPE_MIN_WINDOW_DIV){
    const center=(start+end)/2;
    start=Math.floor((center-TELESCOPE_MIN_WINDOW_DIV/2)/5)*5;
    end=start+TELESCOPE_MIN_WINDOW_DIV;
  }
  return Object.freeze({start,end,span:end-start});
}

function renderHistoricalMainScale(profile=getActiveReplayProfile()){
  if(!historicalMainTicks||!fixedMainScale) return null;
  const key=getTelescopeProfileKey(profile);
  const geometry=buildHistoricalMainScaleGeometry(profile);
  if(telescopeScaleProfileKey===key&&telescopeScaleGeometry&&telescopeScaleGeometry.start===geometry.start&&telescopeScaleGeometry.end===geometry.end) return telescopeScaleGeometry;
  telescopeScaleProfileKey=key;
  telescopeScaleGeometry=geometry;
  const parts=[];
  for(let value=geometry.start;value<=geometry.end;value+=1){
    const left=((value-geometry.start)/geometry.span)*100;
    const major=value%5===0;
    const showLabel=major&&(value<=0||value%10===0);
    parts.push(`<div class="tick ${major?'major':'minor'}" data-main-value="${value}" style="left:${left.toFixed(4)}%"></div>`);
    if(showLabel) parts.push(`<div class="tick-label${value===0?' zero-label':''}" data-main-label-value="${value}" style="left:${left.toFixed(4)}%">${value>0?'+':''}${value}</div>`);
  }
  historicalMainTicks.innerHTML=parts.join('');
  fixedMainScale.dataset.scaleStart=String(geometry.start);
  fixedMainScale.dataset.scaleEnd=String(geometry.end);
  return geometry;
}

function getTelescopeDevicePixelRatio(){
  const ratio=typeof window!=='undefined'?Number(window.devicePixelRatio):1;
  return Number.isFinite(ratio)&&ratio>0?ratio:1;
}

function snapCssPixelToDevicePixel(value){
  const numeric=Number(value);
  if(!Number.isFinite(numeric)) return 0;
  const ratio=getTelescopeDevicePixelRatio();
  const snapped=Math.round(numeric*ratio)/ratio;
  return Object.is(snapped,-0)?0:snapped;
}

function invalidateTelescopeMainScaleGeometry(){
  telescopeScaleProfileKey='';
  telescopeScaleGeometry=null;
}

function clearTelescopeMatchHighlight(){
  if(fixedMainScale) fixedMainScale.querySelectorAll('.is-read-match').forEach(tick=>tick.classList.remove('is-read-match'));
  if(movingVernierScale) movingVernierScale.querySelectorAll('.is-read-match').forEach(tick=>tick.classList.remove('is-read-match'));
  if(historicalCoincidenceMarker){
    historicalCoincidenceMarker.hidden=true;
    historicalCoincidenceMarker.style.transform='translate3d(0px,0,0)';
  }
}

function shouldShowTelescopeMatchHighlight(state){
  return state==='paused'||state==='stopped'||state==='completed';
}

function updateHistoricalVernierMatchHighlight(parts){
  clearTelescopeMatchHighlight();
  const markerParts=parts&&parts.visual_parts?parts.visual_parts:parts;
  if(!markerParts||!markerParts.defined||!markerParts.exact_fifth||!shouldShowTelescopeMatchHighlight(observationState)) return false;
  const mainTick=fixedMainScale&&fixedMainScale.querySelector(`[data-main-value="${markerParts.match_main_value}"]`);
  const vernierTick=movingVernierScale&&movingVernierScale.querySelector(`[data-vernier-index="${markerParts.vernier_index}"]`);
  [mainTick,vernierTick].filter(Boolean).forEach(tick=>tick.classList.add('is-read-match'));
  if(mainTick&&vernierTick&&historicalCoincidenceMarker){
    const markerX=snapCssPixelToDevicePixel((Number(fixedMainScale.offsetLeft)||0)+(Number(mainTick.offsetLeft)||0));
    historicalCoincidenceMarker.hidden=false;
    historicalCoincidenceMarker.style.transform=`translate3d(${markerX.toFixed(3)}px,0,0)`;
  }
  return Boolean(mainTick&&vernierTick);
}

function applyHistoricalDirectTelescopeScale(anchor, profile=getActiveReplayProfile(), visualReading=null){
  const geometry=renderHistoricalMainScale(profile);
  const directParts=decomposeHistoricalVernierRead(anchor&&anchor.value);
  const visualNumber=Number(visualReading);
  const visualParts=decomposeHistoricalVernierRead(Number.isFinite(visualNumber)?visualNumber:(directParts.defined?directParts.read_value:null));
  telescopeLastDirectReading=directParts.defined?directParts.read_value:null;
  telescopeLastScaleReading=visualParts.defined?visualParts.read_value:null;
  clearTelescopeMatchHighlight();
  if(!movingVernierScale||!fixedMainScale||!geometry||!visualParts.defined){
    if(movingVernierScale) movingVernierScale.style.transform='translate3d(0px,0,0)';
    return Object.freeze({...directParts,visual_parts:visualParts,visual_read_value:visualParts.defined?visualParts.read_value:null});
  }
  const rect=fixedMainScale.getBoundingClientRect();
  const width=Number(rect.width)||Number(fixedMainScale.clientWidth)||0;
  const pitch=width/geometry.span;
  const fixedOrigin=Number(fixedMainScale.offsetLeft)||0;
  const zeroX=fixedOrigin+(visualParts.read_value-geometry.start)*pitch;
  const snappedX=snapCssPixelToDevicePixel(zeroX);
  const vernierWidth=snapCssPixelToDevicePixel(pitch*TELESCOPE_VERNIER_SPAN_MAIN_DIV);
  movingVernierScale.style.width=`${Math.max(1,vernierWidth).toFixed(3)}px`;
  movingVernierScale.style.transform=`translate3d(${snappedX.toFixed(3)}px,0,0)`;
  return Object.freeze({...directParts,visual_parts:visualParts,visual_read_value:visualParts.read_value,translation_px:snappedX,vernier_width_px:vernierWidth,device_pixel_ratio:getTelescopeDevicePixelRatio()});
}

// Compatibility wrapper retained for resize handlers and existing call sites.
function applyTelescopeReadScale(reading){
  const profile=getActiveReplayProfile();
  const directAnchor=Number.isFinite(Number(telescopeLastDirectReading))?{value:Number(telescopeLastDirectReading)}:(Number.isFinite(Number(reading))?{value:Number(reading)}:null);
  return applyHistoricalDirectTelescopeScale(directAnchor,profile,reading);
}

function syncTelescopeMatchHighlight(parts){
  return updateHistoricalVernierMatchHighlight(parts);
}

function refreshTelescopeMatchHighlightForCurrentState(){
  if(isColumnReauditObservationSet()){
    clearTelescopeMatchHighlight();
    return false;
  }
  const profile=getActiveReplayProfile();
  const anchor=getHistoricalDirectTelescopeAnchor(profile,time);
  const frame=getReplayFrame(time);
  const visualReading=frame&&frame.wave_defined!==false&&Number.isFinite(Number(frame.read_value))?Number(frame.read_value):null;
  const parts=applyHistoricalDirectTelescopeScale(anchor,profile,visualReading);
  return syncTelescopeMatchHighlight(parts);
}

function formatTelescopeVernier(parts){
  return formatHistoricalVernier(parts);
}

function isMainClockDisplayAt(profile,playbackTime){
  if(!profile||profile.data_key!=='CAV-1798-EXP-I') return true;
  return (profile.wave_segments||[]).some(segment=>
    segment.main_clock_visible!==false&&
    Number(playbackTime)>=Number(segment.playback_start_s)-0.02&&
    Number(playbackTime)<=Number(segment.playback_end_s)+0.02
  );
}

function clearWithdrawnWaveDisplay(){
  if(waveObservedPath) waveObservedPath.setAttribute('d','');
  if(waveReconstructionPath){waveReconstructionPath.setAttribute('d','');waveReconstructionPath.style.display='none';}
  if(waveReconstructionBand) waveReconstructionBand.setAttribute('d','');
  if(waveRecordMarkers) waveRecordMarkers.innerHTML='';
  if(waveGapBands) waveGapBands.innerHTML='';
  if(waveTimeFoldMarker) waveTimeFoldMarker.innerHTML='';
  if(waveTimeAxisGrid) waveTimeAxisGrid.innerHTML='';
  if(waveTimeAxisLabels) waveTimeAxisLabels.innerHTML='';
  if(waveTimeAxisMarkers) waveTimeAxisMarkers.innerHTML='';
  if(waveTimeMarkerLegend){waveTimeMarkerLegend.hidden=true;waveTimeMarkerLegend.innerHTML='';}
  if(wavePhaseLane){wavePhaseLane.hidden=true;wavePhaseLane.innerHTML='';}
  if(waveTransitionUncertaintyLegend) waveTransitionUncertaintyLegend.hidden=true;
  if(waveMissedObservationLegend) waveMissedObservationLegend.hidden=true;
  [waveCurrentLine,waveEquilibriumLine,waveEquilibriumLineAlt,waveEquilibriumLabel,waveEquilibriumLabelAlt,waveSwitchLine,waveSwitchLabel].forEach(element=>{if(element) element.style.opacity='0';});
  renderWaveResidualAudit(getActiveReplayProfile());
}

function update(){
  const activeProfile=getActiveReplayProfile();
  if(isColumnReauditObservationSet(activeProfile)){
    clearWithdrawnWaveDisplay();
    applyTelescopeReadScale(null);
    if(readValue) readValue.textContent='—';
    if(vernierValue) vernierValue.textContent='表示保留';
    if(summaryOffset) summaryOffset.textContent='表示保留';
    if(summaryRead) summaryRead.textContent='—';
    if(matchValue) matchValue.textContent='—';
    if(weightArm) weightArm.style.transform='translate(-50%,-50%) rotate(0deg)';
    if(thetaReadout) thetaReadout.textContent='読取値 —';
    if(waveIdleMessage) waveIdleMessage.style.display='';
    updateWaveIdleMessage(activeProfile);
    updateMassArrangementDisplay(0);
    renderFlowTimelineState(0,false);
    if(waveMeaningStatus) waveMeaningStatus.textContent='波形：非表示（原表列意味再監査中）';
    return;
  }
  const preludeActive=isMotionViewUntimedPreludeActive(activeProfile);
  const frame = getReplayFrame(time);
  const waveDefined=!preludeActive&&frame.wave_defined!==false&&Number.isFinite(Number(frame.read_value));
  const txt = waveDefined?formatObservedReadDisplay(frame.read_value):'—';
  const clockText = frame.historical_time_hms || '—';
  const directAnchor=getHistoricalDirectTelescopeAnchor(activeProfile,time);
  const telescopeVisualReading=waveDefined?Number(frame.read_value):null;
  const telescopeScale=applyHistoricalDirectTelescopeScale(directAnchor,activeProfile,telescopeVisualReading);
  syncTelescopeMatchHighlight(telescopeScale);
  const motionVisualOffset=waveDefined?(Number(frame.visual_offset_px)||0):0;
  const directText=telescopeScale.defined?formatHistoricalDirectRead(telescopeScale.read_value):'—';
  const vernierText=telescopeScale.defined?formatHistoricalVernier(telescopeScale):'—';
  const reconstructionText=formatReconstructedTelescopeValue(frame);

  if (readValue) readValue.textContent = directText;
  if (vernierValue) vernierValue.textContent = vernierText;
  if (summaryOffset) summaryOffset.textContent = formatTelescopeDecomposition(telescopeScale,frame);
  if (summaryRead) summaryRead.textContent = directText;
  if (matchValue) matchValue.textContent = reconstructionText;
  if (telescopeReadingBadge) telescopeReadingBadge.textContent=waveDefined?'副尺位置：再構成追従':(telescopeScale.estimated?'史実直接読取（副尺間を目測）':'史実直接読取');

  const matchState = reconstructionText;

  const waveX = timeToWaveX(time);
  const waveY = waveDefined?readValueToWaveY(frame.read_value):105;
  const arrangementState = updateMassArrangementDisplay(time);
  updateWaveEquilibriumGuide(time);
  updateObservedWavePath(time);
  const profile=getActiveReplayProfile();
  const inOmittedInterval=getOmittedPlaybackIntervals(profile).some(interval=>time>=interval.start&&time<=interval.end);
  const clockAxisCurrent=observationState!=='idle'&&waveDefined&&isMainClockDisplayAt(profile,time);
  const showCurrentLine=observationState!=='idle'&&(clockAxisCurrent||inOmittedInterval);
  if (waveCurrentLine) {
    waveCurrentLine.setAttribute('x1', waveX.toFixed(1));
    waveCurrentLine.setAttribute('x2', waveX.toFixed(1));
    waveCurrentLine.style.opacity=showCurrentLine?'1':'0';
  }
  if(waveIdleMessage){
    waveIdleMessage.style.display=(observationState==='idle'||preludeActive)?'':'none';
    const idleRect=waveIdleMessage.querySelector('rect');
    if(preludeActive){
      if(idleRect){ idleRect.setAttribute('y','86'); idleRect.setAttribute('height','34'); }
      if(waveIdleTitle){ waveIdleTitle.setAttribute('y','107'); waveIdleTitle.textContent='史実時計軸開始後に波形を表示'; }
      if(waveIdleDetail){ waveIdleDetail.style.display='none'; waveIdleDetail.textContent=''; }
      waveIdleMessage.setAttribute('aria-label','想定補間中。史実時計軸は未開始。時計時刻の記録なし。約2.5秒の表示補間で、史実時間ではありません。');
    }else if(observationState==='idle'){
      if(idleRect){ idleRect.setAttribute('y','78'); idleRect.setAttribute('height','50'); }
      if(waveIdleTitle) waveIdleTitle.setAttribute('y','98');
      if(waveIdleDetail) waveIdleDetail.style.display='';
      updateWaveIdleMessage(profile);
    }
  }
  updateWaveTimeFoldMarker(getActiveReplayProfile());
  updateWavePhaseCurrent(preludeActive?-1:time);
  if (weightArm) {
    const normalized = Math.max(-1, Math.min(1, motionVisualOffset / 42));
    weightArm.style.transform = `translate(-50%,-50%) rotate(${(normalized * 10).toFixed(2)}deg)`;
  }
  if (thetaReadout) thetaReadout.textContent = `読取値 ${txt}`;

  if (debugTheta) debugTheta.textContent = '角度換算未接続';
  if (debugRead) debugRead.textContent = txt;
  if (debugVernier) debugVernier.textContent = formatTelescopeVernier(telescopeScale);
  if (debugMatch) debugMatch.textContent = matchState;
  if (debugCycle) debugCycle.textContent = String(Math.floor(time / 7.5) + 1);
  if (debugTime) debugTime.textContent = preludeActive?'想定補間 / 時計軸未開始':`${time.toFixed(1)} s / ${clockText}`;
  if(stateLabel&&observationState==='running') stateLabel.textContent=preludeActive?'想定補間':'観測中';

  renderFlowTimelineState(time,observationState==='completed');
  if (waveMeaningStatus) {
    if(isTemporaryObservationSet(profile)){
      waveMeaningStatus.textContent=(observationState==='idle')?'波形：仮登録・表示構造確認用':(waveDefined?`波形：仮登録 / ${arrangementState.shortLabel} / 記録順`:'波形：仮登録 / 値なし区間');
    }else{
      waveMeaningStatus.textContent=preludeActive?'波形：史実時計軸開始待ち':(observationState==='initial'?'波形：初期配置確認中・時計軸未開始':(observationState==='idle'?'波形：開始待ち':(waveDefined?`波形：${arrangementState.shortLabel} / 時計軸 ${clockText}`:`波形：未観測区間 / 再構成禁止`)));
    }
  }

  if (running && observationState === 'running' && !preludeActive) addHistoricalRecordsUpTo(time);
}

if (amplitudeSlider) amplitudeSlider.addEventListener('input', handleSliderInput);
if (dampingSlider) dampingSlider.addEventListener('input', handleSliderInput);
if (restShiftSlider) restShiftSlider.addEventListener('input', handleSliderInput);
if (restShiftAfterSlider) restShiftAfterSlider.addEventListener('input', handleSliderInput);
if (experimentSetSelect) experimentSetSelect.addEventListener('change', () => {
  if (observationState !== 'idle') return;
  clearObservationHold();
  time = 0;
  resetMotionViewUntimedPrelude();
  resetReadingRecords();
  updateHistoricalDatasetPanel();
  updateHistoricalReplayScale();
  update();
});

if(waveTimeAxisToggle) waveTimeAxisToggle.addEventListener('click',()=>{
  waveTimeAxisFull=!waveTimeAxisFull;
  invalidateWaveTimeAxisLayout();
  updateHistoricalReplayScale();
  updateWaveRecordMarkers();
  update();
});

if (startBtn) startBtn.addEventListener('click', startObservation);
if (pauseBtn) pauseBtn.addEventListener('click', pauseObservation);
if (stopBtn) stopBtn.addEventListener('click', stopObservation);
if (resetBtn) resetBtn.addEventListener('click', resetAll);
if (clearBtn) clearBtn.addEventListener('click', clearObservation);


function getReadingSummarySnapshot(){
  const positionSummary = getPositionSummary();
  const first = positionSummary.positions[0] || {label:'位置1',short_label:'位置1',count:0,average:null};
  const second = positionSummary.positions[1] || {label:'位置2',short_label:'位置2',count:0,average:null};
  const firstTransition = positionSummary.transitions[0] || {label:'位置差',difference:null,difference_text:'-- div',source:'not_available'};
  const transitionText = positionSummary.transitions.length
    ? positionSummary.transitions.map(item => `${item.label} ${item.difference_text}`).join(' / ')
    : '-- div';
  const hasDiff = positionSummary.transitions.some(item => Number.isFinite(Number(item.difference)));
  const historicalTransition = positionSummary.transitions.some(item => item.source === 'historical_summary_motion');
  const resultReason = hasDiff
    ? `${positionSummary.positions.map(item => `${item.label}${item.count}件`).join('・')}を集計。${historicalTransition ? '原表要約欄の移動量を優先表示。' : '位置別平均差を算出。'}`
    : '位置別の史実読取値を再生中。差分は必要な位置の記録がそろった後に表示します。';
  const interpretation = historicalTransition
    ? `原表要約欄に記録された配置変更量を史実値として表示しています。`
    : (hasDiff
      ? `史実読取値の位置別平均から配置変更差を算出しています。`
      : '史実読取値を保持中です。角度・力・Gへの換算は行っていません。');
  const positionAverageText = positionSummary.positions.length
    ? positionSummary.positions.map(item => `${item.short_label || item.label} ${formatReadDivValue(item.average)}`).join(' / ')
    : '位置別平均 -- div';
  const movementCountText = positionSummary.transitions.length ? ` / 配置変更 ${positionSummary.transitions.length}件` : '';
  return {
    positions: positionSummary.positions,
    transitions: positionSummary.transitions,
    labelA: first.label,
    labelB: second.label,
    diffLabel: firstTransition.label,
    countA: first.count,
    countB: second.count,
    avgA: formatReadDivValue(first.average),
    avgB: formatReadDivValue(second.average),
    diffAB: firstTransition.difference_text,
    gravityDiff: transitionText,
    hasDiff,
    resultMain: hasDiff ? '史実読取差を記録' : '史実読取を再生',
    resultReason,
    interpretation,
    mainValues: `${positionAverageText}${movementCountText}`
  };
}

function buildReportWaveformSnapshot(){
  const profile = getActiveReplayProfile();
  const endTime = getActiveObservationEndTime();
  const recordTimes = readingRecords.map(record => Number(record.elapsed_time_s)).filter(Number.isFinite);
  const latestRecordTime = recordTimes.length ? Math.max(...recordTimes) : 0;
  const currentTime = Number.isFinite(Number(time)) ? Number(time) : 0;
  const rawEnd = observationState === 'completed' ? endTime : Math.max(currentTime, latestRecordTime);
  const sampleEnd = Math.max(0, Math.min(endTime, rawEnd));
  if (!profile || sampleEnd <= 0.01) {
    return {
      source:'experiment_historical_replay', observation_end_time_s:endTime,
      sample_end_time_s:0, sample_count:0, read_value_unit:'div', samples:[]
    };
  }
  const sampleCount = Math.max(2, Math.min(260, Math.ceil((sampleEnd / endTime) * 220)));
  const samples = [];
  for (let index=0; index<sampleCount; index+=1) {
    const playbackTime = sampleCount === 1 ? 0 : (sampleEnd * index) / (sampleCount - 1);
    const frame = profile.frameAt(playbackTime);
    const waveDefined=frame.wave_defined!==false&&Number.isFinite(Number(frame.read_value));
    const matchingSegments=(Array.isArray(profile.wave_segments)?profile.wave_segments:[]).filter(segment=>
      segment.main_clock_visible!==false&&
      playbackTime>=Number(segment.playback_start_s)-1e-6&&
      playbackTime<=Number(segment.playback_end_s)+1e-6
    );
    const historicalSegment=matchingSegments.find(isHistoricalObservationWaveSegment);
    const reconstructionSegment=matchingSegments.find(isReconstructionWaveSegment);
    const lineKind=historicalSegment
      ? 'historical_solid'
      : (reconstructionSegment?'reconstruction_dashed':(waveDefined?'reconstruction_dashed':'none'));
    samples.push({
      elapsed_time_s:Number(playbackTime.toFixed(3)),
      historical_time_hms:frame.historical_time_hms,
      read_value:waveDefined?Number(Number(frame.read_value).toFixed(6)):null,
      read_div:waveDefined?formatHistoricalRead(frame.read_value):'—',
      visual_offset_px:waveDefined?Number(Number(frame.visual_offset_px).toFixed(3)):null,
      large_mass_position:frame.position,
      source_class:frame.source_class,
      line_kind:lineKind,
      wave_defined:waveDefined
    });
  }
  return {
    source:'experiment_historical_replay',
    observation_end_time_s:endTime,
    sample_end_time_s:Number(sampleEnd.toFixed(3)),
    sample_count:samples.length,
    read_value_unit:'div',
    historical_start_hms:profile.historical_start_hms,
    historical_end_hms:profile.historical_end_hms,
    marker_source:'historical_table_anchors',
    interpolation_policy:(()=>{
      const registration=getObservationSetRegistration(profile);
      if(profile&&profile.data_key==='CAV-1798-EXP-I') return 'Printed direct-clock values remain anchors; untimed extrema retain record order; model phase is shown only in constrained intervals; unobserved intervals remain gaps.';
      if(registration&&registration.display_pattern_id==='P2') return 'Direct clock values are connected only inside confirmed placement sections; transition uncertainty and missed intervals remain gaps.';
      return 'Printed division-crossing clocks constrain reconstructed extremum times; adjacent extrema are connected only inside the same placement section; missed and transition intervals remain gaps.';
    })(),
    samples
  };
}


function buildReportMassArrangementSnapshot(){
  const profile = getActiveReplayProfile();
  const endTime = getActiveObservationEndTime();
  const stateTime = observationState === 'completed' ? endTime : Math.max(0, Math.min(endTime, Number(time) || 0));
  const state = getMassArrangementState(stateTime);
  const motionSections = profile && Array.isArray(profile.motion_view_sections) && profile.motion_view_sections.length
    ? profile.motion_view_sections
    : (profile && Array.isArray(profile.sections) ? profile.sections : []);
  const timedSections = profile && Array.isArray(profile.sections) ? profile.sections : [];
  const sections = motionSections.map((section,index) => {
    const recordOrderOnly=Boolean(section.record_order_only);
    const playbackStart=recordOrderOnly ? null : Number(section.start_time_s);
    const clockFrame=!recordOrderOnly&&Number.isFinite(playbackStart)&&profile&&typeof profile.frameAt==='function'
      ? profile.frameAt(playbackStart)
      : null;
    const timedMatch=timedSections.find(item=>Number(item.index)===Number(section.index)&&item.position===section.position)
      || timedSections.find(item=>item.position===section.position&&!Boolean(item.record_order_only));
    return {
      index:Number.isFinite(Number(section.index))?Number(section.index):index,
      position:section.position,
      label:positionLongJa(section.position),
      event_text:section.event || section.label || '',
      historical_time_hms:recordOrderOnly?'':String(clockFrame&&clockFrame.historical_time_hms||''),
      playback_start_s:Number.isFinite(playbackStart)?Number(playbackStart.toFixed(3)):null,
      equilibrium:Number.isFinite(Number(section.equilibrium)) ? Number(section.equilibrium) : (timedMatch&&Number.isFinite(Number(timedMatch.equilibrium))?Number(timedMatch.equilibrium):null),
      record_order_only:recordOrderOnly,
      time_uncertain:Boolean(section.time_uncertain)||recordOrderOnly,
      time_status:recordOrderOnly?'clock_time_missing_record_order_only':'historical_clock_time',
      source_class:String(section.source_class||'')
    };
  });
  const hypotheticalPrelude=sections.length>1&&sections[0].record_order_only&&sections[0].position!==sections[1].position;
  const transitions = profile && Array.isArray(profile.transitions) ? profile.transitions.map(item => ({
    from_position:item.from_position,
    to_position:item.to_position,
    label:`${positionShortJa(item.from_position)}→${positionShortJa(item.to_position)}`,
    historical_time_hms:item.historical_time_hms,
    playback_time_s:Number(Number(item.playback_time_s).toFixed(3)),
    event_text:item.event_text || '',
    source_class:item.source_class || '',
    historical_motion_value:item.historical_motion_value
  })) : [];
  return {
    source:'experiment_historical_mass_position_sequence',
    stage_key:state.key,
    stage_label:state.shortLabel || state.label,
    sequence_label:sections.map(section => section.label).join(' → '),
    sections,
    transitions,
    untimed_initial_record_order_only:hypotheticalPrelude,
    hypothetical_ui_interpolation_excluded:true,
    excluded_ui_interpolation_ms:hypotheticalPrelude?MOTION_VIEW_UNTIMED_PRELUDE_MS:0,
    display_policy:profile&&profile.data_key==='CAV-1798-EXP-I'?'10:05と11:06の確定イベントのみ表示し、時刻不明の保護操作区間は配置経路不明とする。':'原表の大球位置順序を保持し、時計時刻のない初期配置は「時刻なし」と表示する。Motion Viewの想定補間時間はレポートの史実時間・波形・集計へ含めない。',
    connection_note:'Waveform・Telescope・Timelineと同一Experimentプロファイルへ接続。'
  };
}

function buildReportPreviewPayload(){
  const item = getSelectedHistoricalDataset();
  const profile = getActiveReplayProfile();
  const summary = getReadingSummarySnapshot();
  const observationLabelMap = {idle:'待機',running:'観測中',paused:'一時停止',stopped:'停止',completed:'観測完了'};
  const rowTrialTotal = item && item.row_trial_records ? item.row_trial_records.length : 0;
  const tablePages = getHistoricalTableSourcePages(item);
  const narrativePages = getHistoricalNarrativeSourcePages(item);
  const pages = tablePages.length ? tablePages.join('–') : '—';
  const registration = getObservationSetRegistration(item || profile);
  const anchors=profile&&Array.isArray(profile.anchors)?profile.anchors:[];
  const reconstructedTimeCount = anchors.filter(anchor => isReconstructedTimeBasis(anchor.time_basis)&&!isOrderConstraintTimeBasis(anchor.time_basis)&&!isHistoricalTableCalculationNoInstant(anchor.time_basis)).length;
  const orderConstraintCount = anchors.filter(anchor => isOrderConstraintTimeBasis(anchor.time_basis)).length;
  const exactTimeCount = anchors.filter(anchor => hasHistoricalClockClaim(anchor)&&!isReconstructedTimeBasis(anchor.time_basis)).length;
  const motionSections=profile&&Array.isArray(profile.motion_view_sections)?profile.motion_view_sections:[];
  const hasHypotheticalUiPrelude=motionSections.length>1&&Boolean(motionSections[0].record_order_only)&&motionSections[0].position!==motionSections[1].position;
  const reportNoticeBase = orderConstraintCount
    ? `史実数値は原表値を使用しています。原表時刻付き${exactTimeCount}点だけを時計軸へ配置し、時刻未記載の極値${orderConstraintCount}点は擬似時刻を付与せず記録順と振幅照合に限定しています。補完波形は直接時計観測で囲まれた区間だけに表示します。`
    : (reconstructedTimeCount
      ? `史実数値は原表値を使用しています。原表に時刻がない${reconstructedTimeCount}点は、値を変更せず再生順序用の時刻だけを補完しています。`
      : '史実数値と時刻を原表記録に基づいて再生しています。');
  const reportNotice = hasHypotheticalUiPrelude
    ? `${reportNoticeBase} Motion Viewの約2.5秒の想定補間はUI表示だけであり、史実時間・波形・観測値・結果集計には含めていません。`
    : reportNoticeBase;
  return {
    app_version:APP_BUILD,
    generated_at:new Date().toISOString(),
    generated_label:formatJstTimestamp(),
    record_id:`CAV-REPORT-${new Date().toISOString().replace(/[-:.TZ]/g,'').slice(0,14)}`,
    observation_state:observationState,
    observation_state_label:observationLabelMap[observationState] || observationState,
    observation_method:'Experiment Historical Replay',
    reading_test:'Auto Motion',
    dataset:{
      label:item.label || '', id:item.data_key || item.id || '', date_label:item.date_label || '',
      status:item.status || '', connection:'Waveform / Telescope / Weight Motion / Timelineへ接続済み',
      csv_meta:'値区分・時刻区分・出典を記録',
      row_data_status:`${rowTrialTotal}行 / 原論文 p.${pages}`,
      narrative_source_pages:narrativePages.join('–'),
      source_page_note:item.source_page_note_ja || '',
      row_data_label:`${item.label || '選択中Experiment'} 史実原表数値 ${rowTrialTotal}行`,
      row_check:'原論文表画像との目視照合済み。空欄・missedは推定で補完していません。',
      note:item.note || '', transcription_status:item.transcription_status || 'not_transcribed',
      historical_start_hms:profile ? profile.historical_start_hms : '',
      historical_end_hms:profile ? profile.historical_end_hms : '',
      historical_anchor_count:profile && profile.anchors ? profile.anchors.length : 0,
      display_pattern_id:registration.display_pattern_id || '',
      display_pattern_name_ja:registration.display_pattern_name_ja || '',
      registration_status:registration.registration_status || '',
      reconstructed_time_count:reconstructedTimeCount,
      order_constraint_count:orderConstraintCount,
      exact_time_count:exactTimeCount
    },
    summary,
    waveform:buildReportWaveformSnapshot(),
    mass_arrangement:buildReportMassArrangementSnapshot(),
    records:readingRecords.map((record,index)=>({
      no:index+1, record_id:record.record_id, timestamp:record.timestamp,
      elapsed_time_s:Number(record.elapsed_time_s)||0,
      historical_time_hms:record.historical_time_hms || '',
      historical_time_original:record.historical_time_original || '',
      large_mass_position:record.large_mass_position,
      value_kind:record.value_kind || '', value_class:record.value_class || '',
      read_div:record.read_div, read_value:record.read_value,
      reading_set_id:record.reading_set_id,
      source_page:record.source_page || '', source_row_id:record.source_row_id || '',
      source_class:record.source_class || '', time_basis:record.time_basis || '',
      observation_note:record.observation_note || ''
    })),
    report_notice:reportNotice,
    report_meaning:(()=>{
      if(profile&&profile.data_key==='CAV-1798-EXP-I') return '直接時計観測と時刻未記載極値を分離し、時計軸上の補完は拘束できる区間だけに限定します。未観測区間は空白です。';
      if(registration.display_pattern_id==='P2') return '原表で同じ行に記録された時計時刻と読取値を直接観測として保持し、配置変更時刻不確定帯と欠測をまたいで接続しません。';
      return '原表の目盛通過時刻を時計アンカー、極値を再構成点として分離し、同一配置区間内だけを接続します。時刻未記載点は主時計軸へ置きません。';
    })(),
    report_interpretation:summary.interpretation,
    report_judgement_reason:summary.resultReason,
    report_next_check:'Read divから角度・力・Gへの換算は、史実装置定数との接続検証後に別工程で行います。',
    report_note:observationState === 'completed' ? 'Experimentの史実記録再生完了時点の保持データです。' : '任意停止時点までの史実記録を保持しています。'
  };
}

function prepareReportPreviewPayload(){
  try {
    if (!readingRecords.length) return;
    sessionStorage.setItem('cavendish_report_payload', JSON.stringify(buildReportPreviewPayload()));
  } catch (error) {
    console.warn('Report preview payload was not stored.', error);
  }
}

function prepareReportCsvPreviewCache(){
  try {
    if (!readingRecords.length) return;
    const generatedAt=new Date();
    const historicalPack=createHistoricalCsvPackage(generatedAt);
    const analysisPack=createAnalysisCsvPackage(generatedAt);
    const payload = {
      historical: historicalPack.csv,
      analysis: analysisPack.csv,
      historical_meta:{filename:historicalPack.filename,record_id:historicalPack.context.csvRecordId,generated_label:historicalPack.context.generatedLabel,generated_at:historicalPack.context.generatedIsoJst},
      analysis_meta:{filename:analysisPack.filename,record_id:analysisPack.context.csvRecordId,generated_label:analysisPack.context.generatedLabel,generated_at:analysisPack.context.generatedIsoJst},
      generated_at: historicalPack.context.generatedIsoJst,
      generated_label: historicalPack.context.generatedLabel,
      app_version: APP_BUILD
    };
    sessionStorage.setItem('cavendish_report_csv_payload', JSON.stringify(payload));
  } catch (error) {
    console.warn('CSV preview cache was not stored.', error);
  }
}

function openReportPreview(options = {}){
  const reportUrl = 'cavendish-report-preview.html';
  persistFinalizedObservation(observationState);
  prepareReportPreviewPayload();
  prepareReportCsvPreviewCache();
  // CV072F: IMPULSE LABO common UI policy: do not use popup/new-tab preview flows.
  // Open the report preview in the same tab so iPhone/Safari/PocketServer do not block
  // the command buttons and so CSV preview can use the sessionStorage payload reliably.
  window.location.href = reportUrl;
}


// CV079A05: 読取記録を初期折りたたみにし、Experiment・件数・時刻範囲・Read値範囲を概要表示。
// CV079A04: CV079A02の史実データ層をExperiment別の観測表示・CSV・レポートへ接続し、完了時刻とTimeline終端を同期。
// Section 2 Telescope status labels and Section 3 補助ON / 補助OFF labels are maintained.
// Section 4 remains data/output confirmation only.
// These controls do not change observation logic, CSV body columns, historical row data,
// report diagrams, or physics/G connection state.
function bindDisplayToggle(control, bodyClass, statusText = null){
  if (!control) return;
  const statusEl = control.closest('.toggle-control')?.querySelector('.toggle-text');
  const apply = () => {
    document.body.classList.toggle(bodyClass, !control.checked);
    if (statusText && statusEl) {
      statusEl.textContent = control.checked ? statusText.on : statusText.off;
    }
  };
  control.addEventListener('change', apply);
  apply();
}
bindDisplayToggle(toggleReadMetric, 'hide-read-metric', { on: '表示中', off: '非表示' });
bindDisplayToggle(toggleVernierMetric, 'hide-vernier-metric', { on: '表示中', off: '非表示' });
bindDisplayToggle(toggleMatchMetric, 'hide-match-metric', { on: '表示中', off: '非表示' });
bindDisplayToggle(toggleVernierScale, 'hide-vernier-scale', { on: '表示中', off: '非表示' });
if(toggleVernierScale) toggleVernierScale.addEventListener('change',()=>requestAnimationFrame(update));
bindDisplayToggle(toggleReadPointer, 'hide-read-pointer', { on: '強調中', off: '通常' });
bindDisplayToggle(toggleWaveMarkers, 'hide-wave-markers', { on: '補助ON', off: '補助OFF' });
bindDisplayToggle(toggleEquilibriumGuides, 'hide-equilibrium-guides', { on: '補助ON', off: '補助OFF' });
bindDisplayToggle(toggleWeightNote, 'hide-weight-note', { on: '補助ON', off: '補助OFF' });
bindDisplayToggle(toggleTimelineDetail, 'hide-timeline-detail', { on: '補助ON', off: '補助OFF' });

if (exportHistoricalCsvBtn) exportHistoricalCsvBtn.addEventListener('click', exportHistoricalRecordCsv);
if (exportAnalysisCsvBtn) exportAnalysisCsvBtn.addEventListener('click', exportAnalysisDerivedCsv);

const inlineCsvSaveBtn = document.getElementById('inlineCsvSaveBtn');
const inlineCsvBackBtn = document.getElementById('inlineCsvBackBtn');
if (inlineCsvSaveBtn) inlineCsvSaveBtn.addEventListener('click', saveInlineCsvPreview);
if (inlineCsvBackBtn) inlineCsvBackBtn.addEventListener('click', hideInlineCsvPreview);

if (previewHistoricalCsvBtn) previewHistoricalCsvBtn.addEventListener('click', () => showInlineCsvPreview('historical'));
if (previewAnalysisCsvBtn) previewAnalysisCsvBtn.addEventListener('click', () => showInlineCsvPreview('analysis'));
if (openReportPreviewBtn) openReportPreviewBtn.addEventListener('click', openReportPreview);
if (leftPreviewHistoricalCsvBtn) leftPreviewHistoricalCsvBtn.addEventListener('click', () => showInlineCsvPreview('historical'));
if (leftExportHistoricalCsvBtn) leftExportHistoricalCsvBtn.addEventListener('click', exportHistoricalRecordCsv);
if (leftPreviewAnalysisCsvBtn) leftPreviewAnalysisCsvBtn.addEventListener('click', () => showInlineCsvPreview('analysis'));
if (leftExportAnalysisCsvBtn) leftExportAnalysisCsvBtn.addEventListener('click', exportAnalysisDerivedCsv);
if (leftOpenReportPreviewBtn) leftOpenReportPreviewBtn.addEventListener('click', openReportPreview);

// CV072J: When returning from the same-tab report preview, some mobile browsers restore
// the simulator from cache while others reload it. Re-run the held-result restoration
// check on pageshow so output commands are enabled only when real held data exists.
window.addEventListener('pageshow', () => {
  if (!restoreFinalizedObservation()) {
    updateControlButtons();
  }
});

// CV069C: Details display control retained; cycle timeline detail is also folded without changing observation logic.
// Keeps redundant wrapper containers removed while preventing multiple long detail panels from staying open.
// This is display behavior only; it does not touch readings, CSV columns, historical row data, or physics.
function setupDetailsDisplayControl(){
  const mainArea = document.querySelector('.main');
  if (!mainArea) return;
  const detailPanels = Array.from(mainArea.querySelectorAll('details'));
  // CV069C fine tune: keep the normal screen compact on first load / refresh.
  detailPanels.forEach((panel) => {
    panel.open = false;
  });
  detailPanels.forEach((panel) => {
    panel.addEventListener('toggle', () => {
      if (!panel.open) return;
      detailPanels.forEach((other) => {
        if (other !== panel) other.open = false;
      });
    });
  });
}


// CV070D: common help alignment / fixed card inside clicked title or control row; collapsed rows can show help without exposing hidden content.
// This is a local verification implementation of the IMPULSE LABO common help behavior.
// It does not change observation logic, historical records, CSV columns, waveform, physics, or folding details.
function setupCommonHelpFloat(){
  const tooltip = document.getElementById('commonHelpFloat');
  if (!tooltip) return;
  const helpButtons = Array.from(document.querySelectorAll('.help[data-help], .help[data-help-inline]'));
  if (!helpButtons.length) return;

  let activeButton = null;
  let activeAnchor = null;
  let activeClipContainer = null;
  let activeInlinePanel = null;

  const getAnchor = (button) => button.closest('.control-field, .section-title, .panel-head, .vis-head, .side-title, .wave-meaning, .cycle-detail-panel summary, .compact-detail-panel summary') || button.parentElement || document.body;
  const getClipContainer = (button) => button.closest('.section.collapsed');

  const closeHelp = () => {
    tooltip.classList.remove('is-open');
    tooltip.setAttribute('aria-hidden', 'true');
    tooltip.textContent = '';
    document.querySelectorAll('[data-inline-help-panel]').forEach((panel) => {
      panel.hidden = true;
      const host = panel.closest('.telescope-panel');
      if (host) host.classList.remove('has-inline-help-open');
    });
    helpButtons.forEach((btn) => {
      btn.classList.remove('is-help-open');
      btn.setAttribute('aria-expanded', 'false');
    });
    if (activeAnchor) activeAnchor.classList.remove('has-help-open');
    if (activeClipContainer) activeClipContainer.classList.remove('has-help-open');
    if (tooltip.parentElement !== document.body) document.body.appendChild(tooltip);
    activeButton = null;
    activeAnchor = null;
    activeClipContainer = null;
    activeInlinePanel = null;
  };

  helpButtons.forEach((button) => {
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const inlineTargetId = button.getAttribute('data-help-inline');
      if (inlineTargetId) {
        const inlinePanel = document.getElementById(inlineTargetId);
        if (!inlinePanel) return;
        const isSameOpen = activeButton === button && activeInlinePanel === inlinePanel && !inlinePanel.hidden;
        closeHelp();
        if (isSameOpen) return;
        inlinePanel.hidden = false;
        const host = inlinePanel.closest('.telescope-panel');
        if (host) host.classList.add('has-inline-help-open');
        activeButton = button;
        activeInlinePanel = inlinePanel;
        button.classList.add('is-help-open');
        button.setAttribute('aria-expanded', 'true');
        return;
      }

      if (activeButton === button && tooltip.classList.contains('is-open')) {
        closeHelp();
        return;
      }
      closeHelp();
      activeButton = button;
      activeAnchor = getAnchor(button);
      activeClipContainer = getClipContainer(button);
      activeAnchor.appendChild(tooltip);
      tooltip.textContent = button.dataset.help || '';
      tooltip.classList.add('is-open');
      tooltip.setAttribute('aria-hidden', 'false');
      button.classList.add('is-help-open');
      button.setAttribute('aria-expanded', 'true');
      activeAnchor.classList.add('has-help-open');
      if (activeClipContainer) activeClipContainer.classList.add('has-help-open');
    });
  });

  document.addEventListener('click', (event) => {
    if (activeInlinePanel && activeInlinePanel.contains(event.target)) return;
    if (tooltip.classList.contains('is-open') && tooltip.contains(event.target)) return;
    if (activeButton && activeButton.contains(event.target)) return;
    closeHelp();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeHelp();
  });

  closeHelp();
}


// CV077C05: preserveAspectRatio="none" is retained so the graph fills the PC waveform panel,
// but SVG text must not inherit the resulting non-uniform X/Y scaling. Measure the rendered
// scale and expose an inverse X correction to desktop-only CSS. Mobile rules remain untouched.
function updatePcWaveTextAspect(){
  if (!waveSvg) return;
  const rect = waveSvg.getBoundingClientRect();
  const viewBox = waveSvg.viewBox && waveSvg.viewBox.baseVal;
  const viewWidth = viewBox && viewBox.width ? viewBox.width : 1000;
  const viewHeight = viewBox && viewBox.height ? viewBox.height : 220;
  if (!rect.width || !rect.height || !viewWidth || !viewHeight) return;
  const scaleX = rect.width / viewWidth;
  const scaleY = rect.height / viewHeight;
  // CV079B12: preserveAspectRatio=none remains necessary for plot-area use, but text must
  // be corrected on Mobile as well as PC so clock/axis labels are not tall and narrow.
  const correction = Math.max(0.7, Math.min(3.8, scaleY / scaleX));
  waveSvg.style.setProperty('--wave-text-aspect-fix', correction.toFixed(4));
}

let waveTextAspectFrame = 0;
let waveTimeAxisResizeFrame = 0;
function schedulePcWaveTextAspect(){
  cancelAnimationFrame(waveTextAspectFrame);
  waveTextAspectFrame = requestAnimationFrame(updatePcWaveTextAspect);
}
function scheduleWaveTimeAxisResize(){
  cancelAnimationFrame(waveTimeAxisResizeFrame);
  waveTimeAxisResizeFrame=requestAnimationFrame(()=>{
    invalidateWaveTimeAxisLayout();
    updateHistoricalReplayScale();
    updateWaveRecordMarkers();
    update();
  });
}
function scheduleWaveResize(){
  invalidateTelescopeMainScaleGeometry();
  schedulePcWaveTextAspect();
  scheduleWaveTimeAxisResize();
}
window.addEventListener('resize', scheduleWaveResize, { passive:true });
window.addEventListener('orientationchange', scheduleWaveResize, { passive:true });
if ('ResizeObserver' in window && waveSvg) {
  const waveTextResizeObserver = new ResizeObserver(scheduleWaveResize);
  waveTextResizeObserver.observe(waveSvg);
}
if ('ResizeObserver' in window && fixedMainScale) {
  const telescopeScaleResizeObserver=new ResizeObserver(()=>{
    invalidateTelescopeMainScaleGeometry();
    if(Number.isFinite(telescopeLastScaleReading)) applyTelescopeReadScale(telescopeLastScaleReading);
  });
  telescopeScaleResizeObserver.observe(fixedMainScale);
}

function getObservationPlaybackStep(baseStep){
  const profile=getActiveReplayProfile();
  const interval=getOmittedPlaybackIntervals(profile).find(item=>time>=item.start&&time<item.end);
  if(!interval) return baseStep;
  const transitions=Array.isArray(profile.transitions)?profile.transitions:[];
  const nearKnownTransition=transitions.some(transition=>{
    const start=Number(transition.playback_time_s)||0;
    return time>=start-0.05&&time<=start+1.25;
  });
  return nearKnownTransition?baseStep:baseStep*18;
}

function loop(){
  if(running && !paused && observationState === 'running'){
    const profile=getActiveReplayProfile();
    const hadPrelude=motionViewUntimedPreludeEndsAt>0||motionViewUntimedPreludeRemainingMs>0;
    if(isMotionViewUntimedPreludeActive(profile)){
      update();
      requestAnimationFrame(loop);
      return;
    }
    if(hadPrelude){
      resetMotionViewUntimedPrelude();
      updateWaveformStatus();
    }
    const endTime=getActiveObservationEndTime();
    time += getObservationPlaybackStep(0.035);
    if (time >= endTime) {
      completeObservation();
    } else {
      update();
    }
  }
  requestAnimationFrame(loop);
}

setupDetailsDisplayControl();
setupCommonHelpFloat();
schedulePcWaveTextAspect();
populateHistoricalDatasetOptions();
updateHistoricalDatasetPanel();
updateSliderControlValues();
if (!restoreFinalizedObservation()) {
  update();
  setObservationState('idle');
}
loop();
