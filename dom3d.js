
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

    var current_renderer = make_parameter();
    var current_color = make_parameter($c(0, 0, 0));
    var current_eye = make_parameter();
    var current_frustum = make_parameter();
    var current_light = make_parameter();

    var $raphael = null;

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

    // main functions

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
});