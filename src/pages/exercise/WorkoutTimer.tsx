import React, { useEffect, useMemo, useRef, useState } from "react";

type StepType = "exercise" | "rest";

type Step = {
  id: string;
  name: string;
  seconds: number;
  type: StepType;
  // Lightweight “animation” that doesn’t rely on external GIFs.
  // In a real app you’d swap this for a GIF/Lottie/video.
  demo: "rope" | "burpee" | "knees" | "climber" | "rest";
};

type RunState = "idle" | "running" | "paused" | "done";

const fmt = (s: number) => {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
};

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));

export function WorkoutTimer() {
  const baseRoundSteps: Step[] = useMemo(
    () => [
      { id: "rope", name: "Jump Rope", seconds: 60, type: "exercise", demo: "rope" },
      { id: "burpees", name: "Burpees", seconds: 30, type: "exercise", demo: "burpee" },
      { id: "knees", name: "High Knees", seconds: 60, type: "exercise", demo: "knees" },
      { id: "climber", name: "Mountain Climber", seconds: 45, type: "exercise", demo: "climber" },
      { id: "rest", name: "Nghỉ", seconds: 45, type: "rest", demo: "rest" },
    ],
    []
  );

  const [roundsTotal, setRoundsTotal] = useState<number>(4);
  const [roundIndex, setRoundIndex] = useState<number>(0); // 0-based
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [runState, setRunState] = useState<RunState>("idle");

  // “remaining” is what we show; we compute it using a monotonic clock for accuracy.
  const [remaining, setRemaining] = useState<number>(baseRoundSteps[0].seconds);

  // Timing internals
  const intervalRef = useRef<number | null>(null);
  const stepEndAtRef = useRef<number>(0); // performance.now timestamp
  const remainingRef = useRef<number>(remaining);

  const stepsThisRound = baseRoundSteps;
  const currentStep = stepsThisRound[stepIndex];

  const totalStepsAcrossWorkout = roundsTotal * stepsThisRound.length;
  const flatIndex = roundIndex * stepsThisRound.length + stepIndex;

  const progress = useMemo(() => {
    const dur = currentStep.seconds;
    const rem = remaining;
    const elapsed = clamp(dur - rem, 0, dur);
    return dur <= 0 ? 0 : elapsed / dur;
  }, [currentStep.seconds, remaining]);

  const nextLabel = useMemo(() => {
    // What comes after current step?
    if (runState === "done") return "Hết bài 😈";

    let r = roundIndex;
    let s = stepIndex + 1;
    if (s >= stepsThisRound.length) {
      r += 1;
      s = 0;
    }
    if (r >= roundsTotal) return "Kết thúc";
    const st = stepsThisRound[s];
    return `${st.type === "rest" ? "⏸ " : "▶ "}${st.name} (${fmt(st.seconds)})`;
  }, [roundIndex, stepIndex, roundsTotal, runState, stepsThisRound]);

  const clearTimer = () => {
    if (intervalRef.current != null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const tick = () => {
    const now = performance.now();
    const msLeft = stepEndAtRef.current - now;
    const sLeft = Math.ceil(msLeft / 1000);
    const nextRemaining = clamp(sLeft, 0, currentStep.seconds);

    if (nextRemaining !== remainingRef.current) {
      remainingRef.current = nextRemaining;
      setRemaining(nextRemaining);
    }

    if (msLeft <= 0) {
      // Step completed
      goNextStep();
    }
  };

  const startInterval = (secondsFromNow: number) => {
    clearTimer();
    stepEndAtRef.current = performance.now() + secondsFromNow * 1000;
    intervalRef.current = window.setInterval(tick, 100);
  };

  const startOrResume = () => {
    if (runState === "done") {
      restartWorkout();
      return;
    }

    if (runState === "idle") {
      // Ensure remaining matches current step duration
      const dur = currentStep.seconds;
      remainingRef.current = dur;
      setRemaining(dur);
      startInterval(dur);
      setRunState("running");
      return;
    }

    if (runState === "paused") {
      startInterval(remainingRef.current);
      setRunState("running");
    }
  };

  const pause = () => {
    if (runState !== "running") return;
    clearTimer();
    // remainingRef is already up-to-date from last tick.
    setRunState("paused");
  };

  const restartStep = () => {
    // Restart only the current step
    const dur = currentStep.seconds;
    remainingRef.current = dur;
    setRemaining(dur);

    if (runState === "running") {
      startInterval(dur);
    } else {
      // keep paused/idle state but reset time
      clearTimer();
    }
  };

  const backToStart = () => {
    clearTimer();
    setRunState("idle");
    setRoundIndex(0);
    setStepIndex(0);
    remainingRef.current = stepsThisRound[0].seconds;
    setRemaining(stepsThisRound[0].seconds);
  };

  const restartWorkout = () => {
    backToStart();
    // auto-start
    window.setTimeout(() => startOrResume(), 0);
  };

  const goNextStep = () => {
    // Called when a step finishes (or could be used later for manual skip)
    clearTimer();

    let nextRound = roundIndex;
    let nextStep = stepIndex + 1;

    if (nextStep >= stepsThisRound.length) {
      nextRound += 1;
      nextStep = 0;
    }

    if (nextRound >= roundsTotal) {
      setRunState("done");
      // freeze remaining at 0 for the last bar
      remainingRef.current = 0;
      setRemaining(0);
      return;
    }

    setRoundIndex(nextRound);
    setStepIndex(nextStep);

    const dur = stepsThisRound[nextStep].seconds;
    remainingRef.current = dur;
    setRemaining(dur);

    if (runState === "running") {
      startInterval(dur);
    } else {
      // If paused/idle, don’t auto-run
      clearTimer();
    }
  };

  // When changing roundsTotal while idle/paused/done, keep indices sane.
  useEffect(() => {
    if (roundIndex >= roundsTotal) {
      backToStart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundsTotal]);

  // When the current step changes, ensure remaining updates if we’re idle (not started yet)
  useEffect(() => {
    if (runState === "idle") {
      remainingRef.current = currentStep.seconds;
      setRemaining(currentStep.seconds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, roundIndex]);

  // Cleanup
  useEffect(() => {
    return () => clearTimer();
  }, []);

  const stateBadge = useMemo(() => {
    switch (runState) {
      case "idle":
        return { text: "Chưa chạy", cls: "badge" };
      case "running":
        return { text: "Đang chạy", cls: "badge badgeLive" };
      case "paused":
        return { text: "Tạm dừng", cls: "badge badgePause" };
      case "done":
        return { text: "Xong", cls: "badge badgeDone" };
    }
  }, [runState]);

  const workoutPct = useMemo(() => {
    // A rough overall progress: completed steps + within-step progress.
    const completedSteps = flatIndex;
    const within = progress;
    return (completedSteps + within) / Math.max(1, totalStepsAcrossWorkout);
  }, [flatIndex, progress, totalStepsAcrossWorkout]);

  return (
    <div className="page">
      <style>{css}</style>

      <header className="header">
        <div>
          <h1 className="title">🏃‍♂️ HIIT Timer (bơi lội cũng phải sợ mày)</h1>
          <p className="subtitle">
            4 bài + nghỉ, lặp <b>4–6 vòng</b>. Có pause/continue/restart như mày yêu cầu.
          </p>
        </div>

        <div className="controlsTop">
          <label className="selectWrap" title="Chọn số vòng">
            <span className="label">Vòng</span>
            <select
              value={roundsTotal}
              onChange={(e) => setRoundsTotal(Number(e.target.value))}
              disabled={runState === "running"}
            >
              {[4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <div className={stateBadge.cls}>{stateBadge.text}</div>
        </div>
      </header>

      <div className="grid">
        <section className="card hero">
          <div className="heroTop">
            <div>
              <div className="kicker">
                Vòng <b>{roundIndex + 1}</b> / {roundsTotal} • Bước <b>{stepIndex + 1}</b> / {stepsThisRound.length}
              </div>
              <h2 className="stepTitle">
                {currentStep.type === "rest" ? "⏸ " : "▶ "}
                {currentStep.name}
              </h2>
              <div className="timeRow">
                <div className="timeBig">{fmt(remaining)}</div>
                <div className="timeMeta">
                  / {fmt(currentStep.seconds)}
                  <div className="next">Tiếp theo: {nextLabel}</div>
                </div>
              </div>
            </div>

            <div className="demoWrap" aria-label="Exercise demo">
              <Demo kind={currentStep.demo} running={runState === "running"} />
            </div>
          </div>

          <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={1} aria-valuenow={progress}>
            <div className="barFill" style={{ transform: `scaleX(${progress})` }} />
          </div>

          <div className="heroActions">
            {runState !== "running" ? (
              <button className="btn primary" onClick={startOrResume}>
                {runState === "idle" ? "▶ Start" : runState === "paused" ? "▶ Continue" : "↻ Restart"}
              </button>
            ) : (
              <button className="btn" onClick={pause}>
                ⏸ Pause
              </button>
            )}

            <button className="btn" onClick={restartStep} disabled={runState === "done"}>
              🔁 Restart set
            </button>

            <button className="btn danger" onClick={backToStart}>
              ⏮ Về từ đầu
            </button>
          </div>

          <div className="miniBar" title="Tiến độ toàn bài">
            <div className="miniFill" style={{ transform: `scaleX(${workoutPct})` }} />
          </div>
        </section>

        <section className="card">
          <h3 className="sectionTitle">📋 Bài tập trong 1 vòng</h3>
          <div className="list">
            {stepsThisRound.map((s, i) => {
              const isActive = i === stepIndex && runState !== "done";
              return (
                <div
                  key={s.id}
                  className={"row " + (isActive ? "rowActive" : "") + (s.type === "rest" ? " rowRest" : "")}
                  onClick={() => {
                    // Allow jump only when NOT running to avoid chaos
                    if (runState === "running") return;
                    setStepIndex(i);
                    remainingRef.current = s.seconds;
                    setRemaining(s.seconds);
                  }}
                  title={runState === "running" ? "Đang chạy rồi, đừng nghịch 🙂" : "Click để chọn bước"}
                >
                  <div className="rowLeft">
                    <div className="rowIcon">{s.type === "rest" ? "⏸" : "🏋️"}</div>
                    <div>
                      <div className="rowName">{i + 1}. {s.name}</div>
                      <div className="rowSub">{s.type === "rest" ? "Hồi máu" : "Đốt calo"}</div>
                    </div>
                  </div>
                  <div className="rowTime">{fmt(s.seconds)}</div>
                </div>
              );
            })}
          </div>

          <div className="tip">
            <b>Mẹo sống sót:</b> Giữ form trước, tốc độ sau. High Knees và Mountain Climber mà lưng cong như dấu hỏi là thôi, nghỉ đi.
          </div>

          <div className="note">
            <b>Gợi ý nâng cấp:</b> Thay demo bằng GIF/Lottie/video thật (mục <code>Demo</code>) là xịn ngay.
          </div>
        </section>
      </div>
    </div>
  );
}

function Demo({ kind, running }: { kind: Step["demo"]; running: boolean }) {
  // Pure CSS “animations” to satisfy the requirement without external assets.
  // If you want real images, replace this with <img src="...gif" />.
  return (
    <div className={"demo " + (running ? "demoRunning" : "demoPaused") + " demo-" + kind}>
      <div className="stick">
        <div className="head" />
        <div className="body" />
        <div className="arm armL" />
        <div className="arm armR" />
        <div className="leg legL" />
        <div className="leg legR" />
      </div>

      {kind === "rope" && (
        <>
          <div className="rope" />
          <div className="caption">Jump Rope</div>
        </>
      )}
      {kind === "burpee" && <div className="caption">Burpees</div>}
      {kind === "knees" && <div className="caption">High Knees</div>}
      {kind === "climber" && <div className="caption">Mountain Climber</div>}
      {kind === "rest" && <div className="caption">Rest / Breathe</div>}
    </div>
  );
}

const css = `
  :root {
    --bg0: #070A12;
    --bg1: #0B1020;
    --card: rgba(255,255,255,0.06);
    --card2: rgba(255,255,255,0.08);
    --stroke: rgba(255,255,255,0.12);
    --text: rgba(255,255,255,0.92);
    --muted: rgba(255,255,255,0.68);
    --muted2: rgba(255,255,255,0.52);
    --shadow: 0 20px 70px rgba(0,0,0,0.45);
    --r: 20px;
  }

  * { box-sizing: border-box; }

  .page {
    min-height: 100vh;
    color: var(--text);
    background: radial-gradient(1200px 600px at 10% 10%, rgba(125,211,252,0.20), transparent 60%),
                radial-gradient(1000px 700px at 90% 30%, rgba(167,139,250,0.18), transparent 60%),
                radial-gradient(800px 600px at 40% 90%, rgba(34,197,94,0.10), transparent 60%),
                linear-gradient(180deg, var(--bg0), var(--bg1));
    padding: 28px;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
  }

  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 18px;
  }

  .title {
    margin: 0;
    font-size: 22px;
    letter-spacing: 0.2px;
  }

  .subtitle {
    margin: 6px 0 0;
    color: var(--muted);
    font-size: 13px;
  }

  .controlsTop {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .selectWrap {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border: 1px solid var(--stroke);
    background: rgba(255,255,255,0.04);
    border-radius: 14px;
    box-shadow: var(--shadow);
    backdrop-filter: blur(10px);
  }

  .label { color: var(--muted2); font-size: 12px; }

  select {
    background: rgba(255,255,255,0.08);
    color: var(--text);
    border: 1px solid rgba(255,255,255,0.14);
    padding: 6px 10px;
    border-radius: 12px;
    outline: none;
  }

  select:disabled { opacity: 0.5; cursor: not-allowed; }

  .badge {
    padding: 10px 12px;
    border-radius: 999px;
    border: 1px solid var(--stroke);
    background: rgba(255,255,255,0.05);
    color: var(--muted);
    font-size: 12px;
    box-shadow: var(--shadow);
    backdrop-filter: blur(10px);
  }
  .badgeLive { color: rgba(125,211,252,0.95); border-color: rgba(125,211,252,0.35); }
  .badgePause { color: rgba(251,191,36,0.95); border-color: rgba(251,191,36,0.35); }
  .badgeDone { color: rgba(34,197,94,0.95); border-color: rgba(34,197,94,0.35); }

  .grid {
    display: grid;
    grid-template-columns: 1.25fr 0.85fr;
    gap: 16px;
  }

  @media (max-width: 980px) {
    .grid { grid-template-columns: 1fr; }
  }

  .card {
    border-radius: var(--r);
    border: 1px solid var(--stroke);
    background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04));
    box-shadow: var(--shadow);
    backdrop-filter: blur(14px);
    padding: 16px;
  }

  .hero {
    padding: 18px;
  }

  .heroTop {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 14px;
    align-items: center;
  }

  @media (max-width: 980px) {
    .heroTop { grid-template-columns: 1fr; }
  }

  .kicker {
    color: var(--muted2);
    font-size: 12px;
    margin-bottom: 6px;
  }

  .stepTitle {
    margin: 0;
    font-size: 26px;
    letter-spacing: 0.2px;
  }

  .timeRow {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-top: 10px;
  }

  .timeBig {
    font-size: 52px;
    font-weight: 800;
    letter-spacing: 0.5px;
  }

  .timeMeta {
    color: var(--muted);
    font-size: 14px;
  }

  .next {
    margin-top: 8px;
    color: var(--muted2);
    font-size: 12px;
  }

  .demoWrap {
    height: 210px;
    border-radius: 18px;
    border: 1px solid rgba(255,255,255,0.14);
    background: radial-gradient(500px 200px at 50% 0%, rgba(255,255,255,0.08), transparent 55%),
                rgba(255,255,255,0.03);
    position: relative;
    overflow: hidden;
  }

  .bar {
    margin-top: 14px;
    height: 12px;
    border-radius: 999px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    overflow: hidden;
  }

  .barFill {
    height: 100%;
    width: 100%;
    transform-origin: left center;
    background: linear-gradient(90deg, rgba(125,211,252,0.95), rgba(167,139,250,0.95), rgba(34,197,94,0.95));
    filter: drop-shadow(0 10px 20px rgba(0,0,0,0.35));
  }

  .heroActions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 14px;
  }

  .btn {
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.16);
    background: rgba(255,255,255,0.06);
    color: var(--text);
    padding: 10px 12px;
    cursor: pointer;
    transition: transform 0.12s ease, background 0.12s ease;
  }

  .btn:hover { transform: translateY(-1px); background: rgba(255,255,255,0.09); }
  .btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  .primary {
    background: linear-gradient(180deg, rgba(125,211,252,0.20), rgba(125,211,252,0.08));
    border-color: rgba(125,211,252,0.30);
  }

  .danger {
    background: linear-gradient(180deg, rgba(248,113,113,0.18), rgba(248,113,113,0.06));
    border-color: rgba(248,113,113,0.26);
  }

  .miniBar {
    margin-top: 14px;
    height: 6px;
    border-radius: 999px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.10);
    overflow: hidden;
  }

  .miniFill {
    height: 100%;
    width: 100%;
    transform-origin: left center;
    background: rgba(255,255,255,0.20);
  }

  .sectionTitle {
    margin: 2px 0 10px;
    font-size: 14px;
    color: var(--text);
  }

  .list { display: grid; gap: 10px; }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.05);
    cursor: pointer;
    transition: background 0.12s ease, transform 0.12s ease;
  }

  .row:hover { transform: translateY(-1px); background: rgba(255,255,255,0.07); }

  .rowActive {
    border-color: rgba(125,211,252,0.38);
    background: linear-gradient(180deg, rgba(125,211,252,0.14), rgba(255,255,255,0.04));
  }

  .rowRest { border-style: dashed; }

  .rowLeft { display: flex; gap: 10px; align-items: center; }

  .rowIcon {
    width: 34px;
    height: 34px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(255,255,255,0.14);
    background: rgba(255,255,255,0.06);
  }

  .rowName { font-size: 13px; }
  .rowSub { font-size: 11px; color: var(--muted2); margin-top: 2px; }
  .rowTime { color: var(--muted); font-weight: 600; }

  .tip, .note {
    margin-top: 12px;
    padding: 12px;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.04);
    color: var(--muted);
    font-size: 12px;
    line-height: 1.45;
  }

  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-size: 0.95em;
    color: rgba(125,211,252,0.9);
  }

  /* --- Demo stick-figure --- */
  .demo {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .demo::before {
    content: "";
    position: absolute;
    inset: -50px;
    background: radial-gradient(closest-side, rgba(255,255,255,0.08), transparent 60%);
    transform: translate3d(0,0,0);
    animation: float 6s ease-in-out infinite;
    opacity: 0.8;
  }

  .demoPaused { filter: saturate(0.8); opacity: 0.9; }

  .stick {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 90px;
    height: 120px;
    transform: translate(-50%, -55%);
  }

  .head {
    position: absolute;
    left: 50%;
    top: 6px;
    width: 28px;
    height: 28px;
    border-radius: 999px;
    transform: translateX(-50%);
    border: 2px solid rgba(255,255,255,0.7);
    background: rgba(255,255,255,0.06);
  }

  .body {
    position: absolute;
    left: 50%;
    top: 34px;
    width: 2px;
    height: 44px;
    transform: translateX(-50%);
    background: rgba(255,255,255,0.75);
  }

  .arm, .leg {
    position: absolute;
    width: 34px;
    height: 2px;
    background: rgba(255,255,255,0.75);
    transform-origin: 2px 1px;
    left: 50%;
  }

  .armL { top: 44px; transform: translateX(-2px) rotate(210deg); }
  .armR { top: 44px; transform: translateX(-2px) rotate(-30deg); }

  .legL { top: 78px; transform: translateX(-2px) rotate(120deg); }
  .legR { top: 78px; transform: translateX(-2px) rotate(60deg); }

  .caption {
    position: absolute;
    left: 12px;
    bottom: 10px;
    font-size: 12px;
    color: rgba(255,255,255,0.75);
    padding: 6px 10px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(0,0,0,0.18);
    border-radius: 999px;
    backdrop-filter: blur(10px);
  }

  /* Rope */
  .rope {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 150px;
    height: 150px;
    transform: translate(-50%, -55%);
    border-radius: 999px;
    border: 2px dashed rgba(125,211,252,0.55);
    opacity: 0.85;
  }

  /* Motion variants per exercise */
  .demoRunning.demo-rope .stick { animation: jump 0.55s ease-in-out infinite; }
  .demoRunning.demo-rope .rope { animation: spin 0.55s linear infinite; }

  .demoRunning.demo-burpee .stick { animation: burpee 1.05s ease-in-out infinite; }

  .demoRunning.demo-knees .legL { animation: legKick 0.35s ease-in-out infinite; }
  .demoRunning.demo-knees .legR { animation: legKick2 0.35s ease-in-out infinite; }
  .demoRunning.demo-knees .stick { animation: bob 0.35s ease-in-out infinite; }

  .demoRunning.demo-climber .stick { transform: translate(-50%, -55%) rotate(-12deg); }
  .demoRunning.demo-climber .armL { animation: climberA 0.28s ease-in-out infinite; }
  .demoRunning.demo-climber .armR { animation: climberB 0.28s ease-in-out infinite; }
  .demoRunning.demo-climber .legL { animation: climberA 0.28s ease-in-out infinite; }
  .demoRunning.demo-climber .legR { animation: climberB 0.28s ease-in-out infinite; }

  .demoRunning.demo-rest .demo::before { animation-duration: 10s; opacity: 0.55; }
  .demoRunning.demo-rest .stick { animation: breathe 2.2s ease-in-out infinite; }

  /* Keyframes */
  @keyframes float { 0%,100%{ transform: translate(0,0);} 50%{ transform: translate(10px, -8px);} }
  @keyframes spin { to { transform: translate(-50%, -55%) rotate(360deg); } }
  @keyframes jump { 0%,100% { transform: translate(-50%, -55%);} 50% { transform: translate(-50%, -64%);} }

  @keyframes burpee {
    0% { transform: translate(-50%, -55%) scale(1); }
    35% { transform: translate(-50%, -45%) scale(0.92) rotate(10deg); }
    70% { transform: translate(-50%, -60%) scale(1.02); }
    100% { transform: translate(-50%, -55%) scale(1); }
  }

  @keyframes bob { 0%,100%{ transform: translate(-50%, -55%);} 50%{ transform: translate(-50%, -60%);} }
  @keyframes legKick { 0%,100%{ transform: translateX(-2px) rotate(120deg);} 50%{ transform: translateX(-2px) rotate(165deg);} }
  @keyframes legKick2 { 0%,100%{ transform: translateX(-2px) rotate(60deg);} 50%{ transform: translateX(-2px) rotate(15deg);} }

  @keyframes climberA { 0%,100%{ transform: translateX(-2px) rotate(210deg);} 50%{ transform: translateX(-2px) rotate(160deg);} }
  @keyframes climberB { 0%,100%{ transform: translateX(-2px) rotate(-30deg);} 50%{ transform: translateX(-2px) rotate(20deg);} }

  @keyframes breathe { 0%,100%{ transform: translate(-50%, -55%) scale(1);} 50%{ transform: translate(-50%, -55%) scale(1.06);} }
`;

