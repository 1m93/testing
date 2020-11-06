import { LinearProgress } from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchExams } from "../action/class";
import ExamItem from "../components/ExamItem";
import Footer from "../components/Footer";
import Header from "../components/Header";

function Class() {
	const loading = useSelector((state) => state.class.loading);
	const error = useSelector((state) => state.class.error);
	const exams = useSelector((state) => state.class.exams);
	const classId = useParams().classId;
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchExams(classId));
	}, [dispatch, classId]);

	if (error) return <div className="error">{error}</div>;
	else if (loading || !exams) return <LinearProgress className="loadingbar" />;
	else
		return (
			<div className="Class">
				<Header />
				<main className="container">
					<div className="title">Danh sách bài kiểm tra</div>
                    <div className="content">
                        {exams.map((value) => (
                            <ExamItem examId={value.id} key={value.id} />
                        ))}
                    </div>
				</main>
				<Footer />
			</div>
		);
}

export default Class;
