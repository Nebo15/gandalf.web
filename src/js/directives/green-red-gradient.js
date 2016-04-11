

angular.module('app').directive('greenRedGradient', function () {

  var hsv2rgb = function(h, s, v) {
    // adapted from http://schinckel.net/2012/01/10/hsv-to-rgb-in-javascript/
    var rgb, i, data = [];
    if (s === 0) {
      rgb = [v,v,v];
    } else {
      h = h / 60;
      i = Math.floor(h);
      data = [v*(1-s), v*(1-s*(h-i)), v*(1-s*(1-(h-i)))];
      switch(i) {
        case 0:
          rgb = [v, data[2], data[0]];
          break;
        case 1:
          rgb = [data[1], v, data[0]];
          break;
        case 2:
          rgb = [data[0], v, data[2]];
          break;
        case 3:
          rgb = [data[0], data[1], v];
          break;
        case 4:
          rgb = [data[2], data[0], v];
          break;
        default:
          rgb = [v, data[0], data[1]];
          break;
      }
    }
    return '#' + rgb.map(function(x){
        return ("0" + Math.round(x*255).toString(16)).slice(-2);
      }).join('');
  };

  function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
      r = g = b = l; // achromatic
    }else{
      var hue2rgb = function hue2rgb(p, q, t){
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      }

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  return {
    restrict: 'A',
    link: function (scope, el, attrs) {
      var gradientPosition = 0;

      function numberToColorHsl(i) {
        // as the function expects a value between 0 and 1, and red = 0° and green = 120°
        // we convert the input to the appropriate hue value
        var hue = i * 1.2 / 360;
        // we convert hsl to rgb (saturation 100%, lightness 50%)
        var rgb = hslToRgb(hue, 1, .8);
        // we format to css value and return
        return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
      }

      function updateBg (val){
        gradientPosition = val >= 1 ? 1 : val <= 0 ? 0 : val;
        el.css({
          backgroundColor: numberToColorHsl (val * 100)
        });
      }
      attrs.$observe('greenRedGradient', function (val) {
        updateBg(scope.$eval(val));
      });
      updateBg (0);
    }
  }
});
