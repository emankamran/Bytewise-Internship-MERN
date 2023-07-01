import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ChatDashboard = () => {
  const [chatrooms, setChatrooms] = useState([]);
  const [chatroomName, setChatroomName] = useState('');

  const getChatrooms = () => {
    fetch('/chatdashboard', {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt')
      }
    })
      .then(res => res.json())
      .then(result => {
        setChatrooms(result.chatrooms);
      })
      .catch(err => {
        setTimeout(getChatrooms, 3000);
      });
  };

  const createChatroom = () => {
    fetch('/chatdashboard', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt')
      },
      body: JSON.stringify({
        name: chatroomName
      })
    })
      .then(res => res.json())
      .then(result => {
        console.log(result.message);
        // Update the chatrooms list after creating a new chatroom
        getChatrooms();
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    getChatrooms();

    return () => {
      console.log('unmounting...');
    };
  }, []);

  return (
    <div className="chatcard">
      <div className="chatcardHeader">Chatrooms</div>
      <div className="chatcardBody">
        <div className="chatinputGroup">
          <label className="chatlabel" htmlFor="chatroomName">
            Chatroom Name
          </label>
          <input
            className="chatinput"
            type="text"
            name="chatroomName"
            id="chatroomName"
            placeholder="ChatterBox CTG"
            value={chatroomName}
            onChange={e => setChatroomName(e.target.value)}
          />
        </div>
      </div>

      <button className="chatbutton" onClick={createChatroom}>
        Create Chatroom
      </button>
      <div className="chatrooms">
        {chatrooms.map(chatroom => (
          <div key={chatroom._id} className="chatroom">
            <div>{chatroom.name}</div>
            <Link to={`/chatroompage/${chatroom._id}`}>
              <div className="join">Join</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatDashboard;
