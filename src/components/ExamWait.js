import React, { useState, useEffect } from "react";
import TimerIcon from "@material-ui/icons/Timer";

function ExamWait(props) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const open = new Date(props.exam.timeOpen);
    const now = new Date();
    if (now < open) {
      setTime(Math.abs(open - now) / 1000);
    }
  }, [props.exam.timeOpen]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => (prevTime <= 0 ? 0 : prevTime - 1));
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleClick = () => {
    if (time <= 0) {
      window.location.reload();
    }
  };

  return (
    <div className="container__alert">
      <div className="container__alert-icon container__alert-icon--done">
        <TimerIcon />
      </div>
      <p>Chưa đến giờ làm bài</p>
      <button onClick={() => handleClick()}>
        {time <= 0
          ? "Làm bài"
          : time >= 60
          ? time % 60 === 0
            ? `Vui lòng đợi: ${Math.floor(time / 60)}:00`
            : `Vui lòng đợi: ${Math.floor(time / 60)}:${(
                "0" + Math.floor(time % 60)
              ).slice(-2)}`
          : `Vui lòng đợi: ${Math.floor(time)}`}
      </button>
    </div>
  );
}

export default ExamWait;
