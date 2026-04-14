import {ContractorsStatus} from './const.js';

const filterByStatus = (contractor, status) => contractor.status === status;

const filterByVerified = (contractor, isVerified) => isVerified ? contractor.isVerified : contractor;

const filterByCIP = (contractor) => contractor.paymentMethods.some((paymentMethod) =>
  paymentMethod.provider === 'Cash in person');

export const filterContractors = (contractors, status, isVerified) => contractors.filter((contractor) =>
  filterByStatus(contractor, status) && filterByVerified(contractor, isVerified));

export const filterSellers = (contractors, isVerified) => contractors.filter((contractor) =>
  filterByStatus(contractor, ContractorsStatus.Seller) && filterByCIP(contractor) &&
  filterByVerified(contractor, isVerified));
