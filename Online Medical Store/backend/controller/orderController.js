const Order = require("../models/orderModel");
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const DeleteController = require('./deleteController');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

// Create new order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,

    });
    res.status(201).json({
        success: true,
        order,
    })
});


// Get logged user's own a order
exports.getMyOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.find({ _id: req.params.id, user: req.user._id }).populate("user", "email firstname surname");

    if (!order) {
        return next(new ErrorHandler(`Order not found with this id ${req.params.id}.`, 401));
    }

    res.status(201).json({
        success: true,
        order
    });
});

// Get loggedIn user's all orders
exports.getMyAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });

    res.status(201).json({
        success: true,
        orders
    });
});

// Get any user's order -- Admin
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
        return next(new ErrorHandler(`Order not found with this id ${req.params.id}.`, 401));
    }

    res.status(201).json({
        success: true,
        order
    });
});

// Get any user's orders -- Admin
exports.getUserAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.params.id });
    res.status(201).json({
        success: true,
        orders
    });
});

// Get all orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });

    res.status(201).json({
        success: true,
        totalAmount,
        orders
    });
});

// Update Order Status -- Admin
exports.updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have already delivered this order", 400));
    }
    order.orderItems.forEach(async (order) => {
        await updateStock(order.product, order.quantity);
    });

    order.orderStatus = req.body.status;

    if (req.body.status == "Delivered") {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });
    res.status(201).json({
        success: true,
        order
    });
});


async function updateStock(id, quantity){
    const product = await Product.findById(id);
    if(product.stock>=quantity){
        product.stock -= quantity;
        await product.save({validateBeforeSave: false});
    }else{
        return false;
    }
}

// Delete orders -- Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler(`Order not found with this id ${req.params.id}.`, 401));
    }

    await order.remove();

    res.status(201).json({
        success: true,
    });
});
