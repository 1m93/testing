import React, { useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import { Link } from "react-router-dom";
import FormTextInput from "../components/FormTextInput";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import { logIn } from "../action/auth";

function Login() {
	const [user, setUser] = useState({
		email: "",
		password: "",
	});
	const logInLoading = useSelector((state) => state.auth.loading);
	const logInError = useSelector((state) => state.auth.error);
	const dispatch = useDispatch();

	const handleInput = (input) => {
		setUser({
			...user,
			[input.target.name]: input.target.value,
		});
	};

	const handleLogin = () => {
		dispatch(logIn(user));
	};

	return (
		<div className="Login">
			<form className="form">
				<div className="form__logo">
					<img src="http://localhost:3001/uet.png" alt="logo" />
				</div>
				<p className="form__title">Đăng nhập</p>
				<FormTextInput
					type="email"
					placeholder="VNUmail"
					name="email"
					value={user.email}
					handleChange={handleInput}
				/>
				<FormTextInput
					type="password"
					placeholder="Mật khẩu"
					name="password"
					value={user.password}
					handleChange={handleInput}
				/>
				<div className="form__option">
					<div className="form__option-remember">
						<Checkbox color="default" />
						<label>Nhớ tài khoản</label>
					</div>
					<div className="form__option-forgot">
						<Link to="/forgotpassword">Quên mật khẩu?</Link>
					</div>
				</div>
				{logInLoading ? (
					<Link to="#" className="form__button">
						<CircularProgress className="loadingCircle" size={12} />
					</Link>
				) : user.email && user.password ? (
					<Link
						to="#"
						className="form__button form__button--active"
						onClick={(e) => {
							e.preventDefault();
							handleLogin();
						}}
					>
						{logInError ? "Thử lại" : "Đăng nhập"}
					</Link>
				) : (
					<Link to="#" className="form__button">
						Đăng nhập
					</Link>
				)}
			</form>
		</div>
	);
}

export default Login;
