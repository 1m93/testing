import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { firstSubmitExam, setAnswers, setResult } from "../action/exam";
import ExamSidebar from "./ExamSidebar";
import Question from "./Question";
import FlagIcon from "@material-ui/icons/Flag";
import FlagOutlinedIcon from "@material-ui/icons/FlagOutlined";
import PublishIcon from "@material-ui/icons/Publish";

function ExamOpen(props) {
  const result = useSelector((state) => state.exam.result);
  const userinfo = useSelector((state) => state.auth.userinfo);
  const answers = useSelector((state) => state.exam.answers);
  const exam = useSelector((state) => state.exam.exam);
  const [flags, setFlags] = useState([]);
  const [index, setIndex] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!result) {
      dispatch(firstSubmitExam(props.examId, userinfo.id));
    }
  }, [dispatch, props.examId, userinfo.id, result]);

  //auto submit
  useEffect(() => {
    if (exam && exam.status !== "closed") {
      const timer = setInterval(() => {
        const correctTotal = correctCount();
        const score = ((correctTotal / exam.questions.length) * 10).toFixed(2);
        let url = `http://localhost:3001/result/${result.id}`;
        const timeSubmit = new Date();

        if (window.navigator.onLine) {
          fetch(url, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              answers: answers,
              score: score,
              count: correctTotal,
              timeSubmit: timeSubmit.toLocaleString(),
            }),
          })
            .then((res) => res.json())
            .then((result) => dispatch(setResult(result)))
            .catch((error) => {
              console.log(error.toString());
            });
        }
      }, 3000);
      return () => clearInterval(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam, result, answers]);

  //check cheat
  // useEffect(() => {
  //   let timeOnScreen = 10;
  //   const timer = setInterval(() => {
  //     if (document.hasFocus()) {
  //       timeOnScreen = 10;
  //     } else {
  //       if (timeOnScreen > 0) {
  //         timeOnScreen--;
  //       } else {
  //         timeOnScreen = 0;
  //       }
  //     }
  //     if (timeOnScreen === 0) {
  //       handleSubmit();
  //     }
  //   }, 1000);
  //   return () => {
  //     clearInterval(timer);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [answers]);

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
    dispatch(setAnswers(value));
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

  const checkAnswers = (corrects, answers) => {
    for (let i = 0; i < answers.length; i++) {
      if (!corrects.includes(answers[i])) {
        return false;
      }
    }
    return true;
  };

  const correctCount = () => {
    let correct = 0;
    correct = Object.keys(answers).reduce((res, key) => {
      const question = exam.questions.find((x) => x.id === parseInt(key));
      if (question) {
        const isCorrect = checkAnswers(question.correct, answers[key]);
        if (isCorrect) res = res + 1;
      }
      return res;
    }, 0);
    return correct;
  };

  const confirmSubmit = () => {
    let result = window.confirm("Xác nhận nộp bài?");
    if (result) {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const correctTotal = correctCount();
    console.log("count: " + correctTotal);
    const score = ((correctTotal / exam.questions.length) * 10).toFixed(2);
    props.setModalShow({
      score: score,
      count: correctTotal,
    });
  };

  return (
    <React.Fragment>
      <button className="submitExam" onClick={() => confirmSubmit()}>
        <PublishIcon /> Nộp bài
      </button>
      <div className="left">
        <ExamSidebar
          time={props.timer}
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
    </React.Fragment>
  );
}

export default ExamOpen;
