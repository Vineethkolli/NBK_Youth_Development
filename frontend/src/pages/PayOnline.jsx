import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import PaymentForm from '../components/payment/PaymentForm';
import PaymentHistory from '../components/payment/PaymentHistory';
import { API_URL } from '../utils/config';
import UpiPay from '../components/payment/UpiPay';

function PayOnline() {
  const handlePaymentSubmit = async (paymentData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/api/payments`, paymentData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Payment submission error:', error.response?.data || error.message);
      throw error;
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Pay Online</h1>
      
      <PaymentForm onSubmit={handlePaymentSubmit} />
      
      <PaymentHistory />
      <UpiPay />
    </div>
  );
}

export default PayOnline;