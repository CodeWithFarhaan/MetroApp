import React, { useState } from 'react';
import axios from 'axios';

const PaymentPage = ({ source, destination, price, userId }) => {
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [ticketToken, setTicketToken] = useState('');

    const handlePayment = async () => {
        try {
            const response = await axios.post('/api/tickets', {
                source,
                destination,
                price,
                userId,
            });
            setTicketToken(response.data.ticketToken);
            setPaymentSuccess(true);
        } catch (error) {
            console.error('Payment failed', error);
        }
    };

    return (
        <div>
            <h1>Payment Page</h1>
            <p>Source: {source}</p>
            <p>Destination: {destination}</p>
            <p>Price: ₹{price}</p>

            <button onClick={handlePayment}>Make Payment</button>

            {paymentSuccess && (
                <div>
                    <h2>Payment Successful!</h2>
                    <p>Your Ticket Token: {ticketToken}</p>
                </div>
            )}
        </div>
    );
};

export default PaymentPage;