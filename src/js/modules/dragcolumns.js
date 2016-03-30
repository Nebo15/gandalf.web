'use strict';

angular.module('dragcolumns', []).run(function () {
  console.log('dragcolumns run');
}).directive('dragcolumns', function () {

  function indexOfElement (elem, setElms) {

    var $elem = angular.element(elem),
      i = 0,  l = setElms.length;

    for (i = 0; i < l; i++) {
      if ($elem[0].isEqualNode(setElms[i])) break;
    }

    return i;
  }
  function mapElems (elems, cb) {
    var result = [];
    angular.forEach(elems, function (item) {
      result.push(item);
    });
    return result.map(cb);
  }
  function getCoords(elem) {
    // (1)
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    // (2)
    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    // (3)
    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    // (4)
    var top = box.top + scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return {
      top: top,
      left: left
    };
  }

  return {
    restrict: 'A',
    link: function (scope, el, attrs) {
      console.log('dragcolumns');
      var table = angular.element('<table></table>');
      table[0].className = el[0].className;
      table.addClass('dragcolumns-table');

      table.css({
        display: 'none'
      });

      var tableBody = angular.element('<tbody></tbody>');
      var tableHead = angular.element('<thead></thead>');
      var tableFoot = angular.element('<tfoot></tfoot>');

      table.append(tableBody);
      table.append(tableHead);
      table.append(tableFoot);

      el.parent().append(table);

      var ths = angular.element(el[0].querySelectorAll('thead th'));

      function composeDragTable (cells) {

        var row = null;
        tableBody.empty();
        tableHead.empty();
        tableFoot.empty();

        mapElems(cells, function (item) {

          row = angular.element('<tr></tr>');
          row.append(angular.element(item).clone());

          switch (item.parentNode.parentNode.tagName.toUpperCase()) {
            case 'THEAD': {
              tableHead.append(row);
              break;
            }
            case 'TFOOT': {
              tableFoot.append(row);
              break;
            }
            default : {
              tableBody.append(row);
              break;
            }
          }
        });
      }

      var documentEl = angular.element(document),
        drag = {
          active: false,
          el: null,
          shiftX: null,
          shiftY: null
        };

      function moveAt (e) {
        table.css({
          top: e.pageY - drag.shiftY + 'px',
          left: e.pageX - drag.shiftX + 'px'
        })
      }

      function handleMouseMove (e) {
        if (!drag.el) return;

        e.preventDefault();
        moveAt(e);
      }

      ths.bind('mousedown', function (e) {

        e.preventDefault();

        var index = indexOfElement(this, ths);
        var cells = el[0].querySelectorAll('td:nth-child('+(index+1)+'), th:nth-child('+(index+1)+')');

        el.addClass('dragcolumns-active');
        composeDragTable(cells);

        [].forEach.call(cells, function (item) {
          angular.element(item).addClass('dragcolumns-cell');
        });

        var $this = angular.element(this);
        var coords = getCoords(this);

        drag.el = $this;
        drag.shiftX = e.pageX - coords.left;
        drag.shiftY = e.pageY - coords.top;

        moveAt(e);

        table.css({
          width: this.offsetWidth + 'px',
          display: null
        });

        documentEl.bind('mousemove', handleMouseMove);
        documentEl.bind('mouseup', function () {
          el.removeClass('dragcolumns-active');

          [].forEach.call(cells, function (item) {
            angular.element(item).removeClass('dragcolumns-cell');
          });
          table.css({
            display: 'none'
          });

          drag.el = null;

          documentEl.unbind('mouseup');
          documentEl.unbind('mousemove', handleMouseMove);
        })

      });

    }
  };
});
