import { Router} from 'express';
import districtController from '../controllers/districtController';
import CheckDistrict from '../middleware/CheckDistrict';
import CheckUser from '../middleware/CheckUser';
import isAdmin from '../middleware/isAdmin';
import isDistrictUser from '../middleware/isDistrictUser';

const router=Router();

router.post('/addDistrict',CheckDistrict,CheckUser, districtController.addDistrict);
router.get('/',districtController.getAllDistrict);
// district user
router.get('/getAllSchool',isDistrictUser,districtController.getAllSchoolToSpecificDistrict);
router.get('/getAllStudent/:id',isDistrictUser,districtController.getAllStudentToSchoolInSpecificDistrict);

export default router;