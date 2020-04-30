import React, { useState, useEffect } from "react";
import { Layout, Menu, Switch } from "antd";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";

import { useFirebaseAuth } from "./../../auth/auth-spa";
import { UPDATE_LASTSEEN_MUTATION } from "./../../queries/Mutations";
import { useMutation } from "@apollo/react-hooks";

import { FireOutlined, FileAddOutlined, UserOutlined } from "@ant-design/icons";

const { SubMenu } = Menu;
const { Sider } = Layout;

const Sidebar = ({ user }) => {
	const history = useHistory();
	const {
		location: { pathname }
	} = history;
	const { signOutHandle } = useFirebaseAuth();
	const { name, username } = user || " ";
	const [collapsed, setCollapsed] = useState(true);
	const [collapsible, setCollapsible] = useState(false);
	const [isOnline, setIsOnline] = useState(true);
	const [updateLastSeenMutation] = useMutation(UPDATE_LASTSEEN_MUTATION);
	const [onlineIndicator, setOnlineIndicator] = useState(0);
	const [trigger, setTrigger] = useState(false);

	useEffect(() => {
		if (user) {
			setCollapsible(true);
			setCollapsed(true);
		}
	}, [user]);
	useEffect(() => {
		if (isOnline && user) {
			updateLastSeen();
			setOnlineIndicator(setInterval(() => updateLastSeen(), 30000));
		} else {
			clearInterval(onlineIndicator);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOnline, user]);
	const updateLastSeen = () => {
		updateLastSeenMutation({
			variables: { now: new Date().toISOString() }
		});
	};
	// console.log(collapsed);
	return (
		<Sider
			collapsible={collapsible}
			collapsed={collapsed}
			onCollapse={() => setCollapsed(!collapsed)}
			style={{ backgroundColor: "#313131" }}
			breakpoint="md"
			onBreakpoint={broken => {
				broken ? setTrigger(true) : setTrigger(false);
			}}
			{...(trigger ? { collapsible: false } : { collapsible })}
		>
			<Menu
				theme="dark"
				defaultSelectedKeys={[`${pathname}`]}
				mode="inline"
				style={{ backgroundColor: "#414141" }}
			>
				<Menu.Item key="/" disabled={!collapsible}>
					<NavLink to="/" activeClassName="active-link">
						<FireOutlined />

						<span>Feed</span>
					</NavLink>
				</Menu.Item>
				<Menu.Item key="/addPost" disabled={!collapsible}>
					<NavLink to="/addPost" activeClassName="active-link">
						<FileAddOutlined />
						<span>Add Post</span>
					</NavLink>
				</Menu.Item>
				<SubMenu
					disabled={!collapsible}
					activeClassName="active-link"
					key="sub1"
					title={
						<span>
							<UserOutlined />
							<span>{username}</span>
						</span>
					}
				>
					<Menu.Item key="3">{name}</Menu.Item>
					<Menu.Item key="4">
						isOnline{" "}
						<Switch
							checked={isOnline}
							onChange={() => setIsOnline(!isOnline)}
							className="user-status-switch"
						/>
					</Menu.Item>
					<Menu.Item key="/myPosts">
						<NavLink to="/myPosts">My Posts</NavLink>
					</Menu.Item>
					<Menu.Item key="6" onClick={() => signOutHandle()}>
						Sign Out😴
					</Menu.Item>
				</SubMenu>
			</Menu>
			<div className="logo">BLOG2517</div>
		</Sider>
	);
};

export default Sidebar;
