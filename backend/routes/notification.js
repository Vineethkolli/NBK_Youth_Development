import express from 'express';
import webpush from 'web-push';
import Subscription from '../models/notification.js';

const router = express.Router();

// Endpoint to get public VAPID key
router.get('/publicKey', (req, res) => {
  res.json({ publicKey: process.env.PUBLIC_VAPID_KEY });
});

// Subscribe Route
router.post('/subscribe', async (req, res) => {
  const subscription = req.body;

  try {
    // Check if subscription already exists
    const existingSubscription = await Subscription.findOne({ endpoint: subscription.endpoint });

    if (!existingSubscription) {
      // Save the new subscription
      const newSubscription = new Subscription(subscription);
      await newSubscription.save();
      console.log('Subscription saved:', subscription.endpoint);
    } else {
      console.log('Subscription already exists:', subscription.endpoint);
    }

    res.status(201).json({ message: 'Subscription successful' });
  } catch (error) {
    console.error('Error saving subscription:', error);
    res.status(500).json({ error: 'Failed to save subscription' });
  }
});

// Unsubscribe Route
router.post('/unsubscribe', async (req, res) => {
  const { endpoint } = req.body;

  try {
    await Subscription.deleteOne({ endpoint });
    console.log('Unsubscribed:', endpoint);
    res.status(200).json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

// Send Notification Route
router.post('/notify', async (req, res) => {
  const { title, body } = req.body;
  const payload = JSON.stringify({ title, body });

  try {
    // Retrieve all subscriptions from the database
    const subscriptions = await Subscription.find({});

    if (subscriptions.length === 0) {
      return res.status(404).json({ error: 'No active subscriptions' });
    }

    const notifications = subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(sub, payload);
      } catch (error) {
        if (error.statusCode === 410 || error.statusCode === 404) {
          // Subscription is no longer valid, remove it
          await Subscription.deleteOne({ _id: sub._id });
          console.log('Deleted expired subscription:', sub.endpoint);
        } else {
          console.error('Error sending notification:', error);
        }
      }
    });

    await Promise.all(notifications);
    res.status(200).json({ message: 'Notifications sent' });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({ error: 'Failed to send notifications' });
  }
});

export default router;
