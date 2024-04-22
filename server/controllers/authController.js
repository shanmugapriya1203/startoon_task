import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cache } from "./userController.js";
export const signup=async(req,res,next)=>{
    const {name,email,password,gender}=req.body
    if (!email || !password || !name) {
        return res.status(400).json({ message: 'Please fill all the fields' });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        gender,
        
    });
    try {
        await newUser.save();
        res.json({ message: 'Signup successful' });  // Success response
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ message: 'Internal server error' });  // Error response
        next(error);
    }

}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password || email === '' || password === '') {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const validPassword = bcrypt.compareSync(password, validUser.password);

        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        validUser.count += 1;
        validUser.lastLoginDate = new Date();
        await validUser.save();

        const token = jwt.sign(
            { id: validUser._id, isAdmin: validUser.isAdmin }, 
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        const { password: userPassword, ...rest } = validUser._doc;
        cache.del(['allusers','userCounts'])
        res.status(200).cookie('access_token', token, { httpOnly: true }).json({ ...rest, access_token: token }); 

    } catch (error) {
        next(error);
    }
};