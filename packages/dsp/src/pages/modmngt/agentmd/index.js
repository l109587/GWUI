import React, { useRef, useState, useEffect } from "react";
import { history } from "umi";
import {
  Col,
  Input,
  message,
  Modal,
  TreeSelect,
  Switch,
  Tooltip,
  Row,
  Tag,
  Popconfirm,
} from "antd";
import { post } from "@/services/https";
import {
  ExclamationCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  DrawerForm,
  ProDescriptions,
  ProForm,
  ProFormItem,
} from "@ant-design/pro-components";
import { language } from "@/utils/language";
import "@/utils/index.less";
import "./index.less";
import Policy from "./policy";
import { Resizable } from "react-resizable";
import { TableLayout, LeftTree, CardModal, AmTag } from "@/components";
const { ProtableModule } = TableLayout;

const { Search } = Input;
let H = document.body.clientHeight - 285;
var clientHeight = H;
// 调整table表头
const ResizeableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }
  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};
export default (props) => {
  const showAutoLoginInfo = (record) => {
    let id = record.id;
    post("/cfg.php?controller=confDevice&action=showAutoLoginInfo", { id: id })
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        if (res.data.url) {
          window.open(res.data.url, "_blank");
        }
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  //设备类型
  const [devTypeData, setDevTypeData] = useState([]);
  let devTypeList = [];
  const columnslist = [
    {
      title: language('adminacc.label.status'),
      dataIndex: 'onstate',
      key: 'onstate',
      align: 'center',
      fixed: "left",
      width: 80,
      ellipsis: true,
      filters: [
        { text: '在线', value: 1 },
        { text: '离线', value: 0 },
      ],
			filterMultiple: false,
			render: (text, record, index) => {
				let color = 'success';
				let name = '在线';
				if (record.onstate != 1) {
					color = 'default';
					name = '离线';
				}
				return (
					<AmTag style={{ marginRight: '0px' }} color={color} name={name} />
				)
			}
    },
    {
      title: '注册状态',
      dataIndex: 'regstate',
      key: 'regstate',
      align: 'center',
      width: 80,
      ellipsis: true,
      filters: [
        { text: '已注销', value: 1 },
        { text: '已注册', value: 0 },
      ],
			filterMultiple: false,
			render: (text, record, index) => {
				let color = 'default';
				let name = '已注销';
				if (record.regstate != 1) {
					color = 'success';
					name = '已注册';
				}
				return (
					<AmTag style={{ marginRight: '0px' }} color={color} name={name} />
				)
			}
    },
    {
      title: '认证',
      dataIndex: 'authstate',
      key: 'authstate',
      align: 'center',
      fixed: "left",
      width: 80,
      ellipsis: true,
      filters: [
        { text: '已认证', value: 1 },
        { text: '未认证', value: 0 },
      ],
			filterMultiple: false,
			render: (text, record, index) => {
				let color = 'success';
				let name = '已认证';
				if (record.authstate != 1) {
					color = 'default';
					name = '未认证';
				}
				return (
					<AmTag style={{ marginRight: '0px' }} color={color} name={name} />
				)
			}
    },
    {
      title: "设备编号",
      dataIndex: "device_id",
      align: "left",
      width: 140,
      ellipsis: true,
    },
    {
      title: "主机名称",
      dataIndex: "host_name",
      fixed: "left",
      align: "left",
      width: 120,
      ellipsis: true,
      render: (text, record, index) => {
        if (record.onstate == "online") {
          return (
            <a
              onClick={() => {
                showAutoLoginInfo(record);
              }}
            >
              {record.host_name}
            </a>
          );
        } else {
          return record.host_name;
        }
      },
    },
    {
      title: "IP",
      dataIndex: "ip",
      align: "left",
      width: 120,
      ellipsis: true,
    },
    {
      title: "MAC",
      dataIndex: "mac",
      align: "left",
      width: 120,
      ellipsis: true,
    },
    {
      title: "操作系统",
      dataIndex: "os",
      align: "left",
      width: 120,
      ellipsis: true,
    },
    {
      title: "CPU架构",
      dataIndex: "arch",
      align: "left",
      width: 120,
      ellipsis: true,
    },
    {
      title: "部门",
      dataIndex: "departement",
      align: "left",
      width: 100,
      ellipsis: true,
    },
    {
      title: "责任人",
      dataIndex: "user_name",
      align: "left",
      width: 100,
      ellipsis: true,
    },
    {
      title: "最近上线时间",
      dataIndex: "lasttime",
      align: "left",
      width: 120,
      valueType: "select",
      ellipsis: true,
    },
    {
      title: "软件版本",
      dataIndex: "soft_version",
      align: "left",
      width: 100,
      ellipsis: true,
    },
    {
      disable: true,
      title: language("project.operate"),
      align: "center",
      fixed: "right",
      width: 160,
      valueType: "option",
      render: (text, record, _, action) => [
        <a
          key="cancelsa"
          target="_blank"
          onClick={() => {
            setDetailInfo(record);
            setTimeout(() => {
              showDraw("open");
            }, 100);
          }}
        >
          详情
        </a>,
        <a
          key="editable"
					onClick={() => {
            disModal('instructions',record)
          }}
        >
          指令
        </a>,
        <a
          key="see"
					onClick={() => {
            disModal('strategy',record)
          }}
        >
          策略
        </a>,
      ],
    },
  ];

  useEffect(() => {
    post("/cfg.php?controller=confDevice&action=showDevTypeID").then((res) => {
      if (res.data && res.data.length >= 1) {
        res.data.map((item, index) => {
          res.data[index].text = item.label;
        });
        setDevTypeData(res.data ? res.data : []);
        devTypeList = res.data ? res.data : [];
        columnslist.map((item) => {
          if (item.dataIndex == "type") {
            item.filters = res.data;
            item.filterMultiple = false;
          }
        });
        setCols([...columnslist]);
      }
    });
  }, []);

  const formRef = useRef();
  const [modalStatus, setModalStatus] = useState(false); //model 添加弹框状态
  const [op, setop] = useState("add"); //选中id数组
  const [treeValue, setTreeValue] = useState("");
  const [zoneId, setZoneId] = useState(); //侧边栏选中地址id
  const [zoneIdVal, setZoneIdVal] = useState(); //添加区域id
  const [zoneNameVal, setZoneNameVal] = useState(); //添加区域名称
  const [treekey, setTreekey] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const zoneType = "zone";
  const [initialValue, setInitialValue] = useState([]);
  const { confirm } = Modal;

	const [visible, setVisible] = useState(false) //策略下发、撤销、级联设备、
  const [operate, setOperate] = useState(''); //撤销/下发/级联设备

  const drawformRef = useRef();
  const [drawState, setDrawState] = useState(false); //详情弹框


  /**分发  撤销功能 start  */
  //调用子组件接口判断弹框状态
  const disModal = (op = '', record = {}) => {
    setVisible(true)
    setDetailInfo(record);
    setOperate(op)
  }


  /** 左侧树形组件 start */
  const treeUrl = "/cfg.php?controller=confZoneManage&action=showZoneTree";
  const leftTreeData = { id: 1, type: "tree", depth: "1" };
  const [treeInc, setTreeInc] = useState(0);
  //getTree 请求树形内容
  //onSelectLeft
  /** 左侧树形组件 end */

  const incAdd = () => {
    let inc;
    clearTimeout(inc);
    inc = setTimeout(() => {
      setIncID(incID + 1);
    }, 100);
  };

  /** table组件 start */
  const rowKey = (record) => record.device_id; //列表唯一值
  const [cols, setCols] = useState(columnslist);
  const [columns, setColumns] = useState([]);
  const tableHeight = clientHeight - 10; //列表高度
  const tableKey = "dspmadevc"; //table 定义的key
  const rowSelection = true; //是否开启多选框
  const addButton = false; //增加按钮  与 addClick 方法 组合使用
  const delButton = false; //删除按钮 与 delClick 方法 组合使用
  const [incID, setIncID] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  const columnvalue = "dspmadevccolumnvalue"; //设置默认显示的 key 变动 set.strot 存储key
  const apishowurl = "/cfg.php?controller=confTerminal&action=showList"; //接口路径
  const [queryVal, setQueryVal] = useState(); //首个搜索框的值
  let searchVal = { queryVal: queryVal, queryType: "fuzzy", zoneID: zoneId }; //顶部搜索框值 传入接口

  //初始默认列
  const concealColumns = {
    devid: { show: false },
    version: { show: false },
    description: { show: false },
    reg_time: { show: false },
    updateTime: { show: false },
    createTime: { show: false },
  };
  /* 顶部左侧搜索框*/
  const tableTopSearch = () => {
    return (
      <Search
        allowClear
        placeholder={language("cfgmngt.devlist.tablesearch")}
        style={{ width: 200 }}
        onSearch={(queryVal) => {
          setQueryVal(queryVal);
          incAdd();
        }}
      />
    );
  };

  // 定义头部组件
  const components = {
    header: {
      cell: ResizeableTitle,
    },
  };

  // 处理拖拽
  const handleResize =
    (index) =>
    (e, { size }) => {
      const nextColumns = [...cols];
      // 拖拽时调整宽度
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width < 75 ? 75 : size.width,
      };

      setCols(nextColumns);
    };

  useEffect(() => {
    setColumns(
      (cols || []).map((col, index) => ({
        ...col,
        onHeaderCell: (column) => ({
          width: column.width,
          onResize: handleResize(index),
        }),
      }))
    );
  }, [cols]);

  /** table组件 end */

  //下拉处理
  const onLoadData = ({ id, children }) =>
    new Promise((resolve) => {
      if (children) {
        resolve();
        return;
      }
      let info = [];
      let data = {};
      data.id = id;
      data.type = zoneType;
      post("/cfg.php?controller=confZoneManage&action=showZoneTree", data).then(
        (res) => {
          res.children.map((item) => {
            let isLeaf = true;
            if (item.leaf == "N") {
              isLeaf = false;
            }
            info.push({
              id: item.id,
              title: item.name,
              isLeaf: isLeaf,
              pId: item.gpid,
              value: item.id,
            });
          });
          setTreeData(treeData.concat(info));
          resolve(undefined);
        }
      );
    });
  // 查找父节点的值
  const wirelessVal = (value, parentId = false) => {
    let cValue = [];
    if (!parentId) {
      cValue.push(value);
    }
    treeData.forEach((each, index) => {
      if (each.id == value) {
        if (each.pId != 0) {
          treeData.forEach((item, key) => {
            if (each.pId == item.id) {
              if (item.pId != 0) {
                let wirelessArr = wirelessVal(item.id, 999);
                cValue.push(item.id);
                cValue.push.apply(cValue, wirelessArr); //[1,2,3,4,5]
              } else {
                cValue.push(item.id);
              }
            }
          });
        } else {
          if (parentId) {
            cValue.push(each.id);
          }
        }
      }
    });
    return cValue;
  };
  //下拉列表选中
  const onChangeSelect = (value, label, extra) => {
    let selKye = wirelessVal(value);
    selKye = selKye.reverse(); //数组反转
    let selVal = []; //选中内容
    selKye.forEach((i) => {
      treeData.forEach((item, key) => {
        if (i == item.value) {
          selVal.push(item.title);
        }
      });
    });
    let selKyeNum = selKye[selKye.length - 1];
    let selValNum = selVal[selVal.length - 1];
    setTreeValue(selVal.join("/"));
    setTreekey(selKye);
    setZoneIdVal(selKyeNum);
    setZoneNameVal(selValNum);
  };

  //区域管理处理
  const getTree = (res) => {
    setZoneId(res.id);
    const treeInfoData = [res.node];
    let keys = [];
    keys.push();
    setTreeData(treeInfoData);
    incAdd();
  };

  // 区域管理侧边点击id处理
  const onSelectLeft = (selectedKeys, info) => {
    setZoneId(selectedKeys[0]); //更新选中地址id
    incAdd();
  };

  //详情 start
  const [detailInfo, setDetailInfo] = useState({});

  const showDraw = (state) => {
    console.log(1);
    if (state == "open") {
      setDrawState(true);
    } else {
      drawformRef.current.resetFields();
      setDrawState(false);
    }
  };

  //详情 end

  return (
    <>
      <CardModal
        title={language("project.sysconf.syszone.treelist")}
        cardHeight={clientHeight + 182}
        leftContent={
          <LeftTree
            getTree={getTree}
            onSelectLeft={onSelectLeft}
            treeInc={treeInc}
            treeUrl={treeUrl}
            leftTreeData={leftTreeData}
          />
        }
        rightContent={
          <ProtableModule
            concealColumns={concealColumns}
            components={components}
            columns={columns}
            apishowurl={apishowurl}
            incID={incID}
            clientHeight={tableHeight}
            columnvalue={columnvalue}
            tableKey={tableKey}
            searchText={tableTopSearch()}
            searchVal={searchVal}
            rowkey={rowKey}
            delButton={delButton}
            addButton={addButton}
            rowSelection={rowSelection}
            onlyOneReq={true}
          />
        }
      />

			{/* 详情查看 */}
      <DrawerForm
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        width={450}
        layout="horizontal"
        title={"详情信息"}
        formRef={drawformRef}
        drawerProps={{
          className: "mmagentDetailDraw",
          placement: "right",
          closable: false,
          // getContainer: () => document.getElementById("detailContain"),
          style: {
            position: "absolute",
          },
          width: 560,
          extra: (
            <div>
              <span
                onClick={() => {
                  showDraw("close");
                }}
                style={{ cursor: "pointer" }}
              >
                <CloseOutlined />
              </span>
            </div>
          ),
        }}
        autoFocusFirstInput
        submitTimeout={2000}
        visible={drawState}
        onVisibleChange={setDrawState}
        submitter={false}
        onFinish={(value) => {
          return true;
        }}
      >
        <ProDescriptions column={2} title={"系统信息"} bordered={true}>
          <ProDescriptions.Item label={"设备编号"} dataIndex="device_id">
            {detailInfo?.device_id ? detailInfo?.device_id : "--"}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={"在线状态"} dataIndex="state">
            <Tag color={detailInfo?.online == 1 ? "success" : "default"}>
              {detailInfo?.online == 1 ? "在线" : "离线"}
            </Tag>
          </ProDescriptions.Item>
          <ProDescriptions.Item label={"主机名称"} dataIndex="host_name">
            {detailInfo?.host_name ? detailInfo?.host_name : "--"}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={"操作系统"} dataIndex="os">
            {detailInfo?.os ? detailInfo?.os : "--"}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={"IP地址"} dataIndex="ip">
            {detailInfo?.ip ? detailInfo?.ip : "--"}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={"掩码"} dataIndex="netmask">
            {detailInfo?.netmask ? detailInfo?.netmask : "--"}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={"MAC地址"} dataIndex="mac">
            {detailInfo?.mac ? detailInfo?.mac : "--"}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={"默认网关"} dataIndex="geteway">
            {detailInfo?.geteway ? detailInfo?.geteway : "--"}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={"使用人"} dataIndex="user_name">
            {detailInfo?.user_name ? detailInfo?.user_name : "--"}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={"部门"} dataIndex="department">
            {detailInfo?.department ? detailInfo?.department : "--"}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            label={"软件版本"}
            dataIndex="soft_version"
            span={2}
          >
            {detailInfo?.soft_version ? detailInfo?.soft_version : "--"}
          </ProDescriptions.Item>
        </ProDescriptions>
        <div className="minfoTitle">
        <ProDescriptions column={2} title={"硬件信息"} bordered={true}>
          <ProDescriptions.Item
            label={"CPU"}
            dataIndex="soft_version"
            span={2}
          >
            {detailInfo.arch && <span style={{marginRight: '8px'}}>CPU架构:{detailInfo.arch}   </span> }
            {detailInfo.cpu_info?.physical_id && <span style={{marginRight: '8px'}}>CPU ID:{detailInfo.cpu_info?.physical_id}   </span> }
            {detailInfo.cpu_info?.core && <span style={{marginRight: '8px'}}>CPU核心数:{detailInfo.cpu_info?.core}   </span> }
            {detailInfo.cpu_info?.clock && <span style={{marginRight: '8px'}}>CPU主频:{detailInfo.cpu_info?.clock}   </span> }
          
          </ProDescriptions.Item>
        <ProDescriptions.Item label={"内存"} dataIndex="mem_total" span={2}>
          {detailInfo?.mem_total ? detailInfo?.mem_total : "--"}
        </ProDescriptions.Item>
        <ProDescriptions.Item label={"硬盘大小"} dataIndex="size" span={2}>
          {detailInfo?.disk_info?.size ? detailInfo?.disk_info?.size : "--"}
        </ProDescriptions.Item>
        <ProDescriptions.Item label={"硬盘序列号"} dataIndex="serial" span={2}>
          {detailInfo?.disk_info?.serial ? detailInfo?.disk_info?.serial : "--"}
        </ProDescriptions.Item>
        </ProDescriptions>
        </div>
      </DrawerForm>
			<Policy visible={visible} setVisible={setVisible} operate={operate} rowInfo={detailInfo} />
    </>
  );
};
