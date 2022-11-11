const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Please enter product name"],
    },
    description: {
        type: String,
        required: [true, "Please enter product description"],
    },
    price: {
        type: Number,
        required: [true, "Please enter product price"],
        /// Why characters?(Not digit) it might have been fractional so upto two fractional point should allowed. 
        maxLength: [8, "Price can't exceed 8 characters"]
    },
    rating: {
        type: Number,
        default: 0,
        max: 5
    },
    images: [{
        /// We are using cloud-navy for hosting our images. and at uploading time it gives two thing public_id and url
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],
    category: {
        type: String,
        required: [true, "Please enter product price"],

    },
    stock: {
        type: Number,
        required: [true, "Please enter product stock"],
        maxLength: [4, "Stock cannot exceed 4 characters"],
        default: 1,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref:"User",
                required: true
            },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
        }
    ],
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref:"User",
        required: true
    }
},
    {
        collection: 'products',
        timestamps: true,
        strict: false // tells to mongoose that schema may "grow"
    });

module.exports = mongoose.model("Product", productSchema);