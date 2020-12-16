const proxy = "https://cors-anywhere.herokuapp.com/";

export const fetchTime = () => {
	return (dispatch) => {
		dispatch(fetchTimeBegin());
		fetch("http://worldtimeapi.org/api/ip")
			.then((res) => res.json())
			.then((res) => {
				dispatch(fetchTimeSuccess(res.datetime));
			})
			.catch((error) => {
				dispatch(fetchTimeFailure(error.toString()));
			});
	};
};

export const fetchTimeBegin = () => {
	return {
		type: "FETCH_TIME_BEGIN",
	};
};

export const fetchTimeSuccess = (value) => {
	return {
		type: "FETCH_TIME_SUCCESS",
		payload: value,
	};
};

export const fetchTimeFailure = (value) => {
	return {
		type: "FETCH_TIME_FAILURE",
		payload: value,
	};
};
