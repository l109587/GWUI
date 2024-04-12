import Mock from 'mockjs'

export default function sysMonitor(getParam, postParam, res) {
  let json = ''
  let values = []
  const imitateList = (tname, min, max) => {
    var dottedBase = +new Date()
    for (var i = 100; i > 0; i--) {
      var date = new Date((dottedBase += 1000 * 60))
      let now =
        date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
      values.push({
        name: tname,
        time: now,
        value: Math.floor(Math.random() * (max - min + min)) + min,
      })
    }
    return values
  }
  if (getParam.action == 'showChartStat') {
    if (postParam.chartype == 'cpu') {
      json = Mock.mock({
        count: 150,
        title: 'CPU使用率(%)',
        xstep: 15,
        yAMax: 100,
        lines: imitateList('cpu', 0, 100),
      })
    } else {
      json = Mock.mock({
        count: 150,
        title: 'MEM使用率(%)',
        xstep: 15,
        yAMax: 100,
        lines: imitateList('mem', 0, 100),
      })
    }
  } else if (getParam.action == 'showChartFlow') {
    if (postParam.chartype == 'recv') {
      json = Mock.mock({
        count: 168,
        title: '接收流量(bps)',
        xstep: 10,
        lines: imitateList('eth0', 0, 1000,),
      })
    } else {
      json = Mock.mock({
        count: 168,
        title: '发送流量(bps)',
        xstep: 10,
        lines: imitateList('eth0', 0, 1000),
      })
    }
  }
  res.send(json)
}
