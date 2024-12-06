import React, { useState, useEffect } from "react";

const metroData = [
  {
    line: "Line 1",
    stations: [
      { name: "Versova", distanceFromStart: 0 },
      { name: "D N Nagar", distanceFromStart: 1.5 },
      { name: "Azad Nagar", distanceFromStart: 3.0 },
      { name: "Andheri", distanceFromStart: 5.0 },
      { name: "Ghatkopar", distanceFromStart: 11.4 },
    ],
  },
  {
    line: "Line 2A",
    stations: [
      { name: "Dahisar East", distanceFromStart: 0 },
      { name: "Anand Nagar", distanceFromStart: 2.0 },
      { name: "Borivali West", distanceFromStart: 5.0 },
    ],
  },
];

const ValidateTicket = ({ ticket }) => {
  const [selectedLine, setSelectedLine] = useState("");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [stations, setStations] = useState([]);
  const [error, setError] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    if (selectedLine) {
      const lineData = metroData.find((line) => line.line === selectedLine);
      setStations(lineData ? lineData.stations : []);
    } else {
      setStations([]);
    }
  }, [selectedLine]);

  const handleValidTicket = () => {
    if (!source || !destination) {
      setError("Please select both source and destination.");
      return;
    }

    if (!ticket) {
      setError("No ticket found.");
      return;
    }

    // Check if the selected source and destination match the ticket's data
    if (ticket.source === source && ticket.destination === destination) {
      setValidationMessage("Your ticket is valid!");
      setError("");
    } else {
      setValidationMessage("Ticket is invalid for the selected route.");
      setError("");
    }
  };

  return (
    <>
      <div>
        <h1 className="text-2xl mb-4 font-bold text-center text-red-600">
          Check Your Ticket Validity
        </h1>
        <div className="space-y-4">
          <div className="mb-4">
            <label className="block text-gray-700">Select Line:</label>
            <select
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"
              value={selectedLine}
              onChange={(e) => setSelectedLine(e.target.value)}
            >
              <option value="">Select Line</option>
              {metroData.map((line) => (
                <option key={line.line} value={line.line}>
                  {line.line}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Select Source:</label>
            <select
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              disabled={!stations.length}
            >
              <option value="">Select Source</option>
              {stations.map((station) => (
                <option key={station.name} value={station.name}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Select Destination:</label>
            <select
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              disabled={!stations.length}
            >
              <option value="">Select Destination</option>
              {stations.map((station) => (
                <option key={station.name} value={station.name}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleValidTicket}
            className="w-full py-3 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
          >
            Validate Ticket
          </button>
          {error && <div className="text-red-600">{error}</div>}
          {validationMessage && (
            <div className="text-blue-600">{validationMessage}</div>
          )}
        </div>
      </div>
    </>
  );
};

export default ValidateTicket;
