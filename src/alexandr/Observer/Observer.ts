class Observer {
  subscriber: Presenter;   

  addSubscriber(subscriber: Presenter){
    this.subscriber = subscriber
  }

  notify(info?: any, info2?: any, info3?: any, info4?: any){
    this.subscriber?.update(info, info2, info3, info4);
  }
}
  
export default Observer;