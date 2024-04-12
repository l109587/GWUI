import React, { useEffect, useRef, useState } from "react";
import {
  ProCard,
  ProForm,
  ProFormItem,
  ProFormRadio,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from "@ant-design/pro-components";
import { Button, Space, message, Spin } from "antd";
import { language } from "@/utils/language";
import { ExclamationCircleFilled, SaveOutlined } from "@ant-design/icons";
import { post } from "@/services/https";
import "./advanced.less";
let H = document.body.clientHeight - 150;
let clientHeight = H;
const Advanced = (props) => {
  const { reloadKey, activeKey } = props;
  const formRef = useRef();
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    if (activeKey == 2) {
      getConfig();
    }
  }, [reloadKey]);

  const getConfig = () => {
    setLoading(true);
    post("/cfg.php?controller=portal&action=url").then((res) => {
      if (!res.success) {
        setLoading(false);
        message.error(res.msg);
        return false;
      }
      setUrl(res.data.url);
    });
    post("/cfg.php?controller=auth&action=getPortalConfig").then((res) => {
      if (!res.success) {
        setLoading(false);
        message.error(res.msg);
        return false;
      }
      setType(res?.data?.thirdReport?.faceType)
      let values = Object.assign(res.data.thirdReport, res.data.switchAuth);
      for (const key in values) {
        if (values[key] === "Y") {
          values[key] = true;
        } else if (values[key] === "N") {
          values[key] = false;
        }
      }
      setLoading(false);
      formRef.current.setFieldsValue(values);
    });
  };

  const onSubmit = (values) => {
    let thirdReport = {};
    let switchAuth = {};
    thirdReport = {
      id: values.id,
      status: values.status === true ? "Y" : "N",
      faceType: values.faceType,
      agreeType: values.agreeType,
      srip: values.srip,
      srport: values.srport,
      shareKey: values.shareKey,
      unicode: values.unicode,
    };
    switchAuth = { port: values.port };
    post("/cfg.php?controller=auth&action=setPortalConfig", {
      thirdReport: JSON.stringify(thirdReport),
      switchAuth: JSON.stringify(switchAuth),
    }).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      getConfig();
    });
  };

  const contentTest = () => {
    let values = formRef.current.getFieldsValue([
      "status",
      "faceType",
      "agreeType",
      "srip",
      "srport",
      "shareKey",
      "unicode",
    ]);
    post("/cfg.php?controller=auth&action=connectTest", {
      kind: "thirdReport",
      info: JSON.stringify(values),
    }).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      getConfig()
    });
  };

  return (
    <Spin spinning={loading} size="large">
      <ProCard
        title="高级配置"
        className="advanceCard"
        bodyStyle={{
          paddingTop: 0,
          paddingBottom: 0,
          height: clientHeight - 35,
        }}
      >
        <ProForm
          formRef={formRef}
          layout="horizontal"
          submitter={{
            render: (props, doms) => {
              return (
                <Button
                  type="primary"
                  key="subment"
                  style={{
                    paddingLeft: 0,
                    paddingRight: 0,
                    borderRadius: 5,
                    width: "100px",
                    height: "32px",
                    lineHeight: 1.5,
                    marginTop: 20,
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
          labelCol={{ flex: "116px" }}
          onFinish={(values) => {
            onSubmit(values);
          }}
        >
          <div
            className="pwdContent"
            style={{ maxHeight: clientHeight - 90, overflowY: "auto" }}
          >
            <div className="secodaryTitle">交换机Portal认证配置</div>
            <ProFormText label="连接端口" name="port" width="286px" />
            <ProFormItem label="认证页面" name="">
              <div className="viewTag">
                <ExclamationCircleFilled
                  style={{ color: "#1990ff", fontSize: "5px" }}
                />
                <span style={{ marginLeft: 5 }}>{url}</span>
              </div>
            </ProFormItem>
            <div className="secodaryTitle">第三方上报</div>
            <ProFormSwitch
              name="status"
              addonAfter="开启将用户认证结果通过指定协议同步至第三方系统"
              checkedChildren={language("project.open")}
              unCheckedChildren={language("project.close")}
            />
            <div className="faceTypeDiv">
              <ProFormRadio.Group
                label="接口类型"
                name={"faceType"}
                options={[
                  { value: "currency", label: "通用" },
                  { value: "firm", label: "厂商" },
                ]}
                onChange={(e) => {
                  setType(e.target.value);
                }}
              />
            </div>
            <ProFormSelect
              label="协议类型"
              width="300px"
              name="agreeType"
              rules={[
                { required: true, message: language("project.mandatory") },
              ]}
              options={[
                { value: "RADIUS-MD5", label: "RADIUS-MD5" },
                { value: "RADIUS-CHAP", label: "RADIUS-CHAP" },
              ]}
            />
            <ProFormText
              label="服务器地址"
              width="176px"
              name="srip"
              rules={[
                { required: true, message: language("project.mandatory") },
              ]}
              addonAfter={
                <Space className="afterAntdFields">
                  <ProFormText
                    placeholder="端口"
                    name="srport"
                    width={"119px"}
                  />
                  <a
                    onClick={() => {
                      contentTest();
                    }}
                  >
                    连接测试
                  </a>
                </Space>
              }
            />
            {type === "currency" && (
              <div>
                <ProFormText
                  label="共享密钥"
                  name="shareKey"
                  width="300px"
                  rules={[
                    { required: true, message: language("project.mandatory") },
                  ]}
                />
                <ProFormSelect
                  label="字符编码"
                  name="unicode"
                  width="300px"
                  options={[
                    { value: "UTF8", label: "UTF8" },
                    { value: "GBK", label: "GBK" },
                  ]}
                />
              </div>
            )}
          </div>
        </ProForm>
      </ProCard>
    </Spin>
  );
};

export default Advanced;
