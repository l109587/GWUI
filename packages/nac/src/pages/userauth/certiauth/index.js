import React, { useEffect, useRef, useState } from "react";
import {
  ProCard,
  ProForm,
  ProFormCheckbox,
  ProFormItem,
  ProFormRadio,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProTable,
} from "@ant-design/pro-components";
import { Spin, Button, message } from "antd";
import { language } from "@/utils/language";
import { SaveOutlined } from "@ant-design/icons";
import { post, get } from "@/services/https";
import WebUploadr from "@/components/Module/webUploadr";
import { NumberField } from "@/common/fun/formTypeCon";
import "./certiauth.less";
let H = document.body.clientHeight - 159;
let clientHeight = H;

export default () => {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [showFields, setShowFields] = useState(false);
  const [certList, setCertList] = useState([]);
  const [keyTypeList, setKeyTypeList] = useState([]);

  const columns = [
    {
      title: "颁发者",
      dataIndex: "count",
      align: "center",
      ellipsis: true,
      key: "count",
      width: 96,
    },
    {
      title: "使用者",
      dataIndex: "user",
      align: "center",
      ellipsis: true,
      key: "user",
      width: 140,
    },
    {
      title: "有效期",
      dataIndex: "time",
      align: "center",
      ellipsis: true,
      key: "time",
      width: 97,
    },
    {
      title: "序列号",
      dataIndex: "num",
      align: "left",
      ellipsis: true,
      key: "num",
      width: 180,
    },
    {
      title: "类型",
      dataIndex: "type",
      align: "center",
      ellipsis: true,
      key: "type",
      width: 72,
    },
  ];

  useEffect(() => {
    getCertList();
    getConfig();
  }, []);

  const getCertList = () => {
    post("/cfg.php?controller=auth&action=getCertType").then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      let certArr = [];
      res.data?.map((item) => {
        certArr.push({
          value: item.value,
          label: item.text,
        });
      });
      setCertList(certArr);
      setKeyTypeList(res?.data[0]?.keyType);
    });
  };

  const getConfig = () => {
    setLoading(true);
    post("/cfg.php?controller=auth&action=getCertConfig").then((res) => {
      if (!res.success) {
        message.error(res.msg);
        setLoading(false);
        return false;
      }
      if (res.data.crlMode == "ldap") {
        setShowFields(true);
      }
      let values = res.data;
      for (const key in values) {
        if (values[key] === "Y") {
          values[key] = true;
        } else if (values[key] === "N") {
          values[key] = false;
        }
      }
      formRef.current?.setFieldsValue(values);
      setLoading(false);
    });
  };

  const setConfig = (values) => {
    let obj = values;
    for (const key in obj) {
      if (values[key] === true) {
        values[key] = "Y";
      } else if (values[key] === false) {
        values[key] = "N";
      } else {
        values[key] = values[key];
      }
    }
    post("/cfg.php?controller=auth&action=setCertConfig", obj).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      getConfig();
    });
  };

  /* 上传配置 */
  const isAuto = true;
  const upbutext = "上传证书文件";
  const maxSize = 300;
  const accept = "";
  const upurl = "/cfg.php?controller=auth&action=uploadCertChain";
  const isShowUploadList = true;
  const maxCount = 1;
  const isUpsuccess = true;

  const onUploadSuccess = () => {
    console.log(111111);
  };

  return (
    <ProCard
      title="证书认证"
      className="certiauthCard"
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
          className="certiautForm"
          labelCol={{ flex: "80px" }}
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
            style={{ maxHeight: clientHeight - 75, overflowY: "auto" }}
          >
            <div className="secodaryTitle" style={{ marginBottom: 3 }}>
              UKEY证书
            </div>
            <ProFormSelect
              label="证书类型"
              name="crtType"
              width={"243px"}
              options={certList}
            />
            <ProFormSelect
              label="密钥类型"
              name="keyType"
              width={"243px"}
              options={keyTypeList}
              fieldProps={{
                fieldNames: {
                  label: "text",
                  value: "value",
                },
              }}
            />
            <div className="smHeightFields">
              <ProFormCheckbox label="签名认证" name="signAuth">
                开启签名认证
              </ProFormCheckbox>
              <ProFormCheckbox label="口令认证" name="pwdAuth">
                开启静态口令认证(需要UKEY账号配置密码口令)
              </ProFormCheckbox>
            </div>
            <div className="smallFieldsDiv">
              <NumberField
                type="small"
                label="拔KEY登出"
                addonBefore="允许拔KEY时间"
                name="outTime"
                width="97px"
                afterUnit="分钟"
              />
            </div>
            <ProFormItem label="根证书链">
              <div className="cereUpDiv">
                <WebUploadr
                  upurl={upurl}
                  accept={accept}
                  isAuto={isAuto}
                  maxSize={maxSize}
                  maxCount={maxCount}
                  upbutext={upbutext}
                  isUpsuccess={isUpsuccess}
                  onSuccess={onUploadSuccess}
                  isShowUploadList={isShowUploadList}
                />
              </div>
            </ProFormItem>
            <div className="marginLeftDiv">
              <ProTable
                className="certiTable"
                size="small"
                rowKey="index"
                style={{
                  width: "658px",
                }}
                columns={columns}
                bordered={false}
                cardBordered={false}
                scroll={{ y: 350 }}
                dataSource={[]}
                search={false}
                options={false}
                pagination={false}
              />
            </div>
            <div className="secodaryTitle">吊销检查</div>
            <div className="revokeDiv">
              <ProFormSwitch
                name="crlSW"
                addonAfter="开启证书吊销检查"
                checkedChildren={language("project.open")}
                unCheckedChildren={language("project.close")}
              />
            </div>
            <div className="aroundDiv">
              <ProFormRadio.Group
                label="获取方式"
                name="crlMode"
                options={[
                  { value: "http", label: "HTTP获取" },
                  { value: "ldap", label: "LDAP获取" },
                ]}
                onChange={(e) => {
                  if (e.target.value === "http") {
                    setShowFields(false);
                  } else {
                    setShowFields(true);
                  }
                }}
              />
            </div>
            <div className="smallFieldsDiv">
              <NumberField
                type="small"
                label="获取周期"
                name="crlPeriod"
                width="80px"
                afterUnit="分钟"
                afterText={<div className="tipText">值 > 5</div>}
              />
            </div>
            <ProFormText label="吊销地址" name="crlURL" width={"243px"} />
            {showFields && (
              <div>
                <ProFormText
                  label="搜索路径"
                  name="crlBaseDN"
                  width={"243px"}
                />
                <ProFormText
                  label="过滤字段"
                  name="crlFilter"
                  width={"243px"}
                />
                <ProFormText
                  label="属性字段"
                  name="crlAttrField"
                  width={"243px"}
                />
              </div>
            )}
          </div>
        </ProForm>
      </Spin>
    </ProCard>
  );
};
