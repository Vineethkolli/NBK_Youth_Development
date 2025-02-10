import { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '../../utils/config';

function ForgotPassword({ onBack, onOTPSent }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      toast.success('OTP sent to your email');
      onOTPSent(email);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Forgot Password</h2>
        <p className="text-sm text-gray-600 mt-1">
          Enter your email to receive a password reset OTP
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? 'Sending...' : 'Send OTP'}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="w-full py-2 px-4 text-green-600 hover:text-green-700"
        >
          Back to Sign In
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;