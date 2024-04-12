import React, { useRef, useState, useEffect } from "react";
import { Dropdown, Menu } from "antd";
import DropdownIcon from "@/assets/operate/dropdown.svg";
import "./cutdropdowm.less";
export default (props) => {
  let { addrlist, symbol } = props;
  let menu = [];
  if (addrlist) {
    if (typeof addrlist === "string") {
      addrlist = addrlist.split(symbol ? symbol : ";");
    }
    addrlist.map((item) => {
      menu.push({
        key: item,
        label: item,
        icon: (
          <div style={{ marginRight: 0, color: "#1677FF", fontSize: "14px" }}>
            ●
          </div>
        ),
      });
    });
  }

  return (
    <>
      {addrlist ? (
        <Dropdown
          overlay={<Menu items={menu} />}
          overlayClassName="menudropdown"
          trigger={["click"]}
          placement="bottomLeft"
        >
          <div
            className="addrlistspace"
            onClick={false}
            style={{ display: "flex" }}
          >
            <div>
              <img src={DropdownIcon} alt="" />
            </div>
            <div
              onClick={false}
              style={{
                width: "calc(100% - 15px)",
                overflow: "hidden",
                marginLeft: 5,
              }}
            >
              {addrlist?.join(";")}
            </div>
          </div>
        </Dropdown>
      ) : (
        <></>
      )}
    </>
  );
};
