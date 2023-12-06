import express from "express";
import { getAddsubcategory, getDeletesubcat, getSinglesubcat, getSubcategory, getUpdatesubcategory } from "../controller/subcategory.controllers";


const router = express.Router();


router.get('/get-subcat', getSubcategory);

router.post('/get-add-subcat', getAddsubcategory);

router.get('/get-single-subcategory/:subcategory_id', getSinglesubcat);

router.put('/get-update-subcategory/:subcategory_id', getUpdatesubcategory);

router.delete('/get-delete-subcategory/:subcategory_id', getDeletesubcat);

export default router;