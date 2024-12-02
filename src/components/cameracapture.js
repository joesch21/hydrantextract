import React, { useRef, useState } from 'react';

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setIsCameraOn(true);
    } catch (error) {
      console.error('Error accessing the camera:', error);
      alert('Unable to access the camera.');
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

  return (
    <div>
      {!isCameraOn && <button onClick={startCamera}>Start Camera</button>}
      {isCameraOn && (
        <div>
          <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }} />
          <button onClick={captureImage}>Capture Image</button>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default CameraCapture;
