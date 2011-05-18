 
var X = 0;
var Y = 1;
var Z = 2;
var W = 3;

var R = 0;
var G = 1;
var B = 2;
var A = 3;

function $v(x, y, z, w) {
    var buffer = new ArrayBuffer(4*4);
    var arr = new Float32Array(buffer);
    arr[X] = x;
    arr[Y] = y;
    arr[Z] = z;
    arr[W] = w;
    return arr;
}

function $c(r, g, b, a) {
    return [r, g, b, a];
}

function $m() {
    return Array.prototype.slice.call(arguments);
}

function vec_equals(v1, v2) {
    function fleq(x, y) {
        if(isNaN(x) && isNaN(y))
            return true;

        return Math.abs(x - y) < .0000000001;
    }

    return (fleq(v1[X], v2[X]) &&
            fleq(v1[Y], v2[Y]) &&
            fleq(v1[Z], v2[Z]) &&
            fleq(v1[W], v2[W]));
}

function vec_subtract(v1, v2) {
    return $v(v1[X] - v2[X],
              !isNaN(v1[Y]) ? (v1[Y] - v2[Y]) : NaN,
              !isNaN(v1[Z]) ? (v1[Z] - v2[Z]) : NaN,
              !isNaN(v1[W]) ? (v1[W] - v2[W]) : NaN);
}

function vec_multiply(v1, v2) {
    return $v(v1[X] * v2[X],
              !isNaN(v1[Y]) ? (v1[Y] * v2[Y]) : NaN,
              !isNaN(v1[Z]) ? (v1[Z] * v2[Z]) : NaN,
              !isNaN(v1[W]) ? (v1[W] * v2[W]) : NaN);    
}

function vec_add(v1, v2) {
    return $v(v1[X] + v2[X],
              !isNaN(v1[Y]) ? (v1[Y] + v2[Y]) : NaN,
              !isNaN(v1[Z]) ? (v1[Z] + v2[Z]) : NaN,
              !isNaN(v1[W]) ? (v1[W] + v2[W]) : NaN);
}

function vec_dot(v1, v2) {
    return (v1[X] * v2[X] +
            (!isNaN(v1[Y]) ? v1[Y] * v2[Y] : 0) +
            (!isNaN(v1[Z]) ? v1[Z] * v2[Z] : 0) +
            (!isNaN(v1[W]) ? v1[W] * v2[W] : 0));
}

function vec_cross(v1, v2) {
    if(isNaN(v1[Z]))
         return;

    return $v(v1[Y] * v2[Z] - v1[Z] * v2[Y],
              v1[Z] * v2[X] - v1[X] * v2[Z],
              v1[X] * v2[Y] - v1[Y] * v2[X]);
}

function vec_length(v1) {
    return Math.sqrt(v1[X]*v1[X] +
                     v1[Y]*v1[Y] +
                     (!isNaN(v1[Z]) ? v1[Z]*v1[Z] : 0) +
                     (!isNaN(v1[W]) ? v1[W]*v1[W] : 0));
}

function vec_2drotate(v1, angle) {
    return $v(v1[X] * Math.cos(angle) - v1[Y] * Math.sin(angle),
              v1[X] * Math.sin(angle) + v1[Y] * Math.cos(angle));
}

function vec_3drotateX(v1, angle) {
    return $v(v1[X],
              v1[Y] * Math.cos(angle) - v1[Z] * Math.sin(angle),
              v1[Y] * Math.sin(angle) + v1[Z] * Math.cos(angle));
}

function vec_3drotateY(v1, angle) {
    return $v(v1[Z] * Math.sin(angle) + v1[X] * Math.cos(angle),
              v1[Y],
              v1[Z] * Math.cos(angle) - v1[X] * Math.sin(angle));
}

function vec_3drotateZ(v1, angle) {
    return $v(v1[X] * Math.cos(angle) - v1[Y] * Math.sin(angle),
              v1[X] * Math.sin(angle) + v1[Y] * Math.cos(angle),
              v1[Z]);
}

function vec_unit(v1) {
    var len = vec_length(v1);
    return $v(v1[X] / len, v1[Y] / len, v1[Z] / len);
}

function assert(msg, exp) {
    if(!exp)
        throw '[FAILED] ' + msg;
}

function assert_equal(msg, v1, v2) {
    if(typeof(v1) == "object") {
        assert(msg + ' ' + v1.toSource() + ' ' + v2.toSource(),
               vec_equals(v1, v2));
    }
    else {
        assert(msg + ' ' + v1 + ' ' + v2, v1 == v2);
    }
}

var x = $v(4,5,6);
var z = $v(2,3,4);

assert_equal('vec_subtract', vec_subtract(x, z), $v(2,2,2));
assert_equal('vec_add', vec_add(x, z), $v(6,8,10));

x = $v(0,1,0);
y = $v(1,0,0);
assert_equal('vec_dot', vec_dot(x, y), 0);

x = $v(-1,0,0);
assert_equal('vec_dot', vec_dot(x, y), -1);

x = $v(1,1,0);
y = $v(1.5,1,0);
assert_equal('vec_dot', vec_dot(x, y), 2.5);

x = $v(0,1,0);
y = $v(1,0,0);
assert_equal('vec_cross', vec_cross(x, y), $v(0, 0, -1));

assert_equal('vec_3drotateX', vec_3drotateX(x, Math.PI/2.0), $v(0,0,1));
assert_equal('vec_3drotateY', vec_3drotateY(y, Math.PI/2.0), $v(0,0,-1));
assert_equal('vec_3drotateZ', vec_3drotateZ(x, Math.PI/2.0), $v(-1,0,0));
