import { LinearProgress } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestions } from "../action/exam";
import ExamSidebar from "../components/ExamSidebar";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Question from "../components/Question";
import FlagIcon from "@material-ui/icons/Flag";
import FlagOutlinedIcon from "@material-ui/icons/FlagOutlined";
import PublishIcon from "@material-ui/icons/Publish";

function Exam() {
	const questionsLoading = useSelector((state) => state.exam.questionsLoading);
	const questionsError = useSelector((state) => state.exam.questionsError);
	const questions = useSelector((state) => state.exam.questions);
	const [answers, setAnswers] = useState({});
	const [flags, setFlags] = useState([]);
	const [index, setIndex] = useState(0);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchQuestions());
	}, [dispatch]);

	// useEffect(() => {
	// 	let timeOnScreen = 20;
	// 	const timer = setInterval(() => {
	// 		if (document.hasFocus()) {
	// 			timeOnScreen = 20;
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
	// 	};
	// }, []);

	const prevQues = () => {
		setIndex(index > 0 ? index - 1 : questions.length - 1);
	};

	const nextQues = () => {
		setIndex(index < questions.length - 1 ? index + 1 : 0);
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
		alert("submitting...")
	}

	if (questionsError) {
		return <div className="error">{questionsError}</div>;
	} else if (questionsLoading) {
		return <LinearProgress className="loadingbar" />;
	} else {
		return (
			<div className="Exam">
				<button className="submitExam" onClick={() => handleSubmit()}>
					<PublishIcon /> Nộp bài
				</button>
				<Header />
				<main className="container">
					<div className="left">
						<ExamSidebar
							time={300}
							questions={questions}
							answers={answers}
							flags={flags}
							handleClickQuestion={handleClickQuestion}
							questionId={questions[index] ? questions[index].id : ""}
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
									handleFlag(questions[index].id);
								}}
							>
								{questions[index] && flags.includes(questions[index].id) ? (
									<FlagIcon />
								) : (
									<FlagOutlinedIcon />
								)}
							</button>
						</div>
						<div className="right__question">
							{questions[index] ? (
								<Question
									question={questions[index]}
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
