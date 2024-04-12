export default function matcfg(getParam, postParam,res) {
  let json = ''
  if (getParam.action == 'showLocalBackup') {
    json = require('../json/upload/tenancetable.json')
  } else if (getParam.action == 'showBackupConf') {
    json = require('../json/sysmain/showBackupConf.json')
  } else if (getParam.action == 'importBackupConf') {
    json = require('../json/upload/importBackupConf.json')
  } else if (getParam.action == 'exportBackupConf') {
    if (postParam.op == 'export') {
      json = require('../json/upload/exportBackupConf.json')
    } else if (postParam.op == 'rdnext') {
      json = require('../json/upload/nocode.json')
    } else if (postParam.op == 'dnload') {
      json = require('../json/upload/file.json')
    }
  } else if (getParam.action == 'loadLocalBackup') {
    json = require('../json/upload/loadlocalbackup.json')
  } else if (getParam.action == 'checkImportFinished') {
    json = require('../json/upload/finish.json')
  } else if (getParam.action == 'checkResetFinished') {
    json = require('../json/upload/finish.json')
  }
  res.send(json)
}
