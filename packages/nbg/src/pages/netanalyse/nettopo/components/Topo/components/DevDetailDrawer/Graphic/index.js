import React, { useEffect, useState } from "react";
import { Graph, Vector } from "@antv/x6";
import "@antv/x6-react-shape";
import { Tooltip, Popover, Space, Tag, Card, Typography } from "antd";
import { WarningFilled } from "@ant-design/icons";
import { language } from "@/utils/language";
import { post } from "@/services/https";
import { msg } from "@/utils/fun";

import Portlgt from "@/assets/images/nswitch/portlgt.png"; //空闲绿色上
import Portgt from "@/assets/images/nswitch/portgt.png"; //灰色
import Portot from "@/assets/images/nswitch/portot.png"; //多终端橙黄色上
import Portbt from "@/assets/images/nswitch/portbt.png"; //Thunk蓝色上
import Portdgt from "@/assets/images/nswitch/portdgt.png"; //单终端暗绿色上
import Portlg from "@/assets/images/nswitch/portlg.png"; //空闲绿色下
import Portg from "@/assets/images/nswitch/portg.png"; //灰色
import Porto from "@/assets/images/nswitch/porto.png"; //多终端橙黄色下
import Portb from "@/assets/images/nswitch/portb.png"; //Thunk蓝色下
import Portdg from "@/assets/images/nswitch/portdg.png"; //单终端暗绿色下
import Huawei from "@/assets/switch/logo_huawei.png"; //huawei图标
import Cisco from "@/assets/switch/logo_cisco.png"; //cisco图标
import H3c from "@/assets/switch/logo_h3c.png"; //hsc图标
import Ruijie from "@/assets/switch/logo_ruijie.png"; //ruijie图标
import PaneBg from "@/assets/images/nswitch/panel_back.png"; //面板背景
import Term from "@/assets/images/topo/term.png"; //终端图示

import Memory from "@/assets/images/nswitch/memory_back.png"; //占用内存图标
import OrLight from "@/assets/images/nswitch/orLight.png"; //橙色灯图标
import GreenLight from "@/assets/images/nswitch/greenLight.png"; //绿灯图标
import RedLight from "@/assets/images/nswitch/redLight.png"; //红灯图标
import StopTop from "@/assets/images/nswitch/stop_top.png"; //阻断图例上
import StopBot from "@/assets/images/nswitch/stop_bot.png"; //阻断图例下
import singleonl from "@/assets/images/nswitch/singleonl.png"; //单终端图例
import multipleonl from "@/assets/images/nswitch/multipleonl.png"; //多终端图例
import freel from "@/assets/images/nswitch/freel.png"; //空闲图例
import portThrunkl from "@/assets/images/nswitch/portthrunkl.png"; //Thrunk图例
import Flowon from "@/assets/images/topo/flowon.png";
import Flowdown from "@/assets/images/topo/flowdown.png";

import "./index.less";
let H = document.body.clientHeight - 296;
var clientHeight = H > 600 ? H : 600;
var topoY = clientHeight / 2 - 60;
var topoX = 8;
export default (props) => {
  const { setShowType, setPortID, setPortInfo, setIfInVAl } = props;
  const [tooltipShow, setTooltipShow] = useState(false);
  useEffect(() => {
    getList();
  }, [props.swip]);

  const getList = () => {
    let data = {};
    data.swip = props.swip;
    data.start = 0;
    data.limit = 100;
    data.state = "0";
    post("/cfg.php?controller=assetMapping&action=showSwitchDetail", data)
      .then((res) => {
        if (!res.success) {
          msg(res);
          return false;
        }
        showSwitchDetail(res.data);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  /* tootip 显示框 */
  const registerPortTooltip = (container, text, offsetY) => {
    container.addEventListener("mouseenter", (e) => {
      let className = e.fromElement ? e.fromElement.className : "";
      if (className == "ant-modal-body") {
        return false;
      }
      const tooltip = document.querySelector(".x6-tooltip");
      const content = tooltip?.querySelector(".ant-tooltip-inner");
      if (content) {
        content.innerHTML = text;
        // tooltip.style.left = `${e.clientX - content.offsetWidth / 2 + 5}px`
        // tooltip.style.top = `${e.clientY - offsetY}px`
        tooltip.style.left = `${
          e.clientX - content.offsetWidth / 2 + 5 - 200
        }px`;
        tooltip.style.top = `${e.clientY - offsetY - 50}px`;
      }
    });
    container.addEventListener("mouseleave", () => {
      const tooltip = document.querySelector(".x6-tooltip");
      tooltip.style.left = "-3000px";
      tooltip.style.top = "-3000px";
    });
  };

  /* 内容 */
  const showSwitchDetail = (topoInfo) => {
    //cpu、内存占用图标渲染
    const CpuRender = () => {
      const cpu = topoInfo?.cpu || 0;
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
      const memory = topoInfo?.memory || 0;
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
    const graph = new Graph({
      container: document.getElementById("container"),
      width: "100%",
      height: clientHeight,
      attrs: {
        body: {
          fill: "#fff",
          stroke: "#fff",
        },
      },
      // 禁止节点移动
      interacting: function (cellView) {
        if (
          cellView.cell.getData() != undefined &&
          !cellView.cell.getData().disableMove
        ) {
          return { nodeMovable: false };
        }
        return true;
      },
    });
    const parent = graph.addNode({
      id: "parent",
      x: topoX,
      y: topoY,
      width: 875,
      height: 127,
      zIndex: 1,
      magnet: true,
      shape: "image",
      imageUrl: PaneBg,

      data: {
        disableMove: false, //true为可拖拽，false不可拖拽
      },
    });
    let oddLocalTopoX = topoX + 20;
    let evenLocalTopoX = topoX + 20;

    topoInfo.term.map((item, index) => {
      if (index % 2 == 0) {
        paddingTopo(parent, graph, item, index, oddLocalTopoX, topoY + 20);
        if (item.termNum) {
          let marginTopoY = topoY - 80;
          if (index % 4 == 0) {
            marginTopoY = topoY - 150;
          }
          marginTopo(graph, item, index, oddLocalTopoX, marginTopoY);
        }
        if (index == 10 || index == 22 || index == 34 || index == 46) {
          oddLocalTopoX = oddLocalTopoX + 35;
        } else {
          oddLocalTopoX = oddLocalTopoX + 25;
        }
      } else {
        paddingTopo(parent, graph, item, index, evenLocalTopoX, topoY + 64);
        if (item.termNum) {
          let marginTopoY = topoY + 250;
          if (index % 4 == 1) {
            marginTopoY = topoY + 180;
          }
          marginTopo(graph, item, index, evenLocalTopoX, marginTopoY);
        }
        if (index == 11 || index == 23 || index == 35 || index == 47) {
          evenLocalTopoX = evenLocalTopoX + 35;
        } else {
          evenLocalTopoX = evenLocalTopoX + 25;
        }
      }
    });
    let rightIconType = topoInfo.icon
      ? topoInfo.icon.substring(topoInfo.icon.lastIndexOf("/") + 1)
      : "";
    parent.addChild(
      graph.addNode({
        id: "parentright",
        x: 800,
        y: topoY + 36,
        width: 60,
        height: 64,
        zIndex: 10,
        magnet: true,
        shape: "react-shape",
        data: {
          disableMove: false, //true为可拖拽，false不可拖拽
        },
        component() {
          return (
            <div>
              <img src={Memory} alt="" />
              <div style={{ position: "absolute", top: 5, right: 7 }}>
                <CpuRender />
              </div>
              <div style={{ position: "absolute", top: 36, right: 7 }}>
                <MemoryRender />
              </div>
            </div>
          );
        },
      })
    );
  };
  const paddingTopo = (parent, graph, item, index, refX, refY) => {
    let iconType = item.portId % 2 !== 0 ? "up" : "down";
    let icon;

    const renderPortIcon = () => {
      if (item.status == "0") {
        return (icon = iconType == "up" ? Portgt : Portg);
      }
      if (item.isStoped === "Y") {
        return (icon = iconType == "up" ? StopTop : StopBot);
      }
      if (item.link == "1") {
        return (icon = iconType == "up" ? Portbt : Portb);
      }
      if (item.termNum == 0) {
        return (icon = iconType == "up" ? Portlgt : Portlg);
      } else if (item.termNum == 1) {
        return (icon = iconType == "up" ? Portdgt : Portdg);
      } else {
        return (icon = iconType == "up" ? Portot : Porto);
      }
    };

    const illegalRender = (status) => {
      let text =
        status === "Y"
          ? language("project.netanalyse.nettopo.iswarningtext")
          : language("project.netanalyse.nettopo.safe");
      let color = status === "Y" ? "red" : "cyan";
      return (
        <Tag style={{ marginRight: 0 }} color={color}>
          {text}
        </Tag>
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
          return (text = language("netanalyse.nswitch.port.thunk"));
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
    const renderCardTitle = (values) => {
      console.log(values, "values");
      let imgSrc = Portgt;
      const { status, isStoped, link, termNum, ifName } = values;
      const imgSrcmap = () => {
        if (status == "0") {
          return (imgSrc = Portgt);
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
    const popContent = () => {
      return (
        <Card
          title={renderCardTitle(item)}
          className="portInfoCard"
          style={{ width: 280, cursor: "pointer" }}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <div className="infoItem">
              <span>{language("project.netanalyse.nettopo.portmonitor")}</span>
              {illegalRender(item.termWarning)}
            </div>
            <div className="infoItem">
              <span>{language("project.netanalyse.nettopo.portstatus")}</span>
              <span>{renderState(item)}</span>
            </div>
            <div className="infoItem">
              <span>{language("project.netanalyse.nettopo.portrate")}</span>
              <span style={{ color: "#1677FF" }}>{item.rate}</span>
            </div>
            <div className="infoItem">
              <span>{language("project.netanalyse.nettopo.portmac")}</span>
              <span style={{ color: "#7A7A7A" }}>{item.phyMac}</span>
            </div>
            <div className="infoItem">
              <span>{language("project.netanalyse.nettopo.portnacnum")}</span>
              <span style={{ color: "#7A7A7A" }}>{item.macCnt}</span>
            </div>
            <div className="infoItem">
              <span>{language("project.netanalyse.nettopo.portvlan")}</span>
              <span>{item.currentVlan}</span>
            </div>
            <div className="infoItem">
              <span>{language("project.netanalyse.nettopo.portdes")}</span>
              <Typography.Text
                style={{
                  maxWidth: 150,
                }}
                ellipsis={{ tooltip: item.alias }}
              >
                {item.alias}
              </Typography.Text>
            </div>
            <div className="infoItem">
              <span>{language("project.netanalyse.nettopo.portflow")}</span>
              <div style={{ display: "flex" }}>
                {item.inBps && (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img src={Flowdown} style={{ margin: "0 3px" }} />
                    {item.inBps}
                  </div>
                )}
                {item.outBps && (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img src={Flowon} style={{ margin: "0 3px" }} />
                    {item.outBps}
                  </div>
                )}
              </div>
            </div>
          </Space>
        </Card>
      );
    };
    const colorMap = () => {
      if (item.status == "0") {
        return "#999999";
      }
      if (item.isStoped === "Y") {
        return "#999999";
      }
      if (item.link == "1") {
        return "#1d91ff";
      }
      if (item.termNum == 0) {
        return "#01f5b3";
      } else if (item.termNum == 1) {
        return "#0cb81e";
      } else {
        return "#ed6d02";
      }
    };
    parent.addChild(
      graph.addNode({
        id: item.portId,
        x: refX,
        y: refY,
        width: 26,
        zIndex: 10,
        shape: "react-shape",
        data: {
          disableMove: false, //true为可拖拽，false不可拖拽
        },
        component() {
          return (
            <Popover
              content={popContent}
              style={{ padding: 0 }}
              overlayClassName="popover"
            >
              {iconType == "up" && (
                <div
                  style={{
                    color: colorMap(),
                    textAlign: "center",
                    cursor: "pointer",
                    fontWeight: 800,
                    fontSize: 12,
                  }}
                >
                  {item.portId}
                </div>
              )}
              <div className="imgContainer">
                <img src={renderPortIcon()} alt="" />
              </div>
              {iconType !== "up" && (
                <div
                  style={{
                    color: colorMap(),
                    textAlign: "center",
                    cursor: "pointer",
                    fontWeight: 800,
                    fontSize: 12,
                  }}
                >
                  {item.portId}
                </div>
              )}
            </Popover>
          );
        },
      })
    );
  };
  const marginTopo = (graph, item, index, refX, refY) => {
    let iconType = item.portId % 2 !== 0 ? "up" : "down";
    graph.addNode({
      id: item.ip,
      x: refX - 3,
      y: refY, //实际120
      width: 34,
      height: 34,
      zIndex: 11,
      shape: "react-shape",
      data: {
        disableMove: false, //true为可拖拽，false不可拖拽
      },
      component() {
        return (
          <div
            className="wrap"
            onDoubleClick={() => {
              setShowType("term");
              setPortID(item.portId);
              setPortInfo(item);
              setIfInVAl(item.ifIndex);
            }}
          >
            <img src={Term} alt="" />
            <span className="termNum">{item.termNum}</span>
            {item.termWarning > 0 && (
              <span className="errorIcon">
                <WarningFilled />
              </span>
            )}
          </div>
        );
      },
    });
    const colorMap = () => {
      if (item.status == "0") {
        return "#888888";
      }
      if (item.isStoped === "Y") {
        return "#888888";
      }
      if (item.link == "1") {
        return "#1d91ff";
      }
      if (item.termNum == 0) {
        return "#888888";
      } else if (item.termNum == 1) {
        return "#0cb81e";
      } else {
        return "#ed6d02";
      }
    };
    const path = graph.addEdge({
      source: {
        cell: item.portId,
        anchor: {
          name: "top",
          args: {
            dx: 13,
            dy: iconType == "up" ? 0 : 45,
          },
        },
      },
      target: item.ip,
      attrs: {
        line: {
          targetMarker: null, //终点箭头
          stroke: colorMap(), // 线的颜色
          lineWidth: 1,
        },
      },
    });

    const view = graph.findViewByCell(path);
    if (view && item.isStoped != "Y" && item.status != "0") {
      const path = view.findOne("path");
      if (path) {
        const token = Vector.create("circle", {
          r: 4,
          fill: colorMap(),
        });
        token.animateAlongPath(
          {
            dur: "2s",
            repeatCount: "indefinite",
          },
          path
        );
        token.appendTo(path.parentNode);
      }
    }
  };

  return (
    <div>
      <div className="x6-graph-wrap">
        <div className="x6-graph" />
        <Tooltip title="content" overlayClassName="x6-tooltip" visible={true}>
          <span style={{ position: "relative", left: -3000, top: -3000 }} />
        </Tooltip>
      </div>
      <div id="container"></div>
    </div>
  );
};
