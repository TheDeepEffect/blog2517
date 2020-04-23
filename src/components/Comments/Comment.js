import React, { useState } from "react";
import { ListGroup, Badge, Tooltip, OverlayTrigger } from "react-bootstrap";

const Comment = ({ content, by, last_seen }) => {
	const renderTooltip = props => {
		return (
			<Tooltip {...props}>
				Is {new Date(last_seen) - new Date() < -35000 ? "Offline" : "Online"}
			</Tooltip>
		);
	};
	return (
		<>
			<ListGroup.Item variant="dark">
				{content}{" "}
				<OverlayTrigger
					placement="right"
					delay={{ show: 250, hide: 400 }}
					overlay={renderTooltip}
				>
					<Badge variant="dark">by {by}</Badge>
				</OverlayTrigger>
			</ListGroup.Item>
		</>
	);
};
export default Comment;
