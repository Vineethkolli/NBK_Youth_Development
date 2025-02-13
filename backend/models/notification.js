import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
  endpoint: {
    type: String,
    required: true,
    unique: true,
  },
  keys: {
    p256dh: { type: String, required: true },
    auth: { type: String, required: true },
  },
}, { timestamps: true });

const Subscription = mongoose.model('Subscription', SubscriptionSchema);

export default Subscription;
