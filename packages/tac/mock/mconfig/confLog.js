export default function confLog(getParam, postParam, res) {
  let json = '';
  if (getParam.action == 'showLogReport') {
    json = require('../json/sysconf/showLogReport.json');
  }
  else {
  }
  res.send(json);
}
