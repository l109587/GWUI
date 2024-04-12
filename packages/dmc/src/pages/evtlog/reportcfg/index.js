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
  ProFormItem,
} from '@ant-design/pro-components'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useSelector } from 'umi'
import { language } from '@/utils/language'
import { fetchAuth } from '@/utils/common'
import { modalFormLayout } from '@/utils/helper'
import { NameText, NotesText } from '@/utils/fromTypeLabel'
import { regIpList,regPortList } from '@/utils/regExp'
import { post } from '@/services/https'
import styles from './index.less'

import { TableLayout } from '@/components'
const { ProtableModule } = TableLayout

const { Search } = Input
const { confirm } = Modal

export default function Reportcfg() {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  const clientHeight = contentHeight - 224
  const writable = fetchAuth()

  const [incID, setIncID] = useState(0)
  const [addVisible, setModalVisible] = useState(false) //添加弹窗
  const [rowId, setRowId] = useState('') //RowId
  const [record, setRecord] = useState({}) //record
  const [protocolList, setProtocolList] = useState([]) //协议列表
  const [eventList, setEventList] = useState([]) //事件列表
  const formRef = useRef()

  const rowKey = (record) => record.id

  useEffect(() => {
    fetchProtocolList()
    fetchEventList()
  }, [])
  const typeMap = {
    evt: language('project.evtlog.reportcfg.evt'),
    log: language('project.evtlog.reportcfg.log'),
  }
  const columnsList = [
    {
      title: language('project.evtlog.reportcfg.status'),
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
      title: language('project.evtlog.reportcfg.name'),
      dataIndex: 'name',
      key: 'name',
      align: 'left',
      ellipsis: true,
      width: 100,
    },
    {
      title: language('project.evtlog.reportcfg.reportaddr'),
      dataIndex: 'addr',
      key: 'addr',
      align: 'left',
      ellipsis: true,
      width: 150,
    },
    {
      title: language('project.evtlog.reportcfg.reportport'),
      dataIndex: 'port',
      align: 'left',
      key: 'port',
      ellipsis: true,
      width: 100,
    },
    {
      title: language('project.evtlog.reportcfg.reportproto'),
      dataIndex: 'proto',
      align: 'left',
      key: 'proto',
      ellipsis: true,
      width: 100,
    },
    {
      title: language('project.evtlog.reportcfg.reportcontent'),
      dataIndex: 'content',
      key: 'content',
      align: 'left',
      render: (text) => {
        const result = typeof text == 'string' ? text?.split(',') : []
        let labelList = []
        result.map((child) => {
          eventList.map((item) => {
            if (item.value == child) {
              labelList.push(item.label)
            }
          })
        })
        return (
          <Space>
            {labelList.map((i) => {
              return <Tag color="default">{i}</Tag>
            })}
          </Space>
        )
      },
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
              setRecord(record)
              setModalVisible(true)
              setTimeout(() => {
                const state = record.status == 'Y' ? true : false
                const content = record.content.split(',')
                formRef?.current?.setFieldsValue({
                  ...record,
                  status: state,
                  content: content,
                })
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

  //获取协议列表
  const fetchProtocolList = () => {
    post('/cfg.php?controller=evtReport&action=getProtocolList')
      .then((res) => {
        if (res.success) {
          setProtocolList(res.data)
        } else {
          res.msg && message.error(res.msg)
        }
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  //获取事件列表
  const fetchEventList = () => {
    post('/cfg.php?controller=evtReport&action=getEventList')
      .then((res) => {
        if (res.success) {
          let arr = []
          res?.data.map((item) => {
            arr.push({ value: item.value, label: item.text })
          })
          setEventList(arr)
        } else {
          res.msg && message.error(res.msg)
        }
      })
      .catch(() => {
        console.log('mistake')
      })
  }
  const addClick = () => {
    setModalVisible(true)
  }
  //状态切换
  const switchStatus = (id, checked) => {
    const state = checked ? 'Y' : 'N'
    post('/cfg.php?controller=evtReport&action=setReportStatus', {
      enable: state,
      id: id,
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
    const newContent = values?.content.join(',')
    if (rowId) {
      post('/cfg.php?controller=evtReport&action=setReportConf', {
        ...values,
        status: status,
        op: 'mod',
        id: rowId,
        content: newContent,
      })
        .then((res) => {
          if (res.success) {
            res.msg && message.success(res.msg)
            setModalVisible(false)
            setIncID(incID + 1)
            setRowId('')
            setRecord({})
          } else {
            res.msg && message.error(res.msg)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      post('/cfg.php?controller=evtReport&action=setReportConf', {
        ...values,
        status: status,
        op: 'add',
        content: newContent,
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
    post('/cfg.php?controller=evtReport&action=delReportConf', { ids: id })
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
        apishowurl="/cfg.php?controller=evtReport&action=showReportConf"
        setcolumnKey="pro-table-singe-demos-alarmcfg"
        columnvalue="alarmcfgColumnvalue"
        rowSelection={true}
        addButton={true}
        addClick={addClick}
        delButton={true}
        delClick={delClick}
      />
      <ModalForm
        {...modalFormLayout}
        visible={addVisible}
        width="450px"
        title={rowId?language('project.evtlog.reportcfg.editreport'):language('project.evtlog.reportcfg.crtreport')}
        onVisibleChange={setModalVisible}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            setRowId('')
            setRecord({})
          },
        }}
        onFinish={(values) => {
          console.log('finish')
          saveConfig(values)
        }}
        formRef={formRef}
        initialValues={{ status: false }}
      >
        <ProFormSwitch
          label={language('project.evtlog.reportcfg.status')}
          name="status"
          checkedChildren={language('project.open')}
          unCheckedChildren={language('project.close')}
        />
        {rowId ? (
          <ProFormItem
            label={language('project.evtlog.reportcfg.name')}
            width="200px"
            name="name"
          >
            {record?.name}
          </ProFormItem>
        ) : (
          <NameText
            name="name"
            label={language('project.evtlog.reportcfg.name')}
            required={true}
            width="200px"
            placeholder="请输入"
            hidden
          />
        )}

        <ProFormText
          label={language('project.evtlog.reportcfg.addr')}
          width="200px"
          name="addr"
          rules={[
            {
              required: true,
              message: language('project.mandatory'),
            },
            {
              pattern: regIpList.ipv4.regex,
              message: regIpList.ipv4.alertText,
            },
          ]}
        />
        <ProFormText
          label={language('project.evtlog.reportcfg.port')}
          width="200px"
          name="port"
          rules={[
            {
              required: true,
              message: language('project.mandatory'),
            },
            {
              pattern: regPortList.port.regex,
              message: regPortList.port.alertText,
            },
          ]}
        />

        <ProFormSelect
          name="proto"
          label={language('project.evtlog.reportcfg.proto')}
          width="200px"
          options={protocolList}
          rules={[
            {
              required: true,
              message: language('project.mandatory'),
            },
          ]}
        />
        <div className={styles.mutselect}>
          <ProFormSelect
            name="content"
            label={language('project.evtlog.reportcfg.content')}
            width="200px"
            options={eventList}
            mode="multiple"
            rules={[
              {
                required: true,
                message: language('project.mandatory'),
              },
            ]}
          />
        </div>
      </ModalForm>
    </>
  )
}
