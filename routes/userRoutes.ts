import { Router ,RequestHandler } from 'express';
import  UserController  from '../controllers/userController';

import  {checkUserAuth}  from '../middleware/authMiddleware';

const router = Router();
const userController = new UserController();

// Route to get all users
router.get('/', userController.getUsers);

router.post('/signup', userController.createUser);

router.post('/login', userController.loginUser);

router.get('/profile',checkUserAuth, userController.profile);

router.get('/tasks', checkUserAuth,userController.getTasks);

router.put('/tasks/:id', checkUserAuth,userController.updateTasks);


export default router;