import {getData} from './api.js';
import {BASE_URL} from './const.js';
import {renderContractors} from './contractors.js';
import {renderUser} from './user.js';
import {loadFailMessage} from './message.js';

(async () => {
  const contractors = await getData(`${BASE_URL}/contractors`, loadFailMessage);
  const user = await getData(`${BASE_URL}/user`, loadFailMessage);

  renderContractors(contractors, user);
  renderUser(user);
})();
