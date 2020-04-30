import React, { useState, useEffect } from "react";
import { Form, Layout, Input, Checkbox, Button, Card } from "antd";
import { useMutation } from "@apollo/react-hooks";
import { ADD_POST, UPDATE_POST } from "../../queries/Mutations";
import { MY_POSTS } from "../../queries/queries";
import { useHistory } from "react-router-dom";

const { Content, Header } = Layout;

const layout = {
	labelCol: {
		span: 8
	},
	wrapperCol: {
		span: 16
	},
	tailLayout: {
		wrapperCol: { offset: 8, span: 16 }
	}
};

const AddPost = ({ user, isEdit, post }) => {
	const history = useHistory();
	const [state, setState] = useState({
		title: "",
		content: "",
		url: "",
		published: false,
		published_at: null
	});
	const { id: uid, username } = user || "";

	const [errors, setErrors] = useState([]);
	const [done, setDone] = useState(false);

	let add_mutation = {
		MUTATION: ADD_POST,
		onCompleted: () => {
			console.log("add completed");
			setState(prevState => {
				return {
					title: "",
					content: "",
					url: "",
					published: false,
					published_at: null
				};
			});
			setDone(true);
			setErrors([]);
		},
		onError: error => {
			console.log(error);
			setErrors([error]);
		}
	};

	let update_mutation = {
		MUTATION: UPDATE_POST,
		onCompleted: () => {
			console.log("done!!");
			history.push("/myPosts");
		},
		onError: error => {
			console.log(error, "update error");
			setErrors([error]);
		}
	};
	const [mutation, setMutation] = useState(add_mutation);

	useEffect(() => {
		if (!isEdit) {
			setState({
				title: "",
				content: "",
				url: "",
				published: false,
				published_at: null
			});
			setDone(false);
			setErrors([]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isEdit]);
	useEffect(() => {
		if (post && isEdit) {
			setMutation(update_mutation);
			const { user, ...postData } = post;
			// console.log(postData);
			setState({ ...postData });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [post, isEdit]);
	// console.log(mutation);
	// useEffect(() => {
	// 	if (post && isEdit) {
	// 		mutation = update_mutation;
	// 		setId(post.id);
	// 		const { id, user, ...postData } = post;
	// 		console.log(postData);
	// 		setState({ ...postData });
	// 	}
	// 	console.log(mutation);
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [isEdit, post]);
	const [mutatePost, { loading, error }] = useMutation(mutation.MUTATION, {
		onError: mutation.onError,
		onCompleted: mutation.onCompleted,
		refetchQueries: [{ query: MY_POSTS, variables: { uid } }]
	});
	if (error) console.log(error);
	const onFinish = values => {
		// console.log(mutation);
		// console.log(isEdit);
		// console.log(state);
		const { id, content, title, published, url } = state;
		switch (isEdit) {
			case true:
				mutatePost({
					variables: {
						id,
						title,
						content,
						published,
						published_at: published ? new Date().toISOString() : null,
						url
					}
				});
				break;
			default:
				mutatePost({
					variables: {
						title,
						content,
						published,
						published_at: published ? new Date().toISOString() : null,
						url: `${username}-${url}`
					}
				});
				break;
		}
	};
	// console.log(state);
	const onChnageHandler = e => {
		const { name, value } = e.target;
		if (name === "title" || name === "url") {
			setState(prevState => {
				return {
					...prevState,
					[name]: value,
					url: value.toLowerCase().replace(/ /g, "-")
				};
			});
		} else if (name === "published") {
			setState(prevState => {
				return {
					...prevState,
					[name]: !prevState.published
				};
			});
		} else {
			setState(prevState => {
				return {
					...prevState,
					[name]: value
				};
			});
		}
	};
	// console.log(state);
	if (!user) {
		return (
			<div style={{ color: "#131313" }}>"Sorry you can't access this page"</div>
		);
	}
	if (isEdit && !post) {
		return <div style={{ color: "#131313" }}>Select your post to edit 😊</div>;
	}
	return (
		<Layout className="site-layout">
			<Header className="site-layout-background header-class">
				Add new post
			</Header>
			<Content>
				<Card className="site-layout-background-posts" bordered={false}>
					<Form
						style={{
							position: "relative",
							left: "-5vw"
						}}
						{...layout}
						name="nest-messages"
						onSubmitCapture={onFinish}
					>
						<Form.Item label="Title">
							<Input
								required
								value={state.title}
								onChange={onChnageHandler}
								name="title"
							/>
						</Form.Item>
						<Form.Item label="Content">
							<Input.TextArea
								name="content"
								rows={5}
								value={state.content}
								onChange={onChnageHandler}
								required
							/>
						</Form.Item>
						<Form.Item label="URL">
							<Input
								addonBefore={`${username}-`}
								name="url"
								value={state.url}
								onChange={onChnageHandler}
								required
							/>
							{errors.length > 0 && <span>Please choose diffrent url</span>}
						</Form.Item>
						<Form.Item {...layout.tailLayout}>
							<Checkbox
								name="published"
								checked={state.published}
								onChange={onChnageHandler}
								style={{ color: "white" }}
							>
								Published
							</Checkbox>
						</Form.Item>
						<Form.Item {...layout.tailLayout}>
							<Button type="primary" htmlType="submit" disabled={loading}>
								{loading
									? "Loading..."
									: done
									? "Add another?"
									: isEdit
									? "Update"
									: "Add"}
							</Button>
						</Form.Item>
					</Form>
					{done && <h3>Added!!</h3>}
				</Card>
			</Content>
		</Layout>
	);
};

const MutatePost = ({ user, isEdit }) => {
	const history = useHistory();
	const {
		location: { state: post }
	} = history;

	return <AddPost user={user} isEdit={isEdit} post={post} />;
};
export default MutatePost;
