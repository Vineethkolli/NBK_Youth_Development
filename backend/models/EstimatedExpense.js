import mongoose from 'mongoose';

const estimatedExpenseSchema = new mongoose.Schema({
  columns: [
    {
      id: { type: String },
      header: { type: String },
      type: { 
        type: String, 
        enum: ['string', 'numeric', 'amount'],
        default: 'string'
      },
      order: { type: Number }
    }
  ],
  rows: [
    {
      id: { type: String },
      purpose: { type: String, default: '' },
      prevAmt: { type: Number, default: 0 },
      currAmt: { type: Number, default: 0 },
      contact: { type: String, default: '' },
      others: { type: String, default: '' }
    }
  ],
  createdBy: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('EstimatedExpense', estimatedExpenseSchema);
