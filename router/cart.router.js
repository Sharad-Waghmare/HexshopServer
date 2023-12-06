import express from "express";
import { addToCart, deleteQuantity, getCartItems, removeFromCart, updateQuantity } from "../controller/cart.controller";


const router = express.Router();


router.get('/get-cart', getCartItems);

router.get('/get-add-cart/:productID', addToCart);

router.patch('/get-update-quantity/:cart_id', updateQuantity);

router.delete('/get-delete-cartItem/:cart_id', removeFromCart);

router.delete("/get-delete-Quantity/:cart_id", deleteQuantity);


export default router;