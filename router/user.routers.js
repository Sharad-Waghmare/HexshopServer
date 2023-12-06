import express from "express";
import { SingUp, addUser, deleteUser, generateOtp, getAllUsers, getUser, login, loginOtp, updateUser } from "../controller/user.controllers";




const router = express.Router();

router.get('/get-all-users', getAllUsers);

router.post('/add-users', addUser);

router.get('/get-single-users/:users_id', getUser);

router.put('/get-update-users/:users_id', updateUser);

router.delete('/get-delete-users/:users_id', deleteUser);

router.post('/signup', SingUp);

router.get('/signin', login);

router.get("/loginOtp", loginOtp);

router.patch("/generateotp", generateOtp);


export default router;