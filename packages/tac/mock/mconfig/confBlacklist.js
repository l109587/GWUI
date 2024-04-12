export default function confBlacklist(getParam, postParam, res) {
  let json = '';
  if (getParam.action == 'showWanBlackList') {
    if (postParam.status == 'Y') {
      json = require('../json/configure/aptaddr1.json');
    } else {
      json = require('../json/configure/aptaddr.json');
    }

  }
  if (getParam.action == 'showLanBlackList') {
    json = require('../json/configure/blacklist.json');
  }
  res.send(json);
}
