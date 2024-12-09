import React, { useState } from "react";
import Tesseract from "tesseract.js";
import RefuelForm from "./Refuelform";
import { insertData } from "./dbHelper";

const TextExtractor = ({ image, onSubmit }) => {
  const [text, setText] = useState("");
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    flight: "",
    destination: "",
    time: "",
    bay: "",
    registration: "",
    uplift: "",
    dp: "",
    flow: "",
    walkaround: "Completed",
    ticket: "",
  });
  const [isFileLoaded, setIsFileLoaded] = useState(false); // File loaded state
  const [isTextExtracted, setIsTextExtracted] = useState(false); // Text extraction state

  const extractText = async () => {
    if (!image) return;
    setProcessing(true);
    try {
      const {
        data: { text },
      } = await Tesseract.recognize(image, "eng", {
        logger: (info) => console.log(info),
      });

      setText(text);

      const parsedData = parseTextToFormData(text);
      setFormData(parsedData);
      setIsTextExtracted(true); // Enable the submit button
    } catch (error) {
      console.error("Error processing image:", error);
      setText("Error recognizing text.");
    } finally {
      setProcessing(false);
    }
  };

  const parseTextToFormData = (extractedText) => {
    const lines = extractedText.split("\n");

    return {
      flight: extractField(lines, /Flight No[:\s]+(.+)/i),
      destination: extractField(lines, /Destination[:\s]+(.+)/i),
      time: extractField(lines, /Time Finish[:\s]+([\d:]+ [APMapm]+)/i),
      bay: extractField(lines, /Stand[:\s]+(.+)/i),
      registration: extractField(lines, /Reg. No[:\s]+(.+)/i),
      uplift: extractUplift(lines),
      dp: "",
      flow: "",
      walkaround: "Completed",
      ticket: extractField(lines, /Ticket No[:\s]+(.+)/i),
    };
  };

  const extractUplift = (lines) => {
    for (const line of lines) {
      const match = line.match(/Total Uplift[:\s]+([\d,]+)\s*L/i);
      if (match) {
        return match[1].replace(/,/g, ""); // Remove commas for numerical parsing
      }
    }
    return "0"; // Default to 0 if not found
  };

  const extractField = (lines, regex) => {
    for (const line of lines) {
      const match = line.match(regex);
      if (match) return match[1].trim();
    }
    return "";
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);

    try {
      await insertData(formData); // Insert data into Dexie
      onSubmit(); // Refresh the data list in the parent component
      alert("Data submitted successfully!");
    } catch (error) {
      console.error("Error submitting form data:", error);
      alert("Failed to submit data.");
    }
  };

  return (
    <div>
      {image && (
        <img
          src={image}
          alt="Captured"
          style={{ maxWidth: "100%" }}
          onLoad={() => setIsFileLoaded(true)} // Trigger on file load
        />
      )}

      <div className="file-container">
        <button
          className="extract-button"
          disabled={!isFileLoaded} // Disable if file is not loaded
          onClick={extractText}
        >
          {processing ? "Processing..." : "Extract Text"}
        </button>
      </div>

      <div>
        <h3>Extracted Text:</h3>
        <p>{text || "No text yet!"}</p>
      </div>

      <RefuelForm
        formData={formData}
        handleFormChange={handleFormChange}
        handleFormSubmit={handleFormSubmit}
        isSubmitEnabled={isTextExtracted} // Enable only after text extraction
      />
    </div>
  );
};

export default TextExtractor;
