import Mock from "mockjs";

export default function login(getParam, postParam, res) {
  if (getParam.action == "login") {
    var json = "";
    var admin = {
      username: "admin",
      password: "c4ca4238a0b923820dcc509a6f75849b",
    };
    var sec = {
      username: "secadm",
      password: "c4ca4238a0b923820dcc509a6f75849b",
    };
    var adt = {
      username: "audit",
      password: "c4ca4238a0b923820dcc509a6f75849b",
    };
    var data = postParam;
    if (data.username == admin.username && data.password == admin.password) {
      json = require("./json/equipment/login.json");
    } else if (data.username == sec.username && data.password == sec.password) {
      json = require("./json/login/secLogin.json");
    } else if (data.username == adt.username && data.password == adt.password) {
      json = require("./json/login/adtLogin.json");
    } else {
      json = { success: false, msg: "请输入正确的用户名或密码！" };
    }
    res.send(json);
  } else if (getParam.action == "token") {
    json = require("./json/login/token.json");
    res.send(json);
  } else if (getParam.action == "captcha") {
    json = require("./json/login/captcha.json");
    res.send(json);
  } else if (getParam.action == "config") {
    json = require("./json/login/config.json");
    res.send(json);
  } else if (getParam.action == "redirect") {
    json = require("./json/login/redirect.json");
    res.send(json);
  } else if (getParam.action == "loginCert") {
    json = require("./json/equipment/login.json");
    res.send(json);
  }
}
