const initialState = {
	examLoading: false,
	examError: null,
	exam: "",
};

const examReducer = (state = initialState, action) => {
	switch (action.type) {
		case "FETCH_EXAM_BEGIN": {
			return {
				...state,
				examLoading: true,
				examError: null,
			};
		}
		case "FETCH_EXAM_SUCCESS": {
			return {
				...state,
				examLoading: false,
				examError: null,
				exam: action.payload,
			};
		}
		case "FETCH_EXAM_FAILURE": {
			return {
				...state,
				examLoading: false,
				exam: "",
				examError: action.payload,
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
