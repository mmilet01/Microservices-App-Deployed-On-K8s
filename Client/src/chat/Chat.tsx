import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import LeftPanelFriendList from "../chat/LeftPanelFriendList/LeftPanelFriendList";
import Messages from "./Messages/Messages";
import "./Chat.css";
import api from "../api/api";
import { Message, socketMessagePayaload, User } from "../interfaces/interfaces";
import LoadingComponent from "../components/LoadingComponent/LoadingComponent";

const ENDPOINT = "https://traveling.dev/api/chat/"; // this will go to the endpoint of service where socket is running

function Chat(user: any) {
  const [selectedId, setSelectedId] = useState<string>("");
  const [socket, setSocket] = useState<any>(null);
  const [newMessageRecieved, setNewMessageRecieved] = useState<any>(null);
  const [users, setUsers] = useState<User[]>();
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    /* const token = localStorage.getItem("token");
    const chatSocket = io(ENDPOINT, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
      rejectUnauthorized: false,
      forceNew: true,
    });
    chatSocket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
    setSocket(chatSocket);
    chatSocket.on("messageRecieved", (payload: socketMessagePayaload) => {
      const messageObj = payload.messageObj;
      setNewMessageRecieved(messageObj);
    }); */
    api.users
      .getAllUsers()
      .then((res) => {
        const users = res.data.filter((user: User) => user.id != currentUserId);
        if (users && users[0] && users[0].id) {
          setSelectedId(users[0].id);
        }
        setUsers(users);
      })
      .catch((err) => {});
    return () => {
      /* chatSocket.emit("removeSocketId", currentUserId);
      chatSocket.disconnect(); */
    };
  }, [currentUserId]);

  if (!users) return <LoadingComponent size={150} color={"#123abc"} />;

  if (!users.length) {
    return <p>You got noone to chat with, yet!</p>;
  }

  const sendMessage = (messageObj: Message) => {
    api.chat.sendMessage(selectedId, messageObj).then((res) => {
      console.log("Successfully sent a message");
    });
  };

  const changeChatId = (id: string) => {
    setSelectedId(id);
    setNewMessageRecieved(null);
  };

  return (
    <div className="chat">
      <LeftPanelFriendList
        users={users!}
        changeChatId={changeChatId}
        selectedId={selectedId}
      ></LeftPanelFriendList>
      <Messages
        newMessageRecieved={newMessageRecieved}
        key={selectedId}
        selectedId={selectedId}
        sendMessage={sendMessage}
      ></Messages>
    </div>
  );
}
export default Chat;
