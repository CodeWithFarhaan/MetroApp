import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User collection
        ref: 'User',
    },
    source: {
        type: String,
        required: true,
        trim: true,
    },
    destination: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    issuedAt: {
        type: Date,
        default: Date.now, // Automatically sets to the current date/time
    },
    status: {
        type: String,
        enum: ['Active', 'Cancelled', 'Completed'], // Track ticket status
        default: 'Active',
    },
    ticketToken: {
        type: String,
        unique: true,
        required: true,
    },
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Ensure unique ticket token generation on each save
ticketSchema.pre('save', function (next) {
    if (!this.ticketToken) {
        this.ticketToken = `TICKET-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }
    next();
});

export const Ticket = mongoose.model('Ticket', ticketSchema);