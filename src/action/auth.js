const proxy = "https://cors-anywhere.herokuapp.com/";

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
    fetch(proxy + "http://apig8.toedu.me/api/Integrations/login",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify(user),
			}
		)
			.then((res) => res.json())
			.then((data) => {
				if (data.authorization) {
          localStorage.setItem("token", data.authorization);
          localStorage.setItem("user_id", data.userId);
					dispatch(loginUserSuccess(data.authorization, data.userId));
					window.location.reload();
				} else {
					dispatch(loginUserSuccess(""));
					alert("Thông tin đăng nhập không chính xác");
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
    const id = localStorage.getItem("user_id");
    if (token && id) {
      fetch(proxy + `http://apig8.toedu.me/api/Users/${id}`)
				.then((res) => res.json())
				.then((result) => {
					dispatch(getUserInfo(result.data));
				})
				.catch((error) => {
					console.log(error.toString());
				});
    }
  };
};

export const logOut = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user_id");
  return {
    type: "LOG_OUT",
  };
};

export const loginUserBegin = () => {
  return {
    type: "LOGIN_USER_BEGIN",
  };
};

export const loginUserSuccess = (token, id) => {
  return {
    type: "LOGIN_USER_SUCCESS",
    token: token,
    id: id,
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
