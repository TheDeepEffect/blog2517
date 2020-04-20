import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { GET_USER } from "../queries/queries";
import { useFirebaseAuth } from "./../auth/auth-spa";
const ADD_USER = gql`
	mutation insertUser($uid: String!, $name: String!, $username: String!) {
		insert_users(objects: { id: $uid, name: $name, username: $username }) {
			affected_rows
		}
	}
`;

const AddUser = props => {
	const { currentUser } = useFirebaseAuth();
	const { uid, displayName: name } = currentUser;
	const [show, setShow] = useState(true);
	const [username, setUsername] = useState("");

	const [hasError, setError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	//This was uncommented nut not in use much (i think.)
	// useEffect(() => {
	// 	console.log("mount");
	// 	return () => {
	// 		console.log("dismount");
	// 	};
	// }, [show]);
	// console.log(uid, "uid");

	const onSubmitHandle = e => {
		e.preventDefault();
		adduser({ variables: { uid, name, username } });
	};
	const onErrorMutation = error => {
		setError(true);
		console.log(error);
	};
	const onHandleChange = e => {
		setError(false);
		const {
			target: { value }
		} = e;
		setUsername(value.toLowerCase());
	};
	const onCompleteMutation = () => {
		setShow(false);
	};

	// const updateCache = (cache, { data }) => {
	// 	setIsLoading(true);
	// 	const existingUser = cache.readQuery({
	// 		query: { GET_USER, variables: { uid } }
	// 	});
	// 	const addeduser = data.insert_users.returning[0];
	// 	cache.writeQuery({
	// 		query: { GET_USER, variables: { uid } },
	// 		data: { users: [addeduser, ...existingUser] }
	// 	});
	// 	console.log("updating cahce", cache, data);
	// };

	const [adduser] = useMutation(ADD_USER, {
		onCompleted: onCompleteMutation,
		onError: onErrorMutation,
		// update: updateCache,
		refetchQueries: [{ query: GET_USER, variables: { uid } }]
	});

	return (
		<Modal
			show={show}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header>
				<Modal.Title id="contained-modal-title-vcenter">
					Hey,{name}❤
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<h4>Add username </h4>
				<Form onSubmit={e => onSubmitHandle(e)}>
					<Form.Group controlId="formBasicEmail">
						<Form.Control
							type="text"
							onChange={e => onHandleChange(e)}
							placeholder="Enter username"
							value={username}
							required
						/>
						<Form.Text className="text-muted">
							We're friends now..! ✌<br />
							{hasError && (
								<span style={{ backgroundColor: "red", color: "white" }}>
									Username not available!!
								</span>
							)}
						</Form.Text>
					</Form.Group>
					<Button variant="primary" type="submit">
						{isLoading ? "Loading..." : "Submit"}
					</Button>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default AddUser;
