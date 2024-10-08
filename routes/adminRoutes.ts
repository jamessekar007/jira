import { Router ,RequestHandler } from 'express';
import  AdminController  from '../controllers/adminController';

import  {checkAdminAuth}  from '../middleware/authMiddleware';

const router = Router();
const adminController = new AdminController();

// Route to get all users
router.get('/projects/:id?', checkAdminAuth,adminController.getProjects);

router.post('/projects',checkAdminAuth,adminController.createProjects);

router.post('/tasks', checkAdminAuth,adminController.createTasks);

router.get('/tasks', checkAdminAuth,adminController.getTasks);

router.delete('/tasks/:id', checkAdminAuth,adminController.deleteTasks);

router.get('/projects/:id/tasks', checkAdminAuth,adminController.getTasksByProject);

export default router;