import React, { useRef, useState, useEffect } from "react";
import {
  Input,
  message,
  Modal,
  Form,
  Switch,
  Popconfirm,
  Tooltip,
  Button,
  Alert,
} from "antd";
import {
  DeleteFilled,
  SaveFilled,
  ExclamationCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { LinkTwo } from "@icon-park/react";
import { post } from "@/services/https";
import { EditableProTable } from "@ant-design/pro-components";
import ProForm, {
  ProFormCheckbox,
  ProFormText,
  ProFormRadio,
  ProFormSelect,
  DrawerForm,
  ProFormTreeSelect,
  ProFormSwitch,
} from "@ant-design/pro-form";
import { NameText, NotesText, EditTable } from "@/utils/fromTypeLabel";
import { modalFormLayout, drawFromLayout } from "@/utils/helper";
import DownnLoadFile from "@/utils/downnloadfile.js";
import { language } from "@/utils/language";
import { regMacList } from "@/utils/regExp";
import SaveSvg from "@/assets/nac/save.svg";
import LiunxSvg from "@/assets/nac/plymngt/security/linux.svg";
import ChsSvg from "@/assets/nac/plymngt/security/chs.svg";
import WindowsSvg from "@/assets/nac/plymngt/security/windows.svg";
import MacosSvg from "@/assets/nac/plymngt/security/macos.svg";
import HgmodnSvg from "@/assets/nac/plymngt/security/hgmodn.svg";
import HgmodySvg from "@/assets/nac/plymngt/security/hgmody.svg";
import NhgmodySvg from "@/assets/nac/plymngt/security/nhgmody.svg";
import NhgmodnSvg from "@/assets/nac/plymngt/security/nhgmodn.svg";
import StartieySvg from "@/assets/nac/plymngt/security/startiey.svg";
import StartienSvg from "@/assets/nac/plymngt/security/startien.svg";
import AgainajySvg from "@/assets/nac/plymngt/security/againajy.svg";
import AgainajnSvg from "@/assets/nac/plymngt/security/againajn.svg";
import AnresultySvg from "@/assets/nac/plymngt/security/anresulty.svg";
import AnresultnSvg from "@/assets/nac/plymngt/security/anresultn.svg";
import RepairySvg from "@/assets/nac/plymngt/security/repairy.svg";
import RepairnSvg from "@/assets/nac/plymngt/security/repairn.svg";
import "@/utils/index.less";
import "@/common/common.less";
import "./index.less";
import { TableLayout, AmTag } from "@/components";
const { ProtableModule, WebUploadr } = TableLayout;
const { confirm } = Modal;
const { Search } = Input;
let H = document.body.clientHeight - 336;
var clientHeight = H;
export default () => {
  const sysTypeList = [
    {
      label: "Windows",
      value: "win",
      icon: <img src={WindowsSvg} />,
    },
    {
      label: "信创",
      value: "chs",
      icon: <img src={ChsSvg} />,
    },
    {
      label: "Linux",
      value: "lin",
      icon: <img src={LiunxSvg} />,
    },
    {
      label: "MacOs",
      value: "mac",
      icon: <img src={MacosSvg} />,
    },
  ];

  const cycleList = [
    {
      label: "仅一次",
      value: "only",
    },
    {
      label: "每小时",
      value: "hour",
    },
    {
      label: "每天",
      value: "day",
    },
    {
      label: "每周",
      value: "week",
    },
    {
      label: "每月",
      value: "month",
    },
  ];

  const columns = [
    {
      title: "状态",
      dataIndex: "status",
      align: "center",
      fixed: "left",
      ellipsis: true,
      width: 80,
      render: (text, record) => {
        let checked = true;
        if (record.status == "N") {
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
      title: "策略名称",
      dataIndex: "name",
      align: "left",
      width: 100,
      ellipsis: true,
    },
    {
      title: "下发对象",
      dataIndex: "dgrpValue",
      align: "center",
      fixed: "left",
      ellipsis: true,
      width: 150,
      filters: true,
      filterMultiple: false,
    },
    {
      title: "系统类型",
      dataIndex: "systype",
      align: "left",
      ellipsis: true,
      width: 130,
      render: (text, record, index) => {
        let name = "";
        let icon = "";
        sysTypeList.map((item) => {
          if (record.systype == item.value) {
            name = item.label;
            icon = item.icon;
          }
        });
        if (name) {
          return (
            <div>
              <span style={{ position: "relative", top: "-3px" }}>{icon}</span>
              <span style={{ marginLeft: "3px" }}>{name}</span>
            </div>
          );
        }
      },
    },
    {
      title: "安检规范",
      dataIndex: "ruleName",
      align: "left",
      ellipsis: true,
      width: 80,
    },
    {
      title: "安检周期",
      dataIndex: "cycle",
      align: "left",
      ellipsis: true,
      width: 100,
      render: (text, record, index) => {
        let name = "";
        cycleList.map((item) => {
          if (record.cycle == item.value) {
            name = item.label;
          }
        });
        if (name) {
          return name;
        }
      },
    },
    {
      title: "弹框配置",
      dataIndex: "showWinSuccess",
      align: "center",
      ellipsis: true,
      width: 110,
      render: (text, record, index) => {
        return (
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div>
              <Tooltip title={"合规弹窗"}>
                <img
                  src={record.showWinSuccess == "Y" ? HgmodySvg : HgmodnSvg}
                />
              </Tooltip>
            </div>
            <div>
              <Tooltip title={"不合规弹窗"}>
                <img
                  src={record.showWinFail == "Y" ? NhgmodySvg : NhgmodnSvg}
                />
              </Tooltip>
            </div>
            <div>
              <Tooltip title={"主动打开浏览器"}>
                <img
                  src={record.showWinAuto == "Y" ? StartieySvg : StartienSvg}
                />
              </Tooltip>
            </div>
          </div>
        );
      },
    },
    {
      title: "托盘菜单",
      dataIndex: "showTrayReCheck",
      align: "center",
      ellipsis: true,
      width: 110,
      render: (text, record, index) => {
        return (
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div>
              <Tooltip title={"重新安检"}>
                <img
                  src={
                    record.showTrayReCheck == "Y" ? AgainajySvg : AgainajnSvg
                  }
                />
              </Tooltip>
            </div>
            <div>
              <Tooltip title={"安检结果"}>
                <img
                  src={
                    record.showTrayCheckRes == "Y" ? AnresultySvg : AnresultnSvg
                  }
                />
              </Tooltip>
            </div>
            <div>
              <Tooltip title={"一键修复"}>
                <img
                  src={record.showTrayRepair == "Y" ? RepairySvg : RepairnSvg}
                />
              </Tooltip>
            </div>
          </div>
        );
      },
    },
    {
      title: "执行进度 ",
      dataIndex: "speed",
      align: "left",
      ellipsis: true,
    },
    {
      disable: true,
      title: language("project.operate"),
      align: "center",
      valueType: "option",
      fixed: "right",
      width: 80,
      ellipsis: true,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            mod(record, "mod");
          }}
        >
          <Tooltip title={language("project.deit")}>
            <img src={SaveSvg} />
          </Tooltip>
        </a>,
      ],
    },
  ];

  const formRef = useRef();
  const [modalStatus, setModalStatus] = useState(false); //model 添加弹框状态
  const [op, setop] = useState("add"); //选中id数组
  const [editableKeys, setEditableRowKeys] = useState(); //每行编辑的id
  const [timeShow, setTimeShow] = useState(false); //有效时间隐藏显示
  const [switchCheck, setSwitchCheck] = useState();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [rowRecord, setRowRecord] = useState([]); //记录当前信息
  const [treeData, setTreeData] = useState([]); //执行对象
  const [ruleNameList, setRuleNameList] = useState([]); //安检规范

  /** table组件 start */
  const rowKey = (record) => record.id; //列表唯一值
  const tableHeight = clientHeight; //列表高度
  const tableKey = "psecurity"; //table 定义的key
  const rowSelection = true; //是否开启多选框
  const addButton = true; //增加按钮  与 addClick 方法 组合使用
  const delButton = true; //删除按钮 与 delClick 方法 组合使用
  const uploadButton = false; //导入按钮 与 uploadClick 方法 组合使用
  const downloadButton = false; //导出按钮 与 downloadClick 方法 组合使用
  const [incID, setIncID] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  const columnvalue = "psecuritycolumnvalue"; //设置默认显示的 key 变动 set.strot 存储key
  const apishowurl = "/cfg.php?controller=checkPolicy&action=showCheckPolicy"; //接口路径
  const [queryVal, setQueryVal] = useState(); //首个搜索框的值
  let searchVal = { queryVal: queryVal, queryType: "fuzzy" }; //顶部搜索框值 传入接口

  //初始默认列
  const concealColumns = {
    id: { show: false },
    verify_mode: { show: false },
    createTime: { show: false },
    updateTime: { show: false },
  };
  /* 顶部左侧搜索框*/
  const tableTopSearch = () => {
    return (
      <Search
        placeholder={language("ecpmngt.ipwht.tablesearch")}
        style={{ width: 200 }}
        onSearch={(queryVal) => {
          setQueryVal(queryVal);
          setIncID(incID + 1);
        }}
      />
    );
  };

  //删除弹框
  const delClick = (selectedRowKeys, dataList) => {
    let sum = selectedRowKeys.length;
    confirm({
      className: "delclickbox delmodalcurrent",
      icon: <ExclamationCircleOutlined />,
      title: language("project.delconfirm"),
      content: language("project.delnuminfo", { sum: sum }),
      onOk() {
        delList(selectedRowKeys, dataList);
      },
    });
  };

  //添加按钮点击触发
  const addClick = () => {
    setTimeShow(false);
    let initialValue = [];
    getRuleName("win");
    setTimeout(function () {
      formRef.current.setFieldsValue(initialValue);
    }, 100);
    getModal(1, "add");
  };

  /** table组件 end */

  //判断是否弹出添加model
  const getModal = (status, op) => {
    if (status == 1) {
      setop(op);
      setModalStatus(true);
    } else {
      formRef.current.resetFields();
      setModalStatus(false);
    }
  };

  /**
   * 添加修改接口
   * @param {*} info
   */
  const save = (info) => {
    let data = {};
    data.opcode = op == "mod" ? "modify" : "add";
    data.status = info.status ? "Y" : "N";
    if (info.tkshow?.indexOf("showWinSuccess") != -1) {
      data.showWinSuccess = "Y";
    } else {
      data.showWinSuccess = "N";
    }

    if (info.tkshow?.indexOf("showWinFail") != -1) {
      data.showWinFail = "Y";
    } else {
      data.showWinFail = "N";
    }
    if (info.tkshow?.indexOf("showWinAuto") != -1) {
      data.showWinAuto = "Y";
    } else {
      data.showWinAuto = "N";
    }

    if (info.tpmeun?.indexOf("showTrayReCheck") != -1) {
      data.showTrayReCheck = "Y";
    } else {
      data.showTrayReCheck = "N";
    }

    if (info.tpmeun?.indexOf("showTrayCheckRes") != -1) {
      data.showTrayCheckRes = "Y";
    } else {
      data.showTrayCheckRes = "N";
    }
    if (info.tpmeun?.indexOf("showTrayRepair") != -1) {
      data.showTrayRepair = "Y";
    } else {
      data.showTrayRepair = "N";
    }
    data.ruleID = info.ruleID;
    ruleNameList?.map((item) => {
      if (item.value == info.ruleID) {
        data.ruleName = info.label;
      }
    });
    data.name = info.name;
    data.systype = info.systype;
    data.cycle = info.cycle;
    data.devgrpid = info.devgrpid;
    data.id = info.id;
    data.timeCheck = "Y";
    post("/cfg.php?controller=checkPolicy&action=setCheckPolicy", data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        getModal(2);
        setIncID(incID + 1);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  //删除数据
  const delList = (selectedRowKeys) => {
    let ids = selectedRowKeys.join(",");
    post("/cfg.php?controller=exceptDev&action=del_unmanage", { ids: ids })
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        setTimeout(() => {
          setIncID(incID + 1);
        }, 2000);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  //编辑
  const mod = (objList, op) => {
    let obj = { ...objList };
    obj.opcode = op;
    obj.status = obj.status == "Y" ? true : false;

    var tkshow = [];
    if (obj.showWinSuccess == "Y") {
      tkshow.push("showWinSuccess");
    }
    delete obj.showWinSuccess;
    if (obj.showWinFail == "Y") {
      tkshow.push("showWinFail");
    }
    delete obj.showWinFail;
    if (obj.showWinAuto == "Y") {
      tkshow.push("showWinAuto");
    }
    delete obj.showWinAuto;
    obj.tkshow = tkshow;

    var tpmeun = [];
    if (obj.showTrayReCheck == "Y") {
      tpmeun.push("showTrayReCheck");
    }
    delete obj.showTrayReCheck;
    if (obj.showTrayCheckRes == "Y") {
      tpmeun.push("showTrayCheckRes");
    }
    delete obj.showTrayCheckRes;
    if (obj.showTrayRepair == "Y") {
      tpmeun.push("showTrayRepair");
    }
    delete obj.showTrayRepair;
    obj.tpmeun = tpmeun;
    getRuleName(obj.systype);
    let initialValues = obj;
    getModal(1, op);
    setTimeout(function () {
      formRef.current.setFieldsValue(initialValues);
    }, 100);
  };

  //获取执行对象信息
  const getRuleName = (systype = "") => {
    let data = {};
    data.systype = systype;
    let url = "/cfg.php?controller=securityRule&action=showRuleNameList";
    post(url, data)
      .then((res) => {
        setRuleNameList(res.data);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  useEffect(() => {
    showDevGrpComboTree();
  }, []);

  const showDevGrpComboTree = () => {
    let data = {};
    post("/cfg.php?controller=devGroupControl&action=showDevGrpComboTree", data)
      .then((res) => {
        setTreeData(res);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        overflow: "hidden",
      }}
    >
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
        delClick={delClick}
        addButton={addButton}
        addClick={addClick}
        rowSelection={rowSelection}
        uploadButton={uploadButton}
        downloadButton={downloadButton}
      />
      <DrawerForm
        layout={"horizontal"}
        width={"500px"}
        formRef={formRef}
        title={
          op == "add" ? language("project.add") : language("project.alter")
        }
        visible={modalStatus}
        autoFocusFirstInput
        drawerProps={{
          className: "securitybox",
          destroyOnClose: true,
          maskClosable: false,
          placement: "right",
          getContainer: false,
          style: {
            position: "absolute",
          },
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
        <div style={{ width: "417px" }}>
          <ProFormText hidden={true} type="hidden" name="id" label="IP" />
          <ProFormText
            hidden={true}
            name="op"
            label={language("project.sysconf.syszone.opcode")}
            initialValue={op}
          />
          <ProFormSwitch
            label={"状态"}
            name="status"
            checkedChildren={language("project.enable")}
            unCheckedChildren={language("project.disable")}
          />
          <NameText name="name" label={"策略名称"} required={true} />
          <ProFormTreeSelect
            name="devgrpid"
            label={"执行对象"}
            fieldProps={{
              showArrow: false,
              filterTreeNode: true,
              dropdownMatchSelectWidth: false,
              labelInValue: false,
              autoClearSearchValue: true,
              treeData: treeData,
              treeNodeFilterProp: "text",
              fieldNames: {
                label: "text",
                value: "id",
              },
              allowClear: true,
              placeholder: language("project.select"),
            }}
          />
          <ProFormRadio.Group
            options={sysTypeList}
            label={"系统类型"}
            name="systype"
            radioType="button"
            initialValue={"win"}
            fieldProps={{
              buttonStyle: "solid",
              defaultValue: "single",
            }}
            onChange={(e) => {
              getRuleName(e.target.value);
            }}
          />
          <ProFormSelect
            options={ruleNameList}
            name="ruleID"
            rules={[{ required: true }]}
            label={"安检规范"}
          />
          <ProFormRadio.Group
            options={cycleList}
            label={"安检周期"}
            initialValue={"only"}
            name="cycle"
            radioType="button"
            fieldProps={{
              buttonStyle: "solid",
              defaultValue: "single",
            }}
          />
          <div className="checkbox-width-mode">
            <ProFormCheckbox.Group
              name="tkshow"
              label={"弹框显示"}
              options={[
                {
                  label: "合规弹窗",
                  value: "showWinSuccess",
                },
                {
                  label: "不合规弹窗",
                  value: "showWinFail",
                },
                {
                  label: "主动打开",
                  value: "showWinAuto",
                },
              ]}
            />
            <ProFormCheckbox.Group
              name="tpmeun"
              label={"托盘菜单"}
              options={[
                {
                  label: "重新安检",
                  value: "showTrayReCheck",
                },
                {
                  label: "安检结果",
                  value: "showTrayCheckRes",
                },
                {
                  label: "一键修复",
                  value: "showTrayRepair",
                },
              ]}
            />
          </div>
        </div>
      </DrawerForm>
    </div>
  );
};
