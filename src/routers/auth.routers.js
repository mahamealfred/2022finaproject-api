import { Router } from "express"
import authController from "../controllers/authController";
import Signupvalidation from "../middleware/SignupValidation";
import CheckUser from "../middleware/CheckUser";
import isAdmin from "../middleware/isAdmin";


const router=Router();

router.post('/signup', Signupvalidation,CheckUser,authController.signup);
router.post('/login',CheckUser,authController.login);
router.get('/',isAdmin, authController.getAllUser);
router.get('/find/:id',isAdmin,authController.getOneUser);
router.delete('/:id',authController.deleteUser);

export default router;