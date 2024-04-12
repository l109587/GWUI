import React, { useState, useRef, useEffect } from 'react'
import {
  ProCard,
  ProForm,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components'
import { post } from '@/services/https'
import { Button, Row, Col, message } from 'antd'
import { SaveOutlined, LoadingOutlined } from '@ant-design/icons'
import { language } from '@/utils/language'
import { formleftLayout } from '@/utils/helper'
import { SendEmail } from '@icon-park/react'
import styles from './denynotice.less'
import { regList, regIpList } from '@/utils/regExp'
import { fetchAuth, valiCompare } from '@/utils/common'
export default () => {
  const formRef = useRef()
  const writable = fetchAuth()
  const [submitType, setSubmitType] = useState('')
  const [testloading, setTestloading] = useState(false)
  useEffect(() => {
    getConfig()
  }, [])

  const getConfig = () => {
    post('/cfg.php?controller=warnConf&action=showFtpConf')
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
          return false
        }
        let checked = false
        if (res.state == 'Y') {
          checked = true
        }
        res.state = checked
        setTimeout(() => {
          formRef.current?.setFieldsValue(res)
        }, 1000)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  const setConfig = (values) => {
    let data = values
    data.state = values.state === true ? 'Y' : 'N'
    post('/cfg.php?controller=warnConf&action=setFtpConf', data).then((res) => {
      if (!res.success) {
        message.error(res.msg)
        return false
      }
      message.success(res.msg)
      getConfig()
    })
  }

  const testFtpConf = (values) => {
    setTestloading(true)
    let data = {}
    data.ftpaddr = values.ftpaddr
    data.ftpport = values.ftpport
    data.ftppath = values.ftppath
    data.ftpuser = values.ftpuser
    data.ftppwd = values.ftppwd
    post('/cfg.php?controller=warnConf&action=testFtpConf', data).then(
      (res) => {
        if (!res.success) {
          setTestloading(false)
          message.error(res.msg)
          return false
        }
        setTestloading(false)
        message.success(res.msg)
      }
    )
  }

  return (
    <>
      <ProCard title="阻断通知配置">
        <ProForm
          {...formleftLayout}
          formRef={formRef}
          submitTimeout={2000}
          submitter={{
            render: (props, doms) => {
              return [
                <Row>
                  <Col span={14} offset={6}>
                    <Button
                      type="primary"
                      style={{ borderRadius: 5 }}
                      disabled={!writable}
                      onClick={() => {
                        setSubmitType('submit')
                        props.submit()
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
          onFinish={(values) => {
            if (submitType === 'submit') {
              setConfig(values)
            } else if (submitType === 'test') {
              testFtpConf(values)
            }
          }}
        >
          <ProFormSwitch
            label="阻断通知"
            name="state"
            checkedChildren={language('project.open')}
            unCheckedChildren={language('project.close')}
            rules={[{ required: true, message: language('project.mandatory') }]}
          />
          <ProFormText
            name="ftpaddr"
            label="FTP地址"
            width="280px"
            rules={[
              { required: true, message: language('project.mandatory') },
              {
                pattern: regIpList.ipv4.regex,
                message: regIpList.ipv4.alertText,
              },
            ]}
          />
          <ProFormText
            name="ftpport"
            label="FTP端口"
            width="280px"
            rules={[
              { required: true, message: language('project.mandatory') },
              {
                pattern: regIpList.singleport.regex,
                message: regIpList.singleport.alertText,
              },
            ]}
          />
          <ProFormText
            name="ftpuser"
            label="账号"
            width="280px"
            rules={[
              { required: true, message: language('project.mandatory') },
              {
                pattern: /[a-zA-Z0-9._-]/,
                message: '请输入大小写字母数字“-”、“_”,“.”及其组合',
              },
            ]}
          />
          <ProFormText.Password
            name="ftppwd"
            label="密码"
            width="280px"
            rules={[
              { required: true, message: language('project.mandatory') },
              {
                validator: (rule, value, callback) => {
                  if (
                    /[\u4e00-\u9fa5]/.test(value) ||
                    value.indexOf(' ') > -1
                  ) {
                    callback('禁止输入中文和空格')
                  } else {
                    callback()
                  }
                },
              },
            ]}
          />
          <ProFormText
            name="ftppath"
            label="上传目录"
            width="280px"
            rules={[
              { required: true, message: language('project.mandatory') },
              {
                // pattern: /^\/(\w+\/?)+$/,
                pattern: /^\/([\u4E00-\u9FA5A-Za-z0-9_]+\/{1})+$/,
                message: '目录以/隔开 如 log/outvio/',
              },
            ]}
            addonAfter={
              <Button
                type="primary"
                htmlType="submit"
                disabled={!writable}
                onClick={() => {
                  setSubmitType('test')
                }}
              >
                {testloading === false ? (
                  <div className={styles.mailbuDiv}>
                    <SendEmail style={{ marginTop: 5 }} size="16" fill="#fff" />
                    <span style={{ marginLeft: 10 }}>
                      {language('monconf.alertnotice.test')}
                    </span>
                  </div>
                ) : (
                  <div className="mailbuDiv">
                    <LoadingOutlined
                      style={{ marginRight: 10, fontSize: 16 }}
                    />
                    <span style={{ marginTop: '3px' }}>
                      {language('monconf.alertnotice.test')}
                    </span>
                  </div>
                )}
              </Button>
            }
          />
          <ProFormText
            name="stime"
            label="通知频率"
            width="280px"
            rules={[
              {
                required: submitType === 'test' ? false : true,
                message: language('project.mandatory'),
              },
              {
                validator: (rule, value, callback) => {
                  valiCompare(Number(value), callback, 60, 1200)
                },
              },
            ]}
          />
        </ProForm>
      </ProCard>
    </>
  )
}
