import express from 'express';
import PaymentController from '../controllers/paymentController.js';
import { auth, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Route to fetch all payments
router.get('/', PaymentController.getAllPayments);

// Route to fetch a single payment by paymentId
router.get('/:paymentId', PaymentController.getPaymentById);

// Route to fetch payments by verification status (verifyLog)
router.get('/verification/data', 
  auth, 
  checkRole(['developer', 'financier']), 
  PaymentController.getVerificationData
);

// Route to create a new payment
router.post('/', PaymentController.createPayment);

// Route to update payment details
router.put('/:id',
  auth,
  checkRole(['developer', 'financier']),
  PaymentController.updatePayment
);

// Route to update verification status
router.patch('/:id/verify', 
  auth, 
  checkRole(['developer', 'financier']), 
  PaymentController.updateVerificationStatus
);

// Route to delete a payment by paymentId
router.delete('/:paymentId', PaymentController.deletePayment);

export default router;