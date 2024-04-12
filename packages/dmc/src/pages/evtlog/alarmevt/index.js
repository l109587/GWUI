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

export default function AlarmEvent() {
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

  let searchVal = { queryVal: queryVal, begDate: olddate, endDate: newdate }
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
      title: language('project.evtlog.alarmevt.datetime'),
      dataIndex: 'datetime',
      key: 'datetime',
      align: 'left',
      ellipsis: true,
      width: 150,
    },
    {
      title: language('project.evtlog.alarmevt.event'),
      dataIndex: 'event',
      key: 'event',
      align: 'left',
      ellipsis: true,
      width: 100,
      filterMultiple: false,
      filters: nameList,
      filteredValue: eventValue,
    },
    {
      title: language('project.evtlog.alarmevt.class'),
      dataIndex: 'class',
      key: 'class',
      align: 'left',
      width: 100,
      ellipsis: true,
      filterMultiple: false,
      filters: eventList,
      filteredValue: claValue,
    },
    {
      title: language('project.evtlog.alarmevt.level'),
      dataIndex: 'level',
      key: 'level',
      align: 'center',
      width: 100,
      filterMultiple: false,
      filters: levelList,
      filteredValue:levelValue,
      render: (text) => {
        let color = ''
        let label = ''
        switch (text) {
          case 1:
            color = '#BD3124'
            break
          case 2:
            color = '#FA561F'
            break
          case 3:
            color = '#FFBF6B'
            break
          case 4:
            color = '#93D2F3'
            break
          default:
            break
        }
        levelList.map((item) => {
          if (item.value == text) {
            label = item.text
          }
        })
        return <Tag color={color}>{label}</Tag>
      },
    },
    {
      title: language('project.evtlog.alarmevt.detail'),
      dataIndex: 'detail',
      key: 'detail',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('project.operate'),
      dataIndex: 'operate',
      key: 'operate',
      align: 'center',
      width: 130,
      hideInTable: !writable,
      render: (text, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            disabled={record.status == '1'}
            onClick={() => {
              disposeAlarm(record.id)
            }}
          >
            {record.status == '1'
              ? language('project.evtlog.alarmevt.disposeed')
              : language('project.evtlog.alarmevt.undispose')}
          </Button>
          <Popconfirm
            title={language('project.delconfirm')}
            okText={language('project.yes')}
            cancelText={language('project.no')}
            onConfirm={() => {
              delInfo(record.id)
            }}
          >
            <a>{language('project.del')}</a>
          </Popconfirm>
        </Space>
      ),
    },
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

  //告警事件处置
  const disposeAlarm = (ids) => {
    if (!ids) {
      return message.error(language('project.evtlog.alarmevt.disposetip'))
    }
    post('/cfg.php?controller=alaSetting&action=disposeAlarm', { ids: ids })
      .then((res) => {
        if (res.success) {
          res.msg && message.success(res.msg)
          setIncID(incID + 1)
        } else {
          res.msg && message.error(res.msg)
        }
      })
      .catch(() => {
        console.log('mistake')
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

  //删除
  const delInfo = (id) => {
    post('/cfg.php?controller=alaSetting&action=deleteAlarm', { ids: id })
      .then((res) => {
        if (res.success) {
          res.msg && message.success(res.msg)
          setIncID(incID + 1)
        } else {
          res.msg && message.error(res.msg)
        }
      })
      .catch(() => {
        console.log('mistake')
      })
  }
  //批量删除
  const delClick = (selectedRowKeys, dataList) => {
    const sum = selectedRowKeys.length
    const ids = selectedRowKeys.join(',')
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: language('project.delconfirm'),
      content: language('project.cancelcon', { sum: sum }),
      onOk() {
        delInfo(ids)
      },
    })
  }

  const batchOperate = (selectedRowKeys, dataList) => (
    <Button
      type="primary"
      icon={
        <span
          style={{
            verticalAlign: 'middle',
            display: 'inline-block',
            marginRight: 5,
          }}
        >
          <Click theme="outline" />
        </span>
      }
      onClick={() => {
        const ids = selectedRowKeys.join(',')
        disposeAlarm(ids)
      }}
    >
      {language('project.evtlog.alarmevt.batdispose')}
    </Button>
  )

  return (
    <>
      <ProtableModule
        clientHeight={clientHeight}
        searchText={tableTopSearch()}
        searchVal={searchVal}
        incID={incID}
        rowkey={rowKey}
        tableKey="alarmcfg"
        columns={columnsList}
        apishowurl="/cfg.php?controller=alaSetting&action=showAlarmEvent"
        setcolumnKey="pro-table-singe-demos-alarmcfg"
        columnvalue="alarmcfgColumnvalue"
        rowSelection={true}
        delButton={true}
        delClick={delClick}
        otherOpLeft={batchOperate}
        showLoading={false}
        filterChange={filterChange}
        eventFilter={true}
      />
    </>
  )
}
