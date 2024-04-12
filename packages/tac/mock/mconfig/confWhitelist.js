export default function confWhitelist(getParam, postParam, res) {
  let json = '';
  if (getParam.action == 'showLanWhiteList') {
    json = require('../json/configure/whitelist.json');
  }
  res.send(json);
}
