import React, { useState, useRef, useEffect } from "react";
import "./keyword.less";
import EditIcon from "@/assets/operate/edit.svg";
import RevokeIcon from "@/assets/operate/revoke.svg"; /* 撤销 */
import DisRevokeIcon from "@/assets/operate/disRevoke.svg";
import DistributeIcon from "@/assets/operate/distribute.svg"; /* 分发 */
import DisDistributeIcon from "@/assets/operate/disDistribute.svg";
import AssociaIcon from "@/assets/operate/association.svg"; /* 关联 */
import DisAssociaIcon from "@/assets/operate/disAssociation.svg";
import SmallEditIcon from "@/assets/operate/smallEdit.svg";
import DelIcon from "@/assets/operate/del.svg";
import { ExclamationCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { useSelector } from "umi";
import { TableLayout } from "@/components";
import { post, postAsync } from "@/services/https";
import DrawerPolicy from "@/common/drawerPolicy";
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
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { language } from "@/utils/language";

const { ProtableModule } = TableLayout;
const { Search } = Input;
const { confirm } = Modal;

const Keyword = () => {
  const contentHeight = useSelector(({ app }) => app.contentHeight);
  const clientHeight = contentHeight - 220;

  const [policyState, setPolicyState] = useState(false);
  const [rowData, setRowData] = useState({});
  const [operateType, setOperateType] = useState("");

  const fileTypeList = [
    { label: "文档", value: 1 },
    { label: "图片", value: 2 },
    { label: "文本文件", value: 3 },
    { label: "压缩包", value: 4 },
    { label: "邮件", value: 5 },
  ];

  const columns = [
    {
      title: "策略状态",
      dataIndex: "state",
      align: "center",
      ellipsis: true,
      width: 110,
      fixed: "left",
      filters: true,
      filterMultiple: false,
      valueEnum: {
        Y: { text: "开" },
        N: { text: "关" },
      },
      render: (text, record, index) => {
        let disabled = false;
        if (record.from == "remote") {
          disabled = true;
        }
        let checked = true;
        if (record.state == "N") {
          checked = false;
        }
        return (
          <Switch
            checkedChildren={"开"}
            unCheckedChildren={"关"}
            disabled={disabled}
            checked={checked}
            onChange={async (checked) => {
              switchChange(record, checked);
            }}
          />
        );
      },
    },
    {
      title: "策略ID",
      dataIndex: "rule_id",
      align: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: "策略内容",
      dataIndex: "info",
      align: "left",
      ellipsis: true,
      render: (text, record, index) => {
        return record?.info?.rule_content;
      },
    },
    {
      title: "最少命中次数",
      dataIndex: "min_match_count",
      align: "left",
      ellipsis: true,
      width: 200,
      render: (text, record, index) => {
        return record?.info?.min_match_count;
      },
    },
    {
      title: "文件过滤类型",
      dataIndex: "filter_file_type",
      align: "left",
      ellipsis: true,
      width: 150,
      render: (text, record, index) => {
        let content = [];
        if (
          record?.info?.filter_file_type &&
          record?.info?.filter_file_type.length >= 1
        ) {
          fileTypeList.map((item) => {
            if (record?.info?.filter_file_type.indexOf(item.value) >= 0) {
              content.push(item.label);
            }
          });
        }
        if (content.length >= 1) {
          return content.join(",");
        }
      },
    },
    {
      title: "文件过滤大小",
      dataIndex: "filter_file_size",
      align: "left",
      ellipsis: true,
      width: 200,
      render: (text, record, _, action) => {
        return (
          <Space>
            <div>最大值：{record?.info?.filter_file_size?.max_size}</div>
            <div>
              最小值：
              {record?.info?.filter_file_size?.min_size}
            </div>
          </Space>
        );
      },
    },
    {
      title: "告警数量",
      dataIndex: "alarm_num",
      align: "left",
      ellipsis: true,
      width: 150,
    },
    {
      title: "描述",
      dataIndex: "desc",
      align: "left",
      ellipsis: true,
      width: 150,
      render: (text, record, index) => {
        return record?.desc;
      },
    },
    {
      title: "关联设备",
      dataIndex: "refcnt",
      align: "left",
      ellipsis: true,
      width: 120,
      render: (text, record, _, action) => {
        return (
          <div style={{ display: "flex" }}>
            <div style={{ width: "16px" }}>{record.refcnt}</div>
            {record.refcnt == 0 ? (
              <img
                src={DisAssociaIcon}
                style={{ cursor: "not-allowed", marginLeft: 8 }}
              />
            ) : (
              <a
                style={{ marginLeft: 8 }}
                onClick={() => {
                  showPolicy("open");
                  setRowData(record);
                  setOperateType("assoc");
                }}
              >
                <img src={AssociaIcon} alt="" />
              </a>
            )}
          </div>
        );
      },
    },
    {
      title: "备注",
      dataIndex: "notes",
      align: "left",
      ellipsis: true,
      width: 160,
    },
    {
      title: "操作",
      align: "center",
      valueType: "option",
      fixed: "right",
      width: 120,
      render: (text, record, _, action) => {
        return (
          <Space size="middle">
            <Tooltip title="分发">
              <a
                onClick={() => {
                  // message.success({
                  //   content: "分发完成！已关联一台设备",
                  // });
                  showPolicy("open");
                  setRowData(record);
                  setOperateType("distribute");
                }}
              >
                <img src={DistributeIcon} alt="" /> {/* 分发 */}
              </a>
            </Tooltip>
            <Tooltip title={"撤销"}>
              <a
                onClick={() => {
                  showPolicy("open");
                  setRowData(record);
                  setOperateType("revoke");
                  // message.success({
                  //   content: "撤销完成！已撤销一台设备",
                  // });
                }}
              >
                <img src={RevokeIcon} alt="" /> {/* 撤销 */}
              </a>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  /* 表格传参 */
  const module = "keyword_detect";
  const columnvalue = "mgchKeyWordColunmval";
  const tableKey = "mgchKeyWordTable";
  const apiShowurl = "/cfg.php?controller=confPolicy&action=show";
  let rowkey = (record) => record.rule_id;
  const addButton = true;
  const addTitle = "新建";
  const delButton = true;
  const rowSelection = true;
  const [incID, setIncID] = useState(0);
  const [queryVal, setQueryVal] = useState();
  let searchVal = { queryVal: queryVal, queryType: "fuzzy", module: module };
  const drawformRef = useRef();
  const [drawState, setDrawState] = useState(false);

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
    showDraw("open");
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

  const showDraw = (state) => {
    if (state == "open") {
      setDrawState(true);
    } else {
      drawformRef.current.resetFields();
      setDrawState(false);
    }
  };

  const showPolicy = (state) => {
    if (state == "open") {
      setPolicyState(true);
    } else {
      setPolicyState(false);
    }
  };

  const handleAdd = (values) => {
    let data = {};
    data.module = module;
    data.state = values.state === true ? "Y" : "N";
    data.desc = values.desc;
    data.info = JSON.stringify({
      filter_file_type: values.filter_file_type,
      min_match_count: values.min_match_count,
      rule_content: values.rule_content,
      desc: values.desc,
      filter_file_size: {
        min_size: values.min_size,
        max_size: values.max_size,
      },
    });
    post("/cfg.php?controller=confPolicy&action=add", data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      showDraw("close")
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

  /* 启用禁用 */
  const switchChange = (each, checked) => {
    let data = {};
    data.rule_id = each.rule_id;
    let state = "N";
    if (checked) {
      state = "Y";
    }
    data.state = state;
    post("/cfg.php?controller=confPolicy&action=enable", data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        message.success(res.msg);
        incAdd();
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  return (
    <div
      id="keywordDiv"
      className="keywordDiv"
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
        addTitle={addTitle}
        addClick={addClick}
        delButton={delButton}
        delClick={delClick}
        rowSelection={rowSelection}
        searchText={showSearch()}
        incID={incID}
      />
      <DrawerForm
        title="新增"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        layout="horizontal"
        formRef={drawformRef}
        drawerProps={{
          placement: "right",
          closable: false,
          getContainer: () => document.getElementById("keywordDiv"),
          style: {
            position: "absolute",
          },
          width: "450px",
          extra: (
            <div>
              <span
                onClick={() => {
                  showDraw("close");
                }}
                style={{ cursor: "pointer" }}
              >
                <CloseOutlined />
              </span>
            </div>
          ),
          onClose: () => {
            showDraw("close");
          },
        }}
        autoFocusFirstInput
        submitTimeout={2000}
        visible={drawState}
        onVisibleChange={setDrawState}
        onFinish={(values) => {
          handleAdd(values);
        }}
      >
        <div>
          <ProFormSwitch
            label="策略状态"
            name="state"
            checkedChildren="开启"
            unCheckedChildren="关闭"
          />
          <ProFormText label="最少命中次数" name="min_match_count" />
          <ProFormSelect
            label="文件过滤类型"
            name="filter_file_type"
            options={fileTypeList}
            fieldProps={{
              mode: "multiple",
            }}
          />
          <div className="fileSizeDiv">
            <ProFormText
              label="文件过滤大小"
              name="min_size"
              placeholder="最小"
              width="92px"
              addonAfter={
                <div className="afterFields">
                  <div className="afterUnit">KB</div>
                  <div style={{ marginLeft: 8 }}>
                    <ProFormText
                      name="max_size"
                      width="129px"
                      placeholder="最大"
                      fieldProps={{ addonAfter: "KB" }}
                    />
                  </div>
                </div>
              }
            />
          </div>
          <ProFormTextArea label="策略内容" name="rule_content" />
          <ProFormText label="描述" name="desc" />
        </div>
      </DrawerForm>
      <DrawerPolicy
        visible={policyState}
        setVisible={setPolicyState}
        rowInfo={rowData}
        operate={operateType}
        type={"policy"}
        module={module}
      />
    </div>
  );
};
export default Keyword;
