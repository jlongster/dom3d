
function named_vector(elements, names) {
    var obj = {};
    var len = elements.length;
    for(var i=0; i<len; i++) {
        obj[i] = elements[i];
        obj[names[i]] = elements[i];
    }
    
    return obj;
}

function $v() {
    var els =  Array.prototype.slice.call(arguments);
    return named_vector(els, ['x', 'y', 'z', 'w']);
}

function $c() {
    var els =  Array.prototype.slice.call(arguments);
    return named_vector(els, ['r', 'g', 'b', 'a']);
}

function make_parameter(default_val) {
    var _val = default_val;
    return function(val) {
        if(val)
            _val = val;
        return _val;
    };
}

$(function() {
    
    // settings
    var current_width = make_parameter();
    var current_height = make_parameter();

    var current_color = make_parameter($c(0, 0, 0));
    var current_eye = make_parameter();
    var current_frustum = make_parameter();
    var current_light = make_parameter();
      
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
    function project2d(points, frustum) {
        function proj(point, frustum) {
            // x/z and y/z
            var x = point.e(1) / point.e(3);
            var y = point.e(2) / point.e(3);

            x = (frustum.xmax - x) / (frustum.xmax - frustum.xmin);
            y = (frustum.ymax - y) / (frustum.ymax - frustum.ymin);

            return $V([x * current_width(), y * current_height()]);
        }

        return [proj(points[0], frustum),
                proj(points[1], frustum),
                proj(points[2], frustum)];
    }

    // 2d -> 3d projection
    function project3d(points, z, frustum) {
        var x = points.e(1) / current_width();
        x = frustum.xmax - (x * (frustum.xmax - frustum.xmin));

        var y = points.e(2) / current_height();
        y = frustum.ymax - (y * (frustum.ymax - frustum.ymin));

        return $V([x * z, y * z, z]);
    }

    // rendering
    function clear() {
        $('.box').remove();
    }
      
    function transform_points(points) {
        var pts = [points[0], points[1], points[2]];

        function rotate(p, angle, line) {
            p[0] = p[0].rotate(angle, line);
            p[1] = p[1].rotate(angle, line);
            p[2] = p[2].rotate(angle, line);
        }

        function scale(p, s) {
            function scaled(v) {
                return $V([v.e(1) * s.e(1),
                           v.e(2) * s.e(2),
                           v.e(3) * s.e(3)]);
            }

            p[0] = scaled(p[0]);
            p[1] = scaled(p[1]);
            p[2] = scaled(p[2]);
        }

        if(points.scale) {
            scale(pts, points.scale);
        }

        if(points.yaw) {
            rotate(pts, points.yaw, $L([0,0,0], [1,0,0]));
        }

        if(points.pitch) {
            rotate(pts, points.pitch, $L([0,0,0], [0,1,0]));
        }
        
        if(points.translate) {
            pts[0] = pts[0].add(points.translate);
            pts[1] = pts[1].add(points.translate);
            pts[2] = pts[2].add(points.translate);
        }

        pts.color = points.color;
        return pts;
    }      

    function render_3d_triangle(canvas, points, eye, light, frustum) {
        var p_eye = [points[0].subtract(eye),
                     points[1].subtract(eye),
                     points[2].subtract(eye)];

        var tri_ca = p_eye[2].subtract(p_eye[0]);
        var tri_cb = p_eye[2].subtract(p_eye[1]);

        var normal_eye = tri_ca.cross(tri_cb);
        var angle = p_eye[0].dot(normal_eye);
        
        // don't render back faces of triangles
        if(angle >= 0)
            return;

        // lighting
        var normal = points[1].subtract(points[0]).cross(
            points[2].subtract(points[0])
        ).toUnitVector();

        var color = points.color || current_color();

        var angle = normal.dot(light);
        var ambient = .3;
        var shade = Math.min(1.0, Math.max(0.0, angle));
        shade = Math.min(1.0, shade + ambient);

        render_2d_triangle(
            canvas,
            project2d(p_eye, frustum),
            [Math.floor(color.r * shade),
             Math.floor(color.g * shade),
             Math.floor(color.b * shade)]
        );
    }

    function render_2d_triangle(canvas, points, color) {
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
                   'background': '-moz-linear-gradient(45deg, ' + color + ' 50%, transparent 0)' 
                 })
            .appendTo(canvas); 
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

    function random_3d_vector(upper, lower) {
        lower = lower || 0;
        upper = upper - lower;
        return $V([random_real(upper) + lower,
                   random_real(upper) + lower,
                   0.0]);
    }

    function with_interval(interval, func) {
        var _lock = false;
        var _blocked = false;

        function wrapped() {
            if(_lock) {
                _blocked = true;
                return;
            }

            _lock = true;
            func.apply(null, arguments);

            setTimeout(function() {
                _lock = false;
                if(_blocked) {
                    _blocked = false;
                    wrapped.apply(null, arguments);
                }
            }, interval);
        }

        return wrapped;
    }

    // setup

    function init(sel, width, height) {
        var el = $(sel);

        if(width && height) {
            el.css({ 'width': width,
                     'height': height });
        }
        else {
            width = el.width();
            height = el.height();
        }

        current_width(width);
        current_height(height);
    }

    // main functions
      
      

    function render_object(canvas, data) {
        var heap = sort(data, transform_points, current_eye());

        apply_depth_first(heap, function(triangle) {
            render_3d_triangle(canvas, 
                               triangle, 
                               current_eye(),
                               current_light(),
                               current_frustum());
        });
    }

    //var render_object = with_interval(30, _render_object);

    // public api

    window.dom3d = {
        init: init,
        render_object: render_object,
        clear: clear,
        make_frustum: make_frustum,
        project3d: project3d,
        current_width: current_width,
        current_height: current_height,
        current_color: current_color,
        current_eye: current_eye,
        current_light: current_light,
        current_frustum: current_frustum
    }
});