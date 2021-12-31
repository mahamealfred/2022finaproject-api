import { Router } from "express"
import authController from "../controllers/authController";
import Signupvalidation from "../middleware/SignupValidation";
import CheckUser from "../middleware/CheckUser";
import isAdmin from "../middleware/isAdmin";
import IsVerifiedAccount from "../middleware/isVerifiedAccount";



const router=Router();

router.post('/signup',Signupvalidation,CheckUser,authController.signup);
router.post('/login',CheckUser,IsVerifiedAccount.isVerified, authController.login);
router.get('/',authController.getAllUser);
router.get('/find/:id',authController.getOneUser);
router.delete('/:id',authController.deleteUser);
router.get('/activate-email/:token',authController.activateAccount);
router.put('/forgot-password',CheckUser, authController.forgotPassword);
router.post('reset-password/:token',authController.resetPassword);

export default router;