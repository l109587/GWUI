import React, { useRef, useState, useEffect } from "react";
import {
  Modal,
  Tabs,
  Row,
  Col,
  Button,
  Popconfirm,
  Tooltip,
  Affix,
  Space,
} from "antd";
import {
  ProForm,
  ProFormRadio,
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
  const [jxeditableKeys, setJxEditableRowKeys] = useState(); //每行编辑的id
  const jsRenderRemove = (text, record) => (
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

  const jxFromColumns = [
    {
      title: "镜像网口",
      dataIndex: "jnet",
      width: "80px",
      align: "left",
    },
    {
      title: "干扰网口",
      dataIndex: "net",
      width: "80px",
      align: "left",
    },
    {
      title: "状态",
      dataIndex: "status",
      width: "60px",
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

            {jsRenderRemove(
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

  const [fweditableKeys, setFwEditableRowKeys] = useState(); //每行编辑的id
  const fwRenderRemove = (text, record) => (
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

  const fwFromcolumns = [
    {
      title: "IP/IP段/IP掩码/IPv6段/IPv6范围",
      dataIndex: "ip",
      align: "left",
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

            {fwRenderRemove(
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
              name="status"
              width={"300px"}
              checkedChildren={language("project.open")}
              unCheckedChildren={language("project.close")}
              addonAfter={<div style={{ marginTop: "1px" }}>开启旁路监听</div>}
            />
          </div>

          <div style={{ marginTop: "14px" }}>镜像层</div>
          <ProFormRadio.Group
            name="layer"
            options={[
              {
                label: "二层镜像",
                value: "Y",
              },
              {
                label: "三层镜像",
                value: "1",
              },
            ]}
          />
          <div style={{ marginTop: "20px", marginBottom: "10px" }}>镜像层</div>
          <div style={{ width: "513px" }}>
            <EditTable
              label={false}
              position={"top"}
              name={"addrlistinfo"}
              fromcolumns={jxFromColumns}
              required={false}
              editableKeys={jxeditableKeys}
              setEditableRowKeys={setJxEditableRowKeys}
            />
          </div>
          <div style={{ marginTop: "20px", marginBottom: "10px" }}>
            镜像范围
          </div>
          <div style={{ width: "513px" }}>
            <EditTable
              label={false}
              position={"top"}
              name={"fwlistinfo"}
              fromcolumns={fwFromcolumns}
              required={false}
              editableKeys={fweditableKeys}
              setEditableRowKeys={setFwEditableRowKeys}
            />
          </div>
        </div>
      </ProForm>
    </div>
  );
};
