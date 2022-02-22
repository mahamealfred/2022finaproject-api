import { Router } from "express";
import questionsController from "../controllers/questionsController";
import CheckQuestion from "../middleware/CheckQuestion";
import isDistrictUser from "../middleware/isDistrictUser";
import QuestionValidation from "../middleware/QuestionValidation";

const router=Router();

router.post('/',QuestionValidation, CheckQuestion,questionsController.addQuestion);
router.get('/',questionsController.getallQuestion);
router.put('/:id', questionsController.updateQuestion);
router.delete('/:id', questionsController.deleteQuestion);
router.get('/find/:id',questionsController.findOneQuestion);


export default router;