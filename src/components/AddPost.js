import React, { useState } from "react";
import { Form, Row, Col, Card, Button, InputGroup } from "react-bootstrap";
import { useMutation } from "@apollo/react-hooks";
import { ADD_POST } from "./../queries/Mutations";
import { POSTS } from "./../queries/queries";
// import { useFirebaseAuth } from "./../auth/auth-spa";

const AddPost = ({ user }) => {
	const [validated, setValidated] = useState(false);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [publish, setPublish] = useState(false);
	const [urlSlug, setUrlSlug] = useState("");
	const { username } = user || "";
	const [done, setDone] = useState(false);

	const updateCache = (cache, { data }) => {
		const existingPosts = cache.readQuery({
			query: POSTS
		});
		const newPosts = data.insert_posts.returning[0];
		cache.writeQuery({
			query: POSTS,
			data: { posts: [newPosts, ...existingPosts.posts] }
		});
	};
	const mutationErrorHandle = error => {
		console.log(error);
	};
	const mutatoinCompletedHandle = () => {
		setValidated(false);
		setContent("");
		setTitle("");
		setUrlSlug("");
		setPublish();
		setDone(true);
	};

	const [addPost, { loading }] = useMutation(ADD_POST, {
		onError: mutationErrorHandle,
		onCompleted: mutatoinCompletedHandle,
		onUpdate: updateCache
	});
	const handleSubmit = e => {
		// const form = e.currentTarget;
		// console.log(form);
		e.preventDefault();
		console.log(publish);

		// e.stopPropagation();
		addPost({
			variables: {
				title,
				content,
				published: publish,
				urlSlug: `${username}-${urlSlug}`,
				published_at: publish ? new Date().toISOString() : null
			}
		});
	};
	const handleChange = e => {
		const { id, value } = e.target;
		setValidated(true);
		switch (id) {
			case "title":
				setTitle(value);
				setUrlSlug(value.toLowerCase().replace(/ /g, "-"));
				break;
			case "content":
				setContent(value);
				break;
			case "url-slug":
				setUrlSlug(value);
				break;
			case "publish":
				setPublish(!publish);
				break;

			default:
				break;
		}
	};
	return (
		<Card
			bg="dark text-white"
			style={{
				width: "80%",
				margin: "8vh auto"
			}}
		>
			<Card.Header>Add new Post</Card.Header>
			<Card.Body>
				<Form validated={validated} onSubmit={handleSubmit}>
					<Form.Group as={Row} controlId="title">
						<Form.Label column sm={2}>
							Title
						</Form.Label>
						<Col>
							<Form.Control
								type="text"
								placeholder="Title"
								value={title}
								onChange={handleChange}
								required
							/>
							<Form.Control.Feedback type="invalid">
								Don't forget the title!!
							</Form.Control.Feedback>
						</Col>
					</Form.Group>
					<Form.Group as={Row} controlId="content">
						<Form.Label column sm={2}>
							Content
						</Form.Label>
						<Col>
							<Form.Control
								as="textarea"
								rows="7"
								placeholder="Content"
								value={content}
								onChange={handleChange}
								required
							/>
							<Form.Control.Feedback type="invalid">
								Please add some content!!
							</Form.Control.Feedback>
						</Col>
					</Form.Group>
					<Form.Group as={Row} controlId="url-slug">
						<Form.Label column sm={2}>
							URL-slug
						</Form.Label>

						<Col>
							<InputGroup>
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroupPrepend">
										{username}-
									</InputGroup.Text>
								</InputGroup.Prepend>
								<Form.Control
									type="text"
									placeholder="url-slug"
									value={urlSlug}
									onChange={handleChange}
									required
								/>
								<Form.Control.Feedback type="invalid">
									Please choose a valid url-slug.
								</Form.Control.Feedback>
							</InputGroup>
						</Col>
					</Form.Group>
					<Form.Group as={Row} controlId="publish">
						<Col>
							<Form.Check
								type="checkbox"
								checked={publish}
								onChange={handleChange}
								label="Publish"
							/>
						</Col>
					</Form.Group>
					<Button type="submit">
						{loading ? "loading..." : "Submit Post"}
					</Button>
				</Form>
				{done && <h4>Done...</h4>}
			</Card.Body>
		</Card>
	);
};

export default AddPost;
