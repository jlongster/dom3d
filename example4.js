

$(function() {

    function resize() {
        var w = $(this);
        //dom3d.raphael(w.width(), w.height() / 1.25);
        dom3d.current_width(w.width());
        dom3d.current_height(w.height());

        dom3d.current_frustum(
            dom3d.make_frustum(90.0,
                               dom3d.current_width() / dom3d.current_height(),
                               1.0,
                               1000.0)
        );
    }

    resize();
    dom3d.current_eye($v(0,.2,-7));
    dom3d.current_light(vec_unit($v(-1.0, 0.0, -.2)));
    dom3d.current_color($c(255, 100, 0));

    function rotate(p) {
        return vec_3drotateY(p, Math.PI);
    }

    for(var i=0; i<mesh404.length; i++) {
        var tri = mesh404[i];
        mesh404[i] = [rotate(tri[0]), rotate(tri[1]), rotate(tri[2])];
    }

    var _update = -.5;
    function update() {
        _update += 0.005;

        var len = mesh404.length;
        for(var i=0; i<len; i++) {
            var tri = mesh404[i];
            tri.pitch = _update;
        }
        
        return mesh404;
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
        frame(mesh404);
    });
})