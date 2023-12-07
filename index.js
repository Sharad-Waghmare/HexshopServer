import express from "express";
// import Stripe from 'stripe';
import mongoose from "mongoose";
import userRouter from "./router/user.routers";
import categorysRouter from "./router/categorys.router";
import subcategoryRouter from "./router/subcategory.router";
import productsRouter from "./router/products.router";
import cartRouter from "./router/cart.router";
import orderRouter from "./router/order.router";


var app = express();
require("dotenv").config();
var cors = require('cors');


var PORT = process.env.PORT || PORT

var corsOptions = {
  origin:"*",
  optionsSuccessStatus:200,
}


app.use(cors(corsOptions))
app.use(express.json());
app.use(express.static(__dirname))

app.listen(PORT,()=>{
    console.log("server running on "+ PORT);
});

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: "true",
  useUnifiedTopology: "true"
})
.then(() => {
  console.log("DB Connetion Successfull");
})
.catch((err) => {
  console.log(err.message);
});

app.use('/users', userRouter);
app.use('/categories', categorysRouter);
app.use('/sub-categories', subcategoryRouter);
app.use('/products', productsRouter);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);
