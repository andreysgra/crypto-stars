import {getData} from './api.js';
import {BASE_URL} from './const.js';
import {renderContractors} from './contractors.js';

(async () => {
  const contractors = await getData(`${BASE_URL}/contractors`);
  renderContractors(contractors);
})();
