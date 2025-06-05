import React, { useState, useEffect, useContext } from "react";
import { Typography, Box, Paper, Button, Alert, CircularProgress } from "@mui/material";

import { AuthContext } from '../../contexts/AuthContext';
import fetchModel from "../../lib/fetchModelData";

function UploadPhoto() {
    const { isLoggedIn, user } = useContext(AuthContext);

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl); // Giai phong URL cu
            }
            console.log("File:", file);
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    }

    const handleUpload = async () => {
        if (!selectedFile) {
            setError("Please select a file to upload");
            return;
        }
        const formData = new FormData();
        formData.append('photo', selectedFile);
        try {
            const response = await fetchModel('http://localhost:8081/api/photo/new', {
                method: 'POST',
                body: formData,
                auth: true
            });
            if (response) {
                console.log("Uploaded photo!")
                setSelectedFile(null);
                setPreviewUrl(null);
                setError(null);
            }
        } catch (err) {
            console.error("Error uploading photo:", err);
            setError("Error when uploading photo");
        }
    };

    return (
        <div>
            <Typography variant="h5" gutterBottom>Upload your new photo</Typography>

            <Paper elevation={3} sx={{ p: 3, mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Button variant="contained" component="label">
                    Choose Photo
                    <input hidden type="file" accept="image/*" onChange={handleFileChange} />
                </Button>
                {/* Hien thi preview anh up len */}
                {previewUrl && (
                    <img src={previewUrl} alt="Preview"
                        style={{ maxWidth: '80%', maxHeight: '300px', objectFit: 'contain', border: '1px solid #ccc' }}
                    />
                )}

                {/* Nut upload */}
                <Button variant="contained" color="primary" sx={{ mt: 2 }}
                    onClick={handleUpload}
                    disabled={!selectedFile}
                >
                    UpLoad Photo
                </Button>

                {error && (
                    <div>{error}</div>
                )}
            </Paper>
        </div>
    )
}

export default UploadPhoto;