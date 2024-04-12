import { useRef, useState, useEffect } from 'react'
import {
  Input,
  Space,
  Tag,
  Popover,
  Typography
} from 'antd'
import { language } from '@/utils/language'
import { post } from '@/services/https'
const { Search } = Input
import { TableLayout } from '@/components'
const { ProtableModule } = TableLayout
import { Link } from '@icon-park/react'
import moment from 'moment'
import DateTimeRangePicker from '@/components/Common/dtRangePicker'

let clientHeight = document.body.clientHeight - 336
const dateFormat = 'YYYY-MM-DD HH:mm:ss'

export default function Trojan() {
  const [incID, setIncID] = useState(0) //表格刷新
  const [queryVal, setQueryVal] = useState('') //搜索框的值
  const [startTime, setStarttime] = useState(
    moment().subtract(1, 'months').format(dateFormat)
  ) //搜索框的值
  const [endTime, setEndtime] = useState(moment().format(dateFormat)) //搜索框的值
  let searchVal = {
    queryVal: queryVal,
    queryType: 'fuzzy',
    startTime: startTime,
    endTime: endTime,
  } //顶部搜索框值 传入接口

  const concealColumns = {
    sport: { show: false },
    smac: { show: false },
    dport: { show: false },
    dmac: { show: false },
  }

  const columnlist = [
    {
      title: language('alarmdt.timestamp'),
      dataIndex: 'time',
      key: 'time',
      width: '150px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.ruleID'),
      dataIndex: 'ruleID',
      key: 'ruleID',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.targetadt.objecttype'),
      dataIndex: 'object_type',
      key: 'object_type',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.sip'),
      dataIndex: 'sip',
      key: 'sip',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.sport'),
      dataIndex: 'sport',
      key: 'sport',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.smac'),
      dataIndex: 'smac',
      key: 'smac',
      width: '130px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.dip'),
      dataIndex: 'dip',
      key: 'dip',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.dstport'),
      dataIndex: 'dport',
      key: 'dport',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.dstmac'),
      dataIndex: 'dmac',
      key: 'dmac',
      width: '130px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.attacker.transportprotocol'),
      dataIndex: 'transport_protocol',
      key: 'transport_protocol',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.attacker.desc'),
      dataIndex: 'desc',
      key: 'desc',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.attacker.extendedfieldcollection'),
      dataIndex: 'extendedfieldcollection',
      key: 'extendedfieldcollection',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
  ]

  const [columns, setColumns] = useState(columnlist)
  useEffect(() => {
    getSelectData();
  }, [])

  const module = 'sysvul';
  const getSelectData = () => {
    post('/cfg.php?controller=logAlarm&action=showScreenList', { module: module }).then((res) => {
      if (res.data) {
        columnlist.map((item, index) => {
          if (res.data[item.dataIndex]) {
            item.filters = res.data[item.dataIndex];
            item.filterMultiple = false;
          }
        })
        setColumns([...columnlist]);
      }
    })
  }

  const changeTime = (time) => {
    setStarttime(time[0])
    setEndtime(time[1])
    setIncID(incID + 1)
  }

  /* 顶部左侧搜索框*/
  const tableTopSearch = () => {
    return (
      <Space >
        <Search
          placeholder={language('alarmdt.targetadt.tablesearch')}
          style={{ width: 200 }}
          onSearch={(queryVal) => {
            setQueryVal(queryVal)
            setIncID(incID + 1)
          }}
          allowClear
        />
        <DateTimeRangePicker changeTime={changeTime} />
      </Space>
    )
  }
  return (
    <>
      <ProtableModule
        columns={columns}
        apishowurl="/cfg.php?controller=logAlarm&action=showTargetIP"
        clientHeight={clientHeight}
        columnvalue="aatipauditColumnvalue"
        tableKey="aatipaudittTable"
        rowkey='id'
        incID={incID}
        searchText={tableTopSearch()}
        searchVal={searchVal}
        concealColumns={concealColumns}
      />
    </>
  )
}
