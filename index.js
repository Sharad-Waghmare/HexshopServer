import express from "express";
// import Stripe from 'stripe';
import mongoose from "mongoose";
import userRouter from "./router/user.routers";
import categorysRouter from "./router/categorys.router";
import subcategoryRouter from "./router/subcategory.router";
import productsRouter from "./router/products.router";
import cartRouter from "./router/cart.router";
import orderRouter from "./router/order.router";

// const stripe = require('stripe')("sk_test_51O6rt0SFEXnUeQdhmLI5gPtdCRDGGS8kl1R9gXsNg7cmY9l9t7PefDVYPtZysdU9HN464un8Ejj1HtvuIQixVjoN0014GWhRc6");

var app = express();
var cors = require('cors');


var PORT = process.env.PORT || 8001

var corsOptions = {
  origin:"*",
  optionsSuccessStatus:200,
}

// checkout api
// app.post("/api/create-checkout-session",async(req,res)=>{
//   const {products} = req.body;
//   // console.log(products)

//   const lineitems = products.map((product)=>({
//     price_data:{
//       currency:"inr",
//       product_data:{
//         name:product.name
//       },
//       unit_amount:product.price *100,
//     },
//     quantity:product.quantity
//   }))

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types:["card"],
//     line_items:lineitems,
//     mode:"payment",
//     success_url:"http://localhost:3000/success",
//     cancel_url:"http://localhost:3000/cancel",
//   });

//   res.json({id:session.id})
// })


app.use(cors(corsOptions))
app.use(express.json());
app.use(express.static(__dirname))

app.listen(PORT,()=>{
    console.log("server running on "+ PORT);
});

mongoose.connect('mongodb://0.0.0.0:27017/projectData')
  .then(() => console.log('Connected!'));

app.use('/users', userRouter);
app.use('/categories', categorysRouter);
app.use('/sub-categories', subcategoryRouter);
app.use('/products', productsRouter);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);
