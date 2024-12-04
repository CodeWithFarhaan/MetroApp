import { User } from "../models/user.model.js";
import bycrptjs from 'bcryptjs';
import JWT from 'jsonwebtoken'
const userLogin = async (req ,res)=> {
    try {
        const {email, password} = req.body;

        if(!email){
            return res.status(422).json({message: "plase enter email"})
        }
        if(!password){
            return res.status(422).json({message: "please enter password"})
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(422).json({message: "Please Enter Password", error: true});
        }
        const checkPassword = await bycrptjs.compare(password, user.password);
        if(!checkPassword){
            return res.status(422).json({ message: "Invalid email or password", error: true });
        }
            const token = JWT.sign({ _id: user._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: '7d' });
            
            res.cookie('token', token, {
                httpOnly: true,  // Prevent access to the cookie from JavaScript
                secure: process.env.NODE_ENV === 'production',  // Only send cookie over HTTPS in production
            });

            res.status(200).json({
                success: true,
                message: "Login Successfully",
                token: token,
                user: {
                    _id: user._id,    
                    name: user.name,
                    email: user.email,
                }
            });
    } catch (error) {
        res.status(500).json({message: "Internal Server Error", error: error.message})
    }
}

export default userLogin