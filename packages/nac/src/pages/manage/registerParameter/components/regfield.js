import React, { useRef, useState, useEffect } from "react";
import { Row, Switch, Tooltip } from "antd";
import {
  DrawerForm,
  ProFormText,
  ProFormRadio,
  ProFormCheckbox,
  ProFormSwitch,
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
import { NameText } from "@/utils/fromTypeLabel";
const { ProtableModule, WebUploadr } = TableLayout;
let H = document.body.clientHeight - 118;
var clientHeight = H;
export default () => {
  const columns = [
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
      render: (_, record) => {
        let text = "选择框";
        if (record.form == "input") text = "输入框";
        return text;
      },
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
      title: "应用范围",
      dataIndex: "applist",
      ellipsis: true,
      width: "140px",
      align: "left",
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
  const rowKey = (record) => record.id; //列表唯一值
  const tableHeight = clientHeight - 100; //列表高度
  const tableKey = "registerParameter"; //table 定义的key
  const rowSelection = true; //是否开启多选框
  const addButton = false; //增加按钮  与 addClick 方法 组合使用
  const delButton = false; //删除按钮 与 delClick 方法 组合使用
  const uploadButton = false; //导入按钮 与 uploadClick 方法 组合使用
  const downloadButton = false; //导出按钮 与 downloadClick 方法 组合使用
  const [incID, setIncID] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  const columnvalue = "registerParametercolumnvalue"; //设置默认显示的 key 变动 set.strot 存储key
  const apishowurl = "/cfg.php?controller=webreg&action=showWEBRegFieldList"; //接口路径
  let searchVal = {}; //顶部搜索框值 传入接口

  //初始默认列
  const concealColumns = {
    id: { show: false },
    createTime: { show: false },
    updateTime: { show: false },
  };
  /* 顶部左侧搜索框*/
  const tableTopSearch = () => {
    return (
      <div style={{ fontSize: "16px", color: "#242424" }}>注册字段配置</div>
    );
  };

  /** table组件 end */

  const formRef = useRef();
  const [activeKey, setActiveKey] = useState("bh");
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
        concealColumns={concealColumns}
        columns={columns}
        apishowurl={apishowurl}
        incID={incID}
        clientHeight={tableHeight}
        columnvalue={columnvalue}
        tableKey={tableKey}
        searchText={tableTopSearch()}
        searchVal={searchVal}
        rowkey={rowKey}
        delButton={delButton}
        addButton={addButton}
        rowSelection={rowSelection}
        uploadButton={uploadButton}
        downloadButton={downloadButton}
      />
      <DrawerForm
        // {...drawFromLayout}
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
