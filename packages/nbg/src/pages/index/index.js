import React, { useEffect, useState } from "react";
import { ProCard, StatisticCard } from "@ant-design/pro-components";
import "./index.less";
import { post } from "@/services/https";
import { useSelector, useHistory } from "umi";
import { language } from "@/utils/language";
import {
  TinyArea,
  AssetStastic,
  NetStastic,
  VioStastic,
  RiskStastic,
} from "./components";
import AuthCard from "@/components/Index/AuthCard/AuthCard";
import allAsset from "@/assets/images/index/allAsset.svg";
import cType from "@/assets/images/index/cType.svg";
import teprobe from "@/assets/images/index/teprobe.svg";
import vilation from "@/assets/images/index/vilation.svg";
import risk from "@/assets/images/index/risk.svg";
import onlineAsset from "@/assets/images/index/onlineAsset.svg";
import offlineAsset from "@/assets/images/index/offlineAsset.svg";
import aType from "@/assets/images/index/aType.svg";
import bType from "@/assets/images/index/bType.svg";
import addNum from "@/assets/images/index/addNum.svg";
import arcShadow from "@/assets/images/index/arcShadow.png";
import seriesImg from "@/assets/images/index/seriesImg.png";
import { message, Skeleton, Spin } from "antd";

export default () => {
  const contentHeight = useSelector(({ app }) => app.contentHeight);
  const clientHeight = contentHeight - 356;
  let history = useHistory();

  const [infoData, setInfoData] = useState({});
  const [stasitcData, setStasticData] = useState([]);
  const [netData, setNetData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStatusData();
    getStastic();
  }, []);

  const getStastic = () => {
    setLoading(true);
    post("/cfg.php?controller=sysHeader&action=showHomeInfo").then((res) => {
      if (!res.success) {
        setLoading(false);
        message.error(res.msg);
        return false;
      }
      setStasticData(res.data.statistic);
      setNetData(res.data.netsegment);
      setLoading(false);
    });
  };

  const renderImg = (type) => {
    if (type == 0) {
      return allAsset;
    } else if (type == 1) {
      return cType;
    } else if (type == 2) {
      return teprobe;
    } else if (type == 3) {
      return vilation;
    } else if (type == 4) {
      return risk;
    }
  };

  const leftIcon = (type) => {
    if (type == 0) {
      return onlineAsset;
    } else if (type == 1) {
      return aType;
    } else if (type == 2) {
      return onlineAsset;
    } else if (type == 3) {
      return addNum;
    } else if (type == 4) {
      return addNum;
    }
  };

  const rightIcon = (type) => {
    if (type == 0) {
      return offlineAsset;
    } else if (type == 1) {
      return bType;
    } else if (type == 2) {
      return offlineAsset;
    } else if (type == 3) {
      return addNum;
    } else if (type == 4) {
      return addNum;
    }
  };

  const renderFill = (type) => {
    if (type == 0) {
      return "#4785F7";
    } else if (type == 1) {
      return "#09A786";
    } else if (type == 2) {
      return "#2B90CB";
    } else if (type == 3) {
      return "#EE812C";
    } else if (type == 4) {
      return "#FFB13D";
    }
  };

  /*顶部状态图  */
  const getStatusData = () => {
    post("/cfg.php?controller=sysHeader&action=showSysInfo", {})
      .then((res) => {
        setInfoData(res);
      })
      .catch(() => {
        console.log("mistask");
      });
  };

  return (
    <div className="nbgIndexContent">
      <ProCard
        ghost
        gutter={[16, 16]}
        direction="column"
        bodyStyle={{
          margin: 0,
        }}
        className="nbgIndexAllCard"
        style={{ minWidth: "1095px" }}
      >
        {/* 1 */}
        <ProCard ghost gutter={[8, 8]} className="firstCard">
          {loading
            ? [1, 2, 3, 4, 5].map((item) => <ProCard loading={true} />)
            : stasitcData.map((item, index) => {
                return (
                  <ProCard
                    ghost
                    style={
                      index === 0
                        ? {
                            cursor: "pointer",
                            backgroundColor: renderFill(index),
                          }
                        : {
                            backgroundColor: renderFill(index),
                          }
                    }
                    onClick={() => {
                      if (index === 0) {
                        history.push({
                          pathname: "/analyse/assets",
                        });
                      }
                    }}
                  >
                    <div
                      className="itemCol"
                      style={{
                        backgroundImage: `url(${arcShadow})`,
                        objectFit: "contain",
                        backgroundSize: "100% 60%",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <div className="bgImgDiv">
                        <div className="heaerTitle">{item.title}</div>
                        <div className="stasticImgDiv">
                          <div className="recentData">
                            <span className="stasticNum">{item.num}</span>
                            <span className="times">{item.text}</span>
                          </div>
                          <div>
                            <img src={renderImg(index)} />
                          </div>
                        </div>
                        <div className="itemTypeDiv">
                          <div className="typeADiv">
                            <img src={leftIcon(index)} />
                            <span style={{ marginLeft: 6 }}>
                              {item.typeOneText}
                            </span>
                            <span style={{ marginLeft: 6 }}>
                              {item.typeOneNum}
                            </span>
                          </div>
                          <div className="typeBDiv">
                            <img src={rightIcon(index)} />
                            <span style={{ marginLeft: 6 }}>
                              {item.typeTwoText}
                            </span>
                            <span style={{ marginLeft: 6 }}>
                              {item.typeTwoNum}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ProCard>
                );
              })}
        </ProCard>
        {/* 2 */}
        <ProCard ghost gutter={[16, 16]}>
          <ProCard ghost={loading ? false : true} colSpan={16}>
            {loading ? (
              <ProCard ghost>
                <ProCard ghost>
                  <Skeleton.Avatar
                    active
                    style={{
                      height: clientHeight / 2 + 30,
                      minHeight: 194,
                      width: clientHeight / 2 + 30,
                      minWidth: 194,
                    }}
                  />
                </ProCard>
                <ProCard ghost>
                  <Skeleton.Input
                    active
                    style={{
                      height: clientHeight / 2 + 30,
                      minHeight: 194,
                      width: "100%",
                    }}
                  />
                </ProCard>
              </ProCard>
            ) : (
              <AssetStastic clientHeight={clientHeight} />
            )}
          </ProCard>
          <ProCard ghost={loading ? false : true} colSpan={8}>
            {loading ? (
              <Skeleton.Input
                active
                style={{
                  height: clientHeight / 2 + 30,
                  minHeight: 194,
                  width: "100%",
                }}
              />
            ) : (
              <NetStastic
                clientHeight={clientHeight}
                netData={netData}
                chartData={netData.data}
              />
            )}
          </ProCard>
        </ProCard>
        {/* 3 */}
        <ProCard ghost gutter={[16, 16]}>
          <ProCard
            ghost
            style={
              loading
                ? {
                    padding: 12,
                    backgroundColor: "#fff",
                  }
                : {}
            }
          >
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  flexWrap: "wrap",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width: "48%",
                  }}
                >
                  <Skeleton.Input
                    active
                    style={{
                      height: clientHeight / 4 + 5,
                      minHeight: 123,
                      width: "100%",
                    }}
                  />
                </div>
                <div
                  style={{
                    width: "48%",
                  }}
                >
                  <Skeleton.Input
                    active
                    style={{
                      height: clientHeight / 4 + 5,
                      minHeight: 123,
                      width: "100%",
                    }}
                  />
                </div>
                <div
                  style={{
                    width: "48%",
                    marginTop: 12,
                  }}
                >
                  <Skeleton.Input
                    active
                    style={{
                      height: clientHeight / 4 + 5,
                      minHeight: 123,
                      width: "100%",
                    }}
                  />
                </div>
                <div
                  style={{
                    width: "48%",
                    marginTop: 12,
                  }}
                >
                  <Skeleton.Input
                    active
                    style={{
                      height: clientHeight / 4 + 5,
                      minHeight: 123,
                      width: "100%",
                    }}
                  />
                </div>
              </div>
            ) : (
              <VioStastic clientHeight={clientHeight - 20} />
            )}
          </ProCard>
          <ProCard
            ghost
            style={
              loading
                ? {
                    padding: 12,
                    backgroundColor: "#fff",
                  }
                : {}
            }
          >
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  width: "100%",
                }}
              >
                <div style={{ width: "48%" }}>
                  <Skeleton.Input
                    active
                    style={{
                      height: clientHeight / 2 + 22,
                      minHeight: 258,
                      width: "100%",
                    }}
                  />
                </div>
                <div style={{ width: "48%" }}>
                  <Skeleton.Input
                    active
                    style={{
                      height: clientHeight / 4 + 5,
                      minHeight: 123,
                      width: "100%",
                    }}
                  />
                  <Skeleton.Input
                    active
                    style={{
                      height: clientHeight / 4 + 5,
                      minHeight: 123,
                      width: "100%",
                      marginTop: 12,
                    }}
                  />
                </div>
              </div>
            ) : (
              <RiskStastic clientHeight={clientHeight - 20} />
            )}
          </ProCard>
        </ProCard>
        {/* cpu状态图 */}
        <ProCard ghost>
          {loading ? (
            <ProCard ghost gutter={[16, 16]}>
              <ProCard loading></ProCard>
              <ProCard loading></ProCard>
              <ProCard loading></ProCard>
            </ProCard>
          ) : (
            <ProCard ghost gutter={[16, 16]}>
              <ProCard colSpan={8} ghost>
                <AuthCard infodata={infoData} />
              </ProCard>
              <ProCard colSpan={16} ghost>
                <TinyArea />
              </ProCard>
            </ProCard>
          )}
        </ProCard>
      </ProCard>
    </div>
  );
};
