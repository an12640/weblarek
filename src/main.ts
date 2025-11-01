import "./scss/styles.scss";

import { ProductCatalog } from "./components/models/ProductCatalog";
import { ShoppingCart } from "./components/models/ShoppingCart";
import { Customer } from "./components/models/Customer";
import { Api } from "./components/base/Api";
import { NetworkManager } from "./components/network/NetworkManager";
import { API_URL } from "./utils/constants";
import { EventEmitter } from "./components/base/Events";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { Gallery } from "./components/views/Gallery";
import { CardCatalog } from "./components/views/card/CardCatalog";
import { Modal } from "./components/views/Modal";
import { CardModal } from "./components/views/card/CardModal";
import { Cart } from "./components/views/Cart";
import { CartItem } from "./components/views/card/CartItem";
import { Header } from "./components/views/Header";
import { ICustomer, IOrder, IProduct, TPayment } from "./types";
import { Contacts } from "./components/views/checkout/Contacts";
import { Order } from "./components/views/checkout/Order";
import { OrderSuccess } from "./components/views/checkout/OnSuccess";

export const events = new EventEmitter();

// Models
const catalog = new ProductCatalog(events);
const cart = new ShoppingCart(events);
const customer = new Customer(events);

// API layer
const manager = new NetworkManager(new Api(API_URL));

// Templates for views
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const cartItemTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const orderTmpl = ensureElement<HTMLTemplateElement>("#order");
const contactsTmpl = ensureElement<HTMLTemplateElement>("#contacts");
const successTmpl = ensureElement<HTMLTemplateElement>("#success");

// Views
const modalView = new Modal(ensureElement<HTMLElement>("#modal-container"), {
    onClose: () => events.emit("modal:close"),
});

const cartView = new Cart(cloneTemplate(basketTemplate), {
    onCheckout: () => events.emit("cart:checkout"),
});

const headerView = new Header(ensureElement<HTMLElement>(".header"), {
    onCartButtonClick: () => events.emit("cart:open"),
});

const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"), events);

// Get products and save them in model
manager
    .getProducts()
    .then((response) => {
        catalog.setProducts(response.items);
    })
    .catch((err) => console.error("Ошибка при получении товаров", err));

// Useful funcitons
function renderCart(cartView: Cart, cartItemTemplate: HTMLTemplateElement) {
    if (cart.getCount() === 0) {
        return cartView.render({
            items: [],
            total: cart.getTotalPrice(),
        });
    }

    const items = cart.getItems().map((product, index) => {
        const itemView = new CartItem(cloneTemplate(cartItemTemplate), {
            onRemove: () => events.emit("cart:removeItem", product),
        });
        return itemView.render({
            title: product.title,
            price: product.price ?? null,
            index: index + 1,
        });
    });

    return cartView.render({
        items,
        total: cart.getTotalPrice(),
    });
}

function renderCheckout() {
    const view = new Order(cloneTemplate(orderTmpl), {
        onSelectPayment: (payment: TPayment) => {
            events.emit('checkout:updateForm', {payment});
        },
        onAddressInput: (address) => {
            events.emit('checkout:updateForm', {address});
        },
        onSubmit: () => {
            events.emit('checkout:contacts');
        },
    });

    modalView.content = view.render({payment: customer.payment, address: customer.address, errors: customer.validateOrder()});
    modalView.open();
}

function renderContacts() {
    const view = new Contacts(cloneTemplate(contactsTmpl), {
        onEmailInput: (email) => {
            events.emit('checkout:updateForm', {email});
        },
        onPhoneInput: (phone) => {
            events.emit('checkout:updateForm', {phone});
        },
        onSubmit: () => {
            events.emit("checkout:submit");
        },
    });

    modalView.content = view.render({email: customer.email, phone: customer.phone, errors: customer.validateContacts()});
    modalView.open();
}

function submitOrder() {

    const order: IOrder = {
        payment: customer.payment!,
        address: customer.address,
        email: customer.email,
        phone: customer.phone,
        total: cart.getTotalPrice(),
        items: cart.getItems().map((item) => item.id),
    };

    manager
        .createOrder(order)
        .then(() => {
            const success = new OrderSuccess(cloneTemplate(successTmpl), {
                onClose: () => modalView.close(),
            });

            modalView.content = success.render({amount: order.total});

            cart.clear();
            customer.clear();
        })
        .catch(() => {
            console.error("Не удалось оформить заказ, попробуйте позже");
        });
}

// Event handlers

events.on("catalog:changed", () => {
    const itemCards = catalog.getProducts().map((item) => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit("card:select", item),
        });
        return card.render(item);
    });

    gallery.render({ catalog: itemCards });
});

events.on("catalog:selectItem", (item: IProduct) => {
    const inCart = cart.hasItem(item.id);

    const cardModalView = new CardModal(
        cloneTemplate(cardPreviewTemplate),
        {
            onToggleCart: () => {
                events.emit("card:buy", item);
                modalView.close();
            },
        },
    );
    
    modalView.content = cardModalView.render({item:item, isInCart:inCart, price:item.price});
    modalView.open();
});

events.on("cart:updated", () => {
    headerView.render({ count: cart.getCount() });
    renderCart(cartView, cartItemTemplate);
});

events.on("checkout:orderUpdated", () => renderCheckout());
events.on("checkout:contactsUpdated", () => renderContacts());

events.on("card:select", (item: IProduct) => catalog.setSelectedProduct(item));
events.on("card:buy", (item: IProduct) => {
    const isInCart = cart.hasItem(item.id);
    
    if (isInCart) {
        cart.removeItem(item);
    } else {
        cart.addItem(item);
    }
});

events.on("cart:removeItem", (item: IProduct) => {
    cart.removeItem(item);
});

events.on("cart:open", () => {
    modalView.content = renderCart(cartView, cartItemTemplate);;
    modalView.open();
});

events.on("cart:checkout", () => renderCheckout());
events.on("checkout:contacts", () => renderContacts());
events.on("checkout:submit", () => submitOrder());
events.on("checkout:updateForm", (data: ICustomer) => {
    customer.setData(data);
});

events.on("modal:close", () => modalView.close());
