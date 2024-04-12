import React, { useRef, useState, useEffect } from "react";
import {
  Button,
  Input,
  message,
  Modal,
  Form,
  Tree,
  Popconfirm,
  Tooltip,
  Space,
  Alert,
} from "antd";
import { fileDown, post } from "@/services/https";
import {
  SaveFilled,
  ExclamationCircleOutlined,
  EditFilled,
  DeleteFilled,
  DownOutlined,
  FrownFilled,
  FrownOutlined,
  SmileOutlined,
  MehOutlined,
  PlusOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import ProForm, {
  ProFormTextArea,
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormRadio,
  DrawerForm,
} from "@ant-design/pro-form";
import { EditableProTable } from "@ant-design/pro-components";
import { drawFromLayout } from "@/utils/helper";
import { language } from "@/utils/language";
import { NameText, NotesText } from "@/utils/fromTypeLabel";
import { regSeletcList, regList } from "@/utils/regExp";
import { Base64 } from "js-base64";
import { ReactComponent as AddSvg } from "@/assets/nac/mconfig/addSvg.svg";
import { ReactComponent as ModSvg } from "@/assets/nac/mconfig/modSvg.svg";
import { ReactComponent as DelSvg } from "@/assets/nac/mconfig/delSvg.svg";
import { ReactComponent as SaveSvg } from "@/assets/nac/save.svg";
import { ReactComponent as GroupSvg } from "@/assets/nac/group.svg";
import AddAuthCfg from "../../objman/components/addAuthCfg";
import AddIcon from "@/assets/nac/add.svg";
import "@/utils/index.less";
import "@/common/common.less";
import "./index.less";
import { regMacList } from "@/utils/regExp";
import { TableLayout, LeftTree, CardModal, AmTag } from "@/components";
const { ProtableModule } = TableLayout;
const { Search } = Input;
let H = document.body.clientHeight - 285;
var clientHeight = H;
export default () => {
  const columns = [
    {
      title: "用户名称",
      dataIndex: "name",
      align: "left",
      ellipsis: true,
      importStatus: 0,
      width: 100,
    },
    {
      title: "显示名称",
      dataIndex: "text",
      align: "left",
      ellipsis: true,
      importStatus: 0,
      width: 100,
    },
    {
      title: "状态",
      dataIndex: "name",
      align: "center",
      ellipsis: true,
      importStatus: 0,
      width: 80,
      render: (text, record) => {
        if (record.status == 1) {
          return <AmTag color="#12c189" name={"启用"} />;
        } else {
          return <AmTag color="#FF0000" name={"禁用"} />;
        }
      },
    },
    {
      title: "类型",
      dataIndex: "kindName",
      align: "left",
      ellipsis: true,
      importStatus: 0,
      width: 120,
    },
    {
      title: "所属部门",
      dataIndex: "group",
      align: "left",
      ellipsis: true,
      importStatus: 0,
      width: 120,
    },
    {
      title: "登录模式",
      dataIndex: "loginType",
      align: "center",
      ellipsis: true,
      importStatus: 0,
      width: 100,
    },
    {
      title: "所属分组",
      dataIndex: "authorityGroup",
      align: "left",
      ellipsis: true,
      importStatus: 0,
      width: 120,
    },
    {
      title: "分组授权域",
      dataIndex: "authority",
      align: "left",
      ellipsis: true,
      importStatus: 0,
      width: 120,
      render: (text, record, index) => {
        return (
          <AmTag
            color="#E7F7FF"
            name={"准入网关"}
            style={{
              borderRadius: "5px",
              border: "1px solid #91D5FF",
              color: "#2E9AFF",
            }}
          />
        );
      },
    },
  ];

  const columns1 = [
    {
      title: "用户名称",
      dataIndex: "name",
      align: "left",
      ellipsis: true,
      importStatus: 0,
      width: 100,
    },
    {
      title: "显示名称",
      dataIndex: "text",
      align: "left",
      ellipsis: true,
      importStatus: 0,
      width: 100,
    },
    {
      title: "状态",
      dataIndex: "status",
      align: "center",
      ellipsis: true,
      importStatus: 0,
      width: 80,
      render: (text, record) => {
        if (record.status == "1") {
          return (
            <AmTag
              color="#12c189"
              name={"启用"}
              style={{ borderRadius: "5px" }}
            />
          );
        } else {
          return (
            <AmTag
              color="#FF0000"
              name={"禁用"}
              style={{ borderRadius: "5px" }}
            />
          );
        }
      },
    },
    {
      title: "类型",
      dataIndex: "kindName",
      align: "left",
      ellipsis: true,
      importStatus: 0,
      width: 100,
    },
    {
      title: "所属部门",
      dataIndex: "group",
      align: "left",
      ellipsis: true,
      importStatus: 0,
      width: 100,
    },
    {
      title: "登陆模式",
      dataIndex: "name",
      align: "left",
      ellipsis: true,
      importStatus: 0,
      width: 100,
      render: (text, record) => {
        if (record.loginType == "single") {
          return "单点登录";
        }
        if (record.loginType == "multi") {
          return "多点登录";
        }
      },
    },
  ];

  const [modalStatus, setModalStatus] = useState(false); //model 添加弹框状态
  const [addVisible, setAddVisible] = useState(false); //添加弹窗
  const [op, setop] = useState("add"); //选中id数组
  const [oldName, setOldName] = useState(); //修改前地址名称
  const [zoneId, setZoneId] = useState();
  const [modZoneId, setModZoneId] = useState(); //默认编辑地址id
  const [leftTreeData, setLeftTreeData] = useState([]);
  const [typeArr, setTypeArr] = useState([]); //授权域内容
  const [addAuthCfgVisible, setAddAuthCfgVisible] = useState(false); //新建权限配置弹窗开关
  const [domains, setDomains] = useState([]); //保存临时隔离区域
  const { confirm } = Modal;
  const zoneType = "all";

  const [fileCode, setFileCode] = useState("utf-8"); //文件编码
  //接口参数
  const paramentUpload = {
    filecode: fileCode,
  };
  const fileList = [];
  const uploadConfig = {
    accept: "csv", //接受上传的文件类型：zip、pdf、excel、image
    max: 100000000000000, //限制上传文件大小
    url: "/cfg.php?controller=confZoneManage&action=importZone",
  };

  //列表数据
  const [addform] = Form.useForm();
  const [treeValue, setTreeValue] = useState();
  const [treekey, setTreekey] = useState([]);
  const [treeData, setTreeData] = useState([]);

  const [orgStatus, setOrgStatus] = useState("zone");
  const [editableKeys, setEditableRowKeys] = useState(); //每行编辑的id
  const [confirmLoading, setConfirmLoading] = useState(false);
  const renderRemove = (text, record) => (
    <Popconfirm
      onConfirm={() => {
        setConfirmLoading(false);
        const tableDataSource = groupList;
        setGroupList(tableDataSource.filter((item) => item.uid != record.uid));
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
  const deleteRemode = (text, record) => (
    <Popconfirm
      onConfirm={() => {}}
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
      title: "用户名称",
      dataIndex: "uname",
      align: "center",
    },
    {
      title: "所属部门",
      dataIndex: "group",
      align: "center",
    },
    {
      title: language("project.operate"),
      valueType: "option",
      width: "25%",
      align: "center",
      render: (text, record, _, action) => [
        <>{renderRemove(<DeleteFilled style={{ color: "red" }} />, record)}</>,
      ],
    },
  ];

  /** table组件 start */
  const rowKey = (record) => record.id; //列表唯一值
  const tableHeight = clientHeight - 10; //列表高度
  const tableKey = "usgroup"; //table 定义的key
  const rowSelection = true; //是否开启多选框
  const addButton = true; //增加按钮  与 addClick 方法 组合使用
  const addTitle = "添加成员";
  const delButton = true; //删除按钮 与 delClick 方法 组合使用
  const delTitle = "删除成员";
  const uploadButton = false; //导入按钮 与 uploadClick 方法 组合使用
  const downloadButton = false; //导出按钮 与 downloadClick 方法 组合使用
  const [incID, setIncID] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  const columnvalue = "usgroupcolumnvalue"; //设置默认显示的 key 变动 set.strot 存储key
  const apishowurl = "/cfg.php?controller=userList&action=showAuthUserList"; //接口路径
  const [queryVal, setQueryVal] = useState(); //首个搜索框的值
  let searchVal = { queryVal: queryVal, queryType: "fuzzy", agid: selectedKey }; //顶部搜索框值 传入接口

  //初始默认列
  const concealColumns = {
    id: { show: false },
    gpid: { show: false },
    updateTime: { show: false },
    createTime: { show: false },
  };
  /* 顶部左侧搜索框*/
  const tableTopSearch = () => {
    return (
      <Search
        placeholder={language("usrmngt.syszone.tablesearch")}
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
    if (!selectedKey || selectedKey == 0 || selectedKey == -1) {
      message.error("请选择权限分组！");
    } else {
      getAddModal(1);
    }
  };

  /** table组件 end */

  //状态from里面弹框还是页面表格
  const incAdd = (status) => {
    if (status) {
      let inc;
      clearTimeout(inc);
      inc = setTimeout(() => {
        setIncID1(incID1 + 1);
      }, 100);
    } else {
      let inc;
      clearTimeout(inc);
      inc = setTimeout(() => {
        setIncID(incID + 1);
      }, 100);
    }
  };

  useEffect(() => {
    get_dev_group_list();
    show_securitydomain();
  }, []);

  //递归添加图标
  const dIcon = (list) => {
    list.map((key) => {
      key.icon = <GroupSvg />;
      if (key.children && key.children.length >= 1) {
        dIcon(key.children);
      }
    });
    return list;
  };

  //获取左侧菜单内容
  const get_dev_group_list = () => {
    post("/cfg.php?controller=userList&action=getAuthGroup")
      .then((res) => {
        setLeftTreeData(dIcon(res));
        console.log(res[0].id);
        setSelectedKey(res[0]?.id);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  //获取添加授权域内容
  const show_securitydomain = () => {
    post("/cfg.php?controller=securityDomain&action=show_securitydomain")
      .then((res) => {
        if (res.success && res.data.length >= 1) setTypeArr(res.data);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  /* 判断是否弹出添加model*/
  const getModal = (status, op) => {
    if (status == 1) {
      setop(op);
      setModalStatus(true);
    } else {
      setModZoneId();
      setTreeValue();
      setModalStatus(false);
    }
  };

  /**
   * 添加选择框状态
   * @param {*} info
   */
  const getAddModal = (status) => {
    if (status == 1) {
      incAdd(1);
      setAddVisible(true);
      true;
    } else {
      setAddVisible(false);
    }
  };

  /* 添加修改接口*/
  const save = (info) => {
    let data = {};
    data.opcode = op == "add" ? "add" : "set";
    data.agid = selectedKey;
    data.name = info.name;
    data.authority = info.authority;
    data.note = info.note;
    let uids = getCloumnValues(groupList, "uid");
    let unames = getCloumnValues(groupList, "uname");
    data.uids = uids.length >= 1 ? uids.join(",") : "";
    data.unames = unames.length >= 1 ? unames.join(",") : "";
    post("/cfg.php?controller=userList&action=setAuthGroup", data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        setTreeValue(" ");
        setTreekey([]);
        getModal(2);
        setTreeInc(treeInc + 1);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  /* 删除数据 */
  const delList = (selectedRowKeys, dataList) => {
    let selectedRowNames = [];
    dataList.map((item) => {
      if (selectedRowKeys.indexOf(item.id) != -1) {
        selectedRowNames.push(item.name);
      }
    });
    let data = {};
    data.ids = selectedRowKeys.join(",");
    data.names = selectedRowNames.join(",");
    post("/cfg.php?controller=confZoneManage&action=delZone", data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        setTreeInc(treeInc + 1);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  /* 编辑 */
  const mod = (op) => {
    console.log(selectedKey);
    if (!selectedKey) {
      message.error("请选择分组");
      return false;
    }
    if (selectedKey[0] == 0) {
      message.error("全部分组不能操作");
      return false;
    }
    let obj = {};
    leftTreeData[0]?.children?.map((item) => {
      console.log(item);
      if ((item.id = selectedKey[0])) {
        obj.name = item.name;
        obj.note = item.note;
        obj.authority = item.authority;
      }
    });
    // let arr = [];
    // modTableList.map((item) => {
    //   if (modSelectList.indexOf(item.id) != -1 && keys.indexOf(item.id) == -1) {
    //     let obj = {};
    //     console.log(item)
    //     obj.uname = item.name;
    //     obj.group = item.group;
    //     obj.uid = item.id;
    //     arr.push(obj);
    //   }
    // })
    // setGroupList(arr);
    let initialValues = obj;
    getModal(1, op);
    setTimeout(function () {
      addform.setFieldsValue(initialValues);
    }, 500);
  };

  /**
   *
   */
  const showUserInfo = () => {
    post("/cfg.php?controller=securityDomain&action=show_securitydomain")
      .then((res) => {
        if (res.success && res.data.length >= 1) setTypeArr(res.data);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  const [modTableList, setModTableList] = useState([]);
  const [modSelectList, setModSelectList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  /** table组件 start */
  const rowKey1 = (record) => record.id; //列表唯一值
  const tableHeight1 = clientHeight - 10; //列表高度
  const rightOptionsClose = true; //右侧操作关闭
  const tableKey1 = "usgroup1"; //table 定义的key
  const rowSelection1 = true; //是否开启多选框
  const addButton1 = false; //增加按钮  与 addClick 方法 组合使用
  const delButton1 = false; //删除按钮 与 delClick 方法 组合使用
  const uploadButton1 = false; //导入按钮 与 uploadClick 方法 组合使用
  const downloadButton1 = false; //导出按钮 与 downloadClick 方法 组合使用
  const [incID1, setIncID1] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  const columnvalue1 = "usgroup1columnvalue"; //设置默认显示的 key 变动 set.strot 存储key
  const apishowurl1 = "/cfg.php?controller=userList&action=showUserInfo"; //接口路径
  const [queryVal1, setQueryVal1] = useState(); //首个搜索框的值
  let searchVal1 = {
    queryVal: queryVal1,
    queryType: "fuzzy",
    agid: selectedKey,
  }; //顶部搜索框值 传入接口

  //初始默认列
  const concealColumns1 = {
    id: { show: false },
    gpid: { show: false },
    updateTime: { show: false },
    createTime: { show: false },
  };
  /* 顶部左侧搜索框*/
  const tableTopSearch1 = () => {
    return (
      <div style={{ display: "flex" }}>
        <Search
          placeholder={language("usrmngt.syszone.tablesearch")}
          style={{ width: 200, marginLeft: "10px" }}
          onSearch={(queryVal) => {
            setQueryVal1(queryVal);
            incAdd();
          }}
        />
        <Alert
          message={"每个用户最多可关联8个权限分组"}
          type="info"
          className="usgralertbox"
          showIcon
        />
      </div>
    );
  };

  const rightCstomButton = () => {
    return (
      <Space>
        <Space style={{ marginRight: "19px" }} size={5}>
          <RedoOutlined style={{ color: "#91D5FF" }} />
          <span>刷新</span>
        </Space>
      </Space>
    );
  };

  //获取列表数据
  const tableShowList1 = (res) => {
    setModTableList(res.data);
  };

  //获取选中数据
  const onSelectData1 = (selectedRowKeys, selectedRows) => {
    setModSelectList(selectedRowKeys);
  };

  /** table组件 end */

  const getCloumnValues = (arr, key) => {
    return arr.map((row) => row[key]);
  };

  /**
   * 添加分组成员数据处理
   */
  const modAddClick = () => {
    const keys = getCloumnValues(groupList, "uid");
    let arr = [];
    modTableList.map((item) => {
      if (modSelectList.indexOf(item.id) != -1 && keys.indexOf(item.id) == -1) {
        let obj = {};
        console.log(item);
        obj.uname = item.name;
        obj.group = item.group;
        obj.uid = item.id;
        arr.push(obj);
      }
    });
    setGroupList(arr);
    getAddModal(2);
  };

  const [selectedKey, setSelectedKey] = useState([]);
  // 区域管理侧边点击id处理
  const onSelect = (selectedKeys, info) => {
    setSelectedKey(selectedKeys);
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        overflow: "hidden",
      }}
      className={"uusergroupbox"}
    >
      <CardModal
        title={"权限分组"}
        cardHeight={clientHeight + 182}
        leftContent={
          <div>
            <div
              style={{
                height: "1px",
                border: "1px solid rgba(245,245,245,1)",
                marginTop: "13px",
              }}
            ></div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
                margin: "8px 24px 8px 24px",
              }}
            >
              <div
                onClick={() => {
                  getModal(1, "add");
                }}
              >
                <AddSvg
                  style={{ position: "relative", top: "2px", fill: "#1677ff" }}
                />
                <span style={{ marginLeft: "5px" }}>新建</span>
              </div>
              <div style={{ display: "flex" }}>
                <div
                  onClick={() => {
                    mod("mod");
                  }}
                >
                  <ModSvg
                    style={{
                      position: "relative",
                      top: "2px",
                      fill: "#1677ff",
                    }}
                  />
                  <span style={{ marginLeft: "5px", marginRight: "10px" }}>
                    编辑
                  </span>
                </div>
                {deleteRemode(
                  <div
                    onClick={() => {
                      deleteRemode("删除");
                    }}
                  >
                    <DelSvg
                      style={{
                        position: "relative",
                        top: "2px",
                        fill: "#1677ff",
                      }}
                    />
                    <span
                      style={{
                        marginLeft: "5px",
                        color: "rgba(0, 0, 0, 0.85)",
                      }}
                    >
                      删除
                    </span>
                  </div>,
                  {}
                )}
              </div>
            </div>
            <div
              style={{
                height: "1px",
                border: "1px solid rgba(245,245,245,1)",
              }}
            ></div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
                margin: "10px 24px 24px 24px",
              }}
            >
              <Tree
                showIcon
                defaultExpandAll
                switcherIcon={<DownOutlined />}
                defaultSelectedKeys={selectedKey}
                treeData={leftTreeData}
                selectedKeys={selectedKey}
                onSelect={onSelect}
                fieldNames={{
                  title: "name",
                  key: "id",
                }}
              />
            </div>
          </div>
        }
        rightContent={
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
            delTitle={delTitle}
            addButton={addButton}
            addClick={addClick}
            addTitle={addTitle}
            rowSelection={rowSelection}
            uploadButton={uploadButton}
            downloadButton={downloadButton}
          />
        }
      />
      <DrawerForm
        //  {...drawFromLayout}
        width="412px"
        layout={"horizontal"}
        form={addform}
        title={op == "add" ? "新建分组" : "编辑分组"}
        visible={modalStatus}
        autoFocusFirstInput
        onVisibleChange={setModalStatus}
        drawerProps={{
          className: "operate-drawm-close-right ugfrombox",
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
        submitTimeout={2000}
        onFinish={async (values) => {
          save(values);
        }}
      >
        <ProFormText hidden={true} type="hidden" name="id" />
        <ProFormText
          hidden={true}
          name="op"
          label={language("usrmngt.syszone.opcode")}
          initialValue={op}
        />
        <NameText
          name="name"
          label={language("usrmngt.syszone.areaname")}
          required={true}
        />
        <ProFormSelect
          options={typeArr}
          onChange={(key, val) => {
            setOrgStatus(key);
          }}
          width={"284px"}
          name="authority"
          rules={[{ required: true, message: regSeletcList.select.alertText }]}
          label={language("usrmngt.syszone.authorizationdomain")}
          addonAfter={
            <div>
              <img
                src={AddIcon}
                alt=""
                className={"addiconoption"}
                onClick={(e) => {
                  setAddAuthCfgVisible(true);
                }}
              />
            </div>
          }
        />
        <NotesText
          name="note"
          type="text"
          label={language("usrmngt.syszone.desc")}
          width="xl"
          required={false}
        />
        <div className="editboxname">
          <ProForm.Item name={"addrlistinfo"} label={"成员"}>
            <EditableProTable
              scroll={170}
              rowKey="id"
              size="small"
              value={groupList}
              bordered={true}
              toolBarRender={false}
              columns={fromcolumns}
              recordCreatorProps={false}
              editable={{
                type: "multiple",
                editableKeys,
                onChange: setEditableRowKeys,
                actionRender: (row, config, defaultDom) => {
                  return [defaultDom.cancel];
                },
              }}
            />
          </ProForm.Item>
          <Button
            key="button"
            className="editboxbutton"
            onClick={() => {
              getAddModal(1);
            }}
            type="dashed"
          >
            <PlusOutlined style={{ color: "#8C8483" }} />
            添加成员
          </Button>
        </div>
      </DrawerForm>

      <ModalForm
        layout="horizontal"
        destroyOnClose
        visible={addVisible}
        width="744px"
        title={"添加分组成员"}
        onVisibleChange={setAddVisible}
        modalProps={{
          destroyOnClose: true,
          wrapClassName: "ugmodalebox",
        }}
        onFinish={(values) => {
          modAddClick();
        }}
      >
        <ProtableModule
          concealColumns={concealColumns1}
          columns={columns1}
          apishowurl={apishowurl1}
          incID={incID1}
          clientHeight={tableHeight1}
          columnvalue={columnvalue1}
          tableKey={tableKey1}
          searchText={tableTopSearch1()}
          searchVal={searchVal1}
          rowkey={rowKey1}
          delButton={delButton1}
          addButton={addButton1}
          rowSelection={rowSelection1}
          uploadButton={uploadButton1}
          downloadButton={downloadButton1}
          rightOptionsClose={rightOptionsClose}
          rightCstomButton={rightCstomButton()}
          tableShowList={tableShowList1}
          onSelectData={onSelectData1}
        />
      </ModalForm>
      <AddAuthCfg
        addVisible={addAuthCfgVisible}
        setAddModalVisible={setAddAuthCfgVisible}
        formType="modal"
        mainaddform={addform}
      />
    </div>
  );
};
