import { Router} from "express";
import schoolController from "../controllers/schoolController";
import CheckSchool from "../middleware/CheckSchool";
import SchoolValidation from "../middleware/SchoolValidation";
const router=Router();

router.post('/newSchool',SchoolValidation, CheckSchool, schoolController.addSchool);
router.get('/',schoolController.getAllSchool);
router.get('/find/:id',schoolController.findOneSchool);
router.delete('/:id',schoolController.deleteSchool);
router.put('/:id',schoolController.updateSchool);

export default router;