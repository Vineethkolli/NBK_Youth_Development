import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react'; 
import ForgotPassword from '../components/auth/ForgotPassword';
import OTPVerification from '../components/auth/OTPVerification';
import ResetPassword from '../components/auth/ResetPassword';

function SignIn() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetFlow, setResetFlow] = useState({
    step: 'signin', // signin, forgot, otp, reset
    email: '',
    resetToken: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signin } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signin(identifier, password);
      toast.success('Signed in successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to sign in');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOTPSent = (email) => {
    setResetFlow({ ...resetFlow, step: 'otp', email });
  };

  const handleOTPVerified = (resetToken) => {
    setResetFlow({ ...resetFlow, step: 'reset', resetToken });
  };

  const handlePasswordReset = () => {
    setResetFlow({ step: 'signin', email: '', resetToken: '' });
  };

  if (resetFlow.step === 'forgot') {
    return (
      <ForgotPassword
        onBack={() => setResetFlow({ ...resetFlow, step: 'signin' })}
        onOTPSent={handleOTPSent}
      />
    );
  }

  if (resetFlow.step === 'otp') {
    return (
      <OTPVerification
        email={resetFlow.email}
        onVerified={handleOTPVerified}
        onBack={() => setResetFlow({ ...resetFlow, step: 'forgot' })}
      />
    );
  }

  if (resetFlow.step === 'reset') {
    return (
      <ResetPassword
        resetToken={resetFlow.resetToken}
        onSuccess={handlePasswordReset}
      />
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
  <h1 className="mt-2 text-4xl md:text-3xl font-extrabold tracking-wide text-green-600">
    NBK YOUTH
  </h1>
  <h2 className="text-xl md:text-lg font-medium text-gray-600">
    Gangavaram
  </h2>
  </div> 
        <div>
          <input
            type="text"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Email or Phone Number"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'} 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
          >
            {isSubmitting ? 'Signing In...' : 'Sign in'}
          </button>
        </div>

        <div className="text-sm text-center">
          <p className="text-black">
            Don't have an account?{' '}
            <a href="/signup" className="font-medium text-green-600 hover:text-green-500">
              Sign up
            </a>
          </p>
        </div>
        <div className="text-sm text-center">
          <p className="text-black">
            Forgot password?{' '}
            <button
              type="button"
              onClick={() => setResetFlow({ ...resetFlow, step: 'forgot' })}
              className="font-medium text-green-600 hover:text-green-500"
            >
              Reset
            </button>
          </p>
        </div>
      </form>
      <div className="w-full max-w-md text-black text-center mt-10">
        <p className="font-bold text-lg tracking-wide">
          Crafted with ❤️ Love
        </p>
      </div>
    </>
  );
}

export default SignIn;
