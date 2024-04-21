import express from 'express'
import { getAllUsers, getUserCounts } from '../controllers/userController.js'
const router= express.Router()

router.get('/getall',getAllUsers)
router.get('/usercounts',getUserCounts)
export default router