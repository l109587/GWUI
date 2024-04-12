import React, { useRef, useState, useEffect } from "react";
import {
  ProCard,
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
  ModalForm,
  DrawerForm,
  ProFormTreeSelect,
  ProFormRadio,
  ProFormCheckbox,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSwitch,
  ProFormItem,
  ProFormDependency,
} from "@ant-design/pro-components";
import {
  Modal,
  Input,
  message,
  Tabs,
  Switch,
  Tooltip,
  Row,
  Col,
  Button,
  TreeSelect,
  Space,
  Popconfirm,
  Table,
  Form,
  Popover,
} from "antd";
import {
  EditOutlined,
  EditTwoTone,
  SaveOutlined,
  DeleteOutlined,
  DeleteTwoTone,
  PlusSquareTwoTone,
  CloudTwoTone,
  CloseOutlined,
  CloseCircleFilled,
  CheckCircleFilled,
} from "@ant-design/icons";
import { useSelector } from "umi";
import EditTable from "@/components/Module/tinyEditTable/tinyEditTable";
import { regIpList, regPortList } from "@/utils/regExp";
import { ReactComponent as AddSvg } from "@/assets/nac/mconfig/addSvg.svg";
import { ReactComponent as EditSvg } from "@/assets/nac/mconfig/modSvg.svg";
import { ReactComponent as DelSvg } from "@/assets/nac/mconfig/delSvg.svg";
import { ReactComponent as Sync } from "@/assets/nac/sync.svg";
import { fetchAuth } from "@/utils/common";
import { language } from "@/utils/language";
import { post } from "@/services/https";
import styles from "./index.less";

const { confirm } = Modal;

export default function () {
  const contentHeight = useSelector(({ app }) => app.contentHeight);
  let clientHeight = contentHeight - 75;
  const writable = fetchAuth();
  const [ipIsSave, setIpIsSave] = useState(true); // 未保存当前数据不可下发
  const [dftIpIsSave, setDftIpIsSave] = useState(true); // 默认未保存当前数据不可下发
  const [ipClassInfo, setIpClassInfo] = useState([]);
  const [dftIpClassInfo, setDftIpClassInfo] = useState([]);
  const [edpDataSource, setEdpDataSource] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [edpver, setEdpver] = useState("v1"); //edp版本
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [otherCfgListShow, setOtherCfgListShow] = useState(false); //其他配置列表显隐

  const formRef = useRef();
  const [drawerFormRef] = Form.useForm();

  useEffect(() => {
    fetchEdpList();
  }, []);
  const formleftLayout = {
    layout: "horizontal",
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 20,
    },
  };
  const formcenterLayout = {
    layout: "horizontal",
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 18,
    },
  };

  const columnsList = [
    {
      title: "开关",
      width: 80,
      dataIndex: "linkage_state",
      key: "linkage_state",
      align: "center",
      render: (text, record) => {
        return (
          <Switch
            checked={text === "on"}
            // onChange={(state) => {
            //   changeStatus(record, state);
            // }}
            checkedChildren={language("project.open")}
            unCheckedChildren={language("project.close")}
          />
        );
      },
    },
    {
      title: "状态",
      width: 80,
      dataIndex: "srvstatus",
      key: "srvstatus",
      align: "center",
      // render: (text, record) => {
      //   return (
      //     <Tag></Tag>
      //   );
      // },
    },
    {
      title: "消息服务器状态",
      dataIndex: "mqstatus",
      key: "mqstatus",
      align: "left",
      ellipsis: true,
      width: 120,
    },
    {
      title: "同步信任保护",
      dataIndex: "linkage_syncset",
      key: "linkage_syncset",
      align: "center",
      width: 100,
      render: (text) => {
        return text === "on" ? "开启" : "关闭";
      },
    },
    {
      title: "EDP版本",
      dataIndex: "edpver",
      key: "edpver",
      align: "center",
      width: 80,
      render: (text) => {
        return text === "v1" ? "1.0" : "2.0";
      },
    },
    {
      title: "同步注册信息",
      dataIndex: "linkage_synreg",
      key: "linkage_synreg",
      align: "center",
      width: 100,
      render: (text) => {
        return text === "on" ? "开启" : "关闭";
      },
    },
    {
      title: "同步卸载信息",
      dataIndex: "uninstallinfosw",
      key: "uninstallinfosw",
      align: "center",
      width: 100,
      render: (text) => {
        return text === "on" ? "开启" : "关闭";
      },
    },
    {
      title: "同步无效阻断",
      dataIndex: "synblock",
      key: "synblock",
      align: "center",
      width: 100,
      render: (text) => {
        return text === "on" ? "开启" : "关闭";
      },
    },
    {
      title: "EDP服务地址和端口",
      dataIndex: "linkage_ipandport",
      key: "linkage_ipandport",
      align: "left",
      width: 150,
      render: (test, record) => {
        return `${record.linkage_ip}:${record.linkage_port}`;
      },
    },
    {
      title: "IP范围",
      dataIndex: "linkage_umgip",
      key: "linkage_umgip",
      align: "left",
      ellipsis: true,
      width: 200,
      render: (text) => {
        const ips = [];
        text.map((item) => {
          ips.push(item.ip);
        });
        const content = (
          <ul className={styles.infoul}>
            {ips.map((item) => {
              return <li>{item}</li>;
            })}
          </ul>
        );
        return (
          <Popover
            content={content}
            placement="bottomLeft"
            overlayClassName={styles.pop}
          >
            <span style={{ cursor: "pointer" }}>{ips?.join(";")}</span>
          </Popover>
        );
      },
    },
  ];

  const defaultEditTableRender = () => {
    const dftIpColumns = [
      {
        title: "IP/IP段/IP掩码",
        dataIndex: "ip",
        key: "ip",
        width: 230,
        ellipsis: true,
        formItemProps: {
          rules: [
            {
              required: true,
              message: language("project.mandatory"),
            },
            {
              pattern: regIpList.singleipv4Mask.regex,
              message: regIpList.singleipv4Mask.alertText,
            },
          ],
        },
      },
      {
        title: language("project.operate"),
        valueType: "option",
        width: 70,
        align: "center",
        render: (text, record, _, action) => [
          <Tooltip
            placement="top"
            title={language("project.sysconf.syscert.edit")}
          >
            <a
              key="editable"
              onClick={() => {
                action?.startEditable?.(record.id);
                setDftIpIsSave(false);
              }}
            >
              <EditOutlined />
            </a>
          </Tooltip>,
          <Popconfirm
            title={language("project.sysconf.syscert.deleteTitle")}
            okText={language("project.sysconf.syscert.okText")}
            cancelText={language("project.sysconf.syscert.cancelText")}
            onConfirm={() => {
              setDftIpClassInfo(
                dftIpClassInfo.filter((item) => item.id !== record.id)
              );
            }}
          >
            <Tooltip
              placement="top"
              title={language("project.sysconf.syscert.delete")}
            >
              <a key="delete" style={{ color: "red" }}>
                <DeleteOutlined />
              </a>
            </Tooltip>
          </Popconfirm>,
        ],
      },
    ];
    return (
      <EditTable
        setIsSave={setDftIpIsSave}
        columns={dftIpColumns}
        // tableHeight={130}
        tableWidth={300}
        dataSource={dftIpClassInfo}
        setDataSource={setDftIpClassInfo}
        deleteButShow={false}
      />
    );
  };
  const editTableRender = () => {
    const ipColumns = [
      {
        title: "IP/IP段/IP掩码",
        dataIndex: "ip",
        key: "ip",
        width: 230,
        ellipsis: true,
        formItemProps: {
          rules: [
            {
              required: true,
              message: language("project.mandatory"),
            },
            {
              pattern: regIpList.singleipv4Mask.regex,
              message: regIpList.singleipv4Mask.alertText,
            },
          ],
        },
      },
      {
        title: language("project.operate"),
        valueType: "option",
        width: 70,
        align: "center",
        render: (text, record, _, action) => [
          <Tooltip
            placement="top"
            title={language("project.sysconf.syscert.edit")}
          >
            <a
              key="editable"
              onClick={() => {
                action?.startEditable?.(record.id);
                setIpIsSave(false);
              }}
            >
              <EditOutlined />
            </a>
          </Tooltip>,
          <Popconfirm
            title={language("project.sysconf.syscert.deleteTitle")}
            okText={language("project.sysconf.syscert.okText")}
            cancelText={language("project.sysconf.syscert.cancelText")}
            onConfirm={() => {
              setIpClassInfo(
                ipClassInfo.filter((item) => item.id !== record.id)
              );
            }}
          >
            <Tooltip
              placement="top"
              title={language("project.sysconf.syscert.delete")}
            >
              <a key="delete" style={{ color: "red" }}>
                <DeleteOutlined />
              </a>
            </Tooltip>
          </Popconfirm>,
        ],
      },
    ];
    return (
      <EditTable
        setIsSave={setIpIsSave}
        columns={ipColumns}
        // tableHeight={130}
        tableWidth={300}
        dataSource={ipClassInfo}
        setDataSource={setIpClassInfo}
        deleteButShow={false}
      />
    );
  };

  const formFields = (type) => {
    return (
      <>
        {type === "default" ? (
          <Row className={styles.fildItem}>
            <Col offset={2}>
              <ProFormSwitch
                // label="开启联动配置"
                name="linkage_state"
                checkedChildren={language("project.open")}
                unCheckedChildren={language("project.close")}
                getValueFromEvent={(value) => {
                  return value ? "on" : "off";
                }}
                getValueProps={(value) => ({ checked: value === "on" })}
              />
            </Col>
            <Col
              style={{
                display: "flex",
                alignItems: "center",
                paddingBottom: 4,
                marginLeft: 10,
              }}
            >
              开启联动配置
            </Col>
          </Row>
        ) : (
          <div className={styles.fildItem}>
            <ProFormSwitch
              label="联动状态"
              name="linkage_state"
              checkedChildren={language("project.enable")}
              unCheckedChildren={language("project.disable")}
              getValueFromEvent={(value) => {
                return value ? "on" : "off";
              }}
              getValueProps={(value) => ({ checked: value === "on" })}
            />
          </div>
        )}

        <div className={styles.groupItem}>
          <ProFormCheckbox
            label="处理方式"
            name="dealtype"
            valuePropName="checked"
            getValueFromEvent={(value) => {
              return value.target.checked ? "Y" : "N";
            }}
            getValueProps={(value) => value === "Y"}
          >
            黑白名单同时存在优先处理黑名单
          </ProFormCheckbox>
        </div>
        <div className={styles.groupItem}>
          <ProFormRadio.Group
            width={250}
            name="edpver"
            label="版本"
            options={[
              {
                label: "1.0版本",
                value: "v1",
              },
              {
                label: "2.0版本",
                value: "v2",
              },
            ]}
            fieldProps={{
              onChange: (e) => {
                if (type === "default") {
                  setEdpver(e.target.value);
                }
              },
            }}
          />
        </div>
        <div className={styles.fildItem}>
          <ProFormCheckbox.Group
            label="同步内容"
            name="sync"
            width={250}
            fieldProps={{
              style: { paddingTop: 7 },
            }}
            options={[
              {
                label: "信任保护",
                value: "linkage_syncset",
              },
              {
                label: "卸载信息",
                value: "uninstallinfosw",
              },
              {
                label: "注册信息",
                value: "linkage_synreg",
              },
              {
                label: "无效阻断",
                value: "synblock",
              },
            ]}
          />
        </div>

        <div className={styles.fildItem}>
          <ProFormCheckbox
            label="资产上报"
            name="accrepoort"
            valuePropName="checked"
            getValueFromEvent={(value) => {
              return value.target.checked ? "Y" : "N";
            }}
            getValueProps={(value) => value === "Y"}
            fieldProps={{
              style: { paddingTop: 2 },
            }}
          >
            资产上报至EDP服务器
          </ProFormCheckbox>
        </div>

        <div className={styles.fildItem}>
          <ProFormRadio.Group
            width={250}
            name="mqservertype"
            label="接口类型"
            options={[
              {
                label: "2.0(MQ)",
                value: "2.0",
              },
              {
                label: "2.1(KAFKA)",
                value: "2.1",
              },
            ]}
          />
        </div>
        <ProFormItem label="EDP地址及端口">
          <div className={styles.inlineText}>
            <ProFormText
              name="linkage_ip"
              width={150}
              placeholder="IP地址"
              rules={[
                {
                  required: true,
                  message: language("project.mandatory"),
                },
                {
                  pattern: regIpList.ipv4.regex,
                  message: regIpList.ipv4.alertText,
                },
              ]}
            />
          </div>
          <div className={styles.inlineText}>
            <ProFormText
              name="linkage_port"
              width={150}
              placeholder="端口"
              rules={[
                {
                  required: true,
                  message: language("project.mandatory"),
                },
                {
                  pattern: regPortList.port.regex,
                  message: regPortList.port.alertText,
                },
              ]}
            />
          </div>
          {/* <span><CheckCircleFilled style={{color:'#ff3d00'}}/></span> */}
        </ProFormItem>
        <div className={styles.fildItem}>
          <ProFormDependency name={["edpver"]}>
            {({ edpver }) => {
              if (edpver === "v1") {
                return (
                  <ProFormCheckbox
                    label="WSDL同步"
                    name="wsdlswitch"
                    valuePropName="checked"
                    getValueFromEvent={(value) => {
                      return value.target.checked ? "1" : "0";
                    }}
                    getValueProps={(value) => value === "1"}
                    fieldProps={{
                      style: { paddingTop: 2 },
                    }}
                  >
                    从EDP的WebService上同步详细注册信息
                  </ProFormCheckbox>
                );
              }
            }}
          </ProFormDependency>
        </div>
        <div className={styles.fildItem}>
          <ProFormDependency name={["edpver"]}>
            {({ edpver }) => {
              if (edpver === "v2") {
                return (
                  <>
                    <ProFormItem label="消息地址及端口">
                      <div className={styles.inlineText}>
                        <ProFormText
                          name="mqaddr"
                          width={150}
                          placeholder="IP地址"
                          rules={[
                            {
                              required: true,
                              message: language("project.mandatory"),
                            },
                            {
                              pattern: regIpList.ipv4.regex,
                              message: regIpList.ipv4.alertText,
                            },
                          ]}
                        />
                      </div>
                      <div className={styles.inlineText}>
                        <ProFormText
                          name="mq_port"
                          width={150}
                          placeholder="端口"
                          rules={[
                            {
                              required: true,
                              message: language("project.mandatory"),
                            },
                            {
                              pattern: regPortList.port.regex,
                              message: regPortList.port.alertText,
                            },
                          ]}
                        />
                      </div>
                    </ProFormItem>
                    <ProFormItem label="Token授权">
                      <div className={styles.inlineText}>
                        <ProFormText
                          name="tkuser"
                          width={150}
                          placeholder="账号"
                          rules={[
                            {
                              required: true,
                              message: language("project.mandatory"),
                            },
                          ]}
                        />
                      </div>
                      <div className={styles.inlineText}>
                        <ProFormText.Password
                          name="tkpass"
                          width={150}
                          placeholder="密码"
                          rules={[
                            {
                              required: true,
                              message: language("project.mandatory"),
                            },
                          ]}
                        />
                      </div>
                    </ProFormItem>
                    <ProFormItem label="同步用户">
                      <div className={styles.inlineText}>
                        <ProFormText
                          name="mquser"
                          width={150}
                          placeholder="账号"
                          rules={[
                            {
                              required: true,
                              message: language("project.mandatory"),
                            },
                          ]}
                        />
                      </div>
                      <div className={styles.inlineText}>
                        <ProFormText.Password
                          name="mqpass"
                          width={150}
                          placeholder="密码"
                          rules={[
                            {
                              required: true,
                              message: language("project.mandatory"),
                            },
                          ]}
                        />
                      </div>
                    </ProFormItem>
                  </>
                );
              }
            }}
          </ProFormDependency>
        </div>

        <ProFormItem name="linkage_umgip" label="联动IP范围" width={450}>
          {type === "default" ? defaultEditTableRender() : editTableRender()}
        </ProFormItem>
      </>
    );
  };

  const fetchEdpList = () => {
    post("/cfg.php?controller=linkage&action=get_edp_list").then((res) => {
      if (res.success) {
        setEdpDataSource(res.data);
      }
    });
  };
  //关闭弹窗重置数据
  const resetValues = () => {
    drawerFormRef.resetFields();
    setDrawerOpen(false);
    setEdpver("v1");
    setSelectedKeys([]);
    setSelectedRows([]);
    setIpClassInfo([]);
  };

  //保存设置
  const saveCfg = (values) => {
    let linkage_syncset = "off";
    let uninstallinfosw = "off";
    let linkage_synreg = "off";
    let synblock = "off";
    if (values.sync) {
      linkage_syncset =
        values.sync.findIndex((item) => item === "linkage_syncset") >= 0
          ? "on"
          : "off";
      uninstallinfosw =
        values.sync.findIndex((item) => item === "uninstallinfosw") >= 0
          ? "on"
          : "off";
      linkage_synreg =
        values.sync.findIndex((item) => item === "linkage_synreg") >= 0
          ? "on"
          : "off";
      synblock =
        values.sync.findIndex((item) => item === "synblock") >= 0
          ? "on"
          : "off";
    }
    delete values.sync;
    const params = {
      ...values,
      linkage_umgip: JSON.stringify(ipClassInfo),
      linkage_syncset,
      uninstallinfosw,
      linkage_synreg,
      synblock,
    };
    post("/cfg.php?controller=linkage&action=modify_edp_list", params).then(
      (res) => {
        if (res.success) {
          res.msg && message.success(res.msg);
        } else {
          res.msg && message.error(res.msg);
        }
      }
    );
  };

  //连通性检测
  const lineTest = () => {
    formRef.current
      .validateFields()
      .then((values) => {
        post("/cfg.php?controller=linkage&action=edp_detect", values).then(
          (res) => {
            if (res.success) {
              res.msg && message.success(res.msg);
            } else {
              res.msg && message.error(res.msg);
            }
          }
        );
      })
      .catch((errorInfo) => {
        console.log(errorInfo, "errorInfo");
      });
  };
  const drawerLineTest = () => {
    drawerFormRef
      .validateFields()
      .then((values) => {
        post("/cfg.php?controller=linkage&action=edp_detect", values).then(
          (res) => {
            if (res.success) {
              res.msg && message.success(res.msg);
            } else {
              res.msg && message.error(res.msg);
            }
          }
        );
      })
      .catch((errorInfo) => {
        console.log(errorInfo, "errorInfo");
      });
  };
  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    console.log(selectedRows, "selectedRows");
    setSelectedKeys(newSelectedRowKeys);
    setSelectedRows(selectedRows);
  };
  const rowSelection = {
    selectedRowKeys: selectedKeys,
    onChange: onSelectChange,
    // onSelect:onSelectChange
  };

  //全新同步
  const resync = () => {
    if (selectedRows.length <= 0) {
      return message.error("请至少选择一条数据！");
    }
    const linkage_ips = [];
    const ids = [];
    const edpvers = [];
    selectedRows.map((item) => {
      linkage_ips.push(item.linkage_ip);
      ids.push(item.id);
      edpvers.push(item.edpver);
    });
    const params = {
      linkage_ips: linkage_ips.join(","),
      ids: ids.join(","),
      edpvers: edpvers.join(","),
    };
    post("/cfg.php?controller=linkage&action=resync_edp", params)
      .then((res) => {
        if (res.success) {
          res.msg && message.success(res.msg);
          setSelectedKeys([]);
          setSelectedRows([]);
        } else {
          res.msg && message.error(res.msg);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };

  const onEditCfg = () => {
    if (selectedKeys.length !== 1) {
      return message.error("请选择一条数据！");
    } else {
      const record = selectedRows[0];
      console.log(record, "record");
      const sync = [];
      if (record.linkage_syncset === "on") {
        sync.push("linkage_syncset");
      }
      if (record.uninstallinfosw === "on") {
        sync.push("uninstallinfosw");
      }
      if (record.linkage_synreg === "on") {
        sync.push("linkage_synreg");
      }
      if (record.synblock === "on") {
        sync.push("synblock");
      }
      setDrawerOpen(true);
      setIpClassInfo(record.linkage_umgip);
      drawerFormRef.setFieldsValue({
        ...record,
        sync,
      });
    }
  };

  //批量删除
  const delClick = () => {
    if (selectedKeys.length <= 0) {
      return message.error("请至少选择一条数据！");
    }
    const sum = selectedKeys.length;
    confirm({
      icon: <CloseCircleFilled style={{ color: "red" }} />,
      title: language("project.delconfirm"),
      content: language("project.cancelcon", { sum: sum }),
      className: "delModal",
      okType: "danger",
      onOk: () => {
        delconfirm();
      },
    });
  };
  //确定删除
  const delconfirm = () => {
    const linkage_ips = [];
    const ids = [];
    const edpvers = [];
    selectedRows.map((item) => {
      linkage_ips.push(item.linkage_ip);
      ids.push(item.id);
      edpvers.push(item.edpver);
    });
    const params = {
      linkage_ips: linkage_ips.join(","),
      ids: ids.join(","),
      edpvers: edpvers.join(","),
    };
    post("/cfg.php?controller=linkage&action=del_edp_config", params)
      .then((res) => {
        if (res.success) {
          res.msg && message.success(res.msg);
          fetchEdpList();
          setSelectedKeys([]);
          setSelectedRows([]);
        } else {
          res.msg && message.error(res.msg);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };

  return (
    <ProCard
      bodyStyle={{ overflow: "auto", height: clientHeight }}
      className={styles.container}
    >
      <ProForm
        {...formleftLayout}
        formRef={formRef}
        submitter={false}
        initialValues={{
          edpver: "v1",
          mqservertype: "2.0",
          linkage_state: "off",
          dealtype: "N",
          accrepoort: "N",
          wsdlswitch: "0",
        }}
        onFinish={saveCfg}
      >
        {formFields("default")}
        <Row gutter={10}>
          <Col offset={2}>
            <Button
              icon={<SaveOutlined />}
              type="primary"
              htmlType="submit"
              disabled={!writable}
            >
              {language("project.sysconf.syscert.saveConf")}
            </Button>
          </Col>
          <Col>
            <Button type="primary" disabled={!writable} onClick={lineTest}>
              联通性检测
            </Button>
          </Col>
          {edpver === "v1" && (
            <Col>
              <Button type="primary" disabled={!writable}>
                全新同步
              </Button>
            </Col>
          )}
          <Col>
            <Button
              type="default"
              disabled={!writable}
              onClick={() => {
                setOtherCfgListShow(!otherCfgListShow);
              }}
            >
              其他配置
            </Button>
          </Col>
        </Row>
      </ProForm>
      {otherCfgListShow && (
        <Row>
          <Col>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                height: 36,
              }}
            >
              <div style={{ fontWeight: 600 }}>其他配置</div>
              <Space
                direction="horizontal"
                size={8}
                style={{ cursor: "pointer" }}
              >
                <Tooltip
                  title="添加"
                  onClick={() => {
                    setDrawerOpen(true);
                  }}
                >
                  <div
                    style={{
                      height: 22,
                      display: "flex",
                      alignContent: "center",
                    }}
                  >
                    <AddSvg style={{ width: 14, fill: "#1677ff" }} />
                  </div>
                </Tooltip>
                <Tooltip title="同步" onClick={resync}>
                  <div
                    style={{
                      height: 22,
                      display: "flex",
                      alignContent: "center",
                    }}
                  >
                    <Sync style={{ width: 14, height: 14 }} />
                  </div>
                </Tooltip>
                <Tooltip title="编辑" onClick={onEditCfg}>
                  <div
                    style={{
                      height: 22,
                      display: "flex",
                      alignContent: "center",
                    }}
                  >
                    <EditSvg alt="" style={{ width: 14, fill: "#1677ff" }} />
                  </div>
                </Tooltip>
                <Tooltip title="删除" onClick={delClick}>
                  <div
                    style={{
                      height: 22,
                      display: "flex",
                      alignContent: "center",
                    }}
                  >
                    <DelSvg alt="" style={{ width: 14, fill: "#ff1717" }} />
                  </div>
                </Tooltip>
              </Space>
            </div>
            <Table
              rowKey="id"
              columns={columnsList}
              dataSource={edpDataSource}
              size="small"
              rowSelection={rowSelection}
              pagination={false}
              scroll={{ x: 1240 }}
            />
          </Col>
        </Row>
      )}

      <DrawerForm
        {...formcenterLayout}
        title={selectedKeys.length > 0 ? "编辑" : "添加"}
        form={drawerFormRef}
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
          edpver: "v1",
          mqservertype: "2.0",
          linkage_state: "off",
          dealtype: "N",
          accrepoort: "N",
          wsdlswitch: "0",
        }}
        width={510}
        onFinish={saveCfg}
        submitter={{
          render: () => {
            return [
              <Button
                onClick={() => {
                  setDrawerOpen(false);
                  resetValues();
                }}
              >
                取消
              </Button>,
              <Button
                type="primary"
                onClick={() => {
                  drawerFormRef.submit();
                }}
              >
                确定
              </Button>,
              <Button type="primary" onClick={drawerLineTest}>
                联通性检测
              </Button>,
            ];
          },
        }}
      >
        {formFields("add")}
      </DrawerForm>
    </ProCard>
  );
}
