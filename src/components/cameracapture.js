import React, { useRef, useState } from 'react';

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use rear camera
        },
      });
      videoRef.current.srcObject = stream;
      setIsCameraOn(true);
    } catch (error) {
      console.error('Error accessing the camera:', error);
      alert('Unable to access the camera. Please check your permissions.');
    }
  };
  

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/png');
    onCapture(imageData);

    // Stop camera
    const stream = video.srcObject;
    stream.getTracks().forEach((track) => track.stop());
    setIsCameraOn(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result;
  
        // Set the preview image
        setPreview(base64Image);
  
        // Pass the image to the parent component
        onCapture(base64Image);
  
        // Store the image in localStorage (or sessionStorage)
        localStorage.setItem('uploadedImage', base64Image);
      };
      reader.readAsDataURL(file);
    }
  };
  

  return (
    <div>
      <button onClick={startCamera} disabled={isCameraOn}>Use Camera</button>
      {isCameraOn && (
        <div>
          <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }} />
          <button onClick={captureImage}>Capture Image</button>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div>
        <h3>Or Upload a Photo:</h3>
        <input type="file" accept="image/*" onChange={handleFileUpload} />
      </div>
    </div>
  );
};

export default CameraCapture;
