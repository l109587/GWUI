import React, { useRef, useEffect, useState } from "react";
import {
  Button,
  Drawer,
  message,
  Popover,
  Space,
  Row,
  Col,
  Tooltip,
  Card,
  Segmented,
  Tag,
  Typography,
} from "antd";
import { QuestionCircleOutlined, WarningFilled } from "@ant-design/icons";
import ScrollBar from "@/components/ScrollBar";
import { post, get } from "@/services/https";
import styles from "./index.less";
import { language } from "@/utils/language";
import classNames from "classnames";

import Graphic from "./Graphic";
import TermInfo from "./TermInfo";

import singleonl from "@/assets/images/nswitch/singleonl.png"; //单终端图例
import multipleonl from "@/assets/images/nswitch/multipleonl.png"; //多终端图例
import freel from "@/assets/images/nswitch/freel.png"; //空闲图例
import portThrunkl from "@/assets/images/nswitch/portthrunkl.png"; //Thrunk图例
import StopTop from "@/assets/images/nswitch/stop_top.png"; //阻断图例上
import StopBot from "@/assets/images/nswitch/stop_bot.png"; //阻断图例下
import portlgt from "@/assets/images/nswitch/portlgt.png"; //绿色端口
import portgt from "@/assets/images/nswitch/portgt.png"; //关闭灰色
import portot from "@/assets/images/nswitch/portot.png"; //橙黄色
import portbt from "@/assets/images/nswitch/portbt.png"; //蓝色
import portdgt from "@/assets/images/nswitch/portdgt.png"; //暗绿色
import portlg from "@/assets/images/nswitch/portlg.png"; //绿色
import portg from "@/assets/images/nswitch/portg.png"; //灰色
import porto from "@/assets/images/nswitch/porto.png"; //橙黄色
import portb from "@/assets/images/nswitch/portb.png"; //蓝色
import portdg from "@/assets/images/nswitch/portdg.png"; //暗绿色
import huawei from "@/assets/switch/logo_huawei.png"; //huawei图标
import cisco from "@/assets/switch/logo_cisco.png"; //cisco图标
import h3c from "@/assets/switch/logo_h3c.png"; //hsc图标
import unknow from "@/assets/images/nswitch/logo_unknow.png"; //unknow
import ruijie from "@/assets/switch/logo_ruijie.png"; //ruijie图标
import Memory from "@/assets/images/nswitch/memory_back.png"; //占用内存图标
import OrLight from "@/assets/images/nswitch/orLight.png"; //橙色灯图标
import GreenLight from "@/assets/images/nswitch/greenLight.png"; //绿灯图标
import RedLight from "@/assets/images/nswitch/redLight.png"; //红灯图标
import TileIcon from "@/assets/images/topo/tile.png";
import TileIconGrey from "@/assets/images/topo/tile_grey.png";
import GraphicIcon from "@/assets/images/topo/graphic.png";
import GraphicIconGrey from "@/assets/images/topo/graphic_grey.png";
import DevIcon from "@/assets/images/topo/dev.png";
import DevIconGrey from "@/assets/images/topo/dev_grey.png";
import TermIcon from "@/assets/images/topo/termIcon.png";
import TermIconGrey from "@/assets/images/topo/termIcon_grey.png";
import Flowon from "@/assets/images/topo/flowon.png";
import Flowdown from "@/assets/images/topo/flowdown.png";

const DevDetailDrawer = (props) => {
  const termCradsHeight = document.body.clientHeight - 395;

  const { drawerVisible, setDrawerVisible, baseInfo = {}, IP } = props;
  const [switchDetails, setSwitchDetails] = useState({});
  const [portList, setPortList] = useState([]);
  const [state, setState] = useState("0");
  const [showType, setShowType] = useState("tile"); //平铺/图示切换
  const [portID, setPortID] = useState(""); //端口ID
  const [ifInVAl, setIfInVAl] = useState(""); //端口ifIndex
  const [portInfo, setPortInfo] = useState({}); //端口ifIndex
  const [ifTotal, setIfTotal] = useState({}); //不同状态接口数量

  const scrollbarRef = useRef(null);

  const onClose = () => {
    setDrawerVisible(false);
  };
  useEffect(() => {
    switchDetail();
  }, [IP]);

  useEffect(() => {
    fetchPortList();
  }, [IP]);

  //获取接口列表信息
  const fetchPortList = (status) => {
    post("/cfg.php?controller=assetMapping&action=showSwitchDetail", {
      start: 0,
      limit: 100,
      swip: IP,
      state: status,
    })
      .then((res) => {
        if (res.success) {
          setPortList(res.data?.term || []);
        } else {
          msg.error && message.error(msg.error);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //获取交换机详情信息
  const switchDetail = () => {
    post("/cfg.php?controller=assetMapping&action=showSwitchDetail", {
      start: 0,
      limit: 100,
      swip: IP,
      state: "0",
    })
      .then((res) => {
        if (res.success) {
          setSwitchDetails(res.data);
          setIfTotal({
            ifNum: res.data.ifNum,
            normalifNum: res.data.normalifNum,
            warningifNum: res.data.warningifNum,
            stopedifNum: res.data.stopedifNum,
          });
        } else {
          msg.error && message.error(msg.error);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const Legend = () => {
    const tipContent = (
      <div
        style={{
          padding: 10,
        }}
      >
        <div>
          <Space direction="vertical" size="middle">
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={singleonl}
                style={{ width: "21px", height: "20px" }}
              ></img>
              <div style={{ marginLeft: 10 }}>
                {language("netanalyse.nettopo.onlinesingle")}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={multipleonl}
                style={{ width: "21px", height: "20px" }}
              ></img>
              <div style={{ marginLeft: 10 }}>
                {language("netanalyse.nettopo.onlinemultiple")}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={portThrunkl}
                style={{ width: "21px", height: "20px" }}
              ></img>
              <div style={{ marginLeft: 10 }}>
                {language("project.netanalyse.nettopo.trunkmouth")}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={freel} style={{ width: "21px", height: "20px" }}></img>
              <div style={{ marginLeft: 10 }}>
                {language("netanalyse.nettopo.idleSta")}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={portgt} style={{ width: "21px", height: "20px" }}></img>
              <div style={{ marginLeft: 10 }}>
                {language("netanalyse.nettopo.colSta")}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={StopTop}
                style={{ width: "21px", height: "20px" }}
              ></img>
              <div style={{ marginLeft: 10 }}>
                {language("netanalyse.nettopo.stoped")}
              </div>
            </div>
          </Space>
        </div>
      </div>
    );
    return (
      <Popover content={tipContent} trigger="click">
        <a style={{ display: "inline-block", marginLeft: 10 }}>
          <QuestionCircleOutlined style={{ marginRight: 4 }} />
          <span>查看图示说明</span>
        </a>
      </Popover>
    );
  };
  const SwitchIcon = () => {
    if (switchDetails?.vender === "Huawei") {
      return <img src={huawei}></img>;
    } else if (switchDetails?.vender === "H3C") {
      return <img src={h3c}></img>;
    } else if (switchDetails?.vender === "Cisco") {
      return <img src={cisco}></img>;
    } else if (switchDetails?.vender === "Ruijie") {
      return <img src={ruijie}></img>;
    } else {
      return <img src={unknow}></img>;
    }
  };
  const clickPort = (portId, ifIndex) => {
    setState("0")
    post("/cfg.php?controller=assetMapping&action=showSwitchDetail", {
      start: 0,
      limit: 100,
      swip: IP,
      state: "0",
    })
      .then((res) => {
        if (res.success) {
          const scrollbarInstance = scrollbarRef.current;
          // 在这里调用相应的方法来滚动到顶部
          if (scrollbarInstance) {
            scrollbarInstance._container.scrollTop = 0;
          }
          const arr = res.data?.term|| [];
          const index = arr.findIndex((item) => item.portId === portId);
          const element = arr.splice(index, 1)[0];
          arr.splice(0, 0, element);
          setPortList(arr);
          setPortID(portId);
          setIfInVAl(ifIndex);
        } else {
          msg.error && message.error(msg.error);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const Pane = () => {
    const panesnum = Math.trunc(switchDetails?.term?.length / 12);
    const firdata = switchDetails?.term?.slice(0, 12);
    const secdata = switchDetails?.term?.slice(12, 24);
    const thirddata = switchDetails?.term?.slice(24, 36);
    const fourdata = switchDetails?.term?.slice(36, 48);
    const fifthdata = switchDetails?.term?.slice(48, 60);

    const infoItemImgMap = (type, state, isStoped, link, termNum) => {
      if (state == "0") {
        return type === "up" ? portgt : portg;
      }
      if (isStoped === "Y") {
        return type === "up" ? StopTop : StopBot;
      }
      if (link == "1") {
        return type === "up" ? portbt : portb;
      }
      if (termNum == 0) {
        return type === "up" ? portlgt : portlg;
      } else if (termNum == 1) {
        return type === "up" ? portdgt : portdg;
      } else {
        return type === "up" ? portot : porto;
      }
    };

    const infoItemColorMap = (state, isStoped, link, termNum) => {
      if (state == "0") {
        return "#999999";
      }
      if (isStoped === "Y") {
        return "#999999";
      }
      if (link == "1") {
        return "#1D91FF";
      }
      if (termNum == 0) {
        return "#01f5b3";
      } else if (termNum == 1) {
        return "#00d817";
      } else {
        return "#f06f03";
      }
    };

    function handleFootState(
      ifIndex,
      ifname,
      state,
      term_num,
      link,
      portId,
      isStoped
    ) {
      return (
        <div
          className={styles.portItemContainer}
          onClick={() => {
            clickPort(portId, ifIndex);
          }}
        >
          <div className={styles.imgContainer}>
            <img
              src={infoItemImgMap("bot", state, isStoped, link, term_num)}
              className={styles.img}
            ></img>
          </div>
          <Tooltip
            className={styles.portId}
            title={
              <div>
                <div>{ifname}</div>
                <div>
                  {language("project.netanalyse.nettopo.terminalnum")}:
                  {term_num}
                </div>
              </div>
            }
          >
            <div
              style={{
                color: infoItemColorMap(state, isStoped, link, term_num),
              }}
              className={classNames(styles.ifIndex, {
                [styles.ifIndexBg]: ifIndex == ifInVAl,
              })}
            >
              {portId}
            </div>
          </Tooltip>
        </div>
      );
    }
    function handleTopState(
      ifIndex,
      ifname,
      state,
      term_num,
      link,
      portId,
      isStoped
    ) {
      return (
        <div
          className={styles.portItemContainer}
          onClick={() => {
            clickPort(portId, ifIndex);
          }}
        >
          <Tooltip
            className={styles.portId}
            title={
              <div>
                <div>{ifname}</div>
                <div>
                  {language("project.netanalyse.nettopo.terminalnum")}:
                  {term_num}
                </div>
              </div>
            }
          >
            <div
              style={{
                color: infoItemColorMap(state, isStoped, link, term_num),
              }}
              className={classNames(styles.ifIndex, {
                [styles.ifIndexBg]: ifIndex == ifInVAl,
              })}
            >
              {portId}
            </div>
          </Tooltip>

          <div className={styles.imgContainer}>
            <img
              src={infoItemImgMap("up", state, isStoped, link, term_num)}
              className={styles.img}
            ></img>
          </div>
        </div>
      );
    }
    const CpuRender = () => {
      const cpu = switchDetails?.cpu || 0;
      let imgUrl;
      if (cpu > 80) {
        imgUrl = RedLight;
      } else if (cpu < 80 && cpu > 60) {
        imgUrl = OrLight;
      } else if (cpu < 60) {
        imgUrl = GreenLight;
      }
      return <img src={imgUrl} alt="cpu" />;
    };
    const MemoryRender = () => {
      const memory = switchDetails?.memory || 0;
      let imgUrl;
      if (memory >= 80) {
        imgUrl = RedLight;
      } else if (memory < 80 && memory > 60) {
        imgUrl = OrLight;
      } else if (memory <= 60) {
        imgUrl = GreenLight;
      }
      return <img src={imgUrl} alt="memory" />;
    };
    return (
      <div className={styles.protPane}>
        <div style={{ position: "absolute", top: 36, right: 30, width: 60 }}>
          <img src={Memory} alt="" />
          <div style={{ position: "absolute", top: 4, right: 7 }}>
            <CpuRender />
          </div>
          <div style={{ position: "absolute", top: 35, right: 7 }}>
            <MemoryRender />
          </div>
        </div>

        <div className={styles.paneItem}>
          <Row gutter={0}>
            {firdata
              ?.filter((item, index) => index % 2 === 0)
              .map((e) => (
                <Col key={e.portId}>
                  {handleTopState(
                    e.ifIndex,
                    e.ifName,
                    e.status,
                    e.termNum,
                    e.link,
                    e.portId,
                    e.isStoped
                  )}
                </Col>
              ))}
          </Row>
          <Row gutter={0}>
            {firdata
              ?.filter((item, index) => index % 2 !== 0)
              .map((e) => (
                <Col key={e.portid}>
                  {handleFootState(
                    e.ifIndex,
                    e.ifName,
                    e.status,
                    e.termNum,
                    e.link,
                    e.portId,
                    e.isStoped
                  )}
                </Col>
              ))}
          </Row>
        </div>
        {panesnum > 0 ? (
          <div className={styles.paneItem}>
            <Row gutter={0}>
              {secdata
                ?.filter((item, index) => index % 2 === 0)
                .map((e) => (
                  <Col key={e.portId}>
                    {handleTopState(
                      e.ifIndex,
                      e.ifName,
                      e.status,
                      e.termNum,
                      e.link,
                      e.portId,
                      e.isStoped
                    )}
                  </Col>
                ))}
            </Row>
            <Row gutter={0}>
              {secdata
                ?.filter((item, index) => index % 2 !== 0)
                .map((e) => (
                  <Col key={e.portid}>
                    {handleFootState(
                      e.ifIndex,
                      e.ifName,
                      e.status,
                      e.termNum,
                      e.link,
                      e.portId,
                      e.isStoped
                    )}
                  </Col>
                ))}
            </Row>
          </div>
        ) : null}
        {panesnum > 1 ? (
          <div className={styles.paneItem}>
            <Row gutter={0}>
              {thirddata
                ?.filter((item, index) => index % 2 === 0)
                .map((e) => (
                  <Col key={e.portId}>
                    {handleTopState(
                      e.ifIndex,
                      e.ifName,
                      e.status,
                      e.termNum,
                      e.link,
                      e.portId,
                      e.isStoped
                    )}
                  </Col>
                ))}
            </Row>
            <Row gutter={0}>
              {thirddata
                ?.filter((item, index) => index % 2 !== 0)
                .map((e) => (
                  <Col key={e.portid}>
                    {handleFootState(
                      e.ifIndex,
                      e.ifName,
                      e.status,
                      e.termNum,
                      e.link,
                      e.portId,
                      e.isStoped
                    )}
                  </Col>
                ))}
            </Row>
          </div>
        ) : null}
        {panesnum > 2 ? (
          <div className={styles.paneItem}>
            <Row gutter={0}>
              {fourdata
                ?.filter((item, index) => index % 2 === 0)
                .map((e) => (
                  <Col key={e.portId}>
                    {handleTopState(
                      e.ifIndex,
                      e.ifName,
                      e.status,
                      e.termNum,
                      e.link,
                      e.portId,
                      e.isStoped
                    )}
                  </Col>
                ))}
            </Row>
            <Row gutter={0}>
              {fourdata
                ?.filter((item, index) => index % 2 !== 0)
                .map((e) => (
                  <Col key={e.portid}>
                    {handleFootState(
                      e.ifIndex,
                      e.ifName,
                      e.status,
                      e.termNum,
                      e.link,
                      e.portId,
                      e.isStoped
                    )}
                  </Col>
                ))}
            </Row>
          </div>
        ) : null}
        {panesnum > 3 ? (
          <div className={styles.paneItem}>
            <Row gutter={0}>
              {fifthdata
                ?.filter((item, index) => index % 2 === 0)
                .map((e) => (
                  <Col key={e.portId}>
                    {handleTopState(
                      e.ifIndex,
                      e.ifName,
                      e.status,
                      e.termNum,
                      e.link,
                      e.portId,
                      e.isStoped
                    )}
                  </Col>
                ))}
            </Row>
            <Row gutter={0}>
              {fifthdata
                ?.filter((item, index) => index % 2 !== 0)
                .map((e) => (
                  <Col key={e.portid}>
                    {handleFootState(
                      e.ifIndex,
                      e.ifName,
                      e.status,
                      e.termNum,
                      e.link,
                      e.portId,
                      e.isStoped
                    )}
                  </Col>
                ))}
            </Row>
          </div>
        ) : null}
      </div>
    );
  };
  const illegalRender = (status) => {
    let text =
      status > 0
        ? language("project.netanalyse.nettopo.iswarningtext")
        : language("project.netanalyse.nettopo.safe");
    let color = status > 0 ? "red" : "cyan";
    return (
      <Tag style={{ marginRight: 0 }} color={color}>
        {text}
      </Tag>
    );
  };

  const renderCardTitle = (values) => {
    let imgSrc = portgt;
    const { status, isStoped, link, termNum, ifName } = values;
    const imgSrcmap = () => {
      if (status == "0") {
        return (imgSrc = portgt);
      }
      if (isStoped === "Y") {
        return (imgSrc = StopTop);
      }
      if (link == "1") {
        return (imgSrc = portThrunkl);
      }
      if (termNum == 0) {
        return (imgSrc = freel);
      } else if (termNum == 1) {
        return (imgSrc = singleonl);
      } else {
        return (imgSrc = multipleonl);
      }
    };

    return (
      <Space>
        <img src={imgSrcmap()} />
        <span>{ifName}</span>
      </Space>
    );
  };

  const renderState = (values) => {
    const { status, isStoped, link, termNum, ifName } = values;
    let text;
    const textMap = () => {
      if (status == "0") {
        return (text = language("netanalyse.nettopo.colSta"));
      }
      if (isStoped === "Y") {
        return (text = language("netanalyse.nettopo.stoped"));
      }
      if (link == "1") {
        return (text = language("project.netanalyse.nettopo.trunkmouth"));
      }
      if (termNum == 0) {
        return (text = language("netanalyse.nettopo.idleSta"));
      } else if (termNum == 1) {
        return (text = language("netanalyse.nettopo.onlinesingle"));
      } else {
        return (text = language("netanalyse.nettopo.onlinemultiple"));
      }
    };
    return <span>{textMap()}</span>;
  };

  //切换接口类型
  const changeType = (value) => {
    setPortID("");
    setIfInVAl("");
    setPortInfo({});
    setState(value);
    fetchPortList(value)
  };

  return (
    <Drawer
      title={language("netanalyse.nswitch.swtype")}
      placement="right"
      onClose={onClose}
      visible={drawerVisible}
      width={948}
    >
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <div>
            <span style={{ fontWeight: 600 }}>
              {showType === "term"
                ? language("netanalyse.nswitch.portinfo")
                : language("netanalyse.nswitch.devinfo")}
            </span>
            {showType !== "term" && <Legend />}
          </div>
          {showType !== "term" ? (
            <Space>
              <div
                onClick={() => {
                  setShowType("tile");
                }}
                style={{
                  cursor: "pointer",
                  color: showType === "tile" ? "#2B6AFD" : "#666",
                }}
              >
                <div className={styles.navContainer}>
                  <img
                    src={showType === "tile" ? TileIcon : TileIconGrey}
                    alt=""
                  />
                  <span className={styles.nav}>
                    {language("project.netanalyse.nettopo.tile")}
                  </span>
                </div>
              </div>
              <div
                onClick={() => {
                  setShowType("graphic");
                  setPortID("");
                  setIfInVAl("");
                  setPortInfo({});
                }}
                style={{
                  cursor: "pointer",
                  color: showType === "graphic" ? "#2B6AFD" : "#666",
                }}
              >
                <div className={styles.navContainer}>
                  <img
                    src={showType === "graphic" ? GraphicIcon : GraphicIconGrey}
                    alt=""
                  />
                  <span className={styles.nav}>
                    {language("project.netanalyse.nettopo.graphic")}
                  </span>
                </div>
              </div>
            </Space>
          ) : (
            <Space>
              <div
                onClick={() => {
                  setShowType("graphic");
                }}
                style={{
                  cursor: "pointer",
                  color: showType === "dev" ? "#2B6AFD" : "#666",
                }}
              >
                <div className={styles.navContainer}>
                  <img
                    src={showType === "dev" ? DevIcon : DevIconGrey}
                    alt=""
                  />
                  <span className={styles.nav}>
                    {language("project.netanalyse.nettopo.dev")}
                  </span>
                </div>
              </div>
              <div
                onClick={() => {
                  setShowType("term");
                }}
                style={{
                  cursor: "pointer",
                  color: showType === "term" ? "#2B6AFD" : "#666",
                }}
              >
                <div className={styles.navContainer}>
                  <img
                    src={showType === "term" ? TermIcon : TermIconGrey}
                    alt=""
                  />
                  <span className={styles.nav}>
                    {language("project.netanalyse.nettopo.term")}
                  </span>
                </div>
              </div>
            </Space>
          )}
        </div>
        {showType !== "term" && (
          <Space size="large" style={{ height: 60 }}>
            <div style={{ width: 136 }}>
              <SwitchIcon />
            </div>
            <div style={{ width: 230 }}>
              <span>{language("project.netanalyse.nettopo.devname")}</span>
              <span>{switchDetails.name}</span>
            </div>
            <div style={{ width: 230 }}>
              <span>{language("project.netanalyse.nettopo.devaddr")}</span>
              <span>{switchDetails.ip}</span>
            </div>
            <div style={{ width: 230 }}>
              <span>{language("project.netanalyse.nettopo.devmonitor")}</span>
              {switchDetails?.warningifNum > 0 ? (
                <span>
                  <WarningFilled style={{ color: "red" }} />{" "}
                  {language("project.netanalyse.nettopo.iswarningtext")}
                </span>
              ) : (
                <span>{language("project.netanalyse.nettopo.safe")}</span>
              )}
            </div>
          </Space>
        )}
      </div>
      {showType === "tile" && (
        <div>
          <Pane />
          <div style={{ padding: "24px 0 8px 0" }}>
            <Space>
              <span style={{ fontWeight: 600 }}>
                {language("netanalyse.nswitch.portinfo")}
              </span>
              <Segmented
                value={state}
                defaultValue="all"
                onChange={changeType}
                options={[
                  {
                    label: (
                      <div>
                        {language("project.netanalyse.nettopo.all")}
                        <span>{ifTotal.ifNum}</span>
                      </div>
                    ),
                    value: "0",
                  },
                  {
                    label: (
                      <div>
                        {language("project.netanalyse.nettopo.normal")}
                        <span>{ifTotal.normalifNum}</span>
                      </div>
                    ),
                    value: "1",
                  },
                  {
                    label: (
                      <div>
                        {language("project.netanalyse.nettopo.error")}
                        <span>{ifTotal.warningifNum}</span>
                      </div>
                    ),
                    value: "2",
                  },
                  {
                    label: (
                      <div>
                        {language("project.netanalyse.nettopo.stopedtext")}
                        <span>{ifTotal.stopedifNum}</span>
                      </div>
                    ),
                    value: "3",
                  },
                ]}
              />
            </Space>
          </div>
          <div style={{ height: termCradsHeight }}>
            <ScrollBar
              options={{
                suppressScrollX: true,
              }}
              ref={scrollbarRef}
            >
              <div style={{ padding: 4, display: "flex", flexWrap: "wrap" }}>
                {portList?.map((term) => {
                  return (
                    <Card
                      title={renderCardTitle(term)}
                      className={classNames(styles.infoCard, {
                        [styles.selected]: portID === term.portId,
                      })}
                      style={{ width: 280, margin: 8, cursor: "pointer" }}
                      onClick={() => {
                        setPortID(term.portId);
                        setIfInVAl(term.ifIndex);
                        setPortInfo(term);
                      }}
                      onDoubleClick={() => {
                        setPortID(term.portId);
                        setIfInVAl(term.ifIndex);
                        setShowType("term");
                        setPortInfo(term);
                      }}
                    >
                      <Space direction="vertical" style={{ width: "100%" }}>
                        <div className={styles.infoItem}>
                          <span>
                            {language("project.netanalyse.nettopo.portmonitor")}
                          </span>
                          {illegalRender(term.termWarning)}
                        </div>
                        <div className={styles.infoItem}>
                          <span>
                            {language("project.netanalyse.nettopo.portstatus")}
                          </span>
                          <span>{renderState(term)}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span>
                            {language("project.netanalyse.nettopo.portrate")}
                          </span>
                          <span style={{ color: "#1677FF" }}>{term.rate}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span>
                            {language("project.netanalyse.nettopo.portmac")}
                          </span>
                          <span style={{ color: "#7A7A7A" }}>
                            {term.phyMac}
                          </span>
                        </div>
                        <div className={styles.infoItem}>
                          <span>
                            {language("project.netanalyse.nettopo.portnacnum")}
                          </span>
                          <span style={{ color: "#7A7A7A" }}>
                            {term.macCnt}
                          </span>
                        </div>
                        <div className={styles.infoItem}>
                          <span>
                            {language("project.netanalyse.nettopo.portvlan")}
                          </span>
                          <span>{term.currentVlan}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span>
                            {language("project.netanalyse.nettopo.portdes")}
                          </span>
                          <Typography.Text
                            style={{
                              maxWidth: 165,
                            }}
                            ellipsis={{ tooltip: term.alias }}
                          >
                            {term.alias}
                          </Typography.Text>
                        </div>
                        <div className={styles.infoItem}>
                          <span>
                            {language("project.netanalyse.nettopo.portflow")}
                          </span>
                          <div
                            style={{ display: "flex"}}
                          >
                            {term.inBps && (
                              <div style={{display:'flex',alignItems:'center'}}>
                                <img
                                  src={Flowdown}
                                  style={{ margin: "0 3px" }}
                                />
                                {term.inBps}
                              </div>
                            )}
                            {term.outBps && (
                              <div style={{display:'flex',alignItems:'center'}}>
                                <img src={Flowon} style={{ margin: "0 3px" }} />
                                {term.outBps}
                              </div>
                            )}
                          </div>
                        </div>
                      </Space>
                    </Card>
                  );
                })}
              </div>
            </ScrollBar>
          </div>
        </div>
      )}
      {showType === "graphic" && (
        <Graphic
          setShowType={setShowType}
          setPortID={setPortID}
          setPortInfo={setPortInfo}
          setIfInVAl={setIfInVAl}
          swip={IP}
        />
      )}
      {showType === "term" && (
        <TermInfo ifIndex={ifInVAl} swip={IP} info={portInfo} />
      )}
    </Drawer>
  );
};

export default DevDetailDrawer;
