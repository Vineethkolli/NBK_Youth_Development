import mongoose from 'mongoose';

const estimatedIncomeSchema = new mongoose.Schema({
  name: {
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
  category: {
    type: String,
    enum: ['youth', 'villagers'],
    default: 'youth'
  },
  status: {
    type: String,
    enum: ['paid', 'not paid'],
    default: 'not paid'
  },
  others: {
    type: String,
    default: ''
  },
  EIID: {  // New unique identifier for estimated income
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

export default mongoose.model('EstimatedIncome', estimatedIncomeSchema);
