import React, { useState, useEffect } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  Link as LinkUI,
} from "@mui/material";
import models from "../../modelData/models";
import { Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserList, a React component of Project 4.
 */
function UserList() {
  const [users, setUsers] = useState([]);
  const [loadind, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await fetchModel(
          "https://46p98n-8081.csb.app/api/user/list"
        );
        setUsers(usersData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, []);
  return (
    <div>
      <List component="nav">
        {users.map((item) => (
          <Link
            key={item._id}
            to={`/users/${item._id}`}
            style={{ textDecoration: "none" }}
          >
            <ListItem button>
              <ListItemText primary={`${item.first_name} ${item.last_name}`} />
            </ListItem>
            <Divider />
          </Link>
        ))}
      </List>
    </div>
  );
}

export default UserList;
