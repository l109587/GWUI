import React, { useRef, useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { post } from '@/services/https';
import { language } from '@/utils/language';
import BasicInfo from './components/basicinfo';
import StatusInfo from './components/statusinfo';
import Effective from './components/effective';
import DevlistClose from '@/assets/dmc/devlist_close.svg';
import '@/utils/index.less';
import './../index.less';

const { TabPane } = Tabs;
let H = document.body.clientHeight - 105
var clientHeight = H
export default (props) => {
  let device_id = props.match.params.id;//设置默认设置id
  const [detailInfo, setDetailInfo] = useState([]);
  const [devTypeData, setDevTypeData] = useState([]);
  useEffect(() => {
    detail();
    typeList();
  }, [])

  const detail = () => {
    let data = [];
    data.device_id = device_id;
    post('/cfg.php?controller=confDevice&action=detail', data).then((res) => {
      if (res.success) {
        setDetailInfo(res.data);
      }
    }).catch(() => {
      console.log('mistake')
    })
  }

  const typeList = () => {
    post('/cfg.php?controller=confDevice&action=showDevTypeID').then((res) => {
			if(res.data && res.data.length >= 1){
				setDevTypeData(res.data ? res.data : []);
			}
		})
  }

  return (
    <>
      <div className='dseebigbox'>
        <Tabs className='lefttabsbox' tabPosition='left' style={{ height: clientHeight, backgroundColor: '#FFFFFF' }}>
          <TabPane tab={<div className='dmcseetabstitle'>{language('cfgmngt.devlist.basicinfo')}</div>} key="1">
            <div style={{ height: clientHeight }}>
              <BasicInfo detailInfo={detailInfo} devTypeData={devTypeData} />
            </div>
          </TabPane>
          <TabPane tab={<div className='dmcseetabstitle'>{language('cfgmngt.devlist.statusinfo')}</div>} key="2">
            <div style={{ height: clientHeight }}>
              <StatusInfo detailInfo={detailInfo} devTypeData={devTypeData} />
            </div>
          </TabPane>
          {detailInfo.type == 1 ?
            <TabPane tab={<div className='dmcseetabstitle'>{'生效策略'}</div>} key="3">
            <div style={{ height: clientHeight }}>
              <Effective detailInfo={detailInfo} devTypeData={devTypeData} />
            </div>
          </TabPane>
          :
          <></>
          }
        </Tabs>
        <div onClick={() => {
          window.history.back();
        }} className='blackclose'>
          <img src={DevlistClose} />
        </div>
      </div>
    </>
  )

}