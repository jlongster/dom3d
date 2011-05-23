
$(function() {
      
    var object = untitled2;      

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
        object.yaw = diff;
        object.pitch = diff;
    }

    function frame() {
        dom3d.current_renderer().clear();
        dom3d.current_renderer().render('#boxes', object);
    }

    function test() {
        dom3d.current_renderer().test('#boxes');
    }

    dom3d.init('#boxes', 800, 400);
    dom3d.current_eye($v(0,0,-15));
    dom3d.current_light(vec_unit($v(-1.0, 0.0, 0.0)));
    dom3d.current_color($c(200, 255, 200));
    dom3d.current_frustum(
        dom3d.make_frustum(90.0,
                           dom3d.current_width() / dom3d.current_height(),
                           1.0,
                           1000.0)
    );
    dom3d.current_renderer(renderer_css);
      
    test();
    // frame();   

    // var rot = 0.0;
    // setInterval(function() {
    //     update(rot);
    //     rot += 0.05;
    //     frame();
    // }, 50);
});