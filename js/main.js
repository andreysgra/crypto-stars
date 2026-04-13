import {getData} from './api.js';
import {BASE_URL} from './const.js';
import {renderContractors} from './contractors.js';
import {renderUser} from './user.js';

(async () => {
  const contractors = await getData(`${BASE_URL}/contractors`);
  renderContractors(contractors);

  const user = await getData(`${BASE_URL}/user`);
  renderUser(user);
})();
