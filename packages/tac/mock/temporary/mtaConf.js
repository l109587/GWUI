export default function mtaConf(getParam, postParam, res) {
  let json = '';
  if (getParam.action == 'showLocalBackup') {
    json = require('../json/temporary/tenancetable.json')
  }
  else if (getParam.action == 'exportBackupConf') {
    if (postParam.op == 'export') {
      json = require('../json/temporary/exportBackupConf.json')
    } else if (postParam.op == 'rdnext') {
      json = require('../json/temporary/nocode.json')
    } else if (postParam.op == 'dnload') {
      json = require('../json/temporary/file.json')
    }
  }
  else if (getParam.action == 'showBackupConf') {
    json = require('../json/sysmain/showBackupConf.json')
  }
  else if (getParam.action == 'loadLocalBackup') {
    json = require('../json/temporary/loadlocalbackup.json')
  }
  else if (getParam.action == 'checkImportFinished') {
    json = require('../json/temporary/finish.json')
  }
  else if (getParam.action == 'checkResetFinished') {
    json = require('../json/temporary/finish.json')
  }
  else {
  }
  res.send(json);
}
