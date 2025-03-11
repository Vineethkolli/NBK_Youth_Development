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
    required: true
  },
  contact: {
    type: String,
    default: ''
  },
  others: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model('EstimatedExpense', estimatedExpenseSchema);