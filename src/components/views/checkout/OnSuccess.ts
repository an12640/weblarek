import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";

export interface ISuccessViewActions {
  onClose?: () => void;
}

interface IOrderSuccess {
    amount: number
}

export class OrderSuccess extends Component<IOrderSuccess> {
  protected description: HTMLElement;
  protected closeBtn: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ISuccessViewActions) {
    super(container);
    this.description = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.closeBtn = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
    this.closeBtn.addEventListener('click', () => actions?.onClose?.());
  }

  set amount(total: number) {
    this.description.textContent = `Списано ${total} синапсов`;
  }
}