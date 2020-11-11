export const fetchExam = (examId, userId) => {
	return (dispatch) => {
		dispatch(fetchExamBegin());
		let url = `http://localhost:3001/exam/${examId}`;

		Promise.all([
			fetch(url).then((res) => res.json()),
			fetch(
				`http://localhost:3001/result?examId=${examId}&userId=${userId}`
			).then((res) => res.json()),
		])
			.then((results) => {
				dispatch(fetchExamSuccess(results[0]));
				dispatch(setResult(results[1][0]));
				dispatch(setAnswers(results[1][0] ? results[1][0].answers : {}));
			})
			.catch((error) => {
				dispatch(fetchExamFailure(error.toString()));
			});
	};
};

export const firstSubmitExam = (examId, userId) => {
	return (dispatch) => {
		let url = `http://localhost:3001/result`;
		const timeSubmit = new Date();

		fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				answers: {},
				examId: examId,
				userId: userId,
				score: "",
				count: "",
				timeSubmit: timeSubmit.toLocaleString(),
			}),
		})
			.then((res) => res.json())
			.then((res) => {
				dispatch(setResult(res));
			})
			.catch((error) => {
				console.log(error.toString());
			});
	};
};

export const submitExam = (answers, examId, userId, score, count, result) => {
	return (dispatch) => {
		dispatch(submitExamBegin());
		let url = `http://localhost:3001/result/${result.id}`;
		const timeSubmit = new Date();

		Promise.all([
			fetch(url, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					answers: answers,
					examId: examId,
					userId: userId,
					score: score,
					count: count,
					timeSubmit: timeSubmit.toLocaleString(),
				}),
			}).then((res) => res.json()),
			fetch(`http://localhost:3001/exam/${examId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ status: "closed" }),
			}).then((res) => res.json()),
		])
			.then((results) => {
				dispatch(fetchExamSuccess(results[1]));
				dispatch(submitExamSuccess(score, count));
			})
			.catch((error) => {
				dispatch(submitExamFailure(error.toString()));
			});
	};
};

export const fetchExamBegin = () => {
	return {
		type: "FETCH_EXAM_BEGIN",
	};
};

export const fetchExamSuccess = (exam) => {
	return {
		type: "FETCH_EXAM_SUCCESS",
		exam: exam,
	};
};

export const fetchExamFailure = (value) => {
	return {
		type: "FETCH_EXAM_FAILURE",
		payload: value,
	};
};

export const submitExamBegin = () => {
	return {
		type: "SUBMIT_EXAM_BEGIN",
	};
};

export const submitExamSuccess = (score, count) => {
	return {
		type: "SUBMIT_EXAM_SUCCESS",
		score: score,
		count: count,
	};
};

export const submitExamFailure = (value) => {
	return {
		type: "SUBMIT_EXAM_FAILURE",
		payload: value,
	};
};

export const setResult = (value) => {
	return {
		type: "SET_RESULT",
		payload: value,
	};
};

export const setAnswers = (value) => {
	return {
		type: "SET_ANSWERS",
		payload: value,
	};
};
