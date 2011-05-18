

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
    dom3d.current_eye($v(0,0,-14));
    dom3d.current_light(vec_unit($v(-1.0, 0.0, -.2)));
    dom3d.current_color($c(200, 255, 200));
    
    var start = $v(0.0, 0.0, 15.0);

    function rotate(p) {
        return vec_3drotateX(p, Math.PI);
    }

    for(var i=0; i<teapot.length; i++) {
        var tri = teapot[i];
        teapot[i] = [rotate(tri[0]), rotate(tri[1]), rotate(tri[2])];
    }
      
    var _update = 0.0;
    function update() {
        _update += 0.05;

        var len = teapot.length;
        for(var i=0; i<len; i++) {
            var tri = teapot[i];
            tri.yaw = _update;
            tri.pitch = _update;
        }
        
        return teapot;
    }

    function frame(data) {
        dom3d.clear();
        dom3d.render_object('body', data);
    }
    
    setInterval(function() {
        frame(update());
    }, 50);

    $(window).resize(function() {
        resize();
        frame(teapot);
    });
})