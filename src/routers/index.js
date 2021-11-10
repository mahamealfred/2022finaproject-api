import { Router } from "express";
import authRouters from "./auth.routers";
import studentRouters from "./student.routers";
import schoolRouters from "./school.routers";

const router=Router();

router.use('/auth',authRouters);
router.use('/student', studentRouters);
router.use('/school', schoolRouters);

export default router