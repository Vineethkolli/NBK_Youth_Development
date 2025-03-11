import mongoose from 'mongoose';

const estimatedExpenseSchema = new mongoose.Schema({
  purpose: {
    type: String,
    required: true
  },
  previousYearAmount: {
    type: Number,
    default: 0
  },
  currentAmount: {
    type: Number,
    default: 0
  },
  contact: {
    type: String,
    default: ''
  },
  others: {
    type: String,
    default: ''
  },
  EEID: {  // New unique identifier for estimated expense
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

export default mongoose.model('EstimatedExpense', estimatedExpenseSchema);
