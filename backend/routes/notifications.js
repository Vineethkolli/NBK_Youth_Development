import express from 'express';
import {
  getPublicKey,
  subscribe,
  unsubscribe,
  sendNotification
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/publicKey', getPublicKey);
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);
router.post('/notify', sendNotification);

export default router;
