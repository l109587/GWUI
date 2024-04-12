import React, { useRef, useState, useEffect } from "react";
import { Row, Col, Button, Alert, Affix, message } from "antd";
import {
  ProForm,
  ProFormText,
  ProFormRadio,
  ProFormSelect,
  ProFormCheckbox,
  ProFormSwitch,
} from "@ant-design/pro-components";
import { language } from "@/utils/language";
import { post } from "@/services/https";
import { SaveOutlined } from "@ant-design/icons";
import "@/utils/index.less";
import "@/common/common.less";
import "./../index.less";
import { regList, regUrlList } from "@/utils/regExp";

export default (props) => {
  const { clientHeight, busNet, seaverNet } = props;

  const formRef = useRef();
  const [modeStatus, setModeStatus] = useState(0);
  const [alertInfo, setAlertInfo] = useState();
  const [pcapState, setPcapState] = useState("N");

  useEffect(() => {
    dhcp_get();
  }, []);

  const dhcp_get = () => {
    post("/cfg.php?controller=access&action=dhcp_get")
      .then((res) => {
        if (res.success) {
          setAlertInfo(
            res.dhcp_interface == "(null)" || !res.dhcp_interface
              ? ""
              : res.dhcp_interface
          );
          setPcapState(res.pcap_state == "Y" ? "Y" : "N");
          res.data.state = res.data.state == "Y" ? true : false;
          res.data.sync_control = res.data.sync_control == "Y" ? ["Y"] : [];
          formRef.current.setFieldsValue(res.data ? res.data : {});
        }
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  const dhcp_set = (values) => {
    values.state = values.state == "Y" || values.state === true ? "Y" : "N";
    values.sync_control = values.sync_control?.length >= 1 ? "Y" : "N";
    post("/cfg.php?controller=access&action=dhcp_set", values)
      .then((res) => {
        if (res.success) {
          message.success(res.msg);
        } else {
          message.error(res.msg);
        }
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  return (
    <div>
      <ProForm
        layout="horizontal"
        submitTimeout={2000}
        className="profrombox"
        formRef={formRef}
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
          dhcp_set(values);
        }}
      >
        <div
          style={{
            maxHeight: clientHeight - 100,
            overflow: "auto",
          }}
        >
          <div className="alinkaccessbox">
            <ProFormSwitch
              name="state"
              width={"300px"}
              checkedChildren={language("project.open")}
              unCheckedChildren={language("project.close")}
              addonAfter={<div style={{ marginTop: "1px" }}>开启DHCP准入</div>}
            />
          </div>

          <ProFormCheckbox.Group
            label={"客户端同步管控"}
            name="sync_control"
            options={[
              {
                label: "通知终端管控状态到客户端",
                value: "Y",
              },
            ]}
          />
          <div className="readibuttonbox" style={{ width: "463px" }}>
            <ProFormRadio.Group
              width={"300px"}
              label={"部署模式"}
              name="mode"
              id="mode"
              fieldProps={{
                buttonStyle: "solid",
                optionType: "button",
              }}
              initialValue={0}
              onChange={(e) => {
                setModeStatus(e.target.value);
              }}
              rules={[{ required: true }]}
              options={[
                { label: "中继模式", value: 0 },
                { label: "服务器模式", value: 1 },
              ]}
            />
          </div>

          <ProFormSelect
            label="业务网口"
            width={"300px"}
            name="dhcp_interface"
            fieldProps={{
              fieldNames: {
                label: "name",
                value: "value",
              },
            }}
            options={busNet}
          />
          <ProFormText label={"VLAN"} width={"300px"} name="native_vlan" />
          {modeStatus === 0 ? (
            <>
              <ProFormSelect
                width={"300px"}
                label="DHCP服务器网口"
                name="dhcp_server_interface"
                placeholder={language("project.select")}
                fieldProps={{
                  fieldNames: {
                    label: "name",
                    value: "value",
                  },
                }}
                options={seaverNet}
              />
              <ProFormText
                label={"DHCP服务器地址"}
                width={"300px"}
                name="dhcp_server_ip"
              />
            </>
          ) : (
            <></>
          )}
          <ProFormText
            label={"隔离网段默认网关及掩码"}
            width={"300px"}
            name="isonet_gwip"
          />
          <ProFormText
            label={"隔离网段VLAN ID"}
            width={"300px"}
            name="isonet_vlan"
          />
          <ProFormText label={"DNS"} width={"300px"} name="dns" />
          <div className="frommarginbuttom0">
            <ProFormText label={"业务网口状态"} width={"300px"} name={"url"}>
              <Alert
                className="seniovalertbox"
                width={"300px"}
                message={alertInfo ? alertInfo : ""}
                type="info"
                showIcon
                icon={
                  <div
                    style={{
                      marginRight: "10px",
                      color: "#1677FF",
                      fontSize: "14px",
                    }}
                  >
                    ● {pcapState == "Y" ? "正常" : "异常"}
                  </div>
                }
              />
            </ProFormText>
          </div>
        </div>
      </ProForm>
    </div>
  );
};
