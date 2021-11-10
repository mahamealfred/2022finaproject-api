import { Router } from "express";
import studentController from "../controllers/studentController";

const router=Router();

router.post('/newStudent',studentController.addStudent);

export default router;