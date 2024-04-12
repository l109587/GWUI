import React, { useRef, useState, useEffect } from "react";
import { Row, Col, Button, Popconfirm, Affix, Space, Tooltip } from "antd";
import { ProForm, ProFormSwitch, ProCard } from "@ant-design/pro-components";
import { language } from "@/utils/language";
import { post, postAsync } from "@/services/https";
import { SaveOutlined } from "@ant-design/icons";
import "@/utils/index.less";
import "@/common/common.less";
import "./../index.less";
import DelIcon from "@/assets/nac/del.svg";
import EditIcon from "@/assets/nac/saEdit.svg";
import { regList, regUrlList } from "@/utils/regExp";
import { EditTable, NameText, NotesText } from "@/utils/fromTypeLabel";
let H = document.body.clientHeight - 118;
var clientHeight = H;
export default () => {
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
      title: "IP",
      dataIndex: "ip",
      align: "left",
    },
    {
      title: language("project.operate"),
      valueType: "option",
      width: "25%",
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

  const [editableKeys1, setEditableRowKeys1] = useState(); //每行编辑的id
  const renderRemove1 = (text, record) => (
    <Popconfirm
      onConfirm={() => {
        setConfirmLoading(false);
        const tableDataSource = formRef.current.getFieldsValue([
          "addrlistinfo1",
        ]);
        formRef.current.setFieldsValue({
          addrlistinfo1: tableDataSource["addrlistinfo1"].filter(
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

  const fromcolumns1 = [
    {
      title: "IP/IP段/掩码",
      dataIndex: "ipaddr",
      align: "left",
    },
    {
      title: language("project.operate"),
      valueType: "option",
      width: "25%",
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

            {renderRemove1(
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
  const [contentList, setContentList] = useState([]);
  const [formType, setFormType] = useState("input");

  //编辑
  const mod = (obj, op) => {
    let data = { ...obj };
    let initialValues = data;
    let content = data.content ? data.content.split(";") : [];
    setFormType(obj.form);
    setContentList(content);
    getModal(1, op);
    setTimeout(function () {
      formRef.current.setFieldsValue(initialValues);
    }, 100);
  };

  return (
    <div>
      <ProCard ghost title={"注册漫游配置"}>
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
                          marginTop: 15,
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
            // radiusSave(values);
          }}
        >
          <div
            style={{
              maxHeight: clientHeight - 100,
              overflow: "auto",
            }}
          >
            <div style={{ width: "441px" }}>
              <div className="rswitchfbox">
                <ProFormSwitch
                  checkedChildren={language("project.open")}
                  unCheckedChildren={language("project.close")}
                  name="status"
                  addonAfter={
                    <div style={{ marginTop: "1px" }}>开启网关组配置</div>
                  }
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
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
              <div className="rswitchfbox">
                <ProFormSwitch
                  checkedChildren={language("project.open")}
                  unCheckedChildren={language("project.close")}
                  name="status"
                  addonAfter={
                    <div style={{ marginTop: "1px" }}>开启注册IP范围</div>
                  }
                />
              </div>
              <EditTable
                label={false}
                name={"addrlistinfo1"}
                fromcolumns={fromcolumns1}
                position={"top"}
                required={false}
                editableKeys={editableKeys1}
                setEditableRowKeys={setEditableRowKeys1}
              />
            </div>
          </div>
        </ProForm>
      </ProCard>
    </div>
  );
};
