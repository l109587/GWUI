export default function log(getParam, postParam, res) {
  let json = '';
  if (getParam.action == 'showDevicelog') {
    json = require('../json/admlog/device.json');
  } else if (getParam.action == 'showPolicylog') {
    json = require('../json/admlog/policylog.json');
  }
  else if (getParam.action == 'showControllog') {
    json = require('../json/admlog/controllog.json');
  }
  else if (getParam.action == 'showAuditlog') {
    json = require('../json/admlog/auditlog.json');
  }
  res.send(json);
}
