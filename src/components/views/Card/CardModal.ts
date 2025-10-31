
import { IProduct } from "../../../types";
import { categoryMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { Card } from "./Card";

type CategoryKey = keyof typeof categoryMap;

export interface ICardModalActions {
  onToggleCart?: () => void;
}

export class CardModal extends Card<Partial<IProduct>> {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;
    protected _description: HTMLElement; // Уникальное поле
    protected _button: HTMLButtonElement;
    container: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardModalActions) {
        super(container); // Вызываем конструктор родителя
        this.container = container;

        // Находим все необходимые элементы
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', container);

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
                key == value
            );
        }
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }
    
    set description(value: string) {
        this._description.textContent = value;
    }
}