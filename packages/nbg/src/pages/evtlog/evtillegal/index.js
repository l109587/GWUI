import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "umi";
import { ProCard } from "@ant-design/pro-components";
import { post, get } from "@/services/https";
import { RightOutlined } from "@ant-design/icons";
import DemoPie from "@/components/Charts/Pie/Pie";
import Column from "@/components/Charts/Column/Column";
import {
  Tooltip,
  Input,
  DatePicker,
  Space,
  message,
  Empty,
  Skeleton,
} from "antd";
import { language } from "@/utils/language";
import { TableLayout } from "@/components";
import { fetchAuth } from "@/utils/common";
import moment from "moment";
const { ProtableModule } = TableLayout;
const { Search } = Input;
const { RangePicker } = DatePicker;
import './index.less'
const dateFormat = "YYYY/MM/DD";
export default () => {
  const [collapsed, setCollapsed] = useState(false);
  const contentHeight = useSelector(({ app }) => app.contentHeight);
  const clientHeight = collapsed ? contentHeight - 300 : contentHeight - 532;
  const writable = fetchAuth();

  const columnlist = [
    {
      title: language("evtlog.evtsystem.timestamp"),
      dataIndex: "timestamp",
      key: "timestamp",
      width: 180,
      ellipsis: true,
      align: "left",
    },
    {
      title: language("evtlog.evtsystem.event"),
      dataIndex: "event",
      key: "event",
      width: 180,
      ellipsis: true,
      align: "left",
    },
    {
      title: language("evtlog.evtsystem.detail"),
      dataIndex: "detail",
      key: "detail",
      ellipsis: true,
      align: "left",
    },
  ];

  const [incID, setIncID] = useState(0);
  const [columns, setColumns] = useState(columnlist);
  const tableKey = "evtillegal";
  const apishowurl =
    "/cfg.php?controller=evtViolations&action=showEvtViolationsList";
  const rowKey = (record) => record.id;
  const [queryVal, setQueryVal] = useState(); //首个搜索框的值
  const [olddata, setOlddata] = useState(
    moment().subtract(1, "months").format(dateFormat)
  );
  const [newdata, setNewdata] = useState(moment().format(dateFormat));
  const [chartsData, setChartsData] = useState([]);
  const [chartsTit, setChartTit] = useState("");
  let searchVal = {
    queryVal: queryVal,
    begDate: olddata + " 00:00:00",
    endDate: newdata + " 23:59:59",
  }; //顶部搜索框值 传入接口

  const [renderChart, setRenderChart] = useState(true);

  useEffect(() => {
    getChartData();
  }, []);

  const getChartData = () => {
    post("/cfg.php?controller=evtViolations&action=showEvtViolationsChart", {
      begDate: olddata + " 00:00:00",
      endDate: newdata + " 23:59:59",
    }).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      if (res.success && res.data.length < 1) {
        setRenderChart(false);
      }
      setChartTit(res.title);
      const newData = [];
      res.data.map((item) => {
        newData.push({ name: item.event, value: Number(item.value) });
      });
      setChartsData(newData);
    });
    post("/cfg.php?controller=alaSetting&action=getEventList").then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      let typefillter = [];
      res?.data?.map((each) => {
        if (each.value == 2) {
          each?.child.map((item) => {
            typefillter.push({ text: item.text, value: item.value });
          });
        }
      });
      columnlist.map((item) => {
        if (item.dataIndex == "event") {
          item.filters = typefillter;
          item.filterMultiple = false;
          item.filterSearch = true;
        }
      });
      setColumns(columnlist);
    });
  };

  const showSearch = () => {
    return (
      <Space>
        <Search
          allowClear
          placeholder={language("nbgevtlog.evtillegal.searchText")}
          onSearch={(queryVal) => {
            setQueryVal(queryVal);
            setIncID(incID + 1);
          }}
        />
        <RangePicker
          defaultValue={[
            moment(olddata, dateFormat),
            moment(newdata, dateFormat),
          ]}
          format={dateFormat}
          onChange={(val, time) => {
            setNewdata(time[1]);
            setOlddata(time[0]);
            setIncID(incID + 1);
          }}
        />
      </Space>
    );
  };

  return (
    <ProCard direction="column" ghost gutter={[16, 16]}>
      <ProCard
        title={chartsTit}
        collapsed={collapsed}
        style={!collapsed ? { height: 287 } : {}}
        extra={
          <Tooltip
            title={
              collapsed
                ? language("illevent.expand")
                : language("illevent.stow")
            }
          >
            <RightOutlined
              rotate={!collapsed ? 90 : undefined}
              onClick={() => {
                setCollapsed(!collapsed);
              }}
            />
          </Tooltip>
        }
      >
        <ProCard colSpan="30%" ghost className="pieCard">
          {renderChart ? (
            <DemoPie
              data={chartsData}
              clientHeight={clientHeight - 500}
              angleField="value"
              colorField="name"
              innerRadius={0.6}
              noUnit={true}
              legend={false}
              showStatistic={true}
              showLabel={false}
            />
          ) : (
            <Empty className="circleEmpty" />
          )}
        </ProCard>
        <ProCard colSpan="70%" ghost>
          {renderChart ? (
            <Column
              emoPie
              data={chartsData}
              xField="name"
              yField="value"
              seriesField="name"
              isGroup={true}
              clientHeight={clientHeight - 500}
              noUnit={true}
              legend={false}
            />
          ) : (
            <Empty className="rectEmpty" />
          )}
        </ProCard>
      </ProCard>
      <ProCard ghost>
        <ProtableModule
          incID={incID}
          rowkey={rowKey}
          columns={columns}
          searchVal={searchVal}
          tableKey={tableKey}
          apishowurl={apishowurl}
          searchText={showSearch()}
          clientHeight={clientHeight}
          columnvalue={"evtillegalColVal"}
        />
      </ProCard>
    </ProCard>
  );
};
