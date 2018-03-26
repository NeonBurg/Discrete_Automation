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
            arrow_line1 = line.arrow_line1;
            arrow_line2 = line.arrow_line2;
            //circle = line.circle
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

        var full_length = vectorLength(x1,y1,x4,y4);
        var radius = 30;
        var radius2 = 45;

        var new_x = x4 + (x1-x4) * (radius/full_length);
        var new_y = y4 + (y1-y4) * (radius/full_length);
        var new_x2 = x4 + (x1-x4) * (radius2/full_length);
        var new_y2 = y4 + (y1-y4) * (radius2/full_length);

        var rotated_point1 = rotateV2AroundPount(new_x2, new_y2, 20, new_x, new_y);
        var rotated_point2 = rotateV2AroundPount(new_x2, new_y2, -20, new_x, new_y);

        //console.log('new_x = ' + new_x + ' | new_y = ' + new_y + " | x4 = " + x4 + " | y4 = " + y4 + " | full_length = " + full_length);

        //this.line(rotated_point1.x, rotated_point1.y, new_x, new_y).attr({stroke:'#000', strokeWidth:1});
        //this.line(rotated_point2.x, rotated_point2.y, new_x, new_y).attr({stroke:'#000', strokeWidth:1});

        //console.log('x1 = ' + x1 + " | y1 = " + y1);
        //console.log('x4 = ' + x4 + " | y4 = " + y4);

        var path = "M" + x1.toFixed(3) + "," + y1.toFixed(3) + "," + x4.toFixed(3) + "," + y4.toFixed(3);

        var path_arrow1 = "M" + rotated_point1.x + "," + rotated_point1.y + "," + new_x + "," + new_y;
        var path_arrow2 = "M" + rotated_point2.x + "," + rotated_point2.y + "," + new_x + "," + new_y;

        if (line && line.line) {
            line.line.attr({path: path});
            arrow_line1.attr({path: path_arrow1}).attr({stroke:'#000', strokeWidth:1});
            arrow_line2.attr({path: path_arrow2}).attr({stroke:'#000', strokeWidth:1});
            //circle.attr({path:snap.circlePath(new_x, new_y, 10)});
        } else {
            var line_draw = (this.path(path).attr({stroke: "#000", fill: "none"})).insertBefore(zero_state_node);
            return {
                line: line_draw,
                from: obj1,
                to: obj2,
                arrow_line1: this.path(path_arrow1).attr({stroke:'#000', strokeWidth:1}),
                arrow_line2: this.path(path_arrow2).attr({stroke:'#000', strokeWidth:1})
                //circle: this.circle(new_x, new_y, 10).attr({fill:'#ffffff', stroke:'#000', strokeWidth:1})
                //circle: this.path(snap.circlePath(new_x, new_y, 10)).attr({fill:'#ffffff', stroke:'#000', strokeWidth:1})
            };
        }
    }

    // Длина вектора |V|
    function vectorLength(vx1, vy1, vx2, vy2) {
        return Math.sqrt(Math.pow(vx1 - vx2, 2) + Math.pow(vy1 - vy2, 2));
    }

    function toRadians (angle) {
        return angle * (Math.PI / 180);
    }

    function rotateVector2(vx, vy, angle) {

        var rotatedVector = {};

        rotatedVector.x = (vx*Math.cos(toRadians(angle)) - vy*Math.sin(toRadians(angle))); // Формула поворота
        rotatedVector.y = (vx*Math.sin(toRadians(angle)) + vy*Math.cos(toRadians(angle)));

        return rotatedVector;
    }

    function rotateV2AroundPount(vx, vy, angle, px, py) {

        var rotatedVector = {};

        rotatedVector.x = vx - px;
        rotatedVector.y = vy - py;
        rotatedVector = rotateVector2(rotatedVector.x, rotatedVector.y, angle);

        rotatedVector.x = rotatedVector.x + px;
        rotatedVector.y = rotatedVector.y + py;

        return rotatedVector;
    }

    Paper.prototype.circlePath = function(cx,cy,r) {
        var p = "M" + cx + "," + cy;
        p += "m" + -r + ",0";
        p += "a" + r + "," + r + " 0 1,0 " + (r*2) +",0";
        p += "a" + r + "," + r + " 0 1,0 " + -(r*2) + ",0";
        //return this.path(p, cx, cy );
        return p;

    }
});