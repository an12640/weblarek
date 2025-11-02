import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { TContactsErrors } from "../../models/Customer";
import { Form } from "./Form";

interface IContacts {
    email: string;
    phone: string;
    errors: TContactsErrors;
}

export class Contacts extends Form<IContacts> {
    protected emailInput: HTMLInputElement; // name="email"
    protected phoneInput: HTMLInputElement; // name="phone"

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this.emailInput = ensureElement<HTMLInputElement>(
            'input[name="email"]',
            this.container,
        );
        this.phoneInput = ensureElement<HTMLInputElement>(
            'input[name="phone"]',
            this.container,
        );

        this.emailInput.addEventListener("input", () =>
            this.events.emit("checkout:updateForm", { email: this.emailInput.value })
        );
        this.phoneInput.addEventListener("input", () =>
            this.events.emit("checkout:updateForm", { phone: this.phoneInput.value }),
        );
    }

    set email(value: string) {
        this.emailInput.value = value ?? "";
    }

    set phone(value: string) {
        this.phoneInput.value = value ?? "";
    }
}
