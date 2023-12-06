import mongoose from "mongoose";


const Schema = mongoose.Schema;

const categorysSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: false,
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    },
});

export default mongoose.model("Category", categorysSchema);