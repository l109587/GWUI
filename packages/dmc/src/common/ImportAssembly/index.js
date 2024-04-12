import React, { useRef, useState, useEffect } from 'react'
import { ModalForm, ProFormText, DrawerForm, ProForm, ProFormSelect, ProTable } from '@ant-design/pro-components';
import { message, Button, Alert, Divider } from 'antd';
import { language } from '@/utils/language';
import { modalFormLayout } from "@/utils/helper";
import { TableLayout } from '@/components';
import { post } from '@/services/https';
import './index.less'
const { WebUploadr } = TableLayout;

let H = document.body.clientHeight - 336

export default (props) => {

  const { columnlist, uploadUrl, uploadAddUrl, onUploadSuccess, imoritModalStatus, setImoritModalStatus, uploadList} = props;
  const formRef = useRef();

  /** 导入 start */
  const [spinning, setSpinning] = useState(false);
  const [importFieldsList, setImportFieldsList] = useState([]) //导入 选择字段
  const [importFieldsArr, setImportFieldsArr] = useState([]) //导入 选择字段数组
  const [impErrorShow, setImpErrorShow] = useState(false) //是否显示错误提示
  const [impErrorMsg, setImpErrorMsg] = useState(true) //错误提示信息
  //接口参数 上传
  const paramentUpload = {
    'filecode': 'utf-8',
  }
  const uploadConfig = {
    accept: '.csv', //接受上传的文件类型：zip、pdf、excel、image
    max: 105, //限制上传文件大小
    url: uploadUrl,
  }
  const getImportModal = (status) => {
    if (status == 1) {
      setImoritModalStatus(true);
    } else {
      setImoritModalStatus(false);
    }
  }

  /* 导入弹框关闭 */
  const getCloseImport = (type) => {
    setSpinning(false);
    setImpErrorMsg();
    setImpErrorShow(false);
    getImportModal(2);
    setImportFieldsList([]);
    setImportFieldsArr([]);
  }

  /* 导入成功文件返回 */
  const onFileSuccess = (res) => {
    if (res.success) {
      let info = [{ value: '', label: '请选择' }];
      res.data.map((val, index) => {
        res.data[index] = val.trim();
        let confres = [];
        confres.label = val;
        confres.value = index + '&&' + val.trim();
        info.push(confres)
      })
      setImportFieldsList(res.data);
      setImportFieldsArr(info);
    } else {
      setImpErrorMsg(res.msg);
      setImpErrorShow(true);
    }
  }

  /* 提交导入内容标题 */
  const importTitle = async (info) => {
    setSpinning(true)
    let data = uploadList ? uploadList : {};
    data.headerLine = JSON.stringify(Object.values(info))
    data.field = JSON.stringify(Object.keys(info))
    post(uploadAddUrl, data)
      .then((res) => {
        if (!res.success) {
          setSpinning(false);
          setImpErrorMsg(res.msg);
          setImpErrorShow(true);
          return false;
        }
        message.success(res.msg)
        getCloseImport();
        onUploadSuccess(res);
      })
      .catch(() => {
        setSpinning(false);
        console.log('mistake')
      })
  }
  /**导入 end */

  return (<>
 
    {/**导入动态字段 选择 */}
    <DrawerForm {...modalFormLayout}
      formRef={formRef}
      title={language('project.import')}
      visible={imoritModalStatus} autoFocusFirstInput
      drawerProps={{
        className: 'importfiledrawrightbox importfiledrawbox',
        destroyOnClose: true,
        maskClosable: false,
        placement: 'right',
        onClose: () => {
          getCloseImport(2)
        },
      }}
      submitter={{
        render: (props, doms) => {
          return [
            doms[0],
            <Button type='primary' key='subment'
              onClick={() => {
                formRef.current.submit();
              }}
              loading={spinning}
            >
              {language('project.import')}
            </Button>
          ]
        }
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        importTitle(values);
      }}
    >
      <div className='dynamicbox' style={{ marginLeft: '10px' }}>
        <Alert className='filealert' message={language('dmcoconfig.uploaddesc')} type="info" showIcon />
        <div>
          <ProForm.Group >
            <ProFormText tooltip={language('dmcoconfig.fileformatcsv')} label={language('dmcoconfig.import')} >
              <div className='dynamicbox'>
                <WebUploadr
                  isAuto={true}
                  upurl={uploadConfig.url}
                  upbutext={language('dmcoconfig.importfile')}
                  maxSize={uploadConfig.max}
                  accept={uploadConfig.accept}
                  onSuccess={onFileSuccess}
                  parameter={paramentUpload}
                  isUpsuccess={true}
                  isShowUploadList={true}
                  maxCount={1}
                />
              </div>
            </ProFormText>
          </ProForm.Group>
        </div>

        {impErrorShow ? <Alert className='filealert'
          message={impErrorMsg}
          type="error"
          onClose={() => {
            setImpErrorShow(false);
          }}
          showIcon closable /> : ''}

      </div>
      <Divider orientation='left'>{language('project.datamapping')}</Divider>
      <div className='addrplanborderbox'>
        <ProForm.Group style={{ width: "100%" }}>
          <div style={{ width: '200px', marginBottom: '12px' }}>
            {language('project.importfilefields')}
          </div>
          <div style={{ width: '200px', marginBottom: '12px' }}>
            {language('project.mappingfields')}
          </div>
        </ProForm.Group>
        {
          columnlist.map((item) => {
            if (item.importStatus != 'N') {
              if (importFieldsList.length >= 1 && importFieldsArr.length >= 1) {
                return (
                  <ProForm.Group style={{ width: "100%" }}>
                    <ProFormSelect
                      width="200px"
                      options={importFieldsArr}
                      name={item.dataIndex}
                      initialValue={importFieldsList.indexOf(item.title) == -1 ? '' : importFieldsList.indexOf(item.title) + '&&' + item.title}
                      fieldProps={{
                        allowClear: false,
                      }}
                    />
                    <ProFormText
                      width="200px"
                      value={item.title}
                      disabled
                    />
                  </ProForm.Group>
                )
              } else {
                return (
                  <ProForm.Group style={{ width: "100%" }}>
                    <ProFormSelect
                      width="200px"
                      fieldProps={{
                        allowClear: false,
                      }}
                    />
                    <ProFormText
                      width="200px"
                      value={item.title}
                      disabled
                    />
                  </ProForm.Group>
                )
              }
            }
          })}
      </div>
    </DrawerForm>
  </>)
}

