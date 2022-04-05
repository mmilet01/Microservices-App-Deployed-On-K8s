import React from "react";
import { IMemory } from "../../interfaces/interfaces";
import "./MemoryCard.css";

export default function MemoryCard(props: any) {
  const memories: Array<IMemory> = props.memories;
  const userPhotoPath = localStorage.getItem("userPhotoPath");

  if (!memories.length) {
    return <p>No memories</p>;
  }

  return (
    <div className="card">
      <div className="content">
        {memories &&
          memories.map((memory) => (
            <div key={memory.id} className="memoryCard">
              <div className="memmory-card-header">
                <div className="d-flex-row">
                  <img
                    className="profileImage"
                    src={`/assets/images/${memory.userPhotoPath}`}
                    alt="source img"
                  />
                  <div className="d-flex-column">
                    <span className="memoryTitle">{memory.title}</span>
                    <span>Created By: {memory.userName}</span>
                    <span>
                      Created On: {memory.createdOn.toString().split("T", 2)[0]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="d-flex-row align-center">
                <img
                  className="memoryImage"
                  src={`/assets/images/${memory.photoPath}`}
                  alt="source img"
                />
              </div>
              <div className="bottomSection">
                <div className="description">{memory.description}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
