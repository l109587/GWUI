import React, { useEffect, useRef, useState } from "react";
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import "./smsModal.less";
import { language } from "@/utils/language";

const SmsModal = (props) => {
  const { title, status, onChange, onSubmit } = props;
  return (
    <ModalForm
      width="483px"
      layout="horizontal"
      size="middle"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 15 }}
      title={title}
      visible={status}
      onVisibleChange={onChange}
      modalProps={{
        destroyOnClose: true,
        maskClosable: false,
        wrapClassName: "smsModal",
      }}
      onFinish={onSubmit}
    >
      <ProFormText
        label="接口名称"
        name="test"
        rules={[{ required: true, message: language("project.mandatory") }]}
      />
      <ProFormSelect
        label="关联网关"
        name="test1"
        // rules={[{ required: true, message: language("project.mandatory") }]}
      />
      <ProFormText
        label="短信网关地址"
        name="test2"
        placeholder="请填写完整短信网关URL"
        rules={[{ required: true, message: language("project.mandatory") }]}
      />
      <ProFormText
        label="操作标识"
        name="test3"
        rules={[{ required: true, message: language("project.mandatory") }]}
      />
      <ProFormText
        label="操作密码"
        name="test4"
        rules={[{ required: true, message: language("project.mandatory") }]}
      />
    </ModalForm>
  );
};

export default SmsModal;
