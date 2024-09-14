const User = require('../models/user.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getDataUri = require('../utils/dataUri.js');
const cloudinary = require('../utils/cloudinary.js');

// Registration of user
module.exports.register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        if (!fullname || !email || !phoneNumber || !role || !password) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Profile photo is required",
                success: false,
            });
        }

        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        // Check if user exists or not
        const user = await User.findOne({ email });
        if (user) {
           a
        }

        // Hashing of password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creation of user
        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: cloudResponse.secure_url,
            },
        });

        return res.status(201).json({
            message: "Account created successfully",
            success: true,
        });

    } catch (e) {
        console.log('Error while creating user:', e);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

// Login user
module.exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !role || !password) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        // Check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account does not exist with this role",
                success: false,
            });
        }

        // Generating token
        const tokenData = {
            userId: user._id,
        };

        // Returning user data
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true,
        });
    } catch (e) {
        console.log('Error while logging in user:', e);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

// Logout user
module.exports.logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logout successfully",
            success: true,
        });
    } catch (e) {
        console.log('Error while logging out user:', e);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

// Update profile
module.exports.updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const userId = req.id; // Middleware authentication

        // Check if user exists
        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false,
            });
        }

        // Handle file upload (if exists)
        let cloudResponse;
        if (req.file) {
            const fileUri = getDataUri(req.file);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        }

        // Update user data
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skills.split(",");
        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url;
            user.profile.resumeOriginalName = req.file.originalname;
        }

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            user,
            success: true,
        });

    } catch (e) {
        console.log('Error while updating profile:', e);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};
