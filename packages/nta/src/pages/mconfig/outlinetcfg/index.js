import React, { useRef, useState, useEffect } from 'react';
import { Modal, Input, message, Button, Col, Row, Alert } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { post } from '@/services/https';
import ProForm, { ModalForm, ProFormText, ProFormSwitch, ProFormTextArea, ProFormDigit } from '@ant-design/pro-form';
import { formleftLayout } from "@/utils/helper";
import { language } from '@/utils/language';
import '@/utils/index.less';
import './index.less';
import { regIpList, regPortList, regUrlList } from '@/utils/regExp';
import { ProCard } from '@ant-design/pro-components';
let H = document.body.clientHeight - 336
export default () => {
  const formRef = useRef();
  const [addrRequired, setAddrRequired] = useState(false);
  //列表数据
  const fromcolumns = [
    {
      title: language('dmcoconfig.bac'),
      dataIndex: 'ip',
      align: 'center',
      formItemProps: () => {
        return {

        };
      },
    },
  ];
  useEffect(() => {
    showListenPort();
  }, [])

  //回显端口数据
  const showListenPort = () => {
    post('/cfg.php?controller=confOutline&action=show').then((res) => {
      if (res.success && res.data) {
        res.data.state = res.data.state && res.data.state == 'Y' ? true : false;
        setAddrRequired(res.data.state);
        formRef.current.setFieldsValue(res.data);
      }
    }).catch(() => {
      console.log('mistake')
    })
  }

  const handleSaveBtn = (values) => {
    values.state = values.state || values.state == 'Y' ? 'Y' : 'N'
    post('/cfg.php?controller=confOutline&action=set', values).then((res) => {
      if (res.success) {
        message.success(res.msg)
        showListenPort()
      } else {
        message.error(res.msg)
      }
    }).catch(() => {
      console.log('mistake')
    })
  }


  const afterDiv = (unit) => {
    return <div className='afterOutDiv'>{unit}</div>
  }

  return (
    <div className='outlinecfgformbox' style={{ backgroundColor: 'white' }}>
      <ProCard title={'违规外联配置'}>
        <ProForm formRef={formRef} {...formleftLayout} autoFocusFirstInput
          submitter={{
            render: (props, doms) => {
              return (
                <Col offset={6}>
                  <Button type='primary' key='subment'
                    style={{ borderRadius: 5 }}
                    onClick={() => {
                      formRef.current.submit();
                    }}
                    icon={<SaveOutlined />}>
                    {'设置'}
                  </Button>
                </Col>
              )
            }
          }} onFinish={async (values) => {
            handleSaveBtn(values)
          }}>
          <Row>
            <Col span={4}></Col>
            <Col >
              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px', marginLeft: 20 }}>
                <Alert style={{ width: '420px' }} banner message={'如果发生违规外联行为，将down掉发生违规外联的网口'} type="info" showIcon />
              </div>
            </Col>
          </Row>
          <ProFormSwitch label={'启用状态'} name='state' checkedChildren={language('project.enable')} unCheckedChildren={language('project.disable')}
            onChange={(e) => {
              setAddrRequired(e);
            }}

          />
          <ProFormDigit
            name="cycle"
            label={'探测周期'}
            addonAfter={afterDiv('分钟')}
            width='230px'
            placeholder="请输入"
            min={1}
            max={60}
          />
          <ProFormTextArea
            width='280px'
            name='detectAddr'
            label={'探测地址'}
            rules={
              [
                { required: addrRequired },
                {
                  validator: (rules, value) => {
                    let reg = regIpList.ipv4andpart.regex;
                    if (value) {
                      let info = value.split(',')
                      let state = true;
                      info.map((item) => {
                        console.log(item)
                        if (!reg.test(item)) {
                          state = false;
                        }
                      })
                      if (!state) {
                        return Promise.reject('输入IP:端口,如192.168.0.1:8082,多个用，隔开');
                      }
                    }
                    return Promise.resolve();
                  }
                },
              ]
            }
          />
          <ProFormTextArea
            width='280px'
            name='alarmAddr'
            label={'告警地址'}
            rules={
              [
                { required: addrRequired },
                {
                  validator: (rules, value) => {
                    let reg = regUrlList.PortUrl.regex;
                    if (value) {
                      let info = value.split(',')
                      console.log(info)
                      let state = true;
                      info.map((item) => {
                        console.log(item)
                        if (!reg.test(item)) {
                          state = false;
                        }
                      })
                      if (!state) {
                        return Promise.reject('输入告警地址,如https://192.168.12.101:8080/v1/log,多个用，隔开');
                      }
                    }
                    return Promise.resolve();
                  }
                },
              ]
            }
          />
        </ProForm>
      </ProCard>
    </div>
  );
};
