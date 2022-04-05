import React, { useState } from "react";
import { FcBusinessman } from "react-icons/fc";
import { IconContext } from "react-icons/lib";
import { Link } from "react-router-dom";
import "./MyProfileIcon.css";

export default function MyProfileIcon(props: any) {
  const [active, setActive] = useState(false);

  const openProfileOptions = () => {
    //get notifications from DB
    setActive(!active);
  };

  const signOut = () => {
    setActive(!active);
    props.signOut();
  };

  const getUserId = () => {
    return localStorage.getItem("userId");
  };

  return (
    <div className="myProfile">
      <div className={`profile ${active ? "display-block" : "display-none"}`}>
        <div className="triangle"></div>
        <div className="links">
          <Link
            className="singleLink"
            onClick={openProfileOptions}
            to={`/profile/user/${getUserId()}`}
          >
            My profile
          </Link>
          <Link className="singleLink" onClick={signOut} to="/feed">
            Sign Out
          </Link>
        </div>
      </div>
      <div>
        <IconContext.Provider
          value={{ className: "margin-5 margin-left-25 icon" }}
        >
          <FcBusinessman
            className="humanIcon"
            onClick={() => {
              openProfileOptions();
            }}
          />
        </IconContext.Provider>
      </div>
    </div>
  );
}
