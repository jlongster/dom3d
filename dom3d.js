
(function() {

    function make_parameter(default_val) {
        var _val = default_val;
        return function(val) {
            if(val)
                _val = val;
            return _val;
        };
    }

    // settings
    var current_width = make_parameter();
    var current_height = make_parameter();

    var current_renderer = make_parameter();
    var current_color = make_parameter($c(0, 0, 0));
    var current_eye = make_parameter();
    var current_frustum = make_parameter();
    var current_light = make_parameter();

    // setup

    function init(width_or_canvas, height) {
        if(typeof width_or_canvas == 'string') {
            var el = $('#' + width_or_canvas);
            current_width(el.width());
            current_height(el.height());
        }
        else {
            current_width(width_or_canvas);
            current_height(height);
        }

        current_renderer().init(width_or_canvas, height);
    }

    function render(canvas, mesh) {
        var eye = dom3d.current_eye();
        var data = mesh.data;
        var len = data.length;
        var renderer = current_renderer();

        var heap = make_heap();

        for(var i=0; i<len; i++) {
            data[i].ref = (data[i].ref ||
                           (renderer.make_ref && renderer.make_ref(canvas)));

            var tri = _transform_points(mesh, data[i]);
            tri.ref = data[i].ref;
            tri.color = data[i].color;

            _tri_apply(tri, function(v) {
                _vec_subtract(v, eye);
            });

            heap_add(heap, tri);
        }

        heap_depth_first(heap, function(triangle) {
            renderer.render3d(canvas, 
                              triangle,
                              dom3d.current_eye(),
                              dom3d.current_light(),
                              dom3d.current_frustum());
        });
    }

    function clear(canvas) {
        current_renderer().clear(canvas);
    }

    function destroy(canvas) {
        current_renderer().destroy(canvas);
    }

    // 3d space stuff
    function _transform_points(mesh, points) {
        var p = [vec_copy(points[0]), vec_copy(points[1]), vec_copy(points[2])];

        if(mesh.scale) {
            _tri_apply(p, function(v) {
                _vec_multiply(v, mesh.scale);
            })
        }

        if(mesh.yaw) {
            _tri_apply(p, function(v) {
                _vec_3drotateX(v, mesh.yaw);
            });            
        }

        if(mesh.pitch) {
            _tri_apply(p, function(v) {
                _vec_3drotateY(v, mesh.pitch);
            });
        }
        
        if(mesh.translate) {
            _tri_apply(p, function(v) {
                _vec_add(v, mesh.translate);
            });
        }

        return p;
    }

    function _tri_apply(tri, transform) {
        transform(tri[0]);
        transform(tri[1]);
        transform(tri[2]);
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

    // mesh
    function make_mesh(points) {
        return { data: points };
    }

    // Unused for now, if we wanted to force a maximum framerate we
    // would use this on the render function
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

    // public api

    window.dom3d = {
        init: init,
        render: render,
        clear: clear,
        destroy: destroy,
        make_frustum: make_frustum,
        make_mesh: make_mesh,

        current_renderer: current_renderer,
        current_width: current_width,
        current_height: current_height,
        current_color: current_color,
        current_eye: current_eye,
        current_light: current_light,
        current_frustum: current_frustum
    }

})();

