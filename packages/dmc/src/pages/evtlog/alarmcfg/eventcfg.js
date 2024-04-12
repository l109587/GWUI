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
} from 'antd'
import {
  ModalForm,
  ProFormText,
  ProFormSwitch,
  ProFormSelect,
  ProFormCheckbox,
} from '@ant-design/pro-components'
import { ExclamationCircleOutlined, CheckCircleFilled } from '@ant-design/icons'
import { useSelector } from 'umi'
import { language } from '@/utils/language'
import { fetchAuth } from '@/utils/common'
import { modalFormLayout } from '@/utils/helper'
import { NameText, NotesText } from '@/utils/fromTypeLabel'
import { regIpList } from '@/utils/regExp'
import { post } from '@/services/https'

import { TableLayout } from '@/components'
const { ProtableModule } = TableLayout

const { Search } = Input
const { confirm } = Modal

export default function Eventcfg() {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  const clientHeight = contentHeight - 260
  const writable = fetchAuth()

  const [incID, setIncID] = useState(0)
  const [addVisible, setModalVisible] = useState(false) //添加弹窗
  const [rowId, setRowId] = useState('') //RowId
  const [eventList, setEventList] = useState([]) //事件定义列表
  const [levelList, setLevelList] = useState([]) //水平定义列表
  const [data, setData] = useState([]) //数据列表
  const [eventOptions, setEventOptions] = useState([]) //水平定义列表
  const formRef = useRef()

  const rowKey = (record) => record.id

  useEffect(() => {
    fetchEventList()
    fetchLevelList()
  }, [])

  const columnsList = [
    {
      title: language('project.evtlog.alarmcfg.status'),
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 80,
      render: (text, record) => (
        <Switch
          checkedChildren={language('project.open')}
          unCheckedChildren={language('project.close')}
          checked={text == 'Y' ? true : false}
          onChange={(checked) => {
            switchStatus(record.id, checked)
          }}
          disabled={!writable}
        />
      ),
    },
    {
      title: language('project.evtlog.alarmcfg.event'),
      dataIndex: 'event',
      key: 'event',
      align: 'left',
      render: (text, record) => {
        let label = ''
        eventList?.map((item) => {
          if (item.value == record.class) {
            if (item.child && item.child.length > 0) {
              item.child.map((child) => {
                if (child.value == text) {
                  label = child.text
                }
              })
            }
          }
        })
        return label
      },
    },
    {
      title: language('project.evtlog.alarmcfg.class'),
      dataIndex: 'class',
      key: 'class',
      align: 'left',
      width: 100,
      filterMultiple: false,
      filters: eventList,
      render: (text) => typeRender(text),
    },
    {
      title: language('project.evtlog.alarmcfg.level'),
      dataIndex: 'level',
      key: 'level',
      align: 'center',
      width: 100,
      filterMultiple: false,
      filters: levelList,
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
      title: language('project.evtlog.alarmcfg.wpage'),
      dataIndex: 'wpage',
      align: 'center',
      key: 'wpage',
      width: 100,
      render: (text) =>
        text == 'Y' ? <CheckCircleFilled style={{ color: '#12C189' }} /> : null,
    },
    {
      title: language('project.evtlog.alarmcfg.email'),
      dataIndex: 'email',
      key: 'email',
      width: 100,
      align: 'center',
      render: (text) =>
        text == 'Y' ? <CheckCircleFilled style={{ color: '#12C189' }} /> : null,
    },
    {
      title: language('project.evtlog.alarmcfg.phone'),
      dataIndex: 'phone',
      key: 'phone',
      align: 'center',
      width: 100,
      render: (text) =>
        text == 'Y' ? <CheckCircleFilled style={{ color: '#12C189' }} /> : null,
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
          <a
            onClick={() => {
              setRowId(record.id)
              setModalVisible(true)
              setTimeout(() => {
                const state = record.status == 'Y'
                const phone = record.phone == 'Y'
                const wpage = record.wpage == 'Y'
                const email = record.email == 'Y'
                formRef?.current?.setFieldsValue({
                  ...record,
                  status: state,
                  phone: phone,
                  wpage: wpage,
                  email: email,
                })
                setOptions()
                fetchDataList(record.event)
              }, 100)
            }}
          >
            {language('project.edit')}
          </a>
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

  //获取事件定义列表
  const fetchEventList = () => {
    post('/cfg.php?controller=alaSetting&action=getEventList')
      .then((res) => {
        if (res.success) {
          setEventList(res.data)
        } else {
          res.msg && message.error(res.msg)
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
          res.msg && message.error(res.msg)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //获取事件配置列表
  const fetchDataList = (event = '', classify = '') => {
    post('/cfg.php?controller=alaSetting&action=showAlarmConf')
      .then((res) => {
        if (res.success) {
          setData(res.data || [])
        } else {
          res.msg && message.error(res.msg)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //枚举事件定义类型
  const typeRender = (value) => {
    let text = ''
    eventList?.map((item) => {
      if (item.value == value) {
        text = item.text
      }
    })
    return text
  }

  //定义事件类型options
  const typeOptions = () => {
    let array = []
    eventList?.map((item) => {
      array.push({ label: item.text, value: item.value })
    })
    return array
  }

  //定义水平类型
  const levelOptions = () => {
    const newArray = []
    levelList.map((item) => {
      newArray.push({ label: item.text, value: item.value })
    })
    return newArray
  }

  // 定义事件名称options
  const setOptions = () => {
    let array = []
    const type = formRef?.current?.getFieldsValue(['class'])
    eventList?.map((item) => {
      if (item.value === type.class) {
        if (item.child && item.child.length > 0) {
          item.child.map((child) => {
            array.push({ label: child.text, value: child.value })
          })
        }
      }
    })
    // names.map((v)=>{
    //   array = array.filter(item=>item.value!=v)
    // })
    setEventOptions(array)
  }

  const addClick = () => {
    setModalVisible(true)
    fetchDataList()
  }
  //状态切换
  const switchStatus = (id, checked) => {
    const state = checked ? 'Y' : 'N'
    post('/cfg.php?controller=alaSetting&action=setAlarmStatus', {
      id: id,
      enable: state,
    })
      .then((res) => {
        if (res.success) {
          res.msg && message.success(res.msg)
          setIncID(incID + 1)
        } else {
          res.msg && message.error(res.msg)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
  //保存添加和编辑
  const saveConfig = (values) => {
    const status = values.status ? 'Y' : 'N'
    const phone = values.phone ? 'Y' : 'N'
    const wpage = values.wpage ? 'Y' : 'N'
    const email = values.email ? 'Y' : 'N'
    if (rowId) {
      post('/cfg.php?controller=alaSetting&action=setAlarmConf', {
        ...values,
        status: status,
        op: 'mod',
        id: rowId,
        phone: phone,
        wpage: wpage,
        email: email,
      })
        .then((res) => {
          if (res.success) {
            res.msg && message.success(res.msg)
            setModalVisible(false)
            setIncID(incID + 1)
            setRowId('')
          } else {
            res.msg && message.error(res.msg)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      post('/cfg.php?controller=alaSetting&action=setAlarmConf', {
        ...values,
        status: status,
        op: 'add',
        phone: phone,
        wpage: wpage,
        email: email,
      })
        .then((res) => {
          if (res.success) {
            res.msg && message.success(res.msg)
            setModalVisible(false)
            setIncID(incID + 1)
          } else {
            res.msg && message.error(res.msg)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
  //删除
  const delInfo = (id) => {
    post('/cfg.php?controller=alaSetting&action=delAlarmConf', { ids: id })
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
  return (
    <>
      <ProtableModule
        clientHeight={clientHeight}
        incID={incID}
        rowkey={rowKey}
        tableKey="alarmcfg"
        columns={columnsList}
        apishowurl="/cfg.php?controller=alaSetting&action=showAlarmConf"
        setcolumnKey="pro-table-singe-demos-alarmcfg"
        columnvalue="alarmcfgColumnvalue"
        rowSelection={true}
        addButton={true}
        addClick={addClick}
        delButton={true}
        delClick={delClick}
      />
      <ModalForm
        destroyOnClose
        {...modalFormLayout}
        visible={addVisible}
        width="450px"
        title={
          rowId
            ? language('project.evtlog.alarmcfg.editalarm')
            : language('project.evtlog.alarmcfg.crtalarm')
        }
        onVisibleChange={setModalVisible}
        modalProps={{
          destroyOnClose: true,
          // wrapClassName: styles.fieldsModal
          onCancel: () => {
            setRowId('')
          },
        }}
        onFinish={(values) => {
          saveConfig(values)
        }}
        formRef={formRef}
        initialValues={{
          status: false,
          email: false,
          phone: false,
          wpage: false,
        }}
      >
        <ProFormSwitch
          label={language('project.evtlog.alarmcfg.status')}
          name="status"
          checkedChildren={language('project.open')}
          unCheckedChildren={language('project.close')}
        />
        <ProFormSelect
          name="class"
          label={language('project.evtlog.alarmcfg.class')}
          width="200px"
          options={typeOptions()}
          fieldProps={{
            onChange: () => {
              formRef.current.setFieldsValue({ event: null })
            },
          }}
          rules={[
            {
              required: true,
              message: language('project.mandatory'),
            },
          ]}
        />
        <ProFormSelect
          name="event"
          label={language('project.evtlog.alarmcfg.event')}
          width="200px"
          options={eventOptions}
          fieldProps={{
            onDropdownVisibleChange: setOptions,
          }}
          rules={[
            {
              required: true,
              message: language('project.mandatory'),
            },
            {
              validator: (_, value) => {
                const index = data.findIndex(
                  (item) =>
                    item.class ===
                      formRef.current.getFieldsValue(['class']).class &&
                    item.event === value &&
                    item.id !== rowId
                )
                if (index >= 0) {
                  return Promise.reject(new Error('事件名称已存在'))
                } else {
                  return Promise.resolve()
                }
              },
            },
          ]}
        />
        <ProFormSelect
          name="level"
          label={language('project.evtlog.alarmcfg.level')}
          width="200px"
          options={levelOptions()}
          rules={[
            {
              required: true,
              message: language('project.mandatory'),
            },
          ]}
        />
        <ProFormCheckbox
          label={language('project.evtlog.alarmcfg.wpage')}
          width="200px"
          name="wpage"
        >
          {language('project.evtlog.alarmcfg.wpagemsg')}
        </ProFormCheckbox>
        <ProFormCheckbox
          label={language('project.evtlog.alarmcfg.email')}
          width="200px"
          name="email"
        >
          {language('project.evtlog.alarmcfg.emailmsg')}
        </ProFormCheckbox>
        <ProFormCheckbox
          label={language('project.evtlog.alarmcfg.phone')}
          width="200px"
          name="phone"
        >
          {language('project.evtlog.alarmcfg.phonemsg')}
        </ProFormCheckbox>
      </ModalForm>
    </>
  )
}
