import React, { useEffect, useRef, useState } from "react";
import {
  ProCard,
  ProForm,
  ProFormCheckbox,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import { Spin, Button, Space, Tooltip, Popconfirm, message } from "antd";
import { language } from "@/utils/language";
import { SaveOutlined } from "@ant-design/icons";
import SmsModal from "../../userauth/pwdauth/components/smsModal";
import AddIcon from "@/assets/nac/add.svg";
import DisAddIcon from "@/assets/nac/disAdd.svg";
import DelIcon from "@/assets/nac/del.svg";
import EditIcon from "@/assets/nac/saEdit.svg";
import EditTable from "@/components/Module/tinyEditTable/tinyEditTable";
import { post } from "@/services/https";
import "react-quill/dist/quill.snow.css";
import { NumberField } from "@/common/fun/formTypeCon";
import ReactQuill, { Quill } from "react-quill";
import { debounce } from "lodash";
import "./configur.less";
import "./richEditor.less";
let H = document.body.clientHeight - 153;
let clientHeight = H;

export default () => {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [modalStatus, setModalStatus] = useState(false);
  const [domainList, setDomainList] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const editorRef = useRef(null);
  const [editorValue, setEditorValue] = useState("");
  const [allocateType, setAllocateType] = useState("");

  const columns = [
    {
      title: "访问域名称",
      dataIndex: "name",
      key: "name",
      align: "left",
      ellipsis: true,
      width: 120,
    },
    {
      title: "访问权限",
      dataIndex: "permission",
      key: "permission",
      align: "center",
      ellipsis: true,
      width: 100,
      valueType: "select",
      request: async () => {
        return domainList;
      },
    },
    {
      title: "审批方式",
      dataIndex: "allocation",
      key: "allocation",
      align: "center",
      ellipsis: true,
      width: 100,
      valueType: "select",
      request: async () => [
        {
          value: "auto",
          label: "自动分配",
        },
        {
          value: "manual",
          label: "手动分配",
        },
      ],
    },
    {
      title: "操作",
      key: "option",
      align: "center",
      valueType: "option",
      ellipsis: true,
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

  const getConfig = () => {
    post("/cfg.php?controller=guest&action=guest_cfg_get").then((res) => {
      if (!res.success) {
        message.error(res.msg);
        setLoading(false);
        return false;
      }
      let values = res.data;
      for (const key in values) {
        if (values[key] === "Y") {
          values[key] = true;
        } else if (values[key] === "N") {
          values[key] = false;
        }
      }
      let list = [];
      res.data?.allocate_list.map((item, index) => {
        list.push({
          id: index,
          name: item.name,
          allocation: item.allocation,
          permission: item.permission,
        });
      });
      setDataSource(list);
      formRef.current?.setFieldsValue(values);
      setAllocateType(values.allocate_type);
      setLoading(false);
    });
  };

  const getDomainList = () => {
    post("/cfg.php?controller=securityDomain&action=show_securitydomain").then(
      (res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        let list = [];
        res?.data.map((item) => {
          list.push({ value: item.value, label: item.text });
        });
        setDomainList(list);
      }
    );
  };

  const onModalChange = (state) => {
    setModalStatus(state);
  };

  const onModalSubmit = (values) => {
    console.log(values);
    setModalStatus(!modalStatus);
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
    let list = [];
    dataSource.map((item) => {
      list.push({
        name: item.name,
        allocation: item.allocation,
        permission: item.permission,
      });
    });
    obj.allocate_list = list;
    post("/cfg.php?controller=guest&action=guest_cfg_set", obj).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      getConfig();
    });
  };

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
  ] = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" id="addHrSvg">
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

  let addHrBut = document.getElementById("addHrSvg");

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

  return (
    <ProCard
      title="参数配置"
      className="configurCard"
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
          className="configurForm"
          // labelCol={{ flex: "80px" }}
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
            <div className="secodaryTitle">申请配置</div>
            <div className="checkbocDiv">
              <ProFormCheckbox name="status">
                通过WEB页面进行访客账号申请并分配上网码
              </ProFormCheckbox>
              <ProFormCheckbox name="sms_sw">
                申请时进行短信验证（需要申请字段中包含手机号）
              </ProFormCheckbox>
              <ProFormCheckbox name="qrcode_sw">
                开启员工扫码审批访客申请信息（需要员工通过身份认证）
              </ProFormCheckbox>
            </div>
            <div className="radioGroupDiv">
              <ProFormRadio.Group
                name="allocate_type"
                label="账号分配"
                options={[
                  { value: "auto", label: "自动分配" },
                  { value: "manual", label: "手动分配" },
                  { value: "dynamic", label: "动态分配" },
                ]}
                onChange={(e) => {
                  if (e.target.value) {
                    setAllocateType(e.target.value);
                  }
                }}
              />
            </div>
            {allocateType === "dynamic" && (
              <div className="marginLeftDiv" name="allocate_list">
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
            )}
            <div className="pwdcodegetDiv">
              <ProFormRadio.Group
                label="上网码获取"
                name="pwdcode_get"
                options={[
                  { value: "web", label: "WEB查询" },
                  { value: "sms", label: "短信发送" },
                ]}
              />
            </div>
            <div className="modalSelect">
              <ProFormSelect
                label="短信接口"
                name="sms_para"
                options={[]}
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
            <div className="secodaryTitle">账号设置</div>
            <div className="modalSelect">
              <ProFormSelect
                label="默认访问权限"
                name="authority"
                options={domainList}
                width="200px"
                disabled={allocateType === "dynamic"}
                style={{ position: "relative" }}
                addonAfter={
                  allocateType === "dynamic" ? (
                    <img
                      src={DisAddIcon}
                      style={{ width: 14, height: 14, cursor: "not-allowed" }}
                      onClick={() => {
                        // setModalStatus(!modalStatus);
                      }}
                    />
                  ) : (
                    <img
                      src={AddIcon}
                      style={{ cursor: "pointer", width: 14, height: 14 }}
                      onClick={() => {
                        setModalStatus(!modalStatus);
                      }}
                    />
                  )
                }
              />
            </div>
            <div className="smallFieldsDiv">
              <NumberField
                label="默认使用期限"
                width="67px"
                name="use_time"
                placeholder={" "}
                type="small"
                afterUnit="小时"
              />
              <NumberField
                label="在线超时时间"
                width="67px"
                name="offline"
                placeholder={" "}
                type="small"
                afterUnit="分钟"
              />
              <NumberField
                label="到期保留时间"
                width="67px"
                name="expire_del"
                placeholder={" "}
                type="small"
                afterUnit="天"
              />
            </div>
            <div className="secodaryTitle">登录认证</div>
            <div className="pwdcodegetDiv">
              <ProFormRadio.Group
                label="登录认证方式"
                name="guest_autype"
                options={[
                  { value: "pwd", label: "上网码认证" },
                  { value: "dpwd", label: "动态密码认证" },
                ]}
              />
            </div>
            <ProFormText name="tip_info" label="登录成功提示">
              <ReactQuill
                theme="snow"
                style={{
                  width: "540px",
                }}
                ref={editorRef}
                modules={modules}
                // onChange={handleChangeValue}
              />
            </ProFormText>
          </div>
        </ProForm>
        <SmsModal
          title="添加短信接口"
          status={modalStatus}
          onChange={onModalChange}
          onSubmit={onModalSubmit}
        />
      </Spin>
    </ProCard>
  );
};
