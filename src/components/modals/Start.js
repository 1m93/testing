import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Modal from "../Modal";

function Start(props) {
    const [time, setTime] = useState("");
    const history = useHistory();

	useEffect(() => {
		const open = new Date(props.exam.timeOpen);
		const now = new Date();
		if (now < open) {
			setTime(Math.abs(open - now) / 1000);
		}
	}, [props.exam.timeOpen]);

	useEffect(() => {
		const timer = setInterval(() => {
			setTime((prevTime) => (prevTime <= 0 ? 0 : prevTime - 1));
		}, 1000);
		return () => {
			clearInterval(timer);
		};
    }, []);
    
    const handleClick = () => {
        if (time <= 0) {
            history.push(`/exam/${props.exam.id}`)
        }
    }

	return (
		<Modal close={props.close} title="Làm bài thi">
			<div className="startModal">
				<div className="startModal__content">
					<p>
						Thời gian bắt đầu:{" "}
						{new Date(props.exam.timeOpen).toLocaleTimeString([], {
							timeStyle: "short",
						})} - {new Date(props.exam.timeOpen).toLocaleDateString()}
					</p>
					<p>Thời gian làm bài: {props.exam.timeDoing}</p>
					<p>
						Số câu hỏi:{" "}
						{props.exam.questions ? props.exam.questions.length : ""}
					</p>
				</div>
				<div className="startModal__btn">
					<button onClick={() => handleClick()}>
						{time <= 0
							? "Làm bài"
							: time >= 60
							? time % 60 === 0
								? `Vui lòng đợi: ${Math.floor(time / 60)}:00`
								: `Vui lòng đợi: ${Math.floor(time / 60)}:${(
										"0" + Math.floor(time % 60)
								  ).slice(-2)}`
							: `Vui lòng đợi: ${Math.floor(time)}`}
					</button>
				</div>
			</div>
		</Modal>
	);
}

export default Start;
