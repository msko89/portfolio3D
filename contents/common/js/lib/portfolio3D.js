/**
 * @author msko
 * @name 3D Portfolio Template
 */
(function ($, undefined) {
  function Portfolio3D() {
    this.visibleFace = 'front';
    this.visibleRowIndex = 0;
    this.rotationValue = 0;
    this.perspectiveOriginValue = '';
  }

  Portfolio3D.prototype.showNewContent = function (target, index) {
    var self = this,
      direction = index > self.visibleRowIndex ? 'rightToLeft' : 'leftToRight',
      rotationParams = this.getRotationPrameters(direction),
      newVisibleFace = rotationParams[0],
      rotationY = rotationParams[1],
      translateZ = $(window).width() / 2;

    $(target).parent().css('perspective-origin', this.perspectiveOriginValue);
    $(target)
      .children()
      .removeClass('selected')
      .fadeOut()
      .eq(index)
      .removeClass('left-face right-face back-face front-face')
      .addClass(newVisibleFace + '-face selected')
      .fadeIn();

    this.setTransform(target, rotationY, translateZ);
    this.visibleFace = newVisibleFace;
    this.visibleRowIndex = index;
    this.rotationValue = rotationY;
  };

  Portfolio3D.prototype.getRotationPrameters = function (direction) {
    var newVisibleFace, rotationY;

    if (this.visibleFace == 'front') {
      newVisibleFace = direction == 'rightToLeft' ? 'right' : 'left';
    } else if (this.visibleFace == 'right') {
      newVisibleFace = direction == 'rightToLeft' ? 'back' : 'front';
    } else if (this.visibleFace == 'left') {
      newVisibleFace = direction == 'rightToLeft' ? 'front' : 'back';
    } else {
      newVisibleFace = direction == 'rightToLeft' ? 'left' : 'right';
    }

    if (direction == 'rightToLeft') {
      rotationY = this.rotationValue - 90;
    } else {
      rotationY = this.rotationValue + 90;
    }

    return [newVisibleFace, rotationY];
  };

  Portfolio3D.prototype.setTransform = function (
    target,
    rotationValue,
    translateValue
  ) {
    var self = this;

    $(target).css({
      '-moz-transform':
        'translateZ(-' +
        translateValue +
        'px) rotateY(' +
        rotationValue +
        'deg)',
      '-webkit-transform':
        'translateZ(-' +
        translateValue +
        'px) rotateY(' +
        rotationValue +
        'deg)',
      '-ms-transform':
        'translateZ(' -
        +translateValue +
        'px) rotateY(' +
        rotationValue +
        'deg)',
      '-o-transform':
        'translateZ(-' +
        translateValue +
        'px) rotateY(' +
        rotationValue +
        'deg)',
      transform:
        'translateZ(-' +
        translateValue +
        'px) rotateY(' +
        rotationValue +
        'deg)',
    });

    if (this.visibleRowIndex == 0 || this.visibleRowIndex == 2) {
      self.perspectiveOriginValue = $(target)
        .parent()
        .css('perspective-origin');
      $(target).parent().css('perspective-origin', '1000px');
    }
  };

  window.Portfolio3D = new Portfolio3D();
})(jQuery, undefined);
