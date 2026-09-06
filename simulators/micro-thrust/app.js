(()=>{
  "use strict";

  const stateApi = window.ImpulseLaboState;
  if(!stateApi) throw new Error("ImpulseLaboState is not loaded.");

  const {Lifecycle, lifecycleLabels, completedDisplayControlKeys, store} = stateApi;
  const csvApi = window.ImpulseLaboCsv;
  if(!csvApi) throw new Error("ImpulseLaboCsv is not loaded.");
  const reportApi = window.ImpulseLaboReport;
  if(!reportApi) throw new Error("ImpulseLaboReport is not loaded.");

  const elements = {
    app: document.getElementById("appShell"),
    headerState: document.getElementById("headerStateText"),
    headerControl: document.getElementById("headerControlText"),
    headerPhysics: document.getElementById("headerPhysicsText"),
    summaryState: document.getElementById("summaryStateText"),
    controlRevision: document.getElementById("controlRevisionText"),
    physicsStatus: document.getElementById("physicsStatusText"),
    analysisFreeze: document.getElementById("analysisFreezeText"),
    analysisFreezeDetail: document.getElementById("analysisFreezeDetailText"),
    opticalCur: document.getElementById("opticalCurText"),
    opticalAngle: document.getElementById("opticalAngleText"),
    opticalPeakPlus: document.getElementById("opticalPeakPlusText"),
    opticalPeakMinus: document.getElementById("opticalPeakMinusText"),
    opticalScale: document.getElementById("opticalScaleText"),
    opticalDirection: document.getElementById("opticalDirectionText"),
    opticalCanvas: document.getElementById("opticalCanvas"),
    vernierCanvas: document.getElementById("vernierCanvas"),
    vernierReadText: document.getElementById("vernierReadText"),
    vernierContainer: document.querySelector(".vernier-container"),
    vernierExpandButton: document.getElementById("vernierExpandButton"),
    vernierTapHint: document.getElementById("vernierTapHint"),
    opticalPanel: document.getElementById("opticalPanel"),
    opticalContainer: document.querySelector(".optical-container"),
    opticsExpandButton: document.getElementById("opticsExpandButton"),
    opticsTapHint: document.getElementById("opticsTapHint"),
    opticalTimeline: document.getElementById("opticalTimeline"),
    opticalTimelineTrack: document.getElementById("opticalTimelineTrack"),
    opticalTimelinePre: document.getElementById("opticalTimelinePre"),
    opticalTimelineActive: document.getElementById("opticalTimelineActive"),
    opticalTimelinePost: document.getElementById("opticalTimelinePost"),
    opticalTimelineWindow: document.getElementById("opticalTimelineWindow"),
    opticalTimelineCurrent: document.getElementById("opticalTimelineCurrent"),
    displayTimeRangeButton: document.getElementById("displayTimeRangeToggle"),
    waveCur: document.getElementById("waveCurText"),
    wavePeak: document.getElementById("wavePeakText"),
    waveAvg: document.getElementById("waveAvgText"),
    waveScale: document.getElementById("waveScaleText"),
    waveRangeStatus: document.getElementById("waveRangeStatusText"),
    waveRangeSurvey: document.getElementById("waveRangeSurveyText"),
    waveApplySurvey: document.getElementById("waveApplySurveyButton"),
    waveContainer: document.querySelector(".waveform-container"),
    waveExpandButton: document.getElementById("waveExpandButton"),
    waveTapHint: document.getElementById("waveTapHint"),
    waveCanvas: document.getElementById("waveCanvas"),
    wavePlot: document.getElementById("wavePlot"),
    waveTopLabel: document.getElementById("waveTopLabel"),
    waveUpperMidLabel: document.getElementById("waveUpperMidLabel"),
    waveZeroLabel: document.getElementById("waveZeroLabel"),
    waveLowerMidLabel: document.getElementById("waveLowerMidLabel"),
    waveBottomLabel: document.getElementById("waveBottomLabel"),
    waveRangeOverlay: document.getElementById("waveRangeOverlay"),
    waveTimelineTrack: document.getElementById("waveTimelineTrack"),
    waveTimelinePre: document.getElementById("waveTimelinePre"),
    waveTimelineActive: document.getElementById("waveTimelineActive"),
    waveTimelinePost: document.getElementById("waveTimelinePost"),
    waveTimelineWindow: document.getElementById("waveTimelineWindow"),
    waveTimelineCurrent: document.getElementById("waveTimelineCurrent"),
    wavePhaseText: document.getElementById("wavePhaseText"),
    waveMainWindowText: document.getElementById("waveMainWindowText"),
    inputPhaseText: document.getElementById("inputPhaseText"),
    inputProfileText: document.getElementById("inputProfileText"),
    summaryPhaseText: document.getElementById("summaryPhaseText"),
    summaryMainWindowText: document.getElementById("summaryMainWindowText"),
    preBaselineStatsText: document.getElementById("preBaselineStatsText"),
    mainEvaluationStatsText: document.getElementById("mainEvaluationStatsText"),
    postBaselineStatsText: document.getElementById("postBaselineStatsText"),
    baselineDifferenceText: document.getElementById("baselineDifferenceText"),
    recoveryStatusText: document.getElementById("recoveryStatusText"),
    tailStabilityText: document.getElementById("tailStabilityText"),
    noiseGenerationText: document.getElementById("noiseGenerationText"),
    noiseVisibleText: document.getElementById("noiseVisibleText"),
    noiseWaveLegend: document.getElementById("noiseWaveLegend"),
    waveClipNote: document.getElementById("waveClipNote"),
    noiseEffectiveNote: document.getElementById("noiseEffectiveNote"),
    shieldingNote: document.getElementById("shieldingNote"),
    impulseMeasureStatus: document.getElementById("impulseMeasureStatus"),
    impulseMeasureButton: document.getElementById("impulseMeasureButton"),
    summaryPreStatsText: document.getElementById("summaryPreStatsText"),
    summaryMainStatsText: document.getElementById("summaryMainStatsText"),
    summaryPostStatsText: document.getElementById("summaryPostStatsText"),
    summarySnText: document.getElementById("summarySnText"),
    signalToNoiseDetailText: document.getElementById("signalToNoiseDetailText"),
    summarySnDetailText: document.getElementById("summarySnDetailText"),
    detectionJudgementText: document.getElementById("detectionJudgementText"),
    detectionReasonText: document.getElementById("detectionReasonText"),
    summaryDetectionText: document.getElementById("summaryDetectionText"),
    summaryDetectionDetailText: document.getElementById("summaryDetectionDetailText"),
    summaryDetectionReasonText: document.getElementById("summaryDetectionReasonText"),
    residualSupportText: document.getElementById("residualSupportText"),
    overallJudgementText: document.getElementById("overallJudgementText"),
    overallJudgementReasonText: document.getElementById("overallJudgementReasonText"),
    summaryOverallText: document.getElementById("summaryOverallText"),
    summaryResidualSupportText: document.getElementById("summaryResidualSupportText"),
    summaryOverallDetailText: document.getElementById("summaryOverallDetailText"),
    summaryOverallReasonText: document.getElementById("summaryOverallReasonText"),
    summaryBaselineDifferenceText: document.getElementById("summaryBaselineDifferenceText"),
    summaryRecoveryText: document.getElementById("summaryRecoveryText"),
    summaryTailStabilityText: document.getElementById("summaryTailStabilityText"),
    controlStateNote: document.getElementById("controlStateNote"),
    controlsStateView: document.getElementById("controlsStateView"),
    announcement: document.getElementById("stateAnnouncement"),
    start: document.getElementById("startButton"),
    pause: document.getElementById("pauseButton"),
    pauseIcon: document.getElementById("pauseButtonIcon"),
    pauseLabel: document.getElementById("pauseButtonLabel"),
    stop: document.getElementById("stopButton"),
    clear: document.getElementById("clearButton"),
    reset: document.getElementById("resetButton"),
    csvOutputBlock: document.getElementById("csvOutputBlock"),
    csvExport: document.getElementById("csvExportButton"),
    csvExportStatus: document.getElementById("csvExportStatus"),
    reportView: document.getElementById("reportView"),
    reportFrame: document.getElementById("reportFrame"),
    reportSheet: document.getElementById("reportSheet"),
    reportOpen: document.getElementById("reportOpenButton"),
    reportClose: document.getElementById("reportCloseButton"),
    reportCsv: document.getElementById("reportCsvButton"),
    reportPrint: document.getElementById("reportPrintButton"),
    reportActionStatus: document.getElementById("reportActionStatus"),
    extensionDecisionView: document.getElementById("extensionDecisionView"),
    extensionDecisionResult: document.querySelector(".extension-decision-result"),
    extensionDecisionBadge: document.getElementById("extensionDecisionBadge"),
    extensionDecisionTitle: document.getElementById("extensionDecisionTitle"),
    extensionDecisionReason: document.getElementById("extensionDecisionReason"),
    extensionApplicability: document.getElementById("extensionApplicabilityText"),
    extensionTailMeans: document.getElementById("extensionTailMeansText"),
    extensionDelta: document.getElementById("extensionDeltaText"),
    extensionUsage: document.getElementById("extensionUsageText"),
    extensionApply: document.getElementById("extensionApplyButton"),
    extensionFinalize: document.getElementById("extensionFinalizeButton"),
    extensionDecisionStatus: document.getElementById("extensionDecisionStatus"),
    helpFloat: document.getElementById("helpFloat")
  };

  const controlElements = new Map([...document.querySelectorAll("[data-control]")].map(element=>[element.dataset.control, element]));
  const foldGroups = [...document.querySelectorAll(".fold-group[data-fold-key]")];
  const foldDefaultsByLevel = Object.freeze({
    easy: Object.freeze([]),
    standard: Object.freeze(["detail"]),
    full: Object.freeze(["detail","noise","shielding","display"])
  });
  let lastAppliedControlLevel = null;
  const DISPLAY_WINDOW_SECONDS = 20;
  let displayTimeRangeMode = "full";

  function syncDisplayTimeRangeButtons(){
    const button = elements.displayTimeRangeButton;
    if(button){
      const isWindow = displayTimeRangeMode === "window";
      button.dataset.timeRangeMode = displayTimeRangeMode;
      button.textContent = isWindow ? "窓" : "全体";
      button.setAttribute("aria-pressed", String(isWindow));
      button.setAttribute("aria-label", isWindow
        ? "現在は窓表示。観測全体へ切り替える"
        : "現在は全体表示。窓表示へ切り替える。観測中は直近20秒、観測完了後は主評価窓を表示します"
      );
    }
    if(elements.app) elements.app.dataset.timeRangeMode = displayTimeRangeMode;
  }

  function setDisplayTimeRangeMode(mode){
    displayTimeRangeMode = mode === "window" ? "window" : "full";
    syncDisplayTimeRangeButtons();
    if(!lastSnapshot) return;
    renderWave(lastSnapshot);
  }

  function applyFoldDefaults(controlLevel){
    const level = Object.prototype.hasOwnProperty.call(foldDefaultsByLevel, controlLevel)
      ? controlLevel
      : "standard";
    if(level === lastAppliedControlLevel) return;
    closeHelp();
    const openKeys = new Set(foldDefaultsByLevel[level]);
    for(const group of foldGroups){
      group.open = openKeys.has(group.dataset.foldKey);
    }
    lastAppliedControlLevel = level;
  }

  const actionLabels = Object.freeze({
    "initialize": "初期化",
    "start": "開始",
    "pause": "一時停止",
    "resume": "再開",
    "stop": "停止",
    "complete": "完了",
    "clear-observation": "観測クリア",
    "reset-all": "リセット",
    "control-update": "入力変更",
    "completed-display-update": "完了後表示変更",
    "post-baseline-extension-start": "事後Baseline延長開始",
    "post-baseline-extension-complete": "事後Baseline延長完了",
    "post-baseline-finalize": "この時点で終了"
  });

  const controlLabels = Object.freeze({
    deviceModel: "装置モデル",
    deviceModelSummaryView: "装置仕様",
    mode: "モード",
    controlLevel: "操作レベル",
    theme: "テーマ",
    standardConditionView: "標準条件",
    modeSourceView: "データソース",
    initialDurationView: "初期観測時間",
    durationMode: "観測方式",
    timeScale: "時間倍率",
    inputTorqueNm: "入力トルク",
    stiffnessNmPerRad: "剛性",
    opticalDistanceM: "光学距離",
    inertiaKgM2: "慣性I",
    dampingNmsPerRad: "減衰c",
    material: "材質",
    wireDiameterMm: "ワイヤー径",
    noiseMaster: "ノイズ全体",
    noisePreset: "ノイズプリセット",
    noiseWhiteEnabled: "white適用",
    noiseWhiteVisible: "white表示",
    noiseWhiteLevel: "white強度",
    noiseDriftEnabled: "drift適用",
    noiseDriftVisible: "drift表示",
    noiseDriftLevel: "drift強度",
    noisePeriodicEnabled: "periodic適用",
    noisePeriodicVisible: "periodic表示",
    noisePeriodicLevel: "periodic強度",
    noiseImpulseEnabled: "impulse適用",
    noiseImpulseVisible: "impulse表示",
    noiseImpulseLevel: "impulse強度",
    noiseOpticalEnabled: "optical適用",
    noiseOpticalVisible: "optical表示",
    noiseOpticalLevel: "optical強度",
    noiseNumericEnabled: "numeric適用",
    noiseNumericVisible: "numeric表示",
    noiseNumericLevel: "numeric強度",
    shieldingMaster: "遮蔽",
    shieldingPreset: "遮蔽効果",
    manualDurationPreset: "最大観測時間",
    opticsZoom: "光学倍率",
    trailSeconds: "残像時間",
    opticalScaleMode: "光学表示レンジ",
    waveScaleMode: "波形Yレンジ",
    waveAutoStyle: "波形AUTO表示",
    waveDisplayGain: "波形表示倍率",
    waveManualRangeRad: "波形固定レンジ"
  });

  const allowedThemes = Object.freeze(["dark","light","sepia","high-contrast"]);
  const noiseUiColorVariables = Object.freeze({
    white:"--noise-white-color",
    drift:"--noise-drift-color",
    periodic:"--noise-periodic-color",
    impulse:"--noise-impulse-color",
    optical:"--noise-optical-color",
    numeric:"--noise-numeric-color"
  });

  function cssColor(variableName, fallback){
    const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
    return value || fallback;
  }

  function currentThemePalette(){
    const componentColors = {};
    for(const [componentId, variableName] of Object.entries(noiseUiColorVariables)){
      componentColors[componentId] = cssColor(variableName, "#9197a0");
    }
    return Object.freeze({
      background:cssColor("--canvas-bg", "#081018"),
      text:cssColor("--canvas-text", "rgba(170,184,195,.92)"),
      grid:cssColor("--canvas-grid", "rgba(150,165,180,.14)"),
      gridStrong:cssColor("--canvas-grid-strong", "rgba(150,165,180,.22)"),
      opticalGrid:cssColor("--canvas-optical-grid", "rgba(150,165,180,.20)"),
      opticalGridStrong:cssColor("--canvas-optical-grid-strong", "rgba(150,165,180,.38)"),
      axis:cssColor("--canvas-axis", "rgba(210,220,228,.42)"),
      border:cssColor("--canvas-border", "rgba(92,112,128,.75)"),
      connector:cssColor("--canvas-connector", "rgba(190,202,212,.28)"),
      spot:cssColor("--canvas-spot", "#d3dbe2"),
      spotBorder:cssColor("--canvas-spot-border", "rgba(255,255,255,.34)"),
      marker:cssColor("--canvas-marker", "rgba(210,220,228,.78)"),
      supportWindow:cssColor("--canvas-support-window", "rgba(86,116,140,.08)"),
      mainWindow:cssColor("--canvas-main-window", "rgba(192,178,104,.10)"),
      equilibrium:cssColor("--canvas-equilibrium", "rgba(210,190,100,.50)"),
      mean:cssColor("--canvas-mean", "rgba(112,190,150,.62)"),
      sigma:cssColor("--canvas-sigma", "rgba(120,160,205,.54)"),
      series:cssColor("--canvas-series", "#c7d0d8"),
      current:cssColor("--canvas-current", "rgba(210,220,228,.68)"),
      currentPoint:cssColor("--canvas-current-point", "#e3e9ee"),
      peakPlus:cssColor("--canvas-peak-plus", "#d8c67a"),
      peakMinus:cssColor("--canvas-peak-minus", "#cf9290"),
      opticalPositive:cssColor("--canvas-optical-positive", "#d84f5f"),
      opticalNegative:cssColor("--canvas-optical-negative", "#3f86d9"),
      componentColors:Object.freeze(componentColors)
    });
  }

  function applyTheme(theme){
    const nextTheme = allowedThemes.includes(theme) ? theme : "dark";
    document.documentElement.dataset.theme = nextTheme;
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if(themeColor) themeColor.setAttribute("content", cssColor("--bg", "#000000"));
    return nextTheme;
  }

  let activeHelpButton = null;

  function closeHelp(){
    if(activeHelpButton) activeHelpButton.setAttribute("aria-expanded", "false");
    activeHelpButton = null;
    if(elements.helpFloat) elements.helpFloat.hidden = true;
  }

  function openHelp(button){
    if(!elements.helpFloat || !button) return;
    if(activeHelpButton === button && !elements.helpFloat.hidden){
      closeHelp();
      return;
    }
    const text = button.getAttribute("data-help") || "";
    if(!text) return;
    closeHelp();
    activeHelpButton = button;
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-controls", "helpFloat");
    elements.helpFloat.textContent = text;
    elements.helpFloat.hidden = false;
    const rect = button.getBoundingClientRect();
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 320;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 480;
    const width = Math.min(320, viewportWidth - 16);
    elements.helpFloat.style.width = `${width}px`;
    let left = rect.right + 6;
    if(left + width > viewportWidth - 8) left = rect.left - width - 6;
    left = Math.min(viewportWidth - width - 8, Math.max(8, left));
    elements.helpFloat.style.left = `${left}px`;
    elements.helpFloat.style.top = "8px";
    const height = elements.helpFloat.getBoundingClientRect().height;
    const maxTop = Math.max(8, viewportHeight - height - 8);
    const top = Math.max(8, Math.min(maxTop, rect.top - 6));
    elements.helpFloat.style.top = `${top}px`;
  }

  function formatScientific(value, digits = 3){
    if(value === null || value === undefined || !Number.isFinite(Number(value))) return "--";
    const number = Number(value);
    if(number === 0) return "0";
    return number.toExponential(digits).replace("+", "");
  }

  function formatFixed(value, digits = 3){
    if(value === null || value === undefined || !Number.isFinite(Number(value))) return "--";
    return Number(value).toFixed(digits);
  }

  function setControlElementValue(element, value){
    if(!element) return;
    const stringValue = String(value);
    if(element.matches("button[data-binary-toggle]")){
      const active = stringValue === "on";
      element.value = active ? "on" : "off";
      element.textContent = active ? "ON" : "OFF";
      element.dataset.state = active ? "on" : "off";
      element.setAttribute("aria-pressed", String(active));
      return;
    }
    if(element.value !== stringValue) element.value = stringValue;
  }

  function formatControlsForView(snapshot){
    const c = snapshot.controls;
    const p = snapshot.physics;
    const orderedKeys = [
      "deviceModel","deviceModelSummaryView",
      "mode","controlLevel","theme",
      "standardConditionView","modeSourceView","initialDurationView",
      "durationMode","timeScale","inputTorqueNm","stiffnessNmPerRad","opticalDistanceM",
      "inertiaKgM2","dampingNmsPerRad","material","wireDiameterMm","fiberLengthM",
      "noiseMaster","noisePreset",
      "noiseWhiteEnabled","noiseWhiteVisible","noiseWhiteLevel",
      "noiseDriftEnabled","noiseDriftVisible","noiseDriftLevel",
      "noisePeriodicEnabled","noisePeriodicVisible","noisePeriodicLevel",
      "noiseImpulseEnabled","noiseImpulseVisible","noiseImpulseLevel",
      "noiseOpticalEnabled","noiseOpticalVisible","noiseOpticalLevel",
      "noiseNumericEnabled","noiseNumericVisible","noiseNumericLevel",
      "shieldingMaster","shieldingPreset",
      "manualDurationPreset","opticsZoom","trailSeconds",
      "opticalScaleMode","waveScaleMode","waveAutoStyle","waveDisplayGain","waveManualRangeRad"
    ];
    const lines = ["[controls]"];
    for(const key of orderedKeys){
      lines.push(`${key}: ${c[key]}`);
    }
    lines.push(`controlRevision: ${snapshot.controlRevision}`);
    lines.push(`lastControl: ${snapshot.lastControl || "--"}`);
    lines.push(`controlErrors: ${Object.keys(snapshot.controlErrors).length === 0 ? "{}" : JSON.stringify(snapshot.controlErrors)}`);
    lines.push("");
    lines.push("[physics]");
    lines.push(`ok: ${p.ok}`);
    lines.push(`configuredInputTorqueNm: ${p.inputTorqueNm}`);
    lines.push(`activeInputTorqueNm: ${p.activeInputTorqueNm}`);
    lines.push(`thetaEqRad: ${p.thetaEqRad}`);
    lines.push(`xEqM: ${p.xEqM}`);
    lines.push(`xEqMm: ${p.xEqMm}`);
    lines.push(`physicsRevision: ${snapshot.physicsRevision}`);
    lines.push(`physicsErrors: ${Object.keys(p.errors).length === 0 ? "{}" : JSON.stringify(p.errors)}`);
    lines.push("");
    lines.push("[observation]");
    if(snapshot.observation){
      const o = snapshot.observation;
      lines.push(`ok: ${o.ok}`);
      lines.push(`durationSeconds: ${o.durationSeconds}`);
      lines.push(`currentElapsedSeconds: ${o.currentElapsedSeconds}`);
      lines.push(`sampleCount: ${o.sampleCount}`);
      lines.push(`currentIndex: ${o.currentIndex}`);
      lines.push(`currentThetaRad: ${o.currentSample?.thetaRad}`);
      lines.push(`currentXMm: ${o.currentSample?.xMm}`);
      lines.push(`currentInputGate: ${o.currentSample?.inputGate}`);
      lines.push(`currentAppliedTorqueNm: ${o.currentSample?.appliedTorqueNm}`);
      lines.push(`currentSignalThetaRad: ${o.currentSample?.signalThetaRad}`);
      lines.push(`currentNoiseThetaRad: ${o.currentSample?.noiseThetaRad}`);
      lines.push(`currentNoiseEquivalentTorqueNm: ${o.currentSample?.totalNoiseEquivalentTorqueNm}`);
      lines.push(`noiseSeed: ${o.noise?.seed}`);
      lines.push(`noiseBaseTorqueNm: ${o.noise?.baseTorqueNm}`);
      lines.push(`shieldingMasterEnabled: ${o.noise?.shielding?.masterEnabled}`);
      lines.push(`shieldingPreset: ${o.noise?.shielding?.preset}`);
      lines.push(`shieldingFactors: ${JSON.stringify(o.noise?.shielding?.componentFactors || {})}`);
      lines.push(`activeInputWindowSeconds: ${o.input?.activeStartSeconds}..${o.input?.activeEndSeconds}`);
      lines.push(`omegaNatural: ${o.response?.omegaNatural}`);
      lines.push(`dampingRatio: ${o.response?.dampingRatio}`);
      lines.push(`regime: ${o.response?.regime}`);
      lines.push(`observationRevision: ${snapshot.observationRevision}`);
      lines.push(`observationErrors: ${Object.keys(o.errors).length === 0 ? "{}" : JSON.stringify(o.errors)}`);
    }
    lines.push("");
    lines.push("[analysis]");
    if(snapshot.analysis){
      const a = snapshot.analysis;
      lines.push(`ok: ${a.ok}`);
      lines.push(`elapsed.count: ${a.elapsed?.count}`);
      lines.push(`elapsed.meanThetaRad: ${a.elapsed?.meanThetaRad}`);
      lines.push(`elapsed.rmsThetaRad: ${a.elapsed?.rmsThetaRad}`);
      lines.push(`elapsed.sigmaThetaRad: ${a.elapsed?.sigmaThetaRad}`);
      lines.push(`elapsed.peakPlusThetaRad: ${a.elapsed?.peakPlusThetaRad}`);
      lines.push(`elapsed.peakMinusThetaRad: ${a.elapsed?.peakMinusThetaRad}`);
      lines.push(`elapsed.p2pThetaRad: ${a.elapsed?.p2pThetaRad}`);
      lines.push(`full.count: ${a.full?.count}`);
      lines.push(`recovery.currentResidualThetaRad: ${a.recovery?.currentResidualThetaRad}`);
      lines.push(`recovery.currentResidualRatio: ${a.recovery?.currentResidualRatio}`);
      lines.push(`recovery.recoveryFraction: ${a.recovery?.recoveryFraction}`);
      lines.push(`recovery.postMeanResidualThetaRad: ${a.recovery?.postMeanResidualThetaRad}`);
      lines.push(`recovery.postMeanResidualRatio: ${a.recovery?.postMeanResidualRatio}`);
      lines.push(`tailStability.available: ${a.tailStability?.available}`);
      lines.push(`tailStability.status: ${a.tailStability?.status}`);
      lines.push(`tailStability.deltaThetaRad: ${a.tailStability?.deltaThetaRad}`);
      lines.push(`tailStability.deltaThetaEqRatio: ${a.tailStability?.deltaThetaEqRatio}`);
      lines.push(`residualSupport.status: ${a.residualSupport?.status}`);
      lines.push(`residualSupport.residualRatio: ${a.residualSupport?.residualRatio}`);
      lines.push(`overallJudgement.status: ${a.overallJudgement?.status}`);
      lines.push(`overallJudgement.label: ${a.overallJudgement?.label}`);
      lines.push(`analysisRevision: ${snapshot.analysisRevision}`);
      lines.push(`analysisErrors: ${Object.keys(a.errors).length === 0 ? "{}" : JSON.stringify(a.errors)}`);
    }
    return lines.join("\n");
  }

  function renderControls(snapshot){
    const deviceLocked = stateApi.deviceModelPolicy[snapshot.controls.deviceModel]?.locksFields ?? false;
    for(const [key, element] of controlElements){
      setControlElementValue(element, snapshot.controls[key]);
      const hasError = Boolean(snapshot.controlErrors[key]);
      element.setAttribute("aria-invalid", String(hasError));
      element.classList.toggle("input-error", hasError);
      const editable =
        snapshot.lifecycle === Lifecycle.READY ||
        (
          snapshot.lifecycle === Lifecycle.COMPLETED &&
          completedDisplayControlKeys.includes(key)
        );
      const deviceLockedField = deviceLocked && element.dataset.deviceLocked === "true";
      element.disabled = !editable || element.dataset.alwaysDisabled === "true" || deviceLockedField;
      element.classList.toggle("device-locked-field", deviceLockedField);
    }
    for(const panel of document.querySelectorAll("[data-device-panel]")){
      panel.hidden = panel.dataset.devicePanel !== (stateApi.deviceModelPolicy[snapshot.controls.deviceModel]?.readoutPanel ?? "virtual-optical");
    }
    const waveMode = snapshot.controls.waveScaleMode;
    const waveManualRange = controlElements.get("waveManualRangeRad");
    const waveAutoStyle = controlElements.get("waveAutoStyle");
    if(waveManualRange){
      waveManualRange.disabled =
        snapshot.lifecycle !== Lifecycle.READY ||
        waveMode !== "manual";
    }
    if(waveAutoStyle){
      waveAutoStyle.disabled =
        snapshot.lifecycle !== Lifecycle.READY ||
        waveMode === "manual";
    }
    if(elements.waveApplySurvey){
      const survey = createFullWaveRangeSurvey(snapshot, snapshot.observation?.samples);
      const canApply =
        snapshot.lifecycle === Lifecycle.READY &&
        survey.sampleCount > 0;
      elements.waveApplySurvey.disabled = !canApply;
      elements.waveApplySurvey.setAttribute(
        "aria-label",
        canApply
          ? `AUTO全時間調査の推奨レンジ±${formatRad(survey.recommendedRangeRad)}radを手動固定へ適用`
          : "AUTO全時間調査値は観測準備中だけ固定へ適用できます"
      );
    }
    const noiseComponents = snapshot.observation?.noise?.components || {};
    const noiseMasterActive = snapshot.controls.noiseMaster === "on";
    const noisePresetActive = snapshot.controls.noisePreset !== "ideal";
    const componentColors = currentThemePalette().componentColors;
    for(const [componentId, color] of Object.entries(componentColors)){
      const controlPrefix = `noise${componentId[0].toUpperCase()}${componentId.slice(1)}`;
      const range = controlElements.get(`${controlPrefix}Level`);
      if(!range) continue;
      const component = noiseComponents[componentId];
      const level = Number(snapshot.controls[`${controlPrefix}Level`]);
      const visible = snapshot.controls[`${controlPrefix}Visible`] === "on";
      const effective =
        snapshot.controls[`${controlPrefix}Enabled`] === "on" &&
        level > 0 &&
        noiseMasterActive &&
        noisePresetActive;
      range.dataset.visualized = String(visible && level > 0);
      range.dataset.effective = String(effective);
      range.style.setProperty("--noise-component-color", color);
      range.setAttribute(
        "aria-label",
        `${component?.label || componentId} 強度 ${range.value}、成分線表示${visible ? "ON" : "OFF"}、観測と解析への適用${effective ? "有効" : "無効"}`
      );
    }
    if(elements.noiseEffectiveNote){
      const note =
        !noiseMasterActive
          ? {state:"off", text:"ノイズ全体OFF：全成分0（表示・強度設定は保持）"}
          : !noisePresetActive
            ? {state:"ideal", text:"Ideal適用中：全成分0（表示・強度設定は保持）"}
            : {state:"active", text:"観測へ適用中：強度0より大きい成分を使用。表示は成分線だけを切替"};
      elements.noiseEffectiveNote.dataset.state = note.state;
      elements.noiseEffectiveNote.textContent = note.text;
    }
    const shielding = snapshot.observation?.noise?.shielding;
    if(elements.opticalContainer){
      const shieldingEnabled = Boolean(shielding?.masterEnabled);
      const shieldingLevel = shieldingEnabled ? String(shielding?.preset || "none") : "none";
      elements.opticalContainer.dataset.shielding = shieldingEnabled ? "on" : "off";
      elements.opticalContainer.dataset.shieldingLevel = shieldingLevel;
      elements.opticalContainer.setAttribute(
        "aria-label",
        shieldingEnabled
          ? `光学表示、遮蔽ON、遮蔽効果${shielding?.label || "なし"}`
          : "光学表示、遮蔽OFF"
      );
    }
    if(elements.shieldingNote){
      const factors = shielding?.componentFactors || {};
      const factorText = [
        `White ×${Number(factors.white ?? 1).toFixed(2)}`,
        `drift ×${Number(factors.drift ?? 1).toFixed(2)}`,
        `periodic ×${Number(factors.periodic ?? 1).toFixed(2)}`,
        `impulse ×${Number(factors.impulse ?? 1).toFixed(2)}`,
        `optical ×${Number(factors.optical ?? 1).toFixed(2)}`,
        `numeric ×${Number(factors.numeric ?? 1).toFixed(2)}`
      ].join(" / ");
      elements.shieldingNote.textContent = shielding?.masterEnabled
        ? `遮蔽ON / ${shielding.label}：${factorText}`
        : "遮蔽OFF：全成分 ×1.00";
    }
    if(elements.impulseMeasureStatus){
      const controls = snapshot.controls || {};
      const statusLabels = {
        idle:"未測定",
        requesting:"センサー許可を確認中…",
        measuring:`測定中(${IMPULSE_MEASURE_DURATION_MS/1000}秒間、端末を軽く小突いてください)…`,
        done:"測定完了",
        error:"測定失敗(許可が得られないか、センサー値を取得できませんでした)",
        unsupported:"この端末/ブラウザはセンサーAPI未対応です"
      };
      const statusText = statusLabels[controls.impulseMeasurementStatus] || "未測定";
      const sourceText = controls.impulseAmplitudeSource === "measured"
        ? `実測モード選択中(振幅 ${Number(controls.impulseMeasuredAmplitudeRad || 0).toExponential(2)} rad、測定時倍率×${controls.impulseMeasuredAtTimeScale || 1})`
        : "理論値モード選択中";
      elements.impulseMeasureStatus.textContent =
        `${statusText} / ${sourceText}。端末センサーを利用する場合はHTTPS環境が必要です。端末やブラウザの対応状況により、センサー値を取得できない場合があります。`;
    }
    if(elements.controlRevision) elements.controlRevision.textContent = `#${snapshot.controlRevision}`;
    const errorKeys = Object.keys(snapshot.controlErrors);
    if(elements.controlStateNote){
      if(errorKeys.length > 0){
        const labels = errorKeys.map(key=>controlLabels[key] || key).join("、");
        elements.controlStateNote.textContent = `入力エラー：${labels}`;
        elements.controlStateNote.dataset.level = "error";
      }else if(snapshot.lastControl){
        elements.controlStateNote.textContent = `${controlLabels[snapshot.lastControl] || snapshot.lastControl}を状態へ保存しました。`;
        elements.controlStateNote.dataset.level = "ok";
      }else{
        elements.controlStateNote.textContent = "入力値は観測条件として保存され、計算・表示へ反映されます。";
        elements.controlStateNote.dataset.level = "normal";
      }
    }
    if(elements.headerControl){
      const last = snapshot.lastControl ? controlLabels[snapshot.lastControl] || snapshot.lastControl : "初期値";
      elements.headerControl.textContent = `入力：${last}｜更新 ${snapshot.controlRevision}`;
    }
    if(elements.controlsStateView) elements.controlsStateView.textContent = formatControlsForView(snapshot);
  }


  function clampNumber(value, min, max, fallback){
    const number = Number(value);
    if(!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, number));
  }

  function safeOpticalRangeMm(valuesMm, controls){
    const list = Array.isArray(valuesMm) ? valuesMm : [valuesMm];
    const minRangeMm = 0.001;
    const zoom = clampNumber(controls.opticsZoom, 0.1, 100, 1);
    const maxAbs = Math.max(
      minRangeMm,
      ...list.map(value=>Number.isFinite(Number(value)) ? Math.abs(Number(value)) : 0)
    );

    if(controls.opticalScaleMode === "fixed"){
      return Math.max(minRangeMm, 2 / zoom);
    }

    const safetyRatio = 0.72;
    return Math.max(minRangeMm, (maxAbs / safetyRatio) / zoom);
  }

  function formatMm(value){
    const number = Number(value);
    if(!Number.isFinite(number)) return "--";
    const abs = Math.abs(number);
    if(abs === 0) return "0.000";
    if(abs >= 100) return number.toFixed(1);
    if(abs >= 10) return number.toFixed(2);
    if(abs >= 0.01) return number.toFixed(3);
    return number.toExponential(2).replace("+", "");
  }

  function formatOpticalAxisMm(value, exponentialDigits = 2){
    const number = Number(value);
    if(!Number.isFinite(number)) return "--";
    const abs = Math.abs(number);
    if(abs > 0 && abs < 0.01){
      return number.toExponential(exponentialDigits).replace("+", "");
    }
    return formatMm(number);
  }

  function formatRad(value){
    const number = Number(value);
    if(!Number.isFinite(number)) return "--";
    if(number === 0) return "0";
    return number.toExponential(3).replace("+", "");
  }

  function formatCompactRad(value){
    const number = Number(value);
    if(!Number.isFinite(number)) return "--";
    if(number === 0) return "0";
    return number.toExponential(2).replace("+", "");
  }

  function formatWaveAxisRad(value){
    const number = Math.abs(Number(value));
    if(!Number.isFinite(number)) return "--";
    if(number === 0) return "0";
    return number.toExponential(2).replace("+", "");
  }

  function usesCompactPortraitReadouts(){
    return Boolean(window.matchMedia?.(
      "(pointer: coarse) and (orientation: portrait) and (max-width: 680px)"
    )?.matches);
  }

  function formatPercentFromRatio(value, digits = 2){
    const number = Number(value);
    if(!Number.isFinite(number)) return "--";
    return `${(number * 100).toFixed(digits)}%`;
  }

  function getOpticalDirection(shiftMm){
    const value = Number(shiftMm);
    if(!Number.isFinite(value) || Math.abs(value) < 1e-9) return "変位ほぼなし";
    return value > 0 ? "右方向 +x" : "左方向 -x";
  }

  function setupCanvas(canvas){
    const rect = canvas.getBoundingClientRect();
    const cssWidth = Math.max(1, Math.round(rect.width));
    const cssHeight = Math.max(1, Math.round(rect.height));
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const pxWidth = Math.max(1, Math.round(cssWidth * dpr));
    const pxHeight = Math.max(1, Math.round(cssHeight * dpr));
    if(canvas.width !== pxWidth || canvas.height !== pxHeight){
      canvas.width = pxWidth;
      canvas.height = pxHeight;
    }
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return {ctx, width:cssWidth, height:cssHeight};
  }

  function drawLine(ctx, x1, y1, x2, y2, stroke, width = 1){
    ctx.save();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  function drawText(ctx, text, x, y, align = "left", baseline = "alphabetic", fill = null){
    ctx.save();
    ctx.fillStyle = fill || cssColor("--canvas-text", "rgba(170,184,195,.92)");
    ctx.font = "10px system-ui,-apple-system,Hiragino Sans,Yu Gothic,Meiryo,sans-serif";
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  const opticalMotion = {
    initialized:false,
    frameId:null,
    startedAt:0,
    durationMs:110,
    fromXmm:0,
    fromThetaRad:0,
    fromTimeSeconds:0,
    targetXmm:0,
    targetThetaRad:0,
    targetTimeSeconds:0,
    currentXmm:0,
    currentThetaRad:0,
    currentTimeSeconds:0
  };

  function opticalTarget(snapshot){
    const physics = snapshot.physics;
    const observation = snapshot.observation;
    const thetaRad = observation?.ok
      ? Number(observation.currentSample?.thetaRad)
      : Number(physics.thetaEqRad);
    const xMm = observation?.ok
      ? Number(observation.currentSample?.xMm)
      : Number(physics.xEqMm);
    const timeSeconds = observation?.ok
      ? Number(observation.currentSample?.t)
      : 0;
    return {
      xMm:Number.isFinite(xMm) ? xMm : 0,
      thetaRad:Number.isFinite(thetaRad) ? thetaRad : 0,
      timeSeconds:Number.isFinite(timeSeconds) ? timeSeconds : 0
    };
  }

  function currentOpticalMotion(now = performance.now()){
    if(!opticalMotion.initialized){
      return {xMm:0, thetaRad:0, timeSeconds:0, complete:true};
    }
    const progress = Math.max(
      0,
      Math.min(1, (now - opticalMotion.startedAt) / Math.max(1, opticalMotion.durationMs))
    );
    const eased = progress;
    opticalMotion.currentXmm =
      opticalMotion.fromXmm +
      (opticalMotion.targetXmm - opticalMotion.fromXmm) * eased;
    opticalMotion.currentThetaRad =
      opticalMotion.fromThetaRad +
      (opticalMotion.targetThetaRad - opticalMotion.fromThetaRad) * eased;
    opticalMotion.currentTimeSeconds =
      opticalMotion.fromTimeSeconds +
      (opticalMotion.targetTimeSeconds - opticalMotion.fromTimeSeconds) * eased;
    return {
      xMm:opticalMotion.currentXmm,
      thetaRad:opticalMotion.currentThetaRad,
      timeSeconds:opticalMotion.currentTimeSeconds,
      complete:progress >= 1
    };
  }

  function stopOpticalMotionFrame(){
    if(opticalMotion.frameId !== null){
      cancelAnimationFrame(opticalMotion.frameId);
      opticalMotion.frameId = null;
    }
  }

  function opticalMotionFrame(timestamp){
    const motion = currentOpticalMotion(timestamp);
    if(lastSnapshot) renderOptics(lastSnapshot, motion);
    if(!motion.complete && lastSnapshot?.lifecycle === Lifecycle.RUNNING){
      opticalMotion.frameId = requestAnimationFrame(opticalMotionFrame);
    }else{
      opticalMotion.frameId = null;
    }
  }

  function requestOpticalRender(snapshot){
    const target = opticalTarget(snapshot);
    const animate = snapshot.lifecycle === Lifecycle.RUNNING;
    if(!opticalMotion.initialized || !animate){
      stopOpticalMotionFrame();
      opticalMotion.initialized = true;
      opticalMotion.startedAt = performance.now();
      opticalMotion.fromXmm = target.xMm;
      opticalMotion.fromThetaRad = target.thetaRad;
      opticalMotion.fromTimeSeconds = target.timeSeconds;
      opticalMotion.targetXmm = target.xMm;
      opticalMotion.targetThetaRad = target.thetaRad;
      opticalMotion.targetTimeSeconds = target.timeSeconds;
      opticalMotion.currentXmm = target.xMm;
      opticalMotion.currentThetaRad = target.thetaRad;
      opticalMotion.currentTimeSeconds = target.timeSeconds;
      renderOptics(snapshot, {...target, complete:true});
      return;
    }

    const now = performance.now();
    const current = currentOpticalMotion(now);
    const unchanged =
      Math.abs(target.xMm - opticalMotion.targetXmm) < 1e-15 &&
      Math.abs(target.thetaRad - opticalMotion.targetThetaRad) < 1e-18 &&
      Math.abs(target.timeSeconds - opticalMotion.targetTimeSeconds) < 1e-9;
    if(unchanged){
      renderOptics(snapshot, current);
      return;
    }

    opticalMotion.fromXmm = current.xMm;
    opticalMotion.fromThetaRad = current.thetaRad;
    opticalMotion.fromTimeSeconds = current.timeSeconds;
    opticalMotion.targetXmm = target.xMm;
    opticalMotion.targetThetaRad = target.thetaRad;
    opticalMotion.targetTimeSeconds = target.timeSeconds;
    opticalMotion.startedAt = now;
    opticalMotion.durationMs = 110;
    // Update the selected time range and timeline in the same render turn as
    // the waveform. The spot itself still starts from the interpolated value.
    renderOptics(snapshot, current);
    if(opticalMotion.frameId === null){
      opticalMotion.frameId = requestAnimationFrame(opticalMotionFrame);
    }
  }

  // IL278 G16: waveform cursor smoothing, mirroring opticalMotion above.
  // Only the cursor (current-time line + current-value point + numeric
  // readout) is tweened between real 80ms observation ticks; the plotted
  // sample history itself is never touched or fabricated.
  const waveMotion = {
    initialized:false,
    frameId:null,
    startedAt:0,
    durationMs:110,
    fromTimeSeconds:0,
    fromThetaRad:0,
    targetTimeSeconds:0,
    targetThetaRad:0,
    currentTimeSeconds:0,
    currentThetaRad:0
  };

  function waveTarget(snapshot){
    const obs = snapshot.observation;
    const timeSeconds = Number(obs?.currentSample?.t);
    const thetaRad = Number(obs?.currentSample?.thetaRad);
    return {
      timeSeconds:Number.isFinite(timeSeconds) ? timeSeconds : 0,
      thetaRad:Number.isFinite(thetaRad) ? thetaRad : 0
    };
  }

  function currentWaveMotion(now = performance.now()){
    if(!waveMotion.initialized){
      return {timeSeconds:0, thetaRad:0, complete:true};
    }
    const progress = Math.max(
      0,
      Math.min(1, (now - waveMotion.startedAt) / Math.max(1, waveMotion.durationMs))
    );
    waveMotion.currentTimeSeconds =
      waveMotion.fromTimeSeconds +
      (waveMotion.targetTimeSeconds - waveMotion.fromTimeSeconds) * progress;
    waveMotion.currentThetaRad =
      waveMotion.fromThetaRad +
      (waveMotion.targetThetaRad - waveMotion.fromThetaRad) * progress;
    return {
      timeSeconds:waveMotion.currentTimeSeconds,
      thetaRad:waveMotion.currentThetaRad,
      complete:progress >= 1
    };
  }

  function stopWaveMotionFrame(){
    if(waveMotion.frameId !== null){
      cancelAnimationFrame(waveMotion.frameId);
      waveMotion.frameId = null;
    }
  }

  function waveMotionFrame(timestamp){
    const motion = currentWaveMotion(timestamp);
    if(lastSnapshot) renderWave(lastSnapshot, motion);
    if(!motion.complete && lastSnapshot?.lifecycle === Lifecycle.RUNNING){
      waveMotion.frameId = requestAnimationFrame(waveMotionFrame);
    }else{
      waveMotion.frameId = null;
    }
  }

  function requestWaveRender(snapshot){
    const target = waveTarget(snapshot);
    const animate = snapshot.lifecycle === Lifecycle.RUNNING;
    if(!waveMotion.initialized || !animate){
      stopWaveMotionFrame();
      waveMotion.initialized = true;
      waveMotion.startedAt = performance.now();
      waveMotion.fromTimeSeconds = target.timeSeconds;
      waveMotion.fromThetaRad = target.thetaRad;
      waveMotion.targetTimeSeconds = target.timeSeconds;
      waveMotion.targetThetaRad = target.thetaRad;
      waveMotion.currentTimeSeconds = target.timeSeconds;
      waveMotion.currentThetaRad = target.thetaRad;
      renderWave(snapshot, {...target, complete:true});
      return;
    }

    const now = performance.now();
    const current = currentWaveMotion(now);
    const unchanged =
      Math.abs(target.timeSeconds - waveMotion.targetTimeSeconds) < 1e-9 &&
      Math.abs(target.thetaRad - waveMotion.targetThetaRad) < 1e-18;
    if(unchanged){
      renderWave(snapshot, current);
      return;
    }

    waveMotion.fromTimeSeconds = current.timeSeconds;
    waveMotion.fromThetaRad = current.thetaRad;
    waveMotion.targetTimeSeconds = target.timeSeconds;
    waveMotion.targetThetaRad = target.thetaRad;
    waveMotion.startedAt = now;
    waveMotion.durationMs = 110;
    renderWave(snapshot, current);
    if(waveMotion.frameId === null){
      waveMotion.frameId = requestAnimationFrame(waveMotionFrame);
    }
  }

  function renderOptics(snapshot, presentation = null){
    const canvas = elements.opticalCanvas;
    if(!canvas || !canvas.isConnected) return;

    const p = snapshot.physics;
    const obs = snapshot.observation;
    const dynamicTheta = presentation
      ? Number(presentation.thetaRad)
      : (obs?.ok ? Number(obs.currentSample?.thetaRad) : Number(p.thetaEqRad));
    const dynamicX = presentation
      ? Number(presentation.xMm)
      : (obs?.ok ? Number(obs.currentSample?.xMm) : Number(p.xEqMm));
    let shiftMm = Number.isFinite(dynamicX) ? dynamicX : 0;
    let thetaRad = Number.isFinite(dynamicTheta) ? dynamicTheta : 0;
    const observedSamples = obs?.ok && Array.isArray(obs.samples)
      ? obs.samples
          .slice(0, Math.max(0, Number(obs.currentIndex) || 0) + 1)
          .filter(sample=>
            Number.isFinite(Number(sample?.t)) &&
            Number.isFinite(Number(sample?.xMm))
          )
      : [];
    // Optical display always follows the actual observation cursor and full
    // observed history. The waveform-only full/window selector must never
    // replace the spot with the end sample of a scoped time window.
    const currentTimeSeconds = Number(obs?.currentSample?.t) || 0;
    const duration = getObservationDurationSeconds(snapshot);
    const displayTimeRange = Object.freeze({mode:"full", label:"全体", timeMin:0, timeMax:duration});
    const displaySamples = observedSamples;
    const displayCurrentTimeSeconds = currentTimeSeconds;
    const displayXValues = displaySamples.map(sample=>Number(sample.xMm)).filter(Number.isFinite);
    if(Number.isFinite(shiftMm)) displayXValues.push(shiftMm);
    const peakPlusMm = Math.max(0, ...displayXValues);
    const peakMinusMm = Math.min(0, ...displayXValues);
    const rangeMm = safeOpticalRangeMm([shiftMm, peakPlusMm, peakMinusMm], snapshot.controls);
    const direction = getOpticalDirection(shiftMm);
    const trailSeconds = clampNumber(snapshot.controls.trailSeconds, 5, 30, 10);
    const trailStartSeconds = Math.max(displayTimeRange.timeMin, displayCurrentTimeSeconds - trailSeconds);
    const trailSamples = displaySamples.filter(sample=>
      Number(sample.t) >= trailStartSeconds &&
      Number(sample.t) <= displayCurrentTimeSeconds
    );
    if(obs?.ok && Number.isFinite(shiftMm)){
      const lastTrailSample = trailSamples.at(-1);
      if(!lastTrailSample || Math.abs(Number(lastTrailSample.t) - displayCurrentTimeSeconds) > 1e-9){
        trailSamples.push({t:displayCurrentTimeSeconds, xMm:shiftMm});
      }
    }

    const {ctx, width, height} = setupCanvas(canvas);
    const colors = currentThemePalette();
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, width, height);

    const left = 58;
    const right = 14;
    const top = 34;
    const bottom = 26;
    const plotLeft = left;
    const plotRight = Math.max(plotLeft + 1, width - right);
    const plotTop = top;
    const plotBottom = Math.max(plotTop + 1, height - bottom);
    const plotWidth = plotRight - plotLeft;
    const plotHeight = plotBottom - plotTop;
    const centerX = plotLeft + plotWidth / 2;
    const centerY = plotTop + plotHeight / 2;
    const xOf = value => centerX + (Number(value) / rangeMm) * (plotWidth * 0.5);

    ctx.save();
    ctx.strokeStyle = colors.opticalGrid;
    ctx.lineWidth = 1;

    for(let index = 0; index <= 8; index += 1){
      const ratio = -1 + index / 4;
      const x = xOf(ratio * rangeMm);
      const isCenter = index === 4;
      const isMajor = index % 2 === 0;
      drawLine(
        ctx,
        x,
        plotTop,
        x,
        plotBottom,
        isCenter ? colors.axis : (isMajor ? colors.opticalGridStrong : colors.opticalGrid),
        isCenter ? 1.35 : (isMajor ? 1.15 : 0.85)
      );
    }

    [plotTop, centerY, plotBottom].forEach((y, index)=>{
      drawLine(
        ctx,
        plotLeft,
        y,
        plotRight,
        y,
        index === 1 ? colors.axis : colors.opticalGridStrong,
        index === 1 ? 1.35 : 1.15
      );
    });

    ctx.strokeStyle = colors.border;
    ctx.strokeRect(plotLeft, plotTop, plotWidth, plotHeight);
    ctx.restore();

    drawText(ctx, `+${formatMm(rangeMm)} mm`, 10, plotTop, "left", "middle");
    drawText(ctx, "0", 10, centerY, "left", "middle");
    drawText(ctx, `-${formatMm(rangeMm)} mm`, 10, plotBottom, "left", "middle");

    const createOpticalAxisLabels = (exponentialDigits, directionalInner = false) => [
      {ratio:-1, text:`-${formatOpticalAxisMm(rangeMm, exponentialDigits)}`, align:"left"},
      {
        ratio:-0.5,
        text:`-${formatOpticalAxisMm(rangeMm / 2, exponentialDigits)}`,
        align:directionalInner ? "left" : "center"
      },
      {ratio:0, text:"0", align:"center"},
      {
        ratio:0.5,
        text:`+${formatOpticalAxisMm(rangeMm / 2, exponentialDigits)}`,
        align:directionalInner ? "right" : "center"
      },
      {ratio:1, text:`+${formatOpticalAxisMm(rangeMm, exponentialDigits)} mm`, align:"right"}
    ];
    const labelBounds = label =>{
      const x = xOf(label.ratio * rangeMm);
      const width = ctx.measureText(label.text).width;
      if(label.align === "left") return {left:x, right:x + width};
      if(label.align === "right") return {left:x - width, right:x};
      return {left:x - width / 2, right:x + width / 2};
    };
    const labelsOverlap = labels =>{
      const minimumGap = 8;
      const pairs = [[labels[0], labels[1]], [labels[3], labels[4]]];
      return pairs.some(([first, second])=>{
        const firstBounds = labelBounds(first);
        const secondBounds = labelBounds(second);
        return firstBounds.right + minimumGap > secondBounds.left;
      });
    };

    ctx.save();
    ctx.font = "10px system-ui,-apple-system,Hiragino Sans,Yu Gothic,Meiryo,sans-serif";
    let opticalAxisLabels = createOpticalAxisLabels(2);
    if(labelsOverlap(opticalAxisLabels)){
      opticalAxisLabels = createOpticalAxisLabels(1);
    }
    if(labelsOverlap(opticalAxisLabels)){
      opticalAxisLabels = createOpticalAxisLabels(1, true);
    }
    if(labelsOverlap(opticalAxisLabels)){
      opticalAxisLabels = createOpticalAxisLabels(0, true);
    }
    ctx.restore();

    opticalAxisLabels.forEach(label=>{
      const labelX = xOf(label.ratio * rangeMm);
      drawLine(ctx, labelX, plotBottom, labelX, plotBottom + 4, colors.opticalGridStrong, 1);
      drawText(
        ctx,
        label.text,
        labelX,
        plotBottom + 7,
        label.align,
        "top"
      );
    });

    const denseTrail = [];
    for(let index = 0; index < trailSamples.length; index += 1){
      const sample = trailSamples[index];
      const previous = trailSamples[index - 1];
      if(!previous){
        denseTrail.push(sample);
        continue;
      }
      const previousX = xOf(Number(previous.xMm));
      const sampleX = xOf(Number(sample.xMm));
      const steps = Math.max(1, Math.min(24, Math.ceil(Math.abs(sampleX - previousX) / 3)));
      for(let step = 1; step <= steps; step += 1){
        const ratio = step / steps;
        denseTrail.push({
          t:Number(previous.t) + (Number(sample.t) - Number(previous.t)) * ratio,
          xMm:Number(previous.xMm) + (Number(sample.xMm) - Number(previous.xMm)) * ratio
        });
      }
    }

    const zeroTrailGapMm = (4 * rangeMm) / Math.max(1, plotWidth);
    for(const sample of denseTrail){
      const value = Number(sample.xMm);
      if(Math.abs(value) <= zeroTrailGapMm) continue;
      const progress = Math.max(
        0,
        Math.min(1, (Number(sample.t) - trailStartSeconds) / Math.max(0.001, trailSeconds))
      );
      const positive = value > 0;
      const trailY = centerY;
      ctx.save();
      ctx.beginPath();
      ctx.rect(
        positive ? centerX : plotLeft,
        plotTop,
        positive ? plotRight - centerX : centerX - plotLeft,
        plotHeight
      );
      ctx.clip();
      ctx.globalAlpha = 0.18 + progress * 0.54;
      ctx.fillStyle = positive ? colors.opticalPositive : colors.opticalNegative;
      ctx.beginPath();
      ctx.arc(
        Math.max(plotLeft, Math.min(plotRight, xOf(value))),
        trailY,
        1.55,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.restore();
    }

    const spotX = Math.max(plotLeft, Math.min(plotRight, xOf(shiftMm)));
    drawLine(ctx, centerX, centerY, spotX, centerY, colors.connector, 1.5);
    drawLine(ctx, spotX, plotTop, spotX, plotBottom, colors.gridStrong, 1);

    ctx.save();
    ctx.beginPath();
    ctx.arc(spotX, centerY, 7.5, 0, Math.PI * 2);
    ctx.globalAlpha = 0.13;
    ctx.fillStyle = colors.spotBorder;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(spotX, centerY, 4.5, 0, Math.PI * 2);
    ctx.globalAlpha = 0.28;
    ctx.fillStyle = colors.spot;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(spotX, centerY, 2.4, 0, Math.PI * 2);
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 5;
    ctx.shadowColor = colors.spotBorder;
    ctx.fillStyle = colors.spot;
    ctx.fill();
    ctx.restore();

    function drawOpticalPeakMarker(value, label, color, positive){
      if((positive && value <= 0) || (!positive && value >= 0)) return;
      const peakX = Math.max(plotLeft, Math.min(plotRight, xOf(value)));
      ctx.save();
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.74;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(peakX, plotTop);
      ctx.lineTo(peakX, plotBottom);
      ctx.stroke();
      ctx.restore();
      drawText(
        ctx,
        label,
        Math.max(plotLeft + 20, Math.min(plotRight - 20, peakX)),
        positive ? plotTop + 13 : plotBottom - 7,
        "center",
        "middle",
        color
      );
    }

    drawOpticalPeakMarker(peakPlusMm, "+Peak", colors.opticalPositive, true);
    drawOpticalPeakMarker(peakMinusMm, "−Peak", colors.opticalNegative, false);

    const compactReadouts = usesCompactPortraitReadouts();
    const mmUnit = compactReadouts ? "" : " mm";
    const radUnit = compactReadouts ? "" : " rad";
    if(elements.opticalCur) elements.opticalCur.textContent = `${formatMm(shiftMm)}${mmUnit}`;
    if(elements.opticalAngle) elements.opticalAngle.textContent = `${formatRad(thetaRad)}${radUnit}`;
    if(elements.opticalPeakPlus) elements.opticalPeakPlus.textContent = `${formatMm(peakPlusMm)}${mmUnit}`;
    if(elements.opticalPeakMinus) elements.opticalPeakMinus.textContent = `${formatMm(peakMinusMm)}${mmUnit}`;
    if(elements.opticalScale) elements.opticalScale.textContent = `±${formatMm(rangeMm)}${mmUnit}`;
    if(elements.opticalDirection) elements.opticalDirection.textContent = direction;

    const opticalTimeAxis = createSharedTimeAxis(
      displayTimeRange.timeMin,
      displayTimeRange.timeMax,
      0,
      plotWidth
    );
    const timeline = obs?.timeline;
    const windows = timeline?.windows;
    const currentPosition = opticalTimeAxis.positionAt(displayCurrentTimeSeconds);
    const setOpticalTimelineSpan = (element, window)=>{
      if(!element || !window) return;
      const start = opticalTimeAxis.positionAt(window.start);
      const end = opticalTimeAxis.positionAt(window.end);
      element.style.left = `${start.ratio * 100}%`;
      element.style.width = `${Math.max(0, end.ratio - start.ratio) * 100}%`;
      element.hidden = end.ratio <= start.ratio;
    };
    setOpticalTimelineSpan(elements.opticalTimelinePre, windows?.preBaseline);
    setOpticalTimelineSpan(elements.opticalTimelineActive, windows?.activePeriod);
    setOpticalTimelineSpan(elements.opticalTimelinePost, windows?.postBaseline);
    if(elements.opticalTimelineWindow){
      const mainStart = opticalTimeAxis.positionAt(windows?.mainEvaluation?.start ?? duration * 0.25);
      const mainEnd = opticalTimeAxis.positionAt(windows?.mainEvaluation?.end ?? duration * 0.53);
      elements.opticalTimelineWindow.style.left = `${mainStart.ratio * 100}%`;
      elements.opticalTimelineWindow.style.width = `${Math.max(0, mainEnd.ratio - mainStart.ratio) * 100}%`;
    }
    if(elements.opticalTimelineCurrent){
      elements.opticalTimelineCurrent.style.left = `${currentPosition.ratio * 100}%`;
    }
    document.querySelectorAll("[data-optical-timeline-label]").forEach(label=>{
      const ratio = clampNumber(label.dataset.opticalTimelineLabel, 0, 1, 0);
      label.textContent = formatTimeLabel(opticalTimeAxis.timeAtRatio(ratio));
    });
    if(elements.opticalTimelineTrack){
      const timelineWidth = elements.opticalTimelineTrack.clientWidth;
      const widthDifference = Number.isFinite(timelineWidth)
        ? Math.abs(timelineWidth - plotWidth)
        : Infinity;
      const toleranceCssPx = 1 / Math.max(1, window.devicePixelRatio || 1);
      elements.opticalTimelineTrack.dataset.axisAlignment =
        widthDifference <= toleranceCssPx ? "ok" : "mismatch";
      elements.opticalTimelineTrack.dataset.currentPhase =
        timeline?.currentPhase?.id || "active";
      elements.opticalTimelineTrack.setAttribute(
        "aria-label",
        `${timeline?.currentPhase?.label || "観測"}。${displayTimeRange.label} ${formatTimeLabel(opticalTimeAxis.timeMin)}–${formatTimeLabel(opticalTimeAxis.timeMax)}、現在 ${formatTimeLabel(currentPosition.timeSeconds)}`
      );
    }
    if(elements.opticalContainer){
      elements.opticalContainer.dataset.timeRangeMode = displayTimeRange.mode;
      elements.opticalContainer.dataset.timeMin = String(opticalTimeAxis.timeMin);
      elements.opticalContainer.dataset.timeMax = String(opticalTimeAxis.timeMax);
    }

    // IL278: vernier readout mirrors the same shift/range as the optical spot,
    // just rendered as a fixed main scale with a moving pointer.
    renderVernier(shiftMm, rangeMm);
  }

  function renderVernier(shiftMm, rangeMm){
    const canvas = elements.vernierCanvas;
    if(!canvas || !canvas.isConnected) return;

    const shift = Number.isFinite(shiftMm) ? shiftMm : 0;
    const range = Number.isFinite(rangeMm) && rangeMm > 0 ? rangeMm : 1;

    // Auto scale: 1 main division = a "nice" (1/2/5 x 10^n) mm value so the
    // whole scale spans roughly 10 divisions, matching the optical auto-range.
    const rawDivMm = (range * 2) / 10;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawDivMm)));
    const normalized = rawDivMm / magnitude;
    const niceMultiplier = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
    const divMm = niceMultiplier * magnitude;

    const {ctx, width, height} = setupCanvas(canvas);
    const colors = currentThemePalette();
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, width, height);

    // Vertical layout: main scale and vernier are two adjacent rulers sharing
    // almost the same baseline (like a real vernier caliper).
    const mainScaleY = Math.max(30, Math.round(height * 0.30));
    const vernierScaleY = mainScaleY + 14;
    const vernierBottom = vernierScaleY + 26;
    // If there's vertical room, the big value sits BELOW the rulers (portrait).
    // If not (short landscape panels), it sits to the RIGHT of the rulers so it
    // never gets clipped. Decide the mode here.
    const valueBelow = height - vernierBottom >= 46;
    const valueRight = !valueBelow;

    // In right-value mode the rulers occupy the left ~66% and the value the
    // right ~34%. Otherwise the rulers span the usual centered 60%.
    const rulerAreaWidth = valueRight ? width * 0.66 : width;
    const mainScaleWidth = (valueRight ? rulerAreaWidth : width) * 0.82;
    const centerX = valueRight ? rulerAreaWidth / 2 : width / 2;
    const mainLeft = centerX - mainScaleWidth / 2;
    const mainRight = centerX + mainScaleWidth / 2;
    const valueY = valueBelow ? vernierBottom + 20 : Math.round(height * 0.44);
    const hasRoomForValue = true; // always shown now (below or to the right)

    // ---- Sliding main-scale window ----
    // The vernier needs 9 main divisions of room (10 steps * 0.9). We show an
    // 11-division window (9 for the vernier + 1 margin each side) that slides
    // in whole-division steps to always contain the reading point and the
    // vernier that extends 9 divisions to its right. Only the visible window
    // shifts; the tick spacing and the 0.9 vernier ratio never change, so the
    // geometric coincidence stays exact — this is a viewport, not a rescale.
    const readDivRaw = shift / divMm;
    const mainInteger = Math.floor(readDivRaw);
    const WINDOW_DIVS = 11;
    const windowStart = mainInteger - 1; // 1 division of margin left of the pointer
    const mainPxPerDiv = mainScaleWidth / WINDOW_DIVS;
    const pointerX = mainLeft + (readDivRaw - windowStart) * mainPxPerDiv;
    const clipped = false; // the window always contains the reading; nothing is ever off-scale

    // ---- Main scale (upper, fixed tick spacing, sliding window) ----
    ctx.strokeStyle = colors.axis;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(mainLeft, mainScaleY); ctx.lineTo(mainRight, mainScaleY); ctx.stroke();

    ctx.textAlign = "center";
    for(let d = windowStart; d <= windowStart + WINDOW_DIVS; d += 1){
      const px = mainLeft + (d - windowStart) * mainPxPerDiv;
      if(px < mainLeft - 0.5 || px > mainRight + 0.5) continue;
      ctx.strokeStyle = colors.axis;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(px, mainScaleY - 12); ctx.lineTo(px, mainScaleY); ctx.stroke();
      ctx.fillStyle = colors.text;
      ctx.font = "13px system-ui";
      ctx.fillText(String(d), px, mainScaleY - 16);
    }

    // ---- Vernier reading (the whole point of a vernier) ----
    // A vernier reads the fractional division by finding which sub-scale mark
    // lines up with a main-scale tick. The main scale gives the integer part;
    // the coincident vernier mark gives the first decimal (0.1 div resolution
    // for a 10-step vernier). The displayed value is REBUILT from this vernier
    // reading so the highlighted mark and the shown number always agree.
    const VERNIER_STEPS = 10;
    const vernierStepPx = mainPxPerDiv * 0.9;

    // ---- TRUE vernier construction ----
    // A real vernier's sub-scale is slightly finer: its 10 divisions span 9
    // main divisions, so vernier-step = 0.9 * main-step. The vernier "0" is
    // placed AT the reading point (the continuous position). Because of the
    // 0.9 ratio, exactly one vernier line then coincides with a main-scale
    // line, and that vernier index is the first decimal of the reading. This
    // coincidence is GEOMETRIC (the lines really do overlap), not computed
    // and painted after the fact. The window above always has 1 division of
    // margin left of the pointer and (11-9-1)=1 division of margin right of
    // the vernier's far end, so the whole vernier fits with a bit to spare.
    const fracRaw = readDivRaw - mainInteger; // 0..1 continuous fraction

    let coincidentIndex = Math.round(fracRaw * VERNIER_STEPS) % VERNIER_STEPS;
    let readMainInteger = mainInteger;
    if(Math.round(fracRaw * VERNIER_STEPS) >= VERNIER_STEPS){ readMainInteger = mainInteger + 1; }

    const vernierReadDiv = readMainInteger + coincidentIndex / VERNIER_STEPS;

    // Vernier "0" sits exactly at the reading point (true bariner geometry).
    const vernierZeroX = pointerX;

    ctx.strokeStyle = colors.series;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(vernierZeroX, vernierScaleY);
    ctx.lineTo(vernierZeroX + VERNIER_STEPS * vernierStepPx, vernierScaleY);
    ctx.stroke();

    for(let i = 0; i <= VERNIER_STEPS; i += 1){
      const px = vernierZeroX + i * vernierStepPx;
      const label = i; // vernier 0 sits at the reading point
      const isCoincident = label === coincidentIndex;
      ctx.strokeStyle = isCoincident ? colors.opticalPositive : colors.series;
      ctx.lineWidth = isCoincident ? 3 : 1.5;
      ctx.beginPath(); ctx.moveTo(px, vernierScaleY); ctx.lineTo(px, vernierScaleY + 12); ctx.stroke();
      if(label % 5 === 0 || isCoincident){
        ctx.fillStyle = isCoincident ? colors.opticalPositive : colors.text;
        ctx.font = isCoincident ? "bold 12px system-ui" : "11px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(String(label), px, vernierScaleY + 22);
      }
    }

    // ---- reading pointer: small triangle in the gap between main & vernier ----
    ctx.fillStyle = clipped ? colors.peakPlus : colors.opticalNegative;
    ctx.beginPath();
    ctx.moveTo(pointerX, mainScaleY + 1);
    ctx.lineTo(pointerX - 5, mainScaleY + 8);
    ctx.lineTo(pointerX + 5, mainScaleY + 8);
    ctx.closePath();
    ctx.fill();

    // highlight the coincident mark: thin dashed guide bridging the two baselines
    const coincidentX = vernierZeroX + coincidentIndex * vernierStepPx;
    ctx.strokeStyle = colors.opticalPositive;
    ctx.lineWidth = 1;
    ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(coincidentX, mainScaleY); ctx.lineTo(coincidentX, vernierScaleY + 12); ctx.stroke();
    ctx.setLineDash([]);

    // ---- Large current reading value (AS READ on the vernier) ----
    // Displayed to 0.1-div resolution — the vernier's real resolving power.
    // The raw continuous value is shown as a smaller reference in mm.
    const vernierReadMm = vernierReadDiv * divMm;
    const readSign = vernierReadDiv >= 0 ? "+" : "";
    const bigText = `${readSign}${vernierReadDiv.toFixed(1)} div`;
    const subText = `${readSign}${formatScientific(vernierReadMm, 3)} mm  ／  1 div = ${formatScientific(divMm, 2)} mm`;

    if(valueRight){
      // Landscape: place the value to the RIGHT of the rulers, vertically
      // centered on the ruler pair, so short panels never clip it.
      const rightCenterX = rulerAreaWidth + (width - rulerAreaWidth) / 2;
      const midY = (mainScaleY + vernierScaleY) / 2;
      ctx.fillStyle = colors.text;
      ctx.textAlign = "center";
      ctx.font = "bold 22px system-ui";
      ctx.fillText(bigText, rightCenterX, midY + 2);
      ctx.font = "10px system-ui";
      ctx.fillText(subText, rightCenterX, midY + 20);
      if(clipped){
        ctx.fillStyle = colors.peakPlus;
        ctx.font = "10px system-ui";
        ctx.fillText("※ 振り切れ", rightCenterX, midY + 36);
      }
    } else {
      // Portrait: value sits below the rulers, centered.
      ctx.fillStyle = colors.text;
      ctx.textAlign = "center";
      ctx.font = "bold 22px system-ui";
      ctx.fillText(bigText, centerX, valueY);
      if(height - valueY >= 18){
        ctx.font = "11px system-ui";
        ctx.fillText(subText, centerX, valueY + 16);
      }
      if(clipped){
        ctx.fillStyle = colors.peakPlus;
        ctx.font = "10px system-ui";
        ctx.fillText("※ 振り切れ", centerX, vernierBottom + 12);
      }
    }

    // Header shows the vernier reading (0.1 div) with the raw continuous value
    // in parentheses so the resolving limit is transparent.
    const readText = `${readSign}${vernierReadDiv.toFixed(1)} div（連続値 ${shift >= 0 ? "+" : ""}${formatScientific(shift, 3)} mm）${clipped ? " ※振り切れ" : ""}`;
    if(elements.vernierReadText) elements.vernierReadText.textContent = readText;
  }

  function renderPhysics(snapshot){
    const p = snapshot.physics;
    const thetaText = formatScientific(p.thetaEqRad, 3);
    const xText = p.ok ? `${formatFixed(p.xEqMm, 3)} mm` : "--";
    const statusText = p.ok ? `θ ${thetaText}` : "error";
    const regime = snapshot.observation?.response?.regime || "--";
    if(elements.headerPhysics) elements.headerPhysics.textContent = `物理：θeq ${thetaText} / xeq ${xText} / ${regime}`;
    if(elements.physicsStatus){
      const analysisCount = snapshot.analysis?.elapsed?.count ?? 0;
      elements.physicsStatus.textContent = snapshot.analysis?.ok
        ? `${statusText} / A#${snapshot.analysisRevision} n=${analysisCount}`
        : statusText;
    }
    if(elements.opticalCur) elements.opticalCur.textContent = xText;
    if(elements.opticalScale) elements.opticalScale.textContent = `L ${snapshot.controls.opticalDistanceM} m`;
    // Wave readouts are updated by renderWave() from IL267 onward.
  }


  function getObservationDurationSeconds(snapshot){
    const c = snapshot.controls;
    if(c.durationMode === "manual"){
      return clampNumber(c.manualDurationPreset, 60, 28800, 300);
    }

    const text = String(c.initialDurationView || "");
    const match = text.match(/(\d+(?:\.\d+)?)\s*秒/);
    if(match) return clampNumber(Number(match[1]), 60, 3600, 300);
    return 300;
  }

  let fixedCurrentWaveRangeRad = null;
  let lockedFullAutoRange = null;
  let previousWaveScaleMode = "auto";

  function finiteWaveSamples(samples){
    return (Array.isArray(samples) ? samples : []).filter(sample=>
      Number.isFinite(Number(sample?.t)) &&
      Number.isFinite(Number(sample?.thetaRad))
    );
  }

  function observedWaveSamples(observation){
    const full = finiteWaveSamples(observation?.samples);
    if(!full.length) return [];
    const index = clampNumber(observation?.currentIndex, 0, full.length - 1, 0);
    return full.slice(0, Math.floor(index) + 1);
  }

  function recentWaveSamples(samples, seconds = 5){
    const source = finiteWaveSamples(samples);
    if(source.length < 2) return source;
    const end = Number(source.at(-1)?.t) || 0;
    const start = Math.max(0, end - Math.max(0.1, Number(seconds) || 5));
    const recent = source.filter(sample=>sample.t >= start);
    return recent.length >= 2 ? recent : source.slice(-2);
  }

  function niceWaveRangeRad(requiredRange){
    const safe = Math.max(1e-12, Math.abs(Number(requiredRange) || 0));
    const exponent = Math.floor(Math.log10(safe));
    const magnitude = 10 ** exponent;
    const normalized = safe / magnitude;
    const factor = normalized <= 1
      ? 1
      : normalized <= 1.5
        ? 1.5
        : normalized <= 2
          ? 2
          : normalized <= 3
            ? 3
            : normalized <= 5
              ? 5
              : 10;
    return Math.min(1e12, Math.max(1e-12, factor * magnitude));
  }

  function createFullWaveRangeSurvey(snapshot, fullSamples){
    const source = finiteWaveSamples(fullSamples);
    let sampleMaxAbsRad = 0;
    for(const sample of source){
      sampleMaxAbsRad = Math.max(sampleMaxAbsRad, Math.abs(Number(sample.thetaRad) || 0));
    }
    const thetaEqAbsRad = Math.abs(Number(snapshot.physics?.thetaEqRad) || 0);
    const maxAbsRad = Math.max(1e-12, thetaEqAbsRad, sampleMaxAbsRad);
    return Object.freeze({
      maxAbsRad,
      sampleMaxAbsRad,
      thetaEqAbsRad,
      recommendedRangeRad:niceWaveRangeRad(maxAbsRad * 1.25),
      sampleCount:source.length
    });
  }

  function withWaveRangeDiagnostics(base, survey, fullSamples){
    const rangeRad = Math.max(1e-12, Math.abs(Number(base.rangeRad) || 0));
    let overflowSampleCount = 0;
    for(const sample of finiteWaveSamples(fullSamples)){
      if(Math.abs(Number(sample.thetaRad) || 0) > rangeRad) overflowSampleCount += 1;
    }
    const overflowRatio = survey.maxAbsRad / rangeRad;
    return Object.freeze({
      ...base,
      rangeRad,
      surveyMaxAbsRad:survey.maxAbsRad,
      surveySampleCount:survey.sampleCount,
      recommendedRangeRad:survey.recommendedRangeRad,
      overflow:overflowRatio > 1 + 1e-9,
      overflowRatio,
      overflowSampleCount,
      marginRatio:(rangeRad / survey.maxAbsRad) - 1
    });
  }

  function formatWaveOverflowRatio(value){
    const ratio = Math.max(0, Number(value) || 0);
    return ratio < 1000
      ? ratio.toFixed(2)
      : ratio.toExponential(2).replace("+", "");
  }

  function niceNoiseDisplayGain(rawGain){
    const safe = Math.max(1, Math.min(1e6, Number(rawGain) || 1));
    if(safe <= 1) return 1;
    const exponent = Math.floor(Math.log10(safe));
    const magnitude = 10 ** exponent;
    const normalized = safe / magnitude;
    const factor = normalized >= 5 ? 5 : normalized >= 2 ? 2 : 1;
    return Math.max(1, Math.min(1e6, factor * magnitude));
  }

  function resolveNoiseComponentDisplayGain(fullSamples, visibleComponents, componentFields, rangeRad){
    if(!visibleComponents.length) return Object.freeze({gain:1, maxAbsThetaRad:0, targetRatio:0.18});
    // IL278 ノイズ仕様D-fix2: exclude impulse from the gain's own max-value
    // search. impulse is deliberately ~1e4x larger than the other components
    // (a rare sharp bump, not continuous background noise), so including it
    // here defeats the gain entirely (forces gain=1, leaving White/drift/
    // periodic/optical/numeric invisible at their true tiny scale) even
    // though the range itself comfortably includes impulse's peak with
    // headroom. impulse is still drawn on the plot at its own true scale
    // (no gain applied to it specifically) -- only the OTHER components get
    // auto-boosted for visibility.
    const gainComponents = visibleComponents.filter(component => component.id !== "impulse");
    if(!gainComponents.length) return Object.freeze({gain:1, maxAbsThetaRad:0, targetRatio:0.18});
    let maxAbsThetaRad = 0;
    for(const sample of fullSamples){
      for(const component of gainComponents){
        const field = componentFields[component.id];
        const value = Math.abs(Number(sample?.[field]));
        if(Number.isFinite(value)) maxAbsThetaRad = Math.max(maxAbsThetaRad, value);
      }
    }
    if(maxAbsThetaRad <= 0 || !Number.isFinite(Number(rangeRad))){
      return Object.freeze({gain:1, maxAbsThetaRad, targetRatio:0.18});
    }
    const targetRatio = 0.18;
    const rawGain = (Math.abs(Number(rangeRad)) * targetRatio) / maxAbsThetaRad;
    return Object.freeze({
      gain:niceNoiseDisplayGain(rawGain),
      maxAbsThetaRad,
      targetRatio
    });
  }

  function formatNoiseDisplayGain(gain){
    const value = Math.max(1, Number(gain) || 1);
    if(value >= 1e6) return "1e6";
    if(value >= 1000) return value.toLocaleString("en-US", {maximumFractionDigits:0});
    return String(value);
  }

  function resolveWaveRange(snapshot, observedSamples, fullSamples){
    const controls = snapshot.controls;
    const style = controls.waveAutoStyle;
    const gain = clampNumber(controls.waveDisplayGain, 1, 5, 1);
    const thetaEq = Number(snapshot.physics?.thetaEqRad) || 0;
    const recent = recentWaveSamples(observedSamples, 5);
    const survey = createFullWaveRangeSurvey(snapshot, fullSamples);

    const source =
      style === "precise" ? finiteWaveSamples(fullSamples) :
      style === "five-sec" ? recent :
      finiteWaveSamples(observedSamples);

    const expectedFloor =
      style === "precise" ? Math.abs(thetaEq) :
      style === "observe" ? Math.abs(thetaEq) * 0.25 :
      0;

    // IL278 ノイズ仕様D-fix2: reverted to including impulse's contribution when
    // sizing the range (matches the original *1.18-headroom design where a
    // peak comfortably sits at ~85% of the plot height, rather than being
    // hard-clipped at the edge). The earlier "exclude impulse from range"
    // attempt (removed here) was based on an incomplete diagnosis: the real
    // reason White/drift/periodic looked invisible was that impulse was ALSO
    // dominating the *gain* calculation (see resolveNoiseComponentDisplayGain
    // below), not the range itself -- componentAutoGain already rescues
    // small components just fine even with impulse included in range, once
    // impulse itself is excluded from the gain's own max-value search.
    let maxAbs = Math.max(1e-12, expectedFloor);
    for(const sample of source){
      maxAbs = Math.max(maxAbs, Math.abs(Number(sample.thetaRad) || 0));
    }
    const autoRange = niceWaveRangeRad((maxAbs * 1.25) / gain);
    const mode = controls.waveScaleMode;
    const sequence = Number(snapshot.session?.sequence) || 0;

    if(snapshot.lifecycle === Lifecycle.READY){
      lockedFullAutoRange = null;
    }

    if(mode !== previousWaveScaleMode){
      fixedCurrentWaveRangeRad = mode === "fixed-current" ? autoRange : null;
      previousWaveScaleMode = mode;
    }

    if(mode === "manual"){
      fixedCurrentWaveRangeRad = null;
      return withWaveRangeDiagnostics({
        rangeRad: clampNumber(controls.waveManualRangeRad, 1e-12, 1e12, autoRange),
        mode,
        style,
        sourceLabel: "手動固定",
        locked:true,
        gain
      }, survey, fullSamples);
    }

    if(mode === "fixed-current"){
      if(!Number.isFinite(fixedCurrentWaveRangeRad)){
        fixedCurrentWaveRangeRad = autoRange;
      }
      return withWaveRangeDiagnostics({
        rangeRad: fixedCurrentWaveRangeRad,
        mode,
        style,
        sourceLabel: "現在表示で固定",
        locked:true,
        gain
      }, survey, fullSamples);
    }

    fixedCurrentWaveRangeRad = null;
    if(style === "precise"){
      if(snapshot.lifecycle !== Lifecycle.READY){
        if(!lockedFullAutoRange || lockedFullAutoRange.sequence !== sequence){
          lockedFullAutoRange = Object.freeze({
            sequence,
            rangeRad:autoRange
          });
        }
        return withWaveRangeDiagnostics({
          rangeRad:lockedFullAutoRange.rangeRad,
          mode:"auto",
          style,
          sourceLabel:"AUTO全時間調査・固定",
          locked:true,
          gain
        }, survey, fullSamples);
      }
      return withWaveRangeDiagnostics({
        rangeRad:autoRange,
        mode:"auto",
        style,
        sourceLabel:"AUTO全時間調査・待機",
        locked:false,
        gain
      }, survey, fullSamples);
    }

    return withWaveRangeDiagnostics({
      rangeRad:autoRange,
      mode:"auto",
      style,
      sourceLabel:style === "five-sec" ? "直近5秒追従" : "観測済み追従",
      locked:false,
      gain
    }, survey, fullSamples);
  }

  function decimateWaveSamples(samples, maxPoints = 720){
    const source = finiteWaveSamples(samples);
    const limit = Math.max(32, Math.floor(Number(maxPoints) || 720));
    if(source.length <= limit) return source;

    const result = [source[0]];
    const interiorCount = source.length - 2;
    const bucketCount = Math.max(1, Math.floor((limit - 2) / 2));

    for(let bucket = 0; bucket < bucketCount; bucket += 1){
      const start = 1 + Math.floor((interiorCount * bucket) / bucketCount);
      const end = 1 + Math.floor((interiorCount * (bucket + 1)) / bucketCount);
      if(end <= start) continue;

      let minSample = source[start];
      let maxSample = source[start];
      let minIndex = start;
      let maxIndex = start;

      for(let index = start + 1; index < end; index += 1){
        if(source[index].thetaRad < minSample.thetaRad){
          minSample = source[index];
          minIndex = index;
        }
        if(source[index].thetaRad > maxSample.thetaRad){
          maxSample = source[index];
          maxIndex = index;
        }
      }

      if(minIndex <= maxIndex){
        result.push(minSample);
        if(maxIndex !== minIndex) result.push(maxSample);
      }else{
        result.push(maxSample);
        result.push(minSample);
      }
    }

    result.push(source.at(-1));
    return result;
  }

  function waveExtrema(samples){
    const source = finiteWaveSamples(samples);
    if(!source.length) return Object.freeze({peakPlus:null, peakMinus:null});
    let peakPlus = source[0];
    let peakMinus = source[0];
    for(const sample of source){
      if(sample.thetaRad > peakPlus.thetaRad) peakPlus = sample;
      if(sample.thetaRad < peakMinus.thetaRad) peakMinus = sample;
    }
    return Object.freeze({peakPlus, peakMinus});
  }

  function formatTimeLabel(seconds){
    const value = Number(seconds);
    if(!Number.isFinite(value)) return "--";
    if(value >= 60 && value % 60 === 0) return `${value.toFixed(0)}s`;
    if(value >= 10) return `${value.toFixed(0)}s`;
    return `${value.toFixed(1)}s`;
  }

  function generateStaticWaveSamples(thetaEqRad, durationSeconds, sampleCount = 160){
    const theta = Number.isFinite(Number(thetaEqRad)) ? Number(thetaEqRad) : 0;
    const duration = Math.max(1, Number(durationSeconds) || 300);
    const samples = [];

    for(let i = 0; i < sampleCount; i += 1){
      const ratio = sampleCount <= 1 ? 0 : i / (sampleCount - 1);
      const t = ratio * duration;
      const response = 1 - Math.exp(-ratio * 3.2) * Math.cos(ratio * Math.PI * 4.1);
      const smallSettling = 0.08 * Math.sin(ratio * Math.PI * 3.0) * (1 - ratio);
      const y = theta * (0.12 + 0.82 * response + smallSettling);
      samples.push({t, theta:y});
    }

    return samples;
  }

  function updateTimeLabels(timeAxis){
    const update = (selector, attr)=>{
      document.querySelectorAll(selector).forEach(node=>{
        const ratio = Number(node.getAttribute(attr));
        if(Number.isFinite(ratio)){
          node.textContent = formatTimeLabel(timeAxis.timeAtRatio(ratio));
        }
      });
    };
    update("[data-wave-x-label]", "data-wave-x-label");
    update("[data-timeline-label]", "data-timeline-label");
  }

  function resolveDisplayTimeRange(snapshot, currentTimeSeconds){
    const duration = Math.max(
      1,
      Number(snapshot.observation?.durationSeconds) || getObservationDurationSeconds(snapshot)
    );
    const current = Math.max(0, Math.min(duration, Number(currentTimeSeconds) || 0));
    if(displayTimeRangeMode !== "window"){
      return Object.freeze({mode:"full", label:"全体", timeMin:0, timeMax:duration});
    }
    const mainWindow = snapshot.lifecycle === Lifecycle.COMPLETED
      ? snapshot.observation?.timeline?.windows?.mainEvaluation
      : null;
    const mainStart = Number(mainWindow?.start);
    const mainEnd = Number(mainWindow?.end);
    if(Number.isFinite(mainStart) && Number.isFinite(mainEnd) && mainEnd > mainStart){
      const timeMin = Math.max(0, Math.min(duration, mainStart));
      const timeMax = Math.max(timeMin, Math.min(duration, mainEnd));
      if(timeMax > timeMin){
        return Object.freeze({mode:"window", label:"主評価窓", timeMin, timeMax});
      }
    }
    const timeMax = current < DISPLAY_WINDOW_SECONDS
      ? Math.min(duration, DISPLAY_WINDOW_SECONDS)
      : current;
    const timeMin = Math.max(0, timeMax - DISPLAY_WINDOW_SECONDS);
    return Object.freeze({mode:"window", label:"窓", timeMin, timeMax});
  }

  function createSharedTimeAxis(timeMinSeconds, timeMaxSeconds, plotLeft, plotRight){
    const timeMin = Number.isFinite(Number(timeMinSeconds)) ? Number(timeMinSeconds) : 0;
    const requestedMax = Number.isFinite(Number(timeMaxSeconds)) ? Number(timeMaxSeconds) : timeMin + 1;
    const timeMax = Math.max(timeMin + 1e-9, requestedMax);
    const duration = timeMax - timeMin;
    const left = Number.isFinite(Number(plotLeft)) ? Number(plotLeft) : 0;
    const right = Math.max(left + 1, Number(plotRight) || left + 1);
    const width = right - left;

    const ratioAt = timeSeconds=>{
      const time = Number.isFinite(Number(timeSeconds)) ? Number(timeSeconds) : timeMin;
      return Math.max(0, Math.min(1, (time - timeMin) / duration));
    };

    const xAt = timeSeconds=>left + ratioAt(timeSeconds) * width;

    const positionAt = timeSeconds=>{
      const ratio = ratioAt(timeSeconds);
      return Object.freeze({
        timeSeconds: timeMin + ratio * duration,
        ratio,
        x: left + ratio * width
      });
    };

    const timeAtRatio = ratio=>{
      const normalized = Math.max(0, Math.min(1, Number(ratio) || 0));
      return timeMin + normalized * duration;
    };

    return Object.freeze({
      duration,
      timeMin,
      timeMax,
      left,
      right,
      width,
      ratioAt,
      xAt,
      positionAt,
      timeAtRatio
    });
  }

  function renderWave(snapshot, presentation = null){
    const canvas = elements.waveCanvas;
    if(!canvas || !canvas.isConnected) return;

    const p = snapshot.physics;
    const obs = snapshot.observation;
    const duration = obs?.durationSeconds || getObservationDurationSeconds(snapshot);
    const fullSamples = obs?.ok ? finiteWaveSamples(obs.samples) : [];
    const samples = obs?.ok ? observedWaveSamples(obs) : [];
    const scale = resolveWaveRange(snapshot, samples, fullSamples);
    const rangeRad = scale.rangeRad;
    const analysis = snapshot.analysis;
    const elapsedStats = analysis?.elapsed;
    const peakRad = elapsedStats?.peakAbsThetaRad ?? obs?.stats?.peakThetaRad ?? 0;
    const avgRad = elapsedStats?.meanThetaRad ?? obs?.stats?.meanThetaRad ?? 0;
    const sigmaRad = elapsedStats?.sigmaThetaRad ?? 0;
    const p2pRad = elapsedStats?.p2pThetaRad ?? 0;
    let curRad = analysis?.cursor?.currentThetaRad ?? obs?.currentSample?.thetaRad ?? 0;

    const {ctx, width, height} = setupCanvas(canvas);
    const colors = currentThemePalette();
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, width, height);

    const left = 0;
    const right = 0;
    const top = 22;
    const bottom = 12;
    const plotLeft = left;
    const plotRight = Math.max(plotLeft + 1, width - right);
    const plotTop = top;
    const plotBottom = Math.max(plotTop + 1, height - bottom);
    const plotWidth = plotRight - plotLeft;
    const plotHeight = plotBottom - plotTop;
    const centerY = plotTop + plotHeight / 2;
    const currentT = obs?.currentSample?.t ?? 0;
    const displayTimeRange = resolveDisplayTimeRange(snapshot, currentT);
    const displaySamples = samples.filter(sample=>
      Number(sample.t) >= displayTimeRange.timeMin &&
      Number(sample.t) <= displayTimeRange.timeMax
    );
    const timeAxis = createSharedTimeAxis(
      displayTimeRange.timeMin,
      displayTimeRange.timeMax,
      plotLeft,
      plotRight
    );
    const xOf = timeAxis.xAt;
    const yOf = value => centerY - (Number(value) / rangeRad) * (plotHeight / 2);
    const displayCurrentSample = displayTimeRange.mode === "window" && snapshot.lifecycle === Lifecycle.COMPLETED
      ? displaySamples.at(-1)
      : samples.at(-1);
    const displayCurrentTheta = Number(displayCurrentSample?.thetaRad);
    if(Number.isFinite(displayCurrentTheta)) curRad = displayCurrentTheta;
    let displayCurrentTime = Number(displayCurrentSample?.t);
    // IL278 G16: presentation carries a tweened (t, thetaRad) pair from
    // waveMotion, mirroring opticalMotion's role for the optical spot. It
    // only nudges the cursor line/point + numeric readout between real
    // 80ms ticks; displaySamples/timeAxis/displayTimeRange above are left
    // untouched so the plotted history is never fabricated or shifted.
    if(presentation){
      const presentedTime = Number(presentation.timeSeconds);
      const presentedTheta = Number(presentation.thetaRad);
      if(Number.isFinite(presentedTime)) displayCurrentTime = presentedTime;
      if(Number.isFinite(presentedTheta)) curRad = presentedTheta;
    }
    const currentPosition = timeAxis.positionAt(Number.isFinite(displayCurrentTime) ? displayCurrentTime : currentT);

    ctx.save();
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;

    for(let i = 0; i <= 8; i += 1){
      const x = timeAxis.xAt(timeAxis.timeAtRatio(i / 8));
      const majorTick = i % 2 === 0;
      drawLine(
        ctx,
        x,
        plotTop,
        x,
        plotBottom,
        majorTick ? colors.gridStrong : colors.grid,
        majorTick ? 1 : 0.75
      );
    }

    [plotTop, centerY, plotBottom].forEach((y, index)=>{
      drawLine(ctx, plotLeft, y, plotRight, y, index === 1 ? colors.axis : colors.gridStrong, index === 1 ? 1.2 : 1);
    });

    drawLine(ctx, plotLeft, plotTop + plotHeight * 0.25, plotRight, plotTop + plotHeight * 0.25, colors.gridStrong, 0.85);
    drawLine(ctx, plotLeft, plotTop + plotHeight * 0.75, plotRight, plotTop + plotHeight * 0.75, colors.gridStrong, 0.85);

    const timeline = obs?.timeline;
    const windows = timeline?.windows;
    const mainStart = windows?.mainEvaluation?.start ?? duration * 0.25;
    const mainEnd = windows?.mainEvaluation?.end ?? duration * 0.53;
    const mainStartPosition = timeAxis.positionAt(mainStart);
    const mainEndPosition = timeAxis.positionAt(mainEnd);
    const mainX = mainStartPosition.x;
    const mainW = Math.max(0, mainEndPosition.x - mainStartPosition.x);

    for(const supportWindow of [windows?.preBaseline, windows?.postBaseline]){
      if(!supportWindow) continue;
      const supportStart = timeAxis.positionAt(supportWindow.start);
      const supportEnd = timeAxis.positionAt(supportWindow.end);
      ctx.fillStyle = colors.supportWindow;
      ctx.fillRect(supportStart.x, plotTop, Math.max(0, supportEnd.x - supportStart.x), plotHeight);
    }
    ctx.fillStyle = colors.mainWindow;
    ctx.fillRect(mainX, plotTop, mainW, plotHeight);
    for(const supportWindow of [windows?.preBaseline, windows?.postBaseline]){
      if(!supportWindow) continue;
      drawLine(ctx, xOf(supportWindow.start), plotTop, xOf(supportWindow.start), plotBottom, colors.gridStrong, 0.8);
      drawLine(ctx, xOf(supportWindow.end), plotTop, xOf(supportWindow.end), plotBottom, colors.gridStrong, 0.8);
    }
    drawLine(ctx, mainStartPosition.x, plotTop, mainStartPosition.x, plotBottom, colors.equilibrium, 0.9);
    drawLine(ctx, mainEndPosition.x, plotTop, mainEndPosition.x, plotBottom, colors.equilibrium, 0.9);

    ctx.strokeStyle = colors.border;
    ctx.strokeRect(plotLeft, plotTop, plotWidth, plotHeight);
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.rect(plotLeft, plotTop, plotWidth, plotHeight);
    ctx.clip();

    const thetaEq = Number(p.thetaEqRad) || 0;
    if(Math.abs(thetaEq) <= rangeRad * 1.2){
      const thetaLineY = yOf(thetaEq);
      drawLine(ctx, plotLeft, thetaLineY, plotRight, thetaLineY, colors.equilibrium, 1);
    }

    if(Number.isFinite(avgRad)){
      drawLine(ctx, plotLeft, yOf(avgRad), plotRight, yOf(avgRad), colors.mean, 1);
    }

    if(Number.isFinite(avgRad) && Number.isFinite(sigmaRad) && sigmaRad > 0){
      ctx.save();
      ctx.strokeStyle = colors.sigma;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      for(const value of [avgRad + sigmaRad, avgRad - sigmaRad]){
        ctx.beginPath();
        ctx.moveTo(plotLeft, yOf(value));
        ctx.lineTo(plotRight, yOf(value));
        ctx.stroke();
      }
      ctx.restore();
    }

    const componentFields = Object.freeze({
      white:"whiteNoiseThetaRad",
      drift:"driftNoiseThetaRad",
      periodic:"periodicNoiseThetaRad",
      impulse:"impulseNoiseThetaRad",
      optical:"opticalNoiseThetaRad",
      numeric:"numericNoiseThetaRad"
    });
    const visibleComponents = Object.values(obs?.noise?.components || {}).filter(component=>{
      const controlPrefix = `noise${component.id[0].toUpperCase()}${component.id.slice(1)}`;
      return component?.enabled &&
        snapshot.controls[`${controlPrefix}Visible`] === "on" &&
        componentFields[component.id];
    });
    const gainReferenceComponents = Object.values(obs?.noise?.components || {}).filter(component=>
      component?.enabled &&
      component?.visible &&
      componentFields[component.id]
    );
    const componentDisplay = resolveNoiseComponentDisplayGain(
      fullSamples,
      gainReferenceComponents,
      componentFields,
      rangeRad
    );
    const componentDisplayGain = componentDisplay.gain;
    const componentDisplayGainText = formatNoiseDisplayGain(componentDisplayGain);
    if(elements.noiseWaveLegend){
      const signature = `${visibleComponents.map(component=>`${component.id}:${component.shieldingFactor}`).join(",")}|${componentDisplayGain}`;
      if(elements.noiseWaveLegend.dataset.signature !== signature){
        elements.noiseWaveLegend.replaceChildren();
        for(const component of visibleComponents){
          const item = document.createElement("span");
          item.className = "noise-legend-item";
          item.style.setProperty("--noise-component-color", colors.componentColors[component.id] || "#9197a0");

          const swatch = document.createElement("i");
          swatch.className = "noise-legend-swatch";
          swatch.setAttribute("aria-hidden", "true");

          const label = document.createElement("span");
          label.textContent = `${component.label} ×${Number(component.shieldingFactor ?? 1).toFixed(2)}`;

          item.append(swatch, label);
          elements.noiseWaveLegend.append(item);
        }
        if(visibleComponents.length){
          const gainLabel = document.createElement("span");
          gainLabel.className = "noise-legend-gain";
          gainLabel.textContent = `成分AUTO ×${componentDisplayGainText}`;
          elements.noiseWaveLegend.append(gainLabel);
        }
        elements.noiseWaveLegend.dataset.signature = signature;
      }
      elements.noiseWaveLegend.hidden = visibleComponents.length === 0;
      elements.noiseWaveLegend.setAttribute(
        "aria-label",
        visibleComponents.length
          ? `表示中のノイズ成分凡例。共通表示倍率${componentDisplayGainText}倍`
          : "表示中のノイズ成分なし"
      );
    }
    for(const component of visibleComponents){
      const field = componentFields[component.id];
      const componentSamples = decimateWaveSamples(displaySamples, Math.max(240, Math.floor(plotWidth * 2)));
      if(componentSamples.length <= 1) continue;
      // IL278 ノイズ仕様D-fix2: impulse is drawn at its true scale (gain=1),
      // since it's excluded from the gain calculation above. Applying the
      // (potentially large) auto-gain meant for tiny components to impulse
      // would blow its already-comfortably-sized spike far past the range.
      const effectiveGain = component.id === "impulse" ? 1 : componentDisplayGain;
      ctx.save();
      ctx.strokeStyle = colors.componentColors[component.id] || component.color;
      ctx.lineWidth = 0.6;
      ctx.lineJoin = "round";
      ctx.beginPath();
      componentSamples.forEach((sample, index)=>{
        const value = Number(sample[field]);
        const x = xOf(sample.t);
        const y = yOf(Number.isFinite(value) ? value * effectiveGain : 0);
        if(index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.restore();
    }

    const renderSeries = decimateWaveSamples(displaySamples, Math.max(240, Math.floor(plotWidth * 2)));
    if(renderSeries.length > 1){
      ctx.save();
      ctx.strokeStyle = colors.series;
      ctx.lineWidth = 0.9;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      renderSeries.forEach((sample, index)=>{
        const x = xOf(sample.t);
        const y = yOf(sample.thetaRad);
        if(index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.restore();
    }

    const extrema = waveExtrema(displaySamples);
    // IL278: removed the width>=520/height>=260 gate. On mobile the wave
    // canvas is always narrower than 520px (screen width), so this condition
    // was never true and the +Peak/-Peak labels never rendered there, while
    // the optical display (no such gate) always showed them. Label position
    // is already clamped within the plot area below, matching how the
    // optical display avoids overflow without a size cutoff.
    // IL278 ノイズ仕様D-fix: label position is now independent of the marker's
    // y-position. Previously, if the marker itself fell outside the plot
    // (e.g. an impulse spike pushing the display range far beyond the other
    // components), BOTH the marker and its label were skipped entirely,
    // silently hiding the peak. Now the label is always clamped inside the
    // plot area (matching the optical display's drawOpticalPeakMarker), so
    // an off-screen peak still shows "+Peak"/"-Peak" pinned near the edge.
    const drawPeakMarker = (sample, label, color, labelOffset)=>{
      if(!sample) return;
      const x = xOf(sample.t);
      const y = yOf(sample.thetaRad);
      const onScreen = y >= plotTop && y <= plotBottom;
      ctx.save();
      if(onScreen){
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(x, plotTop);
        ctx.lineTo(x, plotBottom);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = colors.background;
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }
      const clampedY = Math.max(plotTop + 12, Math.min(plotBottom - 6, y + labelOffset));
      const labelSuffix = onScreen ? "" : "※";
      drawText(
        ctx,
        labelSuffix + label,
        Math.min(plotRight - 34, x + 6),
        clampedY,
        "left",
        "middle",
        color
      );
      ctx.restore();
    };

    if(displaySamples.length >= 2){
      drawPeakMarker(extrema.peakPlus, "+Peak", colors.opticalPositive, -10);
      drawPeakMarker(extrema.peakMinus, "-Peak", colors.opticalNegative, 12);
    }

    const currentX = currentPosition.x;
    drawLine(ctx, currentX, plotTop, currentX, plotBottom, colors.current, 1.25);

    const currentSample = displayCurrentSample;
    if(currentSample){
      const currentY = yOf(curRad);
      if(currentY >= plotTop && currentY <= plotBottom){
        ctx.save();
        ctx.fillStyle = colors.currentPoint;
        ctx.strokeStyle = colors.current;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 4.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    }
    ctx.restore();

    const axisRangeText = formatWaveAxisRad(rangeRad);
    const axisHalfText = formatWaveAxisRad(rangeRad / 2);
    if(elements.waveTopLabel) elements.waveTopLabel.textContent = `+${axisRangeText}`;
    if(elements.waveUpperMidLabel) elements.waveUpperMidLabel.textContent = `+${axisHalfText}`;
    if(elements.waveZeroLabel) elements.waveZeroLabel.textContent = "0";
    if(elements.waveLowerMidLabel) elements.waveLowerMidLabel.textContent = `−${axisHalfText}`;
    if(elements.waveBottomLabel) elements.waveBottomLabel.textContent = `−${axisRangeText}`;

    const compactReadouts = usesCompactPortraitReadouts();
    const radUnit = compactReadouts ? "" : " rad";
    const formatWaveReadout = compactReadouts ? formatCompactRad : formatRad;
    if(elements.waveCur) elements.waveCur.textContent = `${formatWaveReadout(curRad)}${radUnit}`;
    if(elements.wavePeak) elements.wavePeak.textContent = `${formatWaveReadout(peakRad)}${radUnit}`;
    if(elements.waveAvg) elements.waveAvg.textContent = `${formatWaveReadout(avgRad)}${radUnit}`;
    if(elements.waveScale) elements.waveScale.textContent = `±${formatWaveReadout(rangeRad)}`;
    const rangeValueText = formatWaveReadout(rangeRad);
    const surveyMaximumText = formatWaveReadout(scale.surveyMaxAbsRad);
    const recommendedRangeText = formatWaveReadout(scale.recommendedRangeRad);
    const overflowRatioText = formatWaveOverflowRatio(scale.overflowRatio);
    const overflowText = scale.overflow
      ? `レンジ超過 ×${overflowRatioText} / ${scale.overflowSampleCount}点`
      : "範囲内";
    if(elements.waveRangeStatus){
      elements.waveRangeStatus.dataset.overflow = String(scale.overflow);
      elements.waveRangeStatus.textContent =
        scale.overflow
          ? `レンジ超過 ×${overflowRatioText}`
          : scale.mode === "manual"
            ? `手動固定 ±${rangeValueText}`
            : scale.mode === "fixed-current"
              ? `表示固定 ±${rangeValueText}`
              : scale.locked
                ? `AUTO固定 ±${rangeValueText}`
                : scale.style === "precise"
                  ? `AUTO調査 ±${recommendedRangeText}`
                  : `追従 ±${rangeValueText}`;
    }
    if(elements.waveRangeSurvey){
      elements.waveRangeSurvey.dataset.overflow = String(scale.overflow);
      elements.waveRangeSurvey.textContent =
        `全時間最大 ${surveyMaximumText} rad / 推奨 ±${recommendedRangeText} rad / ` +
        `表示 ±${rangeValueText} rad / ${overflowText}`;
    }
    if(elements.waveRangeOverlay){
      const progress = Math.max(0, Math.min(100, (Number(currentT) / duration) * 100));
      elements.waveRangeOverlay.textContent = compactReadouts
        ? `t=${formatTimeLabel(currentPosition.timeSeconds)}/${formatTimeLabel(duration)}｜${progress.toFixed(0)}%`
        : `${displayTimeRange.label}｜t=${formatTimeLabel(currentPosition.timeSeconds)} / ${formatTimeLabel(duration)}｜${progress.toFixed(0)}%`;
    }
    // IL278 ノイズ仕様D-fix: since the display range is now sized excluding
    // impulse (see resolveWaveRange), an impulse spike can legitimately
    // exceed the visible range. Surface that explicitly rather than let it
    // silently clip, so it reads as "expected" rather than "broken".
    if(elements.waveClipNote){
      const isClipped = displaySamples.some(sample => Math.abs(Number(sample.thetaRad) || 0) > rangeRad);
      elements.waveClipNote.hidden = !isClipped;
    }

    if(elements.wavePlot){
      elements.wavePlot.dataset.traceScope = displayTimeRange.mode;
      elements.wavePlot.dataset.renderedSampleCount = String(displaySamples.length);
      elements.wavePlot.dataset.availableSampleCount = String(fullSamples.length);
      elements.wavePlot.dataset.scaleMode = scale.mode;
      elements.wavePlot.dataset.scaleStyle = scale.style;
      elements.wavePlot.dataset.rangeLocked = String(scale.locked);
      elements.wavePlot.dataset.rangeOverflow = String(scale.overflow);
      elements.wavePlot.dataset.rangeOverflowRatio = String(scale.overflowRatio);
      elements.wavePlot.dataset.rangeOverflowSampleCount = String(scale.overflowSampleCount);
      elements.wavePlot.dataset.surveyMaxAbsThetaRad = String(scale.surveyMaxAbsRad);
      elements.wavePlot.dataset.recommendedRangeRad = String(scale.recommendedRangeRad);
      elements.wavePlot.dataset.noiseComponentDisplayGain = String(componentDisplayGain);
      elements.wavePlot.dataset.noiseComponentMaxAbsThetaRad = String(componentDisplay.maxAbsThetaRad);
      elements.wavePlot.setAttribute(
        "aria-label",
        `波形Canvas。${displayTimeRange.label} ${formatTimeLabel(timeAxis.timeMin)}–${formatTimeLabel(timeAxis.timeMax)}、表示${displaySamples.length}サンプル、現在${formatTimeLabel(currentPosition.timeSeconds)}、平均${formatRad(avgRad)}rad、標準偏差${formatRad(sigmaRad)}rad、表示レンジ±${formatRad(rangeRad)}rad、${overflowText}、ノイズ成分表示${componentDisplayGainText}倍`
      );
    }

    const setTimelineSpan = (element, window)=>{
      if(!element || !window) return;
      const start = timeAxis.positionAt(window.start);
      const end = timeAxis.positionAt(window.end);
      element.style.left = `${start.ratio * 100}%`;
      element.style.width = `${Math.max(0, end.ratio - start.ratio) * 100}%`;
      element.hidden = end.ratio <= start.ratio;
    };
    setTimelineSpan(elements.waveTimelinePre, windows?.preBaseline);
    setTimelineSpan(elements.waveTimelineActive, windows?.activePeriod);
    setTimelineSpan(elements.waveTimelinePost, windows?.postBaseline);
    if(elements.waveTimelineWindow){
      elements.waveTimelineWindow.style.left = `${mainStartPosition.ratio * 100}%`;
      elements.waveTimelineWindow.style.width = `${(mainEndPosition.ratio - mainStartPosition.ratio) * 100}%`;
    }
    if(elements.waveTimelineCurrent){
      elements.waveTimelineCurrent.style.left = `${currentPosition.ratio * 100}%`;
    }
    if(elements.waveTimelineTrack){
      const timelineWidth = elements.waveTimelineTrack.clientWidth;
      const widthDifference = Number.isFinite(timelineWidth) ? Math.abs(timelineWidth - timeAxis.width) : Infinity;
      const toleranceCssPx = 1 / Math.max(1, window.devicePixelRatio || 1);
      elements.waveTimelineTrack.dataset.axisAlignment = widthDifference <= toleranceCssPx ? "ok" : "mismatch";
      elements.waveTimelineTrack.dataset.currentPhase = timeline?.currentPhase?.id || "active";
      elements.waveTimelineTrack.setAttribute(
        "aria-label",
        `${timeline?.currentPhase?.label || "観測"}。${displayTimeRange.label} ${formatTimeLabel(timeAxis.timeMin)}–${formatTimeLabel(timeAxis.timeMax)}。主評価窓 ${formatTimeLabel(mainStart)}–${formatTimeLabel(mainEnd)}`
      );
    }
    if(elements.waveContainer){
      elements.waveContainer.dataset.timeRangeMode = displayTimeRange.mode;
      elements.waveContainer.dataset.timeMin = String(timeAxis.timeMin);
      elements.waveContainer.dataset.timeMax = String(timeAxis.timeMax);
    }

    const currentNoise = obs?.currentSample;
    const noiseModel = obs?.noise;
    const noiseStateText = noiseModel
      ? `${noiseModel.masterEnabled && noiseModel.preset !== "ideal" ? "生成ON" : "生成OFF"} / ${noiseModel.preset} / 遮蔽${noiseModel.shielding?.masterEnabled ? `ON・${noiseModel.shielding.label}` : "OFF"} / seed ${noiseModel.seed} / base ${formatScientific(noiseModel.baseTorqueNm, 3)} N·m / 現在 ${formatScientific(currentNoise?.totalNoiseEquivalentTorqueNm, 3)} N·m`
      : "--";
    const visibleNoiseText = visibleComponents.length
      ? `${visibleComponents.map(component=>`${component.label}(${component.level})`).join(" / ")} / 成分AUTO×${componentDisplayGainText}`
      : "成分線OFF（合成観測値への適用は有効）";
    if(elements.noiseGenerationText) elements.noiseGenerationText.textContent = noiseStateText;
    if(elements.noiseVisibleText) elements.noiseVisibleText.textContent = visibleNoiseText;

    const inputOn = Number(obs?.currentSample?.inputGate) === 1;
    const inputStateLabel = inputOn ? "入力ON" : "入力OFF";
    const phaseLabel = `${timeline?.currentPhase?.label || "--"} / ${inputStateLabel}`;
    const mainWindowLabel = `${formatTimeLabel(mainStart)}–${formatTimeLabel(mainEnd)}`;
    const inputProfile = obs?.input;
    const inputProfileLabel = inputProfile?.mode === "noise-check"
      ? "全時間OFF / τ=0 N·m"
      : `${formatTimeLabel(inputProfile?.activeStartSeconds)}–${formatTimeLabel(inputProfile?.activeEndSeconds)} / τ=${formatScientific(inputProfile?.activeTorqueNm, 3)} N·m`;
    if(elements.wavePhaseText) elements.wavePhaseText.textContent = phaseLabel;
    if(elements.waveMainWindowText) elements.waveMainWindowText.textContent = mainWindowLabel;
    if(elements.inputPhaseText) elements.inputPhaseText.textContent = `${inputStateLabel} / τ=${formatScientific(obs?.currentSample?.appliedTorqueNm, 3)} N·m`;
    if(elements.inputProfileText) elements.inputProfileText.textContent = inputProfileLabel;
    if(elements.summaryPhaseText) elements.summaryPhaseText.textContent = phaseLabel;
    if(elements.summaryMainWindowText) elements.summaryMainWindowText.textContent = mainWindowLabel;

    updateTimeLabels(timeAxis);
  }



  function getAnalysisFreezeLabel(snapshot){
    const lifecycle = snapshot.lifecycle;
    const analysis = snapshot.analysis;
    const elapsed = analysis?.elapsed;
    const cursor = analysis?.cursor;

    const phase =
      lifecycle === Lifecycle.RUNNING ? "更新中" :
      lifecycle === Lifecycle.PAUSED ? "一時停止で固定" :
      lifecycle === Lifecycle.STOPPED ? "停止で固定" :
      lifecycle === Lifecycle.COMPLETED ? "完了で固定" :
      "待機";

    const n = elapsed?.count ?? 0;
    const t = cursor?.currentElapsedSeconds ?? 0;
    const mean = elapsed?.meanThetaRad ?? null;
    const rms = elapsed?.rmsThetaRad ?? null;
    const sigma = elapsed?.sigmaThetaRad ?? null;
    const peak = elapsed?.peakAbsThetaRad ?? null;
    const p2p = elapsed?.p2pThetaRad ?? null;

    return `${phase} A#${snapshot.analysisRevision} n=${n} t=${formatTimeLabel(t)} mean=${formatRad(mean)} rms=${formatRad(rms)} σ=${formatRad(sigma)} peak=${formatRad(peak)} p2p=${formatRad(p2p)}`;
  }

  function renderAnalysisFreeze(snapshot){
    const label = getAnalysisFreezeLabel(snapshot);
    if(elements.analysisFreeze){
      elements.analysisFreeze.textContent = label;
      const chip = elements.analysisFreeze.closest(".analysis-freeze-chip");
      if(chip) chip.dataset.freezeState = snapshot.lifecycle;
    }
    if(elements.analysisFreezeDetail){
      elements.analysisFreezeDetail.textContent = label;
    }
  }

  function formatEvaluationWindow(windowAnalysis){
    if(windowAnalysis && !windowAnalysis.applicable) return "対象外 n=0";
    if(!windowAnalysis?.started || windowAnalysis.sampleCount === 0) return "未到達 n=0";
    const status = windowAnalysis.complete ? "完了" : "収集中";
    const stats = windowAnalysis.stats;
    return `${status} n=${windowAnalysis.sampleCount} μ=${formatRad(stats.meanThetaRad)} σ=${formatRad(stats.sigmaThetaRad)} RMS=${formatRad(stats.rmsThetaRad)} p2p=${formatRad(stats.p2pThetaRad)}`;
  }

  function formatRecoveryAnalysis(recovery){
    if(!recovery) return "--";
    if(!Number.isFinite(recovery.thetaEqReferenceRad)) return "対象外（θeq=0）";
    if(!recovery.postStarted) return "未到達";
    const status = recovery.postComplete ? "完了" : "復帰中";
    return `${status} 残留=${formatRad(recovery.currentResidualThetaRad)} rad / θeq=${formatPercentFromRatio(recovery.currentResidualRatio)} / 復帰=${formatPercentFromRatio(recovery.recoveryFraction)}`;
  }

  function formatTailStability(tail){
    if(!tail) return "--";
    if(tail.reason === "post_baseline_short"){
      return `対象外（事後Baseline ${formatTimeLabel(tail.postDurationSeconds)} < 120s）`;
    }
    if(tail.reason === "thetaeq_zero") return "対象外（θeq=0）";
    if(tail.reason === "window_incomplete"){
      return `収集中（${formatTimeLabel(tail.start)}–${formatTimeLabel(tail.end)}）`;
    }
    if(tail.reason === "insufficient_samples"){
      return `判定不能（前半n=${tail.firstCount || 0} / 後半n=${tail.secondCount || 0}）`;
    }
    if(!tail.available) return "未評価";
    return `${tail.judgement} 前半μ=${formatRad(tail.firstMeanThetaRad)} / 後半μ=${formatRad(tail.secondMeanThetaRad)} / Δθ=${formatRad(tail.deltaThetaRad)} rad / θeq=${formatPercentFromRatio(tail.deltaThetaEqRatio)}（基準≤5%）`;
  }

  function formatSignalToNoiseRatio(value){
    const number = Number(value);
    if(!Number.isFinite(number)) return "--";
    if(number < 1000) return number.toFixed(2);
    return number.toExponential(3).replace("+", "");
  }

  function formatSignalToNoise(signalToNoise){
    if(!signalToNoise) return {summary:"--", detail:"--"};
    if(signalToNoise.reason === "not_applicable"){
      return {summary:"対象外", detail:"対象外（事前Baselineまたは主評価窓なし）"};
    }
    if(signalToNoise.reason === "baseline_collecting"){
      return {
        summary:"--",
        detail:`事前Baseline収集中 n=${signalToNoise.baselineSampleCount}`
      };
    }
    if(signalToNoise.reason === "main_not_started"){
      return {
        summary:"--",
        detail:`主評価窓未到達 / Baseline σ=${formatRad(signalToNoise.baselineNoiseThetaRad)} rad`
      };
    }
    if(signalToNoise.reason === "baseline_noise_zero"){
      return {
        summary:"対象外",
        detail:"対象外（Baseline σ=0）"
      };
    }
    if(!signalToNoise.available){
      return {summary:"--", detail:"算出待ち"};
    }

    const status = signalToNoise.complete ? "完了" : "更新中";
    const ratioText = formatSignalToNoiseRatio(signalToNoise.ratio);
    return {
      summary:ratioText,
      detail:`${status} |信号|=${formatRad(signalToNoise.signalAbsThetaRad)} rad / Baseline σ=${formatRad(signalToNoise.baselineNoiseThetaRad)} rad / S/N=${ratioText}`
    };
  }

  function formatDetection(snapshot){
    const detection = snapshot.analysis?.detection;
    if(!detection) return {summary:"--", detail:"--", reason:"--"};

    if(
      snapshot.lifecycle === Lifecycle.STOPPED &&
      detection.applicable &&
      !detection.complete &&
      detection.status !== "unavailable"
    ){
      return {
        summary:"観測不足",
        detail:"観測不足",
        reason:"主評価窓の完了前に停止したため、S/N検出判定を確定できません。"
      };
    }

    const snText = formatSignalToNoiseRatio(detection.snRatio);
    const thresholdText = Number.isFinite(detection.detectableSn) && Number.isFinite(detection.conditionalSn)
      ? `基準 ${detection.conditionalSn} / ${detection.detectableSn}`
      : "";
    const detail = detection.available
      ? `${detection.label} / S/N=${snText} / ${thresholdText}`
      : detection.label;

    return {
      summary:detection.label || "--",
      detail,
      reason:detection.reason || "--"
    };
  }

  function formatResidualSupport(residualSupport){
    if(!residualSupport) return {summary:"--", detail:"--"};
    if(!residualSupport.applicable){
      return {summary:"対象外", detail:residualSupport.reason || "対象外"};
    }

    const ratioText = Number.isFinite(residualSupport.residualRatio)
      ? formatPercentFromRatio(residualSupport.residualRatio)
      : "--";
    const detail = residualSupport.available
      ? `${residualSupport.label} / 残留/θeq=${ratioText} / 基準 注意≥20%・NG≥60%`
      : residualSupport.reason || residualSupport.label || "--";

    return {
      summary:residualSupport.label || "--",
      detail
    };
  }

  function formatOverallJudgement(snapshot){
    const overall = snapshot.analysis?.overallJudgement;
    if(!overall) return {summary:"--", detail:"--", reason:"--"};

    if(
      snapshot.lifecycle === Lifecycle.STOPPED &&
      overall.applicable &&
      !overall.complete &&
      overall.status !== "unavailable"
    ){
      return {
        summary:"観測不足",
        detail:"観測不足",
        reason:"総合判定に必要な主評価窓または事後Baselineの完了前に停止しました。"
      };
    }

    const residual = snapshot.analysis?.residualSupport;
    const tail = snapshot.analysis?.tailStability;
    const residualLabel = residual?.label || "--";
    const tailLabel = tail?.judgement || "対象外";
    const detail = overall.applicable
      ? `${overall.label} / S/N主判定=${snapshot.analysis?.detection?.label || "--"} / 残留=${residualLabel} / 終盤=${tailLabel}`
      : overall.label;

    return {
      summary:overall.label || "--",
      detail,
      reason:overall.reason || "--"
    };
  }

  function renderEvaluationAnalysis(snapshot){
    const evaluation = snapshot.analysis?.evaluation;
    if(!evaluation) return;

    const preText = formatEvaluationWindow(evaluation.preBaseline);
    const mainText = formatEvaluationWindow(evaluation.mainEvaluation);
    const postText = formatEvaluationWindow(evaluation.postBaseline);
    const baselineDifference = evaluation.baseline?.differenceThetaRad;
    const postMeanResidualRatio = snapshot.analysis?.recovery?.postMeanResidualRatio;
    const differenceText =
      !evaluation.postBaseline?.started ? "未到達" :
      Number.isFinite(baselineDifference)
        ? `${evaluation.postBaseline.complete ? "完了" : "収集中"} post−pre ${formatRad(baselineDifference)} rad / θeq=${formatPercentFromRatio(postMeanResidualRatio)}`
        : "--";
    const recoveryText = formatRecoveryAnalysis(snapshot.analysis?.recovery);
    const tailText = formatTailStability(snapshot.analysis?.tailStability);
    const signalToNoiseText = formatSignalToNoise(snapshot.analysis?.signalToNoise);
    const detectionText = formatDetection(snapshot);
    const residualSupportText = formatResidualSupport(snapshot.analysis?.residualSupport);
    const overallText = formatOverallJudgement(snapshot);

    if(elements.preBaselineStatsText) elements.preBaselineStatsText.textContent = preText;
    if(elements.mainEvaluationStatsText) elements.mainEvaluationStatsText.textContent = mainText;
    if(elements.postBaselineStatsText) elements.postBaselineStatsText.textContent = postText;
    if(elements.baselineDifferenceText) elements.baselineDifferenceText.textContent = differenceText;
    if(elements.recoveryStatusText) elements.recoveryStatusText.textContent = recoveryText;
    if(elements.tailStabilityText) elements.tailStabilityText.textContent = tailText;
    if(elements.summaryPreStatsText) elements.summaryPreStatsText.textContent = preText;
    if(elements.summaryMainStatsText) elements.summaryMainStatsText.textContent = mainText;
    if(elements.summaryPostStatsText) elements.summaryPostStatsText.textContent = postText;
    if(elements.summarySnText) elements.summarySnText.textContent = signalToNoiseText.summary;
    if(elements.signalToNoiseDetailText) elements.signalToNoiseDetailText.textContent = signalToNoiseText.detail;
    if(elements.summarySnDetailText) elements.summarySnDetailText.textContent = signalToNoiseText.detail;
    if(elements.detectionJudgementText) elements.detectionJudgementText.textContent = detectionText.detail;
    if(elements.detectionReasonText) elements.detectionReasonText.textContent = detectionText.reason;
    if(elements.summaryDetectionText) elements.summaryDetectionText.textContent = detectionText.summary;
    if(elements.summaryDetectionDetailText) elements.summaryDetectionDetailText.textContent = detectionText.detail;
    if(elements.summaryDetectionReasonText) elements.summaryDetectionReasonText.textContent = detectionText.reason;
    if(elements.residualSupportText) elements.residualSupportText.textContent = residualSupportText.detail;
    if(elements.overallJudgementText) elements.overallJudgementText.textContent = overallText.detail;
    if(elements.overallJudgementReasonText) elements.overallJudgementReasonText.textContent = overallText.reason;
    if(elements.summaryOverallText) elements.summaryOverallText.textContent = overallText.summary;
    if(elements.summaryResidualSupportText) elements.summaryResidualSupportText.textContent = residualSupportText.detail;
    if(elements.summaryOverallDetailText) elements.summaryOverallDetailText.textContent = overallText.detail;
    if(elements.summaryOverallReasonText) elements.summaryOverallReasonText.textContent = overallText.reason;
    if(elements.summaryBaselineDifferenceText) elements.summaryBaselineDifferenceText.textContent = differenceText;
    if(elements.summaryRecoveryText) elements.summaryRecoveryText.textContent = recoveryText;
    if(elements.summaryTailStabilityText) elements.summaryTailStabilityText.textContent = tailText;
  }

  function renderPostBaselineExtensionDecision(snapshot){
    const decision = snapshot.postBaselineExtension;
    const shouldShow =
      snapshot.lifecycle === Lifecycle.COMPLETED &&
      decision?.requiresDecision &&
      decision.workflowStatus !== "finalized";

    if(!elements.extensionDecisionView) return;
    if(!shouldShow){
      elements.extensionDecisionView.hidden = true;
      document.body.classList.remove("extension-decision-open");
      return;
    }

    if(reportIsOpen()) hideCompletedReport();
    const wasHidden = elements.extensionDecisionView.hidden;
    elements.extensionDecisionView.hidden = false;
    document.body.classList.add("extension-decision-open");

    const strong = decision.severity === "strong";
    const capReached = Boolean(decision.capReached);
    const isReextension = !capReached && Number(decision.extensionCount) > 0;
    const severity = strong ? "strong" : "standard";
    if(elements.extensionDecisionResult) elements.extensionDecisionResult.dataset.extensionSeverity = severity;
    if(elements.extensionDecisionBadge){
      elements.extensionDecisionBadge.textContent = capReached
          ? "標準上限到達"
          : strong
            ? "変化継続"
            : isReextension
              ? "再延長推奨"
              : "延長推奨";
    }
    if(elements.extensionDecisionTitle){
      elements.extensionDecisionTitle.textContent = capReached
          ? "標準延長の上限へ到達しています"
          : `事後Baselineの${isReextension ? "再" : ""}延長を推奨します`;
    }
    if(elements.extensionDecisionReason) elements.extensionDecisionReason.textContent = decision.reason || "--";

    const applicabilityText = capReached
      ? `追加延長不可。${decision.extensionCount}/${decision.maximumExtensions}回・追加${decision.addedSeconds}/${decision.maximumAddedSeconds}秒で標準上限です。`
      : decision.canExtend
        ? `適用可能。事後Baselineだけを${decision.targetDurationSeconds}→${decision.nextTargetDurationSeconds}秒へ延長できます。`
        : "自動延長の適用対象外です。";
    if(elements.extensionApplicability) elements.extensionApplicability.textContent = applicabilityText;

    const firstMean = Number.isFinite(decision.firstMeanThetaRad) ? `${formatRad(decision.firstMeanThetaRad)} rad` : "--";
    const secondMean = Number.isFinite(decision.secondMeanThetaRad) ? `${formatRad(decision.secondMeanThetaRad)} rad` : "--";
    if(elements.extensionTailMeans){
      elements.extensionTailMeans.textContent = `前半60秒 ${firstMean} / 後半60秒 ${secondMean} / n=${decision.firstCount}+${decision.secondCount}`;
    }

    const deltaText = Number.isFinite(decision.deltaThetaRad) ? `${formatRad(decision.deltaThetaRad)} rad` : "--";
    const ratioText = formatPercentFromRatio(decision.deltaThetaEqRatio);
    if(elements.extensionDelta){
      elements.extensionDelta.textContent = `Δθ ${deltaText} / |Δθ|/|θeq| ${ratioText} / 基準 5%以下=安定`;
    }
    if(elements.extensionUsage){
      elements.extensionUsage.textContent = `${decision.extensionCount}/${decision.maximumExtensions}回 / 追加 ${decision.addedSeconds}/${decision.maximumAddedSeconds}秒`;
    }

    if(elements.extensionApply){
      elements.extensionApply.disabled = !decision.canExtend;
      elements.extensionApply.hidden = capReached;
      elements.extensionApply.textContent = isReextension
        ? `事後Baselineを再延長（${decision.targetDurationSeconds}→${decision.nextTargetDurationSeconds}秒）`
        : `事後Baselineを+120秒延長（${decision.targetDurationSeconds}→${decision.nextTargetDurationSeconds}秒）`;
    }
    if(elements.extensionFinalize){
      elements.extensionFinalize.disabled = false;
      elements.extensionFinalize.textContent = capReached
        ? "上限で終了してレポート表示"
        : "この時点で終了してレポート表示";
    }
    if(elements.extensionDecisionStatus){
      elements.extensionDecisionStatus.textContent = capReached
          ? `${decision.targetDurationSeconds}秒までの標準延長を完了しました。追加延長は行わず、この結果を確定してください。`
          : isReextension
            ? `2回目の再延長を行うか、${decision.targetDurationSeconds}秒時点の結果を確定するか選択してください。`
            : `1回目の延長を行うか、${decision.targetDurationSeconds}秒時点の結果を確定するか選択してください。`;
    }

    if(wasHidden) window.scrollTo({top:0,left:0,behavior:"auto"});
  }

  function render(snapshot){
    syncDisplayTimeRangeButtons();
    applyTheme(snapshot.controls.theme);
    applyFoldDefaults(snapshot.controls.controlLevel);
    const label = lifecycleLabels[snapshot.lifecycle] || snapshot.lifecycle;
    const actionLabel = actionLabels[snapshot.lastAction] || snapshot.lastAction || "--";
    const stateDetail = `${label}｜${actionLabel}｜#${snapshot.revision}`;
    if(elements.app){
      elements.app.dataset.state = snapshot.lifecycle;
      elements.app.dataset.revision = String(snapshot.revision);
    }
    if(elements.headerState) elements.headerState.textContent = `状態：${label}｜直前操作：${actionLabel}｜遷移 ${snapshot.revision}`;
    if(elements.summaryState) elements.summaryState.textContent = stateDetail;
    if(elements.announcement) elements.announcement.textContent = `状態：${label}、直前操作：${actionLabel}、遷移回数：${snapshot.revision}`;

    const isReady = snapshot.lifecycle === Lifecycle.READY;
    const isRunning = snapshot.lifecycle === Lifecycle.RUNNING;
    const isPaused = snapshot.lifecycle === Lifecycle.PAUSED;
    const isActive = isRunning || isPaused;
    const hasErrors = Object.keys(snapshot.controlErrors).length > 0 || !snapshot.physics.ok || !snapshot.observation?.ok;
    if(elements.start) elements.start.disabled = !isReady || hasErrors;
    if(elements.pause){
      elements.pause.disabled = !isActive;
      elements.pause.setAttribute("aria-pressed", String(isPaused));
    }
    if(elements.stop) elements.stop.disabled = !isActive;
    if(elements.pauseIcon) elements.pauseIcon.textContent = isPaused ? "▶" : "Ⅱ";
    if(elements.pauseLabel) elements.pauseLabel.textContent = isPaused ? "再開" : "一時停止";

    renderCsvOutput(snapshot);

    renderPhysics(snapshot);
    requestOpticalRender(snapshot);
    requestWaveRender(snapshot);
    renderControls(snapshot);
    renderAnalysisFreeze(snapshot);
    renderEvaluationAnalysis(snapshot);
    renderPostBaselineExtensionDecision(snapshot);
    renderReportOutput(snapshot);
  }

  let completedCsvSnapshot = null;
  let completedCsvSessionKey = null;
  let autoShownReportSessionKey = null;

  function csvSessionKey(snapshot){
    return `${snapshot.session?.sequence ?? 0}|${snapshot.session?.completedAt || ""}`;
  }

  function completedOutputIsReady(snapshot){
    if(snapshot.lifecycle !== Lifecycle.COMPLETED) return false;
    const decision = snapshot.postBaselineExtension;
    return !decision || decision.workflowStatus === "finalized" || !decision.requiresDecision;
  }

  function renderCsvOutput(snapshot){
    const completed = completedOutputIsReady(snapshot);
    if(completed){
      const sessionKey = csvSessionKey(snapshot);
      if(!completedCsvSnapshot || completedCsvSessionKey !== sessionKey){
        completedCsvSnapshot = snapshot;
        completedCsvSessionKey = sessionKey;
        if(elements.csvExportStatus) elements.csvExportStatus.textContent = "観測完了CSVを出力できます。";
      }
    }else{
      completedCsvSnapshot = null;
      completedCsvSessionKey = null;
      autoShownReportSessionKey = null;
    }

    if(elements.csvOutputBlock) elements.csvOutputBlock.hidden = !completed;
    if(elements.csvExport) elements.csvExport.disabled = !completed;
    if(elements.reportOpen) elements.reportOpen.disabled = !completed;
  }

  function reportIsOpen(){
    return Boolean(elements.reportView && !elements.reportView.hidden);
  }

  function showCompletedReport(){
    const snapshot = completedCsvSnapshot;
    if(!snapshot || snapshot.lifecycle !== Lifecycle.COMPLETED || !elements.reportView || !elements.reportSheet) return false;
    reportApi.populate(elements.reportView,snapshot);
    elements.reportView.hidden = false;
    document.body.classList.add("report-view-open");
    syncReportViewportInsets();
    reportApi.fitToViewport(elements.reportFrame,elements.reportSheet);
    window.scrollTo({top:0,left:0,behavior:"auto"});
    return true;
  }

  function hideCompletedReport(){
    if(!elements.reportView) return;
    elements.reportView.hidden = true;
    document.body.classList.remove("report-view-open");
    window.scrollTo({top:0,left:0,behavior:"auto"});
  }

  function syncReportViewportInsets(){
    if(!elements.reportView) return;
    const viewport = window.visualViewport;
    const top = viewport ? Math.max(0, Number(viewport.offsetTop) || 0) : 0;
    const width = viewport ? Math.max(280, Number(viewport.width) || window.innerWidth) : window.innerWidth;
    elements.reportView.style.setProperty("--report-visual-top", `${top}px`);
    elements.reportView.style.setProperty("--report-visual-width", `${width}px`);
  }

  function renderReportOutput(snapshot){
    const completed = completedOutputIsReady(snapshot);
    if(!completed){
      if(reportIsOpen()) hideCompletedReport();
      return;
    }
    const sessionKey = csvSessionKey(snapshot);
    if(autoShownReportSessionKey !== sessionKey){
      autoShownReportSessionKey = sessionKey;
      showCompletedReport();
    }
  }

  async function exportCompletedCsv(){
    const snapshot = completedCsvSnapshot;
    if(!snapshot || snapshot.lifecycle !== Lifecycle.COMPLETED) return;
    const exportDate = new Date();
    if(elements.csvExport) elements.csvExport.disabled = true;
    if(elements.csvExportStatus) elements.csvExportStatus.textContent = "CSVを作成しています…";
    try{
      const csvText = csvApi.buildCsvText(snapshot,exportDate,{appVersion:"IL278S3Q",build:"IL278S3Q"});
      const filename = csvApi.createFilename(exportDate);
      const result = await csvApi.saveCsvText(csvText,filename);
      if(elements.csvExportStatus){
        elements.csvExportStatus.textContent = result.ok
          ? "CSVのダウンロードを開始しました。Safariのダウンロード一覧を確認してください。"
          : "CSVを保存できませんでした。";
      }
    }catch(error){
      if(elements.csvExportStatus) elements.csvExportStatus.textContent = "CSVを作成できませんでした。";
    }finally{
      if(elements.csvExport) elements.csvExport.disabled = false;
    }
  }

  function handleAction(action){
    switch(action){
      case "start": store.start(); break;
      case "toggle-pause":{
        const snapshot = store.getSnapshot();
        if(snapshot.lifecycle === Lifecycle.RUNNING) store.pause();
        else if(snapshot.lifecycle === Lifecycle.PAUSED) store.resume();
        break;
      }
      case "stop": store.stop(); break;
      case "clear-observation": store.clearObservation(); break;
      case "reset-all": store.resetAll(); break;
      case "measure-impulse": runImpulseMeasurement(); break;
      default: break;
    }
  }

  // IL278 ノイズ仕様D2: impulse実測モード(未検証)。
  // DeviceMotionEventはセキュアコンテキスト(HTTPS)必須のため、
  // 端末やブラウザの対応状況により、センサー値を取得できない場合があります。
  // 本番(GitHub Pages・自動HTTPS)デプロイ後の端末・ブラウザ別の動作確認対象。
  const IMPULSE_MEASURE_DURATION_MS = 3000;
  // ノイズ仕様D理論値の根拠(机上の軽い衝撃0.01〜0.1g)の中央値0.05gを
  // ASSUMED_DESK_BUMP_AMPLITUDE_RAD(1e-3 rad)に対応させる線形換算。
  const IMPULSE_REFERENCE_PEAK_G = 0.05;
  const IMPULSE_REFERENCE_AMPLITUDE_RAD = 1e-3;

  async function runImpulseMeasurement(){
    if(elements.impulseMeasureButton) elements.impulseMeasureButton.disabled = true;
    store.updateControl("impulseMeasurementStatus", "requesting");
    try{
      if(typeof DeviceMotionEvent === "undefined"){
        store.updateControl("impulseMeasurementStatus", "unsupported");
        return;
      }
      if(typeof DeviceMotionEvent.requestPermission === "function"){
        const permission = await DeviceMotionEvent.requestPermission();
        if(permission !== "granted"){
          store.updateControl("impulseMeasurementStatus", "error");
          return;
        }
      }
      store.updateControl("impulseMeasurementStatus", "measuring");
      let peakAccelMs2 = 0;
      const onMotion = event=>{
        const a = event.acceleration || event.accelerationIncludingGravity;
        if(!a) return;
        const ax = Number(a.x) || 0, ay = Number(a.y) || 0, az = Number(a.z) || 0;
        let magnitude = Math.sqrt(ax*ax + ay*ay + az*az);
        // accelerationIncludingGravityの場合は重力(約9.81)を差し引いた
        // 概算値を使う(gravityを含まないeventが取れる端末ではそのまま使用)。
        if(!event.acceleration && event.accelerationIncludingGravity){
          magnitude = Math.max(0, magnitude - 9.81);
        }
        if(magnitude > peakAccelMs2) peakAccelMs2 = magnitude;
      };
      window.addEventListener("devicemotion", onMotion);
      await new Promise(resolve=>setTimeout(resolve, IMPULSE_MEASURE_DURATION_MS));
      window.removeEventListener("devicemotion", onMotion);

      const peakG = peakAccelMs2 / 9.81;
      const measuredAmplitudeRad = Math.max(
        0,
        Math.min(1, (peakG / IMPULSE_REFERENCE_PEAK_G) * IMPULSE_REFERENCE_AMPLITUDE_RAD)
      );
      const currentTimeScale = store.getSnapshot().controls.timeScale;
      store.updateControl("impulseMeasuredAmplitudeRad", measuredAmplitudeRad);
      store.updateControl("impulseMeasuredAtTimeScale", currentTimeScale);
      store.updateControl("impulseMeasurementStatus", peakAccelMs2 > 0 ? "done" : "error");
    }catch(error){
      store.updateControl("impulseMeasurementStatus", "error");
    }finally{
      if(elements.impulseMeasureButton) elements.impulseMeasureButton.disabled = false;
    }
  }

  function handleControlInput(element){
    const key = element.dataset.control;
    if(!key) return;
    const result = store.updateControl(key, element.value);
    if(!result.ok){
      const snapshot = store.getSnapshot();
      if(snapshot.controls[key] !== undefined) setControlElementValue(element, snapshot.controls[key]);
    }
  }

  let opticalFullscreenScrollY = 0;

  function setOpticalFullscreen(fullscreen){
    const nextFullscreen = Boolean(fullscreen);
    const wasFullscreen =
      elements.opticalContainer?.classList.contains("is-optical-fullscreen") || false;
    if(nextFullscreen && !wasFullscreen){
      opticalFullscreenScrollY =
        window.scrollY || document.documentElement.scrollTop || 0;
    }
    elements.opticalContainer?.classList.toggle("is-optical-fullscreen", nextFullscreen);
    document.documentElement.classList.toggle("optical-fullscreen-active", nextFullscreen);
    if(elements.opticalTimeline) elements.opticalTimeline.hidden = !nextFullscreen;
    if(elements.opticsExpandButton){
      elements.opticsExpandButton.setAttribute("aria-expanded", String(nextFullscreen));
      elements.opticsExpandButton.setAttribute(
        "aria-label",
        nextFullscreen ? "光学全画面表示を閉じる" : "光学表示を全画面で表示する"
      );
    }
    if(elements.opticsTapHint){
      elements.opticsTapHint.textContent = nextFullscreen ? "戻す" : "拡大";
    }
    requestAnimationFrame(()=>{
      if(lastSnapshot) renderOptics(lastSnapshot, currentOpticalMotion());
      updateViewportFitStatus();
      if(!nextFullscreen && wasFullscreen){
        window.scrollTo({top:opticalFullscreenScrollY, left:0, behavior:"auto"});
      }
    });
  }

  let waveFullscreenScrollY = 0;

  let vernierFullscreenScrollY = 0;

  function setVernierFullscreen(fullscreen){
    const nextFullscreen = Boolean(fullscreen);
    const wasFullscreen =
      elements.vernierContainer?.classList.contains("is-vernier-fullscreen") || false;
    if(nextFullscreen && !wasFullscreen){
      vernierFullscreenScrollY =
        window.scrollY || document.documentElement.scrollTop || 0;
    }
    elements.vernierContainer?.classList.toggle("is-vernier-fullscreen", nextFullscreen);
    document.documentElement.classList.toggle("vernier-fullscreen-active", nextFullscreen);
    if(elements.vernierExpandButton){
      elements.vernierExpandButton.setAttribute("aria-expanded", String(nextFullscreen));
      elements.vernierExpandButton.setAttribute(
        "aria-label",
        nextFullscreen ? "バーニア全画面表示を閉じる" : "バーニア表示を全画面で表示する"
      );
    }
    if(elements.vernierTapHint){
      elements.vernierTapHint.textContent = nextFullscreen ? "戻す" : "拡大";
    }
    requestAnimationFrame(()=>{
      if(lastSnapshot) renderOptics(lastSnapshot, currentOpticalMotion());
      updateViewportFitStatus();
      if(!nextFullscreen && wasFullscreen){
        window.scrollTo({top:vernierFullscreenScrollY, left:0, behavior:"auto"});
      }
    });
  }

  function setWaveFullscreen(fullscreen){
    const nextFullscreen = Boolean(fullscreen);
    const wasFullscreen =
      elements.waveContainer?.classList.contains("is-wave-fullscreen") || false;
    if(nextFullscreen && !wasFullscreen){
      waveFullscreenScrollY =
        window.scrollY || document.documentElement.scrollTop || 0;
    }
    elements.waveContainer?.classList.toggle("is-wave-fullscreen", nextFullscreen);
    document.documentElement.classList.toggle("wave-fullscreen-active", nextFullscreen);
    if(elements.waveExpandButton){
      elements.waveExpandButton.setAttribute("aria-expanded", String(nextFullscreen));
      elements.waveExpandButton.setAttribute(
        "aria-label",
        nextFullscreen
          ? "波形とタイムラインの全画面表示を閉じる"
          : "波形とタイムラインを全画面で表示する"
      );
    }
    if(elements.waveTapHint){
      elements.waveTapHint.textContent = nextFullscreen ? "戻す" : "拡大";
    }
    requestAnimationFrame(()=>{
      if(lastSnapshot) renderWave(lastSnapshot);
      updateViewportFitStatus();
      if(!nextFullscreen && wasFullscreen){
        window.scrollTo({top:waveFullscreenScrollY, left:0, behavior:"auto"});
      }
    });
  }

  document.addEventListener("change", event=>{
    const control = event.target.closest("[data-control]");
    if(control) handleControlInput(control);
  });

  document.addEventListener("input", event=>{
    const control = event.target.closest('input[data-control][type="range"]');
    if(control) handleControlInput(control);
  });

  document.addEventListener("click", event=>{
    const helpTrigger = event.target.closest("[data-help]");
    if(helpTrigger){
      event.stopPropagation();
      openHelp(helpTrigger);
      return;
    }
    if(elements.helpFloat && !elements.helpFloat.hidden && !event.target.closest("#helpFloat")) closeHelp();
    const waveApplySurveyTrigger = event.target.closest("#waveApplySurveyButton");
    if(waveApplySurveyTrigger && !waveApplySurveyTrigger.disabled){
      const snapshot = store.getSnapshot();
      const survey = createFullWaveRangeSurvey(snapshot, snapshot.observation?.samples);
      const rangeResult = store.updateControl("waveManualRangeRad", survey.recommendedRangeRad);
      if(rangeResult.ok) store.updateControl("waveScaleMode", "manual");
      return;
    }
    const timeRangeTrigger = event.target.closest("#displayTimeRangeToggle");
    if(timeRangeTrigger){
      setDisplayTimeRangeMode(displayTimeRangeMode === "window" ? "full" : "window");
      return;
    }
    const opticalExpandTrigger = event.target.closest("#opticsExpandButton");
    if(opticalExpandTrigger){
      setOpticalFullscreen(opticalExpandTrigger.getAttribute("aria-expanded") !== "true");
      return;
    }
    const vernierExpandTrigger = event.target.closest("#vernierExpandButton");
    if(vernierExpandTrigger){
      setVernierFullscreen(vernierExpandTrigger.getAttribute("aria-expanded") !== "true");
      return;
    }
    const waveExpandTrigger = event.target.closest("#waveExpandButton");
    if(waveExpandTrigger){
      setWaveFullscreen(waveExpandTrigger.getAttribute("aria-expanded") !== "true");
      return;
    }
    const wavePlotTrigger = event.target.closest("#wavePlot");
    if(wavePlotTrigger && !event.target.closest(".wave-plot-actions")){
      setWaveFullscreen(elements.waveExpandButton?.getAttribute("aria-expanded") !== "true");
      return;
    }
    const csvExportTrigger = event.target.closest("#csvExportButton");
    if(csvExportTrigger && !csvExportTrigger.disabled){
      exportCompletedCsv();
      return;
    }
    const reportOpenTrigger = event.target.closest("#reportOpenButton");
    if(reportOpenTrigger && !reportOpenTrigger.disabled){
      showCompletedReport();
      return;
    }
    if(event.target.closest("#reportCloseButton")){
      hideCompletedReport();
      return;
    }
    if(event.target.closest("#reportCsvButton")){
      exportCompletedCsv();
      return;
    }
    if(event.target.closest("#reportPrintButton")){
      reportApi.saveReportPdf(elements.reportSheet,completedCsvSnapshot,elements.reportActionStatus);
      return;
    }
    if(event.target.closest("#extensionApplyButton")){
      store.choosePostBaselineExtension("extend");
      return;
    }
    if(event.target.closest("#extensionFinalizeButton")){
      store.choosePostBaselineExtension("finalize");
      return;
    }
    const binaryToggle = event.target.closest("button[data-binary-toggle][data-control]");
    if(binaryToggle && !binaryToggle.disabled){
      const currentValue = binaryToggle.value === "on" ? "on" : "off";
      const nextValue = currentValue === "on" ? "off" : "on";
      const snapshot = store.getSnapshot();
      const key = binaryToggle.dataset.control;
      const result =
        snapshot.lifecycle === Lifecycle.COMPLETED &&
        completedDisplayControlKeys.includes(key)
          ? store.updateCompletedDisplayControl(key, nextValue)
          : store.updateControl(key, nextValue);
      if(!result.ok){
        const currentSnapshot = store.getSnapshot();
        setControlElementValue(binaryToggle, currentSnapshot.controls[key]);
      }
      return;
    }
    const actionButton = event.target.closest("[data-action]");
    if(actionButton && !actionButton.disabled) handleAction(actionButton.dataset.action);
  });



  function updateViewportFitStatus(){
    const target = document.getElementById("viewportFitText");
    const shell = document.getElementById("appShell");
    if(!target || !shell) return;

    const rect = shell.getBoundingClientRect();
    const viewportW = Math.round(window.innerWidth || document.documentElement.clientWidth || 0);
    const viewportH = Math.round(window.innerHeight || document.documentElement.clientHeight || 0);
    const overflowW = Math.max(0, Math.ceil(rect.width - viewportW));
    const overflowH = Math.max(0, Math.ceil(rect.height - viewportH));
    const scrollW = Math.max(0, Math.ceil(document.documentElement.scrollWidth - viewportW));
    const scrollH = Math.max(0, Math.ceil(document.documentElement.scrollHeight - viewportH));

    const portraitWholePageScroll = window.matchMedia?.(
      "(pointer: coarse) and (orientation: portrait) and (max-width: 680px)"
    )?.matches;
    const hasHorizontalOverflow = overflowW > 2 || scrollW > 2;
    const hasVerticalOverflow = overflowH > 2 || scrollH > 2;
    const hasOverflow = hasHorizontalOverflow || (!portraitWholePageScroll && hasVerticalOverflow);
    target.dataset.fit = hasOverflow ? "overflow" : "ok";
    target.textContent = hasOverflow
      ? `fit overflow ${viewportW}×${viewportH} +${Math.max(overflowW, scrollW)}×${Math.max(overflowH, scrollH)}`
      : portraitWholePageScroll
        ? `fit OK ${viewportW}px幅｜縦スクロール`
        : `fit OK ${viewportW}×${viewportH}`;
  }


  function detectStandaloneMode(){
    const isStandalone =
      window.matchMedia?.("(display-mode: standalone)")?.matches ||
      window.navigator.standalone === true;

    document.documentElement.classList.toggle("standalone", Boolean(isStandalone));

    const note = document.querySelector(".mobile-safari-note");
    if(note){
      note.textContent = isStandalone
        ? "standalone表示"
        : "iPhone: 共有→ホーム画面に追加でstandalone表示";
    }
  }

  detectStandaloneMode();
  updateViewportFitStatus();
  window.matchMedia?.("(display-mode: standalone)")?.addEventListener?.("change", detectStandaloneMode);



  let observationFrameId = null;
  let lastTickTime = 0;

  function stopObservationLoop(){
    if(observationFrameId !== null){
      cancelAnimationFrame(observationFrameId);
      observationFrameId = null;
    }
    lastTickTime = 0;
  }

  function observationLoop(timestamp){
    const snapshot = store.getSnapshot();
    if(snapshot.lifecycle !== Lifecycle.RUNNING){
      observationFrameId = null;
      lastTickTime = 0;
      return;
    }

    if(!lastTickTime || timestamp - lastTickTime >= 80){
      store.tick(Date.now());
      lastTickTime = timestamp;
    }

    observationFrameId = requestAnimationFrame(observationLoop);
  }

  function ensureObservationLoop(snapshot){
    if(snapshot.lifecycle === Lifecycle.RUNNING){
      if(observationFrameId === null){
        observationFrameId = requestAnimationFrame(observationLoop);
      }
    }else{
      stopObservationLoop();
    }
  }


  let lastSnapshot = null;

  function renderSnapshot(snapshot){
    lastSnapshot = snapshot;
    render(snapshot);
    updateViewportFitStatus();
    ensureObservationLoop(snapshot);
  }

  window.addEventListener("resize", ()=>{
    closeHelp();
    if(reportIsOpen()){
      syncReportViewportInsets();
      reportApi.fitToViewport(elements.reportFrame,elements.reportSheet);
    }
    if(lastSnapshot){
      renderOptics(lastSnapshot, currentOpticalMotion());
      renderWave(lastSnapshot);
    }
    updateViewportFitStatus();
  }, {passive:true});

  if(window.visualViewport){
    const handleVisualViewportChange = ()=>{
      if(!reportIsOpen()) return;
      syncReportViewportInsets();
      reportApi.fitToViewport(elements.reportFrame,elements.reportSheet);
    };
    window.visualViewport.addEventListener("resize", handleVisualViewportChange, {passive:true});
    window.visualViewport.addEventListener("scroll", handleVisualViewportChange, {passive:true});
  }

  window.addEventListener("keydown", event=>{
    if(event.key !== "Escape") return;
    if(elements.helpFloat && !elements.helpFloat.hidden){
      closeHelp();
      return;
    }
    if(reportIsOpen()) hideCompletedReport();
  });

  if("ResizeObserver" in window){
    if(elements.opticalPanel){
      const opticalResizeObserver = new ResizeObserver(()=>{
        if(lastSnapshot) renderOptics(lastSnapshot, currentOpticalMotion());
      });
      opticalResizeObserver.observe(elements.opticalPanel);
    }
    if(elements.wavePlot){
      const waveResizeObserver = new ResizeObserver(()=>{
        if(lastSnapshot) renderWave(lastSnapshot);
      });
      waveResizeObserver.observe(elements.wavePlot);
    }
  }

  store.subscribe(renderSnapshot);

  window.ImpulseLaboApp = Object.freeze({
    getState: ()=>store.getSnapshot(),
    updateControl: (key,value)=>store.updateControl(key,value),
    start: ()=>store.start(),
    pause: ()=>store.pause(),
    resume: ()=>store.resume(),
    stop: ()=>store.stop(),
    clearObservation: ()=>store.clearObservation(),
    resetAll: ()=>store.resetAll(),
    completeObservation: reason=>store.complete(reason),
    tick: nowMs=>store.tick(nowMs),
    subscribe: listener=>store.subscribe(listener)
  });
})();
