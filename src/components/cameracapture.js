import React, { useRef, useState } from 'react';

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [preview, setPreview] = useState(null); // For previewing uploaded or captured images

  const startCamera = async () => {
    try {
      // Ensure the video element is available
      if (!videoRef.current) {
        alert('Camera element is not ready. Please refresh the page and try again.');
        return;
      }
  
      // Request camera access with preferred facing mode
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' }, // Prefer rear camera
        },
      });
  
      // Attach the camera stream to the video element
      videoRef.current.srcObject = stream;
      setIsCameraOn(true);
    } catch (error) {
      // Handle any errors during camera access
      console.error('Error accessing the camera:', error);
      if (error.name === 'NotAllowedError') {
        alert('Camera access was denied. Please allow camera permissions in your browser settings.');
      } else if (error.name === 'NotFoundError') {
        alert('No camera was found on this device.');
      } else {
        alert(`Unable to access the camera: ${error.message}. Please check your permissions.`);
      }
    }
  };
  

  // Capture an image from the camera
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/png');
    setPreview(imageData); // Show the captured image as a preview
    onCapture(imageData); // Pass the image data to the parent component

    // Stop the camera
    stopCamera();
  };

  // Stop the camera stream
  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsCameraOn(false);
  };

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

      {/* Camera Controls */}
      <div>
        <button onClick={startCamera} disabled={isCameraOn}>
          Use Camera
        </button>
        {isCameraOn && (
          <div>
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }} />
            <button onClick={captureImage}>Capture Image</button>
          </div>
        )}
      </div>

      {/* Hidden canvas for capturing image */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* File Upload */}
      <div>
        <h3>Or Upload a Photo:</h3>
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

export default CameraCapture;
