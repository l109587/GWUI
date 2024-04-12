export default function confIPOrderManage(getParam, postParam, res) {
  let json = '';
  if (getParam.action == 'applicationStat') {
    json = require('../json/resmngt/applicationStastics.json');
  } else if (getParam.action == 'showIPAllocFlow') {
    json = require('../json/resmngt/checkIPAllocApply.json');
  } else if (getParam.action == 'approvalStat') {
    json = require('../json/resmngt/approvalStast.json');
  } else if (getParam.action == 'showIPAllocApply') {
    json = require('../json/monitor/showIPAddrApplication.json');
  } else if (getParam.action == 'showSubnet') {
    json = require('../json/resmngt/showSubnet.json');
  }
  else if (getParam.action == 'showIPRecycleApply') {
    json = require('../json/resmngt/showIPRecycleApply.json');
  }
  else if (getParam.action == 'showIPChangeApply') {
    json = require('../json/resmngt/showIPChangeApply.json');
  }
  else if (getParam.action == 'showIPChangeFlow') {
    json = require('../json/resmngt/showIPChangeFlow.json');
  }
  else if (getParam.action == 'showIPRecycleFlow') {
    json = require('../json/resmngt/showIPRecycleFlow.json');
  }
  else if (getParam.action == 'preAllocIPAddr') {
    json = require('../json/resmngt/preAllocIPAddr.json');
  }
  else {

  }
  res.send(json);
}
