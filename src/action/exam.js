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
