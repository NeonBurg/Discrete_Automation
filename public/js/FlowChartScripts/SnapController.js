// SnapController.js

//var connections = new Array();

function Controller() {

    //var connections = new Array();

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

        /*for (var i = connections.length; i--;) {
            snap.create_connection(connections[i]);
        }*/

        for (var i = DiagramModel.getConnectsCount(); i--;) {
            snap.create_connection(DiagramModel.getConnectByIndex(i));
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
        if(firstTouch === true)
        {
            if(dxToolMoved < leftSide_w/2+rectTool_s+1) {
                this.remove();
            }
            else {
                var sendData = {};
                //var types = ['String'];
                //var names = ['A', 'B', 'C'];
                sendData.title = 'a'+DiagramModel.getCountDiagrams();
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
                if(selected_tool_index !== 0) {
                    selectTool(0);
                    //console.log('toolClicked: arrow');
                }
                break;
            case snap.select('#connectTool').id:
                if(selected_tool_index !== 1) {
                    selectTool(1);
                    //console.log('toolClicked: connect');
                }
                break;
            case snap.select('#saveTool').id:
                if(selected_tool_index !== 2) {
                    selectTool(2);
                }
                break;
            case snap.select('#variablesTool').id:
                if(selected_tool_index !== 3) {
                    modal_form.showModalDialog(modal_form.input_variables_modal);
                    selectTool(3);
                }
                break;
            case snap.select('#outputsTool').id:
                if(selected_tool_index !== 4) {
                    modal_form.showModalDialog(modal_form.output_variables_modal);
                    selectTool(4);
                }
                break;
        }
    }

    // Выделение инструмента цветным кружком
    function selectTool(index) {

        var toolDrawable = null;

        switch(index) {
            case 0:
                onArrowToolSelected();
                toolDrawable = snap.select('#arrowTool');
                break;
            case 1:
                onConnectToolSelected();
                toolDrawable = snap.select('#connectTool');
                break;
            case 2:
                onSaveToolSelected();
                toolDrawable = snap.select('#saveTool');
                break;
            case 3:
                toolDrawable = snap.select('#variablesTool');
                break;
            case 4:
                toolDrawable = snap.select('#outputsTool');
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

    this.selectTool = function(index) {
        selectTool(index);
    };

    function onArrowToolSelected() {
        if(connect_mode) connectModeOff();
    }

    // Выбран инструмент 'Соединение'
    function onConnectToolSelected() {
        connectModeOn();
    }

    function onSaveToolSelected() {
        var connections_data = DiagramModel.getConnects();

        modal_form.showModalDialog(modal_form.save_diagram_modal);

        /*for(var i=0; i<connections_data.length; i++) {
            console.log('---------------------');
            console.log('connection: ' + i);
            var input_vars = connections_data[i].inputVariables;
            var output_vars = connections_data[i].outputVariables;
            var input_vars_text = '';
            var output_vars_text = '';
            for(var j=0; j<input_vars.length; j++) {
                input_vars_text += input_vars[j] + ' | ';
            }
            for(var j=0; j<output_vars.length; j++) {
                output_vars_text += output_vars[j];
            }
            console.log('inputs: ' + input_vars_text);
            console.log('outputs: ' + output_vars_text);
        }

        var projectName = 'test2';

        $.get("/getProjectsNamesList", {}, function(response) {
            var projects_filenames = JSON.parse(response);
            var filename_unique = true;

            for(var i=0; i<projects_filenames.length; i++) {
                //console.log('pName = ' +pName + ' | pName = ' + projectName);
                if(pName === projects_filenames[i]) filename_unique = false;
            }

            if(filename_unique) {
                $.post("/saveProject", {pName: projectName, pData: JSON.stringify(connections_data)}, onFileWriteSuccess);
            }
            else {
                console.log('project \''+projectName+'\' already exist!');
            }
        });*/
    }

    this.chooseTool = function (index) {
        selectTool(index);
    };

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

            if(node_from !== null && node_to === null) node_to = DiagramModel.getIndexByDiagramId(this.id);
        }

    };

    this.mouseoutConn = function() {
        if(connect_mode) {
            this.select('.nodeCircle').attr({stroke: "#000"});
            if(node_to != null) node_to = null;
        }
    };

    // ------------- Движение -------------
    this.movingConn = function(dx,dy, x, y) {
        tempCircle.attr({
            transform: (tempCircle.data('origTransform') + tempCircle.data('origTransform') ? "T" : "t") + [dx, dy]
        });

        //console.log((tempCircle.data('origTransform') + tempCircle.data('origTransform') ? "T" : "t") + [dx, dy]);

        if(tempConnection) snap.connection(tempConnection);
    };


    // ---------- Начало движения -----------
    this.startMoveConn = function(x, y) {
        //console.log('startMoveConn: x = ' + x + ' | y = ' + y + " | y - 75 = " + (y-75));

        tempCircle = snap.circle(x-2, y-75, 0.1).attr({fill:"#000"});
        tempCircle.data('origTransform', tempCircle.transform().local );
        tempConnection = snap.connection(this.select('.nodeCircle'), tempCircle, 'black');

        //console.log('node index: ' + DiagramModel.getIndexByDiagramId(this.id));
        node_from = DiagramModel.getIndexByDiagramId(this.id);
        console.log('node_from: ' + node_from);
    };


    // ---------- Конец движения ------------
    this.stopMoveConn = function(evnt) {
        if(tempConnection) {
            tempConnection.line.remove();
            tempConnection = null;
            tempCircle.remove();
        }

        if(node_to !== null) {
            console.log('node_from: ' + node_from + ' | node_to: ' + node_to);

            if(node_from !== node_to) {

                /*var drawable_from = DiagramModel.getDrawableByIndex(node_from);
                var drawable_to = DiagramModel.getDrawableByIndex(node_to);

                var node_data = DiagramModel.getDataByIndex(node_to);
                console.log('drawable_from data: ' + JSON.stringify(node_data));

                var removeConnIndex = -1;

                // Проверка создания противоположенно направленных связей между узлами
                var connectsToArr = node_data.connectsTo;
                for (var i = 0; i < connectsToArr.length; i++) {
                    if (connectsToArr[i] === node_from) {
                        console.log('connectsToArr[i]: ' + connectsToArr[i] + ' | node_from: ' + node_from);
                        removeConnIndex = node_data.connectsToIndexes[i];
                        console.log('delete conn: ' + removeConnIndex);
                    }
                }

                var connection = snap.create_connection(drawable_from.select('.nodeCircle'), drawable_to.select('.nodeCircle'), 'black');

                if (removeConnIndex !== -1) {
                    snap.split_double_connections(DiagramModel.getConnectByIndex(removeConnIndex), connection);
                }

                DiagramModel.addConnect(drawable_from.id, drawable_to.id, connection);*/

                connectNodes(node_from, node_to);

                modal_form.showModalDialog(modal_form.connection_modal, DiagramModel.getConnectsCount()-1);

            }
        }

        node_to = null;
        node_from = null;
    };

    // ---------- Создаем связь между узлами -----------
    function connectNodes(node_from, node_to) {
        var drawable_from = DiagramModel.getDrawableByIndex(node_from);
        var drawable_to = DiagramModel.getDrawableByIndex(node_to);

        var node_data = DiagramModel.getDataByIndex(node_to);
        console.log('drawable_from data: ' + JSON.stringify(node_data));

        var removeConnIndex = -1;

        // Проверка создания противоположенно направленных связей между узлами
        var connectsToArr = node_data.connectsTo;
        for (var i = 0; i < connectsToArr.length; i++) {
            if (connectsToArr[i] === node_from) {
                console.log('connectsToArr[i]: ' + connectsToArr[i] + ' | node_from: ' + node_from);
                removeConnIndex = node_data.connectsToIndexes[i];
                console.log('delete conn: ' + removeConnIndex);
            }
        }

        var connection = snap.create_connection(drawable_from.select('.nodeCircle'), drawable_to.select('.nodeCircle'), 'black');

        if (removeConnIndex !== -1) {
            snap.split_double_connections(DiagramModel.getConnectByIndex(removeConnIndex), connection);
        }

        DiagramModel.addConnect(drawable_from.id, drawable_to.id, connection);
    };

    // ----------------- Сохраняем/Загружаем проект --------------------
    this.save_project_clicked = function() {
        var project_name = $('#ProjNameInput').val();
        //console.log('save_project func: pName = ' + pName);
        $.post("/getIsProjectNameUnique", {pName: project_name}, function(response) {
            if(response === 'true') {
                console.log('response = ' + response);
                var graph_data_save = DiagramModel.getAllData();
                var input_variables_save = DiagramModel.getInputVariables();
                var output_variables_save = DiagramModel.getOutputVariables();
                var connections_data_save = DiagramModel.getConnects();

                var xPos, yPos;
                for(var id in graph_data_save) {
                    //console.log('id: ' + id);
                    xPos = DiagramModel.getDrawableById(id).getBBox().x;
                    yPos = DiagramModel.getDrawableById(id).getBBox().y;
                    if(xPos && yPos) {
                        graph_data_save[id].position = [xPos, yPos];
                    }
                    else {
                        graph_data_save[id].position = [0, 0];
                    }
                }

                var project_data = {graphData: JSON.stringify(graph_data_save),
                                    inputVariables: JSON.stringify(input_variables_save),
                                    outputVariables: JSON.stringify(output_variables_save),
                                    connectionsData: JSON.stringify(connections_data_save)};

                $.post("/saveProject", {pName: project_name, pData: JSON.stringify(project_data)}, onFileWriteSuccess);
            }
            else {
                $('#error_msg_save').text("Проект с таким названием уже существует");
            }
        });
    };


    this.load_project_clicked = function() {
        var project_name = $('#ProjSelect').val();
        $.post("/readProjectFile", {pFileName: project_name}, function(response) {

            if(response !== 'false') {
                //console.log(response);
                clearAll();

                var project_data = JSON.parse(response);
                project_data = JSON.parse(project_data.pData);

                var graph_data_load = JSON.parse(project_data.graphData);
                var input_variables_load = JSON.parse(project_data.inputVariables);
                var output_variables_load = JSON.parse(project_data.outputVariables);
                var connections_data_load = JSON.parse(project_data.connectionsData);

                console.log(connections_data_load);

                DiagramModel.setInputVariablesList(input_variables_load);
                DiagramModel.setOutputVariablesList(output_variables_load);


                for(var key in graph_data_load) {
                    //console.log('graph_data_load[key] = ' + graph_data_load[key]);
                    var xPos = graph_data_load[key].position[0];
                    var yPos = graph_data_load[key].position[1];

                    var diagramDrawable = createAutomationElementAtPos(xPos, yPos);
                    AddDiagram(diagramDrawable, graph_data_load[key]);
                }

                var node_from_index = 0;
                for(var key in graph_data_load) {
                    var connects_to_list = graph_data_load[key].connectsTo;

                    console.log('node_from_index = ' + node_from_index);
                    console.log('connects_to_list = ' + connects_to_list);

                    for(var key2 in connects_to_list) {
                        var node_to_index = connects_to_list[key2];
                        var connect_to_index = graph_data_load[key].connectsToIndexes[key2];
                        console.log('connect_nodes: from = ' + node_from_index + ' | to = ' + node_to_index + ' | connect_to_index = ' + connect_to_index);
                        connectNodes(node_from_index, node_to_index);
                        /*var inputVars = connections_data_load[connect_to_index].inputVariables;
                        var outputVars = connections_data_load[connect_to_index].outputVariables;
                        controller.setConnectionVariables(connect_to_index, inputVars, outputVars);*/
                    }
                    node_from_index++;
                }

                for(var key in graph_data_load) {
                    var connectsToIndexes = graph_data_load[key].connectsToIndexes;
                    for (var key2 in connectsToIndexes) {
                        var connect_to_index = connectsToIndexes[key2];
                        inputVars = connections_data_load[connect_to_index].inputVariables;
                        var outputVars = connections_data_load[connect_to_index].outputVariables;
                        controller.setConnectionVariables(connect_to_index, inputVars, outputVars);
                    }
                }
            }
            else {
                $('#err_msg_load').text("Ошибка загрузки проекта");
            }

        });
    };


    function onFileWriteSuccess(response) {
        console.log('fw_response: ' + response);
        var err_msg_elem = $('#error_msg_save');
        if(response === 'true') {
            err_msg_elem.css("color", "green");
            err_msg_elem.text("Проект успешно сохранен");
            DiagramModel.current_project_name = $('#ProjNameInput').val();
            var projSel = document.getElementById('ProjSelect');
            DiagramModel.current_project_index = projSel.options.length;
            projSel.options[DiagramModel.current_project_index] = (new Option(DiagramModel.current_project_name, DiagramModel.current_project_name));
            projSel.options[DiagramModel.current_project_index].selected = true;
        }
        else if(response === 'false') {
            err_msg_elem.css("color", "crimson");
            err_msg_elem.text = "Ошибка сохранения проекта";
        }
    }

    // Удаляем все графические элементы
    function clearAll() {
        console.log('clearAll()');
        // Удаляем связи
        var connections = DiagramModel.getConnects();
        for(var i=0; i<connections.length; i++) {
            connections[i].connection.line.remove();
            connections[i].connection.text_element.remove();
            connections[i].connection.arrow_line1.remove();
            connections[i].connection.arrow_line2.remove();
        }
        DiagramModel.clearConnects();

        // Удаляем объекты
        var diagramsCount = DiagramModel.getCountDiagrams();
        for(var i=0; i<diagramsCount; i++) {
            DiagramModel.removeDiagramByIndex(i);
        }
        DiagramModel.clearIndexes();
    }

    // -----------------------------------------------------------------


    // -------------------------- СЕТТЕРЫ ------------------------------
    this.setData = function(_drawableId, _data) {
        DiagramModel.setData(_drawableId, _data);
    };

    this.setConnectionVariables = function(_connIndex, _inputVariables, _outputVariables) {
        var connection_text = '';

        console.log('create_conn_text');
        var connection_text = '';

        var input_count = 0;
        for(var key_name in _inputVariables) {
            connection_text += _inputVariables[key_name] + ', ';
            input_count++;
        }
        if(input_count > 0) connection_text = connection_text.substring(0, connection_text.length - 2); // Удалим последнею запятую после переменной

        var output_vars_text = '';
        var output_count = 0;
        for(var key_name in _outputVariables) {
            output_vars_text += _outputVariables[key_name] + ', ';
            output_count++;
        }

        if(output_count > 0) {
            output_vars_text = output_vars_text.substring(0, output_vars_text.length - 2); // Удалим последнею запятую после переменной
            connection_text = connection_text + ' / ' + output_vars_text;
        }

        console.log('_connIndex = ' + _connIndex);

        current_connection = controller.getConnectionData(_connIndex);
        current_connection.connection.text_element.attr({text: connection_text});
        current_connection.connection.text = connection_text;
        current_connection.inputVariables = _inputVariables;
        current_connection.outputVariables = _outputVariables;
    };

    // -------------------------- ГЕТТЕРЫ ------------------------------

    this.GetCountElements = function() {
        return DiagramModel.getCountDiagrams();
    };

    this.GetDrawableByIndex = function(_index) {
        return DiagramModel.getDrawableByIndex(_index);
    };

    this.GetDrawableById = function(_drawableId) {
        return DiagramModel.getDrawableById(_drawableId);
    };

    this.getConnection = function(_connIndex) {
        return DiagramModel.getConnectByIndex(_connIndex);
    };

    this.getConnectionData = function(_connIndex) {
        return DiagramModel.getConnectDataByIndex(_connIndex);
    };

    this.testShow = function() {
        terminal.sendToTerminal("testShow(): hello from controller!")
    }
}

// ------------------- Остальные методы ------------------------

var AddDiagram = function(_drawable, _data) {
    //console.log('AddDiagram: ');
    //console.log('_data: ' + _data);
    var cx = _drawable.select('.nodeTitle').attr("x");
    _drawable.select('.nodeTitle').attr({x: cx-4, text: _data.title});

    if(DiagramModel.getCountDiagrams() === 0) zero_state_node = _drawable;

    DiagramModel.addData(_drawable, _data);
};