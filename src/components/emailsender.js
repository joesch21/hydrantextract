import React from "react";

const EmailSender = ({ storedData }) => {
  const sendEmail = () => {
    if (!storedData || storedData.length === 0) {
      alert("No data to send.");
      return;
    }

    // Generate HTML Table
    const emailTable = `
      <table border="1" style="width: 100%; text-align: left;">
        <thead>
          <tr>
            <th>Flight</th>
            <th>Dest.</th>
            <th>Time</th>
            <th>Bay</th>
            <th>Rego</th>
            <th>Start Fig.</th>
            <th>Uplift</th>
            <th>DP</th>
            <th>Flow</th>
            <th>Operator</th>
          </tr>
        </thead>
        <tbody>
          ${storedData
            .map(
              (record) => `
            <tr>
              <td>${record.flight || "N/A"}</td>
              <td>${record.destination || "N/A"}</td>
              <td>${record.timeFinish || "N/A"}</td>
              <td>${record.bay || "N/A"}</td>
              <td>${record.registration || "N/A"}</td>
              <td>${record.startFigure || "N/A"}</td>
              <td>${record.uplift || "N/A"}</td>
              <td>${record.dp || "N/A"}</td>
              <td>${record.flow || "N/A"}</td>
              <td>${record.operator || "N/A"}</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    `;

    // Encode as mailto link
    const recipient = "recipient@example.com";
    const subject = encodeURIComponent("Refuel Data Report");
    const body = encodeURIComponent(
      `<!DOCTYPE html>
      <html>
        <body>
          <h1>Refuel Data Report</h1>
          ${emailTable}
        </body>
      </html>`
    );

    // Using mailto with HTML body
    const emailLink = `mailto:${recipient}?subject=${subject}&body=${body}`;
    window.location.href = emailLink;
  };

  return (
    <button className="email-button" onClick={sendEmail}>
      
    </button>
  );
};

export default EmailSender;
