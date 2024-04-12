import React, { useRef, useState, useEffect } from "react";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { EditableProTable, ProFormSelect } from "@ant-design/pro-components";
import Mock from "mockjs";
import {
  Button,
  Row,
  Col,
  Form,
  Popconfirm,
  Input,
  Space,
  Tag,
  message,
  Switch,
  Select,
} from "antd";
import { post, get, postAsync } from "@/services/https";
import store from "store";
import "@/utils/index.less";
import "./../..//index.less";
import { regList, regPortList, regIpList } from "@/utils/regExp";
import { language } from "@/utils/language";
import { fetchAuth } from "@/utils/common";
import { useSelector } from "umi";

const Mirror = (props) => {
  let columnvalue = "baseMirrorTable";
  const writable = fetchAuth();
  const [form] = Form.useForm();
  const actionRef = useRef();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true); //加载
  const startVal = 1;
  const [totalPage, setTotalPage] = useState(0); //总条数
  const [nowPage, setNowPage] = useState(1); //当前页码
  const initLtVal = store.get("mirrorPageSize")
    ? store.get("mirrorPageSize")
    : 10; //默认每页条数
  const [limitVal, setLimitVal] = useState(initLtVal); // 每页条目
  const [editableKeys, setEditableRowKeys] = useState([]);
  const [densitySize, setDensitySize] = useState("middle");
  const [columnsHide, setColumnsHide] = useState(
    store.get("baseMirrorTable")
      ? store.get("baseMirrorTable")
      : {
          id: { show: false },
        }
  ); //设置默认列
  let concealColumnList = {
    id: { show: false },
  };
  const [nameList, setNameList] = useState([]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: "5%",
      ellipsis: true,
    },
    {
      title: language("project.analyse.status"),
      width: "6%",
      dataIndex: "state",
      align: "center",
      renderFormItem: (all, { isEditable }) => {
        let record = all.entry;
        if (record.state == "Y") {
          return (
            <Switch
              checkedChildren={language("project.open")}
              unCheckedChildren={language("project.close")}
              defaultChecked
            />
          );
        } else {
          return (
            <Switch
              checkedChildren={language("project.open")}
              unCheckedChildren={language("project.close")}
            />
          );
        }
      },
      render: (text, record, index) => {
        let checked = true;
        if (record.state === "N") {
          checked = false;
        }
        return (
          <Switch
            checkedChildren={language("project.open")}
            unCheckedChildren={language("project.close")}
            checked={checked}
            onChange={(checked) => {
              console.log(checked);
              switchBn(record, checked);
            }}
          />
        );
      },
    },
    {
      title: language("monitor.basecfg.mirror.interface"),
      dataIndex: "interface",
      width: "12%",
      valueType: "select",
      renderFormItem: (all, { isEditable }) => {
        let record = all.entry;
        let list = [];
        dataSource.map((item) => {
          list.push({ text: item.interface, value: item.interface });
        });
        const oldList = list.map((item) => item.value);
        const result = nameList.filter((item) => !oldList.includes(item.value));
        return <Select options={result} defaultValue={record.interface} />;
      },
    },
    {
      title: language("monitor.basecfg.mirror.conState"),
      dataIndex: "conState",
      width: "12%",
      ellipsis: true,
      readonly: true,
      renderFormItem: (all, { isEditable }) => {
        let record = all.entry;
        if (record.conState == "Y") {
          return <CheckCircleFilled style={{ color: "#12C189" }} />;
        } else {
          return <CloseCircleFilled style={{ color: "#FF0000" }} />;
        }
      },
      render: (text, record, index) => {
        if (record.conState == "Y") {
          return <CheckCircleFilled style={{ color: "#12C189" }} />;
        } else {
          return <CloseCircleFilled style={{ color: "#FF0000" }} />;
        }
      },
    },
    {
      title: language("monitor.basecfg.mirror.infRate"),
      dataIndex: "infRate",
      width: "15%",
      ellipsis: true,
      readonly: true,
    },
    {
      title: language("monitor.basecfg.mirror.flowState"),
      dataIndex: "flowState",
      width: "28%",
      ellipsis: true,
      readonly: true,
      renderFormItem: (all, { isEditable }) => {
        let record = all.entry;
        if (record.flowState == "Y") {
          return <CheckCircleFilled style={{ color: "#12C189" }} />;
        } else {
          return <CloseCircleFilled style={{ color: "#FF0000" }} />;
        }
      },
      render: (text, record, index) => {
        if (record.flowState == "Y") {
          return <CheckCircleFilled style={{ color: "#12C189" }} />;
        } else {
          return <CloseCircleFilled style={{ color: "#FF0000" }} />;
        }
      },
    },
    {
      title: language("project.operate"),
      valueType: "option",
      width: "9%",
      align: "center",
      hideInTable: !writable,
      render: (text, record, _, action) => [
        <>
          <Button
            type="link"
            size="small"
            key="editable"
            onClick={() => {
              action?.startEditable?.(record.id);
            }}
          >
            {language("project.deit")}
          </Button>
          <Popconfirm
            okText={language("project.yes")}
            cancelText={language("project.no")}
            title={language("project.delconfirm")}
            onConfirm={() => {
              delConfig(record);
            }}
          >
            <Button type="link" size="small">
              {language("project.del")}
            </Button>
          </Popconfirm>
        </>,
      ],
    },
  ];

  useEffect(() => {
    getMirrorList();
    getTnterface();
    showTableConf();
  }, []);

  const getMirrorList = (pagestart = "", pagelimit = "") => {
    let page = pagestart != "" ? pagestart : startVal;
    let data = {};
    data.limit = pagelimit != "" ? pagelimit : limitVal;
    data.start = (page - 1) * data.limit;
    post("/cfg.php?controller=monitorManage&action=showOobConf", data).then(
      (res) => {
        if (!res.success) {
          setLoading(false);
          message.error(res.msg);
          return false;
        }
        setLoading(false);
        setDataSource(res.data);
        setTotalPage(res.total)
      }
    );
  };

  const getTnterface = () => {
    post("/cfg.php?controller=monitorManage&action=getOobInfList").then(
      (res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        setNameList(res.data);
      }
    );
  };

  /* 回显表格密度列设置 */
  const showTableConf = async () => {
    let data = [];
    data.module = columnvalue;
    let res;
    res = await postAsync(
      "/cfg.php?controller=confTableHead&action=showTableHead",
      data
    );
    if (res.density) {
      setDensitySize(res.density);
    }
    if (!res.success || res.data.length < 1) {
      columns?.map((item) => {
        if (!concealColumnList[item.dataIndex] && item.hideInTable != true) {
          let showCon = {};
          showCon.show = true;
          concealColumnList[item.dataIndex] = showCon;
        }
      });
      let data = [];
      data.module = columnvalue;
      data.value = JSON.stringify(concealColumnList);
      res = await postAsync(
        "/cfg.php?controller=confTableHead&action=setTableHead",
        data
      );
      if (res.success) {
        setColumnsHide(concealColumnList);
      }
    } else {
      setColumnsHide(res.data ? res.data : {});
    }
  };

  /* 表格列设置配置 */
  const columnsTableChange = (value) => {
    let data = [];
    data.module = columnvalue;
    data.value = JSON.stringify(value);
    post("/cfg.php?controller=confTableHead&action=setTableHead", data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        setColumnsHide(value);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  /* 表格密度设置 */
  const sizeTableChange = (sizeType) => {
    let data = [];
    data.module = columnvalue;
    data.density = sizeType;
    post("/cfg.php?controller=confTableHead&action=setTableHead", data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        setDensitySize(sizeType);
      })
      .catch(() => {
        setDensitySize(sizeType);
        console.log("mistake");
      });
  };

  const setConfig = (values) => {
    let data = {};
    data.op = values.op === "add" ? values.op : "mod";
    data.id = values.id;
    data.interface = values.interface;
    data.state =
      values.state == false || !values.state || values.state === "N"
        ? "N"
        : "Y";
    post("/cfg.php?controller=monitorManage&action=setOobConf", data).then(
      (res) => {
        if (!res.success) {
          message.error(res.msg);
          getMirrorList(nowPage);
          return false;
        }
        message.success(res.msg);
        getMirrorList(nowPage);
      }
    );
  };

  const switchBn = (values, checked) => {
    let data = {};
    data.op = values.op === "add" ? values.op : "mod";
    data.id = values.id;
    data.interface = values.interface;
    let state = "N";
    if (checked) {
      state = "Y";
    }
    data.state = state;
    post("/cfg.php?controller=monitorManage&action=setOobConf", data).then(
      (res) => {
        if (!res.success) {
          message.error(res.msg);
          getMirrorList(nowPage);
          return false;
        }
        message.success(res.msg);
        getMirrorList(nowPage);
      }
    );
  };

  const delConfig = (record) => {
    let data = {};
    data.id = record.id;
    data.interface = record.interface;
    post("/cfg.php?controller=monitorManage&action=delOobConf", data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        message.success(res.msg);
        setDataSource(dataSource.filter((item) => item.id !== record.id));
        getMirrorList(nowPage);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  return (
    <>
      <EditableProTable
        rowKey="id"
        headerTitle={language("monitor.basecfg.mirror.title")}
        bordered={true}
        scroll={{ y: 150 }}
        actionRef={actionRef}
        recordCreatorProps={false}
        loading={loading}
        toolBarRender={() => [
          !writable ? (
            false
          ) : (
            <Button
              type="primary"
              style={{ borderRadius: 5 }}
              icon={<PlusOutlined />}
              onClick={() => {
                actionRef.current?.addEditRecord?.(
                  {
                    id: (Math.random() * 1000000).toFixed(0),
                    op: "add",
                  },
                  { position: "top" }
                );
              }}
            >
              {language("project.temporary.outreach.setnew")}
            </Button>
          ),
        ]}
        columns={columns}
        options={{
          reload: () => {
            setLoading(true);
            getMirrorList(1);
          }, //刷新
        }}
        value={dataSource}
        onChange={setDataSource}
        editable={{
          form,
          editableKeys,
          onSave: async (rowKey, data, row) => {
            setConfig(data);
          },
          onChange: setEditableRowKeys,
          actionRender: (row, config, dom) => [dom.save, dom.cancel],
        }}
        columnsState={{
          value: columnsHide,
          persistenceType: "sessionStorage",
          onChange: (value) => {
            columnsTableChange(value);
          },
        }}
        onSizeChange={(e) => {
          sizeTableChange(e);
        }}
        size={densitySize}
        pagination={{
          showSizeChanger: true,
          pageSize: limitVal,
          current: nowPage,
          total: totalPage,
          showTotal: (total) => language("project.page", { total: total }),
          onChange: (page, pageSize) => {
            clearTimeout(window.timer);
            window.timer = setTimeout(function () {
              setNowPage(page);
              setLimitVal(pageSize);
              store.set("mirrorPageSize", pageSize);
              getMirrorList(page, pageSize);
            }, 100);
          },
        }}
      />
    </>
  );
};

export default Mirror;
