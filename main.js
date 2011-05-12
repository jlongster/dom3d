
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
        $('.box').remove();
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
        
        draw_2d_tri(project_triangle(p_eye, frustum),
                    [Math.floor(tri.r * shade),
                     Math.floor(tri.g * shade),
                     Math.floor(tri.b * shade)]);
    }
      
    // 2d projection/rendering
    function draw_2d_tri1(points, color) {
        function eps(v) {
            if(v < .000001 && v > -.000001)
                return 0;
            return v;
        }

        var ab = points[1].subtract(points[0]);
        var ac = points[2].subtract(points[0]);

        var translate = points[0];

        // rotate based on ab relative to the y-axis
        // (flipped axes)
        var angle = Math.atan2(ab.e(1), ab.e(2));

        var cos_a = eps(Math.cos(angle));
        var sin_a = eps(Math.sin(angle));
        var rotate = $M([[cos_a, -sin_a],
                         [sin_a, cos_a]]);

        // rotate ac to get it in local coords, we need it to
        // calculate scale and skew. we don't reverse the angle
        // because our virtual space is the opposite of real space (we
        // calculated the angle in the latter)
        var ac_ = ac.rotate(angle, $V([0,0]));

        // scale to the right size, the height is just the y value of
        // ac in local coords.
        var scale_x = Math.sqrt(ab.dot(ab));
        var scale_y = Math.abs(ac_.e(1));

        // yes, this is fucked up and we swap coordinate spaces,
        // because the triangle is virtually sitting on the
        // y-axis... ah shit, just follow along.
        var scale = $M([[scale_y, 0],
                        [0, scale_x]]);

        // skew based on ac_ (left size of tri), flip the x and y
        // because we want the angle relative to the y-axis
        var ac_angle = Math.atan2(ac_.e(2), ac_.e(1));
        skew_v = Math.tan(ac_angle);
        var skew = $M([[1, eps(skew_v)],
                       [0, 1]]);

        // var transform =
        //     'translate(' + translate.e(1) + 'px,' +  translate.e(2) + 'px) ' +
        //     'rotate(' + rotate + 'rad) ' +
        //     'skew(' + skew + 'rad)' +
        //     'scale(' + scale.e(1) + ',' + scale.e(2) + ')';

        var final = scale.x(skew.x(rotate));
        //var final = scale;
        var el = final.elements;

        var transform = "matrix(" + 
            eps(el[0][0]) + ',' +
            eps(el[0][1]) + ',' +
            eps(el[1][0]) + ',' +
            eps(el[1][1]) + ',' +
            translate.e(1) + 'px,' +
            translate.e(2) + 'px)';
          
        var color = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';          

        $('<div>hello</div>')
            .addClass('box')
            .css({ '-moz-transform': transform,
                   '-moz-transform-origin': 'top left',
                   'background': get_background(color)
                 })
            .appendTo('#boxes');        
    }

    // 2d projection/rendering
    function draw_2d_tri2(points, color) {
        var ab = points[1].subtract(points[0]);
        var ac = points[2].subtract(points[0]);

        var translate = points[0];
        var rotate = Math.atan2(ab.e(2), ab.e(1));

        // rotate ac to get it in local coords
        var ac_ = ac.rotate(-rotate, $V([0,0]));

        // scale to the right size
        var scale = $V([Math.sqrt(ab.dot(ab)), Math.abs(ac_.e(2))]);

        // skew based on ac_ (left size of tri), flip the x and y
        // because we want the angle relative to the y-axis
        var skew = Math.atan2(ac_.e(1), ac_.e(2));

        var transform =
            'translate(' + translate.e(1) + 'px,' +  translate.e(2) + 'px) ' +
            'rotate(' + rotate + 'rad) ' +
            'skew(' + skew + 'rad) ' +
            'scale(' + scale.e(1) + ',' + scale.e(2) + ')';
        
        var color = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';          

        $('<div></div>')
            .addClass('box')
            .css({ '-moz-transform': transform,
                   '-moz-transform-origin': 'bottom left',
                   'background': '-moz-linear-gradient(45deg, ' + color + ' 50%, transparent 0)' })
            .appendTo('#boxes');
    }
      
    // utility
    function get_background(color) {
        return '-moz-linear-gradient(-45deg, ' + color + ' 50%, transparent 0)';
    }
    
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
                   0.0]);
    }

    // main stuff

    width = 600;
    height = 400;
    var eye = $V([0,0,-30]);
    var light = $V([-1.0, -1.0, -1.0]).toUnitVector();
    var frustum = make_frustum(60.0,
                               current_width() / current_height(),
                               1.0,
                               1000.0);
    
    $('#boxes').css({ 'width': width,
                      'height': height });
    
    function update(points, dist) {
        function lp(p) {
            return p.rotate(dist, $L([0,0,0], [1,1,1]));
        }

        return [lp(points[0]), lp(points[1]), lp(points[2])];
    }

    // draw_2d_tri([$V([10, 10]),
    //              $V([0, 100]),
    //              $V([100, 0])],
    //             [0, 255, 0]);
    // draw_2d_tri([$V([100, 50]),
    //              $V([10, 100]),
    //              $V([50, 175])],
    //             [255, 0, 0]);
                     
    // for(var i=0; i<50; i++) {
    //     window.tris.push(
    //         make_triangle([random_3dvec(20.0, -20.0),
    //                        random_3dvec(20.0, -20.0),
    //                        random_3dvec(20.0, -20.0)],
    //                       random_int(255),
    //                       random_int(255),
    //                       random_int(255))
    //     );
    // }
      
      // window.tris = [
          // make_triangle([$V([0, 0, 0]),
          //                     $V([0, 20, 0]),
          //                     $V([20, 0, 0])],
          //                    0, 255, 0),

      //     make_triangle([$V([20, 0, 0]),
      //                    $V([40, 10, 0]),
      //                    $V([40, -20, 0])],
      //                   255, 0, 0),

      //     make_triangle([$V([40, -20, 0]),
      //                    $V([-10, 0, 0]),
      //                    $V([20, 0, 0])],
      //                   255, 0, 0)

      // ];

    var draw_2d_tri = draw_2d_tri2;

    if(draw_2d_tri == draw_2d_tri1)
        $('.test').text('css matrix');
    else
        $('.test').text('css transform funcs');

    var timer = setInterval(function() {
        clear_tris();
        
        if('tris' in window) {
            var tris = window.tris;
            for(var i=0; i<tris.length; i++){
                var tri = tris[i];
                tri.points = update(tri.points, .07);
                draw_tri(tri, eye, light, frustum);
            }
        }
        
    }, 30);

    window.stop = function() {
        clearInterval(timer);
    }
});