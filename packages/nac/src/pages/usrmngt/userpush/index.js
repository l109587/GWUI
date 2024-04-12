import React, { useRef, useState, useEffect } from 'react';
import { Input, message, Modal, Form, Switch, Popconfirm, Tooltip, Button, Alert } from 'antd';
import { DeleteFilled, SaveFilled, ExclamationCircleOutlined, DeleteOutlined, EditOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { LinkTwo } from '@icon-park/react';
import { post } from '@/services/https';
import { EditableProTable } from '@ant-design/pro-components';
import ProForm, { ModalForm, ProFormText, ProFormDateTimePicker, ProFormSelect, DrawerForm, ProFormRadio } from '@ant-design/pro-form';
import { NameText, NotesText, EditTable } from '@/utils/fromTypeLabel';
import { modalFormLayout, drawFromLayout } from "@/utils/helper";
import DownnLoadFile from '@/utils/downnloadfile.js';
import { language } from '@/utils/language';
import { regMacList } from '@/utils/regExp';
import SaveSvg from '@/assets/nac/save.svg';
import '@/utils/index.less';
import '@/common/common.less';
import './index.less';
import { TableLayout, AmTag } from '@/components';
const { ProtableModule, WebUploadr } = TableLayout;
const { confirm } = Modal;
const { Search } = Input;
let H = document.body.clientHeight - 336
var clientHeight = H
export default () => {

	const columns = [
		{
			title: '状态',
			dataIndex: 'status',
			align: 'center',
			fixed: 'left',
			ellipsis: true,
			width: 80,
			render: (text, record) => {
				let checked = true;
				if (record.status == 'N') {
					checked = false;
				}
				return (<Switch
					checkedChildren={language('project.open')}
					unCheckedChildren={language('project.close')}
					checked={checked}
					onChange={
						(checked) => {
							// statusSave(record, checked);
						}
					}
				/>
				)
			}
		},
		{
			title: '推送名称',
			dataIndex: 'name',
			align: 'left',
			width: 100,
			ellipsis: true,
		},
		{
			title: '类型',
			dataIndex: 'type',
			align: 'center',
			fixed: 'left',
			ellipsis: true,
			width: 100,
			filters: true,
			filterMultiple: false,
			render: (text, record, index) => {
				if(record.type == 'ACCESS_GW'){
					return <AmTag color='#E7F7FF' name={'准入网关'} style={{ borderRadius: '5px', border: '1px solid #91D5FF', color: '#2E9AFF' }} />;
				}
			},
		},
		{
			title: '地址',
			dataIndex: 'addr',
			align: 'left',
			ellipsis: true,
			width: 130,
		},
		{
			title: '端口',
			dataIndex: 'port',
			align: 'left',
			ellipsis: true,
			width: 80,
		},
		{
			title: '密钥',
			dataIndex: 'appkey',
			align: 'left',
			ellipsis: true,
			width: 100,
		},
		{
			title: '描述',
			dataIndex: 'note',
			align: 'left',
			ellipsis: true,
		},
		{
			disable: true,
			title: language('project.operate'),
			align: 'center',
			valueType: 'option',
			fixed: 'right',
			width: 80,
			ellipsis: true,
			render: (text, record, _, action) => [
				<a key="editable"
					onClick={() => {
						mod(record, 'mod');
					}}>
					<Tooltip title={language('project.deit')} >
						<img src={SaveSvg} />
					</Tooltip>
				</a>
			],
		},
	];

	const formRef = useRef();
	const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
	const [op, setop] = useState('add');//选中id数组
	const [editableKeys, setEditableRowKeys] = useState();//每行编辑的id
	const [timeShow, setTimeShow] = useState(false);//有效时间隐藏显示
	const [switchCheck, setSwitchCheck] = useState();
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [rowRecord, setRowRecord] = useState([]);//记录当前信息

	/** table组件 start */
	const rowKey = (record => record.id);//列表唯一值
	const tableHeight = clientHeight;//列表高度
	const tableKey = 'uuserpush';//table 定义的key
	const rowSelection = true;//是否开启多选框
	const addButton = true; //增加按钮  与 addClick 方法 组合使用
	const delButton = true; //删除按钮 与 delClick 方法 组合使用
	const uploadButton = false; //导入按钮 与 uploadClick 方法 组合使用
	const downloadButton = false; //导出按钮 与 downloadClick 方法 组合使用
	const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
	const columnvalue = 'uuserpushcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
	const apishowurl = '/cfg.php?controller=userPush&action=showUserPush';//接口路径
	const [queryVal, setQueryVal] = useState();//首个搜索框的值
	let searchVal = { queryVal: queryVal, queryType: 'fuzzy' };//顶部搜索框值 传入接口

	//初始默认列
	const concealColumns = {
		id: { show: false },
		verify_mode: { show: false },
		createTime: { show: false },
		updateTime: { show: false },
	}
	/* 顶部左侧搜索框*/
	const tableTopSearch = () => {
		return (
			<Search
				placeholder={language('ecpmngt.ipwht.tablesearch')}
				style={{ width: 200 }}
				onSearch={(queryVal) => {
					setQueryVal(queryVal);
					setIncID(incID + 1);
				}}
			/>
		)
	}

	//删除弹框
	const delClick = (selectedRowKeys, dataList) => {
		let sum = selectedRowKeys.length;
		confirm({
			className: 'delclickbox delmodalcurrent',
			icon: <ExclamationCircleOutlined />,
			title: language('project.delconfirm'),
			content: language('project.delnuminfo', { sum: sum }),
			onOk() {
				delList(selectedRowKeys, dataList)
			}
		});
	};

	//添加按钮点击触发
	const addClick = () => {
		setTimeShow(false);
		let initialValue = [];
		setTimeout(function () {
			formRef.current.setFieldsValue(initialValue)
		}, 100);
		getModal(1, 'add');
	}

	/** table组件 end */

	//判断是否弹出添加model
	const getModal = (status, op) => {
		if (status == 1) {
			setop(op)
			setModalStatus(true);
		} else {
			formRef.current.resetFields();
			setModalStatus(false);
		}
	}

	/**
	 * 添加修改接口
	 *cfg.php?controller=userPush&action=statusPushUpdate 查询推送任务 
	 * @param {*} info 
	 */
	const save = (info) => {
		let baseCFG = {
			type: info.ACCESS_GW,
			addr: info.addr,
			port: info.port,
			appkey: info.appkey,
		}
		let data = {};
		data.opcode = op;
		data.id = info.id;
		data.status = info.status ? 'Y' : 'N';
		data.name = info.name;
		data.note = info.note;
		data.type = info.type;
		data.baseCFG = baseCFG;
		let url = '/cfg.php?controller=userPush&action=setUserPush';
		if (op == 'mod') {
			url = '/cfg.php?controller=userPush&action=setUserPush';
		}
		post(url, data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			getModal(2)
			setIncID(incID + 1);
		}).catch(() => {
			console.log('mistake')
		})

	}

	//删除数据
	const delList = (selectedRowKeys) => {
		let ids = selectedRowKeys.join(',');
		post('/cfg.php?controller=exceptDev&action=del_unmanage', { ids: ids }).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			setTimeout(() => {
				setIncID(incID + 1);
			}, 2000);

		}).catch(() => {
			console.log('mistake')
		})

	}

	//编辑
	const mod = (objList, op) => {
		let obj = { ...objList }
		obj.opcode = op;
		obj.status = obj.status == 'Y' || obj.status == true ? true : false;
		let initialValues = obj;
		getModal(1, op);
		setTimeout(function () {
			formRef.current.setFieldsValue(initialValues)
		}, 100)
	}

	const uploadText = (
		<Button className='llbuttonbox'>
			{language('ecpmngt.preview')}
		</Button>
	)

	return (
		<div style={{
      position: "relative",
      height: "100%",
      overflow: "hidden",
     }}>
			<ProtableModule
				concealColumns={concealColumns}
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
				downloadButton={downloadButton}
			/>
			<DrawerForm
				// {...drawFromLayout}
				layout={'horizontal'}
				width={'477px'}
				formRef={formRef}
				title={op == 'add' ? language('project.add') : language('project.alter')}
				visible={modalStatus} autoFocusFirstInput
				drawerProps={{
					className: 'upfrombox',
					destroyOnClose: true,
					maskClosable: false,
					placement: 'right',
					getContainer: false,
          style: {
            position: "absolute",
          },
					onClose: () => {
						getModal(2)
					},
				}}
				onVisibleChange={setModalStatus}
				submitTimeout={2000} onFinish={async (values) => {
					save(values);
				}}>
				<Alert
					type='info'
					showIcon
					className='alertbox'
					message={<div>
						<div>此推送功能需有数据接收端网关</div>
						<div>1.需配置并开启HTTP API类型的用户同步功能</div>
						<div>2.在下发填写对端同步配置中的授权密钥</div>
					</div>}
				/>
				<div style={{ width: '395px', marginTop: '25px' }}>
					<ProFormText hidden={true} type="hidden" name="id" label="IP" />
					<ProFormText hidden={true} name="op" label={language('project.sysconf.syszone.opcode')} initialValue={op} />
					<Form.Item name="status" label={'状态'} valuePropName={switchCheck}>
						<Switch checkedChildren={language('project.enable')} unCheckedChildren={language('project.disable')} />
					</Form.Item>
					<NameText name='name' label={'推送名称'} required={true} />
					<NotesText name="note" label={'备注'} required={false} />
					<ProFormSelect options={[{
						label: '推送网关',
						value: 'ACCESS_GW'
					}]}
						name="type"
						rules={[{ required: true }]}
						label={'推送类型'}
					/>
					<ProFormText name="addr" label={'推送地址'} rules={[{ required: true }]} />
					<ProFormText name="port" label={'推送端口'} rules={[{ required: true }]} />
					<ProFormText name="appkey" label={'密钥'} rules={[{ required: true }]} />
				</div>
			</DrawerForm>
		</div>
	);
};
