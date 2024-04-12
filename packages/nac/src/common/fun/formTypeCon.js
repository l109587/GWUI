import React from "react";
import { InputNumber, Space } from "antd";
import ProForm, {
  ProFormText,
  ProFormTextArea,
  ProFormDigit,
  ProFormSelect,
} from "@ant-design/pro-form";
import { language } from "@/utils/language";
import { regList } from "@/utils/regExp";
import "./formcss.less";
import {
  DeleteOutlined,
  SaveFilled,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { EditableProTable } from "@ant-design/pro-components";

/**
 * 最大长度方法
 * @param {*文字内容} val
 * @param {*限制长度} limitLen
 * @param {限制类型最大最小长度} type
 * @returns
 */
const sizeLenght = (val, limitLen, type = "max") => {
  var str = val;
  var i = 0;
  var c = 0;
  var unicode = 0;
  var len = 0;
  len = str.length;
  for (i = 0; i < len; i++) {
    unicode = str.charCodeAt(i);
    if (unicode < 127) {
      //判断是单字符还是双字符
      c += 1;
    } else {
      //chinese
      c += 3;
    }
  }
  if (type == "max") {
    if (c > limitLen) {
      return false;
    } else {
      return true;
    }
  } else {
    if (c < limitLen) {
      return false;
    } else {
      return true;
    }
  }
};

/**
 * 自定义正则方法
 * @param {*正则} rules
 * @param {*输入内容} value
 * @param {*回调信息} callback
 * @param {*最大字节长度} maxLen
 * @param {*最小字节长度} minLen
 */
const validatorFn = (rules = "", value, callback, maxLen = "", minLen = "") => {
  if (value) {
    if (rules) {
      let reg = rules[0].pattern;
      if (!reg.test(value)) {
        callback(rules[0].message);
      }
    }
    if (minLen) {
      let res = sizeLenght(value, minLen, "min");
      if (!res) {
        callback(minText(minLen));
      }
    }
    if (maxLen) {
      let res = sizeLenght(value, maxLen);
      if (!res) {
        callback(maxText(maxLen));
      }
    }
    callback();
  } else {
    callback();
  }
};

/**
 * 最小长度文本
 * @param {长度} num
 * @returns
 */
const minText = (num) => {
  if (num < 3) {
    return language("project.strtextminbyte", { maxLen: num });
  } else {
    let sizeNum = parseInt(num / 3);
    return language("project.strtextmin", { maxSize: sizeNum, maxLen: num });
  }
};

/**
 * 最大长度文本
 * @param {长度} num
 * @returns
 */
const maxText = (num) => {
  let sizeNum = parseInt(num / 3);
  return language("project.strtextmax", { maxSize: sizeNum, maxLen: num });
};

/**
 *
 * @param {提交参数名称} name
 * @param {标题内容} label
 * @param {正则验证内容} rules
 * @param {内容是否必填} required
 * @param {宽度} width
 * @param {样式} style
 * @param {最大字节长度} max
 * @param {最小字节长度} min
 * @returns
 */
export const NumberFormSmall = (data = {}) => {
  return (
    <div className="commonnumbersmallbox">
      <ProForm.Item
        name={data.name || data.name === false ? data.name : "name"}
        disabled={data.disabled ? true : false}
        label={data.label || data.label === false ? data.label : false}
        style={data.style ? data.style : {}}
        tooltip={data.tooltip ? data.tooltip : false}
        placeholder={data.placeholder ? data.placeholder : false}
        rules={[{ required: data.required ? true : false }]}
        min={data.min ? data.min : 0}
        max={data.max ? data.max : false}
        fieldProps={{
          precision: 0,
          controls: false,
        }}
      >
        <InputNumber
          style={data.width ? { width: data.width } : {}}
          size="small"
          addonAfter={"天"}
        />
      </ProForm.Item>
      {data.afterText ? (
        <div
          style={{
            marginLeft: "14px",
          }}
        >
          {data.afterText}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

/**
 *
 * @param {提交参数名称} name
 * @param {标题内容} label
 * @param {正则验证内容} rules
 * @param {内容是否必填} required
 * @param {宽度} width
 * @param {样式} style
 * @param {最大字节长度} max
 * @param {最小字节长度} min
 * @returns
 */
export const NumberForm = (data = {}) => {
  return (
    <div className="commonnumberbox">
      <ProForm.Item
        name={data.name || data.name === false ? data.name : "name"}
        disabled={data.disabled ? true : false}
        label={data.label || data.label === false ? data.label : false}
        style={data.style ? data.style : {}}
        tooltip={data.tooltip ? data.tooltip : false}
        placeholder={data.placeholder ? data.placeholder : false}
        rules={[{ required: data.required ? true : false }]}
        min={data.min ? data.min : 0}
        max={data.max ? data.max : false}
        fieldProps={{
          precision: 0,
          controls: false,
        }}
      >
        <InputNumber
          style={data.width ? { width: data.width } : {}}
          addonAfter={"天"}
        />
      </ProForm.Item>
      {data.afterText ? (
        <div
          style={{
            marginLeft: "14px",
          }}
        >
          {data.afterText}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export const NumberField = (props) => {
  return (
    <div
      className={props.type === "small" ? "smNumFieldDiv" : "deNumFieldDiv "}
    >
      <div className={props.marButStatus == true ? "fieldfrombuttom0" : ""}>
        <ProFormDigit
          label={props?.label}
          name={props?.name}
          rules={props.rules ? props.rules : []}
          width={props.width ? props.width : "80px"}
          placeholder={props.placeholder ? props.placeholder : "请输入"}
          fieldProps={{ size: props.type === "small" ? "small" : "middle" }}
          min={props.min ? props.min : 0}
          max={props.max ? props.max : false}
          addonBefore={props?.addonBefore}
          addonAfter={
            props.afterUnit ? (
              <Space>
                <div
                  className="afterUnit"
                  style={{ width: props.unitWidth ? props.unitWidth : "40px" }}
                >
                  {props?.afterUnit}
                </div>
                {props?.afterText}
              </Space>
            ) : props.afterSelect ? (
              <Space className="afterSelectDiv">
                <ProFormSelect
                  name={props.selectName}
                  options={props.selectOptions}
                  width={props.selectWidth ? props.selectWidth : "60px"}
                  allowClear={props?.selectClear}
                  fieldProps={{
                    size: props.type === "small" ? "small" : "middle",
                    defaultValue: props.selectValue ? props.selectValue : "",
                  }}
                  onChange={(e) => {
                    if (props.onSelectChange) {
                      props.onSelectChange(e);
                    }
                  }}
                />
                {props?.afterText}
              </Space>
            ) : props.afterText ? (
              props.afterText
            ) : (
              ""
            )
          }
        />
      </div>
    </div>
  );
};
