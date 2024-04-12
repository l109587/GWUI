import React, { useEffect, useState } from "react";
import { ProCard } from "@ant-design/pro-components";
import { message, Select, Skeleton } from "antd";
import { Column, Pie, Bar, Area } from "@ant-design/plots";
import { useSelector } from "umi";
import { post } from "@/services/https";

export default () => {
  const contentHeight = useSelector(({ app }) => app.contentHeight);
  const clientHeight = contentHeight;
  const [statisticData, setStatisticData] = useState({});
  const [alertData, setAlertData] = useState({});
  const [departData, setDepartData] = useState({});
  const [areaData, setAreaData] = useState({});
  const [stasticLoading, setStatisticLoading] = useState(true);
  const [alertLoading, setAlertLoading] = useState(true);
  const [departLoading, setDepartLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    showStatistic();
    showAlarm();
    showDepart();
    showAlarmChart("day");
  }, []);

  const showStatistic = () => {
    post("/cfg.php?controller=sysAnalyse&action=showCountStatistic", {
      dataType: "attack",
    }).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      setStatisticData(res);
      setStatisticLoading(false);
    });
  };

  const showAlarm = () => {
    post("/cfg.php?controller=sysAnalyse&action=showTopChart", {
      dataType: "src",
    }).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      setAlertData(res);
      setAlertLoading(false);
    });
  };

  const showDepart = () => {
    post("/cfg.php?controller=sysAnalyse&action=showTopChart", {
      dataType: "dest",
    }).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      setDepartData(res);
      setDepartLoading(false);
    });
  };

  const showAlarmChart = (time) => {
    post("/cfg.php?controller=sysAnalyse&action=showAlarmChart", {
      chartype: "attack",
      interval: time,
    }).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      setAreaData(res);
      setLoading(false);
    });
  };

  const columnConfig = {
    data: statisticData?.count?.data ? statisticData?.count?.data : [],
    color: "#F2BD42",
    xField: "key",
    yField: "value",
    appendPadding: [15, 0, 0, 0],
    minColumnWidth: 20,
    maxColumnWidth: 25,
    label: {
      layout: [
        {
          type: "interval-hide-overlap",
        }, // 数据标签文颜色自动调整
        {
          type: "adjust-color",
        },
      ],
    },
    tooltip: {
      formatter: (value) => {
        return {
          name: "数据",
          value: value.value,
        };
      },
    },
  };

  const pieConfig = {
    data: statisticData?.dispose?.data ? statisticData?.dispose?.data : [],
    angleField: "value",
    colorField: "key",
    appendPadding: 5,
    radius: 1,
    innerRadius: 0.64,
    legend: false,
    animation: false,
    statistic: false,
    interactions: [
      {
        type: "element-selected",
      },
    ],
  };

  const barConfig = {
    isAutoCenter: true,
    // appendPadding: [0,0,0,0],
    height: clientHeight / 5,
    color: "#FF983B",
    data: alertData.data ? alertData.data : [],
    xField: "value",
    yField: "key",
    tooltip: false,
    meta: {
      key: {
        alias: "类型",
      },
      value: {
        alias: "数量",
      },
    },
    legend: false,
    minBarWidth: 16,
    maxBarWidth: 16,
    label: {
      position: "right", // 或 'right'，根据需要选择合适的位置
      offset: 10,
      style: {
        fill: "#FF983B", // 设置文本颜色
      },
    },
    xAxis: {
      grid: {
        line: {
          style: {
            lineDash: [4, 3],
          },
        },
      },
    },
    tooltip: {
      title: (value) => {
        return value;
      },
      formatter: (value) => {
        return {
          name: "数据",
          value: value.value,
        };
      },
    },
  };

  const departConfig = {
    isAutoCenter: true,
    // appendPadding: [0,0,0,0],
    height: clientHeight / 5,
    data: departData.data ? departData.data : [],
    xField: "value",
    yField: "key",
    tooltip: false,
    meta: {
      key: {
        alias: "类型",
      },
      value: {
        alias: "数量",
      },
    },
    legend: false,
    minBarWidth: 16,
    maxBarWidth: 16,
    label: {
      position: "right", // 或 'right'，根据需要选择合适的位置
      offset: 10,
      style: {
        fill: "#6394f9", // 设置文本颜色
      },
    },
    xAxis: {
      grid: {
        line: {
          style: {
            lineDash: [4, 3],
          },
        },
      },
    },
    tooltip: {
      title: (value) => {
        return value;
      },
      formatter: (value) => {
        return {
          name: "数据",
          value: value.value,
        };
      },
    },
  };

  const areaConfig = {
    data: areaData.lines ? areaData.lines : [],
    xField: "time",
    yField: "value",
    seriesField: "name",
    color: "#F5CE73",
    appendPadding: [0, 20, 0, 20],
    yAxis: {
      grid: {
        line: {
          style: {
            lineDash: [4, 3],
          },
        },
      },
    },
    smooth: true,
    legend: {
      position: "top",
    },
  };

  return (
    <ProCard
      direction="column"
      gutter={[12, 12]}
      ghost
      className="analyseContent"
    >
      <ProCard gutter={12} ghost>
        <ProCard
          colSpan="50%"
          bordered
          title={statisticData?.count?.title ? statisticData?.count?.title : ""}
          bodyStyle={{ padding: "12px 24px" }}
        >
          {stasticLoading ? (
            <Skeleton.Input
              active
              style={{
                height: clientHeight / 3 - 120,
                minHeight: "150px",
                width: "100%",
              }}
            />
          ) : (
            <Column
              {...columnConfig}
              style={{ height: clientHeight / 3 - 120, minHeight: "150px" }}
            />
          )}
        </ProCard>
        <ProCard
          colSpan="50%"
          bordered
          title={
            statisticData?.dispose?.title ? statisticData?.dispose?.title : ""
          }
          bodyStyle={{ padding: "12px 24px" }}
        >
          {stasticLoading ? (
            <Skeleton.Avatar
              active
              style={{
                height: clientHeight / 3 - 120,
                width: clientHeight / 3 - 120,
                minHeight: "150px",
                minWidth: "150px",
              }}
            />
          ) : (
            <Pie
              {...pieConfig}
              style={{ height: clientHeight / 3 - 120, minHeight: "150px" }}
            />
          )}
        </ProCard>
      </ProCard>
      <ProCard gutter={12} ghost>
        <ProCard
          colSpan="50%"
          bordered
          title={
            alertData.title
              ? alertData.title + `（TOP${alertData.total}）`
              : " "
          }
        >
          {alertLoading ? (
            <Skeleton.Input
              active
              style={{
                height: clientHeight / 3 - 96,
                minHeight: 160,
                width: "100%",
              }}
            />
          ) : (
            <Bar
              {...barConfig}
              style={{ height: clientHeight / 3 - 96, minHeight: 160 }}
            />
          )}
        </ProCard>
        <ProCard
          colSpan="50%"
          bordered
          title={
            departData.title
              ? departData.title + `（TOP${departData.total}）`
              : " "
          }
        >
          {departLoading ? (
            <Skeleton.Input
              active
              style={{
                height: clientHeight / 3 - 96,
                minHeight: 160,
                width: "100%",
              }}
            />
          ) : (
            <Bar
              {...departConfig}
              style={{ height: clientHeight / 3 - 96, minHeight: 160 }}
            />
          )}
        </ProCard>
      </ProCard>
      <ProCard
        title={areaData?.title ? areaData.title : ""}
        extra={
          <Select
            dropdownMatchSelectWidth={100}
            defaultValue="day"
            options={[
              { value: "day", label: "最近一天" },
              { value: "week", label: "最近一周" },
              { value: "month", label: "最近一月" },
            ]}
            onChange={(e) => {
              showAlarmChart(e);
            }}
          />
        }
        bodyStyle={{
          paddingTop: 0,
        }}
      >
        {loading ? (
          <Skeleton.Input
            active
            style={{
              height: clientHeight / 3 - 66,
              minHeight: 160,
              width: "100%",
              marginTop: 20
            }}
          />
        ) : (
          <Area
            {...areaConfig}
            style={{ height: clientHeight / 3 - 66, minHeight: 160 }}
          />
        )}
      </ProCard>
    </ProCard>
  );
};
