import React, { useEffect, useState } from "react";
import { Typography, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import models from "../../modelData/models";
import { Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `http://localhost:8081/api/user/${userId}`;
        const userData = await fetchModel(url);
        setUser(userData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Failed to fetch user details:", err);
      }
    };
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (!user) {
    return <Typography variant="body1">Loading user...</Typography>;
  }

  return (
    <div>
      <Typography variant="body1" component="h2" sx={{ fontWeight: "bold", mb: 2 }}>
        {user.first_name} {user.last_name}
      </Typography>
      <Typography variant="body1">Location: {user.location}</Typography>
      <Typography variant="body1">Description: {user.description}</Typography>
      <Typography variant="body1">Occupation: {user.occupation}</Typography>

      <Button
        component={Link}
        to={`/photos/${user._id}`}
        variant="contained" color="primary"
        sx={{ mt: 2 }}
      >
        View Photos
      </Button>
    </div>
  );
}

export default UserDetail;
