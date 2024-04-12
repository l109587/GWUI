import "./osIconType.less";
import UOS from "@/assets/images/osIcon/UOS.svg";
import { language } from "@/utils/language";
import { Tooltip } from "antd";
import { OsIcon } from "./SymbolIcon";

const OSIcon = (props) => {
  let icon = props ? props?.toLowerCase() : "";
  if(icon == "linux") {
    return <OsIcon type="icon-Linux" />;
  } else if(icon.includes("window")) {
    return <OsIcon type="icon-Windows" />;
  } else if(icon == "uos") {
    return <img className="osImg" src={UOS} />;
  } else if(icon == "unix-like") {
    return <OsIcon type="icon-UNIX-like" />;
  } else if(icon == "unix") {
    return <OsIcon type="icon-Unix" />;
  } else if(icon == "ubuntu") {
    return <OsIcon type="icon-Ubuntu" />;
  } else if(icon == "h3c comware") {
    return <OsIcon type="icon-a-H3CComware" />;
  } else if(icon == "debian") {
    return <OsIcon type="icon-Debian" />;
  } else if(icon == "cisco ios") {
    return <OsIcon type="icon-a-ciscoIOS" />;
  } else if(icon == "centos") {
    return <OsIcon type="icon-CentOS" />;
  } else if(icon == "kylinos") {
    return <OsIcon type="icon-KylinOS" />;
  } else if(icon == "vrp") {
    return <OsIcon type="icon-VRP" />;
  } else if(icon == "macos") {
    return <OsIcon type="icon-MacOS" />;
  } else if(icon == "wind river vxworks") {
    return <OsIcon type="icon-WindRiverVxWorks" />;
  } else if(icon == "android") {
    return <OsIcon type="icon-Android" />;
  } else if(icon == "opensuse") {
    return <OsIcon type="icon-openSUSE" />;
  } else if(icon == "os x") {
    return <OsIcon type="icon-MacOS" />;
  } else if(icon == "ios") {
    return <OsIcon type="icon-MacOS" />;
  } else if(icon == "funda") {
    return <OsIcon type="icon-Funda" />;
  } else {
    return <>-</>;
  }
};
export default OSIcon;
