import React, { useRef, useState, useEffect } from 'react'
import {
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormRadio,
  ProFormCheckbox,
  ModalForm,
} from '@ant-design/pro-components'
import { SaveOutlined, DeleteOutlined, EditFilled } from '@ant-design/icons'
import {
  Button,
  Row,
  Col,
  message,
  Tooltip,
  Popconfirm,
  Space,
  Modal,
} from 'antd'
import { SendOne } from '@icon-park/react'
import { language } from '@/utils/language'
import styles from './index.less'
import { post } from '@/services/https'
import { regList, regPortList, regIpList } from '@/utils/regExp'
import EditTable from '@/components/Module/tinyEditTable/tinyEditTable'
import classNames from 'classnames'
import { fetchAuth } from '@/utils/common'

export default function MsgAlarm() {
  const writable = fetchAuth()
  const [typeList, setTypelist] = useState([])
  const [itemShowList, setItemShowList] = useState([])
  const [itemshow, setItemshow] = useState([])
  const [iscfgSave, setIscfgSave] = useState(true)
  const [isphSave, setIsphSave] = useState(true)
  const [msgDateSource, setMsgDateSource] = useState([])
  const [paramDateSource, setParamDateSource] = useState([])
  const [smstype, setSmstype] = useState('') //网关类型
  const [msgcfgName, setMsgcfgName] = useState('') //短信告警配置name
  const [testVisiable, setTestVisiable] = useState(false) //短信告警配置name
  const [testLoading, setTestLoading] = useState(false) //测试按钮loading
  const formRef = useRef()
  const phonesformRef = useRef()
  const testFormRef = useRef()
  useEffect(() => {
    // fetchTypeList()
    fetchSMSGWConf()
    fetchPhonecfg()
  }, [])

  const modalFormLayout = {
    labelCol: 7,
    wrapperCol: 17,
    layout: 'horizontal',
  }

  const phcolumns = [
    {
      title: language('project.evtlog.alarmcfg.phonenum'),
      dataIndex: 'phone',
      align: 'center',
      width: '80%',
      formItemProps: {
        rules: [
          {
            required: true,
            message: language('project.mandatory'),
          },
          {
            pattern: regList.phoneorlandline.regex,
            message: regList.phoneorlandline.alertText,
          },
        ],
      },
    },
    {
      title: language('project.operate'),
      valueType: 'option',
      width: '25%',
      align: 'center',
      render: (text, record, _, action) => [
        <Tooltip placement="top" title={language('project.edit')}>
          <a
            key="magEditable"
            onClick={() => {
              setIsphSave(false)
              var _a
              ;(_a =
                action === null || action === void 0
                  ? void 0
                  : action.startEditable) === null || _a === void 0
                ? void 0
                : _a.call(action, record.id)
            }}
          >
            <EditFilled />
          </a>
        </Tooltip>,
        <Popconfirm
          okText={language('project.yes')}
          cancelText={language('project.no')}
          title={language('project.delconfirm')}
          onConfirm={() => {
            setMsgDateSource(
              msgDateSource.filter((item) => item.id !== record.id)
            )
          }}
        >
          <Tooltip placement="top" title={language('project.del')}>
            <DeleteOutlined style={{ color: 'red' }} />
          </Tooltip>
        </Popconfirm>,
      ],
    },
  ]
  const argcolumns = [
    {
      title: language('project.evtlog.alarmcfg.fieldname'),
      dataIndex: 'name',
      align: 'left',
      width: '120px',
      ellipsis: true,
    },
    {
      title: language('project.evtlog.alarmcfg.argname'),
      dataIndex: 'argkey',
      align: 'left',
      width: '120px',
      ellipsis: true,
    },
    {
      title: language('project.evtlog.alarmcfg.ragvalue'),
      dataIndex: 'argval',
      align: 'left',
      width: '200px',
      ellipsis: true,
    },
    {
      title: language('project.operate'),
      valueType: 'option',
      width: '100px',
      align: 'center',
      render: (text, record, _, action) => [
        <Tooltip placement="top" title={language('project.edit')}>
          <a
            key="argEditable"
            onClick={() => {
              setIscfgSave(false)
              var _a
              ;(_a =
                action === null || action === void 0
                  ? void 0
                  : action.startEditable) === null || _a === void 0
                ? void 0
                : _a.call(action, record.id)
            }}
          >
            <EditFilled />
          </a>
        </Tooltip>,
        <Popconfirm
          okText={language('project.yes')}
          cancelText={language('project.no')}
          title={language('project.delconfirm')}
          onConfirm={() => {
            setParamDateSource(
              paramDateSource.filter((item) => item.id !== record.id)
            )
          }}
        >
          <Tooltip placement="top" title={language('project.del')}>
            <DeleteOutlined style={{ color: 'red' }} />
          </Tooltip>
        </Popconfirm>,
      ],
    },
  ]
  //第一版短信告警网关配置
  //获取短信网关类型列表
  // const fetchTypeList = () => {
  //   post('/cfg.php?controller=alaSetting&action=showSMSGWTypeList')
  //     .then((res) => {
  //       if (res.success) {
  //         setItemShowList(res.data)
  //         const arr = []
  //         res.data.map((item) => {
  //           arr.push({ label: item.text, value: item.value })
  //         })
  //         setTypelist(arr)
  //         fetchSMSGWConf(res.data)
  //       } else {
  //         res.msg && message.error(res.msg)
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //     })
  // }

  // //短信网关配置回显
  // const fetchSMSGWConf = (datas) =>{
  //   post('/cfg.php?controller=alaSetting&action=showSMSGWConf')
  //   .then((res) => {
  //     if (res.success) {
  //       console.log(res.data,'data');
  //       formRef.current.setFieldsValue(res.data)
  //       datas.map((item) => {
  //         if (item.value === res.data.smstype) {
  //           setItemshow(item.display)
  //         }
  //       })
  //     } else {
  //       res.msg && message.error(res.msg)
  //     }
  //   })
  //   .catch((error) => {
  //     console.log(error)
  //   })
  // }

  // //保存短信网关配置
  // const setSmsConf = (values) => {
  //   post('/cfg.php?controller=alaSetting&action=setSMSGWConf',{...values})
  //     .then((res) => {
  //       if (res.success) {
  //         res.msg && message.success(res.msg)
  //       } else {
  //         res.msg && message.error(res.msg)
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //     })
  // }

  //第二版短信告警网关配置
  const setSmsConf = (values) => {
    const signStatus = values.sign ? 'Y' : 'N'
    const params = {
      ...values,
      smstype: smstype,
      sign: signStatus,
      arglist: JSON.stringify(paramDateSource),
    }
    post('/cfg.php?controller=alaSetting&action=setSMSGWConf', params)
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
  //短信测试
  const msgTest = (value) => {
    setTestLoading(true)
    const data = formRef.current.getFieldsValue(true)
    const signStatus = data.sign ? 'Y' : 'N'
    const params = {
      ...data,
      smstype: smstype,
      sign: signStatus,
      arglist: JSON.stringify(paramDateSource),
      sendsms: value.sendsms,
    }
    post('/cfg.php?controller=alaSetting&action=sendSMSGTest', params, {
      timeout: 1000 * 30,
    })
      .then((res) => {
        if (res.success) {
          setTestLoading(false)
          setTestVisiable(false)
          Modal.info({
            title: language('project.evtlog.alarmcfg.result'),
            content: res.msg || '操作成功',
          })
        } else {
          setTestLoading(false)
          setTestVisiable(false)
          Modal.error({
            title: language('project.evtlog.alarmcfg.result'),
            content: res.msg || '操作失败',
          })
        }
      })
      .catch((error) => {
        setTestLoading(false)
        setTestLoading(false)
        console.log(error)
        Modal.error({
          title: language('project.evtlog.alarmcfg.result'),
          content: res.msg || '操作失败',
        })
      })
  }
  //短信网关配置回显
  const fetchSMSGWConf = () => {
    post('/cfg.php?controller=alaSetting&action=showSMSGWConf')
      .then((res) => {
        if (res.success) {
          if (res.data.length < 1) {
            return false
          }
          let argData = []
          const signStatus = res.data[0].sign === 'Y'
          res.data[0]?.arglist.map((item, index) => {
            argData.push({ ...item, id: index })
          })
          formRef.current.setFieldsValue({ ...res.data[0], sign: signStatus })
          setParamDateSource(argData)
          setSmstype(res.data[0].smstype)
        } else {
          res.msg && message.error(res.msg)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //短信告警配置回显
  const fetchPhonecfg = () => {
    post('/cfg.php?controller=alaSetting&action=showPhoneConf')
      .then((res) => {
        if (res.success) {
          if (res.data.length <= 0) {
            return false
          } else {
            const newArr = []
            const arr = res.data[0].receive.split(';')
            arr.map((item, index) => {
              newArr.push({ id: index + 1, phone: item })
            })
            setMsgDateSource(newArr)
            setMsgcfgName(res.data[0].name)
          }
        } else {
          res.msg && message.error(res.msg)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //短信告警配置
  const setPhoneconf = () => {
    const phones = []
    msgDateSource.map((item) => {
      phones.push(item.phone)
    })
    post('/cfg.php?controller=alaSetting&action=setPhoneConf', {
      receive: phones.join(','),
      name: msgcfgName,
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
  const formleftLayout = {
    labelCol: {
      xs: { span: 8 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 16 },
      sm: { span: 18 },
    },
    layout: 'horizontal',
  }

  return (
    <ProCard direction="column" ghost gutter={[13, 13]}>
      {/* <ProCard title="短信网关配置">
        <ProForm
          className={styles.smswayfForm}
          {...formleftLayout}
          formRef={formRef}
          submitter={{
            render: (props) => {
              return [
                <Row>
                  <Col span={14} offset={6}>
                    <Button
                      type="primary"
                      key="subment"
                      onClick={() => {
                        formRef.current.submit()
                      }}
                    >
                      <SaveOutlined />
                      {language('project.savesettings')}
                    </Button>
                  </Col>
                </Row>,
              ]
            },
          }}
          onFinish={setSmsConf}
        >
          <ProFormSelect
            label={language('monconf.smsgate.smsType')}
            name="smstype"
            options={typeList}
            onChange={(key, value) => {
              itemShowList.map((item) => {
                if (item.value === key) {
                  setItemshow(item.display)
                }
              })
              formRef.current.setFieldsValue({smshost:'',smscode:'',smspawd:'',smssign:'',smstmpl:''})
            }}
            width={200}
            rules={[
              {
                required: true,
                message: language('project.messageselect'),
              },
            ]}
          />
          {itemshow.includes('smshost') && (
            <ProFormText
              label={language('monconf.smsgate.host')}
              name="smshost"
              width={200}
              rules={[
                {
                  required: true,
                  message: language('project.mandatory'),
                },
                {
                  pattern: regIpList.domainName.regex,
                  message: regIpList.domainName.alertText,
                },
                {
                  max: 64,
                },
              ]}
            />
          )}
          {itemshow.includes('smscode') && (
            <ProFormText
              label={language('monconf.smsgate.code')}
              name="smscode"
              width={200}
              rules={[
                {
                  required: true,
                  message: language('project.mandatory'),
                },
                {
                  pattern: regList.wordOrNum.regex,
                  message: regList.wordOrNum.alertText,
                },
                {
                  max: 64,
                },
              ]}
            />
          )}

          {itemshow.includes('smspawd') && (
            <ProFormText.Password
              label={language('monconf.smsgate.pw')}
              name="smspawd"
              width={200}
              rules={[
                {
                  required: true,
                  message: language('project.mandatory'),
                },
                {
                  max: 32,
                },
              ]}
            />
          )}
          {itemshow.includes('smssign') && (
            <ProFormText
              label={language('monconf.smsgate.sign')}
              name="smssign"
              width={200}
            />
          )}

          {itemshow.includes('smstmpl') && (
            <ProFormText
              label={language('monconf.smsgate.temId')}
              name="smstmpl"
              width={200}
            />
          )}
        </ProForm>
      </ProCard> */}
      <ProCard title={language('project.evtlog.alarmcfg.smaconfig')}>
        <ProForm
          className={styles.smswayfForm}
          {...formleftLayout}
          formRef={formRef}
          submitter={{
            render: (props) => {
              return [
                <Row>
                  <Col span={14} offset={6}>
                    <Space>
                      <Button
                        type="primary"
                        key="subment"
                        disabled={!writable}
                        onClick={() => {
                          if (!iscfgSave) {
                            message.error(language('project.pleasesavedata'))
                          } else {
                            formRef.current.submit()
                          }
                        }}
                      >
                        <SaveOutlined />
                        {language('project.savesettings')}
                      </Button>
                      <Button
                        disabled={!writable}
                        type="primary"
                        onClick={() => {
                          if (!iscfgSave) {
                            message.error(language('project.pleasesavedata'))
                          } else {
                            setTestVisiable(true)
                          }
                        }}
                        icon={
                          <span
                            style={{
                              verticalAlign: 'middle',
                              display: 'inline-block',
                              marginRight: 5,
                            }}
                          >
                            <SendOne theme="outline" />
                          </span>
                        }
                      >
                        发送测试
                      </Button>
                    </Space>
                  </Col>
                </Row>,
              ]
            },
          }}
          onFinish={setSmsConf}
        >
          <ProFormText
            label={language('project.evtlog.alarmcfg.smshost')}
            name="smshost"
            width={200}
            rules={[
              {
                required: true,
                message: language('project.mandatory'),
              },
              {
                pattern: regIpList.domainName.regex,
                message: regIpList.domainName.alertText,
              },
              {
                max: 64,
              },
            ]}
          />
          <div className={styles.methodRadio}>
            <ProFormRadio.Group
              name="method"
              label={language('project.evtlog.alarmcfg.method')}
              radioType="button"
              fieldProps={{
                buttonStyle: 'solid',
              }}
              initialValue="purl"
              options={[
                {
                  label: 'POST-urlencode',
                  value: 'purl',
                },
                {
                  label: 'GET-urlencode',
                  value: 'gurl',
                },
                {
                  label: 'JSON',
                  value: 'json',
                },
              ]}
            />
          </div>
          <ProFormText
            label={language('project.evtlog.alarmcfg.content')}
            name="content"
            width={200}
            rules={[
              {
                required: true,
                message: language('project.mandatory'),
              },
            ]}
            addonAfter={
              <div style={{ display: 'flex' }} className={styles.signItem}>
                <div>
                  <ProFormCheckbox width={85} name="sign">
                    {language('project.evtlog.alarmcfg.addsign')}
                  </ProFormCheckbox>
                </div>

                <ProFormText name="signtext" width={100} />
              </div>
            }
          />
          <ProFormText
            label={language('project.evtlog.alarmcfg.pharg')}
            name="receive"
            width={200}
            rules={[
              {
                required: true,
                message: language('project.mandatory'),
              },
            ]}
          />
          <div
            className={classNames({
              [styles.phoneItemNoError]: paramDateSource.length > 0,
            })}
          >
            <ProFormText
              rules={[
                {
                  required: paramDateSource.length > 0 ? false : true,
                  message: language('project.mandatory'),
                },
              ]}
              label={language('project.evtlog.alarmcfg.otherarg')}
              style={{ width: '550px' }}
            >
              <EditTable
                setIsSave={setIscfgSave}
                columns={argcolumns}
                tableWidth={540}
                dataSource={paramDateSource}
                setDataSource={setParamDateSource}
                deleteButShow={false}
              />
            </ProFormText>
          </div>
        </ProForm>
      </ProCard>
      <ProCard title={language('project.evtlog.alarmcfg.smsalarm')}>
        <ProForm
          {...formleftLayout}
          formRef={phonesformRef}
          submitter={{
            render: () => {
              return [
                <Row>
                  <Col span={14} offset={6}>
                    <Button
                      disabled={!writable}
                      type="primary"
                      onClick={() => {
                        if (!isphSave) {
                          message.error(language('project.pleasesavedata'))
                        } else {
                          phonesformRef.current.submit()
                        }
                      }}
                    >
                      <SaveOutlined />
                      {language('project.savesettings')}
                    </Button>
                  </Col>
                </Row>,
              ]
            },
          }}
          onFinish={setPhoneconf}
        >
          <div
            className={classNames({
              [styles.phoneItemNoError]: msgDateSource.length > 0,
            })}
          >
            <ProFormText
              rules={[
                {
                  required: msgDateSource.length > 0 ? false : true,
                  message: language('project.mandatory'),
                },
              ]}
              label={language('project.evtlog.alarmcfg.sendPhones')}
              name="sendPhones"
              style={{ width: '377px' }}
            >
              <EditTable
                setIsSave={setIsphSave}
                columns={phcolumns}
                tableHeight={170}
                tableWidth={377}
                maxLength={3}
                dataSource={msgDateSource}
                setDataSource={setMsgDateSource}
                deleteButShow={false}
              />
            </ProFormText>
          </div>
        </ProForm>
      </ProCard>
      <ModalForm
        {...modalFormLayout}
        formRef={testFormRef}
        visible={testVisiable}
        width="400px"
        onVisibleChange={setTestVisiable}
        title="短信发送"
        modalProps={{
          bodyStyle: { paddingBottom: 12 },
          centered: true,
          destroyOnClose: true,
          onCancel: () => {
            setTestLoading(false)
          },
        }}
        onFinish={msgTest}
        submitter={{
          render: (props) => {
            return [
              <Button
                type="default"
                onClick={() => {
                  setTestVisiable(false)
                }}
              >
                取消
              </Button>,
              <Button
                type="primary"
                loading={testLoading}
                onClick={() => {
                  testFormRef.current.submit()
                }}
              >
                确认
              </Button>,
            ]
          },
        }}
      >
        <ProFormText
          label="接收手机号"
          name="sendsms"
          width={200}
          rules={[
            {
              required: true,
              message: language('project.messageselect'),
            },
            {
              pattern: regList.phoneorlandline.regex,
              message: regList.phoneorlandline.alertText,
            },
          ]}
        />
      </ModalForm>
    </ProCard>
  )
}
