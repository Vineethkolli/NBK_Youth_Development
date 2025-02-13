import webpush from 'web-push';
import Subscription from '../models/notification.js';
import User from '../models/User.js'; 

// Get Public VAPID Key
export const getPublicKey = (req, res) => {
  res.json({ publicKey: process.env.PUBLIC_VAPID_KEY });
};

export const subscribe = async (req, res) => {
    const { registerId, subscription } = req.body;
  
    if (!registerId || !subscription) {
      return res.status(400).json({ error: "registerId and subscription are required" });
    }
  
    try {
      const existingUser = await Subscription.findOne({ registerId });
  
      if (existingUser) {
        // Avoid duplicate subscriptions
        const isAlreadySubscribed = existingUser.subscriptions.some(sub => sub.endpoint === subscription.endpoint);
        if (!isAlreadySubscribed) {
          existingUser.subscriptions.push(subscription);
          await existingUser.save();
        }
      } else {
        await Subscription.create({ registerId, subscriptions: [subscription] });
      }
  
      res.status(201).json({ message: 'Subscription saved successfully' });
    } catch (error) {
      console.error('Error saving subscription:', error);
      res.status(500).json({ error: 'Failed to save subscription' });
    }
  };
  

// Unsubscribe Route
export const unsubscribe = async (req, res) => {
  const { endpoint } = req.body;

  try {
    await Subscription.deleteOne({ endpoint });
    console.log('Unsubscribed:', endpoint);
    res.status(200).json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
};

export const sendNotification = async (req, res) => {
  const { title, body, target, registerId } = req.body;
  const payload = JSON.stringify({ title, body });

  try {
    let users = [];

    if (target === 'All') {
      users = await Subscription.find({});
    } else if (target === 'Admins_Financiers_Developers') {
      users = await Subscription.find({ registerId: { $in: await getRoleBasedRegisterIds(['admin', 'financier', 'developer']) } });
    } else if (target === 'Specific User' && registerId) {
      users = await Subscription.find({ registerId });
    } else if (target === 'Youth_Category') {
      users = await Subscription.find({ registerId: { $in: await getCategoryBasedRegisterIds('youth') } });
    } else {
      return res.status(400).json({ error: 'Invalid target selection' });
    }

    if (users.length === 0) {
      return res.status(404).json({ error: 'No active subscriptions found for the selected target' });
    }

    const notifications = users.flatMap(user =>
      user.subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(sub, payload);
        } catch (error) {
          if (error.statusCode === 410 || error.statusCode === 404) {
            user.subscriptions = user.subscriptions.filter(s => s.endpoint !== sub.endpoint);
            await user.save();
            console.log('Deleted expired subscription:', sub.endpoint);
          } else {
            console.error('Error sending notification:', error);
          }
        }
      })
    );

    await Promise.all(notifications);
    res.status(200).json({ message: `Notifications sent to ${target}` });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({ error: 'Failed to send notifications' });
  }
};

// Helper functions to fetch registerIds based on role or category
const getRoleBasedRegisterIds = async (roles) => {
  try {
    const users = await User.find({ role: { $in: roles } }, 'registerId');
    return users.map(user => user.registerId);
  } catch (error) {
    console.error('Error fetching role-based register IDs:', error);
    return [];
  }
};

const getCategoryBasedRegisterIds = async (category) => {
  const users = await User.find({ category }, 'registerId');
  return users.map(user => user.registerId);
};
