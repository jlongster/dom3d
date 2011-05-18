
var object = untitled2;

$(function() {
    var last_x;
    var last_y;
    // $(document).mousemove(function(e) {
    //     var diff_x = ((last_x || e.pageX) - e.pageX);
    //     last_x = e.pageX;

    //     var diff_y = ((last_y || e.pageY) - e.pageY);
    //     last_y = e.pageY;

    //     update(diff_x / 100.0, diff_y / 100.0);
    //     frame();
    // });

    function update(diff) {
        var len = object.length;
        for(var i=0; i<len; i++) {
            var tri = object[i];

            tri.yaw = diff;
            tri.pitch = diff;
        }
    }

    function frame() {
        dom3d.clear();
        dom3d.render_object('#boxes', object);
    }

    dom3d.init('#boxes', 800, 400);
    dom3d.current_eye($v(7,0,-30));
    dom3d.current_light(vec_unit($v(-1.0, 0.0, 0.0)));
    dom3d.current_color($c(200, 255, 200));
    dom3d.current_frustum(
        dom3d.make_frustum(90.0,
                           dom3d.current_width() / dom3d.current_height(),
                           1.0,
                           1000.0)
    );

    var rot = 0.0;
    setInterval(function() {
        update(rot);
        rot += 0.05;
        frame();
    }, 50);
});