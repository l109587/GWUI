import React, { useRef, useState, useEffect } from "react";
import {
  ProCard,
  ProForm,
  ProFormItem,
  ProFormSwitch,
  ProFormText,
} from "@ant-design/pro-components";
import { Spin, Button, Popconfirm, Tooltip, message, Space } from "antd";
import { language } from "@/utils/language";
import {
  ExclamationCircleFilled,
  QuestionCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import CopyIcon from "@/assets/nac/copy.png";
import DelIcon from "@/assets/nac/del.svg";
import EditIcon from "@/assets/nac/saEdit.svg";
import EditTable from "@/components/Module/tinyEditTable/tinyEditTable";
import { post } from "@/services/https";
import "./scancoauth.less";
let H = document.body.clientHeight - 153;
let clientHeight = H;

export default () => {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [domainList, setDomainList] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const columns = [
    {
      title: "字段配置",
      dataIndex: "field",
      align: "left",
      ellipsis: true,
      key: "field",
      width: 96,
    },
    {
      title: "字段描述",
      dataIndex: "text",
      align: "left",
      ellipsis: true,
      key: "text",
      width: 160,
    },
    {
      title: "权限配置",
      dataIndex: "config",
      align: "center",
      ellipsis: true,
      key: "config",
      width: 100,
      valueType: "select",
      request: async () => domainList,
    },
    {
      title: "操作",
      valueType: "option",
      ellipsis: true,
      key: "text",
      align: "center",
      width: 80,
      render: (text, record, _, action) => {
        return (
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
            <Popconfirm
              okText={language("project.yes")}
              cancelText={language("project.no")}
              title={language("project.delconfirm")}
              onConfirm={() => {
                setDataSource(
                  dataSource.filter((item) => item.id !== record.id)
                );
              }}
            >
              <Tooltip placement="top" title={language("project.del")}>
                <a>
                  <img src={DelIcon} alt="" />
                </a>
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    getDomainList();
    getConfig();
  }, []);

  const getDomainList = () => {
    post("/cfg.php?controller=securityDomain&action=show_securitydomain").then(
      (res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        let list = [];
        res.data.map((item) => {
          list.push({ value: item.value, label: item.text });
        });
        setDomainList(list);
      }
    );
  };

  const getConfig = () => {
    setLoading(true);
    post("/cfg.php?controller=authScanCode&action=show").then((res) => {
      if (!res.success) {
        message.error(res.msg);
        setLoading(false);
        return false;
      }
      let str = res.data?.qrcode?.plant;
      let values = Object.assign(res.data.qrcode, res.data.dtcode);
      values.plant = str.split(":")[0];
      values.port = str.split(":")[1];
      for (const key in values) {
        if (values[key] === "Y") {
          values[key] = true;
        } else if (values[key] === "N") {
          values[key] = false;
        }
      }
      setUrl(res.data.qrcode.url);
      let arr = res.data.dtcode.authInfo.split(";");
      let list = [];
      arr.map((item, num) => {
        let itemList = item.split(",");
        let obj = {};
        itemList.map((each, index) => {
          if (index == 0) {
            obj.field = each;
          } else if (index == 1) {
            obj.text = each;
          } else {
            obj.config = each;
            obj.id = num;
          }
        });
        list.push(obj);
      });
      setDataSource(list);
      formRef.current?.setFieldsValue(values);
      setLoading(false);
    });
  };

  const setConfig = (values) => {
    let list = [];
    dataSource.map((each) => {
      list.push({ field: each.field, text: each.text, config: each.config });
    });
    let str = list.map((item) => Object.values(item).join(",")).join(";");
    let qrcode = {};
    let dtcode = {};
    qrcode = {
      sw: values.sw === true ? "Y" : "N",
      plant: values.port ? values.plant + ":" + values.port : values.plant,
      plantID: values.plantID,
      plantSecret: values.plantSecret,
      periodVal: sysSID.sysSID,
      url: url,
    };
    dtcode = {
      dtStatus: values.dtStatus === true ? "Y" : "N",
      corpld: values.corpld,
      appKey: values.appKey,
      appSecret: values.appSecret,
      authInfo: str,
    };
    post("/cfg.php?controller=authScanCode&action=set", {
      qrcode: JSON.stringify(qrcode),
      dtcode: JSON.stringify(dtcode),
    }).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      getAuthConfig();
    });
  };

  return (
    <ProCard
      title="扫码认证"
      className="scancoCard"
      bodyStyle={{
        paddingLeft: 60,
        paddingTop: 0,
        height: clientHeight,
      }}
    >
      <Spin spinning={loading} size="large">
        <ProForm
          formRef={formRef}
          initialValues={{ test: 0 }}
          layout="horizontal"
          className="scancoForm"
          labelCol={{ flex: "140px" }}
          submitter={{
            render: (props, doms) => {
              return (
                <Button
                  type="primary"
                  key="submit"
                  style={{
                    paddingLeft: 0,
                    paddingRight: 0,
                    borderRadius: 5,
                    width: "100px",
                    height: "32px",
                    lineHeight: 1.5,
                    marginTop: 15,
                  }}
                  onClick={() => {
                    formRef.current.submit();
                  }}
                >
                  <SaveOutlined />
                  {language("project.savesettings")}
                </Button>
              );
            },
          }}
          onFinish={(values) => {
            setConfig(values);
          }}
        >
          <div
            className="scrollDiv"
            style={{ maxHeight: clientHeight - 80, overflowY: "auto" }}
          >
            <div className="secodaryTitle">企业微信认证</div>
            <ProFormSwitch
              addonAfter="开启企业微信扫描二维码认证"
              name="sw"
              checkedChildren={language("project.open")}
              unCheckedChildren={language("project.close")}
            />
            <ProFormText
              label="认证平台地址"
              width="221px"
              name="plant"
              placeholder="请输入地址"
              addonAfter={
                <div className="afterAntdFields">
                  <ProFormText width="74px" placeholder="端口" name="port" />
                </div>
              }
            />
            <ProFormText
              label="平台分配ID"
              name="plantID"
              placeholder="请输入国家平台分配ID"
              width="300px"
            />
            <ProFormText
              label="平台分配密钥"
              name="plantSecret"
              placeholder="请输入国家平台分配IP"
              width="300px"
            />
            <ProFormText
              label="准入平台编码"
              placeholder="请输入网关在认证平台的系统编码"
              name="sysSID"
              width="300px"
            />
            <ProFormText
              label="准入回调接口"
              name="url"
              addonAfter={
                <Tooltip title="网关提供给认证平台的回调接口">
                  <QuestionCircleOutlined />
                </Tooltip>
              }
            >
              <div className="viewTag">
                <div>
                  <ExclamationCircleFilled
                    style={{ color: "#1990ff", fontSize: "5px" }}
                  />
                  <span style={{ marginLeft: 5 }}>{url}</span>
                </div>
                <img
                  src={CopyIcon}
                  style={{ cursor: "pointer" }}
                  onClick={async () => {
                    await navigator.clipboard.writeText(url);
                    message.success(
                      language("project.temporary.terminal.requestNum")
                    );
                  }}
                />
              </div>
            </ProFormText>
            <div className="secodaryTitle">钉钉扫码认证</div>
            <ProFormSwitch
              addonAfter="开启钉钉扫描二维码认证"
              name="dtStatus"
              checkedChildren={language("project.open")}
              unCheckedChildren={language("project.close")}
            />
            <ProFormText
              label="平台分配Corpld"
              name="corpld"
              placeholder="请输入钉钉平台组织机构码"
              width="300px"
            />
            <ProFormText
              label="平台分配AppKey"
              name="appKey"
              placeholder="请输入钉钉平台自建应用AppKey"
              width="300px"
            />
            <ProFormText
              label="平台分配AppSecret"
              name="appSecret"
              placeholder="请输入钉钉平台自建应用AppSecret"
              width="300px"
            />
            <div style={{ marginTop: -6 }}>
              <ProFormItem label="认证授权映射表" width="300px">
                <div className="mappDiv">添加钉钉认证后自动映射权限配置</div>
              </ProFormItem>
            </div>
            <div className="marginLeftDiv" name="authInfo">
              <EditTable
                columns={columns}
                tableHeight={350}
                tableWidth={540}
                deleteButShow={false}
                dataSource={dataSource}
                addButPosition="top"
                setDataSource={setDataSource}
              />
            </div>
          </div>
        </ProForm>
      </Spin>
    </ProCard>
  );
};
