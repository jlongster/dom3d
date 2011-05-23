

$(function() {

    dom3d.current_eye($v(0,0,-10));
    dom3d.current_light(vec_unit($v(-1.0, 0.0, -.2)));
    dom3d.current_color($c(200, 255, 200));
    
    var start = $v(0.0, 0.0, 15.0);

    function rotate(p) {
        return _vec_3drotateX(p, Math.PI);
    }

    for(var i=0; i<teapot.data.length; i++) {
        var tri = teapot.data[i];
        rotate(tri[0]);
        rotate(tri[1]);
        rotate(tri[2]);
    }
      
    var _update = 0.0;
    function update() {
        _update += 0.05;

        teapot.yaw = _update;
        teapot.pitch = _update;
        
        return teapot;
    }

    function frame(data) {
        dom3d.clear('canvas');
        dom3d.render('canvas', data);

        fix_canvas();
    }
    
    setInterval(function() {
        frame(update());
    }, 50);
})