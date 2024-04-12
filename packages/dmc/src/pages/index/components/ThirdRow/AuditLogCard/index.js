import React, { useEffect, useState } from 'react'
import { ProCard } from '@ant-design/pro-components'
import { Divider, Select, message, Skeleton } from 'antd'
import Auditlog from '@/assets/dmc/indexIcon/Auditlog.svg'
import { Column } from '@ant-design/plots'
import './index.less'
import { post } from '@/services/https'
import { language } from '@/utils/language'

const AuditLogCard = (props) => {
  const [auditData, setAuditData] = useState([])
  const [auditTitle, setAuditTitle] = useState('')
  const [auditTotal, setAuditTotal] = useState(0)

  useEffect(() => {
    showAuditCnt('month')
  }, [])

  const showAuditCnt = (time) => {
    post('/cfg.php?controller=sysHeader&action=showAuditCnt', {
      time: time,
    }).then((res) => {
      if (!res.success) {
        message.error(res.msg)
        return false
      }
      let data = res.data.filter(
        (e) =>
          (e.value != 0 &&
            e.type === language('dmc.index.application.behavior')) ||
          (e.type === language('dmc.index.active') && e.value != 0) ||
          e.type === language('dmc.index.netconnect')
      )

      setAuditData(data)
      setAuditTitle(res.title)
      setAuditTotal(res.total)
    })
  }

  const config = {
    data: auditData,
    xField: 'type',
    yField: 'value',
    seriesField: 'name',
    color: ({ name }) => {
      if (name === language('dmc.index.netconnect')) {
        return '#5087EC'
      } else if (name === language('netaudit.webvisit.tabname')) {
        return '#5087EC'
      } else if (name === language('netaudit.domainreq.tabname')) {
        return '#3AA1FF'
      } else if (name === language('netaudit.email.tabname')) {
        return '#36CBCB'
      } else if (name === language('netaudit.filetrans.tabname')) {
        return '#65DB6B'
      } else if (name === language('netaudit.sslvisit.tabname')) {
        return '#68BBC4'
      } else if (name === language('netaudit.database.tabname')) {
        return '#92D1FE'
      } else if (name === language('netaudit.loginbehavior.tabname')) {
        return '#9FE5AF'
      } else if (name === language('netaudit.controlbehavior.tabname')) {
        return '#FFDC8C'
      } else if (name === language('netaudit.activeobj.equipmentactivity')) {
        return '#5087EC'
      } else if (name === language('netaudit.activeobj.applicationactivity')) {
        return '#3AA1FF'
      } else if (name === language('netaudit.activeobj.accountactivity')) {
        return '#36CBCB'
      }
    },
    appendPadding: [0, 20, 0, 20],
    noUnit: true,
    legend: false,
    isStack: true,
    minColumnWidth: 20,
    maxColumnWidth: 25,
    yAxis: {
      grid: {
        line: {
          type: 'line',
          style: {
            lineDash: [3, 5],
          },
        },
      },
    },
    tooltip: {
      customContent: (title, items) => {
        let total
        total = items.reduce((sum, e) => sum + Number(e.value || 0), 0)
        return (
          <div className="auditTool">
            <div className="auditItemTool">
              <div>{title}</div>
              <div>{total}</div>
            </div>
            {items.map((item) => {
              return (
                <div className="auditItemTool">
                  <div>
                    <span
                      className="roundDot"
                      style={{ backgroundColor: item.color, marginRight: 5 }}
                    ></span>
                    {item.name}
                  </div>
                  <div>{item.value}</div>
                </div>
              )
            })}
          </div>
        )
      },
    },
  }

  return (
    <ProCard
      ghost
      colSpan={8}
      className="thirdCard"
      title={
        <div className="titleDiv">
          <div className="imgDiv">
            <img src={Auditlog} />
          </div>
          <span>{auditTitle}</span>
        </div>
      }
      extra={
        <Select
          size="small"
          defaultValue={'month'}
          options={[
            { label: language('dmc.index.time.month'), value: 'month' },
            { label: language('dmc.index.time.week'), value: 'week' },
            { label: language('dmc.index.time.day'), value: 'day' },
          ]}
          onChange={(e) => {
            showAuditCnt(e)
          }}
        />
      }
    >
      <Divider />
      <div style={{ height: props.height, paddingLeft: 10, paddingRight: 10 }}>
        <div style={{ paddingBottom: 15 }}>{language('dmc.index.total')}{auditTotal}</div>
        <div style={{ padding: 10 }}>
          {auditData.length < 1 ? (
            <Skeleton.Input
              style={{
                height: props.height - 60,
                minHeight: props.height - 60,
                width: '100%',
              }}
            />
          ) : (
            <Column
              {...config}
              style={{
                height: props.height - 60,
                minHeight: props.height - 60,
                width: '100%',
              }}
            />
          )}
        </div>
      </div>
    </ProCard>
  )
}

export default AuditLogCard
