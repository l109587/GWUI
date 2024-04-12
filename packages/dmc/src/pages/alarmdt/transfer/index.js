import { useRef, useState, useEffect } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import { Input, Space, Tag, Popover, Typography } from 'antd'
import { language } from '@/utils/language'
import { post } from '@/services/https';
import { TableLayout } from '@/components'
import moment from 'moment'
import DateTimeRangePicker from '@/components/Common/dtRangePicker'
const { Search } = Input
const { ProtableModule } = TableLayout

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
      dataIndex: 'alert_type',
      key: 'alert_type',
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
      title: language('alarmdt.transfer.alarmlevel'),
      dataIndex: 'level',
      key: 'level',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.transfer.actualalarmfile'),
      dataIndex: 'sm_inpath',
      key: 'sm_inpath',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.transfer.summaryclassifieddata'),
      dataIndex: 'sm_summary',
      key: 'sm_summary',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.transfer.confidentialdatadescription'),
      dataIndex: 'sm_desc',
      key: 'sm_desc',
      width: '120px',
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
      title: language('alarmdt.dport'),
      dataIndex: 'dport',
      key: 'dport',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.dmac'),
      dataIndex: 'dmac',
      key: 'dmac',
      width: '130px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.transfer.datatransmissiondirection'),
      dataIndex: 'xm_dir',
      key: 'xm_dir',
      width: '120px',
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
      title: language('alarmdt.transfer.highlightkeyworks'),
      dataIndex: 'highlight_text',
      key: 'highlight_text',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.transfer.applicationprotocol'),
      dataIndex: 'app',
      key: 'app',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.transfer.applyname'),
      dataIndex: 'app_name',
      key: 'app_name',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.transfer.filterdatapayloaddtype'),
      dataIndex: 'payload_type',
      key: 'payload_type',
      width: '140px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.transfer.protoinfo'),
      dataIndex: 'payload_detail',
      key: 'payload_detail',
      width: '80px',
      align: 'center',
      render: (text, record) => {
        return (
          <div
            style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          >
            <Popover
              content={content(record.payload_detail)}
              placement="leftTop"
              title={text?.title}
              trigger="click"
            >
              <div
                style={{
                  backgroundColor: '#1684FC',
                  width: 24,
                  height: 20,
                  borderRadius: 3,
                }}
              >
                <SearchOutlined style={{ color: '#fff' }} />
              </div>
            </Popover>
          </div>
        )
      },
    },
    {
      title: language('alarmdt.transfer.extendedfieldcollection'),
      dataIndex: 'extendedfieldcollection',
      key: 'extendedfieldcollection',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.transfer.layouttype'),
      dataIndex: 'style_type',
      key: 'style_type',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
  ]
  
  const [columns, setColumns] = useState(columnlist)
  useEffect(() => {
    getSelectData();
  }, [])

  const module = 'layoutseal';
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
          placeholder={language('alarmdt.transfer.tablesearch')}
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

  const content = (data) => {
    return (
      <>
        {data?.map((item) => (
          <div>
            <span>{item.title}：</span>
            <span>{item.value}</span>
          </div>
        ))}
      </>
    )
  }
  return (
    <>
      <ProtableModule
        columns={columns}
        apishowurl="/cfg.php?controller=logAlarm&action=showLayoutSealFile"
        clientHeight={clientHeight}
        columnvalue="transferColumnvalue"
        tableKey="transferTable"
        rowkey={'id'}
        incID={incID}
        searchText={tableTopSearch()}
        searchVal={searchVal}
        concealColumns={concealColumns}
      />
    </>
  )
}
