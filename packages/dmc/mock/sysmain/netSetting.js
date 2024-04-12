export default function netSetting(getParam, postParam, res) {
    let json = ''
    if(getParam.action == 'showInterface') {
        json = require('../json/sysmain/network.json')
    } else if(getParam.action == 'getIFTypeList') {
        json = require('../json/sysmain/typeList.json')
    }
    else if(getParam.action == 'clearIFeth') {
        json = require('../json/sysconf/clearIFeth.json')
    }
    res.send(json)
  }
  