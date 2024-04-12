import React, { useRef, useState, useEffect } from 'react'
import { Button, Tooltip, message } from 'antd'
import {
  PlusOutlined,
  CloseCircleFilled,
  UploadOutlined,
  DownloadOutlined,
  EditOutlined
} from '@ant-design/icons'
import { post } from '@/services/https'
import {
  ProTable,
  arrayMoveImmutable,
  useRefFunction,
} from '@ant-design/pro-components'
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc'
import { ExpandDownOne, FoldUpOne } from '@icon-park/react'
import { language } from '@/utils/language'
import { Resizable } from 'react-resizable'
import '@/utils/box.less'
import '@/utils/index.less'
import './ProTabler.less'
import store from 'store'
// 调整table表头 拖拽
const ResizeableTitle = (props) => {
  const { onResize, width, ...restProps } = props
  if (!width) {
    return <th {...restProps} />
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
  )
}

/* 
  表格组件使用规范：
    1. 如有排序需求，需在表头对应字段添加 sorter: true 配置,传sortText代表所需排序字段，sortOrder代表排序顺序，asc代表正序，desc代表倒序;
    2. 如需要表格拖拽宽度功能，需在页面文件引入Resizable，组件中传相应components，详情见analyse/illinn;
    3. 如需要增删导入导出功能，需传对应字段表示是否启用，增：props.addButton，删：props.delClick，导入：props.uploadClick，导出：props.downloadClick;
    4. 首页钻取 配置默认筛选功能 filterChange, filtersType
    5. 配置行不可选中内容 selectDisabled
    6. 添加行className rowOpenClassName
    7. 展开配置 expandAble
*/

export default (props) => {
  const checkRowKey = props.checkRowKey
  /** 拖拽排序功能 start */
  const SortableItem = SortableElement((props) => <tr {...props} />)
  const SortContainer = SortableContainer((props) => <tbody {...props} />)
  const onSortEnd = useRefFunction(({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      dragSort(oldIndex, newIndex, dataList) //拖拽后处理
      const newData = arrayMoveImmutable(
        dataList.slice(),
        oldIndex,
        newIndex
      ).filter((el) => !!el)
      setList([...newData])
    }
  })
  const DraggableContainer = (props) => (
    <SortContainer
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  )
  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    const index = dataList.findIndex(
      (x) => x[checkRowKey] === restProps['data-row-key']
    )
    return <SortableItem index={index} {...restProps} />
  }
  /** 拖拽排序 end */

  // 定义头部组件
  let components = {}
  //判断是否启用内容排序
  if (props.checkRowKey) {
    components.body = {
      wrapper: DraggableContainer,
      row: DraggableBodyRow,
    }
  }

  //判断是否启用宽度拖拽
  if (props.components) {
    components.header = {
      cell: ResizeableTitle,
    }
  }

  const {
    addClick,
    delClick,
    editClick,
    uploadClick,
    downloadClick,
    dragSort,
    setScreenList,
    otherOperate = null,
    showPage,
    Transmit,
    filterChange,
    filtersType,
    selectDisabled,
    filterValue,
    rowOpenClassName,
    expandAble,
    onExpandUrl,
    isDelay,
  } = props
  const incID = props.incID ? props.incID : 0 //递增的id 删除/添加的时候增加触发刷新
  const [selectedRowKeys, setSelectedRowKeys] = useState([]) //选中id数组
  const [delStatus, setDelStatus] = useState(true) //删除按钮状态
  const [dataList, setList] = useState([])
  const [reloadDL, setReloadDL] = useState(0) //刷新
  const initLtVal = store.get(props.tableKey) ? store.get(props.tableKey) : 20
  const [limitVal, setLimitVal] = useState(initLtVal) // 每页条目
  const [loading, setLoading] = useState(true) //加载
  const [columnsHide, setColumnsHide] = useState(
    store.get(props.columnvalue)
      ? store.get(props.columnvalue)
      : props.concealColumns
  ) // 设置默认列
  const [currPage, setCurrPage] = useState(1) // 当前页码
  const [totEntry, setTotEntry] = useState(0) // 总条数
  const [filters, setFilters] = useState(
    filtersType ? JSON.stringify(filtersType) : {}
  )
  const [sortOrder, setSortOrder] = useState('') // 排序顺序
  const [sortText, setSorttext] = useState('') // 排序字段
  const [selectedRows, setSelectedRows] = useState([])
  const searchArr = [
    currPage,
    limitVal,
    reloadDL,
    filters,
    sortText,
    sortOrder,
    incID,
  ]
  let searchVal = props.searchVal
  let searchValList = []
  for (const key in searchVal) {
    searchValList.push(searchVal[key])
  }

  useEffect(() => {
    clearTimeout(window.timer)
    setLoading(true)
    window.timer = setTimeout(function () {
      getListdata()
      setSelectedRowKeys([])
      setDelStatus(true) //添加删除框状态
    }, 100)
  }, searchArr)

  useEffect(() => {
    setCurrPage(1)
  }, searchValList)

  useEffect(() => {
    if (filterValue) {
      setFilters(JSON.stringify(filterValue))
    }
    setCurrPage(1)
  }, [filterValue])

  // 回显数据请求
  const getListdata = (num) => {
    let data = {}
    data = { ...props.searchVal }
    data.start = showPage ? 0 : limitVal * (currPage - 1)
    data.limit = showPage ? 20 : limitVal
    data.filters = filters
    data.sort = sortText
    if (sortOrder == 'ascend') {
      data.order = 'asc'
    } else if (sortOrder == 'descend') {
      data.order = 'desc'
    } else {
      data.order = ' '
    }
    post(props.apiShowUrl, data)
      .then((res) => {
        setLoading(false)
        if (!res.success) {
          setTotEntry(0)
          setList([])
          message.error(res.msg)
        } else {
          setTotEntry(res.total)
          setList([...res.data])
        }
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  //选中触发
  const onSelectedRowKeysChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys)
    setSelectedRows(selectedRows)
    if (Transmit) {
      Transmit(selectedRows)
    }
    let deletestatus = true
    if (selectedRowKeys != false || selectedRowKeys[0] == '0') {
      deletestatus = false
    }
    setDelStatus(deletestatus) //添加删除框状态
  }

  /* 顶部右侧功能按钮 */
  const toolButton = () => {
    return (
      <>
        {props.addButton ? (
          <Button
            key="button"
            onClick={() => {
              addClick()
            }}
            type="primary"
          >
            <PlusOutlined />
            {props.addTitle ? props.addTitle : language('project.add')}
          </Button>
        ) : (
          ''
        )}
        {props.editButton ? (
          <Button
            key="button"
            disabled={delStatus}
            onClick={() => {
              if (selectedRowKeys.length != 1) {
                message.error('请选择一条数据进行编辑')
                return false
              }
              editClick(selectedRowKeys, selectedRows)
            }}
            type="primary"
          >
            <EditOutlined />
            {language('project.edit')}
          </Button>
        ) : (
          ''
        )}
        {props.delButton ? (
          <Button
            type="danger"
            disabled={delStatus}
            onClick={(e) => {
              delClick(selectedRowKeys, dataList, selectedRows)
            }}
          >
            <CloseCircleFilled /> {language('project.del')}
          </Button>
        ) : (
          ''
        )}
        {props.uploadButton ? (
          <Tooltip title={language('project.import')} placement="top">
            <UploadOutlined
              onClick={() => {
                uploadClick()
              }}
              style={{ fontSize: '15px' }}
            />
          </Tooltip>
        ) : (
          <></>
        )}
        {props.downloadButton ? (
          <Tooltip title={language('project.export')} placement="top">
            <DownloadOutlined
              onClick={() => downloadClick()}
              style={{ fontSize: '15px' }}
            />
          </Tooltip>
        ) : (
          <></>
        )}
        {props.otherOperate ? otherOperate() : <></>}
      </>
    )
  }

  const onExpand = (expanded, record) => {
    //expanded是否展开 record每一项的值
    let data = {}
    data.id = record.id
    data.orderID = record.orderID
    const pList = dataList
    if (!expanded) {
      pList.map((items) => {
        if (items.id == record.id) {
          if (!items.children) {
            items.children = []
          }
        }
      })
      setList([...pList])
      return false
    }
    if (record.children?.length > 0) return
    post(onExpandUrl, data)
      .then((res) => {
        pList.map((items) => {
          if (items.id == record.id) {
            if (!items.children) {
              items.children = res.data ? res.data : []
            }
          }
        })
        setList([...pList])
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  return (
    <div className="components-table-resizable-column">
      <ProTable
        key={props.tableKey}
        search={false}
        className="proTableBox"
        bordered={true}
        columns={props.columns}
        headerTitle={props.searchText}
        components={components}
        rowClassName={(record) => {
          return rowOpenClassName ? rowOpenClassName(record) : ''
        }}
        onExpand={onExpandUrl ? onExpand : false}
        expandable={expandAble ? expandAble : false}
        loading={loading}
        options={{
          setting: true,
          reload: () => {
            setLoading(true)
            setCurrPage(1)
            setReloadDL(reloadDL + 1)
          },
        }}
        //设置选中提示消失
        tableAlertRender={false}
        scroll={{ y: props.clientHeight + 16 }}
        rowKey={props.rowkey}
        dataSource={dataList}
        columnsState={{
          value: columnsHide,
          persistenceType: 'localStorage',
          onChange: (value, key) => {
            setColumnsHide(value)
            store.set(props.columnvalue, value)
          },
        }}
        rowSelection={
          props.rowSelection
            ? {
                columnWidth: 32,
                selectedRowKeys,
                onChange: onSelectedRowKeysChange,
                getCheckboxProps: (record) => {
                  if (selectDisabled) {
                    return selectDisabled(record)
                  }
                },
              }
            : false
        }
        toolBarRender={toolButton}
        onChange={(paging, filters, sorter) => {
          setLoading(true)
          setFilters(JSON.stringify(filters))
          //判断是否开启拖拽上下移动
          if (setScreenList) {
            setScreenList(JSON.stringify(filters))
          }
          if (filterChange) {
            filterChange(filters)
          }
          setSortOrder(sorter.order)
          setSorttext(sorter.field)
          setCurrPage(paging.current)
          setLimitVal(paging.pageSize)
          store.set(props.tableKey, paging.pageSize)
        }}
        pagination={
          showPage
            ? false
            : {
                showSizeChanger: true,
                pageSize: limitVal,
                current: currPage,
                total: totEntry,
                showTotal: (total) =>
                  language('project.page', { total: total }),
              }
        }
      />
    </div>
  )
}
