import { Router } from "express";
import examsController from "../controllers/examsController";
import CheckExam from "../middleware/CheckExam";
import ExamValidation from "../middleware/ExamValidation";
import isDistrictUser from "../middleware/isDistrictUser";

const router=Router();

router.post('/', ExamValidation, CheckExam, examsController.addExam);
router.get('/',examsController.getAllExam);
router.get('/find/:id',examsController.findOneExam);
router.put('/:id',examsController.updateExam);
router.delete('/:id',examsController.deleteExam);

export default router;