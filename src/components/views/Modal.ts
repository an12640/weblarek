import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IModalActions {
    onClose?: () => void;
}

interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected closeButton: HTMLButtonElement;
    protected modalContent: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents, actions?: IModalActions) {
        super(container);

        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close');
        this.modalContent = ensureElement<HTMLElement>('.modal__content');

        if (actions?.onClose) {
            this.closeButton.addEventListener('click', actions.onClose);
            this.container.addEventListener('click', (event) => {
                if (event.target === event.currentTarget && actions.onClose != undefined) {
                    actions.onClose();
                }
            });
        }
    }

    set content(value: HTMLElement) {
        this.modalContent.replaceChildren(value);
    }

    open(): void {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this.events.emit('modal:close');
    }
}

