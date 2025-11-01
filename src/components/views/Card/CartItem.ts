import { ensureElement } from "../../../utils/utils";
import { Card } from "./Card";

export interface ICartItemActions {
  onRemove?: () => void;
}

interface ICartItem {
  title: string;
  price: number | null;
  index: number;
}

export class CartItem extends Card<ICartItem>{
  public readonly container: HTMLElement;
  private indexEl: HTMLElement;
  private removeBtn: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICartItemActions) {
    super(container);

    this.container = container;
    this.indexEl = ensureElement<HTMLElement>(".basket__item-index", container);
    this.removeBtn = ensureElement<HTMLButtonElement>(".basket__item-delete", container);

    if (actions?.onRemove) {
      this.removeBtn.addEventListener("click", () => {
          actions?.onRemove!();
      });
    }
  }

  set index(i: number) {
    this.indexEl.textContent = String(i);
  }
}
