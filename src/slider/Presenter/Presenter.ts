import Observer from "../Observer/Observer";

import type { IModel } from "../Model/type";
import type { IView } from "../View/View/type";
import { TUserSliderSettings } from "../Slider/type";
import { MODEL_EVENTS, VIEW_EVENTS } from "./constants";
import { updateFunction } from "./updateFunc";
import { TPresenterEvents } from "./type";

class Presenter extends Observer<TPresenterEvents> {
  view: IView;
  model: IModel;

  constructor(view: IView, model: IModel) {
    super();
    this.view = view;
    this.model = model;

    this.bindSubscribers();
    this.view.setInitialValues();
    this.model.setInitialValues();
  }

  destroy() {
    this.view.destroy();
  }

  updateFunction = updateFunction.bind(this);

  bindSubscribers() {
    VIEW_EVENTS.forEach(event =>
      this.view.addSubscriber(event, this.updateFunction),
    );

    MODEL_EVENTS.forEach(event =>
      this.model.addSubscriber(event, this.updateFunction),
    );
  }

  refreshOptions(options: TUserSliderSettings): void {
    this.model.refreshOptions(options);
  }
}

export default Presenter;
