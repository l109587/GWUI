import { ProtableModule } from "@/components/Module";
import { useState, useEffect } from "react";
import { useSelector } from "umi";
import {
  Space,
  Tag,
  Drawer,
  Col,
  Row,
  Input,
  Select,
  Form,
  message,
  Popconfirm,
  Spin,
  Modal,
  Tooltip,
  Switch,
} from "antd";
import {
  ProFormSelect,
  DrawerForm,
  ProFormTreeSelect,
  ProFormRadio,
  ProFormSwitch,
  ProFormDependency,
} from "@ant-design/pro-components";
import {
  CloseOutlined,
  MenuOutlined,
  StopOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import { NameText } from "@/utils/fromTypeLabel";
import { language } from "@/utils/language";
import { SortableHandle } from "react-sortable-hoc";
import { post } from "@/services/https";
import styles from "./index.less";
import AddIcon from "@/assets/nac/add.svg";
import SaveSvg from "@/assets/nac/save.svg";
import AddTermGroup from "../../objman/components/addtermgrp";
import AddAuthCfg from "../../objman/components/addAuthCfg";

const DragHandle = SortableHandle(() => (
  <MenuOutlined style={{ cursor: "grab", color: "#999" }} />
));

const { confirm } = Modal;

export default function () {
  const [incID, setIncID] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  const [screenList, setScreenList] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false); //抽屉开关
  const [recordInfo, setRecordInfo] = useState({}); //策略信息
  const [termgrpVisible, setTermgrpVisible] = useState(false); //新建终端分组弹窗开关
  const [devGrpCombo, setDevGrpCombo] = useState([]); //终端分组
  const [addAuthCfgVisible, setAddAuthCfgVisible] = useState(false); //新建权限配置弹窗开关
  const [domains, setDomains] = useState([]); //保存临时隔离区域

  const contentHeight = useSelector(({ app }) => app.contentHeight);
  let clientHeight = contentHeight - 220;

  const [addform] = Form.useForm();
  useEffect(() => {
    fetchDevGrpCombo();
    fetchDomain();
  }, []);

  const drawFormLayout = {
    labelCol: {
      span: 7,
    },
    wrapperCol: {
      span: 15,
    },
    layout: "horizontal",
  };

  const columnsList = [
    {
      title: language("project.sort"),
      dataIndex: "sort",
      fixed: "left",
      width: 60,
      ellipsis: true,
      className: "drag-visible",
      render: (text, record, index) => {
        return (
          <div>
            <DragHandle />
            <span style={{ marginLeft: "6px" }}>{record.number}</span>
          </div>
        );
      },
    },
    {
      title: "状态",
      width: 80,
      dataIndex: "state",
      key: "state",
      align: "center",
      render: (text, record) => {
        return (
          <Switch
            checked={text === "Y"}
            onChange={(state) => {
              changeStatus(record, state);
            }}
            checkedChildren={language("project.open")}
            unCheckedChildren={language("project.close")}
          />
        );
      },
    },
    {
      title: "策略名称",
      width: 110,
      dataIndex: "name",
      key: "name",
      align: "left",
      ellipsis: true,
    },
    {
      title: "执行类型",
      width: 110,
      dataIndex: "type",
      key: "type",
      align: "center",
      render: (text) => {
        const color = text === "dev" ? "cyan" : "volcano";
        return (
          <Tag color={color} style={{ margin: 0 }}>
            {text === "dev" ? "终端对象" : "角色对象"}
          </Tag>
        );
      },
    },
    {
      title: "执行对象",
      width: 150,
      dataIndex: "object",
      key: "object",
      align: "left",
      ellipsis: true,
    },
    {
      title: "访问区域",
      width: 150,
      dataIndex: "authority",
      key: "authority",
      align: "left",
      ellipsis: true,
    },
    {
      title: "执行动作",
      width: 110,
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (text) => {
        const color = text === "permit" ? "#00c48e" : "#ff0000";
        return (
          <Tag color={color} style={{ margin: 0, width: 65 }}>
            {text === "permit" ? "允许" : "拒绝"}
          </Tag>
        );
      },
    },
    {
      title: "配置来源",
      width: 100,
      dataIndex: "from",
      key: "from",
      align: "left",
      render: (text) => {
        return text === "local" ? "本地" : "不详";
      },
    },
    {
      title: "创建者",
      width: 100,
      dataIndex: "admin",
      key: "admin",
      align: "left",
    },
    {
      title: "创建时间",
      width: 150,
      dataIndex: "createtime",
      key: "createtime",
      align: "left",
      ellipsis: true,
    },
    {
      title: "更新时间",
      // width: 150,
      dataIndex: "updatetime",
      key: "updatetime",
      align: "left",
      ellipsis: true,
    },
    {
      title: "操作",
      width: 100,
      dataIndex: "operate",
      key: "operate",
      align: "center",
      fixed: "right",
      render: (_, record) => {
        return (
          <Space>
            <Tooltip title={language("project.moveup")}>
              <span
                onClick={
                  record.first
                    ? false
                    : () => {
                        priorityadmpolicy(record, "up");
                      }
                }
              >
                <i
                  className="fa fa-arrow-circle-up"
                  style={{
                    color: record.first ? "#88898A" : "#12C189",
                    fontSize: "15px",
                    cursor: "pointer",
                  }}
                  aria-hidden="true"
                ></i>
              </span>
            </Tooltip>
            <Tooltip title={language("project.movedown")}>
              <span
                onClick={
                  record.last
                    ? false
                    : () => {
                        priorityadmpolicy(record, "down");
                      }
                }
              >
                <i
                  className="fa fa-arrow-circle-down"
                  style={{
                    color: record.last ? "#88898A" : "#12C189",
                    fontSize: "15px",
                    cursor: "pointer",
                  }}
                  aria-hidden="true"
                ></i>
              </span>
            </Tooltip>
            <Tooltip
              title={language("project.edit")}
              arrowPointAtCenter
              onClick={() => {
                setRecordInfo(record);
                setDrawerOpen(true);
                addform.setFieldsValue({ ...record, target: record.action });
              }}
            >
              <div
                style={{ height: 22, display: "flex", alignContent: "center" }}
              >
                <img src={SaveSvg} style={{ cursor: "pointer", width: 16 }} />
              </div>
            </Tooltip>
          </Space>
        );
      },
    },
  ];
  //获取终端分组
  const fetchDevGrpCombo = () => {
    post("/cfg.php?controller=devGroupControl&action=showDevGrpComboTree")
      .then((res) => {
        setDevGrpCombo(res ? res : []);
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };
  //获取隔离区域
  const fetchDomain = () => {
    post("/cfg.php?controller=securityDomain&action=show_securitydomain")
      .then((res) => {
        setDomains(res.data ? res.data : []);
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };
  //顺序变动接口
  const priorityadmpolicy = (record, direction) => {
    let data = {
      direction,
      id: record.id,
      policyName: record.name,
      number: record.number,
      moveLocation: 1,
      filters: screenList,
    };
    post("/cfg.php?controller=accessPolicy&action=move", data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        setIncID(incID + 1);
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };
  //新增
  const addClick = () => {
    setDrawerOpen(true);
  };
  const dragSort = (oldIndex, newIndex, dataList) => {
    // let data = {};
    // data.id = dataList[oldIndex].id;
    // data.number = dataList[oldIndex].number;
    // data.endnumber = dataList[newIndex].number;
    // post('/cfg.php?controller=accessPolicy&action=priorityadmpolicy', data).then((res) => {
    //   if (!res.success) {
    //     message.error(res.msg);
    //     return false;
    //   }
    //   setIncID(incID + 1);
    // }).catch(() => {
    //   console.log('mistake');
    // })
    return true;
  };
  //批量删除
  const delClick = (selectedRowKeys, dataList, selectRecord) => {
    const sum = selectedRowKeys.length;
    confirm({
      icon: <CloseCircleFilled style={{ color: "red" }} />,
      title: language("project.delconfirm"),
      content: language("project.cancelcon", { sum: sum }),
      className: "delModal",
      okType: "danger",
      onOk: () => {
        delconfirm(selectRecord);
      },
    });
  };
  //确定删除
  const delconfirm = (selectRecord) => {
    const names = [];
    const ids = [];
    selectRecord.map((item) => {
      names.push(item.name);
      ids.push(item.id);
    });
    const params = { names: names.join(","), ids: ids.join(",") };
    post("/cfg.php?controller=accessPolicy&action=del", params)
      .then((res) => {
        if (res.success) {
          res.msg && message.success(res.msg);
          setIncID((incID) => incID + 1);
        } else {
          res.msg && message.error(res.msg);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };
  //更改状态
  const changeStatus = (info, state) => {
    const params = { name: info.name, ids: info.id, state: state ? "Y" : "N" };
    post("/cfg.php?controller=accessPolicy&action=enable", params)
      .then((res) => {
        if (res.success) {
          res.msg && message.success(res.msg);
          setIncID((incID) => incID + 1);
        } else {
          res.msg && message.error(res.msg);
        }
      })
      .catch(() => {
        console.log("mistake");
      });
  };
  //全部禁用
  const disabledAllRender = () => {
    return (
      <Space style={{ cursor: "pointer" }} onClick={disabledAll}>
        <StopOutlined style={{ color: "#004AB5" }} />
        <span style={{ color: "#004AB5" }}>全部禁用</span>
      </Space>
    );
  };
  const disabledAll = () => {
    const params = { status: "N" };
    post("/cfg.php?controller=accessPolicy&action=enableAll", params)
      .then((res) => {
        if (res.success) {
          res.msg && message.success(res.msg);
          setIncID((incID) => incID + 1);
        } else {
          res.msg && message.error(res.msg);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };
  //关闭弹窗重置数据
  const resetValues = () => {
    addform.resetFields();
    setDrawerOpen(false);
    setRecordInfo({});
  };
  //保存编辑入网策略
  const saveInfo = (values) => {
    const url =
      Object.keys(recordInfo).length === 0
        ? "/cfg.php?controller=accessPolicy&action=add"
        : "/cfg.php?controller=accessPolicy&action=mod";
    const params = { ...values, id: recordInfo.id || undefined };
    post(url, params)
      .then((res) => {
        if (res.success) {
          res.msg && message.success(res.msg);
          setIncID((incID) => incID + 1);
          resetValues();
        } else {
          res.msg && message.error(res.msg);
        }
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
        columns={columnsList}
        apishowurl="/cfg.php?controller=accessPolicy&action=show"
        incID={incID}
        clientHeight={clientHeight}
        tableKey="aclTable"
        rowkey="id"
        columnvalue="aclColumnvalue"
        addButton={true}
        addClick={addClick}
        delButton={true}
        delClick={delClick}
        checkRowKey="id"
        dragSort={dragSort}
        setScreenList={setScreenList}
        rowSelection={true}
        otherOperate={disabledAllRender}
      />
      <DrawerForm
        {...drawFormLayout}
        title={JSON.stringify(recordInfo) == "{}" ? "添加" : "编辑"}
        form={addform}
        visible={drawerOpen}
        onVisibleChange={setDrawerOpen}
        drawerProps={{
          destroyOnClose: true,
          placement: "right",
          closable: false,
          getContainer: false,
          style: {
            position: "absolute",
          },
          extra: (
            <div>
              <span onClick={resetValues} style={{ cursor: "pointer" }}>
                <CloseOutlined />
              </span>
            </div>
          ),
          onClose: resetValues,
        }}
        initialValues={{
          state: "N",
          type: "dev",
          target: "permit",
        }}
        width={480}
        onFinish={saveInfo}
      >
        <div>
          <ProFormSwitch
            label="策略状态"
            name="state"
            checkedChildren={language("project.enable")}
            unCheckedChildren={language("project.disable")}
            getValueFromEvent={(value) => {
              return value ? "Y" : "N";
            }}
            getValueProps={(value) => ({ checked: value === "Y" })}
          />
        </div>

        <NameText
          name="name"
          label="策略名称"
          width={250}
          placeholder="请输入名称"
          required={true}
        />
        <ProFormRadio.Group
          width={250}
          options={[
            { label: "终端对象", value: "dev" },
            { label: "角色对象", value: "role" },
          ]}
          label="执行类型"
          name="type"
          fieldProps={{
            optionType: "button",
            buttonStyle: "solid",
            className: styles.aclRadioGroup,
          }}
        />
        <div className={styles.formItem}>
          <ProFormTreeSelect
            name="object"
            label="执行对象"
            rules={[
              {
                required: true,
                message: language("project.mandatory"),
              },
            ]}
            width={250}
            fieldProps={{
              showArrow: true,
              filterTreeNode: true,
              dropdownMatchSelectWidth: false,
              labelInValue: false,
              autoClearSearchValue: true,
              treeData: devGrpCombo,
              treeNodeFilterProp: "text",
              fieldNames: {
                label: "text",
                value: "value",
              },
              allowClear: false,
              treeNodeLabelProp: "value",
              placeholder: language("project.select"),
            }}
          />
          <img
            src={AddIcon}
            className={styles.addicon}
            onClick={() => {
              setTermgrpVisible(true);
            }}
          />
        </div>
        <ProFormDependency name={["type"]}>
          {({ type }) => {
            return (
              <div className={styles.formItem}>
                <ProFormSelect
                  label="访问区域"
                  name="authority"
                  width={250}
                  placeholder="请添加访问区域"
                  options={domains}
                  fieldProps={{
                    disabled: type === "role",
                  }}
                />
                {type === "dev" && (
                  <img
                    src={AddIcon}
                    className={styles.addicon}
                    onClick={(e) => {
                      setAddAuthCfgVisible(true);
                    }}
                  />
                )}
              </div>
            );
          }}
        </ProFormDependency>

        <ProFormDependency name={["type"]}>
          {({ type }) => {
            const devTargetOptions = [
              {
                label: "允许",
                value: "permit",
              },
              {
                label: "拒绝",
                value: "reject",
              },
            ];
            const roleTargetOptions = [
              {
                label: "允许",
                value: "permit",
              },
            ];
            return (
              <ProFormRadio.Group
                width={250}
                name="target"
                label="执行动作"
                options={type === "dev" ? devTargetOptions : roleTargetOptions}
              />
            );
          }}
        </ProFormDependency>
      </DrawerForm>
      <AddTermGroup
        visible={termgrpVisible}
        setVisible={setTermgrpVisible}
        formType="modal"
        mainformRef={addform}
      />
      <AddAuthCfg
        addVisible={addAuthCfgVisible}
        setAddModalVisible={setAddAuthCfgVisible}
        formType="modal"
        mainformRef={addform}
      />
    </div>
  );
}
