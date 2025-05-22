class Observer {
  subscribers: object;

  constructor() {
    this.subscribers = {};
  }

  addSubscriber(typeEvent: string, subscriber: any) {
    if (typeEvent in this.subscribers) {
      this.subscribers[typeEvent].add(subscriber);
    } else {
      this.subscribers[typeEvent] = new Set([subscriber]);
    }
  }

  removeSubscriber(typeEvent: string, subscriber: any) {
    this.subscribers[typeEvent].delete(subscriber)
  }

  notify(type: string, observerInfoObject: ObserverInfoObject) {
    this.subscribers[type]?.forEach(updateSubscriber =>
      updateSubscriber(observerInfoObject),
    );
  }
}
export default Observer;
