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
import ExamWait from "../components/ExamWait";
import { fetchTime } from "../action/time";

function Exam() {
	const examId = useParams().examId;
	const timeToDo = sessionStorage.getItem(useParams().contestId);
	const examLoading = useSelector((state) => state.exam.examLoading);
	const examError = useSelector((state) => state.exam.examError);
	const exam = useSelector((state) => state.exam.exam);
	const result = useSelector((state) => state.exam.result);
	const userinfo = useSelector((state) => state.auth.userinfo);
	const answers = useSelector((state) => state.exam.answers);
	const timeLoading = useSelector((state) => state.time.timeLoading);
	const timeError = useSelector((state) => state.time.timeError);
	const now = useSelector((state) => new Date(state.time.time));
	const [timer, setTimer] = useState("");
	const [modalShow, setModalShow] = useState("");
	const dispatch = useDispatch();
	const history = useHistory();

	// useEffect(() => {
	// 	dispatch(fetchTime());
	// }, [dispatch]);

	useEffect(() => {
		dispatch(fetchExam(examId, userinfo.userID));
	}, [dispatch, examId, userinfo]);

	useEffect(() => {
		if (exam) {
			const open = new Date(exam.createdDate);
			const modified = new Date(exam.modifiedDate);
			const timeSpent = Math.abs(modified - open) / 1000;
			setTimer(
				timeSpent >= timeToDo
					? "timeout"
					: Math.abs(timeToDo - timeSpent) / 1000
			);
		}
	}, [exam, timeToDo]);

	console.log(timer);

	if (examError || !now) {
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
						{exam.status === 1 || modalShow ? (
							<div className="container__alert">
								<div className="container__alert-icon container__alert-icon--done">
									<CheckCircleOutlineOutlinedIcon />
								</div>
								<p>Bài thi đã được nộp</p>
								<button onClick={() => history.goBack()}>Quay lại</button>
							</div>
						) : timer === "timeout" ? (
							<div className="container__alert">
								<div className="container__alert-icon container__alert-icon--timeout">
									<TimerOffOutlinedIcon />
								</div>
								<p>Quá hạn làm bài</p>
								<button onClick={() => history.goBack()}>Quay lại</button>
							</div>
						) : exam.createdDate && timer ? (
							<ExamOpen
								examId={examId}
								timer={timer}
								setModalShow={setModalShow}
							/>
						) : (
							<ExamWait exam={exam} />
						)}
					</React.Fragment>
				</main>
				<Footer />
			</div>
		);
	}
}

export default Exam;
