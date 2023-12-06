import mongoose from "mongoose";
import categorysModel from "./categorys.model";
import subCategoryModel from "./subcategory.model";


const Schema = mongoose.Schema;

const productsSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    category:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: categorysModel,
    },
    subcategory:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: subCategoryModel,
    },
    price:{
        type: Number,
        required: true,
    },
    quantity:{
        type: Number,
        required: true,
    },
    shortDescription:{
        type: String,
        default: null,
        maxLength: 500,
    },
    description:{
        type: String,
        default: null,
        maxLength: 500,
    },
    thumbnail: {
        type: String,
        default: null,
      },
      images: {
        type: String,
        default: null,
      },
    createdAt: {
        type: Date,
        default: Date.now(),
    },

});


export default mongoose.model('Products', productsSchema);