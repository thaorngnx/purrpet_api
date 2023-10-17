import mongoose from "mongoose";
const Schema = mongoose.Schema;

export const productSchema = new Schema({
    productCode: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required:true
    },
    description: {
        type: String,
        required:true
    },
    price: {
        type: Number,
        required:true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        index: false,
    },
    images: {
        type: Array,
        required:true
    },
    status: {
        type: String,
        enum: {
            values: ["ACTIVE", "INACTIVE"],
            message: "{VALUE} is not supported",
        },
        default: "ACTIVE"
    },
    createAt: {
        type: Number,
        default: Date.now()
    },
    updateAt: {
        type: Number,
        default: Date.now()
    },
    createBy: {
        type: Number
    },
    updateBy: {
        type: Number 
    }
});

export default mongoose.model("product", productSchema);

