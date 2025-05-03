class Observer {
  subscriber: Presenter;   

  addSubscriber(subscriber: Presenter){
    this.subscriber = subscriber
  }

  notify(event: any){
    this.subscriber.update(event);
  }
}
  
export default Observer;