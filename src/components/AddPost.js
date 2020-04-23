import React, { useState, useEffect } from "react";
import { Form, Row, Col, Card, Button, InputGroup } from "react-bootstrap";
import { useMutation } from "@apollo/react-hooks";
import { ADD_POST, UPDATE_POST } from "./../queries/Mutations";
import { MY_POSTS } from "./../queries/queries";
import { useLocation, useHistory } from "react-router-dom";
// import { useFirebaseAuth } from "./../auth/auth-spa";

const AddPost = ({ user, post, isEdit }) => {
	const [validated, setValidated] = useState(false);
	const [id, setId] = useState(0);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [publish, setPublish] = useState(false);
	const [urlSlug, setUrlSlug] = useState("");
	const [buttonTitle, setButtonTitle] = useState("Add");
	// const [state, setState] = useState({ url: "" });
	const { id: uid, username } = user || "";
	const [done, setDone] = useState(false);

	const history = useHistory();
	let mutation = {
		MUTATION: ADD_POST,
		onComplete: () => {
			setValidated(false);
			setContent("");
			setTitle("");
			setUrlSlug("");
			setPublish();
			setDone(true);
		},
		onError: error => {
			console.log(error);
		},
		variables: {
			title,
			content,
			published: publish,
			urlSlug: `${username}-${urlSlug}`,
			published_at: publish ? new Date().toISOString() : null
		}
	};
	let UPDATE_MUTATION = {
		MUTATION: UPDATE_POST,
		onComplete: () => {
			// console.log("done!!");
			history.push("/myPost");
		},
		onError: error => {
			console.log(error);
		},
		variables: {
			id,
			title,
			content,
			published: publish,
			urlSlug: `${username}-${urlSlug}`,
			published_at: publish ? new Date().toISOString() : null
		}
	};
	useEffect(() => {
		if (!isEdit) {
			console.log("createEffect");
			setTitle("");
			setUrlSlug("");
			setContent("");
			setPublish(false);
			setButtonTitle("Add");
		}
	}, [isEdit]);

	useEffect(() => {
		if (post && isEdit) {
			mutation = UPDATE_MUTATION;
			setId(post.id);
			setTitle(post.title);
			setUrlSlug(post.url);
			setContent(post.content);
			setPublish(post.published);
			setButtonTitle("Update");
			console.log(post.id);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [post, isEdit]);

	// const updateCache = (cache, { data }) => {
	// 	console.log("inupdate");
	// 	if (publish) {
	// 		return;
	// 	}
	// 	const existingPosts = cache.readQuery({
	// 		query: MY_POSTS,
	// 		variables: { uid }
	// 	});
	// 	const newPosts = data.insert_posts.returning[0];
	// 	cache.writeQuery({
	// 		query: MY_POSTS,
	// 		variables: { uid },
	// 		data: { posts: [newPosts, ...existingPosts.posts] }
	// 	});
	// 	console.log(newPosts, "new posts");
	// };

	// const mutatoinCompletedHandle = () => {
	// 	setValidated(false);
	// 	setContent("");
	// 	setTitle("");
	// 	setUrlSlug("");
	// 	setPublish();
	// 	setDone(true);
	// };

	console.log(title, "title");
	const [mutatePost, { loading }] = useMutation(mutation.MUTATION, {
		onError: mutation.onError,
		onCompleted: mutation.onComplete,
		// update: updateCache,
		refetchQueries: [{ query: MY_POSTS, variables: { uid } }]
	});
	if (isEdit && !post) {
		return <div>U gotta select the post first...</div>;
	}

	const handleSubmit = e => {
		// const form = e.currentTarget;
		// console.log(form);
		e.preventDefault();
		// console.log(publish);

		// e.stopPropagation();
		console.log(mutation.variables, "vars");

		mutatePost({
			variables: mutation.variables
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
			<Card.Header>{isEdit ? "Update post" : "Add new Post"}</Card.Header>
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
					<Button type="submit">{loading ? "loading..." : buttonTitle}</Button>
				</Form>
				{done && <h4>Done...</h4>}
			</Card.Body>
		</Card>
	);
};

const AddPostQuery = ({ user, isEdit }) => {
	const { state } = useLocation();
	// console.log(user);

	return <AddPost user={user} isEdit={isEdit} post={state} />;
};
export default AddPostQuery;
