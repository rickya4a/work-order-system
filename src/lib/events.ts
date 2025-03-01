type Listener = () => void

class EventEmitter {
  private listeners: { [key: string]: Listener[] } = {}

  on(event: string, callback: Listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  emit(event: string) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback())
    }
  }

  off(event: string, callback: Listener) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback)
    }
  }
}

export const workOrderEvents = new EventEmitter()