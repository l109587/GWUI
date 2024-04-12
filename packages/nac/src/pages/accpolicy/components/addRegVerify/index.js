import React, { useRef, useState, useEffect } from "react";
import { message } from "antd";
import {
  ModalForm,
  DrawerForm,
  ProFormCheckbox,
  ProFormRadio,
} from "@ant-design/pro-components";
import { CloseOutlined } from "@ant-design/icons";
import { NameText } from "@/utils/fromTypeLabel";
import { post } from "@/services/https";
import styles from "./index.less";

const AddRegVerify = (props) => {
  const formInitialValue = {
    reg_type: "1",
    verify_type: "0",
    deal_type: "0",
    auth_reg: false,
  };
  const {
    addVisible,
    setAddModalVisible,
    formType = "drawer",
    formInitialValues = {},
    operate = "add",
    setOperate,
    setIncID,
    mainformRef,
    fetchRegverify,
  } = props;
  const [regType, setRegType] = useState("1"); //注册方式
  const [verifyType, setVerifyType] = useState("0"); //审核方式
  const formRef = useRef();
  useEffect(() => {
    if (addVisible && operate === "mod") {
      formInitialValues.auth_reg = formInitialValues.auth_reg === "1";
      formRef.current.setFieldsValue(formInitialValues);
      setRegType(formInitialValues.reg_type);
      setVerifyType(formInitialValues.verify_type);
    }
    console.log(regType, "regType");
  }, [addVisible]);
  const modalFormLayout = {
    labelCol: {
      span: 7,
    },
    wrapperCol: {
      span: 15,
    },
    layout: "horizontal",
  };
  const verifyWebOptions = [
    {
      label: "不审核",
      value: "0",
    },
    {
      label: "人工审核",
      value: "2",
    },
  ];
  const verifyAgentOptions = [
    {
      label: "不审核",
      value: "0",
    },
    {
      label: "自动审核",
      value: "1",
    },
    {
      label: "人工审核",
      value: "2",
    },
  ];

  const fields = () => {
    return (
      <>
        <NameText
          name="name"
          label="注册审核名称"
          width={270}
          required={true}
          placeholder="请输入名称"
        />
        <ProFormRadio.Group
          width={270}
          name="reg_type"
          label="注册方式"
          options={[
            {
              label: "客户端注册",
              value: "1",
            },
            {
              label: "WEB注册",
              value: "2",
            },
          ]}
          fieldProps={{
            optionType: "button",
            buttonStyle: "solid",
            onChange: (e) => {
              setRegType(e.target.value);
              setVerifyType("0");
              formRef.current.setFieldsValue({ verify_type: "0" });
            },
            className: styles.regRadioGroup,
          }}
        />
        {regType === "1" && (
          <NameText
            name="agent_url"
            label="下载地址"
            placeholder="留空时从网关下载"
            width={270}
          />
        )}

        {regType === "2" && (
          <ProFormCheckbox
            label="认证授权"
            name="auth_reg"
            width={270}
            valuePropName="checked"
            defaultValue={false} // 设置默认值
          >
            开启哑终端Portal认证
          </ProFormCheckbox>
        )}

        <ProFormRadio.Group
          width={270}
          name="verify_type"
          label="审核方式"
          options={regType === "1" ? verifyAgentOptions : verifyWebOptions}
          fieldProps={{
            onChange: (e) => {
              setVerifyType(e.target.value);
            },
          }}
        />
        {(verifyType === "1" || verifyType === "2") && (
          <ProFormRadio.Group
            width={270}
            name="deal_type"
            label="处理方式"
            options={[
              {
                label: "阻断",
                value: "0",
              },
              {
                label: "告警",
                value: "1",
              },
            ]}
            fieldProps={{
              optionType: "button",
              buttonStyle: "solid",
              className: styles.regRadioGroup,
              style: { width: 270 },
            }}
          />
        )}
      </>
    );
  };

  const reset = () => {
    setRegType("1");
    setVerifyType("0");
    formRef.current.resetFields();
    setOperate && setOperate("add");
  };

  //保存添加修改信息
  const saveInfo = (values) => {
    console.log(values, "values");
    let url = "";
    let params = values;
    if (values.hasOwnProperty("auth_reg")) {
      params = { ...values, auth_reg: values.auth_reg ? "1" : "0" };
    }
    if (operate === "add") {
      url = "/cfg.php?controller=reg_verify&action=reg_verify_policy_add";
    } else {
      url = "/cfg.php?controller=reg_verify&action=reg_verify_policy_set";
    }
    post(url, params)
      .then((res) => {
        if (res.success) {
          res.msg && message.success(res.msg);
          setAddModalVisible(false);
          setIncID && setIncID((incID) => incID + 1);
          fetchRegverify && fetchRegverify();
          setTimeout(() => {
            mainformRef.setFieldsValue({ reg_verify_policy: res.name });
          }, 300);
          reset();
        } else {
          res.msg && message.error(res.msg);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };
  const formProps = {
    ...modalFormLayout,
    visible: addVisible,
    onVisibleChange: setAddModalVisible,
    formRef: formRef,
    width: 490,
    title: operate === "add" ? "添加" : "编辑",
    initialValues: formInitialValue,
    onFinish: saveInfo,
  };

  return formType === "modal" ? (
    <ModalForm
      {...formProps}
      modalProps={{
        destroyOnClose: true,
        onCancel: reset,
      }}
    >
      {fields()}
    </ModalForm>
  ) : (
    <DrawerForm
      {...formProps}
      drawerProps={{
        destroyOnClose: true,
        placement: "right",
        closable: false,
        getContainer: false,
        onClose: reset,
        style: {
          position: "absolute",
        },
        extra: (
          <div>
            <span
              onClick={() => {
                setAddModalVisible(false);
                reset();
              }}
              style={{ cursor: "pointer" }}
            >
              <CloseOutlined />
            </span>
          </div>
        ),
      }}
    >
      {fields()}
    </DrawerForm>
  );
};
export default AddRegVerify;
