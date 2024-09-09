import { validation } from '../../middleware/validation.js';
import * as authController from './controller/registration.js'
import * as validators from './auth.validation.js'
import { Router } from "express";
const router = Router()

router.post('/signup',validation(validators.signup) ,authController.signup)
router.post('/login',validation(validators.login), authController.login)
router.post('/refresh', authController.refreshToken)
router.post('/logout', authController.logout)



export default router