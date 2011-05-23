
(function () {

    // 2d projection/rendering
    function render2d(canvas, points, color) {
        var ab = vec_subtract(points[1], points[0]);
        var ac = vec_subtract(points[2], points[0]);

        var translate = points[0];

        // rotate based on ab relative to the y-axis
        // (flipped axes)
        var angle = Math.atan2(ab[X], ab[Y]);

        var cos_a = Math.cos(angle);
        var sin_a = Math.sin(angle);
        var rotate = $m([cos_a, -sin_a],
                        [sin_a, cos_a]);

        // rotate ac to get it in local coords, we need it to
        // calculate scale and skew. we don't reverse the angle
        // because our virtual space is the opposite of real space (we
        // calculated the angle in the latter)
        var ac_ = vec_2drotate(ac, angle);

        // scale to the right size, the height is just the x value of
        // ac in local coords. yes, this is effed up and we swap
        // coordinate spaces, because the triangle is virtually
        // sitting on the y-axis... ah shit, just follow along.
        var scale = $v(Math.abs(ac_[X]), vec_length(ab));

        // skew based on ac_ (left size of tri)
        // TODO: document all of this math more (visuals?)
        var ac_angle = Math.atan2(ac_[Y], ac_[X]);
        var skew = $m([1, Math.tan(ac_angle)],
                      [0, 1]);

        var el = matrix_x(skew, rotate);

        var transform = "matrix(" + 
            el[0][0] + ',' +
            el[0][1] + ',' +
            el[1][0] + ',' +
            el[1][1] + ',' +
            Math.floor(translate[X]) + 'px,' +
            Math.floor(translate[Y]) + 'px)';

        var bg_angle = Math.atan2(scale[X], scale[Y]);

        $('<div></div>')
            .addClass('box')
            .css({
                'width': scale[X],
                'height': scale[Y],
                '-moz-transform': transform,
                '-moz-transform-origin': 'top left',
                'background': get_background(color, -bg_angle)
                 })
            .appendTo(canvas);        
    }

    var _chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    function get_background(color, angle) {
        var color = 'rgb(' + color[R] + ',' + color[G] + ',' + color[B] + ')';

        return '-moz-linear-gradient(' + angle + 'rad, ' + color + ' 50%, transparent 0)';
    }

    window.renderer_cssmat = renderer.extend({
        render2d: render2d
    });
})();