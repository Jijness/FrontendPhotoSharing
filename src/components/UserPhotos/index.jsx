import React, { useEffect, useState, useContext } from "react";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  TextField,
  Box,
  Paper,
} from "@mui/material";

import { useParams } from "react-router-dom";
import models from "../../modelData/models";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  let hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const { isLoggedIn, user } = useContext(AuthContext);
  const [commentInput, setCommentInput] = useState();

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const url = `https://46p98n-8081.csb.app/api/photo/${userId}`;
        const photosData = await fetchModel(url);

        if (photosData) {
          setPhotos(photosData);
          const initCommentsData = {};
          photosData.forEach((photo) => {
            initCommentsData[photo._id] = "";
          });
          setCommentInput(initCommentsData);
        }
      } catch (err) {
        console.error("Failed to fetch user photos:", err);
        setPhotos([]);
      }
    };

    if (userId) {
      fetchPhotos();
    }
  }, [userId]);

  const handleCommentsInputChange = (photoId, event) => {
    setCommentInput((prev) => ({
      ...prev,
      [photoId]: event.target.value,
    }));
  };
  const handleAddComment = (photoId) => async () => {
    if (!commentInput[photoId].trim()) {
      alert("Comment cannot be empty");
      return;
    }
    if (!isLoggedIn) {
      alert("Please log in");
      return;
    }
    try {
      const response = await fetchModel(
        `https://46p98n-8081.csb.app/api/photo/commentsOfPhoto/${photoId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            comment: commentInput[photoId],
          }),
          auth: true,
        }
      );
      if (response && response.newComment) {
        const updatePhotos = photos.map((photo) => {
          if (photo._id === photoId) {
            return {
              ...photo,
              comments: [
                ...(photo.comments || []),
                {
                  _id: response.newComment._id,
                  comment: response.newComment.comment,
                  date_time: response.newComment.date_time,
                  user: response.newComment.user_id,
                },
              ],
            };
          }
          return photo;
        });
        console.log("Updated photos:", updatePhotos);
        setPhotos(updatePhotos);
        // xoa comment input sau khi add thanh cong
        setCommentInput((prev) => ({ ...prev, [photoId]: "" }));
      } else {
        alert(response.message || "Failed to add comment");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Error adding comment. Please try again.");
    }
  };
  // image={`https://46p98n-8081.csb.app/images/${photo.file_name}`}
  return (
    <div>
      {photos.length === 0 && (
        <Typography
          variant="h6"
          color="textSecondary"
          align="center"
          sx={{ mt: 4 }}
        >
          Have no photos yet.
        </Typography>
      )}
      {photos.map((photo) => (
        <Card key={photo._id} sx={{ mb: 3 }}>
          <CardMedia
            component="img"
            image={`https://46p98n-8081.csb.app/images/${photo.file_name}`}
            alt="User photo"
            sx={{
              width: "auto",
              maxWidth: "80%",
              height: "auto",
              objectFit: "contain",
              alignItems: "center",
            }}
          />
          <CardContent>
            <Typography variant="body2">
              Date on: {formatDate(photo.date_time)}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="subtitle1"
                gutterBottom
                color="textSecondary"
              >
                Comments:
              </Typography>
              {photo.comments && photo.comments.length > 0 ? (
                photo.comments?.map((comment) => (
                  <Paper
                    key={comment._id}
                    elevation={1}
                    sx={{ mb: 1, borderLeft: "3px solid #1976d2", pl: 1 }}
                  >
                    <Typography variant="subtitle2" component="span">
                      <Link
                        to={`/users/${comment.user._id}`}
                        style={{ textDecoration: "none", color: "#1976d2" }}
                      >
                        {comment.user.first_name} {comment.user.last_name}
                      </Link>
                    </Typography>
                    <Typography
                      variant="caption"
                      display="block"
                      color="textSecondary"
                    >
                      {formatDate(comment.date_time)}
                    </Typography>
                    <Typography variant="body2">{comment.comment}</Typography>
                  </Paper>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No comments yet.
                </Typography>
              )}
            </Box>

            {isLoggedIn && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  label="Add a comment"
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mr: 1 }}
                  value={commentInput[photo._id] || ""}
                  onChange={(e) => handleCommentsInputChange(photo._id, e)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddComment(photo._id)}
                  disabled={!commentInput[photo._id]?.trim()}
                >
                  Send
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default UserPhotos;
