const User = require('../models/userModels');
const ErrorHandler = require('../utils/errorHandler');
const DeleteController = require('./deleteController');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ApiFeatures = require("../utils/apiFeatures");
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { firstname, surname, email, password, confirmPassword } = req.body;
    if (!password) {
        return next(new ErrorHandler("Please enter password"), 400);
    } if (!confirmPassword) {
        return next(new ErrorHandler("Please enter confirm-password"), 400);
    } if (confirmPassword !== password) {
        return next(new ErrorHandler("Password and confirm-password does't matched", 400));
    }
    const user = await User.create({
        firstname, surname, email, password,
        avatar: {
            public_id: "This is sample id",
            url: "profileUrl"
        }
    });
    sendToken(user, 201, res);
});

// Login user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    // checking if user has given password and email bot
    if (!email || !password) {
        return next(new ErrorHandler("Please enter required fields", 400));
    }

    // Is only one user with entered email is there or not ?
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid email or password"), 401);
    }
    // Is password matched with encrepted password or not?
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }
    // If valid emial and password is there then we send cookie token.
    sendToken(user, 200, res);
});


// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        message: "Logged Out"
    });
});


// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler("User not found", 401));
    }

    // Get Resetpassword Token
    const resetToken = user.getResetPasswordToken();

    // update document with database 
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n${resetPasswordUrl}\n\nThis token will expired in ${process.env.RESET_PASSWORD_EXPIRE_MINUTE} minutes.\nIf you have not request this email then please ignore it.`;

    try {
        await sendEmail({
            email: user.email,
            subject: `${process.env.SHOP_NAME} Password Recovery`,
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email is sent to ${user.email} successfully`
        });
    } catch (error) {
        user.resetPasswordExpire = undefined;
        user.resetPasswordToken = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }
});


// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
        return next(new ErrorHandler("Reset password token is invalid or has been expired", 400));
    }
    const { password, confirmPassword } = req.body;

    if (!password) {
        return next(new ErrorHandler("Please enter password"), 400);
    } if (!confirmPassword) {
        return next(new ErrorHandler("Please enter confirm-password"), 400);
    } if (confirmPassword !== password) {
        return next(new ErrorHandler("Password and confirm-password does't matched", 400));
    }
    user.password = password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.save();
    sendToken(user, 200, res);
});


// Get user details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    // Assumed then in routes user authentication is added
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    });
});

// Update user password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    // Assumed then in routes user authentication is added
    const user = await User.findById(req.user.id).select("+password");
    if (!oldPassword) {
        return next(new ErrorHandler("Please enter old-password"), 400);
    }
    const isPasswordMatched = await user.comparePassword(oldPassword);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old-password is incorrect", 400));
    }
    if (!newPassword) {
        return next(new ErrorHandler("Please enter new-password"), 400);
    }
    if (!confirmPassword) {
        return next(new ErrorHandler("Please enter confirm-password"), 400);
    }
    if (confirmPassword !== newPassword) {
        return next(new ErrorHandler("New-password and confirm-password does't matched", 400));
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({
        success: true,
        user
    });
});

// Update User profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        firstname: req.body.firstname,
        surname: req.body.surname,
        email: req.body.email
    }
    // We will add cloudinary later

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        user
    });
});


// Get all users -- ADMIN
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
    // Assumed then in routes user admin authentication is added
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    });
});

// Get single user -- ADMIN
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    // Assumed then in routes user authentication is added
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`));
    }

    res.status(200).json({
        success: true,
        user
    });
});


// Update User profile & role -- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        firstname: req.body.firstname,
        surname: req.body.surname,
        email: req.body.email,
        role: req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        user
    });
});

// Delete User profile -- Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`, 401));
    }
    await DeleteController.createDocument(user, 'users');
    await user.remove();
    res.status(200).json({
        success: true,
        message: `User ${process.env.DELETE_AFTER != 0
            ? `moved to trash${process.env.DELETE_AFTER !== 'undefined'
                ? ` it will be deleted after ${process.env.DELETE_AFTER} time.`
                : '.'
            }`
            : 'has been deleted successfully.'}`,
    });
});
