import React, { useState, useEffect } from "react";
import CameraCapture from "./components/cameracapture";
import TextExtractor from "./components/textextractor";
import { fetchData, clearData } from "./components/dbHelper"; // Use clearData
import "./App.css";

const App = () => {
  const [image, setImage] = useState(null);
  const [storedData, setStoredData] = useState([]);
  const [totalUplift, setTotalUplift] = useState(0); // Running total of uplifts

  // Function to load data from Dexie
  const loadStoredData = async () => {
    try {
      const data = await fetchData(); // Fetch data from the database
      console.log("Fetched records:", data);
      setStoredData(data || []); // Set the state with fetched data

      // Calculate the running total of uplift
      const total = data.reduce((sum, record) => {
        const uplift = parseFloat(record.uplift) || 0;
        return sum + uplift;
      }, 0);
      setTotalUplift(total);
    } catch (error) {
      console.error("Error fetching stored data:", error);
    }
  };

  // Reset the database
  const handleResetData = async () => {
    if (window.confirm("This will reset all data! Are you sure?")) {
      try {
        await clearData(); // Clear the Dexie database
        setStoredData([]); // Reset the local state
        setTotalUplift(0); // Reset the total uplift
        alert("Data reset successfully!");
      } catch (error) {
        console.error("Error resetting data:", error);
        alert("Failed to reset data.");
      }
    }
  };

  // Handle file selection
  const handleFileSelection = (file) => {
    console.log("File selected:", file);
    setImage(file); // Set the selected image
  };

  useEffect(() => {
    // Load stored data on component mount
    loadStoredData();
  }, []);

  return (
    <div className="App">
      <h1>Docket Uploader</h1>
      <h2>Total Uplift: {totalUplift} L</h2>
      {!image && (
        <CameraCapture onCapture={(image) => handleFileSelection(image)} />
      )}
      {image && (
        <TextExtractor
          image={image}
          onSubmit={loadStoredData} // Refresh data after form submission
        />
      )}
      <button className="reset-button" onClick={handleResetData}>
        Reset Data
      </button>
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
    </div>
  );
};

export default App;
