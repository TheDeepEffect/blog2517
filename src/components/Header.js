import React, { useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link, NavLink, useHistory } from "react-router-dom";

import { useMutation } from "@apollo/react-hooks";
import { UPDATE_LASTSEEN_MUTATION } from "../queries/Mutations";

import { useFirebaseAuth } from "./../auth/auth-spa";

const Header = ({ user }) => {
	const { signOutHandle } = useFirebaseAuth();
	const [isOnline, setIsOnline] = useState(true);
	const [onlineIndicator, setOnlineIndicator] = useState(0);

	const { name, username } = user || "user";
	const history = useHistory();

	useEffect(() => {
		// Every 30s, run a mutation to tell the backend that you're online
		// console.log(isOnline);
		if (isOnline) {
			// console.log("Online...");
			updateLastSeen();
			setOnlineIndicator(setInterval(() => updateLastSeen(), 30000));
		} else {
			clearInterval(onlineIndicator);
		}
		return () => {
			// Clean up
			console.log(isOnline, `${isOnline ? "online" : "offline"}cleanup`);
			clearInterval(onlineIndicator);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOnline]);

	const [updateLastSeenMutation] = useMutation(UPDATE_LASTSEEN_MUTATION);

	const updateLastSeen = () => {
		// console.log("isOnline");
		// Use the apollo client to run a mutation to update the last_seen value
		updateLastSeenMutation({
			variables: { now: new Date().toISOString() }
		});
	};

	return (
		<Navbar sticky="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
			<Navbar.Brand>Blog2517</Navbar.Brand>
			<Navbar.Toggle aria-controls="responsive-navbar-nav" />
			<Navbar.Collapse id="responsive-navbar-nav">
				<Nav className="mr-auto">
					<Nav.Link>
						<NavLink to="/">Posts</NavLink>
					</Nav.Link>

					<Nav.Link>
						<Link to="/addPost">Crate</Link>
					</Nav.Link>
				</Nav>
				<Nav>
					<NavDropdown
						title={username}
						drop="left"
						id="collasible-nav-dropdown"
					>
						<NavDropdown.Item>{name}</NavDropdown.Item>
						<NavDropdown.Item onClick={() => history.push("/myPost")}>
							My posts
						</NavDropdown.Item>
						<NavDropdown.Item
							style={{
								backgroundColor: isOnline ? "green" : "Red",
								color: "white"
							}}
							onClick={() => setIsOnline(!isOnline)}
						>
							{isOnline ? "Online" : "Offline"}
						</NavDropdown.Item>
						<NavDropdown.Divider />
						<NavDropdown.Item onClick={() => signOutHandle()}>
							Sign Out <span role="img">😴</span>
						</NavDropdown.Item>
					</NavDropdown>
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	);
};

export default Header;
