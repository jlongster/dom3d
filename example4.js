

$(function() {

    function resize() {
        var w = $(this);
        dom3d.raphael(w.width(), w.height() / 1.5);

        dom3d.current_frustum(
            dom3d.make_frustum(90.0,
                               dom3d.current_width() / dom3d.current_height(),
                               1.0,
                               1000.0)
        );
    }

    resize();
    dom3d.current_eye($V([0,.2,-6]));
    dom3d.current_light($V([-1.0, 0.0, -.2]).toUnitVector());
    dom3d.current_color($c(200, 255, 200));

    function rotate(p) {
        return p.rotate(Math.PI, $L([0,0,0], [0,1,0]));
    }

    for(var i=0; i<mesh404.length; i++) {
        var tri = mesh404[i];
        mesh404[i] = [rotate(tri[0]), rotate(tri[1]), rotate(tri[2])];
    }

      
    var _update = 0.0;
    function update() {
        _update += 0.05;

        var len = mesh404.length;
        for(var i=0; i<len; i++) {
            var tri = mesh404[i];
            tri.pitch = _update;
        }
        
        return mesh404;
    }

    // function frame(data) {
    //     dom3d.clear();
    //     dom3d.render_object('body', data);
    // }
    
    // setInterval(function() {
    //     frame(update());
    // }, 50);

    $(window).resize(function() {
        resize();
        frame(mesh404);
    });
})