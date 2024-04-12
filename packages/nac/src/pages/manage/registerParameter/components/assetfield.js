import React, { useRef, useState, useEffect } from "react";
import { Modal, Tabs, Switch, Tooltip } from "antd";
import {
  DrawerForm,
  ProForm,
  ProFormText,
  ProFormRadio,
  ProFormCheckbox,
  ProFormSwitch,
  ProCard,
} from "@ant-design/pro-components";
import { language } from "@/utils/language";
import { post, postAsync } from "@/services/https";
import { PlusOutlined } from "@ant-design/icons";
import "@/utils/index.less";
import "@/common/common.less";
import "./../index.less";
import SaveSvg from "@/assets/nac/save.svg";
import { ReactComponent as WDel } from "@/assets/nac/security/wdel.svg";
import { regList, regUrlList } from "@/utils/regExp";
import { TableLayout, AmTag } from "@/components";
import { CutdropDown } from "@/common";
import { EditTable, NameText } from "@/utils/fromTypeLabel";
const { ProtableModule, WebUploadr } = TableLayout;
const { confirm } = Modal;
const { TabPane } = Tabs;
let H = document.body.clientHeight - 118;
var clientHeight = H;
export default () => {
  const columns1 = [
    {
      title: "状态",
      dataIndex: "sw",
      align: "center",
      ellipsis: true,
      width: 80,
      filters: true,
      fixed: "left",
      filterMultiple: false,
      valueEnum: {
        Y: { text: language("project.open") },
        N: { text: language("project.close") },
      },
      render: (text, record, index) => {
        let checked = true;
        if (record.sw == "N") {
          checked = false;
        }
        return (
          <Switch
            checkedChildren={language("project.open")}
            unCheckedChildren={language("project.close")}
            checked={checked}
            onChange={(checked) => {
              // statusSave(record, checked);
            }}
          />
        );
      },
    },
    {
      title: "内容项",
      dataIndex: "name",
      ellipsis: true,
      width: "100px",
      align: "left",
    },
    {
      title: "显示标题",
      dataIndex: "title",
      ellipsis: true,
      width: "100px",
      align: "left",
    },
    {
      title: "形式",
      dataIndex: "form",
      width: "60px",
      ellipsis: true,
      align: "left",
    },
    {
      title: "必填项",
      dataIndex: "status",
      ellipsis: true,
      width: "60px",
      align: "left",
      render: (text, record) => {
        let name = "是";
        if (record.status == "N") {
          name = "否";
        }
        return name;
      },
    },
    {
      title: "显示内容",
      ellipsis: true,
      dataIndex: "content",
      align: "left",
      render: (text, record) => {
        return (
          <>
            <CutdropDown addrlist={record.content} />
          </>
        );
      },
    },
    {
      title: language("project.operate"),
      valueType: "option",
      width: "80px",
      fixed: "right",
      align: "center",
      render: (text, record, _, action) => [
        <>
          <a
            key="editable"
            onClick={() => {
              mod(record, "mod");
            }}
          >
            <Tooltip title={language("project.deit")}>
              <img src={SaveSvg} />
            </Tooltip>
          </a>
        </>,
      ],
    },
  ];
  /** table组件 start */
  const rowKey1 = (record) => record.id; //列表唯一值
  const tableHeight1 = clientHeight - 100; //列表高度
  const tableKey1 = "registerParameter"; //table 定义的key
  const rowSelection1 = true; //是否开启多选框
  const addButton1 = false; //增加按钮  与 addClick 方法 组合使用
  const delButton1 = false; //删除按钮 与 delClick 方法 组合使用
  const uploadButton1 = false; //导入按钮 与 uploadClick 方法 组合使用
  const downloadButton1 = false; //导出按钮 与 downloadClick 方法 组合使用
  const [incID1, setIncID1] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  const columnvalue1 = "registerParametercolumnvalue"; //设置默认显示的 key 变动 set.strot 存储key
  const apishowurl1 = "/cfg.php?controller=webreg&action=showWEBRegFieldList"; //接口路径
  let searchVal1 = {}; //顶部搜索框值 传入接口

  //初始默认列
  const concealColumns1 = {
    id: { show: false },
    createTime: { show: false },
    updateTime: { show: false },
  };
  /* 顶部左侧搜索框*/
  const tableTopSearch1 = () => {
    return (
      <div style={{ fontSize: "16px", color: "#242424" }}>资产字段配置</div>
    );
  };

  /** table组件 end */

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
      <ProtableModule
        concealColumns={concealColumns1}
        columns={columns1}
        apishowurl={apishowurl1}
        incID={incID1}
        clientHeight={tableHeight1}
        columnvalue={columnvalue1}
        tableKey={tableKey1}
        searchText={tableTopSearch1()}
        searchVal={searchVal1}
        rowkey={rowKey1}
        delButton={delButton1}
        addButton={addButton1}
        rowSelection={rowSelection1}
        uploadButton={uploadButton1}
        downloadButton={downloadButton1}
      />
      <DrawerForm
        layout="horizontal"
        width={"400px"}
        formRef={formRef}
        title={"编辑"}
        visible={modalStatus}
        autoFocusFirstInput
        drawerProps={{
          className: "drawmregisterfrom",
          destroyOnClose: true,
          maskClosable: false,
          placement: "right",
          onClose: () => {
            getModal(2);
          },
        }}
        onVisibleChange={setModalStatus}
        submitTimeout={2000}
        onFinish={async (values) => {
          save(values);
        }}
      >
        <ProFormText name={"id"} hidden={true} />
        <ProFormSwitch
          checkedChildren={language("project.enable")}
          unCheckedChildren={language("project.disable")}
          name="sw"
          label={language("usrmngt.deptsync.state")}
        />

        <NameText name="name" label={"内容项"} required={true} />
        <NameText name="title" label={"标题显示"} required={true} />
        <div className="radiobox">
          <ProFormRadio.Group
            name="status"
            id="status"
            label={"是否必填"}
            options={[
              {
                label: (
                  <div style={{ width: "100px", display: "inline-block" }}>
                    是
                  </div>
                ),
                value: "Y",
              },
              { label: "否", value: "N" },
            ]}
          />
        </div>

        <ProFormCheckbox.Group
          label={"应用于"}
          name={"applist"}
          options={[
            {
              label: <div style={{ width: "100px" }}>Web端</div>,
              value: "web",
            },
            { label: "客户端", value: "client" },
          ]}
        />
        <ProFormRadio.Group
          label={"形式"}
          name="form"
          id="form"
          fieldProps={{
            buttonStyle: "solid",
            optionType: "button",
          }}
          onChange={(e) => {
            setFormType(e.target.value);
          }}
          options={[
            { label: "输入框", value: "input" },
            { label: "选择框", value: "select" },
          ]}
        />
        {formType == "select" && (
          <ProFormText label={"显示内容"}>
            <div className="showcontentbox">
              {contentList.map((item, index) => {
                return (
                  <div
                    className="contentlistbox"
                    onMouseEnter={(e) => {
                      setIsHovering(index);
                    }}
                    onMouseLeave={(e) => {
                      setIsHovering("");
                    }}
                  >
                    <div>{item}</div>
                    {isHovering === index ? (
                      <div>
                        <WDel
                          onClick={() => {
                            delContent(index);
                          }}
                          style={{
                            cursor: "pointer",
                            fill: "red",
                            fontSize: "16px",
                          }}
                        />
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="optioncontentbox">
              <ProFormText name={"contentVal"} width={"180px"} />
              <div
                style={{ lineHeight: "30px", marginLeft: "12px" }}
                onClick={() => {
                  addContent();
                }}
              >
                <PlusOutlined />
                <span style={{ marginLeft: "5px" }}>添加</span>
              </div>
            </div>
          </ProFormText>
        )}
      </DrawerForm>
    </div>
  );
};
