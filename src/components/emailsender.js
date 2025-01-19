import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const EmailSender = ({ storedData, logoPath }) => {
  const reportRef = useRef();

  // Trigger print
  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
  });

  return (
    <div>
      <button className="render-button" onClick={handlePrint}>
        Render & Print Data Report
      </button>

      {/* Hidden Report for Rendering */}
      <div ref={reportRef} style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        {/* Logo and Header */}
        <div style={{ textAlign: "center" }}>
          <img
            src={logoPath}
            alt="SkyTanking Logo"
            style={{ maxWidth: "200px", marginBottom: "20px" }}
          />
          <h1>DAILY RUN SHEET - QUALITY CHECKS AND METER LOG</h1>
        </div>

        {/* Table */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr>
              {[
                "FLIGHT",
                "DEST.",
                "TIME",
                "BAY",
                "REGO",
                "ON TIME STATUS",
                "START FIG.",
                "UPLIFT",
                "1000LT CHECK",
                "INLET VISUAL",
                "CWD/EWS",
                "DP",
                "FLOW",
                "LITRES",
                "360° WALKAROUND",
              ].map((header) => (
                <th
                  key={header}
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {storedData.map((record, index) => (
              <tr key={index}>
                {[
                  record.flight || "",
                  record.destination || "",
                  record.timeFinish || "",
                  record.bay || "",
                  record.registration || "",
                  "", // ON TIME STATUS
                  record.startFigure || "",
                  record.uplift || "",
                  "", // 1000LT CHECK
                  "", // INLET VISUAL
                  "", // CWD/EWS
                  record.dp || "",
                  record.flow || "",
                  "", // LITRES
                  "", // 360° WALKAROUND
                ].map((field, idx) => (
                  <td
                    key={idx}
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    {field}
                  </td>
                ))}
              </tr>
            ))}
            {/* Add empty rows for missing data */}
            {storedData.length === 0 && (
              <tr>
                <td colSpan="15" style={{ textAlign: "center", padding: "10px" }}>
                  No Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer Section */}
        <div style={{ marginTop: "30px", fontSize: "12px" }}>
          <p>
            * Confirmation that the fuelling was conducted with water below 30ppm throughout
            the entire fuelling. If interruption to fuelling occurred, procedure WP-012-ST was
            followed.
          </p>
          <p>
            ** All Vehicle QC Sampling carried out as per WP-009.
          </p>
        </div>

        {/* Comments and Signature */}
        <div style={{ marginTop: "30px" }}>
          <p>METER START =</p>
          <p>METER FINISH =</p>
          <p>TOTAL LITRES PUMPED =</p>
          <p>DISCREPANCY =</p>
          <p>COMMENTS: PLEASE ENSURE YOU HAVE YOUR TWO-WAY RADIO ON YOU AND TURNED ON AT ALL TIMES SO THE SUPERVISOR CAN CONTACT YOU.</p>
          <p>OPERATOR SIGN: ________________________</p>
        </div>
      </div>
    </div>
  );
};

export default EmailSender;
