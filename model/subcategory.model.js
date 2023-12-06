import mongoose from "mongoose";
import categorysModel from "./categorys.model";


const Schema = mongoose.Schema;

const subCategorySchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    category:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: categorysModel,
    },
    image:{
        type: String,
        required: false,
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model("Sub-category", subCategorySchema);