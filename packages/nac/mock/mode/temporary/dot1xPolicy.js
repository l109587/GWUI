import { mockMethod } from "../../../src/utils/common";
import Mock, { mock } from "mockjs";

const show = { success: true, total: 0, data: [] };
export default function confDot1xPolicy(getParam, postParam, res) {
  if (getParam.action == "showDot1xPolicy") {
    mockMethod("show", show, postParam, res);
  }
}
