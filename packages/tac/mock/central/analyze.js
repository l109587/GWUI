import Mock from 'mockjs'
export default function analyze(getParam, postParam, res) {
  let json = '';
  if (getParam.action == 'showAssetsBaseinfo') {
    json = require('../json/central/showAssetsBaseinfo.json');
  }
  if (getParam.action == 'showAssetsCtrlinfo') {
    json = Mock.mock({
      "success": true,
      "total": "50",
      'data|50': [{
        'id|+1': 1,
        "ctrlResult": "pass",
        "ctrlState": "white",
        "regState": "verify",
        "macaddr": "xx:xx:xx:xx:xx:xx",
        "ipaddr": "x.x.x.x",
        "name": "zhangsan-PC",
        "systypeID|+1": 2,
        "systype": "Windows",
        "devtypeID|+1": 2,
        "devtype": "个人电脑",
        "agentTypeID|+1": 2,
        "agentType": "Windows",
        "agentVersion": "v3.0.954",
        "responsible": "张三",
        "authPolicy": "xxx",
        "ctrlPolicy": "xx",
        "scheckPolicy": "xxx",
        "scheckResult": "pass",
        "authUser": "认证用户",
        "blockReason": "xxx",
        "devip": "192.168.12.1"
      }]
    })
    res.send(json);
    return false;
    json = require('../json/central/showAssetsCtrlinfo.json');
  }
  if (getParam.action == 'showResourceStats') {
    json = require('../json/central/showResourceStats.json');
  }
  if (getParam.action == 'showResourceInfo') {
    json = require('../json/central/showResourceInfo.json');
  }
  if (getParam.action == 'showDevtype') {
    json = require('../json/central/showDevtype.json');
  }
  if (getParam.action == 'showSystype') {
    json = require('../json/central/showSystype.json');
  }
  if (getParam.action == 'showAgentType') {
    json = require('../json/central/showAgentType.json');
  }
  else {

  }
  res.send(json);
}
