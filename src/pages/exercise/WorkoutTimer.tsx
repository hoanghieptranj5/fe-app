import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Typography, LinearProgress } from "@mui/material";

interface Exercise {
  name: string;
  duration: number;
  mediaUrl: string;
}

const exercises: Exercise[] = [
  {
    name: "High Knees",
    duration: 40,
    mediaUrl:
      "https://media1.popsugar-assets.com/files/thumbor/XiCmltZ1u3xHSs9UiJgTmzswHSs/fit-in/2048xorig/filters:format_auto-!!-:strip_icc-!!-/2020/06/29/850/n/1922729/a3a1ef261bffbc38_IMB_6Utd4M/i/High-Knees.GIF",
  },
  {
    name: "Relax",
    duration: 20,
    mediaUrl: "https://media.giphy.com/media/bDTtPo3HyEluE/giphy.gif",
  },
  {
    name: "Jumping Jacks",
    duration: 40,
    mediaUrl: "https://media.giphy.com/media/QXg8kI7Mu4slyiO0Md/giphy.gif",
  },
  {
    name: "Relax",
    duration: 20,
    mediaUrl: "https://media.giphy.com/media/bDTtPo3HyEluE/giphy.gif",
  },
  {
    name: "Mountain Climbers",
    duration: 40,
    mediaUrl: "https://media.giphy.com/media/jsYmets3thkLhcvZ43/giphy.gif",
  },
  {
    name: "Relax",
    duration: 20,
    mediaUrl: "https://media.giphy.com/media/bDTtPo3HyEluE/giphy.gif",
  },
  {
    name: "Squat to Jump",
    duration: 40,
    mediaUrl: "https://media.giphy.com/media/J1daBNanDLbbMxfhgJ/giphy.gif",
  },
  {
    name: "Relax",
    duration: 20,
    mediaUrl: "https://media.giphy.com/media/bDTtPo3HyEluE/giphy.gif",
  },
  {
    name: "Plank Shoulder Taps",
    duration: 40,
    mediaUrl: "https://media.giphy.com/media/CLjw2mHysNEYw/giphy.gif",
  },
  {
    name: "Relax",
    duration: 20,
    mediaUrl: "https://media.giphy.com/media/bDTtPo3HyEluE/giphy.gif",
  },
];

const TOTAL_ROUNDS = 3;
type Phase = "idle" | "countdown" | "exercise";

export const WorkoutTimer: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const beepSound = useRef<HTMLAudioElement>(
    new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg"),
  );

  useEffect(() => {
    clearInterval(intervalRef.current!);

    if (!started || paused) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          handlePhaseCompletion();
          return 0;
        }
        if (phase === "exercise" && prevTime === 4) {
          playBeep(3);
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [started, paused, phase, currentExercise, currentRound]);

  const handlePhaseCompletion = () => {
    if (phase === "countdown") {
      const ex = exercises[currentExercise];
      setPhase("exercise");
      setTimeLeft(ex.duration);
      setTotalDuration(ex.duration);
    } else if (phase === "exercise") {
      const nextExercise = currentExercise + 1;
      if (nextExercise >= exercises.length) {
        if (currentRound >= TOTAL_ROUNDS) {
          alert("🏁 Workout Complete! You're unstoppable.");
          resetWorkout();
          return;
        } else {
          setCurrentRound((r) => r + 1);
          setCurrentExercise(0);
        }
      } else {
        setCurrentExercise(nextExercise);
      }
      setPhase("countdown");
      setTimeLeft(3);
      setTotalDuration(3);
    }
  };

  const startWorkout = () => {
    setStarted(true);
    setPaused(false);
    setCurrentRound(1);
    setCurrentExercise(0);
    setPhase("countdown");
    setTimeLeft(3);
    setTotalDuration(3);
  };

  const pauseOrResumeWorkout = () => setPaused((p) => !p);

  const resetWorkout = () => {
    clearInterval(intervalRef.current!);
    setStarted(false);
    setPaused(false);
    setCurrentRound(1);
    setCurrentExercise(0);
    setPhase("idle");
    setTimeLeft(0);
    setTotalDuration(0);
  };

  const playBeep = (times: number) => {
    for (let i = 0; i < times; i++) {
      setTimeout(() => {
        beepSound.current.currentTime = 0;
        beepSound.current.play();
      }, i * 500);
    }
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const currentExerciseData = exercises[currentExercise];
  const isRelaxPhase = currentExerciseData?.name.toLowerCase().includes("relax");
  const bgColor = isRelaxPhase ? "#004d00" : "#660000";
  const progressPercent = totalDuration ? (1 - timeLeft / totalDuration) * 100 : 0;

  return (
    <Box
      sx={{
        backgroundColor: bgColor,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        color: "white",
        transition: "background 0.5s",
      }}
    >
      <Typography variant="h3" gutterBottom>
        🔥 Cardio Workout Timer 🔥
      </Typography>

      {phase === "countdown" ? (
        <Typography variant="h1" sx={{ fontSize: "10rem", animation: "pulse 1s infinite" }}>
          {timeLeft}
        </Typography>
      ) : (
        <>
          <Typography variant="h4">{currentExerciseData?.name || "🏆 DONE!"}</Typography>

          <Typography variant="h2" sx={{ my: 2 }}>
            {formatTime(timeLeft)}
          </Typography>

          {currentExerciseData?.mediaUrl && (
            <Box sx={{ mb: 2 }}>
              <img
                src={currentExerciseData.mediaUrl}
                alt="Exercise"
                width="600"
                height="400"
                style={{ borderRadius: 8 }}
              />
            </Box>
          )}

          <Typography>{started ? `Vòng ${currentRound} / ${TOTAL_ROUNDS}` : ""}</Typography>

          <Box sx={{ width: "80%", mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progressPercent}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            {!started ? (
              <Button variant="contained" color="success" onClick={startWorkout}>
                Start
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  color={paused ? "info" : "warning"}
                  onClick={pauseOrResumeWorkout}
                >
                  {paused ? "Resume" : "Pause"}
                </Button>
                <Button variant="contained" color="error" onClick={resetWorkout}>
                  Reset
                </Button>
              </>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};
