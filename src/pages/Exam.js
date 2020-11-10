import { LinearProgress } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExam } from "../action/exam";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useHistory, useParams } from "react-router-dom";
import Examsubmit from "../components/Examsubmit";
import TimerOffOutlinedIcon from "@material-ui/icons/TimerOffOutlined";
import CheckCircleOutlineOutlinedIcon from "@material-ui/icons/CheckCircleOutlineOutlined";
import ExamOpen from "../components/ExamOpen";

function Exam() {
  const examId = useParams().examId;
  const examLoading = useSelector((state) => state.exam.examLoading);
  const examError = useSelector((state) => state.exam.examError);
  const exam = useSelector((state) => state.exam.exam);
  const result = useSelector((state) => state.exam.result);
  const userinfo = useSelector((state) => state.auth.userinfo);
  const answers = useSelector((state) => state.exam.answers);
  const [timer, setTimer] = useState("");
  const [modalShow, setModalShow] = useState("");
  const [timeDist, setTimeDist] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(fetchExam(examId, userinfo.id));
  }, [dispatch, examId, userinfo]);

  useEffect(() => {
    const open = new Date(exam.timeOpen);
    const close = open.setMinutes(open.getMinutes() + parseInt(exam.timeDoing));
    const now = new Date();
    if (now >= close) setTimeDist(true);
    setTimer(Math.abs(close - now) / 1000);
  }, [exam.timeOpen, exam.timeDoing]);

  if (examError) {
    return <div className="error">{examError}</div>;
  } else if (examLoading || !exam || !timer) {
    return <LinearProgress className="loadingbar" />;
  } else {
    return (
      <div className="Exam">
        <Header />
        <main className="container">
          <React.Fragment>
            {modalShow ? (
              <Examsubmit
                answers={answers}
                examId={examId}
                userId={userinfo.id}
                score={modalShow.score}
                count={modalShow.count}
                result={result}
              />
            ) : (
              ""
            )}
            {exam.status === "closed" ? (
              <div className="container__alert">
                <div className="container__alert-icon container__alert-icon--done">
                  <CheckCircleOutlineOutlinedIcon />
                </div>
                <p>Bài thi đã được nộp</p>
                <button onClick={() => history.goBack()}>Quay lại</button>
              </div>
            ) : timeDist ? (
              <div className="container__alert">
                <div className="container__alert-icon container__alert-icon--timeout">
                  <TimerOffOutlinedIcon />
                </div>
                <p>Quá hạn làm bài</p>
                <button onClick={() => history.goBack()}>Quay lại</button>
              </div>
            ) : (
              <ExamOpen examId={examId} timer={timer} setModalShow={setModalShow}/>
            )}
          </React.Fragment>
        </main>
        <Footer />
      </div>
    );
  }
}

export default Exam;
