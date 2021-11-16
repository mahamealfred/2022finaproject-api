import { Router } from "express";
import authRouters from "./auth.routers";
import studentRouters from "./student.routers";
import schoolRouters from "./school.routers";
import examRouters from "./exam.routers";
import questionsRouters from "./question.routers";
import resultRouters from "./result.routers";

const router=Router();

router.use('/auth',authRouters);
router.use('/student', studentRouters);
router.use('/school', schoolRouters);
router.use('/exam',examRouters);
router.use('/question',questionsRouters);
router.use('/result',resultRouters);

export default router