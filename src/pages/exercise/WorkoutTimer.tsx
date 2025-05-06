import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Typography, LinearProgress } from "@mui/material";

interface Exercise {
  name: string;
  duration: number;
  mediaUrl: string; // thêm media minh họa
}

const exercises: Exercise[] = [
  { name: "High Knees", duration: 40, mediaUrl: "https://media.giphy.com/media/xT0BKJuFXVcbZpuRmo/giphy.gif?cid=ecf05e4781wrq5tvhazmei96gfsoq9oae606kb8m5oj2m5kq&ep=v1_gifs_search&rid=giphy.gif&ct=g" },
  { name: "Relax", duration: 20, mediaUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTF5dXdpNjRnbTFxOHNvNTllamMxMWwwYjV6cjRudHI5MWN6bm1ubyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/bDTtPo3HyEluE/giphy.gif" },
  { name: "Jumping Jacks", duration: 40, mediaUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmFjb3AyYTl6ZTd4OXczeGg1c3g4d21mOWFnYzM3azM5ZTdrbm5vYiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/QXg8kI7Mu4slyiO0Md/giphy.gif" },
  { name: "Relax", duration: 20, mediaUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTF5dXdpNjRnbTFxOHNvNTllamMxMWwwYjV6cjRudHI5MWN6bm1ubyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/bDTtPo3HyEluE/giphy.gif" },
  { name: "Mountain Climbers", duration: 40, mediaUrl: "https://media.giphy.com/media/jsYmets3thkLhcvZ43/giphy.gif?cid=ecf05e47aos907pgqxhb2l011zs12vsrcfu76une0d0a3e0q&ep=v1_gifs_search&rid=giphy.gif&ct=g" },
  { name: "Relax", duration: 20, mediaUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTF5dXdpNjRnbTFxOHNvNTllamMxMWwwYjV6cjRudHI5MWN6bm1ubyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/bDTtPo3HyEluE/giphy.gif" },
  { name: "Squat to Jump", duration: 40, mediaUrl: "https://media.giphy.com/media/J1daBNanDLbbMxfhgJ/giphy.gif?cid=ecf05e47zc8k22mlyoxn5i6n89td70vju2eg1jf4n3lzgrxg&ep=v1_gifs_search&rid=giphy.gif&ct=g" },
  { name: "Relax", duration: 20, mediaUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTF5dXdpNjRnbTFxOHNvNTllamMxMWwwYjV6cjRudHI5MWN6bm1ubyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/bDTtPo3HyEluE/giphy.gif" },
  { name: "Plank Shoulder Taps", duration: 40, mediaUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTJmcXd5M2FkOHo3c3VtZW5iZ3dybHBtMHFpczJ5cngzdnhrY3BqayZlcD12MV9naWZzX3NlYXJjaCZjdD1n/CLjw2mHysNEYw/giphy.gif" },
  { name: "Relax", duration: 20, mediaUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTF5dXdpNjRnbTFxOHNvNTllamMxMWwwYjV6cjRudHI5MWN6bm1ubyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/bDTtPo3HyEluE/giphy.gif" },
];

const TOTAL_ROUNDS = 3;

export const WorkoutTimer: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(3);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const beepSound = useRef<HTMLAudioElement>(new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg"));

  useEffect(() => {
    if (started && !paused) {
      startExercise();
    }
    return () => {
      clearIntervalIfExist();
    };
  }, [started, paused]);

  useEffect(() => {
    if (started && !paused && timeLeft === 0) {
      startExercise();
    }
  }, [timeLeft, started, paused]);

  const startExercise = () => {
    if (currentExercise >= exercises.length) {
      if (currentRound >= TOTAL_ROUNDS) {
        return;
      } else {
        setCurrentRound((prev) => prev + 1);
        setCurrentExercise(0);
      }
    } else {
      setShowCountdown(true);
      setCountdownNumber(3);
      countdownPhase();
    }
  };

  const countdownPhase = () => {
    clearIntervalIfExist();
    countdownRef.current = setInterval(() => {
      setCountdownNumber((prev) => {
        if (prev <= 1) {
          clearIntervalIfExist();
          setShowCountdown(false);
          realExerciseStart();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const realExerciseStart = () => {
    const ex = exercises[currentExercise];
    setTimeLeft(ex.duration);
    setTotalDuration(ex.duration);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (paused) return prev;
        if (prev <= 1) {
          clearIntervalIfExist();
          setCurrentExercise((e) => e + 1);
          return 0;
        }
        if (prev === 4) {
          playBeep(3);
        }
        return prev - 1;
      });
    }, 1000);
  };

  const playBeep = (times: number) => {
    for (let i = 0; i < times; i++) {
      setTimeout(() => {
        beepSound.current.currentTime = 0;
        beepSound.current.play();
      }, i * 500);
    }
  };

  const clearIntervalIfExist = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  const startWorkout = () => {
    setStarted(true);
    setPaused(false);
    setCurrentRound(1);
    setCurrentExercise(0);
    setTimeLeft(0);
    setTotalDuration(0);
  };

  const pauseOrResumeWorkout = () => {
    setPaused((prev) => !prev);
  };

  const resetWorkout = () => {
    clearIntervalIfExist();
    setStarted(false);
    setPaused(false);
    setCurrentRound(1);
    setCurrentExercise(0);
    setTimeLeft(0);
    setTotalDuration(0);
    setShowCountdown(false);
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const isRelaxPhase = exercises[currentExercise]?.name.toLowerCase().includes("relax");
  const bgColor = isRelaxPhase ? "#004d00" : "#660000";
  const progressPercent = totalDuration ? (1 - timeLeft / totalDuration) * 100 : 0;
  const currentExerciseName = exercises[currentExercise]?.name || "🏆 DONE!";
  const mediaUrl = exercises[currentExercise]?.mediaUrl;

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
      <Typography variant="h3" gutterBottom>🔥 Cardio Workout Timer 🔥</Typography>

      {showCountdown ? (
        <Typography variant="h1" sx={{ fontSize: "10rem", animation: "pulse 1s infinite" }}>
          {countdownNumber}
        </Typography>
      ) : (
        <>
          <Typography variant="h4">{currentExerciseName}</Typography>

          <Typography variant="h2" sx={{ my: 2 }}>
            {formatTime(timeLeft)}
          </Typography>

          {mediaUrl && (
            <Box sx={{ mb: 2 }}>
              {mediaUrl.includes("youtube") ? (
                <iframe width="300" height="200" src={mediaUrl} title="Exercise Video" allow="autoplay" />
              ) : (
                <img src={mediaUrl} alt="Exercise" width="300" height="200" style={{ borderRadius: 8 }} />
              )}
            </Box>
          )}

          <Typography>{started ? `Vòng ${currentRound} / ${TOTAL_ROUNDS}` : ""}</Typography>

          <Box sx={{ width: "80%", mt: 2 }}>
            <LinearProgress variant="determinate" value={progressPercent} sx={{ height: 10, borderRadius: 5 }} />
          </Box>

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            {!started ? (
              <Button variant="contained" color="success" onClick={startWorkout}>
                Start
              </Button>
            ) : (
              <>
                <Button variant="contained" color={paused ? "info" : "warning"} onClick={pauseOrResumeWorkout}>
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
