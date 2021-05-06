/**
 * @author msko
 * @name  출장등록
 * @since 2018.04.10
 */
window.onload = function () {
  page.init();
};

var page = {
  init: function () {
    page.initData();
    page.initInterface();

    //스크롤영역
    var dh = $(document).height();
    var topFH = $('.topFix').height();
    var footH = $('.footBtn').outerHeight();
    $('.scrollArea02').css('top', topFH);
    $('.scrollArea02').css('height', dh - topFH - footH);
    $('.scrollArea02').css('-webkit-overflow-scrolling', 'touch');
  },

  initData: function () {
    page.drawBarGraph(25);
  },

  initInterface: function () {
    // 이전버튼
    $('.btnPrev').click(function () {
      page.rotateScreen('prev');
    });

    // 이전버튼
    $('.btnNext').click(function () {
      page.rotateScreen('next');
    });

    var touchStartX, touchStartY, touchEndX, touchEndY;
    $('#rotateTarget').on('touchstart', function (evt) {
      var touch = evt.originalEvent.touches[0],
        x = touch.clientX,
        y = touch.clientY;
      touchStartX = x;
      touchStartY = y;
    });

    $('#rotateTarget').on('touchmove', function (evt) {
      var touch = evt.originalEvent.touches[0],
        x = touch.clientX,
        y = touch.clientY;
      touchEndX = x;
      touchEndY = y;
    });

    $('#rotateTarget').on('touchend', function (evt) {
      var yScollNo = Math.abs(touchStartY - touchEndY) < 30,
        showIndex = $('#rotateTarget').find('.selected').index();

      if (touchStartX > touchEndX && touchStartX - touchEndX > 30 && yScollNo) {
        if (showIndex < 3) {
          page.rotateScreen('next');
        }
      } else if (
        touchStartX < touchEndX &&
        touchEndX - touchStartX > 30 &&
        yScollNo
      ) {
        if (showIndex > 0) {
          page.rotateScreen('prev');
        }
      } else {
        touchStartX = undefined;
        touchEndX = undefined;
      }
    });
  },

  /**
   * 상단바 그리기
   * @param {Number} barPercent : 상단바 비율
   */
  drawBarGraph: function (barPercent) {
    $('#barGraph').animate({ width: barPercent + '%' });
  },

  /**
   * 화면 전환
   * @param {String} type : prev/next
   */
  rotateScreen: function (type) {
    var $targetDiv = $('#rotateTarget').find('.selected'),
      targetIndex = $targetDiv.index(),
      barPercent = 0,
      index = 0;

    if (type == 'prev') {
      index = targetIndex - 1;
      barPercent = index * 25 + 25;
    } else if (type == 'next') {
      index = targetIndex + 1;
      barPercent = index * 25 + 25;
    }

    page.drawBarGraph(barPercent);
    Portfolio3D.showNewContent($('#rotateTarget'), index);
  },
};
