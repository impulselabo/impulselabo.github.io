(()=>{
  "use strict";

  const modeLabels = Object.freeze({
    calibration:"校正",
    "noise-check":"ノイズ確認",
    gravity:"重力測定",
    custom:"カスタム測定",
    electrostatic:"静電気力",
    repeat:"繰り返し試験",
    "detection-limit":"検出限界チェック",
    mosquito:"蚊飛翔"
  });

  const levelLabels = Object.freeze({
    easy:"かんたん / Easy",
    standard:"標準 / Standard",
    full:"詳細 / Full"
  });

  const materialLabels = Object.freeze({
    tungsten:"タングステン",
    quartz:"石英",
    nylon:"ナイロン"
  });

  const noisePresetLabels = Object.freeze({
    ideal:"Ideal",
    standard:"Standard",
    harsh:"Harsh",
    custom:"Custom"
  });

  const endReasonLabels = Object.freeze({
    duration_complete:"観測時間満了",
    post_baseline_extension_complete:"事後Baseline延長完了",
    post_baseline_extension_limit:"事後Baseline延長上限",
    "standard-extension-limit-reached":"事後Baseline標準延長上限",
    manual_stop:"手動停止"
  });

  const noiseComponentLabels = Object.freeze({
    white:"White / 微小ランダム",
    drift:"drift / 温度ドリフト",
    periodic:"periodic / 周期振動",
    impulse:"impulse / 衝撃",
    optical:"optical / 光学読取誤差",
    numeric:"numeric / 量子化誤差"
  });

  const noiseComponentColors = Object.freeze({
    white:"#008fd1",
    drift:"#c45a00",
    periodic:"#12843a",
    impulse:"#d82f49",
    optical:"#8b3fc7",
    numeric:"#9a7f00"
  });

  function finite(value){ return Number.isFinite(Number(value)); }

  function sci(value,digits = 3){
    if(!finite(value)) return "--";
    const number = Number(value);
    if(number === 0) return "0";
    return number.toExponential(digits).replace("e+","e");
  }

  function compact(value,digits = 3){
    if(!finite(value)) return "--";
    const number = Number(value);
    const absolute = Math.abs(number);
    if(number === 0) return "0";
    if(absolute >= 0.01 && absolute < 10000){
      return number.toFixed(digits).replace(/\.?0+$/,"");
    }
    return sci(number,digits);
  }

  function seconds(value){
    return finite(value) ? `${compact(value,1)} s` : "--";
  }

  function windowText(windowDefinition){
    if(!windowDefinition || !finite(windowDefinition.start) || !finite(windowDefinition.end)) return "--";
    return `${compact(windowDefinition.start,1)}–${compact(windowDefinition.end,1)} s`;
  }

  function windowStatsText(windowAnalysis){
    const stats = windowAnalysis?.stats;
    if(!stats || !finite(stats.meanThetaRad)) return `${windowAnalysis?.label || "評価窓"}: --`;
    return `${windowAnalysis.label}: ${windowText(windowAnalysis)} / n=${windowAnalysis.sampleCount ?? stats.count ?? "--"}\nmean ${sci(stats.meanThetaRad,3)} rad / σ ${sci(stats.sigmaThetaRad,3)} rad`;
  }

  function tailLabel(tail){
    if(!tail?.applicable) return "対象外";
    if(!tail.complete) return "評価待ち";
    return tail.judgement || tail.label || tail.status || "--";
  }

  function shieldingText(noise){
    const shielding = noise?.shielding;
    if(!shielding?.masterEnabled) return "遮蔽OFF";
    const factors = shielding.componentFactors || {};
    return `遮蔽ON ${shielding.label || shielding.preset || "--"} / W×${compact(factors.white,2)} D×${compact(factors.drift,2)} P×${compact(factors.periodic,2)} I×${compact(factors.impulse,2)} O×${compact(factors.optical,2)} N×${compact(factors.numeric,2)}`;
  }

  function noiseText(observation){
    const noise = observation?.noise;
    if(!noise?.masterEnabled) return "Noise OFF / 遮蔽対象なし";
    const abbreviations = {white:"W",drift:"D",periodic:"P",impulse:"I",optical:"O",numeric:"N"};
    const enabled = Object.entries(noise.components || {}).filter(([,component])=>component.enabled).map(([key])=>abbreviations[key] || key);
    const measuredNote = noise.impulseAmplitudeSource === "measured" ? " / impulse振幅は端末センサー入力" : "";
    return `${noisePresetLabels[noise.preset] || noise.preset || "--"} / 適用 ${enabled.length ? enabled.join("・") : "なし"} / ${shieldingText(noise)}${measuredNote}`;
  }

  function visibleNoiseComponents(observation){
    const noise = observation?.noise;
    if(!noise?.masterEnabled) return [];
    return Object.entries(noise.components || {})
      .filter(([,component])=>component?.enabled && component?.visible)
      .map(([id,component])=>Object.freeze({
        id,
        label:noiseComponentLabels[id] || id,
        color:noiseComponentColors[id] || "#777",
        level:Number(component.level) || 0,
        shieldingFactor:Number(component.shieldingFactor) || 1
      }));
  }

  function jstDate(isoValue){
    const date = new Date(isoValue || Date.now());
    return new Intl.DateTimeFormat("ja-JP",{
      timeZone:"Asia/Tokyo",year:"numeric",month:"2-digit",day:"2-digit",
      hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false
    }).format(date);
  }

  function createViewModel(snapshot){
    if(!snapshot || snapshot.lifecycle !== "completed") throw new Error("completed_snapshot_required");
    const controls = snapshot.controls || {};
    const physics = snapshot.physics || {};
    const observation = snapshot.observation || {};
    const noise = observation.noise || {};
    const analysis = snapshot.analysis || {};
    const evaluation = analysis.evaluation || {};
    const detection = analysis.detection || {};
    const residual = analysis.residualSupport || {};
    const overall = analysis.overallJudgement || {};
    const windows = observation.timeline?.windows || {};
    const sn = analysis.signalToNoise || {};
    const recovery = analysis.recovery || {};
    const full = analysis.full || {};
    const extension = snapshot.postBaselineExtension || {};
    const extensionCount = Math.max(0,Number(extension.extensionCount) || 0);
    const extensionSummary = extensionCount > 0
      ? `事後Baseline標準延長 ${extensionCount}/${Number(extension.maximumExtensions) || 2}回（追加${Number(extension.addedSeconds) || 0}秒）${extension.finalizationReason === "standard-extension-limit-reached" ? "、標準上限で終了確定" : ""}。`
      : "事後Baseline標準延長なし。";
    const visibleComponents = visibleNoiseComponents(observation);
    const componentLabels = visibleComponents.map(component=>component.label).join("、");
    const componentNotice = visibleComponents.length
      ? `表示成分: ${componentLabels}。成分線は確認用、判定値は固定解析値です。`
      : "表示成分なし。判定値は固定解析値です。";
    const evidence = `S/N ${finite(sn.ratio) ? compact(sn.ratio,2) : "--"}、主評価窓 ${windowText(windows.mainEvaluation)}、信号 ${sci(sn.signalAbsThetaRad,3)} rad、Baseline σ ${sci(sn.baselineNoiseThetaRad,3)} rad。残留 ${residual.label || "--"}、終盤 ${tailLabel(analysis.tailStability)}。`;
    const notice = `${componentNotice} 主判定は主評価窓、Baselineはノイズ・復帰・残留の補助確認です。${extensionSummary}`;

    const summary = `主評価窓 ${windowText(windows.mainEvaluation)}、信号 ${sci(sn.signalAbsThetaRad,3)} rad、Baseline σ ${sci(sn.baselineNoiseThetaRad,3)} rad。S/N ${finite(sn.ratio) ? compact(sn.ratio,2) : "--"}、検出 ${detection.label || "--"}、残留 ${residual.label || "--"}、終盤 ${tailLabel(analysis.tailStability)}を統合し、${overall.label || "--"}としました。${extensionSummary}`;
    const reason = `${overall.reason || detection.reason || "判定理由なし。"}\n残留: ${residual.label || "対象外"} / 終盤: ${tailLabel(analysis.tailStability)}。${extensionSummary}`;

    return Object.freeze({
      version:"IL278S3Q / Build IL278S3Q",
      generatedAt:`生成日時: ${jstDate()}`,
      footerCode:`IL278S3Q / #${snapshot.session?.sequence ?? "--"} / ${snapshot.session?.completedAt || "--"}`,
      overallLabel:overall.label || "評価待ち",
      overallReason:overall.reason || detection.reason || "--",
      evidence,
      notice,
      modeLevel:`${modeLabels[controls.mode] || controls.mode || "--"} / ${levelLabels[controls.controlLevel] || controls.controlLevel || "--"}`,
      durationScale:`${seconds(observation.durationSeconds)} / ${compact(controls.timeScale,1)}×`,
      observationState:snapshot.lifecycle === "completed" ? "観測完了" : "--",
      endReason:endReasonLabels[snapshot.session?.endReason] || snapshot.session?.endReason || "--",
      force:Math.abs(Number(controls.inputTorqueNm) || 0) > 0 ? `ON / ${sci(controls.inputTorqueNm,3)} N·m` : "OFF / 0 N·m",
      noise:noise?.masterEnabled ? `${noisePresetLabels[noise.preset] || noise.preset || "--"} / ${visibleComponents.length ? "表示ON" : "表示OFF"} / seed ${noise.seed ?? "--"}${noise.impulseAmplitudeSource === "measured" ? " / impulse実測【未検証】" : ""}` : "OFF",
      shielding:shieldingText(observation?.noise),
      torqueStiffness:`τ ${sci(controls.inputTorqueNm,3)} N·m / k ${sci(controls.stiffnessNmPerRad,3)} N·m/rad`,
      opticalPhysics:`L ${compact(controls.opticalDistanceM,3)} m / θeq ${sci(physics.thetaEqRad,3)} rad / xeq ${compact(physics.xEqMm,3)} mm`,
      mechanics:`I ${sci(controls.inertiaKgM2,3)} kg·m² / c ${sci(controls.dampingNmsPerRad,3)} N·m·s/rad / ${materialLabels[controls.material] || controls.material || "--"} ${compact(controls.wireDiameterMm,3)} mm${controls.deviceModel === "virtual-optical" ? ` / L_fiber ${compact(controls.fiberLengthM,3)} m` : ""}`,
      noiseShielding:noiseText(observation),
      opticalReadout:`現在 ${compact(observation.currentSample?.xMm,3)} / +P ${compact(Math.max(0,Number(full.peakPlusXMm)||0),3)} / −P ${compact(Math.min(0,Number(full.peakMinusXMm)||0),3)} mm`,
      vernierReadout:vernierReadoutText(observation, controls),
      waveReadout:`mean ${sci(full.meanThetaRad,3)} rad / rms ${sci(full.rmsThetaRad,3)} rad / σ ${sci(full.sigmaThetaRad,3)} rad`,
      windowStats:[
        windowStatsText(evaluation.preBaseline),
        windowStatsText(evaluation.mainEvaluation),
        windowStatsText(evaluation.postBaseline)
      ].join("\n"),
      detection:`S/N ${finite(sn.ratio) ? compact(sn.ratio,2) : "--"}\n信号 ${sci(sn.signalAbsThetaRad,3)} rad\nBaseline σ ${sci(sn.baselineNoiseThetaRad,3)} rad\n判定 ${detection.label || "--"}`,
      stability:`事後平均残留比 ${finite(recovery.postMeanResidualRatio) ? compact(recovery.postMeanResidualRatio,3) : "--"}\n現在復帰率 ${finite(recovery.recoveryFraction) ? compact(recovery.recoveryFraction * 100,1) + "%" : "--"}\n残留判定 ${residual.label || "--"}\n終盤安定度 ${tailLabel(analysis.tailStability)}`,
      snValue:finite(sn.ratio) ? compact(sn.ratio,2) : "--",
      averageDisplacement:`${compact(full.meanXMm,3)} mm`,
      stdDeviation:`${compact(full.sigmaXMm,3)} mm`,
      baselineDifference:`${residual.label || "--"} / ${finite(recovery.postMeanResidualRatio) ? compact(recovery.postMeanResidualRatio,3) : "--"}`,
      mainWindow:windowText(windows.mainEvaluation),
      supportCheck:`残留 ${residual.label || "--"} / 終盤 ${tailLabel(analysis.tailStability)}`,
      tailCheck:`${analysis.tailStability?.reason || tailLabel(analysis.tailStability)}。${extensionSummary}`,
      analysisComment:`${windowStatsText(evaluation.mainEvaluation)}\n${componentNotice}`,
      overallSummary:summary,
      preReliability:evaluation.preBaseline?.stats?.count ? "取得済" : "未取得",
      mainReliability:evaluation.mainEvaluation?.stats?.count ? "有効" : "未取得",
      postReliability:evaluation.postBaseline?.stats?.count ? (residual.label || "比較済") : "未取得",
      noiseReliability:visibleComponents.length ? "表示確認済" : "表示成分なし",
      decisionReliability:overall.label || "評価待ち",
      waveDuration:seconds(observation.durationSeconds),
      summary,
      reason
    });
  }

  function setText(root,id,value){
    const element = root.querySelector(`#${id}`);
    if(element) element.textContent = value;
  }

  function clearCanvas(canvas){
    const context = canvas?.getContext?.("2d");
    if(!context) return null;
    context.clearRect(0,0,canvas.width,canvas.height);
    context.fillStyle = "#ffffff";
    context.fillRect(0,0,canvas.width,canvas.height);
    context.lineCap = "round";
    context.lineJoin = "round";
    return context;
  }

  function niceRange(raw){
    const value = Math.max(Math.abs(Number(raw)) || 0,1e-12);
    const power = 10 ** Math.floor(Math.log10(value));
    const normalized = value / power;
    const step = normalized <= 1 ? 1 : normalized <= 1.5 ? 1.5 : normalized <= 2 ? 2 : normalized <= 3 ? 3 : normalized <= 5 ? 5 : 10;
    return step * power;
  }

  function drawOptical(canvas,snapshot){
    const context = clearCanvas(canvas);
    if(!context) return;
    const samples = snapshot.observation?.samples || [];
    const xs = samples.map(sample=>Number(sample.xMm)).filter(Number.isFinite);
    const current = Number(snapshot.observation?.currentSample?.xMm) || 0;
    const plusPeak = Math.max(0,...xs);
    const minusPeak = Math.min(0,...xs);
    const range = niceRange(Math.max(Math.abs(plusPeak),Math.abs(minusPeak),Math.abs(current)) * 1.15);
    const width = canvas.width;
    const height = canvas.height;
    const left = 108;
    const right = 44;
    const top = 22;
    const axisY = 92;
    const bottom = height - 42;
    const plotWidth = width - left - right;
    const x = value=>left + ((value + range) / (range * 2)) * plotWidth;

    context.strokeStyle = "#cbd6dd";
    context.lineWidth = 2;
    for(const ratio of [-1,-.5,0,.5,1]){
      const px=x(range*ratio);
      context.beginPath(); context.moveTo(px,top); context.lineTo(px,bottom); context.stroke();
      context.fillStyle="#3e505c"; context.font="22px system-ui"; context.textAlign=ratio===-1?"left":ratio===1?"right":"center";
      context.fillText(ratio===0?"0":compact(range*ratio,2),px,height-10);
    }
    context.strokeStyle="#526875"; context.lineWidth=3;
    context.beginPath(); context.moveTo(left,axisY); context.lineTo(width-right,axisY); context.stroke();
    context.strokeRect(left,top,plotWidth,bottom-top);

    for(const sample of samples){
      const value=Number(sample.xMm);
      if(!Number.isFinite(value)) continue;
      context.fillStyle=value>=0?"rgba(218,62,75,.22)":"rgba(48,126,204,.22)";
      context.beginPath(); context.arc(x(value),axisY,3.2,0,Math.PI*2); context.fill();
    }

    function peak(value,label,color,align){
      if((label==="+Peak" && value<=0)||(label==="−Peak" && value>=0)) return;
      const px=x(value);
      context.setLineDash([8,7]); context.strokeStyle=color; context.lineWidth=2.5;
      context.beginPath(); context.moveTo(px,top); context.lineTo(px,bottom); context.stroke(); context.setLineDash([]);
      context.fillStyle=color; context.font="700 22px system-ui"; context.textAlign=align;
      context.fillText(label,px+(align==="left"?8:-8),top+22);
    }
    peak(plusPeak,"+Peak","#d43e4b",plusPeak>range*.78?"right":"left");
    peak(minusPeak,"−Peak","#307ecc",minusPeak<-range*.78?"left":"right");

    const currentX=x(current);
    const gradient=context.createRadialGradient(currentX,axisY,2,currentX,axisY,18);
    gradient.addColorStop(0,"rgba(255,255,255,1)"); gradient.addColorStop(.25,"rgba(27,79,106,.95)"); gradient.addColorStop(1,"rgba(27,79,106,0)");
    context.fillStyle=gradient; context.beginPath(); context.arc(currentX,axisY,18,0,Math.PI*2); context.fill();
    context.fillStyle="#173f58"; context.beginPath(); context.arc(currentX,axisY,5,0,Math.PI*2); context.fill();
    context.fillStyle="#3e505c"; context.font="22px system-ui"; context.textAlign="left";
    context.fillText(`Range ±${compact(range,2)} mm`,left,20);
  }

  function vernierReadoutText(observation, controls){
    const samples = observation?.samples || [];
    const xs = samples.map(sample=>Number(sample.xMm)).filter(Number.isFinite);
    const current = Number(observation?.currentSample?.xMm) || 0;
    const rangeMm = safeReportOpticalRangeMm([...xs, current], controls);
    const rawDivMm = (rangeMm * 2) / 10;
    const magnitude = Math.pow(10, Math.floor(Math.log10(Math.max(rawDivMm,1e-12))));
    const normalized = rawDivMm / magnitude;
    const niceMultiplier = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
    const divMm = niceMultiplier * magnitude;
    const readDivRaw = current / divMm;
    const mainInteger = Math.floor(readDivRaw);
    const fracRaw = readDivRaw - mainInteger;
    let coincidentIndex = Math.round(fracRaw * 10) % 10;
    let readMainInteger = mainInteger;
    if(Math.round(fracRaw * 10) >= 10){ readMainInteger = mainInteger + 1; }
    const vernierReadDiv = readMainInteger + coincidentIndex / 10;
    const sign = vernierReadDiv >= 0 ? "+" : "";
    return `読取値 ${sign}${vernierReadDiv.toFixed(1)} div（連続値 ${current>=0?"+":""}${compact(current,3)} mm）`;
  }

  // IL278: mirrors app.js's safeOpticalRangeMm() so the report's vernier scale
  // matches what the live simulator shows for the same observation.
  function safeReportOpticalRangeMm(valuesMm, controls){
    const list = Array.isArray(valuesMm) ? valuesMm : [valuesMm];
    const minRangeMm = 0.001;
    const zoomRaw = Number(controls?.opticsZoom);
    const zoom = Number.isFinite(zoomRaw) ? Math.max(0.1, Math.min(100, zoomRaw)) : 1;
    const maxAbs = Math.max(
      minRangeMm,
      ...list.map(value=>Number.isFinite(Number(value)) ? Math.abs(Number(value)) : 0)
    );
    if(controls?.opticalScaleMode === "fixed"){
      return Math.max(minRangeMm, 2 / zoom);
    }
    const safetyRatio = 0.72;
    return Math.max(minRangeMm, (maxAbs / safetyRatio) / zoom);
  }

  function drawVernier(canvas,snapshot){
    const context = clearCanvas(canvas);
    if(!context) return;
    const samples = snapshot.observation?.samples || [];
    const xs = samples.map(sample=>Number(sample.xMm)).filter(Number.isFinite);
    const current = Number(snapshot.observation?.currentSample?.xMm) || 0;
    const rangeMm = safeReportOpticalRangeMm([...xs, current], snapshot.controls);
    const shift = current;

    // IL278: same auto-scale + true vernier geometry as the live app's
    // renderVernier(app.js), adapted to this static report canvas.
    const rawDivMm = (rangeMm * 2) / 10;
    const magnitude = Math.pow(10, Math.floor(Math.log10(Math.max(rawDivMm,1e-12))));
    const normalized = rawDivMm / magnitude;
    const niceMultiplier = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
    const divMm = niceMultiplier * magnitude;

    const width = canvas.width;
    const height = canvas.height;
    const mainScaleWidth = width * 0.6;
    const centerX = width / 2;
    const mainLeft = centerX - mainScaleWidth / 2;
    const mainRight = centerX + mainScaleWidth / 2;

    const mainScaleY = 64;
    const vernierScaleY = mainScaleY + 30;

    const readDivRaw = shift / divMm;
    const mainInteger = Math.floor(readDivRaw);
    const WINDOW_DIVS = 11;
    const windowStart = mainInteger - 1;
    const mainPxPerDiv = mainScaleWidth / WINDOW_DIVS;
    const pointerX = mainLeft + (readDivRaw - windowStart) * mainPxPerDiv;

    context.strokeStyle = "#526875";
    context.lineWidth = 3;
    context.beginPath(); context.moveTo(mainLeft, mainScaleY); context.lineTo(mainRight, mainScaleY); context.stroke();

    context.textAlign = "center";
    for(let d = windowStart; d <= windowStart + WINDOW_DIVS; d += 1){
      const px = mainLeft + (d - windowStart) * mainPxPerDiv;
      if(px < mainLeft - 0.5 || px > mainRight + 0.5) continue;
      context.strokeStyle = "#526875";
      context.lineWidth = 2.5;
      context.beginPath(); context.moveTo(px, mainScaleY - 20); context.lineTo(px, mainScaleY); context.stroke();
      context.fillStyle = "#3e505c";
      context.font = "22px system-ui";
      context.fillText(String(d), px, mainScaleY - 26);
    }

    const VERNIER_STEPS = 10;
    const vernierStepPx = mainPxPerDiv * 0.9;
    const fracRaw = readDivRaw - mainInteger;
    let coincidentIndex = Math.round(fracRaw * VERNIER_STEPS) % VERNIER_STEPS;
    let readMainInteger = mainInteger;
    if(Math.round(fracRaw * VERNIER_STEPS) >= VERNIER_STEPS){ readMainInteger = mainInteger + 1; }
    const vernierReadDiv = readMainInteger + coincidentIndex / VERNIER_STEPS;
    const vernierZeroX = pointerX;

    context.strokeStyle = "#8a99a3";
    context.lineWidth = 2.5;
    context.beginPath();
    context.moveTo(vernierZeroX, vernierScaleY);
    context.lineTo(vernierZeroX + VERNIER_STEPS * vernierStepPx, vernierScaleY);
    context.stroke();

    for(let i = 0; i <= VERNIER_STEPS; i += 1){
      const px = vernierZeroX + i * vernierStepPx;
      const isCoincident = i === coincidentIndex;
      context.strokeStyle = isCoincident ? "#d43e4b" : "#8a99a3";
      context.lineWidth = isCoincident ? 4 : 2;
      context.beginPath(); context.moveTo(px, vernierScaleY); context.lineTo(px, vernierScaleY + 24); context.stroke();
      if(i % 5 === 0 || isCoincident){
        context.fillStyle = isCoincident ? "#d43e4b" : "#3e505c";
        context.font = isCoincident ? "700 22px system-ui" : "20px system-ui";
        context.textAlign = "center";
        context.fillText(String(i), px, vernierScaleY + 44);
      }
    }

    context.fillStyle = "#173f58";
    context.beginPath();
    context.moveTo(pointerX, mainScaleY + 1);
    context.lineTo(pointerX - 9, mainScaleY + 15);
    context.lineTo(pointerX + 9, mainScaleY + 15);
    context.closePath();
    context.fill();

    const coincidentX = vernierZeroX + coincidentIndex * vernierStepPx;
    context.strokeStyle = "#d43e4b";
    context.lineWidth = 1.5;
    context.setLineDash([5,5]);
    context.beginPath(); context.moveTo(coincidentX, mainScaleY); context.lineTo(coincidentX, vernierScaleY + 24); context.stroke();
    context.setLineDash([]);

    const readSign = vernierReadDiv >= 0 ? "+" : "";
    context.fillStyle = "#173f58";
    context.textAlign = "center";
    context.font = "700 30px system-ui";
    context.fillText(`${readSign}${vernierReadDiv.toFixed(1)} div`, centerX, vernierScaleY + 92);
    context.font = "20px system-ui";
    context.fillText(`${readSign}${compact(vernierReadDiv*divMm,3)} mm ／ 1 div = ${compact(divMm,2)} mm`, centerX, vernierScaleY + 118);
  }

  function drawWave(canvas,snapshot){
    const context = clearCanvas(canvas);
    if(!context) return;
    const samples = snapshot.observation?.samples || [];
    const duration = Number(snapshot.observation?.durationSeconds) || 1;
    const thetaEq = Number(snapshot.physics?.thetaEqRad) || 0;
    const observed = samples.map(sample=>Number(sample.thetaRad)).filter(Number.isFinite);
    // IL278 ノイズ仕様D-fix2: reverted to including impulse's contribution when
    // sizing the range (matches app.js -- see its resolveWaveRange comment
    // for the full rationale: excluding impulse was based on an incomplete
    // diagnosis; the real fix belongs in the gain calculation, not the range).
    const yRange = niceRange(Math.max(Math.abs(thetaEq),...observed.map(Math.abs)) * 1.18);
    const isClipped = observed.some(value => Math.abs(value) > yRange);
    const width=canvas.width, height=canvas.height;
    // IL278 ノイズ仕様D-fix: top margin widened from 24 to 44px to give the
    // caption/badge their own dedicated band, fully separate from the plot.
    // Previous attempts (top+22 inside the plot, then y=18 just above it)
    // both still overlapped the waveform because the old top=24 margin left
    // almost no clearance between the caption text and the plot's top edge.
    const left=112, right=36, top=44, bottom=106;
    const plotWidth=width-left-right, plotHeight=height-top-bottom;
    const x=time=>left+(Number(time)/duration)*plotWidth;
    const y=value=>top+((yRange-Number(value))/(2*yRange))*plotHeight;
    const windows=snapshot.observation?.timeline?.windows || {};

    function band(windowDefinition,color){
      if(!windowDefinition) return;
      const x1=x(windowDefinition.start), x2=x(windowDefinition.end);
      context.fillStyle=color; context.fillRect(x1,top,x2-x1,plotHeight);
    }
    band(windows.preBaseline,"rgba(67,142,178,.10)");
    band(windows.postBaseline,"rgba(67,142,178,.10)");
    band(windows.mainEvaluation,"rgba(194,152,52,.13)");

    context.strokeStyle="#d9e2e7"; context.lineWidth=2;
    context.fillStyle="#3e505c"; context.font="21px system-ui";
    for(let index=0;index<=4;index++){
      const ratio=index/4;
      const px=left+plotWidth*ratio;
      context.beginPath(); context.moveTo(px,top); context.lineTo(px,top+plotHeight); context.stroke();
      context.textAlign=index===0?"left":index===4?"right":"center";
      context.fillText(`${compact(duration*ratio,1)}s`,px,top+plotHeight+30);
    }
    for(const ratio of [-1,-.5,0,.5,1]){
      const py=y(yRange*ratio);
      context.strokeStyle=ratio===0?"#657883":"#d9e2e7"; context.lineWidth=ratio===0?3:2;
      context.beginPath(); context.moveTo(left,py); context.lineTo(left+plotWidth,py); context.stroke();
      context.fillStyle="#3e505c"; context.textAlign="right";
      context.fillText(ratio===0?"0":sci(yRange*ratio,2),left-12,py+7);
    }
    context.strokeStyle="#526875"; context.lineWidth=3; context.strokeRect(left,top,plotWidth,plotHeight);

    // IL278 ノイズ仕様D-fix: clip all waveform/component-line drawing to the
    // plot rectangle, mirroring app.js's ctx.clip() (used for the live wave
    // canvas). Without this, an impulse spike whose theta value falls far
    // outside yRange (deliberately excluded from ranging -- see above) draws
    // a line that shoots straight through the plot's top/bottom border and
    // into the caption band or beyond, instead of being cut off at the edge.
    context.save();
    context.beginPath();
    context.rect(left, top, plotWidth, plotHeight);
    context.clip();

    context.strokeStyle="#3d9360"; context.lineWidth=2.5;
    context.beginPath(); context.moveTo(left,y(thetaEq)); context.lineTo(left+plotWidth,y(thetaEq)); context.stroke();
    const mainMean=Number(snapshot.analysis?.evaluation?.mainEvaluation?.stats?.meanThetaRad);
    if(Number.isFinite(mainMean)){
      context.strokeStyle="#af861b"; context.lineWidth=2;
      context.beginPath(); context.moveTo(left,y(mainMean)); context.lineTo(left+plotWidth,y(mainMean)); context.stroke();
    }

    const visibleComponents = visibleNoiseComponents(snapshot.observation);
    const componentSeries = visibleComponents.map(component=>{
      const key = `${component.id}NoiseThetaRad`;
      const values = samples.map(sample=>Number(sample[key])).filter(Number.isFinite);
      return Object.freeze({component,key,values});
    }).filter(series=>series.values.length > 1);
    // IL278 ノイズ仕様D-fix2: exclude impulse from the gain search (matches
    // app.js). impulse is drawn at its true scale (gain=1) below; only the
    // other components get auto-boosted for visibility.
    const gainSeries = componentSeries.filter(series=>series.component.id !== "impulse");
    const componentMax = Math.max(0,...gainSeries.flatMap(series=>series.values.map(value=>Math.abs(value))));
    const componentAutoGain = componentMax > 0 && componentMax < yRange * 0.07
      ? Math.min(5000,Math.max(1,Math.round((yRange * 0.18) / componentMax)))
      : 1;
    for(const series of componentSeries){
      const effectiveGain = series.component.id === "impulse" ? 1 : componentAutoGain;
      context.strokeStyle = series.component.color;
      context.lineWidth = 1.35;
      context.globalAlpha = 0.86;
      context.beginPath();
      let moved = false;
      for(const sample of samples){
        const value = Number(sample[series.key]);
        if(!Number.isFinite(value)) continue;
        const px = x(sample.t);
        const py = y(value * effectiveGain);
        if(!moved){ context.moveTo(px,py); moved = true; }
        else context.lineTo(px,py);
      }
      context.stroke();
      context.globalAlpha = 1;
    }

    if(samples.length){
      context.strokeStyle="#17212a"; context.lineWidth=2.4; context.beginPath();
      samples.forEach((sample,index)=>{
        const px=x(sample.t), py=y(sample.thetaRad);
        if(index===0) context.moveTo(px,py); else context.lineTo(px,py);
      });
      context.stroke();
    }
    context.restore();

    const extrema=[
      {sample:samples.reduce((best,sample)=>!best||sample.thetaRad>best.thetaRad?sample:best,null),color:"#d43e4b",label:"+Peak"},
      {sample:samples.reduce((best,sample)=>!best||sample.thetaRad<best.thetaRad?sample:best,null),color:"#307ecc",label:"−Peak"}
    ];
    for(const item of extrema){
      if(!item.sample) continue;
      const px=x(item.sample.t), py=y(item.sample.thetaRad);
      // IL278 ノイズ仕様D-fix: only draw the marker dot when it falls inside the
      // plot (matches app.js's drawPeakMarker onScreen check). An impulse
      // spike's peak can fall far outside yRange; without this guard the dot
      // would be drawn deep into the caption band or off the canvas.
      if(py < top || py > top + plotHeight) continue;
      context.fillStyle=item.color; context.beginPath(); context.arc(px,py,8,0,Math.PI*2); context.fill();
    }

    // IL278 ノイズ仕様D-fix: place the badge OUTSIDE the plot area, on the same
    // caption line (right-aligned), so it never overlaps the waveform itself
    // or the dense impulse spikes near the top of the plot (previous attempt
    // at top+22 sat inside the plot and collided with both).
    if(isClipped){
      context.save();
      context.fillStyle="#d43e4b";
      context.font="700 18px system-ui";
      context.textAlign="right";
      context.fillText("※impulse振り切れ",left+plotWidth,32);
      context.restore();
    }

    const timelineY=height-48;
    context.fillStyle="#eef2f4"; context.fillRect(left,timelineY,plotWidth,18);
    for(const phase of snapshot.observation?.timeline?.phases || []){
      context.fillStyle=phase.role==="active"?"rgba(185,145,50,.45)":"rgba(69,137,170,.25)";
      context.fillRect(x(phase.start),timelineY,x(phase.end)-x(phase.start),18);
    }
    if(windows.mainEvaluation){
      context.strokeStyle="#a77b0b"; context.lineWidth=3;
      context.strokeRect(x(windows.mainEvaluation.start),timelineY,x(windows.mainEvaluation.end)-x(windows.mainEvaluation.start),18);
    }
    context.strokeStyle="#526875"; context.lineWidth=2; context.strokeRect(left,timelineY,plotWidth,18);
    context.fillStyle="#435661"; context.textAlign="left";
    const legendBase = "θ(rad) / 黒: 観測値 / 緑: θeq / 金: 主評価窓平均";
    const componentLegend = componentSeries.length
      ? ` / 表示ON成分${componentAutoGain > 1 ? ` ×${componentAutoGain}` : ""}: ${componentSeries.map(series=>series.component.label).join("・")}`
      : "";
    const topLegendText = `${legendBase}${componentLegend}`;
    const topLegendMaxWidth = width - left - right;
    let topLegendFontSize = 19;
    context.font = `${topLegendFontSize}px system-ui`;
    while(topLegendFontSize > 12 && context.measureText(topLegendText).width > topLegendMaxWidth){
      topLegendFontSize -= 1;
      context.font = `${topLegendFontSize}px system-ui`;
    }
    if(context.measureText(topLegendText).width > topLegendMaxWidth){
      let clipped = topLegendText;
      while(clipped.length > 1 && context.measureText(`${clipped}…`).width > topLegendMaxWidth){
        clipped = clipped.slice(0,-1);
      }
      context.fillText(`${clipped}…`,left,32);
    } else {
      context.fillText(topLegendText,left,32);
    }
    if(componentSeries.length){
      let legendX = left;
      const legendY = height - 14;
      context.font = "700 17px system-ui";
      for(const series of componentSeries){
        context.strokeStyle = series.component.color;
        context.lineWidth = 5;
        context.beginPath(); context.moveTo(legendX,legendY - 5); context.lineTo(legendX + 30,legendY - 5); context.stroke();
        context.fillStyle = "#435661";
        context.textAlign = "left";
        context.fillText(series.component.label,legendX + 36,legendY);
        legendX += Math.min(250,72 + series.component.label.length * 13);
        if(legendX > width - right - 170) break;
      }
    }
  }

  function populate(root,snapshot){
    const view=createViewModel(snapshot);
    const fields={
      reportVersion:view.version,reportGeneratedAt:view.generatedAt,
      reportFooterCode:view.footerCode,reportOverallLabel:view.overallLabel,
      reportOverallReason:view.overallReason,reportEvidenceText:view.evidence,
      reportNoticeText:view.notice,reportModeLevel:view.modeLevel,
      reportDurationScale:view.durationScale,reportTorqueStiffness:view.torqueStiffness,
      reportOpticalPhysics:view.opticalPhysics,reportMechanics:view.mechanics,
      reportNoiseShielding:view.noiseShielding,reportOpticalReadout:view.opticalReadout,
      reportVernierReadout:view.vernierReadout,
      reportWaveReadout:view.waveReadout,reportWindowStats:view.windowStats,
      reportDetection:view.detection,reportStability:view.stability,
      reportSummaryText:view.summary,reportReasonText:view.reason,
      reportObservationState:view.observationState,reportEndReason:view.endReason,
      reportForce:view.force,reportNoise:view.noise,reportShielding:view.shielding,
      reportSnValue:view.snValue,reportAverageDisplacement:view.averageDisplacement,
      reportStdDeviation:view.stdDeviation,reportBaselineDifference:view.baselineDifference,
      reportMainWindow:view.mainWindow,reportSupportCheck:view.supportCheck,
      reportTailCheck:view.tailCheck,reportAnalysisComment:view.analysisComment,
      reportOverallSummary:view.overallSummary,reportPreReliability:view.preReliability,
      reportMainReliability:view.mainReliability,reportPostReliability:view.postReliability,
      reportNoiseReliability:view.noiseReliability,reportDecisionReliability:view.decisionReliability,
      reportWaveDuration:view.waveDuration
    };
    for(const [id,value] of Object.entries(fields)) setText(root,id,value);
    const opticalBlock = root.querySelector("#reportOpticalBlock");
    const vernierBlock = root.querySelector("#reportVernierBlock");
    const isVernierDevice = snapshot.controls?.deviceModel === "cavendish-1798";
    if(opticalBlock) opticalBlock.hidden = isVernierDevice;
    if(vernierBlock) vernierBlock.hidden = !isVernierDevice;
    if(isVernierDevice){
      drawVernier(root.querySelector("#reportVernierCanvas"),snapshot);
    } else {
      drawOptical(root.querySelector("#reportOpticalCanvas"),snapshot);
    }
    drawWave(root.querySelector("#reportWaveCanvas"),snapshot);
    return view;
  }

  function fitToViewport(frame,sheet){
    if(!frame || !sheet) return 1;
    const viewportWidth=window.visualViewport?.width || window.innerWidth;
    const available=Math.max(280,Math.min(viewportWidth-10,980));
    const scale=Math.min(1,available/794);
    // scrollHeight is a layout property; CSS transform:scale() (applied via
    // --report-scale below) does not affect it, so no need to reset first.
    const naturalHeight=Math.max(sheet.scrollHeight,1123);
    sheet.style.setProperty("--report-scale",String(scale));
    frame.style.width=`${Math.ceil(794*scale)}px`;
    frame.style.height=`${Math.ceil(naturalHeight*scale)}px`;
    return scale;
  }

  function canvasCloneToImage(sourceSheet,clonedSheet){
    const sources=[...sourceSheet.querySelectorAll("canvas")];
    const targets=[...clonedSheet.querySelectorAll("canvas")];
    targets.forEach((target,index)=>{
      const source=sources[index];
      if(!source) return;
      const image=document.createElement("img");
      image.src=source.toDataURL("image/png");
      image.alt=source.getAttribute("aria-label") || "レポート図";
      image.style.cssText="display:block;width:100%;flex:1 1 0;min-height:0;object-fit:fill;background:#fff";
      target.replaceWith(image);
    });
  }

  function nextPaint(){
    return new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  }

  // --- PDF export: Cavendish (html2canvas + jsPDF) capture model ---
  // The clone is fixed to exactly 210mm x 297mm with overflow:hidden
  // (.pdf-capture-sheet), captured as one canvas image, and force-fit into
  // one 210mm x 297mm PDF page. This makes a 2nd page structurally
  // impossible: there is only ever one image and one addImage call.

  function createPdfCaptureClone(sourceSheet){
    if(!sourceSheet) throw new Error("Report sheet was not found.");
    const host=document.createElement("div");
    host.className="pdf-capture-host";
    host.setAttribute("aria-hidden","true");
    const clone=sourceSheet.cloneNode(true);
    clone.removeAttribute("id");
    clone.querySelectorAll("[id]").forEach(element=>element.removeAttribute("id"));
    clone.classList.add("pdf-capture-sheet");
    clone.style.removeProperty("--report-scale");
    canvasCloneToImage(sourceSheet,clone);
    host.appendChild(clone);
    document.body.appendChild(host);
    return {host,clone};
  }

  function safePdfFilename(snapshot){
    const rawId=snapshot?.session?.sequence!=null ? `MT-REPORT-${snapshot.session.sequence}` : "MT-REPORT";
    const stamp=new Date().toISOString().replace(/[-:T]/g,"").slice(0,14);
    const safeId=String(rawId).replace(/[^A-Za-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"") || "MT-REPORT";
    return `${safeId}-${stamp}_IL278S3Q.pdf`;
  }

  async function buildPdfPackage(sourceSheet,snapshot){
    if(typeof window.html2canvas!=="function" || !window.jspdf || typeof window.jspdf.jsPDF!=="function"){
      throw new Error("PDF generation libraries are unavailable.");
    }
    let capture=null;
    try{
      if(document.fonts && document.fonts.ready) await document.fonts.ready;
      capture=createPdfCaptureClone(sourceSheet);
      await nextPaint();
      const canvas=await window.html2canvas(capture.clone,{
        backgroundColor:"#ffffff",
        scale:2.5,
        useCORS:true,
        allowTaint:false,
        logging:false,
        width:capture.clone.scrollWidth,
        height:capture.clone.scrollHeight,
        windowWidth:Math.ceil(210/25.4*96),
        windowHeight:Math.ceil(297/25.4*96),
        scrollX:0,
        scrollY:0
      });
      const Pdf=window.jspdf.jsPDF;
      const pdf=new Pdf({orientation:"portrait",unit:"mm",format:"a4",compress:true,putOnlyUsedFonts:true});
      const jpeg=canvas.toDataURL("image/jpeg",0.96);
      pdf.addImage(jpeg,"JPEG",0,0,210,297,undefined,"FAST");
      pdf.setProperties({
        title:"IMPULSE LABO - Micro Thrust Report",
        subject:"微小推力検証フォーム出力レポート IL278S3Q",
        author:"IMPULSE LABO",
        creator:"IMPULSE LABO IL278S3Q"
      });
      const blob=pdf.output("blob");
      const filename=safePdfFilename(snapshot);
      return {blob,filename};
    } finally {
      if(capture && capture.host) capture.host.remove();
    }
  }

  async function saveReportPdf(sourceSheet,snapshot,statusElement){
    const setStatus=(message)=>{ if(statusElement) statusElement.textContent=message || ""; };
    try{
      setStatus("PDFを準備しています…");
      const {blob,filename}=await buildPdfPackage(sourceSheet,snapshot);
      // Safari (iOS) tries to preview blobs with a recognized mime type
      // (application/pdf) instead of downloading them. Re-wrapping as
      // application/octet-stream forces a real download, matching the
      // Cavendish implementation's workaround.
      const downloadBlob=new Blob([blob],{type:"application/octet-stream"});
      const downloadUrl=URL.createObjectURL(downloadBlob);
      const anchor=document.createElement("a");
      if(!("download" in anchor)) throw new Error("Direct file download is unavailable.");
      anchor.href=downloadUrl;
      anchor.download=filename;
      anchor.setAttribute("download",filename);
      anchor.rel="noopener";
      anchor.style.display="none";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(()=>URL.revokeObjectURL(downloadUrl),60000);
      setStatus("PDFのダウンロードを開始しました。Safariのダウンロード一覧を確認してください。");
      window.setTimeout(()=>setStatus(""),5200);
      return true;
    } catch(error){
      console.error("PDF export failed.",error);
      setStatus("PDF生成に失敗しました。もう一度お試しください。");
      return false;
    }
  }

  window.ImpulseLaboReport=Object.freeze({
    createViewModel,
    populate,
    fitToViewport,
    saveReportPdf
  });
})();
