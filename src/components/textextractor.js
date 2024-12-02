import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const TextExtractor = ({ image }) => {
  const [text, setText] = useState('');
  const [processing, setProcessing] = useState(false);

  const extractText = async () => {
    if (!image) return;
    setProcessing(true);
    try {
      const { data: { text } } = await Tesseract.recognize(image, 'eng', {
        logger: (info) => console.log(info),
      });
      setText(text);
    } catch (error) {
      console.error('Error processing image:', error);
      setText('Error recognizing text.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      {image && <img src={image} alt="Captured" style={{ maxWidth: '100%' }} />}
      <button onClick={extractText} disabled={processing}>
        {processing ? 'Processing...' : 'Extract Text'}
      </button>
      <div>
        <h3>Extracted Text:</h3>
        <p>{text || 'No text yet!'}</p>
      </div>
    </div>
  );
};

export default TextExtractor;
