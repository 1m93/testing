import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logOut } from "../action/auth";
import MyLink from "./MyLink";

function Header() {
	const userinfo = useSelector((state) => state.auth.userinfo);
	const dispatch = useDispatch();

	const handleSignOut = () => {
		dispatch(logOut());
	};

	return (
		<header>
			<nav className="navbar">
				<div className="navbar__left">
					<Link to="/">
						<img
							className="navbar__left-logo"
							src="http://localhost:3001/uet.png"
							alt="uetlogo"
						/>
					</Link>
					<div className="navbar__left-links">
						<MyLink to="/">Trang chủ</MyLink>
						<MyLink to="/item1">Item 1</MyLink>
						<MyLink to="/item2">Item 3</MyLink>
						<MyLink to="/item3">Item 2</MyLink>
					</div>
				</div>
				<div className="navbar__right">
					<div to="#" className="navbar__right-profile">
						<div className="navbar__right-profile-button">
							<img
								src="http://localhost:3001/avatar/default.png"
								alt="avatar"
							/>
							<Link to="#">{userinfo.code}</Link>
						</div>
						<div className="navbar__right-profile-list">
							<Link to="/item1">Item 1</Link>
							<Link to="/item2">Item 2</Link>
							<Link to="/item3">Item3</Link>
							<Link to="#" onClick={() => handleSignOut()}>
								Đăng xuất
							</Link>
						</div>
					</div>
				</div>
			</nav>
		</header>
	);
}

export default Header;
