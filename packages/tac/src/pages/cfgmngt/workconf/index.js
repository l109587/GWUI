import React, { useRef, useState, useEffect } from 'react';
import { SaveOutlined, LoadingOutlined } from '@ant-design/icons';
import { ProTable, ProCard } from '@ant-design/pro-components';
import ProForm, { ProFormText, ProFormDigit, ProFormSwitch, ProFormSelect } from '@ant-design/pro-form';
import { formleftLayout, afterLayout, formhorizCard, } from "@/utils/helper";
import { Search, Button, Row, Col, message, Modal, Checkbox, Space, Spin, Upload } from 'antd';
import { NameText, NotesText } from '@/utils/fromTypeLabel';
import { language } from '@/utils/language';
import { fetchAuth } from '@/utils/common';
import '@/utils/index.less';
import './index.less';
import { post, postAsync, postDownd } from '@/services/https';
import { regList } from '@/utils/regExp';

export default () => {
  const writable = fetchAuth()
  const workRef = useRef();
  const workOrderRef = useRef();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    info()
  }, [])

  const info = () => {
    post('/cfg.php?controller=confWorkOrder&action=showWorkOrder').then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      workRef.current.setFieldsValue(res.SigText);
      if(res.TemWorkOrder){
        res.TemWorkOrder.status = res.TemWorkOrder.status && res.TemWorkOrder.status != 'off' ? true : false;
      }
      workOrderRef.current.setFieldsValue(res.TemWorkOrder);
    }).catch(() => {
      console.log('mistake')
    })
  }

  const loadIcon = (
    <LoadingOutlined spin />
  )

  const saveConfig = () => {
    let obj = workRef.current.getFieldsValue(['unit', 'department']);
    post('/cfg.php?controller=confWorkOrder&action=setSigText', obj).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg)
    }).catch(() => {
      console.log('mistake')
    })
  }

  const saveOrderConfig = () => {
    let obj = workOrderRef.current.getFieldsValue(['status', 'temTime']);
    let data = {};
    data.status = obj.status && obj.status != 'off' ? 'on' : 'off';
    data.temTime = obj.temTime;
    post('/cfg.php?controller=confWorkOrder&action=setTemWorkOrder', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg)
    }).catch(() => {
      console.log('mistake')
    })
  }

  const hourlaver = (
    <div><div className='worktimeafter'>{language('cfgmngt.workconf.day')}</div><span style={{marginLeft: '5px'}}>1-30</span></div>
  );

  return (<>
    <Spin tip={loading ? language('project.loadingtip') : language('project.sysdebug.wireshark.loading')} spinning={loading} indicator={loadIcon} size='large' style={{ height: '100%', position: 'absolute', top: '20%', fontSize: '24px' }}>
      <ProCard direction='column' ghost gutter={[13, 13]} className='dentence'>
        <ProCard title={language('cfgmngt.workconf.temporaryworkorderconfig')} >
          <ProForm
            formRef={workOrderRef}
            submitter={{
              render: (props, doms) => {
                return [<Row>
                  <Col span={12} offset={6} style={{ display: 'flex' }}>
                    <Button type='primary' key='subment'
                      disabled={!writable}
                      style={{ borderRadius: 5, marginRight: 50 }}
                      onClick={() => {
                        props.submit()
                      }}
                      icon={<SaveOutlined />}>
                      {language('project.set')}
                    </Button>
                  </Col>
                </Row>
                ]
              }
            }}
            {...formhorizCard}
            onFinish={async () => {
              saveOrderConfig()
            }}>
            <ProFormSwitch 
              checkedChildren={language('project.open')} 
              unCheckedChildren={language('project.close')}
              name='status' 
              label={language('cfgmngt.workconf.temporaryworkorder')} 
            />
            <ProFormDigit 
              width="100px"
              label={language('cfgmngt.workconf.validityperiodworkorder')}
              addonAfter={hourlaver}
              name='temTime'
              min={1}
              max={30}
              fieldProps={{
                precision: 0
              }}
            />
          </ProForm>
        </ProCard>
        <ProCard title={language('cfgmngt.workconf.elecrtonsignconfig')} >
          <ProForm 
            formRef={workRef}
            submitter={{
              render: (props, doms) => {
                return [<Row>
                  <Col span={12} offset={6} style={{ display: 'flex' }}>
                    <Button type='primary' key='subment'
                      disabled={!writable}
                      style={{ borderRadius: 5, marginRight: 50 }}
                      onClick={() => {
                        props.submit()
                      }}
                      icon={<SaveOutlined />}>
                      {language('project.set')}
                    </Button>
                  </Col>
                </Row>
                ]
              }
            }}
            {...formhorizCard}
            onFinish={async () => {
              saveConfig()
            }}>
            <NameText
              width={'180px'}
              min={1}
              max={30}
              rules={[
                {
                  pattern: regList.nameCh.regex,
                  message: regList.nameCh.alertText,
                }
              ]} 
              label={language('cfgmngt.workconf.signunit')}
              name='unit'
              placeholder={language('cfgmngt.workconf.electronsignunit')}
              required={true}
            />
            <NameText
              width={'180px'}
              min={1}
              max={18}
              rules={[
                {
                  pattern: regList.nameCh.regex,
                  message: regList.nameCh.alertText,
                }
              ]}
              label={language('cfgmngt.workconf.signdepartment')}
              name='department'
              placeholder={language('cfgmngt.workconf.electronsigndepartment')}
              required={true}
            />
          </ProForm>
        </ProCard>
      </ProCard>
    </Spin>
  </>);
};

