

$(function() {
    function resize() {
        var w = $(this);
        dom3d.current_width(w.width());
        dom3d.current_height(w.height());

        dom3d.current_frustum(
            dom3d.make_frustum(75.0,
                               dom3d.current_width() / dom3d.current_height(),
                               1.0,
                               1000.0)
        );
    }

    resize();
    dom3d.current_eye($v(0,0,-15));
    dom3d.current_light(vec_unit($v(-1.0, 0.0, -.2)));
    dom3d.current_color($c(200, 255, 200));
    
    var start = $v(0.0, 0.0, 15.0);

    function rotate(p) {
        return vec_3drotateY(p, Math.PI);
    }

    for(var i=0; i<snake.length; i++) {
        var tri = snake[i];
        snake[i] = [rotate(tri[0]), rotate(tri[1]), rotate(tri[2])];
    }

    function update(x, y) {
        var pitch, yaw, line, scale;

        if(x && y) {
            var target = dom3d.project3d($v(x, y),
                                         -dom3d.current_eye()[Z],
                                         dom3d.current_frustum());
            
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

        var len = snake.length;
        for(var i=0; i<len; i++) {
            var tri = snake[i];
            tri.yaw = yaw;
            tri.pitch = pitch;
            tri.translate = $v(0,0,15);
            
            if(line) {
                tri.scale = $v(1,1,scale/15.0);
                tri.color = $c(100,
                               (Math.cos(line[Y]) + 1.0) / 3.0 * 255,
                               100);
            }
            else {
                tri.scale = $v(1,1,1);
            }
        }
        
        return snake;
    }

    function frame(data) {
        dom3d.clear();
        dom3d.render_object('body', data);
    }
    
    $(document).mousemove(function(e) {
        var header = $('.header')[0];

        if(e.pageX < header.offsetWidth && e.pageY < header.offsetHeight) {
            frame(update());
        }
        else {
            frame(update(e.pageX, e.pageY));
        }
    });
    
    $(window).resize(function() {
        resize();
        frame(snake);
    });

    frame(update());

})