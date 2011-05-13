
var LEFT = 2;
var RIGHT = 3;

function insert_heap(heap, tri, z) {
    if(z > heap[1]) {
        if(!heap[LEFT]) {
            heap[LEFT] = [tri, z, null, null];
        }
        else {
            insert_heap(heap[LEFT], tri, z);
        }
    }
    else {
        if(!heap[RIGHT]) {
            heap[RIGHT] = [tri, z, null, null];
        }
        else {
            insert_heap(heap[RIGHT], tri, z);
        }
    }
}

function sort(triangles) {
    var heap = [triangles[0], null, null];
    
    var len = triangles.length;
    for(var i=1; i<len; i++) {
        var tri = triangles[i];
        var z = (tri[0].e(3) + tri[1].e(3) + tri[2].e(3)) / 3.0;
        
        insert_heap(heap, tri, z);
    }
    
    return heap;
}

function apply_depth_first(heap, func) {
    if(heap[LEFT]) {
        apply_depth_first(heap[LEFT], func);
    }
    
    func(heap[0]);

    if(heap[RIGHT]) {
        apply_depth_first(heap[RIGHT], func);
    }
}
