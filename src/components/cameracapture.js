import React, { useState } from 'react';

const PhotoUpload = ({ onCapture }) => {
  const [preview, setPreview] = useState(null); // For previewing uploaded images

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result;

        setPreview(base64Image); // Show the uploaded image as a preview
        onCapture(base64Image); // Pass the image data to the parent component

        // Optionally, store the image in localStorage
        localStorage.setItem('uploadedImage', base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <h1>Photo to Text</h1>

      {/* File Upload */}
      <div>
        <h3>Upload a Photo:</h3>
        <input type="file" accept="image/*" onChange={handleFileUpload} />
      </div>

      {/* Preview Section */}
      {preview && (
        <div>
          <h3>Preview:</h3>
          <img src={preview} alt="Preview" style={{ maxWidth: '100%', marginTop: '10px' }} />
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
