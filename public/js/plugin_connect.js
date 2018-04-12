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

        var align=1;

        if (obj1.line && obj1.from && obj1.to) {
            line = obj1;
            lines = line;
            align = line.align;
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

        //console.log('line.align = ' + align);

        var full_length = vectorLength(x1,y1,x4,y4);
        var radius = 30;
        var radius2 = 45;

        if(align === 3) {
            var rotate_v1 = rotateV2AroundPoint(x1, y1, 90, x4, y4);
            var rotate_v2 = rotateV2AroundPoint(x4, y4, -90, x1, y1);

            var nx1 = x1 + (rotate_v2.x-x1) * ((radius/2)/full_length);
            var ny1 = y1 + (rotate_v2.y-y1) * ((radius/2)/full_length);
            var nx2 = x4 + (rotate_v1.x-x4) * ((radius/2)/full_length);
            var ny2 = y4 + (rotate_v1.y-y4) * ((radius/2)/full_length);

            x1=nx1;
            y1=ny1;
            x4=nx2;
            y4=ny2;

            radius -= 4;
            radius2 -= 4;
        }

        // Находим координаты для стрелок
        var new_x = x4 + (x1-x4) * (radius/full_length);
        var new_y = y4 + (y1-y4) * (radius/full_length);
        var new_x2 = x4 + (x1-x4) * (radius2/full_length);
        var new_y2 = y4 + (y1-y4) * (radius2/full_length);

        var rotated_point1 = rotateV2AroundPoint(new_x2, new_y2, 20, new_x, new_y);
        var rotated_point2 = rotateV2AroundPoint(new_x2, new_y2, -20, new_x, new_y);

        // Находим координаты для текста
        var textCoords = getTextCoords(x1, y1, x4, y4, full_length, align);

        var path = "M" + x1.toFixed(3) + "," + y1.toFixed(3) + "," + x4.toFixed(3) + "," + y4.toFixed(3);

        var path_arrow1 = "M" + rotated_point1.x + "," + rotated_point1.y + "," + new_x + "," + new_y;
        var path_arrow2 = "M" + rotated_point2.x + "," + rotated_point2.y + "," + new_x + "," + new_y;

        var variables_text = 'x1, x2, x3';
        if(align === 3) variables_text = 'x4, x5';

        if (line && line.line) {
            line.line.attr({path: path});
            arrow_line1.attr({path: path_arrow1}).attr({stroke:'#000', strokeWidth:1});
            arrow_line2.attr({path: path_arrow2}).attr({stroke:'#000', strokeWidth:1});
            line.text_element.attr({x: textCoords.x, y: textCoords.y});
            //circle.attr({path:snap.circlePath(new_x, new_y, 10)});
        } else {
            var line_draw = (this.path(path).attr({stroke: "#000", fill: "none"})).insertBefore(zero_state_node);
            return {
                line: line_draw,
                from: obj1,
                to: obj2,
                arrow_line1: this.path(path_arrow1).attr({stroke:'#000', strokeWidth:1}),
                arrow_line2: this.path(path_arrow2).attr({stroke:'#000', strokeWidth:1}),
                align: 1,
                text_element: snap.text(textCoords.x, textCoords.y, variables_text),
                text: variables_text
                //circle: this.circle(new_x, new_y, 10).attr({fill:'#ffffff', stroke:'#000', strokeWidth:1})
                //circle: this.path(snap.circlePath(new_x, new_y, 10)).attr({fill:'#ffffff', stroke:'#000', strokeWidth:1})
            };
        }
    }



    //Создаем двхстороннею связь
    Paper.prototype.split_double_connections = function (conn_from, conn_to) {

        console.log('split_connections');

        var line = conn_to.line;
        var obj_from = conn_to.from;
        var obj_to = conn_to.to;

        var x1 = obj_from.getTransformedBBox().cx;
        var y1 = obj_from.getTransformedBBox().cy;
        var x4 = obj_to.getTransformedBBox().cx;
        var y4 = obj_to.getTransformedBBox().cy;

        var rotate_v1 = rotateV2AroundPoint(x1, y1, 90, x4, y4);
        var rotate_v2 = rotateV2AroundPoint(x4, y4, -90, x1, y1);

        var full_length = vectorLength(x1,y1,x4,y4);
        var radius = 30;
        var radius2 = 45;

        var nx1 = x1 + (rotate_v2.x-x1) * ((radius/2)/full_length);
        var ny1 = y1 + (rotate_v2.y-y1) * ((radius/2)/full_length);
        var nx2 = x4 + (rotate_v1.x-x4) * ((radius/2)/full_length);
        var ny2 = y4 + (rotate_v1.y-y4) * ((radius/2)/full_length);

        x1=nx1;
        y1=ny1;
        x4=nx2;
        y4=ny2;

        radius -= 4;
        radius2 -= 4;

        // Находим координаты для стрелок
        var new_x = x4 + (x1-x4) * (radius/full_length);
        var new_y = y4 + (y1-y4) * (radius/full_length);
        var new_x2 = x4 + (x1-x4) * (radius2/full_length);
        var new_y2 = y4 + (y1-y4) * (radius2/full_length);

        var rotated_point1 = rotateV2AroundPoint(new_x2, new_y2, 20, new_x, new_y);
        var rotated_point2 = rotateV2AroundPoint(new_x2, new_y2, -20, new_x, new_y);

        // Находим координаты для текста
        var textCoords = getTextCoords(x1, y1, x4, y4, full_length, 3);

        var path = "M" + x1.toFixed(3) + "," + y1.toFixed(3) + "," + x4.toFixed(3) + "," + y4.toFixed(3);

        var path_arrow1 = "M" + rotated_point1.x + "," + rotated_point1.y + "," + new_x + "," + new_y;
        var path_arrow2 = "M" + rotated_point2.x + "," + rotated_point2.y + "," + new_x + "," + new_y;

        line.attr({path: path});
        conn_to.arrow_line1.attr({path: path_arrow1}).attr({stroke:'#000', strokeWidth:1});
        conn_to.arrow_line2.attr({path: path_arrow2}).attr({stroke:'#000', strokeWidth:1});
        conn_to.align = 3;
        conn_to.text_element.attr({x: textCoords.x, y: textCoords.y, text:'x4, x5'});
        conn_to.text = 'x4, x5';

    }



    function getTextCoords(x1, y1, x2, y2, fullLength, align) {
        var delta_move = 40;
        if(align === 3) delta_move = -40;
        var line_center_x = x2 + (x1-x2) * ((fullLength/2+delta_move)/fullLength);
        var line_center_y = y2 + (y1-y2) * ((fullLength/2+delta_move)/fullLength);

        var line_center_rotated = rotateV2AroundPoint(x1, y1, 90, line_center_x, line_center_y);
        var line_center_length = vectorLength(line_center_x, line_center_y, line_center_rotated.x, line_center_rotated.y);

        var new_line_cx = line_center_x + (line_center_rotated.x - line_center_x) * (30/line_center_length);
        var new_line_cy = line_center_y + (line_center_rotated.y - line_center_y) * (30/line_center_length);

        return {x: new_line_cx, y: new_line_cy};
    }

    // -------------- Математические методы ---------------

    // Длина вектора |V|
    function vectorLength(vx1, vy1, vx2, vy2) {
        return Math.sqrt(Math.pow(vx1 - vx2, 2) + Math.pow(vy1 - vy2, 2));
    }

    function vectorLength2(vx1, vy1) {
        return Math.sqrt(Math.pow(vx1, 2) + Math.pow(vy1, 2));
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

    function rotateV2AroundPoint(vx, vy, angle, px, py) {

        var rotatedVector = {};

        rotatedVector.x = vx - px;
        rotatedVector.y = vy - py;
        rotatedVector = rotateVector2(rotatedVector.x, rotatedVector.y, angle);

        rotatedVector.x = rotatedVector.x + px;
        rotatedVector.y = rotatedVector.y + py;

        return rotatedVector;
    }

    function scalarMulti(vx1, vy1, vx2, vy2) {
        return vx1 * vx2 + vy1 * vy2;
    }

    function angleBetweenVectors(vx1, vy1, vx2, vy2) {
        return Math.radiansToDegrees(Math.acos(scalarMulti(vx1, vy1, vx2, vy2) / (vectorLength2(vx1, vy1) * vectorLength2(vx2, vy2)) ));
    }

    // Converts from degrees to radians.
    Math.degreesToRadians = function(degrees) {
        return degrees * Math.PI / 180;
    };

// Converts from radians to degrees.
    Math.radiansToDegrees = function(radians) {
        return radians * 180 / Math.PI;
    };


    Paper.prototype.circlePath = function(cx,cy,r) {
        var p = "M" + cx + "," + cy;
        p += "m" + -r + ",0";
        p += "a" + r + "," + r + " 0 1,0 " + (r*2) +",0";
        p += "a" + r + "," + r + " 0 1,0 " + -(r*2) + ",0";
        //return this.path(p, cx, cy );
        return p;

    }
});