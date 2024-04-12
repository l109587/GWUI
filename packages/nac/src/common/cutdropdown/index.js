import React, { useRef, useState, useEffect } from "react";
import { Dropdown, Menu } from "antd";
import { ViewGridList, LinkTwo } from "@icon-park/react";
import ShowCont from "@/assets/nac/showCont.svg";
import "./cutdropdowm.less";
export default (props) => {
  let { addrlist, symbol } = props;
  console.log(addrlist, "addrlist");

  let menu = [];
  if (addrlist) {
    addrlist = addrlist.split(symbol ? symbol : ";");
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
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div
              onClick={false}
              style={{
                width: "calc(100% - 24px)",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                
              }}
            >
              {addrlist?.join(";")}
            </div>
            <div style={{ cursor: "pointer" }}>
              <img src={ShowCont} />
            </div>
          </div>
        </Dropdown>
      ) : (
        <></>
      )}
    </>
  );
};
