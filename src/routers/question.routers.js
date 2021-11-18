import { Router } from "express";
import questionsController from "../controllers/questionsController";
import CheckQuestion from "../middleware/CheckQuestion";
import isDistrictUser from "../middleware/isDistrictUser";
import QuestionValidation from "../middleware/QuestionValidation";

const router=Router();

router.post('/',isDistrictUser, QuestionValidation, CheckQuestion,questionsController.addQuestion);
router.get('/',questionsController.getallQuestion);
router.put('/:id',isDistrictUser, questionsController.updateQuestion);
router.delete('/:id',isDistrictUser, questionsController.deleteQuestion);
router.get('/find/:id',isDistrictUser,questionsController.findOneQuestion);


export default router;