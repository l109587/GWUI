export default function mtaDebug(getParam, postParam, res) {
    let json = ''
    if(getParam.action == 'getPageContent') {
        json = require('../json/sysmain/remote.json');
    }
    else if(getParam.action == 'showPcapList'){
        json = require('../json/sysmain/pcapList.json');
    }
    res.send(json)
  }