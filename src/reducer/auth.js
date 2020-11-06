const initialState = {
	loading: false,
	error: null,
	token: "",
	userinfo: "",
};

const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case "LOGIN_USER_BEGIN": {
			return {
				...state,
				loading: true,
				error: null,
			};
		}
		case "LOGIN_USER_SUCCESS": {
			return {
				...state,
				token: action.payload,
				loading: false,
			};
		}
		case "LOGIN_USER_FAILURE": {
			return {
				...state,
				loading: false,
				error: action.payload,
				token: "",
			};
		}
		case "GET_USER_INFO": {
			return {
				...state,
				userinfo: action.payload,
			};
		}
		case "LOG_OUT": {
			return {
				...state,
				token: "",
				userinfo: "",
			};
		}
		default: {
			return {
				...state,
			};
		}
	}
};

export default authReducer;
