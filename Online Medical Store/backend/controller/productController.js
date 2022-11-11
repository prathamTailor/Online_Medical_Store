const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const DeleteController = require('./deleteController');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ApiFeatures = require("../utils/apiFeatures");

// Get all product
exports.getAllProducts = catchAsyncErrors(
    async (req, res, next) => {
        const apiFeatures = new ApiFeatures(Product.find(), req.query).search().filter().pagination();
        const products = await apiFeatures.query;
        res.status(200).json({
            success: true,
            products
        });
    });

// Get a product details
exports.getProductDetails = catchAsyncErrors(
    async (req, res, next) => {
        const product = await Product.findById(req.params.id,);
        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }
        res.status(200).json({
            success: true,
            product
        });

    });

/// Only accessble by ``ADMIN``
// Craete product 
exports.createProduct = catchAsyncErrors(
    async (req, res, next) => {
        // for storing referrence of user into product document
        req.body.createdBy = req.user.id;
        const product = await Product.create(req.body);
        res.status(201).json({
            success: true,
            product
        });

    });

/// Only accessble by ADMIN
// Update product
exports.updateProduct = catchAsyncErrors(
    async (req, res, next) => {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }
        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });
        res.status(200).json({
            success: true,
            product
        });
    });

/// Only accessble by ADMIN
// Delete Product
exports.deleteProduct = catchAsyncErrors(
    async (req, res, next) => {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }
        await DeleteController.createDocument(product, 'products');
        await product.remove();
        res.status(200).json({
            success: true,
            message: `Product ${process.env.DELETE_AFTER != 0
                ? `moved to trash${process.env.DELETE_AFTER !== 'undefined'
                    ? ` it will be deleted after ${process.env.DELETE_AFTER} time.`
                    : '.'
                }`
                : 'has been deleted successfully.'}`,
        });
    });

// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const productId = req.params.id;
    const { rating, comment } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };
    const product = await Product.findById(productId);
    if (!product) {
        return next(new ErrorHandler("Product is not found", 400));
    }
    const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString());
    let avgRating = 0;
    if (isReviewed) {
        product.reviews.forEach(rev => {
            if (rev.user.toString() === req.user._id.toString())
                (rev.rating = rating), (rev.comment = comment);
            avgRating += rev.rating;
        });
    } else {
        product.reviews.push(review);
        product.reviews.forEach(rev => {
            avgRating += rev.rating;
        });
        product.numOfReviews = product.reviews.length;
    }
    product.rating = avgRating / product.numOfReviews;
    product.save({
        validateBeforeSave: false,
    });
    res.status(200).json({
        success: true,
    });
});


// Get All Reviews of a product
exports.getProductAllReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    if (!product) {
        return next(new ErrorHandler("Product is not found", 400));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
});

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    // const product = Product.findById(req.params.id);
    const product = Product.findById(req.query.productId);
    if (!product) {
        return next(new ErrorHandler("Product is not found", 404));
    }

    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.reviewId.toString());
    if(reviews.length != product.length -1){
        return next(new ErrorHandler("Review is not found", 404));
    }
    let avgRating = 0;
    product.reviews.forEach(rev => {
        avgRating += rev.rating;
    });
    
    // product.numOfReviews = product.reviews.length;
    // product.rating = avgRating / product.numOfReviews;

    let rating = 0;
    if(reviews.length === 0){
        rating = 0;
    }else{
        rating = avgRating / reviews.length;
    }

    let numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        rating,
        numOfReviews
    }, {
        new: true,
        runValidators: false,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
        message: "Review deleted successfully"
    });


    // // const reviews = product.reviews.filter(rev => rev._id.toString() !== req.params.reviewId.toString());
    // const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.reviewId.toString());
    // let avgRating = 0;
    // product.reviews.forEach(rev => {
    //     avgRating += rev.rating;
    // });
    // product.numOfReviews = product.reviews.length;
    // product.rating = avgRating / product.numOfReviews;
    // await Product.findByIdAndUpdate(req.params.id, {
    //     reviews,
    //     rating,
    //     numOfReviews
    // }, {
    //     new: true,
    //     runValidators: true,
    //     useFindAndModify: false
    // })
    // res.status(200).json({
    //     success: true,
    //     message: "Review deleted successfully",
    //     reviews: product.reviews
    // });
});
