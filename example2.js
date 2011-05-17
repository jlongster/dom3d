

$(function() {

    function resize() {
        var w = $(this);
        dom3d.current_width(w.width());
        dom3d.current_height(w.height());

        dom3d.current_frustum(
            dom3d.make_frustum(60.0,
                               dom3d.current_width() / dom3d.current_height(),
                               1.0,
                               1000.0)
        );
    }

    resize();
    dom3d.current_eye($V([0,0,-15]));
    dom3d.current_light($V([-1.0, 0.0, -.2]).toUnitVector());
    dom3d.current_color($c(200, 255, 200));
    
    var start = $V([0.0, 0.0, 15.0]);

    function rotate(p) {
        return p.rotate(Math.PI, $L([0,0,0], [0,1,0]));
    }

    for(var i=0; i<snake.length; i++) {
        var tri = snake[i];
        snake[i] = [rotate(tri[0]), rotate(tri[1]), rotate(tri[2])];
    }

    function update(x, y) {
        var target = dom3d.project3d($V([x, y]),
                                     -dom3d.current_eye().e(3),
                                     dom3d.current_frustum());
        
        var end = $V([target.e(1), target.e(2), 0.0]);
        var line = end.subtract(start);

        var pitch = Math.atan2(line.e(1), line.e(3));
        var yaw = Math.atan2(line.e(2), line.e(3));
        
        var len = snake.length;
        for(var i=0; i<len; i++) {
            var tri = snake[i];
            tri.yaw = yaw;
            tri.pitch = pitch;
            tri.translate = $V([0,0,15]);

            var scale = Math.sqrt(line.e(1)*line.e(1) +
                                  line.e(2)*line.e(2) +
                                  line.e(3)*line.e(3));
            tri.scale = $V([1,1,scale/15.0]);
            tri.color = $c(100,
                           (Math.cos(line.e(2)) + 1.0) / 3.0 * 255,
                           100);
        }
        
        return snake;
    }

    function frame(data) {
        dom3d.clear();
        dom3d.render_object('body', data);
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
            dragging.css({
                position: 'relative',
                left: (e.pageX - anchor.x + prev.x) + 'px',
                top: (e.pageY - anchor.y + prev.y) + 'px'
            });

            var pos = dragging.position();
            frame(update(pos.left + dragging.width() / 2.0,
                         pos.top + dragging.height() / 2.0));
        }
    });

    $(document).mouseup(function(e) {
        dragging = null;
    });

    $(window).resize(function() {
        resize();
        frame(snake);
    });
})