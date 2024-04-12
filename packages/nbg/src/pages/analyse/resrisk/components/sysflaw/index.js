import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "umi";
import { ProtableModule } from "@/components/Module";
import { fetchAuth } from "@/utils/common";
import { language } from "@/utils/language";
import { post } from "@/services/https";
import "./sysflaw.less";
import {
  Button,
  Input,
  message,
  Radio,
  Space,
  Tag,
  Modal,
  Spin,
  Col,
  Typography,
  Tooltip,
} from "antd";
import OSIcon from "@/nbgUtils/osIconType";
import { assetType } from "@/nbgUtils/nbgAssetsType";
import DetailIcon from "@/assets/images/operate/details.png";
import download from "@/utils/downnloadfile";
import ProTable from "@ant-design/pro-table";
import { CloseCircleFilled, CloseOutlined } from "@ant-design/icons";
import {
  ProForm,
  DrawerForm,
  ProCard,
  ProFormItem,
} from "@ant-design/pro-components";
import { drawFormLayout } from "@/utils/helper";
const { confirm } = Modal;
const { Search } = Input;
const SysFlaw = () => {
  const contentHeight = useSelector(({ app }) => app.contentHeight);
  const clientHeight = contentHeight - 265;
  const writable = fetchAuth();
  const [drawLabel, setDrawLabel] = useState([]);
  const [drawValue, setDrawValue] = useState({});
  const [ipDrawLabel, setIPDrawLabel] = useState([]);
  const [ipDrawValue, setIPDrawValue] = useState({});
  const [reloadCol, setReloadCol] = useState(0);
  const listColumns = [
    {
      title: "ID",
      width: 80,
      dataIndex: "id",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("analyse.resrisk.addr"),
      width: 130,
      dataIndex: "addr",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("analyse.resrisk.sysflaw.riskName"),
      dataIndex: "riskName",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("analyse.resrisk.sysflaw.riskid"),
      width: 160,
      dataIndex: "riskid",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("analyse.resrisk.sysflaw.riskCveId"),
      width: 130,
      dataIndex: "riskCveId",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("analyse.resrisk.sysflaw.riskType"),
      width: 100,
      dataIndex: "riskType",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("analyse.resrisk.sysflaw.level"),
      width: 120,
      dataIndex: "level",
      align: "center",
      ellipsis: true,
      filterMultiple: false,
      filters: [
        {
          text: language("analyse.resrisk.level.low"),
          value: 1,
        },
        {
          text: language("analyse.resrisk.level.intermediate"),
          value: 2,
        },
        {
          text: language("analyse.resrisk.level.high"),
          value: 3,
        },
        {
          text: language("analyse.resrisk.level.serious"),
          value: 4,
        },
      ],
      render: (text, record) => {
        return renderLevel(record.level);
      },
    },
    {
      title: language("project.analyse.illout.host"),
      width: 140,
      dataIndex: "devName",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("project.analyse.illout.mac"),
      width: 160,
      dataIndex: "mac",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("analyse.resrisk.findTM"),
      width: 160,
      dataIndex: "findTM",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("analyse.resrisk.sysflaw.riskInfo"),
      width: 140,
      dataIndex: "riskInfo",
      align: "left",
      ellipsis: true,
      hideInTable: true,
    },
    {
      title: language("project.operate"),
      valueType: "option",
      width: 80,
      align: "center",
      fixed: "right",
      hideInTable: !writable,
      render: (text, record, _, action) => [
        <div className="operateDiv">
          <Button
            size="small"
            type="text"
            onClick={() => {
              let list = listColumns.slice(1, -1);
              setDrawLabel(list);
              setDrawValue(record);
              showDraw("open");
            }}
          >
            <img src={DetailIcon} />
          </Button>
        </div>,
      ],
    },
  ];

  const IPColumns = [
    {
      title: "ID",
      width: 80,
      dataIndex: "id",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("analyse.resrisk.addr"),
      width: 130,
      dataIndex: "addr",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("analyse.resrisk.sysflaw.risknum"),
      width: 80,
      dataIndex: "risknum",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("project.analyse.illout.mac"),
      width: 160,
      dataIndex: "mac",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("project.analyse.illout.host"),
      width: 120,
      dataIndex: "devName",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("monitor.mapping.asstypeList.searchText"),
      width: 140,
      dataIndex: "type",
      align: "left",
      ellipsis: true,
      render: (text, record, _, action) => {
        return [
          <Tooltip title={record.type} placement="topLeft">
            <div style={{ display: "flex", alignItems: "center" }}>
              {assetType(record.icon)}
              <div className="typeText">{record.type}</div>
            </div>
          </Tooltip>,
        ];
      },
    },
    {
      title: language("monitor.mapping.fingerprint.os"),
      width: 140,
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
      title: language("project.sysconf.analysis.app"),
      dataIndex: "app",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("analyse.resrisk.sysflaw.switchIP"),
      width: 140,
      dataIndex: "switchIP",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("analyse.resrisk.sysflaw.switchINF"),
      width: 120,
      dataIndex: "switchINF",
      align: "left",
      ellipsis: true,
    },
    {
      title: "VLAN",
      width: 80,
      dataIndex: "VLAN",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("project.operate"),
      valueType: "option",
      width: 80,
      align: "center",
      fixed: "right",
      hideInTable: !writable,
      render: (text, record, _, action) => [
        <div className="operateDiv">
          <Button
            size="small"
            type="text"
            onClick={() => {
              viewOnExpand(true, record);
              let list = IPColumns.slice(1, -1);
              setIPDrawLabel(list);
              setIPDrawValue(record);
              showIPDraw("open");
            }}
          >
            <img src={DetailIcon} />
          </Button>
        </div>,
      ],
    },
  ];

  const expandIpCol = [
    {
      title: "ID",
      width: 80,
      dataIndex: "id",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("analyse.resrisk.sysflaw.riskName"),
      width: 200,
      dataIndex: "riskName",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("analyse.resrisk.sysflaw.riskid"),
      width: 180,
      dataIndex: "riskid",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("analyse.resrisk.sysflaw.riskCveId"),
      width: 160,
      dataIndex: "riskCveId",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("analyse.resrisk.sysflaw.riskType"),
      width: 140,
      dataIndex: "riskType",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("analyse.resrisk.sysflaw.level"),
      width: 90,
      dataIndex: "level",
      align: "center",
      ellipsis: true,
      render: (text, record) => {
        return renderLevel(record.level);
      },
    },
    {
      title: language("analyse.resrisk.findTM"),
      width: 140,
      dataIndex: "findTM",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("analyse.resrisk.sysflaw.riskInfo"),
      // width: 160,
      dataIndex: "riskInfo",
      align: "left",
      ellipsis: true,
    },
  ];

  const flawColumns = [
    {
      title: "ID",
      width: 80,
      dataIndex: "id",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("analyse.resrisk.sysflaw.riskName"),
      width: 180,
      dataIndex: "riskName",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("analyse.resrisk.sysflaw.ipsnum"),
      width: 80,
      dataIndex: "ipsnum",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("analyse.resrisk.sysflaw.riskid"),
      width: 180,
      dataIndex: "riskid",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("analyse.resrisk.sysflaw.riskCveId"),
      width: 160,
      dataIndex: "riskCveId",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("analyse.resrisk.sysflaw.level"),
      width: 120,
      dataIndex: "level",
      align: "center",
      ellipsis: true,
      filterMultiple: false,
      filters: [
        {
          text: language("analyse.resrisk.level.low"),
          value: 1,
        },
        {
          text: language("analyse.resrisk.level.intermediate"),
          value: 2,
        },
        {
          text: language("analyse.resrisk.level.high"),
          value: 3,
        },
        {
          text: language("analyse.resrisk.level.serious"),
          value: 4,
        },
      ],
      render: (text, record) => {
        return renderLevel(record.level);
      },
    },
    {
      title: language("analyse.resrisk.sysflaw.riskInfo"),
      // width: 160,
      dataIndex: "riskInfo",
      align: "left",
      ellipsis: true,
    },
  ];

  const expandFlawCol = [
    {
      title: language("analyse.resrisk.addr"),
      dataIndex: "addr",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("project.analyse.illout.mac"),
      dataIndex: "mac",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("project.analyse.illout.host"),
      dataIndex: "devName",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("monitor.mapping.asstypeList.searchText"),
      dataIndex: "type",
      align: "left",
      ellipsis: true,
      render: (text, record, _, action) => {
        return [
          <Tooltip title={record.type} placement="topLeft">
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="typeIcon">{assetType(record.icon)}</div>
              <div className="typeText">{record.type}</div>
            </div>
          </Tooltip>,
        ];
      },
    },
    {
      title: language("monitor.mapping.fingerprint.os"),
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
  ];

  const concealColumns = {
    id: { show: false },
  };
  const [incID, setIncID] = useState(0);
  const [IPIncID, setIPIncID] = useState(0);
  const [flawIncID, setFlawIncID] = useState(0);
  const rowKey = (record) => record.id;
  const [queryVal, setQueryVal] = useState("");
  let searchVal = {
    queryVal: queryVal,
  };
  const [ipQueryVal, setIpQueryVal] = useState("");
  let IPSearchVal = {
    queryVal: ipQueryVal,
  };
  const [flawQueryVal, setFlawQueryVal] = useState("");
  let flawSearchVal = {
    queryVal: flawQueryVal,
  };
  const [type, setType] = useState(1);
  const [expandData, setExpandData] = useState({ 0: [] });
  const [detailData, setDatailData] = useState([]);
  const [expandLoading, setExpandLoading] = useState(false);
  const [downLoading, setDownLoading] = useState(false);
  const drawformRef = useRef();
  const [drawState, setDrawState] = useState(false);
  const IPDrawformRef = useRef();
  const [ipDrawState, setIPDrawState] = useState(false);

  const showSearch = () => {
    return (
      <Space className="listSearch">
        <Radio.Group
          className="reskSeletBut"
          options={[
            { label: language("analyse.resrisk.sysflaw.list"), value: 1 },
            { label: language("analyse.resrisk.sysflaw.asset"), value: 2 },
            { label: language("analyse.resrisk.sysflaw.flaw"), value: 3 },
          ]}
          optionType="button"
          onChange={(e) => {
            setType(e.target.value);
            if ((e.target.value = 1)) {
              setIncID((incID) => incID + 1);
            } else if ((e.target.value = 1)) {
              setIPIncID((IPIncID) => IPIncID + 1);
            } else {
              setFlawIncID((flawIncID) => flawIncID + 1);
            }
            setReloadCol((reloadCol) => reloadCol + 1);
          }}
          value={type}
        />
        <Search
          allowClear
          width={400}
          onSearch={(queryVal) => {
            setQueryVal(queryVal);
            setIncID(incID + 1);
          }}
          placeholder={language("analyse.resrisk.sysflaw.list.searchText")}
        />
      </Space>
    );
  };

  const showIPSearch = () => {
    return (
      <Space className="IPSearch">
        <Radio.Group
          className="reskSeletBut"
          options={[
            { label: language("analyse.resrisk.sysflaw.list"), value: 1 },
            { label: language("analyse.resrisk.sysflaw.asset"), value: 2 },
            { label: language("analyse.resrisk.sysflaw.flaw"), value: 3 },
          ]}
          optionType="button"
          onChange={(e) => {
            setType(e.target.value);
            if ((e.target.value = 1)) {
              setIncID((incID) => incID + 1);
            } else if ((e.target.value = 1)) {
              setIPIncID((IPIncID) => IPIncID + 1);
            } else {
              setFlawIncID((flawIncID) => flawIncID + 1);
            }
            setReloadCol((reloadCol) => reloadCol + 1);
          }}
          value={type}
        />
        <Search
          allowClear
          onSearch={(queryVal) => {
            setIpQueryVal(queryVal);
            setIPIncID((IPIncID) => IPIncID + 1);
          }}
          placeholder={language("analyse.resrisk.sysflaw.ip.searchText")}
        />
      </Space>
    );
  };

  const showFlawSearch = () => {
    return (
      <Space className="portOpenSearch">
        <Radio.Group
          className="reskSeletBut"
          options={[
            { label: language("analyse.resrisk.sysflaw.list"), value: 1 },
            { label: language("analyse.resrisk.sysflaw.asset"), value: 2 },
            { label: language("analyse.resrisk.sysflaw.flaw"), value: 3 },
          ]}
          optionType="button"
          onChange={(e) => {
            setType(e.target.value);
            if ((e.target.value = 1)) {
              setIncID((incID) => incID + 1);
            } else if ((e.target.value = 1)) {
              setIPIncID((IPIncID) => IPIncID + 1);
            } else {
              setFlawIncID((flawIncID) => flawIncID + 1);
            }
            setReloadCol((reloadCol) => reloadCol + 1);
          }}
          value={type}
        />
        <Search
          allowClear
          placeholder={language("analyse.resrisk.sysflaw.flaw.searchText")}
          onSearch={(queryVal) => {
            setFlawQueryVal(queryVal);
            setFlawIncID((flawIncID) => flawIncID + 1);
          }}
        />
      </Space>
    );
  };

  //批量删除
  const delClick = (selectedRowKeys, dataList, selectRecord) => {
    const sum = selectedRowKeys.length;
    confirm({
      icon: <CloseCircleFilled style={{ color: "red" }} />,
      title: language("nbg.suretodelect"),
      content: language("project.cancelcon", { sum: sum }),
      className: "delModal",
      okType: "danger",
      onOk() {
        if (type === 1) {
          delList(selectRecord);
        } else if (type === 2) {
          delIp(selectRecord);
        } else if (type === 3) {
          delFlaw(selectRecord);
        }
      },
    });
  };

  const delList = (selectRecord) => {
    let ids = selectRecord.map((e) => e.id);
    let addrs = selectRecord.map((e) => e.addr);
    let riskids = selectRecord.map((e) => e.riskid);
    let data = {};
    data.ids = ids.join(";");
    data.addrs = addrs.join(";");
    data.riskids = riskids.join(";");
    post("/cfg.php?controller=assetMapping&action=delRiskVulList", data).then(
      (res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        message.success(res.msg);
        setIncID((incID) => incID + 1);
      }
    );
  };

  const delIp = (selectRecord) => {
    let addrs = selectRecord.map((e) => e.addr);
    let data = {};
    data.addrs = addrs.join(";");
    post("/cfg.php?controller=assetMapping&action=delRiskVulIPs", data).then(
      (res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        message.success(res.msg);
        setIPIncID((IPIncID) => IPIncID + 1);
      }
    );
  };

  const delFlaw = (selectRecord) => {
    let riskids = selectRecord.map((e) => e.riskid);
    let data = {};
    data.riskids = riskids.join(";");
    post("/cfg.php?controller=assetMapping&action=delRiskVulVuls", data).then(
      (res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        message.success(res.msg);
        setFlawIncID((flawIncID) => flawIncID + 1);
      }
    );
  };

  const viewOnExpand = (expanded, record) => {
    if (expanded) {
      setExpandLoading(true);
      post("/cfg.php?controller=assetMapping&action=showRiskVulsByIP", {
        addr: record.addr,
      }).then((res) => {
        if (!res.success) {
          setExpandLoading(false);
          message.error(res.msg);
          return false;
        }
        setExpandLoading(false);
        let list = { ...expandData };
        list[record.id] = res.data;
        setExpandData(list);
        setDatailData(res.data);
      });
    } else {
      setIPIncID((IPIncID) => IPIncID + 1);
    }
  };

  const flawOnExpand = (expanded, record) => {
    if (expanded) {
      setExpandLoading(true);
      post("/cfg.php?controller=assetMapping&action=showRiskIPByVul", {
        riskid: record.riskid,
      }).then((res) => {
        if (!res.success) {
          setExpandLoading(false);
          message.error(res.msg);
          return false;
        }
        setExpandLoading(false);
        let list = { ...expandData };
        list[record.id] = res.data;
        setExpandData(list);
        setDatailData(res.data);
      });
    } else {
      setFlawIncID((flawIncID) => flawIncID + 1);
    }
  };

  const downloadClick = () => {
    if (type === 1) {
      download(
        "/cfg.php?controller=assetMapping&action=exportRiskVulList",
        { queryVal: queryVal },
        setDownLoading
      );
    } else if (type === 2) {
      download(
        "/cfg.php?controller=assetMapping&action=exportRiskVulIPs",
        { queryVal: ipQueryVal },
        setDownLoading
      );
    } else if (type === 3) {
      download(
        "/cfg.php?controller=assetMapping&action=exportRiskVulVuls",
        { queryVal: flawQueryVal },
        setDownLoading
      );
    }
  };

  const showDraw = (state) => {
    if (state == "open") {
      setDrawState(true);
    } else {
      drawformRef.current.resetFields();
      setDrawLabel([]);
      setDrawValue({});
      setDrawState(false);
    }
  };

  const showIPDraw = (state) => {
    if (state == "open") {
      setIPDrawState(true);
    } else {
      IPDrawformRef.current.resetFields();
      setIPDrawLabel([]);
      setIPDrawValue({});
      setIPDrawState(false);
    }
  };

  const expandedRowRender = (value) => {
    return (
      <div>
        <ProTable
          columns={type === 2 ? expandIpCol : expandFlawCol}
          className="expandTable"
          headerTitle={false}
          dataSource={expandData[value.id]}
          search={false}
          loading={expandLoading}
          options={false}
          pagination={false}
          bordered={true}
          tableAlertRender={false}
        />
      </div>
    );
  };

  const renderLevel = (level) => {
    if (level == 1) {
      return <Tag color="blue">{language("analyse.resrisk.level.low")}</Tag>;
    } else if (level == 2) {
      return (
        <Tag color="gold">{language("analyse.resrisk.level.intermediate")}</Tag>
      );
    } else if (level == 3) {
      return (
        <Tag color="volcano">{language("analyse.resrisk.level.high")}</Tag>
      );
    } else if (level == 4) {
      return <Tag color="red">{language("analyse.resrisk.level.serious")}</Tag>;
    } else {
      return "--";
    }
  };

  return (
    <div
      id="sysflawContain"
      style={{
        position: "relative",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <ProCard
        ghost
        className="sysflawDiv"
        style={{ height: clientHeight + 195 }}
      >
        <Spin spinning={downLoading} tip={language("project.exporting")}>
          {type == 1 ? (
            <ProtableModule
              columns={listColumns}
              incID={incID}
              rowkey={rowKey}
              searchVal={searchVal}
              searchText={showSearch()}
              clientHeight={clientHeight}
              tableKey="resriskSysFlaw"
              columnvalue="resriskFlawColumnval"
              concealColumns={concealColumns}
              rowSelection={false}
              delButton={false}
              downloadButton={true}
              downloadClick={downloadClick}
              delClick={delClick}
              apishowurl={
                "/cfg.php?controller=assetMapping&action=showRiskVulList"
              }
            />
          ) : type === 2 ? (
            <ProtableModule
              columns={IPColumns}
              reloadCol={reloadCol}
              incID={IPIncID}
              rowkey={rowKey}
              searchVal={IPSearchVal}
              searchText={showIPSearch()}
              clientHeight={clientHeight}
              tableKey="riskFlawIPTable"
              columnvalue="riskFlawIPColumnval"
              concealColumns={concealColumns}
              rowSelection={false}
              delButton={false}
              downloadButton={true}
              downloadClick={downloadClick}
              delClick={delClick}
              apishowurl={
                "/cfg.php?controller=assetMapping&action=showRiskVulIPs"
              }
              expandAble={{
                expandedRowRender,
                columnWidth: 32,
              }}
              isExpand={true}
              viewOnExpand={viewOnExpand}
            />
          ) : (
            <ProtableModule
              columns={flawColumns}
              reloadCol={reloadCol}
              incID={flawIncID}
              rowkey={rowKey}
              searchVal={flawSearchVal}
              searchText={showFlawSearch()}
              clientHeight={clientHeight}
              tableKey="riskFlawTable"
              columnvalue="riskFlawColumnval"
              concealColumns={concealColumns}
              rowSelection={false}
              delButton={false}
              delClick={delClick}
              apishowurl={
                "/cfg.php?controller=assetMapping&action=showRiskVulVuls"
              }
              expandAble={{
                expandedRowRender,
                columnWidth: 32,
              }}
              downloadButton={true}
              downloadClick={downloadClick}
              isExpand={true}
              viewOnExpand={flawOnExpand}
            />
          )}
        </Spin>
        <DrawerForm
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 10 }}
          width={450}
          layout="horizontal"
          title={language("analyse.resrisk.sysflaw.drawTitle")}
          formRef={drawformRef}
          className="falwListDraw"
          drawerProps={{
            placement: "right",
            closable: false,
            getContainer: false,
            style: {
              position: "absolute",
            },
            width: 450,
            extra: (
              <div>
                <span
                  onClick={() => {
                    showDraw("close");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <CloseOutlined />
                </span>
              </div>
            ),
          }}
          autoFocusFirstInput
          submitTimeout={2000}
          visible={drawState}
          onVisibleChange={setDrawState}
          submitter={false}
          onFinish={(value) => {
            return true;
          }}
        >
          <ProFormItem label={language("analyse.resrisk.addr")} name="addr">
            {drawValue.addr ? drawValue.addr : "--"}
          </ProFormItem>
          <ProFormItem
            label={language("analyse.resrisk.sysflaw.level")}
            name="level"
          >
            {renderLevel(drawValue.level)}
          </ProFormItem>
          <ProFormItem
            label={language("analyse.resrisk.sysflaw.riskName")}
            name="riskName"
          >
            {drawValue.riskName ? drawValue.riskName : "--"}
          </ProFormItem>
          <ProFormItem
            label={language("analyse.resrisk.sysflaw.riskid")}
            name="riskid"
          >
            {drawValue.riskid ? drawValue.riskid : "--"}
          </ProFormItem>
          <ProFormItem
            label={language("analyse.resrisk.sysflaw.riskCveId")}
            name="riskCveId"
          >
            {drawValue.riskCveId ? drawValue.riskCveId : "--"}
          </ProFormItem>
          <ProFormItem
            label={language("analyse.resrisk.sysflaw.riskType")}
            name="riskType"
          >
            {drawValue.riskType ? drawValue.riskType : "--"}
          </ProFormItem>
          <ProFormItem
            label={language("project.analyse.illout.host")}
            name="riskType"
          >
            {drawValue.devName ? drawValue.devName : "--"}
          </ProFormItem>
          <ProFormItem
            label={language("project.analyse.illout.mac")}
            name="findTM"
          >
            {drawValue.mac ? drawValue.mac : "--"}
          </ProFormItem>
          <ProFormItem label={language("analyse.resrisk.findTM")} name="findTM">
            {drawValue.findTM ? drawValue.findTM : "--"}
          </ProFormItem>
          <ProFormItem
            label={language("analyse.resrisk.sysflaw.verify")}
            name="verify"
          >
            {drawValue.verify ? drawValue.verify : "--"}
          </ProFormItem>
          <div className="riskInfoDiv">
            <ProFormItem
              label={language("analyse.resrisk.sysflaw.riskInfo")}
              name="riskInfo"
            >
              {drawValue.riskInfo ? drawValue.riskInfo : "--"}
            </ProFormItem>
          </div>
        </DrawerForm>
        <DrawerForm
          title={language("analyse.resrisk.sysflaw.drawTitle")}
          width={740}
          {...drawFormLayout}
          drawerProps={{
            placement: "right",
            closable: false,
            getContainer: false,
            style: {
              position: "absolute",
            },
            width: 740,
            extra: (
              <div>
                <span
                  onClick={() => {
                    showIPDraw("close");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <CloseOutlined />
                </span>
              </div>
            ),
          }}
          formRef={IPDrawformRef}
          autoFocusFirstInput
          submitTimeout={2000}
          visible={ipDrawState}
          onVisibleChange={setIPDrawState}
          submitter={false}
          onFinish={(value) => {
            return true;
          }}
        >
          <ProCard ghost direction="column">
            <ProCard ghost>
              <Col>
                <ProForm
                  className="IPDrawInfo"
                  layout="inline"
                  submitter={false}
                >
                  <ProFormItem label={language("analyse.resrisk.addr")}>
                    {ipDrawValue.addr ? ipDrawValue.addr : "--"}
                  </ProFormItem>
                  <ProFormItem
                    label={language("analyse.resrisk.sysflaw.risknum")}
                  >
                    {ipDrawValue.risknum ? ipDrawValue.risknum : "--"}
                  </ProFormItem>
                  <ProFormItem label={language("project.analyse.illout.mac")}>
                    {ipDrawValue.mac ? ipDrawValue.mac : "--"}
                  </ProFormItem>
                  <ProFormItem label={language("analyse.resmap.name")}>
                    {ipDrawValue.devName ? ipDrawValue.devName : "--"}
                  </ProFormItem>
                  <ProFormItem
                    label={language("monitor.mapping.asstypeList.searchText")}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div className="typeIcon">
                        {assetType(ipDrawValue.icon)}
                      </div>
                      <div className="typeText">{ipDrawValue.type}</div>
                    </div>
                  </ProFormItem>
                  <ProFormItem
                    label={language("monitor.mapping.fingerprint.os")}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {OSIcon(ipDrawValue.os)}
                      <div className="typeText">{ipDrawValue.os}</div>
                    </div>
                  </ProFormItem>
                  <ProFormItem label={"VLAN"}>
                    {ipDrawValue.VLAN ? ipDrawValue.VLAN : "--"}
                  </ProFormItem>
                  <ProFormItem
                    label={language("analyse.resrisk.sysflaw.switchIP")}
                  >
                    {ipDrawValue.switchIP ? ipDrawValue.switchIP : "--"}
                  </ProFormItem>
                  <ProFormItem
                    label={language("analyse.resrisk.sysflaw.switchINF")}
                  >
                    {ipDrawValue.switchINF ? ipDrawValue.switchINF : "--"}
                  </ProFormItem>
                  <ProFormItem label={language("project.sysconf.analysis.app")}>
                    <div className="appDiv">
                      {ipDrawValue.app ? ipDrawValue.app : "--"}
                    </div>
                  </ProFormItem>
                </ProForm>
              </Col>
            </ProCard>
            <ProCard
              title={
                language("analyse.resrisk.sysflaw.flawInfo") +
                "（" +
                detailData.length +
                "）"
              }
              ghost
              className="flawCard"
              direction="column"
            >
              {detailData.map((item) => {
                return (
                  <ProCard
                    ghost
                    style={{
                      paddingBottom: 12,
                    }}
                  >
                    <ProForm
                      className="IPDrawItemInfo"
                      layout="inline"
                      submitter={false}
                    >
                      <div className="riskNameDiv">
                        <ProFormItem
                          label={language("analyse.resrisk.sysflaw.riskName")}
                          name="riskName"
                        >
                          <div className="noWrapDiv nameInfoDiv">
                            {item.riskName ? item.riskName : "--"}
                          </div>
                        </ProFormItem>
                      </div>
                      <ProFormItem
                        label={language("analyse.resrisk.sysflaw.riskid")}
                        name="riskid"
                      >
                        <div className="noWrapDiv">
                          {item.riskid ? item.riskid : "--"}
                        </div>
                      </ProFormItem>
                      <ProFormItem
                        label={language("analyse.resrisk.sysflaw.riskCveId")}
                        name="riskCveId"
                      >
                        <div className="noWrapDiv">
                          {item.riskCveId ? item.riskCveId : "--"}
                        </div>
                      </ProFormItem>
                      <ProFormItem
                        label={language("analyse.resrisk.sysflaw.riskType")}
                        name="riskType"
                      >
                        <div className="noWrapDiv">
                          {item.riskType ? item.riskType : "--"}
                        </div>
                      </ProFormItem>
                      <ProFormItem
                        label={language("analyse.resrisk.sysflaw.level")}
                        name="level"
                      >
                        <div className="noWrapDiv">
                          {renderLevel(item.level)}
                        </div>
                      </ProFormItem>
                      <ProFormItem
                        label={language("analyse.resrisk.findTM")}
                        name="findTM"
                        style={{ width: 300 }}
                      >
                        <div className="noWrapDiv">
                          {item.findTM ? item.findTM : "--"}
                        </div>
                      </ProFormItem>
                      <ProFormItem
                        label={language("analyse.resrisk.sysflaw.verify")}
                        name="verify"
                        style={{ width: "95%" }}
                      >
                        {item.verify ? item.verify : "--"}
                      </ProFormItem>
                      <div className="autoHeightDiv">
                        <ProFormItem
                          label={language("analyse.resrisk.sysflaw.riskInfo")}
                          name="riskInfo"
                          style={{ width: "95%" }}
                        >
                          <div className="wrapDiv">
                            {item.riskInfo ? item.riskInfo : "--"}
                          </div>
                        </ProFormItem>
                      </div>
                    </ProForm>
                  </ProCard>
                );
              })}
            </ProCard>
          </ProCard>
        </DrawerForm>
      </ProCard>
    </div>
  );
};

export default SysFlaw;
