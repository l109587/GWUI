import React, { useRef, useState, useEffect } from "react";
import {
  Input,
  message,
  Modal,
  Popconfirm,
  Tooltip,
  Button,
  Switch,
} from "antd";
import {
  ExclamationCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { post } from "@/services/https";
import ProForm, {
  ModalForm,
  ProFormText,
  DrawerForm,
  ProFormCheckbox,
  ProFormSwitch,
  ProFormRadio,
} from "@ant-design/pro-form";
import { NameText, NotesText, EditTable } from "@/utils/fromTypeLabel";
import { drawFromLayout } from "@/utils/helper";
import { language } from "@/utils/language";
import { regMacList, regPortList } from "@/utils/regExp";
import SaveSvg from "@/assets/nac/save.svg";
import ExportSvg from "@/assets/nac/export.svg";
import "@/utils/index.less";
import "@/common/common.less";
import { TableLayout, AmTag } from "@/components";
const { ProtableModule } = TableLayout;
const { confirm } = Modal;
const { Search } = Input;
let H = document.body.clientHeight - 336;
var clientHeight = H;
export default () => {
  const columns = [
    {
      title: language("accctrl.bindlist.state"),
      dataIndex: "status: ",
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
        let disabled = false;
        if (record.from == "remote") {
          disabled = true;
        }
        let checked = true;
        if (record.bd_status == "N") {
          checked = false;
        }
        return (
          <Switch
            checkedChildren={language("project.open")}
            unCheckedChildren={language("project.close")}
            disabled={disabled}
            checked={checked}
            onChange={(checked) => {
              // statusSave(record, checked);
            }}
          />
        );
      },
    },
    {
      title: language("accctrl.bindlist.macaddr"),
      dataIndex: "mac",
      align: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: language("accctrl.bindlist.ipaddr"),
      dataIndex: "ip",
      align: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: language("accctrl.bindlist.systype"),
      dataIndex: "ostype",
      align: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: language("accctrl.bindlist.sysinstalltime"),
      dataIndex: "osinstime",
      align: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: language("accctrl.bindlist.diskid"),
      dataIndex: "diskserial",
      align: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: language("accctrl.bindlist.devname"),
      dataIndex: "devname",
      align: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: language("accctrl.bindlist.vlan"),
      dataIndex: "vlan",
      align: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: language("accctrl.bindlist.swip"),
      dataIndex: "swaddr",
      align: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: language("accctrl.bindlist.swport"),
      dataIndex: "swport",
      align: "left",
      ellipsis: true,
      width: 130,
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

  const formRef = useRef();
  const [modalStatus, setModalStatus] = useState(false); //model 添加弹框状态
  const [op, setop] = useState("add"); //选中id数组

  /** table组件 start */
  const rowKey = (record) => record.mac; //列表唯一值
  const tableHeight = clientHeight; //列表高度
  const tableKey = "acbndlist"; //table 定义的key
  const rowSelection = true; //是否开启多选框
  const addButton = true; //增加按钮  与 addClick 方法 组合使用
  const delButton = true; //删除按钮 与 delClick 方法 组合使用
  const uploadButton = false; //导入按钮 与 uploadClick 方法 组合使用
  const downloadButton = false; //导出按钮 与 downloadClick 方法 组合使用
  const [incID, setIncID] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  const columnvalue = "acbndlistcolumnvalue"; //设置默认显示的 key 变动 set.strot 存储key
  const apishowurl = "/cfg.php?controller=devbind&action=devList"; //接口路径
  const [queryVal, setQueryVal] = useState(); //首个搜索框的值
  let searchVal = { queryVal: queryVal, queryType: "fuzzy" }; //顶部搜索框值 传入接口

  //初始默认列
  const concealColumns = {
    id: { show: false },
    createTime: { show: false },
    updateTime: { show: false },
  };
  /* 顶部左侧搜索框*/
  const tableTopSearch = () => {
    return (
      <Search
        placeholder={language("accctrl.bindlist.tablesearch")}
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
    let initialValue = [];
    setTimeout(function () {
      formRef.current.setFieldsValue(initialValue);
    }, 100);
    getModal(1, "add");
  };

  //导入按钮
  const uploadClick = () => {};

  //导出按钮
  const downloadClick = (list = {}) => {};

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

  //添加修改接口
  const save = (info) => {
    info.bd_status =
      info.bd_status == "Y" || info.bd_status == true ? "Y" : "N";
    let option = op == "add" ? "add" : "set";
    post("/cfg.php?controller=devbind&action=" + option, info)
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
    post("/cfg.php?controller=devbind&action=del", { ids: ids })
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
  const mod = (obj, op) => {
    let row = {};
    row.bd_status = obj.status == "Y" || obj.status == true ? true : false;
    row.bd_mac = obj.mac;
    row.bd_old_mac = obj.mac;
    row.bd_ip = obj.ip;
    row.bd_devname = obj.devname;
    row.bd_diskserial = obj.diskserial;
    row.bd_ostype = obj.ostype;
    row.bd_osinstime = obj.osinstime;
    row.bd_swaddr = obj.swaddr;
    row.bd_swport = obj.swport;
    row.bd_vlan = obj.vlan;
    row.bd_sysuser = obj.sysuser;
    row.bd_authuser = obj.authuser;
    let initialValues = row;
    getModal(1, op);
    setTimeout(function () {
      formRef.current.setFieldsValue(initialValues);
    }, 100);
  };

  const bulkOperation = (
    selectedRowKeys,
    dataList,
    selectedRows,
    setSelectedRowKeys
  ) => (
    <div>
      <Button
        onClick={() => {
          setSelectedRowKeys([]);
        }}
      >
        {language("accctrl.bindlist.cancel")}
      </Button>
      <Button type="primary" onClick={() => {}}>
        {language("accctrl.bindlist.batchdisable")}
      </Button>
      <Button type="primary" onClick={() => {}}>
        {language("accctrl.bindlist.batchopen")}
      </Button>
    </div>
  );

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
        uploadClick={uploadClick}
        downloadButton={downloadButton}
        downloadClick={downloadClick}
        bulkOperation={bulkOperation}
      />
      <DrawerForm
        {...drawFromLayout}
        width={"477px"}
        formRef={formRef}
        title={
          op == "add" ? language("project.add") : language("project.alter")
        }
        visible={modalStatus}
        autoFocusFirstInput
        drawerProps={{
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
        <div>
          <ProFormSwitch
            checkedChildren={language("project.enable")}
            unCheckedChildren={language("project.disable")}
            name="bd_status"
            label={language("accctrl.bindlist.state")}
          />
          <ProFormText
            label={language("accctrl.bindlist.macaddr")}
            name="bd_mac"
            rules={[
              {
                required: true,
                pattern: regMacList.mac.regex,
                message: regMacList.mac.alertText,
              },
            ]}
          />
          <ProFormText hidden name="bd_old_mac" />
          <ProFormText
            label={language("accctrl.bindlist.ip")}
            name="bd_ip"
            rules={[
              {
                pattern: regMacList.ip.regex,
                message: regMacList.ip.alertText,
              },
            ]}
          />
          <NameText
            label={language("accctrl.bindlist.devname")}
            name="bd_devname"
            required={true}
          />
          <ProFormText
            label={language("accctrl.bindlist.diskid")}
            name="bd_diskserial"
          />
          <ProFormText
            label={language("accctrl.bindlist.systype")}
            name="bd_ostype"
          />
          <ProFormText
            label={language("accctrl.bindlist.sysinstalltime")}
            name="bd_osinstime"
          />
          <ProFormText
            label={language("accctrl.bindlist.switch")}
            name="bd_swaddr"
          />
          <ProFormText
            label={language("accctrl.bindlist.swport")}
            name="bd_swport"
            rules={[
              {
                pattern: regPortList.port.regex,
                message: regPortList.port.alertText,
              },
            ]}
          />
          <ProFormText
            label={language("accctrl.bindlist.vlan")}
            name="bd_vlan"
            rules={[
              {
                pattern: regMacList.vlan.regex,
                message: regMacList.vlan.alertText,
              },
            ]}
          />
          <ProFormText
            label={language("accctrl.bindlist.sysloginuser")}
            name="bd_sysuser"
          />
          <ProFormText
            label={language("accctrl.bindlist.idcarduser")}
            name="bd_authuser"
          />
        </div>
      </DrawerForm>
    </div>
  );
};
