
$(function() {

    function update(diff) {
        untitled2.yaw = diff;
        untitled2.pitch = diff;
    }

    function frame() {
        dom3d.clear('canvas');
        dom3d.render('canvas', untitled2);
    }

    function test() {
        dom3d.current_renderer().test('canvas');
    }

    function update_controls() {
        if(dom3d.current_renderer().use_refs) {
            $('#controls').show();
        }
        else {
            $('#controls').hide();
        }
    }

    var timer;

    function bind_controls() {
        var c = $('#controls');
        c.find('input[name=border]').click(function() {
            if(this.checked) {
                dom3d.current_renderer().use_refs();
                setTimeout(function() {
                    $('._dom3d').addClass('border');
                }, 50);
            }
            else {
                setTimeout(function() {
                    $('._dom3d').removeClass('border');
                }, 50);
            }
        });

        c.find('input[name=off]').click(function() {
            if(this.checked) {
                dom3d.current_renderer().use_refs();
                setTimeout(function() {
                    $('._dom3d').addClass('off');
                }, 50);

                c.find('.off-code').show();
            }
            else {
                setTimeout(function() {
                    $('._dom3d').removeClass('off');
                }, 50);
                c.find('.off-code').hide();
            }
        });

        c.find('input[name=stop]').click(function() {
            if(this.checked) {
                clearInterval(timer);
                timer = null;
            }
            else if(!timer) {
                timer = start_loop();
            }
        });
    }

    var rot = 0.0;

    function start_loop() {
        return setInterval(function() {
            update(rot);
            rot += 0.05;
            frame();
        }, 50);
    }

    make_renderer(null, 'canvas');

    dom3d.current_eye($v(0,0,-20));
    dom3d.current_light(vec_unit($v(-1.0, 0.0, 0.0)));
    dom3d.current_color($c(200, 255, 200));
    // dom3d.current_renderer().use_matrix();
    // dom3d.current_renderer().use_refs();

    timer = start_loop();
    //test();

    bind_controls();
    update_controls();

    var canvas = $('#canvas')
    $(window).mousemove(function(e) {
        var pos = canvas.offset();
        var screen = $v(e.pageX - pos.left, e.pageY - pos.top);
        var target = dom3d.current_renderer().project3d(
            screen,
            -dom3d.current_eye()[Z] - 5.0,
            dom3d.current_frustum()
        );

        target[Z] += dom3d.current_eye()[Z];
        dom3d.current_light(vec_unit(target));
    });

    $('.render-options a').click(update_controls);
});