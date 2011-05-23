
$(function() {

    var offset = $v(0, 0);
    var header = $('.header');

    dom3d.current_eye($v(0,0,-15));
    dom3d.current_light(vec_unit($v(-1.0, 0.5, -.2)));
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
        var pitch, yaw, line, scale;

        if(x && y) {
            var target = dom3d.current_renderer().project3d(
                $v(x, y),
                -dom3d.current_eye()[Z],
                dom3d.current_frustum()
            );

            var end = $v(target[X], target[Y], 0.0);
            var line = vec_subtract(end, start);

            pitch = Math.atan2(line[X], line[Z]);
            yaw = Math.atan2(line[Y], line[Z]);
            scale = vec_length(line);
        }
        else {
            pitch = 0;
            yaw = 0;
        }

        snake.yaw = yaw;
        snake.pitch = pitch;
        
        if(line) {
            snake.scale = $v(1,1,scale/15.0);
            dom3d.current_color(
                $c(100,
                   (Math.cos(line[Y]) + 1.0) / 3.0 * 255,
                   100)
            );
        }
        else {
            snake.scale = $v(1,1,1);
        }
        
        return snake;
    }

    function frame(data) {
        dom3d.clear('canvas');
        dom3d.render('canvas', data);

        offset = fix_canvas();
    }
    
    $(document).mousemove(function(e) {
        if(e.pageX < header[0].offsetWidth && e.pageY < header[0].offsetHeight) {
            frame(update());
        }
        else {
            frame(update(e.pageX, e.pageY - offset[Y]));
        }
    });

    $(window).resize(function() {
        frame(snake);
    });

    frame(update());
})