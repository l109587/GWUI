import Mock from 'mockjs'
export default function sysAnalysis(getParam, postParam, res) {
    let json = ''
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
    if(getParam.action == 'showFlowConnStat') {
        var dottedBase = +new Date()
        var date = new Date((dottedBase += 1000 * 4))
        let now = date.toLocaleTimeString()
        json = Mock.mock({
            "subtitle": "最近10分钟间隔30秒统计",
            "success": true,
            "title": "TCP/UDP 连接数统计图111",
            "bar": [
                {
                    "name": "tot",
                    "time": date.getHours() + ':' + date.getMinutes() + ':' + 4,
                    "value": Number(date.getTime().toString().slice(-6, -2)) - 1000,
                    "label": "连接数"
                  },
                  {
                    "name": "tot",
                    "time": date.getHours() + ':' + date.getMinutes() + ':' + 8,
                    "value": Number(date.getTime().toString().slice(-6, -2)) - 1500,
                    "label": "连接数"
                  },
                  {
                    "name": "tot",
                    "time": date.getHours() + ':' + date.getMinutes() + ':' + 12,
                    "value": Number(date.getTime().toString().slice(-6, -2)) - 1000,
                    "label": "连接数"
                  },
                  {
                    "name": "tot",
                    "time": date.getHours() + ':' + date.getMinutes() + ':' + 16,
                    "value": Number(date.getTime().toString().slice(-6, -2)) - 1500,
                    "label": "连接数"
                  },
                  {
                    "name": "tot",
                    "time": date.getHours() + ':' + date.getMinutes() + ':' + 20,
                    "value": Number(date.getTime().toString().slice(-6, -2)) - 1000,
                    "label": "连接数"
                  }
            ],
            "lines": [
                {
                    "name": "tcp",
                    "time": date.getHours() + ':' + date.getMinutes() + ':' + 4,
                    "value": Number(date.getTime().toString().slice(-6, -2)) - 1000,
                    "label": "TCP连接数"
                  },
                  {
                    "name": "tcp",
                    "time": date.getHours() + ':' + date.getMinutes() + ':' + 8,
                    "value": Number(date.getTime().toString().slice(-6, -2)) - 1500,
                    "label": "TCP连接数"
                  },
                  {
                    "name": "tcp",
                    "time": date.getHours() + ':' + date.getMinutes() + ':' + 12,
                    "value": Number(date.getTime().toString().slice(-6, -2)) - 1000,
                    "label": "TCP连接数"
                  },
                  {
                    "name": "tcp",
                    "time": date.getHours() + ':' + date.getMinutes() + ':' + 16,
                    "value": Number(date.getTime().toString().slice(-6, -2)) - 1500,
                    "label": "TCP连接数"
                  },
                  {
                    "name": "tcp",
                    "time": date.getHours() + ':' + date.getMinutes() + ':' + 20,
                    "value": Number(date.getTime().toString().slice(-6, -2)) - 1000,
                    "label": "TCP连接数"
                  },
                  {
                    "name": "udp",
                    "time": date.getHours() + ':' + date.getMinutes() + ':' + 4,
                    "value": Number(date.getTime().toString().slice(-6, -2)) - 1500,
                    "label": "UDP连接数"
                  },
                  {
                    "name": "udp",
                    "time": date.getHours() + ':' + date.getMinutes() + ':' + 8,
                    "value": Number(date.getTime().toString().slice(-6, -2)) - 1000,
                    "label": "UDP连接数"
                  },
                  {
                    "name": "udp",
                    "time": date.getHours() + ':' + date.getMinutes() + ':' + 12,
                    "value": Number(date.getTime().toString().slice(-6, -2)) - 1500,
                    "label": "UDP连接数"
                  },
                  {
                    "name": "udp",
                    "time": date.getHours() + ':' + date.getMinutes() + ':' + 16,
                    "value": Number(date.getTime().toString().slice(-6, -2)) - 1000,
                    "label": "UDP连接数"
                  },
                  {
                    "name": "udp",
                    "time": date.getHours() + ':' + date.getMinutes() + ':' + 20,
                    "value": Number(date.getTime().toString().slice(-6, -2)) - 1500,
                    "label": "UDP连接数"
                  }
            ],
        })
        // json = require('../json/nta/sysMonitor/showFlowConnStat.json');
    }else if(getParam.action == 'showFlowTotalStat'){
        json = Mock.mock({
            "success": true,
            "bytes": {
                "title": "总流量",
                "subtitle": "最近10分钟",
                "bytes": "773MB",
                "pktscn": "报文总数",
                "pktsval": "6,328,885",
                "errscn": "异常报文",
                "errsval": "28,514",
                "lines": imitateList('cpu', 1000, 9000),
            },
            "sflow": {
                "title": "连接数量",
                "subtitle": "最近10分钟",
                "tcpcn": "TCP连接数",
                "tcpval|10000-300000": 129575,
                "udpcn": "UDP连接数",
                "udpval|1000-300000": 45605
            },
            "avgmx": {
                "title": "报文大小",
                "subtitle": "最近10分钟",
                "avgcn": "报文平均长度",
                "avgval|100-1000": 142,
                "maxcn": "报文最大长度",
                "maxval|1000-100000": 1600
            }
        })
    }else if(getParam.action == 'showFlowPktsStat'){
        let time = +new Date()
        let now = new Date((time += 1000 * 4))
        json = Mock.mock({
            "success": true,
            "ipv4": {
                "title": "IPv4报文",
                "subtitle": "最近10分钟",
                "value": "9192",
                "label": "报文数",
                "unit": "K",
                "bar|5": [
                    {value: Number(now.getTime().toString().slice(-5,-3))}
                ]
            },
            "ipv6": {
                "title": "IPv6报文",
                "subtitle": "最近10分钟",
                "value": "10,731",
                "label": "报文数",
                "unit": "",
                "bar|5": [
                    {value: Number(now.getTime().toString().slice(-5,-3))}
                ]
            },
            "tcp": {
                "title": "TCP报文",
                "subtitle": "最近10分钟",
                "value": "8283",
                "label": "报文数",
                "unit": "K",
                "bar|5": [
                    {value: Number(now.getTime().toString().slice(-5,-3))}
                ]
            },
            "udp": {
                "title": "UDP报文",
                "subtitle": "最近10分钟",
                "value": "331,158",
                "label": "报文数",
                "unit": "",
                "bar|5": [
                    {value: Number(now.getTime().toString().slice(-5,-3))}
                ]
            }
        })
    }else if(getParam.action == 'showAppsChart'){
        json = require('../json/nta/sysMonitor/showAppsChart.json')
    }else if(getParam.action == 'showAppsTable'){
        json = require('../json/nta/sysMonitor/showAppsTable.json')
    }else if(getParam.action == 'showRptLogCard'){
        json = require('../json/nta/sysMonitor/showRptLogCard.json')
    }else if(getParam.action == 'showRptLogPieChart'){
        json = require('../json/nta/sysMonitor/showRptLogPieChart.json')
    }else if(getParam.action == 'showRptLogBarChart'){
        json = require('../json/nta/sysMonitor/showRptLogBarChart.json')
    }else if(getParam.action == 'showRptLogRunChart'){
        json = require('../json/nta/sysMonitor/showRptLogRunChart.json')
    }
    res.send(json)
  }
