import express from 'express';
import authToken from '../middleware/authToken.js';
import userLogout from '../controller/userLogout.js';
import userLogin from '../controller/userLogin.js';
import userRegister from '../controller/userRegister.js';
import buyTicket from '../controller/BuyTicketController.js';
import verifyTicketToken from '../controller/verifyTicket.js';
const router = express.Router();

router.post('/register', userRegister);
router.post('/login', userLogin)
router.post('/logout', authToken, userLogout);
router.post('/buy-ticket', authToken , buyTicket);
router.post('/verify-ticket-token',authToken,verifyTicketToken);
export default router;