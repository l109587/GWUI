import React, { useRef, useState, useEffect } from "react";
import {
  Input,
  message,
  Modal,
  Tabs,
  Row,
  Col,
  Button,
  Space,
  Popconfirm,
  Alert,
  Affix,
  Tooltip,
} from "antd";
import {
  ProForm,
  ProFormText,
  ProFormRadio,
  ProFormSelect,
  ProFormTextArea,
  ProFormCheckbox,
  ProFormSwitch,
  ProCard,
} from "@ant-design/pro-components";
import { language } from "@/utils/language";
import { post, postAsync } from "@/services/https";
import { SaveOutlined } from "@ant-design/icons";
import "@/utils/index.less";
import "@/common/common.less";
import "./index.less";
import DelIcon from "@/assets/nac/del.svg";
import EditIcon from "@/assets/nac/saEdit.svg";
import { NumberField } from "@/common/fun/formTypeCon";
import { regList, regUrlList } from "@/utils/regExp";
import { TableLayout, AmTag } from "@/components";
import { EditTable, NameText } from "@/utils/fromTypeLabel";
const { ProtableModule, WebUploadr } = TableLayout;
const { confirm } = Modal;
const { TabPane } = Tabs;
let H = document.body.clientHeight - 120;
var clientHeight = H;
export default () => {
  const form1Ref = useRef();
  const form2Ref = useRef();
  const form3Ref = useRef();
  const form4Ref = useRef();
  const form5Ref = useRef();

  const [confirmLoading, setConfirmLoading] = useState(false);
  const renderRemove = (text, record) => (
    <Popconfirm
      onConfirm={() => {
        setConfirmLoading(false);
        const tableDataSource = form1Ref.current.getFieldsValue([
          "exdomainlist",
        ]);
        form1Ref.current.setFieldsValue({
          exdomainlist: tableDataSource["exdomainlist"].filter(
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

  const [activeKey, setActiveKey] = useState("radcfg");
  const [initialValue4, setInitialValue4] = useState({});
  const [editableKeys, setEditableRowKeys] = useState(); //每行编辑的id
  const radiusconfigcolumns = [
    {
      title: language("accctrl.radconf.name"),
      dataIndex: "name",
      width: "155px",
      align: "left",
    },
    {
      title: language("accctrl.radconf.accessdom"),
      dataIndex: "dom",
      align: "left",
    },
    {
      title: language("project.operate"),
      valueType: "option",
      width: "80px",
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

  const rootcertificatecolumns = [
    {
      title: language("accctrl.radconf.lssuer"),
      dataIndex: "address",
      width: "120px",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("accctrl.radconf.user"),
      dataIndex: "address",
      align: "left",
      width: "100px",
      ellipsis: true,
    },
    {
      title: language("accctrl.radconf.validityperiod"),
      dataIndex: "address",
      align: "left",
      width: "100px",
      ellipsis: true,
    },
    {
      title: "序列号",
      dataIndex: "address",
      align: "left",
      width: "100px",
      ellipsis: true,
    },
    {
      title: "类型",
      dataIndex: "type",
      align: "left",
      width: "100px",
      ellipsis: true,
    },
  ];

  const servercertificatecolumns = [
    {
      title: language("accctrl.radconf.lssuer"),
      dataIndex: "address",
      width: "120px",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("accctrl.radconf.user"),
      dataIndex: "address",
      align: "left",
      width: "100px",
      ellipsis: true,
    },
    {
      title: language("accctrl.radconf.validityperiod"),
      dataIndex: "address",
      align: "left",
      width: "100px",
      ellipsis: true,
    },
    {
      title: "序列号",
      dataIndex: "address",
      align: "left",
      width: "100px",
      ellipsis: true,
    },
    {
      title: language("accctrl.radconf.type"),
      dataIndex: "address",
      align: "left",
      width: "80px",
      ellipsis: true,
    },
  ];

  useEffect(() => {
    if (activeKey == "portal") {
      portalShow();
    }
    radshow();
  }, [activeKey]);

  const radshow = () => {
    post("/cfg.php?controller=radconfig&action=radshow")
      .then((res) => {
        if (res.success) {
          console.log(activeKey);
          if (res.data?.radcfg && activeKey == "radcfg") {
            let info = res.data.radcfg;
            let data = {};
            data.radsw = info.radsw == "Y" ? ["Y"] : [];
            data.checksw = info.checksw == "Y" ? ["Y"] : [];
            data.escapesw = info.escapesw == "Y" ? "Y" : "";
            data.auto_escape = info.auto_escape == "Y" ? "Y" : "";
            data.escape_time = info.escape_time;
            data.escape_devnum = info.escape_devnum;
            data.acl_escape = info.acl_escape == "Y" ? ["Y"] : [];
            data.firverify = info.firverify == "Y" ? ["Y"] : [];
            data.pc = info.pc == "Y" ? ["Y"] : [];
            data.dumb = info.dumb == "Y" ? ["Y"] : [];
            data.assets = info.assets == "Y" ? ["Y"] : [];
            data.bothway = info.bothway == "Y" ? ["Y"] : [];
            data.aspidauth = info.aspidauth == "Y" ? ["Y"] : [];
            data.aspidmac = info.aspidmac == "Y" ? ["Y"] : [];
            data.multi_domain = info.multi_domain == "Y" ? ["Y"] : [];
            data.exdomain = info.exdomain;
            // setTimeout(function () {
            form1Ref.current.setFieldsValue(data);
            // }, 100)
          }
          if (res.data?.domaincfg && activeKey == "domaincfg") {
            let info1 = res.data.domaincfg;
            console.log(info1);
            let data1 = {};
            data1.linksw = info1.linksw == "Y" ? ["Y"] : [];
            data1.group = info1.group ? info1.group : "";
            data1.domain = info1.domain ? info1.domain : "";
            data1.user = info1.user ? info1.user : "";
            data1.passwd = info1.passwd ? info1.passwd : "";
            form2Ref.current.setFieldsValue(data1);
          }
          if (res.data?.radantifake && activeKey == "portal") {
            let info = res.data.radantifake;
            console.log(info);
            let data1 = {};
            data1.afsw = info.afsw == "Y" ? ["Y"] : [];
            data1.afencpass = info.afencpass ? info.afencpass : "";
            form5Ref.current.setFieldsValue(data1);
          }
        }
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  const portalShow = async () => {
    let data = {};
    let res = await postAsync("/cfg.php?controller=portal&action=show");
    if (res.success) {
      data.sw = res.data?.sw == "Y" ? ["Y"] : [];
      data.bas_port = res.data?.bas_port;
    }

    let rsp = await postAsync("/cfg.php?controller=portal&action=url");
    if (rsp.success) {
      data.url = rsp.data?.url;
    }
    setInitialValue4(data);
    form4Ref.current.setFieldsValue(data);
  };

  const radiusSave = (info) => {
    let data = {};
    let radcfg = {};
    console.log(info);
    radcfg.radsw = info.radsw?.indexOf("Y") >= 0 ? "Y" : "N";
    radcfg.checksw = info.checksw?.indexOf("Y") >= 0 ? "Y" : "N";
    radcfg.escapesw = info.escapesw == "Y" ? "Y" : "N";
    radcfg.auto_escape = info.auto_escape == "Y" ? "Y" : "N";
    radcfg.escape_time = info.escape_time;
    radcfg.escape_devnum = info.escape_devnum;
    radcfg.acl_escape = info.acl_escape?.indexOf("Y") >= 0 ? "Y" : "N";
    radcfg.firverify = info.firverify?.indexOf("Y") >= 0 ? "Y" : "N";
    radcfg.pc = info.pc?.indexOf("Y") >= 0 ? "Y" : "N";
    radcfg.dumb = info.dumb?.indexOf("Y") >= 0 ? "Y" : "N";
    radcfg.assets = info.assets?.indexOf("Y") >= 0 ? "Y" : "N";
    radcfg.bothway = info.bothway?.indexOf("Y") >= 0 ? "Y" : "N";
    radcfg.aspidauth = info.aspidauth?.indexOf("Y") >= 0 ? "Y" : "N";
    radcfg.aspidmac = info.aspidmac?.indexOf("Y") >= 0 ? "Y" : "N";
    radcfg.multi_domain = info.multi_domain?.indexOf("Y") >= 0 ? "Y" : "N";
    radcfg.exdomain = info.exdomain;
    data.radcfg = JSON.stringify(radcfg);
    let radlog = {};
    radlog.raddebug = info.raddebug?.indexOf("Y") >= 0 ? "Y" : "N";
    data.radlog = JSON.stringify(radlog);
    console.log(data);
    post("/cfg.php?controller=radconfig&action=radset", data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        radshow();
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  const domSave = (info) => {
    let data = {};
    let domaincfg = {};
    domaincfg.linksw = info.linksw?.indexOf("Y") >= 0 ? "Y" : "N";
    domaincfg.group = info.group;
    domaincfg.domain = info.domain;
    domaincfg.user = info.user;
    domaincfg.passwd = info.passwd;
    data.domaincfg = JSON.stringify(domaincfg);
    post("/cfg.php?controller=radconfig&action=radset", data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        radshow();
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  const radcertSave = (info) => {
    let data = {};
    data.afsw = info.afsw?.indexOf("Y") >= 0 ? "Y" : "N";
    data.afencpass = info.afencpass;
    post("/cfg.php?controller=radconfig&action=radset", data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        radshow();
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  //高级1
  const portalSave = (info) => {
    let data = {};
    data.afsw = info.afsw?.indexOf("Y") >= 0 ? "Y" : "N";
    data.afencpass = info.afencpass;
    post("cfg.php?controller=portal&action=set", data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        portalShow();
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  //高级2
  const antifakeSave = (info) => {
    let data = {};
    data.afsw = info.afsw?.indexOf("Y") >= 0 ? "Y" : "N";
    data.afencpass = info.afencpass;
    post("/cfg.php?controller=radconfig&action=antifakeconfig", data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        radshow();
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  /**
   * 上传
   */
  const maxSize = 100;
  const accept = ".tgz, .tar"; // 限制文件上传类型
  const upurl = "/cfg.php?controller=mtaConf&action=importBackupConf"; // 上传接口
  const isShowUploadList = false; // 是否回显文件名与进度条
  const maxCount = 1; // 最大上传文件数量
  const isUpsuccess = true;
  //接口参数
  const parameter = {};

  const onSuccess = (res) => {
    if (!res.success) {
      message.error(res.msg);
      return false;
    }
    message.success(res.msg);
    recodete();
  };

  const onError = () => {
    message.error(language("project.errorMsg"));
  };

  return (
    <div
      className="radconfbox"
      style={{ paddingTop: "15px", backgroundColor: "#FFFFFF" }}
    >
      <Tabs
        type="line"
        tabPosition="left"
        style={{ height: clientHeight }}
        activeKey={activeKey}
        destroyInactiveTabPane={true}
        onChange={(key) => {
          setActiveKey(key);
        }}
      >
        <TabPane tab={language("accctrl.radconf.radiusconfig")} key="radcfg">
          <ProCard ghost title={language("accctrl.radconf.radiusconfig")}>
            <ProForm
              layout="horizontal"
              formRef={form1Ref}
              submitTimeout={2000}
              className="radiusconfig"
              submitter={{
                render: (props, doms) => {
                  return [
                    <Affix offsetBottom={40}>
                      <Row>
                        <Col span={14}>
                          <Button
                            type="primary"
                            style={{
                              borderRadius: 5,
                              marginTop: 15,
                            }}
                            onClick={() => {
                              props.submit();
                            }}
                          >
                            <SaveOutlined />
                            {language("project.savesettings")}
                          </Button>
                        </Col>
                      </Row>
                    </Affix>,
                  ];
                },
              }}
              onFinish={(values) => {
                radiusSave(values);
              }}
            >
              <div
                style={{
                  maxHeight: clientHeight - 100,
                  overflow: "auto",
                }}
              >
                <div className="rightcbox procard2box">
                  <ProCard
                    ghost
                    title={language("accctrl.radconf.accesscontrol")}
                  >
                    <ProFormCheckbox.Group
                      name="radsw"
                      options={[
                        {
                          label: language(
                            "accctrl.radconf.enableaccesscontrolauthentication"
                          ),
                          value: "Y",
                        },
                      ]}
                    />
                  </ProCard>
                  <ProCard
                    ghost
                    title={language("accctrl.radconf.securitycertification")}
                  >
                    <ProFormCheckbox.Group
                      name="checksw"
                      options={[
                        {
                          label: language(
                            "accctrl.radconf.enablesecuritycertification"
                          ),
                          value: "Y",
                        },
                      ]}
                    />
                  </ProCard>
                  <ProCard
                    ghost
                    title={language("accctrl.radconf.debuggingfunction")}
                  >
                    <ProFormCheckbox.Group
                      name="raddebug"
                      options={[
                        {
                          label: language(
                            "accctrl.radconf.enabledebuggingmodeauthenticationprocess"
                          ),
                          value: "Y",
                        },
                      ]}
                    />
                  </ProCard>
                  <div className="radobblockbox escapebox">
                    <div className="fromitembuttom">
                      <ProCard
                        ghost
                        title={language("accctrl.radconf.oneclickescape")}
                      >
                        <ProFormRadio.Group
                          name="escapesw"
                          id="escapesw"
                          onChange={(e) => {
                            if (e.target.checked) {
                              form1Ref.current.setFieldsValue({
                                auto_escape: "",
                              });
                            }
                          }}
                          options={[
                            {
                              label: language(
                                "accctrl.radconf.enablemanualescapeauthenticated"
                              ),
                              value: "Y",
                            },
                          ]}
                        />
                      </ProCard>
                    </div>
                    <ProFormRadio.Group
                      name="auto_escape"
                      id="auto_escape"
                      onChange={(e) => {
                        if (e.target.checked) {
                          form1Ref.current.setFieldsValue({ escapesw: "" });
                        }
                      }}
                      options={[
                        {
                          label: language(
                            "accctrl.radconf.enableautomaticescapein"
                          ),
                          value: "Y",
                        },
                      ]}
                      addonAfter={
                        <div style={{ marginLeft: "-18px" }}>
                          <Col className="escapeconbox">
                            <Space>
                              <NumberField
                                name="escape_time"
                                width="50px"
                                marButStatus={true}
                                type={"small"}
                                placeholder={" "}
                                afterUnit={"秒"}
                                afterText={language(
                                  "accctrl.radconf.numconsecutiveauthentication"
                                )}
                              />
                              <NumberField
                                name="escape2_time"
                                marButStatus={true}
                                width="50px"
                                type={"small"}
                                placeholder={" "}
                                afterUnit={"个"}
                                afterText={language(
                                  "accctrl.radconf.directlyauthenticatedafter"
                                )}
                              />
                            </Space>
                          </Col>
                        </div>
                      }
                    />
                  </div>
                  <div className="escapeswbox">
                    <ProCard
                      ghost
                      title={language("accctrl.radconf.accessaudit")}
                    >
                      <ProFormCheckbox.Group
                        name="firverify"
                        options={[
                          {
                            label: language(
                              "accctrl.radconf.enableaccessterminallist"
                            ),
                            value: "Y",
                          },
                        ]}
                      />
                    </ProCard>
                  </div>
                  <div className="fromitemleftbox teraccessbox">
                    <ProFormCheckbox.Group
                      label={" "}
                      name="devinfo"
                      disabled={true}
                      options={[
                        {
                          label: language(
                            "accctrl.radconf.auditpcterminalaccess"
                          ),
                          value: "pc",
                        },
                        {
                          label: language(
                            "accctrl.radconf.auditdomainterminalaccess"
                          ),
                          value: "dumb",
                        },
                      ]}
                    />
                  </div>
                  <div className="escapeswbox">
                    <ProCard
                      ghost
                      title={language(
                        "accctrl.radconf.multidomainauthentication"
                      )}
                    >
                      <ProFormCheckbox.Group
                        name="multi_domain"
                        options={[
                          {
                            label: language(
                              "accctrl.radconf.enablemultidomainauthentication"
                            ),
                            value: "Y",
                          },
                        ]}
                        addonAfter={
                          <div style={{ color: "#BFBFBF" }}>
                            {language(
                              "accctrl.radconf.pleasedomainnamefollowingtable"
                            )}
                          </div>
                        }
                      />
                    </ProCard>
                  </div>
                  <div style={{ width: "555px" }}>
                    <EditTable
                      name={"exdomainlist"}
                      style={{
                        padding: "0 0 0 23px",
                      }}
                      position={false}
                      fromcolumns={radiusconfigcolumns}
                      required={false}
                      editableKeys={editableKeys}
                      label={false}
                      setEditableRowKeys={setEditableRowKeys}
                    />
                  </div>
                </div>
              </div>
            </ProForm>
          </ProCard>
        </TabPane>
        <TabPane
          tab={language("accctrl.radconf.certificateconfig")}
          key="radcert"
        >
          <ProCard ghost title={language("accctrl.radconf.certificateconfig")}>
            <ProForm
              layout="horizontal"
              formRef={form3Ref}
              submitTimeout={2000}
              className="cerfconfig"
              submitter={{
                render: (props, doms) => {
                  return [
                    <Affix offsetBottom={40}>
                      <Row>
                        <Col span={14}>
                          <Button
                            type="primary"
                            style={{
                              borderRadius: 5,
                              marginTop: 15,
                            }}
                            onClick={() => {
                              props.submit();
                            }}
                          >
                            <SaveOutlined />
                            {language("project.savesettings")}
                          </Button>
                        </Col>
                      </Row>
                    </Affix>,
                  ];
                },
              }}
              onFinish={(values) => {}}
            >
              <div
                style={{
                  maxHeight: clientHeight - 100,
                  overflow: "auto",
                }}
                className="rightcbox procard2box "
              >
                <div>
                  <ProCard
                    ghost
                    title={language(
                      "accctrl.radconf.certificateauthentication"
                    )}
                  >
                    <ProFormCheckbox.Group
                      name="ssl"
                      options={[
                        {
                          label: language(
                            "accctrl.radconf.enablecertificateauthentication"
                          ),
                          value: "ssl",
                        },
                      ]}
                    />
                  </ProCard>
                  <div className="radobblockbox">
                    <ProCard
                      ghost
                      title={language("accctrl.radconf.certificatesource")}
                    >
                      <ProFormRadio.Group
                        name="usState"
                        id="usState"
                        options={[
                          {
                            label: language(
                              "accctrl.radconf.usenationalsecuritycertificate"
                            ),
                            value: "primitive",
                          },
                          {
                            label: language(
                              "accctrl.radconf.usecustomerfreeuploadcertificate"
                            ),
                            value: "enable",
                          },
                        ]}
                      />
                    </ProCard>
                    <ProCard ghost title={language("accctrl.radconf.keytype")}>
                      <ProFormRadio.Group
                        name="cover"
                        id="cover"
                        options={[
                          {
                            label: language(
                              "accctrl.radconf.internationalbusinesspwdstandards"
                            ),
                            value: "Y",
                          },
                          {
                            label: language(
                              "accctrl.radconf.chinanationalpwdstandards"
                            ),
                            value: "N",
                          },
                        ]}
                      />
                    </ProCard>
                  </div>
                  <div style={{ width: "600px" }}>
                    <ProCard
                      ghost
                      title={language("accctrl.radconf.rootcertificatelink")}
                    >
                      <div
                        className="uploadbox"
                        style={{ marginBottom: "5px" }}
                      >
                        <WebUploadr
                          isUpsuccess={isUpsuccess}
                          isAuto={true}
                          upbutext={language(
                            "project.temporary.tenance.uploadtitle"
                          )}
                          maxSize={maxSize}
                          upurl={upurl}
                          accept={accept}
                          isShowUploadList={isShowUploadList}
                          maxCount={maxCount}
                          parameter={parameter}
                          onSuccess={onSuccess}
                          onError={onError}
                          isError={true}
                        />
                      </div>
                      <EditTable
                        label={" "}
                        width={"600px"}
                        position={false}
                        style={{
                          marginLeft: "-10px",
                        }}
                        name={"addrlistinfo"}
                        fromcolumns={rootcertificatecolumns}
                        required={false}
                        editableKeys={editableKeys}
                        editableClose={true}
                        setEditableRowKeys={setEditableRowKeys}
                      />
                    </ProCard>

                    <ProCard
                      ghost
                      title={language("accctrl.radconf.servercertificate")}
                    >
                      <div
                        className="uploadbox"
                        style={{ marginBottom: "5px" }}
                      >
                        <WebUploadr
                          isUpsuccess={isUpsuccess}
                          isAuto={true}
                          upbutext={language(
                            "project.temporary.tenance.uploadtitle"
                          )}
                          maxSize={maxSize}
                          upurl={upurl}
                          accept={accept}
                          isShowUploadList={isShowUploadList}
                          maxCount={maxCount}
                          parameter={parameter}
                          onSuccess={onSuccess}
                          onError={onError}
                          isError={true}
                        />
                      </div>
                      <EditTable
                        label={" "}
                        width={"600px"}
                        position={false}
                        style={{
                          marginLeft: "-10px",
                        }}
                        name={"addrlistinfo"}
                        fromcolumns={servercertificatecolumns}
                        required={false}
                        editableKeys={editableKeys}
                        editableClose={true}
                        setEditableRowKeys={setEditableRowKeys}
                      />
                    </ProCard>
                  </div>
                </div>
              </div>
            </ProForm>
          </ProCard>
        </TabPane>
        <TabPane tab={"高级配置"} key="portal">
          <ProCard ghost title={"高级配置"}>
            <ProForm
              formRef={form4Ref}
              layout="horizontal"
              submitTimeout={2000}
              className="switchconfigbox seniofconfigbox"
              submitter={{
                render: (props, doms) => {
                  return [
                    <Affix offsetBottom={40}>
                      <Row>
                        <Col span={14}>
                          <Button
                            type="primary"
                            style={{
                              borderRadius: 5,
                              marginTop: 15,
                            }}
                            onClick={() => {
                              props.submit();
                            }}
                          >
                            <SaveOutlined />
                            {language("project.savesettings")}
                          </Button>
                        </Col>
                      </Row>
                    </Affix>,
                  ];
                },
              }}
              onFinish={(values) => {
                portalSave(values);
              }}
            >
              <div
                style={{
                  maxHeight: clientHeight - 100,
                  overflow: "auto",
                }}
                className={"procard2box"}
              >
                <div className="fromitembuttom8">
                  <ProCard
                    ghost
                    title={language("accctrl.radconf.linkageauthentication")}
                  >
                    <div className="rightcbox ">
                      <div>
                        <ProFormSwitch
                          name="linksw"
                          width={"300px"}
                          checkedChildren={language("project.open")}
                          unCheckedChildren={language("project.close")}
                          addonAfter={
                            <div>
                              {language(
                                "accctrl.radconf.enablelinkageauthentication"
                              )}
                            </div>
                          }
                        />
                        <div className="fromitemleftbox">
                          <ProFormText
                            label={language("accctrl.radconf.workgroup")}
                            width={"300px"}
                            name="group"
                          />
                          <ProFormText
                            label={language("accctrl.radconf.dom")}
                            width={"300px"}
                            name="domain"
                            rules={[
                              {
                                pattern: regUrlList.url.regex,
                                message: regUrlList.url.alertText,
                              },
                            ]}
                          />
                          <NameText
                            label={language("accctrl.radconf.domaccount")}
                            width={"300px"}
                            name="user"
                            rules={false}
                          />
                          <div>
                            <ProFormText.Password
                              label={language("accctrl.radconf.password")}
                              width={"300px"}
                              name="passwd"
                            />
                          </div>
                        </div>
                      </div>
                      <div style={{ width: "100%", height: 15 }}></div>
                    </div>
                  </ProCard>
                  <ProCard ghost title={"交换机Portal认证"}>
                    <div className="rightcbox">
                      <div className="fromitembuttom10">
                        <ProFormSwitch
                          name="sw"
                          width={"300px"}
                          checkedChildren={language("project.open")}
                          unCheckedChildren={language("project.close")}
                          addonAfter={
                            <div>
                              {language(
                                "accctrl.radconf.enableswitchportalauthentication"
                              )}
                            </div>
                          }
                        />
                        <div className="fromitemleftbox">
                          <ProFormText
                            label={language("accctrl.radconf.linkport")}
                            width={"300px"}
                            name={"bas_port"}
                          />
                          <div>
                            <ProFormText
                              label={language(
                                "accctrl.radconf.authenticationpage"
                              )}
                              width={"300px"}
                              name={"url"}
                            >
                              <Alert
                                className="seniovalertbox"
                                width={"300px"}
                                message={
                                  initialValue4.url ? initialValue4.url : ""
                                }
                                type="info"
                                showIcon
                                icon={
                                  <div
                                    style={{
                                      marginRight: "10px",
                                      color: "#1677FF",
                                      fontSize: "14px",
                                    }}
                                  >
                                    ●
                                  </div>
                                }
                              />
                            </ProFormText>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ProCard>
                  <ProCard ghost title={"防伪配置"}></ProCard>
                  <div
                    className="rightcbox procard2box"
                    style={{
                      maxHeight: clientHeight - 100,
                      overflow: "auto",
                    }}
                  >
                    <div className="fromitembuttom10">
                      <ProFormSwitch
                        name="afsw"
                        width={"300px"}
                        checkedChildren={language("project.open")}
                        unCheckedChildren={language("project.close")}
                        addonAfter={
                          <div>
                            {language(
                              "accctrl.radconf.enablethirdpartyauthentication"
                            )}
                          </div>
                        }
                      />
                      <div className="fromitemleftbox">
                        <ProFormText.Password
                          label={language("accctrl.radconf.key")}
                          width={"300px"}
                          name={"afencpass"}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ProForm>
          </ProCard>
        </TabPane>
      </Tabs>
    </div>
  );
};
