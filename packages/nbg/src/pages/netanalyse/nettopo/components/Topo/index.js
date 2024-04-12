import React, { useRef, useEffect, useState } from "react";
import {
  Col,
  Row,
  Button,
  Input,
  Space,
  Spin,
  message,
  Popconfirm,
  Radio,
  Typography,
} from "antd";
import GGEditor, { Koni, RegisterNode, RegisterEdge } from "gg-editor";
import { SaveOutlined, DeploymentUnitOutlined } from "@ant-design/icons";
import EditorMinimap from "./components/EditorMinimap";
import { KoniContextMenu } from "./components/EditorContextMenu";
import { KoniDetailPanel } from "./components/EditorDetailPanel";
import { KoniItemPanel } from "./components/EditorItemPanel";
import { KoniToolbar } from "./components/EditorToolbar";
import DevDetailDrawer from "./components/DevDetailDrawer";
import styles from "./index.less";
import G6 from "@antv/g6";
import store from "store";
import { post } from "@/services/https";
import { language } from "@/utils/language";

import CoreDevIcon from "@/assets/images/topo/core.svg";
import ConvergeDevIcon from "@/assets/images/topo/converge.svg";
import AccessDevIcon from "@/assets/images/topo/access.svg";
import ServerIcon from "@/assets/images/topo/server.svg";
import ServersIcon from "@/assets/images/topo/servers.svg";
import RouterIcon from "@/assets/images/topo/router.svg";
import FirewallIcon from "@/assets/images/topo/firewall.svg";
import Cloud from "@/assets/images/topo/cloud.svg";
import AutoProduceIcon from "@/assets/images/topo/autoProduce.png";
import SnapshotIcon from "@/assets/images/topo/snapshot.png";
import RestoreIcon from "@/assets/images/topo/restore.png";
import ErrorIcon from "@/assets/images/topo/error.png";
import SearchTerm from "@/assets/images/topo/searchTerm.png";

const { Search } = Input;
GGEditor.setTrackable(false);

const Graph = () => {
  const data = {
    nodes: [
      {
        id: "192.168.134.1",
        name: "核心交换机",
        x: 300,
        y: 60,
        shape: "core",
        icon: "",
        ifNum: 52,
        termNum: 3,
        cpu: 50,
        mem: 60,
        termWarning: 2,
      },
      {
        id: "192.168.134.162",
        name: "汇聚交换机",
        x: 220,
        y: 220,
        shape: "converge",
        ifNum: 52,
        termNum: 3,
        cpu: 50,
        mem: 60,
      },
      {
        id: "192.168.134.161",
        name: "汇聚交换机",
        x: 60,
        y: 220,
        shape: "converge",
        ifNum: 52,
        termNum: 3,
        cpu: 50,
        mem: 60,
      },
      {
        id: "192.168.134.163",
        name: "汇聚交换机",
        x: 380,
        y: 220,
        shape: "converge",
        parent: "ac6deeb8",
        ifNum: 52,
        termNum: 3,
        cpu: 50,
        mem: 60,
      },
      {
        id: "192.168.134.164",
        name: "汇聚交换机",
        x: 540,
        y: 220,
        shape: "converge",
        parent: "ac6deeb8",
        ifNum: 52,
        termNum: 3,
        cpu: 50,
        mem: 60,
      },
    ],
    edges: [
      {
        source: "192.168.134.1",
        target: "192.168.134.161",
      },
      {
        source: "192.168.134.1",
        target: "192.168.134.162",
      },
      {
        source: "192.168.134.1",
        target: "192.168.134.163",
      },
      {
        source: "192.168.134.1",
        target: "192.168.134.164",
      },
    ],
    groups: [
      {
        label: "新建分组",
        id: "ac6deeb8",
        x: 384.9560546875,
        y: 225.78125,
      },
    ],
  };
  let graphRef = useRef();
  const [graphData, setGraphData] = useState({});
  const [layoutType, setLayoutType] = useState("");
  const [flag, setFlag] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false); //抽屉显隐
  const [swip, setSwip] = useState(""); //选中交换机id
  const [loading, setLoading] = useState(true); //loading
  const [snapshotData, setSnapshotData] = useState([]); //快照数据
  const [snapshotOp, setSnapshotOp] = useState("restore"); //快照数据
  const [shotEditId, setShotEditId] = useState(""); //编辑id

  const shotInputRef = useRef(null);

  const reload = () => {
    setFlag(false);
    setTimeout(() => {
      setFlag(true);
      // centerLayout()
      if(graphRef.current){
        graphRef.current.propsAPI.currentPage.autoZoom();
        graphRef.current.propsAPI.currentPage.resetZoom();
      }
    });
  };

  let layout = new G6.Layout["dagre"]({
    rankdir: layoutType,
    ranksep: 30,
    nodesep: 25,
  });

  useEffect(() => {
    fetchTopology();
    // getSnapshot();
  }, []);
  // useEffect(() => {
  //   return () => {
  //     store.remove("photo");
  //   };
  // }, []);

  //居中布局
  const centerLayout = () => {
    const result = graphRef.current?.propsAPI.save();
    if (result.nodes) {
      // 计算所有节点的平均坐标
      const totalX = result.nodes.reduce((sum, node) => sum + node.x, 0);
      const totalY = result.nodes.reduce((sum, node) => sum + node.y, 0);
      const avgX = totalX / result.nodes.length;
      const avgY = totalY / result.nodes.length;
      // 获取画布的宽度和高度
      const canvasWidth =
        document.getElementsByClassName("graph-container")[0].clientWidth;
      const canvasHeight =
        document.getElementsByClassName("graph-container")[0].clientHeight;
      // 计算平移的距离
      const offsetX = canvasWidth / 2 - avgX;
      const offsetY = canvasHeight / 2 - avgY;
      // 批量更新节点的位置
      result.nodes.map((item) => {
        let node = graphRef.current.propsAPI.find(item.id);
        graphRef.current.propsAPI.update(node, {
          x: node.model.x + offsetX,
          y: node.model.y + offsetY,
        });
      });
    }
  };

  //自动生成
  const scanTopology = () => {
    post("/cfg.php?controller=assetMapping&action=scanTopology")
      .then((res) => {
        if (res.success) {
          res.msg && message.success(res.msg);
          fetchTopology()
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //获取topo数据
  const fetchTopology = () => {
    setLoading(true);
    post("/cfg.php?controller=assetMapping&action=showTopology")
      .then((res) => {
        if (res.success) {
          res?.data?.nodes.map((item) => {
            item.label =
              item.newNode == "Y"
                ? item.name
                : `${item.name ? item.name : ""} \n （${item.id}） `;
            item.labelOffsetY = 44;
            item.size = "52*52";
            // item.nodeType = item.type;
          });
          const index = res?.data?.nodes.findIndex(
            (item) => !(item.x || item.y)
          );

          const refresh = () => {
            return new Promise(function (resolve, reject) {
              setTimeout(() => {
                reload();
                resolve();
              }, 100);
            });
          };
          const changelayout = () => {
            return new Promise(function (resolve, reject) {
              setTimeout(() => {
                const result = graphRef.current?.propsAPI.save();
                setGraphData(result);
                setLayoutType("");
                resolve();
              }, 100);
            });
          };
          const p = new Promise(function (resolve, reject) {
            setTimeout(() => {
              setGraphData(res.data);
              resolve();
            }, 500);
          });


          if (index >= 0) {
            setLayoutType("TB");
            
            p.then(refresh)
              .then(changelayout)
              .then(refresh)
              .then(() => {
                setLoading(false);
              });
          } else {
            p.then(refresh)
             .then(()=>{
              setLoading(false);
             })
          }
          // centerLayout()
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const IconMap = {
    core: CoreDevIcon,
    converge: ConvergeDevIcon,
    access: AccessDevIcon,
    server: ServerIcon,
    servers: ServersIcon,
    router: RouterIcon,
    firewall: FirewallIcon,
    cloud: Cloud,
  };

  //取消所有高亮
  const cancelHighlight = (params) => {
    const allNodes = graphRef.current.propsAPI.save().nodes;
    allNodes.map((item) => {
      setTimeout(() => {
        graphRef.current.propsAPI.update(item.id, {
          highlight: "N",
          searchResult: null,
        });
      }, 0);
    });
  };
  //搜索
  const onSearchText = async (text) => {
    let node = graphRef.current.propsAPI.find(text);
    if (node) {
      cancelHighlight();
      // 改变视图位置显示节点
      let posObj = node.graph.getPoint({
        x: document.body.clientWidth / 2 - 300,
        y: document.body.clientHeight / 2 - 200,
      });
      let zoom = node.graph.getZoom();
      node.graph.translate(
        zoom * (posObj.x - node.bbox.centerX),
        zoom * (posObj.y - node.bbox.centerY)
      );
      graphRef.current.propsAPI.currentPage.clearSelected();
      // 高亮显示节点
      setTimeout(() => {
        graphRef.current.propsAPI.update(node, {
          highlight: "Y",
        });
        graphRef.current.propsAPI.currentPage.setSelected(node, text);
      }, 100);
    } else {
      const res = await post(
        "/cfg.php?controller=assetMapping&action=searchTermFrom",
        { IP: text }
      );
      if (res.success && res.total > 0) {
        const node = graphRef.current.propsAPI.find(res.data[0].swip);
        if (!node) {
          return;
        }
        cancelHighlight();
        // 改变视图位置显示节点
        let posObj = node.graph.getPoint({
          x: document.body.clientWidth / 2 - 300,
          y: document.body.clientHeight / 2 - 200,
        });
        let zoom = node.graph.getZoom();
        node.graph.translate(
          zoom * (posObj.x - node.bbox.centerX),
          zoom * (posObj.y - node.bbox.centerY)
        );
        graphRef.current.propsAPI.currentPage.clearSelected();
        res.data.map((item) => {
          const node = graphRef.current.propsAPI.find(item.swip);
          if (!node) {
            return;
          }
          setTimeout(() => {
            graphRef.current.propsAPI.update(node, {
              searchResult: {
                swip: item.swip,
                portName: item.portName,
                termType: res.type,
                termip: text,
              },
              highlight: "Y",
            });
            graphRef.current.propsAPI.currentPage.setSelected(node, item);
          }, 100);
        });
      }
    }
  };

  //设置快照
  const setSnapshot = (op, params = {}) => {
    const param = { op: op, ...params };
    post("/cfg.php?controller=assetMapping&action=setSnapshot", param).then(
      (res) => {
        if (!res.success) {
          res.msg && message.error(res.msg);
          return false;
        }
        res.msg && message.success(res.msg);
        getSnapshot();
      }
    );
  };
  //获取快照列表
  const getSnapshot = () => {
    post("/cfg.php?controller=assetMapping&action=showSnapshot").then((res) => {
      if (!res.success) {
        res.msg && message.error(res.msg);
        return false;
      }
      setSnapshotData(res.data);
    });
  };

  //删除快照
  const delSnapshot = (id) => {
    post("/cfg.php?controller=assetMapping&action=delSnapshot", {
      id: id,
    }).then((res) => {
      setSnapshotOp("restore");
      if (!res.success) {
        res.msg && message.error(res.msg);
        return false;
      }
      res.msg && message.success(res.msg);
      getSnapshot();
    });
  };

  const popContent = (props) => {
    const { name } = props;
    return (
      <Radio.Group
        onChange={(value) => {
          setSnapshotOp(value.target.value);
        }}
        value={snapshotOp}
      >
        {/* <Radio.Group> */}
        <div style={{ marginBottom: 8 }}>
          <Radio value="restore">恢复"{name}"</Radio>
          <Radio value="delete">删除"{name}"</Radio>
        </div>
        <div>
          <Radio value="edit">编辑"{name}"</Radio>
        </div>
      </Radio.Group>
    );
  };

  const confirm = (value) => {
    switch (snapshotOp) {
      case "delete":
        delSnapshot(value);
        break;
      case "edit":
        setShotEditId(value);
        setTimeout(() => {
          shotInputRef.current.focus({
            cursor: "all",
          });
        }, 200);
        break;

      default:
        break;
    }
  };
  const SnapshotRender = (
    <>
      {snapshotData.map((item) => {
        return item.id === shotEditId ? (
          <Input
            defaultValue={item.name}
            onBlur={(values) => {
              setShotEditId("");
              setSnapshotOp("restore");
              setSnapshot("mod", { id: item.id, name: values.target.value });
            }}
            style={{ padding: "1px 6px", width: 100 }}
            ref={shotInputRef}
          />
        ) : (
          <Popconfirm
            overlayClassName={styles.popconfirm}
            icon={null}
            title={popContent(item)}
            onConfirm={() => {
              confirm(item.id);
            }}
          >
            <Button
              type="default"
              style={{ height: 27, lineHeight: 1.2, maxWidth: 100 }}
            >
              <Typography.Text
                style={{
                  maxWidth: 80,
                }}
                ellipsis
              >
                {item.name}
              </Typography.Text>
            </Button>
          </Popconfirm>
        );
      })}
    </>
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: 15,
        }}
      >
        <Search
          placeholder={language("project.netanalyse.nettopo.searchText")}
          style={{ width: 200 }}
          onSearch={(queryVal) => {
            onSearchText(queryVal);
          }}
          allowClear={true}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => {
              scanTopology()
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={AutoProduceIcon} />
              <span style={{ display: "inline-block", marginLeft: 4 }}>
                {language("project.netanalyse.nettopo.automatically")}
              </span>
            </div>
          </Button>
          {/* <Button
            type="primary"
            onClick={() => {
              if (snapshotData.length == 3) {
                return message.error("最多存储3张快照");
              }
              setSnapshot("add");
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={SnapshotIcon} />
              <span style={{ display: "inline-block", marginLeft: 4 }}>
                快照
              </span>
            </div>
          </Button>
          <Button
            type="primary"
            onClick={() => {
              const data = store.get("photo");
              if (data) {
                setGraphData(data);
              } else {
                return false;
              }
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={RestoreIcon} />
              <span style={{ display: "inline-block", marginLeft: 4 }}>
                恢复
              </span>
            </div>
          </Button> */}
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={() => {
              let result = graphRef.current.propsAPI.save();
              if (result.nodes) {
                result.nodes.map((item) => {
                  item.x = Number(item.x.toFixed(1));
                  item.y = Number(item.y.toFixed(1));
                  if (!item.name) {
                    item.name = item.label;
                  }
                  delete item.label;
                  delete item.labelOffsetY;
                  delete item.size;
                  delete item.width;
                  delete item.height;
                  delete item.index;
                  delete item.highlight;
                  delete item.searchResult;
                });
              }
              if (result.edges) {
                result.edges.map((item) => {
                  delete item.lineWidth;
                  delete item.startPoint;
                  delete item.endPoint;
                  delete item.controlPoints;
                  delete item.index;
                });
              }
              if (result.groups) {
                result.groups.map((item) => {
                  delete item.index;
                  delete item.collapsed;
                });
              }
              post("/cfg.php?controller=assetMapping&action=saveTopology", {
                nodes: result.nodes,
                edges: result.edges,
                groups: result.groups,
              })
                .then((res) => {
                  if (res.success) {
                    res.msg && message.success(res.msg);
                  } else {
                    msg.error && message.error(msg.error);
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            }}
          >
            {language("project.save")}
          </Button>
        </Space>
      </div>
      <Spin
        size="large"
        tip={language("project.netanalyse.nettopo.loadingTip")}
        spinning={loading}
        wrapperClassName={styles.spin}
      >
        {flag && (
          <GGEditor className={styles.editor} ref={graphRef} id="graphId">
            <Row className={styles.editorHd}>
              <Col span={24}>
                <KoniToolbar
                  graphRef={graphRef}
                  setGraphData={setGraphData}
                  setLayoutType={setLayoutType}
                  reload={reload}
                  setLoading={setLoading}
                  SnapshotRender={SnapshotRender}
                />
              </Col>
            </Row>
            <Row className={styles.editorBd}>
              <Col span={2} className={styles.editorSidebar}>
                <KoniItemPanel />
              </Col>
              <Col span={16} className={styles.editorContent}>
                <Koni
                  className={styles.koni}
                  id="koni"
                  data={graphData}
                  graph={{
                    edgeDefaultShape: "nodirEdge",
                    nodeDefaultShape: "devnode",
                    fitView: true,
                    layout: layoutType && layout,
                  }}
                  onNodeDoubleClick={(item) => {
                    if (item?.item?.model?.newNode === "Y") {
                      return false;
                    }
                    setSwip(item.item.id);
                    setDrawerVisible(true);
                  }}
                  onAfterChange={(values) => {
                    const { item } = values;
                    if (values.action == "add" && values.item.type == "group") {
                      setTimeout(() => {
                        if (!item) {
                          return;
                        }
                        graphRef.current.propsAPI.update(item, {
                          newGroup: "Y",
                        });
                      }, 0);
                    }
                    //计算连接方向
                    if (values.action == "add" && values.item.type == "edge") {
                      setTimeout(() => {
                        graphRef.current.propsAPI.update(item, {
                          newEdge:"Y"
                        });
                      }, 0);
                      const sourceId = values.model.source;
                      const targetId = values.model.target;
                      const sourceNode =
                        graphRef.current.propsAPI.find(sourceId);
                      const targetNode =
                        graphRef.current.propsAPI.find(targetId);
                      const sourceType = sourceNode.model.type;
                      const targetType = targetNode.model.type;

                      const ruleMap = {
                        cloud: [],
                        router: ["cloud"],
                        core: ["router", "cloud"],
                        converge: ["core", "router", "cloud"],
                        access: ["converge", "core", "router", "cloud"],
                        servers: [
                          "access",
                          "converge",
                          "core",
                          "router",
                          "cloud",
                        ],
                        server: [
                          "access",
                          "converge",
                          "core",
                          "router",
                          "cloud",
                        ],
                        firewall: [
                          "access",
                          "converge",
                          "core",
                          "router",
                          "cloud",
                        ],
                      };
                      const targetIndex = ruleMap[sourceType]?.findIndex(
                        (i) => i == targetType
                      );
                      if (targetIndex >= 0) {
                        setTimeout(() => {
                          graphRef.current.propsAPI.update(item, {
                            target: sourceId,
                            source: targetId,
                          });
                        }, 0);
                      }
                    }
                  }}
                  onAfterItemUnselected={(values) => {
                    cancelHighlight();
                  }}
                  onMouseUp={(event)=>{
                    let state = false
                    let sedlength = 0
                    console.log(graphRef.current.propsAPI.getSelected(),'graphRef.current.propsAPI.getSelected()');
                    if(graphRef.current.propsAPI.getSelected().length>1){
                      state = graphRef.current.propsAPI.getSelected()[0].model.highlight === "Y"
                      graphRef.current.propsAPI.getSelected().map((item)=>{
                        if(item.type!=='node'){
                          state = true
                        }
                      })
                      sedlength = graphRef.current.propsAPI.getSelected().length
                    }
                    if(graphRef.current&&sedlength>1&&!state){
                      graphRef.current.propsAPI.currentPage.addGroup();
                      graphRef.current.propsAPI.currentPage.clearSelected()
                    }
                }}
                />
                <RegisterEdge
                  name="nodirEdge"
                  config={{
                    afterDraw: function afterDraw(item) {
                      const group = item.getGraphicGroup();
                      const keyShape = item.getKeyShape();
                      const model = item.getModel();
                      keyShape.attr({
                        endArrow: false,
                      });
                      const shape = group.addShape("path", {
                        style(item) {
                          const keyShape = item.getKeyShape();
                          const { strokeOpacity, stroke } = keyShape.attr();
                          return {
                            fillOpacity: strokeOpacity,
                            fill: stroke,
                          };
                        },
                      });
                    },
                  }}
                  extend="koni-base"
                />
                <RegisterNode
                  name="devnode"
                  config={{
                    afterDraw: function afterDraw(item) {
                      const group = item.getGraphicGroup();
                      const target = group.get("children")[0];
                      target.attr({ lineWidth: 0, opacity: 0 });
                      const model = item.getModel();
                      const keyShape = item.getKeyShape();
                      let width = 52;
                      let height = 52;
                      
                      const img = group.addShape("image", {
                        attrs: {
                          x: -width / 2,
                          y: -height / 2,
                          width: width,
                          height: height,
                          img: IconMap[model.type],
                        },
                        name: "image-shape",
                      });
                      if (model?.termWarning > 0) {
                        const warning = group.addShape("image", {
                          attrs: {
                            x: width / 3 - 10,
                            y: height / 2 - 10,
                            img: ErrorIcon,
                          },
                          name: "image-shape",
                        });
                      }
                      if (model.highlight === "Y") {
                        img.animate(
                          {
                            opacity: 0.2,
                            repeat: true, // 循环
                          },
                          500,
                          "easeCubic",
                          null,
                          0
                        ); // 无延迟
                        if (model.searchResult) {
                          const term = group.addShape("image", {
                            attrs: {
                              x: width / 3 - 10,
                              y: -(height / 2),
                              img: SearchTerm,
                            },
                            name: "image-shape",
                          });
                        }
                      }
                    },
                    anchor: [
                      [0.5, 0], // 上边中点
                      [0.5, 1], // 下边中点
                      [0, 0.5], // 左边中点
                      [1, 0.5], // 右边中点
                    ],
                  }}
                  extend="flow-rhombus" // 要继承的节点类型
                />
              </Col>
              <Col span={6} className={styles.editorSidebar}>
                <KoniDetailPanel />
                <EditorMinimap />
              </Col>
            </Row>
            <KoniContextMenu />
          </GGEditor>
        )}
      </Spin>
      {drawerVisible && (
        <DevDetailDrawer
          drawerVisible={drawerVisible}
          setDrawerVisible={setDrawerVisible}
          IP={swip}
        />
      )}
    </div>
  );
};

export default Graph;
