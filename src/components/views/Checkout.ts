// components/views/CheckoutStep1.ts
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { TPayment } from "../../types";

export interface IOrderViewActions {
  onSelectPayment?: (payment: TPayment) => void;
  onAddressInput?: (value: string) => void;
  onSubmit?: () => void;
}

export class OrderView extends Component<unknown> {
  protected form: HTMLFormElement;
  protected btnCard: HTMLButtonElement;  // name="card"
  protected btnCash: HTMLButtonElement;  // name="cash"
  protected addressInput: HTMLInputElement; // name="address"
  protected submitBtn: HTMLButtonElement;   // .order__button
  protected errorsEl: HTMLElement;          // .form__errors
  container: HTMLElement;

  constructor(container: HTMLElement, actions?: IOrderViewActions) {
    super(container);
    this.container = container;

    this.form = this.container as HTMLFormElement;
    this.btnCard = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this.btnCash = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
    this.submitBtn = ensureElement<HTMLButtonElement>('.order__button', this.container);
    this.errorsEl = ensureElement<HTMLElement>('.form__errors', this.container);

    this.btnCard.addEventListener('click', () => actions?.onSelectPayment?.('card'));
    this.btnCash.addEventListener('click', () => actions?.onSelectPayment?.('cash'));
    this.addressInput.addEventListener('input', () => actions?.onAddressInput?.(this.addressInput.value));
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      actions?.onSubmit?.();
    });
  }

  setPayment(value: TPayment | null) {
    this.btnCard.classList.toggle('button_alt-active', value === 'card');
    this.btnCash.classList.toggle('button_alt-active', value === 'cash');
  }

  setAddress(value: string) {
    this.addressInput.value = value ?? '';
  }

  setErrors(text: string | null) {
    this.errorsEl.textContent = text ?? '';
  }

  setSubmitEnabled(enabled: boolean) {
    this.submitBtn.toggleAttribute('disabled', !enabled);
  }
}

export interface IContactsViewActions {
  onEmailInput?: (value: string) => void;
  onPhoneInput?: (value: string) => void;
  onSubmit?: () => void;
}

export class ContactsView extends Component<unknown> {
  protected form: HTMLFormElement;
  protected emailInput: HTMLInputElement; // name="email"
  protected phoneInput: HTMLInputElement; // name="phone"
  protected submitBtn: HTMLButtonElement; // .button (внизу)
  protected errorsEl: HTMLElement;        // .form__errors
  container: HTMLElement;

  constructor(container: HTMLElement, actions?: IContactsViewActions) {
    super(container);
    this.container = container;

    this.form = this.container as HTMLFormElement;
    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
    this.submitBtn = ensureElement<HTMLButtonElement>('.modal__actions .button', this.container);
    this.errorsEl = ensureElement<HTMLElement>('.form__errors', this.container);

    this.emailInput.addEventListener('input', () => actions?.onEmailInput?.(this.emailInput.value));
    this.phoneInput.addEventListener('input', () => actions?.onPhoneInput?.(this.phoneInput.value));
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      actions?.onSubmit?.();
    });
  }

  setEmail(value: string) {
    this.emailInput.value = value ?? '';
  }

  setPhone(value: string) {
    this.phoneInput.value = value ?? '';
  }

  setErrors(text: string | null) {
    this.errorsEl.textContent = text ?? '';
  }

  setSubmitEnabled(enabled: boolean) {
    this.submitBtn.toggleAttribute('disabled', !enabled);
  }
}

export interface ISuccessViewActions {
  onClose?: () => void;
}

export class OrderSuccessView extends Component<unknown> {
  protected amountEl: HTMLElement;      // .order-success__description
  protected closeBtn: HTMLButtonElement; // .order-success__close
  container: HTMLElement;

  constructor(container: HTMLElement, actions?: ISuccessViewActions) {
    super(container);
    this.container = container;
    this.amountEl = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.closeBtn = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
    this.closeBtn.addEventListener('click', () => actions?.onClose?.());
  }

  // "Списано N синапсов"
  setAmount(total: number) {
    this.amountEl.textContent = `Списано ${total} синапсов`;
  }
}
