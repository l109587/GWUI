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
  Space,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { post } from "@/services/https";
import ProForm, {
  ProFormText,
  ProFormDateTimePicker,
  DrawerForm,
  ProFormRadio,
  ProFormSelect,
} from "@ant-design/pro-form";
import { NameText, NotesText, EditTable } from "@/utils/fromTypeLabel";
import { modalFormLayout, drawFromLayout } from "@/utils/helper";
import DownnLoadFile from "@/utils/downnloadfile.js";
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
const { ProtableModule, WebUploadr } = TableLayout;
const { confirm } = Modal;
const { Search } = Input;
let H = document.body.clientHeight - 336;
var clientHeight = H;
export default () => {
  const columns = [
    {
      title: "补丁名称",
      dataIndex: "patchname",
      align: "left",
      fixed: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: "操作系统类型",
      dataIndex: "sysOS",
      align: "left",
      fixed: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: "操作系统版本",
      dataIndex: "osver",
      align: "left",
      fixed: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: "处理器架构",
      dataIndex: "architecture",
      align: "left",
      fixed: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: "补丁等级",
      dataIndex: "patchlevel",
      align: "left",
      fixed: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: "补丁编号",
      dataIndex: "patchnum",
      align: "left",
      fixed: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: "补丁文件来源",
      dataIndex: "patchrepair",
      align: "left",
      fixed: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: "补丁地址",
      dataIndex: "patchurl",
      align: "left",
      fixed: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: "补丁详情",
      dataIndex: "patchdetail",
      align: "left",
      fixed: "left",
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
  const [sysTypeVal, setSysTypeVal] = useState(); //每行编辑的id
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
      title: language("ecpmngt.iporipaddr"),
      dataIndex: "iprange",
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
  const tableKey = "eipblk"; //table 定义的key
  const rowSelection = true; //是否开启多选框
  const addButton = true; //增加按钮  与 addClick 方法 组合使用
  const delButton = true; //删除按钮 与 delClick 方法 组合使用
  const uploadButton = false; //导入按钮 与 uploadClick 方法 组合使用
  const downloadButton = false; //导出按钮 与 downloadClick 方法 组合使用
  const [incID, setIncID] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  const columnvalue = "eipblkcolumnvalue"; //设置默认显示的 key 变动 set.strot 存储key
  const apishowurl = "/cfg.php?controller=exceptDev&action=get_blacklist"; //接口路径
  const [queryVal, setQueryVal] = useState(); //首个搜索框的值
  let searchVal = { queryVal: queryVal, queryType: "fuzzy" }; //顶部搜索框值 传入接口

  //初始默认列
  const concealColumns = {
    id: { show: false },
  };
  /* 顶部左侧搜索框*/
  const tableTopSearch = () => {
    return (
      <Search
        placeholder={language("ecpmngt.ipblk.tablesearch")}
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
        addrlist.push(item.iprange);
      });
      addrlist = addrlist.join(";");
    } else {
      addrlist = "";
    }
    let status = 0;
    if (info.status == 1 || info.status == true) {
      status = 1;
    }
    if (info.verify_mode == "forever") {
      info.time = 0;
    }
    let data = {};
    data.op = op;
    data.id = info.id;
    data.status = status;
    data.name = info.name;
    data.verify_mode = info.verify_mode;
    data.time = info.time;
    data.notes = info.notes;
    data.iprange = addrlist;
    let url = "/cfg.php?controller=exceptDev&action=add_blacklist";
    if (op == "mod") {
      url = "/cfg.php?controller=exceptDev&action=modify_blacklist";
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
    post("/cfg.php?controller=exceptDev&action=del_blacklist", { ids: ids })
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
    let addrlist = obj.iprange ? obj.iprange.split(";") : [];
    let rowKey = [];
    let defaultDataInfo = [];
    addrlist.map((item, index) => {
      defaultDataInfo.push({ id: index + 1, iprange: item });
      rowKey.push(index + 1);
    });
    obj.status = obj.status == 1 || obj.status == true ? true : false;
    //设置有效时间的显示隐藏
    if (obj.verify_mode == "abort") {
      setTimeShow(true);
    } else {
      setTimeShow(false);
    }
    if (obj.status == 1 || obj.status == true) {
      setSwitchCheck("checked");
    } else {
      setSwitchCheck("");
    }
    obj.addrlistinfo = defaultDataInfo;
    if (obj.verify_mode == "forever") {
      delete obj["time"];
    }
    let initialValues = obj;
    getModal(1, op);
    setTimeout(function () {
      formRef.current.setFieldsValue(initialValues);
    }, 100);
  };
  const uploadText = (
    <Button className="llbuttonbox">{language("ecpmngt.preview")}</Button>
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
        downloadButton={downloadButton}
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
          className: "mconfpatchdrawfrombox",
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
        <ProFormText hidden={true} type="hidden" name="id" label="IP" />
        <NameText name="patchname" label={"补丁名称"} required={true} />
        <ProFormRadio.Group
          label={'系统类型'}
          name="sysOS"
          options={[
            { label: "Windows", value: "win" },
            { label: "Linux", value: "linux" },
            { label: "信创通用", value: "chs" },
          ]}
          fieldProps={{
            buttonStyle: "solid",
            optionType: "button",
          }}
          rules={[
            {
              required: true,
            },
          ]}
          onChange={(checked) => {
            setSysTypeVal(checked.target.value);
          }}
        />
        {sysTypeVal == "win" ? (
         <>
          <ProFormSelect
            name="architecture"
            label={"处理器架构"}
            options={[
              { label: "所有架构", value: "1" },
              { label: "x86", value: "2" },
              { label: "x86_64", value: "3" },
              { label: "arm64", value: "4" },
              { label: "i386", value: "5" },
              { label: "i686", value: "6" },
              { label: "amd64", value: "7" },
              { label: "mips", value: "8" },
              { label: "aarch32", value: "9" },
              { label: "aarch64", value: "10" },
            ]}
            rules={[
              {
                required: true,
              },
            ]}
          />
          <ProFormText label={'软件名称'} name='softname'  />
          <ProFormSelect
            name="checkver"
            label={"软件版本"}
            options={[
              { label: "大于等于", value: "1" },
              { label: "等于", value: "2" },
              { label: "小于等于", value: "3" },
            ]}
            rules={[
              {
                required: true,
              },
            ]}
            addonAfter={<div className="marginbuttom0"><ProFormText name={'softver'} placeholder={'请输入版本号'} /></div>}
          />
          </>
        ) : (
          <ProFormSelect
            name="osver"
            label={"系统版本"}
            options={[
              { label: "所有系统", value: "1" },
              { label: "Windows 10_64", value: "2" },
              { label: "Windows 10_32", value: "3" },
              { label: "Windows 8.1_64", value: "4" },
              { label: "Windows 8.1_32", value: "5" },
              { label: "Windows 8_64", value: "6" },
              { label: "Windows 8_32", value: "7" },
              { label: "Windows 7_64", value: "8" },
              { label: "Windows 7_32", value: "9" },
              { label: "Windows XP_64", value: "10" },
              { label: "Windows XP_32", value: "11" },
              { label: "Windows 2000", value: "12" },
            ]}
            rules={[
              {
                required: true,
              },
            ]}
          />
        )}
        <div className="patchleavebox">
          <ProFormRadio.Group
            label={"补丁等级"}
            name="patchlevel"
            options={[
              { label: "关键", value: "1" },
              { label: "重要", value: "2" },
              { label: "中等级", value: "3" },
              { label: "低等级", value: "4" },
              { label: "未定义", value: "5" },
            ]}
            rules={[
              {
                required: true,
              },
            ]}
          />
        </div>
        <ProFormText
          label={"补丁编号"}
          rules={[
            {
              required: true,
            },
          ]}
          name={'patchnum'}
        />

        <ProFormRadio.Group
          label={"修复方式"}
          name="patchrepair"
          options={[
            { label: "网关下载", value: "0" },
            { label: "第三方下载", value: "1" },
          ]}
          rules={[
            {
              required: true,
            },
          ]}
        />
        {/* //patchurl */}
        <NotesText name="patchdetail" label={"补丁详情"} required={false} />
      </DrawerForm>
    </div>
  );
};
