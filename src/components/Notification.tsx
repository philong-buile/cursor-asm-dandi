'use client';

import { toast } from 'react-hot-toast';

type NotificationType = 'success' | 'error';

export const showNotification = (message: string, type: NotificationType) => {
  if (type === 'success') {
    toast.success(message, {
      style: {
        background: '#10B981',
        color: '#fff',
      },
      duration: 3000,
    });
  } else {
    toast.error(message, {
      style: {
        background: '#EF4444',
        color: '#fff',
      },
      duration: 3000,
    });
  }
};

export default function Notification() {
  return null; // The actual notification UI is handled by react-hot-toast
} 