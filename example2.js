
$(function() {

    var offset = $v(0, 0);
    var header = $('.header');

    dom3d.current_eye($v(0,0,-15));
    dom3d.current_light(vec_unit($v(-1.0, .5, -.2)));
    dom3d.current_color($c(200, 255, 200));
    
    var start = $v(0.0, 0.0, 15.0);

    function rotate(p) {
        return _vec_3drotateY(p, Math.PI);
    }

    for(var i=0; i<snake.data.length; i++) {
        var tri = snake.data[i];
        rotate(tri[0]);
        rotate(tri[1]);
        rotate(tri[2]);
    }

    function update(x, y) {
        var target = dom3d.current_renderer().project3d(
            $v(x, y),
            -dom3d.current_eye()[Z],
            dom3d.current_frustum()
        );
        
        var end = $v(target[X], target[Y], 0.0);
        var line = vec_subtract(end, start);

        var pitch = Math.atan2(line[X], line[Z]);
        var yaw = Math.atan2(line[Y], line[Z]);
        var scale = vec_length(line);
        
        snake.yaw = yaw;
        snake.pitch = pitch;
        snake.scale = $v(1,1,scale/15.0);
        dom3d.current_color(
            $c(100,
               (Math.cos(line[Y]) + 1.0) / 3.0 * 255,
               100)
        );
        
        return snake;
    }

    function frame(data) {
        dom3d.clear('canvas');
        dom3d.render('canvas', data);

        offset = fix_canvas();
    }

    var dragging = null;
    var anchor = null;
    var prev = null;

    $('li').mousedown(function(e) {
        dragging = $(this);
        anchor = $v(e.pageX, e.pageY);
        prev = $v(parseInt(dragging.css('left')) || 0,
                  parseInt(dragging.css('top')) || 0);
        return false;
    });

    $(document).mousemove(function(e) {
        if(dragging) {
            var point = $v(e.pageX - ($(window).width() / 2.0),
                           e.pageY - ($(window).height() / 2.0));
            var len = vec_length(point);
            var scale = Math.pow(.997, len) * 2.0;

            dragging.css({
                position: 'relative',
                left: (e.pageX - anchor[X] + prev[X]) + 'px',
                top: (e.pageY - anchor[Y] + prev[Y]) + 'px',

            });

            var pos = dragging.position();
            frame(update(pos.left + dragging.width() / 2.0,
                         pos.top - offset[Y] + dragging.height() / 2.0));
        }
    });

    $(document).mouseup(function(e) {
        dragging = null;
    });

    $(window).resize(function() {
        frame(snake);
    });

    frame(snake);
})