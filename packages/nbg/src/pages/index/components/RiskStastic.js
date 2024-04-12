import React, { useEffect, useState } from "react";
import { ProCard } from "@ant-design/pro-components";
import { language } from "@/utils/language";
import { useHistory } from "umi";
import { Select, message, Spin } from "antd";
import { Column } from "@ant-design/plots";
import { post } from "@/services/https";
import riskSta from "@/assets/images/index/riskSta.png";

const RiskStastic = (props) => {
  let history = useHistory();
  const { clientHeight } = props;
  const [riskData, setRiskData] = useState({});
  const [riskLoading, setRiskLoading] = useState(true);

  useEffect(() => {
    getRiskData("month");
  }, []);

  const getRiskData = (time) => {
    setRiskLoading(true);
    post("/cfg.php?controller=sysHeader&action=showHomeInfo", {
      area: "risk",
      riskType: time,
    }).then((res) => {
      if (!res.success) {
        setRiskLoading(false);
        message.error(res.msg);
        return false;
      }
      setRiskData(res.data.risk);
      setRiskLoading(false);
    });
  };

  const riskConfig = {
    data: riskData?.sysfalw,
    xField: "name",
    yField: "value",
    legend: false,
    minColumnWidth: 20,
    maxColumnWidth: 25,
    meta: {
      value: {
        alias: language("nbg.index.alias"),
      },
    },
    color: (e) => {
      if (e.name == "严重") {
        return "#D95040";
      } else if (e.name == "高危") {
        return "#EE752F";
      } else if (e.name == "中危") {
        return "#F2BD42";
      } else {
        return "#5087EC";
      }
    },
    yAxis: {
      grid: {
        line: {
          type: "line",
          style: {
            lineDash: [4, 5],
            lineWidth: 1,
          },
        },
      },
    },
    tooltip: {
      formatter: (value) => tooltipFormat(value),
    },
  };
  const tooltipFormat = (e) => {
    let obj = {};
    riskData?.sysfalw.map((item) => {
      if (item.name === e.name) {
        (obj.name = language("nbg.index.total.num")), (obj.value = item.num);
      }
    });
    return obj;
  };

  return (
    <ProCard
      headerBordered
      className="vioriskCard riskCard"
      title={
        <div className="cardTitle">
          <div className="titleImg">
            <img src={riskSta} />
          </div>
          <span>{riskData?.title}</span>
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
            getRiskData(e);
          }}
        />
      }
      bodyStyle={{
        paddingTop: 10,
      }}
    >
      {riskLoading ? (
        <Spin>
          <div style={{ height: clientHeight / 2, minHeight: 246.5 }}></div>
        </Spin>
      ) : (
        <div
          className="flexDiv"
          style={{ height: clientHeight / 2 + 10, minHeight: 246.5 }}
        >
          <div
            style={{ width: "45%", height: "100%", cursor: "pointer" }}
            onClick={() => {
              history.push({ pathname: "/analyse/resrisk", value: "1" });
            }}
          >
            <div
              style={{
                width: "100%",
                textAlign: "center",
                height: "22px",
                lineHeight: "22px",
                fontSize: "14px",
                marginTop: "5px",
              }}
            >
              <span className="sysflowPonit"></span>
              <span style={{ marginLeft: 10 }}>
                {language("analyse.resrisk.sysflaw")}
              </span>
            </div>
            <div
              style={{
                height: clientHeight / 2 - 10,
                minHeight: "245px",
                lineHeight:
                  clientHeight / 2 - 10 > 210
                    ? clientHeight / 2 - 10 + "px"
                    : "245px",
              }}
            >
              <Column
                {...riskConfig}
                style={{ height: clientHeight / 2 - 30, minHeight: 200 }}
              />
            </div>
          </div>
          <div style={{ width: "50%", height: "100%" }}>
            <div
              style={{ height: "50%", width: "100%", cursor: "pointer" }}
              onClick={() => {
                history.push({ pathname: "/analyse/resrisk", value: "2" });
              }}
            >
              <div
                style={{
                  width: "100%",
                  textAlign: "left",
                  height: "22px",
                  lineHeight: "22px",
                  fontSize: "14px",
                  marginTop: "5px",
                }}
              >
                <span className="sysflowPonit"></span>
                <span
                  style={{
                    marginLeft: 10,
                  }}
                >
                  {language("analyse.resrisk.type.weakpasd")}
                </span>
              </div>
              <div className="rankDiv">
                {riskData?.weakpwd?.map((item) => {
                  return (
                    <div className="rankItemDiv">
                      <div
                        className={
                          item.rank == 1
                            ? "rankFirst"
                            : item.rank == 2
                            ? "rankSecond"
                            : item.rank == 3
                            ? "rankThird"
                            : "rankOthers"
                        }
                      >
                        {item.rank}
                      </div>
                      <div className="nameDiv">{item.type}</div>
                      <div
                        className={
                          item.rank == 1
                            ? "firstNumDiv"
                            : item.rank == 2
                            ? "secondNumDiv"
                            : item.rank == 3
                            ? "thirdNumDiv"
                            : "otherNumDiv"
                        }
                      >
                        {item.num}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div
              style={{
                height: "50%",
                width: "100%",
                cursor: "pointer",
                marginTop: 5,
              }}
              onClick={() => {
                history.push({ pathname: "/analyse/resrisk", value: "3" });
              }}
            >
              <div
                style={{
                  width: "100%",
                  textAlign: "left",
                  height: "22px",
                  lineHeight: "22px",
                  fontSize: "14px",
                  marginTop: "10px",
                }}
              >
                <span className="sysflowPonit"></span>
                <span
                  style={{
                    marginLeft: 10,
                  }}
                >
                  {language("nbg.index.port.title")}
                </span>
              </div>
              <div className="rankDiv">
                {riskData?.port?.map((item) => {
                  return (
                    <div className="rankItemDiv">
                      <div
                        className={
                          item.rank == 1
                            ? "rankFirst"
                            : item.rank == 2
                            ? "rankSecond"
                            : item.rank == 3
                            ? "rankThird"
                            : "rankOthers"
                        }
                      >
                        {item.rank}
                      </div>
                      <div className="nameDiv">{item.type}</div>
                      <div
                        className={
                          item.rank == 1
                            ? "firstNumDiv"
                            : item.rank == 2
                            ? "secondNumDiv"
                            : item.rank == 3
                            ? "thirdNumDiv"
                            : "otherNumDiv"
                        }
                      >
                        {item.num}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </ProCard>
  );
};

export default RiskStastic;
