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
      title: language("ecpmngt.whtname"),
      dataIndex: "name",
      align: "left",
      fixed: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: language("ecpmngt.macaddress"),
      dataIndex: "macaddr",
      align: "left",
      width: 300,
      ellipsis: true,
      render: (text, record, index) => {
        if (record.macaddr) {
          return (
            <>
              <CutdropDown addrlist={record.macaddr} />
            </>
          );
        }
      },
    },
    {
      title: language("ecpmngt.ectstu"),
      dataIndex: "status",
      align: "center",
      fixed: "left",
      ellipsis: true,
      width: 100,
      filters: true,
      filterMultiple: false,
      valueEnum: {
        Y: { text: language("ecpmngt.effetc") },
        N: { text: language("ecpmngt.failure") },
      },
      render: (text, record, index) => {
        if (record.status == 1) {
          return (
            <AmTag
              color="#12C189"
              name={language("ecpmngt.effetc")}
              style={{ borderRadius: "5px" }}
            />
          );
        } else {
          return (
            <AmTag
              color="#777777"
              name={language("ecpmngt.failure")}
              style={{ borderRadius: "5px" }}
            />
          );
        }
      },
    },
    {
      title: language("ecpmngt.vdtime"),
      dataIndex: "time",
      align: "left",
      ellipsis: true,
      width: 150,
      render: (text, record, index) => {
        if (!record.time || record.time == 0) {
          return language("ecpmngt.forever");
        } else {
          return record.time;
        }
      },
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
        <a
          key="editable"
          onClick={() => {
            mod(record, "mod");
          }}
        >
          <Tooltip title={language("project.deit")}>
            <img src={SaveSvg} />
            {/* <DisknSet color={'red'} style={{color: 'red'}} /> */}
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

  /* 导入  start */
  const paramentUpload = {
    filecode: "utf-8",
  };
  const uploadConfig = {
    accept: ".csv", //接受上传的文件类型：zip、pdf、excel、image
    max: 100000000000000, //限制上传文件大小
    url: "/cfg.php?controller=confAssetManage&action=importApply",
  };
  const [spinning, setSpinning] = useState(false);
  const [imoritModalStatus, setImoritModalStatus] = useState(false); //导入 上传文件弹出框

  const getImportModal = (status) => {
    if (status == 1) {
      setImoritModalStatus(true);
    } else {
      setImoritModalStatus(false);
    }
  };

  /* 导入弹框关闭 */
  const getCloseImport = (type) => {
    getImportModal(2);
  };

  /* 导入成功文件返回 */
  const onFileSuccess = (res) => {};
  /* 导入  end */

  const fromcolumns = [
    {
      title: language("ecpmngt.macaddress"),
      dataIndex: "macaddr",
      align: "center",
      formItemProps: () => {
        return {
          rules: [
            {
              required: true,
              pattern: regMacList.mac.regex,
              message: regMacList.mac.alertText,
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
  const tableKey = "emacwht"; //table 定义的key
  const rowSelection = true; //是否开启多选框
  const addButton = true; //增加按钮  与 addClick 方法 组合使用
  const delButton = true; //删除按钮 与 delClick 方法 组合使用
  const uploadButton = true; //导入按钮 与 uploadClick 方法 组合使用
  const downloadButton = true; //导出按钮 与 downloadClick 方法 组合使用
  const [incID, setIncID] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  const columnvalue = "emacwhtcolumnvalue"; //设置默认显示的 key 变动 set.strot 存储key
  const apishowurl = "/cfg.php?controller=exceptDev&action=get_macwhite"; //接口路径
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
        placeholder={language("ecpmngt.macwht.tablesearch")}
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
  const uploadClick = () => {
    getImportModal(1);
  };

  //导出按钮
  const downloadClick = (list = {}) => {
    let api = "/cfg.php?controller=confZoneManage&action=exportZone";
    let data = list;
    DownnLoadFile(api, data, setFileDownLoading);
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
        addrlist.push(item.macaddr);
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
    data.macaddr = addrlist;
    let url = "/cfg.php?controller=exceptDev&action=add_macwhite";
    if (op == "mod") {
      url = "/cfg.php?controller=exceptDev&action=modify_macwhite";
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
    post("/cfg.php?controller=exceptDev&action=del_macwhite", { ids: ids })
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
    let addrlist = obj.macaddr ? obj.macaddr.split(";") : [];
    let rowKey = [];
    let defaultDataInfo = [];
    addrlist.map((item, index) => {
      defaultDataInfo.push({ id: index + 1, macaddr: item });
      rowKey.push(index + 1);
    });
    obj.status = obj.status == 1 || obj.status == true ? true : false;
    //设置有效时间的显示隐藏
    if (obj.verify_mode == "abort") {
      setTimeShow(true);
    } else {
      setTimeShow(false);
    }
    if (obj.status == "Y" || obj.status == true) {
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
        <ProFormText hidden={true} type="hidden" name="id" label="IP" />
        <ProFormText
          hidden={true}
          name="op"
          label={language("project.sysconf.syszone.opcode")}
          initialValue={op}
        />
        <Form.Item
          name="status"
          label={language("ecpmngt.ectstu")}
          valuePropName={switchCheck}
        >
          <Switch
            checkedChildren={language("project.enable")}
            unCheckedChildren={language("project.disable")}
          />
        </Form.Item>
        <NameText
          name="name"
          label={language("project.devname")}
          required={true}
        />
        <ProFormRadio.Group
          label={language("ecpmngt.validtype")}
          name="verify_mode"
          fieldProps={{
            buttonStyle: "solid",
            optionType: "button",
          }}
          initialValue="forever"
          rules={[{ required: true }]}
          options={[
            {
              value: "forever",
              label: language("ecpmngt.forever"),
            },
            {
              value: "abort",
              label: language("ecpmngt.expire"),
            },
          ]}
          onChange={(checked) => {
            if (checked.target.value == "abort") {
              setTimeShow(true);
            } else {
              setTimeShow(false);
            }
          }}
        />
        {timeShow == true ? (
          <ProFormDateTimePicker
            name="time"
            showTime
            label={language("project.sysconf.apiauth.validtime")}
          />
        ) : (
          ""
        )}
        <EditTable
          label={language("ecpmngt.macaddress")}
          name={"addrlistinfo"}
          fromcolumns={fromcolumns}
          required={false}
          editableKeys={editableKeys}
          setEditableRowKeys={setEditableRowKeys}
        />
        <NotesText
          name="notes"
          label={language("project.remark")}
          required={false}
        />
      </DrawerForm>

      {/**导入动态字段 选择 */}
      <DrawerForm
        {...drawFromLayout}
        width={"477px"}
        formRef={formRef}
        title={language("project.import")}
        visible={imoritModalStatus}
        autoFocusFirstInput
        drawerProps={{
          className: "uploadmacwhtdrawfrom",
          destroyOnClose: true,
          maskClosable: false,
          placement: "right",
          getContainer: false,
          style: {
            position: "absolute",
          },
          onClose: () => {
            getCloseImport(2);
          },
        }}
        submitter={{
          render: (props, doms) => {
            return [
              doms[0],
              <Button
                type="primary"
                key="subment"
                onClick={() => {
                  formRef.current.submit();
                }}
                loading={spinning}
              >
                {language("project.import")}
              </Button>,
            ];
          },
        }}
        submitTimeout={2000}
        onFinish={async (values) => {}}
      >
        <div style={{ marginBottom: "25px" }}>
          <Alert
            className="filealert"
            message={
              language("ecpmngt.uploadalertmessage") +
              "\n" +
              language("ecpmngt.uploadalertmessageone") +
              "\n" +
              language("ecpmngt.uploadalertmessagetwo")
            }
            type="info"
            showIcon
          />
        </div>
        <ProFormText width={300} label={language("ecpmngt.uploadfile")}>
          <div className="importupDiv">
            <WebUploadr
              isAuto={true}
              upurl={uploadConfig.url}
              upbutext={language("ecpmngt.importfile")}
              maxSize={uploadConfig.max}
              accept={uploadConfig.accept}
              onSuccess={onFileSuccess}
              parameter={paramentUpload}
              isUpsuccess={true}
              isShowUploadList={true}
              maxCount={1}
              iconInfo={uploadText}
            />
          </div>
        </ProFormText>
      </DrawerForm>
    </div>
  );
};
