import { Router} from "express";
import schoolController from "../controllers/schoolController";

const router=Router();

router.post('/newSchool',schoolController.addSchool);

export default router;