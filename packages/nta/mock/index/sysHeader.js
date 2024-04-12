import Mock from 'mockjs'

export default function sysHeader(getParam, postParam, res) {
    let json = ''
    if(getParam.action == 'showSysChart') {
        json = require('../json/monindex/syscpuchart.json')
    }
    else if(getParam.action == 'showSysInfo') {
        json = require('../json/monindex/SysInfo.json')
    }
    else if(getParam.action == 'showCheckStats') {
        json = require('../json/monindex/showCheckStats.json')
    }
    else if(getParam.action == 'showCascadeState') {
        json = require('../json/monindex/showCascadeState.json')
    }
    else if(getParam.action == 'showAssetsChart') {
        json = require('../json/monindex/showAssetsChart.json')
    }
    else if(getParam.action == 'showAssetsCtrlChart') {
        json = require('../json/monindex/showAssetsCtrlChart.json')
    }
    else if(getParam.action == 'showDevRegStats') {
        json = require('../json/monindex/showDevRegStats.json')
    }
    else if(getParam.action == 'showResList') {
        json = require('../json/monindex/showResList.json')
    }
    else if(getParam.action == 'showPolicyStats') {
        json = require('../json/monindex/showPolicyStats.json')
    }
    else if(getParam.action == 'showLogChart') {
        json = require('../json/monindex/flowchkchart.json')
    }
    else if(getParam.action == 'showSysChart') {
        let values = []
        const imitateList = (tname, min, max) => {
            var dottedBase = +new Date()
            for (var i = 100; i > 0; i--) {
                var date = new Date((dottedBase += 1000 * 4))
                let now =
                    date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
                values.push({
                    name: tname,
                    time: now,
                    value: Number(date.getTime().toString().slice(-5,-3))
                })
            }
            return values
        }
        if (psotParam.chartype == 'cpu') {
            json = Mock.mock({
                "title": "CPU状态",
                "usage": "22%",
                "count": 150,
                "lines": imitateList('cpu', 0, 100),
            })
            // json = require('../json/monindex/syscpuchart.json')
        } else if (psotParam.chartype == 'mem') {
            json = Mock.mock({
                "title": "内存状态",
                "usage": "24%",
                "count": 150,
                "lines": imitateList('mem', 0, 100),
            })
            // json = require('../json/monindex/sysemechart.json')
        }
    }
    else if(getParam.action == 'showMFlowChart') {
        json = require('../json/monindex/flowchkchart.json')
    }
    else if(getParam.action == 'showDeviceChart') {
        json = require('../json/monindex/AppsTopChart.json')
    }
    else if(getParam.action == 'showConfigChart') {
        json = require('../json/monindex/LogStats.json')
    }
    else if(getParam.action == 'showAssetChart') {
        json = require('../json/monindex/apptopchart.json')
    }
    else if(getParam.action == 'showDataStats') {
        json = require('../json/monindex/logstats.json')
    }
    else if(getParam.action == 'showFlowChkChart'){
        let values = []
        const imitateList = (tname, min, max) => {
            var dottedBase = +new Date()
            for (var i = 100; i > 0; i--) {
                var date = new Date((dottedBase += 1000 * 10))
                let now =
                    date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
                values.push({
                    name: tname,
                    time: now,
                    value: Number(date.getTime().toString().slice(-5,-3))
                })
            }
            return values
        }
        json = Mock.mock({
            "title": "镜像流量监测",
            "tflow": {
                "name": "监测总流量",
                "value": "5MB"
            },
            "tpkts": {
                "name": "监测报文数",
                "value": 58246
            },
            "tconn": {
                "name": "监测连接数",
                "value": 1731
            },
            "count": 150,
            lines: imitateList('cpu', 0, 100000000),
        })
    }else if(getParam.action == 'showAppsTopChart'){
        json = Mock.mock({
            "success": true,
            "title": "应用协议统计",
            "data": [
                {
                    "type": "SSL加密协议",
                    "value|30000-800000": 26221,
                    "other": false
                },
                {
                    "type": "其他协议",
                    "value|30000-800000": 838875,
                    "other": true
                },
                {
                    "type": "HTTP协议",
                    "value|30000-800000": 28947,
                    "other": false
                },
                {
                    "type": "域名解析协议",
                    "value|30000-800000": 85133,
                    "other": false
                }
            ]
        })
    }else if(getParam.action == 'showLogStats'){
        json =  Mock.mock({
            "success": true,
            "nums": 3,
            "data": [
                {
                    "type": "flow",
                    "name": "流量日志",
                    "value|1000-100000": 1245
                },
                {
                    "type": "sess",
                    "name": "会话日志",
                    "value|1000-100000": 4564
                },
                {
                    "type": "apps",
                    "name": "应用日志",
                    "value|1000-100000": 48646
                }
            ]
        })
    }
    res.send(json)
  }