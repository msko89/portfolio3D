/**
 * @author msko@mcnc.co.kr
 * @desc 공통상수
 */
var CONST =
{
	"PAGING_CNT" : 10,
	
	"REG_STATUS_REGIST" : "R",	// 등록완료 
	"REG_STATUS_MODIFY" : "M",	// 수정요청중 
	"REG_STATUS_APPROVE" : "P",	// 수정승인 
	"REG_STATUS_END" : "E",		// 종결 
		
	"REG_STATUS" : {
		"R" : {
			"NAME" : "등록완료",
			"CLASS" : "state01"
		},
		"M" : {
			"NAME" : "수정요청중",
			"CLASS" : "state02"
		},
		"P" : {
			"NAME" : "수정승인",
			"CLASS" : "state03"
		},
		"E" : {
			"NAME" : "종결",
			"CLASS" : "state04"
		}
	},
	
	"REGION_TYPE" : {
		"O" : "해외",
		"I" : "국내"
	},
	
	"LODGEMENT_TYPE" : {
		"L" : "숙소",
		"H" : "호텔"
	}
};
