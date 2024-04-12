import React, { useRef, useState, useEffect } from "react";
import { Input, message, Modal, Popconfirm, Tooltip, Button, Space } from "antd";
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
import DelIcon from "@/assets/nac/del.svg";
import EditIcon from "@/assets/nac/saEdit.svg";
import "@/utils/index.less";
import "@/common/common.less";
import "./index.less";
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
      title: language("accctrl.naslist.nasname"),
      dataIndex: "name",
      align: "left",
      fixed: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: language("accctrl.naslist.swaddr"),
      dataIndex: "swips",
      align: "left",
      ellipsis: true,
      width: 200,
      render: (text, record) => {
        return (
          <>
            <CutdropDown addrlist={record.swips} />
          </>
        );
      },
    },
    {
      title: language("accctrl.naslist.extendprotocolauth"),
      dataIndex: "name",
      align: "left",
      ellipsis: true,
      width: 210,
      render: (text, record, _, action) => {
        return (
          <>
            <AmTag
              color={record.pap == "Y" ? "blue" : "default"}
              name={"PAP"}
              style={{ marginLeft: "10px", borderRadius: "5px" }}
            />
            <AmTag
              color={record.chap == "Y" ? "green" : "default"}
              name={"CHAP"}
              style={{ marginLeft: "10px", borderRadius: "5px" }}
            />
            <AmTag
              color={record.md5 == "Y" ? "cyan" : "default"}
              name={"EAP-MD5"}
              style={{ marginLeft: "10px", borderRadius: "5px" }}
            />
          </>
        );
      },
    },
    {
      title: language("project.remark"),
      dataIndex: "note",
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
  const [editableKeys, setEditableRowKeys] = useState(); //每行编辑的id
  const [timeShow, setTimeShow] = useState(false); //有效时间隐藏显示
  const [switchCheck, setSwitchCheck] = useState();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [rowRecord, setRowRecord] = useState([]); //记录当前信息

  const renderRemove = (text, record) => (
    <Popconfirm
      onConfirm={() => {
        setConfirmLoading(false);
        const tableDataSource = formRef.current.getFieldsValue([
          "addrlistinfo",
        ]);
        formRef.current.setFieldsValue({
          addrlistinfo: tableDataSource["addrlistinfo"].filter(
            (item) => item.id != record.id
          ),
        });
      }}
      key="popconfirm"
      title={language("project.delconfirm")}
      okButtonProps={{
        loading: confirmLoading,
      }}
      okText={language("project.yes")}
      cancelText={language("project.no")}
    >
      <a>{text}</a>
    </Popconfirm>
  );

  const fromcolumns = [
    {
      title: language("accctrl.naslist.swaddr"),
      dataIndex: "swips",
      align: "center",
      formItemProps: () => {
        return {
          rules: [
            {
              required: true,
              pattern: regMacList.ipv4mask.regex,
              message: regMacList.ipv4mask.alertText,
            },
          ],
        };
      },
    },
    {
      title: language("project.operate"),
      valueType: "option",
      width: "25%",
      align: "center",
      render: (text, record, _, action) => [
        <>
         <Space>
            <Tooltip placement="top" title={language("project.edit")}>
              <a
                onClick={() => {
                  action.startEditable?.(record.id);
                }}
              >
                <img src={EditIcon} alt="" />
              </a>
            </Tooltip>

            {renderRemove(
              <Tooltip placement="top" title={language("project.del")}>
                <a>
                  <img src={DelIcon} alt="" />
                </a>
              </Tooltip>,
              record
            )}
          </Space>
        </>,
      ],
    },
  ];

  /** table组件 start */
  const rowKey = (record) => record.id; //列表唯一值
  const tableHeight = clientHeight; //列表高度
  const tableKey = "acnaslist"; //table 定义的key
  const rowSelection = true; //是否开启多选框
  const addButton = true; //增加按钮  与 addClick 方法 组合使用
  const delButton = true; //删除按钮 与 delClick 方法 组合使用
  const uploadButton = false; //导入按钮 与 uploadClick 方法 组合使用
  const downloadButton = false; //导出按钮 与 downloadClick 方法 组合使用
  const [incID, setIncID] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  const columnvalue = "acnaslistcolumnvalue"; //设置默认显示的 key 变动 set.strot 存储key
  const apishowurl = "/cfg.php?controller=radnas&action=show"; //接口路径
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
        placeholder={language("accctrl.naslist.tableserach")}
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
    let swips = [];
    let count = 0;
    if (info.addrlistinfo) {
      count = info.addrlistinfo.length;
    }
    if (count > 0) {
      info.addrlistinfo.map((item) => {
        swips.push(item.swips);
      });
      swips = swips.join(";");
    } else {
      swips = "";
    }
    let data = {};
    data.op = op;
    data.id = info.id;
    data.name = info.name;
    data.secret = info.secret;
    data.pap = info.agreement?.indexOf("pap") >= 0 ? "Y" : "N";
    data.chap = info.agreement?.indexOf("chap") >= 0 ? "Y" : "N";
    data.md5 = info.agreement?.indexOf("md5") >= 0 ? "Y" : "N";
    data.note = info.note;
    data.swips = swips;
    let url = "/cfg.php?controller=radnas&action=mod";
    if (op == "add") {
      url = "/cfg.php?controller=radnas&action=add";
    }
    post(url, data)
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
    post("/cfg.php?controller=radnas&action=del", { ids: ids })
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
    let addrlist = obj.swips ? obj.swips.split(";") : [];
    let rowKey = [];
    let defaultDataInfo = [];
    addrlist.map((item, index) => {
      defaultDataInfo.push({ id: index + 1, swips: item });
      rowKey.push(index + 1);
    });

    let agreement = [];
    if (obj.pap == "Y") {
      agreement.push("pap");
    }
    if (obj.chap == "Y") {
      agreement.push("chap");
    }
    if (obj.md5 == "Y") {
      agreement.push("md5");
    }
    obj.agreement = agreement;
    obj.addrlistinfo = defaultDataInfo;
    let initialValues = obj;
    getModal(1, op);
    setTimeout(function () {
      formRef.current.setFieldsValue(initialValues);
    }, 100);
  };

  const uploadText = (
    <Button className="llbuttonbox">
      {language("accctrl.naslist.preview")}
    </Button>
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
        <ProFormText name={"id"} hidden={true} />
        <NameText
          name="name"
          label={language("accctrl.naslist.nasname")}
          required={true}
        />
        <ProFormText.Password
          name={"secret"}
          label={language("accctrl.naslist.key")}
          rules={[
            {
              required: true,
            },
          ]}
        />
        <ProFormCheckbox.Group
          label={language("accctrl.naslist.extendprotocolauth")}
          name={"agreement"}
          options={[
            { label: "PAP", value: "pap" },
            { label: "CHAP", value: "chap" },
            { label: "EAP-MD5", value: "md5" },
          ]}
        />
        <EditTable
          label={language("accctrl.naslist.swaddr")}
          name={"addrlistinfo"}
          fromcolumns={fromcolumns}
          required={false}
          editableKeys={editableKeys}
          setEditableRowKeys={setEditableRowKeys}
        />
        <NotesText
          name="note"
          label={language("project.remark")}
          required={false}
        />
      </DrawerForm>
    </div>
  );
};
