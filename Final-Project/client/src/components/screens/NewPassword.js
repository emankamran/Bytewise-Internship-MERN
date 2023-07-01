import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const NewPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const { token } = useParams();

  const PostData = () => {
    fetch('/new-password', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password,
        token,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: data.error,
          });
        } else {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: data.message,
            showConfirmButton: false,
            timer: 1500,
          });
          navigate('/signin');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <input
          type="password"
          placeholder="enter a new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn waves-effect waves-light #64b5f6 blue darken-1"
          onClick={() => PostData()}
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default NewPassword;
