export default function sysSetting(getParam, postParam, res) {
  let json = ''
  //系统设置
  if (getParam.action == 'getSystime') {
    json = require('../json/sysmain/time.json')
    //NTP
  } else if (getParam.action == 'getNTP') {
    json = require('../json/sysmain/ntp.json')
  } else if (getParam.action == 'getSNMP') {
    json = require('../json/sysconf/sysserv.json')
  } 
  res.send(json)
}
