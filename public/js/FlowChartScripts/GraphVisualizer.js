function GraphVisualizer() {

    let hover_node_circle = null;

    this.hoverNode = function(node_index) {
        if(hover_node_circle === null) {
            //console.log('visualize node: ' + node_index);

            let node_drawable = DiagramModel.getDrawableByIndex(node_index);
            let node_bbox = node_drawable.select('.nodeCircle').getTransformedBBox();
            //console.log(JSON.stringify(node_bbox));
            let node_cx = node_bbox.cx;
            let node_cy = node_bbox.cy;

            //console.log('node_cx = ' + node_cx + ' | node_cy = ' + node_cy);

            hover_node_circle = snap.circle(node_cx, node_cy, 40).attr({fill: '#8f8f8f'});
            hover_node_circle.insertBefore(node_drawable);
        }
    };

    this.clearHoverNode = function() {
        if(hover_node_circle !== null) {
            hover_node_circle.remove();
            hover_node_circle = null;
        }
    };



}