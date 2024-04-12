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
} from "antd";
import { QuestionCircleOutlined, WarningFilled } from "@ant-design/icons";
import ScrollBar from "@/components/ScrollBar";
import { post, get } from "@/services/https";
import { language } from "@/utils/language";
import classNames from "classnames";
import styles from "./index.less";

export default (props) => {
  const { ifIndex, swip, info = {} } = props;
  const [termInfo, settermInfo] = useState([]);
  const termCradsHeight = document.body.clientHeight - 207;
  useEffect(() => {
    fetchTermInfo();
  }, [ifIndex, swip]);
  const fetchTermInfo = () => {
    post("/cfg.php?controller=assetMapping&action=showPortMAC", {
      start: 0,
      limit: 9999,
      ifindex: ifIndex,
      swip: swip,
    })
      .then((res) => {
        if (res.success) {
          settermInfo(res.data);
        } else {
          msg.error && message.error(msg.error);
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Row style={{ margin: "16px 32px" }}>
          <Col span={8}>
            <span>{language("project.netanalyse.nettopo.portname")}</span>
            <span>{info?.ifName}</span>
          </Col>
          <Col span={8}>
            <span>{language("project.netanalyse.nettopo.portmac")}</span>
            <span>{info?.phyMac}</span>
          </Col>
          <Col span={8}>
            <span>{language("project.netanalyse.nettopo.portmonitor")}</span>
            <span>
              {info?.termWarning > 0 ? (
                <span>
                  <WarningFilled style={{ color: "red" }} />{" "}
                  <span>存在风险/违规</span>
                </span>
              ) : (
                "安全"
              )}
            </span>
          </Col>
        </Row>
      </div>
      <div>
        <div>
          <span style={{ fontWeight: 600 }}>
            {language("project.netanalyse.nettopo.portdev")}（{termInfo.length}
            ）
          </span>
        </div>
        <div>
          <div style={{ height: termCradsHeight }}>
            <ScrollBar
              options={{
                suppressScrollX: true,
              }}
            >
              <div style={{ padding: 4, display: "flex", flexWrap: "wrap" }}>
                {termInfo?.map((term) => {
                  return (
                    <Card
                      bordered={false}
                      title={<div>{illegalRender(term.isWarning)}</div>}
                      className={styles.infoCard}
                      style={{ width: 280, margin: 8, cursor: "pointer" }}
                    >
                      <Space direction="vertical" style={{ width: "100%" }}>
                        <div className={styles.infoItem}>
                          <span>
                            {language("project.netanalyse.nettopo.devIP")}
                          </span>
                          <span style={{ color: "#7A7A7A" }}>{term.ip}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span>
                            {language("project.netanalyse.nettopo.devmac")}
                          </span>
                          <span style={{ color: "#7A7A7A" }}>{term.mac}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span>
                            {language("project.netanalyse.nettopo.devtype")}
                          </span>
                          <span>{term.devType}</span>
                        </div>
                      </Space>
                    </Card>
                  );
                })}
              </div>
            </ScrollBar>
          </div>
        </div>
      </div>
    </div>
  );
};
