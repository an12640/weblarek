import { TPayment } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { TOrderErrors } from "../../models/Customer";
import { Form } from "./Form";

interface IOrder {
    payment: TPayment | null;
    address: string;
    errors: TOrderErrors;
}

export class Order extends Form<IOrder> {
    protected btnCard: HTMLButtonElement; // name="card"
    protected btnCash: HTMLButtonElement; // name="cash"
    protected addressInput: HTMLInputElement; // name="address"

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this.btnCard = ensureElement<HTMLButtonElement>(
            'button[name="card"]',
            this.container,
        );
        this.btnCash = ensureElement<HTMLButtonElement>(
            'button[name="cash"]',
            this.container,
        );
        this.addressInput = ensureElement<HTMLInputElement>(
            'input[name="address"]',
            this.container,
        );

        this.btnCard.addEventListener("click", () =>
            this.events.emit("checkout:updateForm", { payment: "card" }),
        );
        this.btnCash.addEventListener("click", () =>
            this.events.emit("checkout:updateForm", { payment: "cash" }),
        );
        this.addressInput.addEventListener("input", () =>
            this.events.emit("checkout:updateForm", { address: this.addressInput.value }),
        );
        this.container.addEventListener("submit", (e) => {
            e.preventDefault();
            events.emit("checkout:contacts");
        });
    }

    set payment(value: TPayment | null) {
        this.btnCard.classList.toggle("button_alt-active", value === "card");
        this.btnCash.classList.toggle("button_alt-active", value === "cash");
    }

    set address(value: string) {
        this.addressInput.value = value ?? "";
    }
}
