import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "umi";
import {
  Modal,
  Input,
  Tag,
  Tabs,
  Col,
  Space,
  TreeSelect,
  message,
  Tree,
} from "antd";
import "./members.less";
import { get, post } from "@/services/https";
import { language } from "@/utils/language";
import { TableLayout, LeftTree, CardModal } from "@/components";
import { ExclamationCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { regSeletcList, regList } from "@/utils/regExp";
import store from "store";
import { DrawerForm, ProFormText } from "@ant-design/pro-components";
const { ProtableModule } = TableLayout;
const { Search } = Input;
const { confirm } = Modal;

export default () => {
  const contentHeight = useSelector(({ app }) => app.contentHeight);
  const clientHeight = contentHeight - 220;
  const drawformRef = useRef();
  const [drawState, setDrawState] = useState(false);
  const [orgID, setOrgID] = useState(0);
  const [opcode, setOpcode] = useState("");
  const orgType = "org";
  const [orgValue, setOrgValue] = useState();
  const [orgkey, setOrgkey] = useState([]); //选中多个key
  const [orgData, setOrgData] = useState([]);
  const [orgVal, setOrgVal] = useState(); //添加组织结构id

  const columns = [
    {
      title: "人员姓名",
      dataIndex: "name",
      align: "left",
      ellipsis: true,
      width: 160,
    },
    {
      title: "人员编号",
      dataIndex: "id",
      align: "left",
      ellipsis: true,
      width: 160,
    },
    {
      title: "所属机构",
      dataIndex: "org",
      align: "left",
      ellipsis: true,
      width: 160,
    },
    {
      title: "行政职务",
      dataIndex: "position",
      align: "left",
      ellipsis: true,
      width: 160,
    },
    {
      title: "人员类型",
      dataIndex: "type",
      align: "left",
      ellipsis: true,
      width: 120,
    },
    {
      title: "联系电话",
      dataIndex: "phone",
      align: "left",
      ellipsis: true,
      width: 140,
    },
    {
      title: "备注",
      dataIndex: "note",
      align: "left",
      ellipsis: true,
    },
    {
      title: "操作",
      align: "center",
      valueType: "option",
      fixed: "right",
      width: 120,
      render: (text, record, _, action) => {
        return (
          <Space>
            <a
              onClick={() => {
                editClick(record, "mod");
              }}
            >
              编辑
            </a>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    store.set("memberTable", 50);
  }, []);

  /* 组织机构传参 */
  const treeUrl = "/cfg.php?controller=confZoneManage&action=showZoneTree";
  const leftTreeData = { id: 1, type: "tree", depth: "1" };
  const [treeInc, setTreeInc] = useState(0);

  /* 表格传参 */
  const rowKey = (record) => record.id; //列表唯一值
  const tableHeight = clientHeight - 10; //列表高度
  const tableKey = "memberTable"; //table 定义的key
  const rowSelection = true; //是否开启多选框
  const addButton = true; //增加按钮  与 addClick 方法 组合使用
  const delButton = true; //删除按钮 与 delClick 方法 组合使用
  const [incID, setIncID] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  const columnvalue = "membercolumnvalue"; //设置默认显示的 key 变动 set.strot 存储key
  const apishowurl = "/cfg.php?controller=confUserlist&action=show"; //接口路径
  const [queryVal, setQueryVal] = useState(); //首个搜索框的值
  let searchVal = { value: queryVal, type: "fuzzy", orgID: orgID }; //顶部搜索框值 传入接口

  //组织机构处理
  const getTreeLeft = (res) => {
    let nowId = res.node.id;
    setOrgID(nowId);
    getOrg(nowId);
  };

  // 组织机构侧边点击id处理
  const onSelectLeft = (selectedKeys, info) => {
    setOrgID(selectedKeys[0]); //更新选中地址id
    getOrg(selectedKeys[0]);
    incAdd();
  };

  const getOrg = (id = "") => {
    let data = {};
    data.id = id ? id : orgID ? orgID : 1;
    data.type = orgType;
    post("/cfg.php?controller=confZoneManage&action=showZoneTree", data)
      .then((res) => {
        if (res.children.length > 0) {
          const treeInfoData = [];
          res.children.map((item) => {
            let isLeaf = true;
            if (item.leaf == "N") {
              isLeaf = false;
            }
            treeInfoData.push({
              id: item.id,
              pId: item.gpid,
              value: item.id,
              title: item.name,
              isLeaf: isLeaf,
            });
          });
          setOrgData(treeInfoData);
        }
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  // 组织机构 查找父节点的值
  const orgwirelessVal = (value, parentId = false) => {
    let cValue = [];
    if (!parentId) {
      cValue.push(value);
    }
    orgData.forEach((each, index) => {
      if (each.id == value) {
        if (each.pId != 0) {
          orgData.forEach((item, key) => {
            if (each.pId == item.id) {
              if (item.pId != 0) {
                let wirelessArr = orgwirelessVal(item.id, 999);
                cValue.push(item.id);
                cValue.push.apply(cValue, wirelessArr); //[1,2,3,4,5]
              } else {
                cValue.push(item.id);
              }
            }
          });
        } else {
          if (parentId) {
            cValue.push(each.id);
          }
        }
      }
    });
    return cValue;
  };

  // 组织机构 下拉列表选中
  const onOrgSelect = (value, label, extra) => {
    let selKye = orgwirelessVal(value);
    selKye = selKye.reverse(); //数组反转
    let selVal = []; //选中内容
    selKye.forEach((i) => {
      orgData.forEach((item, key) => {
        if (i == item.value) {
          selVal.push(item.title);
        }
      });
    });
    let selKyeNum = selKye[selKye.length - 1];
    let selValNum = selVal[selVal.length - 1];
    drawformRef.current.setFieldsValue({ orgID: selKyeNum });
    setOrgValue(selVal.join("/"));
    setOrgkey(selKye);
    setOrgVal(selKyeNum);
    // setOrgNameVal(selValNum);
  };

  //组织机构 下拉处理
  const onOrgData = ({ id, children }) =>
    new Promise((resolve) => {
      if (children) {
        resolve();
        return;
      }
      let info = [];
      let data = {};
      data.id = id;
      data.type = orgType;
      post("/cfg.php?controller=confZoneManage&action=showZoneTree", data).then(
        (res) => {
          res.children.map((item) => {
            let isLeaf = true;
            if (item.leaf == "N") {
              isLeaf = false;
            }
            info.push({
              id: item.id,
              title: item.name,
              isLeaf: isLeaf,
              pId: item.gpid,
              value: item.id,
            });
          });
          setOrgData(orgData.concat(info));
          resolve(undefined);
        }
      );
    });

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
        style={{ width: 200 }}
        placeholder="请输入"
        allowClear
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
        handleDel(selectedRowKeys);
      },
    });
  };

  const showDraw = (state, op) => {
    setOpcode(op);
    if (state == "open") {
      setDrawState(true);
    } else {
      drawformRef.current.resetFields();
      setOrgkey("");
      setOrgVal("");
      setOrgValue("");
      setDrawState(false);
    }
  };

  const editClick = (record, op) => {
    showDraw("open", op);
    setOrgValue(record.org);
    setOrgVal(record.orgID);
    setTimeout(() => {
      drawformRef.current.setFieldsValue(record);
    }, 100);
  };

  const handleSet = (values) => {
    let data = values;
    data.op = opcode;
    data.gpOrgPath = orgValue;
    data.orgID = orgVal;
    post("/cfg.php?controller=confUserlist&action=set", data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        showDraw("close");
        incAdd();
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  const handleDel = (selectedRowKeys) => {
    let data = {};
    data.ids = selectedRowKeys.join(",");
    post("/cfg.php?controller=confUserlist&action=del", data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        incAdd();
        message.success(res.msg);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  return (
    <div className="membersDiv">
      <CardModal
        title={"组织机构"}
        cardHeight={clientHeight + 182}
        leftContent={
          <LeftTree
            getTree={getTreeLeft}
            onSelectLeft={onSelectLeft}
            treeInc={treeInc}
            treeUrl={treeUrl}
            leftTreeData={leftTreeData}
          />
        }
        rightContent={
          <div
            id="membersTable"
            style={{ height: "100%", width: "100%", overflow: "hidden" }}
          >
            <ProtableModule
              columns={columns}
              apishowurl={apishowurl}
              incID={incID}
              clientHeight={tableHeight}
              columnvalue={columnvalue}
              tableKey={tableKey}
              searchText={showSearch()}
              searchVal={searchVal}
              rowkey={rowKey}
              delButton={delButton}
              delClick={delClick}
              addButton={addButton}
              addClick={addClick}
              rowSelection={rowSelection}
            />
          </div>
        }
      />
      <DrawerForm
        title={opcode === "add" ? "新增" : "修改"}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        formRef={drawformRef}
        drawerProps={{
          placement: "right",
          closable: false,
          getContainer: () => document.getElementById("membersTable"),
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
        }}
        autoFocusFirstInput
        submitTimeout={2000}
        visible={drawState}
        onVisibleChange={setDrawState}
        onFinish={(values) => {
          handleSet(values);
        }}
      >
        <div>
          <ProFormText name="id" hidden />
          <ProFormText label="人员姓名" name="name" />
          <ProFormText
            name="orgID"
            // rules={[{ required: true, message: regSeletcList.select.alertText }]}
            label={"所属机构"}
          >
            <TreeSelect
              style={{ width: "100%" }}
              treeDataSimpleMode
              value={orgValue}
              dropdownStyle={{
                maxHeight: 400,
                overflow: "auto",
              }}
              placeholder={language("project.select")}
              onChange={onOrgSelect}
              loadData={onOrgData}
              treeData={orgData}
            />
          </ProFormText>
          <ProFormText label="行政职务" name="position" />
          <ProFormText label="人员类型" name="type" />
          <ProFormText label="联系电话" name="phone" />
          <ProFormText label="备注" name="note" />
        </div>
      </DrawerForm>
    </div>
  );
};
