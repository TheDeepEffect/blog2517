import React, { useState } from "react";
import { Layout, Card, Form, Input, Cascader, Button } from "antd";
import { useMutation } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";
import { ADD_USER } from "./../queries/Mutations";
import { GET_USER } from "./../queries/queries";

const { Content, Header } = Layout;

const Adduser = ({ uid, name }) => {
	const [username, setUsername] = useState("");
	const [status, setStatus] = useState({ error: "", status: "" });
	const history = useHistory();
	const onCompleteMutation = () => {
		history.push("/");
	};

	const onErrorMutation = error => {
		const errs = error.graphQLErrors.map(err => err.message);
		console.log(errs);
		if (errs[0].includes("unique")) {
			setStatus(state => {
				return { ...state, error: "Please choose another username" };
			});
		} else {
			setStatus(state => {
				return { ...state, error: "Something went wrong" };
			});
		}
		setStatus(state => {
			return { ...state, status: "error" };
		});
		console.log(error);
	};

	const [adduser, { loading }] = useMutation(ADD_USER, {
		onCompleted: onCompleteMutation,
		onError: onErrorMutation,
		refetchQueries: [{ query: GET_USER, variables: { uid } }]
	});

	return (
		<Layout className="site-layout">
			<Header className="site-layout-background header-class">
				Add username
			</Header>
			<Content>
				<Card className="site-layout-background-posts" bordered={false}>
					<Form
						layout="horizontal"
						size="large"
						onFinish={() => {
							adduser({ variables: { uid, username, name } });
						}}
					>
						<Form.Item
							label="Username"
							hasFeedback
							validateStatus={loading ? "validating" : status.status}
							help={status.error}
						>
							<Input
								required
								value={username}
								onChange={e => {
									const { value } = e.target;
									setUsername(value.replace(/\s*/g, "").toLowerCase());
								}}
							/>
						</Form.Item>
						<Form.Item style={{ position: "relative", left: "50%" }}>
							<Button disabled={loading} type="primary" htmlType="submit">
								Submit
							</Button>
						</Form.Item>
					</Form>
				</Card>
			</Content>
		</Layout>
	);
};
export default Adduser;
