import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import "./Register.css";
import api from "../../../api/api";

function Register(props: any) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const getRandomUserPhoto = () => {
    const rndInt = Math.floor(Math.random() * 7) + 1;
    return `user_profile_image_${rndInt}.jpg`;
  };

  const RegisterUser = (e: any) => {
    e.preventDefault();
    const photoPath = getRandomUserPhoto();

    const RegisterData = {
      firstName,
      lastName,
      email,
      password,
      photoPath,
    };

    api.users
      .registerUser(RegisterData)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("firstName", res.data.user.firstName);
        localStorage.setItem("userId", res.data.user.id);
        localStorage.setItem("userPhotoPath", res.data.user.photoPath);
        window.location.href = "http://traveling.dev/feed";
        props.userLoggedIn();
      })
      .catch((err) => {});
  };

  return (
    <div className="login_form">
      <h3>Register</h3>
      <form action="" encType="multipart/form-data">
        <input
          className="registerInput"
          type="text"
          placeholder="First Name"
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          className="registerInput"
          type="text"
          placeholder="Last Name"
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          className="registerInput"
          type="text"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="registerInput"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login_button" onClick={RegisterUser}>
          Register
        </button>
      </form>
      <div className="signup">
        <Link to="/login" className="signup">
          Already a member? Login !
        </Link>
      </div>
    </div>
  );
}

export default withRouter(Register);
