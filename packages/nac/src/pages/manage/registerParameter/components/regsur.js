import React, { useRef, useState, useEffect } from "react";
import { Input, Row, Col, Button, Tooltip, Affix } from "antd";
import {
  ProForm,
  ProFormText,
  ProFormRadio,
  ProFormSelect,
  ProFormCheckbox,
  ProCard,
} from "@ant-design/pro-components";
import { language } from "@/utils/language";
import { post, postAsync } from "@/services/https";
import { SaveOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import "@/utils/index.less";
import "@/common/common.less";
import "./../index.less";
import SaveSvg from "@/assets/nac/save.svg";
import { ReactComponent as WDel } from "@/assets/nac/security/wdel.svg";
import { regList, regUrlList } from "@/utils/regExp";
import { TableLayout, AmTag } from "@/components";
import { NumberField } from "@/common/fun/formTypeCon";
export default (props) => {
  const { clientHeight } = props;
  const formRef = useRef();
  const [modalStatus, setModalStatus] = useState(false); //model 添加弹框状态
  const [contentList, setContentList] = useState([]);
  const [isHovering, setIsHovering] = useState("");
  const [formType, setFormType] = useState("input");
  //判断是否弹出添加model
  const getModal = (status, op) => {
    if (status == 1) {
      setModalStatus(true);
    } else {
      setIsHovering("");
      formRef.current.resetFields();
      setModalStatus(false);
    }
  };

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
    <ProCard ghost title={"注册保活配置"}>
      <ProForm
        layout="horizontal"
        submitTimeout={2000}
        className="profrombox"
        submitter={{
          render: (props, doms) => {
            return [
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
              </Row>,
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
          <div className="registersurvivalbox">
            <ProCard ghost title={"心跳超时配置"}>
              <NumberField
                placeholder={" "}
                name="n13awme"
                label={"在线接入心跳超出"}
                afterUnit={"秒"}
                width="130px"
              />
              <NumberField
                placeholder={" "}
                name="lxname"
                label={"离线接入心跳超出"}
                afterUnit={"秒"}
                width="130px"
              />
              <div>
                <ProFormRadio.Group
                  name="usState"
                  id="usState"
                  label={"心跳超时处理"}
                  options={[
                    {
                      label: "阻断重定向",
                      value: "Y",
                    },
                    { label: "放行告警", value: "N" },
                  ]}
                />
              </div>
            </ProCard>
            <ProCard ghost title={"设备离线配置"}>
              <NumberField
                label={"在线超时时间"}
                placeholder={" "}
                name="lxnametime"
                afterUnit={"分钟"}
                width="130px"
              />
              <div className="fromnumberheight">
                <ProFormCheckbox.Group
                  name={"agreqeement"}
                  options={[
                    {
                      label: (
                        <div style={{ marginRight: "14px" }}>
                          开启客户端水印保活检测
                          <span style={{ marginLeft: "10px" }}>
                            <Tooltip
                              style={{ color: "#9D9D9D" }}
                              title={"需要在内网管理系统中配置水印保活策略"}
                            >
                              <QuestionCircleOutlined />
                            </Tooltip>
                          </span>
                        </div>
                      ),
                      value: 1,
                    },
                  ]}
                />

                <ProFormCheckbox.Group
                  name={"agreemeent"}
                  options={[
                    {
                      label: "离线删除时间",
                      value: 1,
                    },
                  ]}
                  addonAfter={
                    <div
                      className="frommarginbuttom0"
                      style={{ marginLeft: "-8px" }}
                    >
                      <NumberField
                        type={"small"}
                        marButStatus={true}
                        placeholder={" "}
                        name="nawme"
                        afterUnit={"天"}
                        width="130px"
                        afterText={"(0天表示立即删除)"}
                      />
                    </div>
                  }
                />
                <div>
                  <ProFormCheckbox.Group
                    name={"agreement2"}
                    options={[
                      {
                        label: "超时删除时间",
                        value: 1,
                      },
                    ]}
                    addonAfter={
                      <div
                        className="frommarginbuttom0"
                        style={{ marginLeft: "-8px" }}
                      >
                        <NumberField
                          type={"small"}
                          placeholder={" "}
                          marButStatus={true}
                          name="nqawme"
                          afterUnit={"天"}
                          width="130px"
                          afterText={
                            <Tooltip
                              style={{ color: "#9D9D9D" }}
                              title={
                                "当终端上准入客户端在设置天数内始终没有业务数据，自动删除其注册信息清理冗余数据"
                              }
                            >
                              <QuestionCircleOutlined />
                            </Tooltip>
                          }
                        />
                      </div>
                    }
                  />
                </div>
              </div>
            </ProCard>
            <ProCard ghost title={"注册信息配置"}>
              {/* fromnumberheight */}
              <div className="frominputheight ">
                <ProFormCheckbox.Group
                  name={"agreement"}
                  options={[
                    {
                      label: <div>开启客户端心跳触发重新上报注册信息</div>,
                      value: 1,
                    },
                  ]}
                />
                <ProFormCheckbox.Group
                  name={"agreeme2nt"}
                  options={[
                    {
                      label: (
                        <div
                          className="frommarginbuttom0"
                          style={{ display: "flex" }}
                        >
                          <ProFormText
                            label={"指定注册安装页面"}
                            width="200px"
                            name="escape_time"
                            placeholder={""}
                          />
                          <div></div>
                        </div>
                      ),
                      value: 1,
                    },
                  ]}
                />
                <div>
                  <ProFormCheckbox.Group
                    name={"agr3eement"}
                    options={[
                      {
                        label: "超时删除时间",
                        value: 1,
                      },
                    ]}
                    addonAfter={
                      <div
                        className="frommarginbuttom0"
                        style={{ display: "flex", marginLeft: "-8px" }}
                      >
                        <ProFormSelect
                          width="100px"
                          options={[
                            {
                              label: <div>认证用户</div>,
                              value: 1,
                            },
                          ]}
                        />
                        <div style={{ marginLeft: "9px" }}>自动更新部门</div>
                      </div>
                    }
                  />
                </div>
              </div>
            </ProCard>
          </div>
        </div>
      </ProForm>
    </ProCard>
  );
};
