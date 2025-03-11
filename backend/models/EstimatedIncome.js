import mongoose from 'mongoose';

const estimatedIncomeSchema = new mongoose.Schema({
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
      name: { type: String, default: '' },
      prevAmt: { type: Number, default: 0 },
      currAmt: { type: Number, default: 0 },
      category: { type: String, enum: ['youth', 'villagers'], default: 'youth' },
      status: { type: String, enum: ['paid', 'not paid'], default: 'not paid' },
      informed: { type: Number, default: 0 },
      others: { type: String, default: '' }
    }
  ],
  createdBy: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('EstimatedIncome', estimatedIncomeSchema);
