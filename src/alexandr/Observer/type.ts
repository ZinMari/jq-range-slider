export type ObserverSubscriber<T> = {
  (infoObject: T[keyof T]): void;
};

export type Observer<T> = {
  subscribers: { [K in keyof T]?: Set<ObserverSubscriber<T>> };
  addSubscriber<K extends keyof T>(
    typeEvent: K,
    subscriber: (infoObject: T[K]) => void,
  ): void;
  removeSubscriber: (
    typeEvent: keyof T,
    subscriber: ObserverSubscriber<T>,
  ) => void;
  removeAllSubscribers: (typeEvent: keyof T) => void;
  notify<K extends keyof T>(typeEvent: K, observerInfoObject: T[K]): void;
};
