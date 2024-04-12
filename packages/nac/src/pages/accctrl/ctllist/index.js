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
import { regMacList } from "@/utils/regExp";
import { ReactComponent as SaveSvg } from "@/assets/nac/save.svg";
import { ReactComponent as DevGroup } from "@/assets/nac/devgroup.svg";
import { ReactComponent as UserGroup } from "@/assets/nac/usergroup.svg";
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
      title: "ID",
      dataIndex: "id",
      align: "center",
      ellipsis: true,
    },
    {
      title: language("accctrl.ctllist.upbroadband"),
      dataIndex: "status",
      align: "center",
      ellipsis: true,
      width: 80,
      filters: true,
      fixed: "left",
      filterMultiple: false,
      valueEnum: {
        Y: { text: language("project.enable") },
        N: { text: language("project.disable") },
      },
      render: (text, record, index) => {
        let disabled = false;
        if (record.from == "remote") {
          disabled = true;
        }
        let checked = true;
        if (record.status == "N") {
          checked = false;
        }
        return (
          <Switch
            checkedChildren={language("project.enable")}
            unCheckedChildren={language("project.disable")}
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
      title: language("accctrl.ctllist.name"),
      dataIndex: "name",
      align: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: language("accctrl.ctllist.grouptype"),
      dataIndex: "name",
      align: "center",
      ellipsis: true,
      width: 130,
      render: (text, record, _, action) => {
        if (record) {
          return (
            <div style={{ marginBottom: "-6px" }}>
              <Tooltip title={language("accctrl.ctllist.usergroup")}>
                <UserGroup />
              </Tooltip>
            </div>
          );
        } else {
          return (
            <Tooltip title={language("accctrl.ctllist.devgroup")}>
              <DevGroup />
            </Tooltip>
          );
        }
      },
    },
    {
      title: language("accctrl.ctllist.group"),
      dataIndex: "name",
      align: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: language("accctrl.ctllist.accessauthdom"),
      dataIndex: "name",
      align: "left",
      fixed: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: language("accctrl.ctllist.quarantinevlan"),
      dataIndex: "name",
      align: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: language("accctrl.ctllist.normalvlan"),
      dataIndex: "name",
      align: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: language("accctrl.ctllist.downbroadband"),
      dataIndex: "name",
      align: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: language("accctrl.ctllist.upbroadband"),
      dataIndex: "name",
      align: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: language("accctrl.ctllist.qosrule"),
      dataIndex: "name",
      align: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: language("accctrl.ctllist.aclnumber"),
      dataIndex: "name",
      align: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: language("project.remark"),
      dataIndex: "notes",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("project.createTime"),
      dataIndex: "createTime",
      width: 130,
      align: "left",
      ellipsis: true,
    },
    {
      title: language("project.updateTime"),
      dataIndex: "updateTime",
      width: 130,
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
        <>
          <a
            key="editable"
            onClick={() => {
              mod(record, "mod");
            }}
          >
            <Tooltip title={language("project.deit")}>
              <SaveSvg />
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
  const rowKey = (record) => record.id; //列表唯一值
  const tableHeight = clientHeight; //列表高度
  const tableKey = "macwhite"; //table 定义的key
  const rowSelection = true; //是否开启多选框
  const addButton = true; //增加按钮  与 addClick 方法 组合使用
  const delButton = true; //删除按钮 与 delClick 方法 组合使用
  const uploadButton = false; //导入按钮 与 uploadClick 方法 组合使用
  const downloadButton = false; //导出按钮 与 downloadClick 方法 组合使用
  const [incID, setIncID] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  const columnvalue = "macwhitecolumnvalue"; //设置默认显示的 key 变动 set.strot 存储key
  const apishowurl = "/cfg.php?controller=confMACList&action=showWhiteMACList"; //接口路径
  const [queryVal, setQueryVal] = useState(); //首个搜索框的值
  let searchVal = { queryVal: queryVal, queryType: "fuzzy" }; //顶部搜索框值 传入接口

  //初始默认列
  const concealColumns = {
    id: { show: false },
    valid_type: { show: false },
    createTime: { show: false },
    updateTime: { show: false },
  };
  /* 顶部左侧搜索框*/
  const tableTopSearch = () => {
    return (
      <Search
        placeholder={language("accctrl.ctllist.tablesearch")}
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
    let addrlist = [];
    let count = 0;
    if (info.addrlistinfo) {
      count = info.addrlistinfo.length;
    }
    if (count > 0) {
      info.addrlistinfo.map((item) => {
        addrlist.push(item.address);
      });
      addrlist = addrlist.join(";");
    } else {
      addrlist = "";
    }
    let status = "N";
    if (info.status == "Y" || info.status == true) {
      status = "Y";
    }
    if (info.valid_type == "forever") {
      info.expire_time = 0;
    }
    let data = {};
    data.op = op;
    data.id = info.id;
    data.status = status;
    data.name = info.name;
    data.valid_type = info.valid_type;
    data.expire_time = info.expire_time;
    data.notes = info.notes;
    data.addrlist = addrlist;
    post("/cfg.php?controller=confMACList&action=setWhiteMAC", data)
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
    post("/cfg.php?controller=confMACList&action=delWhiteMAC", { ids: ids })
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
    let addrlist = obj.addrlist;
    let rowKey = [];
    let defaultDataInfo = [];
    addrlist.map((item, index) => {
      defaultDataInfo.push({ id: index + 1, address: item });
      rowKey.push(index + 1);
    });

    obj.addrlistinfo = defaultDataInfo;
    if (obj.valid_type == "forever") {
      delete obj["expire_time"];
    }
    let initialValues = obj;
    getModal(1, op);
    setTimeout(function () {
      formRef.current.setFieldsValue(initialValues);
    }, 100);
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
        uploadClick={uploadClick}
        downloadButton={downloadButton}
        downloadClick={downloadClick}
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
          className: "whtlistmodal",
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
            name="status"
            label={language("accctrl.ctllist.state")}
          />
          <NameText
            label={language("accctrl.ctllist.name")}
            name="user"
            required={true}
          />

          <ProFormRadio.Group
            label={language("accctrl.ctllist.grouptype")}
            name="cover"
            id="cover"
            fieldProps={{
              buttonStyle: "solid",
              optionType: "button",
            }}
            rules={[{ required: true }]}
            options={[
              { label: language("accctrl.ctllist.usergroup"), value: "Y" },
              { label: language("accctrl.ctllist.devgroup"), value: "N" },
            ]}
          />
          <ProFormText
            label={language("accctrl.ctllist.usergroup")}
            rules={[
              {
                required: true,
                pattern: regMacList.mac.regex,
                message: regMacList.mac.alertText,
              },
            ]}
          />
          <ProFormText
            label={language("accctrl.ctllist.devgroup")}
            name="name"
          />
          <ProFormText
            label={language("accctrl.ctllist.accessauthdom")}
            name="name"
          />
          <ProFormText
            label={language("accctrl.ctllist.quarantinevlan")}
            name="name"
          />
          <ProFormText
            label={language("accctrl.ctllist.normalvlan")}
            name="name"
          />
          <ProFormText
            label={language("accctrl.ctllist.downbroadband")}
            name="name"
          />
          <ProFormText
            label={language("accctrl.ctllist.upbroadband")}
            name="name"
          />
          <ProFormText
            label={language("accctrl.ctllist.qosrule")}
            name="name"
          />
          <ProFormText
            label={language("accctrl.ctllist.aclnumber")}
            name="name"
          />
          <NotesText
            name="notes"
            label={language("accctrl.ctllist.aclcontent")}
            required={true}
          />
        </div>
      </DrawerForm>
    </div>
  );
};
