(()=>{
  "use strict";

  const FORMAT_VERSION = "impulse_labo_microthrust_csv_v1";
  const SAMPLE_COLUMNS = Object.freeze([
    "section",
    "sample_index",
    "time_sec",
    "phase_id",
    "input_gate",
    "applied_torque_Nm",
    "signal_theta_rad",
    "signal_x_mm",
    "observed_theta_rad",
    "observed_x_mm",
    "noise_theta_rad",
    "noise_x_mm",
    "total_noise_equivalent_torque_Nm",
    "white_noise_torque_Nm",
    "white_noise_theta_rad",
    "drift_noise_torque_Nm",
    "drift_noise_theta_rad",
    "periodic_noise_torque_Nm",
    "periodic_noise_theta_rad",
    "impulse_noise_torque_Nm",
    "impulse_noise_theta_rad",
    "mechanical_noise_torque_Nm",
    "mechanical_noise_theta_rad",
    "optical_noise_equivalent_torque_Nm",
    "optical_noise_theta_rad",
    "numeric_step_torque_Nm",
    "numeric_step_theta_rad",
    "numeric_noise_equivalent_torque_Nm",
    "numeric_noise_theta_rad",
    "pre_baseline_flag",
    "main_evaluation_flag",
    "post_baseline_flag"
  ]);

  function scalar(value){
    if(value === null || value === undefined) return "";
    if(typeof value === "number") return Number.isFinite(value) ? String(value) : "";
    if(typeof value === "boolean") return value ? "true" : "false";
    if(Array.isArray(value)) return JSON.stringify(value);
    if(typeof value === "object") return JSON.stringify(value);
    return String(value);
  }

  function escapeCell(value){
    return `"${scalar(value).replaceAll('"','""')}"`;
  }

  function pushEntry(rows, section, key, value){
    rows.push([section, key, value]);
  }

  function appendFlat(rows, section, source, prefix = ""){
    if(!source || typeof source !== "object") return;
    for(const [key, value] of Object.entries(source)){
      if(key === "sampleIndices") continue;
      const path = prefix ? `${prefix}.${key}` : key;
      if(value && typeof value === "object" && !Array.isArray(value)){
        appendFlat(rows, section, value, path);
      }else{
        pushEntry(rows, section, path, value);
      }
    }
  }

  function inWindow(time, windowDefinition){
    const start = Number(windowDefinition?.start);
    const end = Number(windowDefinition?.end);
    return Number.isFinite(time) && Number.isFinite(start) && Number.isFinite(end) &&
      time >= start && time <= end;
  }

  function buildCsvText(snapshot, exportDate = new Date(), buildInfo = {}){
    if(!snapshot || snapshot.lifecycle !== "completed"){
      throw new Error("completed_snapshot_required");
    }

    const rows = [["section","key","value"]];
    const observation = snapshot.observation || {};
    const analysis = snapshot.analysis || {};
    const windows = observation.timeline?.windows || {};

    pushEntry(rows,"meta","format_version",FORMAT_VERSION);
    pushEntry(rows,"meta","app_name","IMPULSE LABO");
    pushEntry(rows,"meta","simulator_id","micro_thrust");
    pushEntry(rows,"meta","app_version",buildInfo.appVersion || "IL278S3Q");
    pushEntry(rows,"meta","build",buildInfo.build || "IL278S3Q");
    pushEntry(rows,"meta","exported_at_utc",exportDate.toISOString());
    pushEntry(rows,"meta","lifecycle",snapshot.lifecycle);
    pushEntry(rows,"meta","revision",snapshot.revision);
    pushEntry(rows,"meta","control_revision",snapshot.controlRevision);
    pushEntry(rows,"meta","physics_revision",snapshot.physicsRevision);
    pushEntry(rows,"meta","observation_revision",snapshot.observationRevision);
    pushEntry(rows,"meta","analysis_revision",snapshot.analysisRevision);

    appendFlat(rows,"session",snapshot.session);
    appendFlat(rows,"settings",snapshot.controls);
    appendFlat(rows,"physics",snapshot.physics);
    appendFlat(rows,"post_baseline_extension",snapshot.postBaselineExtension);

    pushEntry(rows,"observation","duration_seconds",observation.durationSeconds);
    pushEntry(rows,"observation","elapsed_seconds",observation.currentElapsedSeconds);
    pushEntry(rows,"observation","sample_count",observation.sampleCount);
    appendFlat(rows,"observation_input",observation.input);
    appendFlat(rows,"observation_response",observation.response);
    appendFlat(rows,"observation_stats",observation.stats);
    appendFlat(rows,"noise",observation.noise);

    appendFlat(rows,"pre_baseline",analysis.evaluation?.preBaseline);
    appendFlat(rows,"main_evaluation",analysis.evaluation?.mainEvaluation);
    appendFlat(rows,"post_baseline",analysis.evaluation?.postBaseline);
    appendFlat(rows,"baseline_comparison",analysis.evaluation?.baseline);
    appendFlat(rows,"analysis_full",analysis.full);
    appendFlat(rows,"signal_to_noise",analysis.signalToNoise);
    appendFlat(rows,"detection_judgement",analysis.detection);
    appendFlat(rows,"recovery",analysis.recovery);
    appendFlat(rows,"tail_stability",analysis.tailStability);
    appendFlat(rows,"residual_support",analysis.residualSupport);
    appendFlat(rows,"overall_judgement",analysis.overallJudgement);

    rows.push(SAMPLE_COLUMNS);
    for(const sample of observation.samples || []){
      const t = Number(sample.t);
      rows.push([
        "timeseries",
        sample.index,
        sample.t,
        sample.phaseId,
        sample.inputGate,
        sample.appliedTorqueNm,
        sample.signalThetaRad,
        sample.signalXMm,
        sample.thetaRad,
        sample.xMm,
        sample.noiseThetaRad,
        sample.noiseXMm,
        sample.totalNoiseEquivalentTorqueNm,
        sample.whiteNoiseTorqueNm,
        sample.whiteNoiseThetaRad,
        sample.driftNoiseTorqueNm,
        sample.driftNoiseThetaRad,
        sample.periodicNoiseTorqueNm,
        sample.periodicNoiseThetaRad,
        sample.impulseNoiseTorqueNm,
        sample.impulseNoiseThetaRad,
        sample.mechanicalNoiseTorqueNm,
        sample.mechanicalNoiseThetaRad,
        sample.opticalNoiseEquivalentTorqueNm,
        sample.opticalNoiseThetaRad,
        sample.numericStepTorqueNm,
        sample.numericStepThetaRad,
        sample.numericNoiseEquivalentTorqueNm,
        sample.numericNoiseThetaRad,
        inWindow(t,windows.preBaseline),
        inWindow(t,windows.mainEvaluation),
        inWindow(t,windows.postBaseline)
      ]);
    }

    return "\ufeff" + rows.map(row=>row.map(escapeCell).join(",")).join("\r\n");
  }

  function createFilename(date = new Date()){
    const stamp = date.toISOString().replace(/[-:T.]/g,"").slice(0,14);
    return `IL278S3Q_MT_${stamp}.csv`;
  }

  async function saveCsvText(csvText, filename){
    const type = "text/csv;charset=utf-8";
    const blob = new Blob([csvText],{type});

    // IL278: navigator.share() was removed. It repeatedly caused iOS share
    // targets to spawn a spurious plain-text artifact (first from the `text`
    // field, then even from `title` alone) instead of/alongside the actual
    // CSV file. Direct download is unambiguous and matches the proven PDF
    // export flow (report-export.js), including the same octet-stream
    // re-wrap so Safari downloads rather than previews it.
    try{
      const downloadBlob = new Blob([blob],{type:"application/octet-stream"});
      const url = URL.createObjectURL(downloadBlob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.setAttribute("download", filename);
      anchor.rel = "noopener";
      anchor.hidden = true;
      document.body.appendChild(anchor);
      anchor.click();
      window.setTimeout(()=>{
        anchor.remove();
        URL.revokeObjectURL(url);
      },1000);
      return Object.freeze({ok:true,method:"download"});
    }catch(error){
      return Object.freeze({ok:false,method:"download",error:error?.message || "download_failed"});
    }
  }

  window.ImpulseLaboCsv = Object.freeze({
    FORMAT_VERSION,
    SAMPLE_COLUMNS,
    buildCsvText,
    createFilename,
    saveCsvText
  });
})();
