import React, { useRef, useState, useEffect } from "react";
import { ProTable, ModalForm, ProFormText } from "@ant-design/pro-components";
import {
  Button,
  Popconfirm,
  Space,
  Tag,
  message,
  Input,
  Tooltip,
  Spin,
  Modal,
} from "antd";
import { post } from "@/services/https";
import { LoadingOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { modalFormLayout } from "@/utils/helper";
import "@/utils/index.less";
import "./index.less";
import Find from "@/assets/images/analyse/iconPark-find.svg";
import ckInOutConfiged from "@/assets/images/probers/ckInOut-configed.svg";
import ckInOutNotConfig from "@/assets/images/probers/ckInOut-notConfig.svg";
import illsvrConfiged from "@/assets/images/probers/illsvr-configed.svg";
import illsvrNotConfig from "@/assets/images/probers/illsvr-notConfig.svg";
import vioDevConfiged from "@/assets/images/probers/vioDev-configed.svg";
import vioDevNotConfig from "@/assets/images/probers/vioDev-notConfig.svg";
import IPv6Configed from "@/assets/images/probers/IPv6-configed.svg";
import IPv6NotConfig from "@/assets/images/probers/IPv6-notConfig.svg";
import selfCheckConfiged from "@/assets/images/probers/selfCheck-configed.svg";
import selfCheckNotConfig from "@/assets/images/probers/selfCheck-notConfig.svg";
import { language } from "@/utils/language";
import download from "@/utils/downnloadfile";
import { fetchAuth } from "@/utils/common";
import { useSelector } from "umi";
import { regList } from "@/utils/regExp";
import ProtableModule from "@/components/Module/ProtableModule";
import { ReactComponent as BatchUnloadIcon } from "@/assets/images/operate/batchUnloadIcon.svg";
import working from "@/assets/images/operate/working.svg";
const { Search } = Input;
const { confirm } = Modal;

const Configuration = (props) => {
  const contentHeight = useSelector(({ app }) => app.contentHeight);
  const clientHeight = contentHeight - 265;
  const writable = fetchAuth();
  const formRef = useRef();
  const restoreRef = useRef();
  const [queryVal, setQueryVal] = useState(""); //搜索值
  const [requestNum, setRequestNum] = useState("");
  const [modalStatus, setModalStatus] = useState(false); //model 添加弹框状态
  const [columns, setColumns] = useState(columnlist);
  const [downLoading, setDownLoading] = useState(false);
  const rowKey = (record) => record.id;
  const [incID, setIncID] = useState(0);
  const tableKey = "teprobelist";
  let columnvalue = "teprobelist";
  let concealColumnList = {
    id: { show: false },
  };
  let searchVal = {
    queryVal: queryVal,
  };

  const [restStatus, setRestStatus] = useState(false);
  const [requestCode, setRequestCode] = useState("");

  //导出按钮
  const logDownload = (record) => {
    download(
      "/cfg.php?controller=probeManage&action=exportAgentLog",
      {
        agtAddr: record.addr,
        agentId: record.sid,
      },
      setDownLoading,
      true,
      "",
      true
    );
  };

  const showSearch = () => {
    return (
      <Search
        allowClear
        className="tebeListSearch"
        placeholder={language("probers.teprobe.hdprobelist.searchText")}
        onSearch={(queryVal) => {
          setQueryVal(queryVal);
          setIncID((incID) => incID + 1);
        }}
      />
    );
  };

  const showUninstall = (selectedRowKeys, data, selectedRows) => {
    let disabled = false;
    if (selectedRowKeys.length === 0) {
      disabled = true;
    }
    return (
      <Space>
        <Button
          type="danger"
          disabled={disabled}
          icon={
            <BatchUnloadIcon
              style={{
                fill: disabled ? "rgba(0, 0, 0, 0.25)" : "#FFFFFF",
                marginBottom: -3,
                marginRight: 5,
              }}
            />
          }
          onClick={() => {
            let ids = [];
            let sids = [];
            selectedRows.map((item) => {
              ids.push(item.id);
              sids.push(item.sid);
            });
            showOKModal(ids, sids, selectedRows);
          }}
        >
          {language("probers.teprobe.hdprobelist.batchUnload")}
        </Button>
        <Button
          type="primary"
          onClick={() => {
            showRestoreModal("open");
          }}
          icon={<img alt="logo" className="findlogo" src={Find} />}
        >
          {language("probers.teprobe.probelist.netrecoverCode")}
        </Button>
        <Button
          type="primary"
          onClick={() => {
            getModal("open");
          }}
          icon={<img alt="logo" className="findlogo" src={Find} />}
        >
          {language("project.temporary.terminal.findload")}
        </Button>
      </Space>
    );
  };

  const showOKModal = (ids, ips, selectedRows) => {
    let sum = selectedRows.length;
    confirm({
      className: "unloadModal",
      icon: <ExclamationCircleOutlined />,
      title: language("probers.teprobe.hdprobelist.batchUnloadConfirm"),
      content: language("project.cancelcon", { sum: sum }),
      onOk() {
        unLoad(ids, ips);
      },
    });
  };

  const downloadClick = () => {
    download(
      "/cfg.php?controller=probeManage&action=exportAgentList",
      {},
      setDownLoading
    );
  };

  const columnlist = [
    {
      title: "ID",
      dataIndex: "id",
      width: 50,
    },
    {
      title: language("project.mconfig.ectstu"),
      dataIndex: "state",
      width: 80,
      align: "center",
      render: (text, record, index) => {
        if (record.state == "online") {
          return (
            <Tooltip title={language("probers.teprobe.probelist.nowork")}>
              <Tag color={"success"} style={{ marginRight: 0, width: 45 }}>
                {language("project.sysconf.analysis.online")}
              </Tag>
            </Tooltip>
          );
        } else if (record.state == "offline") {
          return (
            <Tag
              color={"default"}
              className="offlineTag"
              style={{ marginRight: 0, width: 45 }}
            >
              {language("project.sysconf.analysis.noline")}
            </Tag>
          );
        } else {
          return (
            <Tooltip title={language("probers.teprobe.probelist.working")}>
              <Tag
                color={"success"}
                style={{ marginRight: 0, width: 45, position: "relative" }}
              >
                <img
                  src={working}
                  style={{ position: "absolute", top: 0, left: 0 }}
                />
                <span style={{ marginLeft: 2 }}>
                  {language("project.sysconf.analysis.online")}
                </span>
              </Tag>
            </Tooltip>
          );
        }
      },
    },
    {
      title: language("project.temporary.terminal.sid"),
      dataIndex: "sid",
      width: 140,
      ellipsis: true,
      sorter: true,
    },
    {
      title: language("project.temporary.terminal.devName"),
      dataIndex: "devName",
      width: 160,
      ellipsis: true,
    },
    {
      title: language("project.temporary.terminal.addr"),
      dataIndex: "addr",
      width: 140,
      ellipsis: true,
      sorter: true,
    },
    {
      title: language("project.temporary.terminal.mac"),
      dataIndex: "mac",
      width: 160,
      ellipsis: true,
    },
    {
      title: language("project.temporary.terminal.os"),
      dataIndex: "os",
      width: 150,
      ellipsis: true,
    },
    {
      title: language("project.temporary.terminal.listversion"),
      dataIndex: "version",
      width: 100,
      ellipsis: true,
    },
    {
      title: language("project.temporary.terminal.conf"),
      dataIndex: "conf",
      width: 160,
      align: "center",
      ellipsis: true,
      render: (text, record, _, action) => {
        let Ifweb = "";
        let Sverver = "";
        let Assem = "";
        let V6avatar = "";
        let selfCheck = "";
        if (record.conf.indexOf("ckInOut") !== -1) {
          Ifweb = ckInOutConfiged;
        }
        if (record.conf.indexOf("ckInOut") === -1) {
          Ifweb = ckInOutNotConfig;
        }
        if (record.conf.indexOf("vioSrv") !== -1) {
          Sverver = illsvrConfiged;
        }
        if (record.conf.indexOf("vioSrv") === -1) {
          Sverver = illsvrNotConfig;
        }
        if (record.conf.indexOf("vioDev") !== -1) {
          Assem = vioDevConfiged;
        }
        if (record.conf.indexOf("vioDev") === -1) {
          Assem = vioDevNotConfig;
        }
        if (record.conf.indexOf("IPV6AssetRpt") !== -1) {
          V6avatar = IPv6Configed;
        }
        if (record.conf.indexOf("IPV6AssetRpt") === -1) {
          V6avatar = IPv6NotConfig;
        }
        if (record.conf.indexOf("SckInOut") !== -1) {
          selfCheck = selfCheckConfiged;
        }
        if (record.conf.indexOf("SckInOut") === -1) {
          selfCheck = selfCheckNotConfig;
        }
        return (
          <Space>
            <Tooltip title={language("probers.teprobe.ckInOut")}>
              <img src={Ifweb} style={{ width: "18px", height: "18px" }} />
            </Tooltip>
            <Tooltip title={language("probers.teprobe.vioSrv")}>
              <img src={Sverver} style={{ width: "18px", height: "18px" }} />
            </Tooltip>
            <Tooltip title={language("probers.teprobe.vioDev")}>
              <img src={Assem} style={{ width: "18px", height: "18px" }} />
            </Tooltip>
            <Tooltip title={language("probers.teprobe.IPv6mon")}>
              <img src={V6avatar} style={{ width: "18px", height: "18px" }} />
            </Tooltip>
            <Tooltip title={language("probers.teprobe.probetion.selfCheck")}>
              <img src={selfCheck} style={{ width: "18px", height: "18px" }} />
            </Tooltip>
          </Space>
        );
      },
    },
    {
      title: language("project.temporary.terminal.registTM"),
      dataIndex: "registTM",
      width: 160,
      ellipsis: true,
    },
    {
      title: language("project.mconfig.operate"),
      valueType: "option",
      width: 140,
      align: "center",
      fixed: "right",
      hideInTable: !writable,
      render: (text, record, _, action) => [
        <Popconfirm
          title={language("probers.teprobe.hdprobelist.unloadcontitle")}
          okText={language("project.yes")}
          cancelText={language("project.no")}
          onConfirm={() => {
            let ids = record.id.split(",");
            let sids = record.sid.split(",");
            unLoad(ids, sids);
          }}
        >
          <a>{language("project.temporary.terminal.unload")}</a>
        </Popconfirm>,
        <Popconfirm
          okText={language("project.yes")}
          cancelText={language("project.no")}
          title={language("project.delconfirm")}
          onConfirm={() => {
            delProbe(record);
          }}
        >
          <a>{language("project.del")} </a>
        </Popconfirm>,
        <div className="logExportDiv">
          <a
            onClick={() => {
              logDownload(record);
            }}
          >
            {language("project.evtlog.reportcfg.log")}
          </a>
        </div>,
      ],
    },
  ];

  useEffect(() => {
    getFillter();
  }, []);

  const getFillter = () => {
    post("/cfg.php?controller=probeManage&action=filterAgentProbeList")
      .then((res) => {
        let versionfillter = [];
        let osfillter = [];
        let statefillter = [];
        if (res.data) {
          res.data.map((item) => {
            if (item.filterName == "version") {
              item.info.map((each) => {
                versionfillter.push({ text: each.text, value: each.text });
              });
            } else if (item.filterName == "os") {
              item.info.map((each) => {
                osfillter.push({ text: each.text, value: each.text });
              });
            } else if (item.filterName == "state") {
              item.info.map((each) => {
                statefillter.push({ text: each.text, value: each.id });
              });
            } else {
            }
          });
          columnlist.map((item) => {
            if (item.dataIndex == "version") {
              item.filters = versionfillter;
              item.filterMultiple = false;
            } else if (item.dataIndex == "os") {
              item.filters = osfillter;
              item.filterMultiple = false;
            } else if (item.dataIndex == "state") {
              item.filters = statefillter;
              item.filterMultiple = true;
            } else {
            }
          });
        } else {
        }
        setColumns([...columnlist]);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  /* 探针卸载 */
  const unLoad = (ids, sids) => {
    post("/cfg.php?controller=probeManage&action=agentUninstall", {
      ids: JSON.stringify(ids),
      sids: JSON.stringify(sids),
    })
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        message.success(res.msg);
        setIncID((incID) => incID + 1);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  /* 探针删除 */
  const delProbe = (record) => {
    let data = {};
    data.ids = record.id;
    data.sids = record.sid;
    post("/cfg.php?controller=probeManage&action=agentDelete", data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        message.success(res.msg);
        setIncID((incID) => incID + 1);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  //弹出查询model
  const getModal = (status) => {
    if (status == "open") {
      setModalStatus(true);
    } else {
      formRef.current.resetFields();
      setModalStatus(false);
    }
  };

  const showRestoreModal = (status) => {
    if (status == "open") {
      setRestStatus(true);
    } else {
      restoreRef.current.resetFields();
      setRestStatus(false);
    }
  };

  const searchafter = (
    <Button
      onClick={async () => {
        formRef.current.submit();
      }}
      type="primary"
    >
      {language("project.temporary.terminal.findtext")}
    </Button>
  );

  /* 查询卸载码 */
  const inQuire = () => {
    let obj = formRef.current.getFieldsValue(["requestCode", "uninstallCode"]);
    let data = {};
    data.requestCode = obj.requestCode;
    post("/cfg.php?controller=probeManage&action=getUninstallCode", data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        setTimeout(function () {
          formRef.current.setFieldsValue(res);
        }, 100);
        setRequestNum(res.uninstallCode);
        message.success(res.msg);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  const getRepairCode = () => {
    let obj = restoreRef.current.getFieldsValue(["netrequcode"]);
    let data = {};
    data.recCode = obj.netrequcode;
    post("/cfg.php?controller=probeManage&action=getRepairCode", data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        setTimeout(function () {
          restoreRef.current.setFieldsValue(res);
        }, 100);
        setRequestCode(res.repairNetCode);
        message.success(res.msg);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  return (
    <Spin
      spinning={downLoading}
      tip={language("project.sysdebug.wireshark.loading")}
      indicator={<LoadingOutlined spin />}
    >
      <ProtableModule
        incID={incID}
        rowkey={rowKey}
        tableKey={tableKey}
        columns={columns}
        columnvalue={columnvalue}
        searchText={showSearch()}
        rowSelection={true}
        searchVal={searchVal}
        clientHeight={clientHeight}
        concealColumns={concealColumnList}
        apishowurl={"/cfg.php?controller=probeManage&action=showAgentProbeList"}
        downloadButton={true}
        downloadClick={downloadClick}
        otherOpLeft={showUninstall}
      />
      <ModalForm
        className="probelistModal"
        submitter={false}
        formRef={formRef}
        layout="horizontal"
        {...modalFormLayout}
        title={language("project.temporary.terminal.findload")}
        visible={modalStatus}
        autoFocusFirstInput
        modalProps={{
          maskClosable: false,
          onCancel: () => {
            getModal("close");
          },
        }}
        onVisibleChange={setModalStatus}
        submitTimeout={2000}
        onFinish={async (values) => {
          inQuire();
        }}
      >
        <ProFormText
          label={language("project.temporary.terminal.requestCode")}
          width="200px"
          name="requestCode"
          addonAfter={searchafter}
          rules={[
            {
              required: true,
              message: language("project.fillin"),
            },
            {
              pattern: regList.wordNum.regex,
              message: regList.wordNum.alertText,
            },
          ]}
        />
        <ProFormText
          width="200px"
          name="uninstallCode"
          label={language("project.temporary.terminal.uninstallCode")}
          onChange={(e) => {
            setRequestNum(e.target.value);
          }}
          addonAfter={
            <Button
              onClick={async () => {
                if (requestNum.length > 0) {
                  await navigator.clipboard.writeText(requestNum);
                  message.success(
                    language("project.temporary.terminal.requestNum")
                  );
                } else {
                  message.error(language("probers.teprobe.probelist.nocopy"));
                }
              }}
              type="primary"
            >
              {language("project.temporary.terminal.ctrlc")}
            </Button>
          }
        />
      </ModalForm>
      <ModalForm
        className="probelistModal"
        submitter={false}
        formRef={restoreRef}
        layout="horizontal"
        {...modalFormLayout}
        title={language("probers.teprobe.probelist.netrecoverCode")}
        visible={restStatus}
        autoFocusFirstInput
        modalProps={{
          maskClosable: false,
          onCancel: () => {
            showRestoreModal("close");
          },
        }}
        onVisibleChange={setRestStatus}
        submitTimeout={2000}
        onFinish={async (values) => {
          getRepairCode();
        }}
      >
        <ProFormText
          label={language("probers.teprobe.probelist.netrequcode")}
          width="200px"
          name="netrequcode"
          addonAfter={
            <Button
              type="primary"
              onClick={() => {
                restoreRef.current.submit();
              }}
            >
              {language("project.temporary.terminal.findtext")}
            </Button>
          }
          rules={[
            {
              required: true,
              message: language("project.fillin"),
            },
            {
              pattern: regList.wordNum.regex,
              message: regList.wordNum.alertText,
            },
          ]}
        />
        <ProFormText
          width="200px"
          name="repairNetCode"
          label={language("probers.teprobe.probelist.repairNetCode")}
          onChange={(e) => {
            setRequestCode(e.target.value);
          }}
          addonAfter={
            <Button
              onClick={async () => {
                if (requestCode.length > 0) {
                  await navigator.clipboard.writeText(requestCode);
                  message.success(
                    language("project.temporary.terminal.requestNum")
                  );
                } else {
                  message.error(language("probers.teprobe.probelist.nocopy"));
                }
              }}
              type="primary"
            >
              {language("project.temporary.terminal.ctrlc")}
            </Button>
          }
        />
      </ModalForm>
    </Spin>
  );
};

export default Configuration;
