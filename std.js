
$(function() {

    function init(width_or_canvas, height) {
        var w = $(window);
        dom3d.init(width_or_canvas || w.width(), height || w.height());

        dom3d.current_frustum(
            dom3d.make_frustum(60.0,
                               dom3d.current_width() / dom3d.current_height(),
                               1.0,
                               1000.0)
        );
    }

    var renderer_info;

    function make_renderer(width_or_canvas, height) {
        renderer_info = [width_or_canvas, height];

        var type = (window.location.hash ? 
                    window.location.hash.substring(1) :
                    'css');
        
        if(dom3d.current_renderer()) {
            dom3d.clear('canvas');
            dom3d.destroy();
        }

        if(type == 'raphael') {
            dom3d.current_renderer(new RendererRaphael());
        }
        else {
            dom3d.current_renderer(new RendererCSS());
        }

        $('.render-options a').each(function() {
            var _this = $(this);
            if(_this.attr('href') == '#' + type) {
                _this.addClass('selected');
            }
        });

        init(width_or_canvas, height);
        return dom3d.current_renderer();
    };
   
    function fix_canvas() {
        var offset;

        if(dom3d.current_renderer().type == 'raphael') {
            var header = $('.header');
            offset = $v(0, header[0].offsetHeight);
        }
        else {
            offset = $v(0, 0);
        }

        // hack: offset the svg so we can click the menu
        $('svg').css({
            'margin-top': offset[Y] + 'px'
        });

        return offset;
    }
 
    $('.render-options a').click(function() {
        $('.render-options a').removeClass('selected');
        $(this).addClass('selected');
    });

    function install_resize() {
        $(window).resize(function() {
            init();
        });
    }

    window.onpopstate = function() {
        make_renderer.apply(this, renderer_info);
    }

    window.make_renderer = make_renderer;
    window.install_resize = install_resize;
    window.fix_canvas = fix_canvas;
});