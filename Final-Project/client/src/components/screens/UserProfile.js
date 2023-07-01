import React, { useState, useEffect, useContext } from 'react';
import { userContext } from '../../App';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [showFollow, setShowFollow] = useState(true);
  const { state } = useContext(userContext);
  const { userid } = useParams();

  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setUserProfile(data);
        setShowFollow(!data.followers.includes(state._id));
      })
      .catch((err) => console.log(err));
  }, [userid, state._id]);

  const followUser = () => {
    fetch('/follow', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      },
      body: JSON.stringify({
        followId: userid
      })
    })
      .then((res) => res.json())
      .then((data) => {
        setUserProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id]
            }
          };
        });
        setShowFollow(false);
      })
      .catch((err) => console.log(err));
  };

  const unfollowUser = () => {
    fetch('/unfollow', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      },
      body: JSON.stringify({
        unfollowId: userid
      })
    })
      .then((res) => res.json())
      .then((data) => {
        setUserProfile((prevState) => {
          const newFollowers = prevState.user.followers.filter(
            (follower) => follower !== data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollowers
            }
          };
        });
        setShowFollow(true);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {userProfile ? (
        <div style={{ maxWidth: '700px', margin: '0px auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              margin: '18px 0px',
              borderBottom: '1px solid grey'
            }}
          >
            <div>
              <img
                style={{ width: '160px', height: '160px', borderRadius: '80px' }}
                src={userProfile.user.pic}
                alt="User Profile"
              />
            </div>
            <div>
              <h4>{userProfile.user.name}</h4>
              <h5>{userProfile.user.email}</h5>
              <div style={{ display: 'flex', justifyContent: 'space-around', width: '110%' }}>
                <h6>{userProfile.posts.length} post</h6>
                <h6>{userProfile.user.followers.length} followers</h6>
                <h6>{userProfile.user.following.length} following</h6>
              </div>

              {showFollow ? (
                <button
                  style={{ margin: '10px', left: '60px' }}
                  className="btn waves-effect waves-light #64b5f6 blue darken-1"
                  onClick={followUser}
                >
                  Follow
                </button>
              ) : (
                <button
                  style={{ margin: '10px', left: '60px' }}
                  className="btn waves-effect waves-light #64b5f6 blue darken-1"
                  onClick={unfollowUser}
                >
                  Unfollow
                </button>
              )}
            </div>
          </div>

          <div className="gallery">
            {userProfile.posts.map((item) => (
              <div key={item._id} className="gallery-content">
                <img src={item.photo} alt={item.title} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <h2>Loading.....</h2>
      )}
    </>
  );
};

export default UserProfile;
