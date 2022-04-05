import React from "react";
import { User } from "../../interfaces/interfaces";
import "./LeftPanelFriendList.css";

export interface IProps {
  users: User[];
  changeChatId: any;
  selectedId: string;
}

export default function LeftPanelFriendList(props: IProps) {
  return (
    <div className="left-panel">
      {props &&
        props.users &&
        props.users.map((user: User, index: number) => {
          return (
            <div
              key={user.id}
              className={
                "row d-flex " +
                (index % 2 === 0 ? "applyColor " : "") +
                (props.selectedId === user.id ? "selectedColor" : "")
              }
              onClick={() => props.changeChatId(user.id)}
            >
              <div className="d-flex-row">
                <img
                  className="chatImage"
                  src={`/assets/images/${user.photoPath}`}
                  alt="source img"
                />
                <div>{user.email}</div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
