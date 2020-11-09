import { LinearProgress } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Modal from "../Modal";

function Result(props) {
	const userinfo = useSelector((state) => state.auth.userinfo);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [result, setResult] = useState("");

	const tags = "ABCDEFGHIJKLMNOPQKSTUVWXYZ";

	useEffect(() => {
		setLoading(true);
		fetch(
			`http://localhost:3001/result?examId=${props.exam.id}&userId=${userinfo.id}`
		)
			.then((res) => res.json())
			.then((res) => {
				setLoading(false);
				setResult(res);
				setError(null);
			})
			.catch((error) => {
				setLoading(false);
				setResult("");
				setError(error.toString());
			});
	}, [props.exam.id, userinfo.id]);

	return (
		<Modal close={props.close} title="Xem kết quả">
			<div className="resultModal">
				{error ? (
					<div className="error">{error}</div>
				) : loading || !result ? (
					<LinearProgress className="loadingbar" />
				) : (
					<React.Fragment>
						<div className="resultModal__head">
							<div className="resultModal__head-score">
								{`Điểm: ${result[0].score}`}
							</div>
							<div className="resultModal__head-score">
								{`Thời điểm nộp bài: ${result[0].timeSubmit}`}
							</div>
						</div>
						<div className="resultModal__body">
							<div className="resultModal__body-title">
								Danh sách câu trả lời
							</div>
							<div className="questionsList">
								{props.exam.questions.map((value, key) => (
									<div className="questionsList__item" key={value.id}>
										<div className="questionsList__item-title">{`Câu ${
											key + 1
										}. ${value.title}`}</div>
										<div className="questionsList__item-answers">
											{value.answer.map((value) => (
												<div
													className="questions__item-answers-item"
													key={value.id}
												>
													{`${tags[value.id - 1]}. ${value.content}`}
												</div>
											))}
										</div>
									</div>
								))}
							</div>
						</div>
					</React.Fragment>
				)}
			</div>
		</Modal>
	);
}

export default Result;
