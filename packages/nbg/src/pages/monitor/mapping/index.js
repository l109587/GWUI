import React, { useRef, useState, useEffect } from "react";
import { Button, Input, Alert, message, Tabs } from "antd";
import {
  AssetIdentification,
  Typelist,
  Fingerprint,
} from "./components";
import { language } from "@/utils/language";
import { useHistory } from "umi";
const { TabPane } = Tabs;
export default (props) => {
  let history = useHistory();
  let value = props.location?.state?.value;
  const delKey = () => {
    if (value) {
      let state = { ...props.location.state.value };
      delete state.value;
      history.replace({ ...history.location, state });
    }
  };
  const [checkedTabKey, setCheckedTabKey] = useState(1);

  const onChange = (key) => {
    setCheckedTabKey(key);
  };
  return (
    <div className="card-container">
      <Tabs
        type="card"
        defaultActiveKey={value ? "3" : "1"}
        onChange={onChange}
      >
        <TabPane
          tab={language("project.sysconf.analysis.assetsdistinguish")}
          key="1"
        >
          <AssetIdentification checkedTabKey={checkedTabKey} />
        </TabPane>
        <TabPane key="2" tab={language("project.sysconf.analysis.cardtitle")}>
          <Typelist checkedTabKey={checkedTabKey}/>
        </TabPane>
        <TabPane key="3" tab={language('monitor.mapping.tabTitle.fingerprint')}>
          <Fingerprint
            values={value}
            delKey={delKey}
            checkedTabKey={checkedTabKey}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};
