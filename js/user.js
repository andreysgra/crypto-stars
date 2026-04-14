const userNameElement = document.querySelector('#user-name');
const userCryptoElement = document.querySelector('#user-crypto-balance');
const userFiatElement = document.querySelector('#user-fiat-balance');

export const renderUser = (user) => {
  const {userName, balances} = user;
  const [fiatBalance, cryptoBalance] = balances;

  userNameElement.textContent = userName;
  userCryptoElement.textContent = cryptoBalance.amount;
  userFiatElement.textContent = fiatBalance.amount;
};
