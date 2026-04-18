import {ContractorsStatus} from './const.js';

const exchangeFormElement = document.querySelector('.modal-buy');

const ErrorMessage = {
  AMOUNT_MIN: 'Минимальная сумма',
  AMOUNT_MAX: 'Максимальная сумма',
  AMOUNT_MAX_EXCEEDED: 'Превышена максимальная сумма',
  PAYMENT_METHOD: 'Платёжная система не выбрана'
};

let contractorData;
let userData;

const pristine = new Pristine(exchangeFormElement, {
  classTo: 'custom-input',
  errorTextParent: 'custom-input',
  errorTextClass: 'custom-input__error'
});

const validateMinSendingAmount = (value) =>
  (contractorData.status === ContractorsStatus.Seller) ?
    value >= contractorData.minAmount :
    value >= contractorData.minAmount / contractorData.exchangeRate;

const getMinSendingAmountError = () =>
  (contractorData.status === ContractorsStatus.Seller) ?
    `${ErrorMessage.AMOUNT_MIN}: ${contractorData.minAmount} ₽` :
    `${ErrorMessage.AMOUNT_MIN}: ${contractorData.minAmount / contractorData.exchangeRate} KEKS`;

const validateMaxSendingAmount = (value) =>
  (contractorData.status === ContractorsStatus.Seller) ?
    value <= contractorData.balance.amount * contractorData.exchangeRate && value <= userData.balances[0].amount :
    value <= userData.balances[1].amount && value <= contractorData.balance.amount;

const getMaxSendingAmountError = () => ErrorMessage.AMOUNT_MAX_EXCEEDED;

const validateMinReceivingAmount = (value) =>
  (contractorData.status === ContractorsStatus.Seller) ?
    value >= contractorData.minAmount / contractorData.exchangeRate :
    value >= contractorData.minAmount;

const getMinReceivingAmountError = () =>
  (contractorData.status === ContractorsStatus.Seller) ?
    `${ErrorMessage.AMOUNT_MIN}: ${contractorData.minAmount / contractorData.exchangeRate} KEKS` :
    `${ErrorMessage.AMOUNT_MIN}: ${contractorData.minAmount} ₽`;

const validateMaxReceivingAmount = (value) =>
  (contractorData.status === ContractorsStatus.Seller) ?
    value <= contractorData.balance.amount && value <= userData.balances[0].amount / contractorData.exchangeRate :
    value <= userData.balances[1].amount * contractorData.exchangeRate;

const getMaxReceivingAmountError = () =>
  (contractorData.status === ContractorsStatus.Seller) ?
    ErrorMessage.AMOUNT_MAX_EXCEEDED :
    `${ErrorMessage.AMOUNT_MAX}: ${userData.balances[1].amount * contractorData.exchangeRate} ₽`;

const validatePaymentMethod = (value) => value !== exchangeFormElement.paymentMethod.options[0].value;

pristine.addValidator(exchangeFormElement.sendingAmount, validateMinSendingAmount, getMinSendingAmountError);
pristine.addValidator(exchangeFormElement.sendingAmount, validateMaxSendingAmount, getMaxSendingAmountError);
pristine.addValidator(exchangeFormElement.receivingAmount, validateMinReceivingAmount, getMinReceivingAmountError);
pristine.addValidator(exchangeFormElement.receivingAmount, validateMaxReceivingAmount, getMaxReceivingAmountError);
pristine.addValidator(exchangeFormElement.paymentMethod, validatePaymentMethod, ErrorMessage.PAYMENT_METHOD);

export const initValidation = (contractor, user) => {
  contractorData = contractor;
  userData = user;
};

export const setValidation = () => pristine.validate();

export const resetValidation = () => pristine.reset();

export const validateElement = (element) => pristine.validate(element);
