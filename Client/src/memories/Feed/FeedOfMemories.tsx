import React, { useEffect, useState } from "react";
import api from "../../api/api";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { IMemory } from "../../interfaces/interfaces";
import MemoryCard from "../MemoryCard/MemoryCard";
import "./FeedOfMemories.css";

function FeedOfMemories() {
  const [memories, setMemories] = useState<any>(null);

  useEffect(() => {
    api.memories
      .getAllMemories()
      .then((res) => {
        setMemories(res.data);
      })
      .catch((err) => {
        console.log("error", err);
      });
    return () => {};
  }, []);

  if (!memories) return <LoadingComponent size={150} color={"#123abc"} />;

  if (!memories.length) return <p>No memories to display yet!</p>;

  return (
    <div className="feed">
      <MemoryCard memories={memories}></MemoryCard>
    </div>
  );
}

export default FeedOfMemories;
