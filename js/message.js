const userProfileElement = document.querySelector('.user-profile');
const contractorsElement = document.querySelector('#contractors');
const messageErrorElement = document.querySelector('#message-error-server');

export const loadFailMessage = () => {
  userProfileElement.style = 'display: none';
  contractorsElement.style = 'display: none';
  messageErrorElement.removeAttribute('style');
};
