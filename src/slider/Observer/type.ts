export interface IObserver<T> {
  subscribers: { [K in keyof T]?: Set<TObserverSubscriber<T>> };
  addSubscriber<K extends keyof T>(
    typeEvent: K,
    subscriber: (infoObject: T[K]) => void,
  ): void;
  removeSubscriber: (
    typeEvent: keyof T,
    subscriber: TObserverSubscriber<T>,
  ) => void;
  removeAllSubscribers: (typeEvent: keyof T) => void;
  notify<K extends keyof T>(typeEvent: K, observerInfoObject: T[K]): void;
}

export type TObserverSubscriber<T> = {
  (infoObject: T[keyof T]): void;
};
