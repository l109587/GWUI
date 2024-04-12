export default function showUserInfo(getParam, postParam, res) {
  let json = '';
  if (getParam.action == 'showUserInfo') {
    json = require('../json/cfgmngt/showUserInfo.json');
  }
  else if (getParam.action == 'getUserType') {
    json = require('../json/cfgmngt/getUserType.json')
  }
  else {
  }
  res.send(json);
}
