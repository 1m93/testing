import { CircularProgress } from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CheckCircleOutlinedIcon from "@material-ui/icons/CheckCircleOutlined";
import SentimentDissatisfiedOutlinedIcon from "@material-ui/icons/SentimentDissatisfiedOutlined";
import { submitExam } from "../action/exam";
import { Link } from "react-router-dom";

function Examsubmit(props) {
  const score = useSelector((state) => state.exam.score);
  const submitLoading = useSelector((state) => state.exam.submitLoading);
  const submitError = useSelector((state) => state.exam.submitError);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(submitExam(props.answers, props.examId, props.score, props.count));
  }, [dispatch, props.answers, props.examId, props.score, props.count]);

  return (
    <div className="Examsubmit">
      <div className="wrapper">
        {submitError ? (
          <div className="content content--error">
            <SentimentDissatisfiedOutlinedIcon size={100} />
            <div className="content--error-text">{submitError}</div>
            <button
              className="content--error-btn"
              onClick={() => {
                dispatch(
                  submitExam(
                    props.answers,
                    props.examId,
                    props.score,
                    props.count
                  )
                );
              }}
            >
              Thử lại
            </button>
          </div>
        ) : submitLoading ? (
          <div className="content content--loading">
            <CircularProgress size={100} />
            <div className="content--loading-text">Đang nộp bài</div>
          </div>
        ) : (
          <div className="content">
            <div className="content__text">
              <CheckCircleOutlinedIcon />
              <p>Nộp bài hoàn tất! Điểm:</p>
            </div>
            <div className="content__score">
              <p>{score}</p>
              <span>/10</span>
            </div>
            <Link to="/" className="content__back">
              Về trang chủ
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Examsubmit;
