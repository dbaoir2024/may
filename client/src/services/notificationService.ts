import { query } from '../lib/db';
import { PoolClient } from 'pg';

export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  documentId?: string,
  client?: PoolClient
) => {
  const queryText = `
    INSERT INTO notifications (user_id, title, message, document_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const params = [userId, title, message, documentId];

  try {
    const result = client 
      ? await client.query(queryText, params)
      : await query(queryText, params);

    // Notify via PostgreSQL NOTIFY
    if (!client) {
      await query(
        `NOTIFY notification_insert, '${JSON.stringify({
          user_id: userId,
          notification: result.rows[0]
        })}'`
      );
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const getUnreadNotifications = async (userId: string) => {
  const result = await query(
    `SELECT * FROM notifications 
     WHERE user_id = $1 AND is_read = false
     ORDER BY created_at DESC
     LIMIT 10`,
    [userId]
  );
  return result.rows;
};

export const markAsRead = async (notificationId: number, userId: string) => {
  await query(
    `UPDATE notifications 
     SET is_read = true 
     WHERE id = $1 AND user_id = $2`,
    [notificationId, userId]
  );
};