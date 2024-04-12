import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "umi";
import { ProtableModule } from "@/components/Module";
import { Spin, Space, Input, Modal, Tag, message } from "antd";
import { language } from "@/utils/language";
import { CloseCircleFilled } from "@ant-design/icons";
import download from "@/utils/downnloadfile";
import { post } from "@/services/https";
import "./weakpwd.less";
const { confirm } = Modal;
const { Search } = Input;
const Weakpwd = () => {
  const contentHeight = useSelector(({ app }) => app.contentHeight);
  const clientHeight = contentHeight - 265;
  const columns = [
    {
      title: "ID",
      width: 80,
      dataIndex: "id",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("analyse.resrisk.sysflaw.ip"),
      width: 140,
      dataIndex: "addr",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("analyse.resrisk.riskName"),
      dataIndex: "riskName",
      align: "left",
      width: 200,
      ellipsis: true,
    },
    {
      title: language("analyse.resmap.name"),
      width: 140,
      dataIndex: "devName",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("analyse.resmap.mac"),
      width: 160,
      dataIndex: "mac",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("analyse.resrisk.weakpwd.verifyInfo"),
      width: 140,
      dataIndex: "verifyInfo",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("analyse.resrisk.riskInfo"),
      dataIndex: "riskInfo",
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
  ];

  const concealColumns = {
    id: { show: false },
  };
  const [incID, setIncID] = useState(0);
  const rowKey = (record) => record.id;
  const [queryVal, setQueryVal] = useState("");
  let searchVal = {
    queryVal: queryVal,
  };
  const [downLoading, setDownLoading] = useState(false);
  const showSearch = () => {
    return (
      <Space className="weakpwdSearch">
        <Search
          allowClear
          onSearch={(queryVal) => {
            setQueryVal(queryVal);
            setIncID(incID + 1);
          }}
          placeholder={language("analyse.resrisk.weakpwd.searchText")}
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
        handleDel(selectRecord);
      },
    });
  };

  const handleDel = (record) => {
    let id = record.map((e) => e.id);
    let addrs = record.map((e) => e.addr);
    let data = {};
    data.addrs = addrs.join(";");
    data.id = id.join(";");
    post("/cfg.php?controller=assetMapping&action=delRiskWeakList", data).then(
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

  const downloadClick = () => {
    download(
      "/cfg.php?controller=assetMapping&action=exportRiskWeakList",
      { queryVal: queryVal },
      setDownLoading
    );
  };

  return (
    <Spin spinning={downLoading} tip={language("project.exporting")}>
      <ProtableModule
        columns={columns}
        incID={incID}
        rowkey={rowKey}
        searchVal={searchVal}
        searchText={showSearch()}
        clientHeight={clientHeight}
        tableKey="weakpwdTable"
        columnvalue="weakpwdColumnval"
        apishowurl={"/cfg.php?controller=assetMapping&action=showRiskWeakList"}
        concealColumns={concealColumns}
        delButton={false}
        delClick={delClick}
        downloadButton={true}
        downloadClick={downloadClick}
        rowSelection={false}
      />
    </Spin>
  );
};

export default Weakpwd;
