export const fetchClasses = (classIDs, search, page) => {
	return (dispatch) => {
		dispatch(fetchClassesBegin());
		let url = `http://localhost:3001/classes?_page=${page}&_limit=4`;

		for (let i = 0; i < classIDs.length; i++) {
			url += `&id=${classIDs[i]}`;
		}

		if (search) {
			url += `&q=${search}`;
		}

		let urlForPages = url.replace(`_page=${page}&_limit=4`, "");

		Promise.all([
			fetch(url).then((res) => res.json()),
			fetch(urlForPages).then((res) => res.json()),
		])
			.then((allResults) => {
				dispatch(
					fetchClassesSuccess(
						allResults[0],
						Math.ceil(allResults[1].length / 4)
					)
				);
			})
			.catch((error) => {
				dispatch(fetchClassesFailure(error.toString()));
			});
	};
};

export const fetchClassesBegin = () => {
	return {
		type: "FETCH_CLASSES_BEGIN",
	};
};

export const fetchClassesSuccess = (classes, numOfPages) => {
	return {
		type: "FETCH_CLASSES_SUCCESS",
		classes: classes,
		numOfPages: numOfPages,
	};
};

export const fetchClassesFailure = (value) => {
	return {
		type: "FETCH_CLASSES_FAILURE",
		payload: value,
	};
};
