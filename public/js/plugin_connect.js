Snap.plugin(function (Snap, Element, Paper, global) {

    Element.prototype.getTransformedBBox = function () {
        var bb = this.getBBox();
        var m = this.transform().globalMatrix;
        var tbb = {
            x: m.x(bb.x, bb.y),
            y: m.y(bb.x, bb.y),
            y2: m.y(bb.x2, bb.y2),
            x2: m.x(bb.x2, bb.y2)
        };
        tbb['width'] = tbb.x2 - tbb.x;
        tbb['height'] = tbb.y2 - tbb.y;
        tbb['cx'] = tbb.x + tbb['width'] / 2;
        tbb['cy'] = tbb.y + tbb['height'] / 2;
        return tbb;
    };

    // ----------- Создаем временную связь (при перемещении узла коннекта) -------------
    Paper.prototype.connection = function (obj1, obj2, line, bg) {
        if (obj1.line && obj1.from && obj1.to) {
            line = obj1;
            lines = line;
            obj1 = line.from;
            obj2 = line.to;
        }
        var bb1 = obj1.getBBox(),
            bb2 = obj2.getBBox()
            bb3 = obj1.getTransformedBBox();

        //console.log('-------------------------------------------')
        //console.log('bb2.cx = ' + bb2.cx + ' | bb2.cy = ' + bb2.cy);

        bb2.cx -= (bb3.cx - bb1.cx);
        bb2.cy -= (bb3.cy - bb1.cy);

        //console.log('bb2.cx = ' + bb2.cx + ' | bb2.cy = ' + bb2.cy);

        var x1 = bb1.cx,
            y1 = bb1.cy,
            x4 = bb2.cx,
            y4 = bb2.cy;

        //console.log('connection: x1 = ' + x1 + " | y1 = " + y1);
        //console.log('connection: x4 = ' + x4 + " | y4 = " + y4);

        var path = "M" + x1.toFixed(3) + "," + y1.toFixed(3) + "," + x4.toFixed(3) + "," + y4.toFixed(3);

        if (line && line.line) {
            line.bg && line.bg.attr({path: path});
            line.line.attr({path: path});
        } else {
            var color = typeof line == "string" ? line : "black";
            var line_draw = this.path(path).attr({stroke: color, fill: "none"});
            return {
                bg: bg && bg.split && this.path(path).attr({
                    stroke: bg.split("|")[0],
                    fill: "none",
                    "stroke-width": bg.split("|")[1] || 3
                }),
                line: line_draw.insertBefore(obj1),
                from: obj1,
                to: obj2
            };
        }
    };

    // ----------------------- Создаем постоянную связь ---------------------------
    Paper.prototype.create_connection = function (obj1, obj2, line, bg) {

        if (obj1.line && obj1.from && obj1.to) {
            line = obj1;
            lines = line;
            obj1 = line.from;
            obj2 = line.to;
        }

        var bb1 = obj1.getTransformedBBox(),
            bb2 = obj2.getTransformedBBox(),
            bb3 = obj1.getBBox();

        /*var x1 = bb1.cx - (bb1.cx - bb3.cx),
            y1 = bb1.cy - (bb1.cy - bb3.cy),
            x4 = bb3.cx - (bb1.cx - bb2.cx),
            y4 = bb3.cy - (bb1.cy - bb2.cy);*/

        var x1 = bb1.cx,
            y1 = bb1.cy,
            x4 = bb2.cx,
            y4 = bb2.cy;

        //console.log('x1 = ' + x1 + " | y1 = " + y1);
        //console.log('x4 = ' + x4 + " | y4 = " + y4);

        var path = "M" + x1.toFixed(3) + "," + y1.toFixed(3) + "," + x4.toFixed(3) + "," + y4.toFixed(3);

        if (line && line.line) {
            line.line.attr({path: path});
        } else {
            var line_draw = (this.path(path).attr({stroke: "#000", fill: "none"})).insertBefore(zero_state_node);
            return {
                line: line_draw,
                from: obj1,
                to: obj2
            };
        }
    }
});