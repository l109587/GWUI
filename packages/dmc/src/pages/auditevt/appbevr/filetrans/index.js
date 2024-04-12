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

const Filetrans = () => {
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
  }
  const columns = [
    {
      title: language('netaudit.dnsreq.time'),
      dataIndex: 'time',
      key: 'time',
      width: '150px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.origin'),
      dataIndex: 'origin',
      key: 'origin',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.connect.app'),
      dataIndex: 'app',
      key: 'app',
      width: '80px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.connect.protocol'),
      dataIndex: 'protocol',
      key: 'protocol',
      width: '80px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.sip'),
      dataIndex: 'sip',
      key: 'sip',
      width: '100px',
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
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.targetip'),
      dataIndex: 'dip',
      key: 'dip',
      width: '100px',
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
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.applyname'),
      dataIndex: 'app_name',
      key: 'app_name',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.logtype'),
      dataIndex: 'log_type',
      key: 'log_type',
      width: '120px',
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
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.filetrans.filename'),
      dataIndex: 'filename',
      key: 'filename',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.filetrans.filesize'),
      dataIndex: 'filesize',
      key: 'filesize',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.appbevr.filetrans.filemd5'),
      dataIndex: 'file_md5',
      key: 'file_md5',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.appbevr.filetrans.filedirection'),
      dataIndex: 'file_direction',
      key: 'file_direction',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.appbevr.filetrans.filetype'),
      dataIndex: 'filetype',
      key: 'filetype',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.appbevr.filetrans.sender'),
      dataIndex: 'sender',
      key: 'sender',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.appbevr.filetrans.reciver'),
      dataIndex: 'reciver',
      key: 'reciver',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.appbevr.filetrans.host'),
      dataIndex: 'host',
      key: 'host',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.appbevr.filetrans.uri'),
      dataIndex: 'uri',
      key: 'uri',
      width: '140px',
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
          placeholder={language('netaudit.searchtext')}
          allowClear
        />
        <DateTimeRangePicker changeTime={changeTime}/>
      </Space>
    )
  }
  return (
    <>
      <ProtableModule
        columns={columns}
        apishowurl="/cfg.php?controller=logAudit&action=showFileTransfer"
        clientHeight={clientHeight}
        columnvalue="filetransColumnvalue"
        tableKey="filetransTable"
        rowkey={'id'}
        incID={incID}
        searchText={tableTopSearch()}
        searchVal={searchVal}
        concealColumns={concealColumns}
      />
    </>
  )
}

export  default Filetrans
