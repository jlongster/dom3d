
(function() {

    var zIndex = 0;

    // settings

    var _use_matrix = false;
    function use_matrix(flag) {
        _use_matrix = (flag == undefined ? true : flag);
    }

    var _use_refs = false;
    function use_refs(flag) {
        _use_refs = (flag == undefined ? true : flag);
    }

    // util

    function e(v) {
        // sometimes scientific notation kicks in with really small
        // numbers, which can't give to CSS, so round them to 0. if
        // there's a js method to print floats without SF to a certain
        // precision we should use it (toPrecision() still uses SF)
        if(v < .000001 && v > -.000001)
            return 0.0;
        return v;
    }

    // refs are references to a dom node instance

    function make_ref(canvas, force) {
        if(_use_refs || force) {
            var node = document.createElement('div');
            node.className = '_dom3d';
            document.getElementById(canvas).appendChild(node);
            return node;
        }
        return null;
    }

    // render api

    function clear(canvas, cleanup) {
        zIndex = 0;

        var cleanup = cleanup || !_use_refs;
        var container = document.getElementById(canvas);
        var len = container.childNodes.length;

        // Make sure to pass `cleanup` if you will be creating new
        // points each frame and thus new dom nodes
        if(cleanup) {
            var i = 0;
            while(container.childNodes.length > i) {
                var node = container.childNodes[i];
                if(node.className == '_dom3d') {
                    container.removeChild(node);
                }
                else {
                    i++;
                }
            }
        }
        else {
            for(var i=0; i<len; i++) {
                var node = container.childNodes[i];
                if(node.className == '_dom3d') {
                    node.style.display = 'none';
                }
            }
        }
    }

    function remove(tri) {
        tri.ref && (tri.ref.style.display = 'none');
    }

    function render2d(canvas, points, color) {
        var ab = vec_subtract(points[1], points[0]);
        var ac = vec_subtract(points[2], points[0]);

        var translate = points[0];
        var rotate = -Math.atan2(ab[X], ab[Y]);

        // rotate ac to get it in local coords
        var ac_ = vec_2drotate(ac, -rotate);

        // scale to the right size
        var scale = $v(ac_[X], vec_length(ab));

        // skew based on ac_ (left size of tri), flip the x and y
        // because we want the angle relative to the y-axis
        var skew = Math.atan2(ac_[Y], ac_[X]);
       
        var transform;

        if(_use_matrix) {
            var cos_a = Math.cos(-rotate);
            var sin_a = Math.sin(-rotate);
            var rotate_m = $m([cos_a, -sin_a],
                              [sin_a, cos_a]);
            var skew_m = $m([1, Math.tan(skew)],
                            [0, 1]);

            var els = matrix_x(skew_m, rotate_m);
            
            transform = "matrix(" + 
                e(els[0][0]) + ',' +
                e(els[0][1]) + ',' +
                e(els[1][0]) + ',' +
                e(els[1][1]) + ',' +
                translate[X] + 'px,' +
                translate[Y] + 'px)';
        }
        else {
            transform = 
                'translate(' + translate[X] + 'px,' + 
                               translate[Y] + 'px) ' +
                'rotate(' + e(rotate) + 'rad) ' +
                'skewY(' + e(skew) + 'rad) ';
        }
         
        // Create a node if we don't have one yet, which would be if
        // these points didn't come from projected 3d points
        points.ref = points.ref || make_ref(canvas, true);

        var el = points.ref;
        el.style.display = 'none';
        el.style.width = scale[X] + 'px';
        el.style.height = scale[Y] + 'px';
        el.style.MozTransform = transform;
        el.style.MozTransformOrigin = 'top left';
        el.style.WebkitTransform = transform;
        el.style.WebkitTransformOrigin = 'top left';
        el.style.OTransform = transform;
        el.style.OTransformOrigin = 'top left';
        el.style.background = get_background(color, scale);
        el.style.zIndex = zIndex;
        el.style.display = 'block';

        zIndex++;
    }

    var _webkit = navigator.userAgent.toLowerCase().indexOf('webkit') > -1;
    var _chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    var _opera = navigator.userAgent.toLowerCase().indexOf('opera') > -1;

    function get_background(color, scale) {
        var color = 'rgb(' + 
            color[R].toFixed() + ',' +
            color[G].toFixed() + ',' + 
            color[B].toFixed() + ')';

        if(_chrome) {
            var angle = -Math.atan2(scale[X], scale[Y]);
            return '-webkit-linear-gradient(' + e(angle) + 'rad, ' + color + ' 50%, transparent 0)';
        }
        else if(_webkit) {
            // hack: safari only supports webkit-gradient, so we have
            // to calculate the start/stop points
            var end = $v(scale[X], -scale[Y]);
            _vec_2drotate(end, Math.PI/2);

            var start = $v(-(end[X] - scale[X]) / 2.0,
                           (scale[Y] - end[Y]) / 2.0);

            _vec_add(end, start);
            
            return '-webkit-gradient(linear, ' +
                Math.floor(start[X]) + ' ' + Math.floor(start[Y]) + ', ' +
                Math.floor(end[X]) + ' ' + Math.floor(end[Y]) + ', ' +
                'from(' + color + '), ' +
                'color-stop(.5, ' + color + '), ' +
                'color-stop(.5, transparent), ' +
                'to(transparent))';
        }
        else if(_opera) {
            var angle = -Math.atan2(scale[X], scale[Y]);
            return '-o-linear-gradient(' + e(angle) + 'rad, ' + color + ' 50%, transparent 0)';
        }
        else {
            var angle = -Math.atan2(scale[X], scale[Y]);
            return '-moz-linear-gradient(' + e(angle) + 'rad, ' + color + ' 50%, transparent 0)';
        }
    }

    function RendererCSS() {
        this.render2d = render2d;
        this.remove = remove;
        this.make_ref = make_ref;
        this.use_refs = use_refs;
        this.use_matrix = use_matrix;
        this.clear = clear;
        this.type = 'css';
    };

    RendererCSS.prototype = Renderer.prototype;
    window.RendererCSS = RendererCSS;
})();