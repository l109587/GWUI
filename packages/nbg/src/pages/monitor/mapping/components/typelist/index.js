import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "umi";
import {
  EditableProTable,
  ModalForm,
  ProCard,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import {
  Statistic,
  Menu,
  Button,
  Popconfirm,
  Space,
  Form,
  Input,
  Dropdown,
  Tooltip,
  Popover,
  message,
  Select,
} from "antd";
import "./tyliest.less";
import { assetType } from "@/nbgUtils/nbgAssetsType";
import { EditFilled, PlusOutlined } from "@ant-design/icons";
import { fetchAuth } from "@/utils/common";
import { language } from "@/utils/language";
import store from "store";
import { modalFormLayout } from "@/utils/helper";
import { post, postAsync } from "@/services/https";
import { typeList } from "antd/lib/message";
const { Divider } = ProCard;
const { Search } = Input;

export default (props) => {
  const contentHeight = useSelector(({ app }) => app.contentHeight);
  const clientHeight = contentHeight - 196;
  const formRef = useRef();
  const writable = fetchAuth();
  const actionRef = useRef();
  const [openMenu, setOpenMenu] = useState({ 0: false });
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const startVal = 1;
  const [totalPage, setTotalPage] = useState(0); //总条数
  const [nowPage, setNowPage] = useState(1); //当前页码
  const limitVal = store.get("typeListLimit") ? store.get("typeListLimit") : 20; //默认每页条数
  const [editableKeys, setEditableRowKeys] = useState([]);
  const [popOpen, setPopOpen] = useState(false);
  const [densitySize, setDensitySize] = useState("middle");
  const [columnsHide, setColumnsHide] = useState(
    store.get("baseMirrorTable")
      ? store.get("baseMirrorTable")
      : {
          id: { show: false },
          groupId: { show: false },
        }
  ); //设置默认列
  let concealColumnList = {
    id: { show: false },
    groupId: { show: false },
  };
  let columnvalue = "assetTypeList";
  const [assetValue, setAssetValue] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState(0);
  const [queryVal, setQueryVal] = useState(""); //搜索值
  const [loading, setLoading] = useState(true); //加载
  const [menuLoading, setMenuLoading] = useState(true);
  const [summaryData, setSummaryData] = useState({});
  const [groupList, setGroupList] = useState([]);
  const [modGroupVal, setModGroupVal] = useState("");
  const [selectKey, setSelectKey] = useState("");
  const [onlyGroup, setOnlyGroup] = useState({ 0: false });

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 100,
      ellipsis: true,
      readonly: true,
    },
    {
      title: language("monitor.mapping.typelist.groupId"),
      width: 100,
      dataIndex: "groupId",
      align: "left",
      ellipsis: true,
      readonly: true,
    },
    {
      title: language("monitor.mapping.typelist.group"),
      dataIndex: "group",
      width: 200,
      ellipsis: true,
      className: "groupTd",
      tooltip: language("monitor.mapping.typelist.group.dbclickTitle"),
      valueType: "select",
      request: async () => groupList,
      render: (text, record, index, action) => {
        return (
          <div
            style={{ cursor: "pointer" }}
            onDoubleClick={() => {
              let list = { ...openMenu };
              list[record.id] = true;
              setOnlyGroup(list);
            }}
          >
            {onlyGroup[record.id] ? (
              <Select
                style={{ height: 32, width: "100%" }}
                defaultValue={record.group}
                options={groupList}
                allowClear
                onSelect={(value) => {
                  let list = { ...openMenu };
                  list[record.id] = false;
                  setOnlyGroup(list);
                  setTypeGroup(record.id, record.name, value);
                }}
              />
            ) : (
              record.group
            )}
          </div>
        );
      },
    },
    {
      title: language("monitor.mapping.asstypeList.searchText"),
      dataIndex: "name",
      width: 200,
      ellipsis: true,
      render: (text, record, _, action) => {
        return [
          <Tooltip title={record.type} placement="topLeft">
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="typeIcon">{assetType(record.icon)}</div>
              <div className="typeText">{record.name}</div>
            </div>
          </Tooltip>,
        ];
      },
    },
    {
      title: language("monitor.mapping.typelist.speciesnum"),
      dataIndex: "speciesnum",
      width: 130,
      ellipsis: true,
      readonly: true,
    },
    {
      title: language("monitor.mapping.typelist.count"),
      dataIndex: "count",
      width: 130,
      ellipsis: true,
      readonly: true,
    },
    {
      title: language("monitor.mapping.typelist.property"),
      dataIndex: "property",
      width: 120,
      ellipsis: true,
      readonly: true,
      render: (text, record, _, action) => {
        if (record.property == 0) {
          return language("project.temporary.outreach.sys");
        } else {
          return language("project.sysconf.analysis.custom");
        }
      },
    },
    {
      title: language("project.operate"),
      valueType: "option",
      width: 100,
      align: "center",
      fixed: "right",
      hideInTable: !writable,
      render: (text, record, _, action) => {
        if (record.property == 1) {
          return (
            <Space>
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
                  handleDel(record);
                }}
              >
                <Button type="link" size="small">
                  {language("project.del")}
                </Button>
              </Popconfirm>
            </Space>
          );
        }
      },
    },
  ];

  useEffect(() => {
    if (props.checkedTabKey == 2) {
      handleShow()
      showSummary()
      showGroupList()
    }
  }, [props.checkedTabKey]);

  useEffect(() => {
    showTableConf();
    showGroupList();
    showSummary();
    handleShow();
  }, []);

  const handleShow = (pagestart = "", pagelimit = "", value = "", groupID) => {
    setLoading(true);
    let page = pagestart != "" ? pagestart : startVal;
    let data = {};
    data.queryVal = value != "" ? value : queryVal;
    data.limit = pagelimit != "" ? pagelimit : limitVal;
    data.start = (page - 1) * data.limit;
    data.groupID = groupID;
    post(
      "/cfg.php?controller=assetMapping&action=showAssetTypeList",
      data
    ).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      setTotalPage(res.total);
      setLoading(false);
      setDataSource(res.data);
    });
  };

  const handleDel = (record) => {
    post("/cfg.php?controller=assetMapping&action=delAssetTypeInfo", {
      id: record.id,
      name: record.name,
    })
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        // setDataSource(dataSource.filter((item) => item.id !== record.id));
        message.success(res.msg);
        handleShow();
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  const handleMod = (record) => {
    post("/cfg.php?controller=assetMapping&action=setAssetTypeInfo", {
      id: record.id,
      groupName: record.group,
      typeName: record.name,
    }).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      handleShow();
    });
  };

  const handleAdd = (value) => {
    if (value.type == 0) {
      post("/cfg.php?controller=assetMapping&action=addAssetGroup", {
        name: value.name,
      }).then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        showModal("close");
        message.success(res.msg);
        showGroupList();
        handleShow();
      });
    } else {
      post("/cfg.php?controller=assetMapping&action=addAssetType", {
        group: value.group,
        name: value.assetname,
      }).then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        showModal("close");
        message.success(res.msg);
        handleShow();
      });
    }
  };

  const showGroupList = () => {
    setMenuLoading(true);
    post("/cfg.php?controller=assetMapping&action=showAssetGroupList", {
      start: 0,
      limit: -1,
    }).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      let list = [];
      res.data.map((item, index) => {
        list.push({
          label: item.text,
          key: item.id,
          value: item.text,
          property: item.property,
        });
      });
      setGroupList(list);
    });
  };

  const showSummary = () => {
    post("/cfg.php?controller=assetMapping&action=showTotalAssets").then(
      (res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        setSummaryData(res.data);
      }
    );
  };

  const throttle = (fn, wait, scope) => {
    clearTimeout(throttle.timer);
    throttle.timer = setTimeout(() => {
      fn.apply(scope);
    }, wait);
  };

  const showOperMenu = (index, item) => {
    if (item.property == 0) {
      return (
        <Menu
          key={index}
          onClick={(e) => {
            // setOpenMenu(true);
            e.domEvent.stopPropagation();
          }}
        >
          <Popover
            trigger="click"
            placement="right"
            visible={popOpen[index]}
            content={
              <Input
                name="input"
                onChange={(e) => {
                  setAssetValue(e.target.value);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                value={assetValue}
                allowClear
                onPressEnter={(e) => {
                  e.stopPropagation();
                  let list = { ...openMenu };
                  list[index] = false;
                  setOpenMenu(list);
                  setMenuGroup(e.target.value, item.key);
                }}
              />
            }
          >
            <Menu.Item
              key="edit"
              onClick={(e) => {
                setPopOpen(true);
              }}
            >
              {language("project.edit")}
            </Menu.Item>
          </Popover>
        </Menu>
      );
    } else {
      return (
        <Menu
          key={index}
          onClick={(e) => {
            // setOpenMenu(true);
            e.domEvent.stopPropagation();
          }}
        >
          <Popover
            trigger="click"
            placement="right"
            visible={popOpen[index]}
            content={
              <Input
                name="input"
                onChange={(e) => {
                  setAssetValue(e.target.value);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                value={assetValue}
                allowClear
                onPressEnter={(e) => {
                  e.stopPropagation();
                  let list = { ...openMenu };
                  list[index] = false;
                  setOpenMenu(list);
                  setMenuGroup(e.target.value, item.key);
                }}
              />
            }
          >
            <Menu.Item
              key="edit"
              onClick={(e) => {
                setPopOpen(true);
              }}
            >
              {language("project.edit")}
            </Menu.Item>
          </Popover>
          <Popconfirm
            title={language("monitor.areyousure.del")}
            placement="right"
            onConfirm={(e) => {
              e.stopPropagation();
              delMenuGroup(item.label, item.key, index);
            }}
          >
            <Menu.Item key="del">
              {language("project.sysconf.syscert.delete")}
            </Menu.Item>
          </Popconfirm>
        </Menu>
      );
    }
  };

  const showOperDrop = (index, item) => {
    return (
      <Dropdown
        overlay={showOperMenu(index, item)}
        trigger={["click"]}
        visible={openMenu[index]}
        onVisibleChange={(value) => {
          let list = { ...openMenu };
          list[index] = value;
          setOpenMenu(list);
          if (!value || value === false) {
            setPopOpen(false);
          }
        }}
        overlayStyle={{
          width: 50,
        }}
      >
        <EditFilled />
      </Dropdown>
    );
  };

  const result = () => {
    let list = [];
    groupList.map((item, index) => {
      let obj = {};
      obj.icon = showOperDrop(index, item);
      obj.label = item.label;
      obj.key = item.key;
      list.push(obj);
    });
    return list;
  };

  /* 修改左侧资产分组 */
  const setMenuGroup = (text, id) => {
    post("/cfg.php?controller=assetMapping&action=setAssetGroup", {
      id: id,
      newname: text,
    }).then((res) => {
      setPopOpen(false);
      setAssetValue("");
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      showGroupList();
    });
  };

  /* 左侧自定义资产分组删除 */
  const delMenuGroup = (name, id, index) => {
    post("/cfg.php?controller=assetMapping&action=delAssetGroup", {
      name: name,
      id: id,
    }).then((res) => {
      let list = { ...openMenu };
      list[index] = false;
      setOpenMenu(list);
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      showGroupList();
    });
  };

  const setTypeGroup = (groupId, oldNmae, newName, id) => {
    post("/cfg.php?controller=assetMapping&action=modAssetTypeGroup", {
      id: groupId,
      name: oldNmae,
      group: newName,
    }).then((res) => {
      setModGroupVal("");
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      handleShow();
    });
  };

  const showModal = (status) => {
    if (status == "open") {
      setModalVisible(true);
    } else {
      setType(0);
      formRef.current.resetFields();
      setModalVisible(false);
    }
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

  return (
    <ProCard ghost direction="column" gutter={[13, 13]}>
      <ProCard className="assetStatis" style={{ height: 110 }}>
        <ProCard ghost layout="center">
          <Statistic
            title={language("monitor.mapping.typelist.assettypesnum")}
            value={summaryData?.assettypesnum}
          />
        </ProCard>
        <Divider type="vertical" />
        <ProCard ghost layout="center">
          <Statistic
            title={language("monitor.mapping.typelist.assetspeciesnum")}
            value={summaryData?.assetspeciesnum}
          />
        </ProCard>
        <Divider type="vertical" />
        <ProCard ghost layout="center">
          <Statistic
            title={language("monitor.mapping.typelist.assetfingerprintnum")}
            value={summaryData?.assetfingerprintnum}
          />
        </ProCard>
      </ProCard>
      <ProCard ghost gutter={[13, 13]}>
        <ProCard
          title={language("monitor.mapping.typelist.group")}
          colSpan={"280px"}
          style={{ height: clientHeight }}
        >
          <Menu
            mode="inline"
            className="assetGroup"
            style={{ height: clientHeight - 90, overflow: "auto" }}
            items={result()}
            onClick={(e) => {
              setNowPage(1);
              if (selectKey == e.key) {
                setSelectKey("");
                handleShow(startVal, limitVal, queryVal, "");
              } else {
                setSelectKey(e.key);
                handleShow(startVal, limitVal, queryVal, e.key);
              }
              e.domEvent.stopPropagation();
              e.domEvent.preventDefault();
            }}
            selectedKeys={selectKey}
          >
            {/* {result().map((item) => {
              return (
                <Menu.Item key={item.key} icon={item.icon}>
                  <Tooltip title={item.label}>
                      {item.label}
                  </Tooltip>
                </Menu.Item>
              );
            })} */}
          </Menu>
        </ProCard>
        <ProCard
          ghost
          style={{ height: clientHeight - 2, backgroundColor: "#fff" }}
          colSpan={"calc(100% - 280px)"}
        >
          <EditableProTable
            className="typeListTable"
            columns={columns}
            headerTitle={
              <Space>
                <Search
                  placeholder={language("monitor.mapping.asstypeList.searchText")}
                  allowClear
                  onSearch={(queryVal) => {
                    setQueryVal(queryVal);
                    setNowPage(1);
                    handleShow(startVal, limitVal, queryVal);
                  }}
                />
              </Space>
            }
            actionRef={actionRef}
            recordCreatorProps={false}
            rowKey="id"
            cardBordered={false}
            bordered={true}
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
                    showModal("open");
                    // actionRef.current?.addEditRecord?.(
                    //   {
                    //     id: (Math.random() * 1000000).toFixed(0),
                    //     op: 'add',
                    //   },
                    //   { position: 'bottom' }
                    // )
                  }}
                >
                  {language("project.temporary.outreach.setnew")}
                </Button>
              ),
            ]}
            value={dataSource}
            onChange={setDataSource}
            scroll={{ y: clientHeight - 176 }}
            onSizeChange={(e) => {
              sizeTableChange(e);
            }}
            size={densitySize}
            //设置列操作
            columnsState={{
              value: columnsHide,
              persistenceType: "sessionStorage ",
              onChange: (value) => {
                columnsTableChange(value);
              },
            }}
            options={{
              reload: () => {
                setLoading(true);
                setNowPage(1);
                handleShow(startVal);
              }, //刷新
            }}
            editable={{
              form,
              editableKeys,
              onSave: async (rowKey, data, row) => {
                handleMod(data);
              },
              onChange: setEditableRowKeys,
              actionRender: (row, config, dom) => [dom.save, dom.cancel],
            }}
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
                  store.set("typeListLimit", pageSize);
                  handleShow(page, pageSize, queryVal, selectKey);
                }, 100);
              },
            }}
          />
        </ProCard>
        <ModalForm
          formRef={formRef}
          title={language("project.newbuild")}
          {...modalFormLayout}
          autoFocusFirstInput
          visible={modalVisible}
          onVisibleChange={setModalVisible}
          modalProps={{
            maskClosable: false,
            bodyStyle: {
              paddingTop: 20,
            },
            onCancel: () => {
              showModal("close");
            },
          }}
          submitTimeout={2000}
          onFinish={async (values) => {
            handleAdd(values);
          }}
        >
          <ProFormRadio.Group
            label={language("monitor.mapping.typelist.property")}
            name="type"
            radioType="button"
            options={[
              { label: language("monitor.mapping.typelist.group"), value: 0 },
              {
                label: language("monitor.mapping.asstypeList.searchText"),
                value: 1,
              },
            ]}
            initialValue={0}
            onChange={(e) => {
              setType(e.target.value);
            }}
          />
          {type === 0 ? (
            <ProFormText
              label={language("monitor.mapping.typelist.groupName")}
              name="name"
            />
          ) : (
            <>
              <ProFormText
                label={language("monitor.mapping.asstypeList.searchText")}
                name="assetname"
              />
              <ProFormSelect
                label={language("monitor.mapping.typelist.groupText")}
                name="group"
                options={groupList}
              />
            </>
          )}
        </ModalForm>
      </ProCard>
    </ProCard>
  );
};
