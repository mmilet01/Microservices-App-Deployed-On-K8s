import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AiFillMessage } from "react-icons/ai";
import { CgFeed } from "react-icons/cg";
import { IconContext } from "react-icons";
import { ImPlus } from "react-icons/im";
import "./Header.css";
import "../../App.css";
import MyProfileIcon from "../../users/user-profile/MyProfileIcon/MyProfileIcon";

export default function Header(props: any) {
  return (
    <div className="header">
      <div className="logo-title">
        <NavLink to="" className="logo">
          <img className="logoImg" src="/assets/images/logo.jpg" alt="" />
        </NavLink>
        <h4>Trip Memoire</h4>
      </div>

      <div className="icons">
        <p>{props.name}</p>
        <div className="padding-top-10 d-flex-row">
          <NavLink to="/feed">
            <IconContext.Provider value={{ className: "margin-5 icon" }}>
              <CgFeed />
            </IconContext.Provider>
          </NavLink>

          <NavLink to="/chat">
            <IconContext.Provider value={{ className: "margin-5 icon" }}>
              <AiFillMessage />
            </IconContext.Provider>
          </NavLink>

          <MyProfileIcon signOut={props.signOut} />

          <NavLink to="/memory/create">
            <IconContext.Provider value={{ className: "margin-5 plus" }}>
              <ImPlus />
            </IconContext.Provider>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
