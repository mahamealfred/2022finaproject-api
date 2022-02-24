import { Router } from "express";
import authRouters from "./auth.routers";
import studentRouters from "./student.routers";
import schoolRouters from "./school.routers";
import examRouters from "./exam.routers";
import questionsRouters from "./question.routers";
import resultRouters from "./result.routers";
import districtRoutes from './district.routers';

const router=Router();

router.use('/auth',authRouters);
router.use('/students', studentRouters);
router.use('/schools', schoolRouters);
router.use('/exams',examRouters);
router.use('/questions',questionsRouters);
router.use('/results',resultRouters);
router.use('/districts',districtRoutes);

export default router