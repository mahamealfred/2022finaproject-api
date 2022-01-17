import { Router } from "express";
import studentController from "../controllers/studentController";
import CheckStudent from "../middleware/CheckStudent";
import StudentValidation from "../middleware/StudentValidation";

const router=Router();

router.post('/newStudent',CheckStudent, StudentValidation, studentController.addStudent);
router.get('/',studentController.getallStudent);
router.get('/find/:id',studentController.findOneStudent);
router.delete('/:id',studentController.deleteStudent);
router.patch('/:id',studentController.updateStudent);
router.get('/primary',studentController.getAllprimaryStudent);
router.get('/ordinarylevel',studentController.getAllOrdinaryLevelStudent);
router.get('/ordinarylevelMaleStudent',studentController.getAllOrdinaryLevelMaleStudent);
router.get('/ordinarylevelFemaleStudent',studentController.getAllOrdinaryLevelFemaleStudent);
router.get('/primarylevelFemaleStudent',studentController.getAllPrimaryLevelFemaleStudent);
router.get('/primarylevelMaleStudent',studentController.getAllPrimaryLevelMaleStudent);


export default router;