class Observer {
  subscribers: object;

  constructor() {
    this.subscribers = {};
  }

  addSubscriber(typeEvent: string, subscriber: any) {
    if (this.subscribers[typeEvent]) {
      this.subscribers[typeEvent].push(subscriber);
    } else {
      this.subscribers[typeEvent] = [];
      this.subscribers[typeEvent].push(subscriber);
    }
  }

  notify(type: string, observerInfoObject: ObserverInfoObject) {
    this.subscribers[type]?.forEach(updateSubscriber =>
      updateSubscriber(observerInfoObject),
    );
  }
}
export default Observer;
