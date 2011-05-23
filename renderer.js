
(function() {

    var $raphael = null;

    // 3d -> 2d projection
    function project2d(points, frustum) {
        function proj(point, frustum) {
            var x = point[X] / point[Z];
            var y = point[Y] / point[Z];

            x = (frustum.xmax - x) / (frustum.xmax - frustum.xmin);
            y = (frustum.ymax - y) / (frustum.ymax - frustum.ymin);

            return $v(x * dom3d.current_width(), y * dom3d.current_height());
        }

        return [proj(points[0], frustum),
                proj(points[1], frustum),
                proj(points[2], frustum)];
    }

    // 2d -> 3d projection
    function project3d(points, z, frustum) {
        var x = points[X] / dom3d.current_width();
        x = frustum.xmax - (x * (frustum.xmax - frustum.xmin));

        var y = points[Y] / dom3d.current_height();
        y = frustum.ymax - (y * (frustum.ymax - frustum.ymin));

        return $v(x * z, y * z, z);
    }

    function clear() {
        if($raphael) {
            $raphael.clear();
        }
        else {
            $('.box').remove();
        }
    }

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
     
    function test(canvas) {
        dom3d.current_renderer()
            .render2d(canvas,
                      [$v(0, 0), $v(100, 100), $v(100, 0)],
                      $c(0, 255, 0));
    }

    function render(canvas, mesh) {
        var eye = dom3d.current_eye();
        var data = mesh.data;
        var len = data.length;

        var heap = make_heap();

        for(var i=0; i<len; i++) {
            var tri = _transform_points(mesh, data[i]);

            _tri_apply(tri, function(v) {
                _vec_subtract(v, eye);
            });

            heap_add(heap, tri);
        }
        
        heap_depth_first(heap, function(triangle) {
            render3d(canvas, 
                     triangle,
                     dom3d.current_eye(),
                     dom3d.current_light(),
                     dom3d.current_frustum());
        });
    }
    
    // default 3d rendering function projects points into 2d space in
    // software and uses render2d to render them
    function render3d(canvas, points, eye, light, frustum) {
        var p_eye = [vec_subtract(points[0], eye),
                     vec_subtract(points[1], eye),
                     vec_subtract(points[2], eye)];

        var tri_ca = vec_subtract(p_eye[2], p_eye[0]);
        var tri_cb = vec_subtract(p_eye[2], p_eye[1]);

        var normal_eye = vec_cross(tri_ca, tri_cb);
        var angle = vec_dot(p_eye[0], normal_eye);
        
        // don't render back faces of triangles
        if(angle >= 0) {
            return;
        }

        // lighting
        var p_ba = vec_subtract(points[1], points[0]);
        var p_ca = vec_subtract(points[2], points[0]);
        var normal = vec_unit(vec_cross(p_ba, p_ca));

        var color = points.color || dom3d.current_color();

        var angle = vec_dot(normal, light);
        var ambient = .3;
        var shade = Math.min(1.0, Math.max(0.0, angle));
        shade = Math.min(1.0, shade + ambient);

        dom3d.current_renderer().render2d(
            canvas,
            project2d(p_eye, frustum),
            $c(Math.floor(color[R] * shade),
               Math.floor(color[G] * shade),
               Math.floor(color[B] * shade))
        );
    }

    function render2d(canvas, point, color) {
    }

    function extend(obj) {
        for(var i in renderer) {
            if(obj[i] == undefined) {
                obj[i] = renderer[i];
            }
        }
        
        return obj;
    }

    window.renderer = {
        project2d: project2d,
        project3d: project3d,
        clear: clear,
        render: render,
        render2d: render2d,
        extend: extend,
        test: test
    }

})();