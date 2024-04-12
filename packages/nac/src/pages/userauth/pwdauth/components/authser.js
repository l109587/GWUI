import React, { useEffect, useRef, useState } from "react";
import {
  ProCard,
  ProForm,
  ProFormCheckbox,
  ProFormRadio,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from "@ant-design/pro-components";
import { Button, Space, message, Spin, Alert, Popover } from "antd";
import { language } from "@/utils/language";
import { ExclamationCircleFilled, SaveOutlined } from "@ant-design/icons";
import { post } from "@/services/https";
import "./authser.less";
import { NumberField } from "@/common/fun/formTypeCon";
let H = document.body.clientHeight - 150;
let clientHeight = H;
const Authser = (props) => {
  const { reloadKey, activeKey } = props;
  const formRef = useRef();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (activeKey == 3) {
      getConfig();
    }
  }, [reloadKey]);

  const getConfig = () => {
    setLoading(true);
    post("/cfg.php?controller=auth&action=getPortalConfig").then((res) => {
      if (!res.success) {
        setLoading(false);
        message.error(res.msg);
        return false;
      }
      let values = Object.assign(
        res.data.otherAuth,
        res.data.serverMail,
        res.data.serverRadius,
        { otherAuthStatus: res.data.otherAuth.status },
        { serverMailStatus: res.data.serverMail.status },
        { serverRadiusStatus: res.data.serverRadius.status }
      );
      for (const key in values) {
        if (values[key] === "Y") {
          values[key] = true;
        } else if (values[key] === "N") {
          values[key] = false;
        }
      }
      setLoading(false);
      formRef.current?.setFieldsValue(values);
    });
  };

  const onSubmit = (values) => {
    let otherAuth = {};
    let serverMail = {};
    let serverRadius = {};
    otherAuth = {
      status: values.otherAuthStatus === true ? "Y" : "N",
      authLink: values.authLink,
      authFlag: values.authFlag,
      authKey: values.authKey,
      keyExpire: values.keyExpire,
    };
    serverMail = {
      status: values.serverMailStatus === true ? "Y" : "N",
      mailAddr: values.mailAddr,
      mailPort: values.mailPort,
      encrypt: values.encrypt === true ? "Y" : "N",
      mailType: values.mailType,
    };
    serverRadius = {
      status: values.serverRadiusStatus === true ? "Y" : "N",
      radServer: values.radServer,
      radPort: values.radPort,
      radKey: values.radKey,
      radCharset: values.radCharset,
    };
    post("/cfg.php?controller=auth&action=setPortalConfig", {
      otherAuth: JSON.stringify(otherAuth),
      serverMail: JSON.stringify(serverMail),
      serverRadius: JSON.stringify(serverRadius),
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
      "mailAddr",
      "mailPort",
      "encrypt",
      "srport",
      "shareKey",
      "unicode",
      "mailType",
    ]);
    post("/cfg.php?controller=auth&action=connectTest", {
      kind: "serverMail",
      info: JSON.stringify(values),
    }).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
    });
  };

  const raduisConTest = () => {
    let values = formRef.current.getFieldsValue([
      "status",
      "radServer",
      "radPort",
      "radKey",
      "radCharset",
    ]);
    post("/cfg.php?controller=auth&action=connectTest", {
      kind: "serverRadius",
      info: JSON.stringify(values),
    }).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
    });
  };

  return (
    <Spin spinning={loading} size="large">
      <ProCard
        title="认证服务"
        className="authserCard"
        bodyStyle={{
          paddingTop: 0,
          paddingBottom: 0,
          height: clientHeight - 35,
        }}
      >
        <ProForm
          formRef={formRef}
          layout="horizontal"
          labelCol={{ flex: "100px" }}
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
          onFinish={(values) => {
            onSubmit(values);
          }}
        >
          <div
            className="pwdContent"
            style={{ maxHeight: clientHeight - 90, overflowY: "auto" }}
          >
            <div className="secodaryTitle">HTTP服务器认证</div>
            <ProFormSwitch
              name="otherAuthStatus"
              checkedChildren={language("project.open")}
              unCheckedChildren={language("project.close")}
              addonAfter={
                <Space>
                  <div id="httpDiv">开启通过HTTP服务器进行认证</div>
                  <Popover
                    placement="right"
                    getPopupContainer={() => document.getElementById("httpDiv")}
                    content={
                      <Alert
                        type="info"
                        showIcon
                        className="linkAlert"
                        message={
                          <span style={{ width: "300px" }}>
                            认证服务开启后，需要HTTP服务器认证后将认证结果同步至本系统，同步接口需要授权后方可调用，请
                            <a
                              onClick={() => {
                                console.log(1111);
                              }}
                            >
                              点击此处
                            </a>
                            查看相关接口说明。
                          </span>
                        }
                      />
                    }
                    overlayStyle={{
                      width: "286px",
                    }}
                  >
                    <ExclamationCircleFilled style={{ color: "#1990ff" }} />
                  </Popover>
                </Space>
              }
            />
            <ProFormText
              label="认证连接"
              width="300px"
              name={"authLink"}
              rules={[
                { required: true, message: language("project.mandatory") },
              ]}
            />
            <ProFormText
              label="授权标识"
              name="authFlag"
              width="300px"
              rules={[
                { required: true, message: language("project.mandatory") },
              ]}
            />
            <ProFormText
              label="授权密钥"
              name="authKey"
              width="300px"
              rules={[
                { required: true, message: language("project.mandatory") },
              ]}
            />
            <div className="modPwdTimesDiv sslDiv">
              <NumberField
                type="small"
                label="授权过期"
                width="55px"
                rules={[
                  { required: true, message: language("project.mandatory") },
                ]}
                name="keyExpire"
                placeholder={" "}
                afterUnit="秒"
                afterText="后需要重新授权"
              />
            </div>
            <div className="secodaryTitle">邮件服务器认证</div>
            <ProFormSwitch
              name={"serverMailStatus"}
              checkedChildren={language("project.open")}
              unCheckedChildren={language("project.close")}
              addonAfter={
                <Space>
                  <div id="serTextDiv">开启通过远程邮件服务器进行认证</div>
                  <Popover
                    getPopupContainer={() =>
                      document.getElementById("serTextDiv")
                    }
                    content={
                      <Alert
                        type="info"
                        showIcon
                        className="linkAlert"
                        message={
                          "启用邮件认证功能,需要在用户管理中添加EMAIL认证用户。"
                        }
                      />
                    }
                    overlayStyle={{
                      width: "286px",
                    }}
                    placement="right"
                  >
                    <ExclamationCircleFilled style={{ color: "#1990ff" }} />
                  </Popover>
                </Space>
              }
            />
            <div className="mailTypeDiv">
              <ProFormRadio.Group
                label="协议类型"
                name="mailType"
                options={[
                  { value: "SMTP", label: "SMTP" },
                  { value: "POP3", label: "POP3" },
                  { value: "IMAP", label: "IMAP" },
                ]}
              />
            </div>
            <div className="urlDiv">
              <ProFormText
                label="服务器地址"
                width="176px"
                name="mailAddr"
                rules={[
                  { required: true, message: language("project.mandatory") },
                ]}
                placeholder="地址"
              />
              <div className="afterAntdFields">
                <ProFormText
                  name="mailPort"
                  placeholder="端口"
                  width="119px"
                  rules={[
                    {
                      required: true,
                      message: language("project.mandatory"),
                    },
                  ]}
                  addonAfter={
                    <a
                      onClick={() => {
                        contentTest();
                      }}
                    >
                      连接测试
                    </a>
                  }
                />
              </div>
            </div>
            <div className="sslDiv bottomZerotDiv">
              <ProFormCheckbox label="加密" name="encrypt">
                启用SSL认证
              </ProFormCheckbox>
            </div>
            <div className="secodaryTitle">RADUIS服务器认证</div>
            <ProFormSwitch
              name="serverRadiusStatus"
              checkedChildren={language("project.open")}
              unCheckedChildren={language("project.close")}
              addonAfter={
                <Space>
                  <div id="raduisTextDiv">开启通过远程RADUIS服务器进行认证</div>
                  <Popover
                    getPopupContainer={() =>
                      document.getElementById("raduisTextDiv")
                    }
                    content={
                      <Alert
                        type="info"
                        showIcon
                        className="linkAlert"
                        message={
                          "启用RADUIS认证功能,需要在用户管理中添加RADUIS认证用户。"
                        }
                      />
                    }
                    overlayStyle={{
                      width: "286px",
                    }}
                    placement="right"
                  >
                    <ExclamationCircleFilled style={{ color: "#1990ff" }} />
                  </Popover>
                </Space>
              }
            />
            <div className="urlDiv">
              <ProFormText
                label="服务器地址"
                width="176px"
                name="radServer"
                placeholder="地址"
                rules={[
                  { required: true, message: language("project.mandatory") },
                ]}
              />
              <div className="afterAntdFields">
                <ProFormText
                  width="119px"
                  placeholder="端口"
                  name="radPort"
                  rules={[
                    {
                      required: true,
                      message: language("project.mandatory"),
                    },
                  ]}
                  addonAfter={
                    <a
                      onClick={() => {
                        raduisConTest();
                      }}
                    >
                      连接测试
                    </a>
                  }
                />
              </div>
            </div>
            <ProFormText
              label="共享密钥"
              name="radKey"
              width="300px"
              rules={[
                { required: true, message: language("project.mandatory") },
              ]}
            />
            <ProFormSelect
              label="字符编码"
              name="radCharset"
              width="300px"
              options={[
                { value: "UTF8", label: "UTF8" },
                { value: "GBK", label: "GBK" },
              ]}
            />
          </div>
        </ProForm>
      </ProCard>
    </Spin>
  );
};

export default Authser;
