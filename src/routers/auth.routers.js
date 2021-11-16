import { Router } from "express"
import authController from "../controllers/authController";
import Signupvalidation from "../middleware/SignupValidation";
import CheckUser from "../middleware/CheckUser";
import isAdmin from "../middleware/isAdmin";
import IsVerifiedAccount from "../middleware/isVerifiedAccount";



const router=Router();

router.post('/signup',Signupvalidation,CheckUser,authController.signup);
router.post('/login',CheckUser,IsVerifiedAccount.isVerified, authController.login);
router.get('/',isAdmin, authController.getAllUser);
router.get('/find/:id',isAdmin,authController.getOneUser);
router.delete('/:id',authController.deleteUser);
router.get('/activate-email/:token',authController.activateAccount);

export default router;