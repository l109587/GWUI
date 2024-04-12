import { useRef, useState, useEffect } from 'react'
import {
  Input,
  Space,
  Tag,
  Popover,
  Typography
} from 'antd'
import { SearchOutlined } from '@ant-design/icons'
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

export default function Trojan(props) {
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
    srcport: { show: false },
    srcmac: { show: false },
    dstport: { show: false },
    dstmac: { show: false },
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
      title: language('alarmdt.risk'),
      dataIndex: 'level',
      key: 'level',
      width: '100px',
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
      title: language('alarmdt.sip'),
      dataIndex: 'srcip',
      key: 'srcip',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.sport'),
      dataIndex: 'srcport',
      key: 'srcport',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.smac'),
      dataIndex: 'srcmac',
      key: 'srcmac',
      width: '130px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.dip'),
      dataIndex: 'dstip',
      key: 'dstip',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.dstport'),
      dataIndex: 'dstport',
      key: 'dstport',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.dstmac'),
      dataIndex: 'dstmac',
      key: 'dstmac',
      width: '130px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.attacker.alarmname'),
      dataIndex: 'ruleName',
      key: 'ruleName',
      width: '100px',
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
      title: language('alarmdt.attacker.applicationprotocol'),
      dataIndex: 'app_protocol',
      key: 'app_protocol',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.attacker.attackresult'),
      dataIndex: 'attack_result',
      key: 'attack_result',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.attacker.attackclass'),
      dataIndex: 'attack_class',
      key: 'attack_class',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.attacker.attackgroup'),
      dataIndex: 'attack_group',
      key: 'attack_group',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.attacker.attackstage'),
      dataIndex: 'attack_stage',
      key: 'attack_stage',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.attacker.sessid'),
      dataIndex: 'sess_id',
      key: 'sess_id',
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
      title: language('alarmdt.attacker.loadtype'),
      dataIndex: 'payload_type',
      key: 'payload_type',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.attacker.loaddetails'),
      dataIndex: 'payload_detail',
      key: 'payload_detail',
      ellipsis: true,
      width: '100px',
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
      title: language('alarmdt.attacker.extendedfieldcollection'),
      dataIndex: 'extendedfieldcollection',
      key: 'extendedfieldcollection',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.attacker.blaklisttype'),
      dataIndex: 'blaklist_type',
      key: 'blaklist_type',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.attacker.domain'),
      dataIndex: 'domain',
      key: 'domain',
      width: '140px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.attacker.facilitytype'),
      dataIndex: 'facility_type',
      key: 'facility_type',
      width: '120px',
      ellipsis: true,
      align: 'left',
    }
  ]
    
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
  
  const [columns, setColumns] = useState(columnlist)
  useEffect(() => {
    getSelectData();
  }, [])

  const module = 'ipblack';
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
  const changeTime = (time) =>{
    setStarttime(time[0])
    setEndtime(time[1])
    setIncID(incID + 1)
  }

  /* 顶部左侧搜索框*/
  const tableTopSearch = () => {
    return (
      <Space >
        <Search
          placeholder={language('alarmdt.attacker.tablesearch')}
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
        apishowurl="/cfg.php?controller=logAlarm&action=showIPBlackAlarm"
        clientHeight={clientHeight}
        columnvalue="aatblacklistColumnvalue"
        tableKey="aatblacklistTable"
        rowkey='id'
        incID={incID}
        searchText={tableTopSearch()}
        searchVal={searchVal}
        concealColumns={concealColumns}
      />
    </>
  )
}
