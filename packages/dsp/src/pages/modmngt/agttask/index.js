import React, { useState, useRef, useEffect } from "react";
import { ExclamationCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { useSelector } from "umi";
import { TableLayout } from "@/components";
import { post, postAsync } from "@/services/https";
import {
  Modal,
  Input,
  Switch,
  Tabs,
  Col,
  Space,
  TreeSelect,
  message,
  Tooltip,
  Popconfirm,
} from "antd";
import {
  DrawerForm,
  ProFormSelect,
  ProFormRadio,
  ProFormCheckbox,
  ProFormText,
  ProFormTextArea,
  ProForm,
} from "@ant-design/pro-components";
import { language } from "@/utils/language";
import { CutdropDown } from "@/common";
import "./index.less";
const { ProtableModule } = TableLayout;
const { Search } = Input;
const { confirm } = Modal;

const Agttask = () => {
  const contentHeight = useSelector(({ app }) => app.contentHeight);
  const clientHeight = contentHeight - 220;

  const columns = [
    {
      title: "任务名称",
      dataIndex: "state",
      align: "center",
      ellipsis: true,
      width: 110,
      fixed: "left",
    },
    {
      title: "任务状态",
      dataIndex: "rule_id",
      align: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: "检查类型",
      dataIndex: "info",
      align: "left",
      ellipsis: true,
    },
    {
      title: "检查时间",
      dataIndex: "alarm_num",
      align: "left",
      ellipsis: true,
      width: 150,
    },
    {
      title: "资源占用",
      dataIndex: "desc",
      align: "left",
      ellipsis: true,
      width: 150,
    },
    {
      title: "检查内容",
      dataIndex: "refcnt",
      align: "left",
      ellipsis: true,
      width: 120,
    },
    {
      title: "创建时间",
      dataIndex: "refcnt",
      align: "left",
      ellipsis: true,
      width: 150,
    },
    {
      title: "备注",
      dataIndex: "refcnt",
      align: "left",
      ellipsis: true,
      width: 120,
    },
    {
      title: "操作",
      align: "center",
      valueType: "option",
      fixed: "right",
      width: 80,
      render: (text, record, _, action) => [
        <>
          <a
            key="editable"
            onClick={() => {
              setTargetKeys([]);
              mod(record);
            }}
          >
            编辑
          </a>
        </>,
      ],
    },
  ];

  const [op, setOp] = useState("mod");
  /* 表格传参 */
  const columnvalue = "dspagttaskColunmval";
  const tableKey = "dspagttaskTable";
  const apiShowurl = "";
  let rowkey = (record) => record.rule_id;
  const addButton = true;
  const delButton = true;
  const rowSelection = true;
  const [incID, setIncID] = useState(0);
  const [queryVal, setQueryVal] = useState();
  let searchVal = { queryVal: queryVal, queryType: "fuzzy" };
  const drawformRef = useRef();
  const [drawState, setDrawState] = useState(true);

  const incAdd = () => {
    let inc;
    clearTimeout(inc);
    inc = setTimeout(() => {
      setIncID(incID + 1);
    }, 100);
  };

  const showSearch = () => {
    return (
      <Search
        placeholder="请输入"
        allowClear
        style={{ width: 200 }}
        onSearch={(queryVal) => {
          setQueryVal(queryVal);
          setIncID(incID + 1);
        }}
      />
    );
  };

  const addClick = () => {
    showDraw("open", "add");
  };

  const delClick = (selectedRowKeys, dataList, selectedRow) => {
    let sum = selectedRowKeys.length;
    confirm({
      className: "delclickbox",
      icon: <ExclamationCircleOutlined />,
      title: "确认要删除吗？",
      content: `已选择${sum}条数据`,
      onOk() {
        handleDel(selectedRow);
      },
    });
  };

  const showDraw = (state, op = "mod") => {
    console.log(111121);
    setOp(op);
    if (state == "open") {
      console.log(state);
      setDrawState(true);
    } else {
      drawformRef.current.resetFields();
      setDrawState(false);
    }
  };

  const handleAdd = (values) => {
    let data = {};
    data.state = values.state === true ? "Y" : "N";
    data.module = module;
    data.desc = values.desc;
    data.info = JSON.stringify({
      rule_content: values.rule_content,
      desc: values.desc,
    });
    post("/cfg.php?controller=confPolicy&action=add", data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      showDraw("close");
      incAdd();
    });
  };

  const handleDel = (selectedRows) => {
    let data = {};
    let ruleIDArr = selectedRows.map((e) => e.rule_id);
    data.rule_id = ruleIDArr.toString();
    post("/cfg.php?controller=confPolicy&action=del", data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      incAdd();
    });
  };

  const mod = () => {
    showDraw("open", "mod");
  };
  return (
    <div
      id="agttask"
      className="agttask"
      style={{
        position: "relative",
        height: clientHeight + 150,
        overflow: "hidden",
      }}
    >
      <ProtableModule
        tableKey={tableKey}
        columns={columns}
        clientHeight={clientHeight}
        apishowurl={apiShowurl}
        columnvalue={columnvalue}
        searchVal={searchVal}
        rowkey={rowkey}
        addButton={addButton}
        addClick={addClick}
        delButton={delButton}
        delClick={delClick}
        rowSelection={rowSelection}
        searchText={showSearch()}
        incID={incID}
      />
      <DrawerForm
        width={1060}
        onFinish={() => {}}
        // formRef={handleFormRef}
        layout="horizontal"
        title="添加任务"
        visible={drawState}
        onVisibleChange={setDrawState}
        drawerProps={{
          className: "agttaskdrawformbox",
          destroyOnClose: true,
          bodyStyle: { padding: "0 40px 0 20px" },
          headerStyle: { padding: 16 },
          placement: "right",
          closable: false,
          getContainer: false,
          style: {
            position: "absolute",
          },
          extra: (
            <CloseOutlined
              className="closeIcon"
              onClick={() => {
                optionShowModal();
              }}
            />
          ),
        }}
      >
        <div className="contentbox">
          <div className="topcontent">
            <div
              style={{
                margin: "20px 0",
                color: "#101010",
                fontWeight: 600,
              }}
            >
              任务信息
            </div>
            <div
              style={{
                marginLeft: "30px",
              }}
            >
              <div
                style={{
                  display: "flex",
                }}
              >
                <ProFormText
                  layout="vertical"
                  width={"300px"}
                  label="任务名称"
                  name="desc"
                />
                <div className="leftbox28">
                  <ProFormText
                    layout="vertical"
                    width={"629px"}
                    label="备注"
                    name="desc"
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                }}
              >
                <div
                  className="radio-width-mode"
                  style={{
                    width: "300px",
                  }}
                >
                  <ProFormRadio.Group
                    style={{
                      width: "300px",
                    }}
                    width={"300px"}
                    name="deviceType"
                    initialValue={"1"}
                    label="检查类型"
                    options={[
                      {
                        label: "常规检查",
                        value: "1",
                      },
                      {
                        label: "深度检查",
                        value: "2",
                      },
                    ]}
                    fieldProps={{
                      optionType: "button",
                      buttonStyle: "solid",
                    }}
                  />
                </div>
                <div className="leftbox28">
                  <ProFormText
                    layout="vertical"
                    width={"300px"}
                    label="检查时间"
                    name="desc"
                  />
                </div>
                <div
                  className="leftbox28 radio-width-mode"
                  style={{
                    width: "300px",
                  }}
                >
                  <ProFormRadio.Group
                    width={"300px"}
                    name="deviceT3ype"
                    label="资源占用"
                    style={{
                      width: "300px",
                    }}
                    options={[
                      {
                        label: "闲时",
                        value: "1",
                      },
                      {
                        label: "低",
                        value: "2",
                      },
                      {
                        label: "中",
                        value: "3",
                      },
                      {
                        label: "高",
                        value: "4",
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bottomcontent">
            <div>
              <div className="contenttitlebox">文件检查内容</div>
              <div className="contentbottombox">
                <div
                  className="radio-width-mode"
                  style={{
                    width: "100%",
                  }}
                >
                  <ProFormRadio.Group
                    style={{
                      width: "300px",
                    }}
                    width={"300px"}
                    name="devic1eType"
                    label="检索方式"
                    options={[
                      {
                        label: "全文检索",
                        value: "1",
                      },
                      {
                        label: "命中即返回",
                        value: "2",
                      },
                      {
                        label: "关键内容检查",
                        value: "3",
                      },
                    ]}
                    fieldProps={{
                      optionType: "button",
                      buttonStyle: "solid",
                    }}
                  />
                </div>
                <div className="checkbox-width-mode ">
                  <ProFormCheckbox.Group
                    name="e111xt"
                    label={"匹配模式"}
                    options={[
                      {
                        label: "关键字检查",
                        value: "1",
                      },
                      {
                        label: "使用分词",
                        value: "2",
                      },
                    ]}
                  />
                </div>
                <ProFormTextArea
                  name={"desc"}
                  width="300px"
                  label={"匹配内容"}
                  placeholder="多行输入"
                />
                <div className="checkbox-width-table-mode">
                  <ProFormCheckbox.Group
                    name="ext"
                    label={"文件类型"}
                    options={[
                      {
                        label: (
                          <div >
                            <CutdropDown
                              addrlist={[
                                "Word",
                                "Excel",
                                "PPT",
                                "RTF",
                                "PDF",
                                "WPS",
                              ]}
                              text="OFFICE文档"
                            />
                          </div>
                        ),
                        value: "1",
                      },
                      {
                        label: "图形文档",
                        value: "2",
                      },
                      {
                        label: "文本文档",
                        value: "3",
                      },
                      {
                        label: "设计类文档",
                        value: "4",
                      },
                      {
                        label: "虚拟磁盘文件",
                        value: "5",
                      },
                      {
                        label: "压缩文件类型",
                        value: "6",
                      },
                      {
                        label: "其他文件类型",
                        value: "7",
                      },
                      {
                        label: "指定文件类型",
                        value: "8",
                      },
                    ]}
                  />
                </div>
                <div className="checkbox-width-arrange-mode">
                  <ProFormCheckbox.Group
                    name="ext12"
                    label={"高级检查"}
                    options={[
                      {
                        label: "在压缩文件中检查以上文件类型",
                        value: "1",
                      },
                      {
                        label: "在邮件文件中检查以上文件类型",
                        value: "2",
                      },
                      {
                        label: "检查文件中内嵌图片",
                        value: "3",
                      },
                      {
                        label: "嵌套文件检查（夹带文件）",
                        value: "4",
                      },
                      {
                        label: "密标文件检查",
                        value: "5",
                      },
                    ]}
                  />
                </div>
                <div className="checkbox-width-arrange-mode formmaringbuttom5">
                  <ProFormCheckbox.Group
                    name="e1xt12"
                    label={"检查位置"}
                    options={[
                      {
                        label: "检查文件名",
                        value: "1",
                      },
                      {
                        label: "检查文件内容",
                        value: "2",
                      },
                      {
                        label: (
                          <div style={{ display: "flex" }}>
                            <div
                              style={{
                                marginRight: "5px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              仅关键内容检查，检查文件前
                            </div>
                            <div className="formmaringbuttom0">
                              <ProFormText
                                fieldProps={{
                                  size: "small",
                                }}
                                name="filecon"
                                width={"65px"}
                              />
                            </div>
                            <div
                              style={{
                                marginLeft: "5px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              个字符
                            </div>
                          </div>
                        ),
                        value: "3",
                      },
                    ]}
                  />
                </div>
                <div className="checkbox-width-table-mode">
                  <ProFormCheckbox.Group
                    name="e2x34t"
                    label={"检查范围"}
                    options={[
                      {
                        label: "系统分区",
                        value: "1",
                      },
                      {
                        label: "非系统分区",
                        value: "2",
                      },
                      {
                        label: "桌面",
                        value: "3",
                      },
                      {
                        label: "我的文档",
                        value: "4",
                      },
                      {
                        label: "全盘",
                        value: "5",
                      },
                      {
                        label: "指定目录",
                        value: "6",
                      },
                    ]}
                  />
                </div>
                <ProFormText label={" "} width="300px" />
                <div className="checkbox-width-arrange-mode">
                  <ProFormCheckbox.Group
                    name="e12xt12"
                    label={"检查限制"}
                    fieldProps={{
                      size: "small",
                    }}
                    options={[
                      {
                        label: (
                          <div style={{ display: "flex" }}>
                            <div
                              style={{
                                marginRight: "5px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              忽略大文件检查，最大限制值
                            </div>
                            <div className="formmaringbuttom0">
                              <ProFormText
                                fieldProps={{
                                  size: "small",
                                }}
                                name="filecon"
                                width={"65px"}
                              />
                            </div>
                          </div>
                        ),
                        value: "1",
                      },
                    ]}
                  />
                </div>
                <div className="checkbox-width-arrange-mode">
                  <ProFormCheckbox.Group
                    name="e12xt12"
                    label={"样式数据"}
                    fieldProps={{
                      size: "small",
                    }}
                    options={[
                      {
                        label: (
                          <div style={{ whiteSpace: "nowrap" }}>
                            对样式数据提取，按如下限制进行：
                          </div>
                        ),
                        value: "1",
                      },
                    ]}
                  />
                </div>
                <div
                  className="lang-width-label small-height-label"
                  style={{
                    marginLeft: "89px",
                  }}
                >
                  <ProFormText
                    fieldProps={{
                      size: "small",
                    }}
                    label={"文件摘要长度"}
                    name="ca"
                    width={"157px"}
                  />
                  <ProFormText
                    fieldProps={{
                      size: "small",
                    }}
                    label={"行数最多限制"}
                    name="c1a"
                    width={"157px"}
                  />
                </div>
              </div>
            </div>
            <div
              style={{
                marginLeft: "22px",
              }}
            >
              <div className="contenttitlebox">其他检查内容</div>
              <div className="contentbottombox">
                <div className="checkbox-width-arrange-mode">
                  <ProFormCheckbox.Group
                    name="e1212xt12"
                    label={"基本检查项"}
                    fieldProps={{
                      size: "small",
                    }}
                    options={[
                      {
                        label: "全选",
                        value: "1",
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DrawerForm>
    </div>
  );
};

export default Agttask;
