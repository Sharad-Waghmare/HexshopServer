import express from "express";
import { addOrder, getOrder } from "../controller/order.controller";


const router = express.Router();


router.get('/get-order/:user_id', getOrder);

router.post('/add-order', addOrder);



export default router;