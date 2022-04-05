import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import api from "../../../api/api";

axios.defaults.withCredentials = true;

export default function Login(props: any) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const LoginUser = (e: any) => {
    e.preventDefault();
    const LoginData = {
      email,
      password,
    };
    api.users
      .loginUser(LoginData)
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
      <h3>Login</h3>
      <form onSubmit={LoginUser} className="formContainer">
        <input
          type="text"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login_button" onClick={LoginUser}>
          Login
        </button>
      </form>
      <div className="signup">
        <Link to="/register" className="signup">
          Dont have an account? Sign up !
        </Link>
      </div>
    </div>
  );
}
