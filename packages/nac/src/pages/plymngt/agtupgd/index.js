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
  ProFormTreeSelect,
} from "@ant-design/pro-form";
import { NameText, NotesText, EditTable } from "@/utils/fromTypeLabel";
import { drawFromLayout } from "@/utils/helper";
import { language } from "@/utils/language";
import { regMacList, regPortList } from "@/utils/regExp";
import SaveSvg from "@/assets/nac/save.svg";
import ExportSvg from "@/assets/nac/export.svg";
import "@/utils/index.less";
import "@/common/common.less";
import "./index.less";
import { TableLayout, AmTag } from "@/components";
import { set } from "store";
const { ProtableModule } = TableLayout;
const { confirm } = Modal;
const { Search } = Input;
let H = document.body.clientHeight - 336;
var clientHeight = H;
export default () => {
  const columns = [
    {
      title: language("plymngt.agtupgd.status"),
      dataIndex: "status",
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
        if (record.status == "N") {
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
      title: language("plymngt.agtupgd.name"),
      dataIndex: "name",
      align: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: language("plymngt.agtupgd.lssuedto"),
      dataIndex: "dgrpValue",
      align: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: language("plymngt.agtupgd.systype"),
      dataIndex: "agentType",
      align: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: language("plymngt.agtupgd.clientversion"),
      dataIndex: "agentVersion",
      align: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: language("plymngt.agtupgd.identlibraryversion"),
      dataIndex: "identVersion",
      align: "left",
      ellipsis: true,
      width: 130,
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

  const [treeData, setTreeData] = useState([]); //树形组件内容
  const [agentVersionList, setAgentVersion] = useState([]); //客户端版本列表
  const [identVersionList, setIdentVersion] = useState([]); //识别库版本列表
  const [versionsList, setVersionsList] = useState([]); //识别库版本列表

  /** table组件 start */
  const rowKey = (record) => record.id; //列表唯一值
  const tableHeight = clientHeight; //列表高度
  const tableKey = "pagtupgd"; //table 定义的key
  const rowSelection = true; //是否开启多选框
  const addButton = true; //增加按钮  与 addClick 方法 组合使用
  const delButton = true; //删除按钮 与 delClick 方法 组合使用
  const uploadButton = false; //导入按钮 与 uploadClick 方法 组合使用
  const downloadButton = false; //导出按钮 与 downloadClick 方法 组合使用
  const [incID, setIncID] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  const columnvalue = "pagtupgdcolumnvalue"; //设置默认显示的 key 变动 set.strot 存储key
  const apishowurl =
    "/cfg.php?controller=upgradePolicy&action=showUpgradePolicy"; //接口路径
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
        placeholder={language("plymngt.agtupgd.tablesearch")}
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
    getModal(1, "add");
  };

  //导入按钮
  const uploadClick = () => {};

  //导出按钮
  const downloadClick = (list = {}) => {};

  /** table组件 end */

  const incAdd = () => {
    let inc;
    clearTimeout(inc);
    inc = setTimeout(() => {
      setIncID(incID + 1);
    }, 100);
  };

  useEffect(() => {
    showDevGrpComboTree();
    getUpgradeVersion();
  }, []);

  const getUpgradeVersion = () => {
    post("/cfg.php?controller=upgradePolicy&action=getUpgradeVersion")
      .then((res) => {
        if (res.success) {
          setIdentVersion(res.identVersion ? res.identVersion : []);
          setAgentVersion(res.agentVersion ? res.agentVersion : []);
        }
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  const showDevGrpComboTree = (id = 1) => {
    let data = {};
    data.id = id;
    post("/cfg.php?controller=devGroupControl&action=showDevGrpComboTree", data)
      .then((res) => {
        setTreeData(res ? res : []);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

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
    data.opcode = op;
    data.id = info.id;
    data.status = info.status == "Y" || info.status == true ? "Y" : "N";
    data.name = info.name;
    data.devgrpid = info.devgrpid;
    data.agentType = info.agentType;
    data.effectReboot = info.effectReboot?.length > 0 ? "Y" : "N";
    data.agent = info.agent?.length > 0 ? "Y" : "N";
    data.ident = info.ident?.length > 0 ? "Y" : "N";
    data.agentMd5 = info.agentMd5;
    if (info.agentMd5) {
      versionsList?.map((item) => {
        if (item.md5 == info.agentMd5) {
          data.agentVersion = item.text;
        }
      });
    }
    data.identMd5 = info.identMd5;
    if (info.identMd5) {
      identVersionList?.map((item) => {
        if (item.md5 == info.identMd5) {
          data.identVersion = item.text;
        }
      });
    }
    post("/cfg.php?controller=upgradePolicy&action=setUpgradePolicy", data)
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
    post("/cfg.php?controller=upgradePolicy&action=delUpgradePolicy", {
      id: ids,
    })
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
    let info = { ...obj };
    info.status = info.status == "Y" || info.status === true ? true : false;
    info.effectReboot = info.effectReboot == "Y" ? ["Y"] : [];
    info.agent = info.agent == "Y" ? ["Y"] : [];
    info.ident = info.ident == "Y" ? ["Y"] : [];
    agentVersionList?.map((item) => {
      if (item.value == obj.agentType) {
        setVersionsList(item.versions);
      }
    });
    let initialValues = info;
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
        取消
      </Button>
      <Button type="primary" onClick={() => {}}>
        批量禁用
      </Button>
      <Button type="primary" onClick={() => {}}>
        批量开启
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
        width={"510px"}
        formRef={formRef}
        title={
          op == "add" ? language("project.add") : language("project.alter")
        }
        visible={modalStatus}
        autoFocusFirstInput
        drawerProps={{
          className: "agtupdgfrombox",
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
        <ProFormText hidden name="id" />
        <ProFormSwitch
          checkedChildren={language("project.enable")}
          unCheckedChildren={language("project.disable")}
          name="status"
          label={language("plymngt.agtupgd.status")}
        />
        <NameText
          label={language("plymngt.agtupgd.name")}
          name="name"
          required={true}
        />
        <ProFormTreeSelect
          name="devgrpid"
          label={language("plymngt.agtupgd.lssuedto")}
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
        <ProFormSelect
          options={agentVersionList}
          name="agentType"
          fieldProps={{
            fieldNames: {
              label: "text",
            },
          }}
          onChange={(e) => {
            agentVersionList?.map((item) => {
              if (item.value == e) {
                setVersionsList(item.versions);
              }
            });
          }}
          label={language("plymngt.agtupgd.systype")}
        />
        <div className="itembuttombox">
          <ProFormCheckbox.Group
            name="agent"
            label={language("plymngt.agtupgd.clientversion")}
            options={[
              {
                label: language("plymngt.agtupgd.selectcholiceclientversion"),
                value: "Y",
              },
            ]}
            addonAfter={
              <div className="itembuttombox itempositionbox">
                <ProFormSelect
                  options={versionsList}
                  fieldProps={{
                    fieldNames: {
                      label: "text",
                      value: "md5",
                    },
                  }}
                  width="153px"
                  name="agentMd5"
                />
              </div>
            }
          />
        </div>
        <ProFormCheckbox.Group
          name="effectReboot"
          label={" "}
          options={[
            {
              label: language("plymngt.agtupgd.performipgradeafterreboot"),
              value: "Y",
            },
          ]}
        />
        <ProFormCheckbox.Group
          name="ident"
          label={language("plymngt.agtupgd.identlibraryversion")}
          options={[
            {
              label: language(
                "plymngt.agtupgd.selectcholiceidentlibraryversion"
              ),
              value: "Y",
            },
          ]}
          addonAfter={
            <div className="itembuttombox itempositionbox">
              <ProFormSelect
                options={identVersionList}
                fieldProps={{
                  fieldNames: {
                    label: "text",
                    value: "md5",
                  },
                }}
                width="153px"
                name="identMd5"
              />
            </div>
          }
        />
      </DrawerForm>
    </div>
  );
};
