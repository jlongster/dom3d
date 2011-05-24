
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
    }

    make_renderer('canvas');

    dom3d.current_eye($v(0,0,-20));
    dom3d.current_light(vec_unit($v(-1.0, 0.0, 0.0)));
    dom3d.current_color($c(200, 255, 200));
    // dom3d.current_renderer().use_matrix();
    // dom3d.current_renderer().use_refs();

    var rot = 0.0;
    setInterval(function() {
        update(rot);
        rot += 0.05;
        frame();
    }, 50);

    bind_controls();
    update_controls();

    var change_renderer = window.onpopstate;
    window.onpopstate = function() {
        change_renderer();
        update_controls();
    }
});