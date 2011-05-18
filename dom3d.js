
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
            var x = point[X] / point[Z];
            var y = point[Y] / point[Z];

            x = (frustum.xmax - x) / (frustum.xmax - frustum.xmin);
            y = (frustum.ymax - y) / (frustum.ymax - frustum.ymin);

            return $v(x * current_width(), y * current_height());
        }

        return [proj(points[0], frustum),
                proj(points[1], frustum),
                proj(points[2], frustum)];
    }

    // 2d -> 3d projection
    function project3d(points, z, frustum) {
        var x = points[X] / current_width();
        x = frustum.xmax - (x * (frustum.xmax - frustum.xmin));

        var y = points[Y] / current_height();
        y = frustum.ymax - (y * (frustum.ymax - frustum.ymin));

        return $v(x * z, y * z, z);
    }

    // rendering
    function clear() {
        if($raphael) {
            $raphael.clear();
        }
        else {
            $('.box').remove();
        }
    }
      
    function transform_points(points) {
        var pts = [points[0], points[1], points[2]];

        if(points.scale) {
            pts[0] = vec_multiply(pts[0], points.scale);
            pts[1] = vec_multiply(pts[1], points.scale);
            pts[2] = vec_multiply(pts[2], points.scale);
        }

        if(points.yaw) {
            pts[0] = vec_3drotateX(pts[0], points.yaw);
            pts[1] = vec_3drotateX(pts[1], points.yaw);
            pts[2] = vec_3drotateX(pts[2], points.yaw);
        }

        if(points.pitch) {
            pts[0] = vec_3drotateY(pts[0], points.pitch);
            pts[1] = vec_3drotateY(pts[1], points.pitch);
            pts[2] = vec_3drotateY(pts[2], points.pitch);
        }
        
        if(points.translate) {
            pts[0] = vec_add(pts[0], points.translate);
            pts[1] = vec_add(pts[1], points.translate);
            pts[2] = vec_add(pts[2], points.translate);
        }

        pts.color = points.color;
        return pts;
    }      

    function render_3d_triangle(canvas, points, eye, light, frustum) {
        var p_eye = [vec_subtract(points[0], eye),
                     vec_subtract(points[1], eye),
                     vec_subtract(points[2], eye)];

        var tri_ca = vec_subtract(p_eye[2], p_eye[0]);
        var tri_cb = vec_subtract(p_eye[2], p_eye[1]);

        var normal_eye = vec_cross(tri_ca, tri_cb);
        var angle = vec_dot(p_eye[0], normal_eye);
        
        // don't render back faces of triangles
        if(angle >= 0)
            return;

        // lighting
        var p_ba = vec_subtract(points[1], points[0]);
        var p_ca = vec_subtract(points[2], points[0]);
        var normal = vec_unit(vec_cross(p_ba, p_ca));

        var color = points.color || current_color();

        var angle = vec_dot(normal, light);
        var ambient = .3;
        var shade = Math.min(1.0, Math.max(0.0, angle));
        shade = Math.min(1.0, shade + ambient);

        render_2d_triangle(
            canvas,
            project2d(p_eye, frustum),
            $c(Math.floor(color[R] * shade),
               Math.floor(color[G] * shade),
               Math.floor(color[B] * shade))
        );
    }

    function render_2d_triangle(canvas, points, color) {
        if($raphael) {
            var line = 'M' + points[0][X] + ' ' + points[0][Y] +
                'L' + points[1][X] + ' ' + points[1][Y] +
                'L' + points[2][X] + ' ' + points[2][Y] +
                'L' + points[0][X] + ' ' + points[0][Y]
            var p = $raphael.path(line);

            var colorstr = 'rgb(' + color[R] + ',' + color[G] + ',' + color[B] + ')';
            p.attr('stroke', colorstr);
            p.attr('fill', colorstr);
            return;
        }

        var ab = vec_subtract(points[1], points[0]);
        var ac = vec_subtract(points[2], points[0]);

        var translate = points[0];
        var rotate = Math.atan2(ab[Y], ab[X]);

        // rotate ac to get it in local coords
        var ac_ = vec_2drotate(ac, -rotate);

        // scale to the right size
        var scale = $v(vec_length(ab), Math.abs(ac_[Y]));

        // skew based on ac_ (left size of tri), flip the x and y
        // because we want the angle relative to the y-axis
        var skew = Math.atan2(ac_[X], ac_[Y]);

        var transform =
            'translate(' + translate[X] + 'px,' +  translate[Y] + 'px) ' +
            'rotate(' + rotate + 'rad) ' +
            'skew(' + skew + 'rad) ' +
            'scale(' + scale[X] + ',' + scale[Y] + ')';

        var color = 'rgb(' + color[R] + ',' + color[G] + ',' + color[B] + ')';
        
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

    var $raphael = null;

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

    function raphael(width, height) {
        if($raphael) {
            $raphael.setSize(width, height);
        }
        else {
            $raphael = Raphael(0, 0, width, height);
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
        raphael: raphael,
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