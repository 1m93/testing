import React from "react";
import "./sass/style.sass";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Exam from "./pages/Exam";

function App() {
	return (
		<Router>
			<ScrollToTop />
			<div className="App">
				<Switch>
					<Route exact path="/exam/:examId">
						<Exam />
					</Route>
				</Switch>
			</div>
		</Router>
	);
}

export default App;
