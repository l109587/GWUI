import React, { useRef, useState, useEffect } from "react";
import { Input, message, Modal, Popconfirm, Tooltip, Button } from "antd";
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
} from "@ant-design/pro-form";
import { NameText, NotesText, EditTable } from "@/utils/fromTypeLabel";
import { drawFromLayout } from "@/utils/helper";
import { language } from "@/utils/language";
import { regMacList } from "@/utils/regExp";
import SaveSvg from "@/assets/nac/save.svg";
import ExportSvg from "@/assets/nac/export.svg";
import "@/utils/index.less";
import "@/common/common.less";
import { CutdropDown } from "@/common";
import { TableLayout, AmTag } from "@/components";
const { ProtableModule } = TableLayout;
const { confirm } = Modal;
const { Search } = Input;
let H = document.body.clientHeight - 336;
var clientHeight = H;
export default () => {
  const columns = [
    {
      title: language("accctrl.macacct.macacct"),
      dataIndex: "rad_mac",
      align: "left",
      fixed: "left",
      ellipsis: true,
      width: 160,
    },
    {
      title: language("project.remark"),
      dataIndex: "remark",
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

  const incAdd = () => {
    let inc;
    clearTimeout(inc);
    inc = setTimeout(() => {
      setIncID(incID + 1);
    }, 100);
  };

  /** table组件 start */
  const rowKey = (record) => record.rad_mac; //列表唯一值
  const tableHeight = clientHeight; //列表高度
  const tableKey = "acmacacct"; //table 定义的key
  const rowSelection = true; //是否开启多选框
  const addButton = true; //增加按钮  与 addClick 方法 组合使用
  const delButton = true; //删除按钮 与 delClick 方法 组合使用
  const uploadButton = false; //导入按钮 与 uploadClick 方法 组合使用
  const downloadButton = false; //导出按钮 与 downloadClick 方法 组合使用
  const [incID, setIncID] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  const columnvalue = "acmacacctcolumnvalue"; //设置默认显示的 key 变动 set.strot 存储key
  const apishowurl = "/cfg.php?controller=radmac&action=show"; //接口路径
  const [queryVal, setQueryVal] = useState(); //首个搜索框的值
  let searchVal = { queryVal: queryVal, queryType: "fuzzy" }; //顶部搜索框值 传入接口

  //初始默认列
  const concealColumns = {
    createTime: { show: false },
    updateTime: { show: false },
  };
  /* 顶部左侧搜索框*/
  const tableTopSearch = () => {
    return (
      <Search
        placeholder={language("accctrl.macacct.tableserach")}
        style={{ width: 200 }}
        onSearch={(queryVal) => {
          setQueryVal(queryVal);
          incAdd();
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
    let data = {};
    data.op = op;
    data.rad_mac = info.rad_mac;
    data.remark = info.remark;
    let url = "/cfg.php?controller=radmac&action=mod";
    if (op == "add") {
      url = "/cfg.php?controller=radmac&action=add";
    }
    console.log(data);
    post(url, data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        getModal(2);
        incAdd();
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  //删除数据
  const delList = (selectedRowKeys) => {
    let ids = selectedRowKeys.join(",");
    post("/cfg.php?controller=radmac&action=del", { ids: ids })
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        incAdd();
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  //编辑
  const mod = (obj, op) => {
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
          console.log(111);
          save(values);
        }}
      >
        <div>
          <ProFormText
            label={language("accctrl.macacct.macacct")}
            name={"rad_mac"}
            disabled={op == "add" ? false : true}
            rules={[
              {
                required: true,
                pattern: regMacList.mac.regex,
                message: regMacList.mac.alertText,
              },
            ]}
          />
          <NotesText
            name="remark"
            label={language("project.remark")}
            required={true}
          />
        </div>
      </DrawerForm>
    </div>
  );
};
