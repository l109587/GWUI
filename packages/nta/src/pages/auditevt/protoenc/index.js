import React, { useState } from 'react'
import { Space, Input, DatePicker } from 'antd'
import moment from 'moment';
import '@/utils/index.less'
import { language } from '@/utils/language';
import { TableLayout } from '@/components';
import DateTimeRangePicker from '@/components/Common/dtRangePicker'
const { ProtableModule } = TableLayout;
const { Search } = Input
const { RangePicker } = DatePicker;

let clientHeight = document.body.clientHeight - 336
const dateFormat = 'YYYY-MM-DD HH:mm:ss'

const Sslvisit = () => {
  const [incID, setIncID] = useState(0) //表格刷新
  const [queryVal, setQueryVal] = useState('') //搜索框的值
  const [starttime, setStarttime] = useState(
    moment().subtract(1, 'months').format(dateFormat)
  ) //搜索框的值
  const [endtime, setEndtime] = useState(moment().format(dateFormat)) //搜索框的值
  let searchVal = {
    queryVal: queryVal,
    queryType: 'fuzzy',
    startTime: starttime,
    endTime: endtime,
  } //顶部搜索框值 传入接口

  const concealColumns = {
    sport: { show: false },
    smac: { show: false },
    dport: { show: false },
    dmac: { show: false },
    country: { show: false },
    organize: { show: false },
  }

  const columns = [
    {
      title: language('netaudit.dnsreq.time'),
      dataIndex: 'time',
      key: 'time',
      width: '150px',
      ellipsis: true,
      align: 'left',
      class: 'aaaaaa'
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
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.targetip'),
      dataIndex: 'dip',
      key: 'dip',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.targetport'),
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
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.protoenc.encryptionprotocol'),
      dataIndex: 'encrypt',
      key: 'encrypt',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.sessid'),
      dataIndex: 'sess_id',
      key: 'sess_id',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.extendedfieldcollection'),
      dataIndex: 'extended_fields',
      key: 'extended_fields',
      ellipsis: true,
      align: 'left',
    },
  ]

  const changeTime = (time) =>{
    setStarttime(time[0])
    setEndtime(time[1])
    setIncID(incID + 1)
  }

  // 顶部左侧搜索框
  const tableTopSearch = () => {
    return (
      <Space>
        <Search
          style={{ width: 200 }}
          onSearch={(queryVal) => {
            setQueryVal(queryVal)
            setIncID(incID + 1)
          }}
          allowClear={true}
          placeholder={language('netaudit.searchtext')}
        />
        <DateTimeRangePicker changeTime={changeTime}/>
      </Space>
    )
  }

  return (
    <>
      <ProtableModule
        columns={columns}
        apishowurl="/cfg.php?controller=logAudit&action=showEncryptProtocol"
        clientHeight={clientHeight}
        columnvalue="protoencColumnvalue"
        tableKey="protoencTable"
        rowkey={'id'}
        incID={incID}
        searchText={tableTopSearch()}
        searchVal={searchVal}
        concealColumns={concealColumns}
      />
    </>
  )
}

export default Sslvisit
