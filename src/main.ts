import "./scss/styles.scss";

import { ProductCatalog } from "./components/models/ProductCatalog";
import { ShoppingCart } from "./components/models/ShoppingCart";
import { Customer } from "./components/models/Customer";
import { apiProducts } from "./utils/data";
import { Api } from "./components/base/Api";
import { IOrder } from "./types";
import { NetworkManager } from "./components/network/NetworkManager";
import { API_URL } from "./utils/constants";

const catalog = new ProductCatalog();
const cart = new ShoppingCart();
const customer = new Customer();

// Проверка каталога
catalog.setProducts(apiProducts.items);
console.log("Все товары:", catalog.getProducts());
const selectedProduct = catalog.getProductById(
    "854cef69-976d-4c2a-a18c-2aa45046c390",
);
console.log("Товар по id:", selectedProduct);
if (selectedProduct) {
    catalog.setSelectedProduct(selectedProduct);
}
console.log("выбранный продукт:", catalog.getSelectedProduct());

// Проверка корзины
cart.addItem(apiProducts.items[0]);
console.log("Корзина:", cart.getItems());
console.log("Сумма:", cart.getTotalPrice());
console.log("Есть ли первый элемент:", cart.hasItem(apiProducts.items[0].id));
cart.clear();
console.log("Текущее кол-во после тотальной очистки", cart.getCount());
console.log(
    "Есть ли несуществующий элемент",
    cart.hasItem(apiProducts.items[3].id),
);
cart.addItem(apiProducts.items[1]);
cart.addItem(apiProducts.items[2]);
console.log("Текущее кол-во", cart.getCount());
cart.removeItem(apiProducts.items[2]);
console.log("Текущее кол-во после удаления одного элемента", cart.getCount());

// Проверка покупателя
customer.setAddress("kolotuskina");
console.log("Данные покупателя:", customer.getData());
console.log("Ошибки валидации:", customer.validateData());
customer.clear();
console.log("Данные покупателя после очистки:", customer.getData());
customer.setAddress("kolotuskina");
customer.setEmail("test@mail.com");
customer.setPhone("1234567890");
customer.setPayment("cash");
console.log("Данные покупателя:", customer.getData());

// Проверка api
const manager = new NetworkManager(new Api(API_URL));

manager
    .getProducts()
    .then((products) => console.log("Получены продукты:", products))
    .catch((err) => console.error("Ошибка при получении товаров", err));

const order: IOrder = {
    payment: "cash",
    address: customer.address,
    email: customer.email,
    phone: customer.phone,
    total: cart.getTotalPrice(),
    items: cart.getItems().map((item) => item.id),
};

manager
    .createOrder(order)
    .then((order) => console.log("Создан заказ:", order))
    .catch((err) => console.error("Ошибка при создании заказа", err));
