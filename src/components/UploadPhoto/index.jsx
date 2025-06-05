import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Paper, Button, Alert, CircularProgress } from "@mui/material";

import { AuthContext } from "../../contexts/AuthContext";
import fetchModel from "../../lib/fetchModelData";

function UploadPhoto() {
  const { isLoggedIn, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Giai phong URL khi component unmount hoac khi previewUrl thay doi
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl); // Giai phong URL cu
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage({ text: "Please select a file to upload", type: "error" });
      return;
    }
    setLoading(true);
    setMessage(null);
    const formData = new FormData();
    formData.append("photo", selectedFile);

    try {
      const response = await fetchModel("https://82rysc-8081.csb.app/api/photo/new", {
        method: "POST",
        body: formData,
        auth: true,
      });
      setMessage({ text: "Photo uploaded successfully!", type: "success" });
      setSelectedFile(null);
      setPreviewUrl(null);

      setTimeout(() => {
        navigate(`/photos/${user._id}`);
      }, 3000);
    } catch (err) {
      console.error("Error uploading photo:", err);
      setMessage({ text: "Error uploading photo", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Upload Your new photo
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          mt: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <input type="file" accept="image/*" style={{ display: "none" }} id="raise-file" onChange={handleFileChange} />
        <label htmlFor="raise-file">
          <Button variant="contained" component="span">
            {selectedFile ? "Change Photo" : "Choose Photo"}
          </Button>
        </label>

        {/* Hien thi preview anh up len */}
        {previewUrl && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="subtitle1" gutterBottom>
              Preview:
            </Typography>
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                maxWidth: "80%",
                maxHeight: "300px",
                objectFit: "contain",
                border: "1px solid #ccc",
              }}
            />
          </Box>
        )}

        {/* Nut upload */}
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleUpload} disabled={!selectedFile}>
          {loading === true ? "Loading..." : "Upload Photo"}
        </Button>
      </Paper>
    </Box>
  );
}

export default UploadPhoto;
