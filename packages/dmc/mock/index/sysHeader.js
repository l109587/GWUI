export default function sysHeader(getParam, postParam, res) {
    let json = ''
    //
    if(getParam.action == 'showSysChart') {
        json = require('../json/monindex/syscpuchart.json')
    }
    //
    else if(getParam.action == 'showSysInfo') {
        json = require('../json/monindex/SysInfo.json')
    }
    //
    else if(getParam.action == 'showCheckStats') {
        json = require('../json/monindex/showCheckStats.json')
    }
    //
    else if(getParam.action == 'showCascadeState') {
        json = require('../json/monindex/showCascadeState.json')
    }
    //
    else if(getParam.action == 'showAssetsChart') {
        json = require('../json/monindex/showAssetsChart.json')
    }
    //
    else if(getParam.action == 'showAssetsCtrlChart') {
        json = require('../json/monindex/showAssetsCtrlChart.json')
    }
    //
    else if(getParam.action == 'showDevRegStats') {
        json = require('../json/monindex/showDevRegStats.json')
    }
    //
    else if(getParam.action == 'showResList') {
        json = require('../json/monindex/showResList.json')
    }
    //
    else if(getParam.action == 'showPolicyStats') {
        json = require('../json/monindex/showPolicyStats.json')
    }
    res.send(json)
  }