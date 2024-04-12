export default function confSignature(getParam, postParam, res) {
  let json = ''
  if (getParam.action == 'showSignature') {
    json = require('../json/cfgmngt/showSign.json');
  }
  else if (getParam.action == 'showSigTemplate') {
    json = require('../json/cfgmngt/showSignature.json');
  } else if (getParam.action == 'SignatureBatchTemplate') {
    json = require('../json/cfgmngt/signatureBatchTemplate.json');
  } else if (getParam.action == 'showSignatureField') {
    json = require('../json/cfgmngt/showSignatureField.json');
  } else if (getParam.action == 'showSignatureBuisusg') {
    json = require('../json/cfgmngt/showSignatureBuisusg.json');
  }

  res.send(json)
}
