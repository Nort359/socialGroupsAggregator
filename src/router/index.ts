import { Router } from 'express';
import { body } from 'express-validator';

import authMiddleware from '../middlewares/authMiddleware';

import userController from '../controllers/userController';
import groupController from '../controllers/groupController';
import telegramController from '../controllers/telegramController';

const router = Router();

// user
router.post(
    '/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 4, max: 32 }),
    userController.registration
);
router.post('/login', userController.login);
router.delete('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);

// group
router.get('/group', groupController.getAll);
router.get('/group/:user', groupController.getAllUser);
router.get('/group/:user/:name', groupController.get);
router.post('/group', groupController.add);
router.patch('/group', groupController.update);
router.delete('/group/:id', groupController.remove);

// telegram
router.get('/telegram/:user', telegramController.getTelegramDataByUser);
router.post('/telegram/sendMessage', telegramController.sendMessage);

export default router;
