
(function() {

    var $raphael;

    function init(width_or_canvas, height) {
        var width = width_or_canvas;
        var canvas;

        if(typeof width_or_canvas == 'string') {
            var el = $('#' + width_or_canvas);

            var canvas = width_or_canvas;
            width = el.width();
            height = el.height();
        }

        if($raphael) {
            $raphael.setSize(width, height);
        }
        else if(canvas) {
            $raphael = Raphael(canvas, width, height);
        }
        else {
            $raphael = Raphael(0, 0, width, height);
        }
    }

    function clear(canvas) {
        $raphael.clear();
    }

    function destroy(canvas) {
        $raphael.remove();
        $raphael = null;
    }

    function render2d(canvas, points, color) {
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

    function RendererRaphael() {
        this.init = init;
        this.render2d = render2d;
        this.clear = clear;
        this.destroy = destroy;
        this.type = 'raphael';
    }

    RendererRaphael.prototype = Renderer.prototype;
    window.RendererRaphael = RendererRaphael;
})();