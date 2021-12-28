import { Router } from "express";
import authRouters from "./auth.routers";
import studentRouters from "./student.routers";
import schoolRouters from "./school.routers";
import examRouters from "./exam.routers";
import questionsRouters from "./question.routers";
import resultRouters from "./result.routers";

const router=Router();

router.use('/auth',authRouters);
router.use('/students', studentRouters);
router.use('/schools', schoolRouters);
router.use('/exams',examRouters);
router.use('/question',questionsRouters);
router.use('/results',resultRouters);

export default router