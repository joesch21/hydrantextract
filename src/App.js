import React, { useState, useEffect } from "react";
import CameraCapture from "./components/cameracapture";
import TextExtractor from "./components/textextractor";
import { fetchData, initDatabase } from "./components/dbHelper";
import Dexie from "dexie";
import "./App.css";

const App = () => {
  const [image, setImage] = useState(null);
  const [storedData, setStoredData] = useState([]);
  const [totalUplift, setTotalUplift] = useState(0);
  const [isResetChecked, setIsResetChecked] = useState(false);

  const loadStoredData = async () => {
    try {
      const data = await fetchData();
      setStoredData(data || []);
    } catch (error) {
      console.error("Error fetching stored data:", error);
    }
  };

  useEffect(() => {
    initDatabase();
    loadStoredData();
  }, []);

  useEffect(() => {
    const calculateTotalUplift = () => {
      const total = storedData.reduce((sum, record) => {
        const upliftValue = parseFloat(record.uplift || 0);
        return sum + upliftValue;
      }, 0);
      setTotalUplift(total);
    };

    calculateTotalUplift();
  }, [storedData]);

  const handleResetData = async () => {
    if (!isResetChecked) return;

    const confirmed = window.confirm(
      "This will reset all data! Are you sure you want to proceed?"
    );

    if (confirmed) {
      try {
        await Dexie.delete("RefuelDatabase");
        alert("All data has been reset!");
        setStoredData([]);
        setTotalUplift(0);
        setIsResetChecked(false); // Reset the checkbox
      } catch (error) {
        console.error("Error resetting database:", error);
      }
    }
  };

  const handleNextDocket = () => {
    setImage(null);
  };

  return (
    <div className="App">
      <div className="reset-container">
        <button
          className="reset-button"
          onClick={handleResetData}
          disabled={!isResetChecked}
        >
          Reset Data
        </button>
        <div className="reset-warning">
          <input
            type="checkbox"
            id="resetConfirm"
            checked={isResetChecked}
            onChange={(e) => setIsResetChecked(e.target.checked)}
          />
          <label htmlFor="resetConfirm">
            I understand this will erase all stored data.
          </label>
        </div>
      </div>
      <h1>Docket Uploader</h1>
      <h2>Total Uplift: {totalUplift.toFixed(2)} L</h2>
      {!image && <CameraCapture onCapture={(image) => setImage(image)} />}
      {image && (
        <>
          <TextExtractor
            image={image}
            onSubmit={loadStoredData}
          />
          <button className="next-docket-button" onClick={handleNextDocket}>
            Next Docket
          </button>
        </>
      )}
      <h2>Stored Data:</h2>
      <ul>
        {storedData.map((record) => (
          <li key={record.id}>
            <strong>Ticket:</strong> {record.ticket || "N/A"} |{" "}
            <strong>Flight:</strong> {record.flight || "N/A"} |{" "}
            <strong>Destination:</strong> {record.destination || "N/A"} |{" "}
            <strong>Uplift:</strong> {record.uplift || "N/A"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
