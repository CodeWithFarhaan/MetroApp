import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

const authToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized Access' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = user; // Attach user to request
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token', error: error.message });
    }
};
export default authToken;