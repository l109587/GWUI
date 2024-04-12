import React, { useRef, useState, useEffect } from 'react'
import {
  Input,
  Space,
  Switch,
  Button,
  message,
  Popconfirm,
  Modal,
  Tag, 
  DatePicker,
} from 'antd'
import { ExclamationCircleOutlined, CheckCircleFilled } from '@ant-design/icons'
import { useSelector } from 'umi'
import moment from 'moment'
import { Click } from '@icon-park/react'
import { language } from '@/utils/language'
import { fetchAuth } from '@/utils/common'
import { post } from '@/services/https'

import { TableLayout } from '@/components'
const { ProtableModule } = TableLayout

const { Search } = Input
const { confirm } = Modal
const { RangePicker } = DatePicker

export default function AlarmEvent(props) {

  const { riskObj, attackResultObj, threatTypeObj, attackClassObj, attackStageObj, payloadTypeObj, facilityTypeObj, } = props;
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  const clientHeight = contentHeight - 224
  const writable = fetchAuth()
  const dateFormat = 'YYYY/MM/DD HH:mm:ss'

  const [incID, setIncID] = useState(0)
  const [queryVal, setQueryVal] = useState('')
  const [olddate, setOlddate] = useState(
    moment().subtract(1, 'months').format(dateFormat)
  )
  const [newdate, setNewdate] = useState(moment().format(dateFormat))
  const [eventList, setEventList] = useState([]) //事件定义列表
  const [levelList, setLevelList] = useState([]) //水平定义列表
  const [nameList, setNameList] = useState([]) //事件名称定义列表
  const [eventValue, setEventValue] = useState([]) //事件名称筛选定义列表
  const [claValue, setClaValue] = useState([]) //事件类型筛选定义列表
  const [levelValue, setLevelVale] = useState([]) //事件类型筛选定义列表

  let searchVal = { queryVal: queryVal, startTime: olddate, endTime: newdate, devtype: 'terminal'}
  const rowKey = (record) => record.id

  //事件名称筛选
  const eventNameFilter = () => {
    let array = []
    eventList.map((item) => {
      array = array.concat(item.child)
    })
    return array
  }

  const columnsList = [
    {
      title: '告警时间',
      dataIndex: 'time',
      key: 'time',
      align: 'left',
      ellipsis: true,
      width: 150,
    },
    {
      title:'黑名单类型',
      dataIndex: 'domain',
      key: 'domain',
      align: 'left',
      ellipsis: true,
      width: 120  ,
    },
    {
      title: '告警ID',
      dataIndex: 'id',
      key: 'id',
      align: 'left',
      width: 130,
      ellipsis: true,
    },
    {
      title: '设备ID',
      dataIndex: 'devid',
      key: 'devid',
      align: 'center',
      width: 100,
    },
    {
      title: '策略版本',
      dataIndex: 'version',
      key: 'version',
      align: 'left',
      ellipsis: true,
      width: 100,
    },
    {
      title: '策略ID',
      dataIndex: 'ruleid',
      key: 'ruleid',
      align: 'left',
      ellipsis: true,
      width: 100,
    },
    {
      title: '告警名称',
      dataIndex: 'rulename',
      key: 'rulename',
      align: 'left',
      ellipsis: true,
      width: 100,
    },
    {
      title: '告警级别',
      dataIndex: 'risk',
      key: 'risk',
      align: 'left',
      ellipsis: true,
      width: 100,
      render: (text, record) => {
        return riskObj[parseInt(record.risk)]
      },
    },
    {
      title: '告警描述',
      dataIndex: 'desc',
      key: 'desc',
      align: 'left',
      ellipsis: true,
      width: 100,
    },
    {
      title: '源ip',
      dataIndex: 'sip',
      key: 'sip',
      align: 'left',
      ellipsis: true,
      width: 120,
    },
    {
      title: '源端口',
      dataIndex: 'sport',
      key: 'sport',
      align: 'left',
      ellipsis: true,
      width: 100,
    },
    {
      title: '源mac',
      dataIndex: 'smac',
      key: 'smac',
      align: 'left',
      ellipsis: true,
      width: 130,
    },
    {
      title: '目的ip',
      dataIndex: 'dip',
      key: 'dip',
      align: 'left',
      ellipsis: true,
      width: 120,
    },
    {
      title: '目的端口',
      dataIndex: 'dport',
      key: 'dport',
      align: 'left',
      ellipsis: true,
      width: 100,
    },
    {
      title: '目的mac',
      dataIndex: 'dmac',
      key: 'dmac',
      align: 'left',
      ellipsis: true,
      width: 130,
    },
    {
      title: '传输层协议',
      dataIndex: 'transproto',
      key: 'transproto',
      align: 'left',
      ellipsis: true,
      width: 120,
    },
    {
      title: '应用层协议',
      dataIndex: 'appproto',
      key: 'appproto',
      align: 'left',
      ellipsis: true,
      width: 120,
    },
    // {
    //   title: '会话ID',
    //   dataIndex: 'detail',
    //   key: 'detail',
    //   align: 'left',
    //   ellipsis: true,
    //   width: 100,
    // },
    {
      title: '负载数据类型',
      dataIndex: 'payloadType',
      key: 'payloadType',
      align: 'left',
      ellipsis: true,
      width: 120,
      render: (text, record) => {
        return payloadTypeObj[parseInt(record.payloadType)]
      },
    },
    {
      title: '负载数据详情',
      dataIndex: 'payloadDetail',
      key: 'payloadDetail',
      align: 'left',
      ellipsis: true,
      width: 120,
    },
    {
      title: '扩展信息',
      dataIndex: 'extend',
      key: 'extend',
      align: 'left',
      ellipsis: true,
      width: 100,
    },
    {
      title: '域名信息',
      dataIndex: 'dom',
      key: 'dom',
      align: 'left',
      ellipsis: true,
      width: 100,
    },
    {
      title: '攻击IP',
      dataIndex: 'attacker',
      key: 'attacker',
      align: 'left',
      ellipsis: true,
      width: 100,
    },
    {
      title: '受害者IP',
      dataIndex: 'victim',
      key: 'victim',
      align: 'left',
      ellipsis: true,
      width: 120,
    },
    {
      title: '攻击结果',
      dataIndex: 'attackResult',
      key: 'attackResult',
      align: 'left',
      ellipsis: true,
      width: 100,
      render: (text, record) => {
        return attackResultObj[parseInt(record.attackResult)]
      },
    },
    {
      title: '威胁类型',
      dataIndex: 'threatType',
      key: 'threatType',
      align: 'left',
      ellipsis: true,
      width: 120,
      render: (text, record) => {
        return threatTypeObj[parseInt(record.threatType)]
      },
    },
    {
      title: '攻击分类',
      dataIndex: 'attackClass',
      key: 'attackClass',
      align: 'left',
      ellipsis: true,
      width: 120,
      render: (text, record) => {
        return attackClassObj[parseInt(record.attackClass)]
      },
    },
    {
      title: '攻击组织',
      dataIndex: 'attackGroup',
      key: 'attackGroup',
      align: 'left',
      ellipsis: true,
      width: 100,
    },
    {
      title: '攻击阶段',
      dataIndex: 'attackStage',
      key: 'attackStage',
      align: 'left',
      ellipsis: true,
      width: 100,
      render: (text, record) => {
        return attackStageObj[parseInt(record.attackStage)]
      },
    },
    //后台没有
    // {
    //   title: '攻击设施',
    //   dataIndex: 'facilityType',
    //   key: 'facilityType',
    //   align: 'left',
    //   ellipsis: true,
    //   width: 180,
    //   render: (text, record) => {
    //     let content = '';
    //     console.log(record.facilityType)
    //     if(record.facilityType && record.facilityType.length >=1 ){
    //       record.facilityType?.map((item)=>{
    //         content += facilityTypeObj[parseInt(item)]+';';
    //       })
    //     }
    //     return content;
    //   },
    // },
    {
      title: '进程名称',
      dataIndex: 'processName',
      key: 'processName',
      align: 'left',
      ellipsis: true,
      width: 100,
    },
    {
      title: '进程文件名',
      dataIndex: 'processFilename',
      key: 'processFilename',
      align: 'left',
      ellipsis: true,
      width: 100,
    },
    {
      title: '路径',
      dataIndex: 'processFilepath',
      key: 'processFilepath',
      align: 'left',
      ellipsis: true,
      width: 100,
    },
    {
      title: 'MD5',
      dataIndex: 'processFilemd5',
      key: 'processFilemd5',
      align: 'left',
      ellipsis: true,
      width: 100,
    },
    //后台没有
    // {
    //   title: '相关文件',
    //   dataIndex: 'detail',
    //   key: 'detail',
    //   align: 'left',
    //   ellipsis: true,
    //   width: 100,
    // },
  ]

  useEffect(() => {
    let timer = null
    const fetchData = () => {
      timer = setTimeout(() => {
        const uuid =
          new Date().getTime().toString(36) +
          '-' +
          Math.random().toString(36).substr(2, 9)
        setIncID(uuid)
        fetchData()
      }, 8000)
    }
    // fetchData()

    return () => {
      clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    fetchEventList()
    fetchLevelList()
  }, [])

  const filterChange = (values) => {
    setLevelVale(values?.level)
    const classVp = Array.isArray(claValue) ?claValue[0] : null
    const classVn = Array.isArray(values?.class) ? values.class[0] : null
    if (classVn == classVp) {
      setEventValue(values?.event)
    } else {
      setEventValue(null)
      const index = eventList.findIndex((item) => item.value === classVn)
      if (index >= 0) {
        setNameList(eventList[index].child)
      } else {
        setNameList([])
      }
    }
    setClaValue(values.class || null)
  }

  //获取事件定义列表
  const fetchEventList = () => {
    post('/cfg.php?controller=alaSetting&action=getEventList')
      .then((res) => {
        if (res.success) {
          setEventList(res.data)
        } else {
          res.msg && message.success(res.msg)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //获取水平列表
  const fetchLevelList = () => {
    post('/cfg.php?controller=alaSetting&action=getLevelList')
      .then((res) => {
        if (res.success) {
          setLevelList(res.data)
        } else {
          res.msg && message.success(res.msg)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const tableTopSearch = () => {
    return (
      <Space>
        <Search
          placeholder={language('project.evtlog.alarmevt.searchpd')}
          style={{ width: 200 }}
          allowClear
          onSearch={(queryVal) => {
            setQueryVal(queryVal)
            setIncID(incID + 1)
          }}
        />
        <RangePicker
          showTime={{ format: 'HH:mm:ss' }}
          defaultValue={[
            moment(olddate, dateFormat),
            moment(newdate, dateFormat),
          ]}
          format={dateFormat}
          onChange={(val, time) => {
            setNewdate(time[1])
            setOlddate(time[0])
            setIncID(incID + 1)
          }}
        />
      </Space>
    )
  }

  return (
    <>
      <ProtableModule
        clientHeight={clientHeight}
        searchText={tableTopSearch()}
        searchVal={searchVal}
        incID={incID}
        rowkey={rowKey}
        tableKey="dspycaldevunit"
        columns={columnsList}
        apishowurl="/cfg.php?controller=logDispose&action=showAttack"
        setcolumnKey="pro-table-singe-demos-dspycaldevunit"
        columnvalue="dspycaldevunitColumnvalue"
        rowSelection={true}
        delButton={false}
        showLoading={false}
        filterChange={filterChange}
        eventFilter={true}
      />
    </>
  )
}
