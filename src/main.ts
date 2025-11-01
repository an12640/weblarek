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
import { CardCatalog } from "./components/views/Card/CardCatalog";
import { Modal } from "./components/views/Modal";
import { CardModal } from "./components/views/Card/CardModal";
import { Cart } from "./components/views/Cart";
import { CartItem } from "./components/views/Card/CartItem";
import { Header } from "./components/views/Header";
import { IOrder, IProduct } from "./types";
import { ContactsView, OrderSuccessView, OrderView } from "./components/views/Checkout";

export const events = new EventEmitter();

const catalog = new ProductCatalog(events);
const cart = new ShoppingCart(events);
const customer = new Customer(events);

const manager = new NetworkManager(new Api(API_URL));

manager
    .getProducts()
    .then((response) => {
        catalog.setProducts(response.items); 
        console.log("Ответ с сервера:", response);
        console.log("Каталог после получения с сервера:", catalog.getProducts());
    })
    .catch((err) => console.error("Ошибка при получении товаров", err));

const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'), events);
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

const modalContainer = ensureElement<HTMLElement>('#modal-container');
const modal = new Modal(modalContainer, events, {
    onClose: () => {
        modal.close();
        events.emit('modal:close');
    }
});

const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');

const basketBtn = ensureElement<HTMLButtonElement>(".header__basket");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const basketItemTemplate = ensureElement<HTMLTemplateElement>("#card-basket");

const header = new Header(ensureElement<HTMLElement>(".header"));

const cartView = new Cart(cloneTemplate(basketTemplate), {
    onCheckout: () => events.emit("cart:checkout"),
});

const orderTmpl = ensureElement<HTMLTemplateElement>('#order');
const contactsTmpl = ensureElement<HTMLTemplateElement>('#contacts');
const successTmpl = ensureElement<HTMLTemplateElement>('#success');

function openStep1() {
  const view = new OrderView(cloneTemplate(orderTmpl), {
    onSelectPayment: (payment) => {
      customer.setPayment(payment);
      syncStep1(view);
    },
    onAddressInput: (addr) => {
      customer.setAddress(addr);
      syncStep1(view);
    },
    onSubmit: () => {
      const errors = [];
      if (!customer.payment) errors.push('Не выбран вид оплаты');
      if (!customer.address) errors.push('Укажите адрес доставки');
      if (errors.length) {
        view.setErrors(errors.join('. '));
        syncStep1(view);
        return;
      }
      openStep2();
    },
  });

  view.setPayment(customer.payment);
  view.setAddress(customer.address);
  syncStep1(view);

  modal.content = view.container;
  modal.open();
}

function syncStep1(view: OrderView) {
  const errors = [];
  if (!customer.payment) errors.push('Не выбран вид оплаты');
  if (!customer.address) errors.push('Укажите адрес доставки');

  view.setErrors(errors.length ? errors.join('. ') : null);
  view.setSubmitEnabled(errors.length === 0);
}

function openStep2() {
  const view = new ContactsView(cloneTemplate(contactsTmpl), {
    onEmailInput: (v) => {
      customer.setEmail(v);
      syncStep2(view);
    },
    onPhoneInput: (v) => {
      customer.setPhone(v);
      syncStep2(view);
    },
    onSubmit: () => {
      submitOrder(view);
    },
  });

  view.setEmail(customer.email);
  view.setPhone(customer.phone);
  syncStep2(view);

  modal.content = view.container;
  modal.open();
}

function syncStep2(view: ContactsView) {
  const errs = customer.validateData();
  const texts: string[] = [];
  if (errs.email) texts.push(errs.email);
  if (errs.phone) texts.push(errs.phone);

  view.setErrors(texts.length ? texts.join('. ') : null);
  const ok = !errs.email && !errs.phone && !!customer.email && !!customer.phone;
  view.setSubmitEnabled(ok);
}

function submitOrder(view: ContactsView) {
  const errs = customer.validateData();
  if (errs.email || errs.phone) {
    syncStep2(view);
    return;
  }

  const order: IOrder = {
    payment: customer.payment!,                 // со step1
    address: customer.address,                  // со step1
    email: customer.email,                      // со step2
    phone: customer.phone,                      // со step2
    total: cart.getTotalPrice(),
    items: cart.getItems().map((i) => i.id),
  };

  manager
    .createOrder(order)
    .then(() => {
      const success = new OrderSuccessView(cloneTemplate(successTmpl), {
        onClose: () => modal.close(),
      });
      success.setAmount(order.total);

      modal.content = success.container;

      cart.clear();
      customer.clear();
      const basketCounter = document.querySelector('.header__basket-counter');
      if (basketCounter) basketCounter.textContent = '0';
    })
    .catch(() => {
      view.setErrors('Не удалось оформить заказ, попробуйте позже');
    });
}

events.on('cart:checkout', () => openStep1());


function renderCart(
  cartView: Cart,
  basketItemTemplate: HTMLTemplateElement,
) {
  if (cart.getCount() === 0) {
    cartView.render({
      items: [],
      total: cart.getTotalPrice(),
    });
    return;
  }

  const items = cart.getItems().map((product, index) => {
    const item = new CartItem(cloneTemplate(basketItemTemplate), {
      onRemove: () => events.emit('cart:removeItem', { id: product.id }),
    });
    return item.render({
      title: product.title,
      price: product.price ?? null,
      index: index + 1,
    });
  });

  cartView.render({
    items,
    total: cart.getTotalPrice(),
  });
}

basketBtn.addEventListener("click", () => {

    renderCart(cartView, basketItemTemplate);

    modal.content = cartView.container;
    modal.open();
});

events.on('catalog:changed', () => {
    const itemCards = catalog.getProducts().map((item => {
        
        console.log('Данные для карточки:', item); 

        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item),
        });
        return card.render(item);
    }));

    gallery.render({catalog:itemCards});
});

events.on('card:select', (item: IProduct) => {
    const inCart = cart.hasItem(item.id);

    const cardModalView = new CardModal(cloneTemplate(cardPreviewTemplate), {
        onToggleCart: () => {
            if (inCart) {
                cart.removeItem(item);
            } else {
                cart.addItem(item);
            }
            modal.close();
        },
  });

  cardModalView.render(item);
  modal.content = cardModalView.container;
  modal.open();
});

events.on('cart:updated', () => {
    header.render({count:cart.getCount()});
    renderCart(cartView, basketItemTemplate);
});

events.on('cart:removeItem', (item: IProduct) => {
    cart.removeItem(item);
});

events.on('cart:checkout', () => openStep1());