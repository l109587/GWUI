export default function confAccessPolicy(getParam, postParam, res) {
  let json = ''
  if (getParam.action == 'showAccessPolicy') {
    json = require('../json/confAccessPolicy/showAccessPolicy.json');
  } else if (getParam.action == 'showAccessPolicyDate') {
    json = require('../json/confAccessPolicy/showAccessPolicyDate.json');
  }
  res.send(json)
}
