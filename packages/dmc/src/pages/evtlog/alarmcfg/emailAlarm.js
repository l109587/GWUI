import React, { useRef, useState, useEffect } from 'react'
import { formleftLayout } from '@/utils/helper'
import ProForm, { ProFormText } from '@ant-design/pro-form'
import {
  DeleteOutlined,
  SaveOutlined,
  SaveFilled,
  DeleteFilled,
  EditFilled,
  LoadingOutlined,
} from '@ant-design/icons'
import EditTable from '@/components/Module/tinyEditTable/tinyEditTable'
import { post } from '@/services/https'
import {
  Button,
  Row,
  Col,
  message,
  Checkbox,
  Popconfirm,
  Space,
  Tooltip,
  Modal,
} from 'antd'
import { ProCard } from '@ant-design/pro-components'
import { language } from '@/utils/language'
import styles from './index.less'
import { SendEmail } from '@icon-park/react'
import { regList, regIpList } from '@/utils/regExp'
import classNames from 'classnames'
import { fetchAuth } from '@/utils/common'

export default () => {
  const writable = fetchAuth()
  const formRef = useRef()
  const [buloading, setBuloading] = useState(false)
  const [checked, setChecked] = useState(true)
  const [submitType, setSubmitType] = useState('')
  const [emailDateSource, setEmailDateSource] = useState([])
  const [isSave, setIsSave] = useState(true) // 未保存当前数据不可下发
  const [ecfgName, setEcfgName] = useState('') //邮件告警配置name

  const fromcolumns = [
    {
      title: language('project.evtlog.alarmcfg.emailacc'),
      dataIndex: 'email',
      align: 'center',
      width: '80%',
      formItemProps: {
        rules: [
          {
            required: true,
            message: language('project.mandatory'),
          },
          {
            pattern: regList.strictEmail.regex,
            message: regList.strictEmail.alertText,
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
        <Tooltip
          placement="top"
          title={language('project.edit')}
        >
          <a
            key="editable"
            onClick={() => {
              setIsSave(false)
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
            setEmailDateSource(
              emailDateSource.filter((item) => item.id !== record.id)
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

  useEffect(() => {
    getData()
  }, [])

  const getData = () => {
    post('/cfg.php?controller=alaSetting&action=showEmailConf').then((res) => {
      if (!res.success) {
        res.msg && message.error(res.msg)
        return false
      }
      if (res.data.length <= 0) {
        return false
      }
      setChecked(res?.data[0].mailssl === 'Y')
      let tabledata = []
      let rowKey = []
      let receive = res?.data[0]?.receive
      let info = receive ? receive.split(';') : []
      info.map((item, index) => {
        tabledata.push({ id: index + 1, email: item })
        rowKey.push(index + 1)
      })
      res.data[0].receive = tabledata
      setEmailDateSource(res.data[0].receive)
      res.data[0].sendPhones = []
      res.data[0].receive = []
      let initialValues = res.data[0]
      formRef.current.setFieldsValue(initialValues)
      setEcfgName(res.data[0].name)
    })
  }

  const handleSend = () => {
    let obj = formRef.current.getFieldsValue([
      'mailsvr',
      'mailsnd',
      'mailpwd',
      'testmail',
    ])
    const data = { ...obj, mailssl: checked ? 'Y' : 'N' }
    setBuloading(true)
    post('/cfg.php?controller=alaSetting&action=sendMailTest', data,{timeout:1000*30}).then(
      (res) => {
        if (!res.success) {
          setBuloading(false)
          Modal.error({
            title: language('project.evtlog.alarmcfg.result'),
            content: res.msg,
          })
          return false
        }
        setBuloading(false)
        Modal.info({
          title: language('project.evtlog.alarmcfg.result'),
          content: res.msg,
        })
      }
    ).catch((error)=>{
      setBuloading(false)
      Modal.error({
        title: language('project.evtlog.alarmcfg.result'),
        content: '测试失败',
      })
    })
  }

  const setMailconf = () => {
    let obj = formRef.current.getFieldsValue([
      'mailsvr',
      'mailsnd',
      'mailpwd',
    ])
    let data = { ...obj, mailssl: checked ? 'Y' : 'N', name: ecfgName }
    let arr = []
    if (emailDateSource.length > 0) {
      emailDateSource.map((item) => {
        arr.push(item.email)
      })
    }
    data.receive = arr.join(',')
    post('/cfg.php?controller=alaSetting&action=setEmailConf', data).then(
      (res) => {
        if (!res.success) {
          res.msg && message.error(res.msg)
          return false
        }
        message.success(res.msg)
      }
    )
  }

  return (
    <ProCard title={language('project.evtlog.alarmcfg.emailconfig')} bodyStyle={{padding:'16px 24px'}}>
      <ProForm
        {...formleftLayout}
        formRef={formRef}
        submitter={{
          render: () => {
            return [
              <Row>
                <Col span={14} offset={6}>
                  <Button
                    type="primary"
                    disabled={!writable}
                    onClick={() => {
                      if (!isSave) {
                        message.error(language('project.pleasesavedata'))
                      } else {
                        formRef.current.submit()
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
        onFinish={setMailconf}
      >
        <div>
          <ProFormText
            label={language('project.evtlog.alarmcfg.smtpServer')}
            name="mailsvr"
            rules={[
              {
                pattern: regIpList.ipOrRealm.regex,
                message: regIpList.ipOrRealm.alertText,
              },
              {
                required: true,
                message: language('project.mandatory'),
              },
            ]}
            width="200px"
            addonAfter={
              <Checkbox
                checked={checked}
                name="mailssl"
                onChange={(e) => {
                  setChecked(e.target.checked)
                }}
              >
                SSL
              </Checkbox>
            }
          />
        </div>
        <ProFormText
          rules={[
            {
              pattern: regList.strictEmail.regex,
              message: regList.strictEmail.alertText,
            },
            {
              required: true,
              message: language('project.mandatory'),
            },
          ]}
          width="200px"
          label={language('project.evtlog.alarmcfg.mailCount')}
          name="mailsnd"
        />
        <ProFormText.Password
          rules={[
            {
              required: true,
              message: language('project.mandatory'),
            },
            {
              pattern: regList.wordOrNum.regex,
              message: regList.wordOrNum.alertText,
            },
          ]}
          width="200px"
          label={language('project.evtlog.alarmcfg.mailPd')}
          name="mailpwd"
        />
        <div className={styles.sendMailDiv}>
          <ProFormText
            width="200px"
            label={language('project.evtlog.alarmcfg.testMail')}
            placeholder={language('project.evtlog.alarmcfg.testMailplace')}
            name="testmail"
            rules={[
              {
                pattern: regList.strictEmail.regex,
                message: regList.strictEmail.alertText,
              },
            ]}
            addonAfter={
              <Button type="primary" disabled={buloading||!writable} onClick={handleSend}>
                {buloading === false ? (
                  <div className={styles.mailbuDiv}>
                    <SendEmail style={{ marginTop: 5 }} size="16" fill="#fff" />
                    <span style={{ marginLeft: 10 }}>
                      {language('project.evtlog.alarmcfg.test')}
                    </span>
                  </div>
                ) : (
                  <div className="mailbuDiv">
                    <LoadingOutlined
                      style={{ marginRight: 10, fontSize: 16 }}
                    />
                    <span style={{ marginTop: '3px' }}>
                      {language('project.evtlog.alarmcfg.test')}
                    </span>
                  </div>
                )}
              </Button>
            }
          />
        </div>
        <div
          className={classNames({
            [styles.emailItemNoError]: emailDateSource.length > 0,
          })}
        >
          <ProFormText
            style={{ width: '377px' }}
            label={language('project.evtlog.alarmcfg.sendMails')}
            name="receive"
            trigger="onValuesChange"
            rules={[
              {
                required: emailDateSource.length > 0 ? false : true,
                message: language('project.mandatory'),
              },
            ]}
          >
            <EditTable
              setIsSave={setIsSave}
              columns={fromcolumns}
              tableHeight={130}
              tableWidth={377}
              maxLength={5}
              dataSource={emailDateSource}
              setDataSource={setEmailDateSource}
              deleteButShow={false}
            />
          </ProFormText>
        </div>
      </ProForm>
    </ProCard>
  )
}
