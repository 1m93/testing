import { combineReducers } from "redux";
import authReducer from "./auth";
import classReducer from "./class";
import examReducer from "./exam";
import homeReducer from "./home";

const rootReducer = combineReducers({
	exam: examReducer,
	auth: authReducer,
	home: homeReducer,
	class: classReducer,
});

export default rootReducer;
