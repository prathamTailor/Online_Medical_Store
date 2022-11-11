const express = require('express');
const { createProduct, getAllProducts, updateProduct, deleteProduct, getProductDetails, createProductReview, deleteReview, getProductAllReview } = require('../controller/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/admin/product/new").post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

// Update and delete both have same url so in one line.
router.route("/admin/product/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct).delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router.route("/product/:id").get(getProductDetails)
router.route("/product/:id/review").put(isAuthenticatedUser, createProductReview);
router.route("/product/:id/reviews").get(getProductAllReview);
// router.route("/product/:id/review/:reviewId").delete(isAuthenticatedUser, deleteReview);
router.route("/product/reviews").delete(isAuthenticatedUser, deleteReview);
router.route("/reviews").get(getProductAllReview);

module.exports = router;