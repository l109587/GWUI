import { Item, ItemPanel } from "gg-editor";
import React, { useRef, useEffect, useState } from "react";
import { Card } from "antd";
import styles from "./index.less";
import { AppstoreOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Drawer, Alert, Space, Upload, Input, Tooltip } from "antd";
import classnames from "classnames";
import { post } from "@/services/https";

import CoreDevIcon from "@/assets/images/topo/core.svg";
import ConvergeDevIcon from "@/assets/images/topo/converge.svg";
import AccessDevIcon from "@/assets/images/topo/access.svg";
import ServerIcon from "@/assets/images/topo/server.svg";
import ServersIcon from "@/assets/images/topo/servers.svg";
import RouterIcon from "@/assets/images/topo/router.svg";
import FirewallIcon from "@/assets/images/topo/firewall.svg";
import Cloud from "@/assets/images/topo/cloud.svg";
import RestoreFac from "@/assets/images/topo/restoreFac.png";
import AddDevIcon from "@/assets/images/topo/addDev.png";
import { language } from "../../../../../../../utils/language";

const KoniItemPanel = () => {
  const defaultIcon = [
    {
      uid: "0",
      name: "核心设备",
      thumbUrl: CoreDevIcon,
      type: "core",
    },
    {
      uid: "1",
      name: "汇聚设备",
      thumbUrl: ConvergeDevIcon,
      type: "converge",
    },
    {
      uid: "2",
      name: "接入设备",
      thumbUrl: AccessDevIcon,
      type: "access",
    },
    {
      uid: "3",
      name: "服务器堆",
      thumbUrl: ServersIcon,
      type: "servers",
    },
    {
      uid: "4",
      name: "服务器",
      thumbUrl: ServerIcon,
      type: "server",
    },
    {
      uid: "5",
      name: "防火墙",
      thumbUrl: FirewallIcon,
      type: "firewall",
    },
    {
      uid: "6",
      name: "路由器",
      thumbUrl: RouterIcon,
      type: "router",
    },
    {
      uid: "7",
      name: "云",
      thumbUrl: Cloud,
      type: "cloud",
    },
  ];
  const [editIconVisible, setEditIconVisible] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [fileList, setFileList] = useState([]);

  const onClose = () => {
    setEditIconVisible(false);
  };
  const uploadButton = (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src={AddDevIcon} alt="addDev" />
      </div>
    </div>
  );
  return (
    <ItemPanel className={styles.itemPanel}>
      <Card bordered={false} className={styles.card} trigger="hover">
        {defaultIcon.map((item) => {
          return (
            <Tooltip title={item.name}>
              <div>
                <Item
                  type="node"
                  size="52*52"
                  shape="devnode"
                  model={{
                    label: item.name,
                    labelOffsetY: 40,
                    // icon: item.thumbUrl,
                    newNode: "Y",
                    type: item.type,
                  }}
                  src={item.thumbUrl}
                />
              </div>
            </Tooltip>
          );
        })}
      </Card>
      {/* <div
        className={styles.editIcon}
        onClick={() => {
          setEditIconVisible(true);
        }}
      >
        <AppstoreOutlined className={styles.icon} />
        <span>{language('project.netanalyse.nettopo.custom')}</span>
      </div> */}
      <Drawer
        title={language('project.netanalyse.nettopo.customIcon')}
        placement="right"
        onClose={onClose}
        visible={editIconVisible}
        width={456}
        onClick={() => {
          setSelectedId("");
        }}
      >
        <Alert
          message={language('project.netanalyse.nettopo.addTip')}
          type="info"
          showIcon
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="link"
            disabled={!selectedId}
            icon={<DeleteOutlined />}
            style={{ padding: 0 }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {language('project.del')}
          </Button>
          <Space size="small" className={styles.space}>
            <img src={RestoreFac} style={{ width: 14 }} />
            <span style={{ color: "#1890FF" }}>{language('project.netanalyse.nettopo.refactory')}</span>
          </Space>
        </div>
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          maxCount= {1}
          fileList={fileList}
          // onPreview={handlePreview}
          // onChange={handleChange}
          className={styles.upload}
          itemRender={(originNode, file) => {
            return (
              <div
                className={styles.listContainer}
                onDoubleClick={() => {
                  setSelectedId(file.uid);
                }}
              >
                <div
                  className={styles.imgContainer}
                  className={classnames(styles.imgContainer, {
                    [styles.selectedStyle]: selectedId === file.uid,
                  })}
                >
                  <img src={file.thumbUrl} />
                </div>
                {selectedId === file.uid ? (
                  <Input
                    defaultValue={file.name}
                    onBlur={() => {
                      setSelectedId("");
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    style={{ padding: "1px 6px" }}
                  />
                ) : (
                  <div className={styles.text}>
                    {file.name ? file.name : language('netanalyse.nswitch.devname')}
                  </div>
                )}
              </div>
            );
          }}
        >
          {fileList.length > 12 ? null : uploadButton}
        </Upload>
      </Drawer>
    </ItemPanel>
  );
};

export default KoniItemPanel;
