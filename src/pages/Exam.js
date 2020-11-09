import { LinearProgress } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExam, firstSubmitExam, setAnswers } from "../action/exam";
import ExamSidebar from "../components/ExamSidebar";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Question from "../components/Question";
import FlagIcon from "@material-ui/icons/Flag";
import FlagOutlinedIcon from "@material-ui/icons/FlagOutlined";
import PublishIcon from "@material-ui/icons/Publish";
import { useParams } from "react-router-dom";
import Examsubmit from "../components/Examsubmit";

function Exam() {
	const examId = useParams().examId;
	const examLoading = useSelector((state) => state.exam.examLoading);
	const examError = useSelector((state) => state.exam.examError);
	const exam = useSelector((state) => state.exam.exam);
	const result = useSelector((state) => state.exam.result);
	const userinfo = useSelector((state) => state.auth.userinfo);
	const answers = useSelector((state) => state.exam.answers);
	const [timer, setTimer] = useState("");
	const [flags, setFlags] = useState([]);
	const [index, setIndex] = useState(0);
	const [modalShow, setModalShow] = useState("");
	const [timeDist, setTimeDist] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchExam(examId, userinfo.id));
	}, [dispatch, examId, userinfo]);

	useEffect(() => {
		if (!result) {
			dispatch(firstSubmitExam(examId, userinfo.id));
		}
	}, [dispatch, examId, userinfo.id, result]);

	//auto submit
	useEffect(() => {
		if (exam && exam.status !== "closed" && !timeDist) {
			const timer = setInterval(() => {
				const correctTotal = correctCount();
				const score = ((correctTotal / exam.questions.length) * 10).toFixed(2);
				let url = `http://localhost:3001/result/${result.id}`;
				const timeSubmit = new Date();

				fetch(url, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						answers: answers,
						examId: examId,
						userId: userinfo.id,
						score: score,
						count: correctTotal,
						timeSubmit: timeSubmit.toLocaleString(),
					}),
				})
					.then((res) => res.json())
					.catch((error) => {
						console.log(error.toString());
					});
			}, 3000);
			return () => clearInterval(timer);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [exam, result, answers]);

	useEffect(() => {
		const open = new Date(exam.timeOpen);
		const close = open.setMinutes(open.getMinutes() + parseInt(exam.timeDoing));
		const now = new Date();
		if (now >= close) setTimeDist(true)
		setTimer(Math.abs(close - now) / 1000);
	}, [exam.timeOpen, exam.timeDoing]);

	useEffect(() => {
		let timeOnScreen = 10;
		const timer = setInterval(() => {
			if (document.hasFocus()) {
				timeOnScreen = 10;
			} else {
				if (timeOnScreen > 0) {
					timeOnScreen--;
				} else {
					timeOnScreen = 0;
				}
			}
			if (timeOnScreen === 0) handleSubmit();
		}, 1000);
		return () => {
			clearInterval(timer);
	  };
	  // eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
		for (const [key, value] of Object.entries(answers)) {
			const rightAnswers = exam.questions.find((x) => x.id === parseInt(key))
				.correct;
			if (checkAnswers(rightAnswers, value)) {
				correct++;
			}
		}
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
		const score = ((correctTotal / exam.questions.length) * 10).toFixed(2);
		setModalShow({
			score: score,
			count: correctTotal,
		});
	};

	if (examError) {
		return <div className="error">{examError}</div>;
	} else if (examLoading || !exam || !timer) {
		return <LinearProgress className="loadingbar" />;
	} else {
		return (
			<div className="Exam">
				<button className="submitExam" onClick={() => confirmSubmit()}>
					<PublishIcon /> Nộp bài
				</button>
				<Header />
				<main className="container">
					{ timeDist ? (
						<div>Hết giờ làm bài</div>
					) : exam.status === "closed" && !modalShow ? (
						<div>Bài thi đã được nộp</div>
					) : (
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
							<div className="left">
								<ExamSidebar
									time={timer}
									questions={exam.questions}
									answers={answers}
									flags={flags}
									handleClickQuestion={handleClickQuestion}
									questionId={
										exam.questions[index] ? exam.questions[index].id : ""
									}
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
					)}
				</main>
				<Footer />
			</div>
		);
	}
}

export default Exam;
