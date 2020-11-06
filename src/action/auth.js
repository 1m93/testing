export const signUp = (user) => {
	return (dispatch) => {
		dispatch(loginUserBegin());
		fetch("http://localhost:3001/users", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify(user),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.accessToken) {
					localStorage.setItem("token", data.accessToken);
					dispatch(loginUserSuccess(data.accessToken));
					window.location.href = "/";
				} else {
					dispatch(loginUserSuccess(""));
					alert(data);
				}
			})
			.catch((error) => {
				dispatch(loginUserFailure(error.toString()));
			});
	};
};

export const logIn = (user) => {
	return (dispatch) => {
		dispatch(loginUserBegin());
		fetch("http://localhost:3001/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify(user),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.accessToken) {
					localStorage.setItem("token", data.accessToken);
					dispatch(loginUserSuccess(data.accessToken));
					window.location.href = "/";
				} else {
					dispatch(loginUserSuccess(""));
					alert(data);
				}
			})
			.catch((error) => {
				dispatch(loginUserFailure(error.toString()));
			});
	};
};

export const authorize = () => {
	return (dispatch) => {
		const token = localStorage.getItem("token");
		if (token) {
			const id = parseJWT(token).sub;
			fetch(`http://localhost:3001/users/${id}`)
				.then((res) => res.json())
				.then((result) => {
					dispatch(getUserInfo(result));
				})
				.catch((error) => {
					console.log(error.toString());
				});
		}
	};
};

export const parseJWT = (token) => {
	const base64Url = token.split(".")[1];
	const base64 = decodeURIComponent(
		atob(base64Url)
			.split("")
			.map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
			.join("")
	);
	return JSON.parse(base64);
};

export const logOut = () => {
	localStorage.removeItem("token");
	window.location.href = "/";
	return {
		type: "LOG_OUT",
	};
};

export const loginUserBegin = () => {
	return {
		type: "LOGIN_USER_BEGIN",
	};
};

export const loginUserSuccess = (value) => {
	return {
		type: "LOGIN_USER_SUCCESS",
		payload: value,
	};
};

export const loginUserFailure = (value) => {
	return {
		type: "LOGIN_USER_FAILURE",
		payload: value,
	};
};

export const getUserInfo = (value) => {
	return {
		type: "GET_USER_INFO",
		payload: value,
	};
};
