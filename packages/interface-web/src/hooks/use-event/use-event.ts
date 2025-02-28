import { useRef, useEffect } from 'react';
import { EventName } from './event-name';

type Subscription<T> = (val: T) => void;

export class EventEmitter<T> {
  private subscriptions = new Map<EventName, Set<Subscription<T>>>();

  emit = (type: EventName, val: T) => {
    for (const subscription of this.subscriptions.get(type) || []) {
      subscription(val);
    }
  };

  useSubscription = (type: EventName, callback: Subscription<T>) => {
    const callbackRef = useRef<Subscription<T>>();
    callbackRef.current = callback;

    useEffect(() => {
      function subscription(val: T) {
        if (callbackRef.current) {
          callbackRef.current(val);
        }
      }
      if (this.subscriptions.has(type)) {
        this.subscriptions.get(type)?.add(subscription);
      } else {
        this.subscriptions.set(type, new Set([subscription]));
      }

      return () => {
        const set = this.subscriptions.get(type);
        set?.delete(subscription);
      };
    }, [type]);
  };
}

export function useEvent<T = void>() {
  const ref = useRef<EventEmitter<T>>();
  if (!ref.current) {
    ref.current = new EventEmitter<T>();
  }
  return ref.current;
}
