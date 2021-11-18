import { Router } from "express";
import examsController from "../controllers/examsController";
import CheckExam from "../middleware/CheckExam";
import ExamValidation from "../middleware/ExamValidation";
import isDistrictUser from "../middleware/isDistrictUser";

const router=Router();

router.post('/',isDistrictUser, ExamValidation, CheckExam, examsController.addExam);
router.get('/',isDistrictUser,examsController.getAllExam);
router.get('/find/:id',examsController.findOneExam);
router.put('/:id',isDistrictUser,examsController.updateExam);
router.delete('/:id',isDistrictUser,examsController.deleteExam);

export default router;