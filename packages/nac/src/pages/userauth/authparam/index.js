import React, { useEffect, useRef, useState } from "react";
import {
  ProCard,
  ProForm,
  ProFormCheckbox,
  ProFormSelect,
} from "@ant-design/pro-components";
import { Button, Space, message, Spin } from "antd";
import { language } from "@/utils/language";
import { SaveOutlined } from "@ant-design/icons";
import "./authparam.less";
import { post } from "@/services/https";
import { NumberField } from "@/common/fun/formTypeCon";
let H = document.body.clientHeight - 150;
let clientHeight = H;
export default () => {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);

  const momentOptions = () => {
    const timeput = [];
    for (let i = 0; i <= 23; i++) {
      let obj = {};
      obj.value = i + "";
      obj.label = i > 9 ? i + ":00" : "0" + i + ":00";
      timeput.push(obj);
    }
    return timeput;
  };

  useEffect(() => {
    getAuthConfig();
  }, []);

  const getAuthConfig = () => {
    setLoading(true);
    post("/cfg.php?controller=auth&action=getAuthConfig")
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          setLoading(false);
          return false;
        }
        let values = Object.assign(
          res.data.authLogout,
          res.data.authKeep,
          res.data.authLimit,
          res.data.authAccount
        );
        for (const key in values) {
          if (values[key] === "Y") {
            values[key] = true;
          } else if (values[key] === "N") {
            values[key] = false;
          }
        }
        formRef.current?.setFieldsValue(values);
        setLoading(false);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  const setAuthConfig = (values) => {
    let authLogout = {};
    let authKeep = {};
    let authLimit = {};
    let authAccount = {};
    authLogout = {
      timeout: values.timeout === true ? "Y" : "N",
      momentSW: values.momentSW === true ? "Y" : "N",
      momentVal: values.momentVal,
      periodSW: values.periodSW === true ? "Y" : "N",
      periodVal: values.periodVal,
    };
    authKeep = {
      keepSW: values.keepSW === true ? "Y" : "N",
      keepUint: values.keepUint,
      keepVal: values.keepVal,
      priority: values.priority === true ? "Y" : "N",
      keepCancelSW: values.keepCancelSW === true ? "Y" : "N",
      keepCancelVal: values.keepCancelVal,
      keepCancelUnit: values.keepCancelUnit,
    };
    authLimit = {
      lockSW: values.lockSW === true ? "Y" : "N",
      tryNUM: values.tryNUM,
      lockTime: values.lockTime,
    };
    authAccount = {
      accIgCase: values.accIgCase === true ? "Y" : "N",
      accDisable: values.accDisable === true ? "Y" : "N",
      accLogout: values.lockaccLogoutTime,
    };
    post("/cfg.php?controller=auth&action=setAuthConfig", {
      authLogout: JSON.stringify(authLogout),
      authKeep: JSON.stringify(authKeep),
      authLimit: JSON.stringify(authLimit),
      authAccount: JSON.stringify(authAccount),
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
      title="认证参数"
      className="authParamCard"
      bodyStyle={{
        height: clientHeight - 5,
      }}
    >
      <Spin spinning={loading} size="large">
        <ProForm
          formRef={formRef}
          size="small"
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
            setAuthConfig(values);
          }}
        >
          <div
            className="authParpmContent"
            style={{ maxHeight: clientHeight - 104, overflowY: "auto" }}
          >
            <div className="authTitle">认证登出</div>
            <ProFormCheckbox name="timeout" fieldProps={{ size: "small" }}>
              自动注销无流量认证用户
            </ProFormCheckbox>
            <ProFormCheckbox
              name="momentSW"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <Space className="periodDiv">
                认证成功后在
                <div
                  id="momentDiv"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  <ProFormSelect
                    name="momentVal"
                    width="123px"
                    fieldProps={{
                      size: "small",
                      getPopupContainer: () => document.getElementById("momentDiv")
                    }}
                    options={momentOptions()}
                  />
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  强制登出
                </div>
              </Space>
            </ProFormCheckbox>
            <ProFormCheckbox name="periodSW" fieldProps={{ size: "small" }}>
              <Space className="periodDiv">
                认证成功后在
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  <NumberField
                    type="small"
                    width="83px"
                    name="periodVal"
                    afterUnit={"小时"}
                    afterText="后强制登出"
                  />
                </div>
              </Space>
            </ProFormCheckbox>
            <div className="spaceTitle">认证保持</div>
            <ProFormCheckbox name="keepSW" fieldProps={{ size: "small" }}>
              <Space className="periodDiv">
                认证成功后在
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  <NumberField
                    type="small"
                    width="61.5px"
                    name="keepVal"
                    afterSelect={true}
                    selectName={"keepUint"}
                    selectOptions={[
                      { value: "hour", label: "小时" },
                      { value: "day", label: "天" },
                    ]}
                    selectClear={false}
                    selectWidth="61.5px"
                    afterText="内无需再认证"
                    selectValue={"hour"}
                  />
                </div>
              </Space>
            </ProFormCheckbox>
            <div className="marLeftDiv">
              <ProFormCheckbox
                name="keepCancelSW"
                fieldProps={{ size: "small" }}
                onChange={(e) => {
                  if (e.target.checked) {
                    formRef.current.setFieldsValue({
                      keepSW: true,
                    });
                  }
                }}
              >
                <Space className="periodDiv">
                  离线超出
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  >
                    <NumberField
                      type="small"
                      width="61.5px"
                      name="keepCancelVal"
                      afterSelect={true}
                      selectName={"keepCancelUnit"}
                      selectOptions={[
                        { value: "hour", label: "小时" },
                        { value: "day", label: "天" },
                      ]}
                      selectWidth="61.5px"
                      afterText="取消认证保持"
                      selectValue={"hour"}
                      selectClear={false}
                    />
                  </div>
                </Space>
              </ProFormCheckbox>
              <ProFormCheckbox
                name="priority"
                fieldProps={{ size: "small" }}
                onChange={(e) => {
                  if (e.target.checked) {
                    formRef.current.setFieldsValue({
                      keepSW: true,
                    });
                  }
                }}
              >
                认证保持优先级高于认证登出
              </ProFormCheckbox>
            </div>
            <div className="spaceTitle">认证限制</div>
            <ProFormCheckbox name="lockSW" fieldProps={{ size: "small" }}>
              对尝试认证失败用户进行冻结
            </ProFormCheckbox>
            <div className="marLeftDiv">
              <NumberField
                type="small"
                addonBefore="尝试"
                name="tryNUM"
                width="83px"
                afterUnit="次"
              />
              <NumberField
                type="small"
                name="lockTime"
                addonBefore="冻结"
                width="83px"
                afterUnit="分钟"
              />
            </div>
            <div className="spaceTitle">认证账号</div>
            <ProFormCheckbox name="accIgCase" fieldProps={{ size: "small" }}>
              忽略账号大小写进行认证
            </ProFormCheckbox>
            <ProFormCheckbox name="accDisable" fieldProps={{ size: "small" }}>
              <Space className="periodDiv">
                自动禁用
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  <NumberField
                    width="83px"
                    name="accLogout"
                    type="small"
                    afterUnit="天"
                    afterText="未登录用户"
                  />
                </div>
              </Space>
            </ProFormCheckbox>
          </div>
        </ProForm>
      </Spin>
    </ProCard>
  );
};
