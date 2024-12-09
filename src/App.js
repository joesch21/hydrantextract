import React, { useState, useEffect } from "react";
import CameraCapture from "./components/cameracapture";
import TextExtractor from "./components/textextractor";
import { fetchData, initDatabase } from "./components/dbHelper";
import Dexie from "dexie"; // Import Dexie for reset functionality
import "./App.css";

const App = () => {
  const [image, setImage] = useState(null);
  const [storedData, setStoredData] = useState([]);
  const [totalUplift, setTotalUplift] = useState(0);

  // Load stored data from Dexie
  const loadStoredData = async () => {
    try {
      const data = await fetchData(); // Fetch data from the database
      setStoredData(data || []);
    } catch (error) {
      console.error("Error fetching stored data:", error);
    }
  };

  useEffect(() => {
    // Initialize the database and load stored data on component mount
    initDatabase();
    loadStoredData();
  }, []);

  // Calculate the running total whenever storedData changes
  useEffect(() => {
    const calculateTotalUplift = () => {
      const total = storedData.reduce((sum, record) => {
        const upliftValue = parseFloat(record.uplift || 0); // Safely parse uplift value
        return sum + upliftValue;
      }, 0);
      setTotalUplift(total);
    };

    calculateTotalUplift();
  }, [storedData]);

  // Function to reset all data in the database
  const handleResetData = async () => {
    try {
      await Dexie.delete("RefuelDatabase"); // Delete the entire Dexie database
      alert("All data has been reset!");
      setStoredData([]); // Clear the state after reset
      setTotalUplift(0); // Reset the running total
    } catch (error) {
      console.error("Error resetting database:", error);
    }
  };

  // Function to clear the current image and allow for new uploads
  const handleNextDocket = () => {
    setImage(null); // Clear the current image
  };

  return (
    <div className="App">
      <button className="reset-button" onClick={handleResetData}>
        Reset Data
      </button>
      <h1>Docket Uploader</h1>

      {/* Display the running total of Uplift */}
      <h2>Total Uplift: {totalUplift.toFixed(2)} L</h2>

      {!image && <CameraCapture onCapture={(image) => setImage(image)} />}
      {image && (
        <>
          <TextExtractor
            image={image}
            onSubmit={loadStoredData} // Refresh data after form submission
          />
          <button className="next-docket-button" onClick={handleNextDocket}>
            Next Docket
          </button>
        </>
      )}
      <h2>Stored Data:</h2>
      {/* Display the stored data */}
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
