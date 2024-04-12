import React, { useEffect, useState } from "react";
import { ProCard, ProTable } from "@ant-design/pro-components";
import { language } from "@/utils/language";
import { Pie, Area } from "@ant-design/plots";
import assetSta from "@/assets/images/index/assetSta.png";
import { useHistory } from "umi";
import { Select, Progress, Button, message, Spin } from "antd";
import { post } from "@/services/https";
import trendIcon from "@/assets/images/index/trendIcon.svg";
import statisIcon from "@/assets/images/index/statisIcon.svg";
import { Chart } from "@antv/g2";
import Mock from "mockjs";

const AssetStastic = (props) => {
  let history = useHistory();
  const { clientHeight } = props;
  const [isArea, setIsArea] = useState(false);
  const [areaData, setAreaData] = useState([]);
  const [assetData, setAssetData] = useState({});
  const [assetLoading, setAssetLoading] = useState(true);

  const columns = [
    {
      title: (
        <div
          style={{
            height: clientHeight / 2 - 1 > 194 ? clientHeight / 11 - 3 + "px" : "43px",
            lineHeight: clientHeight / 2 - 1 > 194 ? clientHeight / 11 - 3 + "px" : "43px",
          }}
        >
          {language("index.nbg.assetstype")}
        </div>
      ),
      dataIndex: "type",
      align: "left",
      ellipsis: true,
      key: "type",
      width: 90,
      render: (text, record, _, action) => {
        return (
          <div
            style={{
              height: clientHeight / 2 - 1 > 230 ? clientHeight / 11 - 3 + "px" : "43px",
              lineHeight: clientHeight / 2 - 1 > 230 ? clientHeight / 11 - 3 + "px" : "43px",
            }}
          >
            {record.type}
          </div>
        );
      },
    },
    {
      title: language("index.nbg.assetscount"),
      dataIndex: "count",
      align: "center",
      ellipsis: true,
      key: "count",
      width: 120,
      render: (text, record, _, action) => {
        let count = Math.round(record.count);
        return (
          <div className="colcountDiv">
            <Progress
              percent={count}
              format={(percent) => `${percent + "%"}`}
              strokeColor="#1890ff"
            />
          </div>
        );
      },
    },
    {
      title: language("index.nbg.assetsnum"),
      dataIndex: "num",
      align: "center",
      ellipsis: true,
      key: "num",
      width: 70,
      render: (text, record, _, action) => {
        return (
          <Button
            type="link"
            size="small"
            className="asstypenum"
            onClick={() => {
              history.push({
                pathname: "/analyse/assets",
                state: { id: record.id },
              });
            }}
          >
            {record.num}
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    if (isArea) {
      showArea();
    } else {
      getAssetData();
    }
  }, [isArea]);

  const showArea = () => {
    setAssetLoading(true);
    post("/cfg.php?controller=sysHeader&action=showHomeInfo", {
      area: "asset",
      type: "trend",
    }).then((res) => {
      if (!res.success) {
        setAssetLoading(false);
        message.error(res.msg);
        return false;
      }
      setAreaData(res.data.asset.data);
      setAssetLoading(false);
    });
  };

  /* 饼图 */
  const getAssetData = () => {
    setAssetLoading(true);
    post("/cfg.php?controller=sysHeader&action=showHomeInfo", {
      area: "asset",
      type: "stastic",
    })
      .then((res) => {
        if (!res.success) {
          setAssetLoading(false);
          message.error(res.msg);
          return false;
        }
        setAssetData(res.data.asset);
        setAssetLoading(false);
      })
      .catch(() => {
        console.log("mistask");
      });
  };

  const config = {
    appendPadding: 10,
    data: assetData.pieData,
    angleField: "value",
    colorField: "type",
    color: [
      "#5087EC",
      "#64D96A",
      "#F2BD42",
      "#EE752F",
      "#81C5F6",
      "#3AA1FF",
      "#68BBC4",
    ],
    radius: 1,
    innerRadius: 0.64,
    legend: false,
    label: {
      type: "outer",
      formatter: (v) => {
        return v.type;
      },
    },
    statistic: {
      title: false,
      content: {
        offsetY: 4,
        style: {
          whiteSpace: "pre-wrap",
          textOverflow: "ellipsis",
        },
        customHtml: (container, view, datum, data) => {
          const { width } = container.getBoundingClientRect();
          const num = datum
            ? `${datum.value}`
            : `${data.reduce((r, d) => r + d.value, 0)}`;
          const text = datum ? datum.type : language("nbg.index.total");
          return (
            <div>
              <div style={{ fontSize: "22px", marginBottom: 10 }}>{num}</div>
              <div
                style={{
                  fontSize: "14px",
                  whiteSpace: "pre-wrap",
                  overflow: "ellipsis",
                  fontWeight: 500,
                }}
              >
                {text}
              </div>
            </div>
          );
        },
      },
    }, // 添加 中心统计文本 交互
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "pie-statistic-active",
      },
    ],
  };

  const areaConfig = {
    data: areaData,
    xField: "Date",
    yField: "scales",
    color: "#fee5d9",
    appendPadding: [12, 20, 0, 20],
    areaStyle: () => {
      return { fill: "l(100) 0:#a50f15 1:#fee5d9" };
    },
    yAxis: {
      grid: {
        line: {
          type: "line",
          style: {
            fillOpacity: 0.5,
            lineWidth: 1,
            lineDash: [4, 5],
          },
        },
      },
    },
    tooltip: {
      formatter: (value) => {
        return {
          name: "最近12小时发现资产数量",
          value: value.scales
        }
      }
    },
    animation: false,
    slider:
      areaData?.length < 3
        ? false
        : {
            trendCfg: {
              isArea: true,
            },
          },
  };

  return (
    <ProCard
      className="secondCard"
      title={
        <div className="cardTitle">
          <div className="titleImg">
            <img src={assetSta} />
          </div>
          <span>{assetData.title}</span>
        </div>
      }
      headerBordered
      extra={
        <Button
          size="small"
          type="link"
          icon={
            <img
              src={isArea ? statisIcon : trendIcon}
              style={{ marginBottom: 5, marginRight: 5 }}
            />
          }
          onClick={() => {
            setIsArea(!isArea);
          }}
        >
          {isArea ? language("nbg.index.ststic") : language("nbg.index.trend")}
        </Button>
      }
      bodyStyle={{
        padding: "0 12px 12px 12px",
      }}
    >
      {isArea ? (
        assetLoading ? (
          <Spin>
            <div
              style={{ height: clientHeight / 2 + 24, minHeight: 213 }}
            ></div>
          </Spin>
        ) : (
          <div className="trendDiv">
            <div
              style={{
                height: "22px",
                lineHeight: "22px",
                marginTop: "8px",
                fontSize: "14px",
              }}
            >
              <span className="assetPointer"></span>
              <span>{language("nbg.index.asset")}</span>
            </div>
            <Area
              {...areaConfig}
              style={{ height: clientHeight / 2 - 6, minHeight: 183 }}
            />
          </div>
        )
      ) : assetLoading ? (
        <div
          style={{
            height: clientHeight / 2 + 24,
            minHeight: 213,
          }}
        ></div>
      ) : (
        <ProCard ghost>
          <ProCard
            ghost
            colSpan={12}
            bodyStyle={{
              height: clientHeight / 2 + 24,
              padding: "12px 12px 12px 12px",
              minHeight: 213,
            }}
          >
            <Pie
              {...config}
              style={{
                height: clientHeight / 2 - 1,
                width: "100%",
                minHeight: 194,
              }}
            />
          </ProCard>
          <ProCard
            ghost
            colSpan={12}
            bodyStyle={{
              paddingTop: 5,
            }}
          >
            <ProTable
              className="autoTable"
              size="small"
              rowKey="index"
              style={{
                height: clientHeight / 2 - 1,
                width: "100%",
              }}
              columns={columns}
              bordered={false}
              cardBordered={false}
              scroll={{ y: clientHeight / 2 - 25 }}
              dataSource={assetData.list}
              search={false}
              options={false}
              pagination={false}
            />
          </ProCard>
        </ProCard>
      )}
    </ProCard>
  );
};

export default AssetStastic;
