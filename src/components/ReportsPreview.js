import React from "react";

const ReportsPreview = ({ storedData }) => {
  return (
    <div>
      <h2>Rendered Report</h2>
      {storedData && storedData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Flight</th>
              <th>Destination</th>
              <th>Time</th>
              <th>Bay</th>
              <th>Registration</th>
              <th>Start Figure</th>
              <th>Uplift</th>
              <th>DP</th>
              <th>Flow</th>
              <th>Operator</th>
              <th>Meter Start</th>
              <th>Meter Finish</th>
              <th>Total Litres Pumped</th>
              <th>Discrepancy</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {storedData.map((record, index) => (
              <tr key={index}>
                <td>{record.flight || "N/A"}</td>
                <td>{record.destination || "N/A"}</td>
                <td>{record.time || "N/A"}</td>
                <td>{record.bay || "N/A"}</td>
                <td>{record.registration || "N/A"}</td>
                <td>{record.startFigure || "N/A"}</td>
                <td>{record.uplift || "N/A"}</td>
                <td>{record.dp || "N/A"}</td>
                <td>{record.flow || "N/A"}</td>
                <td>{record.operator || "N/A"}</td>
                <td>{record.meterStart || "N/A"}</td>
                <td>{record.meterFinish || "N/A"}</td>
                <td>{record.totalLitresPumped || "N/A"}</td>
                <td>{record.discrepancy || "N/A"}</td>
                <td>{record.comments || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available for the report.</p>
      )}
    </div>
  );
};

export default ReportsPreview;


