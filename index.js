
$(function() {
      
    function update(diff) {
        untitled2.yaw = diff;
        untitled2.pitch = diff;
    }

    function frame() {
        dom3d.clear('canvas');
        dom3d.render('canvas', untitled2);
    }

    function test() {
        dom3d.current_renderer().test('canvas');
    }
    
    var canvas = $('#canvas');
    make_renderer(canvas.width(), canvas.height());

    dom3d.current_eye($v(0,0,-15));
    dom3d.current_light(vec_unit($v(-1.0, 0.0, 0.0)));
    dom3d.current_color($c(200, 255, 200));
    dom3d.current_frustum(
        dom3d.make_frustum(90.0,
                           dom3d.current_width() / dom3d.current_height(),
                           1.0,
                           1000.0)
    );
    // dom3d.current_renderer().use_matrix();
    // dom3d.current_renderer().use_refs();

    //test();
    frame();   

    var rot = 0.0;
    setInterval(function() {
        update(rot);
        rot += 0.05;
        frame();
    }, 50);
});