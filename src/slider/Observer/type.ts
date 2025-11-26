export interface IObserver<T> {
  subscribers: { [K in keyof T]?: Set<TObserverSubscriber<T, K>> };

  addSubscriber<K extends keyof T>(
    typeEvent: K,
    subscriber: TObserverSubscriber<T, K>,
  ): void;

  removeSubscriber<K extends keyof T>(
    typeEvent: K,
    subscriber: TObserverSubscriber<T, K>,
  ): void;

  removeAllSubscribers(typeEvent: keyof T): void;

  notify<K extends keyof T>(typeEvent: K, observerInfoObject: T[K]): void;
}

export type TObserverSubscriber<T, K extends keyof T> = (
  typeEvent: K,
  infoObject: T[K],
) => void;
