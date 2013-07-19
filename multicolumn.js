/**
 * CSS3 multicolumn polyfill for IE9, IE8
 *
 * usage example:
 *  if (!Modernizr.csscolumns) {
 *    $('.mycolumn-element').multicolumn();
 *  }
 *
 * v0.1
 * July 2013
 * Tobias Schmidt <tobias.schmidt@seitenbau.com>
 */
;(function ( $, window, document, undefined ) {

    var pluginName = 'multicolumn',
        defaults = {
          columnGap : 15, //is converted into percent in relative mode
          columnCount: 'auto',
          wrapperClass : 'column-wrapper',
          hiddenClass : 'mc-hidden',
          mode: 'relative'
        };

    function Plugin( element, options ) {
        this.jse = element;
        this.element   = $(element);
        this.options   = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name     = pluginName;
        this.init();
    }

    Plugin.prototype = {

      init : function() {
        this.doColumns();
        this.setResizeHandler();
      },

      doColumns : function() {
        var self = this;
        this.element.each(function() {
          var $el = $(this),
              gapWidth = self.options.columnGap,
              tagName = $el.prop('tagName'),
              classes = $el.attr('class'),
              listMarginLeft = $el.css('margin-left'),
              listMarginRight = $el.css('margin-right'),
              listMarginBottom = $el.css('margin-bottom'),
              listMarginTop = $el.css('margin-top'),
              listPaddingRight = $el.css('padding-right'),
              listPaddingLeft = $el.css('padding-left'),
              listPaddingBottom = $el.css('padding-bottom'),
              listPaddingTop = $el.css('padding-top'),
              $children = $el.children('li');

          // get column Count
          var columnCount;
          if(self.options.columnCount === 'auto') {
            columnCount = $el.css('column-count') ? $el.css('column-count') : $el[0].currentStyle.getAttribute('column-count'); //IE
          } else {
            columnCount = self.options.columnCount;
          }
          // calculate vars
          var perColumnItemCount  = Math.floor( $children.length / columnCount ),
              containerWidth = $el.parent().outerWidth() - (parseInt(listPaddingLeft, 10) + parseInt(listPaddingRight,10)),
              columnWidth = (containerWidth - (gapWidth * (columnCount - 1))) / columnCount;

          if(!columnCount || columnCount < 2) {
            self.destroy($el);
            return;
          }

          if(self.options.mode == 'relative') {
            columnWidth = (columnWidth / containerWidth * 100) + '%';
            gapWidth = (gapWidth / containerWidth * 100) + '%';
          } else {
            containerWidth = Math.floor(containerWidth);
            columnWidth = Math.floor(columnWidth);
          }

          // define wrapper element
          $wrapper = $('<div class="' + self.options.wrapperClass + '"></div>')
            .css({
              'margin-left': listMarginLeft,
              'margin-right': listMarginRight,
              'margin-top': listMarginTop,
              'margin-bottom': listMarginBottom,
              'padding-right' : listPaddingRight,
              'padding-left' : listPaddingLeft,
              'padding-top' : listPaddingTop,
              'padding-bottom' : listPaddingBottom
            });

          // get wrapper element
          var lists = $wrapper
            .clone()
            .attr({
              'data-tagname': tagName,
              'data-classes' : classes
            });

          // fill each column with list elements
          for (var i = 1; i <= columnCount; i++) {
            var $listItems = $children.filter(':lt(' + perColumnItemCount + ')').clone();
            var columnMargin = i > 1 ? gapWidth : 0;

            $list = $('<ul></ul>')
              .css({
                'display': 'block',
                'float': 'left',
                'width': columnWidth,
                'margin-right': 0,
                'margin-left': columnMargin,
                'padding' : 0
              })
              .attr('class', classes);

            //wrap lists with wrapper and uls
            lists.append($list.append($listItems));
          };

          //insert new element, remove old
          $el.after(lists).hide().addClass(self.options.hiddenClass);
        });
      },

      setResizeHandler : function() {
        var self = this;
        $(window).on('orientationchange pageshow resize', self.waitForFinalEvent(function(e) {
          var _self = self;
          self.element.each(function() {
            $el = $(this);
            _self.destroy($el, _self.bind(_self.doColumns, _self));
          });
          })
        ).trigger('resize');
      },

      waitForFinalEvent : function (func, timeout) {
        var timeoutID , timeout = timeout || 200;
        return function () {
          var scope = this , args = arguments;
          clearTimeout(timeoutID);
          timeoutID = setTimeout( function () {
            func.apply( scope , Array.prototype.slice.call( args ) );
          } , timeout );
        }
      },

      destroy : function ($el, callback) {
        $el.show().removeClass(this.options.hiddenClass);
        $el.next('.' + this.options.wrapperClass).remove();

        if (typeof callback == 'function') {
          callback.call();
        }
      },

      bind : function(fn, scope) {
        return function () {
          fn.apply(scope, arguments);
        };
      }

    };

    $.fn[pluginName] = function ( options ) {
      return this.each(function () {
        $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
      });
    };

})( jQuery, window, document );
