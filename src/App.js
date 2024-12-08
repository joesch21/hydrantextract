import React, { useState, useEffect } from "react";
import CameraCapture from "./components/cameracapture";
import TextExtractor from "./components/textextractor";
import { fetchData } from "./components/dbHelper";
import "./App.css";

const App = () => {
  const [image, setImage] = useState(null);
  const [storedData, setStoredData] = useState([]);

  // Function to load data from Dexie
  const loadStoredData = async () => {
    try {
      const data = await fetchData(); // Fetch data from the database
      console.log("Fetched records:", data);
      setStoredData(data || []); // Set the state with fetched data
    } catch (error) {
      console.error("Error fetching stored data:", error);
    }
  };

  useEffect(() => {
    // Load stored data on component mount
    loadStoredData();
  }, []);

  return (
    <div className="App">
      <h1>Docket Uploader</h1>
      {!image && <CameraCapture onCapture={(image) => setImage(image)} />}
      {image && (
        <TextExtractor
          image={image}
          onSubmit={loadStoredData} // Refresh data after form submission
        />
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
