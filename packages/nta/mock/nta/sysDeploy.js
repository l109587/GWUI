export default function confReport(getParam, postParam, res) {
  let json = ''
  if (getParam.action == 'showDepartment'){
    json = require('../json/nta/sysDeploy/showDepartment.json');
  }else if (getParam.action == 'showDevRegist'){
    json = require('../json/nta/sysDeploy/showDevRegist.json');
  }else if(getParam.action == 'setDevRegist'){
    json = require('../json/nta/sysDeploy/setDevRegist.json');
  }else if(getParam.action == 'getRegistPageContent'){
    json = require('../json/nta/sysDeploy/getRegistPageContent.json');
  }
  res.send(json)
}