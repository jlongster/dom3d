
$(function() {
      
    var object = untitled2;      

    function update(diff) {
        object.yaw = diff;
        object.pitch = diff;
    }

    function frame() {
        dom3d.clear('boxes');
        dom3d.render('boxes', object);
    }

    function test() {
        dom3d.current_renderer().test('boxes');
    }

    dom3d.current_renderer(new RendererCSS());
    dom3d.init('boxes');
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