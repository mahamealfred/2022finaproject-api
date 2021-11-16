import { Router } from "express";
import examsController from "../controllers/examsController";
import CheckExam from "../middleware/CheckExam";

const router=Router();

router.post('/',CheckExam, examsController.addExam);
router.get('/',examsController.getAllExam);
router.get('/find/:id',examsController.findOneExam);
router.put('/:id',examsController.updateExam);
router.delete('/:id',examsController.deleteExam);

export default router;