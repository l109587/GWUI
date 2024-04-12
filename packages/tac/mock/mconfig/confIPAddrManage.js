import Mock from 'mockjs'

export default function confIPAddrManage(getParam, postParam, res) {
  let json = '';
  if (getParam.action == 'showIPSubNetAddr') {
    if (postParam.orgID == 1) {
      json = require('../json/configure/subnet.json');
    } else {
      json = require('../json/configure/subnet1.json');
    }

  }
  else if (getParam.action == 'queryIPAddr') {
    json = require('../json/configure/queryIPAddr.json');
  }
  else if (getParam.action == 'exportIPSubNetAddr') {
    json = require('../json/temporary/file.json');
  }
  else if (getParam.action == 'showAllocSubnet') {
    json = require('../json/configure/showAllocSubnet.json');
  }
  else if (getParam.action == 'showIPAddrList') {
    json = Mock.mock({
      "success": true,
      "total": "1",
      'data|256': [{
        'id|+1': 1,
        "subnetID": 6,
        "subnet": "192.168.12.0",
        "ipaddr": "192.168.12.2",
        "macaddr": "00:50:56:8A:51:57",
        "mngState": "unassigned",
        "validType": "forever",
        "expireTime": 0,
        "buisUsgID": "3",
        "buisUsg": "服务器",
        "devTypeID": "5",
        "devType": "个人电脑",
        "user": "张三",
        "phone": "13823568746",
        "location": "一楼大厅",
        "createTime": "2022-04-26 01:22:12",
        "updateTime": "2022-04-25 18:19:33"
      }]
    })
    res.send(json);
    return false;
    json = require('../json/configure/showIPAddrList.json');
  }
  else if (getParam.action == 'showPlanIPNetAddrList') {
    if (postParam.leaf == 'N') {
      json = require('../json/configure/addrplan.json');
    } else {
      json = require('../json/configure/addrplan.json');
    }
  }
  else if (getParam.action == 'showIPAddrApplication') {
    json = require('../json/monitor/showIPAddrApplication.json');
  }
  else {
  }
  res.send(json);
}