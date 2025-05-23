type Subscriber = (infoObject: ObserverInfoObject) => void;

class Observer<T> {
  subscribers: {
    [K in keyof T]?: Set<Subscriber>
  } = {}

  addSubscriber<K extends keyof T>(typeEvent: K, subscriber: Subscriber): void {
    if (typeEvent in this.subscribers) {
      this.subscribers[typeEvent].add(subscriber);
    } else {
      this.subscribers[typeEvent] = new Set([subscriber]);
    }
  }

  removeSubscriber(typeEvent: string, subscriber: Subscriber): void {
    this.subscribers[typeEvent].delete(subscriber)
  }

  notify(type: string, observerInfoObject: ObserverInfoObject): void {
    this.subscribers[type]?.forEach(updateSubscriber =>
      updateSubscriber(observerInfoObject),
    );
  }
}
export default Observer;
