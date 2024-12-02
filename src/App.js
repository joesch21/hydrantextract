import React, { useState } from 'react';
import CameraCapture from './components/cameracapture';
import TextExtractor from './components/textextractor';
import './App.css';

const App = () => {
  const [image, setImage] = useState(null);

  return (
    <div className="App">
      <h1>Docket Uploader</h1>
      {!image && <CameraCapture onCapture={(image) => setImage(image)} />}
      {image && <TextExtractor image={image} />}
    </div>
  );
};

export default App;
