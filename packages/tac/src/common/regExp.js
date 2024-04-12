import { language } from '@/utils/language'
let regCommonList = {
	"notesText": {
		"regex": /^[a-zA-Z0-9\u4E00-\u9FA5\,\!:()\._-？、【】（），。！\?*]+$/,
		"alertText": language('project.notesText')
	},
}

export {
	regCommonList,
}
