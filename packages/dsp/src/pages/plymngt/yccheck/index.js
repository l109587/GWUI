import { Card, Tabs } from "antd";
import IPbkList from "./components/ipblacklist";
import DobkList from "./components/domainblacklist";
import styles from "./index.less";

export default function () {
  return (
    <div
      className={styles.tab}
      style={{
        position: "relative",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Tabs defaultActiveKey="1" type="card" size="Large">
        <Tabs.TabPane tab="IP黑名单" key="1">
          <IPbkList />
        </Tabs.TabPane>
        <Tabs.TabPane tab="域名黑名单" key="2">
          <DobkList />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}
