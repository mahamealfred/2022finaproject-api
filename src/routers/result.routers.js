import { Router } from "express";
import resultController from "../controllers/resultController";
import isSchoolUser from "../middleware/isSchoolUser";
import isStudent from "../middleware/isStudent";

const router=Router();

router.post('/',resultController.addResult);
router.get('/',resultController.getAllResult);
router.get('/find/:id',resultController.findOneResult);
router.delete('/:id',resultController.deleteResult);
router.get('/primaryresult/:id',isSchoolUser, resultController.getAllPrimaryResultToSpecificSchool);
//for specific student
router.get('/subjectresult/:id',isStudent,resultController.getMyResult);

export default router;