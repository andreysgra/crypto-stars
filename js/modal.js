import {addEscapeEvent} from './utils.js';
import {ContractorsStatus} from './const.js';
import {initExchangeForm, resetExchangeForm} from './exchange-form.js';

const modalElement = document.querySelector('.modal');
const modalDescriptionElement = modalElement.querySelector('.modal__description');
const closeButtonElement = modalElement.querySelector('.close-btn');

const onCloseButtonClick = () => closeModal();

const onModalClick = (evt) => {
  if (evt.target.closest('.modal__content')) {
    return;
  }

  closeModal();
};

const onEscapeKeyDown = (evt) => addEscapeEvent(evt, closeModal);

function closeModal() {
  document.body.classList.remove('scroll-lock');
  modalElement.style.display = 'none';

  modalElement.removeEventListener('click', onModalClick);
  closeButtonElement.removeEventListener('click', onCloseButtonClick);
  document.removeEventListener('keydown', onEscapeKeyDown);

  resetExchangeForm();
}

function openModal() {
  document.body.classList.add('scroll-lock');
  modalElement.style.display = 'flex';

  modalElement.addEventListener('click', onModalClick);
  closeButtonElement.addEventListener('click', onCloseButtonClick);
  document.addEventListener('keydown', onEscapeKeyDown);
}

export const renderModal = (contractor, user) => {
  initExchangeForm(contractor, user);

  if (contractor.status === ContractorsStatus.Seller) {
    modalDescriptionElement.textContent = 'Покупка криптовалюты';
  } else {
    modalDescriptionElement.textContent = 'Продажа криптовалюты';
  }

  openModal();
};
