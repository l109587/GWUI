import React, { useRef, useState, useEffect } from "react";
import { Tabs } from "antd";
import { ProCard } from "@ant-design/pro-components";
import { get, post } from "@/services/https";
import "@/utils/index.less";
import "@/common/common.less";
import "./index.less";
import { Dhcp, Garp, Snmp } from "./components";
const { TabPane } = Tabs;
let H = document.body.clientHeight - 118;
var clientHeight = H;
export default () => {
  const formRef = useRef();
  const [activeKey, setActiveKey] = useState("bh");
  const [busNet, setBusNet] = useState([]);
  const [seaverNet, setSeaverNet] = useState([]);

  useEffect(() => {
    getEthList();
    getEthList(2);
  }, []);

  const getEthList = (effect = 1) => {
    let data = {};
    data.effect = effect;
    post("/cfg.php?controller=bridge&action=getEthList", data)
      .then((res) => {
        if (res.success) {
         if(effect == 1){
          console.log(res.data)
          setBusNet(res.data);
         }else {
          setSeaverNet(res.data);
         }
        }
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  return (
    <div
      className="aaccesspolicytemplate"
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
        <TabPane tab={"DHPC准入"} key="bh">
          <ProCard ghost title={"DHPC准入"}>
            <Dhcp clientHeight={clientHeight} busNet={busNet} seaverNet={seaverNet} />
          </ProCard>
        </TabPane>
        <TabPane tab={"SNMP准入"} key="zd">
          <ProCard ghost title={"SNMP准入"}>
            <Snmp clientHeight={clientHeight} />
          </ProCard>
        </TabPane>
        <TabPane tab={"GARP准入"} key="access">
          <ProCard ghost title={"GARP准入"}>
            <Garp clientHeight={clientHeight} />
          </ProCard>
        </TabPane>
      </Tabs>
    </div>
  );
};
