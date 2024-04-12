import React, { useRef, useState, useEffect } from "react";
import {
  Input,
  message,
  Tree,
  Space,
  Tag,
  Tooltip,
  Spin,
  Popconfirm,
  Button,
  Row,
  Col,
  Modal,
  Drawer,
  Form,
  Divider,
  Menu,
} from "antd";
import { useHistory } from "umi";
import { post } from "@/services/https";
import { regList, regIpList, regMacList } from "@/utils/regExp";
import {
  LoadingOutlined,
  CloseOutlined,
  CloseCircleFilled,
  EditTwoTone,
  DeleteOutlined,
  CheckOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { fetchAuth } from "@/utils/common";
import {
  DrawerForm,
  ProDescriptions,
  ProForm,
  ProFormItem,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import download from "@/utils/downnloadfile";
import { Resizable } from "react-resizable";
import { language } from "@/utils/language";
import OSIcon from "@/nbgUtils/osIconType";
import { TableLayout, LeftTree, CardModal } from "@/components";
import { useSelector } from "umi";
import { assetType } from "@/nbgUtils/nbgAssetsType";
import vendorIcon from "@/nbgUtils/vendorIcon";
import identifyIcon from "@/assets/images/operate/identify.svg";
import extractIcon from "@/assets/images/operate/extract.svg";
import aladillinn from "@/assets/images/analyse/status/illinn-already.svg";
import noneillinn from "@/assets/images/analyse/status/illinn-none.svg";
import aladillout from "@/assets/images/analyse/status/illout-already.svg";
import noneillout from "@/assets/images/analyse/status/illout-none.svg";
import aladillsvr from "@/assets/images/analyse/status/illsvr-alerady.svg";
import noneillsvr from "@/assets/images/analyse/status/illsvr-none.svg";
import aladportopen from "@/assets/images/analyse/status/portopen-already.svg";
import noneportopen from "@/assets/images/analyse/status/portopen-none.svg";
import aladsysflaw from "@/assets/images/analyse/status/sysflaw-already.svg";
import nonesysflaw from "@/assets/images/analyse/status/sysflaw-none.svg";
import aladweakpwd from "@/assets/images/analyse/status/weakpwd-already.svg";
import noneweakpwd from "@/assets/images/analyse/status/weakpwd-none.svg";
import DetailIcon from "@/assets/images/operate/details.png";
import allTypes from "@/assets/images/analyse/allTypes.svg";
import allTags from "@/assets/images/analyse/allTags.png";
import itemTagIcon from "@/assets/images/analyse/itemTagIcon.png";
import editIcon from "@/assets/images/operate/edit.png";
import checkedIcon from "@/assets/images/operate/checked.svg";
import deleteIcon from "@/assets/images/operate/delete.svg";
import { PlusOutlined } from "@ant-design/icons";
import disIdentifyIcon from "@/assets/images/operate/disIdentifyIcon.svg"; // 识别
import disExtractIcon from "@/assets/images/operate/disExtractIcon.svg"; // 提取
import disEditIcon from "@/assets/images/operate/disEditIcon.svg"; // 编辑
import "./index.less";
const { ProtableModule } = TableLayout;
const { Search } = Input;
const { confirm } = Modal;

export default (props) => {
  // 调整table表头
  const ResizeableTitle = (props) => {
    let resizing = false;
    const { onResize, width, onClick, ...restProps } = props;
    if(!width) {
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
            if(!resizing && onClick) {
              onClick(...args);
            }
          }}
        />
      </Resizable>
    );
  };
  let AsstypeValue;
  AsstypeValue = props.location?.state?.id;
  let history = useHistory();
  const clientHeight = window.innerHeight - 290;
  const writable = fetchAuth();
  const [isWrite, setIsWrite] = useState(writable);
  const [edLoading, setEdLoading] = useState({ 0: false });
  const [typeFilters, setTypeFilters] = useState([]);
  const [osFilters, setOsFilters] = useState([]);
  const [onlineFilters, setOnlineFilters] = useState([]);
  const [isDisable, setIsDisable] = useState(false);
  const columnslist = [
    {
      title: language("project.sysconf.analysis.idenid"),
      dataIndex: "id",
      align: "center",
      width: 80,
      key: "id",
    },
    {
      title: language("project.mconfig.ectstu"),
      dataIndex: "online",
      align: "center",
      width: 80,
      key: "online",
      filterMultiple: false,
      filters: onlineFilters,
      render: (text, record, index) => {
        let color = "success";
        if(record.online == "1") {
          color = "success";
          text = language("project.sysconf.analysis.online");
        } else {
          color = "default";
          text = language("project.sysconf.analysis.noline");
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
      title: language("project.sysconf.analysis.idenip"),
      dataIndex: "ip",
      align: "left",
      width: 130,
      key: "ip",
      ellipsis: true,
      sorter: true,
      // sorter: (a,b) => a.ip.length-b.ip.length
    },
    {
      title: language("project.sysconf.analysis.mac"),
      dataIndex: "mac",
      align: "left",
      width: 160,
      key: "mac",
      ellipsis: true,
    },
    {
      title: language("project.sysconf.analysis.macOUI"),
      dataIndex: "macOUI",
      align: "left",
      width: 160,
      key: "macOUI",
      ellipsis: true,
    },
    {
      title: language("project.sysconf.analysis.name"),
      dataIndex: "name",
      align: "left",
      width: 160,
      key: "name",
      ellipsis: true,
    },
    {
      title: language("project.sysconf.analysis.vendor"),
      dataIndex: "vendor",
      align: "left",
      key: "vendor",
      width: 170,
      ellipsis: true,
      render: (text, record, _, action) => {
        return <div className="vendorIconDiv">{vendorIcon(record.vendor)}</div>;
      },
    },
    {
      title: language("project.sysconf.analysis.identype"),
      dataIndex: "type",
      align: "left",
      key: "type",
      width: 120,
      ellipsis: true,
      filterMultiple: false,
      filters: typeFilters,
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
      title: language("analyse.assets.model"),
      dataIndex: "model",
      align: "left",
      width: 100,
      key: "model",
      ellipsis: true,
    },
    {
      title: language("project.sysconf.analysis.idensystem"),
      dataIndex: "os",
      key: "os",
      align: "left",
      ellipsis: true,
      className: "osCells",
      width: 140,
      filterMultiple: false,
      filters: osFilters,
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
      title: language("analyse.assets.tag"),
      key: "label",
      dataIndex: "label",
      align: "left",
      ellipsis: true,
      width: 160,
      render: (text, record, _, action) => {
        if(record.label?.length < 1) {
          return <></>;
        } else {
          return record?.label?.map((item) => {
            return (
              <Tooltip title={item} placement="topLeft">
                <Tag color="cyan">{item}</Tag>
              </Tooltip>
            );
          });
        }
      },
    },
    {
      title: language("logmngt.terminal.personliable"),
      key: "person",
      dataIndex: "person",
      align: "left",
      ellipsis: true,
      width: 140,
      hideInTable: true,
    },
    {
      title: language("analyse.assets.telephone"),
      key: "telephone",
      dataIndex: "telephone",
      align: "left",
      ellipsis: true,
      width: 160,
      hideInTable: true,
    },
    {
      title: language("project.sysconf.analysis.app"),
      dataIndex: "app",
      align: "left",
      ellipsis: true,
      key: "app",
      width: 300,
      render: (text, record, _, action) => {
        if(record.app.length < 1) {
          return <></>;
        } else {
          let app = record.app.join("，");
          return (
            <Tooltip title={app} placement="topLeft">
              <div>
                {record.app.map((item) => {
                  return <Tag color="blue">{item}</Tag>;
                })}
              </div>
            </Tooltip>
          );
        }
      },
    },
    {
      title: language("analyse.assets.detSituation"),
      dataIndex: "detSituation",
      key: "detSituation",
      align: "center",
      ellipsis: true,
      width: 200,
      render: (text, record, _, action) => {
        return (
          <Space>
            {record?.detSituation?.RiskVul == 1 ? (
              <Tooltip title={language("analyse.resrisk.type.sysflaw")}>
                <img src={aladsysflaw} />
              </Tooltip>
            ) : (
              <Tooltip title={language("analyse.resrisk.type.sysflaw")}>
                <img src={nonesysflaw} />
              </Tooltip>
            )}
            {/* 系统漏洞 */}
            {record?.detSituation?.RiskWeak == 1 ? (
              <Tooltip title={language("analyse.resrisk.type.weakpasd")}>
                <img src={aladweakpwd} />
              </Tooltip>
            ) : (
              <Tooltip title={language("analyse.resrisk.type.weakpasd")}>
                <img src={noneweakpwd} />
              </Tooltip>
            )}
            {/* 弱口令风险*/}
            {record?.detSituation?.RiskPort == 1 ? (
              <Tooltip title={language("analyse.resrisk.type.portopen")}>
                <img src={aladportopen} />
              </Tooltip>
            ) : (
              <Tooltip title={language("analyse.resrisk.type.portopen")}>
                <img src={noneportopen} />
              </Tooltip>
            )}
            {/* 开放端口风险 */}
            {record?.detSituation?.vioOutline == 1 ? (
              <Tooltip title={language("project.monitor.illegal.outline")}>
                <img src={aladillout} />
              </Tooltip>
            ) : (
              <Tooltip title={language("project.monitor.illegal.outline")}>
                <img src={noneillout} />
              </Tooltip>
            )}
            {/* 违规外联 */}
            {record?.detSituation?.vioInline == 1 ? (
              <Tooltip title={language("project.monitor.montask.viodevtext")}>
                <img src={aladillinn} />
              </Tooltip>
            ) : (
              <Tooltip title={language("project.monitor.montask.viodevtext")}>
                <img src={noneillinn} />
              </Tooltip>
            )}
            {/* 违规内联 */}
            {record?.detSituation?.vioService == 1 ? (
              <Tooltip
                title={language("project.monitor.illegal.lllegalservice")}
              >
                <img src={aladillsvr} />
              </Tooltip>
            ) : (
              <Tooltip
                title={language("project.monitor.illegal.lllegalservice")}
              >
                <img src={noneillsvr} />
              </Tooltip>
            )}
            {/* 违规服务 */}
          </Space>
        );
      },
    },
    {
      title: language("project.sysconf.analysis.idenports"),
      dataIndex: "port",
      align: "left",
      key: "port",
      width: 160,
      ellipsis: true,
      render: (text, record, index, event) => {
        return (
          <Tooltip placement="topLeft" title={record.port.join(" , ")}>
            {record.port.join(" , ")}
          </Tooltip>
        );
      },
    },
    {
      title: language("project.sysconf.analysis.idenment"),
      dataIndex: "protocol",
      align: "left",
      ellipsis: true,
      key: "protocol",
      width: 160,
      render: (text, record, index, event, item) => {
        return (
          <Tooltip placement="topLeft" title={record.protocol.join(" , ")}>
            {record.protocol.join(" , ")}
          </Tooltip>
        );
      },
    },
    {
      title: language("netanalyse.nettopo.swIp"),
      dataIndex: "switchIP",
      align: "left",
      key: "switchIP",
      width: 160,
      ellipsis: true,
    },
    {
      title: language("netanalyse.nettopo.swPort"),
      dataIndex: "switchINF",
      align: "left",
      key: "switchINF",
      width: 160,
      ellipsis: true,
    },
    {
      title: "VLAN",
      dataIndex: "VLAN",
      align: "left",
      key: "VLAN",
      width: 70,
      ellipsis: true,
    },
    {
      title: language("project.sysconf.analysis.idenuptime"),
      dataIndex: "lasttime",
      align: "left",
      key: "lasttime",
      width: 160,
      ellipsis: true,
      // sorter: (a, b) => {
      //   const aTime = new Date(a.lasttime).getTime();
      //   const bTime = new Date(b.lasttime).getTime();
      //   return aTime - bTime;
      // },
    },
    {
      title: language("project.operate"),
      valueType: "option",
      width: 120,
      align: "center",
      fixed: "right",
      hideInTable: !writable,
      render: (text, record, _, action) => {
        if(record.icon?.toUpperCase() === "UNKNOWN") {
          return (
            <div className="opIconDiv">
              {edLoading[record.id] ? (
                <Button type="link" size="small">
                  <LoadingOutlined style={{ color: "#1890ff", fontSize: 18 }} />
                </Button>
              ) : isDisable ? (
                <Button type="text" size="small" disabled={isDisable}>
                  <img src={disIdentifyIcon} />
                </Button>
              ) : (
                <Button
                  type="text"
                  size="small"
                  onClick={() => {
                    identifyFn(record.ip, record.id);
                  }}
                >
                  <Tooltip
                    title={language("project.sysconf.analysis.identify")}
                  >
                    <img src={identifyIcon} />
                  </Tooltip>
                </Button>
              )}
              <Button
                type="text"
                size="small"
                onClick={() => {
                  extractFn(record.ip);
                }}
                disabled={isDisable}
              >
                <Tooltip title={language("analyse.assets.extract")}>
                  {isDisable ? (
                    <img src={disExtractIcon} />
                  ) : (
                    <img src={extractIcon} />
                  )}
                </Tooltip>
              </Button>
              <Button
                size="small"
                type="text"
                disabled={isDisable}
                onClick={() => {
                  setEditDraw(record);
                }}
              >
                <Tooltip title={language("project.edit")}>
                  {isDisable ? (
                    <img src={disEditIcon} />
                  ) : (
                    <img src={editIcon} />
                  )}
                </Tooltip>
              </Button>
              <Button
                size="small"
                type="text"
                onClick={() => {
                  getDetailInfo(record.ip);
                }}
              >
                <Tooltip title={language("sysmain.admlog.info")}>
                  <img src={DetailIcon} />
                </Tooltip>
              </Button>
            </div>
          );
        } else {
          return (
            <div className="opIconDiv">
              {edLoading[record.id] ? (
                <Button type="link" size="small">
                  <LoadingOutlined style={{ color: "#1890ff", fontSize: 18 }} />
                </Button>
              ) : isDisable ? (
                <Button type="text" size="small" disabled={isDisable}>
                  <img src={disIdentifyIcon} />
                </Button>
              ) : (
                <Popconfirm
                  title={language("analyse.assets.isIdentify")}
                  okText={language("project.yes")}
                  cancelText={language("project.no")}
                  onConfirm={() => {
                    identifyFn(record.ip, record.id);
                  }}
                >
                  <Button type="text" size="small">
                    <Tooltip
                      title={language("project.sysconf.analysis.identify")}
                    >
                      <img src={identifyIcon} />
                    </Tooltip>
                  </Button>
                </Popconfirm>
              )}
              <Button
                type="text"
                size="small"
                disabled={isDisable}
                onClick={() => {
                  extractFn(record.ip);
                }}
              >
                <Tooltip title={language("analyse.assets.extract")}>
                  {isDisable ? (
                    <img src={disExtractIcon} />
                  ) : (
                    <img src={extractIcon} />
                  )}
                </Tooltip>
              </Button>
              <Button
                size="small"
                type="text"
                onClick={() => {
                  setEditDraw(record, "mod");
                }}
                disabled={isDisable}
              >
                <Tooltip title={language("project.edit")}>
                  {isDisable ? (
                    <img src={disEditIcon} />
                  ) : (
                    <img src={editIcon} />
                  )}
                </Tooltip>
              </Button>
              <Button
                size="small"
                type="text"
                onClick={() => {
                  getDetailInfo(record.ip);
                }}
              >
                <Tooltip title={language("sysmain.admlog.info")}>
                  <img src={DetailIcon} />
                </Tooltip>
              </Button>
            </div>
          );
        }
      },
    },
  ];

  /* 表格操作列按钮loading方法 */
  const clickLoading = (index, state) => {
    setEdLoading((loading) => {
      const newLoading = { ...loading };
      if(state === "stop") {
        newLoading[index] = false;
      } else {
        newLoading[index] = true;
      }
      return newLoading;
    });
  };

  const drawformRef = useRef();
  const [drawState, setDrawState] = useState(false);
  const [addDrawState, setAddDrawState] = useState(false);
  const [detailInfo, setDetailInfo] = useState({});
  const [riskInfo, setViskInfo] = useState({});
  const [vioInfo, setVioInfo] = useState({});
  const [cols, setCols] = useState(columnslist);
  const [columns, setColumns] = useState(cols);
  const [expandKey, setExpandKey] = useState(["type"]);
  const [treeList, setTreeList] = useState([]);
  const [typeVal, setTypeVal] = useState(
    AsstypeValue || AsstypeValue == 0 ? "type-" + AsstypeValue : "type"
  );
  const [selectedKey, setSelectedKey] = useState([
    AsstypeValue || AsstypeValue == 0 ? "type-" + AsstypeValue : "type",
  ]);
  const [downLoading, setDownLoading] = useState(false);
  const [opState, setOpState] = useState("");
  const [tagList, setTagList] = useState([]);
  const [selectTag, setSelectTag] = useState([]);
  const [isHovering, setIsHovering] = useState("");
  const [assetList, setAssetList] = useState([]);
  const [multple, setMultple] = useState(false);
  const [muitID, setMuitID] = useState([]);
  const [form] = Form.useForm();
  const [tagForm] = Form.useForm();
  const [venderData, setVendorData] = useState([]);

  useEffect(() => {
    getTree();
    getFillter();
    showAssetList();
    showLabelList();
    showVendorList();
  }, []);

  // 定义头部组件
  const components = {
    header: {
      cell: ResizeableTitle,
    },
  };

  useEffect(() => {
    setCols(columnslist);
    setColumns(cols);
  }, [edLoading, isDisable]);

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

  useEffect(() => {
    let list = [...columns];
    list?.map((item) => {
      if(item.valueType == "option") {
        item.hideInTable = !writable;
      }
    });
    // setCols(list);
    setColumns(list);
  }, [writable]);

  const getFillter = () => {
    post("/cfg.php?controller=assetMapping&action=filterAssetList")
      .then((res) => {
        let typefillter = [];
        let osfillter = [];
        let onlinefillter = [];
        res.data.map((item) => {
          if(item.filterName == "type") {
            item.info.map((each) => {
              typefillter.push({ text: each.text, value: each.id });
            });
          } else if(item.filterName == "os") {
            item.info.map((each) => {
              osfillter.push({ text: each.text, value: each.text });
            });
          } else if(item.filterName == "online") {
            item.info.map((each) => {
              onlinefillter.push({ text: each.text, value: each.id });
            });
          } else {
          }
        });
        columnslist.map((item) => {
          if(item.dataIndex == "type") {
            item.filters = typefillter;
            item.filterMultiple = false;
          } else if(item.dataIndex == "os") {
            item.filters = osfillter;
            item.filterMultiple = false;
          } else if(item.dataIndex == "online") {
            item.filters = onlinefillter;
            item.filterMultiple = false;
          } else {
          }
        });
        setCols([...columnslist]);
        setOnlineFilters(onlinefillter);
        setTypeFilters(typefillter);
        setOsFilters(osfillter);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  const showLabelList = () => {
    post("/cfg.php?controller=assetMapping&action=assetLabelSelect", {
      start: 0,
      limit: -1,
    }).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      res.data.map((item) => {
        item.key = item.label;
      });
      setTagList(res.data);
    });
  };

  const showAssetList = () => {
    post("/cfg.php?controller=assetMapping&action=assetTypeSelect", {
      start: 0,
      limit: -1,
    }).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      let list = [];
      res.data?.map((item) => {
        list.push({
          label: item.label,
          value: item.label,
          icon: item.icon,
        });
      });
      setAssetList(list);
    });
  };

  const showVendorList = () => {
    post("/cfg.php?controller=assetMapping&action=assetVendorSelect").then(
      (res) => {
        if(!res.success) {
          message.error(res.msg);
          return false;
        }
        setVendorData(res.data);
      }
    );
  };

  const getTree = (id = 0) => {
    post("/cfg.php?controller=assetMapping&action=showAssetClassify", {
      id: id,
    })
      .then((res) => {
        if(!res.success) {
          message.error(res.mag);
          return false;
        }
        let list = [];
        let assetTotal = 0;
        let tagsTotal = 0;
        res.data.type.key = "type";
        res.data.tag.key = "label";
        list.push(res.data.type);
        list.push(res.data.tag);
        list.map((item) => {
          if(item.key === "type") {
            item.icon = <img src={allTypes} style={{ marginBottom: 3 }} />;
            item.children.map((each) => {
              assetTotal += each.count - 0;
              each.key = item.key + "-" + each.id;
              each.icon = (
                <div className="typeIcon">{assetType(each.icon)}</div>
              );
              each.title = each.name + `（${each.count}）`;
            });
            item.title =
              language("analyse.assets.treetitle") + "（" + assetTotal + "）";
          } else {
            item.icon = <img src={allTags} style={{ marginBottom: 3 }} />;
            item.children.map((every) => {
              tagsTotal += every.count - 0;
              every.key = item.key + "-" + every.id;
              every.icon = (
                <div className="typeIcon">
                  <img src={itemTagIcon} />
                </div>
              );
              every.title = every.name + `（${every.count}）`;
            });
            item.title =
              language("analyse.assets.assetlabel") + "（" + tagsTotal + "）";
          }
        });
        setTreeList(list);
        setExpandKey(["type", "label"]);
      })
      .catch(() => {
        console.log("error");
      });
  };

  const onExpand = (value) => {
    setExpandKey(value);
  };

  const onTreeSelect = (value) => {
    if(!value[0] && value[0] != 0) {
      value[0] = typeVal == "-1" ? AsstypeValue : typeVal;
    }
    setTypeVal(value[0]);
    setSelectedKey(value);
    //更新选中地址id
    setIncID((incID) => incID + 1);
  };

  let identifyTimer;
  /* 识别接口 */
  const identifyFn = (addr, id) => {
    clickLoading(id);
    post("/cfg.php?controller=assetMapping&action=assetIdentify", {
      ip: addr,
    }).then((res) => {
      if(res.success) {
        checkResult(addr, id);
      } else {
        clickLoading(id, "stop");
        res.msg && message.error(res.msg);
        return false;
      }
    });
  };

  /* 检测识别结果 */
  const checkResult = (addr, id) => {
    post("/cfg.php?controller=assetMapping&action=assetIdentifyResult", {
      ip: addr,
    }).then((res) => {
      if(res.code === 202) {
        identifyTimer = setTimeout(() => {
          checkResult(addr, id);
        }, 1000);
      } else if(res.code === 200) {
        clickLoading(id, "stop");
        setIncID((incID) => incID + 1);
        clearTimeout(identifyTimer);
      } else {
        message.error(res.msg);
        clickLoading(id, "stop");
        setIncID((incID) => incID + 1);
        return false;
      }
    });
  };

  const extractFn = (addr) => {
    post("/cfg.php?controller=assetMapping&action=assetExtract", {
      ip: addr,
    }).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      let obj = {};
      obj = res.data;
      obj.ip = addr;
      history.push({
        pathname: "/monitor/mapping",
        state: { value: obj },
      });
    });
  };

  const [incID, setIncID] = useState(0);
  const tableKey = "assetsTable";
  const apishowurl = "/cfg.php?controller=assetMapping&action=showAssetList";
  const rowKey = (record) => record.id;
  const [queryVal, setQueryVal] = useState(); //首个搜索框的值
  const concealColumns = {
    id: { show: false },
    mac: { show: false },
    macOUI: { show: false },
    switchIP: { show: false },
    switchINF: { show: false },
    VLAN: { show: false },
  };
  let searchVal = {
    queryVal: queryVal,
    type: typeVal,
  };

  //导出按钮
  const downloadClick = () => {
    download(
      "/cfg.php?controller=assetMapping&action=exportAssetList",
      "",
      setDownLoading
    );
  };

  const showSearch = () => {
    return (
      <div className="searchDiv">
        <Search
          allowClear
          placeholder={language("analyse.assets.searchtext")}
          className="assetsSearch"
          onSearch={(queryVal) => {
            setIncID(incID + 1);
            setQueryVal(queryVal);
          }}
        />
      </div>
    );
  };

  const showDraw = (state) => {
    if(state == "open") {
      setDrawState(true);
    } else {
      drawformRef.current.resetFields();
      setDrawState(false);
    }
  };

  const getDetailInfo = (addr) => {
    post("/cfg.php?controller=assetMapping&action=assetDetaInfo", {
      ip: addr,
    }).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      setDetailInfo(res.assetInfo);
      setViskInfo(res.riskInfo);
      setVioInfo(res.vioInfo);
      setTimeout(() => {
        showDraw("open");
      }, 100);
    });
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
    post("/cfg.php?controller=assetMapping&action=delAssetList", {
      delValue: arr.join(","),
    })
      .then((res) => {
        if(!res.success) {
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

  const multOperation = (
    selectedRowKeys,
    dataList,
    selectedRows,
    setSelectedRowKeys
  ) => {
    setIsDisable(true);
    return (
      <div>
        <Button
          onClick={() => {
            setSelectedRowKeys([]);
            setMultple(false);
            setIsDisable(false);
          }}
        >
          {language("project.sysconf.syscert.cancelText")}
        </Button>
        <Button
          type="primary"
          onClick={() => {
            setMultple(true);
            setMuitID(selectedRowKeys);
            showAddDrawer("open", "multple");
          }}
        >
          {language("analyse.assets.multedit")}
        </Button>
      </div>
    );
  };

  const setEditDraw = (obj) => {
    form.setFieldsValue(obj);
    setSelectTag(obj.label);
    showAddDrawer("open", "mod");
  };

  const handleAddClick = () => {
    showAddDrawer("open", "add");
  };

  /* 打开关闭新增编辑抽屉 */
  const showAddDrawer = (state, operStatus) => {
    if(state == "open") {
      setAddDrawState(true);
      setOpState(operStatus);
    } else {
      form?.resetFields();
      setSelectTag([]);
      setAddDrawState(false);
      setMultple(false);
      setIsDisable(false);
    }
  };

  /* 可编辑下拉框新增操作系统 */
  const addTagList = (values) => {
    post("/cfg.php?controller=assetMapping&action=addAssetLabel", {
      label: values.tag,
    }).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      showLabelList();
    });
  };

  const delTagList = (e, record) => {
    post("/cfg.php?controller=assetMapping&action=delAssetLabel", {
      label: record.label,
    }).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      showLabelList();
    });
  };

  const tagRenderFn = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color={"cyan"}
        key={label}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ margin: "3px 3px 3px 0" }}
      >
        {label}
      </Tag>
    );
  };

  const singleAddSet = (values) => {
    values.label = JSON.stringify(selectTag);
    values.type = values.type
      ? typeof values.type == "object"
        ? values.type.join("")
        : values.type
      : "";
    post(
      "/cfg.php?controller=assetMapping&action=singleAddSetAsset",
      values
    ).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      showAddDrawer("close");
      setIncID((incID) => incID + 1);
    });
  };

  const multEditFn = (values) => {
    values.id = muitID.join(",");
    values.type = values.type ? values.type.join("") : "";
    values.label = JSON.stringify(selectTag);
    post("/cfg.php?controller=assetMapping&action=setAsset", values).then(
      (res) => {
        if(!res.success) {
          message.error(res.msg);
          return false;
        }
        message.success(res.msg);
        showAddDrawer("close");
        setIncID((incID) => incID + 1);
      }
    );
  };

  const signleRender = (props) => {
    const { label, value, closable, onClose } = props;
    let suffix;
    assetList.map((item) => {
      if(label === item.label) {
        suffix = item.icon;
      }
    });
    return (
      <div style={{ display: "flex", alignItems: "center", marginLeft: 5 }}>
        <div className="typeIcon">{assetType(suffix)}</div>
        <div style={{ marginLeft: 10, whiteSpace: "nowrap" }}>{label}</div>
      </div>
    );
  };

  const onSelectData = (selectedRowKeys, selectedRows) => {
    if(selectedRowKeys.length > 0) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  };

  return (
    <Spin
      spinning={downLoading}
      tip={language("project.sysdebug.wireshark.loading")}
      indicator={<LoadingOutlined spin />}
    >
      <div className="assetContent">
        <CardModal
          cardHeight={clientHeight + 182}
          title={language("project.sysconf.analysis.cardtitle")}
          leftContent={
            <div className="treecard">
              <Tree
                showIcon
                defaultExpandAll
                treeData={treeList}
                expandedKeys={expandKey}
                onExpand={onExpand}
                selectedKeys={selectedKey}
                onSelect={onTreeSelect}
                defaultSelectedKeys={[
                  AsstypeValue || AsstypeValue == 0
                    ? AsstypeValue
                    : ["type", "label"],
                ]}
                defaultExpandedKeys={["type", "label"]}
              />
            </div>
          }
          rightContent={
            <div
              id="detailContain"
              style={{ height: "100%", width: "100%", overflow: "hidden" }}
            >
              <div
                id="addContain"
                style={{ height: "100%", width: "100%", overflow: "hidden" }}
              >
                <ProtableModule
                  incID={incID}
                  rowkey={rowKey}
                  columns={columns}
                  searchVal={searchVal}
                  tableKey={tableKey}
                  apishowurl={apishowurl}
                  searchText={showSearch()}
                  clientHeight={clientHeight}
                  columnvalue={"assetsTable"}
                  concealColumns={concealColumns}
                  components={components}
                  downloadButton={true}
                  downloadClick={downloadClick}
                  rowSelection={true}
                  bulkOperation={multOperation}
                  addButton={true}
                  addClick={handleAddClick}
                  delButton={true}
                  delClick={showDeleteConfirm}
                  onSelectData={onSelectData}
                />
              </div>
            </div>
          }
        ></CardModal>
        <DrawerForm
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          width={450}
          layout="horizontal"
          title={language("analyse.resrisk.sysflaw.drawTitle")}
          formRef={drawformRef}
          className="assetDetailDraw"
          drawerProps={{
            placement: "right",
            closable: false,
            getContainer: () => document.getElementById("detailContain"),
            style: {
              position: "absolute",
            },
            width: 560,
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
          <ProDescriptions
            column={2}
            title={language("probers.hdprobe.hdprobelist.baseInfo")}
            bordered={true}
          >
            <ProDescriptions.Item
              label={language("project.sysconf.analysis.idenid")}
              dataIndex="id"
            >
              {detailInfo?.id ? detailInfo?.id : "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={language("project.mconfig.ectstu")}
              dataIndex="state"
            >
              <Tag color={detailInfo?.online == 1 ? "success" : "default"}>
                {detailInfo?.online == 1
                  ? language("project.sysconf.analysis.online")
                  : language("project.sysconf.analysis.noline")}
              </Tag>
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={language("analyse.resrisk.addr")}
              dataIndex="ip"
            >
              {detailInfo?.ip ? detailInfo?.ip : "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={language("project.analyse.illout.mac")}
              dataIndex="mac"
            >
              {detailInfo?.mac ? detailInfo?.mac : "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={language("project.central.assetname")}
              dataIndex="name"
            >
              {detailInfo?.name ? detailInfo?.name : "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={language("project.central.assettype")}
              dataIndex="type"
            >
              {detailInfo?.type ? (
                <div className="detaIconDiv">
                  {assetType(detailInfo.icon)}
                  <div className="detaIconText">{detailInfo.type}</div>
                </div>
              ) : (
                "--"
              )}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={language("monitor.mapping.fingerprint.vendor")}
              dataIndex="vendor"
            >
              {detailInfo?.vendor ? detailInfo?.vendor : "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={language("analyse.assets.model")}
              dataIndex="model"
            >
              {detailInfo?.model ? detailInfo?.model : "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={language("netanalyse.nettopo.swIp")}
              dataIndex="switchIP"
            >
              {detailInfo?.switchIP ? detailInfo?.switchIP : "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={language("netanalyse.nettopo.swPort")}
              dataIndex="switchINF"
            >
              {detailInfo?.switchINF ? detailInfo?.switchINF : "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={language("analyse.assets.department")}
              dataIndex="switchIP"
            >
              {"--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={language("logmngt.terminal.personliable")}
              dataIndex="person"
            >
              {detailInfo?.person ? detailInfo?.person : "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={language("analyse.assets.phone")}
              dataIndex="telephone"
            >
              {detailInfo?.telephone ? detailInfo?.telephone : "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={language("cfgmngt.devlist.uptime")}
              dataIndex="lasttime"
            >
              {detailInfo?.lasttime ? detailInfo?.lasttime : "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={language("analyse.assets.assetlabel")}
              dataIndex="os"
              span={2}
            >
              {detailInfo?.label?.length > 0
                ? detailInfo?.label?.map((item) => {
                  return <Tag color={"blue"}>{item}</Tag>;
                })
                : "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={language("project.analyse.illout.os")}
              dataIndex="os"
              span={2}
            >
              {detailInfo?.os ? (
                <div className="detaIconDiv">
                  {OSIcon(detailInfo.os)}
                  <div className="detaIconText">{detailInfo.os}</div>
                </div>
              ) : (
                "--"
              )}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={language("project.sysconf.analysis.idenports")}
              dataIndex="port"
              span={2}
            >
              {detailInfo?.port ? detailInfo?.port : "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={language("project.sysconf.analysis.idenment")}
              dataIndex="protocol"
              span={2}
            >
              {detailInfo?.protocol ? detailInfo?.protocol : "--"}
            </ProDescriptions.Item>
          </ProDescriptions>
          <h3 className="infoTitle">{language("analyse.assets.riskinfo")}</h3>
          <ProFormItem
            label={language("analyse.resrisk.sysflaw")}
            name="riskVul"
          >
            <Row style={{ marginTop: -5 }}>
              {riskInfo?.RiskVul?.length > 0 ? (
                riskInfo?.RiskVul?.map((item) => {
                  return (
                    <Col style={{ marginTop: 5 }}>
                      <Tag color={"red"}>{item}</Tag>
                    </Col>
                  );
                })
              ) : (
                <Col style={{ marginTop: 5 }}>
                  <Tag color="success" style={{ padding: "0 15px" }}>
                    {language("analyse.assets.none")}
                  </Tag>
                </Col>
              )}
            </Row>
          </ProFormItem>
          <ProFormItem
            label={language("analyse.resrisk.weakpwd")}
            name="riskWeak"
          >
            <Row style={{ marginTop: -5 }}>
              {riskInfo?.RiskWeak?.length > 0 ? (
                riskInfo?.RiskWeak?.map((item) => {
                  return (
                    <Col style={{ marginTop: 5 }}>
                      <Tag color="red">{item}</Tag>
                    </Col>
                  );
                })
              ) : (
                <Col style={{ marginTop: 5 }}>
                  <Tag color="success" style={{ padding: "0 15px" }}>
                    {language("analyse.assets.none")}
                  </Tag>
                </Col>
              )}
            </Row>
          </ProFormItem>
          <ProFormItem
            label={language("analyse.resrisk.portopen")}
            name="riskPort"
          >
            <Row style={{ marginTop: -5 }}>
              {riskInfo?.RiskPort?.length > 0 ? (
                riskInfo?.RiskPort?.map((item) => {
                  return (
                    <Col style={{ marginTop: 5 }}>
                      <Tag color="red">{item}</Tag>
                    </Col>
                  );
                })
              ) : (
                <Col style={{ marginTop: 5 }}>
                  <Tag color="success" style={{ padding: "0 15px" }}>
                    {language("analyse.assets.none")}
                  </Tag>
                </Col>
              )}
            </Row>
          </ProFormItem>
          <h3 className="infoTitle">
            {language("project.analyse.illinn.info")}
          </h3>
          <ProFormItem
            label={language("project.monitor.illegal.outline")}
            name="vioOutline"
          >
            <Row style={{ marginTop: -5 }}>
              {vioInfo?.vioOutline?.length > 0 ? (
                vioInfo?.vioOutline?.map((item) => {
                  return (
                    <Col style={{ marginTop: 5 }}>
                      <Tag color="volcano">{item}</Tag>
                    </Col>
                  );
                })
              ) : (
                <Col style={{ marginTop: 5 }}>
                  <Tag color="success" style={{ padding: "0 15px" }}>
                    {language("analyse.assets.none")}
                  </Tag>
                </Col>
              )}
            </Row>
          </ProFormItem>
          <ProFormItem
            label={language("project.monitor.illegal.inline")}
            name="vioInline"
          >
            <Row style={{ marginTop: -5 }}>
              {vioInfo?.vioInline?.length > 0 ? (
                vioInfo?.vioInline?.map((item) => {
                  return (
                    <Col style={{ marginTop: 5 }}>
                      <Tag color="volcano">{item}</Tag>
                    </Col>
                  );
                })
              ) : (
                <Col style={{ marginTop: 5 }}>
                  <Tag color="success" style={{ padding: "0 15px" }}>
                    {language("analyse.assets.none")}
                  </Tag>
                </Col>
              )}
            </Row>
          </ProFormItem>
          <ProFormItem
            label={language("project.monitor.montask.vioSrvtext")}
            name="vioService"
          >
            <Row style={{ marginTop: -5 }}>
              {vioInfo?.vioService?.length > 0 ? (
                vioInfo?.vioService?.map((item) => {
                  return (
                    <Col style={{ marginTop: 5 }}>
                      <Tag color="volcano">{item}</Tag>
                    </Col>
                  );
                })
              ) : (
                <Col style={{ marginTop: 5 }}>
                  <Tag color="success" style={{ padding: "0 15px" }}>
                    {language("analyse.assets.none")}
                  </Tag>
                </Col>
              )}
            </Row>
          </ProFormItem>
        </DrawerForm>
        <Drawer
          placement="right"
          title={
            multple
              ? language("analyse.assets.multedit")
              : opState === "add"
                ? language("analyse.assets.add")
                : language("project.edit")
          }
          className="addDrawer"
          visible={addDrawState}
          onVisibleChange={setAddDrawState}
          closable={false}
          maskClosable={false}
          width={450}
          getContainer={() => document.getElementById("addContain")}
          onClose={() => {
            showAddDrawer("close");
          }}
          style={{
            position: "absolute",
          }}
          extra={
            <Button
              type="text"
              size="small"
              onClick={() => {
                showAddDrawer("close");
              }}
            >
              <CloseOutlined />
            </Button>
          }
          footer={
            <Space>
              <Button
                onClick={() => {
                  showAddDrawer("close");
                }}
              >
                {language("project.sysconf.syscert.cancelText")}
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  form.submit();
                }}
              >
                {language("project.determine")}
              </Button>
            </Space>
          }
        >
          <Form
            submitter={false}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            layout="horizontal"
            form={form}
            onFinish={(value) => {
              // const datas = form.getFieldsValue(true);
              if(multple) {
                multEditFn(value);
              } else {
                singleAddSet(value);
              }
            }}
          >
            {multple ? (
              <>
                <ProFormSelect
                  label={language("analyse.assets.assetType")}
                  name="type"
                  options={assetList}
                  fieldProps={{
                    mode: "tags",
                    tagRender: signleRender,
                  }}
                  onChange={(e) => {
                    let arr = e;
                    if(e.length > 1) {
                      arr.shift();
                    }
                  }}
                />
                <ProFormSelect
                  label={language("analyse.assets.asseVendor")}
                  name="vendor"
                  options={venderData}
                  showSearch
                  debounceTime={300}
                  fieldProps={{
                    getPopupContainer: () =>
                      document.getElementById("addContain"),
                  }}
                />
                <ProFormText
                  label={language("analyse.assets.model")}
                  name="model"
                />
                <div id="area" style={{ position: "relative" }}>
                  <ProFormSelect
                    label={language("analyse.assets.assetlabel")}
                    name="label"
                    options={tagList}
                    allowClear
                    showArrow
                    value={selectTag}
                    fieldProps={{
                      tagRender: tagRenderFn,
                      dropdownRender: (menu) => {
                        return (
                          <div
                            style={{
                              maxHeight: "280px",
                            }}
                          >
                            {/* {menu} */}
                            <Menu
                              // items={tagList}
                              multiple
                              className="tagMenu"
                              selectedKeys={selectTag}
                              onMouseLeave={(e) => {
                                setIsHovering("");
                              }}
                            >
                              {tagList.map((item, index) => {
                                return (
                                  <Menu.Item
                                    key={item.key}
                                    onClick={(e, event) => {
                                      let selectList = [...selectTag];
                                      let idx = selectList.findIndex(
                                        (item, index) => {
                                          return item == e.key;
                                        }
                                      );
                                      if(idx >= 0) {
                                        selectList.splice(idx, 1);
                                      } else {
                                        selectList.push(e.key);
                                      }
                                      setSelectTag([...selectList]);
                                    }}
                                    onMouseLeave={(e) => {
                                      setIsHovering("");
                                    }}
                                  >
                                    <div
                                      className="testTag"
                                      onMouseEnter={(e) => {
                                        setIsHovering(item.key);
                                      }}
                                      onMouseLeave={(e) => {
                                        setIsHovering("");
                                      }}
                                    >
                                      <div>{item.label}</div>
                                      {selectTag?.indexOf(item.key) > -1 && (
                                        <img src={checkedIcon} />
                                      )}
                                      {selectTag?.indexOf(item.key) < 0 &&
                                        isHovering === item.key && (
                                          <img
                                            src={deleteIcon}
                                            style={{
                                              cursor: "pointer",
                                            }}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              delTagList(e, item);
                                            }}
                                          />
                                        )}
                                    </div>
                                  </Menu.Item>
                                );
                              })}
                            </Menu>
                            <Divider style={{ margin: "8px 0" }} />
                            <Form
                              name="basic"
                              layout="inline"
                              form={tagForm}
                              className="tagForm"
                              onFinish={(values) => {
                                addTagList(values);
                              }}
                            >
                              <Form.Item
                                rules={[
                                  {
                                    required: true,
                                    message: language("project.mandatory"),
                                  },
                                ]}
                                name="tag"
                              >
                                <Input
                                  placeholder={language(
                                    "analyse.assets.label.placeEnrter"
                                  )}
                                  allowClear
                                />
                              </Form.Item>
                              <Button icon={<PlusOutlined />} htmlType="submit">
                                {language("project.add")}
                              </Button>
                            </Form>
                          </div>
                        );
                      },
                      dropdownStyle: {
                        maxHeight: 280,
                      },
                      mode: "multiple",
                      value: selectTag,
                      getPopupContainer: () => document.getElementById("area"),
                      onDropdownVisibleChange: (open) => {
                        if(!open) {
                          tagForm.resetFields();
                        }
                      },
                    }}
                    onChange={(value) => {
                      setSelectTag([...value]);
                    }}
                  />
                </div>
                <ProFormSelect
                  label={language("analyse.assets.department")}
                  name="department"
                  hidden
                />
                <ProFormText
                  label={language("logmngt.terminal.personliable")}
                  name="person"
                  rules={[
                    {
                      pattern: regList.strmin1andmax64.regex,
                      message: regList.strmin1andmax64.alertText,
                    },
                  ]}
                />
                <ProFormText
                  label={language("analyse.assets.telephone")}
                  name="telephone"
                  rules={[
                    {
                      pattern: regList.phoneorlandline.regex,
                      message: regList.phoneorlandline.alertText,
                    },
                  ]}
                />
              </>
            ) : (
              <>
                <ProFormText name="id" hidden />
                <ProFormText
                  label={language("analyse.resrisk.addr")}
                  name="ip"
                  rules={
                    opState === "mod"
                      ? false
                      : [
                        {
                          required: opState === "add" ? true : false,
                          message: language("project.mandatory"),
                        },
                        {
                          pattern: regIpList.ipv4.regex,
                          message: regIpList.ipv4.alertText,
                        },
                      ]
                  }
                  disabled={opState === "mod" ? true : false}
                />
                <ProFormText
                  label={language("project.analyse.illout.mac")}
                  name="mac"
                  rules={[
                    {
                      pattern: regMacList.mac.regex,
                      message: regMacList.mac.alertText,
                    },
                  ]}
                />
                <ProFormText
                  label={language("analyse.assets.assetName")}
                  name="name"
                  rules={[
                    {
                      pattern: regList.strmin1andmax64.regex,
                      message: regList.strmin1andmax64.alertText,
                    },
                  ]}
                />
                <ProFormSelect
                  label={language("analyse.assets.assetType")}
                  name="type"
                  options={assetList}
                  fieldProps={{
                    mode: "tags",
                    tagRender: signleRender,
                  }}
                  onChange={(e) => {
                    let arr = e;
                    if(e.length > 1) {
                      arr.shift();
                    }
                  }}
                />
                <ProFormSelect
                  label={language("analyse.assets.asseVendor")}
                  name="vendor"
                  options={venderData}
                  showSearch
                  debounceTime={300}
                  fieldProps={{
                    getPopupContainer: () =>
                      document.getElementById("addContain"),
                    listHeight: 200,
                  }}
                />
                <ProFormText
                  label={language("analyse.assets.model")}
                  name="model"
                />
                <div id="area" style={{ position: "relative" }}>
                  <ProFormSelect
                    label={language("analyse.assets.assetlabel")}
                    name="label"
                    options={tagList}
                    allowClear
                    showArrow
                    value={selectTag}
                    fieldProps={{
                      tagRender: tagRenderFn,
                      dropdownRender: (menu) => {
                        return (
                          <div
                            style={{
                              maxHeight: "280px",
                            }}
                          >
                            {/* {menu} */}
                            <Menu
                              // items={tagList}
                              multiple
                              className="tagMenu"
                              selectedKeys={selectTag}
                              onMouseLeave={(e) => {
                                setIsHovering("");
                              }}
                            >
                              {tagList.map((item, index) => {
                                return (
                                  <Menu.Item
                                    key={item.key}
                                    onClick={(e, event) => {
                                      let selectList = [...selectTag];
                                      let idx = selectList.findIndex(
                                        (item, index) => {
                                          return item == e.key;
                                        }
                                      );
                                      if(idx >= 0) {
                                        selectList.splice(idx, 1);
                                      } else {
                                        selectList.push(e.key);
                                      }
                                      setSelectTag([...selectList]);
                                    }}
                                    onMouseLeave={(e) => {
                                      setIsHovering("");
                                    }}
                                  >
                                    <div
                                      className="testTag"
                                      onMouseEnter={(e) => {
                                        setIsHovering(item.key);
                                      }}
                                      onMouseLeave={(e) => {
                                        setIsHovering("");
                                      }}
                                    >
                                      <div>{item.label}</div>
                                      {selectTag?.indexOf(item.key) > -1 && (
                                        <img src={checkedIcon} />
                                      )}
                                      {selectTag?.indexOf(item.key) < 0 &&
                                        isHovering === item.key && (
                                          <img
                                            src={deleteIcon}
                                            style={{
                                              cursor: "pointer",
                                            }}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              delTagList(e, item);
                                            }}
                                          />
                                        )}
                                    </div>
                                  </Menu.Item>
                                );
                              })}
                            </Menu>
                            <Divider style={{ margin: "8px 0" }} />
                            <Form
                              name="basic"
                              layout="inline"
                              form={tagForm}
                              className="tagForm"
                              onFinish={(values) => {
                                addTagList(values);
                              }}
                            >
                              <Form.Item
                                rules={[
                                  {
                                    required: true,
                                    message: language("project.mandatory"),
                                  },
                                ]}
                                name="tag"
                              >
                                <Input
                                  placeholder={language(
                                    "analyse.assets.label.placeEnrter"
                                  )}
                                  allowClear
                                />
                              </Form.Item>
                              <Button icon={<PlusOutlined />} htmlType="submit">
                                {language("project.add")}
                              </Button>
                            </Form>
                          </div>
                        );
                      },
                      dropdownStyle: {
                        maxHeight: 280,
                      },
                      mode: "multiple",
                      value: selectTag,
                      getPopupContainer: () => document.getElementById("area"),
                      onDropdownVisibleChange: (open) => {
                        if(!open) {
                          tagForm.resetFields();
                        }
                      },
                    }}
                    onChange={(value) => {
                      setSelectTag([...value]);
                    }}
                  />
                </div>
                <ProFormSelect
                  label={language("analyse.assets.department")}
                  name="department"
                  hidden
                />
                <ProFormText
                  label={language("logmngt.terminal.personliable")}
                  name="person"
                  rules={[
                    {
                      pattern: regList.strmin1andmax64.regex,
                      message: regList.strmin1andmax64.alertText,
                    },
                  ]}
                />
                <ProFormText
                  label={language("analyse.assets.telephone")}
                  name="telephone"
                  rules={[
                    {
                      pattern: regList.phoneorlandline.regex,
                      message: regList.phoneorlandline.alertText,
                    },
                  ]}
                />
              </>
            )}
          </Form>
        </Drawer>
      </div>
    </Spin>
  );
};
