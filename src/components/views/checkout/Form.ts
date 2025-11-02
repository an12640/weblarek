import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";
import { TCustomerErrors } from "../../models/Customer";

export abstract class Form<T> extends Component<T> {
    protected submitBtn: HTMLButtonElement;
    protected errorsEl: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.submitBtn = ensureElement<HTMLButtonElement>(
            ".modal__actions .button",
            this.container,
        );

        this.errorsEl = ensureElement<HTMLElement>(
            ".form__errors",
            this.container,
        );

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.getAttribute('name')}:submit`);
        });
    }

    set errors(errors: TCustomerErrors) {
        if (Object.values(errors).some(Boolean)) {
            this.errorsEl.textContent = Object.values(errors)
                .filter(Boolean)
                .join(". ");
            this.setSubmitEnabled(false);
        } else {
            this.errorsEl.textContent = "";
            this.setSubmitEnabled(true);
        }
    }

    private setSubmitEnabled(enabled: boolean) {
        this.submitBtn.toggleAttribute("disabled", !enabled);
    }
}