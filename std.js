
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

    function default_renderer_type() {
        var hash = window.location.hash;
        type = hash && hash.substring(1);        
        return type || 'css';
    }

    function make_renderer(type, width_or_canvas, height) {
        renderer_info = [width_or_canvas, height];
        type = type || default_renderer_type();
        
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

        var pound = this.href.indexOf('#');
        make_renderer(this.href.substring(pound + 1),
                      renderer_info[0],
                      renderer_info[1]);
    });

    $('.render-options a').each(function() {
        if(this.href.indexOf(default_renderer_type()) > 0)
            $(this).addClass('selected');
    });
    
    function install_resize() {
        $(window).resize(function() {
            init();
        });
    }

    window.make_renderer = make_renderer;
    window.install_resize = install_resize;
    window.fix_canvas = fix_canvas;
});