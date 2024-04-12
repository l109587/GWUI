import { useRef, useState, useEffect } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import { Input, Space, Tag, Popover, Typography } from 'antd'
import { language } from '@/utils/language'
const { Search } = Input
import { post } from '@/services/https';
import { TableLayout } from '@/components'
const { ProtableModule } = TableLayout
import { Link } from '@icon-park/react'
import moment from 'moment'
import DateTimeRangePicker from '@/components/Common/dtRangePicker'

let clientHeight = document.body.clientHeight - 336
const dateFormat = 'YYYY-MM-DD HH:mm:ss'

export default function Transfer(props) {
  const [incID, setIncID] = useState(0) //表格刷新
  const [queryVal, setQueryVal] = useState('') //搜索框的值
  const [startTime, setStarttime] = useState(
    moment().subtract(1, props.unit ? props.unit : 'months').format(dateFormat)
  ) //搜索框的值
  const [endTime, setEndtime] = useState(moment().format(dateFormat)) //搜索框的值
  let searchVal = {
    queryVal: queryVal,
    queryType: 'fuzzy',
    startTime: startTime,
    endTime: endTime,
  } //顶部搜索框值 传入接口

  const concealColumns = {
    filepath: { show: false },
    desc: { show: false },
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
      title: language('alarmdt.origin'),
      dataIndex: 'origin',
      key: 'origin',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.transfer.filterdatatype'),
      dataIndex: 'filter_type',
      key: 'filter_type',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.transfer.ruleid'),
      dataIndex: 'ruleID',
      key: 'ruleID',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.transfer.transportprotocol'),
      dataIndex: 'app',
      key: 'app',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.transfer.sport'),
      dataIndex: 'sport',
      key: 'sport',
      width: '80px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.transfer.dip'),
      dataIndex: 'dip',
      key: 'dip',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.transfer.dport'),
      dataIndex: 'dport',
      key: 'dport',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.transfer.filesize'),
      dataIndex: 'filesize',
      key: 'filesize',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.transfer.filename'),
      dataIndex: 'filename',
      key: 'filename',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.transfer.filemd5'),
      dataIndex: 'file_md5',
      key: 'file_md5',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.transfer.filetransferdirection'),
      dataIndex: 'file_direction',
      key: 'file_direction',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.transfer.filepathpackage'),
      dataIndex: 'file_inpath',
      key: 'file_inpath',
      width: '140px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.transfer.filetype'),
      dataIndex: 'filetype',
      key: 'filetype',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.transfer.sendinfo'),
      dataIndex: 'sender',
      key: 'sender',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.transfer.recipientinfo'),
      dataIndex: 'receiver',
      key: 'receiver',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.transfer.filefrom'),
      dataIndex: 'file_source',
      key: 'file_source',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.transfer.descinfo'),
      dataIndex: 'desc',
      key: 'desc',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.transfer.extendedfieldcollection'),
      dataIndex: 'extendedfieldcollection',
      key: 'extendedfieldcollection',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
  ]
  
  const [columns, setColumns] = useState(columnlist)
  useEffect(() => {
    getSelectData();
  }, [])

  const module = 'filelog';
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
      <Space>
        <Search
          placeholder={language('alarmdt.filesift.tablesearch')}
          style={{ width: 200 }}
          onSearch={(queryVal) => {
            setQueryVal(queryVal)
            setIncID(incID + 1)
          }}
          allowClear
        />
        <DateTimeRangePicker changeTime={changeTime} unit={props.unit} />
      </Space>
    )
  }

  return (
    <>
      <ProtableModule
        columns={columns}
        apishowurl="/cfg.php?controller=logAlarm&action=showFileLog"
        clientHeight={clientHeight}
        columnvalue="alfilesiftColumnvalue"
        tableKey="alfilesiftTable"
        rowkey={'id'}
        incID={incID}
        searchText={tableTopSearch()}
        searchVal={searchVal}
        concealColumns={concealColumns}
      />
    </>
  )
}
