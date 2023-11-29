import mongoose from "mongoose";
mongoose.set("runValidators", true);

const Schema = mongoose.Schema;
export const otpSchema = new Schema(
    {
        purrPetCode: {
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
        },
        otp: {
            type:Number,
            required: true,
        },
        createBy: {
            type: String,
        },
        updateBy: {
            type: String,
        },
    },
    { timestamps: true }
);
export default mongoose.model("otp", otpSchema);