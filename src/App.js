import React, { useState, useEffect } from "react";
import CameraCapture from "./components/cameracapture";
import TextExtractor from "./components/textextractor";
import { fetchData, clearData, deleteRecord } from "./components/dbHelper";
import "./App.css";

const App = () => {
  const [image, setImage] = useState(null);
  const [extracted, setExtracted] = useState(false);
  const [storedData, setStoredData] = useState([]);
  const [runningTotal, setRunningTotal] = useState(0);
  const [modalImage, setModalImage] = useState(null); // For enlarged image view

  // Load stored data and calculate running total
  const loadStoredData = async () => {
    try {
      const data = await fetchData();
      setStoredData(data || []);
      const total = data.reduce((sum, record) => {
        const uplift = parseFloat(record.uplift) || 0;
        return sum + uplift;
      }, 0);
      setRunningTotal(total);
    } catch (error) {
      console.error("Error fetching stored data:", error);
      setStoredData([]);
      setRunningTotal(0);
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
    if (window.confirm("This will delete all stored data. Proceed?")) {
      try {
        await clearData();
        setStoredData([]);
        setRunningTotal(0);
        alert("Data has been reset!");
      } catch (error) {
        console.error("Error resetting data:", error);
      }
    }
  };

  const handleDeleteRecord = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await deleteRecord(id);
        const updatedData = storedData.filter((record) => record.id !== id);
        setStoredData(updatedData);
        setRunningTotal(
          updatedData.reduce((sum, record) => sum + (parseFloat(record.uplift) || 0), 0)
        );
        alert("Record deleted.");
      } catch (error) {
        console.error("Error deleting record:", error);
      }
    }
  };

  const handleCaptureImage = (capturedImage) => {
    const generateThumbnail = (image) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const thumbnailWidth = 100;
      const thumbnailHeight = 100;

      canvas.width = thumbnailWidth;
      canvas.height = thumbnailHeight;

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, thumbnailWidth, thumbnailHeight);
        const thumbnail = canvas.toDataURL("image/jpeg");
        setImage({ original: capturedImage, thumbnail });
      };
      img.src = image;
    };

    generateThumbnail(capturedImage);
  };

  const openModal = (image) => {
    setModalImage(image); // Set the clicked image for modal view
  };

  const closeModal = () => {
    setModalImage(null); // Close the modal by resetting the state
  };

  return (
    <div className="App">
      <h1>Docket Uploader</h1>
      <h2>Running Total: {runningTotal.toFixed(2)} L</h2>

      {/* Step 1: Capture Image */}
      {!image && (
        <CameraCapture
          onCapture={(capturedImage) => handleCaptureImage(capturedImage)}
        />
      )}

      {/* Step 2: Extract Text */}
      {image && (
        <button
          className={`extract-button ${!extracted ? "flash" : ""}`}
          onClick={() => setExtracted(true)}
          disabled={extracted}
        >
          Extract Text
        </button>
      )}

      {/* Step 3: Display Extracted Text */}
      {image && extracted && (
        <>
          <TextExtractor
            image={image.original}
            onSubmit={loadStoredData}
          />
          <button className="next-docket-button" onClick={handleNextFlight}>
            Next Flight
          </button>
        </>
      )}

      {/* Stored Data Display */}
      <h2>Stored Data:</h2>
      {storedData.length > 0 ? (
        <ul>
          {storedData.map((record) => (
            <li key={record.id}>
              <img
                src={record.thumbnail || ""}
                alt="Thumbnail"
                style={{
                  width: "50px",
                  height: "50px",
                  marginRight: "10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => openModal(record.thumbnail || "")} // Open modal on click
              />
              <strong>Ticket:</strong> {record.ticket || "N/A"} |{" "}
              <strong>Flight:</strong> {record.flight || "N/A"} |{" "}
              <strong>Destination:</strong> {record.destination || "N/A"} |{" "}
              <strong>Uplift:</strong> {record.uplift || "N/A"} L |{" "}
              <strong>Time:</strong> {record.timeFinish || "N/A"}{" "}
              <button
                className="delete-button"
                onClick={() => handleDeleteRecord(record.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No data available.</p>
      )}

      {/* Reset Data Button */}
      <button className="reset-button" onClick={handleResetData}>
        Reset Data
      </button>

      {/* Modal for Enlarged Image */}
      {modalImage && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content">
            <img
              src={modalImage}
              alt="Enlarged View"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
