import React, { useEffect } from "react";
import "./sass/style.sass";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Exam from "./pages/Exam";
import Login from "./pages/Login";
import { useDispatch, useSelector } from "react-redux";
import { authorize } from "./action/auth";
import Homepage from "./pages/Homepage";
import Class from "./pages/Class";
import LostConnection from "./components/LostConnection";

function App() {
	const dispatch = useDispatch();
	const userinfo = useSelector((state) => state.auth.userinfo);
	useEffect(() => {
		dispatch(authorize());
	}, [dispatch]);

	return (
		<Router>
			<LostConnection />
			<ScrollToTop />
			<div className="App">
				{userinfo ? (
					<Switch>
						<Route exact path="/">
							<Homepage />
						</Route>
						<Route exact path="/exam/:examId">
							<Exam />
						</Route>
						<Route exact path="/class/:classId">
							<Class />
						</Route>
					</Switch>
				) : (
					<Login />
				)}
			</div>
		</Router>
	);
}

export default App;
