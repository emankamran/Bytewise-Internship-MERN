import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userContext } from '../App';
import Swal from 'sweetalert2';

const NavBar = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(userContext);

  const renderList = () => {
    if (state) {
      return [
        <li key="profile"><Link to="/profile">Profile</Link></li>,
        <li key="createpost"><Link to="/createpost">Create Post</Link></li>,
        <li key="myfollowingposts"><Link to="/myfollowingposts">My Following Posts</Link></li>,
        <li key="chatdashboard"><Link to="/chatdashboard">Chat Dashboard</Link></li>,
        <li key="logout">
          <button
            className="btn #c62828 red darken-3"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Logged out successfully',
                showConfirmButton: false,
                timer: 1500
              });
              navigate('/signin');
              //if(ws.socket){ws.socket.disconnect()}
            }}
          >
            Logout
          </button>
        </li>
      ];
    } else {
      return [
        <li key="signin"><Link to="/signin">Sign In</Link></li>,
        <li key="signup"><Link to="/signup">Sign Up</Link></li>
      ];
    }
  };

  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? "/" : "/signin"} className="brand-logo left">
          Instagram
        </Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
