import { IProduct, TPrice } from "../../../types";
import { categoryMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { Card } from "./Card";

type CategoryKey = keyof typeof categoryMap;

export interface ICardModalActions {
    onToggleCart?: () => void;
}

interface ICartModal {
    item: Partial<IProduct> ;
    buttonText: string;
}

export class CardModal extends Card<ICartModal> {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardModalActions) {
        super(container);

        this._category = ensureElement<HTMLElement>(
            ".card__category",
            container,
        );
        this._image = ensureElement<HTMLImageElement>(
            ".card__image",
            container,
        );
        this._description = ensureElement<HTMLElement>(
            ".card__text",
            container,
        );
        this._button = ensureElement<HTMLButtonElement>(
            ".card__button",
            container,
        );

        if (actions?.onToggleCart) {
            this._button.addEventListener("click", () => {
                actions.onToggleCart!();
            });
        }
    }

    set category(value: string) {
        this._category.textContent = value;

        for (const key in categoryMap) {
            this._category.classList.toggle(
                categoryMap[key as CategoryKey],
                key == value,
            );
        }
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }

    set description(value: string) {
        this._description.textContent = value;
    }

    set item(item: Partial<IProduct>) {
        this.image = item.image!;
        this.category = item.category!;
        this.description = item.description!;
        this.price = item.price!;
        this.title = item.title!;

        if (item.price === null) {
            this._button.disabled = true;
        }
    }

    set buttonText(buttonText: string) {
        this._button.textContent = buttonText;
    }
}
