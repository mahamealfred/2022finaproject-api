import { Router} from "express";
import schoolController from "../controllers/schoolController";
import CheckDistrict from "../middleware/CheckDistrict";
import CheckSchool from "../middleware/CheckSchool";
import CheckUser from "../middleware/CheckUser";
import SchoolValidation from "../middleware/SchoolValidation";
const router=Router();

router.post('/newSchool', CheckUser, SchoolValidation, CheckSchool, schoolController.addSchool);
router.get('/',schoolController.getAllSchool);
router.get('/find/:id',schoolController.findOneSchool);
router.delete('/:id',schoolController.deleteSchool);
router.patch('/:id',schoolController.updateSchool);
router.get('/schoolbyid/:id',schoolController.getSchoolById);
///schools/search?searchKey={searchKey}
router.get('/search',schoolController.search);
//district user
router.get('/schoolsinspecificdistrict',schoolController.getAllSchoolByDistrictUser);

export default router;