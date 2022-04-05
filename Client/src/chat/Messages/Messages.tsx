import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Message } from "../../interfaces/interfaces";
import "./Messages.css";
const uuid = require("react-uuid");

interface IProps {
  newMessageRecieved: Message;
  key: string;
  selectedId: string;
  sendMessage: any;
}

export default function Messages(props: IProps) {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[] | null>(null);

  const currentUserId = localStorage.getItem("userId");

  const sendMessage = () => {
    const userMessage = message;
    setMessage("");
    const messageObj: Message = {
      id: uuid(),
      from: currentUserId!,
      to: props.selectedId,
      message: userMessage,
    };
    if (chatMessages && chatMessages.length) {
      setChatMessages((oldArray: any) => [...oldArray, messageObj]);
    } else {
      setChatMessages([messageObj]);
    }
    props.sendMessage(messageObj);
    setTimeout(() => {
      let element = document.getElementById("scrollId");
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    }, 0);
  };

  const handleChange = (e: any) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    setTimeout(() => {
      let element = document.getElementById("scrollId");
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    }, 0);

    let getNewMessages = setInterval(function () {
      api.chat.getChatMessages(props.selectedId).then((res) => {
        setChatMessages(res.data);
      });
    }, 4000);

    api.chat.getChatMessages(props.selectedId).then((res) => {
      setChatMessages(res.data);
    });

    return () => {
      clearInterval(getNewMessages);
    };
  }, [props.selectedId]);

  return (
    <div>
      <div id="scrollId" className="messages">
        {chatMessages &&
          chatMessages.map((message: Message) => {
            return (
              <div
                className={
                  "singleMessage " +
                  (message.from === currentUserId ? "shiftRight" : "shiftLeft ")
                }
                key={message.id}
              >
                {message.message}
              </div>
            );
          })}
      </div>
      <div className="d-flex-row bottomPart">
        <input
          className="messageInput"
          type="text"
          placeholder="Message"
          value={message}
          onChange={(e) => handleChange(e)}
        />
        <button className="send-message-btn" onClick={() => sendMessage()}>
          Send Message
        </button>
      </div>
    </div>
  );
}
