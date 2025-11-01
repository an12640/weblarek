import { TPrice } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";

export abstract class Card<T> extends Component<T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this._title = ensureElement<HTMLElement>(
            ".card__title",
            this.container,
        );
        this._price = ensureElement<HTMLElement>(
            ".card__price",
            this.container,
        );
    }

    set title(value: string) {
        this._title.textContent = value;
    }

    set price(value: TPrice) {
        if (value === null) {
            this._price.textContent = "Бесценно";
        } else {
            this._price.textContent = `${value} синапсов`;
        }
    }
}
