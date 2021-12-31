import { Router } from "express";
import studentController from "../controllers/studentController";
import CheckStudent from "../middleware/CheckStudent";
import StudentValidation from "../middleware/StudentValidation";

const router=Router();

router.post('/newStudent',CheckStudent, StudentValidation, studentController.addStudent);
router.get('/',studentController.getallStudent);
router.get('/find/:id',studentController.findOneStudent);
router.delete('/:id',studentController.deleteStudent);
router.put('/:id',studentController.updateStudent);

export default router;