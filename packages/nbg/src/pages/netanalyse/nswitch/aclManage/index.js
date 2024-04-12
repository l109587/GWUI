import { useState, useEffect, useRef } from 'react'
import {
  ProCard,
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormItem,
  ProFormSwitch,
  ModalForm,
  ProFormRadio,
} from '@ant-design/pro-components'
import { useSelector } from 'umi'
import {
  Table,
  Button,
  Alert,
  Col,
  Row,
  Tooltip,
  Popconfirm,
  Space,
  message,
} from 'antd'
import {
  SaveOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { language } from '@/utils/language'
import { fetchAuth } from '@/utils/common'
import { formleftLayout, modalFormLayout } from '@/utils/helper'
import { post } from '@/services/https'
import { regList, regIpList,regPortList } from '@/utils/regExp'
import styles from '../index.less'
import {  NameText } from '@/utils/fromTypeLabel';

export default function ACL(props) {
  const { baseInfo } = props
  const [modalVisible, setModalVisible] = useState(false)
  const [portName, setPortName] = useState([])
  const [tempRecord, setTempRecord] = useState({}) //模板列表行信息
  const [temlData, setTemlData] = useState([]) //模板列表行信息
  const [telnetModelList, setTelnetModelList] = useState([]) //远程模板列表信息
  const writable = fetchAuth()
  const formRef = useRef()
  const modalRef = useRef()

  useEffect(() => {
    fetchTemps()
    fetchPortName()
    fetTelnetModelList()
  }, [])
  const fetchPortName = () => {
    post('/cfg.php?controller=assetMapping&action=getPortName', {
      swIP: baseInfo.ip,
      noVlan: 1,
      start: 0,
    }).then((res) => {
      if (res.success) {
        const arr = []
        res.data.map((item) => {
          arr.push({ label: item.ifName, value: item.ifIndex })
          if (item.aclMode == 1 ) {
            formRef.current.setFieldsValue({ seniorPort: item.ifIndex })
          }
        })
        setPortName(arr)
      }
    })
  }
  const fetTelnetModelList = () =>{
    post('/cfg.php?controller=assetMapping&action=getTelnetModelList', {
      swIP: baseInfo.ip,
      noVlan: 1,
      start: 0,
    }).then((res) => {
      if (res.success) {
        const arr = []
        res.data.map((item) => {
          arr.push({ label: item.name, value: item.value })
        })
        setTelnetModelList(arr)
      }
    })
  }

  const columns = [
    {
      title: '名称',
      width: '100',
      dataIndex: 'name',
      key: 'name',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '协议',
      width: '80',
      dataIndex: 'protocol',
      key: 'protocol',
      align: 'left',
      render:(text)=>{
        const protocolMap = {
          "0":'Telnet',
          "1":'SSH',
        }
        return protocolMap[text]
      }
    },
    {
      title: '用户',
      width: '80',
      dataIndex: 'user',
      key: 'user',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('project.operate'),
      width: '100',
      key: 'name',
      align: 'center',
      hideInTable: !writable,
      render: (val, record) => {
        return (
          <Space>
            <Tooltip placement="top" title={language('project.edit')}>
              <a
                key="editable"
                onClick={() => {
                  setTempRecord(record)
                  setModalVisible(true)
                  setTimeout(() => {
                    modalRef.current.setFieldsValue({
                      name: record.name,
                      protocol: record.protocol,
                      user: record.user,
                      port:record.port
                    })
                  }, 100)
                }}
              >
                <EditOutlined />
              </a>
            </Tooltip>
            <Popconfirm
              title={language('project.sysconf.syscert.deleteTitle')}
              okText={language('project.sysconf.syscert.okText')}
              cancelText={language('project.sysconf.syscert.cancelText')}
              onConfirm={() => {
                delTemp(record)
              }}
            >
              <Tooltip placement="top" title={language('project.del')}>
                <a key="delete" style={{ color: 'red' }}>
                  <DeleteOutlined />
                </a>
              </Tooltip>
            </Popconfirm>
          </Space>
        )
      },
    },
  ]
  const newColumns = writable?columns: columns.slice(0,-1)

  const save = (values) => {
    const state = values.aclMode?1:0
    post('/cfg.php?controller=assetMapping&action=setAcl', {
      ...values,swIP:baseInfo.ip,aclMode:state
    })
    .then((res) => {
      if (res.success) {
        res.msg && message.success(res.msg)
      } else {
        res.msg && message.error(res.msg)
      }
    })
    .catch((error) => {
      console.log(error)
    })
  }

  //模板数据回显
  const fetchTemps = () => {
    post('/cfg.php?controller=assetMapping&action=getTelnetList', {
      start: 0,
      limit: 50,
    })
      .then((res) => {
        if (res.success) {
          setTemlData(res.data)
        } else {
          res.msg && message.error(res.msg)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //新建编辑模板
  const saveConfig = (values) => {
    if (Object.keys(tempRecord).length === 0) {
      post('/cfg.php?controller=assetMapping&action=addTelnetTemp', {
        ...values,
      })
        .then((res) => {
          if (res.success) {
            res.msg && message.success(res.msg)
            setModalVisible(false)
            setTempRecord({})
            fetchTemps()
            fetTelnetModelList()
          } else {
            res.msg && message.error(res.msg)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      post('/cfg.php?controller=assetMapping&action=modifyTelnetTemp', {
        ...values,
        id: tempRecord?.id,
      })
        .then((res) => {
          if (res.success) {
            res.msg && message.success(res.msg)
            setModalVisible(false)
            setTempRecord({})
            fetchTemps()
            fetTelnetModelList()
          } else {
            res.msg && message.error(res.msg)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
  //删除模板
  const delTemp = (record) => {
    post('/cfg.php?controller=assetMapping&action=delTelnetTemp', {
      id: record?.id,
      name: record.name,
    })
      .then((res) => {
        if (res.success) {
          res.msg && message.success(res.msg)
          setTempRecord({})
          fetchTemps()
          fetTelnetModelList()
        } else {
          res.msg && message.error(res.msg)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
  return (
    <ProCard
    // id='acl'
    // style={{ position: 'relative', overflow: 'hidden', height: '100%' }}
    >
      <Col offset={4} style={{ marginBottom: '20px' }}>
        <Alert
          style={{
            width: '600px',
          }}
          type="info"
          showIcon
          description={
            <div>
              <div>ACL配置用于阻断IP双向访问，设置到当前交换机的上联口；</div>
              <div>
                ACL编号默认使用扩展编号3998，若此编号交换机上已使用请重新指定。
              </div>
            </div>
          }
          message="帮助信息"
        ></Alert>
      </Col>
      <ProForm
        {...formleftLayout}
        initialValues={{
          aclMode: Number(baseInfo?.aclMode),
          aclNumber: baseInfo?.aclNumber,
          telnetValue: baseInfo?.telnet,
        }}
        submitter={{
          render: (props, doms) => {
            return [
              <Row>
                <Col span={12} offset={6}>
                  <Button
                    type="primary"
                    key="subment"
                    style={{ borderRadius: 5, marginBottom: '24px' }}
                    onClick={() => {
                      props.submit()
                    }}
                    disabled={!writable}
                    icon={<SaveOutlined />}
                  >
                    设置
                  </Button>
                </Col>
              </Row>,
            ]
          },
        }}
        formRef={formRef}
        onFinish={(values) => {
          save(values)
        }}
      >
        <ProFormSwitch
          label="管控状态"
          name="aclMode"
          width={280}
          checkedChildren={language('project.enable')}
          unCheckedChildren={language('project.shutclose')}
        />
        <ProFormSelect
          label="上联接口"
          name="seniorPort"
          width={280}
          placeholder={language('project.select')}
          options={portName}
        />
        <ProFormText
          width={280}
          name="aclNumber"
          label="ACL编号"
          placeholder="请输入编号"
        />
        <ProFormSelect
          label="远程模板"
          name="telnetValue"
          width={193}
          placeholder={language('project.select')}
          addonAfter={
            <Button
              icon={<PlusCircleOutlined />}
              type="primary"
              onClick={() => {
                setModalVisible(true)
              }}
              disabled={!writable}
            >
              新建
            </Button>
          }
          options={telnetModelList}
        />
        <ProFormItem label="模板列表" name="modelList" width={380}>
          <Table
            size="small"
            rowKey="id"
            style={{ width: '380px' }}
            rowSelection={false}
            bordered
            dataSource={temlData}
            columns={newColumns}
            pagination={false}
            scroll={{ y: 140 }}
          />
        </ProFormItem>
      </ProForm>
      <ModalForm
        {...modalFormLayout}
        width={380}
        formRef={modalRef}
        title="新建"
        visible={modalVisible}
        autoFocusFirstInput
        centered
        labelCol={{span:7}}
        wrapperCol={{span:17}}
        modalProps={{
          destroyOnClose: true,
          maskClosable: false,
          centered: true,
          // getContainer: false,
          // style: {
          //   position: 'absolute',
          // },
          onCancel: () => {
            setTempRecord({})
          },
        }}
        initialValues={{ protocol: '1',port:22}}
        onVisibleChange={setModalVisible}
        onFinish={(values) => {
          saveConfig(values)
        }}
        className={styles.addModal}
      >
         <NameText name='name' label='模板名称' width={200} required={true} placeholder='请输入'/> 
        <ProFormRadio.Group
          radioType="button"
          name="protocol"
          label="交互协议"
          
          options={[
            {
              label: 'SSH',
              value: '1',
            },
            {
              label: 'Telnet',
              value: '0',
            },
          ]}
          fieldProps={{
            buttonStyle: 'solid',
            width:200,
            onChange:(values)=>{
              if(Object.keys(tempRecord).length === 0){
                modalRef.current.setFieldsValue({
                  port: values.target.value==='1'?22:23,
                })
              }
            }
          }}
        />
        <ProFormText 
          name='port' 
          label='通信端口'
          placeholder='请输入'
          width={200}
          rules={[
              {
                pattern: regPortList.port.regex,
                message: regPortList.port.alertText,
              }
            ]}
          />
        <NameText name='user' label='登录用户' width={200} required={true} placeholder='请输入'/> 
        <ProFormText.Password
          width={200}
          name="passWd"
          label="用户密码"
          rules={[
            {
              required: true,
              message: language('project.mandatory'),
            },
          ]}
        />
        <ProFormText.Password width={200} name="enpWd" label="超级密码" />
      </ModalForm>
    </ProCard>
  )
}
