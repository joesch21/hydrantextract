import React from "react";
import { deleteRecord } from "./dbHelper";

const StoredDataTable = ({ storedData, setStoredData, loadStoredData }) => {
  const handleDeleteRecord = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await deleteRecord(id);
        loadStoredData(); // Refresh the data
        alert("Record deleted.");
      } catch (error) {
        console.error("Error deleting record:", error);
      }
    }
  };

  return (
    <div>
      <button
        className="toggle-button"
        onClick={() => setStoredData(!storedData.length)}
      >
        {storedData.length ? "Hide Stored Data" : "Show Stored Data"}
      </button>

      {storedData.length > 0 && (
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
              <th>Flow</th>
              <th>DP</th>
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
                <td>{record.flow}</td>
                <td>{record.dp}</td>
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
      )}
    </div>
  );
};

export default StoredDataTable;
