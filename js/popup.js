import {getFormattedNumber} from './utils.js';
import {renderModal} from './modal.js';

const popupElement = document.querySelector('#map-baloon__template')
  .content.querySelector('.user-card');

const getPaymentMethods = (paymentMethods, element) => {
  const fragment = document.createDocumentFragment();

  paymentMethods.forEach((paymentMethod) => {
    const badgesItemElement = element.querySelector('.badge').cloneNode();

    badgesItemElement.textContent = paymentMethod.provider;
    fragment.append(badgesItemElement);
  });

  return fragment;
};

export const createPopup = (contractor, user) => {
  const {userName, isVerified, balance, exchangeRate, minAmount, paymentMethods} = contractor;
  const maxAmount = Math.round(balance.amount * exchangeRate);

  const element = popupElement.cloneNode(true);
  const badgesList = element.querySelector('.user-card__badges-list');

  element.querySelector('.user-card__user-name').style.width = '100%';
  element.querySelector('#balloon-user-name').textContent = userName;

  if (!isVerified) {
    element.querySelector('.user-card__user-name svg').remove();
  }

  element.querySelector('#balloon-currency').textContent = balance.currency;
  element.querySelector('#balloon-exchange-rate').innerHTML = `${getFormattedNumber(exchangeRate)}&nbsp;₽`;
  element.querySelector('#balloon-limit').innerHTML =
    `${getFormattedNumber(minAmount)}&nbsp;₽&nbsp;-&nbsp;${getFormattedNumber(maxAmount)}&nbsp;₽`;

  const methods = getPaymentMethods(paymentMethods, element);

  badgesList.innerHTML = '';
  badgesList.append(methods);

  element.querySelector('.user-card__change-btn')
    .addEventListener('click', () => {
      renderModal(contractor, user);
    });

  return element;
};
