import {BASE_URL, ContractorsStatus} from './const.js';
import {getFormattedNumber} from './utils.js';
import {sendData} from './api.js';

const exchangeFormElement = document.querySelector('.modal form');
const modalVerifiedIconElement = exchangeFormElement.querySelector('.transaction-info__data svg');
const modalCryptoWalletElement = document.querySelector('#modal-crypto-wallet');
const paymentUnitElement = document.querySelector('#payment-amount .custom-input__unit');
const creditUnitElement = document.querySelector('#credit-amount .custom-input__unit');
const submitButtonElement = exchangeFormElement.querySelector('.modal__submit');
const messageErrorElement = exchangeFormElement.querySelector('.modal__validation-message--error');
const messageSuccessElement = exchangeFormElement.querySelector('.modal__validation-message--success');

let currentContractor;
let currentUser;

const getPaymentMethods = (paymentMethods) => {
  const fragment = document.createDocumentFragment();
  const selectOption = exchangeFormElement.paymentMethod
    .querySelector('option').cloneNode(true);

  exchangeFormElement.paymentMethod.querySelectorAll('option')
    .forEach((option) => option.remove());

  fragment.append(selectOption);

  paymentMethods.forEach((paymentMethod) => {
    const option = document.createElement('option');
    option.textContent = paymentMethod.provider;

    fragment.append(option);
  });

  return fragment;
};

const getExchangeForm = () => {
  const {id, userName, isVerified, balance, exchangeRate, status, minAmount, paymentMethods, wallet} = currentContractor;
  const maxAmount =
    status === ContractorsStatus.Seller ? Math.round(balance.amount * exchangeRate) : balance.amount;

  exchangeFormElement.querySelector('#modal-user-name').textContent = userName;

  if (!isVerified) {
    modalVerifiedIconElement.setAttribute('hidden', '');
  } else {
    modalVerifiedIconElement.removeAttribute('hidden');
  }

  exchangeFormElement.querySelector('#modal-exchangerate').innerHTML =
    `${getFormattedNumber(exchangeRate)}&nbsp;₽`;

  exchangeFormElement.querySelector('#modal-limit').innerHTML =
    `${getFormattedNumber(minAmount)}&nbsp;₽&nbsp;-&nbsp;${getFormattedNumber(maxAmount)}&nbsp;₽`;

  if (status === ContractorsStatus.Seller) {
    exchangeFormElement.paymentMethod.append(getPaymentMethods(paymentMethods));

    modalCryptoWalletElement.removeAttribute('style');
    exchangeFormElement.wallet.value = currentUser.wallet.address;
    exchangeFormElement.type.value = 'BUY';
    exchangeFormElement.sendingCurrency.value = 'RUB';
  } else {
    exchangeFormElement.paymentMethod.append(getPaymentMethods(currentUser.paymentMethods));

    modalCryptoWalletElement.style.order = '-1';
    exchangeFormElement.wallet.value = wallet.address;
    exchangeFormElement.type.value = 'SELL';
    exchangeFormElement.sendingCurrency.value = 'KEKS';
  }

  exchangeFormElement.contractorId.value = id;
  exchangeFormElement.exchangeRate.value = exchangeRate;
  exchangeFormElement.receivingCurrency.value = balance.currency;

  paymentUnitElement.textContent = (status === ContractorsStatus.Seller) ? '₽' : 'KEKS';
  creditUnitElement.textContent = (status === ContractorsStatus.Seller) ? 'KEKS' : '₽';
};

const onPaymentsMethodsChange = () => {
  const {status, paymentMethods} = currentContractor;
  const methods = (status === ContractorsStatus.Seller) ? paymentMethods : currentUser.paymentMethods;
  const currentMethod = methods.find((method) => method.provider === exchangeFormElement.paymentMethod.value);

  exchangeFormElement.card.value = currentMethod.accountNumber ??= '';
};

const onSendingAmountInput = () => {
  exchangeFormElement.receivingAmount.value =
    (currentContractor.status === ContractorsStatus.Seller) ?
      exchangeFormElement.sendingAmount.value / currentContractor.exchangeRate :
      exchangeFormElement.sendingAmount.value * currentContractor.exchangeRate;
};

const onReceivingAmountInput = () => {
  exchangeFormElement.sendingAmount.value =
    (currentContractor.status === ContractorsStatus.Seller) ?
      exchangeFormElement.receivingAmount.value * currentContractor.exchangeRate :
      exchangeFormElement.receivingAmount.value / currentContractor.exchangeRate;
};

const disableSubmitButton = () => {
  submitButtonElement.disabled = true;
};

const enableSubmitButton = () => {
  submitButtonElement.disabled = false;
};

const onFailUpload = () => {
  messageErrorElement.style.display = 'flex';
};

const onSuccessUpload = () => {
  messageSuccessElement.style.display = 'flex';
  exchangeFormElement.reset();
};

const onExchangeFormSubmit = (evt) => {
  evt.preventDefault();

  disableSubmitButton();

  messageErrorElement.style.display = 'none';
  messageSuccessElement.style.display = 'none';

  (async () => {
    await sendData(BASE_URL, onSuccessUpload, onFailUpload, new FormData(evt.target));

    enableSubmitButton();
  })();
};

export const initExchangeForm = (contractor, user) => {
  currentContractor = contractor;
  currentUser = user;

  getExchangeForm();

  exchangeFormElement.paymentMethod.addEventListener('change', onPaymentsMethodsChange);
  exchangeFormElement.sendingAmount.addEventListener('input', onSendingAmountInput);
  exchangeFormElement.receivingAmount.addEventListener('input', onReceivingAmountInput);
  exchangeFormElement.addEventListener('submit', onExchangeFormSubmit);
};

export const resetExchangeForm = () => {
  exchangeFormElement.reset();

  messageErrorElement.style.display = 'none';
  messageSuccessElement.style.display = 'none';

  exchangeFormElement.paymentMethod.removeEventListener('change', onPaymentsMethodsChange);
  exchangeFormElement.sendingAmount.removeEventListener('input', onSendingAmountInput);
  exchangeFormElement.receivingAmount.removeEventListener('input', onReceivingAmountInput);
  exchangeFormElement.removeEventListener('submit', onExchangeFormSubmit);
};
