import React, { useEffect, useState } from "react";

const Comment = ({ content, by, last_seen }) => {
	const [status, setStatus] = useState(true);
	// console.log(last_seen);

	const checkStatus = () => {
		// console.log(new Date(last_seen) - new Date() < -35000 ? false : true);
		setStatus(new Date(last_seen) - new Date() < -35000 ? false : true);
	};
	return (
		<div className="comment">
			{content}{" "}
			<span
				onMouseOver={checkStatus}
				className={`username-comment ${status ? "online" : "offline"}`}
			>
				by {by}
			</span>
		</div>
	);
};

export default Comment;
