import React, { useState, useEffect } from "react";
import CameraCapture from "./components/cameracapture";
import TextExtractor from "./components/textextractor";
import { fetchData, clearData } from "./components/dbHelper";
import "./App.css";

const App = () => {
  const [image, setImage] = useState(null);
  const [extracted, setExtracted] = useState(false);
  const [storedData, setStoredData] = useState([]);
  const [runningTotal, setRunningTotal] = useState(0);

  // Load stored data and calculate the running total
  const loadStoredData = async () => {
    try {
      const data = await fetchData();
      console.log("Fetched records:", data);

      const total = data.reduce((sum, record) => {
        const uplift = parseFloat(record.uplift) || 0;
        return sum + uplift;
      }, 0);

      setStoredData(data || []);
      setRunningTotal(total);
    } catch (error) {
      console.error("Error fetching stored data:", error);
    }
  };

  useEffect(() => {
    loadStoredData();
  }, []);

  const handleNextFlight = () => {
    setImage(null);
    setExtracted(false);
  };

  const handleResetData = async () => {
    const confirmReset = window.confirm(
      "This will delete all stored data. Are you sure you want to reset? This is typically done at the end of the shift."
    );
    if (confirmReset) {
      await clearData();
      setStoredData([]);
      setRunningTotal(0);
      alert("All data has been reset!");
    }
  };

  return (
    <div className="App">
      <h1>Docket Uploader</h1>
      <h2>Running Total: {runningTotal} L</h2>

      {/* Step 1: Capture Image */}
      {!image && (
        <CameraCapture
          onCapture={(capturedImage) => {
            setImage(capturedImage);
          }}
        />
      )}

      {/* Step 2:  */}
      {image && (
        <button
          className={`extract-button ${!extracted ? "flash" : ""}`}
          onClick={() => setExtracted(true)}
          disabled={extracted}
        >
          
        </button>
      )}

      {/* Step 3: Display Extracted Text & Submit Data */}
      {image && extracted && (
        <>
          <TextExtractor
            image={image}
            onSubmit={() => {
              loadStoredData();
            }}
          />
          {/* Submit Data Button */}
          

          {/* Next Flight Button */}
          <button className="next-docket-button" onClick={handleNextFlight}>
            Enter Next Flight
          </button>
        </>
      )}

      {/* Stored Data Display */}
      <h2>Stored Data:</h2>
      <ul>
        {storedData.map((record) => (
          <li key={record.id}>
            <strong>Ticket:</strong> {record.ticket || "N/A"} |{" "}
            <strong>Flight:</strong> {record.flight || "N/A"} |{" "}
            <strong>Destination:</strong> {record.destination || "N/A"} |{" "}
            <strong>Uplift:</strong> {record.uplift || "N/A"} L
          </li>
        ))}
      </ul>

      {/* Reset Data Button */}
      <button className="reset-button" onClick={handleResetData}>
        Reset Data
      </button>
    </div>
  );
};

export default App;
