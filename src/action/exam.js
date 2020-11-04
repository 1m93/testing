export const fetchExam = (examId) => {
	return (dispatch) => {
		dispatch(fetchExamBegin());
		let url = `http://localhost:3001/exam/${examId}`;

		fetch(url)
			.then((res) => res.json())
			.then((result) => {
				dispatch(fetchExamSuccess(result));
			})
			.catch((error) => {
				dispatch(fetchExamFailure(error.toString()));
			});
	};
};

export const submitExam = (answers, examId, score, count) => {
	return (dispatch) => {
		dispatch(submitExamBegin());
		let url = `http://localhost:3001/result`;

		fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ answers: answers, examId: examId, score: score, count: count }),
		})
			.then((res) => res.json())
			.then(() => {
				dispatch(submitExamSuccess(score, count))
			})
			.catch((error) => {
				dispatch(submitExamFailure(error.toString()))
			})
	}
}

export const fetchExamBegin = () => {
	return {
		type: "FETCH_EXAM_BEGIN",
	};
};

export const fetchExamSuccess = (value) => {
	return {
		type: "FETCH_EXAM_SUCCESS",
		payload: value,
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
	}
}

export const submitExamSuccess = (score, count) => {
	return {
		type: "SUBMIT_EXAM_SUCCESS",
		score: score,
		count: count,
	}
}

export const submitExamFailure = (value) => {
	return {
		type: "SUBMIT_EXAM_FAILURE",
		payload: value, 
	}
}
