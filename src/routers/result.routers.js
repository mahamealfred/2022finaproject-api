import { Router } from "express";
import resultController from "../controllers/resultController";
import isSchoolUser from "../middleware/isSchoolUser";
import isStudent from "../middleware/isStudent";

const router=Router();

router.post('/',resultController.addResult);
router.get('/',resultController.getAllResult);
router.get('/find/:id',resultController.findOneResult);
router.delete('/:id',resultController.deleteResult);
router.get('/primaryresults/:id',isSchoolUser,resultController.getPrimaryResultBySchoolUser);
router.get('/ordinarylevelresults/:id',isSchoolUser,resultController.getOrdinaryResultBySchoolUser);

//school user
router.get('/percentagemarksprimaryresults',isSchoolUser,resultController.getPercentageMarksOfPrimaryStudentsInSpecificSchool);
router.get('/percentageprimaryresultsbasedongender',isSchoolUser,resultController.getPercentageResultBasedOnGenderBySchoolUser);
router.get('/percentageprimaryresults',isSchoolUser,resultController.getPercentageResultsOfAllStudentsBySchoolUser);

router.get('/percentagemarksordinaryresults',isSchoolUser,resultController.getPercentageMarksOfOrdinaryStudentsInSpecificSchool);
router.get('/percentageordinaryresultsbasedongender',isSchoolUser,resultController.getPercentageResultBasedOnGenderInOrdinaryBySchoolUser);

//for specific student
router.get('/subjectresult/:id',isStudent,resultController.getMyResult);
//admin
router.get('/percentagemarks',resultController.getPercentageResultBasedOnGenderInPrimary);
router.get('/persentageresultsinallassessment',resultController.getPercentageResultOfPriamryStudentsInAllAssessment);
router.get('/topprimaryschool',resultController.getTopPrimarySchool);
router.get('/topordinarylevelresult',resultController.getTopOrdinarySchool);
router.get('/ordinarylevelpercentagemarks',resultController.getPercentageResultBasedOnGenderInOrdinaryLevel);
router.get('/ordinarylevelpersentageresultsinallassessment',resultController.getPercentageResultOfOrdinaryStudentsInAllAssessment);
router.get('/primarylevelpercentagebaseongender/:id',resultController.getPrimaryPercentageResultBasedOnGenderByAdmin);
router.get('/ordinarylevelpercentagebasedongender/:id',resultController.getOrdinaryPercentageResultBasedOnGenderByAdmin);
router.get('/ordinarypercentageinassessmentinspecificschool/:id',resultController.getPercentageMarksOfOrdinaryLevelStudentsInSpecificSchoolByAdmin)
router.get('/primarypercentageinassessmentinspecificschool/:id',resultController.getPercentageMarksOfPrimaryStudentsInSpecificSchoolByAdmin);
router.get('/primaryassessementsanalysis/:id',resultController.getDifferentInPerformanceForPrimaryStudentByAdmin);
router.get('/ordinaryassessmentsanalysis/:id',resultController.getDifferentInPerformanceForOrdinaryLevlStudentByAdmin);
export default router;