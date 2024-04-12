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
import { fetchAuth } from '@/utils/common'
import { formleftLayout } from '@/utils/helper'
import { SendEmail } from '@icon-park/react'
import { regList, regPortList } from '@/utils/regExp'
export default () => {
  const writable = fetchAuth()
  const formRef = useRef()
  const [testloading, setTestloading] = useState(false)
  const [statusType, setStatusType] = useState(false);
  useEffect(() => {
    showVioFTPConf()
  }, [])

  const showVioFTPConf = () => {
    post('/cfg.php?controller=confViolation&action=showVioFTPConf')
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
          return false
        }
        let list = res.data ? res.data : {};
        let checked = false
        if (list.state == 'Y') {
          checked = true;
        }
        setStatusType(checked);
        list.state = checked;
        setTimeout(() => {
          formRef.current?.setFieldsValue(list)
        }, 1000)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  const setConfig = (values) => {
    let data = values
    data.state = values.state === true ? 'Y' : 'N'
    post('/cfg.php?controller=confViolation&action=setVioFTPConf', data).then((res) => {
      if (!res.success) {
        message.error(res.msg)
        return false
      }
      message.success(res.msg)
      showVioFTPConf()
    })
  }

  return (
    <>
      <ProCard title={language('cfgmngt.outferry.externalbaiduconfig')}>
        <ProForm
          {...formleftLayout}
          formRef={formRef}
          submitter={{
            render: (props, doms) => {
              return [
                <Row>
                  <Col span={14} offset={6}>
                    <Button
                      type="primary"
                      disabled={!writable}
                      style={{ borderRadius: 5 }}
                      onClick={() => {
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
            setConfig(values)
          }}
        >
          <ProFormSwitch
            checkedChildren={language('project.open')}
            unCheckedChildren={language('project.close')}
            name='state'
            label={language('cfgmngt.outferry.startferry')}
            onChange={(e)=>{
              setStatusType(e);
            }}
            rules={[
              {
                required: true,
              },
            ]}
          />
          <ProFormText
            width="280px"
            label={language('cfgmngt.outferry.uploadaccount')}
            name='username'
            rules={[
              {
                required: statusType,
              },
            ]}
          />
          <ProFormText.Password
            width="280px"
            label={language('cfgmngt.outferry.uploadpwd')}
            name='password'
            rules={[
              {
                required: statusType,
              },
            ]}
          />
          <ProFormText
            width="280px"
            label={language('cfgmngt.outferry.uploadport')}
            name='port'
            rules={[
              {
                required: statusType,
              },
              {
                pattern: regPortList.port.regex,
                message: regPortList.port.alertText,
              },
            ]} />
        </ProForm>
      </ProCard>
    </>
  )
}