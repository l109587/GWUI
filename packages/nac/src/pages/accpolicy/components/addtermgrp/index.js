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
  ProFormCheckbox,
  ProFormTextArea
} from '@ant-design/pro-components'
import { ExclamationCircleOutlined, CheckCircleFilled } from '@ant-design/icons'
import { useSelector } from 'umi'
import { language } from '@/utils/language'
import { fetchAuth } from '@/utils/common'
import { modalFormLayout } from '@/utils/helper'
import { NameText, NotesText } from '@/utils/fromTypeLabel'
import { regIpList } from '@/utils/regExp'
import { post } from '@/services/https'

const AddGroup = (props)=>{
  const {addVisible,setAddModalVisible} = props
  const formRef = useRef()
  return (
    <ModalForm
        destroyOnClose
        {...modalFormLayout}
        visible={addVisible}
        width="780px"
        title='添加终端分组'
        onVisibleChange={setAddModalVisible}
        modalProps={{
          destroyOnClose: true,
          // wrapClassName: styles.fieldsModal
        }}
        // onFinish={(values) => {
        //   saveConfig(values)
        // }}
        formRef={formRef}
        // initialValues={{
        //   status: false,
        //   email: false,
        //   phone: false,
        //   wpage: false,
        // }}
      >
        <NameText name="name" label="策略名称" width={220} required={true} />
        <ProFormSelect
          name="class"
          label="上级分组"
          width="220px"
          options={ 
            [
              {
                label:"分组一",
                value:"分组一"
              },
              {
                label:"分组二",
                value:"分组二"
              }
            ]
          }
        />
        <ProFormCheckbox
          label="终端分类规则"
          width="400px"
          name="state"
        >
          当开启分类规则后，终端会根据配置规则自动加入到相应的分组
        </ProFormCheckbox>
        <ProFormTextArea name='ipgrouprule' label='IP地址分类规则'/>
        <ProFormTextArea name='ipgrouprule' label='MAC地址分类规则'/>
      </ModalForm>
  )
}
export default AddGroup