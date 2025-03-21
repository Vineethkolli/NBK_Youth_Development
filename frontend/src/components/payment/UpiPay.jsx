import React from 'react';

const UpiPay = () => {
  // Replace these parameters with your own UPI details
  const upiId = 'kolliniharika30@oksbi';
  const name = 'Your Name';
  const transactionNote = 'Test Payment';
  const amount = '100'; // Set a default amount (can be dynamic)
  const currency = 'INR';

  // Construct the UPI deep link URL
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&tn=${encodeURIComponent(transactionNote)}&am=${amount}&cu=${currency}`;

  const handlePayClick = () => {
    // This will redirect the mobile browser to the UPI app
    window.location.href = upiUrl;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">UPI Payment</h1>
        <p className="text-gray-700 mb-8 text-center">
          Click the button below to open your UPI app and complete the payment.
        </p>
        <button
          onClick={handlePayClick}
          className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default UpiPay;
