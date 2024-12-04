import { v4 as uuidv4 } from 'uuid';
import { Ticket } from '../models/ticket.model.js';

const buyTicket = async (req, res) => {

    console.log('Authenticated User:', req.user);
    const { source, destination, price } = req.body;

    // Assuming userId comes from the authenticated user's token (req.user)
    const userId = req.user ? req.user._id : null;

    if (!price || !source || !destination) {
        return res.status(400).send('Missing required fields: source, destination, or price');
    }

    try {
        const ticketToken = uuidv4(); // Unique ticket ID
        const saveTicket = { userId, ticketToken, source, destination, price };

        // Save ticket to database
        const ticket = new Ticket(saveTicket);
        await ticket.save();

        res.status(200).json({
            success: true,
            message: 'Payment successful',
            ticket: {
                userId: req.user._id,
                token: ticketToken,
                source,
                destination,
                price,
                issuedAt: ticket.issuedAt,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Payment failed', error });
    }
};

export default buyTicket;