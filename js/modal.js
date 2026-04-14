import {addEscapeEvent} from './utils.js';

const modalElement = document.querySelector('.modal');
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
  modalElement.style.display = 'none';

  modalElement.removeEventListener('click', onModalClick);
  closeButtonElement.removeEventListener('click', onCloseButtonClick);
  document.removeEventListener('keydown', onEscapeKeyDown);
}

function openModal() {
  modalElement.style.display = 'flex';

  modalElement.addEventListener('click', onModalClick);
  closeButtonElement.addEventListener('click', onCloseButtonClick);
  document.addEventListener('keydown', onEscapeKeyDown);
}

export const renderModal = () => {
  openModal();
};
