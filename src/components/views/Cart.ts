import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface ICartActions {
  onCheckout?: () => void;
  onRemoveItem?: (item: IProduct) => void;
}

interface ICart {
    items: HTMLElement[];
    total: number;
}

export class Cart extends Component<ICart>{
  public readonly container: HTMLElement;
  private listEl: HTMLUListElement;
  private totalEl: HTMLElement;
  private checkoutBtn: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICartActions) {
    super(container);

    this.container = container;
    this.listEl = ensureElement<HTMLUListElement>(".basket__list", container);
    this.totalEl = ensureElement<HTMLElement>(".basket__price", container);
    this.checkoutBtn = ensureElement<HTMLButtonElement>(".basket__button", container);

    if (actions?.onCheckout) {
      this.checkoutBtn.addEventListener("click", actions.onCheckout);
    }

    if (actions?.onRemoveItem) {
    }
  }

    set items(items: HTMLElement[]) {
        this.listEl.replaceChildren(...items);
        this.checkoutBtn.disabled = items.length == 0;
    }

    set total(total: number) {
        this.totalEl.textContent = `${total} синапсов`;
    }
}
