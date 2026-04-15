import {ContractorsStatus} from './const.js';
import {getFormattedNumber} from './utils.js';

const exchangeFormElement = document.querySelector('.modal form');
const modalVerifiedIconElement = exchangeFormElement.querySelector('.transaction-info__data svg');
const modalCryptoWalletElement = document.querySelector('#modal-crypto-wallet');
const paymentUnitElement = document.querySelector('#payment-amount .custom-input__unit');
const creditUnitElement = document.querySelector('#credit-amount .custom-input__unit');

let globalContractor;
let globalUser;

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

const getExchangeForm = (contractor, user) => {
  const {id, userName, isVerified, balance, exchangeRate, status, minAmount, paymentMethods, wallet} = contractor;
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
    exchangeFormElement.wallet.value = user.wallet.address;
    exchangeFormElement.type.value = 'BUY';
    exchangeFormElement.sendingCurrency.value = 'RUB';
  } else {
    exchangeFormElement.paymentMethod.append(getPaymentMethods(user.paymentMethods));

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
  const {status, paymentMethods} = globalContractor;
  const methods = (status === ContractorsStatus.Seller) ? paymentMethods : globalUser.paymentMethods;
  const currentMethod = methods.find((method) => method.provider === exchangeFormElement.paymentMethod.value);

  exchangeFormElement.card.value = currentMethod.accountNumber ??= '';
};

const onSendingAmountInput = () => {
  exchangeFormElement.receivingAmount.value =
    (globalContractor.status === ContractorsStatus.Seller) ?
      exchangeFormElement.sendingAmount.value / globalContractor.exchangeRate :
      exchangeFormElement.sendingAmount.value * globalContractor.exchangeRate;
};

const onReceivingAmountInput = () => {
  exchangeFormElement.sendingAmount.value =
    (globalContractor.status === ContractorsStatus.Seller) ?
      exchangeFormElement.receivingAmount.value * globalContractor.exchangeRate :
      exchangeFormElement.receivingAmount.value / globalContractor.exchangeRate;
};

export const initExchangeForm = (contractor, user) => {
  globalContractor = contractor;
  globalUser = user;

  getExchangeForm(contractor, user);

  exchangeFormElement.paymentMethod.addEventListener('change', onPaymentsMethodsChange);
  exchangeFormElement.sendingAmount.addEventListener('input', onSendingAmountInput);
  exchangeFormElement.receivingAmount.addEventListener('input', onReceivingAmountInput);
};

export const resetExchangeForm = () => {
  exchangeFormElement.reset();

  exchangeFormElement.paymentMethod.removeEventListener('change', onPaymentsMethodsChange);
  exchangeFormElement.sendingAmount.removeEventListener('input', onSendingAmountInput);
  exchangeFormElement.receivingAmount.removeEventListener('input', onReceivingAmountInput);
};
