import React, { useState } from "react";
import { Card, ListGroup, Form, Button } from "react-bootstrap";
import Comments from "./../Comments/Comments";
import { useMutation } from "@apollo/react-hooks";
import { ADD_COMMENT } from "./../../queries/Mutations";
import { useHistory } from "react-router-dom";
const Post = ({ post, isMine }) => {
	const history = useHistory();
	const [comment, setComment] = useState("");

	const [addComment, { loading }] = useMutation(ADD_COMMENT, {
		onError: error => console.log(error),
		onCompleted: () => setComment("")
	});
	const {
		id,
		title,
		content,
		user: { username },
		published_at,
		url,
		published
	} = post || "";
	// console.log(published);

	const onCommentSubmit = e => {
		e.preventDefault();
		// console.log(id);
		// console.log(comment);
		if (comment) {
			// console.log(comment);
			addComment({ variables: { pid: id, content: comment } });
		}
	};
	return (
		<div>
			<Card
				style={{ width: "80%", margin: "5vh auto" }}
				bg="secondary text-white"
			>
				<Card.Header as="h5">{title}</Card.Header>
				<Card.Body>
					<Card.Text>{content}</Card.Text>

					{isMine && (
						<Button
							onClick={() =>
								history.push({ pathname: "/editPost", state: post })
							}
						>
							Update Post
						</Button>
					)}
				</Card.Body>

				<ListGroup>
					{!isMine && (
						<ListGroup.Item>
							<Form onSubmit={onCommentSubmit}>
								<Form.Control
									type="text"
									placeholder="enter comment"
									value={comment}
									onChange={e => setComment(e.target.value)}
									disabled={loading}
								/>
							</Form>
						</ListGroup.Item>
					)}
					{/* {comments.map(({ id, content }) => (
						<ListGroup.Item key={id} variant="dark">
							{content}
						</ListGroup.Item>
					))} */}
					<Comments pid={id} />
				</ListGroup>

				<Card.Footer className="mb-2">{`published at: ${
					published_at
						? new Date(published_at).toLocaleString()
						: "Not published"
				} | by ${username}`}</Card.Footer>
			</Card>
		</div>
	);
};

export default Post;
