class Observer {
  subscriber: Presenter;

  addSubscriber(subscriber: Presenter) {
    this.subscriber = subscriber;
  }

  notify(observerInfoObject: ObserverInfoObject) {
    this.subscriber?.update(observerInfoObject);
  }
}

export default Observer;
