import { Router } from "express";
import examsController from "../controllers/examsController";
import CheckExam from "../middleware/CheckExam";
import ExamValidation from "../middleware/ExamValidation";
import isDistrictUser from "../middleware/isDistrictUser";
import isStudent from "../middleware/isStudent";

const router=Router();

router.post('/', ExamValidation, CheckExam, examsController.addExam);
router.get('/',examsController.getAllExam);
router.get('/find/:id',examsController.findOneExam);
router.put('/:id',examsController.updateExam);
router.delete('/:id',examsController.deleteExam);
router.get('/examsbylevel',isStudent,examsController.getExamsByLevel);
router.get('/examsbylevel/:id',isStudent,examsController.getExamsAndQuestionById);

export default router;