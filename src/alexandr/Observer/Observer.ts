class Observer<T> implements Observer<T>{
  subscribers: {
    [K in keyof T]?: Set<ObserverSubscriber<T>>;
  } = {};

  addSubscriber<K extends keyof T>(
    typeEvent: K,
    subscriber: (infoObject: T[K]) => void,
  ): void {
    if (typeEvent in this.subscribers) {
      this.subscribers[typeEvent].add(subscriber);
    } else {
      this.subscribers[typeEvent] = new Set([subscriber]);
    }
  }

  removeSubscriber<K extends keyof T>(
    typeEvent: K,
    subscriber: (infoObject: T[K]) => void,
  ): void {
    this.subscribers[typeEvent].delete(subscriber);
  }

  notify<K extends keyof T>(typeEvent: K, observerInfoObject: T[K]): void {
    this.subscribers[typeEvent]?.forEach(updateSubscriber =>
      updateSubscriber(observerInfoObject),
    );
  }
}
export default Observer;
