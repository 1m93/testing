import { CircularProgress } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import PlayCircleOutlineOutlinedIcon from "@material-ui/icons/PlayCircleOutlineOutlined";
import TimerOffOutlinedIcon from "@material-ui/icons/TimerOffOutlined";
import Start from "./modals/Start";
import { useHistory } from "react-router-dom";
import Result from "./modals/Result";

function ExamItem(props) {
  const [exam, setExam] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [modalShow, setModalShow] = useState("false");
  const dispatch = useDispatch();
  const history = useHistory();
  const now = new Date();

  useEffect(() => {
    let isMounted = true;
    let url = `http://localhost:3001/exam/${props.examId}`;

    fetch(url)
      .then((res) => res.json())
      .then((result) => {
        if (isMounted) {
          setLoading(false);
          setError(null);
          setExam(result);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setLoading(false);
          setExam("");
          setError(error.toString());
        }
      });
    return () => {
      isMounted = false;
    };
  }, [dispatch, props.examId]);

  useEffect(() => {
    if (exam) {
      fetch(`http://localhost:3001/result?examId=${props.examId}`)
        .then((res) => res.json())
        .then((result) => {
          setScore(result[0] ? result[0].score : "");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [exam, props.examId]);

  useEffect(() => {
    if (exam) {
      const timeOpen = new Date(exam.timeOpen);
      setTimeEnd(
        timeOpen.setMinutes(timeOpen.getMinutes() + parseInt(exam.timeDoing))
      );
    }
  }, [exam]);

  const closeModal = () => {
    setModalShow(false);
  };

  const openModal = (value) => {
    setModalShow(value);
  };

  return (
    <div className="ExamItem">
      {modalShow === "start" ? (
        <Start close={closeModal} exam={exam} />
      ) : modalShow === "result" ? (
        <Result close={closeModal} exam={exam} />
      ) : (
        ""
      )}
      {error ? (
        <div className="error">{error}</div>
      ) : loading || !exam ? (
        <CircularProgress className="loadingCircle" size={20} />
      ) : (
        <React.Fragment>
          <div className="head">
            <div className="head__left">{`Bài kiểm tra số ${exam.id}`}</div>
            <div className="head__right">
              {`${new Date(exam.timeOpen).toLocaleDateString()} - ${new Date(
                exam.timeOpen
              ).toLocaleTimeString([], {
                timeStyle: "short",
              })}`}
            </div>
          </div>
          <div className="body">
            <div className="body__left">
              {`Thời gian làm bài: ${exam.timeDoing} phút - Số câu hỏi: ${exam.questions.length}`}
            </div>
            <div className="body__right">
              {exam.status === "closed" ? (
                <button
                  className="body__right-score"
                  onClick={() => openModal("result")}
                >
                  <InfoOutlinedIcon />
                  <span>{`Điểm: ${score}`}</span>
                </button>
              ) : now > timeEnd ? (
                score ? (
                  <button
                    className="body__right-score"
                    onClick={() => openModal("result")}
                  >
                    <InfoOutlinedIcon />
                    <span>{`Điểm: ${score}/10`}</span>
                  </button>
                ) : (
                  <button className="body__right-timeout">
                    <TimerOffOutlinedIcon />
                    <span>Quá hạn làm</span>
                  </button>
                )
              ) : score ? (
                <button
                  className="body__right-start"
                  onClick={() => {
                    history.push(`/exam/${exam.id}`);
                  }}
                >
                  <PlayCircleOutlineOutlinedIcon />
                  <span>Làm tiếp</span>
                </button>
              ) : (
                <button
                  className="body__right-start"
                  onClick={() => openModal("start")}
                >
                  <PlayCircleOutlineOutlinedIcon />
                  <span>Bắt đầu</span>
                </button>
              )}
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default ExamItem;
