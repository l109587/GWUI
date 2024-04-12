import React, { useRef, useState, useEffect } from "react";
import { Row, Col, Button, Space, Tooltip, Affix } from "antd";
import {
  ProForm,
  ProFormCheckbox,
  ProFormSwitch,
} from "@ant-design/pro-components";
import { language } from "@/utils/language";
import { post, postAsync } from "@/services/https";
import { SaveOutlined } from "@ant-design/icons";
import "@/utils/index.less";
import "@/common/common.less";
import "./../index.less";
import DelIcon from "@/assets/nac/del.svg";
import EditIcon from "@/assets/nac/saEdit.svg";
import { regList, regUrlList } from "@/utils/regExp";
import { EditTable } from "@/utils/fromTypeLabel";
export default (props) => {
  const { clientHeight } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [editableKeys, setEditableRowKeys] = useState(); //每行编辑的id
  const renderRemove = (text, record) => (
    <Popconfirm
      onConfirm={() => {
        setConfirmLoading(false);
        const tableDataSource = formRef.current.getFieldsValue([
          "addrlistinfo",
        ]);
        formRef.current.setFieldsValue({
          addrlistinfo: tableDataSource["addrlistinfo"].filter(
            (item) => item.id != record.id
          ),
        });
      }}
      key="popconfirm"
      title={language("project.delconfirm")}
      okButtonProps={{
        loading: confirmLoading,
      }}
      okText={language("project.yes")}
      cancelText={language("project.no")}
    >
      <a>{text}</a>
    </Popconfirm>
  );

  const fromcolumns = [
    {
      title: "路由网口",
      dataIndex: "lnet",
      align: "left",
      width: "120px",
    },
    {
      title: "干扰网口",
      dataIndex: "gnet",
      align: "left",
      width: "120px",
    },
    {
      title: "状态",
      dataIndex: "status",
      align: "left",
      width: "80px",
    },
    {
      title: language("project.operate"),
      valueType: "option",
      width: "80px",
      align: "center",
      render: (text, record, _, action) => [
        <>
          <Space>
            <Tooltip placement="top" title={language("project.edit")}>
              <a
                onClick={() => {
                  action.startEditable?.(record.id);
                }}
              >
                <img src={EditIcon} alt="" />
              </a>
            </Tooltip>

            {renderRemove(
              <Tooltip placement="top" title={language("project.del")}>
                <a>
                  <img src={DelIcon} alt="" />
                </a>
              </Tooltip>,
              record
            )}
          </Space>
        </>,
      ],
    },
  ];

  const formRef = useRef();
  const [activeKey, setActiveKey] = useState("bh");
  const [contentList, setContentList] = useState([]);
  const [isHovering, setIsHovering] = useState("");

  //编辑
  const mod = (obj, op) => {
    let addrlist = obj.swips ? obj.swips.split(";") : [];
    let rowKey = [];
    let defaultDataInfo = [];
    addrlist.map((item, index) => {
      defaultDataInfo.push({ id: index + 1, swips: item });
      rowKey.push(index + 1);
    });

    let agreement = [];
    if (obj.pap == "Y") {
      agreement.push("pap");
    }
    if (obj.chap == "Y") {
      agreement.push("chap");
    }
    if (obj.md5 == "Y") {
      agreement.push("md5");
    }
    obj.agreement = agreement;
    obj.addrlistinfo = defaultDataInfo;
    let initialValues = obj;
    getModal(1, op);
    setTimeout(function () {
      formRef.current.setFieldsValue(initialValues);
    }, 100);
  };

  const addContent = () => {
    const val = formRef.current.getFieldsValue(["contentVal"]);
    var list = [...contentList];
    list.push(val.contentVal);
    console.log(list);
    setContentList(list);
    formRef.current.setFieldsValue({ contentVal: "" });
  };

  const delContent = (key) => {
    console.log(key);
    const list = [...contentList];
    setContentList(list.filter((item, index) => index != key));
  };

  return (
    <div>
      <ProForm
        layout="horizontal"
        submitTimeout={2000}
        className="profrombox"
        submitter={{
          render: (props, doms) => {
            return [
              <Affix offsetBottom={40}>
                <Row>
                  <Col span={14}>
                    <Button
                      type="primary"
                      style={{
                        borderRadius: 5,
                        marginTop: 14,
                      }}
                      onClick={() => {
                        props.submit();
                      }}
                    >
                      <SaveOutlined />
                      {language("project.savesettings")}
                    </Button>
                  </Col>
                </Row>
              </Affix>,
            ];
          },
        }}
        onFinish={(values) => {
          radiusSave(values);
        }}
      >
        <div
          style={{
            maxHeight: clientHeight - 115,
            overflow: "auto",
          }}
        >
          <div className="alinkaccessbox">
            <ProFormSwitch
              name="state"
              width={"300px"}
              checkedChildren={language("project.open")}
              unCheckedChildren={language("project.close")}
              addonAfter={<div style={{ marginTop: "1px" }}>开启策略路由</div>}
            />
          </div>

          <div style={{ marginTop: "14px" }}>自检状态</div>
          <ProFormCheckbox.Group
            name="selfcheck_state"
            options={[
              {
                label: "定时探测路由网口状态",
                value: "Y",
              },
            ]}
          />
          <div style={{ marginTop: "20px" }}>异常处理</div>
          <ProFormCheckbox.Group
            name="abnormal_handle"
            options={[
              {
                label: "当路由转发异常时，直接关闭路由网口",
                value: "Y",
              },
            ]}
          />
          <div style={{ marginTop: "20px", marginBottom: "10px" }}>
            路由网口（网口抓包）
          </div>
          <div style={{ width: "513px" }}>
            <EditTable
              label={false}
              position={"top"}
              name={"addrlistinfo"}
              fromcolumns={fromcolumns}
              required={false}
              editableKeys={editableKeys}
              setEditableRowKeys={setEditableRowKeys}
            />
          </div>
        </div>
      </ProForm>
    </div>
  );
};
