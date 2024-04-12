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
  ProFormSelect,
} from "@ant-design/pro-form";
import { NameText, NotesText, EditTable } from "@/utils/fromTypeLabel";
import { drawFromLayout, defaultUserSync } from "@/utils/helper";
import { language } from "@/utils/language";
import { regMacList, regPortList } from "@/utils/regExp";
import SaveSvg from "@/assets/nac/save.svg";
import DevnSet from "@/assets/nac/bndmngt/devnset.svg";
import DevSet from "@/assets/nac/bndmngt/devset.svg";
import DisknSet from "@/assets/nac/bndmngt/disknset.svg";
import DiskSet from "@/assets/nac/bndmngt/diskset.svg";
import IdauthnSet from "@/assets/nac/bndmngt/idauthnset.svg";
import IdauthSet from "@/assets/nac/bndmngt/idauthset.svg";
import IpnSet from "@/assets/nac/bndmngt/ipnset.svg";
import IpSet from "@/assets/nac/bndmngt/ipset.svg";
import SwipnSet from "@/assets/nac/bndmngt/swipnset.svg";
import SwipSet from "@/assets/nac/bndmngt/swipset.svg";
import SwPortnSet from "@/assets/nac/bndmngt/swportnset.svg";
import SwPortSet from "@/assets/nac/bndmngt/swportset.svg";
import SysLoginnSet from "@/assets/nac/bndmngt/sysloginnset.svg";
import SysLoginSet from "@/assets/nac/bndmngt/sysloginset.svg";
import SysTimenSet from "@/assets/nac/bndmngt/systimenset.svg";
import SysTimeSet from "@/assets/nac/bndmngt/systimeset.svg";
import SysTypenSet from "@/assets/nac/bndmngt/systypenset.svg";
import SysTypeSet from "@/assets/nac/bndmngt/systypeset.svg";
import VlannSet from "@/assets/nac/bndmngt/vlannset.svg";
import VlanSet from "@/assets/nac/bndmngt/vlanset.svg";
import "@/utils/index.less";
import "@/common/common.less";
import "./index.less";
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
      title: language("accctrl.bindplcy.devname"),
      dataIndex: "name",
      align: "left",
      fixed: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: language("accctrl.bindplcy.state"),
      dataIndex: "status",
      ellipsis: true,
      align: "center",
      width: 80,
      render: (text, record, index) => {
        let color = "";
        if (record.status == "Y") {
          color = "#12C189";
          text = language("project.openstart");
        } else {
          color = "#FF0000";
          text = language("project.shutclose");
        }
        return (
          <AmTag
            color={color}
            name={text}
            key={record.orderState}
            style={{ borderRadius: "5px" }}
          />
        );
      },
    },
    {
      title: language("accctrl.bindplcy.targetobj"),
      dataIndex: "name",
      align: "left",
      fixed: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: language("accctrl.bindplcy.bindinspectcheck"),
      dataIndex: "name",
      align: "left",
      fixed: "left",
      ellipsis: true,
      width: 130,
      render: (text, record, _, action) => {
        return (
          <div className="bddetectionbox">
            {record.usFilter ? (
              <Tooltip
                title={language("accctrl.bindplcy.devname")}
                placement="top"
              >
                <img src={DevSet} />
              </Tooltip>
            ) : (
              <img src={DevnSet} />
            )}
            {record.usFilter ? (
              <Tooltip
                title={language("accctrl.bindplcy.diskserialnumber")}
                placement="top"
              >
                <img src={DiskSet} />
              </Tooltip>
            ) : (
              <img src={DisknSet} />
            )}
            {record.usFilter ? (
              <Tooltip
                title={language("accctrl.bindplcy.idcarduser")}
                placement="top"
              >
                <img src={IdauthSet} />
              </Tooltip>
            ) : (
              <img src={IdauthnSet} />
            )}
            {record.usFilter ? (
              <Tooltip
                title={language("accctrl.bindplcy.terminalip")}
                placement="top"
              >
                <img src={IpSet} />
              </Tooltip>
            ) : (
              <img src={IpnSet} />
            )}
            {record.usFilter ? (
              <Tooltip
                title={language("accctrl.bindplcy.swip")}
                placement="top"
              >
                <img src={SwipSet} />
              </Tooltip>
            ) : (
              <img src={SwipnSet} />
            )}
            {record.usFilter ? (
              <Tooltip
                title={language("accctrl.bindplcy.swport")}
                placement="top"
              >
                <img src={SwPortSet} />
              </Tooltip>
            ) : (
              <img src={SwPortnSet} />
            )}
            {record.usFilter ? (
              <Tooltip
                title={language("accctrl.bindplcy.sysloginuser")}
                placement="top"
              >
                <img src={SysLoginSet} />
              </Tooltip>
            ) : (
              <img src={SysLoginnSet} />
            )}
            {record.usFilter ? (
              <Tooltip
                title={language("accctrl.bindplcy.sysinstalltime")}
                placement="top"
              >
                <img src={SysTimeSet} />
              </Tooltip>
            ) : (
              <img src={SysTimenSet} />
            )}
            {record.usFilter ? (
              <Tooltip
                title={language("accctrl.bindplcy.systype")}
                placement="top"
              >
                <img src={SysTypeSet} />
              </Tooltip>
            ) : (
              <img src={SysTypenSet} />
            )}
            {record.usFilter ? (
              <Tooltip
                title={language("accctrl.bindplcy.vlan")}
                placement="top"
              >
                <img src={VlanSet} />
              </Tooltip>
            ) : (
              <img src={VlannSet} />
            )}
          </div>
        );
      },
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
  const rowKey = (record) => record.id; //列表唯一值
  const tableHeight = clientHeight; //列表高度
  const tableKey = "bndlist"; //table 定义的key
  const rowSelection = true; //是否开启多选框
  const addButton = true; //增加按钮  与 addClick 方法 组合使用
  const delButton = true; //删除按钮 与 delClick 方法 组合使用
  const uploadButton = false; //导入按钮 与 uploadClick 方法 组合使用
  const downloadButton = false; //导出按钮 与 downloadClick 方法 组合使用
  const [incID, setIncID] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  const columnvalue = "bndlistcolumnvalue"; //设置默认显示的 key 变动 set.strot 存储key
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
        placeholder={language("accctrl.bindplcy.tablesearch")}
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
        {...defaultUserSync}
        width={"408px"}
        formRef={formRef}
        title={
          op == "add" ? language("project.add") : language("project.alter")
        }
        visible={modalStatus}
        autoFocusFirstInput
        drawerProps={{
          className: "bdpolicyfrombox",
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
            label={language("accctrl.bindplcy.state")}
          />
          <NameText
            label={language("accctrl.bindplcy.policyname")}
            name="user"
            required={true}
          />

          <ProFormSelect
            label={language("accctrl.bindplcy.targetobj")}
            options={[
              { label: language("accctrl.bindplcy.usergroup"), value: "N" },
              { label: language("accctrl.bindplcy.terminalgroup"), value: "Y" },
            ]}
            name="kind"
          />
          <div className="batchtitlebox">
            {language("accctrl.bindplcy.bindcheck")}
          </div>
          <div className="checkboxbox">
            <ProFormCheckbox.Group
              label={language("accctrl.bindplcy.ipmacinspection")}
              name={"c1"}
              options={[
                { label: language("accctrl.bindplcy.ipmacbind"), value: "ssl" },
              ]}
            />
            <div className="checkboxbuttom">
              <ProFormCheckbox.Group
                label={language("accctrl.bindplcy.assetinspection")}
                name={"cs1"}
                options={[
                  { label: language("accctrl.bindplcy.devname"), value: "1" },
                  {
                    label: language("accctrl.bindplcy.diskserialnumber"),
                    value: "2",
                  },
                  { label: language("accctrl.bindplcy.systype"), value: "3" },
                  {
                    label: language("accctrl.bindplcy.sysinstalltime"),
                    value: "4",
                  },
                ]}
              />
              <ProFormCheckbox.Group
                label={language("accctrl.bindplcy.positiondetection")}
                name={"c2s"}
                options={[
                  { label: language("accctrl.bindplcy.switch"), value: "1" },
                  { label: language("accctrl.bindplcy.swport"), value: "2" },
                  { label: language("accctrl.bindplcy.vlan"), value: "3" },
                ]}
              />
              <ProFormCheckbox.Group
                label={language("accctrl.bindplcy.userinspection")}
                name={"cs6"}
                options={[
                  {
                    label: language("accctrl.bindplcy.sysloginuser"),
                    value: "1",
                  },
                  {
                    label: language("accctrl.bindplcy.idcarduser"),
                    value: "2",
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </DrawerForm>
    </div>
  );
};
