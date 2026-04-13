import {getFormattedNumber} from './utils.js';
import {ContractorsStatus} from './const.js';

const userTableRowElement = document.querySelector('#user-table-row__template').content
  .querySelector('.users-list__table-row');

const getPaymentMethods = (paymentMethods, element) => {
  const fragment = document.createDocumentFragment();

  paymentMethods.forEach((paymentMethod) => {
    const badgesItemElement = element.querySelector('.users-list__badges-item').cloneNode();

    badgesItemElement.textContent = paymentMethod.provider;
    fragment.append(badgesItemElement);
  });

  return fragment;
};

export const createContractor = (contractors) => {
  const {id, userName, isVerified, balance, exchangeRate, status, paymentMethods, minAmount} = contractors;
  const maxAmount =
    status === ContractorsStatus.Seller ? Math.round(balance.amount * exchangeRate) : balance.amount;

  const element = userTableRowElement.cloneNode(true);
  const badgesList = element.querySelector('.users-list__badges-list');

  element.querySelector('.users-list__table-name span').textContent = userName;

  if (!isVerified) {
    element.querySelector('.users-list__table-name svg').remove();
  }

  element.querySelector('.users-list__table-currency').textContent = balance.currency;
  element.querySelector('.users-list__table-exchangerate').innerHTML =
    `${getFormattedNumber(exchangeRate)}&nbsp;₽`;

  element.querySelector('.users-list__table-cashlimit').innerHTML =
    `${minAmount}&nbsp;₽&nbsp;-&nbsp;${maxAmount}&nbsp;₽`;

  if (status === ContractorsStatus.Seller) {
    const fragment = getPaymentMethods(paymentMethods, element);

    badgesList.innerHTML = '';
    badgesList.append(fragment);
  } else {
    badgesList.innerHTML = '';
  }

  element.querySelector('.btn--greenborder').dataset.id = id;

  return element;
};
