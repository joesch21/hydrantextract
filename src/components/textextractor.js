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

  // Function to extract text from the image using Tesseract
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

      // Parse the extracted text into structured data
      const parsedData = parseTextToFormData(text);
      setFormData(parsedData);
    } catch (error) {
      console.error("Error processing image:", error);
      setText("Error recognizing text.");
    } finally {
      setProcessing(false);
    }
  };

  // Parse extracted text into structured form data
  const parseTextToFormData = (extractedText) => {
    const lines = extractedText.split("\n");

    return {
      flight: extractField(lines, /Flight No[:\s]+(.+)/i),
      destination: extractField(lines, /Destination[:\s]+(.+)/i),
      time: extractField(lines, /Time Finish[:\s]+([\d:]+ [APMapm]+)/i),
      bay: extractField(lines, /Stand[:\s]+(.+)/i),
      registration: extractField(lines, /Reg. No[:\s]+(.+)/i),
      uplift: extractUplift(lines), // Extract uplift with proper parsing
      dp: "",
      flow: "",
      hose: "",
      walkaround: "Completed",
      ticket: extractField(lines, /Ticket No[:\s]+(.+)/i),
    };
  };

  // Extract the uplift value and convert it to a number
  const extractUplift = (lines) => {
    for (const line of lines) {
      const match = line.match(/Total Uplift[:\s]+([\d,]+)\s*L/i);
      if (match) {
        return match[1].replace(/,/g, ""); // Remove commas for numerical parsing
      }
    }
    return "0"; // Default to 0 if not found
  };

  // Generic field extraction utility
  const extractField = (lines, regex) => {
    for (const line of lines) {
      const match = line.match(regex);
      if (match) return match[1].trim();
    }
    return "";
  };

  // Handle changes to form fields
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);

    try {
      await insertData(formData); // Insert data into Dexie
      onSubmit(); // Refresh data in the parent component
      alert("Data submitted successfully!");
    } catch (error) {
      console.error("Error submitting form data:", error);
      alert("Failed to submit data.");
    }
  };

  return (
    <div>
      {image && <img src={image} alt="Captured" style={{ maxWidth: "100%" }} />}
      <button onClick={extractText} disabled={processing}>
        {processing ? "Processing..." : "Extract Text"}
      </button>
      <div>
        <h3>Extracted Text:</h3>
        <p>{text || "No text yet!"}</p>
      </div>
      <RefuelForm
        formData={formData}
        handleFormChange={handleFormChange}
        handleFormSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default TextExtractor;
