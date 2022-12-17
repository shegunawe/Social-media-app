import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        /* Generate a salt with bcrypt and use it to encrypt(hash) the password destructured from the request body */
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

/* LOGGING IN */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //To find the user with the same email as the one from the req body
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ msg: "User does not exist. " })

        //To check if the destructured password is the same as the one assigned to 'user' in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });
        
        //Assign a JWT after the user has succesfully logged in
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        //Delete password so it doesn't get sent to the client
        delete user.password;
        res.status(200).json({ token, user });
    } catch (error) {
        res.send(500).json({ "error": error.message });
    }
};