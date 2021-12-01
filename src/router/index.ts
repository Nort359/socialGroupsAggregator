import { Router } from 'express';
import { body } from 'express-validator';

import authMiddleware from '../middlewares/authMiddleware';

import userController from '../controllers/userController';
import groupController from '../controllers/groupController';

const router = Router();

// user
router.post(
    '/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 4, max: 32 }),
    userController.registration
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);

// group
router.get('/group', groupController.getAll);
router.get('/group:name', groupController.get);
router.post('/group', groupController.add);
router.patch('/group', groupController.update);
router.delete('/group', groupController.remove);

export default router;
