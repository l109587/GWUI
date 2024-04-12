import React, { useRef, useState, useEffect, useReducer } from "react";
import ProCard from "@ant-design/pro-card";
import { post, get, postAsync } from "@/services/https";
import { Space, message, Tag, Tooltip, Input, Spin, Modal } from "antd";
import { ProTable } from "@ant-design/pro-components";
import { CloseCircleFilled } from "@ant-design/icons";
import "@/utils/box.less";
import "./index.less";
import store, { set } from "store";
import ProxyServicesImg from "@/assets/images/analyse/analys-illser-proxyservices.svg";
import LocationImg from "@/assets/images/analyse/nbg-analyse-illsvr-location.svg";
import AnonyouServicesImg from "@/assets/images/analyse/analys-illser-anonyouservices.svg";
import RemoteServesImg from "@/assets/images/analyse/analys-illser-remote.svg";
import AnonSummaryImg from "@/assets/images/analyse/analys-illser-anonsummary.svg";
import ProxySummaryImg from "@/assets/images/analyse/analys-illser-proxysummary.svg";
import RemoteSummaryImg from "@/assets/images/analyse/analys-illser-remotesummary.svg";
import LocationSummaryImg from "@/assets/images/analyse/analys-illser-locationsummary.svg";
import { language } from "@/utils/language";
import ProtableModule from "@/components/Module/ProtableModule";
import { Resizable } from "react-resizable";
import { fetchAuth } from "@/utils/common";
import download from "@/utils/downnloadfile";
import { useSelector } from "umi";
const { Search } = Input;
const { confirm } = Modal;


// 调整table表头
const ResizeableTitle = (props) => {
  let resizing = false;
  const { onResize, width, onClick, ...restProps } = props;
  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      onResizeStart={() => {
        resizing = true;
      }}
      onResizeStop={() => {
        resizing = true;
        setTimeout(() => {
          resizing = false;
        }, 100);
      }}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th
        {...restProps}
        onClick={(...args) => {
          if (!resizing && onClick) {
            onClick(...args);
          }
        }}
      />
    </Resizable>
  );
};

export default () => {
  const contentHeight = useSelector(({ app }) => app.contentHeight);
  let clientHeight = contentHeight - 388;
  const [typeValue, setTypeValue] = useState([]);
  const [typeFilters, setTypeFilters] = useState([]);
  const [onlineValue, setOnlineValue] = useState([]);
  const [onlineFilters, setOnlineFilters] = useState([]);
  const columnslist = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
      align: "center",
      key: "id",
    },
    {
      title: language("project.analyse.status"),
      dataIndex: "online",
      align: "center",
      key: "online",
      width: 100,
      filteredValue: onlineValue,
      filterMultiple: false,
      filters: onlineFilters,
      render: (text, record, index) => {
        let color = " ";
        if (text == "0") {
          color = "purple";
          text = language("analyse.illinn.done");
        } else if (text == "1") {
          color = "orange";
          text = language("analyse.illinn.firfind");
        } else if (text == "2") {
          color = "red";
          text = language("analyse.illinn.finds");
        }
        return (
          <Space>
            <Tag style={{ marginRight: 0 }} color={color} key={record.online}>
              {text}
            </Tag>
          </Space>
        );
      },
    },
    {
      width: 100,
      title: language("project.analyse.illout.host"),
      dataIndex: "devName",
      ellipsis: true,
      key: "devName",
    },
    {
      width: 130,
      title: language("analyse.illsvr.addr"),
      dataIndex: "addr",
      ellipsis: true,
      key: "addr",
      sorter: true,
    },
    {
      title: language("analyse.illsvr.mac"),
      width: 160,
      dataIndex: "mac",
      ellipsis: true,
      key: "mac",
    },
    {
      title: language("analyse.illsvr.port"),
      dataIndex: "port",
      width: 80,
      ellipsis: true,
      key: "port",
      sorter: true,
    },
    {
      title: language("project.analyse.illinn.info"),
      width: 660,
      dataIndex: "type",
      key: "type",
      ellipsis: true,
      filterMultiple: false,
      filters: typeFilters,
      filteredValue: typeValue,
      render: (text, record, index) => {
        if (record.info.type == "anon") {
          return (
            <div className="infobox">
              <Tag color="#FAAD15">
                <img
                  src={AnonyouServicesImg}
                  className="infostyle"
                  style={{ marginRight: -2 }}
                />{" "}
                <span className="infotext">
                  {language("analyse.illsvr.anonser")}
                </span>
              </Tag>
              <Tag color="cyan">{record.info.basic}</Tag>
              {record.info.detail != "" ? (
                <Tooltip
                  getPopupContainer={() => document.getElementById("tableDiv")}
                  title={record.info.detail}
                  placement="topLeft"
                >
                  <Tag color="volcano">{record.info.detail}</Tag>
                </Tooltip>
              ) : (
                <></>
              )}
            </div>
          );
        } else if (record.info.type == "proxy") {
          return (
            <div className="infobox">
              <Tag style={{ textAlign: "center" }} color="#BD3124">
                <img src={ProxyServicesImg} className="infostyle" />
                <span className="infotext">
                  {language("analyse.illsvr.proxyser")}
                </span>
              </Tag>
              <Tag color="cyan">{record.info.basic}</Tag>
              {record.info.detail != "" ? (
                <Tooltip
                  getPopupContainer={() => document.getElementById("tableDiv")}
                  title={record.info.detail}
                  placement="topLeft"
                >
                  <Tag color="volcano">{record.info.detail}</Tag>
                </Tooltip>
              ) : (
                <></>
              )}
            </div>
          );
        } else if (record.info.type == "remote") {
          return (
            <div className="infobox">
              <Tag color="#FF7429">
                {" "}
                <img src={RemoteServesImg} className="infostyle" />
                <sapn className="infotext">
                  {language("analyse.illsvr.remoteser")}
                </sapn>
              </Tag>
              <Tag color="cyan">{record.info.basic}</Tag>
              {record.info.detail != "" ? (
                <Tooltip
                  getPopupContainer={() => document.getElementById("tableDiv")}
                  title={record.info.detail}
                  placement="topLeft"
                >
                  <Tag color="volcano">{record.info.detail}</Tag>
                </Tooltip>
              ) : (
                <></>
              )}
            </div>
          );
        } else {
          return (
            <div className="infobox">
              <Tag style={{ textAlign: "center" }} color="#79B8F3">
                <img src={LocationImg} className="infostyle" />
                <span className="infotext">
                  {language("analyse.illsvr.locationser")}
                </span>
              </Tag>
              <Tag color="cyan">{record.info.basic}</Tag>
              {record.info.detail != "" ? (
                <Tooltip
                  getPopupContainer={() => document.getElementById("tableDiv")}
                  title={record.info.detail}
                  placement="topLeft"
                >
                  <Tag color="volcano">{record.info.detail}</Tag>
                </Tooltip>
              ) : (
                <></>
              )}
            </div>
          );
        }
      },
    },
    {
      title: language("project.analyse.series.lasttime"),
      dataIndex: "lastTM",
      ellipsis: true,
      key: "lastTM",
    },
    {
      title: language("project.analyse.series.firstime"),
      width: 180,
      dataIndex: "firstTM",
      ellipsis: true,
      key: "firstTM",
    },
  ];
  const concealColumns = {
    id: { show: false },
  };
  const tableKey = "illsvr";
  const columnvalue = "svrcolumnvalue";
  const apiShowUrl = "/cfg.php?controller=assetMapping&action=showVioService";
  let downloadButton = true;

  const [incID, setIncID] = useState(0);
  const [anoncount, setAnoncount] = useState([]);
  const [proxycount, setProxycount] = useState([]);
  const [remotecount, setRemotecount] = useState([]);
  const [addrcount, setAddrcount] = useState([]);
  const [cols, setCols] = useState(columnslist);
  const [columns, setColumns] = useState([]);
  const [downLoading, setDownLoading] = useState(false);
  const [queryVal, setQueryVal] = useState(null);
  const [isToday, setIsToday] = useState("");
  const [filterValue, setFilterValue] = useState({});

  useEffect(() => {
    setCols(columnslist);
    setColumns(cols);
  }, [typeValue, onlineValue]);

  // 处理拖拽
  const handleResize =
    (index) =>
    (e, { size }) => {
      const nextColumns = [...cols];
      // 拖拽时调整宽度
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width < 75 ? 75 : size.width,
      };
      setCols(nextColumns);
    };

  useEffect(() => {
    setColumns(
      (cols || []).map((col, index) => ({
        ...col,
        onHeaderCell: (column) => ({
          width: column.width,
          onResize: handleResize(index),
        }),
      }))
    );
  }, [cols]);

  // 定义头部组件
  const components = {
    header: {
      cell: ResizeableTitle,
    },
  };

  let searchVal = {
    value: queryVal,
    type: "fuzzy",
    isToday: isToday,
  };

  useEffect(() => {
    getSummary();
    getFillter();
  }, []);

  const showSearch = () => {
    return (
      <Search
        placeholder={language("analyse.illsvr.searchText")}
        style={{ width: 200 }}
        className="illsvrSearch"
        allowClear
        onSearch={(queryVal) => {
          setQueryVal(queryVal);
          setIncID((incID) => incID + 1);
        }}
      />
    );
  };

  /* 顶部概要数据 */
  const getSummary = () => {
    post("/cfg.php?controller=assetMapping&action=showVioSrvSummary")
      .then((res) => {
        setAnoncount(res.anon);
        setProxycount(res.proxy);
        setRemotecount(res.remote);
        setAddrcount(res.addr);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  const getFillter = (info) => {
    post("/cfg.php?controller=assetMapping&action=filterVioService")
      .then((res) => {
        let onlinefillter = [];
        let typefillter = [];
        res.data.map((item) => {
          if (item.filterName == "type") {
            item.info.map((each) => {
              typefillter.push({ text: each.text, value: each.text });
            });
          } else if (item.filterName == "online") {
            item.info.map((each) => {
              onlinefillter.push({ text: each.text, value: each.id });
            });
          } else {
          }
        });
        columnslist.map((item) => {
          if (item.dataIndex == "type") {
            item.filters = typefillter;
            item.filterMultiple = false;
          } else if (item.dataIndex == "online") {
            item.filters = onlinefillter;
            item.filterMultiple = false;
          } else {
          }
        });
        setOnlineFilters(onlinefillter);
        setTypeFilters(typefillter);
        setCols([...columnslist]);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  const downloadClick = () => {
    download(
      "/cfg.php?controller=assetMapping&action=exportVioService",
      "",
      setDownLoading
    );
  };

  const clickFilter = (info, today) => {
    setTypeValue(info?.type ? info?.type : null);
    let values = {};
    if (onlineValue) {
      values.online = onlineValue;
      values.type = info.type;
      setFilterValue(values);
    } else {
      values.online = null;
      values.type = info.type;
      setFilterValue(values);
    }
    setIncID(incID + 1);
  };

  const filterChange = (value) => {
    if (filterValue.type && value.type) {
      if (filterValue.type[0] != value.type[0]) {
        setIsToday("N");
      }
    }
    setTypeValue(value?.type ? value?.type : null);
    setOnlineValue(value?.online ? value?.online : null);
  };

  //删除弹框
  const showDeleteConfirm = (selectedRowKeys, dataList, record) => {
    let sum = selectedRowKeys.length;
    confirm({
      className: "assetDelConfirm",
      icon: <CloseCircleFilled style={{ color: "red" }} />,
      title: language("nbg.suretodelect"),
      content: language("project.cancelcon", { sum: sum }),
      okType: "danger",
      onOk() {
        delList(selectedRowKeys, dataList, record);
      },
    });
  };

  const delList = (selectedRowKeys, dataList, selectedRows) => {
    let arr = [];
    selectedRows.map((item, index) => {
      arr.push(item.id);
    });
    post("/cfg.php?controller=assetMapping&action=delVioService", {
      delValue: arr.join(","),
    })
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        setIncID(incID + 1);
        message.success(res.msg);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  return (
    <Spin spinning={downLoading} tip={language("project.exporting")}>
      <ProCard direction="column" ghost gutter={[13, 13]}>
        <ProCard gutter={[13, 13]} ghost>
          <ProCard colSpan="25%" bordered className="svrSumCard">
            <div className="srvcard">
              <div className="image">
                <img src={AnonSummaryImg} />
              </div>
              <div className="svrcontent">
                <div className="mitytitle">
                  <sapn>{language("analyse.illsvr.anonser")}</sapn>
                </div>
                <div className="svrbot">
                  <div className="svrtext">
                    <div>{language("analyse.illsvr.today")}</div>
                    <div>{language("analyse.illsvr.total")}</div>
                  </div>
                  <div className="svrvalue">
                    <div
                      className="filterDiv"
                      onClick={() => {
                        clickFilter({
                          type: [language("analyse.illsvr.anonser")],
                        });
                        setIsToday("Y");
                      }}
                    >
                      {anoncount?.today}
                    </div>
                    <div
                      className="filterDiv"
                      onClick={() => {
                        clickFilter({
                          type: [language("analyse.illsvr.anonser")],
                        });
                        setIsToday("N");
                      }}
                    >
                      {anoncount?.total}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ProCard>
          <ProCard colSpan="25%" bordered className="svrSumCard">
            <div className="srvcard">
              <div className="image">
                <img src={ProxySummaryImg} />
              </div>
              <div className="svrcontent">
                <div className="brokertitle">
                  <sapn>{language("analyse.illsvr.proxyser")}</sapn>
                </div>
                <div className="svrbot">
                  <div className="svrtext">
                    <div>{language("analyse.illsvr.today")}</div>
                    <div>{language("analyse.illsvr.total")}</div>
                  </div>
                  <div className="svrvalue">
                    <div
                      className="filterDiv"
                      onClick={() => {
                        clickFilter({
                          type: [language("analyse.illsvr.proxyser")],
                        });
                        setIsToday("Y");
                      }}
                    >
                      {proxycount?.today}
                    </div>
                    <div
                      className="filterDiv"
                      onClick={() => {
                        clickFilter({
                          type: [language("analyse.illsvr.proxyser")],
                        });
                        setIsToday("N");
                      }}
                    >
                      {proxycount?.total}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ProCard>
          <ProCard colSpan="25%" bordered className="svrSumCard">
            <div className="srvcard">
              <div className="image">
                <img src={RemoteSummaryImg} />
              </div>
              <div className="svrcontent">
                <div className="remotetitle">
                  <sapn>{language("analyse.illsvr.remoteser")}</sapn>
                </div>
                <div className="svrbot">
                  <div className="svrtext">
                    <div>{language("analyse.illsvr.today")}</div>
                    <div>{language("analyse.illsvr.total")}</div>
                  </div>
                  <div className="svrvalue">
                    <div
                      className="filterDiv"
                      onClick={() => {
                        clickFilter({
                          type: [language("analyse.illsvr.remoteser")],
                        });
                        setIsToday("Y");
                      }}
                    >
                      {remotecount?.today}
                    </div>
                    <div
                      className="filterDiv"
                      onClick={() => {
                        clickFilter({
                          type: [language("analyse.illsvr.remoteser")],
                        });
                        setIsToday("N");
                      }}
                    >
                      {remotecount?.total}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ProCard>
          <ProCard colSpan="25%" bordered className="svrSumCard">
            <div className="srvcard">
              <div className="image">
                <img src={LocationSummaryImg} />
              </div>
              <div className="svrcontent">
                <div className="addrtitle">
                  <sapn>{language("analyse.illsvr.locationser")}</sapn>
                </div>
                <div className="svrbot">
                  <div className="svrtext">
                    <div>{language("analyse.illsvr.today")}</div>
                    <div>{language("analyse.illsvr.total")}</div>
                  </div>
                  <div className="svrvalue">
                    <div
                      className="filterDiv"
                      onClick={() => {
                        clickFilter({
                          type: [language("analyse.illsvr.locationser")],
                        });
                        setIsToday("Y");
                      }}
                    >
                      {addrcount?.today}
                    </div>
                    <div
                      className="filterDiv"
                      onClick={() => {
                        clickFilter({
                          type: [language("analyse.illsvr.locationser")],
                        });
                        setIsToday("N");
                      }}
                    >
                      {addrcount?.total}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ProCard>
        </ProCard>
        <ProCard className="ilsvtableCard" ghost>
          <ProtableModule
            incID={incID}
            columns={columns}
            tableKey={tableKey}
            searchVal={searchVal}
            searchText={showSearch()}
            components={components}
            apishowurl={apiShowUrl}
            columnvalue={columnvalue}
            clientHeight={clientHeight}
            concealColumns={concealColumns}
            downloadButton={downloadButton}
            downloadClick={downloadClick}
            filterValue={filterValue}
            filterChange={filterChange}
            delButton={true}
            rowkey={(record) => record.id}
            rowSelection={true}
            delClick={showDeleteConfirm}
          />
        </ProCard>
      </ProCard>
    </Spin>
  );
};
