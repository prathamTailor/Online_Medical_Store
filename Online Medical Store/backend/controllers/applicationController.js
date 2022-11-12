const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Application = require("../models/applicationModel");

exports.createCategory = catchAsyncErrors(async (req, res, next) => {
    const { categoryName } = req.body;
    let category = await Application.find({}, {category:1});
    category = [...category, categoryName].filter(function(v, i, self)
    {
        return i == self.indexOf(v);
    });
    console.log(category);
    await Application.updateOne({
        "category": category
    });
    res.status(200).json({
        success: true,
        category
    });
});