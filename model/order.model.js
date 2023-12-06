import mongoose from "mongoose";
import userModels from "./user.models";
import productsModel from "./products.model";


const Schema = mongoose.Schema;


const orderSchema = new Schema({
    userID:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: userModels
    },
    productID:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: productsModel
    },
    name:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    quantity:{
        type:Number,
        required: true,
    },
    thumbnail:{
        type: String,
        required: true,
    },
});

export default mongoose.model("Order", orderSchema)