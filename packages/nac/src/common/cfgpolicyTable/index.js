import React, { useState, useEffect } from 'react'
import { EditFilled, DeleteFilled, PlusCircleFilled } from '@ant-design/icons'
import { language } from '@/utils/language'
import { EditableProTable, ProFormText } from '@ant-design/pro-components'
import { ReactComponent as AddSvg } from '@/assets/nac/mconfig/addSvg.svg';
import { ReactComponent as ModSvg } from '@/assets/nac/mconfig/modSvg.svg';
import { ReactComponent as DelSvg } from '@/assets/nac/mconfig/delSvg.svg';
import { Tooltip } from 'antd'

export default function CfgpolicyTable(props) {
  const {
    nameKey,
    columns,
    scrollHeight,
    deleteClick,
    setModalType,
    getAntivirusModal,
    mod,
    headerTitle,
    label
  } = props

  /* 顶部右侧功能按钮 */
  const toolButton = (key) => {
    return (
      <>
        <span
          onClick={() => {
            if (key) {
              getAntivirusModal(true, nameKey)
            }
          }}
        >
          <Tooltip title={language('project.add')}>
            <AddSvg style={{ fontSize: '16px', cursor: 'pointer', fill: '#1677ff' }} />
          </Tooltip>
        </span>
        <span
          onClick={() => {
            mod(nameKey, selectedRowKeys, selectedKeysEmpty)
          }}
        >
          <Tooltip title={language('project.edit')}>
            <ModSvg style={{ fontSize: '16px', cursor: 'pointer', fill: '#1677ff' }} />
          </Tooltip>
        </span>
        <span
          onClick={() => {
            deleteClick(nameKey, selectedRowKeys, selectedKeysEmpty)
          }}
        >
          <Tooltip title={language('project.del')}>
            <DelSvg style={{ fontSize: '16px', cursor: 'pointer', fill: '#ff1717' }} />
          </Tooltip>
        </span>
      </>
    )
  }
  const [selectedRowKeys, setSelectedRowKeys] = useState([]) //选中id数组
  //选中触发
  const onSelectedRowKeysChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys)
  }

  //清空选择信息
  const selectedKeysEmpty = () => {
    setSelectedRowKeys([])
  }

  return (
    <>
      <ProFormText label={label ? label : false} name={nameKey}>
        <EditableProTable
          size="small"
          key="antivirustable"
          tableAlertRender={false}
          toolBarRender={() => {
            return toolButton('list')
          }}
          headerTitle={headerTitle ? headerTitle : false}
          className="protablebox"
          columns={columns}
          scroll={{ y: scrollHeight }}
          search={false}
          options={false}
          recordCreatorProps={false}
          rowSelection={{
            columnWidth: 25,
            selectedRowKeys,
            onChange: onSelectedRowKeysChange,
          }}
          rowKey={'id'}
          pagination={false}
        />
      </ProFormText>
    </>
  )
}
