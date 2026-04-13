import {createContractor} from './contractor.js';
import {ContractorsStatus} from './const.js';

const usersTable = document.querySelector('.users-list__table-body');
const toggleBuySellElement = document.querySelector('.tabs--toggle-buy-sell');
const checkedUsersElement = document.querySelector('#checked-users');

let isVerifiedContractor = false;
let contractorStatus = ContractorsStatus.Seller;

const filterByStatus = (contractor) => contractor.status === contractorStatus;

const filterByVerified = (contractor) => isVerifiedContractor ? contractor.isVerified : contractor;

const filterContractors = (contractors) => contractors.filter((contractor) =>
  filterByStatus(contractor) && filterByVerified(contractor));

const createContractorsList = (contractors) => {
  const fragment = document.createDocumentFragment();

  contractors.forEach((contractor) => fragment.append(createContractor(contractor)));

  return fragment;
};

const getFilteredContractors = (contractors) => {
  usersTable.querySelectorAll('.users-list__table-row')
    .forEach((element) => element.remove());

  usersTable.append(createContractorsList(filterContractors(contractors)));
};

const toggleBuySellClick = (contractors) => (evt) => {
  const activeClassName = 'is-active';
  const buttonElement = evt.target.closest('.tabs__control');

  if (buttonElement) {
    const activeButton = toggleBuySellElement.querySelector(`.${activeClassName}`);

    if (activeButton !== buttonElement) {
      activeButton.classList.remove(activeClassName);
      buttonElement.classList.add(activeClassName);
      contractorStatus = buttonElement.id;

      getFilteredContractors(contractors);
    }
  }
};

const onCheckedUsersChange = (contractors) => () => {
  isVerifiedContractor = checkedUsersElement.checked;

  getFilteredContractors(contractors);
};

export const renderContractors = (contractors) => {
  usersTable.append(createContractorsList(filterContractors(contractors)));

  toggleBuySellElement.addEventListener('click', toggleBuySellClick(contractors));
  checkedUsersElement.addEventListener('change', onCheckedUsersChange(contractors));
};
