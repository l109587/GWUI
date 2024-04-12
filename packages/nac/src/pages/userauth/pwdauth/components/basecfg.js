import React, { useEffect, useRef, useState } from "react";
import {
  ProCard,
  ProForm,
  ProFormCheckbox,
  ProFormItem,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import { Button, Space, message, Spin } from "antd";
import { language } from "@/utils/language";
import { SaveOutlined } from "@ant-design/icons";
import "react-quill/dist/quill.snow.css";
import ReactQuill, { Quill } from "react-quill";
import SmsModal from "./smsModal";
import { post } from "@/services/https";
import { debounce } from "lodash";
import "./basecfg.less";
import "./richEditor.less";
import { NumberField } from "@/common/fun/formTypeCon";
import AddIcon from "@/assets/nac/add.svg";
let H = document.body.clientHeight - 150;
let clientHeight = H;

const BaseCfg = (props) => {
  const { reloadKey, activeKey } = props;
  const formRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [modalStatus, setModalStatus] = useState(false);
  const [editorValue, setEditorValue] = useState("");
  const editorRef = useRef(null);

  // 自定义quill编辑器的字体
  let fontArr = ["SimSun", "SimHei", "Microsoft-YaHei", "KaiTi", "FangSong"]; // 这里的顺序注意一下
  let Font = Quill.import("formats/font");
  Font.whitelist = fontArr; // 将字体加入到白名单 ,这里可在 /formats/fonts.js 中了解
  Quill.register(Font, true);

  /* 自定义字体大小 */
  let fontSizeArr = [
    "12px",
    "14px",
    "16px",
    "18px",
    "20px",
    "22px",
    "24px",
    "32px",
    "40px",
    "48px",
  ];

  let fontSize = Quill.import("formats/size");

  fontSize.whitelist = fontSizeArr;

  Quill.register(fontSize, true);

  /* 自定义行高 */
  let lineHeightArr = ["1", "1.5", "1.75", "2", "3", "4", "5"];
  const Parchment = Quill.import("parchment");
  const lineHeightStyle = new Parchment.Attributor.Style(
    "lineHeight",
    "line-height",
    {
      scope: Parchment.Scope.INLINE,
      whitelist: lineHeightArr,
    }
  );
  Quill.register({ "formats/lineHeight": lineHeightStyle }, true);

  // 定义自定义格式化标记
  var CustomDivider = Quill.import("blots/block/embed");
  CustomDivider.blotName = "divider";
  CustomDivider.tagName = "hr";
  // 注册自定义格式化标记
  Quill.register(CustomDivider);
  // 在编辑器中插入分割线
  const insertDivider = () => {
    let range = editorRef.current.editor.getSelection(true);
    editorRef.current.editor.insertText(range.index, "\n", Quill.sources.USER);
    editorRef.current.editor.insertEmbed(
      range.index + 1,
      "divider",
      true,
      Quill.sources.USER
    );
    editorRef.current.editor.setSelection(
      range.index + 2,
      Quill.sources.SILENT
    );
  };

  var icons = Quill.import("ui/icons");
  icons[
    "hr"
  ] = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" id="hrSvg">
  <defs>
    <style>
      .cls-1 {
        fill: none;
      }

      .cls-2 {
        fill: #444;
      }
    </style>
  </defs>
  <g id="分割线" transform="translate(-659 -598)">
    <rect id="矩形_1341" data-name="矩形 1341" class="cls-1" width="14" height="14" transform="translate(659 598)"/>
    <rect id="矩形_1340" data-name="矩形 1340" class="cls-2" width="14" height="2" transform="translate(659 604)"/>
  </g>
</svg>`;

  let addHrBut = document.getElementById("hrSvg");

  if (addHrBut) {
    addHrBut.onclick = () => {
      insertDivider();
    };
  }
  const modules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"], // 加粗，斜体，下划线，删除线
        ["blockquote", "code-block"], // 字体样式
        ["link", "image"], // 上传图片、上传视频
        [{ list: "ordered" }, { list: "bullet" }], // 有序列表，无序列表
        [{ script: "sub" }, { script: "super" }], // 下角标，上角标 // [{ indent: '-1' }, { indent: '+1' }], // 缩进
        [{ align: [] }], // 居中
        [{ size: fontSizeArr }], // custom dropdown
        [{ color: [] }, { background: [] }], // 文字颜色、背景颜色选择
        [{ direction: "rtl" }], // 文字输入方向
        [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
        [{ font: fontArr }], // 自定义字体
        // [{ lineheight: lineHeightArr }], // 自定义行高 // 添加自定义按钮
        ["hr"],
        ["clean"], // 清除样式
      ],
      // handlers: {
      //   undo: () => {
      //     console.log(9999);
      //   },
      // },
    },
  };

  // 剩下参数 delta: DeltaStatic, source: Sources, editor: ReactQuill.UnprivilegedEditor
  const handleChangeValue = debounce((value) => {
    setEditorValue(value);
  }, 500);

  const onModalChange = (state) => {
    setModalStatus(state);
  };

  const onModalSubmit = (values) => {
    console.log(values);
  };

  useEffect(() => {
    if (activeKey == 1) {
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
        res.data.general,
        res.data.localAuth,
        res.data.otherAuth,
        res.data.otherSend,
        res.data.serverMail,
        res.data.serverRadius,
        res.data.switchAuth
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
    let general = {};
    let localAuth = {};
    general = {
      pwdAuth: values.pwdAuth === true ? "Y" : "N",
      smsAuth: values.smsAuth === true ? "Y" : "N",
      twoFactorAuth: values.twoFactorAuth === true ? "Y" : "N",
      phoneAuth: values.phoneAuth === true ? "Y" : "N",
      domainAutoAuth: values.domainAutoAuth === true ? "Y" : "N",
      forgotPWD: values.forgotPWD === true ? "Y" : "N",
      modifyMode: values.modifyMode,
      remoteTip: values.remoteTip,
      remoteLink: values.remoteLink,
      smsConfig: values.smsConfig,
      authTip: values.authTip === true ? "Y" : "N",
      tipInfo: values.tipInfo,
    };
    localAuth = {
      webRegsw: values.webRegsw === true ? "Y" : "N",
      modifyFirst: values.modifyFirst === true ? "Y" : "N",
      pwdComplexity: values.pwdComplexity === true ? "Y" : "N",
      pwdLength: values.pwdLength === true ? "Y" : "N",
      pwdPeriod: values.pwdPeriod === true ? "Y" : "N",
      periodDay: values.periodDay,
      autoRegister: values.autoRegister === true ? "Y" : "N",
      improveInfo: values.improveInfo === true ? "Y" : "N",
    };
    post("/cfg.php?controller=auth&action=setPortalConfig", {
      general: JSON.stringify(general),
      localAuth: JSON.stringify(localAuth),
    }).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      getConfig();
    });
  };

  return (
    <Spin spinning={loading} size="large">
      <ProCard
        title="基本配置"
        className="pwdBaseCard"
        bodyStyle={{
          paddingTop: 0,
          paddingBottom: 0,
          height: clientHeight - 35,
        }}
      >
        <ProForm
          size="small"
          formRef={formRef}
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
            onSubmit(values);
          }}
        >
          <div
            className="pwdContent"
            style={{ maxHeight: clientHeight - 85, overflowY: "auto" }}
          >
            <div className="secodaryTitle">认证方式</div>
            <ProFormCheckbox name="pwdAuth">账号密码认证</ProFormCheckbox>
            <ProFormCheckbox name="smsAuth">动态密码认证</ProFormCheckbox>
            <ProFormCheckbox
              name="twoFactorAuth"
              onChange={(e) => {
                if (e.target.checked) {
                  formRef.current.setFieldsValue({
                    pwdAuth: true,
                    smsAuth: true,
                  });
                }
              }}
            >
              账号密码和动态密码组合双因子认证认证
            </ProFormCheckbox>
            <ProFormCheckbox
              name="domainAutoAuth"
              onChange={(e) => {
                if (e.target.checked) {
                  formRef.current.setFieldsValue({
                    pwdAuth: true,
                  });
                }
              }}
            >
              开启PC登录域账户自动认证功能
            </ProFormCheckbox>
            <div className="secodaryTitle">忘记密码</div>
            <ProFormCheckbox name="forgotPWD">
              登录页面显示忘记密码
            </ProFormCheckbox>
            <div className="marginLeftDiv smallInput">
              <ProFormRadio.Group
                layout="vertical"
                name="modifyMode"
                fieldProps={{ layout: "vertical" }}
                options={[
                  { value: "sms", label: "短信重置（只有本地账号有效）" },
                  { value: "remote", label: "远程修改" },
                ]}
                onChange={(e) => {
                  if (e.target.value) {
                    formRef.current.setFieldsValue({ forgotPWD: true });
                  }
                }}
              />
              <div style={{ marginLeft: 24 }}>
                <ProFormText
                  name="remoteTip"
                  placeholder="显示名称"
                  width="155px"
                  addonAfter={
                    <div className="afterAntdFields">
                      <ProFormText
                        name="remoteLink"
                        placeholder="远程连接"
                        width="329px"
                      />
                    </div>
                  }
                />
              </div>
            </div>
            <div className="secodaryTitle">短信接口</div>
            <div className="modalSelect">
              <ProFormSelect
                options={[]}
                name="sms_para"
                width="200px"
                style={{ position: "relative" }}
                addonAfter={
                  <img
                    src={AddIcon}
                    style={{ cursor: "pointer", width: 14, height: 14 }}
                    onClick={() => {
                      setModalStatus(!modalStatus);
                    }}
                  />
                }
              />
            </div>
            <div className="secodaryTitle">认证信息</div>
            <ProFormCheckbox name="authTip">
              认证成功后自动跳转至认证信息页面
            </ProFormCheckbox>
            <div className="secodaryTitle">提示信息</div>
            <ProFormItem name="tipInfo">
              <ReactQuill
                theme="snow"
                style={{
                  width: "540px",
                }}
                ref={editorRef}
                modules={modules}
                // value={editorValue}
                onChange={handleChangeValue}
              />
            </ProFormItem>
            <div className="secodaryTitle">账号注册</div>
            <ProFormCheckbox name="webRegsw">
              通过WEB页面进行账号申请注册
            </ProFormCheckbox>
            <ProFormCheckbox
              name="autoRegister"
              onChange={(e) => {
                if (e.target.checked) {
                  formRef.current.setFieldsValue({
                    smsAuth: true,
                  });
                }
              }}
            >
              手机验证码登录自动注册
            </ProFormCheckbox>
            <div className="marginLeftDiv">
              <ProFormCheckbox
                name="improveInfo"
                onChange={(e) => {
                  if (e.target.checked) {
                    formRef.current.setFieldsValue({
                      autoRegister: true,
                      smsAuth: true,
                    });
                  }
                }}
              >
                首次手机验证码登录后弹出账号注册完善界面
              </ProFormCheckbox>
            </div>
            <div className="secodaryTitle">本地帐号密码安全策略</div>
            <ProFormCheckbox name="modifyFirst">
              首次登录强制修改密码
            </ProFormCheckbox>
            <ProFormCheckbox name="pwdComplexity">
              密码复杂度包括大小写字母数字组合
            </ProFormCheckbox>
            <ProFormCheckbox name="pwdLength">
              密码最小长度8位，最多长度30位
            </ProFormCheckbox>
            <ProFormCheckbox name="pwdPeriod">
              <Space className="modPwdTimesDiv">
                密码周期修改，每隔
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  <NumberField
                    type="small"
                    width="55px"
                    name="periodDay"
                    placeholder={" "}
                    afterUnit="天"
                    afterText="必须修改密码"
                  />
                </div>
              </Space>
            </ProFormCheckbox>
          </div>
          <SmsModal
            title="添加短信接口"
            status={modalStatus}
            onChange={onModalChange}
            onSubmit={onModalSubmit}
          />
        </ProForm>
      </ProCard>
    </Spin>
  );
};
export default BaseCfg;
