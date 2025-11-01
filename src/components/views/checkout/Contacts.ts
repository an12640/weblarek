import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { TContactsErrors } from "../../models/Customer";

export interface IContactsActions {
  onEmailInput?: (value: string) => void;
  onPhoneInput?: (value: string) => void;
  onSubmit?: () => void;
}

interface IContacts {
    email: string,
    phone: string,
    errors: TContactsErrors
}

export class Contacts extends Component<IContacts> {
  protected emailInput: HTMLInputElement; // name="email"
  protected phoneInput: HTMLInputElement; // name="phone"
  protected submitBtn: HTMLButtonElement; // .button (внизу)
  protected errorsEl: HTMLElement;        // .form__errors

  constructor(container: HTMLElement, actions?: IContactsActions) {
    super(container);

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
    this.submitBtn = ensureElement<HTMLButtonElement>('.modal__actions .button', this.container);
    this.errorsEl = ensureElement<HTMLElement>('.form__errors', this.container);

    this.emailInput.addEventListener('blur', () => actions?.onEmailInput?.(this.emailInput.value));
    this.phoneInput.addEventListener('blur', () => actions?.onPhoneInput?.(this.phoneInput.value));
    this.container.addEventListener('submit', (e) => {
      e.preventDefault();
      actions?.onSubmit?.();
    });
  }

  set email(value: string) {
    this.emailInput.value = value ?? '';
  }

  set phone(value: string) {
    this.phoneInput.value = value ?? '';
  }

  set errors(errors: TContactsErrors) {
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