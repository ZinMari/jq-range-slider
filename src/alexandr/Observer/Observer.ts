class Observer {
  subscriber: Presenter | Alexandr;
  subscribers2: object;

  constructor(){
    this.subscribers2 = {}
  }

  addSubscriber(subscriber: Presenter | Alexandr) {
    this.subscriber = subscriber;
  }

  addSubscriber2(typeEvent: string, subscriber: any) {

      if(this.subscribers2[typeEvent]) {
        this.subscribers2[typeEvent].push(subscriber)
      } else {
        this.subscribers2[typeEvent] = []
        this.subscribers2[typeEvent].push(subscriber)
      }
    
    console.log(this.subscribers2[typeEvent])
  }

  notify(observerInfoObject: ObserverInfoObject) {
    this.subscriber?.update(observerInfoObject);
  }
}
export default Observer;
