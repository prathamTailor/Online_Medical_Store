const express = require('express');
const { newOrder, getMyOrder, getSingleOrder, getMyAllOrders, getAllOrders, getUserAllOrders, deleteOrder, updateOrderStatus } = require('../controller/orderController');
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/orders/me").get(isAuthenticatedUser, getMyAllOrders);
router.route("/order/:id").get(isAuthenticatedUser, getMyOrder);

router.route("/admin/orders").get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);
router.route("/admin/orders/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getUserAllOrders);
router.route("/admin/order/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrderStatus)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder)
    .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleOrder);

module.exports = router;