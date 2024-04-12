import { useState, useEffect } from "react";
import {
  ProCard,
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
  ModalForm,
  DrawerForm,
} from "@ant-design/pro-components";
import {
  SaveOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  Space,
  Tag,
  Menu,
  Button,
  Drawer,
  Col,
  Row,
  Input,
  Select,
  Form,
  message,
  Popconfirm,
  Typography,
  Modal,
  Tooltip,
} from "antd";
import vendorIcon from "@/nbgUtils/vendorIcon";
import { formleftLayout, drawFormLayout } from "@/utils/helper";
import { useSelector } from "umi";
import { post } from "@/services/https";
import { ProtableModule } from "@/components/Module";
import { language } from "@/utils/language";
import { fetchAuth } from "@/utils/common";
import { regList, regIpList } from "@/utils/regExp";
import ARPList from "./arpList";
import ACLManage from "./aclManage";
import PortInfo from "./portInfo";
import { NotesText, NameText } from "@/utils/fromTypeLabel";
import styles from "./index.less";

import huawei from "@/assets/switch/logo_huawei.png"; //huawei图标
import cisco from "@/assets/switch/logo_cisco.png"; //cisco图标
import h3c from "@/assets/switch/logo_h3c.png"; //h3c图标
import ruijie from "@/assets/switch/logo_ruijie.png"; //ruijie图标
import unknow from "@/assets/images/nswitch/logo_unknow.png"; //unknow
import Corepos from "@/assets/images/nswitch/corepos.png"; //核心位置
import Convepos from "@/assets/images/nswitch/convepos.png"; //汇聚
import Accesspos from "@/assets/images/nswitch/accesspos.png"; //接入
import Otherpos from "@/assets/images/nswitch/otherpos.png"; //其他
import Ormemory from "@/assets/images/nswitch/orange-memory.svg"; //内存橙色
import Redmemory from "@/assets/images/nswitch/red-memory.svg"; //内存红色
import Grmemory from "@/assets/images/nswitch/green-memory.svg"; //内存绿色
import GreenCpu from "@/assets/images/nswitch/green-cpu.svg"; //内存绿色
import OrCpu from "@/assets/images/nswitch/orange-cpu.svg"; //内存橙色
import RedCpu from "@/assets/images/nswitch/red-cpu.svg"; //内存红色

const { Search } = Input;
const { confirm } = Modal;

export default function Switch() {
  const items = [
    { label: "端口信息", key: "item-1" },
    { label: "ARP列表", key: "item-2" },
    { label: "设备管理", key: "item-4" },
  ];
  const contentHeight = useSelector(({ app }) => app.contentHeight);
  let clientHeight = contentHeight - 220;
  const [queryVal, setQueryVal] = useState(""); //首个搜索框的值
  const [snmp, setSnmp] = useState(""); //snmp模板
  const [state, setState] = useState(""); //网络设备状态
  const [snmpOption, setSnmpOption] = useState([]); //select snmp模板选项
  const [snmpModelList, setSnmpModelList] = useState([]); //存储SNMP模板
  const [switchType, setSwitchType] = useState([]); //存储设备厂商
  const [addDrawerOpen, setAddDrawerOpen] = useState(false); //存储设备厂商
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState([]);
  const [openKey, setOpenKey] = useState([]);
  const [topuModalVisiable, setTopuModalVisiable] = useState(false);
  const [baseInfo, setBaseInfo] = useState({});
  const [incID, setIncID] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  const [menuItems, setMenuItems] = useState(items); //菜单

  const writable = fetchAuth();
  const rowKey = (record) => record.id; //列表唯一值
  const [addform] = Form.useForm();
  const [devFormRef] = Form.useForm();
  let searchVal = {
    value: queryVal,
    type: "fuzzy",
    state: state,
    snmp: snmp,
  }; //顶部搜索框值 传入接口

  useEffect(() => {
    getSnmpModelList();
    getSwitchTypeList();
    getAclMng();
  }, []);

  //获取acl显隐
  const getAclMng = () => {
    post("/cfg.php?controller=assetMapping&action=showAclMng")
      .then((res) => {
        if (res.success) {
          if (res?.data?.showAcl === "Y") {
            const newMenu = [
              { label: "端口信息", key: "item-1" },
              { label: "ARP列表", key: "item-2" },
              { label: "ACL管控", key: "item-3" },
              { label: "设备管理", key: "item-4" },
            ];
            setMenuItems(newMenu);
          }
        } else {
          res.msg && message.error(res.msg);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getSnmpModelList = () => {
    post("/cfg.php?controller=assetMapping&action=getSnmpModelList")
      .then((res) => {
        setSnmpOption(res.data);
        const arr = [];
        res.data?.map((e) => arr.push({ label: e.name, value: e.value }));
        setSnmpModelList(arr);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  const getSwitchTypeList = () => {
    post("/cfg.php?controller=assetMapping&action=getSwitchVenderList")
      .then((res) => {
        const arr = [];
        res.data?.map((e) => arr.push({ label: e.name, value: e.value }));
        setSwitchType(arr);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  const coreFilters = [
    {
      text: "汇聚",
      value: "0",
    },
    {
      text: "核心",
      value: "1",
    },
    {
      text: "接入",
      value: "2",
    },
    // {
    //   text: "其他",
    //   value: "3",
    // },
  ];
  const columnsList = [
    {
      title: language("project.sysconf.network.state"),
      width: 80,
      dataIndex: "state",
      key: "state",
      align: "center",
      filterMultiple: false,
      filters: [
        {
          text: "正常",
          value: "1",
        },
        {
          text: "异常",
          value: "0",
        },
      ],
      render: (val) => {
        let color = val == "1" ? "cyan" : "red";
        return <Tag color={color} style={{margin:0}}>{val == "1" ? "正常" : "异常"}</Tag>;
      },
    },
    {
      title: language("netanalyse.nswitch.core"),
      width: 110,
      dataIndex: "core",
      key: "core",
      align: "center",
      filterMultiple: false,
      filters: coreFilters,
      render: (val) => showCore(val),
    },
    {
      title: language("netanalyse.nswitch.devname"),
      width: 120,
      dataIndex: "name",
      key: "name",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("netanalyse.nswitch.ip"),
      width: 110,
      dataIndex: "ip",
      key: "ip",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("netanalyse.nswitch.vender"),
      width: 80,
      dataIndex: "vender",
      key: "vender",
      align: "left",
      render: (text) => {
        return <div className={styles.vendorIcon}>{vendorIcon(text)}</div>;
      },
    },
    {
      title: language("netanalyse.nswitch.model"),
      width: 80,
      dataIndex: "model",
      key: "model",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("netanalyse.nswitch.ifNum"),
      width: 80,
      dataIndex: "ifNum",
      key: "ifNum",
      align: "center",
      render: (val, record) => {
        return val == "0" ? (
          val
        ) : (
          <a
            onClick={() => {
              setSelectedKey(["item-1"]);
              setBaseInfo(record);
              setDrawerVisible(true);
            }}
          >
            {val}
          </a>
        );
      },
    },
    {
      title: "使用率",
      width: 140,
      dataIndex: "mem",
      key: "mem",
      align: "left",
      render: (val, record) => showOccupy(record, 16, 13),
    },
    {
      title: language("monitor.devtmpl.DiscoverConfig"),
      width: 120,
      dataIndex: "snmp",
      key: "snmp",
      align: "center",
      render: (text) => {
        return (
          <Tag style={{ marginRight: 0, maxWidth: 100 }} color="blue">
            <Typography.Text
              style={{
                maxWidth: 86,
              }}
              ellipsis={{ tooltip: text }}
            >
              {text}
            </Typography.Text>
          </Tag>
        );
      },
    },

    {
      title: language("project.updateTime"),
      width: 150,
      dataIndex: "updatetime",
      key: "updatetime",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("alarmdt.details"),
      dataIndex: "detail",
      key: "detail",
      align: "left",
      render: (val, record) => {
        const color = record.state != "1" ? "red" : "default";
        if (record.detail) {
          return (
            <Tag color={color} style={{ cursor: "default" }}>
              {val}
            </Tag>
          );
        } else {
          return <>-</>;
        }
      },
    },
    {
      title: language("project.operate"),
      key: "option",
      width: 120,
      valueType: "option",
      align: "center",
      ellipsis: true,
      fixed: "right",
      hideInTable: !writable,
      render: (_, record) => [
        <a
          key="1"
          onClick={() => {
            setBaseInfo(record);
            setDrawerVisible(true);
            setTimeout(() => {
              setSelectedKey(["item-4"]);
            }, 100);
          }}
        >
          {language("project.alter")}
        </a>,
        <Popconfirm
          title={language("project.delconfirm")}
          okText={language("project.yes")}
          cancelText={language("project.no")}
          onConfirm={() => {
            delInfo(record);
          }}
        >
          <a>{language("project.del")}</a>
        </Popconfirm>,
      ],
    },
  ];
  const tableTopSearch = () => {
    return (
      <div className="nswitchSearch">
        <Search
          placeholder={language("netanalyse.nettopo.swIPpd")}
          onSearch={(queryVal) => {
            setQueryVal(queryVal);
            setIncID(incID + 1);
          }}
          allowClear={true}
          className={styles.searchInput}
        />
      </div>
    );
  };
  const showCore = (val) => {
    let imgsrc = Otherpos;
    let text = "其他";
    switch (val) {
      case "0":
        imgsrc = Convepos;
        text = "汇聚";
        break;
      case "1":
        imgsrc = Corepos;
        text = "核心";
        break;
      case "2":
        imgsrc = Accesspos;
        text = "接入";
        break;
    }
    return (
      <div style={{ display: "inline-flex", alignItems: "center",height:21 }}>
        <img src={imgsrc} alt="" style={{ marginRight: 6 }} />
        <span style={{ lineHeight: 1 }}>{text}</span>
      </div>
    );
  };
  const showOccupy = (baseInfo, iconSize = 24, fontSize = 18) => {
    let memImgSrc;
    let cpuImgSrc;
    if (baseInfo.cpu <= 60) {
      cpuImgSrc = GreenCpu;
    } else if (60 < baseInfo.cpu && baseInfo.cpu < 80) {
      cpuImgSrc = OrCpu;
    } else if (baseInfo.cpu >= 80) {
      cpuImgSrc = RedCpu;
    }
    if (baseInfo.mem <= 60) {
      memImgSrc = Grmemory;
    } else if (60 < baseInfo.mem && baseInfo.mem < 80) {
      memImgSrc = Ormemory;
    } else if (baseInfo.mem >= 80) {
      memImgSrc = Redmemory;
    }
    return (
      <Space>
        <Tooltip title="cpu" placement="top">
          <div style={{ display: "flex" }}>
            <img src={cpuImgSrc} alt="" style={{ width: iconSize }} />
          </div>
        </Tooltip>
        <div style={{ fontSize: fontSize, lineHeight: 1.6, minWidth: 32 }}>
          {baseInfo?.cpu + "%"}
        </div>
        <Tooltip title="内存" placement="top">
          <div style={{ display: "flex" }}>
            <img src={memImgSrc} alt="" style={{ width: iconSize }} />
          </div>
        </Tooltip>
        <span style={{ fontSize: fontSize, lineHeight: 1.6 }}>
          {baseInfo?.mem + "%"}
        </span>
      </Space>
    );
  };
  //新建设备
  const addSwitch = (values) => {
    post("/cfg.php?controller=assetMapping&action=addSwitch", {
      ...values,
      switchType: 0,
    })
      .then((res) => {
        if (res.success) {
          setAddDrawerOpen(false);
          res.msg && message.success(res.msg);
          setIncID(incID + 1);
        } else {
          res.msg && message.error(res.msg);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //删除设备
  const delInfo = (values) => {
    const { name, id, ip } = values;
    post("/cfg.php?controller=assetMapping&action=delSwitch", {
      names: name,
      ids: id,
      ips: ip,
    })
      .then((res) => {
        if (res.success) {
          res.msg && message.success(res.msg);
          setIncID(incID + 1);
        } else {
          res.msg && message.error(res.msg);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const submit = (values) => {
    post("/cfg.php?controller=assetMapping&action=modifySwitch", {
      ...values,
      id: baseInfo.id,
      switchType: 0,
      telnetValue: "",
    })
      .then((res) => {
        if (res.success) {
          res.msg && message.success(res.msg);
        } else {
          res.msg && message.error(res.msg);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const onClickMenu = (props) => {
    setSelectedKey([props.key]);
  };

  const menu = (
    <Menu>
      <Menu.Item
        key="1"
        onClick={() => {
          setTopuModalVisiable(true);
        }}
      >
        修改拓扑位置
      </Menu.Item>
      <Menu.Item key="5">修改SNMP模板</Menu.Item>
      <Menu.SubMenu title="修改远程模板" key="10">
        <Menu.Item key="2">开启</Menu.Item>
        <Menu.Item key="3">关闭</Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );
  const DevManage = () => {
    return (
      <ProCard bordered>
        <ProForm
          {...formleftLayout}
          formRef={devFormRef}
          submitter={{
            render: (props, doms) => {
              return [
                <Row>
                  <Col span={5} offset={6}>
                    <Button
                      type="primary"
                      key="subment"
                      onClick={() => {
                        props.form?.submit?.();
                      }}
                      icon={<SaveOutlined />}
                      disabled={!writable}
                    >
                      设置
                    </Button>
                  </Col>
                </Row>,
              ];
            },
          }}
          initialValues={{
            name: baseInfo?.name,
            ip: baseInfo?.ip,
            venderValue: baseInfo?.vender,
            switchType: 0,
            modelValue: baseInfo?.model,
            snmpValue: baseInfo?.snmp,
            core: baseInfo?.core,
            notes: baseInfo?.notes,
          }}
          onFinish={submit}
        >
          <NameText name="name" label="设备名称" width={280} required={true} />
          <ProFormText
            label={language("netanalyse.nswitch.ip")}
            name="ip"
            width={280}
            rules={[
              {
                required: true,
                message: language("project.mandatory"),
              },
              {
                pattern: regIpList.ipv6oripv4.regex,
                message: regIpList.ipv6oripv4.alertText,
              },
            ]}
          />
          {/* <ProFormSelect
          label={language('netanalyse.nswitch.swphyMacitchType')}
          name="switchType"
          placeholder={language('project.select')}
          // fieldProps={{
          //   defaultValue: '0',
          // }}
          options={[
            { label: language('netanalyse.nswitch.exchange'), value: 0 },
            { label: language('netanalyse.nswitch.router'), value: 1 },
            { label: language('netanalyse.nswitch.2NAT'), value: 2 },
          ]}
        /> */}
          <ProFormSelect
            label={language("netanalyse.nswitch.vender")}
            name="venderValue"
            width={280}
            placeholder={language("project.select")}
            options={switchType}
          />
          <ProFormText
            label={language("netanalyse.nswitch.model")}
            name="modelValue"
            width={280}
            rules={[
              {
                pattern: regList.strmax.regex,
                message: regList.strmax.alertText,
              },
            ]}
          />
          <ProFormSelect
            label={language("monitor.devtmpl.DiscoverConfig")}
            name="snmpValue"
            width={280}
            placeholder={language("project.select")}
            options={snmpModelList}
          />
          <ProFormSelect
            label={language("netanalyse.nswitch.core")}
            name="core"
            width={280}
            placeholder={language("project.select")}
            options={[
              {
                label: language("netanalyse.nswitch.converge.change"),
                value: "0",
              },
              {
                label: language("netanalyse.nswitch.heart.change"),
                value: "1",
              },
              {
                label: language("netanalyse.nswitch.access.change"),
                value: "2",
              },
            ]}
          />
          <NotesText
            name="notes"
            label="备注"
            style={{ width: 280 }}
            width={280}
            required={false}
          />
        </ProForm>
      </ProCard>
    );
  };

  //新增
  const addClick = () => {
    setAddDrawerOpen(true);
  };
  //批量删除
  const delClick = (selectedRowKeys, dataList, selectedRows) => {
    const sum = selectedRowKeys.length;
    const ids = selectedRowKeys.join(",");
    const nameArr = [];
    const ipArr = [];
    selectedRows.map((item) => {
      nameArr.push(item.name);
      ipArr.push(item.ip);
    });
    const names = nameArr.join(",");
    const ips = ipArr.join(",");
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: language("project.delconfirm"),
      content: language("project.cancelcon", { sum: sum }),
      onOk() {
        delInfo({ name: names, ip: ips, id: ids });
      },
    });
  };
  //拓扑位置
  const topoPositon = (val) => {
    let imgsrc = Otherpos;
    let text = "其他";
    switch (val) {
      case "0":
        imgsrc = Convepos;
        text = "汇聚";
        break;
      case "1":
        imgsrc = Corepos;
        text = "核心";
        break;
      case "2":
        imgsrc = Accesspos;
        text = "接入";
        break;
    }
    return (
      <span>
        <img src={imgsrc} alt="" style={{ marginRight: 6, paddingBottom: 2 }} />
        <span style={{ lineHeight: 1 }}>{text}</span>
      </span>
    );
  };
  const SwitchIcon = () => {
    if (baseInfo?.vender === "Huawei") {
      return <img src={huawei}></img>;
    } else if (baseInfo?.vender === "H3C") {
      return <img src={h3c}></img>;
    } else if (baseInfo?.vender === "Cisco") {
      return <img src={cisco}></img>;
    } else if (baseInfo?.vender === "Ruijie") {
      return <img src={ruijie}></img>;
    } else {
      return <img src={unknow}></img>;
    }
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
        apishowurl="/cfg.php?controller=assetMapping&action=getSwitchlist"
        incID={incID}
        clientHeight={clientHeight}
        tableKey="nSwitch"
        searchText={tableTopSearch()}
        searchVal={searchVal}
        rowkey={rowKey}
        addButton={true}
        addClick={addClick}
        delButton={true}
        delClick={delClick}
        columnvalue="nSwitchColumnvalue"
        rowSelection={true}
      />
      <Drawer
        visible={drawerVisible}
        placement="right"
        width="90%"
        onClose={() => {
          setIncID(incID + 1);
          setDrawerVisible(false);
          setSelectedKey([]);
        }}
        destroyOnClose={true}
        // closable={false}
        getContainer={false}
        style={{
          position: "absolute",
        }}
        closable={false}
        bodyStyle={{ padding: 12, backgroundColor: "#f0f2f5" }}
      >
        <ProCard bodyStyle={{ padding: "24px 20px 10px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Row className={styles.row}>
              <Col span={4}>
                <div
                  style={{ width: 136, display: "flex", alignItems: "center" }}
                >
                  <SwitchIcon />
                </div>
              </Col>
              <Col span={6}>
                <div style={{ minWidth: 120 }}>
                  <div style={{ marginBottom: 16 }}>
                    <span>设备名称：</span>
                    <Typography.Text
                      style={{
                        maxWidth: 130,
                      }}
                      ellipsis={{ tooltip: baseInfo?.name }}
                    >
                      {baseInfo?.name}
                    </Typography.Text>
                  </div>
                  <div>
                    <span>设备厂商：</span>
                    <span>{baseInfo?.vender}</span>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ minWidth: 120 }}>
                  <div style={{ marginBottom: 16 }}>
                    <span>设备地址：</span>
                    <span>{baseInfo?.ip}</span>
                  </div>
                  <div>
                    <span>设备型号：</span>
                    <span>{baseInfo?.model}</span>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ minWidth: 120 }}>
                  <div style={{ marginBottom: 16 }}>
                    <span>SNMP模板：</span>
                    <span>
                      <Tag
                        style={{ marginRight: 0, maxWidth: 100 }}
                        color="blue"
                      >
                        <Typography.Text
                          style={{
                            maxWidth: 86,
                          }}
                          ellipsis={{ tooltip: baseInfo?.snmp }}
                        >
                          {baseInfo?.snmp}
                        </Typography.Text>
                      </Tag>
                    </span>
                  </div>
                  <div>
                    <span
                      style={{
                        display: "inline-block",
                        width: 75,
                        textAlign: "right",
                      }}
                    >
                      拓扑位置：
                    </span>
                    <span>{topoPositon(baseInfo?.core)}</span>
                  </div>
                </div>
              </Col>
            </Row>
            <div style={{ paddingTop: 16 }}>{showOccupy(baseInfo)}</div>
          </div>
        </ProCard>
        <ProCard style={{ marginBottom: 12 }} bodyStyle={{ padding: 0 }}>
          <Menu
            mode="horizontal"
            items={menuItems}
            triggerSubMenuAction="hover"
            style={{ borderBottom: 0 }}
            onClick={onClickMenu}
            selectedKeys={selectedKey}
            onOpenChange={(value) => {
              setOpenKey(value);
            }}
          />
        </ProCard>
        {selectedKey.includes("item-1") ? <PortInfo ip={baseInfo?.ip} /> : null}
        {selectedKey.includes("item-2") ? <ARPList ip={baseInfo?.ip} /> : null}
        {selectedKey.includes("item-3") ? (
          <ACLManage baseInfo={baseInfo} snmpModelList={snmpModelList} />
        ) : null}
        {selectedKey.includes("item-4") ? <DevManage /> : null}
      </Drawer>
      <ModalForm
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 10 }}
        open={topuModalVisiable}
        width="500px"
        title="批量修改拓扑位置"
        onOpenChange={setTopuModalVisiable}
        modalProps={{
          destroyOnClose: true,
        }}
        // onFinish={(values) => {
        //   add(values)
        // }}
        // formRef={formRef}
      >
        <ProFormSelect
          label="拓扑位置:"
          name="core"
          placeholder="请选择"
          options={[
            { label: "汇聚交换机", value: "0" },
            { label: "核心交换机", value: "1" },
            { label: "接入交换机", value: "2" },
          ]}
        />
      </ModalForm>
      <DrawerForm
        {...drawFormLayout}
        title="新建"
        form={addform}
        visible={addDrawerOpen}
        onVisibleChange={setAddDrawerOpen}
        autoFocusFirstInput
        drawerProps={{
          destroyOnClose: true,
          placement: "left",
          closable: false,
          getContainer: false,
          style: {
            position: "absolute",
          },
          extra: (
            <div>
              <span
                onClick={() => {
                  setAddDrawerOpen(false);
                }}
                style={{ cursor: "pointer" }}
              >
                <CloseOutlined />
              </span>
            </div>
          ),
        }}
        width={440}
        onFinish={addSwitch}
        submitTimeout={2000}
      >
        <ProFormText
          label={language("project.devname")}
          name="name"
          width={200}
          rules={[
            {
              required: true,
              message: language("project.mandatory"),
            },
            {
              pattern: regList.strmax.regex,
              message: regList.strmax.alertText,
            },
          ]}
        />
        <ProFormText
          label={language("netanalyse.nswitch.ip")}
          name="ip"
          width={200}
          rules={[
            {
              required: true,
              message: language("project.mandatory"),
            },
            {
              pattern: regIpList.ipv6oripv4.regex,
              message: regIpList.ipv6oripv4.alertText,
            },
          ]}
        />
        {/* <ProFormSelect
          label={language('netanalyse.nswitch.swphyMacitchType')}
          name="switchType"
          placeholder={language('project.select')}
          // fieldProps={{
          //   defaultValue: '0',
          // }}
          options={[
            { label: language('netanalyse.nswitch.exchange'), value: 0 },
            { label: language('netanalyse.nswitch.router'), value: 1 },
            { label: language('netanalyse.nswitch.2NAT'), value: 2 },
          ]}
        /> */}
        <ProFormSelect
          label={language("netanalyse.nswitch.vender")}
          name="venderValue"
          width={200}
          placeholder={language("project.select")}
          options={switchType}
        />
        <ProFormText
          label={language("netanalyse.nswitch.model")}
          name="modelValue"
          width={200}
          rules={[
            {
              pattern: regList.strmax.regex,
              message: regList.strmax.alertText,
            },
          ]}
        />
        <ProFormSelect
          label={language("monitor.devtmpl.DiscoverConfig")}
          name="snmpValue"
          width={200}
          placeholder={language("project.select")}
          options={snmpModelList}
        />
        <ProFormSelect
          label={language("netanalyse.nswitch.core")}
          name="core"
          width={200}
          placeholder={language("project.select")}
          options={[
            {
              label: language("netanalyse.nswitch.converge.change"),
              value: "0",
            },
            {
              label: language("netanalyse.nswitch.heart.change"),
              value: "1",
            },
            {
              label: language("netanalyse.nswitch.access.change"),
              value: "2",
            },
          ]}
        />
        <NotesText name="notes" label="备注" width={200} required={false} />
      </DrawerForm>
    </div>
  );
}
