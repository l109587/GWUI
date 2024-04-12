import React, { useRef, useState, useEffect } from "react";
import {
  Input,
  Space,
  Switch,
  Button,
  message,
  Popconfirm,
  Modal,
  Tag,
} from "antd";
import {
  ModalForm,
  DrawerForm,
  ProFormText,
  ProFormSwitch,
  ProFormSelect,
  ProFormCheckbox,
  ProFormTextArea,
  ProFormTimePicker,
} from "@ant-design/pro-components";
import { ExclamationCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { useSelector } from "umi";
import { language } from "@/utils/language";
import { fetchAuth } from "@/utils/common";
import { modalFormLayout } from "@/utils/helper";
import { NameText, NotesText } from "@/utils/fromTypeLabel";
import { regIpList } from "@/utils/regExp";
import { post } from "@/services/https";

const AddAccessTime = (props) => {
  const {
    addVisible,
    setAddModalVisible,
    formType = "drawer",
    operate = "add",
    setOperate,
    setIncID,
    fetchTimecombox,
    recordInfo = {},
    mainformRef
  } = props;
  const formRef = useRef();
  useEffect(() => {
    if (addVisible && operate === "mod") {
      console.log(recordInfo, "recordInfo");
      const week = recordInfo.week.split(";");
      const timeRange = [recordInfo.start, recordInfo.end];
      formRef.current.setFieldsValue({ ...recordInfo, week, timeRange });
    }
  }, [addVisible]);
  const fields = () => {
    return (
      <>
        <NameText
          name="name"
          label="名称"
          width={280}
          required={true}
          placeholder="请输入名称"
        />
        <ProFormSelect
          name="week"
          label="重复"
          width="280px"
          fieldProps={{
            mode: "multiple",
            showArrow: true,
          }}
          rules={[
            {
              required: true,
              message: language("project.mandatory"),
            },
          ]}
          options={[
            {
              label: "周一",
              value: "monday",
            },
            {
              label: "周二",
              value: "tuesday",
            },
            {
              label: "周三",
              value: "wednesday",
            },
            {
              label: "周四",
              value: "thursday",
            },
            {
              label: "周五",
              value: "friday",
            },
            {
              label: "周六",
              value: "saturday",
            },
            {
              label: "周日",
              value: "sunday",
            },
          ]}
        />
        <ProFormTimePicker.RangePicker
          width={280}
          name="timeRange"
          label="时间区域"
        />
      </>
    );
  };
  const reset = () => {
    formRef.current.resetFields();
    setOperate && setOperate("add");
  };
  //添加编辑信息
  const saveInfo = (values) => {
    let url = "";
    if (operate === "add") {
      url = "/cfg.php?controller=timeObject&action=add_timeObject";
    } else {
      url = "/cfg.php?controller=timeObject&action=modify_timeObject";
    }
    const params = {
      name: values.name,
      week: values.week.join(";"),
      start: values.timeRange[0],
      end: values.timeRange[1],
    };
    post(url, params)
      .then((res) => {
        if (res.success) {
          res.msg && message.success(res.msg);
          setAddModalVisible(false);
          setIncID && setIncID((incID) => incID + 1);
          fetchTimecombox&&fetchTimecombox()
          setTimeout(()=>{
            mainformRef.setFieldsValue({access_time_idValue:res.name})
          },300)
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
    width: 480,
    title: operate === "add" ? "添加" : "编辑",
    initialValues: { timeRange: ["00:00:00", "23:59:59"] },
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
export default AddAccessTime;
