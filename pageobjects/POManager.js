import LoginPage from '../pageobjects/LoginPage.js';
import DashboardPage from '../pageobjects/DashboardPage.js';
import CartPage from '../pageobjects/CartPage.js';
import OrderPage from '../pageobjects/OrderPage.js';
import ConfirmationPage from '../pageobjects/ConfirmationPage.js';
import OrdersHistoryPage from './OrdersHistoryPage.js';
import OrderSummaryPage from './OrderSummaryPage.js';

export default class POManager {
  #loginPage;
  #dashboardPage;
  #cartPage;
  #orderPage;
  #confirmationPage;
  #ordersHistoryPage;
  #orderSummaryPage;

  constructor(page) {
    this.#loginPage = new LoginPage(page);
    this.#dashboardPage = new DashboardPage(page);
    this.#cartPage = new CartPage(page);
    this.#orderPage = new OrderPage(page);
    this.#confirmationPage = new ConfirmationPage(page);
    this.#ordersHistoryPage = new OrdersHistoryPage(page);
    this.#orderSummaryPage = new OrderSummaryPage(page);
  }

  get loginPage() {
    return this.#loginPage;
  }

  get dashboardPage() {
    return this.#dashboardPage;
  }

  get cartPage() {
    return this.#cartPage;
  }

  get orderPage() {
    return this.#orderPage;
  }

  get confirmationPage() {
    return this.#confirmationPage;
  }

  get ordersHistoryPage() {
    return this.#ordersHistoryPage;
  }

  get orderSummaryPage() {
    return this.#orderSummaryPage;
  }
}
