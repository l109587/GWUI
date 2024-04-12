export default function mtaDebug(getParam, postParam, res) {
    let json = ''
    if(getParam.action == 'getPageContent') {
        json = require('../json/sysmain/remote.json');
    }
    else if(getParam.action == 'showPcapList'){
        json = require('../json/sysmain/pcapList.json');
    }
    else if(getParam.action == 'exportAgentLog'){
        if(postParam.op == 'export') {
            json = require('../json/upload/exportBackupConf.json')
          } else if(postParam.op == 'rdnext') {
            json = require('../json/upload/nocode.json')
          } else if(postParam.op == 'dnload') {
            json = require('../json/upload/file.json')
          }
    }
    res.send(json)
  }