export default function device(getParam, postParam, res) {
  let json = '';
  if (getParam.action == 'showDeviceList') {
    if (postParam.zoneID != '5') {
      json = require('../json/configure/device1.json');
    } else {
      json = require('../json/configure/device.json');
    }
  }
  else if (getParam.action == 'showCfgLinkDev') {
    json = require('../json/mconfig/showCfgLinkDev.json');
  }
  res.send(json);
}
