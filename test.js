
$(function() {

    make_renderer(null, 100, 100);

    dom3d.current_eye($v(0,0,-15));
    dom3d.current_light(vec_unit($v(-1.0, 0.0, -.2)));
    dom3d.current_color($c(200, 255, 200));
    
    dom3d.current_renderer().render2d(
        'canvas',
        [$v(20, 20), $v(50, 120), $v(120, 30)],
        $c(0, 255, 0));

});