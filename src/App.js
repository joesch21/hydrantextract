import React, { useState, useEffect } from "react";
import CameraCapture from "./components/cameracapture";
import TextExtractor from "./components/textextractor";
import { fetchData } from "./components/dbHelper";
import "./App.css";

const App = () => {
  const [image, setImage] = useState(null); // State to hold the captured image
  const [storedData, setStoredData] = useState([]); // State to hold the fetched records from Dexie

  /**
   * Fetch and load stored data from the database
   */
  const loadStoredData = async () => {
    try {
      const data = await fetchData(); // Fetch data from Dexie.js
      console.log("Fetched records:", data);
      setStoredData(data || []); // Set the state with fetched data or an empty array if none
    } catch (error) {
      console.error("Error fetching stored data:", error);
    }
  };

  /**
   * Initialize by loading stored data when the component mounts
   */
  useEffect(() => {
    loadStoredData();
  }, []);

  return (
    <div className="App">
      <h1>Docket Uploader</h1>
      
      {/* Camera Capture or Text Extraction */}
      {!image ? (
        <CameraCapture onCapture={(capturedImage) => setImage(capturedImage)} />
      ) : (
        <TextExtractor
          image={image}
          onSubmit={loadStoredData} // Refresh stored data after a new record is inserted
        />
      )}
      
      {/* Display the stored records */}
      <h2>Stored Data:</h2>
      <ul>
        {storedData.length > 0 ? (
          storedData.map((record) => (
            <li key={record.id}>
              <strong>Ticket:</strong> {record.ticket || "N/A"} |{" "}
              <strong>Flight:</strong> {record.flight || "N/A"} |{" "}
              <strong>Destination:</strong> {record.destination || "N/A"} |{" "}
              <strong>Uplift:</strong> {record.uplift || "N/A"}L
            </li>
          ))
        ) : (
          <p>No data stored yet. Submit a record to see it here!</p>
        )}
      </ul>
    </div>
  );
};

export default App;
