import Observer from "../../Observer/Observer";

class LineView extends Observer<SubViewEvents> implements BaseSubViewInterface {
  item: JQuery<HTMLElement>;
  constructor(slider: JQuery<HTMLElement>, lineClass: string) {
    super();
    this.item = $("<div>", { class: `alexandr__line ${lineClass}` });

    this.item[0].addEventListener("pointerdown", this.handler);

    slider.append(this.item);
  }

  handler = (event: PointerEvent) => {
    event.preventDefault();
    const target = event.currentTarget;

    if (target instanceof HTMLElement) {
      if (target.classList.contains("alexandr__thumb")) {
        return;
      }
    }

    this.notify("updateValues", {
      pageX: event.pageX,
      pageY: event.pageY,
    });
  };
}

export default LineView;
