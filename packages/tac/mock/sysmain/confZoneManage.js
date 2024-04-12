export default function confZoneManage(getParam, postParam, res) {
  let json = ''
  if (getParam.action == 'showZoneTree') {
    if (postParam.id == 5) {
      json = require('../json/sysmain/zonetree1.json')
    } else if (postParam.id == 10) {
      json = require('../json/sysmain/zonetree2.json')
    } else {
      json = require('../json/sysmain/zonetree.json')
    }
  } else if (getParam.action == 'showZoneList') {
    json = require('../json/sysmain/zonelist.json')
  }
  res.send(json)
}
