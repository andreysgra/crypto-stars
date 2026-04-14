export const getFormattedNumber = (digits) => new Intl.NumberFormat('ru-RU').format(digits);

export const addEscapeEvent = (evt, action) => {
  if (evt.key === 'Escape') {
    action();
  }
};
