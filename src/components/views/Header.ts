import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IHeader {
  count: number;
}

export class Header extends Component<IHeader> {

    protected _count: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this._count = ensureElement<HTMLElement>('.header__basket-counter');
    }

  set count(value: number) {
    this._count.textContent = String(value);
  }

}