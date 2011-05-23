
$(function() {

    function init() {
        var w = $(this);
        dom3d.init(w.width(), w.height());

        dom3d.current_frustum(
            dom3d.make_frustum(60.0,
                               dom3d.current_width() / dom3d.current_height(),
                               1.0,
                               1000.0)
        );
    }

    function make_renderer() {
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

        init();
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
 
    $(window).resize(function() {
        init();
    });

    window.onpopstate = make_renderer;

    make_renderer();

    window.fix_canvas = fix_canvas;
});