import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IHeader {
  count: number;
}

export interface IHeaderActions {
    onCartButtonClick?: () => void;
}

export class Header extends Component<IHeader> {

    protected _count: HTMLElement;
    protected cartButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?:IHeaderActions) {
        super(container);

        this._count = ensureElement<HTMLElement>('.header__basket-counter');
        this.cartButton = ensureElement<HTMLButtonElement>(".header__basket");

        if (actions?.onCartButtonClick) {
            this.cartButton.addEventListener("click", actions.onCartButtonClick);
        }
    }

  set count(value: number) {
    this._count.textContent = String(value);
  }

}