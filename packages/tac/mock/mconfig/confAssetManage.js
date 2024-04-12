import Mock from 'mockjs'
export default function confAssetManage(getParam, postParam, res) {
  let json = '';
  if (getParam.action == 'showAsset') {
    json = Mock.mock({
      "success": true,
      "total": "50",
      'data|50': [{
        'id|+1': 1,
        "origin": "record",
        "zoneID": 1,
        "zone": "北京市",
        "fullZone": "北京市/海淀区",
        "orgID": 1,
        "org": "北京市",
        "fullOrg": "北京市/海淀区",
        "assetTypeID": 1,
        "assetType": "PC",
        "ipaddr": "192.168.100.100",
        "macaddr": "00:0C:29:77:57:09",
        "user": "zhangsan",
        "phone": "18234789704",
        "assetModel": "1508",
        "buisUsg": "监控设备",
        "location": "一楼",
        "notes": "监控设备"
      }]
    })
  }
  else if (getParam.action == 'applicationStat') {
    json = require('../json/confAssetManage/applicationStat.json');
  }
  else if (getParam.action == 'approvalStat') {
    json = require('../json/confAssetManage/approvalStat.json');
  }
  else if (getParam.action == 'showSignINFlow') {
    json = require('../json/confAssetManage/showSignINFlow.json');
  }
  else if (getParam.action == 'showSignChangeFlow') {
    json = require('../json/confAssetManage/showSignChangeFlow.json');
  }
  else if (getParam.action == 'queryAsset') {
    json = require('../json/confAssetManage/queryAsset.json');
  }
  else if (getParam.action == 'showSignOUTFlow') {
    json = require('../json/confAssetManage/showSignOUTFlow.json');
  }
  else if (getParam.action == 'preAllocIPAddr') {
    json = require('../json/confAssetManage/preAllocIPAddr.json');
  }
  else if (getParam.action == 'showSignOUTApply') {
    json = Mock.mock({
      "success": true,
      "total": "50",
      'data|50': [{
        'id|+1': 1,
        "orderState": "unprocessed",
        "orderID": "ASxxx",
        "macaddr": "AA-BB-CC-DD-EE-FF",
        "ipaddr": "192.168.100.100",
        "zone": "北京市",
        "org": "北京市",
        "user": "zhangsan",
        "phone": "15112345678",
        "assetType": "PC",
        "assetModel": "1508",
        "buisUsg": "办公设备",
        "location": "一楼",
        "vlan": "12",
        "notes": "备注",
        "applicant": "申请人",
        "approver": "审批人",
      }]
    })
  }
  else if (getParam.action == 'showSignChangeApply') {
    json = Mock.mock({
      "success": true,
      "total": "50",
      'data|50': [{
        'id|+1': 1,
        "orderState": "unprocessed",
        "orderID": "ASxxx",
        "macaddr": "AA:BB:CC:DD:EE:FF",
        "ipaddr": "192.168.10.1",
        "zone": "北京市",
        "org": "北京市",
        "assetType": "PC",
        "user": "zhangsan",
        "phone": "15112345678",
        "assetModel": "1508",
        "buisUsg": "办公设备",
        "location": "一楼",
        "vlan": "12",
        "notes": "备注",
        "applicant": "申请人",
        "approver": "审批人",
      }]
    })
  }
  else if (getParam.action == 'showSignINApply') {
    json = Mock.mock({
      "success": true,
      "total": "50",
      'data|50': [{
        'id|+1': 1,
        "orderState": "unprocessed",
        "orderID": "ASxxx",
        "zoneID": 1,
        "zone": "北京市",
        "fullZone": "北京市/海淀区",
        "orgID": 1,
        "org": "北京市",
        "fullOrg": "北京市/海淀区",
        "user": "zhangsan",
        "phone": "15112345678",
        "macaddr": "AA-BB-CC-DD-EE-FF",
        "assetType": "PC",
        "assetModel": "1508",
        "buisUsg": "办公设备",
        "location": "一楼",
        "vlan": "12",
        "notes": "备注",
        "applicant": "申请人",
        "approver": "审批人",
      }]
    })
  }
  else {

  }
  res.send(json);
}
