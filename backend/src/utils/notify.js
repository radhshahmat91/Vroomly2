const Notification = require('../models/Notification');
const { emitToUser } = require('../sockets');

/**
 * Creates a Notification document and, if the recipient has an open
 * socket connection, pushes it to them immediately. Every controller
 * that needs to notify a user should go through this one function so
 * "in-app" and "realtime" never drift out of sync.
 */
async function sendNotification({ userId, type = 'general', title, message, link = '' }) {
  const notification = await Notification.create({ user: userId, type, title, message, link });
  emitToUser(userId, 'notification', notification);
  return notification;
}

module.exports = { sendNotification };
