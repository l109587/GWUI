export default function userSync(getParam, postParam, res) {
  let json = '';
  if (getParam.action == 'showUserSync') {
    json = require('../json/userSync/showUserSync.json');
  }
  else if (getParam.action == 'getSyncServerType') {
    json = require('../json/userSync/getSyncServerType.json');
  }
  else if (getParam.action == 'getSyncUserAttr') {
    json = require('../json/userSync/getSyncUserAttr.json');
  }
  else {

  }
  res.send(json);
}
