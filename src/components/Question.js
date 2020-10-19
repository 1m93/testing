import React from "react";
import { Checkbox } from "@material-ui/core";

function Question(props) {
	const question = props.question;
	const tags = "ABCDEFGHIJKLMNOPQKSTUVWXYZ";

	const handleClickAnswer = (value) => {
		if (question.correct.length === 1) {
			props.handleAnswer({ ...props.answers, [question.id]: [value.id] });
		} else {
			if (props.answers[question.id]) {
				let checked = props.answers[question.id];
				if (checked.includes(value.id)) {
					checked = checked.filter((item) => {
						return item !== value.id;
					});
				} else {
					if (checked.length === question.correct.length) {
						checked.shift();
					}
					checked.push(value.id);
				}
				if (checked.length === 0) {
					let newObj = { ...props.answers };
					delete newObj[question.id];
					props.handleAnswer(newObj);
				} else {
					props.handleAnswer({ ...props.answers, [question.id]: checked });
				}
			} else {
				props.handleAnswer({ ...props.answers, [question.id]: [value.id] });
			}
		}
	};

	return (
		<div className="Question">
			<div className="title">
				{`Câu ${props.number}. `}
				<span>{question.title}</span>
			</div>
			<div className="answers">
				{question.answer.map((value) => (
					<div
						className={
							props.answers[question.id] &&
							props.answers[question.id].includes(value.id)
								? "answers__item answers__item--active"
								: "answers__item"
						}
						key={value.id}
						onClick={() => {
							handleClickAnswer(value);
						}}
					>
						{question.correct.length > 1 ? (
							<div className="answers__item-checkbox">
								<Checkbox
									size="small"
									checked={
										props.answers[question.id] &&
										props.answers[question.id].includes(value.id)
											? true
											: false
									}
								/>
							</div>
						) : (
							""
						)}
						<div className="answers__item-content">{`${tags[value.id - 1]}. ${
							value.content
						}`}</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default Question;
