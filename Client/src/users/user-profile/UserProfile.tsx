import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import api from "../../api/api";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { IMemory, User } from "../../interfaces/interfaces";
import MemoryCard from "../../memories/MemoryCard/MemoryCard";
import "./UserProfile.css";

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [memories, setMemories] = useState<IMemory | null>(null);
  const [isLoading, setIsLoading] = useState<any>(false);
  const userId = useParams<any>().id;
  const isCurrUserProfile =
    localStorage.getItem("userId") == userId ? true : false;

  useEffect(() => {
    async function fetchMyAPI() {
      try {
        const memories = await api.memories.getMemoriesForUser(userId);
        setMemories(memories.data);
        const user = await api.users.getUserById(userId);
        setUser(user.data);
      } catch (err) {
        setIsLoading(true);
      }
    }
    fetchMyAPI();
    return () => {};
  }, [userId]);

  if (!memories || !user) {
    return <LoadingComponent size={150} color={"#123abc"} />;
  }

  if (isLoading) {
    return <p>Something went wrong</p>;
  }

  if (user) {
    return (
      <div>
        <div className="profilContainer">
          <div className="profilInfo">
            <div className="profilImg">
              <div className="profilImg1">
                <img src={`/assets/images/${user.photoPath}`} alt="" />
              </div>
            </div>
            <div className="profilInfo1">
              <p>
                <b>Name</b> {user.firstName}
              </p>
              <p>
                <b>Contact</b> {user.email}
              </p>
            </div>
          </div>
          <div className="myMemories">
            <div className="myMemoriesHeading">
              <p>Memories</p>
            </div>
            <div className="memoryList">
              <MemoryCard memories={memories}></MemoryCard>
              {isCurrUserProfile && (
                <div className="tripp" id="addCard">
                  <Link className="addCard" to="/memory/create">
                    Create new memory?
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
