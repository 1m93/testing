import { LinearProgress } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExam } from "../action/exam";
import ExamSidebar from "../components/ExamSidebar";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Question from "../components/Question";
import FlagIcon from "@material-ui/icons/Flag";
import FlagOutlinedIcon from "@material-ui/icons/FlagOutlined";
import PublishIcon from "@material-ui/icons/Publish";
import { useParams } from "react-router-dom";

function Exam() {
  const examId = useParams().examId;
  const examLoading = useSelector((state) => state.exam.examLoading);
  const examError = useSelector((state) => state.exam.examError);
  const exam = useSelector((state) => state.exam.exam);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState("");
  const [flags, setFlags] = useState([]);
  const [index, setIndex] = useState(0);
  const [modalShow, setModalShow] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchExam(examId));
  }, [dispatch, examId]);

  useEffect(() => {
    const open = new Date(exam.timeOpen);
    const close = open.setMinutes(open.getMinutes() + parseInt(exam.timeDoing));
    const now = new Date();
    setTimer(Math.abs(close - now) / 1000);
  }, [exam.timeOpen, exam.timeDoing]);

  // useEffect(() => {
  // 	let timeOnScreen = 10;
  // 	const timer = setInterval(() => {
  // 		if (document.hasFocus()) {
  // 			timeOnScreen = 10;
  // 		} else {
  // 			if (timeOnScreen > 0) {
  // 				timeOnScreen--;
  // 			} else {
  // 				timeOnScreen = 0;
  // 			}
  // 		}
  // 		if (timeOnScreen === 0) handleSubmit();
  // 	}, 1000);
  // 	return () => {
  // 		clearInterval(timer);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const prevQues = () => {
    setIndex(index > 0 ? index - 1 : exam.questions.length - 1);
  };

  const nextQues = () => {
    setIndex(index < exam.questions.length - 1 ? index + 1 : 0);
  };

  const handleClickQuestion = (value) => {
    setIndex(value);
  };

  const handleAnswer = (value) => {
    setAnswers(value);
  };

  const handleFlag = (value) => {
    if (flags.includes(value)) {
      setFlags(
        flags.filter((item) => {
          return item !== value;
        })
      );
    } else {
      setFlags(flags.concat(value));
    }
  };

  const handleSubmit = () => {
    setModalShow(true);
  };

  if (examError) {
    return <div className="error">{examError}</div>;
  } else if (examLoading || !exam || !timer) {
    return <LinearProgress className="loadingbar" />;
  } else {
    return (
      <div className="Exam">
        <button className="submitExam" onClick={() => handleSubmit()}>
          <PublishIcon /> Nộp bài
        </button>
        <Header />
        <main className="container">
          {modalShow ? <div>aaaaaaaaa</div> : ""}
          <div className="left">
            <ExamSidebar
              time={10}
              questions={exam.questions}
              answers={answers}
              flags={flags}
              handleClickQuestion={handleClickQuestion}
              questionId={exam.questions[index] ? exam.questions[index].id : ""}
              handleSubmit={handleSubmit}
            />
          </div>
          <div className="right">
            <div className="right__btn">
              <div className="right__btn-control">
                <button onClick={() => prevQues()}>
                  <p>Câu hỏi trước</p>
                </button>
                <button onClick={() => nextQues()}>
                  <p>Câu hỏi kế</p>
                </button>
              </div>
              <button
                className="right__btn-flag"
                onClick={() => {
                  handleFlag(exam.questions[index].id);
                }}
              >
                {exam.questions[index] &&
                flags.includes(exam.questions[index].id) ? (
                  <FlagIcon />
                ) : (
                  <FlagOutlinedIcon />
                )}
              </button>
            </div>
            <div className="right__question">
              {exam.questions[index] ? (
                <Question
                  question={exam.questions[index]}
                  number={index + 1}
                  answers={answers}
                  handleAnswer={handleAnswer}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}

export default Exam;
