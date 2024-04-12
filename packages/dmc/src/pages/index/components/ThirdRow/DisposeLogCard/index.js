import React, { useEffect, useState } from 'react'
import { ProCard, ProTable } from '@ant-design/pro-components'
import { Divider, message, Select } from 'antd'
import DisposeLog from '@/assets/dmc/indexIcon/DisposeLog.svg'
import ChangeCharts from '@/assets/dmc/indexIcon/ChangeCharts.svg'
import ChangeTable from '@/assets/dmc/indexIcon/ChangeTable.svg'
import { Pie, measureTextWidth } from '@ant-design/plots'
import { post } from '@/services/https'
import { language } from '@/utils/language'

const DisposeLogCard = (props) => {
  const [dispoTable, setDispoTable] = useState(false)
  const [disposeTitle, setDisposeTitle] = useState('')
  const [disposeData, setDisposeData] = useState('')
  const [detailData, setDetailsData] = useState([])
  const [filters, setFilters] = useState('month')

  useEffect(() => {
    if (dispoTable) {
      showDisposeDetails(filters)
    } else {
      showDispose(filters)
    }
  }, [dispoTable])

  const showDispose = (selectTime = 'month') => {
    post('/cfg.php?controller=sysHeader&action=showDispose', {
      time: selectTime,
    }).then((res) => {
      if (!res.success) {
        message.error(res.msg)
        return false
      }
      setDisposeTitle(res.title)
      setDisposeData(res.data)
    })
  }

  const showDisposeDetails = (selectTime = 'month') => {
    post('/cfg.php?controller=sysHeader&action=showDisposeDetails', {
      time: selectTime,
    }).then((res) => {
      if (!res.success) {
        message.error(res.msg)
        return false
      }
      setDetailsData(res.data)
    })
  }

  const renderStatistic = (containerWidth, text, style) => {
    const { width: textWidth, height: textHeight } = measureTextWidth(
      text,
      style
    )
    const R = containerWidth / 2 // r^2 = (w / 2)^2 + (h - offsetY)^2

    let scale = 1

    if (containerWidth < textWidth) {
      scale = Math.min(
        Math.sqrt(
          Math.abs(
            Math.pow(R, 2) /
              (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2))
          )
        ),
        1
      )
    }

    return <div>{text}</div>
  }

  const config = {
    appendPadding: 10,
    data: disposeData,
    angleField: 'value',
    colorField: 'name',
    radius: 1,
    innerRadius: 0.64,
    meta: {
      value: {
        formatter: (v) => `${v} ¥`,
      },
    },
    color:
      disposeData[0]?.value == 0
        ? ['#E0E0E0', '#EEEEEE']
        : ['#5087EC', '#84B7F9'],
    legend: false,
    label: {
      formatter: (v) => {
        return v.name + '-' + v.value
      },
    },
    statistic: {
      title: {
        customHtml: (container, view, datum) => {
          const { width, height } = container.getBoundingClientRect()
          const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2))
          const text = datum ? datum.name : language('dmc.index.totalize')
          return renderStatistic(d, text, {
            fontSize: 28,
          })
        },
      },
      content: {
        offsetY: 4,
        style: {
          fontSize: '32px',
        },
        customHtml: (container, view, datum, data) => {
          const { width } = container.getBoundingClientRect()
          const text = datum
            ? `${datum.value}`
            : `${data.reduce((r, d) => r + d.value, 0)}`
          return renderStatistic(width, text, {
            fontSize: 32,
          })
        },
      },
    }, // 添加 中心统计文本 交互
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'pie-statistic-active',
      },
    ],
  }

  return (
    <ProCard
      ghost
      colSpan={8}
      className="thirdCard"
      title={
        <div className="titleDiv">
          <div className="imgDiv">
            <img src={DisposeLog} />
          </div>
          <span>{disposeTitle}</span>
        </div>
      }
      extra={
        <>
          <Select
            size="small"
            defaultValue={'month'}
            options={[
              { label: language('dmc.index.time.month'), value: 'month' },
              { label: language('dmc.index.time.week'), value: 'week' },
              { label: language('dmc.index.time.day'), value: 'day' },
            ]}
            onChange={(e) => {
              setFilters(e)
              if (dispoTable) {
                showDisposeDetails(e)
              } else {
                showDispose(e)
              }
            }}
          />
          {/* <Button
            size="small"
            type="link"
            onClick={() => {
              setDispoTable(!dispoTable);
            }}
          >
            <img src={dispoTable ? ChangeCharts : ChangeTable} />
          </Button> */}
        </>
      }
    >
      <Divider />
      <div style={{ height: props.height }}>
        {dispoTable ? (
          <ProTable
            size="small"
            columns={[
              {
                dataIndex: 'time',
                title: language('dmc.index.time'),
                align: 'left',
                width: '60%',
                ellipsis: true,
              },
              {
                dataIndex: 'content',
                title: language('dmc.index.event'),
                align: 'center',
                width: '20%',
                ellipsis: true,
              },
            ]}
            rowKey="index"
            bordered={false}
            cardBordered={false}
            scroll={{ y: props.height - 60 }}
            dataSource={detailData}
            search={false}
            options={false}
            pagination={false}
          />
        ) : (
          <Pie
            {...config}
            style={{ minHeight: props.height - 20, height: props.height - 20 }}
          />
        )}
      </div>
    </ProCard>
  )
}

export default DisposeLogCard
