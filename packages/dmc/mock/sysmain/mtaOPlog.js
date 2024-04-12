export default function mtaData(getParam, postParam, res) {
    let json = ''
    if(getParam.action == 'showBackupConf') {
        json = require('../json/sysmain/logback.json');
    }
    else if(getParam.action == 'exportData') {
        if(postParam.op == 'export') {
            json = require('../json/upload/exportBackupConf.json')
        } else if(postParam.op == 'rdnext') {
            json = require('../json/upload/nocode.json')
        } else if(postParam.op == 'dnload') {
            json = require('../json/upload/file.json')
        }
    }
    else if (getParam.action == 'importData') {
        json = require('../json/upload/importBackupConf.json')
    }
    else if(getParam.action == 'checkImportFinished') {
        json = require('../json/upload/finish.json')
    }
    res.send(json)
  }
  