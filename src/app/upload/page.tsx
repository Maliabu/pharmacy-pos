/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';

const UploadForm = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Store the uploaded image URL
  const [isUploading, setIsUploading] = useState(false); // Track upload status

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  // Function to upload the file to the API route
  const uploadFile = async (file: File) => {
    setIsUploading(true); // Set uploading state to true

    const formData = new FormData();
    formData.append('file', file); // Add file to form data

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setImageUrl(result.fileUrl); // Set the image URL from the response
      } else {
        console.error('Upload failed:', result.error);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false); // Reset the uploading state
    }
  };

  return (
    <div>
      <h2>Upload Image</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      {isUploading && <p>Uploading...</p>}
      {imageUrl && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={imageUrl} alt="Uploaded Image" width="300" />
        </div>
      )}
    </div>
  );
};

export default UploadForm;
