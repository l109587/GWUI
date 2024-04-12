export default function sys(getParam, postParam, res) {
    let json = ''
    //系统装填
    if(getParam.action == 'showSystemState') {
        json = require('../json/sysmain/status.json')
        //NTP
    } else if(getParam.action == 'showSystemVersion') {
        json = {
            "success": true,
            "version": "v2.0.20",
            "builder": "v2.0.45 Alpha Build 3345 x86_64"
        };
    }
    else if(getParam.action == 'systemUpload') {
        json = require('../json/sysmain/sysload.json')
    }
    else if(getParam.action == 'systemUpdate') {
        json = require('../json/sysmain/sysupdate.json')
    }
    else if(getParam.action == 'checkRebootFinish') {
        json = require('../json/sysmain/checkreboot.json')
    }
    else if(getParam.action == 'licenseUpload') {
        json = require('../json/sysmain/sysload.json')
    }
    else if(getParam.action == 'licenseUpdate') {
        json = require('../json/sysmain/sysupdate.json')
    }
    res.send(json)
  }
  