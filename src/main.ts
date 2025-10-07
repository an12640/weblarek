import './scss/styles.scss';

import { ProductCatalog } from './components/Models/ProductCatalog';
import { ShoppingCart } from './components/Models/ShoppingCart';
import { Customer } from './components/Models/Customer';
import { apiProducts } from './utils/data';

const catalog = new ProductCatalog();
const cart = new ShoppingCart();
const customer = new Customer();

// Проверка каталога
catalog.setProducts(apiProducts.items);
console.log('Все товары:', catalog.getProducts());
const selectedProduct = catalog.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390');
console.log('Товар по id:', selectedProduct);
// console.log('Все id товаров:', catalog.getProducts().map(p => p.id));
// catalog.setSelectedProduct(selectedProduct);
// console.log('выбранный продукт:', catalog.getSelectedProduct());

// Проверка корзины
cart.addItem(apiProducts.items[0]);
console.log('Корзина:', cart.getItems());
console.log('Сумма:', cart.getTotalPrice());

// Проверка покупателя
customer.setEmail('test@mail.com');
customer.setPhone('1234567890');
console.log('Данные покупателя:', customer.getData());
console.log('Ошибки валидации:', customer.validateData());

/*
const productsModel = new ProductCatalog();
productsModel.setProducts(apiProducts.items);
console.log(`Массив товаров из каталога: `, productsModel.getProducts())
*/