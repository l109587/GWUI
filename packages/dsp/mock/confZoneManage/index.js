export default function confZoneManage(getParam, postParam, res) {
  let json = ''
  if (getParam.action == 'showZoneTree') {
    if (postParam.id == 5) {
      json = require('../json/confZoneMange/showZoneTree.json')
    } else if (postParam.id == 10) {
      json = require('../json/confZoneMange/showZoneTree10.json')
    } else if (postParam.id == 2) {
      json = require('../json/confZoneMange/showZoneTree2.json')
    } else {
      json = require('../json/confZoneMange/zoneTree.json')
    }
  }
  res.send(json)
}
