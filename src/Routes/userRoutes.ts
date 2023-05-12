import { getAllUsersController, registerusercontroller,resetPassword, getUserByUsername, authenticate} from "../Controllers/UserController";
import { Router } from "express";

 export const router=Router()

router.post('/adduser',registerusercontroller)
router.post('/reset-password',resetPassword)
router.get('/searchuser/:username',authenticate, getUserByUsername);
router.get('/getusers',getAllUsersController)
