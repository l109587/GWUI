import { language } from "@/utils/language";
import "./vendorIcon.less";
import { Tooltip } from "antd";
import Xgimi from "@/assets/images/vendorImg/Xgimi.svg";

import { VendorIcon } from "./SymbolIcon";
const vendorIcon = (props) => {
  let icon = props ? props?.toLowerCase() : "";
  if(icon == "lenovo") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Lenovo" />
        </div>
      </Tooltip>
    );
  } else if(icon == "aaeon") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Aaeon" />
        </div>
      </Tooltip>
    );
  } else if(icon == "advantech") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Advantech" />
        </div>
      </Tooltip>
    );
  } else if(icon == "kedacom") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-kedacom" />
        </div>
      </Tooltip>
    );
  } else if(icon == "nortel") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Nortel" />
        </div>
      </Tooltip>
    );
  } else if(icon == "kyocera") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Kyocera" />
        </div>
      </Tooltip>
    );
  } else if(icon == "custom pc") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-CustomPc" />
        </div>
      </Tooltip>
    );
  } else if(icon == "cisco") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Cisco" />
        </div>
      </Tooltip>
    );
  } else if(icon == "dell") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Dell" />
        </div>
      </Tooltip>
    );
  } else if(icon == "asus") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Asus" />
        </div>
      </Tooltip>
    );
  } else if(icon == "gigabyte technology") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-GigabyteTechnology" />
        </div>
      </Tooltip>
    );
  } else if(icon == "tp-link") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-TP-Link" />
        </div>
      </Tooltip>
    );
  } else if(icon == "hp") {
    return (
      <Tooltip title={icon} placement="topLeft">
        {/* <img className="vendorImg" src={HP" />
        </div> */}
        {/* <i className="iconfont icon-HP" />; */}
        <div>
          <VendorIcon type="icon-HP" />
        </div>
      </Tooltip>
    );
  } else if(icon == "acer") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Acer" />
        </div>
      </Tooltip>
    );
  } else if(icon == "huawei") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Huawei" />
        </div>
      </Tooltip>
    );
  } else if(icon == "supermicro") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Supermicro" />
        </div>
      </Tooltip>
    );
  } else if(icon == "hikvision") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Hikvision" />
        </div>
      </Tooltip>
    );
  } else if(icon == "mercury") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Mercury" />
        </div>
      </Tooltip>
    );
  } else if(icon == "bitdefender") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Bitdefender" />
        </div>
      </Tooltip>
    );
  } else if(icon == "dahua") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Dahua" />
        </div>
      </Tooltip>
    );
  } else if(icon == "xiaomi") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Xiaomi" />
        </div>
      </Tooltip>
    );
  } else if(icon == "tenda") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Tenda" />
        </div>
      </Tooltip>
    );
  } else if(icon == "multilaser") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Multilaser" />
        </div>
      </Tooltip>
    );
  } else if(icon == "raspberry pi") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-RaspberryPi" />
        </div>
      </Tooltip>
    );
  } else if(icon == "w-net technology") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-W-NetTechnology"></VendorIcon>
        </div>
      </Tooltip>
    );
  } else if(icon == "asrock") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-ASRock" />
        </div>
      </Tooltip>
    );
  } else if(icon == "netgear") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Netgear" />
        </div>
      </Tooltip>
    );
  } else if(icon == "google") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Google" />
        </div>
      </Tooltip>
    );
  } else if(icon == "tcl") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-TCL" />
        </div>
      </Tooltip>
    );
  } else if(icon == "ultra electronics command & cont") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-a-UltraElectronicsCommandCont" />
        </div>
      </Tooltip>
    );
  } else if(icon == "synology") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Synology" />
        </div>
      </Tooltip>
    );
  } else if(icon == "msi") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-MSI" />
        </div>
      </Tooltip>
    );
  } else if(icon == "sony") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Sony" />
        </div>
      </Tooltip>
    );
  } else if(icon == "ricoh") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Ricoh" />
        </div>
      </Tooltip>
    );
  } else if(icon == "sharp") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Sharp" />
        </div>
      </Tooltip>
    );
  } else if(icon == "jcg") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-JCG" />
        </div>
      </Tooltip>
    );
  } else if(icon == "konica minolta") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-KonicaMinolta" />
        </div>
      </Tooltip>
    );
  } else if(icon == "ikuaios") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-iKuaiOS" />
        </div>
      </Tooltip>
    );
  } else if(icon == "xen") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-XEN" />
        </div>
      </Tooltip>
    );
  } else if(icon == "ibm") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-IBM" />
        </div>
      </Tooltip>
    );
  } else if(icon == "kabylake") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-KabyLake" />
        </div>
      </Tooltip>
    );
  } else if(icon == "yealink") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Yealink" />
        </div>
      </Tooltip>
    );
  } else if(icon == "vivo") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Vivo" />
        </div>
      </Tooltip>
    );
  } else if(icon == "samsung") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Samsung" />
        </div>
      </Tooltip>
    );
  } else if(icon == "fast") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Fast" />
        </div>
      </Tooltip>
    );
  } else if(icon == "medion") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Medion" />
        </div>
      </Tooltip>
    );
  } else if(icon == "hpe") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-HPE" />
        </div>
      </Tooltip>
    );
  } else if(icon == "tda - technology division advanc") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-TDA-TechnologyDivisionAdvanc" />
        </div>
      </Tooltip>
    );
  } else if(icon == "oppo") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Oppo" />
        </div>
      </Tooltip>
    );
  } else if(icon == "microsoft") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Microsoft" />
        </div>
      </Tooltip>
    );
  } else if(icon == "xgimi") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <img src={Xgimi} className="vendorImg" />
      </Tooltip>
    );
  } else if(icon == "casper bilgisayar sistemleri") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-CasperBilgisayarSistemleri" />
        </div>
      </Tooltip>
    );
  } else if(icon == "d-link") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-D-Link" />
        </div>
      </Tooltip>
    );
  } else if(icon == "ruijie") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Ruijie" />
        </div>
      </Tooltip>
    );
  } else if(icon == "samson") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Samson" />
        </div>
      </Tooltip>
    );
  } else if(icon == "biostar") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Biostar" />
        </div>
      </Tooltip>
    );
  } else if(icon == "apple") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Apple" />
        </div>
      </Tooltip>
    );
  } else if(icon == "meizu") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Meizu" />
        </div>
      </Tooltip>
    );
  } else if(icon == "maxprint") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Maxprint" />
        </div>
      </Tooltip>
    );
  } else if(icon == "toshiba tec") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-ToshibaTec" />
        </div>
      </Tooltip>
    );
  } else if(icon == "h3c") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-H3C" />
        </div>
      </Tooltip>
    );
  } else if(icon == "qnap systems") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-QNAPSystems" />
        </div>
      </Tooltip>
    );
  } else if(icon == "polycom") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Polycom" />
        </div>
      </Tooltip>
    );
  } else if(icon == "viewsonic") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-ViewSonic" />
        </div>
      </Tooltip>
    );
  } else if(icon == "xerox") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Xerox" />
        </div>
      </Tooltip>
    );
  } else if(icon == "sonnet") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Sonnet" />
        </div>
      </Tooltip>
    );
  } else if(icon == "greatek") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Greatek" />
        </div>
      </Tooltip>
    );
  } else if(icon == "lexmark") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Lexmark" />
        </div>
      </Tooltip>
    );
  } else if(icon == "fujitsu") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Fujitsu" />
        </div>
      </Tooltip>
    );
  } else if(icon == "nintendo") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Nintendo" />
        </div>
      </Tooltip>
    );
  } else if(icon == "brother") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Brother" />
        </div>
      </Tooltip>
    );
  } else if(icon == "moxa") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Moxa" />
        </div>
      </Tooltip>
    );
  } else if(icon == "teradici") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Teradici" />
        </div>
      </Tooltip>
    );
  } else if(icon == "intel") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Intel" />
        </div>
      </Tooltip>
    );
  } else if(icon == "lantronix") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Lantronix" />
        </div>
      </Tooltip>
    );
  } else if(icon == "chassis manufacturer") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-ChassisManufacturer" />
        </div>
      </Tooltip>
    );
  } else if(icon == "eagle eye networks") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-EagleEyeNetworks" />
        </div>
      </Tooltip>
    );
  } else if(icon == "smarttv") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-SmartTV" />
        </div>
      </Tooltip>
    );
  } else if(icon == "interlogix") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Interlogix" />
        </div>
      </Tooltip>
    );
  } else if(icon == "bowers & wilkins") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-a-BowersWilkins" />
        </div>
      </Tooltip>
    );
  } else if(icon == "technopc") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Technopc" />
        </div>
      </Tooltip>
    );
  } else if(icon == "netis") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Netis" />
        </div>
      </Tooltip>
    );
  } else if(icon == "philips") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Philips" />
        </div>
      </Tooltip>
    );
  } else if(icon == "maxprint technology") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-MaxprintTechnology" />
        </div>
      </Tooltip>
    );
  } else if(icon == "lutron") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Lutron" />
        </div>
      </Tooltip>
    );
  } else if(icon == "newline interactive") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-NewlineInteractive" />
        </div>
      </Tooltip>
    );
  } else if(icon == "fujifilm") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-FUJIFILM" />
        </div>
      </Tooltip>
    );
  } else if(icon == "greatwall") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Greatwall" />
        </div>
      </Tooltip>
    );
  } else if(icon == "getac") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Getac" />
        </div>
      </Tooltip>
    );
  } else if(icon == "foundertech") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Foundertech" />
        </div>
      </Tooltip>
    );
  } else if(icon == "tsinghua tongfang computer") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-TsinghuaTongfangComputer" />
        </div>
      </Tooltip>
    );
  } else if(icon == "novatech") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Novatech" />
        </div>
      </Tooltip>
    );
  } else if(icon == "canon") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Canon" />
        </div>
      </Tooltip>
    );
  } else if(icon == "packard bell") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-PackardBell" />
        </div>
      </Tooltip>
    );
  } else if(icon == "zte") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-ZTE" />
        </div>
      </Tooltip>
    );
  } else if(icon == "nihon kohden") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-NihonKohden" />
        </div>
      </Tooltip>
    );
  } else if(icon == "peloton") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Peloton" />
        </div>
      </Tooltip>
    );
  } else if(icon == "ecs") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-ECS" />
        </div>
      </Tooltip>
    );
  } else if(icon == "nimble") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Nimble" />
        </div>
      </Tooltip>
    );
  } else if(icon == "zebra") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Zebra" />
        </div>
      </Tooltip>
    );
  } else if(icon == "oneplus") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-OnePlus" />
        </div>
      </Tooltip>
    );
  } else if(icon == "inspur") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Inspur" />
        </div>
      </Tooltip>
    );
  } else if(icon == "thomson") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Thomson" />
        </div>
      </Tooltip>
    );
  } else if(icon == "colorful technology and developm") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-ColorfulTechnologyAndDevelopm" />
        </div>
      </Tooltip>
    );
  } else if(icon == "american megatrends") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-AmericanMegatrends" />
        </div>
      </Tooltip>
    );
  } else if(icon == "rockchip") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Rockchip" />
        </div>
      </Tooltip>
    );
  } else if(icon == "toshiba") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Toshiba" />
        </div>
      </Tooltip>
    );
  } else if(icon == "oki") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-OKI" />
        </div>
      </Tooltip>
    );
  } else if(icon == "nvidia") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Nvidia" />
        </div>
      </Tooltip>
    );
  } else if(icon == "omega technology wireless n rout") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-OmegaTechnologyWirelessNRout" />
        </div>
      </Tooltip>
    );
  } else if(icon == "emachines") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Emachines" />
        </div>
      </Tooltip>
    );
  } else if(icon == "siemens") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Siemens" />
        </div>
      </Tooltip>
    );
  } else if(icon == "parallels") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Parallels" />
        </div>
      </Tooltip>
    );
  } else if(icon == "nexcom") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Nexcom" />
        </div>
      </Tooltip>
    );
  } else if(icon == "amazon") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Amazon" />
        </div>
      </Tooltip>
    );
  } else if(icon == "hitachi") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Hitachi" />
        </div>
      </Tooltip>
    );
  } else if(icon == "link-net technology") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-NetTechnology" />
        </div>
      </Tooltip>
    );
  } else if(icon == "pixel ti") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-PixelTi" />
        </div>
      </Tooltip>
    );
  } else if(icon == "sky") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Sky" />
        </div>
      </Tooltip>
    );
  } else if(icon == "timi") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Timi" />
        </div>
      </Tooltip>
    );
  } else if(icon == "ni") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-NI" />
        </div>
      </Tooltip>
    );
  } else if(icon == "realtek") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Realtek" />
        </div>
      </Tooltip>
    );
  } else if(icon == "smartisan") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Smartisan" />
        </div>
      </Tooltip>
    );
  } else if(icon == "igel") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-IGEL" />
        </div>
      </Tooltip>
    );
  } else if(icon == "espera-werke") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Espera-Werke" />
        </div>
      </Tooltip>
    );
  } else if(icon == "epson") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Epson" />
        </div>
      </Tooltip>
    );
  } else if(icon == "escene") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Escene" />
        </div>
      </Tooltip>
    );
  } else if(icon == "nad") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-NAD" />
        </div>
      </Tooltip>
    );
  } else if(icon == "swann") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Swann" />
        </div>
      </Tooltip>
    );
  } else if(icon == "jwipc") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Jwipc" />
        </div>
      </Tooltip>
    );
  } else if(icon == "logitech") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Logitech" />
        </div>
      </Tooltip>
    );
  } else if(icon == "qualcomm allplay") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-QualcommAllPlay" />
        </div>
      </Tooltip>
    );
  } else if(icon == "nanjing sandemarine electric") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-NanjingSandemarineElectric" />
        </div>
      </Tooltip>
    );
  } else if(icon == "realme") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Realme" />
        </div>
      </Tooltip>
    );
  } else if(icon == "autonomic") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Autonomic" />
        </div>
      </Tooltip>
    );
  } else if(icon == "oracle") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Oracle" />
        </div>
      </Tooltip>
    );
  } else if(icon == "directlogic") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-DirectLOGIC" />
        </div>
      </Tooltip>
    );
  } else if(icon == "netally") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-netAlly" />
        </div>
      </Tooltip>
    );
  } else if(icon == "viglen") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Viglen" />
        </div>
      </Tooltip>
    );
  } else if(icon == "l3harris") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-L3Harris" />
        </div>
      </Tooltip>
    );
  } else if(icon == "olidata") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Olidata" />
        </div>
      </Tooltip>
    );
  } else if(icon == "vmware") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-VMware" />
        </div>
      </Tooltip>
    );
  } else if(icon == "avaya") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Avaya" />
        </div>
      </Tooltip>
    );
  } else if(icon == "msc vertriebs") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-MscVertriebs" />
        </div>
      </Tooltip>
    );
  } else if(icon == "dynabook") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Dynabook" />
        </div>
      </Tooltip>
    );
  } else if(icon == "panasonic") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Panasonic" />
        </div>
      </Tooltip>
    );
  } else if(icon == "omron healthcare") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-OmronHealthcare" />
        </div>
      </Tooltip>
    );
  } else if(icon == "iftest") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Iftest" />
        </div>
      </Tooltip>
    );
  } else if(icon == "entrust datacard") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-EntrustDatacard" />
        </div>
      </Tooltip>
    );
  } else if(icon == "avance") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Avance" />
        </div>
      </Tooltip>
    );
  } else if(icon == "irobot") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-iRobot" />
        </div>
      </Tooltip>
    );
  } else if(icon == "tilgin") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Tilgin" />
        </div>
      </Tooltip>
    );
  } else if(icon == "yucel elektronik -technopc") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-YucelElektronik-Technopc" />
        </div>
      </Tooltip>
    );
  } else if(icon == "nec") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-NEC" />
        </div>
      </Tooltip>
    );
  } else if(icon == "dtri") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Dtri" />
        </div>
      </Tooltip>
    );
  } else if(icon == "softbank") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Softbank" />
        </div>
      </Tooltip>
    );
  } else if(icon == "ubee") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Ubee" />
        </div>
      </Tooltip>
    );
  } else if(icon == "hisense") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Hisense" />
        </div>
      </Tooltip>
    );
  } else if(icon == "ring") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Ring" />
        </div>
      </Tooltip>
    );
  } else if(icon == "enphase") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Enphase" />
        </div>
      </Tooltip>
    );
  } else if(icon == "shenzhen cudy technology") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-ShenzhenCudyTechnology" />
        </div>
      </Tooltip>
    );
  } else if(icon == "internet initiative japan") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-InternetInitiativeJapan" />
        </div>
      </Tooltip>
    );
  } else if(icon == "gembird") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Gembird" />
        </div>
      </Tooltip>
    );
  } else if(icon == "directv") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Directv" />
        </div>
      </Tooltip>
    );
  } else if(icon == "compulab") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-CompuLab" />
        </div>
      </Tooltip>
    );
  } else if(icon == "meross") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Meross" />
        </div>
      </Tooltip>
    );
  } else if(icon == "cujo") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Cujo" />
        </div>
      </Tooltip>
    );
  } else if(icon == "jio") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Jio" />
        </div>
      </Tooltip>
    );
  } else if(icon == "huddly") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Huddly" />
        </div>
      </Tooltip>
    );
  } else if(icon == "xtc") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-XTC" />
        </div>
      </Tooltip>
    );
  } else if(icon == "aruba networks") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-ArubaNetworks" />
        </div>
      </Tooltip>
    );
  } else if(icon == "kaonmedia") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-KaonMedia" />
        </div>
      </Tooltip>
    );
  } else if(icon == "oukitel") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Oukitel" />
        </div>
      </Tooltip>
    );
  } else if(icon == "stf mobile") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-STFMobile" />
        </div>
      </Tooltip>
    );
  } else if(icon == "razer") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Razer" />
        </div>
      </Tooltip>
    );
  } else if(icon == "roku") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Roku" />
        </div>
      </Tooltip>
    );
  } else if(icon == "verizon") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Verizon" />
        </div>
      </Tooltip>
    );
  } else if(icon == "jdcos") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Jdcos" />
        </div>
      </Tooltip>
    );
  } else if(icon == "mt-link") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-MT-Link" />
        </div>
      </Tooltip>
    );
  } else if(icon == "pantum") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Pantum" />
        </div>
      </Tooltip>
    );
  } else if(icon == "phicomm") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Phicomm" />
        </div>
      </Tooltip>
    );
  } else if(icon == "bdcom") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-BDCOM" />
        </div>
      </Tooltip>
    );
  } else if(icon == "asb") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-ASB" />
        </div>
      </Tooltip>
    );
  } else if(icon == "dptechsb") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-DPTECHSB" />
        </div>
      </Tooltip>
    );
  } else if(icon == "opzoon") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-Opzoon" />
        </div>
      </Tooltip>
    );
  } else if(icon == "galaxywind") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-GalaxyWind" />
        </div>
      </Tooltip>
    );
  } else if(icon == "topsec") {
    return (
      <Tooltip title={icon} placement="topLeft">
        {/* <img className="vendorImg" src={Topsec" />
        </div> */}
        <div>
          <VendorIcon type="icon-Topsec" />
        </div>
      </Tooltip>
    );
  } else if(icon == "mypower") {
    return (
      <Tooltip title={icon} placement="topLeft">
        <div>
          <VendorIcon type="icon-MyPower" />
        </div>
      </Tooltip>
    );
  } else {
    return <>{icon}</>;
  }
};

export default vendorIcon;
