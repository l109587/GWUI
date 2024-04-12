import React, { useRef, useState, useEffect } from "react";
import { Dropdown, Menu, Popover } from "antd";
import { ViewGridList, LinkTwo, Time } from "@icon-park/react";
import {
  DrawerForm,
  ProFormSelect,
  ProFormRadio,
  ProFormCheckbox,
  ProFormText,
  ProFormTextArea,
  ProForm,
} from "@ant-design/pro-components";
import "./cutdropdowm.less";
export default (props) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleOpenChange = (newOpen, status = false) => {
    if (status) {
      setPopoverOpen(newOpen)
    }
  }

  let { addrlist, symbol, text = '' } = props;
  console.log(addrlist, "addrlist");

  let menu = [];
  if (addrlist) {
    addrlist.map((item) => {
      menu.push({
        key: item,
        label: item,
        value: item,
      });
    });
  }

  const popoverContent = (
    <ProFormCheckbox.Group
    name="1e111xt"
    className="checkbox-width-arrange-mode"
    options={menu}
  />
  )

  return (
    <>
      {addrlist ? (
                <Popover
                overlayClassName='dspcustompopover'
                placement='bottom'
                content={popoverContent}
                // visible={popoverOpen}
              >
                <span onClick={() => {
                  handleOpenChange(popoverOpen ? false : true, true)
                }}>
                   {text}
                </span>
              </Popover>
      ) : (
        <></>
      )}
    </>
  );
};
