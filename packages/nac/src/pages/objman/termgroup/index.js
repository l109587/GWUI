import React, { useRef, useState, useEffect } from "react";
import {
  Button,
  Input,
  message,
  Modal,
  TreeSelect,
  Tree,
  Popconfirm,
  Popover,
  Tooltip,
} from "antd";
import { fileDown, post } from "@/services/https";
import {
  SaveFilled,
  ExclamationCircleOutlined,
  EditFilled,
  DeleteFilled,
  LoadingOutlined,
  EditOutlined,
} from "@ant-design/icons";
import ProForm, {
  ProFormTextArea,
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormRadio,
} from "@ant-design/pro-form";
import DownnLoadFile from "@/utils/downnloadfile.js";
import { language } from "@/utils/language";
import { regSeletcList, regList, regMacList } from "@/utils/regExp";
import { Base64 } from "js-base64";
import Uploadd from "@/utils/Upload";
import "@/utils/index.less";
import "./index.less";
import SaveSvg from "@/assets/nac/save.svg";
import { TableLayout, LeftTree, CardModal } from "@/components";
import WebUploadr from "@/components/Module/webUploadr";
import AddTermGrp from "../components/addtermgrp";
import { CutdropDown } from "@/common";
const { ProtableModule } = TableLayout;

const { Search } = Input;
const { confirm } = Modal;

let clientHeight = document.body.clientHeight - 285;

export default () => {
  const columns = [
    {
      title: "终端分组名称",
      dataIndex: "name",
      key: "name",
      align: "left",
      ellipsis: true,
      width: 150,
    },
    {
      title: "上级分组",
      dataIndex: "upgrpvalue",
      key: "upgrpvalue",
      align: "left",
      ellipsis: true,
      width: 150,
    },
    {
      title: "IP地址分类规则",
      dataIndex: "ip_class",
      key: "ip_class",
      align: "left",
      render: (_,record) => {
        return (
          <>
            <CutdropDown addrlist={record.ip_class} />
          </>
        )
      },
    },
    {
      title: "MAC地址分类规则",
      dataIndex: "mac_class",
      key: "mac_class",
      align: "left",
      width: 250,
      render: (_,record) => {
        return (
          <>
            <CutdropDown addrlist={record.mac_class} />
          </>
        )
      },
    },
    {
      title: "操作",
      width: 100,
      dataIndex: "operate",
      key: "operate",
      align: "center",
      fixed: "right",
      render: (_, record) => {
        return (
          <Tooltip
            title={language("project.edit")}
            arrowPointAtCenter
            onClick={() => {
              setOperate("mod");
              setRecordInfo(record);
              setTermgrpVisible(true);
              // mod(record, 'mod');
            }}
          >
            <img src={SaveSvg} style={{ cursor: "pointer" }} />
          </Tooltip>
        );
      },
    },
  ];

  //添加/编辑终端分组弹窗
  const [recordInfo, setRecordInfo] = useState({}); //选中的终端分组信息
  const [operate, setOperate] = useState("add");
  const [termgrpVisible, setTermgrpVisible] = useState(false);
  const [imoritModalStatus, setImoritModalStatus] = useState(false); //导入 上传文件弹出框
  const [termgrpId, setTermgrpId] = useState("");
  const [filecodeValue, setFilecodeValue] = useState("utf-8"); //文件编码
  const importFormRef = useRef();

  //列表数据
  const [treeData, setTreeData] = useState([]);

  /** 左侧树形组件 start */
  const treeUrl =
    "/cfg.php?controller=devGroupControl&action=get_dev_group_list";
  const leftTreeData = {};
  const [treeInc, setTreeInc] = useState(0);

  /** table组件 start */
  const rowKey = (record) => record.id; //列表唯一值
  const tableHeight = clientHeight - 10; //列表高度
  const tableKey = "zoneconf"; //table 定义的key
  const rowSelection = true; //是否开启多选框
  const addButton = true; //增加按钮  与 addClick 方法 组合使用
  const delButton = true; //删除按钮 与 delClick 方法 组合使用
  const uploadButton = true; //导入按钮 与 uploadClick 方法 组合使用
  const downloadButton = true; //导出按钮 与 downloadClick 方法 组合使用
  const [incID, setIncID] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  const columnvalue = "termgrpColumnvalue"; //设置默认显示的 key 变动 set.strot 存储key
  const apishowurl =
    "/cfg.php?controller=devGroupControl&action=get_devmember_list"; //接口路径
  const [queryVal, setQueryVal] = useState(); //首个搜索框的值
  let searchVal = { queryVal: queryVal, queryType: "fuzzy", id: termgrpId }; //顶部搜索框值 传入接口

  /* 顶部左侧搜索框*/
  const tableTopSearch = () => {
    return (
      <Search
        placeholder="请输入"
        style={{ width: 200 }}
        onSearch={(queryVal) => {
          setQueryVal(queryVal);
          incAdd();
        }}
      />
    );
  };

  //删除弹框
  const delClick = (selectedRowKeys, dataList) => {
    let sum = selectedRowKeys.length;
    confirm({
      className: "delclickbox",
      icon: <ExclamationCircleOutlined />,
      title: language("project.delconfirm"),
      content: language("project.cancelcon", { sum: sum }),
      onOk() {
        delList(selectedRowKeys, dataList);
      },
    });
  };

  //添加按钮点击触发
  const addClick = () => {
    setTermgrpVisible(true);
  };

  //导入按钮
  const uploadClick = () => {
    setImoritModalStatus(true);
  };
  /* 导入成功文件返回 */
  const onSuccess = (res) => {
    if (res.success) {
      message.success("导入成功");
      setImoritModalStatus(false);
      setIncID((incID) => incID + 1);
    } else {
      res.msg && message.error("res.msg");
    }
  };
  //导出按钮
  const downloadClick = (list = {}) => {
    let api = "/cfg.php?controller=devGroupControl&action=exportDevgrp";
    let data = list;
    DownnLoadFile(api, data, "", false);
  };

  /** table组件 end */

  const incAdd = () => {
    let inc;
    clearTimeout(inc);
    inc = setTimeout(() => {
      setIncID(incID + 1);
    }, 100);
  };

  //区域管理处理
  const getTree = (res) => {
    const treeInfoData = [res.node];
    setTreeData(treeInfoData);
    let zID = 1;
    if (res.defaultPath) {
      zID = res.node.id;
    }
    setTermgrpId(zID);
    incAdd();
  };

  // 区域管理侧边点击id处理
  const onSelectLeft = (selectedKeys, info) => {
    setTermgrpId(selectedKeys[0]); //更新选中地址id
    incAdd();
  };

  /* 删除数据 */
  const delList = (selectedRowKeys, dataList) => {
    let selectedRowNames = [];
    dataList.map((item) => {
      if (selectedRowKeys.indexOf(item.id) != -1) {
        selectedRowNames.push(item.name);
      }
    });
    let data = {};
    data.id = selectedRowKeys.join(",");
    data.name = selectedRowNames.join(",");
    post("/cfg.php?controller=devGroupControl&action=del_dev_group", data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        setTreeInc(treeInc + 1);
        incAdd();
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <CardModal
        title="终端分组"
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
            delClick={delClick}
            addButton={addButton}
            addClick={addClick}
            rowSelection={rowSelection}
            uploadButton={uploadButton}
            uploadClick={uploadClick}
            downloadButton={downloadButton}
            downloadClick={downloadClick}
          />
        }
      />
      <ModalForm
        layout="horizontal"
        formRef={importFormRef}
        title={language("project.import")}
        visible={imoritModalStatus}
        width={400}
        initialValues={{ filecode: "utf-8" }}
        modalProps={{
          maskClosable: false,
          onCancel: () => {
            setImoritModalStatus(false);
          },
        }}
        labelCol={{ span: 9 }}
        wrapperCol={{ span: 15 }}
        submitter={false}
      >
        <ProFormText tooltip="文件必须为.csv格式" label="导入文件">
          <WebUploadr
            isAuto={true}
            upbutext="请选择文件..."
            upurl="/cfg.php?controller=devGroupControl&action=importDevgrp"
            accept=".csv"
            maxSize={9999999999}
            maxCount={1}
            isUpsuccess={true}
            onSuccess={onSuccess}
            isShowUploadList={false}
            parameter={{ filecode: filecodeValue }}
          />
        </ProFormText>
        <ProFormRadio.Group
          name="filecode"
          label="文件编码"
          options={[
            {
              label: "UTF-8",
              value: "utf-8",
            },
            {
              label: "GBK",
              value: "gbk",
            },
          ]}
          fieldProps={{
            value: filecodeValue,
            onChange: (values) => {
              setFilecodeValue(values.target.value);
            },
          }}
        />
      </ModalForm>
      <AddTermGrp
        visible={termgrpVisible}
        setVisible={setTermgrpVisible}
        setIncID={setIncID}
        setTreeInc={setTreeInc}
        operate={operate}
        setOperate={setOperate}
        recordInfo={recordInfo}
      />
    </div>
  );
};
