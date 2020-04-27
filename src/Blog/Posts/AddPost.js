import React, { useState, useEffect } from "react";
import { Form, Layout, Input, Checkbox, Button } from "antd";
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
	const [id, setId] = useState(null);
	const { id: uid, username } = user || "";

	const [errors, setErrors] = useState([]);
	const [done, setDone] = useState(false);

	let mutation = {
		MUTATION: ADD_POST,
		onCompleted: () => {
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
			// console.log(error);
			setErrors([...error]);
		},
		variables: {
			...state,
			url: `${username}-${state.url}`,
			published_at: new Date().toISOString()
		}
	};

	let update_mutation = {
		MUTATION: UPDATE_POST,
		onComplete: () => {
			// console.log("done!!");
			history.push("/myPost");
		},
		onError: error => {
			// console.log(error);
			setErrors([...error]);
		},
		variables: {
			...state,
			id,
			url: `${username}-${state.url}`,
			published_at: new Date().toISOString()
		}
	};

	useEffect(() => {
		if (!isEdit) {
			// console.log("createEffect");
			setState(prevState => {
				return {
					title: "",
					content: "",
					url: "",
					published: false,
					published_at: null
				};
			});
			setDone(false);
			setErrors([]);
		}
	}, [isEdit]);
	useEffect(() => {
		if (post && isEdit) {
			mutation = update_mutation;
			setId(post.id);
			const { id, user, ...postData } = post;
			console.log(postData);
			setState({ ...postData });
		}
	}, [post, isEdit]);

	const [mutatePost, { loading }] = useMutation(mutation.MUTATION, {
		onError: mutation.onError,
		onCompleted: mutation.onCompleted,
		refetchQueries: [{ query: MY_POSTS, variables: { uid } }]
	});

	const onFinish = values => {
		if (state.published) {
			mutatePost({
				variables: mutation.variables
			});
		} else {
			mutatePost({ variables: { ...state, url: `${username}-${state.url}` } });
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
			<div style={{ color: "white" }}>"Sorry you can't access this page"</div>
		);
	}
	if (isEdit && !post) {
		return <div style={{ color: "white" }}>Select your post to edit 😊</div>;
	}
	return (
		<div>
			<Header
				className="site-layout-background"
				style={{
					backgroundColor: "#313131",
					textAlign: "end",
					fontSize: 30,
					color: "white"
				}}
			>
				Add new post
			</Header>
			<Content style={{ padding: 30 }}>
				<div
					className="site-layout-background-posts"
					style={{
						padding: 100,
						minHeight: "80vh",
						minWidth: "50vw",
						backgroundColor: "#ec625f",
						color: "white"
					}}
				>
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
						{done && <h3>Added!!</h3>}
					</Form>
				</div>
			</Content>
		</div>
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
