
$(function() {

    make_renderer(null, 100, 100);

    dom3d.current_eye($v(0,0,-15));
    dom3d.current_light(vec_unit($v(-1.0, 0.0, -.2)));
    dom3d.current_color($c(200, 255, 200));
    
    untitled2.yaw = 0.0;
    untitled2.pitch = 0.0;
    
    function update() {
        untitled2.yaw += .05;
        untitled2.pitch += .05;
    }

    function frame() {
        dom3d.clear('canvas');
        dom3d.render('canvas', untitled2);
    }

    setInterval(function() {
        update();
        frame();
    }, 50);

    var canvas = $('#canvas, svg');
    $(window).mousemove(function(e) {
        canvas.css({ 'position': 'absolute',
                     'left': e.pageX - 30.0,
                     'top': e.pageY - 25.0 });
    });

    $('a').hover(
        function() {
            dom3d.current_color($c(255, 0, 0));
        },
        function() {
            dom3d.current_color($c(200, 255, 200));
        }
    );

});