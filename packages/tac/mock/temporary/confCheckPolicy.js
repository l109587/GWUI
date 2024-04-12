export default function confCheckPolicy(getParam, postParam, res) {
  let json = ''
  if (getParam.action == 'showCheckPolicy') {
    json = require('../json/confCheckPolicy/showCheckPolicy.json');
  }
  res.send(json)
}
