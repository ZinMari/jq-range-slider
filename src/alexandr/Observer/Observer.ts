class Observer {
  subscriber: Presenter | Alexandr;

  addSubscriber(subscriber: Presenter | Alexandr) {
    this.subscriber = subscriber;
  }

  notify(observerInfoObject: ObserverInfoObject) {
    this.subscriber?.update(observerInfoObject);
  }
}

export default Observer;
