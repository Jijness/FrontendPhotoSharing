import React, { useEffect, useState, useContext } from "react";
import { Typography, Card, CardMedia, CardContent, Button, TextField, Box, Paper, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import fetchModel from "../../lib/fetchModelData";
import './styles.css';


function formatDate(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  let hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const { isLoggedIn, user, authReady } = useContext(AuthContext);
  const [commentInput, setCommentInput] = useState();


  const fetchPhotos = async () => {
    try {
      const url = `http://localhost:8081/api/photo/${userId}`;
      const photosData = await fetchModel(url);

      if (photosData) {
        setPhotos(photosData);
        const initCommentsData = {};
        photosData.forEach(photo => {
          initCommentsData[photo._id] = '';
        });
        setCommentInput(initCommentsData);
      }
    } catch (err) {
      console.error("Failed to fetch user photos:", err);
      setPhotos([]);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchPhotos();
    }
  }, [userId, isLoggedIn, authReady]);

  const handleCommentsInputChange = (photoId, event) => {
    setCommentInput(prev => ({
      ...prev,
      [photoId]: event.target.value
    }))
  }
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
      const response = await fetchModel(`http://localhost:8081/api/photo/commentsOfPhoto/${photoId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment: commentInput[photoId]
        }),
        auth: true
      });
      if (response && response.newComment) {
        fetchPhotos();
        // xoa comment input sau khi add thanh cong
        setCommentInput(prev => ({ ...prev, [photoId]: '' }));
      } else {
        alert(response.message || "Failed to add comment, please login again");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Error adding comment. Please try again.");
    }
  }

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm("Delete this photo?")) {
      return;
    }
    try {
      const response = await fetchModel(`http://localhost:8081/api/photo/${photoId}`, {
        method: "DELETE",
        auth: true
      })
      alert("Photo deleted");
      fetchPhotos();
    } catch (err) {
      alert(`Error deleting photo: ${err}`);
    }
  }
  // Trong UserPhotos.jsx, sau hàm handleDeletePhoto
  const handleDeleteComment = async (photoId, commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }
    try {
      const response = await fetchModel(`http://localhost:8081/api/photo/comments/<span class="math-inline">\{photoId\}/</span>{commentId}`, {
        method: "DELETE",
        auth: true
      });

      if (response.message) {
        alert(response.message);
        fetchPhotos(); // Tải lại ảnh để cập nhật comment
      } else {
        alert("Failed to delete comment.");
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert(`Error deleting comment: ${err.message || err}`);
    }
  };
  // image={`http://localhost:8081/images/${photo.file_name}`}
  return (
    <div>
      {!photos || photos.length === 0 && (
        <Typography variant="h6" color="textSecondary" align="center" sx={{ mt: 4 }}>Have no photos yet.</Typography>
      )}
      {photos.map((photo) => (
        <Card key={photo._id} sx={{ mb: 3 }}>
          <CardMedia
            component="img"
            image={`http://localhost:8081/images/${photo.file_name}`}
            alt="User photo"
            sx={{
              width: "auto", maxWidth: "80%", height: "auto", maxHeight: "500px",
              objectFit: "contain",
            }}
          />
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2">
                Date on: {formatDate(photo.date_time)}
              </Typography>
              <Box sx={{
                visibility: isLoggedIn && user._id === photo.user_id ? 'visible' : 'hidden',
                pointerEvents: isLoggedIn && user._id === photo.user_id ? 'auto' : 'none',
              }}>
                <IconButton color='warning'
                  onClick={() => handleDeletePhoto(photo._id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom color="textSecondary">Comments:</Typography>
              {(photo.comments && photo.comments.length > 0) ? (
                photo.comments?.map((comment) => (
                  <Paper key={comment._id} elevation={1} sx={{ mb: 1, borderLeft: '3px solid #1976d2', pl: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ flexGrow: 1 }}> {/* Bao bọc nội dung comment để nút xóa không đẩy chữ ra */}
                      <Typography variant="subtitle2" component="span">
                        <Link to={`/users/${comment.user._id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                          {comment.user.first_name} {comment.user.last_name}
                        </Link>
                      </Typography>
                      <Typography variant="caption" display="block" color="textSecondary">
                        {formatDate(comment.date_time)}
                      </Typography>
                      <Typography variant="body2">{comment.comment}</Typography>
                    </Box>
                    {isLoggedIn && user && user._id === comment.user._id && ( // Chỉ hiện nút xóa nếu là comment của chính mình
                      <IconButton
                        aria-label="delete comment" size="small" color="error"
                        onClick={() => handleDeleteComment(photo._id, comment._id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Paper>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">No comments yet.</Typography>
              )}
            </Box>

            {isLoggedIn && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  label="Add a comment"
                  variant="outlined" size="small" fullWidth sx={{ mr: 1 }}
                  value={commentInput[photo._id] || ''}
                  onChange={((e) => handleCommentsInputChange(photo._id, e))}
                />
                <Button variant="contained" color="primary"
                  onClick={handleAddComment(photo._id)}
                  disabled={!commentInput[photo._id]?.trim()}>
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
