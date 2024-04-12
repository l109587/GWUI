import React, { useRef, useState, useEffect } from "react";
import {
  Row,
  Col,
  Button,
  Affix,
} from "antd";
import {
  DrawerForm,
  ProForm,
  ProFormSwitch,
} from "@ant-design/pro-components";
import { language } from "@/utils/language";
import { post, postAsync } from "@/services/https";
import {
  SaveOutlined,
  LoadingOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import "@/utils/index.less";
import "@/common/common.less";
import "./../index.less";
import { regList, regUrlList } from "@/utils/regExp";
import { TableLayout, AmTag } from "@/components";
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
      dataIndex: "address",
      align: "left",
      width: '120px'
    },
    {
      title: "干扰网口",
      dataIndex: "address",
      align: "left",
      width: '120px'
    },
    {
      title: "状态",
      dataIndex: "address",
      align: "left",
      width: '80px'
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
              addonAfter={<div style={{ marginTop: "1px" }}>开启透明网桥</div>}
            />
          </div>
        </div>
      </ProForm>
    </div>
  );
};
