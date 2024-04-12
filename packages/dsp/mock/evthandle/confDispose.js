import Mock from "mockjs";
export default function (getParam, postParam, res) {
  let json;
  if (getParam.action == "showSensitiveList") {
    json = Mock.mock({
      success: true,
      total: 52,
      "data|50": [
        {
          id: "@id",
          state: "@pick(['Y','N'])",
          analyze_result: "@pick(['1','2','3','4','5'])",
          key_words: ["key1", "key2"],
          analyze_people: "张三",
          analyze_time: "2024-12-12 12:12:12",
          dispose_result: "",
          warning: "",
          time: "2024-12-12 12:12:12",
        },
      ],
    });
  } else if (getParam.action == "showAttackList") {
    json = Mock.mock({
      success: true,
      total: 52,
      "data|50": [
        {
          warn_id: "@id",
          state: "@pick(['Y','N'])",
          warn_title: "title",
          warn_level: "@pick(['1','2','3','4','5'])",
          warn_desc: "预警描述",
          expire_date: "2024-12-12",
          time: "2024-12-12 12:12:12",
          relation_events: [
            {
              device_id: "220299010001",
              alarm_id: ["22029901001234567890", "22029901001234567890"],
            },
            { device_id: "220299010002", alarm_id: ["22029901001234567890"] },
          ],
        },
      ],
    });
  } else if (getParam.action == "showAttackDetail") {
    json = Mock.mock({
      success: true,
      device: {
        type: "计算机",
        device_id: "22049901042312",
        devname: "计算机01",
        devip: "@ip",
        user_org: "安全部门",
        user_name: "张三",
      },
      "alarm|2": [
        {
          id: "22049901042312",
          time: "2022-04-23",
          name: "攻击告警",
          risk: "3",
          rule_id: "22049901042312",
          version: "v8",
          attacker: "@ip",
          victim: "@ip",
          attack_class: "000",
          attack_result: "崩了",
        },
      ],
    });
  }
  res.json(json);
}
