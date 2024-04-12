export default function adminLog(getParam, postParam, res) {
  let json = '';
  if (getParam.action == 'show') {
    json = require('../json/admlog/action.json')
  }
  else if (getParam.action == 'showmodule') {
    json = require('../json/sysmain/showmouule.json')
  }
  else {
  }
  res.send(json);
}
