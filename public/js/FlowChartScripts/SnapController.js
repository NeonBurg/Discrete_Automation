// SnapController.js

var connections = new Array();

function Controller() {

    var dxToolMoved = 0;
    var firstTouch = false;

    var selected_tool_index = 0;
    var selection_object = null;

    var connect_mode = false;

    var tempConnection = null;
    var tempCircle = null;

    var node_from = null;
    var node_to = null;

    // ------------------ Перемещение диаграммы ------------------
    this.moveDiagram = function(dx,dy, x, y) {
        this.attr({
            transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
        });

        if(firstTouch == true) dxToolMoved = dx;

        for (var i = connections.length; i--;) {
            snap.create_connection(connections[i]);
        }

        //console.log(this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]);
        //console.log('moving: x = ' + x + " y = " + y);
    }

    // Начало перемещения диаграммы
    this.startMoveDiagram = function(x, y) {
        this.data('origTransform', this.transform().local );

        // Выбор элементов из панели блок схем
        if(this.type === 'g' && x<leftSide_w)
        {
            createAutomationElement(this);

            dxToolMoved = 0;
            firstTouch = true;
        }
        //console.log('startmove: x = ' + x + ' | y = ' + y);
    }

    // ------------------ Конец перемещения диаграммы ------------------
    this.stopMoveDiagram = function(evnt) {
        if(firstTouch == true)
        {
            if(dxToolMoved < leftSide_w/2+rectTool_s+1) {
                this.remove();
            }
            else {
                var sendData = {};
                //var types = ['String'];
                //var names = ['A', 'B', 'C'];
                sendData.title = 'a'+DiagramModel.getCountDiagrams();
                sendData.types = ['String'];
                sendData.names = [''];
                sendData.formats = [''];
                AddDiagram(this, sendData);

            }
            firstTouch = false;
        }
    }

    // ------------------ Выбор инструмента ------------------------
    this.toolClicked = function () {

        //console.log('toolClicked');

        switch(this.id) {
            case snap.select('#arrowTool').id:
                if(selected_tool_index != 0) {
                    onArrowToolSelected();
                    selectTool(0);
                    //console.log('toolClicked: arrow');
                }
                break;
            case snap.select('#connectTool').id:
                if(selected_tool_index != 1) {
                    onConnectToolSelected();
                    selectTool(1);
                    //console.log('toolClicked: connect');
                }
                break;
            case snap.select('#saveTool').id:
                if(selected_tool_index != 2) {
                    selectTool(2);
                }
                break;
        }
    }

    // Выделение инструмента цветным кружком
    function selectTool(index) {

        var toolDrawable = null;

        switch(index) {
            case 0:
                toolDrawable = snap.select('#arrowTool');
                break;
            case 1:
                toolDrawable = snap.select('#connectTool');
                break;
            case 2:
                //onSaveToolSelected();
                toolDrawable = snap.select('#saveTool');
                break;
        }

        if(selection_object) unselectTool();
        selected_tool_index = index;
        var t_x = toolDrawable.getBBox().x;
        var t_y = toolDrawable.getBBox().y;
        selection_object = snap.rect(t_x-9, t_y-4, 47, 39).attr({fill:"#b5b5b5"});
        selection_object.after(toolDrawable);
        selected_tool_index = index;
    }

    function onArrowToolSelected() {
        if(connect_mode) connectModeOff();
    }

    // Выбран инструмент 'Соединение'
    function onConnectToolSelected() {
        connectModeOn();
    }

    this.chooseTool = function (index) {
        selectTool(index);
    }

    // Снимаем выделение инструмента
    function unselectTool() {
        selection_object.remove();
    }

    function connectModeOn() {
        connect_mode = true;
        for(var i=0; i<controller.GetCountElements(); i++) {
            var diagramDrawable = controller.GetDrawableByIndex(i);
            diagramDrawable.attr({class: "connectable"});
            diagramDrawable.undrag();
            diagramDrawable.drag(controller.movingConn, controller.startMoveConn, controller.stopMoveConn);
            diagramDrawable.mouseover(controller.mouseoverConn);
            diagramDrawable.mouseout(controller.mouseoutConn)
        }
    }

    function connectModeOff() {
        connect_mode = false;
        for(var i=0; i<controller.GetCountElements(); i++) {
            var diagramDrawable = controller.GetDrawableByIndex(i);
            diagramDrawable.attr({class: "draggable"});
            diagramDrawable.undrag();
            diagramDrawable.drag(controller.moveDiagram, controller.startMoveDiagram, controller.stopMoveDiagram);
        }
    }
    // -----------------------------------------------------------------


    // ------------------- Перемещение соединений ----------------------
    this.mouseoverConn = function() {
        if(connect_mode) {
            this.select('.nodeCircle').attr({stroke: "#fff600"});

            if(node_from != null && node_to == null) node_to = DiagramModel.getIndexByDiagramId(this.id);
        }

    }

    this.mouseoutConn = function() {
        if(connect_mode) {
            this.select('.nodeCircle').attr({stroke: "#000"});
            if(node_to != null) node_to = null;
        }
    }

    // ------------- Движение -------------
    this.movingConn = function(dx,dy, x, y) {
        tempCircle.attr({
            transform: (tempCircle.data('origTransform') + tempCircle.data('origTransform') ? "T" : "t") + [dx, dy]
        });

        //console.log((tempCircle.data('origTransform') + tempCircle.data('origTransform') ? "T" : "t") + [dx, dy]);

        if(tempConnection) snap.connection(tempConnection);
    }


    // ---------- Начало движения -----------
    this.startMoveConn = function(x, y) {
        //console.log('startMoveConn: x = ' + x + ' | y = ' + y + " | y - 75 = " + (y-75));

        tempCircle = snap.circle(x-2, y-75, 0.1).attr({fill:"#000"});
        tempCircle.data('origTransform', tempCircle.transform().local );
        tempConnection = snap.connection(this.select('.nodeCircle'), tempCircle, 'black');

        //console.log('node index: ' + DiagramModel.getIndexByDiagramId(this.id));
        node_from = DiagramModel.getIndexByDiagramId(this.id);
        console.log('node_from: ' + node_from);
    }


    // ---------- Конец движения ------------
    this.stopMoveConn = function(evnt) {
        if(tempConnection) {
            tempConnection.line.remove();
            tempConnection = null;
            tempCircle.remove();
        }

        if(node_to != null) {
            console.log('node_from: ' + node_from + ' | node_to: ' + node_to);
            var drawable_from = DiagramModel.getDrawableByIndex(node_from);
            var drawable_to = DiagramModel.getDrawableByIndex(node_to);

            console.log('add connect from: ' + drawable_from.id + ' | connIndex = ' + connections.length);
            DiagramModel.addConnect2(drawable_from.id, drawable_to.id, connections.length);

            var node_data = DiagramModel.getDataByIndex(node_to);
            console.log('drawable_from data: ' + JSON.stringify(node_data));

            // Проверка создания противоположенно направленных связей между узлами
            /*var connectsToArr = node_data.connectsTo;
            for(var i=0; i<connectsToArr.length; i++) {
                if(connectsToArr[i] === node_from) {
                    console.log('connectsToArr[i]: ' + connectsToArr[i] + ' | node_from: ' + node_from);
                    var removeConnIndex = node_data.connectsToIndexes[i];
                    console.log('delete conn: ' + removeConnIndex);

                    console.log('connections.size1 = ' + connections.length);

                    connections[removeConnIndex].line.remove();
                    connections[removeConnIndex].arrow_line1.remove();
                    connections[removeConnIndex].arrow_line2.remove();
                    connections.slice(0, 1);

                    console.log('connections.size2 = ' + connections.length);
                }
            }*/

            var connection = snap.create_connection(drawable_from.select('.nodeCircle'), drawable_to.select('.nodeCircle'), 'black');
            connections.push(connection);
        }

        node_to = null;
        node_from = null;
    }


    // -------------------------- СЕТТЕРЫ ------------------------------
    this.setData = function(_drawableId, _data) {
        DiagramModel.setData(_drawableId, _data);
    }

    // -------------------------- ГЕТТЕРЫ ------------------------------

    this.GetCountElements = function() {
        return DiagramModel.getCountDiagrams();
    }

    this.GetDrawableByIndex = function(_index) {
        return DiagramModel.getDrawableByIndex(_index);
    }

    this.GetDrawableById = function(_drawableId) {
        return DiagramModel.getDrawableById(_drawableId);
    }
}

// ------------------- Остальные методы ------------------------

var AddDiagram = function(_drawable, _data) {
    var cx = _drawable.select('.nodeTitle').attr("x");
    _drawable.select('.nodeTitle').attr({x: cx-4, text: _data.title});

    if(DiagramModel.getCountDiagrams() == 0) zero_state_node = _drawable;

    DiagramModel.addData(_drawable, _data);
}