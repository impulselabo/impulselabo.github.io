(()=>{
  "use strict";

  const Lifecycle = Object.freeze({
    READY: "ready",
    RUNNING: "running",
    PAUSED: "paused",
    STOPPED: "stopped",
    COMPLETED: "completed"
  });

  const lifecycleLabels = Object.freeze({
    [Lifecycle.READY]: "観測準備",
    [Lifecycle.RUNNING]: "観測中",
    [Lifecycle.PAUSED]: "一時停止",
    [Lifecycle.STOPPED]: "手動停止",
    [Lifecycle.COMPLETED]: "観測完了"
  });

  const allowedTransitions = Object.freeze({
    [Lifecycle.READY]: new Set([Lifecycle.RUNNING]),
    [Lifecycle.RUNNING]: new Set([Lifecycle.PAUSED, Lifecycle.STOPPED, Lifecycle.COMPLETED]),
    [Lifecycle.PAUSED]: new Set([Lifecycle.RUNNING, Lifecycle.STOPPED, Lifecycle.COMPLETED]),
    [Lifecycle.STOPPED]: new Set([Lifecycle.READY]),
    [Lifecycle.COMPLETED]: new Set([Lifecycle.READY])
  });

  // IL278 装置仕様: 装置モデルごとの機械仕様。値の根拠は
  // docs/microthrust/IL-VIRTUAL-TORSION-SPEC.json(仮想)、
  // CV082A07(キャベンディッシュ、史実データからの導出)を参照。
  // 装置モデルは「仮想」「キャベンディッシュ」の2択(カスタムは廃止、
  // 実在しない/根拠のない装置モデルを置かない方針のため)。
  // IL278 標準仕様-D: ファイバー材質の物性値(単一の参照テーブルに統合)。
  // G0=室温でのせん断弾性率、relDgDt=(dG/G)/dT(温度係数)。
  // どちらも controls.material から一貫して参照される(剛性kの逆算・drift
  // ノイズの温度係数の両方がこのテーブルを共有する)。
  //  - tungsten: G0=160GPa(確定値)、relDgDt=-7.651e-5/K(文献値)
  //  - quartz(溶融石英): G0=30GPa(arXiv:2109.07880「A six degree-of-freedom
  //    fused silica seismometer」のtorsion modulus)、relDgDt=+6.8e-5/K
  //    (Proceedings of the Royal Society 1929「Elastic constants of fused
  //    quartz」の15-880℃間+5.9%上昇の実測を平均化して算出。符号がタングステン
  //    と逆転する点は文献で裏付けられた実際の物理的特徴)
  //  - nylon: G0=1.1GPa(DMA文献のnylon-6室温貯蔵弾性率、おおむね1.0-1.4GPa
  //    のオーダー)、relDgDt=-3e-3/K。両方assumed_typical(単一の精密な文献値
  //    ではなく、高分子が金属・ガラスよりずっと温度感受性が高いという定性的
  //    傾向に基づくオーダーの見積もり)
  const WIRE_MATERIAL_PROPERTIES = Object.freeze({
    tungsten: Object.freeze({ shearModulusPa: 160e9, relDgDtPerK: -7.651e-5, tier: "confirmed" }),
    quartz: Object.freeze({ shearModulusPa: 30e9, relDgDtPerK: 6.8e-5, tier: "measured" }),
    nylon: Object.freeze({ shearModulusPa: 1.1e9, relDgDtPerK: -3e-3, tier: "assumed_typical" })
  });
  function wireMaterialProps(material){
    return WIRE_MATERIAL_PROPERTIES[material] || WIRE_MATERIAL_PROPERTIES.tungsten;
  }
  const WIRE_MATERIAL_LABEL_JA = Object.freeze({ tungsten: "タングステン", quartz: "石英", nylon: "ナイロン" });
  function wireMaterialLabel(material){
    return WIRE_MATERIAL_LABEL_JA[material] || material;
  }
  // k = πGd⁴/(32L) : ファイバーの太さ・長さ・材質から剛性を逆算する式
  // (IL-VIRTUAL-TORSION-SPEC.jsonのtorsion_fiber式と同一)。
  function deriveStiffnessNmPerRad(material, wireDiameterMm, fiberLengthM){
    const G = wireMaterialProps(material).shearModulusPa;
    const d = Number(wireDiameterMm) / 1000;
    const L = Number(fiberLengthM);
    if(!Number.isFinite(d) || d <= 0 || !Number.isFinite(L) || L <= 0) return null;
    return Math.PI * G * Math.pow(d, 4) / (32 * L);
  }

  const deviceModelPolicy = Object.freeze({
    "virtual-optical": {
      label: "仮想トーションバランス（光点読取）",
      summaryView: "タングステン0.1mm / L≈0.785m / 渦電流ダンパー / 光点読取",
      readoutPanel: "virtual-optical",
      locksFields: true,
      recommendedDurationSeconds: 120,
      values: Object.freeze({
        stiffnessNmPerRad: 2e-6,
        inertiaKgM2: 1e-6,
        dampingNmsPerRad: 1e-5,
        opticalDistanceM: 1
      })
    },
    "cavendish-1798": {
      label: "キャベンディッシュ1798（バーニア目盛読取）",
      summaryView: "史実準拠仕様(CV082A07) / 木製棒6ft・鉛球0.732kg / バーニア目盛読取",
      readoutPanel: "cavendish-1798",
      locksFields: true,
      // 固有周期T≈1770s(29.5分)。減衰時定数は約104分と長く、99%収束には
      // 約8.7時間かかる(検算済み)。59分(2周期分、振動の様子は視認できる)を
      // 実用的な最低推奨値とし、プリセットに2時間/4時間/8時間(99%収束目安)
      // も用意して、必要に応じて長時間観測を選べるようにする。
      recommendedDurationSeconds: 3540,
      values: Object.freeze({
        // IL278 装置仕様: CV082A07(cavendish-experiment-i-physical-model-spec.json,
        // cv1798-geometry.json)の史実データから導出。
        // I = 2m(d^2 + 2r^2/5): m=0.732kg(小球1個1.61lb), d=中心軸〜小球中心=73.3in/2,
        //   r=小球半径=2.0in/2 (arXiv:1812.07644の厳密慣性モーメント式)
        // k = I*omega_n^2, c = 2*zeta*sqrt(I*k) : omega_n・zetaはCV082A07の史実振動
        //   フィッティング結果(3セグメント平均)。c=2*I*betaでのクロスチェックと差0.01%で一致
        // opticalDistanceM: cv1798-geometry.jsonのreader_radius(38.3in)を採用
        inertiaKgM2: 1.269,
        stiffnessNmPerRad: 1.599e-5,
        dampingNmsPerRad: 4.050e-4,
        opticalDistanceM: 0.973
      })
    }
  });

  const modeProfiles = Object.freeze({
    "calibration": {
      standardConditionView: "タングステン / 0.10 mm / L=1.0 m",
      modeSourceView: "校正：既知入力トルク",
      initialDurationView: "120秒（校正の標準）"
    },
    "noise-check": {
      standardConditionView: "ノイズ確認 / Force OFF / Standard noise",
      modeSourceView: "ノイズ確認：入力トルクなし",
      initialDurationView: "300秒（ノイズ確認の標準）"
    },
    "gravity": {
      standardConditionView: "重力測定 / 標準 torsion 条件",
      modeSourceView: "重力測定：微小トルク換算",
      initialDurationView: "600秒（重力測定の標準）"
    },
    "custom": {
      standardConditionView: "カスタム測定 / 手動条件",
      modeSourceView: "カスタム：入力条件による",
      initialDurationView: "MANUAL上限を使用"
    },
    "electrostatic": {
      standardConditionView: "静電気力 / 条件依存",
      modeSourceView: "静電気力：推定評価",
      initialDurationView: "300秒（静電気力の標準）"
    },
    "repeat": {
      standardConditionView: "繰り返し試験 / 同一条件",
      modeSourceView: "繰り返し：再現性確認",
      initialDurationView: "300秒 × 試行"
    },
    "detection-limit": {
      standardConditionView: "検出限界チェック / 低S/N",
      modeSourceView: "検出限界：条件付き評価",
      initialDurationView: "600秒（検出限界の標準）"
    },
    "mosquito": {
      standardConditionView: "蚊飛翔 / 教育比較",
      modeSourceView: "蚊飛翔：外乱比較",
      initialDurationView: "120秒（教育比較）"
    }
  });

  const detectionPolicies = Object.freeze({
    default: Object.freeze({
      detectableSn: 5,
      conditionalSn: 2
    }),
    gravity: Object.freeze({
      detectableSn: 5,
      conditionalSn: 3
    })
  });

  const detectionModeClosures = Object.freeze({
    "noise-check": Object.freeze({
      status:"not_applicable",
      label:"対象外",
      reason:"ノイズ確認モードは、検出判定ではなくBaselineとノイズ状態を確認します。"
    }),
    repeat: Object.freeze({
      status:"trial_summary",
      label:"試行集計",
      reason:"繰り返し試験は、単発の検出判定ではなく試行集計と再現性を確認します。"
    }),
    electrostatic: Object.freeze({
      status:"estimated",
      label:"推定評価",
      reason:"静電気力モードは条件依存が強いため、S/Nだけで断定せず推定評価として扱います。"
    }),
    mosquito: Object.freeze({
      status:"comparison",
      label:"比較評価",
      reason:"蚊飛翔モードは周期・インパルス外乱の比較であり、一定トルクの検出判定とは分けて扱います。"
    })
  });

  const noiseModePolicy = Object.freeze({
    "calibration": Object.freeze({seed:1201, scale:0.0012, impulse:false}),
    "noise-check": Object.freeze({seed:2201, scale:0.0240, impulse:true}),
    "gravity": Object.freeze({seed:3201, scale:0.0032, impulse:false}),
    "custom": Object.freeze({seed:4201, scale:0.0050, impulse:false}),
    "electrostatic": Object.freeze({seed:5201, scale:0.0080, impulse:true}),
    "repeat": Object.freeze({seed:6201, scale:0.0052, impulse:false}),
    "detection-limit": Object.freeze({seed:7201, scale:0.0035, impulse:false}),
    "mosquito": Object.freeze({seed:8201, scale:0.0120, impulse:true})
  });

  const noiseComponentPolicy = Object.freeze({
    white: Object.freeze({
      controlPrefix:"noiseWhite",
      label:"White / 微小ランダム",
      domain:"mechanical",
      // IL278 ノイズ仕様A: this coefficient is no longer used to scale White's
      // torque amplitude (see thermalNoiseTorqueRmsNm / evaluateNoiseAtTime).
      // White noise is now derived from the equipartition theorem (kB, T, k)
      // instead. Kept only for UI legend consistency with the other
      // components; do not use for physics.
      coefficient:0.20,
      color:"rgba(127,174,210,.72)"
    }),
    drift: Object.freeze({
      controlPrefix:"noiseDrift",
      label:"drift / 温度ドリフト",
      domain:"mechanical",
      // IL278 ノイズ仕様B: no longer used to scale drift's amplitude directly
      // (see the tungsten dG/dT-based physical model in evaluateNoiseAtTime).
      // Kept for UI legend consistency; do not use for physics.
      coefficient:0.50,
      color:"rgba(206,162,104,.72)"
    }),
    periodic: Object.freeze({
      controlPrefix:"noisePeriodic",
      label:"periodic / 周期振動",
      domain:"mechanical",
      // IL278 ノイズ仕様C: no longer used to scale periodic's amplitude directly
      // (see the ground-tilt-coupling model in evaluateNoiseAtTime). Kept
      // for UI legend consistency; do not use for physics.
      coefficient:0.20,
      color:"rgba(146,188,137,.72)"
    }),
    impulse: Object.freeze({
      controlPrefix:"noiseImpulse",
      label:"impulse / 衝撃",
      domain:"mechanical",
      // IL278 ノイズ仕様D: no longer used to scale impulse's amplitude directly
      // (see the desk-bump order-of-magnitude model in evaluateNoiseAtTime).
      // Kept for UI legend consistency; do not use for physics.
      coefficient:0.35,
      color:"rgba(211,125,125,.78)"
    }),
    optical: Object.freeze({
      controlPrefix:"noiseOptical",
      label:"optical / 光学読取誤差",
      domain:"readout",
      // IL278 ノイズ仕様F: no longer used to scale optical's amplitude directly
      // (see the PSD-resolution-based random model in evaluateNoiseAtTime).
      // Kept for UI legend consistency; do not use for physics.
      coefficient:0.025,
      color:"rgba(179,144,210,.74)"
    }),
    numeric: Object.freeze({
      controlPrefix:"noiseNumeric",
      label:"numeric / 量子化誤差",
      domain:"quantization",
      // IL278 ノイズ仕様E: no longer used to scale numeric's step size directly
      // (see the display-precision-based quantization in evaluateNoiseAtTime).
      // Kept for UI legend consistency; do not use for physics.
      coefficient:0.010,
      color:"rgba(145,151,160,.78)"
    })
  });

  const shieldingPresetPolicy = Object.freeze({
    none: Object.freeze({
      label:"なし",
      environmentState:"unshielded",
      componentFactors:Object.freeze({
        white:1.00,
        drift:1.00,
        periodic:1.00,
        impulse:1.00,
        optical:1.00,
        numeric:1.00
      })
    }),
    weak: Object.freeze({
      label:"弱",
      environmentState:"shielded_weak",
      // 制振マウント(Sorbothane等の防振ゴム)のみ。断熱層・遮光層を持たないため、
      // 現行6成分のいずれも物理的な低減根拠がない(IL278 遮蔽仕様参照)。
      componentFactors:Object.freeze({
        white:1.00,
        drift:1.00,
        periodic:1.00,
        impulse:1.00,
        optical:1.00,
        numeric:1.00
      })
    }),
    standard: Object.freeze({
      label:"標準",
      environmentState:"shielded_standard",
      // +簡易断熱箱(発泡材+合板+アルミ板サンドイッチ、1層)。driftのみ低減根拠あり。
      componentFactors:Object.freeze({
        white:1.00,
        drift:0.10,
        periodic:1.00,
        impulse:1.00,
        optical:1.00,
        numeric:1.00
      })
    }),
    strong: Object.freeze({
      label:"強",
      environmentState:"shielded_strong",
      // +二重壁断熱箱+遮光暗箱。driftをさらに低減、opticalは暗箱による
      // 周囲光除去でPSD/フォトダイオードのSNRが改善する効果を反映。
      componentFactors:Object.freeze({
        white:1.00,
        drift:0.03,
        periodic:1.00,
        impulse:1.00,
        optical:0.50,
        numeric:1.00
      })
    })
  });

  const defaultControls = Object.freeze({
    deviceModel: "virtual-optical",
    deviceModelSummaryView: deviceModelPolicy["virtual-optical"].summaryView,
    mode: "calibration",
    controlLevel: "standard",
    theme: "dark",
    standardConditionView: modeProfiles.calibration.standardConditionView,
    modeSourceView: modeProfiles.calibration.modeSourceView,
    initialDurationView: modeProfiles.calibration.initialDurationView,

    durationMode: "auto",
    timeScale: 1,
    inputTorqueNm: 2e-9,
    stiffnessNmPerRad: 2e-6,
    opticalDistanceM: 1,

    inertiaKgM2: 1e-6,
    dampingNmsPerRad: 1e-5,
    material: "tungsten",
    wireDiameterMm: 0.1,
    // IL278 標準仕様-D: kは以後、material・wireDiameterMm・fiberLengthMから
    // deriveStiffnessNmPerRad()で逆算される値(virtual-opticalモデル時)。
    // 0.7853981634は上記デフォルト値(タングステン0.1mm)でk=2e-6を再現する
    // ファイバー長(検算済み: node上でπGd⁴/(32L)=2.0000e-6と一致確認)。
    fiberLengthM: 0.7853981634,

    noiseMaster: "on",
    noisePreset: "standard",
    noiseWhiteEnabled: "on",
    noiseWhiteVisible: "off",
    noiseWhiteLevel: 1,
    noiseDriftEnabled: "on",
    noiseDriftVisible: "off",
    noiseDriftLevel: 1,
    noisePeriodicEnabled: "on",
    noisePeriodicVisible: "off",
    noisePeriodicLevel: 1,
    noiseImpulseEnabled: "on",
    noiseImpulseVisible: "off",
    noiseImpulseLevel: 1,
    noiseOpticalEnabled: "on",
    noiseOpticalVisible: "off",
    noiseOpticalLevel: 1,
    noiseNumericEnabled: "on",
    noiseNumericVisible: "off",
    noiseNumericLevel: 1,

    shieldingMaster: "off",
    shieldingPreset: "none",

    // IL278 ノイズ仕様D2: impulse実測モード(未検証)
    impulseAmplitudeSource: "theoretical",
    impulseMeasuredAmplitudeRad: 0,
    impulseMeasuredAtTimeScale: 1,
    impulseMeasurementStatus: "idle",

    manualDurationPreset: "600",
    opticsZoom: 1,
    trailSeconds: 10,
    opticalScaleMode: "auto-safe",
    waveScaleMode: "auto",
    waveAutoStyle: "precise",
    waveDisplayGain: 1,
    waveManualRangeRad: 1e-9
  });

  function enumRule(values){ return {type:"enum", values}; }
  function numberRule(min, max){ return {type:"number", min, max}; }
  function textRule(){ return {type:"text"}; }

  const controlRules = Object.freeze({
    mode: enumRule(["calibration","noise-check","gravity","custom","electrostatic","repeat","detection-limit","mosquito"]),
    deviceModel: enumRule(["virtual-optical","cavendish-1798"]),
    controlLevel: enumRule(["easy","standard","full"]),
    theme: enumRule(["dark","light","sepia","high-contrast"]),
    standardConditionView: textRule(),
    deviceModelSummaryView: textRule(),
    modeSourceView: textRule(),
    initialDurationView: textRule(),

    durationMode: enumRule(["auto","manual"]),
    timeScale: numberRule(0.1, 100),
    inputTorqueNm: numberRule(-1e-6, 1e-6),
    stiffnessNmPerRad: numberRule(1e-12, 1),
    opticalDistanceM: numberRule(0.01, 100),

    inertiaKgM2: numberRule(1e-12, 1),
    dampingNmsPerRad: numberRule(0, 1),
    material: enumRule(["tungsten","quartz","nylon"]),
    wireDiameterMm: numberRule(0.001, 10),
    fiberLengthM: numberRule(0.01, 5),

    noiseMaster: enumRule(["on","off"]),
    noisePreset: enumRule(["ideal","standard","lab","noisy","custom"]),
    noiseWhiteEnabled: enumRule(["on","off"]),
    noiseWhiteVisible: enumRule(["off","on"]),
    noiseWhiteLevel: numberRule(0, 3),
    noiseDriftEnabled: enumRule(["on","off"]),
    noiseDriftVisible: enumRule(["off","on"]),
    noiseDriftLevel: numberRule(0, 3),
    noisePeriodicEnabled: enumRule(["on","off"]),
    noisePeriodicVisible: enumRule(["off","on"]),
    noisePeriodicLevel: numberRule(0, 3),
    noiseImpulseEnabled: enumRule(["on","off"]),
    noiseImpulseVisible: enumRule(["off","on"]),
    noiseImpulseLevel: numberRule(0, 3),
    noiseOpticalEnabled: enumRule(["on","off"]),
    noiseOpticalVisible: enumRule(["off","on"]),
    noiseOpticalLevel: numberRule(0, 3),
    noiseNumericEnabled: enumRule(["on","off"]),
    noiseNumericVisible: enumRule(["off","on"]),
    noiseNumericLevel: numberRule(0, 3),

    shieldingMaster: enumRule(["on","off"]),
    shieldingPreset: enumRule(["none","weak","standard","strong"]),

    impulseAmplitudeSource: enumRule(["theoretical","measured"]),
    impulseMeasuredAmplitudeRad: numberRule(0, 1),
    impulseMeasuredAtTimeScale: numberRule(0.1, 100),
    impulseMeasurementStatus: enumRule(["idle","requesting","measuring","done","error","unsupported"]),

    manualDurationPreset: enumRule(["120","300","600","1200","1800","3540","3600","7200","14400","28800"]),
    opticsZoom: numberRule(0.1, 100),
    trailSeconds: numberRule(5, 30),
    opticalScaleMode: enumRule(["auto-safe","fixed"]),
    waveScaleMode: enumRule(["auto","fixed-current","manual"]),
    waveAutoStyle: enumRule(["precise","observe","five-sec"]),
    waveDisplayGain: numberRule(1, 5),
    waveManualRangeRad: numberRule(1e-12, 1e12)
  });

  const completedDisplayControlKeys = Object.freeze([
    "noiseWhiteVisible",
    "noiseDriftVisible",
    "noisePeriodicVisible",
    "noiseImpulseVisible",
    "noiseOpticalVisible",
    "noiseNumericVisible"
  ]);

  const initialSession = Object.freeze({
    sequence: 0,
    startedAt: null,
    pausedAt: null,
    stoppedAt: null,
    completedAt: null,
    endReason: null,
    elapsedSeconds: 0,
    accumulatedSeconds: 0,
    lastTickAtMs: null,
    noiseSeed: null
  });

  function createRunNoiseSeed(nowMs, sequence){
    const a = Number(nowMs) || Date.now();
    const b = (Number(sequence) || 0) * 2654435761;
    return ((a ^ b) >>> 0) % 900000 + 100000;
  }

  function computePhysics(controls){
    const configuredTau = Number(controls.inputTorqueNm);
    const activeTau = controls.mode === "noise-check" ? 0 : configuredTau;
    const k = Number(controls.stiffnessNmPerRad);
    const L = Number(controls.opticalDistanceM);
    const errors = {};

    if(!Number.isFinite(configuredTau)) errors.inputTorqueNm = "not_finite";
    if(!Number.isFinite(k) || k <= 0) errors.stiffnessNmPerRad = "invalid_positive_required";
    if(!Number.isFinite(L) || L <= 0) errors.opticalDistanceM = "invalid_positive_required";

    const ok = Object.keys(errors).length === 0;
    const thetaEqRad = ok ? activeTau / k : null;
    const xEqM = ok ? 2 * thetaEqRad * L : null;
    const xEqMm = ok ? xEqM * 1000 : null;

    return Object.freeze({
      ok,
      errors: Object.freeze(errors),
      inputTorqueNm: configuredTau,
      activeInputTorqueNm: activeTau,
      stiffnessNmPerRad: k,
      opticalDistanceM: L,
      thetaEqRad,
      xEqM,
      xEqMm
    });
  }


  function getObservationDurationSecondsFromControls(controls){
    if(controls.durationMode === "manual"){
      return clampNumber(controls.manualDurationPreset, 60, 28800, 300);
    }

    const text = String(controls.initialDurationView || "");
    const match = text.match(/(\d+(?:\.\d+)?)\s*秒/);
    if(match) return clampNumber(Number(match[1]), 60, 3600, 300);
    return 300;
  }

  function normalizeObservationPlan(controls, observationPlan){
    const configuredDuration = getObservationDurationSecondsFromControls(controls);
    const baseDurationSeconds = Math.max(
      1,
      Number(observationPlan?.baseDurationSeconds) || configuredDuration
    );
    const addedSeconds = Math.max(0, Number(observationPlan?.addedSeconds) || 0);
    return Object.freeze({
      baseDurationSeconds,
      addedSeconds,
      targetDurationSeconds: baseDurationSeconds + addedSeconds
    });
  }

  function clampNumber(value, min, max, fallback){
    const number = Number(value);
    if(!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, number));
  }

  // IL278 3D-C1: シミュレータの現在値を仮想トーションバランス3Dページへ
  // 橋渡しするための共有パラメータ永続化。同一オリジンのlocalStorageを介す。
  // 3D側が読めない環境(プライベートブラウズ等)でも本体機能に影響しないよう、
  // 例外は握りつぶす。
  const SHARED_DEVICE_PARAMS_KEY = "IL278_shared_device_params_v1";
  function persistSharedDeviceParams(controls){
    try{
      if(typeof localStorage === "undefined") return;
      const payload = {
        savedAt: Date.now(),
        deviceModel: controls.deviceModel,
        stiffnessNmPerRad: Number(controls.stiffnessNmPerRad),
        dampingNmsPerRad: Number(controls.dampingNmsPerRad),
        inertiaKgM2: Number(controls.inertiaKgM2),
        opticalDistanceM: Number(controls.opticalDistanceM),
        material: controls.material,
        wireDiameterMm: Number(controls.wireDiameterMm),
        fiberLengthM: Number(controls.fiberLengthM),
        shieldingMaster: controls.shieldingMaster,
        shieldingPreset: controls.shieldingPreset
      };
      localStorage.setItem(SHARED_DEVICE_PARAMS_KEY, JSON.stringify(payload));
    }catch(_err){ /* 3D連携は付加機能。失敗しても本体は継続 */ }
  }

  const activePhaseLabels = Object.freeze({
    "calibration": "校正観測",
    "noise-check": "Baseline観測",
    "gravity": "重力応答観測",
    "custom": "主観測",
    "electrostatic": "静電気力観測",
    "repeat": "繰り返し観測",
    "detection-limit": "微小応答観測",
    "mosquito": "外乱比較観測"
  });

  const tailStabilityPolicy = Object.freeze({
    totalSeconds: 120,
    halfSeconds: 60,
    stableRatio: 0.05,
    strongMovingRatio: 0.10,
    minimumSamplesPerHalf: 4
  });

  const postBaselineExtensionPolicy = Object.freeze({
    extensionSeconds: 120,
    maximumExtensions: 2,
    maximumAddedSeconds: 240
  });

  function getPostBaselineExtensionBudget(currentDecision = {}){
    const extensionCount = Math.max(0, Number(currentDecision.extensionCount) || 0);
    const addedSeconds = Math.max(0, Number(currentDecision.addedSeconds) || 0);
    const baseDurationSeconds = Math.max(0, Number(currentDecision.baseDurationSeconds) || 0);
    const remainingExtensions = Math.max(
      0,
      postBaselineExtensionPolicy.maximumExtensions - extensionCount
    );
    const remainingAddedSeconds = Math.max(
      0,
      postBaselineExtensionPolicy.maximumAddedSeconds - addedSeconds
    );
    const nextExtensionSeconds = remainingExtensions > 0
      ? Math.min(postBaselineExtensionPolicy.extensionSeconds, remainingAddedSeconds)
      : 0;
    const targetDurationSeconds = baseDurationSeconds + addedSeconds;
    const capReached = remainingExtensions <= 0 || nextExtensionSeconds <= 0;

    return Object.freeze({
      extensionCount,
      addedSeconds,
      baseDurationSeconds,
      targetDurationSeconds,
      remainingExtensions,
      remainingAddedSeconds,
      nextExtensionSeconds,
      nextTargetDurationSeconds:targetDurationSeconds + nextExtensionSeconds,
      capReached
    });
  }

  function createInitialPostBaselineExtensionDecision(baseDurationSeconds = 0){
    const baseDuration = Math.max(0, Number(baseDurationSeconds) || 0);
    return {
      assessment: "pending",
      workflowStatus: "waiting",
      eligible: false,
      available: false,
      recommendation: false,
      severity: "none",
      canExtend: false,
      requiresDecision: false,
      choice: null,
      extensionCount: 0,
      addedSeconds: 0,
      baseDurationSeconds: baseDuration,
      targetDurationSeconds: baseDuration,
      nextExtensionSeconds: postBaselineExtensionPolicy.extensionSeconds,
      nextTargetDurationSeconds: baseDuration + postBaselineExtensionPolicy.extensionSeconds,
      maximumExtensions: postBaselineExtensionPolicy.maximumExtensions,
      maximumAddedSeconds: postBaselineExtensionPolicy.maximumAddedSeconds,
      capReached: false,
      finalizationReason: null,
      reason: "観測完了後に事後Baselineの終盤安定度を確認します。",
      evaluatedAt: null,
      selectedAt: null,
      initialCompletedAt: null,
      extensionStartedAt: null,
      extensionCompletedAt: null,
      history: [],
      postDurationSeconds: 0,
      firstCount: 0,
      secondCount: 0,
      firstMeanThetaRad: null,
      secondMeanThetaRad: null,
      deltaThetaRad: null,
      deltaThetaEqRatio: null
    };
  }

  function getPostBaselineExtensionUnavailableReason(tail){
    switch(tail?.reason){
      case "thetaeq_zero":
        return "thetaEqが0のため、終盤変化量をthetaEq比で評価できません。自動延長の対象外です。";
      case "post_baseline_short":
        return `事後Baselineが${Number(tail?.postDurationSeconds) || 0}秒で、延長判断に必要な120秒へ届いていません。`;
      case "insufficient_samples":
        return "終盤120秒の前半・後半に必要なサンプル数がなく、自動延長を判断できません。";
      case "window_incomplete":
        return "事後Baseline終盤120秒の収集が完了していないため、延長判断を確定できません。";
      default:
        return "事後Baseline延長の自動判断に必要な条件が揃っていません。";
    }
  }

  function computePostBaselineExtensionDecision(analysis, currentDecision, evaluatedAt){
    const current = currentDecision || createInitialPostBaselineExtensionDecision();
    const budget = getPostBaselineExtensionBudget(current);
    const {
      extensionCount,
      addedSeconds,
      baseDurationSeconds,
      capReached
    } = budget;
    const tail = analysis?.tailStability;
    const evidence = {
      extensionCount,
      addedSeconds,
      baseDurationSeconds,
      targetDurationSeconds: budget.targetDurationSeconds,
      nextExtensionSeconds: budget.nextExtensionSeconds,
      nextTargetDurationSeconds: budget.nextTargetDurationSeconds,
      maximumExtensions: postBaselineExtensionPolicy.maximumExtensions,
      maximumAddedSeconds: postBaselineExtensionPolicy.maximumAddedSeconds,
      capReached,
      evaluatedAt: evaluatedAt || null,
      selectedAt: null,
      initialCompletedAt: current.initialCompletedAt || evaluatedAt || null,
      extensionStartedAt: current.extensionStartedAt || null,
      extensionCompletedAt: extensionCount > 0 ? (evaluatedAt || null) : null,
      history: Array.isArray(current.history) ? current.history.map(entry=>({...entry})) : [],
      choice: null,
      finalizationReason: null,
      postDurationSeconds: Number(tail?.postDurationSeconds) || 0,
      firstCount: Number(tail?.firstCount) || 0,
      secondCount: Number(tail?.secondCount) || 0,
      firstMeanThetaRad: Number.isFinite(tail?.firstMeanThetaRad) ? Number(tail.firstMeanThetaRad) : null,
      secondMeanThetaRad: Number.isFinite(tail?.secondMeanThetaRad) ? Number(tail.secondMeanThetaRad) : null,
      deltaThetaRad: Number.isFinite(tail?.deltaThetaRad) ? Number(tail.deltaThetaRad) : null,
      deltaThetaEqRatio: Number.isFinite(tail?.deltaThetaEqRatio) ? Number(tail.deltaThetaEqRatio) : null
    };

    if(!tail?.applicable || !tail?.complete || !tail?.available){
      return {
        ...evidence,
        assessment: "not-applicable",
        workflowStatus: "finalized",
        eligible: false,
        available: false,
        recommendation: false,
        severity: "none",
        canExtend: false,
        requiresDecision: false,
        choice: "auto-finalize",
        finalizationReason: "not-applicable",
        reason: getPostBaselineExtensionUnavailableReason(tail)
      };
    }

    if(tail.status === "stable"){
      return {
        ...evidence,
        assessment: "stable",
        workflowStatus: "finalized",
        eligible: true,
        available: true,
        recommendation: false,
        severity: "none",
        canExtend: false,
        requiresDecision: false,
        choice: "auto-finalize",
        finalizationReason: extensionCount > 0 ? "stable-after-extension" : "stable",
        reason: "終盤120秒の変化量がthetaEqの5%以下で、事後Baselineは安定基準内です。"
      };
    }

    if(capReached){
      return {
        ...evidence,
        assessment: "cap-reached",
        workflowStatus: "decision-required",
        eligible: true,
        available: true,
        recommendation: true,
        severity: tail.status === "moving-strong" ? "strong" : "standard",
        canExtend: false,
        requiresDecision: true,
        reason: `終盤120秒は安定基準へ入っていませんが、標準延長は${extensionCount}/${postBaselineExtensionPolicy.maximumExtensions}回・追加${addedSeconds}/${postBaselineExtensionPolicy.maximumAddedSeconds}秒の上限へ到達しています。観測者確認のうえ終了してください。`
      };
    }

    const strong = tail.status === "moving-strong";
    return {
      ...evidence,
      assessment: strong ? "extension-strongly-recommended" : "extension-recommended",
      workflowStatus: "decision-required",
      eligible: true,
      available: true,
      recommendation: true,
      severity: strong ? "strong" : "standard",
      canExtend: true,
      requiresDecision: true,
      reason: strong
        ? `終盤120秒の変化量がthetaEqの10%を超え、変化が継続しています。事後Baselineの${extensionCount > 0 ? "再" : ""}延長（${budget.targetDurationSeconds}→${budget.nextTargetDurationSeconds}秒）を推奨します。`
        : `終盤120秒の変化量がthetaEqの5%を超えています。復帰確認のため事後Baselineの${extensionCount > 0 ? "再" : ""}延長（${budget.targetDurationSeconds}→${budget.nextTargetDurationSeconds}秒）を推奨します。`
    };
  }

  const residualSupportPolicy = Object.freeze({
    warningRatio: 0.20,
    ngRatio: 0.60
  });

  function getPhaseBounds(mode, durationSeconds){
    const duration = Math.max(0, Number(durationSeconds) || 0);
    let start = duration * 0.2;
    let end = duration * 0.8;

    switch(mode){
      case "calibration":
        start = 18;
        end = Math.max(80, duration - 30);
        break;
      case "noise-check":
        start = 0;
        end = duration;
        break;
      case "gravity":
        start = 120;
        end = duration - 120;
        break;
      case "custom":
      case "electrostatic":
        start = 40;
        end = duration - 40;
        break;
      case "repeat":
        start = 30;
        end = duration - 30;
        break;
      case "detection-limit":
        start = duration * 0.3;
        end = duration * 0.7;
        break;
      case "mosquito":
        start = 20;
        end = duration - 20;
        break;
      default:
        break;
    }

    start = clampNumber(start, 0, duration, 0);
    end = clampNumber(end, 0, duration, duration);
    const usedCompatibilityFallback = end <= start && duration > 0;
    if(usedCompatibilityFallback){
      start = duration * 0.2;
      end = duration * 0.8;
    }

    return Object.freeze({start, end, usedCompatibilityFallback});
  }

  function createTimelineModel(controls, durationSeconds, currentTimeSeconds = 0, observationPlan = null){
    const mode = String(controls?.mode || "calibration");
    const duration = Math.max(0, Number(durationSeconds) || 0);
    const elapsed = clampNumber(currentTimeSeconds, 0, duration, 0);
    const plan = normalizeObservationPlan(controls, observationPlan || {
      baseDurationSeconds:duration,
      addedSeconds:0
    });
    const baseDuration = Math.min(duration, plan.baseDurationSeconds);
    const bounds = getPhaseBounds(mode, baseDuration);
    const activeLength = Math.max(0, bounds.end - bounds.start);

    let mainStartRatio = 0.35;
    let mainEndRatio = 0.9;
    if(mode === "calibration"){
      mainStartRatio = 0.45;
      mainEndRatio = 0.88;
    }else if(mode === "gravity"){
      mainStartRatio = 0.58;
      mainEndRatio = 0.92;
    }else if(mode === "detection-limit"){
      mainStartRatio = 0.25;
      mainEndRatio = 0.95;
    }

    const mainStart = mode === "noise-check"
      ? baseDuration * 0.1
      : bounds.start + activeLength * mainStartRatio;
    const mainEnd = mode === "noise-check"
      ? baseDuration * 0.9
      : bounds.start + activeLength * mainEndRatio;

    const phaseDefinitions = [
      {id:"pre-baseline", label:"事前Baseline", role:"support", start:0, end:bounds.start},
      {
        id:"active",
        label:activePhaseLabels[mode] || activePhaseLabels.calibration,
        role:"active",
        start:bounds.start,
        end:bounds.end
      },
      {id:"post-baseline", label:"事後Baseline", role:"support", start:bounds.end, end:duration}
    ];
    const phases = Object.freeze(phaseDefinitions.map(phase=>Object.freeze({...phase})));
    const currentPhase = phases.find((phase, index)=>{
      if(phase.end <= phase.start) return false;
      return index === phases.length - 1
        ? elapsed >= phase.start && elapsed <= phase.end
        : elapsed >= phase.start && elapsed < phase.end;
    }) || phases[1];

    const windows = Object.freeze({
      preBaseline: Object.freeze({id:"pre-baseline", label:"事前Baseline", role:"support", start:0, end:bounds.start}),
      activePeriod: Object.freeze({
        id:"active-period",
        label:activePhaseLabels[mode] || activePhaseLabels.calibration,
        role:"candidate",
        start:bounds.start,
        end:bounds.end
      }),
      mainEvaluation: Object.freeze({
        id:"main-evaluation",
        label:"主評価窓",
        role:"main",
        start:mainStart,
        end:mainEnd
      }),
      postBaseline: Object.freeze({id:"post-baseline", label:"事後Baseline", role:"support", start:bounds.end, end:duration})
    });

    return Object.freeze({
      mode,
      durationSeconds: duration,
      baseDurationSeconds: baseDuration,
      addedSeconds: Math.max(0, duration - baseDuration),
      elapsedSeconds: elapsed,
      phases,
      currentPhase,
      windows,
      usedCompatibilityFallback: bounds.usedCompatibilityFallback
    });
  }

  function evaluateStepResponse(t, tau, k, I, c){
    if(!Number.isFinite(t) || t <= 0) return 0;
    if(!Number.isFinite(tau) || !Number.isFinite(k) || !Number.isFinite(I) || !Number.isFinite(c)) return 0;
    if(k <= 0 || I <= 0) return 0;

    const thetaEq = tau / k;
    const omegaN = Math.sqrt(k / I);
    const zeta = c / (2 * Math.sqrt(k * I));

    if(!Number.isFinite(thetaEq) || !Number.isFinite(omegaN) || omegaN <= 0 || !Number.isFinite(zeta)){
      return 0;
    }

    if(zeta < 0.999){
      const damped = omegaN * Math.sqrt(Math.max(1e-12, 1 - zeta * zeta));
      const envelope = Math.exp(-zeta * omegaN * t);
      const response = 1 - envelope * (
        Math.cos(damped * t) + (zeta / Math.sqrt(Math.max(1e-12, 1 - zeta * zeta))) * Math.sin(damped * t)
      );
      return thetaEq * response;
    }

    if(zeta <= 1.001){
      const response = 1 - Math.exp(-omegaN * t) * (1 + omegaN * t);
      return thetaEq * response;
    }

    const disc = Math.max(0, c * c - 4 * I * k);
    const sqrtDisc = Math.sqrt(disc);
    const r1 = (-c + sqrtDisc) / (2 * I);
    const r2 = (-c - sqrtDisc) / (2 * I);

    if(Math.abs(r1 - r2) < 1e-12){
      const response = 1 - Math.exp(-omegaN * t) * (1 + omegaN * t);
      return thetaEq * response;
    }

    const A = thetaEq * r2 / (r1 - r2);
    const B = -thetaEq * r1 / (r1 - r2);
    return thetaEq + A * Math.exp(r1 * t) + B * Math.exp(r2 * t);
  }

  function evaluateWindowedTorqueResponse(t, tau, activeStart, activeEnd, k, I, c){
    if(!Number.isFinite(t) || !Number.isFinite(activeStart) || !Number.isFinite(activeEnd)) return 0;
    if(activeEnd <= activeStart || t < activeStart || tau === 0) return 0;

    const onResponse = evaluateStepResponse(t - activeStart, tau, k, I, c);
    if(t < activeEnd) return onResponse;

    const offResponse = evaluateStepResponse(t - activeEnd, tau, k, I, c);
    return onResponse - offResponse;
  }

  function inputStateAtTime(t, mode, activeStart, activeEnd, activeTorqueNm){
    const active = mode !== "noise-check" && t >= activeStart && t < activeEnd;
    return Object.freeze({
      phaseId: mode === "noise-check"
        ? "active"
        : t < activeStart ? "pre-baseline" : t < activeEnd ? "active" : "post-baseline",
      gate: active ? 1 : 0,
      appliedTorqueNm: active ? activeTorqueNm : 0
    });
  }

  function hashUint32(x){
    let h = x >>> 0;
    h = Math.imul(h ^ (h >>> 16), 0x7feb352d);
    h = Math.imul(h ^ (h >>> 15), 0x846ca68b);
    h = (h ^ (h >>> 16)) >>> 0;
    return h;
  }

  function splitmix32(seed){
    let a = seed >>> 0;
    return function(){
      a = (a + 0x9e3779b9) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // 白色ノイズ成分専用の疑似ガウス乱数。(t, seed)だけで決まる純関数であり、
  // 呼び出し順序に依存せず、同じ観測run内では再計算しても同じ値を返す。
  // ハッシュで(t, seed)を混合してから2個の一様乱数を作り、Box-Muller変換で
  // 標準正規分布(平均0)へ変換する。振幅は旧実装(正弦波3本合成)のRMSと
  // ほぼ揃うようσ≈0.4555でスケールする。
  function pseudoNoise01(t, seed){
    const tBits = Math.floor(t * 1e6) >>> 0;
    const seedBits = (Number(seed) || 0) >>> 0;
    const mixed = hashUint32(hashUint32(tBits) ^ hashUint32(seedBits * 2654435761));
    const rand = splitmix32(mixed);
    const u1 = Math.max(rand(), 1e-12);
    const u2 = rand();
    const gaussian = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const sigma = 0.4555;
    return Math.max(-2, Math.min(2, gaussian * sigma));
  }

  function createShieldingModel(controls){
    const masterEnabled = controls.shieldingMaster === "on";
    const preset = masterEnabled ? controls.shieldingPreset : "none";
    const policy = shieldingPresetPolicy[preset] || shieldingPresetPolicy.none;
    return Object.freeze({
      masterEnabled,
      preset,
      label:policy.label,
      environmentState:policy.environmentState,
      attenuationActive:masterEnabled && preset !== "none",
      componentFactors:policy.componentFactors
    });
  }

  function noiseControlState(controls, componentId, shielding){
    const policy = noiseComponentPolicy[componentId];
    const prefix = policy.controlPrefix;
    const enabled = controls.noiseMaster === "on" &&
      controls.noisePreset !== "ideal" &&
      controls[`${prefix}Enabled`] === "on";
    const level = clampNumber(controls[`${prefix}Level`], 0, 3, 0);
    return Object.freeze({
      id:componentId,
      label:policy.label,
      domain:policy.domain,
      coefficient:policy.coefficient,
      shieldingFactor:shielding.componentFactors[componentId] ?? 1,
      enabled,
      visible:controls[`${prefix}Visible`] === "on",
      level,
      color:policy.color
    });
  }

  // IL278 ノイズ仕様A: physically-grounded thermal (White) noise via the
  // equipartition theorem. For a torsional oscillator at thermal equilibrium,
  // the angular fluctuation is theta_rms = sqrt(kB*T/k) -- independent of
  // damping, sample rate, or input torque (unlike the old scheme where White
  // noise scaled with the configured input torque, which has no physical
  // basis: thermal noise exists even with zero applied torque).
  // The existing pipeline converts torque->theta via theta=torque/k, so we
  // back-derive the torque-domain RMS that reproduces this theta_rms:
  //   torque_rms = k * theta_rms = k * sqrt(kB*T/k) = sqrt(kB*T*k)
  const BOLTZMANN_CONSTANT_J_PER_K = 1.380649e-23;
  const ASSUMED_ROOM_TEMPERATURE_K = 293;

  function thermalNoiseTorqueRmsNm(stiffnessNmPerRad){
    const k = Number(stiffnessNmPerRad);
    if(!Number.isFinite(k) || k <= 0) return 0;
    return Math.sqrt(BOLTZMANN_CONSTANT_J_PER_K * ASSUMED_ROOM_TEMPERATURE_K * k);
  }

  function createNoiseModel(controls, configuredTorqueNm, stiffnessNmPerRad, runSeed, opticalDistanceM){
    const modePolicy = noiseModePolicy[controls.mode] || noiseModePolicy.custom;
    const referenceTorqueNm = Math.max(Math.abs(Number(configuredTorqueNm)) || 0, 1e-12);
    const baseTorqueNm = referenceTorqueNm * modePolicy.scale;
    const shielding = createShieldingModel(controls);
    const components = {};
    for(const componentId of Object.keys(noiseComponentPolicy)){
      components[componentId] = noiseControlState(controls, componentId, shielding);
    }
    const seed = Number.isFinite(runSeed) ? runSeed : modePolicy.seed;
    return Object.freeze({
      masterEnabled:controls.noiseMaster === "on",
      preset:controls.noisePreset,
      presetAmplitudeFactor:controls.noisePreset === "ideal" ? 0 : 1,
      mode:controls.mode,
      seed,
      isRunSeed:Number.isFinite(runSeed),
      modeScale:modePolicy.scale,
      impulseAllowed:modePolicy.impulse,
      referenceTorqueNm,
      baseTorqueNm,
      thermalNoiseTorqueRmsNm:thermalNoiseTorqueRmsNm(stiffnessNmPerRad),
      stiffnessNmPerRad,
      material:controls.material,
      opticalDistanceM,
      timeScale:clampNumber(controls.timeScale, 0.1, 100, 1),
      impulseAmplitudeSource:controls.impulseAmplitudeSource === "measured" ? "measured" : "theoretical",
      impulseMeasuredAmplitudeRad:Number.isFinite(Number(controls.impulseMeasuredAmplitudeRad)) ? Number(controls.impulseMeasuredAmplitudeRad) : 0,
      impulseMeasuredAtTimeScale:clampNumber(controls.impulseMeasuredAtTimeScale, 0.1, 100, 1),
      impulseMeasurementStatus:controls.impulseMeasurementStatus || "idle",
      shielding,
      components:Object.freeze(components)
    });
  }

  const PSEUDO_NOISE_SIGMA = 0.4555;

  function evaluateNoiseAtTime(t, noiseModel, signalThetaRad){
    const base = noiseModel.baseTorqueNm;
    const seed = noiseModel.seed;
    const k = noiseModel.stiffnessNmPerRad;
    const L = Number(noiseModel.opticalDistanceM) || 1;
    const component = noiseModel.components;
    const active = id=>component[id].enabled ? component[id].level : 0;
    const shield = id=>component[id].shieldingFactor;

    // IL278 ノイズ仕様A: White noise is now the physically-grounded thermal
    // fluctuation (equipartition theorem), scaled only by the device's
    // stiffness k and room temperature -- NOT by the configured input
    // torque or mode. pseudoNoise01 already has sigma=0.4555, so dividing
    // by that yields a unit-sigma standard normal draw, which we then scale
    // by the device's thermal torque RMS (1-sigma equivalent).
    const unitGaussian = pseudoNoise01(t, seed) / PSEUDO_NOISE_SIGMA;
    const whiteNoiseTorqueNm =
      noiseModel.thermalNoiseTorqueRmsNm * active("white") * shield("white") * unitGaussian;
    // IL278 ノイズ仕様B(改訂: ノイズ仕様B2): drift is grounded in the wire's thermal
    // stiffness coefficient (dG/G per K), now selected by the actual material
    // control instead of being hardcoded to tungsten regardless of selection.
    // A temperature swing ΔT changes the shear modulus G, which changes k,
    // which shifts the equilibrium angle theta_eq=tau/k by a fraction
    // (dG/G)*ΔT of whatever theta is currently established by the applied
    // torque. This correctly predicts ZERO drift when no torque is applied
    // (e.g. noise-check mode), since theta_eq=0 regardless of k. Computed in
    // theta-domain, then converted back to an equivalent torque (×k) to fit
    // into this function's torque-domain sum.
    //
    // Sources/tiers: see WIRE_MATERIAL_PROPERTIES (shared with the k=πGd⁴/(32L)
    // stiffness derivation) for material data and citations.
    const materialRelDgDt = wireMaterialProps(noiseModel.material).relDgDtPerK;
    const ASSUMED_LAB_TEMP_SWING_K = 1.0; // unshielded lab, calibration-room-class order of magnitude
    const currentSignalThetaRad = Number(signalThetaRad) || 0;
    const driftThetaRad =
      currentSignalThetaRad * materialRelDgDt * ASSUMED_LAB_TEMP_SWING_K *
      active("drift") * shield("drift") *
      Math.sin(2 * Math.PI * 0.0028 * t + seed * 0.001);
    const driftNoiseTorqueNm = driftThetaRad * k;
    // IL278 ノイズ仕様C: periodic is now grounded as ground-tilt coupling. A
    // torsion balance's whole support frame tips with the ground, so the
    // apparent angle reading directly tracks the ground tilt angle
    // (theta_apparent ≈ ground_tilt, no device-specific transfer function
    // needed). Unlike drift, this exists independent of applied torque,
    // matching real seismic/microseismic coupling.
    //
    // Frequency (0.032Hz=32mHz) sits within the well-documented microseismic
    // peak band (~30-500mHz, torsion-pendulum & gravitational-wave detector
    // literature), so the pre-existing choice is retained and now justified.
    //
    // Amplitude: attempted to use Peterson's NLNM/NHNM (the standard global
    // reference for seismic background noise), but that model characterizes
    // TRANSLATIONAL ground motion (displacement/velocity/acceleration), not
    // ROTATIONAL tilt -- a physically distinct quantity requiring its own
    // sensor (real observatories use separate tilt-specific instruments,
    // e.g. LIGO's Beam Rotation Sensor). Converting NLNM to tilt would need
    // an unverified building-compliance assumption, adding more guesswork,
    // not less. Instead we use a directly-measured tilt figure from LIGO's
    // environmental noise study (~1e-8 rad/√Hz at 0.1Hz in wind) as an
    // order-of-magnitude anchor for an ungrounded/unisolated building floor.
    // This remains an "assumed_typical" tier estimate, not a rigorously
    // derived or site-measured value -- refining this (e.g. with real local
    // seismic/tilt data, or a proper PSD-to-amplitude bandwidth integration)
    // is left as a future task (see IL-VIRTUAL-TORSION-SPEC.json open_items).
    const ASSUMED_GROUND_TILT_AMPLITUDE_RAD = 5e-8;
    const periodicNoiseTorqueNm =
      ASSUMED_GROUND_TILT_AMPLITUDE_RAD * k * active("periodic") * shield("periodic") *
      Math.sin(2 * Math.PI * 0.032 * t + seed * 0.002);
    const impulseGate = Math.sin(2 * Math.PI * 0.045 * t + seed * 0.004);
    // IL278 ノイズ仕様D: impulse is now grounded as an occasional direct
    // mechanical disturbance near the device (a bump, a door closing, etc.),
    // as opposed to periodic's remote/continuous ground-tilt coupling. The
    // amplitude is anchored to the order of magnitude a smartphone
    // accelerometer/gyroscope would register for a "felt" desk-level jolt
    // (order 0.01-0.1g transient, angular-equivalent ~1e-3 rad) -- this is
    // deliberately much larger than White/drift/periodic, matching its role
    // as a rare, standout single event rather than continuous background
    // noise. Building-specific floor-vibration engineering literature (e.g.
    // AISC Design Guide 11 footfall models) could refine this further, but
    // requires structural FE modeling of a SPECIFIC building and has no
    // single universal literature constant; left as a future refinement.
    // "実測" mode (measuring a real device's sensor for a few seconds before
    // observation and substituting the measured amplitude here). Implemented
    // in IL278 ノイズ仕様D2 (未検証: セキュアコンテキスト必須のためPocketServer
    // 端末やブラウザの対応状況により、センサー値を取得できない場合があります)。
    const ASSUMED_DESK_BUMP_AMPLITUDE_RAD = 1e-3;
    const measuredSourceSelected =
      noiseModel.impulseAmplitudeSource === "measured" &&
      typeof noiseModel.impulseMeasuredAmplitudeRad === "number" &&
      noiseModel.impulseMeasuredAmplitudeRad > 0;
    // 時間倍率による希釈(ノイズ仕様D 87.2で合意): 実測は等倍速(1x)のセンサー値。
    // 観測をtimeScale倍速で再生する場合、実測1イベントぶんの振幅を
    // そのまま使うと速度に対して過大表現になるため、timeScaleで割って
    // 希釈する。測定時のtimeScaleではなく「現在の再生timeScale」で割る。
    const impulseTimeScale = clampNumber(noiseModel.timeScale, 0.1, 100, 1);
    const impulseBaseAmplitudeRad = measuredSourceSelected
      ? noiseModel.impulseMeasuredAmplitudeRad / impulseTimeScale
      : ASSUMED_DESK_BUMP_AMPLITUDE_RAD;
    const impulseNoiseTorqueNm =
      noiseModel.impulseAllowed && active("impulse") > 0 && impulseGate > 0.996
        ? impulseBaseAmplitudeRad * k * active("impulse") * shield("impulse") * (impulseGate - 0.996) / 0.004
        : 0;

    const mechanicalNoiseTorqueNm =
      whiteNoiseTorqueNm +
      driftNoiseTorqueNm +
      periodicNoiseTorqueNm +
      impulseNoiseTorqueNm;
    const mechanicalNoiseThetaRad = mechanicalNoiseTorqueNm / k;

    const opticalResolutionM = 2.54e-6; // literature: PSD spatial resolution
    // (SC-10D tetra-lateral position sensitive detector, arXiv:1412.4602),
    // used as the light-spot position determination limit. Converted via
    // x=2*theta*L (same relation as the live optical display) to a theta
    // amplitude, so it scales correctly with the device's optical distance L.
    // IL278 ノイズ仕様F: unlike drift/periodic (deterministic sinusoids), optical
    // readout error (photon shot noise, pixel quantization, speckle jitter)
    // has no physical periodicity, so it's modeled as a per-sample random
    // draw like White -- using a DIFFERENT seed offset so the two are
    // statistically independent rather than perfectly correlated.
    const opticalUnitGaussian = pseudoNoise01(t, seed + 7919) / PSEUDO_NOISE_SIGMA;
    const opticalNoiseThetaRad =
      (opticalResolutionM / (2 * L)) * active("optical") * shield("optical") * opticalUnitGaussian;
    const opticalNoiseEquivalentTorqueNm = opticalNoiseThetaRad * k;
    const preNumericThetaRad = signalThetaRad + mechanicalNoiseThetaRad + opticalNoiseThetaRad;

    // IL278 ノイズ仕様E: numeric quantization step is now grounded in the
    // display's own decimal precision (see app.js formatScientific/compact:
    // values are shown to 3 significant figures once |value|>=0.01, i.e. the
    // readout genuinely cannot resolve finer than what's printed). Compute
    // the display step size in the mm domain (matching x=2*theta*L), then
    // convert back to theta so quantization here matches what a user could
    // actually read off the screen -- no separate, ungrounded coefficient.
    const preNumericXMm = 2 * preNumericThetaRad * L * 1000;
    const numericStepXMm = (()=>{
      const absX = Math.abs(preNumericXMm);
      if(absX < 1e-12) return 1e-9; // avoid log(0); effectively no visible quantization at exact zero
      const magnitude = Math.pow(10, Math.floor(Math.log10(absX)));
      // 3 significant figures => the step is 1/1000 of the leading digit's magnitude
      return magnitude / 100;
    })();
    const numericStepThetaRad =
      active("numeric") > 0 && shield("numeric") > 0
        ? Math.abs(numericStepXMm / (2 * L * 1000))
        : 0;
    const numericStepTorqueNm = numericStepThetaRad * k;
    const quantizedThetaRad = numericStepThetaRad > 0
      ? Math.round(preNumericThetaRad / numericStepThetaRad) * numericStepThetaRad
      : preNumericThetaRad;
    const numericNoiseThetaRad = quantizedThetaRad - preNumericThetaRad;
    const numericNoiseEquivalentTorqueNm = numericNoiseThetaRad * k;
    const totalNoiseEquivalentTorqueNm =
      mechanicalNoiseTorqueNm +
      opticalNoiseEquivalentTorqueNm +
      numericNoiseEquivalentTorqueNm;
    const noiseThetaRad =
      mechanicalNoiseThetaRad +
      opticalNoiseThetaRad +
      numericNoiseThetaRad;

    return Object.freeze({
      whiteNoiseTorqueNm,
      driftNoiseTorqueNm,
      periodicNoiseTorqueNm,
      impulseNoiseTorqueNm,
      mechanicalNoiseTorqueNm,
      mechanicalNoiseThetaRad,
      opticalNoiseEquivalentTorqueNm,
      opticalNoiseThetaRad,
      numericStepTorqueNm,
      numericStepThetaRad,
      numericNoiseEquivalentTorqueNm,
      numericNoiseThetaRad,
      totalNoiseEquivalentTorqueNm,
      noiseThetaRad,
      observedThetaRad:signalThetaRad + noiseThetaRad
    });
  }

  function computeObservation(controls, physics, currentTimeSeconds = 0, observationPlan = null, runSeed = null){
    const errors = {};
    const configuredTau = Number(controls.inputTorqueNm);
    const activeTau = Number(physics?.activeInputTorqueNm);
    const k = Number(controls.stiffnessNmPerRad);
    const I = Number(controls.inertiaKgM2);
    const c = Number(controls.dampingNmsPerRad);
    const L = Number(controls.opticalDistanceM);
    const plan = normalizeObservationPlan(controls, observationPlan);
    const baseDurationSeconds = plan.baseDurationSeconds;
    const durationSeconds = plan.targetDurationSeconds;
    const baseSampleCount = 240;
    const currentElapsedSeconds = clampNumber(currentTimeSeconds, 0, durationSeconds, 0);
    const currentRatio = durationSeconds > 0 ? currentElapsedSeconds / durationSeconds : 0;
    const timelineDefinition = createTimelineModel(controls, durationSeconds, 0, plan);
    const activeStart = timelineDefinition.windows.activePeriod.start;
    const activeEnd = timelineDefinition.windows.activePeriod.end;
    const noise = createNoiseModel(controls, configuredTau, k, runSeed, L);

    if(!physics || !physics.ok) errors.physics = "physics_invalid";
    if(!Number.isFinite(configuredTau)) errors.inputTorqueNm = "not_finite";
    if(!Number.isFinite(activeTau)) errors.activeInputTorqueNm = "not_finite";
    if(!Number.isFinite(I) || I <= 0) errors.inertiaKgM2 = "invalid_positive_required";
    if(!Number.isFinite(c) || c < 0) errors.dampingNmsPerRad = "invalid_non_negative_required";
    if(!Number.isFinite(durationSeconds) || durationSeconds <= 0) errors.durationSeconds = "invalid_positive_required";

    const ok = Object.keys(errors).length === 0;
    const omegaNatural = ok ? Math.sqrt(k / I) : null;
    const dampingRatio = ok ? c / (2 * Math.sqrt(k * I)) : null;
    const regime = !ok ? "invalid" : (
      dampingRatio < 0.999 ? "underdamped" :
      dampingRatio <= 1.001 ? "critical" :
      "overdamped"
    );

    const samples = [];
    if(ok){
      const baseStepSeconds = baseDurationSeconds / Math.max(1, baseSampleCount - 1);
      const sampleTimes = [];
      for(let i = 0; i < baseSampleCount; i += 1){
        const ratio = baseSampleCount <= 1 ? 0 : i / (baseSampleCount - 1);
        sampleTimes.push(ratio * baseDurationSeconds);
      }
      for(
        let extensionOffset = 0;
        extensionOffset < plan.addedSeconds;
        extensionOffset += postBaselineExtensionPolicy.extensionSeconds
      ){
        const chunkDuration = Math.min(
          postBaselineExtensionPolicy.extensionSeconds,
          plan.addedSeconds - extensionOffset
        );
        const chunkSampleCount = Math.max(1, Math.round(chunkDuration / baseStepSeconds));
        const chunkStart = baseDurationSeconds + extensionOffset;
        for(let i = 1; i <= chunkSampleCount; i += 1){
          sampleTimes.push(chunkStart + chunkDuration * (i / chunkSampleCount));
        }
      }

      for(let i = 0; i < sampleTimes.length; i += 1){
        const t = sampleTimes[i];
        const inputState = inputStateAtTime(t, controls.mode, activeStart, activeEnd, activeTau);
        const signalThetaRad = evaluateWindowedTorqueResponse(t, activeTau, activeStart, activeEnd, k, I, c);
        const signalXMm = 2 * signalThetaRad * L * 1000;
        const sampleNoise = evaluateNoiseAtTime(t, noise, signalThetaRad);
        const thetaRad = sampleNoise.observedThetaRad;
        const xMm = 2 * thetaRad * L * 1000;
        samples.push(Object.freeze({
          index: i,
          t,
          thetaRad,
          xMm,
          signalThetaRad,
          signalXMm,
          whiteNoiseTorqueNm:sampleNoise.whiteNoiseTorqueNm,
          whiteNoiseThetaRad:sampleNoise.whiteNoiseTorqueNm / k,
          driftNoiseTorqueNm:sampleNoise.driftNoiseTorqueNm,
          driftNoiseThetaRad:sampleNoise.driftNoiseTorqueNm / k,
          periodicNoiseTorqueNm:sampleNoise.periodicNoiseTorqueNm,
          periodicNoiseThetaRad:sampleNoise.periodicNoiseTorqueNm / k,
          impulseNoiseTorqueNm:sampleNoise.impulseNoiseTorqueNm,
          impulseNoiseThetaRad:sampleNoise.impulseNoiseTorqueNm / k,
          mechanicalNoiseTorqueNm:sampleNoise.mechanicalNoiseTorqueNm,
          mechanicalNoiseThetaRad:sampleNoise.mechanicalNoiseThetaRad,
          opticalNoiseEquivalentTorqueNm:sampleNoise.opticalNoiseEquivalentTorqueNm,
          opticalNoiseThetaRad:sampleNoise.opticalNoiseThetaRad,
          numericStepTorqueNm:sampleNoise.numericStepTorqueNm,
          numericStepThetaRad:sampleNoise.numericStepThetaRad,
          numericNoiseEquivalentTorqueNm:sampleNoise.numericNoiseEquivalentTorqueNm,
          numericNoiseThetaRad:sampleNoise.numericNoiseThetaRad,
          totalNoiseEquivalentTorqueNm:sampleNoise.totalNoiseEquivalentTorqueNm,
          noiseThetaRad:sampleNoise.noiseThetaRad,
          noiseXMm:2 * sampleNoise.noiseThetaRad * L * 1000,
          phaseId: inputState.phaseId,
          inputGate: inputState.gate,
          appliedTorqueNm: inputState.appliedTorqueNm
        }));
      }
    }

    const currentIndex = samples.length
      ? Math.max(0, samples.findLastIndex(sample=>sample.t <= currentElapsedSeconds + 1e-9))
      : 0;
    const currentSample = samples[currentIndex] || Object.freeze({
      index:0,
      t:0,
      thetaRad:0,
      xMm:0,
      phaseId:"pre-baseline",
      inputGate:0,
      appliedTorqueNm:0
    });
    const timeline = createTimelineModel(controls, durationSeconds, currentSample.t, plan);

    const thetaValues = samples.map(sample=>sample.thetaRad);
    const xValues = samples.map(sample=>sample.xMm);

    const meanThetaRad = thetaValues.length
      ? thetaValues.reduce((acc, value)=>acc + value, 0) / thetaValues.length
      : null;
    const rmsThetaRad = thetaValues.length
      ? Math.sqrt(thetaValues.reduce((acc, value)=>acc + value * value, 0) / thetaValues.length)
      : null;
    const peakThetaRad = thetaValues.length
      ? thetaValues.reduce((acc, value)=>Math.abs(value) > Math.abs(acc) ? value : acc, 0)
      : null;
    const maxThetaRad = thetaValues.length ? Math.max(...thetaValues) : null;
    const minThetaRad = thetaValues.length ? Math.min(...thetaValues) : null;
    const maxXMm = xValues.length ? Math.max(...xValues) : null;
    const minXMm = xValues.length ? Math.min(...xValues) : null;

    return Object.freeze({
      ok,
      errors: Object.freeze(errors),
      plan,
      durationSeconds,
      currentElapsedSeconds,
      sampleCount: samples.length,
      currentRatio,
      currentIndex,
      currentSample,
      timeline,
      noise,
      input: Object.freeze({
        mode: controls.mode,
        configuredTorqueNm: configuredTau,
        activeTorqueNm: activeTau,
        baselineTorqueNm: 0,
        activeStartSeconds: activeStart,
        activeEndSeconds: activeEnd,
        currentGate: currentSample.inputGate,
        currentAppliedTorqueNm: currentSample.appliedTorqueNm
      }),
      samples: Object.freeze(samples),
      response: Object.freeze({
        omegaNatural,
        dampingRatio,
        regime
      }),
      stats: Object.freeze({
        meanThetaRad,
        rmsThetaRad,
        peakThetaRad,
        maxThetaRad,
        minThetaRad,
        maxXMm,
        minXMm
      })
    });
  }



  function computeSampleStats(samples){
    const source = Array.isArray(samples) ? samples : [];
    const count = source.length;

    if(count === 0){
      return Object.freeze({
        count: 0,
        meanThetaRad: null,
        rmsThetaRad: null,
        sigmaThetaRad: null,
        peakPlusThetaRad: null,
        peakMinusThetaRad: null,
        peakAbsThetaRad: null,
        p2pThetaRad: null,
        meanXMm: null,
        rmsXMm: null,
        sigmaXMm: null,
        peakPlusXMm: null,
        peakMinusXMm: null,
        peakAbsXMm: null,
        p2pXMm: null
      });
    }

    const thetaValues = source.map(sample=>Number(sample.thetaRad)).filter(Number.isFinite);
    const xValues = source.map(sample=>Number(sample.xMm)).filter(Number.isFinite);

    function calc(values){
      if(values.length === 0){
        return {mean:null, rms:null, sigma:null, max:null, min:null, peakAbs:null, p2p:null};
      }
      const mean = values.reduce((acc, value)=>acc + value, 0) / values.length;
      const rms = Math.sqrt(values.reduce((acc, value)=>acc + value * value, 0) / values.length);
      const variance = values.reduce((acc, value)=>acc + (value - mean) * (value - mean), 0) / values.length;
      const sigma = Math.sqrt(variance);
      const max = Math.max(...values);
      const min = Math.min(...values);
      const peakAbs = values.reduce((acc, value)=>Math.abs(value) > Math.abs(acc) ? value : acc, 0);
      const p2p = max - min;
      return {mean, rms, sigma, max, min, peakAbs, p2p};
    }

    const theta = calc(thetaValues);
    const x = calc(xValues);

    return Object.freeze({
      count,
      meanThetaRad: theta.mean,
      rmsThetaRad: theta.rms,
      sigmaThetaRad: theta.sigma,
      peakPlusThetaRad: theta.max,
      peakMinusThetaRad: theta.min,
      peakAbsThetaRad: theta.peakAbs,
      p2pThetaRad: theta.p2p,
      meanXMm: x.mean,
      rmsXMm: x.rms,
      sigmaXMm: x.sigma,
      peakPlusXMm: x.max,
      peakMinusXMm: x.min,
      peakAbsXMm: x.peakAbs,
      p2pXMm: x.p2p
    });
  }

  function extractSamplesInWindow(samples, windowDefinition){
    const source = Array.isArray(samples) ? samples : [];
    if(!windowDefinition) return Object.freeze([]);

    const start = Number(windowDefinition.start);
    const end = Number(windowDefinition.end);
    if(!Number.isFinite(start) || !Number.isFinite(end) || end <= start){
      return Object.freeze([]);
    }

    return Object.freeze(source.filter(sample=>{
      const time = Number(sample?.t);
      return Number.isFinite(time) && time >= start && time <= end;
    }));
  }

  function computeWindowAnalysis(observedSamples, windowDefinition, cursorTimeSeconds){
    const window = windowDefinition || Object.freeze({
      id:"unknown",
      label:"未定義",
      role:"unknown",
      start:0,
      end:0
    });
    const selectedSamples = extractSamplesInWindow(observedSamples, window);
    const sampleIndices = Object.freeze(selectedSamples.map(sample=>Number(sample.index)));
    const cursorTime = Number(cursorTimeSeconds) || 0;
    const applicable = Number(window.end) > Number(window.start);

    return Object.freeze({
      id: window.id,
      label: window.label,
      role: window.role,
      start: Number(window.start) || 0,
      end: Number(window.end) || 0,
      applicable,
      started: applicable && cursorTime >= Number(window.start),
      complete: applicable && cursorTime >= Number(window.end),
      sampleCount: selectedSamples.length,
      firstSampleIndex: sampleIndices.length ? sampleIndices[0] : null,
      lastSampleIndex: sampleIndices.length ? sampleIndices.at(-1) : null,
      sampleIndices,
      stats: computeSampleStats(selectedSamples)
    });
  }

  function computeEvaluationAnalysis(observation, observedSamples){
    const windows = observation?.timeline?.windows || {};
    const cursorTime = observation?.timeline?.elapsedSeconds ?? 0;
    const preBaseline = computeWindowAnalysis(observedSamples, windows.preBaseline, cursorTime);
    const mainEvaluation = computeWindowAnalysis(observedSamples, windows.mainEvaluation, cursorTime);
    const postBaseline = computeWindowAnalysis(observedSamples, windows.postBaseline, cursorTime);

    const preMeanThetaRad = preBaseline.stats.meanThetaRad;
    const postMeanThetaRad = postBaseline.stats.meanThetaRad;
    const preMeanXMm = preBaseline.stats.meanXMm;
    const postMeanXMm = postBaseline.stats.meanXMm;
    const hasThetaMeans = Number.isFinite(preMeanThetaRad) && Number.isFinite(postMeanThetaRad);
    const hasXMeans = Number.isFinite(preMeanXMm) && Number.isFinite(postMeanXMm);

    return Object.freeze({
      preBaseline,
      mainEvaluation,
      postBaseline,
      baseline: Object.freeze({
        available: preBaseline.sampleCount > 0 && postBaseline.sampleCount > 0,
        complete: preBaseline.complete && postBaseline.complete,
        differenceThetaRad: hasThetaMeans ? postMeanThetaRad - preMeanThetaRad : null,
        differenceXMm: hasXMeans ? postMeanXMm - preMeanXMm : null
      })
    });
  }

  function computeSignalToNoiseAnalysis(evaluation){
    const preBaseline = evaluation?.preBaseline;
    const mainEvaluation = evaluation?.mainEvaluation;
    const baselineApplicable = Boolean(preBaseline?.applicable);
    const mainApplicable = Boolean(mainEvaluation?.applicable);
    const baselineSampleCount = Number(preBaseline?.sampleCount) || 0;
    const mainSampleCount = Number(mainEvaluation?.sampleCount) || 0;
    const baselineMeanThetaRad = preBaseline?.stats?.meanThetaRad;
    const mainMeanThetaRad = mainEvaluation?.stats?.meanThetaRad;
    const baselineNoiseThetaRad = preBaseline?.stats?.sigmaThetaRad;
    const meansAvailable =
      Number.isFinite(baselineMeanThetaRad) &&
      Number.isFinite(mainMeanThetaRad);
    const signalThetaRad = meansAvailable
      ? mainMeanThetaRad - baselineMeanThetaRad
      : null;
    const signalAbsThetaRad = Number.isFinite(signalThetaRad)
      ? Math.abs(signalThetaRad)
      : null;
    const baselineNoiseAvailable =
      baselineSampleCount >= 2 &&
      Number.isFinite(baselineNoiseThetaRad) &&
      baselineNoiseThetaRad > 0;
    const available =
      baselineApplicable &&
      mainApplicable &&
      mainSampleCount > 0 &&
      meansAvailable &&
      baselineNoiseAvailable;
    const ratio = available
      ? signalAbsThetaRad / baselineNoiseThetaRad
      : null;

    let reason = "available";
    if(!baselineApplicable || !mainApplicable){
      reason = "not_applicable";
    }else if(!preBaseline.complete || baselineSampleCount < 2){
      reason = "baseline_collecting";
    }else if(!mainEvaluation.started || mainSampleCount === 0){
      reason = "main_not_started";
    }else if(!Number.isFinite(baselineNoiseThetaRad) || baselineNoiseThetaRad <= 0){
      reason = "baseline_noise_zero";
    }else if(!meansAvailable){
      reason = "insufficient_samples";
    }

    return Object.freeze({
      available,
      complete: available && Boolean(mainEvaluation.complete),
      reason,
      baselineWindowId: preBaseline?.id || null,
      signalWindowId: mainEvaluation?.id || null,
      baselineSampleCount,
      mainSampleCount,
      baselineMeanThetaRad: Number.isFinite(baselineMeanThetaRad) ? baselineMeanThetaRad : null,
      mainMeanThetaRad: Number.isFinite(mainMeanThetaRad) ? mainMeanThetaRad : null,
      signalThetaRad,
      signalAbsThetaRad,
      baselineNoiseThetaRad: Number.isFinite(baselineNoiseThetaRad) ? baselineNoiseThetaRad : null,
      ratio
    });
  }

  function computeDetectionAnalysis(signalToNoise, evaluation, mode){
    const modeId = String(mode || "calibration");
    const modeClosure = detectionModeClosures[modeId];
    if(modeClosure){
      return Object.freeze({
        applicable:false,
        available:false,
        complete:true,
        mode:modeId,
        policyId:"mode_specific",
        status:modeClosure.status,
        label:modeClosure.label,
        reason:modeClosure.reason,
        snRatio:Number.isFinite(signalToNoise?.ratio) ? signalToNoise.ratio : null,
        detectableSn:null,
        conditionalSn:null
      });
    }

    const policyId = modeId === "gravity" ? "gravity" : "default";
    const policy = detectionPolicies[policyId];
    const mainComplete = Boolean(evaluation?.mainEvaluation?.complete);
    const snRatio = Number(signalToNoise?.ratio);

    if(!signalToNoise?.available){
      let reason = "S/Nの算出条件がそろっていないため、検出判定はまだ行いません。";
      if(signalToNoise?.reason === "baseline_collecting"){
        reason = "事前Baselineを収集中です。Baseline完了後にS/Nを算出します。";
      }else if(signalToNoise?.reason === "main_not_started"){
        reason = "主評価窓へ未到達です。主評価窓の観測後にS/N判定を行います。";
      }else if(signalToNoise?.reason === "baseline_noise_zero"){
        reason = "Baseline σが0のためS/Nを有限値として算出できず、検出判定は対象外です。";
      }else if(signalToNoise?.reason === "not_applicable"){
        reason = "事前Baselineまたは主評価窓がないため、検出判定は対象外です。";
      }
      return Object.freeze({
        applicable:signalToNoise?.reason !== "not_applicable",
        available:false,
        complete:false,
        mode:modeId,
        policyId,
        status:signalToNoise?.reason === "baseline_noise_zero" ? "unavailable" : "waiting",
        label:signalToNoise?.reason === "baseline_noise_zero" ? "判定不能" : "評価待ち",
        reason,
        snRatio:null,
        detectableSn:policy.detectableSn,
        conditionalSn:policy.conditionalSn
      });
    }

    if(!mainComplete){
      return Object.freeze({
        applicable:true,
        available:false,
        complete:false,
        mode:modeId,
        policyId,
        status:"evaluating",
        label:"評価中",
        reason:"主評価窓を収集中です。窓完了後にS/N基準で検出判定を確定します。",
        snRatio,
        detectableSn:policy.detectableSn,
        conditionalSn:policy.conditionalSn
      });
    }

    let status = "undetected";
    let label = "未検出";
    let reason = `S/Nが${policy.conditionalSn}未満のため、この条件では未検出と判定します。`;
    if(snRatio >= policy.detectableSn){
      status = "detectable";
      label = "検出可能";
      reason = `S/Nが${policy.detectableSn}以上のため、主評価窓では検出可能と判定します。`;
    }else if(snRatio >= policy.conditionalSn){
      status = "conditional";
      label = "条件付き";
      reason = `S/Nが${policy.conditionalSn}以上${policy.detectableSn}未満のため、境界域の条件付き判定とします。`;
    }

    return Object.freeze({
      applicable:true,
      available:true,
      complete:true,
      mode:modeId,
      policyId,
      status,
      label,
      reason,
      snRatio,
      detectableSn:policy.detectableSn,
      conditionalSn:policy.conditionalSn
    });
  }

  function computeRecoveryAnalysis(observation, evaluation, physics){
    const postBaseline = evaluation?.postBaseline;
    const thetaEqAbs = Math.abs(Number(physics?.thetaEqRad));
    const preMeanThetaRad = evaluation?.preBaseline?.stats?.meanThetaRad;
    const baselineReferenceThetaRad = Number.isFinite(preMeanThetaRad) ? preMeanThetaRad : 0;
    const currentThetaRad = Number(observation?.currentSample?.thetaRad);
    const postStarted = Boolean(postBaseline?.started);
    const postComplete = Boolean(postBaseline?.complete);
    const ratioAvailable = Number.isFinite(thetaEqAbs) && thetaEqAbs > 1e-18;

    const currentResidualThetaRad =
      postStarted && Number.isFinite(currentThetaRad)
        ? currentThetaRad - baselineReferenceThetaRad
        : null;
    const currentResidualRatio =
      Number.isFinite(currentResidualThetaRad) && ratioAvailable
        ? Math.abs(currentResidualThetaRad) / thetaEqAbs
        : null;
    const recoveryFraction =
      Number.isFinite(currentResidualRatio)
        ? clampNumber(1 - currentResidualRatio, 0, 1, 0)
        : null;

    const postMeanResidualThetaRad = Number.isFinite(evaluation?.baseline?.differenceThetaRad)
      ? Number(evaluation.baseline.differenceThetaRad)
      : null;
    const postMeanResidualRatio =
      Number.isFinite(postMeanResidualThetaRad) && ratioAvailable
        ? Math.abs(postMeanResidualThetaRad) / thetaEqAbs
        : null;

    return Object.freeze({
      available: postStarted && ratioAvailable,
      postStarted,
      postComplete,
      baselineReferenceThetaRad,
      thetaEqReferenceRad: ratioAvailable ? thetaEqAbs : null,
      currentResidualThetaRad,
      currentResidualRatio,
      recoveryFraction,
      postMeanResidualThetaRad,
      postMeanResidualRatio
    });
  }

  function computeTailStabilityAnalysis(observation, observedSamples, physics){
    const post = observation?.timeline?.windows?.postBaseline;
    const cursorTime = Number(observation?.timeline?.elapsedSeconds) || 0;
    const postStart = Number(post?.start);
    const postEnd = Number(post?.end);
    const postDurationSeconds =
      Number.isFinite(postStart) && Number.isFinite(postEnd)
        ? Math.max(0, postEnd - postStart)
        : 0;
    const thetaEqAbs = Math.abs(Number(physics?.thetaEqRad));
    const ratioAvailable = Number.isFinite(thetaEqAbs) && thetaEqAbs > 1e-18;
    const durationApplicable = postDurationSeconds >= tailStabilityPolicy.totalSeconds;
    const start = durationApplicable ? postEnd - tailStabilityPolicy.totalSeconds : null;
    const mid = durationApplicable ? postEnd - tailStabilityPolicy.halfSeconds : null;
    const complete = durationApplicable && cursorTime >= postEnd;

    if(!ratioAvailable){
      return Object.freeze({
        available:false,
        applicable:false,
        complete,
        reason:"thetaeq_zero",
        postDurationSeconds,
        requiredDurationSeconds:tailStabilityPolicy.totalSeconds,
        start,
        mid,
        end:postEnd,
        status:"not-applicable",
        judgement:"対象外"
      });
    }

    if(!durationApplicable){
      return Object.freeze({
        available:false,
        applicable:false,
        complete:false,
        reason:"post_baseline_short",
        postDurationSeconds,
        requiredDurationSeconds:tailStabilityPolicy.totalSeconds,
        start,
        mid,
        end:Number.isFinite(postEnd) ? postEnd : null,
        status:"not-applicable",
        judgement:"対象外"
      });
    }

    const firstSamples = extractSamplesInWindow(observedSamples, {start, end:mid});
    const secondSamples = extractSamplesInWindow(observedSamples, {start:mid, end:postEnd});
    const firstStats = computeSampleStats(firstSamples);
    const secondStats = computeSampleStats(secondSamples);
    const firstCount = firstStats.count || 0;
    const secondCount = secondStats.count || 0;

    if(!complete){
      return Object.freeze({
        available:false,
        applicable:true,
        complete:false,
        reason:"window_incomplete",
        postDurationSeconds,
        requiredDurationSeconds:tailStabilityPolicy.totalSeconds,
        start,
        mid,
        end:postEnd,
        firstCount,
        secondCount,
        status:"pending",
        judgement:"収集中"
      });
    }

    const hasSamples =
      firstCount >= tailStabilityPolicy.minimumSamplesPerHalf &&
      secondCount >= tailStabilityPolicy.minimumSamplesPerHalf &&
      Number.isFinite(firstStats.meanThetaRad) &&
      Number.isFinite(secondStats.meanThetaRad);
    if(!hasSamples){
      return Object.freeze({
        available:false,
        applicable:true,
        complete:true,
        reason:"insufficient_samples",
        postDurationSeconds,
        requiredDurationSeconds:tailStabilityPolicy.totalSeconds,
        start,
        mid,
        end:postEnd,
        firstCount,
        secondCount,
        status:"unknown",
        judgement:"判定不能"
      });
    }

    const firstMeanThetaRad = Number(firstStats.meanThetaRad);
    const secondMeanThetaRad = Number(secondStats.meanThetaRad);
    const deltaThetaRad = secondMeanThetaRad - firstMeanThetaRad;
    const deltaAbsThetaRad = Math.abs(deltaThetaRad);
    const deltaThetaEqRatio = deltaAbsThetaRad / thetaEqAbs;
    const slopeThetaRadPerSecond = deltaThetaRad / tailStabilityPolicy.totalSeconds;
    const status =
      deltaThetaEqRatio <= tailStabilityPolicy.stableRatio ? "stable" :
      deltaThetaEqRatio <= tailStabilityPolicy.strongMovingRatio ? "moving" :
      "moving-strong";
    const judgement =
      status === "stable" ? "安定" :
      status === "moving" ? "安定未達" :
      "変化継続";

    return Object.freeze({
      available:true,
      applicable:true,
      complete:true,
      reason:null,
      postDurationSeconds,
      requiredDurationSeconds:tailStabilityPolicy.totalSeconds,
      start,
      mid,
      end:postEnd,
      firstCount,
      secondCount,
      firstMeanThetaRad,
      secondMeanThetaRad,
      deltaThetaRad,
      deltaAbsThetaRad,
      deltaThetaEqRatio,
      slopeThetaRadPerSecond,
      stableThresholdRatio:tailStabilityPolicy.stableRatio,
      status,
      judgement
    });
  }

  function computeResidualSupportAnalysis(recovery){
    const postStarted = Boolean(recovery?.postStarted);
    const postComplete = Boolean(recovery?.postComplete);
    const residualRatio = Number.isFinite(recovery?.postMeanResidualRatio)
      ? Number(recovery.postMeanResidualRatio)
      : null;
    const ratioApplicable =
      Number.isFinite(recovery?.thetaEqReferenceRad) &&
      Number(recovery.thetaEqReferenceRad) > 1e-18;

    if(!ratioApplicable){
      return Object.freeze({
        applicable:false,
        available:false,
        complete:true,
        status:"not-applicable",
        label:"対象外",
        reason:"θeq=0のため、事後Baseline残留比は判定対象外です。",
        residualRatio:null,
        warningRatio:residualSupportPolicy.warningRatio,
        ngRatio:residualSupportPolicy.ngRatio
      });
    }

    if(!postStarted){
      return Object.freeze({
        applicable:true,
        available:false,
        complete:false,
        status:"waiting",
        label:"未到達",
        reason:"事後Baselineへ未到達のため、残留補助判定はまだ行いません。",
        residualRatio:null,
        warningRatio:residualSupportPolicy.warningRatio,
        ngRatio:residualSupportPolicy.ngRatio
      });
    }

    if(!postComplete){
      return Object.freeze({
        applicable:true,
        available:false,
        complete:false,
        status:"evaluating",
        label:"評価中",
        reason:"事後Baselineを収集中です。窓完了後の平均残留比で補助判定を確定します。",
        residualRatio:Number.isFinite(residualRatio) ? residualRatio : null,
        warningRatio:residualSupportPolicy.warningRatio,
        ngRatio:residualSupportPolicy.ngRatio
      });
    }

    if(!Number.isFinite(residualRatio)){
      return Object.freeze({
        applicable:true,
        available:false,
        complete:true,
        status:"unavailable",
        label:"判定不能",
        reason:"事後Baseline平均残留比を算出できないため、残留補助判定は判定不能です。",
        residualRatio:null,
        warningRatio:residualSupportPolicy.warningRatio,
        ngRatio:residualSupportPolicy.ngRatio
      });
    }

    let status = "ok";
    let label = "OK";
    let reason = `残留/θeqが${residualSupportPolicy.warningRatio}未満のため、事後Baseline残留は許容範囲です。`;
    if(residualRatio >= residualSupportPolicy.ngRatio){
      status = "ng";
      label = "NG";
      reason = `残留/θeqが${residualSupportPolicy.ngRatio}以上のため、戻り・残留に大きな注意が必要です。`;
    }else if(residualRatio >= residualSupportPolicy.warningRatio){
      status = "warning";
      label = "注意";
      reason = `残留/θeqが${residualSupportPolicy.warningRatio}以上${residualSupportPolicy.ngRatio}未満のため、事後Baseline残留に注意が必要です。`;
    }

    return Object.freeze({
      applicable:true,
      available:true,
      complete:true,
      status,
      label,
      reason,
      residualRatio,
      warningRatio:residualSupportPolicy.warningRatio,
      ngRatio:residualSupportPolicy.ngRatio
    });
  }

  function computeOverallJudgementAnalysis(detection, residualSupport, tailStability, mode){
    const modeId = String(mode || "calibration");
    const modeSpecific = Object.freeze({
      "noise-check": Object.freeze({
        status:"noise-check",
        label:"ノイズ確認",
        reason:"ノイズ確認モードは、検出判定ではなくBaselineとノイズ状態の確認結果として扱います。"
      }),
      repeat: Object.freeze({
        status:"trial-summary",
        label:"繰り返し試験",
        reason:"繰り返し試験は、単発判定ではなく試行集計と再現性の確認結果として扱います。"
      }),
      electrostatic: Object.freeze({
        status:"estimated",
        label:"静電気力推定",
        reason:"静電気力モードは条件依存が強いため、断定せず推定評価として扱います。"
      }),
      mosquito: Object.freeze({
        status:"comparison",
        label:"蚊飛翔比較",
        reason:"蚊飛翔モードは周期・インパルス外乱の比較結果として扱います。"
      })
    })[modeId];

    if(modeSpecific){
      return Object.freeze({
        applicable:false,
        available:true,
        complete:true,
        mode:modeId,
        ...modeSpecific,
        mainStatus:detection?.status || null,
        residualStatus:residualSupport?.status || null,
        tailStatus:tailStability?.status || null
      });
    }

    if(!detection?.complete || !detection?.available){
      const unavailable = detection?.status === "unavailable";
      return Object.freeze({
        applicable:true,
        available:false,
        complete:false,
        mode:modeId,
        status:unavailable ? "unavailable" : detection?.status || "waiting",
        label:unavailable ? "判定不能" : detection?.label || "評価待ち",
        reason:detection?.reason || "S/N主判定の確定を待っています。",
        mainStatus:detection?.status || null,
        residualStatus:residualSupport?.status || null,
        tailStatus:tailStability?.status || null
      });
    }

    if(residualSupport?.applicable && !residualSupport.complete){
      return Object.freeze({
        applicable:true,
        available:false,
        complete:false,
        mode:modeId,
        status:"support-evaluating",
        label:"補助確認中",
        reason:`S/N主判定は${detection.label}です。事後Baseline残留の確定を待っています。`,
        mainStatus:detection.status,
        residualStatus:residualSupport.status,
        tailStatus:tailStability?.status || null
      });
    }

    if(residualSupport?.applicable && !residualSupport.available){
      return Object.freeze({
        applicable:true,
        available:false,
        complete:true,
        mode:modeId,
        status:"unavailable",
        label:"判定不能",
        reason:`S/N主判定は${detection.label}ですが、事後Baseline残留を確定できません。`,
        mainStatus:detection.status,
        residualStatus:residualSupport.status,
        tailStatus:tailStability?.status || null
      });
    }

    if(tailStability?.applicable && !tailStability.complete){
      return Object.freeze({
        applicable:true,
        available:false,
        complete:false,
        mode:modeId,
        status:"support-evaluating",
        label:"補助確認中",
        reason:`S/N主判定は${detection.label}です。終盤120秒安定度の確定を待っています。`,
        mainStatus:detection.status,
        residualStatus:residualSupport?.status || null,
        tailStatus:tailStability.status
      });
    }

    if(tailStability?.applicable && !tailStability.available){
      return Object.freeze({
        applicable:true,
        available:false,
        complete:true,
        mode:modeId,
        status:"unavailable",
        label:"判定不能",
        reason:`S/N主判定は${detection.label}ですが、終盤120秒安定度を確定できません。`,
        mainStatus:detection.status,
        residualStatus:residualSupport?.status || null,
        tailStatus:tailStability.status
      });
    }

    const tailUnstable =
      tailStability?.available &&
      (tailStability.status === "moving" || tailStability.status === "moving-strong");
    const residualProblem =
      residualSupport?.available &&
      (residualSupport.status === "warning" || residualSupport.status === "ng");

    if(tailUnstable){
      return Object.freeze({
        applicable:true,
        available:true,
        complete:true,
        mode:modeId,
        status:"extension-recommended",
        label:"再延長推奨",
        reason:`S/N主判定は${detection.label}です。終盤120秒のΔθ/θeqが5%を超えているため、事後Baselineの再延長を推奨します。`,
        mainStatus:detection.status,
        residualStatus:residualSupport?.status || null,
        tailStatus:tailStability.status
      });
    }

    if(detection.status === "conditional" || residualProblem){
      const cause = [
        detection.status === "conditional" ? "S/Nが条件付き範囲" : "",
        residualProblem ? `事後Baseline残留が${residualSupport.label}` : ""
      ].filter(Boolean).join("、");
      return Object.freeze({
        applicable:true,
        available:true,
        complete:true,
        mode:modeId,
        status:"conditional",
        label:"条件付き評価",
        reason:`${cause}のため、主判定を維持しつつ総合結果は条件付き評価とします。`,
        mainStatus:detection.status,
        residualStatus:residualSupport?.status || null,
        tailStatus:tailStability?.status || null
      });
    }

    return Object.freeze({
      applicable:true,
      available:true,
      complete:true,
      mode:modeId,
      status:detection.status,
      label:detection.label,
      reason:`S/N主判定は${detection.label}、事後Baseline残留は${residualSupport?.label || "対象外"}、終盤120秒安定度は${tailStability?.judgement || "対象外"}です。`,
      mainStatus:detection.status,
      residualStatus:residualSupport?.status || null,
      tailStatus:tailStability?.status || null
    });
  }

  function computeAnalysis(observation, physics){
    const errors = {};
    if(!observation || !observation.ok){
      errors.observation = "observation_invalid";
    }

    const samples = observation?.samples || [];
    const currentIndex = Number.isFinite(Number(observation?.currentIndex))
      ? Math.max(0, Math.min(samples.length - 1, Number(observation.currentIndex)))
      : 0;
    const elapsedSamples = samples.slice(0, currentIndex + 1);

    const elapsed = computeSampleStats(elapsedSamples);
    const full = computeSampleStats(samples);
    const evaluation = computeEvaluationAnalysis(observation, elapsedSamples);
    const signalToNoise = computeSignalToNoiseAnalysis(evaluation);
    const detection = computeDetectionAnalysis(
      signalToNoise,
      evaluation,
      observation?.input?.mode
    );
    const recovery = computeRecoveryAnalysis(observation, evaluation, physics);
    const tailStability = computeTailStabilityAnalysis(observation, elapsedSamples, physics);
    const residualSupport = computeResidualSupportAnalysis(recovery);
    const overallJudgement = computeOverallJudgementAnalysis(
      detection,
      residualSupport,
      tailStability,
      observation?.input?.mode
    );

    return Object.freeze({
      ok: Object.keys(errors).length === 0,
      errors: Object.freeze(errors),
      elapsed,
      full,
      evaluation,
      signalToNoise,
      detection,
      cursor: Object.freeze({
        currentIndex,
        currentElapsedSeconds: observation?.currentElapsedSeconds ?? 0,
        currentThetaRad: observation?.currentSample?.thetaRad ?? 0,
        currentXMm: observation?.currentSample?.xMm ?? 0
      }),
      recovery,
      tailStability,
      residualSupport,
      overallJudgement,
      residual: Object.freeze({
        residualThetaRad: recovery.currentResidualThetaRad,
        residualRatio: recovery.currentResidualRatio,
        baselineReferenceThetaRad: recovery.baselineReferenceThetaRad,
        postMeanResidualThetaRad: recovery.postMeanResidualThetaRad,
        postMeanResidualRatio: recovery.postMeanResidualRatio
      })
    });
  }


  function applyModeProfile(controls, mode){
    const profile = modeProfiles[mode] || modeProfiles.calibration;
    return {
      ...controls,
      standardConditionView: profile.standardConditionView,
      modeSourceView: profile.modeSourceView,
      initialDurationView: profile.initialDurationView
    };
  }

  function applyDeviceModelProfile(controls, deviceModel){
    const policy = deviceModelPolicy[deviceModel] || deviceModelPolicy["virtual-optical"];
    const next = {
      ...controls,
      deviceModelSummaryView: policy.summaryView
    };
    if(policy.values){
      Object.assign(next, policy.values);
    }
    // 装置の固有周期に基づく推奨観測時間を、手動モード+プリセットとして
    // 適用する。現在値が推奨値以上ならそのまま(延長で既に延ばしている場合
    // を尊重)、下回るなら推奨値以上の最小プリセットまで引き上げる。
    if(Number.isFinite(policy.recommendedDurationSeconds)){
      const currentSeconds = getObservationDurationSecondsFromControls(controls);
      const target = Math.max(policy.recommendedDurationSeconds, currentSeconds);
      const presetOptions = ["120","300","600","1200","1800","3540","3600","7200","14400","28800"];
      const nextPreset = presetOptions
        .map(Number)
        .filter(v => v >= target)
        .sort((a,b) => a-b)[0];
      next.durationMode = "manual";
      next.manualDurationPreset = String(nextPreset ?? 3600);
    }
    return next;
  }

  function makeInitialState(){
    const controls = {...defaultControls};
    const physics = computePhysics(controls);
    const observation = computeObservation(controls, physics, 0);
    return {
      lifecycle: Lifecycle.READY,
      previousLifecycle: null,
      revision: 0,
      controlRevision: 0,
      physicsRevision: 0,
      observationRevision: 0,
      analysisRevision: 0,
      lastAction: "initialize",
      lastControl: null,
      controls,
      controlErrors: {},
      physics,
      observation,
      analysis: computeAnalysis(observation, physics),
      postBaselineExtension: createInitialPostBaselineExtensionDecision(),
      session: {...initialSession}
    };
  }

  function immutableSnapshot(state){
    return Object.freeze({
      ...state,
      controls: Object.freeze({...state.controls}),
      controlErrors: Object.freeze({...state.controlErrors}),
      physics: Object.freeze({...state.physics, errors: Object.freeze({...state.physics.errors})}),
      observation: Object.freeze({
        ...state.observation,
        errors: Object.freeze({...state.observation.errors}),
        plan: Object.freeze({...state.observation.plan}),
        response: Object.freeze({...state.observation.response}),
        stats: Object.freeze({...state.observation.stats}),
        currentSample: Object.freeze({...state.observation.currentSample}),
        input: Object.freeze({...state.observation.input}),
        timeline: Object.freeze({
          ...state.observation.timeline,
          phases: Object.freeze(state.observation.timeline.phases.map(phase=>Object.freeze({...phase}))),
          currentPhase: Object.freeze({...state.observation.timeline.currentPhase}),
          windows: Object.freeze(Object.fromEntries(
            Object.entries(state.observation.timeline.windows).map(([key, window])=>[
              key,
              Object.freeze({...window})
            ])
          ))
        }),
        samples: Object.freeze(state.observation.samples.map(sample=>Object.freeze({...sample})))
      }),
      analysis: Object.freeze({
        ...state.analysis,
        errors: Object.freeze({...state.analysis.errors}),
        elapsed: Object.freeze({...state.analysis.elapsed}),
        full: Object.freeze({...state.analysis.full}),
        evaluation: Object.freeze({
          preBaseline: Object.freeze({
            ...state.analysis.evaluation.preBaseline,
            sampleIndices: Object.freeze([...state.analysis.evaluation.preBaseline.sampleIndices]),
            stats: Object.freeze({...state.analysis.evaluation.preBaseline.stats})
          }),
          mainEvaluation: Object.freeze({
            ...state.analysis.evaluation.mainEvaluation,
            sampleIndices: Object.freeze([...state.analysis.evaluation.mainEvaluation.sampleIndices]),
            stats: Object.freeze({...state.analysis.evaluation.mainEvaluation.stats})
          }),
          postBaseline: Object.freeze({
            ...state.analysis.evaluation.postBaseline,
            sampleIndices: Object.freeze([...state.analysis.evaluation.postBaseline.sampleIndices]),
            stats: Object.freeze({...state.analysis.evaluation.postBaseline.stats})
          }),
          baseline: Object.freeze({...state.analysis.evaluation.baseline})
        }),
        signalToNoise: Object.freeze({...state.analysis.signalToNoise}),
        detection: Object.freeze({...state.analysis.detection}),
        cursor: Object.freeze({...state.analysis.cursor}),
        recovery: Object.freeze({...state.analysis.recovery}),
        tailStability: Object.freeze({...state.analysis.tailStability}),
        residualSupport: Object.freeze({...state.analysis.residualSupport}),
        overallJudgement: Object.freeze({...state.analysis.overallJudgement}),
        residual: Object.freeze({...state.analysis.residual})
      }),
      postBaselineExtension: Object.freeze({
        ...state.postBaselineExtension,
        history: Object.freeze((state.postBaselineExtension.history || []).map(entry=>Object.freeze({...entry})))
      }),
      session: Object.freeze({...state.session})
    });
  }

  function validateControl(key, rawValue){
    const rule = controlRules[key];
    if(!rule) return {ok:false, error:"unknown_control"};

    if(rule.type === "text"){
      return {ok:true, value:String(rawValue)};
    }

    if(rule.type === "enum"){
      const value = String(rawValue);
      if(!rule.values.includes(value)) return {ok:false, error:"invalid_option"};
      return {ok:true, value};
    }

    const value = Number(rawValue);
    if(!Number.isFinite(value)) return {ok:false, error:"not_finite"};
    if(value < rule.min || value > rule.max) return {ok:false, error:"out_of_range"};
    return {ok:true, value};
  }

  class AppStateStore{
    #state = makeInitialState();
    #listeners = new Set();

    constructor(){
      // IL278 3D-C1: 起動直後(何も操作していない状態)でも3Dページとの
      // 連携用データを書き出しておく。#replace()経由の保存は操作後にしか
      // 走らないため、初期状態はここで明示的に永続化する。
      persistSharedDeviceParams(this.#state.controls);
    }

    #getElapsedSeconds(nowMs = Date.now()){
      const session = this.#state.session;
      const accumulated = Number(session.accumulatedSeconds) || 0;
      if(this.#state.lifecycle !== Lifecycle.RUNNING || !Number.isFinite(Number(session.lastTickAtMs))){
        return accumulated;
      }

      const deltaReal = Math.max(0, (Number(nowMs) - Number(session.lastTickAtMs)) / 1000);
      const timeScale = clampNumber(this.#state.controls.timeScale, 0.1, 100, 1);
      return accumulated + deltaReal * timeScale;
    }

    #buildObservationAt(elapsedSeconds){
      const extension = this.#state.postBaselineExtension;
      const observationPlan = Number(extension?.baseDurationSeconds) > 0
        ? {
            baseDurationSeconds:extension.baseDurationSeconds,
            addedSeconds:extension.addedSeconds
          }
        : null;
      return computeObservation(this.#state.controls, this.#state.physics, elapsedSeconds, observationPlan, this.#state.session.noiseSeed);
    }

    #getTargetDurationSeconds(){
      const plannedDuration = Number(this.#state.postBaselineExtension?.targetDurationSeconds);
      if(Number.isFinite(plannedDuration) && plannedDuration > 0){
        return plannedDuration;
      }
      return Math.max(0, Number(this.#state.observation?.durationSeconds) || 0);
    }

    getSnapshot(){ return immutableSnapshot(this.#state); }

    subscribe(listener){
      if(typeof listener !== "function") throw new TypeError("listener must be a function");
      this.#listeners.add(listener);
      listener(this.getSnapshot());
      return ()=>this.#listeners.delete(listener);
    }

    #emit(){
      const snapshot = this.getSnapshot();
      for(const listener of this.#listeners) listener(snapshot);
    }

    #replace(nextState){
      this.#state = nextState;
      this.#emit();
      persistSharedDeviceParams(nextState.controls);
    }

    #transition(nextLifecycle, action, sessionPatch = {}){
      const current = this.#state.lifecycle;
      const allowed = allowedTransitions[current];
      if(!allowed || !allowed.has(nextLifecycle)) return false;

      this.#replace({
        ...this.#state,
        lifecycle: nextLifecycle,
        previousLifecycle: current,
        revision: this.#state.revision + 1,
        lastAction: action,
        session: {...this.#state.session, ...sessionPatch}
      });
      return true;
    }

    updateControl(key, rawValue){
      if(this.#state.lifecycle !== Lifecycle.READY) return {ok:false, error:"controls_locked"};

      const result = validateControl(key, rawValue);
      const nextErrors = {...this.#state.controlErrors};

      if(!result.ok){
        nextErrors[key] = result.error;
        this.#replace({...this.#state, controlErrors: nextErrors, lastControl: key});
        return result;
      }

      delete nextErrors[key];

      let nextControls = {...this.#state.controls, [key]: result.value};

      if(key === "mode"){
        nextControls = applyModeProfile(nextControls, result.value);
      }
      if(key === "deviceModel"){
        nextControls = applyDeviceModelProfile(nextControls, result.value);
      }
      if(key === "shieldingMaster" && result.value === "off"){
        nextControls.shieldingPreset = "none";
      }
      // IL278 標準仕様-D: virtual-opticalモデルでは、剛性kは自由入力ではなく
      // material・wireDiameterMm・fiberLengthMから一貫して逆算される値とする
      // (「入力欄はあるが計算に反映されない値」を作らない方針)。
      // cavendish-1798モデルは史実データに基づく固定値をそのまま使う。
      if(nextControls.deviceModel === "virtual-optical"){
        const derivedK = deriveStiffnessNmPerRad(nextControls.material, nextControls.wireDiameterMm, nextControls.fiberLengthM);
        if(Number.isFinite(derivedK) && derivedK > 0){
          // stiffnessNmPerRadの有効範囲(numberRule 1e-12〜1)は他の物理式の
          // 想定範囲でもあるため、逆算値もこの範囲にクランプする。極端な
          // ワイヤー径・ファイバー長・材質の組み合わせでは範囲外に振れ得る
          // (検算: d=10mm,L=0.01mのタングステンでk≈15708、d=0.001mm,L=5mで
          // k≈3e-15、いずれも範囲外)。
          nextControls.stiffnessNmPerRad = clampNumber(derivedK, 1e-12, 1, nextControls.stiffnessNmPerRad);
        }
        // IL278 標準仕様-D2: 材質が実際に剛性へ反映されるようになったため、
        // 「装置仕様」「標準条件」の表示文字列も選択中の材質・寸法に応じて
        // 動的に更新する(固定文字列のまま「タングステン」表示が残る矛盾を解消)。
        const matLabel = wireMaterialLabel(nextControls.material);
        const wireMm = Number(nextControls.wireDiameterMm);
        const fiberM = Number(nextControls.fiberLengthM);
        nextControls.deviceModelSummaryView =
          `${matLabel}${Number.isFinite(wireMm) ? wireMm : "?"}mm / L≈${Number.isFinite(fiberM) ? fiberM.toFixed(3) : "?"}m / 渦電流ダンパー / 光点読取`;
        if(nextControls.mode === "calibration"){
          const opticalM = Number(nextControls.opticalDistanceM);
          nextControls.standardConditionView =
            `${matLabel} / ${Number.isFinite(wireMm) ? wireMm.toFixed(2) : "?"} mm / L=${Number.isFinite(opticalM) ? opticalM.toFixed(1) : "?"} m`;
        }
      }

      const nextPhysics = computePhysics(nextControls);
      const nextObservation = computeObservation(nextControls, nextPhysics, 0);
      const nextAnalysis = computeAnalysis(nextObservation, nextPhysics);
      const physicsChanged = JSON.stringify(nextPhysics) !== JSON.stringify(this.#state.physics);
      const observationChanged = JSON.stringify({
        ok: nextObservation.ok,
        durationSeconds: nextObservation.durationSeconds,
        currentIndex: nextObservation.currentIndex,
        response: nextObservation.response,
        stats: nextObservation.stats,
        timeline: nextObservation.timeline
      }) !== JSON.stringify({
        ok: this.#state.observation.ok,
        durationSeconds: this.#state.observation.durationSeconds,
        currentIndex: this.#state.observation.currentIndex,
        response: this.#state.observation.response,
        stats: this.#state.observation.stats,
        timeline: this.#state.observation.timeline
      });

      this.#replace({
        ...this.#state,
        controls: nextControls,
        controlErrors: nextErrors,
        physics: nextPhysics,
        observation: nextObservation,
        analysis: nextAnalysis,
        controlRevision: this.#state.controlRevision + 1,
        physicsRevision: this.#state.physicsRevision + (physicsChanged ? 1 : 0),
        observationRevision: this.#state.observationRevision + (observationChanged ? 1 : 0),
        analysisRevision: this.#state.analysisRevision + 1,
        lastControl: key,
        lastAction: "control-update"
      });

      return {ok:true, value:result.value};
    }

    updateCompletedDisplayControl(key, rawValue){
      if(this.#state.lifecycle !== Lifecycle.COMPLETED){
        return {ok:false, error:"completed_display_locked"};
      }
      if(!completedDisplayControlKeys.includes(key)){
        return {ok:false, error:"not_display_control"};
      }

      const result = validateControl(key, rawValue);
      if(!result.ok) return result;

      this.#replace({
        ...this.#state,
        controls: {...this.#state.controls, [key]: result.value},
        controlRevision: this.#state.controlRevision + 1,
        lastControl: key,
        lastAction: "completed-display-update"
      });

      return {ok:true, value:result.value};
    }

    start(){
      if(this.#state.lifecycle !== Lifecycle.READY ||
         Object.keys(this.#state.controlErrors).length > 0 ||
         !this.#state.physics.ok ||
         !this.#state.observation.ok) return false;

      const nowMs = Date.now();
      const nowIso = new Date(nowMs).toISOString();
      const nextSequence = this.#state.session.sequence + 1;
      const noiseSeed = createRunNoiseSeed(nowMs, nextSequence);
      const observation = computeObservation(this.#state.controls, this.#state.physics, 0, null, noiseSeed);
      const analysis = computeAnalysis(observation, this.#state.physics);

      this.#replace({
        ...this.#state,
        lifecycle: Lifecycle.RUNNING,
        previousLifecycle: this.#state.lifecycle,
        revision: this.#state.revision + 1,
        observation,
        analysis,
        postBaselineExtension: createInitialPostBaselineExtensionDecision(observation.durationSeconds),
        observationRevision: this.#state.observationRevision + 1,
        analysisRevision: this.#state.analysisRevision + 1,
        lastAction: "start",
        session: {
          ...this.#state.session,
          sequence: nextSequence,
          startedAt: nowIso,
          pausedAt: null,
          stoppedAt: null,
          completedAt: null,
          endReason: null,
          elapsedSeconds: 0,
          accumulatedSeconds: 0,
          lastTickAtMs: nowMs,
          extensionResumeFromSeconds:null,
          extensionTargetSeconds:null,
          noiseSeed
        }
      });
      return true;
    }

    pause(){
      if(this.#state.lifecycle !== Lifecycle.RUNNING) return false;

      const nowMs = Date.now();
      const elapsed = this.#getElapsedSeconds(nowMs);
      const observation = this.#buildObservationAt(elapsed);
      const analysis = computeAnalysis(observation, this.#state.physics);

      this.#replace({
        ...this.#state,
        lifecycle: Lifecycle.PAUSED,
        previousLifecycle: this.#state.lifecycle,
        revision: this.#state.revision + 1,
        observation,
        analysis,
        observationRevision: this.#state.observationRevision + 1,
        analysisRevision: this.#state.analysisRevision + 1,
        lastAction: "pause",
        session: {
          ...this.#state.session,
          pausedAt: new Date(nowMs).toISOString(),
          elapsedSeconds: observation.currentElapsedSeconds,
          accumulatedSeconds: observation.currentElapsedSeconds,
          lastTickAtMs: null
        }
      });
      return true;
    }

    resume(){
      if(this.#state.lifecycle !== Lifecycle.PAUSED) return false;

      const nowMs = Date.now();
      this.#replace({
        ...this.#state,
        lifecycle: Lifecycle.RUNNING,
        previousLifecycle: this.#state.lifecycle,
        revision: this.#state.revision + 1,
        lastAction: "resume",
        session: {
          ...this.#state.session,
          pausedAt: null,
          accumulatedSeconds: this.#state.observation.currentElapsedSeconds,
          elapsedSeconds: this.#state.observation.currentElapsedSeconds,
          lastTickAtMs: nowMs
        }
      });
      return true;
    }

    stop(){
      if(![Lifecycle.RUNNING, Lifecycle.PAUSED].includes(this.#state.lifecycle)) return false;

      const nowMs = Date.now();
      const elapsed = this.#state.lifecycle === Lifecycle.RUNNING
        ? this.#getElapsedSeconds(nowMs)
        : this.#state.observation.currentElapsedSeconds;
      const observation = this.#buildObservationAt(elapsed);
      const analysis = computeAnalysis(observation, this.#state.physics);

      this.#replace({
        ...this.#state,
        lifecycle: Lifecycle.STOPPED,
        previousLifecycle: this.#state.lifecycle,
        revision: this.#state.revision + 1,
        observation,
        analysis,
        observationRevision: this.#state.observationRevision + 1,
        analysisRevision: this.#state.analysisRevision + 1,
        lastAction: "stop",
        session: {
          ...this.#state.session,
          stoppedAt: new Date(nowMs).toISOString(),
          endReason: "manual_stop",
          elapsedSeconds: observation.currentElapsedSeconds,
          accumulatedSeconds: observation.currentElapsedSeconds,
          lastTickAtMs: null
        }
      });
      return true;
    }

    complete(endReason = "duration_complete"){
      if(![Lifecycle.RUNNING, Lifecycle.PAUSED].includes(this.#state.lifecycle)) return false;

      const nowMs = Date.now();
      const duration = this.#getTargetDurationSeconds();
      const observation = this.#buildObservationAt(duration);
      const analysis = computeAnalysis(observation, this.#state.physics);
      const completedAt = new Date(nowMs).toISOString();
      const postBaselineExtension = computePostBaselineExtensionDecision(
        analysis,
        this.#state.postBaselineExtension,
        completedAt
      );

      this.#replace({
        ...this.#state,
        lifecycle: Lifecycle.COMPLETED,
        previousLifecycle: this.#state.lifecycle,
        revision: this.#state.revision + 1,
        observation,
        analysis,
        postBaselineExtension,
        observationRevision: this.#state.observationRevision + 1,
        analysisRevision: this.#state.analysisRevision + 1,
        lastAction: this.#state.postBaselineExtension.extensionCount > 0
          ? "post-baseline-extension-complete"
          : "complete",
        session: {
          ...this.#state.session,
          completedAt,
          endReason,
          elapsedSeconds: duration,
          accumulatedSeconds: duration,
          lastTickAtMs: null
        }
      });
      return true;
    }

    tick(nowMs = Date.now()){
      if(this.#state.lifecycle !== Lifecycle.RUNNING) return false;

      const elapsed = this.#getElapsedSeconds(nowMs);
      const duration = this.#getTargetDurationSeconds();
      const clampedElapsed = Math.min(duration, elapsed);
      const observation = this.#buildObservationAt(clampedElapsed);
      const analysis = computeAnalysis(observation, this.#state.physics);

      const nextLifecycle = clampedElapsed >= duration ? Lifecycle.COMPLETED : Lifecycle.RUNNING;
      const didComplete = nextLifecycle === Lifecycle.COMPLETED;
      const completedAt = didComplete ? new Date(nowMs).toISOString() : this.#state.session.completedAt;
      const postBaselineExtension = didComplete
        ? computePostBaselineExtensionDecision(analysis, this.#state.postBaselineExtension, completedAt)
        : this.#state.postBaselineExtension;

      this.#replace({
        ...this.#state,
        lifecycle: nextLifecycle,
        previousLifecycle: didComplete ? this.#state.lifecycle : this.#state.previousLifecycle,
        revision: this.#state.revision + (didComplete ? 1 : 0),
        observation,
        analysis,
        postBaselineExtension,
        observationRevision: this.#state.observationRevision + 1,
        analysisRevision: this.#state.analysisRevision + 1,
        lastAction: didComplete
          ? (this.#state.postBaselineExtension.extensionCount > 0
              ? "post-baseline-extension-complete"
              : "complete")
          : this.#state.lastAction,
        session: {
          ...this.#state.session,
          completedAt,
          endReason: didComplete ? "duration_complete" : this.#state.session.endReason,
          elapsedSeconds: observation.currentElapsedSeconds,
          accumulatedSeconds: observation.currentElapsedSeconds,
          lastTickAtMs: didComplete ? null : nowMs
        }
      });
      return true;
    }

    choosePostBaselineExtension(choice){
      if(this.#state.lifecycle !== Lifecycle.COMPLETED){
        return {ok:false, error:"extension_decision_locked"};
      }
      if(!["extend","finalize"].includes(choice)){
        return {ok:false, error:"invalid_extension_choice"};
      }

      const current = this.#state.postBaselineExtension;
      if(!current?.requiresDecision){
        return {ok:false, error:"extension_decision_not_required"};
      }
      const currentBudget = getPostBaselineExtensionBudget(current);
      if(choice === "extend" && currentBudget.capReached){
        return {ok:false, error:"extension_limit_reached"};
      }
      if(choice === "extend" && !current.canExtend){
        return {ok:false, error:"extension_not_applicable"};
      }

      const selectedAt = new Date().toISOString();
      const history = Array.isArray(current.history) ? current.history.map(entry=>({...entry})) : [];

      if(choice === "extend"){
        const appliedExtensionSeconds = currentBudget.nextExtensionSeconds;
        const extensionCount = currentBudget.extensionCount + 1;
        const addedSeconds = currentBudget.addedSeconds + appliedExtensionSeconds;
        const targetDurationSeconds = currentBudget.baseDurationSeconds + addedSeconds;
        const resumeFromSeconds = Math.min(
          targetDurationSeconds,
          Math.max(
            Number(current.targetDurationSeconds) || 0,
            Number(this.#state.observation.currentElapsedSeconds) || 0,
            Number(this.#state.session.accumulatedSeconds) || 0
          )
        );
        const nextBudget = getPostBaselineExtensionBudget({
          extensionCount,
          addedSeconds,
          baseDurationSeconds:currentBudget.baseDurationSeconds
        });
        const nextDecision = {
          ...current,
          choice,
          selectedAt,
          workflowStatus:"extension-running",
          requiresDecision:false,
          canExtend:!nextBudget.capReached,
          extensionCount,
          addedSeconds,
          targetDurationSeconds,
          nextExtensionSeconds:nextBudget.nextExtensionSeconds,
          nextTargetDurationSeconds:nextBudget.nextTargetDurationSeconds,
          capReached:nextBudget.capReached,
          finalizationReason:null,
          extensionStartedAt:selectedAt,
          extensionCompletedAt:null,
          history:[
            ...history,
            {
              type:"extend",
              extensionNumber:extensionCount,
              extensionSeconds:appliedExtensionSeconds,
              selectedAt,
              fromDurationSeconds:resumeFromSeconds,
              targetDurationSeconds
            }
          ]
        };
        const observation = computeObservation(
          this.#state.controls,
          this.#state.physics,
          resumeFromSeconds,
          {baseDurationSeconds:nextDecision.baseDurationSeconds, addedSeconds:nextDecision.addedSeconds},
          this.#state.session.noiseSeed
        );
        const analysis = computeAnalysis(observation, this.#state.physics);
        const nowMs = Date.now();

        this.#replace({
          ...this.#state,
          lifecycle:Lifecycle.RUNNING,
          previousLifecycle:this.#state.lifecycle,
          revision:this.#state.revision + 1,
          lastAction:"post-baseline-extension-start",
          observation,
          analysis,
          postBaselineExtension:nextDecision,
          observationRevision:this.#state.observationRevision + 1,
          analysisRevision:this.#state.analysisRevision + 1,
          session:{
            ...this.#state.session,
            completedAt:null,
            endReason:null,
            pausedAt:null,
            stoppedAt:null,
            elapsedSeconds:observation.currentElapsedSeconds,
            accumulatedSeconds:observation.currentElapsedSeconds,
            lastTickAtMs:nowMs,
            extensionResumeFromSeconds:resumeFromSeconds,
            extensionTargetSeconds:targetDurationSeconds
          }
        });
      }else{
        const finalizationReason = current.capReached
          ? "extension-limit-reached"
          : "observer-finalize";
        const nextDecision = {
          ...current,
          choice,
          selectedAt,
          workflowStatus:"finalized",
          requiresDecision:false,
          canExtend:false,
          finalizationReason,
          history:[
            ...history,
            {
              type:"finalize",
              selectedAt,
              extensionCount:current.extensionCount,
              addedSeconds:current.addedSeconds,
              durationSeconds:this.#state.observation.durationSeconds,
              finalizationReason
            }
          ]
        };
        this.#replace({
          ...this.#state,
          revision:this.#state.revision + 1,
          lastAction:"post-baseline-finalize",
          postBaselineExtension:nextDecision,
          session:{
            ...this.#state.session,
            endReason:current.capReached
              ? "post_baseline_extension_limit"
              : "observer_finalize"
          }
        });
      }
      return {ok:true, value:choice};
    }

    clearObservation(){
      const current = this.#state.lifecycle;
      this.#replace({
        ...makeInitialState(),
        previousLifecycle: current,
        revision: this.#state.revision + 1,
        controlRevision: this.#state.controlRevision,
        physicsRevision: this.#state.physicsRevision,
        lastAction: "clear-observation",
        controls: {...this.#state.controls},
        physics: computePhysics(this.#state.controls),
        observation: computeObservation(this.#state.controls, computePhysics(this.#state.controls), 0),
        analysis: computeAnalysis(
          computeObservation(this.#state.controls, computePhysics(this.#state.controls), 0),
          computePhysics(this.#state.controls)
        ),
        observationRevision: this.#state.observationRevision + 1,
        analysisRevision: this.#state.analysisRevision + 1,
        session: {...initialSession, sequence: this.#state.session.sequence}
      });
      return true;
    }

    resetAll(){
      const current = this.#state.lifecycle;
      const next = makeInitialState();
      next.previousLifecycle = current;
      next.revision = this.#state.revision + 1;
      next.controlRevision = this.#state.controlRevision + 1;
      next.physicsRevision = this.#state.physicsRevision + 1;
      next.observationRevision = this.#state.observationRevision + 1;
      next.analysisRevision = this.#state.analysisRevision + 1;
      next.lastAction = "reset-all";
      this.#replace(next);
      return true;
    }
  }

  window.ImpulseLaboState = Object.freeze({
    Lifecycle,
    lifecycleLabels,
    defaultControls,
    controlRules,
    completedDisplayControlKeys,
    deviceModelPolicy,
    computePhysics,
    computeObservation,
    computeAnalysis,
    computeSampleStats,
    extractSamplesInWindow,
    computeSignalToNoiseAnalysis,
    computeDetectionAnalysis,
    computeRecoveryAnalysis,
    computeTailStabilityAnalysis,
    computePostBaselineExtensionDecision,
    computeResidualSupportAnalysis,
    computeOverallJudgementAnalysis,
    evaluateStepResponse,
    evaluateWindowedTorqueResponse,
    createTimelineModel,
    postBaselineExtensionPolicy,
    getPostBaselineExtensionBudget,
    modeProfiles,
    store: new AppStateStore()
  });
})();
