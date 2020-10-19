export const fetchQuestions = () => {
	return (dispatch) => {
		dispatch(fetchQuestionsBegin());
		let url = `http://localhost:3001/questions`;

		fetch(url)
			.then((res) => res.json())
			.then((result) => {
				dispatch(fetchQuestionsSuccess(result));
			})
			.catch((error) => {
				dispatch(fetchQuestionsFailure(error.toString()));
			});
	};
};

export const fetchQuestionsBegin = () => {
	return {
		type: "FETCH_QUESTIONS_BEGIN",
	};
};

export const fetchQuestionsSuccess = (value) => {
	return {
		type: "FETCH_QUESTIONS_SUCCESS",
		payload: value,
	};
};

export const fetchQuestionsFailure = (value) => {
	return {
		type: "FETCH_QUESTIONS_FAILURE",
		payload: value,
	};
};
