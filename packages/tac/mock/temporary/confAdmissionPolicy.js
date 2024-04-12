export default function confAdmissionPolicy(getParam, postParam, res) {
  let json = ''
  if (getParam.action == 'showadmpolicy') {
    json = require('../json/confAdmissionPolicy/showadmpolicy.json');
  } else if (getParam.action == 'showadmpolicydata') {
    json = require('../json/confAdmissionPolicy/showadmpolicydata.json');
  }
  res.send(json)
}
