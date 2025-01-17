import React, { useState } from "react";

const RefuelForm = ({ formData, handleFormChange, handleFormSubmit }) => {
  const [isManualEntry, setIsManualEntry] = useState(false);

  const toggleManualEntry = () => {
    setIsManualEntry((prev) => !prev);
  };

  return (
    <div>
      <button type="button" onClick={toggleManualEntry} className="toggle-button">
        {isManualEntry ? "Switch to Extracted Data" : "Switch to Manual Entry"}
      </button>

      <form onSubmit={handleFormSubmit}>
        {[
          { label: "Flight Number", name: "flight", placeholder: "Enter flight number" },
          { label: "Destination", name: "destination", placeholder: "Enter destination" },
          { label: "Time Finish", name: "timeFinish", type: "time" },
          { label: "Bay", name: "bay", placeholder: "Enter bay" },
          { label: "Registration Number", name: "registration", placeholder: "Enter registration number" },
          { label: "Uplift (L)", name: "uplift", placeholder: "Enter uplift in liters", type: "number" },
          { label: "Ticket Number", name: "ticket", placeholder: "Enter ticket number" },
          { label: "Airline", name: "airline", placeholder: "Enter airline" },
          { label: "Aircraft Type", name: "aircraftType", placeholder: "Enter aircraft type" },
          { label: "Vehicle", name: "vehicle", placeholder: "Enter vehicle" },
          { label: "Meter Start", name: "meterStart", placeholder: "Enter meter start", type: "number" },
          { label: "Meter Stop", name: "meterStop", placeholder: "Enter meter stop", type: "number" },
          { label: "Pit", name: "pit", placeholder: "Enter pit" },
          { label: "Date", name: "date", placeholder: "Enter date", type: "date" },
          // New Fields
          { label: "Start Figure", name: "startFigure", placeholder: "Enter start figure", type: "number" },
          { label: "DP", name: "dp", placeholder: "Enter DP value", type: "number" },
          { label: "Flow", name: "flow", placeholder: "Enter flow value", type: "number" },
        ].map(({ label, name, placeholder, type = "text" }) => (
          <div key={name}>
            <label htmlFor={name}>{label}</label>
            <input
              type={type}
              id={name}
              name={name}
              value={formData[name] || ""}
              onChange={handleFormChange}
              placeholder={placeholder}
              disabled={!isManualEntry} // Disable manual input if not in manual mode
            />
          </div>
        ))}

        <button type="submit" disabled={!isManualEntry && !Object.values(formData).some((v) => v)}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default RefuelForm;
