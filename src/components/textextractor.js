import React, { useState } from "react";
import Tesseract from "tesseract.js";
import RefuelForm from "./Refuelform";
import { insertData } from "./dbHelper";

const TextExtractor = ({ image, thumbnail, onSubmit }) => {
  const [text, setText] = useState("");
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    flight: "",
    destination: "",
    timeFinish: "",
    bay: "",
    registration: "",
    uplift: "",
    ticket: "",
    airline: "",
    aircraftType: "",
    vehicle: "",
    meterStart: "",
    meterStop: "",
    pit: "",
    date: "",
    startFigure: "",
    dp: "",
    flow: "",
  });
  const [isFileLoaded, setIsFileLoaded] = useState(false);

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
      setFormData((prev) => ({ ...prev, ...parsedData })); // Update with parsed data
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
      ticket: extractField(lines, /Ticket No[:\s]+(\d+)/i),
      airline: extractField(lines, /Airline[:\s]+(.+)/i),
      flight: extractField(lines, /Flight No[:\s]+(.+)/i),
      aircraftType: extractField(lines, /Aircraft Type[:\s]+(.+)/i),
      stand: extractField(lines, /Stand[:\s]+(\d+)/i),
      vehicle: extractField(lines, /Vehicle[:\s]+(.+)/i),
      meterStart: extractField(lines, /Meter Start[:\s]+(\d+)/i),
      meterStop: extractField(lines, /Meter Stop[:\s]+(\d+)/i),
      timeFinish: extractField(lines, /Time Finish[:\s]+([\d:]+)/i),
      uplift: extractField(lines, /Total Uplift[:\s]+([\d,]+)\s*L/i),
      pit: extractField(lines, /Pit[:\s]+(.+)/i),
      destination: extractField(lines, /Destination[:\s]+(.+)/i),
      registration: extractField(lines, /Reg\. No[:\s]+(.+)/i),
      date: extractField(lines, /Date[:\s]+([\d/]+)/i),
    };
  };

  const extractField = (lines, regex) => {
    for (const line of lines) {
      const match = line.match(regex);
      if (match) return match[1].trim();
    }
    return ""; // Return empty if not found
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);

    try {
      const dataToSave = { ...formData, thumbnail }; // Include the thumbnail
      await insertData(dataToSave); // Save data to Dexie
      onSubmit(); // Refresh the parent component (if needed)
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
          onLoad={() => setIsFileLoaded(true)}
        />
      )}

      <div className="file-container">
        <button
          className="extract-button"
          disabled={!isFileLoaded}
          onClick={extractText}
        >
          {processing ? "Processing..." : "Extract Text"}
        </button>
      </div>

      <div>
        <h3>Extracted Text:</h3>
        <p>{text || "No text extracted!"}</p>
      </div>

      <RefuelForm
        formData={formData}
        handleFormChange={(e) => {
          const { name, value } = e.target;
          setFormData((prev) => ({ ...prev, [name]: value }));
        }}
        handleFormSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default TextExtractor;
