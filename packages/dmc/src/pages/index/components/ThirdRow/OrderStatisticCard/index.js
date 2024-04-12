import React, { useEffect, useState } from 'react'
import { ProCard } from '@ant-design/pro-components'
import { Divider, Select, message, Skeleton } from 'antd'
import OrderStatis from '@/assets/dmc/indexIcon/OrderStatis.svg'
import { Bar } from '@ant-design/plots'
import './index.less'
import { post } from '@/services/https'
import { LoadingOutlined } from '@ant-design/icons'
import { language } from '@/utils/language'

const OrderStatisticCard = (props) => {
  const [cmdData, setCmdData] = useState([])
  const [cmdTitle, setCmdTitle] = useState('')
  useEffect(() => {
    showCmdCnt('month')
  }, [])

  const showCmdCnt = (selectTime = 'month') => {
    post('/cfg.php?controller=sysHeader&action=showCmdCnt', {
      time: selectTime,
    }).then((res) => {
      if (!res.success) {
        message.error(res.msg)
        return false
      }
      setCmdData(res.data)
      setCmdTitle(res.title)
    })
  }

  const config = {
    data: cmdData,
    xField: 'value',
    yField: 'name',
    appendPadding: [0, 20, 0, 20],
    scrollbar: {
      type: 'vertical'
    },
    barBackground: {
      style: {
        fill: 'rgb(0,0,0,0.1)',
      },
    },
    xAxis: {
      grid: {
        line: false,
      },
      line: false,
    },
    label: {
      position: 'right',
      style: {
        fill: '#5087EC',
      },
    },
    maxBarWidth: 16,
    tooltip: {
      customContent: (title, data) => {
        return (
          <div className="itemTool">
            <div style={{ marginLeft: -20, marginBottom: 10 }}>{title}</div>
            <div>
              <span
                className="roundDot"
                style={{ backgroundColor: '#5B8FF9', marginRight: 5 }}
              ></span>
              <span>
                {language('dmc.index.data')} {data[0]?.data?.value}
              </span>
            </div>
          </div>
        )
      },
    },
  }

  return (
    <ProCard
      ghost
      className="thirdCard"
      colSpan={8}
      title={
        <div className="titleDiv">
          <div className="imgDiv">
            <img src={OrderStatis} />
          </div>
          <span>{cmdTitle}</span>
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
            showCmdCnt(e)
          }}
        />
      }
    >
      <Divider />
      <div style={{ height: props.height, paddingLeft: 20, paddingRight: 20 }}>
        {cmdData.length > 0 ? (
          <Bar
            {...config}
            style={{ height: props.height - 20, minHeight: props.height - 20 }}
          />
        ) : (
          <div
            style={{
              height: props.height - 20,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              padding: '0 15px',
            }}
            className="bar"
          >
            <Skeleton
              paragraph={{
                rows: 6,
                width: ['40%', '70%', '30%', '60%', '100%', '85%'],
              }}
            />
          </div>
        )}
      </div>
    </ProCard>
  )
}

export default OrderStatisticCard
