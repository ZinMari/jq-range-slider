import type { IObserver, TObserverSubscriber } from "./type";

class Observer<T> implements IObserver<T> {
  subscribers: {
    [K in keyof T]?: Set<TObserverSubscriber<T, K>>;
  } = {};

  addSubscriber<K extends keyof T>(
    typeEvent: K,
    subscriber: TObserverSubscriber<T, K>,
  ): void {
    if (typeEvent in this.subscribers) {
      this.subscribers[typeEvent]?.add(subscriber);
    } else {
      this.subscribers[typeEvent] = new Set([subscriber]);
    }
  }

  removeSubscriber<K extends keyof T>(
    typeEvent: K,
    subscriber: TObserverSubscriber<T, K>,
  ): void {
    this.subscribers[typeEvent]?.delete(subscriber);
  }

  removeAllSubscribers(typeEvent: keyof T) {
    this.subscribers[typeEvent]?.clear();
  }

  notify<K extends keyof T>(typeEvent: K, observerInfoObject: T[K]): void {
    this.subscribers[typeEvent]?.forEach(updateSubscriber =>
      updateSubscriber(observerInfoObject),
    );
  }
}
export default Observer;
