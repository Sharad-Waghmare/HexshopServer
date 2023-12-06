import express from 'express';
import { addProduct,  deleteProduct,  getAllProduct, getProduct, updateProduct,   } from '../controller/products.controllers';


const router = express.Router();


router.get('/get-all-products', getAllProduct);

router.post('/get-add-products', addProduct);

router.get('/get-single-products/:product_id', getProduct);

router.put('/get-update-products/:product_id', updateProduct)

router.delete('/get-delete-products/:product_id', deleteProduct);

export default router; 