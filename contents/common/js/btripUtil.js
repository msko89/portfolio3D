/**
 * @author msko@mcnc.co.kr
 * @desc 유틸리티 함수
 */

(function($, undefined)
{
	window.btripUtil = {};
	
	/**
	 * 서버의 응답(json 형식)에 대한 오류검사
	 * @param {Object} tr response
	 */
	btripUtil.checkResponseError = function(tr)
	{
		if(!tr)
		{
			bizMOB.Window.toast({ "_sMessage" : "알수 없는 오류 입니다." });
			return false;
		}
		if(!(tr.header))
		{
			bizMOB.Window.toast({ "_sMessage" : "알수 없는 오류 입니다." });
			return false;
		}
		if(!(tr.header.result))
		{
			var errCode = tr.header.error_code;
			
			if( errCode == "HE0503" || errCode == "NE0001" || errCode == "CE0001" )
			{
				bizMOB.Window.toast({ "_sMessage" : "서버에 연결할 수 없습니다." + errCode });
				return false;
			}
			else if( errCode == "NE0002" || errCode == "NE0003" )
			{
				bizMOB.Window.toast({ "_sMessage" : "네트워크 상태가 좋지 않습니다. 잠시후 다시 시도해 주세요." + errCode });
				return false;
			}
			else if( errCode == "ERR000" )
			{
				var btn = bizMOB.Window.createElement({ _sElementName : "TextButton" });
				btn.setProperty({
					_sText : "확인", _fCallback : function(){ bizMOB.App.exit({ _sType : "kill" }); }
				});
				bizMOB.Window.alert({
					_sTitle : "경고",
					_vMessage : "장시간 미사용으로 접속이 종료되었습니다. 다시 앱을 실행해주시기 바랍니다.",
					_eTextButton : btn
				});
				return false;
			}
			else
			{
				bizMOB.Window.toast({ "_sMessage" : tr.header.error_text });
				return false;
			}
		}
		else return true;
	};
	
	/**
	 * 화면 열기(세로고정)
	 */
	btripUtil.windowOpen = function()
	{		
		var param = $.extend({			
			"_sOrientation" : "portrait",
			"_bEffect" : false,
			"_bReplace" : false
		}, arguments[0]);
		
		if(param._bReplace == false){			
			bizMOB.Window.open(param);
		} else {
			bizMOB.Window.replace(param);
		}		
	};
	
	/**
	 * 화면ID
	 * */
	btripUtil.getPageId = function()
	{
		return document.URL.substring(document.URL.lastIndexOf("/") + 1, document.URL.lastIndexOf("."));
	};
	
	/**
	 * 화면경로
	 * */
	btripUtil.getPagePath = function()
	{
		return location.pathname.replace(/.+contents\//gi, '');
	};
	
	/**
	 * 사이드뷰 열기
	 */
	btripUtil.sideViewShow = function()
	{
		bizMOB.SideView.show({ 
			"_sPosition" : "right",
			"_nDuration" : 300,
			"_oMessage" : {
				"speed" : 300,
				"openerPagePath" : btripUtil.getPagePath() 
			}
		});
	};
	
	/**
	 * 사이드뷰 닫기 후 callback
	 */
	btripUtil.closeSideViewCallback = function(param)
	{				
		bizMOB.SideView.postMessage({
			_sPosition	: "center",
			_sCallback 	: "btripUtil.sideViewPostMessageCallback",
			_oMessage	: param.data
		});
	};
	
	/**
	 * 사이드뷰 닫은 후 센터뷰 callback
	 */
	btripUtil.sideViewPostMessageCallback = function(param)
	{
		switch(param.type){
			case "pageOpen" :
				btripUtil.windowOpen(param.message);
				break;
			case "main" :
				btripUtil.goToMain();
				break;
			case "logout" :
				btripUtil.appExit({ "_sType" : "logout" });
				break;
		}
	};
	
	/**
	 * 앱 종료/로그아웃
	 */
	btripUtil.appExit = function()
	{
		var param = $.extend({
			"_sType" : "kill"
		}, arguments[0]);
		
		var confirmMsg = param._sType == "kill" ? "앱을 종료하시겠습니까?" : "로그아웃 하시겠습니까?";
		
		var cBtn = bizMOB.Window.createElement({ "_sElementName" : "TextButton" });
		cBtn.setProperty({
			"_sText" : "취소",
			"_fCallback" : function(){}
		});
		
		var oBtn = bizMOB.Window.createElement({ "_sElementName" : "TextButton" });
		oBtn.setProperty({
			"_sText" : "확인",
			"_fCallback" : function(){				
				if(param._sType == "logout") {
					bizMOB.Storage.remove({ "_sKey" : "userId" });
					bizMOB.Storage.remove({ "_sKey" : "userNm" });
					bizMOB.Storage.remove({ "_sKey" : "deptNm" });
					bizMOB.Storage.remove({ "_sKey" : "email" });
					bizMOB.Storage.remove({ "_sKey" : "profileImg" });					
				}
				
				bizMOB.App.exit(param);
			}
		});
		
		var aTextButton = [cBtn,oBtn];
		if(bizMOB.Device.isAndroid()) aTextButton = [oBtn,cBtn];
		
		bizMOB.Window.confirm({
			"_vMessage" : confirmMsg,
			"_aTextButton" : aTextButton
		});
	};
	
	/**
	 * 날짜 포멧
	 * @param {String, Date} date : 날짜
	 */
	btripUtil.dateFormat = function(date)
	{
		if(!date){ return ""; }
		return date.bMToFormatDate("yyyy.mm.dd");
	};
	
	/**
	 * 금액 포멧
	 * @param {String} currencyCd : 통화
	 * @param {Number, String} amt : 금액
	 */
	btripUtil.amtFormat = function(currencyCd, amt)
	{
		return currencyCd + " " + amt.bMToStr().bMToCommaNumber();
	};
	
	/**
	 * 숫자만 표시
	 * @param {String} currencyCd : 통화
	 * @param {String} value
	 */
	btripUtil.displayOnlyNumber = function(currencyCd, value)
	{
		if(!value){ return ""; }
		var regExp = currencyCd == "USD" ? /[^0-9.]/g : /[^0-9]/g;		
		return value.replace(regExp,"");
	};
	
	/**
	 * 메인화면으로 이동
	 */
	btripUtil.goToMain = function()
	{
		bizMOB.Window.go({ "_sName" : "main" });
	};
	
	/**
	 * 카메라, 갤러리 호출
	 * @param {String} type : camera, gallery, multiGallery
	 * @param {Function} callback
	 */
	btripUtil.callCameraGallery =  function(type,callback)
	{
		if(type == "camera"){
			bizMOB.System.callCamera({
				"_fCallback" : function(res){
					if(res.path){
						var fileList = [{ "_sSourcePath" : res.path }];
						
						_resizeImage(fileList);
					}
				}
			});
		} else if(type == "gallery"){
			bizMOB.Util.callPlugIn("GET_MEDIA_PICK", {				
                "type_list" : ["image"],
                "max_count"	: 1,   
				"callback"	: function(res){					
					if(res.result){
						var fileList = [{ "_sSourcePath" : res.images[0].uri }];
						
						_resizeImage(fileList);
					} 
				}
			});
		} else if(type == "multiGallery"){
			bizMOB.Util.callPlugIn("GET_MEDIA_PICK", {				
                "type_list" : ["image"],
                "max_count"	: 10,   
				"callback"	: function(res){					
					if(res.result){
						var fileList = [];
						for(var i = 0, len = res.images.length; i < len; i++){							
							fileList.push({
								"_sSourcePath" : res.images[i].uri
							});
						}
						
						_resizeImage(fileList);
					} 
				}
			});
		} else {
			bizMOB.Util.callPlugIn("GET_MEDIA_PICK", {				
                "type_list" : ["image"],
                "max_count"	: 10,   
				"callback"	: function(res){					
					if(res.result){
						var fileList = [];
						for(var i = 0, len = res.images.length; i < len; i++){							
							fileList.push({
								"_sSourcePath" : res.images[i].uri
							});
						}
						
						_resizeImage(fileList);
					} 
				}
			});
		}
		
		var _resizeImage = function(fileList){			
			bizMOB.File.resizeImage({
				"_aFileList"		: fileList,
				"_sTargetDirectory"	: "{temporary}/uploadImg",
				"_nCompressRate"	: 30,
				"_fCallback" 		: function(resResizeImage){																
					if(resResizeImage.result){																		
						if(callback) callback(resResizeImage);									
					} else {
						bizMOB.Window.toast({ "_sMessage" : "사진 resize 변환에 실패하였습니다." });
						return;
					}
				}
	    	});
	    };
	};
	
	/**
	 * 파일 업로드
	 * @param {Array} fileList : 업로드할 파일 리스트
	 * @param {Function} callback
	 */
	btripUtil.fileUpload = function(fileList, callback)
	{
		bizMOB.File.upload({
			"_aFileList" : fileList,
			"_fCallback" : function(resfileUpload){
				if(resfileUpload.result){						
//					if(resfileUpload.list[0].result){
						if(callback) callback(resfileUpload);							
//					} else {
//						bizMOB.Window.toast({ "_sMessage" : "파일업로드를 실패하였습니다." });
//						return;
//					}						 
				} else {
					bizMOB.Window.toast({ "_sMessage" : "파일업로드 API호출에 실패하였습니다." });
					return;
				}
			}
		}); 	
	};
	
	/**
	 * event click 
	 * prevent double click
	 * @param {Number} term (millisecond)
	 */
	btripUtil.dbClick=false;
	$.event.special.click = {
	    delegateType: "click",
	    bindType: "click",
	    handle: function( event ) {
	        var handleObj = event.handleObj;
	        var ret = null;
	        
	        if(btripUtil.dbClick) return;	
	        btripUtil.dbClick = true;
	        
			setTimeout(function() { 	
				btripUtil.dbClick = false;
			}, ((event.data && event.data.term) || 700) );		
			
            event.type = handleObj.origType;
            ret = handleObj.handler.apply( this, arguments );
            event.type = handleObj.type;
            return ret;	        
	    }
	};
		
	/**
	 * 사용자 YYYYMMDD 날짜입력
	 * @param {Function} arg.blur
	 */
	$.fn.formatDateYYMMDD = function(arg)
	{	
		var $this = $(this);
		$this.attr({
			"maxlength" : "8",
			"type" : "tel",
			"placeholder" : "YYYYMMDD"
		})		
		.on("focus", function() {
			var showVal = $this.val().replace(/[^0-9]/g, "");
			
			$this.val(showVal)
				.attr({ "maxlength" : "8" });
		})		
		.on("blur", function() {			
			var inputVal = $this.val().replace(/[^0-9]/g, "");
			
			if( inputVal == "" ) {
				$this.data({"date" : ""}).val("");				
			} else {				
				if( inputVal.length != 8 ) {
					bizMOB.Window.toast({ "_sMessage" : "날짜는 숫자만 8자리로\n입력해 주세요" });
					
					$this.data({"date" : ""}).val("");
					return;
				}
				if( !Date.parse(inputVal.substr(0,4)+"-"+inputVal.substr(4,2)+"-"+inputVal.substr(6,2)) ) {
					bizMOB.Window.toast({ "_sMessage" : "입력 가능한 날짜가 아닙니다." });
					
					$this.data({"date" : ""}).val("");
					return;
				}
				
				$this.attr({ "maxlength" : "10" })
						.data({"date" : inputVal})
						.val( inputVal.bMToFormatDate('yyyy.mm.dd') );
			}
			
			if(arg&&arg.blur) { arg.blur(inputVal); }
		});
		
		return this;
	};
	
})(jQuery, undefined);
