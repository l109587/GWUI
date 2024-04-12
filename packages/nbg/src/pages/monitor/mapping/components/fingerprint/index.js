import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "umi";
import {
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  StepsForm,
  ProFormRadio,
} from "@ant-design/pro-components";
import { ProtableModule } from "@/components/Module";
import { language } from "@/utils/language";
import { SortableHandle } from "react-sortable-hoc";
import { fetchAuth } from "@/utils/common";
import { post } from "@/services/https";
import {
  Button,
  Popconfirm,
  Space,
  Input,
  Modal,
  Alert,
  Switch,
  message,
  Divider,
  Tooltip,
} from "antd";
import {
  EditTwoTone,
  UnorderedListOutlined,
  DeleteOutlined,
  MenuOutlined,
  SettingOutlined,
  EditOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { RiFindReplaceLine } from "react-icons/ri";
import { CameraThree } from "@icon-park/react";
import { modalFormLayout } from "@/utils/helper";
import OSIcon from "@/nbgUtils/osIconType";
import "./fingerprint.less";
import vendorIcon from "@/nbgUtils/vendorIcon";
import { regIpList, regList, regMacList, regPortList } from "@/utils/regExp";
const { Search } = Input;
const { StepForm } = StepsForm;
const DragHandle = SortableHandle(() => (
  <MenuOutlined style={{ cursor: "grab", color: "#999" }} />
));

export default (props) => {
  const contentHeight = useSelector(({ app }) => app.contentHeight);
  const clientHeight = contentHeight - 196;
  const writable = fetchAuth();
  const formMapRef = useRef([]);
  const [typeList, setTypeList] = useState([]);
  const [opSta, setOpSta] = useState("");
  const [OSList, setOSList] = useState([]);
  const [IPValue, setIPValue] = useState("");
  const [newOS, setNewOS] = useState("");
  const inputRef = useRef(null);
  const columns = [
    {
      title: "ID",
      width: 80,
      dataIndex: "id",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("monitor.mapping.fingerprint.sort"),
      width: 80,
      dataIndex: "sort",
      align: "left",
      ellipsis: true,
      render: (text, record) => {
        return (
          <Space>
            <DragHandle />
            <div>{record.sort}</div>
          </Space>
        );
      },
    },
    {
      title: language("project.temporary.montask.status"),
      width: 120,
      dataIndex: "state",
      align: "center",
      ellipsis: true,
      render: (text, record, index) => {
        if (record.state == 1) {
          return (
            <Switch
              checkedChildren={language("project.open")}
              unCheckedChildren={language("project.close")}
              defaultChecked
              onChange={(checked) => {
                SwitchBtn(record, checked);
              }}
            />
          );
        } else {
          return (
            <Switch
              checkedChildren={language("project.open")}
              unCheckedChildren={language("project.close")}
              onChange={(checked) => {
                SwitchBtn(record, checked);
              }}
            />
          );
        }
      },
    },
    {
      title: language("monitor.mapping.fingerprint.name"),
      width: 140,
      dataIndex: "name",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("monitor.mapping.asstypeList.searchText"),
      width: 140,
      dataIndex: "assettype",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("project.sysconf.analysis.vendor"),
      width: 170,
      dataIndex: "vendor",
      align: "left",
      ellipsis: true,
      render: (text, record, _, action) => {
        return <div className="vendorIconDiv">{vendorIcon(record.vendor)}</div>;
      },
    },
    {
      title: language("monitor.mapping.fingerprint.assetmodel"),
      width: 140,
      dataIndex: "assetmodel",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("monitor.mapping.fingerprint.os"),
      width: 120,
      dataIndex: "os",
      align: "left",
      ellipsis: true,
      render: (text, record, _, action) => {
        return (
          <Tooltip title={record.os} placement="topLeft">
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="osIcon">{OSIcon(record.os)}</div>
              <div className="typeText">{record.os}</div>
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: "MAC",
      width: 140,
      dataIndex: "mac",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("project.sysdebug.remote.serveport"),
      width: 120,
      dataIndex: "port",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("project.sysconf.analysis.idenment"),
      width: 120,
      dataIndex: "protocol",
      align: "left",
      ellipsis: true,
    },
    {
      title: "Banner",
      width: 140,
      dataIndex: "banner",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("monitor.mapping.fingerprint.keywords"),
      width: 140,
      dataIndex: "keywords",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("monitor.mapping.fingerprint.matchnums"),
      width: 140,
      dataIndex: "matchnums",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("project.operate"),
      valueType: "option",
      // width: 190,
      width: 130,
      align: "center",
      fixed: "right",
      hideInTable: !writable,
      render: (text, record, _, action) => [
        <Space>
          {/* <Button type="text" size="small">
            <i
              className="fa fa-arrow-circle-up"
              style={{
                color: record.first ? "#88898A" : "#12C189",
                fontSize: "15px",
              }}
              aria-hidden="true"
            />
          </Button>
          <Button type="text" size="small">
            <i
              className="fa fa-arrow-circle-down"
              style={{
                color: record.last ? "#88898A" : "#12C189",
                fontSize: "15px",
              }}
              aria-hidden="true"
            />
          </Button> */}
          <Button
            type="text"
            size="small"
            onClick={() => {
              fingerprintMatch(record.id, record.name);
            }}
          >
            <RiFindReplaceLine style={{ color: "#1890FF" }} />
          </Button>
          <Button
            type="text"
            size="small"
            key="editable"
            onClick={() => {
              setModalValue(record);
            }}
          >
            <EditTwoTone />
          </Button>
          <Popconfirm
            okText={language("project.yes")}
            cancelText={language("project.no")}
            title={language("project.delconfirm")}
            onConfirm={() => {
              delFingerprint(record.id, record.name);
            }}
          >
            <Button type="text" size="small">
              <DeleteOutlined style={{ color: "red" }} />
            </Button>
          </Popconfirm>
        </Space>,
      ],
    },
  ];

  const concealColumns = {
    id: { show: false },
    banner: { show: false },
    keywords: { show: false },
  };
  const apishowurl =
    "/cfg.php?controller=assetMapping&action=showFingerprintList";
  const [incID, setIncID] = useState(0);
  const rowKey = (record) => record.id;
  const [queryVal, setQueryVal] = useState("");
  const checkRowKey = "id";
  let searchVal = {
    queryVal: queryVal,
  };
  const [visable, setVisable] = useState(false);
  const [step, setStep] = useState(0);
  const [extrLoading, setExtrLoading] = useState(false);
  const showSearch = () => {
    return (
      <Search
        allowClear
        className="fingerSearch"
        placeholder={language("monitor.mapping.fingerprint.searchText")}
        onSearch={(queryVal) => {
          setQueryVal(queryVal);
          setIncID(incID + 1);
        }}
      />
    );
  };

  useEffect(() => {
    getOSList();
    assetSetModal();
  }, []);

  useEffect(() => {
    getTypeList();
    if (props.checkedTabKey == 3) {
      setIncID(incID => incID + 1)
    }
  }, [props.checkedTabKey]);

  /* 资产分析跳转赋值 */
  const assetSetModal = () => {
    if (props.values) {
      setIPValue(props?.values?.ip);
      showModal("open", "add");
      setTimeout(() => {
        formMapRef?.current?.forEach((formInstanceRef) => {
          formInstanceRef?.current?.setFieldsValue({
            fillin: {
              port: props.values.port,
              mac: props.values.mac,
              os: props.values.os,
              priority: "3",
              id: "",
              state: true,
              name: "",
              portSt: "1",
              portocolSt: "1",
              protocol: props.values.protocol,
              banner: "",
              keywords: "",
            },
            set: {
              assettype: props.values.type,
              vendor: props.values.vendor,
              assetmodel: props.values.model,
            },
          });
        });
      }, 500);
    }
  };

  const getTypeList = () => {
    post("/cfg.php?controller=assetMapping&action=assetTypeSelect").then(
      (res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        let list = [];
        res.data.map((item) => {
          if (item.value == "65535") {
            list.push({
              value: item.value,
              label: item.label,
              icon: item.icon,
              disabled: true,
            });
          } else {
            list.push({
              value: item.value,
              label: item.label,
              icon: item.icon,
            });
          }
        });
        setTypeList(list);
      }
    );
  };

  const getOSList = () => {
    post("/cfg.php?controller=assetMapping&action=filterAssetList").then(
      (res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        let list = [];
        res.data.map((item) => {
          if (item.filterName === "os") {
            item.info.map((item) => {
              list.push({ label: item.text, value: item.text });
            });
          }
        });
        setOSList(list);
      }
    );
  };

  /* 可编辑下拉框新增操作系统 */
  const addNewOs = (e) => {
    e.preventDefault();
    let list = [...OSList];
    list.push({ label: newOS, value: newOS });
    setOSList(list);
    setNewOS("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const dragSort = (oldIndex, newIndex, dataList) => {
    console.log(oldIndex, newIndex, dataList);
  };

  const handleClick = () => {
    showModal("open", "add");
  };

  /* 编辑时表格赋值 */
  const setModalValue = (values) => {
    let type = values.assetvalue;
    waitTime(1000).then(() => {
      formMapRef?.current?.forEach((formInstanceRef) => {
        formInstanceRef?.current?.setFieldsValue({
          fillin: {
            id: values.id,
            state: values.state,
            name: values.name,
            os: values.os,
            portSt: values.portSt,
            portocolSt: values.portocolSt,
            port: values.port,
            protocol: values.protocol,
            mac: values.mac,
            banner: values.banner,
            keywords: values.keywords,
            priority: values.priority ? values.priority : "3",
          },
          set: {
            assettype: type,
            vendor: values.vendor,
            assetmodel: values.assetmodel,
          },
        });
      });
    });
    showModal("open", "mod");
  };

  const showModal = (status, op) => {
    setOpSta(op);
    if (status === "open") {
      setVisable(true);
    } else {
      setVisable(false);
      formMapRef?.current?.forEach((formInstanceRef) => {
        formInstanceRef?.current?.resetFields();
      });
      setIPValue("");
      setStep(0);
      if (props.values) {
        props.delKey();
      }
    }
  };

  const waitTime = (time) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };

  const editFingerprint = (values) => {
    let data = {};
    data.id = values.fillin.id;
    data.state = values.fillin.state == 0 || !values.fillin.state ? 0 : 1;
    data.name = values.fillin.name;
    data.os = values.fillin.os;
    data.portSt = values.fillin.portSt;
    data.port = values.fillin.port;
    data.portocolSt = values.fillin.portocolSt;
    data.protocol = values.fillin.protocol;
    values.fillin.protocol;
    data.mac = values.fillin.mac;
    data.banner = values.fillin.banner;
    data.keywords = values.fillin.keywords;
    data.priority = values.fillin.priority;
    data.assettype = values?.set?.assettype;
    data.vendor = values?.set?.vendor;
    data.assetmodel = values?.set?.assetmodel;
    post(
      "/cfg.php?controller=assetMapping&action=setFingerprintList",
      data
    ).then((res) => {
      if (!res.success) {
        message.success(res.msg);
        return false;
      }
      message.success(res.msg);
      showModal("close");
      setIncID((incID) => incID + 1);
    });
  };

  const addFingerprint = (values) => {
    let data = {};
    data.id = values.fillin.id;
    data.state = values.fillin.state == 0 || !values.fillin.state ? 0 : 1;
    data.name = values.fillin.name;
    data.os = values.fillin.os;
    data.portSt = values.fillin.portSt;
    data.port = values.fillin.port;
    data.portocolSt = values.fillin.portocolSt;
    data.protocol = values.fillin.protocol;
    values.fillin.protocol;
    data.mac = values.fillin.mac;
    data.banner = values.fillin.banner;
    data.keywords = values.fillin.keywords;
    data.priority = values.fillin.priority;
    data.assettype = values?.set?.assettype;
    data.vendor = values?.set?.vendor;
    data.assetmodel = values?.set?.assetmodel;
    post("/cfg.php?controller=assetMapping&action=newFingerprint", data).then(
      (res) => {
        if (!res.success) {
          message.success(res.msg);
          return false;
        }
        message.success(res.msg);
        showModal("close");
        setIncID((incID) => incID + 1);
      }
    );
  };

  const fingerprintMatch = (id, name) => {
    post("/cfg.php?controller=assetMapping&action=fingerprintMatch", {
      id: id,
      name: name,
    }).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      setIncID((incID) => incID + 1);
    });
  };

  const delFingerprint = (id, name) => {
    post("/cfg.php?controller=assetMapping&action=delFingerprintList", {
      id: id,
      name: name,
    }).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      setIncID((incID) => incID + 1);
    });
  };

  /* 提取 */
  const extractFingerprint = (ip) => {
    let obj;
    formMapRef?.current?.forEach((formInstanceRef) => {
      obj = formInstanceRef?.current?.getFieldsValue(["fillin", "set"]);
    });
    setExtrLoading(true);
    post("/cfg.php?controller=assetMapping&action=assetExtract", {
      ip: ip ? ip : IPValue,
    }).then((res) => {
      if (!res.success) {
        setExtrLoading(false);
        setIPValue("");
        message.error(res.msg);
        return false;
      }
      setExtrLoading(false);
      formMapRef?.current?.forEach((formInstanceRef) => {
        formInstanceRef?.current?.setFieldsValue({
          fillin: {
            id: obj?.fillin?.id,
            state: obj?.fillin?.state,
            name: obj?.fillin?.name,
            os: res.data?.os,
            portSt: obj?.fillin?.portSt ? obj?.fillin?.portSt : "1",
            portocolSt: obj?.fillin?.portocolSt ? obj?.fillin?.portocolSt : "1",
            port: res.data?.port,
            protocol: res.data?.protocol,
            mac: res.data?.mac,
            banner: obj?.fillin?.banner,
            keywords: obj?.fillin?.keywords,
            priority: obj?.fillin?.priority ? obj?.fillin?.priority : "3",
          },
          set: {
            assettype: res.data?.type,
            vendor: res.data?.vendor,
            assetmodel: res.data?.model,
          },
        });
      });
      message.success(res.msg);
      setIPValue("");
      setIncID((incID) => incID + 1);
    });
  };

  /* 启用禁用 */
  const SwitchBtn = (record, checked) => {
    let data = {};
    data.id = record.id;
    data.name = record.name;
    let state = "0";
    if (checked) {
      state = "1";
    }
    data.state = state;
    post(
      "/cfg.php?controller=assetMapping&action=setFingerprintStatus",
      data
    ).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      setIncID((incID) => incID + 1);
      message.success(res.msg);
    });
  };

  return (
    <div className="fignerContain">
      <ProtableModule
        incID={incID}
        rowkey={rowKey}
        columns={columns}
        addButton={true}
        dragSort={dragSort}
        searchVal={searchVal}
        addClick={handleClick}
        apishowurl={apishowurl}
        searchText={showSearch()}
        checkRowKey={checkRowKey}
        tableKey="fingerprintTable"
        clientHeight={clientHeight}
        columnvalue="fingerColumnvalue"
        concealColumns={concealColumns}
        addTitle={language("project.newbuild")}
      />
      <StepsForm
        formMapRef={formMapRef}
        stepsProps={{
          type: "navigation",
        }}
        submitter={{
          render: (props, doms) => {
            return [
              step === 0 ? (
                <Button
                  key="cancle"
                  onClick={() => {
                    showModal("close");
                  }}
                >
                  {language("adminacc.message.popfirm.cancel")}
                </Button>
              ) : (
                <></>
              ),
              doms[0],
              step === 1 ? (
                <Button
                  type="primary"
                  key="submit"
                  onClick={() => props.onSubmit?.()}
                >
                  {language("monitor.mapping.fingerprint.finish")}
                </Button>
              ) : (
                <></>
              ),
            ];
          },
        }}
        stepsFormRender={(dom, submitter) => {
          return (
            <Modal
              width={600}
              destroyOnClose
              visible={visable}
              footer={submitter}
              getContainer={false}
              maskClosable={false}
              title={
                opSta === "add"
                  ? language("project.newbuild")
                  : language("project.edit")
              }
              bodyStyle={{
                paddingTop: 12,
                paddingBottom: 12,
                height: 630,
              }}
              onCancel={() => {
                showModal("close");
              }}
            >
              {dom}
            </Modal>
          );
        }}
        current={step}
        onCurrentChange={(value) => {
          setStep(value);
        }}
        onFinish={async (values) => {
          if (opSta === "add") {
            addFingerprint(values);
          } else {
            editFingerprint(values);
          }
        }}
      >
        <StepForm
          name="fillin"
          title={
            <div>
              <EditOutlined style={{ marginRight: 5 }} />
              {language("monitor.mapping.fingerprint.fillin")}
            </div>
          }
          {...modalFormLayout}
          stepProps={{
            icon: <></>,
          }}
          onFinish={async () => {
            // await waitTime(1000);
            return true;
          }}
        >
          <Alert
            type="info"
            className="fillinAlert"
            showIcon
            message={language("monitor.mapping.fingerprint.fillinAlert")}
            style={{ marginBottom: 12 }}
            closable
          />
          <ProFormText label="ID" name={["fillin", "id"]} hidden />
          <div className="switchDiv">
            <ProFormSwitch
              label={language("project.sysdebug.wireshark.state")}
              name={["fillin", "state"]}
              checkedChildren={language("project.enable")}
              unCheckedChildren={language("project.disable")}
            />
          </div>
          <ProFormText
            label={language("monitor.mapping.fingerprint.ip")}
            name={["fillin", "ip"]}
            onChange={(e) => {
              setIPValue(e.target.value);
            }}
            value={IPValue}
            rules={[
              {
                pattern: regIpList.ipv4.regex,
                message: regIpList.ipv4.alertText,
              },
            ]}
            addonAfter={
              <Button
                type="primary"
                style={{ display: "flex", alignItems: "center", width: 79 }}
                icon={
                  <CameraThree
                    theme="outline"
                    size={16}
                    style={{ marginTop: 4, marginRight: 5 }}
                  />
                }
                loading={extrLoading}
                onClick={() => {
                  extractFingerprint();
                }}
              >
                {language("analyse.assets.extract")}
              </Button>
            }
          />
          <ProFormText
            label={language("monitor.mapping.fingerprint.name")}
            name={["fillin", "name"]}
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
            disabled={opSta === "add" ? false : true}
          />
          <ProFormSelect
            label={language("monitor.mapping.fingerprint.os")}
            name={["fillin", "os"]}
            options={OSList}
            fieldProps={{
              dropdownRender: (menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: "8px 0" }} />
                  <Space style={{ padding: "0 8px 4px" }}>
                    <Input
                      placeholder={language(
                        "monitor.mapping.fingerprint.os.placeholder"
                      )}
                      allowClear
                      value={newOS}
                      onChange={(e) => {
                        setNewOS(e.target.value);
                      }}
                    />
                    <Button
                      icon={<PlusOutlined />}
                      onClick={(e) => {
                        addNewOs(e);
                      }}
                    >
                      {language("project.add")}
                    </Button>
                  </Space>
                </>
              ),
              dropdownStyle: {
                maxHeight: 200,
                overflow: "auto",
              },
            }}
            // rules={[
            //   {
            //     required: true,
            //     message: language("project.messageselect"),
            //   },
            // ]}
          />
          <div className="portDiv">
            <ProFormText
              label={language("project.sysdebug.remote.serveport")}
              name={["fillin", "port"]}
              rules={[
                {
                  pattern: regPortList.Uports.regex,
                  message: regPortList.Uports.alertText,
                },
              ]}
              addonBefore={
                <div className="portAfterInput">
                  <ProFormSelect
                    name={["fillin", "portSt"]}
                    initialValue="1"
                    allowClear={false}
                    options={[
                      {
                        label: language("monitor.mapping.fingerprint.equal"),
                        value: "1",
                      },
                      {
                        label: language("monitor.mapping.fingerprint.contain"),
                        value: "2",
                      },
                      {
                        label: language(
                          "monitor.mapping.fingerprint.uncontain"
                        ),
                        value: "3",
                      },
                      {
                        label: language("monitor.mapping.fingerprint.ignore"),
                        value: "4",
                      },
                    ]}
                  />
                </div>
              }
            />
          </div>
          <div className="portDiv">
            <ProFormText
              label={language("project.sysconf.analysis.idenment")}
              name={["fillin", "protocol"]}
              addonBefore={
                <div className="portAfterInput">
                  <ProFormSelect
                    name={["fillin", "portocolSt"]}
                    allowClear={false}
                    initialValue="1"
                    options={[
                      {
                        label: language("monitor.mapping.fingerprint.equal"),
                        value: "1",
                      },
                      {
                        label: language("monitor.mapping.fingerprint.contain"),
                        value: "2",
                      },
                      {
                        label: language(
                          "monitor.mapping.fingerprint.uncontain"
                        ),
                        value: "3",
                      },
                      {
                        label: language("monitor.mapping.fingerprint.ignore"),
                        value: "4",
                      },
                    ]}
                  />
                </div>
              }
            />
          </div>
          <ProFormText
            label={language("monitor.mapping.fingerprint.macInfo")}
            name={["fillin", "mac"]}
            rules={[
              {
                pattern:
                  /((([a-f0-9]{2}:){2})|(([a-f0-9]{2}-){2}))[a-f0-9]{2}/gi,
                message: regMacList.mac.alertText,
              },
            ]}
          />
          <ProFormText label="Banner" name={["fillin", "banner"]} />
          <ProFormTextArea
            label={language("monitor.mapping.fingerprint.keywords")}
            name={["fillin", "keywords"]}
          />
          <div className="priorityDiv">
            <ProFormRadio.Group
              label={language("monitor.mapping.fingerprint.priority")}
              radioType="button"
              fieldProps={{ buttonStyle: "solid" }}
              name={["fillin", "priority"]}
              initialValue="3"
              options={[
                {
                  label: language("monitor.mapping.fingerprint.priority.high"),
                  value: "3",
                },
                {
                  label: language("monitor.mapping.fingerprint.center"),
                  value: "2",
                },
                {
                  label: language("monitor.mapping.fingerprint.low"),
                  value: "1",
                },
              ]}
            />
          </div>
        </StepForm>
        <StepForm
          name="set"
          className="setForm"
          title={
            <div>
              <SettingOutlined style={{ marginRight: 5 }} />
              {language("monitor.mapping.fingerprint.setAssetType")}
            </div>
          }
          stepProps={{
            icon: <></>,
          }}
          {...modalFormLayout}
          onFinish={async () => {
            // await waitTime(1000);
            return true;
          }}
        >
          <ProFormSelect
            label={language("monitor.mapping.asstypeList.searchText")}
            name={["set", "assettype"]}
            showSearch
            options={typeList}
          />
          <ProFormText
            label={language("monitor.mapping.fingerprint.vendor")}
            name={["set", "vendor"]}
          />
          <ProFormText
            label={language("monitor.mapping.fingerprint.assetmodel")}
            name={["set", "assetmodel"]}
          />
          <Alert
            type="info"
            className="setAlert"
            showIcon
            message={language("monitor.mapping.fingerprint.setAlertTitle")}
            description={language("monitor.mapping.fingerprint.description")}
          />
        </StepForm>
      </StepsForm>
    </div>
  );
};
