import { LinearProgress } from "@material-ui/core";
import { SearchOutlined } from "@material-ui/icons";
import { Pagination } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchExams } from "../action/class";
import { fetchClasses } from "../action/home";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ExamItem from "../components/ExamItem";

function Homepage() {
	const loading = useSelector((state) => state.home.loading);
	const error = useSelector((state) => state.home.error);
	const classes = useSelector((state) => state.home.classes);
	const numOfPages = useSelector((state) => state.home.numOfPages);
	const examLoading = useSelector((state) => state.class.loading);
	const examError = useSelector((state) => state.class.error);
	const exams = useSelector((state) => state.class.exams);
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const userinfo = useSelector((state) => state.auth.userinfo);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchClasses(userinfo.classes, search, page));
	}, [dispatch, userinfo.classes, search, page]);

	useEffect(() => {
		dispatch(fetchExams(userinfo.classes, 4));
	}, [dispatch, userinfo]);

	const handlePageChange = (value) => {
		setPage(value);
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<div className="Homepage">
			<Header />
			<main className="container">
				<div className="classes">
					<div className="menu">
						<div className="menu__left">Lớp học của bạn</div>
						<div className="menu__right">
							<input
								className="menu__right-input"
								placeholder="Tìm lớp học"
								value={search}
								onChange={(value) => {
									setSearch(value.target.value);
								}}
							/>
							<div className="menu__right-icon">
								<SearchOutlined />
							</div>
						</div>
					</div>
					<div className="content">
						{error ? (
							<div className="error">{error}</div>
						) : loading || !classes ? (
							<LinearProgress className="loadingbar" />
						) : classes.length === 0 ? (
							<div className="content__error">Không có kết quả tìm kiếm</div>
						) : (
							<div className="content__wrapper">
								<div className="content__list">
									{classes.map((value) => (
										<Link
											to={`/class/${value.id}`}
											className="content__list-item"
											key={value.id}
										>
											<div
												className="content__list-item-image"
												style={{
													background: `url(http://localhost:3001/bg/${
														value.id % 4
													}.jpg) no-repeat center`,
												}}
											></div>
											<div className="content__list-item-semester">
												{value.semester}
											</div>
											<div className="content__list-item-name">
												{value.name}
											</div>
											<button>Truy cập</button>
										</Link>
									))}
								</div>
								<Pagination
									className="pagination"
									count={parseInt(numOfPages)}
									color="primary"
									defaultPage={page}
									shape="rounded"
									onChange={(event, value) => handlePageChange(value)}
								/>
							</div>
						)}
					</div>
				</div>

				<div className="exams">
					<div className="title">Bài kiểm tra gần đây</div>
					{examError ? (
						<div className="error">{error}</div>
					) : examLoading || !exams ? (
						<LinearProgress className="loadingbar" />
					) : exams.length === 0 ? (
						<div className="content__error">Không có bài kiểm tra gần đây</div>
					) : (
						<div className="content">
							{exams.map((value) => (
								<ExamItem examId={value.id} key={value.id} />
							))}
						</div>
					)}
				</div>
			</main>
			<Footer />
		</div>
	);
}

export default Homepage;
