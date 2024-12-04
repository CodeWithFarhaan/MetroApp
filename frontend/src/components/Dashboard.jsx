import React, { useState, useEffect } from "react";
import { initiatePayment } from "../api.js"; // API call
import Logout from "./Logout.jsx";
import { IoMdTrain } from "react-icons/io";
import { MdCalculate } from "react-icons/md";
import { FaRupeeSign } from "react-icons/fa";

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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [ticketDetails, setTicketDetails] = useState(null); // State to hold ticket details
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    }
    if (selectedLine) {
      const lineData = metroData.find((line) => line.line === selectedLine);
      setStations(lineData ? lineData.stations : []);
    } else {
      setStations([]);
    }
  }, [selectedLine]);

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

  const handlePayment = async () => {
    if (!source || !destination || price === 0) {
      setError("Complete all fields and calculate the price before proceeding.");
      return;
    }
    setShowModal(true); // Show the modal to confirm the ticket details
    // Create a dummy ticket object to simulate a ticket before payment confirmation
    setTicketDetails({
      source,
      destination,
      price,
      issuedAt: new Date(),
      status: "Active",
      ticketToken: `TICKET-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    });
  };

  const confirmPayment = async () => {
    try {
      const paymentData = { source, destination, price };
      const response = await initiatePayment(paymentData);
      console.log(response)
      setSuccess(`Payment successful! Ticket Token: ${response.data.ticket.token}`);
      setError("");
      setShowModal(false); // Close the modal after successful payment
    } catch (err) {
      setError("An error occurred during payment. Please try again.");
      console.error(err);
    }
  };

  return (
    <>
      <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg space-y-6">
        <h1 className="text-2xl font-bold text-center text-purple-600 flex justify-between items-center relative">
          <div className="flex items-center">
            Metro <IoMdTrain className="ml-2 text-3xl" /> Ticket Booking
          </div>
          <div className="p-2">
            <Logout />
          </div>
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
        </div>

        <button
          className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition duration-300"
          onClick={calculatePrice}
        >
          <MdCalculate className="inline-block mr-2 text-2xl" />
          Calculate Ticket Price
        </button>

        {price > 0 && (
          <p className="text-xl text-green-600 mb-4">Price: ₹{price}</p>
        )}

        <button
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
          onClick={handlePayment}
        >
          <FaRupeeSign className="inline-block mr-2 text-2xl" />
          Proceed to Payment
        </button>

        {error && <p className="mt-4 text-red-500">{error}</p>}
        {success && <p className="mt-4 text-green-500">{success}</p>}
      </div>

      {/* Modal for Ticket Details */}
      {showModal && ticketDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-2xl font-bold text-center text-purple-600">Ticket Details</h2>
            <div className="mt-4">
              {/* <p><strong>User ID:</strong> {ticketDetails.userId}</p> */}
              <p><strong>Source:</strong> {ticketDetails.source}</p>
              <p><strong>Destination:</strong> {ticketDetails.destination}</p>
              <p><strong>Price:</strong> ₹{ticketDetails.price}</p>
              <p><strong>Issued At:</strong> {new Date(ticketDetails.issuedAt).toLocaleString()}</p>
              <p><strong>Status:</strong> {ticketDetails.status}</p>
              <p><strong>Ticket Token:</strong> {ticketDetails.ticketToken}</p>
            </div>
            <div className="mt-4 flex justify-between">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => setShowModal(false)} // Close modal without payment
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white py-2 px-4 rounded"
                onClick={confirmPayment} // Proceed with payment
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
