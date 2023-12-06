import express from "express";
import { getAddcategoryData, getCategories, getDeletecat, getSingleCategory, getUpdatecategory } from "../controller/categorys.controllers";


const router = express.Router();

router.get('/get-category', getCategories);

router.post('/get-add-category', getAddcategoryData);

router.get('/get-single-categorys/:category_id', getSingleCategory);

router.put('/get-udpate-categorys/:category_id', getUpdatecategory);

router.delete('/get-delete-categorys/:category_id', getDeletecat)

export default router;