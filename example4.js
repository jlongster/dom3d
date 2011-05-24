

$(function() {

    make_renderer();

    dom3d.current_eye($v(0,0,-4.2));
    dom3d.current_light(vec_unit($v(-1.0, 0.0, -.2)));
    dom3d.current_color($c(255, 100, 0));

    function rotate(p) {
        return _vec_3drotateY(p, Math.PI);
    }

    for(var i=0; i<mesh404.data.length; i++) {
        var tri = mesh404.data[i];
        rotate(tri[0]);
        rotate(tri[1]);
        rotate(tri[2]);
    }

    var _update = -.5;
    function update() {
        _update += 0.005;
        mesh404.pitch = _update;
        return mesh404;
    }

    function frame(data) {
        dom3d.clear('canvas');
        dom3d.render('canvas', data);

        fix_canvas();
    }
    
    setInterval(function() {
        frame(update());
    }, 50);

    install_resize();
})