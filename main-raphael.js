
function make_triangle(points, r, g, b) {
    return { points: points,
             r: r,
             g: g,
             b: b };
}

$(function() {

    // bounds
    var width, height;

    function current_width() {
        return width;
    }

    function current_height() {
        return height;
    }
      
    // frustum helps define 3d space
    function make_frustum(fovy, aspect, znear, zfar) {
        var range = znear * Math.tan(fovy * Math.PI / 360.0);

        return { xmax: range,
                 xmin: -range,
                 ymax: range / aspect,
                 ymin: -range / aspect,
                 znear: znear,
                 zfar: zfar };
    }

    // 3d -> 2d projection
    function project(point, frustum) {
        // x/z and y/z
        var x = point.e(1) / point.e(3);
        var y = point.e(2) / point.e(3);

        x = (frustum.xmax - x) / (frustum.xmax - frustum.xmin);
        y = (frustum.ymax - y) / (frustum.ymax - frustum.ymin);
        
        return $V([x * current_width(),
                   y * current_height()]);
    }

    function project_triangle(tri, frustum) {
        return [project(tri[0], frustum),
                project(tri[1], frustum),
                project(tri[2], frustum)];
    }

    // 3d rendering
    function clear_tris() {
        paper.clear();
    }
    
    function draw_tri(tri, eye, light, frustum) {
        var p_eye = [tri.points[0].subtract(eye),
                     tri.points[1].subtract(eye),
                     tri.points[2].subtract(eye)];

        var tri_ca = p_eye[2].subtract(p_eye[0]);
        var tri_cb = p_eye[2].subtract(p_eye[1]);

        var normal_eye = tri_ca.cross(tri_cb);
        var angle = p_eye[0].dot(normal_eye);
        
        // don't render back faces of triangles
        if(angle >= 0)
            return;

        // lighting
        var normal = tri.points[1].subtract(tri.points[0]).cross(
            tri.points[2].subtract(tri.points[0])
        ).toUnitVector();

        var angle = normal.dot(light);
        var ambient = .3;
        var shade = Math.min(1.0, Math.max(0.0, angle));
        shade = Math.min(1.0, shade + ambient);
        
        var color = 'rgb(' + 
            Math.floor(tri.r * shade) + ',' +
            Math.floor(tri.g * shade) + ',' +
            Math.floor(tri.b * shade) + ')';

        // 2d projection
        var points = project_triangle(p_eye,
                                      frustum);

        var p = paper.path('M' + points[0].e(1) + ' ' + points[0].e(2) +
                           'L' + points[1].e(1) + ' ' + points[1].e(2) +
                           'L' + points[2].e(1) + ' ' + points[2].e(2) +
                           'L' + points[0].e(1) + ' ' + points[0].e(2));
        p.attr({ 'fill': color,
                 'stroke': color });
    }
      
    // utility
    function random_int(upper) {
        return Math.floor(Math.random() * upper);
    }

    function random_real(upper) {
        return Math.random() * upper;
    }

    function random_3dvec(upper, lower) {
        lower = lower || 0;
        upper = upper - lower;
        return $V([random_real(upper) + lower,
                   random_real(upper) + lower,
                   random_real(upper) + lower]);
    }

    // main stuff

    width = 800;
    height = 600;
      
    var paper = Raphael(0, 0, current_width(), current_height());
    var eye = $V([0,0,-8]);
    var light = $V([-1.0, -1.0, -1.0]).toUnitVector();
    var frustum = make_frustum(60.0,
                               current_width() / current_height(),
                               1.0,
                               1000.0);
      
      // window.tris = [
      //     make_triangle([$V([0, 0, 0]),
      //                         $V([0, 20, 0]),
      //                         $V([20, 0, 0])],
      //                        0, 255, 0),

      //     make_triangle([$V([20, 0, 0]),
      //                    $V([40, 10, 0]),
      //                    $V([40, -20, 0])],
      //                   255, 0, 0),

      //     make_triangle([$V([40, -20, 0]),
      //                    $V([-10, 0, 0]),
      //                    $V([20, 0, 0])],
      //                   255, 0, 0)

      // ];
      

    function update(points, dist) {
        function lp(p) {
            return p.rotate(dist, $L([0,0,0], [0,1,1]));
        }

        return [lp(points[0]), lp(points[1]), lp(points[2])];
    }

    setInterval(function() {
        clear_tris();

        if('tris' in window) {
            var tris = window.tris;
            for(var i=0; i<tris.length; i++) {
                var tri = tris[i];
                tri.points = update(tri.points, .07);
                draw_tri(tri, eye, light, frustum);
            }
        }
    }, 30);
});