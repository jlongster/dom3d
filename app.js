
$(function() {
    var last_x;
    $(document).mousemove(function(e) {
        var diff = ((last_x || e.pageX) - e.pageX);
        last_x = e.pageX;
        frame(diff / 100.0);
    });

    function update_3d_triangle(points, diff) {
        function lp(p) {
            return p.rotate(diff, $L([0,0,0], [0,1,0]));
        }

        return [lp(points[0]), lp(points[1]), lp(points[2])];
    }

    function update(data, func) {
        var len = data.length;
        for(var i=0; i<len; i++) {
            data[i] = func(data[i]);
        }
    }

    update(tris, function(tri) {
        return update_3d_triangle(tri, Math.PI);
    });

    function frame(diff) {
        update(tris, function(tri) {
            return update_3d_triangle(tri, diff);
        });

        update(untitled3, function(tri) {
            return update_3d_triangle(tri, diff);
        });
        
        dom3d.clear();
        dom3d.render_object('boxes', tris);
        dom3d.render_object('boxes2', untitled3);
    }


    dom3d.init('boxes', 600, 400);
    dom3d.init('boxes2', 600, 400);

    dom3d.current_eye($V([0,0,-5]));
    dom3d.current_light($V([-1.0, 0.0, 0.0]).toUnitVector());
    dom3d.current_frustum(
        dom3d.make_frustum(90.0,
                           dom3d.current_width() / dom3d.current_height(),
                           1.0,
                           1000.0)
    );

    dom3d.current_color($c(0, 255, 100));
    dom3d.render_object('boxes', tris);
});