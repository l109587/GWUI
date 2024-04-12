import React, { useEffect, useState } from "react";
import { ProCard } from "@ant-design/pro-components";
import { language } from "@/utils/language";
import netSegment from "@/assets/images/index/netSegment.png";
import { Column } from "@ant-design/plots";
import { useHistory } from "umi";
import { Select, Spin } from "antd";
import { post } from "@/services/https";

const NetStastic = (props) => {
  const { clientHeight, netData, chartData } = props;

  const columnConfig = {
    data: chartData,
    xField: "name",
    yField: "value",
    color: "#12C189",
    appendPadding: [15, 0, 0, 0],
    label: {
      position: "top",
      layout: [
        {
          type: "interval-hide-overlap",
        }, // 数据标签文颜色自动调整
        {
          type: "adjust-color",
        },
      ],
    },
    legend: false,
    minColumnWidth: 20,
    maxColumnWidth: 25,
    meta: {
      value: {
        alias: language("nbg.index.alias"),
      },
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
  };

  return (
    <ProCard
      className="secondCard"
      title={
        <div className="cardTitle">
          <div className="titleImg">
            <img src={netSegment} />
          </div>
          <span>{netData.title}</span>
        </div>
      }
      headerBordered
      bodyStyle={{
        paddingTop: "4px",
      }}
    >
      <div style={{ height: clientHeight / 2 + 1, minHeight: 190 }}>
        <div className="lengedDiv">
          <div>
            <span className="pointLenged"></span>
            <span>{netData.chartsTitle}</span>
          </div>
        </div>
        <div
          style={{
            padding: "10px 20px",
            height: clientHeight / 2 - 75,
            minHeight: 125,
          }}
        >
          <Column
            {...columnConfig}
            style={{ height: clientHeight / 2 - 85, minHeight: 120 }}
          />
        </div>
        <div className="perentTitle">
          <span className="bluePoint"></span>
          <span style={{ marginLeft: 10 }}>{language("nbg.index.probe.deploy")}</span>
        </div>
        <div className="perentDiv">
          <div>{language("nbg.index.deploy.all")} {netData.all}</div>
          <div>{language("nbg.index.deploy.deployed")} {netData.deployed}</div>
          <div>{language("nbg.index.deploy.undeployed")} {netData.undeployed}</div>
        </div>
      </div>
    </ProCard>
  );
};

export default NetStastic;
