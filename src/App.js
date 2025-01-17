import React, { useState, useEffect } from "react";
import CameraCapture from "./components/cameracapture";
import TextExtractor from "./components/textextractor";
import { fetchData, clearData, deleteRecord } from "./components/dbHelper";
import EmailSender from "./components/emailsender";

import "./App.css";

const App = () => {
  const [image, setImage] = useState(null); // For camera-captured or uploaded image
  const [extracted, setExtracted] = useState(false); // Text extraction status
  const [storedData, setStoredData] = useState([]); // Data from database
  const [runningTotal, setRunningTotal] = useState(0); // Total uplift
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [modalImage, setModalImage] = useState(null); // Modal for image preview
  const [showTable, setShowTable] = useState(false); // Toggle stored data table

  // Load stored data from database
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
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch data on mount
  useEffect(() => {
    loadStoredData();
  }, []);

  // Handle next flight (reset image and extraction state)
  const handleNextFlight = () => {
    setImage(null);
    setExtracted(false);
  };

  // Reset all stored data
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

  // Delete a specific record
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

  // Capture an image (camera or upload) and generate a thumbnail
  const handleCaptureImage = (capturedImage) => {
    const generateThumbnail = (image) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const thumbnailWidth = 300;
      const thumbnailHeight = 300;

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

  // Send data via email using mailto link
  const sendEmailLocally = () => {
    if (storedData.length === 0) {
      alert("No data to send.");
      return;
    }

    const emailBody = storedData
      .map((record, index) => {
        const fields = Object.entries(record)
          .filter(([key]) => key !== "thumbnail")
          .map(([key, value]) => `${key}: ${value || "N/A"}`)
          .join("\n");
        return `Record ${index + 1}:\n${fields}`;
      })
      .join("\n\n---\n\n");

    const recipient = "recipient@example.com";
    const subject = encodeURIComponent("Refuel Data Report");
    const body = encodeURIComponent(
      `Hello,\n\nHere is the refuel data:\n\n${emailBody}\n\nBest regards.`
    );

    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  };

  // Open modal to display full-size image
  const openModal = (imageSrc) => {
    setModalImage(imageSrc);
  };

  // Close image modal
  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <div className="App">
      {isLoading ? (
        <div className="loading">
          <div className="spinner"></div>
          <h2>Loading, please wait...</h2>
        </div>
      ) : (
        <>
          <h1>Docket Uploader</h1>
          <h2>Running Total: {runningTotal.toFixed(2)} L</h2>

          {/* Camera or Upload Section */}
          {!image && (
            <CameraCapture
              onCapture={(capturedImage) => handleCaptureImage(capturedImage)}
            />
          )}

          {/* Text Extraction Section */}
          {image && (
            <button
              className={`extract-button ${!extracted ? "flash" : ""}`}
              onClick={() => setExtracted(true)}
              disabled={extracted}
            >
              Extract Text
            </button>
          )}

          {image && extracted && (
            <>
              <TextExtractor
                image={image.original}
                thumbnail={image.thumbnail}
                onSubmit={loadStoredData}
              />
              <button className="next-docket-button" onClick={handleNextFlight}>
                Next Flight
              </button>
            </>
          )}

          {/* Stored Data Toggle Button */}
          <button
            className="toggle-button"
            onClick={() => setShowTable(!showTable)}
          >
            {showTable ? "Hide Stored Data" : "Show Stored Data"}
          </button>

          {/* Stored Data Table */}
          <div className={`stored-data-container ${showTable ? "open" : "closed"}`}>
            {storedData.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Flight</th>
                    <th>Destination</th>
                    <th>Time Finish</th>
                    <th>Bay</th>
                    <th>Registration</th>
                    <th>Uplift (L)</th>
                    <th>Airline</th>
                    <th>Airport</th>
                    <th>Aircraft Type</th>
                    <th>Vehicle</th>
                    <th>Meter Start</th>
                    <th>Meter Stop</th>
                    <th>Pit</th>
                    <th>Date</th>
                    <th>Start Figure</th>
                    <th>DP</th>
                    <th>Flow</th>
                    <th>Operator</th>
                    <th>Thumbnail</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {storedData.map((record) => (
                    <tr key={record.id}>
                      <td>{record.ticket}</td>
                      <td>{record.flight}</td>
                      <td>{record.destination}</td>
                      <td>{record.timeFinish}</td>
                      <td>{record.bay}</td>
                      <td>{record.registration}</td>
                      <td>{record.uplift}</td>
                      <td>{record.airline}</td>
                      <td>{record.airport}</td>
                      <td>{record.aircraftType}</td>
                      <td>{record.vehicle}</td>
                      <td>{record.meterStart}</td>
                      <td>{record.meterStop}</td>
                      <td>{record.pit}</td>
                      <td>{record.date}</td>
                      <td>{record.startFigure}</td>
                      <td>{record.dp}</td>
                      <td>{record.flow}</td>
                      <td>{record.operator}</td>
                      <td>
                        <img
                          src={record.thumbnail || ""}
                          alt="Thumbnail"
                          style={{ width: "50px", height: "50px", cursor: "pointer" }}
                          onClick={() => openModal(record.thumbnail || "")}
                        />
                      </td>
                      <td>
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteRecord(record.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No data available.</p>
            )}
          </div>

          {/* Image Modal */}
          {modalImage && (
            <div className="modal">
              <div className="modal-content">
                <span className="close-button" onClick={closeModal}>
                  &times;
                </span>
                <img src={modalImage} alt="Full size" className="modal-image" />
              </div>
            </div>
          )}

          {/* Reset and Email Section */}
          <div className="button-container">
            <button className="reset-button" onClick={handleResetData}>
              Reset Data
            </button>
            <EmailSender storedData={storedData} />
            <button className="email-button" onClick={sendEmailLocally}>
              Send Data via Email (Local)
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
