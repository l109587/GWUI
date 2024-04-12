export default function confResField(getParam, postParam, res) {
  let json = '';
  if (getParam.action == 'showResField') {
    json = require('../json/sysconf/showResField.json');
  } else if (getParam.action == 'showResFieldList') {
    if (postParam.id == '1') {
      json = require('../json/sysconf/showResFieldList.json');
    } else {
      json = require('../json/sysconf/showResFieldList1.json');
    }
  }
  else {
  }
  res.send(json);
}
