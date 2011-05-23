

(function() {

    var $raphael = null;

    function render2d(canvas, points, color) {
        if($raphael) {
            var line = 'M' + points[0][X] + ' ' + points[0][Y] +
                'L' + points[1][X] + ' ' + points[1][Y] +
                'L' + points[2][X] + ' ' + points[2][Y] +
                'L' + points[0][X] + ' ' + points[0][Y]
            var p = $raphael.path(line);

            var colorstr = 'rgb(' + color[R] + ',' + color[G] + ',' + color[B] + ')';
            p.attr('stroke', colorstr);
            p.attr('fill', colorstr);
            return;
        }

        var ab = vec_subtract(points[1], points[0]);
        var ac = vec_subtract(points[2], points[0]);

        var translate = points[0];
        var rotate = Math.atan2(ab[Y], ab[X]);

        // rotate ac to get it in local coords
        var ac_ = vec_2drotate(ac, -rotate);

        // scale to the right size
        var scale = $v(vec_length(ab), Math.abs(ac_[Y]));

        // skew based on ac_ (left size of tri), flip the x and y
        // because we want the angle relative to the y-axis
        var skew = Math.atan2(ac_[X], ac_[Y]);
        
       
        var transform =
            'translate(' + translate[X] + 'px,' +  translate[Y] + 'px) ' +
            'rotate(' + rotate + 'rad) ' +
            'skew(' + skew + 'rad) ' + 
            'scale(' + scale[X] + ',' + scale[Y] + ')';
        
        var bg_angle = Math.atan2(scale[X], scale[Y]);

        $('<div></div>')
            .addClass('box')
            .css({ 'display': 'block',
                   // 'width': scale[X],
                   // 'height': scale[Y],
                   '-moz-transform': transform,
                   '-moz-transform-origin': 'bottom left',
                   '-webkit-transform': transform,
                   '-webkit-transform-origin': 'top left',
                   'background': get_background(color, Math.PI/4)
                 })
            .appendTo(canvas);
    }

    var _chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    function get_background(color, angle) {
        var color = 'rgb(' + color[R] + ',' + color[G] + ',' + color[B] + ')';
        
        if(_chrome) {
            return '-webkit-linear-gradient(45deg, transparent 50%, ' + color + ' 0)';
        }
        else {
            return '-moz-linear-gradient(' + angle + 'rad, ' + color + ' 50%, transparent 0)';
        }
    }

    window.renderer_css = renderer.extend({
        render2d: render2d
    });
})();