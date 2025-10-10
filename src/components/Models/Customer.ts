import { ICustomer, TPayment } from "../../types";
type TCustomerErrors = Partial<Record<keyof ICustomer, string>>;

export class Customer {
    payment: TPayment | null = null;
    address: string = "";
    email: string = "";
    phone: string = "";

    setPayment(payment: TPayment | null): void {
        this.payment = payment;
    }

    setAddress(address: string): void {
        this.address = address;
    }

    setEmail(email: string): void {
        this.email = email;
    }

    setPhone(phone: string): void {
        this.phone = phone;
    }

    getData(): ICustomer {
        return {
            payment: this.payment!,
            address: this.address,
            email: this.email,
            phone: this.phone,
        };
    }

    clear(): void {
        this.payment = null;
        this.address = "";
        this.email = "";
        this.phone = "";
    }

    validateData(): TCustomerErrors {
        const errors: TCustomerErrors = {};
        if (!this.payment) errors.payment = "Не выбран вид оплаты";
        if (!this.address) errors.address = "Укажите адрес доставки";
        if (!this.email) errors.email = "Укажите email";
        if (!this.phone) errors.phone = "Укажите телефон";
        return errors;
    }
}
