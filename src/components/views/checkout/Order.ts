import { TPayment } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { TOrderErrors } from "../../models/Customer";

export interface IOrderViewActions {
  onSelectPayment?: (payment: TPayment) => void;
  onAddressInput?: (value: string) => void;
  onSubmit?: () => void;
}

interface IOrder {
    payment: TPayment | null,
    address: string,
    errors: TOrderErrors
}

export class Order extends Component<IOrder> {
  protected btnCard: HTMLButtonElement;  // name="card"
  protected btnCash: HTMLButtonElement;  // name="cash"
  protected addressInput: HTMLInputElement; // name="address"
  protected submitBtn: HTMLButtonElement;   // .order__button
  protected errorsEl: HTMLElement;          // .form__errors

  constructor(container: HTMLElement, actions?: IOrderViewActions) {
    super(container);

    this.btnCard = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this.btnCash = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
    this.submitBtn = ensureElement<HTMLButtonElement>('.order__button', this.container);
    this.errorsEl = ensureElement<HTMLElement>('.form__errors', this.container);

    this.btnCard.addEventListener('click', () => actions?.onSelectPayment?.('card'));
    this.btnCash.addEventListener('click', () => actions?.onSelectPayment?.('cash'));
    this.addressInput.addEventListener('blur', () => actions?.onAddressInput?.(this.addressInput.value));
    this.container.addEventListener('submit', (e) => {
      e.preventDefault();
      actions?.onSubmit?.();
    });
  }

  set payment(value: TPayment | null) {
    this.btnCard.classList.toggle('button_alt-active', value === 'card');
    this.btnCash.classList.toggle('button_alt-active', value === 'cash');
  }

  set address(value: string) {
    this.addressInput.value = value ?? '';
  }

  set errors(errors: TOrderErrors) {
    if (Object.keys(errors).length === 0) {
        this.setSubmitEnabled(true);
    }
    else {
        this.errorsEl.textContent = Object.values(errors).filter(Boolean).join('. ');
        this.setSubmitEnabled(false);
    }
  }

  private setSubmitEnabled(enabled: boolean) {
    this.submitBtn.toggleAttribute('disabled', !enabled);
  }
}