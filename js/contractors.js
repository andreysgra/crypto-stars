import {createContractor} from './contractor.js';
import {ContractorsStatus} from './const.js';
import {filterContractors, filterSellers} from './filter.js';
import {addMarkers, initMap} from './map.js';

const usersTableElement = document.querySelector('.users-list__table-body');
const toggleBuySellElement = document.querySelector('.tabs--toggle-buy-sell');
const toggleCustomElement = document.querySelector('#checked-users');
const toggleListMapElement = document.querySelector('.tabs--toggle-list-map');
const contractorsElement = document.querySelector('.users-list');
const mapElement = document.querySelector('#map');

const activeClassName = 'is-active';

let isVerifiedContractor = false;
let contractorStatus = ContractorsStatus.Seller;

const createContractorsList = (contractors) => {
  const fragment = document.createDocumentFragment();

  contractors.forEach((contractor) => fragment.append(createContractor(contractor)));

  return fragment;
};

const getFilteredContractors = (contractors) => {
  usersTableElement.querySelectorAll('.users-list__table-row')
    .forEach((element) => element.remove());

  usersTableElement.append(createContractorsList(filterContractors(contractors, contractorStatus, isVerifiedContractor)));
};

const onToggleBuySellClick = (contractors) => (evt) => {
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

const onToggleCustomChange = (contractors) => () => {
  isVerifiedContractor = toggleCustomElement.checked;

  const sellers = filterSellers(contractors, isVerifiedContractor);

  getFilteredContractors(contractors);
  addMarkers(sellers);
};

const onToggleListMapClick = (contractors) => (evt) => {
  const buttonElement = evt.target.closest('.tabs__control');

  if (buttonElement) {
    const sellers = filterSellers(contractors, isVerifiedContractor);
    const activeButton = toggleListMapElement.querySelector(`.${activeClassName}`);

    if (activeButton !== buttonElement) {
      activeButton.classList.remove(activeClassName);
      buttonElement.classList.add(activeClassName);

      if (buttonElement.id === 'user-list') {
        mapElement.setAttribute('hidden', '');
        contractorsElement.removeAttribute('hidden');
      } else {
        contractorsElement.setAttribute('hidden', '');
        mapElement.removeAttribute('hidden');

        initMap();
        addMarkers(sellers);
      }
    }
  }
};

export const renderContractors = (contractors) => {
  usersTableElement.append(createContractorsList(filterContractors(contractors, contractorStatus)));

  toggleBuySellElement.addEventListener('click', onToggleBuySellClick(contractors));
  toggleCustomElement.addEventListener('change', onToggleCustomChange(contractors));
  toggleListMapElement.addEventListener('click', onToggleListMapClick(contractors));
};
