import { Router } from "express";
import studentController from "../controllers/studentController";
import CheckStudent from "../middleware/CheckStudent";
import isDistrictUser from "../middleware/isDistrictUser";
import isSchoolUser from "../middleware/isSchoolUser";
import StudentValidation from "../middleware/StudentValidation";
import verifyToken from "../middleware/verifyToken";

const router=Router();

router.post('/singup',CheckStudent,studentController.studentSingup);
router.post('/newStudent', StudentValidation, studentController.addStudent);
router.post('/login',CheckStudent, studentController.login);
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
router.get('/numbersinspecificschool/:id',studentController.getSpecificStudentsNumberInSchoolByAdmin);
//to specific school user
router.post('/register',isSchoolUser,studentController.addStudentBySchoolUser);
router.get('/studentList',isSchoolUser,studentController.getAllStudentInSpecificSchool);
router.get('/numbers',isSchoolUser,studentController.getSpecificStudentsNumber);
router.get('/primaryStudents', isSchoolUser,studentController.getAllPrimaryStudentToSpecificSchool);
router.get('/ordinarylevelstudents',isSchoolUser,studentController.getAllOrdinaryLevelStudentToSpecificSchool);
router.get('/primaryfemaleStudents',isSchoolUser,studentController.getAllFemalePrimaryStudentToSpecificSchool);
router.get('/primaryMaleStudents',isSchoolUser,studentController.getAllMalePrimaryStudentToSpecificSchool);
router.get('/ordinaryLevelMaleStudents',isSchoolUser,studentController.getAllMaleOrdinaryLevelStudentToSpecificSchool);
router.get('/ordinaryLevelFemaleStudents',isSchoolUser,studentController.getAllFemaleOrdinaryLevelStudentToSpecificSchool);
router.get('/specificSchool/search',isSchoolUser,studentController.search);
//to a specific distric user
router.get('/search',isDistrictUser,studentController.search);
router.get('/studentsmarks/:id',studentController.getMarksOfStudentsInSpecificSchool);
router.get('/districtanalytics',studentController.getSpecificDistrictStudentsNumber);

//admin
router.get('/studentnumbers',studentController.getAllStudentsNumber);
router.get('/schoolId/:id',studentController.getStudentsBySchoolId);
router.get('/search',studentController.search);

export default router;