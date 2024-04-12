import React, { useEffect, useState } from "react";
import { ProCard } from "@ant-design/pro-components";
import { language } from "@/utils/language";
import { useHistory } from "umi";
import { Select, message, Spin } from "antd";
import { post } from "@/services/https";
import violationSta from "@/assets/images/index/violationSta.png";
import illoutImg from "@/assets/images/index/illoutImg.png";
import seriesImg from "@/assets/images/index/seriesImg.png";
import IllinnImg from "@/assets/images/index/illinnImg.png";
import illsvrImg from "@/assets/images/index/illsvrImg.png";
import NmilcardImg from "@/assets/images/analyse/nbg-analyse-illinn-nmilcard.svg";
import NetcardImg from "@/assets/images/analyse/nbg-analyse-illinn-netcard.svg";
import AnonSummaryImg from "@/assets/images/analyse/analys-illser-anonsummary.svg";
import ProxySummaryImg from "@/assets/images/analyse/analys-illser-proxysummary.svg";
import RemoteSummaryImg from "@/assets/images/analyse/analys-illser-remotesummary.svg";
import LocationSummaryImg from "@/assets/images/analyse/analys-illser-locationsummary.svg";
const VioStastic = (props) => {
  let history = useHistory();
  const { clientHeight } = props;
  const [violateData, setViolateData] = useState({});
  const [vioLoading, setVioLoading] = useState(false);

  useEffect(() => {
    getVioStastic("month");
  }, []);

  const getVioStastic = (time) => {
    post("/cfg.php?controller=sysHeader&action=showHomeInfo", {
      area: "violate",
      violateType: time,
    }).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        setVioLoading(false);
        return false;
      }
      setViolateData(res.data.violation);
      setVioLoading(false);
    });
  };

  return (
    <ProCard
      className="vioriskCard"
      gutter={[10, 10]}
      direction="column"
      headerBordered
      bodyStyle={{
        padding: "12px",
      }}
      title={
        <div className="cardTitle">
          <div className="titleImg">
            <img src={violationSta} />
          </div>
          <span>{violateData?.title}</span>
        </div>
      }
      extra={
        <Select
          defaultValue={"month"}
          size="default"
          options={[
            { label: language("nbg.index.time.month"), value: "month" },
            { label: language("nbg.index.time.week"), value: "week" },
            { label: language("nbg.index.time.day"), value: "day" },
          ]}
          onChange={(e) => {
            setVioLoading(true);
            getVioStastic(e);
          }}
        />
      }
    >
      {vioLoading ? (
        <Spin>
          <div
            style={{
              height: clientHeight - 215,
              backgroundColor: "white",
              minHeight: "266.5px",
            }}
          ></div>
        </Spin>
      ) : (
        <ProCard gutter={[10, 10]} direction="column" ghost>
          <ProCard ghost gutter={[10, 10]}>
            <ProCard
              ghost
              colSpan={12}
              onClick={() => {
                history.push({ pathname: "/analyse/illout" });
              }}
              style={{
                cursor: "pointer",
              }}
            >
              <div
                className="violaItemDiv"
                style={{ height: clientHeight / 4 + 5, minHeight: 123 }}
              >
                <div className="outserStatisDIv">
                  <div className="titleDiv">
                    <span className="bgColorSpan outColor"></span>
                    <span className="textSpan">
                      {violateData?.illout?.title}
                    </span>
                  </div>
                  <div className="staNumDiv outNum">
                    {violateData?.illout?.num}
                  </div>
                  <div className="timesNum">
                    <span>{language("nbg.index.illout.times")}</span>
                    <span style={{ marginLeft: 10 }}>
                      {violateData?.illout?.count}
                    </span>
                  </div>
                </div>
                <div className="outserImgDiv">
                  <img
                    src={illoutImg}
                    style={{
                      width: clientHeight / 5 - 10,
                      height: clientHeight / 5 - 10,
                      minHeight: 76,
                      minWidth: 76,
                    }}
                  />
                </div>
              </div>
            </ProCard>
            <ProCard
              ghost
              colSpan={12}
              onClick={() => {
                history.push({ pathname: "/analyse/series" });
              }}
              style={{
                cursor: "pointer",
              }}
            >
              <div
                className="violaItemDiv"
                style={{ height: clientHeight / 4 + 5, minHeight: 123 }}
              >
                <div className="outserStatisDIv">
                  <div className="titleDiv">
                    <span className="bgColorSpan serColor"></span>
                    <span className="textSpan">
                      {violateData?.series?.title}
                    </span>
                  </div>
                  <div className="staNumDiv serNum">
                    {violateData?.series?.num}
                  </div>
                  <div className="timesNum">
                    <span>{language("nbg.index.find.times")}</span>
                    <span style={{ marginLeft: 10 }}>
                      {violateData?.series?.count}
                    </span>
                  </div>
                </div>
                <div className="outserImgDiv">
                  <img
                    src={seriesImg}
                    style={{
                      width: clientHeight / 5 - 10,
                      height: clientHeight / 5 - 10,
                      minHeight: 76,
                      minWidth: 76,
                    }}
                  />
                </div>
              </div>
            </ProCard>
          </ProCard>
          <ProCard ghost gutter={[10, 10]}>
            <ProCard
              ghost
              colSpan={12}
              onClick={() => {
                history.push({ pathname: "/analyse/illinn" });
              }}
              style={{
                cursor: "pointer",
              }}
            >
              <div
                className="violaItemDiv"
                style={{ height: clientHeight / 4 + 5, minHeight: 123 }}
              >
                <div className="innsvrDataDiv">
                  <div className="titleDiv">
                    <span className="bgColorSpan illColor"></span>
                    <span className="textSpan">
                      {violateData?.illinn?.title}
                    </span>
                  </div>
                  <div className="staticNumDiv">{violateData?.illinn?.num}</div>
                </div>
                <div className="innsvrImgDiv">
                  <div
                    className="imgContent"
                    style={{
                      width: clientHeight / 5 - 10,
                      height: clientHeight / 5 - 10,
                      minHeight: 76,
                      minWidth: 76,
                      borderRadius: "50%",
                    }}
                  >
                    <div className="innNetData">
                      <div className="itemInnData">
                        <img src={NmilcardImg}></img>
                        <span className="textSpan">{language("monitor.illegal.multiNic")}</span>
                        <span className="numSpan">{violateData?.illinn?.multiCard}</span>
                      </div>
                      <div className="itemInnData">
                        <img src={NetcardImg}></img>
                        <span className="textSpan">{language("monitor.mapping.ckWiw")}</span>
                        <span className="numSpan">{violateData?.illinn?.netIn}</span>
                      </div>
                    </div>
                  </div>
                  {/* <img src={IllinnImg} /> */}
                </div>
              </div>
            </ProCard>
            <ProCard
              ghost
              colSpan={12}
              onClick={() => {
                history.push({ pathname: "/analyse/illsvr" });
              }}
              style={{
                cursor: "pointer",
              }}
            >
              <div
                className="violaItemDiv"
                style={{ height: clientHeight / 4 + 5, minHeight: 123 }}
              >
                <div className="innsvrDataDiv">
                  <div className="titleDiv">
                    <span className="bgColorSpan isrColor"></span>
                    <span className="textSpan">
                      {violateData?.illsvr?.title}
                    </span>
                  </div>
                  <div className="staticNumDiv">{violateData?.illsvr?.num}</div>
                </div>
                <div className="innsvrImgDiv">
                  <div
                    className="srvimgContent"
                    style={{
                      width: clientHeight / 5 - 10,
                      height: clientHeight / 5 - 10,
                      minHeight: 76,
                      minWidth: 76,
                      borderRadius: "50%",
                    }}
                  >
                    <div className="innSvrData">
                      <div className="itemSvrData">
                        <div className="imgTitleDiv">
                          <img src={AnonSummaryImg}></img>
                          <span>{language("analyse.illsvr.anonser")}</span>
                        </div>
                        <span>{violateData?.illsvr?.anonser}</span>
                      </div>
                      <div className="itemSvrData">
                        <div className="imgTitleDiv">
                          <img src={ProxySummaryImg}></img>
                          <span>{language("analyse.illsvr.proxyser")}</span>
                        </div>
                        <span>{violateData?.illsvr?.proxyser}</span>
                      </div>
                      <div className="itemSvrData">
                        <div className="imgTitleDiv">
                          <img src={RemoteSummaryImg}></img>
                          <span>{language("analyse.illsvr.remoteser")}</span>
                        </div>
                        <span>{violateData?.illsvr?.remoteser}</span>
                      </div>
                      <div className="itemSvrData">
                        <div className="imgTitleDiv">
                          <img src={LocationSummaryImg}></img>
                          <span>{language("analyse.illsvr.locationser")}</span>
                        </div>
                        <span>{violateData?.illsvr?.locationser}</span>
                      </div>
                    </div>
                  </div>
                  {/* <img src={illsvrImg} /> */}
                </div>
              </div>
            </ProCard>
          </ProCard>
        </ProCard>
      )}
    </ProCard>
  );
};

export default VioStastic;
