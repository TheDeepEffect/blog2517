import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";

const Header = ({ signOut }) => {
	const name = "user";
	return (
		<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
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
					<NavDropdown title={name} drop="left" id="collasible-nav-dropdown">
						<NavDropdown.Item>userrr</NavDropdown.Item>
						<NavDropdown.Item>Another action</NavDropdown.Item>
						<NavDropdown.Item>Something</NavDropdown.Item>
						<NavDropdown.Divider />
						<NavDropdown.Item onClick={() => signOut()}>
							Sign Out 😴
						</NavDropdown.Item>
					</NavDropdown>
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	);
};

export default Header;
