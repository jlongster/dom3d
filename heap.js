
var LEFT = 2;
var RIGHT = 3;

function make_heap() {
    return [null, null, null, null];
}

function heap_add(heap, tri) {
    var z = (tri[0][Z] + tri[1][Z] + tri[2][Z]) / 3.0;
    _heap_insert(heap, tri, z);
}

function _heap_insert(heap, tri, z) {
    if(!heap[0]) {
        heap[0] = tri;
        heap[1] = z;
    }
    else if(z > heap[1]) {
        if(!heap[LEFT]) {
            heap[LEFT] = [tri, z, null, null];
        }
        else {
            _heap_insert(heap[LEFT], tri, z);
        }
    }
    else {
        if(!heap[RIGHT]) {
            heap[RIGHT] = [tri, z, null, null];
        }
        else {
            _heap_insert(heap[RIGHT], tri, z);
        }
    }
}

function heap_depth_first(heap, func) {
    if(heap[LEFT]) {
        heap_depth_first(heap[LEFT], func);
    }
    
    func(heap[0]);

    if(heap[RIGHT]) {
        heap_depth_first(heap[RIGHT], func);
    }
}
