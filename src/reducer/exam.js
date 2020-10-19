const initialState = {
	questionsLoading: false,
	questionsError: null,
	questions: [],
};

const examReducer = (state = initialState, action) => {
	switch (action.type) {
		case "FETCH_QUESTIONS_BEGIN": {
			return {
				...state,
				questionsLoading: true,
				questionsError: null,
			};
		}
		case "FETCH_QUESTIONS_SUCCESS": {
			return {
				...state,
				questionsLoading: false,
				questionsError: null,
				questions: action.payload,
			};
		}
		case "FETCH_QUESTIONS_FAILURE": {
			return {
				...state,
				questionsLoading: false,
				questions: [],
				questionsError: action.payload,
			};
		}
		default: {
			return {
				...state,
			};
		}
	}
};

export default examReducer;
