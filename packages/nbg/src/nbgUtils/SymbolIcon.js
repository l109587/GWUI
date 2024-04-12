import React from "react";

require("@/assets/iconfont/iconfont.js"); //将下载文件中的iconfont.js引入

export const VendorIcon = (props) => {
  return (
    <svg className="vendorSvg" aria-hidden="true" viewBox="0 0 100 22">
      <use xlinkHref={`#${props.type}`} />
      <style jsx>{`
        .vendorSvg {
          width: 120px;
          height: 26px;
          line-height: 26px;
          vertical-align: middle;
          fill: currentColor;
          overflow: hidden;
        }
      `}</style>
    </svg>
  );
};
export const TypeIcon = (props) => {
  return (
    <svg className="typeSvg" aria-hidden="true">
      <use xlinkHref={`#${props.type}`} />
      <style jsx>{`
        .typeSvg {
          width: 16px;
          height: 16px;
          vertical-align: middle;
          fill: currentColor;
          overflow: hidden;
        }
      `}</style>
    </svg>
  );
};
export const OsIcon = (props) => {
  return (
    <svg className="osSvg" aria-hidden="true">
      <use xlinkHref={`#${props.type}`} />
      <style jsx>{`
        .osSvg {
          width: 16px;
          height: 16px;
          vertical-align: -0.15em;
          fill: currentColor;
          overflow: hidden;
        }
      `}</style>
    </svg>
  );
};
