import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function UserList() {
  const [users, setUsers] = useState<any>(null);
  useEffect(() => {
    axios
      .get("http://traveling.dev/api/user/users")
      .then((res) => {
        console.log(res);
        setUsers(res.data);
      })
      .catch((err) => console.log(err));
    return () => {};
  }, []);
  return (
    <div>
      User List Component
      {users &&
        users.map((user: any) => (
          <p>
            {user.userId} {user.firstName} {user.email}
            <Link to={"/profile/user/" + user.userId}> Go to user</Link>
          </p>
        ))}
    </div>
  );
}
