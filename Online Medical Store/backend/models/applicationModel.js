const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    category: [
        {
            name: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        }
    ]
});

module.exports = mongoose.model("Application", applicationSchema);
