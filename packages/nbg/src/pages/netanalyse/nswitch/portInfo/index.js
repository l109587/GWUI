import React, { useRef, useState, useEffect, useMemo } from "react";
import { useLocation, useSelector } from "umi";
import {
  Tooltip,
  Input,
  Tag,
  Row,
  Col,
  Tabs,
  Popover,
  Space,
  Menu,
} from "antd";
import { ProCard } from "@ant-design/pro-components";
import PortTable from "./table";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { language } from "@/utils/language";
import { post, get } from "@/services/https";
import styles from "./port.less";
import { TableLayout } from "@/components";
const { ProtableModule } = TableLayout;
import { assetType } from "@/nbgUtils/nbgAssetsType";
import OSIcon from "@/nbgUtils/osIconType";
import classnames from "classnames";

import singleonl from "@/assets/images/nswitch/singleonl.png"; //单终端图例
import multipleonl from "@/assets/images/nswitch/multipleonl.png"; //多终端图例
import freel from "@/assets/images/nswitch/freel.png"; //空闲图例
import portThrunkl from "@/assets/images/nswitch/portthrunkl.png"; //Thrunk图例
import portlgt from "@/assets/images/nswitch/portlgt.png"; //绿色端口
import portgt from "@/assets/images/nswitch/portgt.png"; //灰色
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
import ruijie from "@/assets/switch/logo_ruijie.png"; //ruijie图标
import Memory from "@/assets/images/nswitch/memory_back.png"; //占用内存图标
import OrLight from "@/assets/images/nswitch/orLight.png"; //橙色灯图标
import GreenLight from "@/assets/images/nswitch/greenLight.png"; //绿灯图标
import RedLight from "@/assets/images/nswitch/redLight.png"; //红灯图标
import StopTop from "@/assets/images/nswitch/stop_top.png"; //阻断图例
import StopBot from "@/assets/images/nswitch/stop_bot.png"; //阻断图例下

const { Search } = Input;
const { TabPane } = Tabs;

export default function Prot(props) {
  const { ip } = props;
  const contentHeight = useSelector(({ app }) => app.contentHeight);
  const macTableHeight = contentHeight - 568; //mac列表高度和宽度

  const location = useLocation();
  const [portQueryVal, setPortQueryVal] = useState(""); //端口列表页面搜索框的值
  const [switchDetails, setSwitchDetails] = useState({}); //返回数据
  const tableHeight = { y: contentHeight - 548, x: "max-content" }; //列表高度和宽度
  const [ifInVAl, setIfInVAl] = useState('');
  const [incID, setIncID] = useState(0);
  const [panels, setPanels] = useState([]); //面板
  const [panelSelectKey, setPanelSelectKey] = useState('1'); //面板

  const statusMap = {
    0: language("netanalyse.nettopo.colSta"),
    1: language("netanalyse.nettopo.idleSta"),
    2: language("netanalyse.nettopo.onlineSta"),
  };
  const linkMap = {
    0: "",
    1: "Trunk",
    2: "Access",
    3: "Hybrid",
  };
  let searchVal = { swip: ip,bdnum:panelSelectKey }; //顶部搜索框值 传入接口

  let macSearchVal = {
    ifindex: ifInVAl,
    queryVal: portQueryVal,
    swip: ip,
  };

  useEffect(() => {
    switchDetail();
  }, [panelSelectKey]);

  //获取端口详细信息
  const switchDetail = () => {
    post("/cfg.php?controller=assetMapping&action=showSwitchDetail", {
      start: 0,
      limit: 50,
      swip: ip,
      bdnum:panelSelectKey
    })
      .then((res) => {
        setSwitchDetails(res.data);
        const numMap = {
          0:'一',
          1:'二',
          2:'三',
          3:'四',
        }
        const panelData = Array(res.data.bdcount)
          .fill()
          .map((item, index) => ({
            label: `面板${numMap[index]}`,
            key: index + 1,
          }));
        setPanels(panelData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const statusFilters = [
    {
      text: "在线",
      value: "2",
    },
    {
      text: "空闲",
      value: "1",
    },
    {
      text: "关闭",
      value: "0",
    },
  ];

  const columnsList = [
    {
      title: language("project.sysconf.network.status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 80,
      filterMultiple: false,
      filters: statusFilters,
      render: (val) => {
        let color = "default";
        switch (val) {
          case "0":
            color = "default";
            break;
          case "1":
            color = "default";
            break;
          case "2":
            color = "success";
        }
        return (
          <Tag style={val == "0" && { border: "1px solid #000" }} color={color}>
            {statusMap[val]}
          </Tag>
        );
      },
    },
    {
      title: language("netanalyse.nswitch.link"),
      dataIndex: "link",
      key: "link",
      align: "center",
      width: 80,
      render: (val) => {
        let color = "cyan";
        switch (val) {
          case '1':
            color = "blue";
            break;
          case '2':
            color = "cyan";
            break;
          case '3':
            color = "orange";
            break;
        }
        return <Tag color={color}>{linkMap[val]}</Tag>;
      },
    },
    {
      title: "接口名称",
      dataIndex: "ifName",
      key: "ifName",
      align: "left",
      ellipsis: true,
      width: 150,
    },
    {
      title: "速率",
      dataIndex: "rate",
      key: "rate",
      align: "left",
      ellipsis: true,
      width: 100,
    },
    {
      title: language("netanalyse.nswitch.phyMac"),
      dataIndex: "phyMac",
      key: "phyMac",
      align: "left",
      ellipsis: true,
      width: 150,
    },
    {
      title: "VLAN",
      dataIndex: "VLANID",
      key: "VLANID",
      align: "left",
      ellipsis: true,
      width: 120,
    },
    {
      title: language("netanalyse.nswitch.macCnt"),
      dataIndex: "macCnt",
      key: "macCnt",
      align: "center",
      width: 100,
      render: (val, record) =>
        val > 0 ? (
          <a
            onClick={(e) => {
              setIfInVAl(record.ifIndex);
              ckickPort(e, record.ifIndex);
            }}
          >
            {val}
          </a>
        ) : (
          0
        ),
    },
    {
      title: language("netanalyse.nswitch.inBps"),
      dataIndex: "inBps",
      key: "inBps",
      align: "left",
      width: 100,
      ellipsis: true,
    },
    {
      title: language("netanalyse.nswitch.outBps"),
      dataIndex: "outBps",
      key: "outBps",
      align: "left",
      width: 100,
      ellipsis: true,
    },
    {
      title: "接口描述",
      dataIndex: "describe",
      key: "describe",
      align: "left",
      ellipsis: true,
      width: 180,
    },
  ];
  const termColumnsList = [
    {
      title: language("project.analyse.illinn.addr"),
      dataIndex: "ip",
      key: "ip",
      align: "left",
      ellipsis: true,
      width: "25%",
    },
    {
      title: language("project.analyse.illout.mac"),
      dataIndex: "mac",
      key: "mac",
      align: "left",
      ellipsis: true,
      width: "25%",
    },
    {
      title: "资产类型",
      dataIndex: "devType",
      key: "devType",
      align: "left",
      width: "25%",
      render: (text, record) => {
        return [
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className={styles.typeIcon}>{assetType(record.devIcon)}</div>
            <div className={styles.typeText}>{text}</div>
          </div>
        ];
      },
    },
    {
      title: "操作系统",
      dataIndex: "sysType",
      key: "sysType",
      align: "left",
      width: "25%",
      render: (text) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className={styles.osIcon}>{OSIcon(text)}</div>
            <div className={styles.typeText}>{text}</div>
          </div>
        );
      },
    },
  ];

  /* 顶部左侧搜索框*/
  const macSearch = () => {
    return (
      <Search
        placeholder="IP/MAC"
        allowClear
        className={styles.searchInput}
        onSearch={(queryVal) => {
          setPortQueryVal(queryVal);
          setIncID(incID + 1);
        }}
      />
    );
  };

  const onClickMenu = (values) =>{
      setPanelSelectKey(values.key)
      setIfInVAl("")
  }

  const ckickPort = (e, ifIndex) => {
    e.stopPropagation();
    setIfInVAl(ifIndex);
    setIncID(incID + 1);
  };
  const PortRender = () => {
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
          onClick={(e) => ckickPort(e, ifIndex)}
          className={styles.portItemContainer}
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
              className={classnames(styles.ifIndex, {
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
          onClick={(e) => ckickPort(e, ifIndex)}
          className={styles.portItemContainer}
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
              className={classnames(styles.ifIndex, {
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
              <div style={{ marginLeft: 10 }}>在线-单终端</div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={multipleonl}
                style={{ width: "21px", height: "20px" }}
              ></img>
              <div style={{ marginLeft: 10 }}>在线-多终端</div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={portThrunkl}
                style={{ width: "21px", height: "20px" }}
              ></img>
              <div style={{ marginLeft: 10 }}>Thunk口</div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={freel} style={{ width: "21px", height: "20px" }}></img>
              <div style={{ marginLeft: 10 }}>空闲</div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={portgt} style={{ width: "21px", height: "20px" }}></img>
              <div style={{ marginLeft: 10 }}>关闭</div>
            </div>
            {/* <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={StopTop}
                style={{ width: "21px", height: "20px" }}
              ></img>
              <div style={{ marginLeft: 10 }}>阻断</div>
            </div> */}
          </Space>
        </div>
      </div>
    );
    return (
      <div style={{position:'relative'}}>
        <div style={{display:'flex',height:30}}>
          <div style={{position:'absolute',zIndex:300}}>
            <Popover content={tipContent} trigger="click">
              <a style={{ display: "inline-block", marginLeft: 20,width:100,lineHeight:'30px',height:36 }}>
                <QuestionCircleOutlined style={{ marginRight: 4 }} />
                <span>查看图示说明</span>
              </a>
            </Popover>
          </div>
          {
            panels.length > 1 &&(
              <ProCard
                style={{ marginBottom: 2, }}
                bodyStyle={{
                  padding: 0,
                  margin:'0 auto'
                }}
              >
                <div>
                  <Menu
                    mode="horizontal"
                    items={panels}
                    triggerSubMenuAction="hover"
                    style={{ borderBottom: 0 }}
                    onClick={onClickMenu}
                    selectedKeys={panelSelectKey}
                    defaultSelectedKeys='1'
                    className={styles.menu}
                  />
                </div>
              </ProCard>
            )
          }
          
        </div>
        <div
          className={styles.paneContainer}
          onClick={() => {
            setIfInVAl("");
          }}
        >
          <div className={styles.protPane}>
            <div
              style={{ position: "absolute", top: 36, right: 30, width: 60 }}
            >
              <img src={Memory} alt="" />
              <div style={{ position: "absolute", top: 5, right: 7 }}>
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
                    <Col key={e.portId}>
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
                      <Col key={e.portId}>
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
                      <Col key={e.portId}>
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
                      <Col key={e.portId}>
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
                      <Col key={e.portId}>
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
        </div>
      </div>
    );
  };

  const MemoTable = useMemo(
    () => (
      <PortTable
        columns={columnsList}
        className="tablelist"
        tableKey="portTbale"
        rowkey={(record) => record.id}
        columnvalue="switchColumnvalue"
        searchVal={searchVal}
        // searchText={tableTopSearch()}
        apishowurl="/cfg.php?controller=assetMapping&action=showSwitchDetail"
        clientHeight={
          contentHeight > 650 ? tableHeight : { y: 480, x: "max-content" }
        }
      />
    ),
    [searchVal]
  );
  return (
    <ProCard bodyStyle={{ padding: "12px 0 0 0" }}>
      <PortRender />
      {ifInVAl ? (
        <ProtableModule
          clientHeight={contentHeight > 650 ? macTableHeight : 480}
          columnvalue="macColumnvalue"
          tableKey="macTable"
          columns={termColumnsList}
          incID={incID}
          searchVal={macSearchVal}
          searchText={macSearch()}
          apishowurl="/cfg.php?controller=assetMapping&action=showPortMAC"
          rowkey={(record) => record.id}
        />
      ) : (
        MemoTable
      )}
    </ProCard>
  );
}
