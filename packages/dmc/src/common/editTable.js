import React from 'react';
import ProForm, { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { language } from '@/utils/language';
import { Popconfirm } from 'antd';
import { DeleteOutlined, SaveFilled, CloseCircleOutlined, EditOutlined } from '@ant-design/icons'

import { EditableProTable } from '@ant-design/pro-components'
const renderRemove = (text, record, formRef, name) => (
  <Popconfirm onConfirm={() => {
    const tableDataSource = formRef.current.getFieldsValue([name]);
    let a = {};
    a[name] = tableDataSource[name].filter((item) => item.id != record.id)
    formRef.current.setFieldsValue(a)
  }} key="popconfirm"
    title={language('project.delconfirm')}
    okButtonProps={{
      loading: false,
    }} okText={language('project.yes')} cancelText={language('project.no')}>
    <a>{text}</a>
  </Popconfirm>
);

export const EditTable = (data = {}) => {
  const { fromcolumns, formRef, maxLength } = data;
  let option = {
    title: language('project.operate'),
    valueType: 'option',
    fixed: 'right',
    width: '80px',
    align: 'center',
    render: (text, record, _, action) => [
      <>
        <a key="editable" onClick={() => {
          var _a;
          (_a = action === null || action === void 0 ? void 0 : action.startEditable) === null || _a === void 0 ? void 0 : _a.call(action, record.id);
        }}>
          <EditOutlined />
        </a>
        {renderRemove(<DeleteOutlined style={{ color: 'red' }} />, record, formRef, data.name || data.name === false ? data.name : 'addrlistinfo')}
      </>
    ]
  }
  fromcolumns.push(option);
  return (
    <>
      <ProForm.Item
        name={data.name || data.name === false ? data.name : 'addrlistinfo'}
        disabled={data.disabled ? true : false}
        width={data.width ? data.width : ''}
        label={data.label || data.label === false ? data.label : language('ecpmngt.name')}
        style={data.style ? data.style : false}
        placeholder={data.placeholder ? data.placeholder : false}
        tooltip={data.tooltip ? data.tooltip : false}
        trigger="onValuesChange"
        rules={[{ required: data.required ? true : false }]}>
        <EditableProTable
          scroll={{ y: data.height ? data.height : 170 }}
          rowKey="id"
          className='tablelistbottom'
          toolBarRender={false}
          columns={fromcolumns}
          maxLength={maxLength}
          recordCreatorProps={{
            position: 'top',
            record: () => ({
              id: Date.now(),
            }),
          }} editable={{
            type: 'multiple',
            actionRender: (row, config, defaultDom) => {
              return [
                defaultDom.save,
                defaultDom.cancel,
              ];
            },
            saveText: (<SaveFilled />),
            deleteText: (<DeleteOutlined style={{ color: 'red' }} />),
            cancelText: (<CloseCircleOutlined style={{ color: 'grey' }} />),
          }} />
      </ProForm.Item>
    </>
  )
}
