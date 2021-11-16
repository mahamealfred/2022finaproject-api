import { Router } from "express";
import resultController from "../controllers/resultController";

const router=Router();

router.post('/',resultController.addResult);
router.get('/',resultController.getAllResult);
router.get('/find/:id',resultController.findOneResult);
router.delete('/:id',resultController.deleteResult);

export default router;