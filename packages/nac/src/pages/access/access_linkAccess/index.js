import React, { useRef, useState, useEffect } from "react";
import {
  Input,
  message,
  Modal,
  Tabs,
  Row,
  Col,
  Button,
  Space,
  Divider,
  Alert,
  Switch,
  Tooltip,
  Affix,
} from "antd";
import {
  DrawerForm,
  ProForm,
  ProFormText,
  ProFormRadio,
  ProFormSelect,
  ProFormTextArea,
  ProFormCheckbox,
  ProFormSwitch,
  ProCard,
  ProFormDigit,
  ProDescriptions,
} from "@ant-design/pro-components";
import { language } from "@/utils/language";
import { drawFromLayout } from "@/utils/helper";
import { post, postAsync } from "@/services/https";
import {
  SaveOutlined,
  LoadingOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  CloseCircleFilled,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import "@/utils/index.less";
import "@/common/common.less";
import "./index.less";
import SaveSvg from "@/assets/nac/save.svg";
import { ReactComponent as WDel } from "@/assets/nac/security/wdel.svg";
import { regList, regUrlList } from "@/utils/regExp";
import { TableLayout, AmTag } from "@/components";
import { EditTable, NameText, NotesText } from "@/utils/fromTypeLabel";
import { Bypass, Policy, Bridge, Acl } from "./components";
const { ProtableModule, WebUploadr } = TableLayout;
const { confirm } = Modal;
const { TabPane } = Tabs;
let H = document.body.clientHeight - 118;
var clientHeight = H;
export default () => {
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
      dataIndex: "address",
      width: "80px",
      align: "left",
    },
    {
      title: "干扰网口",
      dataIndex: "address",
      width: "80px",
      align: "left",
    },
    {
      title: "状态",
      dataIndex: "address",
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
          <a
            key="editable"
            onClick={() => {
              var _a;
              (_a =
                action === null || action === void 0
                  ? void 0
                  : action.startEditable) === null || _a === void 0
                ? void 0
                : _a.call(action, record.id);
            }}
          >
            <EditOutlined />
          </a>
          {jsRenderRemove(<DeleteOutlined style={{ color: "red" }} />, record)}
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
      dataIndex: "address",
      align: "left",
    },
    {
      title: language("project.operate"),
      valueType: "option",
      width: "80px",
      align: "center",
      render: (text, record, _, action) => [
        <>
          <a
            key="editable"
            onClick={() => {
              var _a;
              (_a =
                action === null || action === void 0
                  ? void 0
                  : action.startEditable) === null || _a === void 0
                ? void 0
                : _a.call(action, record.id);
            }}
          >
            <EditOutlined />
          </a>
          {fwRenderRemove(<DeleteOutlined style={{ color: "red" }} />, record)}
        </>,
      ],
    },
  ];

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
      dataIndex: "address",
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
          <a
            key="editable"
            onClick={() => {
              var _a;
              (_a =
                action === null || action === void 0
                  ? void 0
                  : action.startEditable) === null || _a === void 0
                ? void 0
                : _a.call(action, record.id);
            }}
          >
            <EditOutlined />
          </a>
          {renderRemove(<DeleteOutlined style={{ color: "red" }} />, record)}
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
    <div
      className="aaccesslinkaddess"
      style={{ paddingTop: "15px", backgroundColor: "#FFFFFF" }}
    >
      <Tabs
        type="line"
        tabPosition="left"
        style={{ height: clientHeight }}
        activeKey={activeKey}
        destroyInactiveTabPane={true}
        onChange={(key) => {
          setActiveKey(key);
        }}
      >
        <TabPane tab={"旁路监听"} key="bh">
          <ProCard ghost title={"旁路监听"}>
            <Bypass clientHeight={clientHeight} />
          </ProCard>
        </TabPane>
        <TabPane tab={"策略路由"} key="zd">
          <ProCard ghost title={"策略路由"}>
            <Policy clientHeight={clientHeight} />
          </ProCard>
        </TabPane>
        <TabPane tab={"透明网桥"} key="access">
          <ProCard ghost title={"透明网桥"}>
            <Bridge clientHeight={clientHeight} />
          </ProCard>
        </TabPane>Acl
        <TabPane tab={"ACL控制"} key="my">
        <ProCard ghost title={"ACL控制"}>
            <Acl clientHeight={clientHeight} />
          </ProCard>
        </TabPane>
      </Tabs>
    </div>
  );
};
