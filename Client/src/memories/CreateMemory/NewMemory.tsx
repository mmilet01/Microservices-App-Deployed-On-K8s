import axios from "axios";
import React, { useState } from "react";
import api from "../../api/api";
import "./NewMemory.css";

export default function NewMemory() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [fileData, setFileData] = useState<any[]>([]);

  const onFileChange = (event: any) => {
    let localFileArray: string[] = [];
    for (let i = 0; i < event.target.files.length; i++) {
      localFileArray.push(URL.createObjectURL(event.target.files[i]));
    }
    setFiles(localFileArray);
    setFileData(event.target.files);
  };

  const getRandomPhoto = () => {
    const rndInt = Math.floor(Math.random() * 7) + 1;
    return `memory_image_${rndInt}.jpg`;
  };

  const CreateMemory = (e: any) => {
    e.preventDefault();
    const photoPath = getRandomPhoto();
    const memoryData = {
      title,
      description,
      photoPath,
    };

    api.memories
      .createNewMemory(memoryData)
      .then((res) => {
        const userId = localStorage.getItem("userId");
        window.location.href = `http://traveling.dev/profile/user/${userId}`;
      })
      .catch((err) => {
        window.location.href = `http://traveling.dev/feed`;
      });
  };

  return (
    <div className="login_form">
      <h3>New Memory</h3>
      <input
        type="text"
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />
      <button className="login_button" onClick={CreateMemory}>
        Create
      </button>
    </div>
  );
}
