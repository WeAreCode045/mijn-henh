
// Create a global event system for notifications
type NotificationListener = (count: number) => void;

class NotificationEventSystem {
  private listeners: NotificationListener[] = [];

  addListener(listener: NotificationListener) {
    this.listeners.push(listener);
    return () => this.removeListener(listener);
  }

  removeListener(listener: NotificationListener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  emit(count: number) {
    this.listeners.forEach(listener => listener(count));
  }
}

// Singleton instance
const notificationEvents = new NotificationEventSystem();

export function useEventEmitter() {
  const emitNotificationUpdate = (count: number) => {
    notificationEvents.emit(count);
  };

  return { emitNotificationUpdate };
}

export function useNotificationListener(callback: NotificationListener) {
  return {
    subscribe: () => notificationEvents.addListener(callback),
  };
}
