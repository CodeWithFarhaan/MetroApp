import React, { useState, useEffect } from "react";
import { initiatePayment, verifyTicketToken } from "../api.js"; // Add the new API call
import Logout from "./Logout.jsx";
import { IoMdTrain } from "react-icons/io";
import { MdCalculate } from "react-icons/md";
import { FaRupeeSign } from "react-icons/fa";
import ReactQRCode from "react-qr-code";
import ValidateTicket from "./ValidateTicket.jsx";
import { jsPDF } from "jspdf";
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

const Dashboard = () => {
  const [selectedLine, setSelectedLine] = useState("");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [price, setPrice] = useState(0);
  const [stations, setStations] = useState([]);
  const [ticketToken, setTicketToken] = useState(
    localStorage.getItem("ticketToken") || ""
  );
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [ticketHistory, setTicketHistory] = useState([]); // Add state to store ticket history
  const [showTicketModal, setShowTicketModal] = useState(false); // Show modal for ticket details
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
  }

  useEffect(() => {
    setTicketToken("");
  }, []);

  useEffect(() => {
    if (selectedLine) {
      const lineData = metroData.find((line) => line.line === selectedLine);
      setStations(lineData ? lineData.stations : []);
    } else {
      setStations([]);
    }
  }, [selectedLine]);

  // Calculate price logic
  const calculatePrice = () => {
    const sourceStation = stations.find((station) => station.name === source);
    const destinationStation = stations.find(
      (station) => station.name === destination
    );

    if (sourceStation && destinationStation) {
      const distance = Math.abs(
        destinationStation.distanceFromStart - sourceStation.distanceFromStart
      );
      setPrice(distance * 10); // ₹10 per km
      setError("");
    } else {
      setPrice(0);
      setError("Please select valid source and destination stations.");
    }
  };

  // Handle payment
  const handlePayment = async () => {
    if (!source || !destination || price === 0) {
      setError(
        "Complete all fields and calculate the price before proceeding."
      );
      return;
    }

    setError(""); // Reset error state before processing payment
    setSuccess(""); // Reset success state

    try {
      const paymentData = { source, destination, price };
      const response = await initiatePayment(paymentData);
      console.log(response);
      setSuccess(
        `Payment successful! Ticket Token: ${response.data.ticket.token}`
      );
    } catch (err) {
      setError("An error occurred during payment. Please try again.");
      console.error(err);
    }
  };

  // Verify ticket
  const handleVerifyTicket = async () => {
    const tokenToVerify = ticketToken || localStorage.getItem("ticketToken");
    if (!tokenToVerify) {
      setError("Please enter valid ticket token");
      return;
    }

    try {
      const response = await verifyTicketToken(tokenToVerify);
      if (response.data.success) {
        setTicket(response.data.ticket);
        setTicketHistory([...ticketHistory, response.data.ticket]); // Add ticket to history
        setError("");
        setSuccess("Ticket Verified Successfully");
      } else {
        setError("Ticket Not Found");
        setTicket(null);
      }
    } catch (err) {
      setError("An error occurred during ticket verification");
      console.error(err);
    }
  };

  // Function to generate the ticket as a styled PDF
  const downloadTicketAsPDF = () => {
    if (!ticket) {
      alert("No ticket available to download");
      return;
    }

    const doc = new jsPDF();

    // Setting up a ticket-like layout
    const margin = 10;
    const width = 180;
    const height = 100;
    const qrSize = 40;

    // Add a ticket background with rounded corners
    doc.setFillColor(255, 255, 255); // White background
    doc.setDrawColor(0, 0, 0); // Black border color
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, margin, width, height, 10, 10, "FD"); // Rectangle with rounded corners

    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Metro Ticket", margin + 10, margin + 20);

    // Ticket Information
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    doc.text(`Source: ${ticket.source}`, margin + 10, margin + 30);
    doc.text(`Destination: ${ticket.destination}`, margin + 10, margin + 40);
    doc.text(`Price: ₹${ticket.price}`, margin + 10, margin + 50);
    doc.text(
      `Issued At: ${new Date(ticket.issuedAt).toLocaleString()}`,
      margin + 10,
      margin + 60
    );
    doc.text(`Status: ${ticket.status}`, margin + 10, margin + 70);

    // Download the PDF
    doc.save("ticket.pdf");
  };
  const toggleTicketModal = () => {
    setShowTicketModal(!showTicketModal);
  };
  return (
    <>
      <div className="p-8 max-w-full sm:max-w-3xl mx-auto bg-white shadow-lg rounded-xl space-y-8">
        <h1 className="text-3xl font-semibold text-center text-purple-700 flex justify-between items-center relative">
          <div className="flex items-center text-xl">
            Metro <IoMdTrain className="ml-2 text-3xl" /> Ticket Booking
          </div>
          <div className="p-2 flex space-x-4">
            {/* View Past Ticket Button */}
            <button
              className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-200"
              onClick={toggleTicketModal}
            >
              Past Ticket
            </button>
            {/* Logout Button */}
            <Logout />
          </div>
        </h1>
        <div className="space-y-6">
          {/* Line Selection */}
          <div className="mb-4">
            <label className="block text-gray-700 text-lg">Select Line:</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
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

          {/* Source Selection */}
          <div className="mb-4">
            <label className="block text-gray-700 text-lg">
              Select Source:
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
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

          {/* Destination Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 text-lg">
              Select Destination:
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
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
        </div>

        {/* Calculate Price Button */}
        <button
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition duration-300 flex justify-center items-center"
          onClick={calculatePrice}
        >
          <MdCalculate className="inline-block mr-2 text-2xl" />
          Calculate Ticket Price
        </button>

        {/* Display calculated price */}
        {price > 0 && (
          <p className="text-xl text-green-600 mt-4">Price: ₹{price}</p>
        )}

        {/* Payment Button */}
        <button
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300 mt-4 flex justify-center items-center"
          onClick={handlePayment}
        >
          <FaRupeeSign className="inline-block mr-2 text-2xl" />
          Proceed to Payment
        </button>

        {/* Error or Success Message */}
        {error && <p className="mt-4 text-red-500">{error}</p>}
        {success && <p className="mt-4 text-green-500">{success}</p>}

        {/* Ticket Verification Section */}
        <div>
          <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">
            Verify Your Ticket
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              value={ticketToken}
              onChange={(e) => setTicketToken(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Your Ticket Token"
            />
            <button
              onClick={handleVerifyTicket}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              Verify Ticket
            </button>
          </div>

          {/* Display Ticket Details */}
          {ticket && (
            <div className="mt-6 p-6 bg-gray-100 border border-gray-300 rounded-lg shadow-sm space-y-4">
              <div>
                <p>
                  <strong>Source:</strong> {ticket.source}
                </p>
                <p>
                  <strong>Destination:</strong> {ticket.destination}
                </p>
                <p>
                  <strong>Price:</strong> ₹{ticket.price}
                </p>
                <p>
                  <strong>Issued At:</strong>{" "}
                  {new Date(ticket.issuedAt).toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong> {ticket.status}
                </p>
              </div>
              <div className="mt-4">
                <ReactQRCode value={JSON.stringify(ticket)} />
              </div>
              {/* Download Ticket Button */}
              <button
                onClick={downloadTicketAsPDF}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 mt-4"
              >
                Download as PDF
              </button>
            </div>
          )}
        </div>
        <ValidateTicket ticket={ticket} />

        {/* Ticket History Modal */}
        {showTicketModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-11/12 sm:w-96 md:w-80 lg:w-1/3 xl:w-1/4 max-h-[90vh] overflow-auto">
              <h2 className="text-xl font-semibold text-center mb-4">
                Past Ticket Details
              </h2>
              {ticketHistory.length > 0 ? (
                ticketHistory.map((ticket, index) => (
                  <div
                    key={index}
                    className="mb-4 p-4 border rounded-lg shadow-sm"
                  >
                    <p>
                      <strong>Source:</strong> {ticket.source}
                    </p>
                    <p>
                      <strong>Destination:</strong> {ticket.destination}
                    </p>
                    <p>
                      <strong>Price:</strong> ₹{ticket.price}
                    </p>
                    <p>
                      <strong>Issued At:</strong>{" "}
                      {new Date(ticket.issuedAt).toLocaleString()}
                    </p>
                    <p>
                      <strong>Status:</strong> {ticket.status}
                    </p>
                    <ReactQRCode value={JSON.stringify(ticket)} />
                  </div>
                ))
              ) : (
                <p>No past tickets available</p>
              )}
              <button
                onClick={toggleTicketModal}
                className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
