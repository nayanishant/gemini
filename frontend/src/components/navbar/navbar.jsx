import "./navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/userSlice";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import categorizeChats from "../../utils/group_chats";
import { IoIosLogOut } from "react-icons/io";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { RiApps2AddLine } from "react-icons/ri";
import { IoIosMore } from "react-icons/io";
import { FormControl, IconButton, Menu, MenuItem, styled } from "@mui/material";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [chatSessions, setChatSessions] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const CustomMenu = styled(Menu)({
    "& .MuiPaper-root": {
      backgroundColor: "#1E1E2E",
      color: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
    },
    "& .MuiMenuItem-root:hover": {
      backgroundColor: "#313131",  
    },
  });

  const initials = user.name
    ? user.name
        .split(" ")
        .map((word) => word[0])
        .join("")
    : "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/");
  };

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  //Fetch all the previous history of a user by particular sessionId
  const fetchHistory = async (sessionId) => {
    localStorage.setItem("sessionId", sessionId);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_NODE_URL}/history/${sessionId}`,
        config
      );
      setChatHistory((prevState) => ({
        ...prevState,
        chatHistory: res.data.history.map((entry) => ({
          role: entry.role,
          text: entry.parts?.[0]?.text || entry.message,
          createdAt: entry.createdAt,
        })),
      }));
    } catch (err) {
      console.error("Error fetching chat history:", err);
    }
  };

  //Create a new chat session for user
  const createNewChatSession = async (userId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_NODE_URL}/api/v1/create-new-chat`,
        { userId },
        config
      );
      const newSessionId = response.data.session;
      setChatSessions((prevChatSessions) => [
        newSessionId,
        ...prevChatSessions,
      ]);
      localStorage.setItem("sessionId", newSessionId.sessionId);
      navigate(`/chat/${newSessionId.sessionId}`);
    } catch (err) {
      console.error("Error creating new chat session:", err);
    }
  };

  //Fetch all chat sessions by User_id
  useEffect(() => {
    const fetchAllChats = async () => {
      if (!user?._id) return;
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_NODE_URL}/api/v1/find-all-chats`,
          { userId: user._id },
          config
        );
        setChatSessions(response.data.sessions);
      } catch (error) {
        console.error("Error fetching chat sessions:", error);
      }
    };

    fetchAllChats();
  }, [user?._id]);

  //Group chats based on day
  const groupedChats = useMemo(
    () => categorizeChats(chatSessions),
    [chatSessions]
  );

  const handleClick = (event, sessionId) => {
    setAnchorEl(event.currentTarget);
    // setSelectedSession(sessionId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    // setSelectedSession(null);
  };

  return (
    <>
      {/* <div className="nav-wrapper">
        <div className="logo-section">
          <p className="text-clr">LOGO</p>
        </div>
        <div className="recent-section">
          <p className="text-clr title">Recents</p>
          <ul>
            <li>
              <NavLink
                href="www.google.com"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <p className="text-clr">Chat 1</p>
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="profile-section">
          <div className="profile-wrapper">
            <div className="name-logo">
              <p className="text-clr">{initials}</p>
            </div>
            <div className="name">
              <p className="text-clr">{name}</p>
            </div>
          </div>
          <div className="logout-btn">
            <button onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </div>
      </div> */}


      <div className="nav-wrapper">
        <div className="extreme-top-section">
          <div className="collapse nav-top-icons">
            <span className="nav-icon icon-clr">
              <TbLayoutSidebarLeftCollapse />
            </span>
          </div>
          <div
            className="new-chat nav-top-icons"
            onClick={() => createNewChatSession(user._id)}
          >
            <span className="nav-icon icon-clr">
              <RiApps2AddLine />
            </span>
          </div>
        </div>
        <div className="logo-section">
          <p className="text-clr">LOGO</p>
        </div>
        <div className="recent-section">
          {[...groupedChats.entries()].map(([group, sessions]) =>
            sessions.length > 0 ? (
              <div key={group}>
                <h3 className="text-clr day-heading">{group}</h3>
                <ul>
                  {sessions.map((session) => (
                    <li key={session._id} className="nav-list">
                      <div className="nav-list-item">
                        <NavLink
                          to={`/chat/${session.sessionId}`}
                          onClick={() => fetchHistory(session.sessionId)}
                          // activeclassname="active"
                        >
                          <p className="text-clr chat-session-name">
                            {session.chatTitle
                              ? session.chatTitle
                              : "Untitled chat"}
                          </p>
                        </NavLink>
                        <IconButton
                          onClick={(event) =>
                            handleClick(event, session.sessionId)
                          }
                          sx={{
                            color: '#d9d9d9',
                            '&:hover': {
                              color: 'white',
                              background:'none'
                            }
                          }}
                        >
                          <IoIosMore />
                        </IconButton>

                        {/* Dropdown Menu */}
                        <CustomMenu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleClose}
                        >
                          <MenuItem
                            onClick={() => {
                              // handleRename(selectedSession);
                              handleClose();
                            }}
                          >
                            Rename Chat
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              // handleDelete(selectedSession);
                              handleClose();
                            }}
                          >
                            Delete Chat
                          </MenuItem>
                        </CustomMenu>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null
          )}
        </div>
        <div className="profile-section">
          <div className="profile-wrapper">
            <div className="name-logo">
              <p className="text-clr">{initials}</p>
            </div>
            <div className="name">
              <p className="text-clr">{user.name}</p>
            </div>
          </div>
          <div className="logout-btn">
            <button onClick={handleLogout}>
              <IoIosLogOut />
              {/* <i className="fa-solid fa-right-from-bracket"></i> */}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
