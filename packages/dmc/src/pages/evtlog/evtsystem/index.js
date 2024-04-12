import React, { useRef, useState, useEffect } from 'react'
import { useSelector } from 'umi'
import { ProCard } from '@ant-design/pro-components'
import { post, get } from '@/services/https'
import { RightOutlined } from '@ant-design/icons'
import DemoPie from '@/components/Charts/Pie/Pie'
import Column from '@/components/Charts/Column/Column'
import { Tooltip, Input, DatePicker, Space, message } from 'antd'
import { language } from '@/utils/language'
import { TableLayout } from '@/components'
import { fetchAuth } from '@/utils/common'
import './evtsystme.less'
import moment from 'moment'
const { ProtableModule } = TableLayout
const { Search } = Input
const { RangePicker } = DatePicker
const dateFormat = 'YYYY/MM/DD'
export default () => {
  const [collapsed, setCollapsed] = useState(false)
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  const clientHeight = collapsed ? contentHeight - 300 : contentHeight - 532
  const writable = fetchAuth()
  const [columns, setColumns] = useState(columnlist)

  const columnlist = [
    {
      title: language('evtlog.evtsystem.timestamp'),
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('evtlog.evtsystem.event'),
      dataIndex: 'event',
      key: 'event',
      width: 180,
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('evtlog.evtsystem.detail'),
      dataIndex: 'detail',
      key: 'detail',
      ellipsis: true,
      align: 'left',
    },
  ]

  const [incID, setIncID] = useState(0)
  const tableKey = 'evtsystem'
  const apishowurl = '/cfg.php?controller=evtSystem&action=showEvtSystemList'
  const rowKey = (record) => record.id
  const [queryVal, setQueryVal] = useState() //首个搜索框的值
  const [olddata, setOlddata] = useState(
    moment().subtract(1, 'months').format(dateFormat)
  )
  const [newdata, setNewdata] = useState(moment().format(dateFormat))
  const [chartsData, setChartsData] = useState([])
  const [chartsTit, setChartTit] = useState('')
  let searchVal = {
    queryVal: queryVal,
    begDate: olddata,
    endDate: newdata,
  } //顶部搜索框值 传入接口

  useEffect(() => {
    getChartData()
  }, [])

  const getChartData = () => {
    post('/cfg.php?controller=evtSystem&action=showEvtSystemChart', {
      begDate: olddata,
      endDate: newdata,
    }).then((res) => {
      if (!res.success) {
        message.error(res.msg)
        return false
      }
      setChartTit(res.title)
      const newData = []
      res.data.map((item)=>{
        newData.push({name:item.event,value:Number(item.value)})
      })
      setChartsData(newData)
    })
    post('/cfg.php?controller=alaSetting&action=getEventList').then((res) => {
      if (!res.success) {
        message.error(res.msg)
        return false
      }
      let typefillter = []
      res?.data?.map((each) => {
        if (each.value == 1) {
          each?.child.map((item) => {
            typefillter.push({ text: item.text, value: item.value })
          })
        }
      })
      columnlist.map((item) => {
        if (item.dataIndex == 'event') {
          item.filters = typefillter
          item.filterMultiple = false
          item.filterSearch = true
        }
      })
      setColumns(columnlist)
    })
  }

  const showSearch = () => {
    return (
      <Space>
        <Search
          allowClear
          placeholder={language('evtlog.evtsystem.searchText')}
          onSearch={(queryVal) => {
            setQueryVal(queryVal)
            setIncID(incID + 1)
          }}
        />
        <RangePicker
          // showTime={{ format: 'HH:mm:ss' }}
          defaultValue={[
            moment(olddata, dateFormat),
            moment(newdata, dateFormat),
          ]}
          format={dateFormat}
          onChange={(val, time) => {
            setNewdata(time[1])
            setOlddata(time[0])
            setIncID(incID + 1)
          }}
        />
      </Space>
    )
  }
  return (
    <ProCard direction="column" ghost gutter={[16, 16]}>
      <ProCard
        title={chartsTit}
        collapsed={collapsed}
        style={!collapsed ? { height: 287 } : {}}
        extra={
          <Tooltip title={collapsed ? language('illevent.expand') : language('illevent.stow')}>
            <RightOutlined
              rotate={!collapsed ? 90 : undefined}
              onClick={() => {
                setCollapsed(!collapsed)
              }}
            />
          </Tooltip>
        }
      >
        <ProCard colSpan="30%" ghost>
          <DemoPie
            data={chartsData}
            clientHeight={clientHeight - 500}
            angleField="value"
            colorField="name"
            innerRadius={0.6}
            noUnit={true}
            legend={false}
            showStatistic={true}
            showLabel={false}
            xField='name'
          />
        </ProCard>
        <ProCard colSpan="70%" ghost>
          <Column
            data={chartsData}
            xField="name"
            yField="value"
            seriesField="name"
            isGroup={true}
            clientHeight={clientHeight - 500}
            noUnit={true}
            legend={false}
          />
        </ProCard>
      </ProCard>
      <ProCard ghost>
        <ProtableModule
          incID={incID}
          rowkey={rowKey}
          columns={columns}
          searchVal={searchVal}
          tableKey={tableKey}
          apishowurl={apishowurl}
          searchText={showSearch()}
          clientHeight={clientHeight}
          columnvalue={'evtsystemColVal'}
        />
      </ProCard>
    </ProCard>
  )
}
