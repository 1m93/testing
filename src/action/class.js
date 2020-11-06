export const fetchExams = (classId, limit) => {
    return (dispatch) => {
        dispatch(fetchExamsBegin())
        let url = `http://localhost:3001/exam?_sort=id&_order=desc`;

        for (let i = 0; i < classId.length; i++) {
            url += `&classID=${classId[i]}`
        }

        if (limit) {
            url += `&_limit=${limit}`
        }

        fetch(url)
            .then((res) => res.json())
            .then((res) => {
                dispatch(fetchExmasSuccess(res))
            })
            .catch((error) => {
                dispatch(fetchExmasFailure(error.toString()))
            })
    }
}

export const fetchExamsBegin = () => {
	return {
		type: "FETCH_EXAMS_BEGIN",
	};
};

export const fetchExmasSuccess = (value) => {
	return {
		type: "FETCH_EXAMS_SUCCESS",
		payload: value,
	};
};

export const fetchExmasFailure = (value) => {
	return {
		type: "FETCH_EXAMS_FAILURE",
		payload: value,
	};
};
