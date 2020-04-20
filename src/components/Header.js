import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";

import { useFirebaseAuth } from "./../auth/auth-spa";

const Header = ({ user }) => {
	const { signOutHandle } = useFirebaseAuth();
	const { name, username } = user || "user";
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
						<NavDropdown.Item>Another action</NavDropdown.Item>
						<NavDropdown.Item>Something</NavDropdown.Item>
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
