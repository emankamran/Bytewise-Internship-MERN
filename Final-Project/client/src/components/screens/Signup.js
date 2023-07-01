import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (url) {
      uploadFields();
    }
  }, [url]);

  const uploadProfilePic = () => {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'iinsta-clone');
    data.append('cloud_name', 'yeaseen');

    fetch('https://api.cloudinary.com/v1_1/yeaseen/image/upload', {
      method: 'post',
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.secure_url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadFields = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Invalid Email',
      });

      return;
    }
    fetch('/signup', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        password,
        email,
        propic: url,
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
          navigate('/signup');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
    setImageName(e.target.files[0].name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (image) {
      uploadProfilePic();
    } else {
      uploadFields();
    }
  };

  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="file-field input-field">
            <div className="btn #64b5f6 blue darken-1">
              <span>Upload Profile Picture</span>
              <input type="file" onChange={handleFileChange} />
            </div>
            <div className="file-path-wrapper">
              <input
                className="file-path validate"
                value={imageName}
                type="text"
                placeholder="Upload your image"
              />
            </div>
          </div>

          <button className="btn waves-effect waves-light #64b5f6 blue darken-1" type="submit">
            SignUp
          </button>
        </form>

        <h5>
          <Link to="/signin">Already have an account?</Link>
        </h5>
      </div>
    </div>
  );
};

export default SignUp;
