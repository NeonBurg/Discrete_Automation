// SnapController.js

//var connections = new Array();

function Controller() {

    //var connections = new Array();

    var dxToolMoved = 0;
    var firstTouch = false;

    var selected_tool_index = -1;
    var selection_object = null;
    var hover_object = null;

    var connect_mode = false;

    var tempConnection = null;
    var tempCircle = null;

    var node_from = null;
    var node_to = null;

    this.ARROW_TOOL = 0;
    this.CONNECT_TOOL = 1;
    this.SAVE_TOOL = 2;
    this.INPUT_VARS_TOOL = 3;
    this.OUTPUT_VARS_TOOL = 4;
    this.PLAY_TOOL = 5;
    this.ENTER_DATA_TOOL = 6;

    // ------------------ Перемещение диаграммы ------------------
    this.moveDiagram = function(dx,dy, x, y) {
        this.attr({
            transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
        });

        //console.log('moveDiagram');

        dxToolMoved = dx;

        for (let i = DiagramModel.getConnectsCount(); i--;) {
            snap.create_connection(DiagramModel.getConnectByIndex(i));
        }

        //console.log(this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]);
        //console.log('moving: x = ' + x + " y = " + y);
    };

    // ------------------ Начало перемещения диаграммы ------------------
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
    };

    // ------------------ Конец перемещения диаграммы ------------------
    this.stopMoveDiagram = function(evnt) {
        if(firstTouch === true)
        {
            if(dxToolMoved < leftSide_w/2+rectTool_s+1) {
                this.remove();
            }
            else {
                let sendData = {};
                //var types = ['String'];
                //var names = ['A', 'B', 'C'];
                sendData.title = 'a'+DiagramModel.getCountDiagrams();
                AddDiagram(this, sendData);
            }
            firstTouch = false;
            dxToolMoved = 0;
        }
    };


    // ----------------- Клик по вершине графа --------------------
    this.diagramClicked = function() {
        //console.log('dxToolMoved = ' + dxToolMoved);
        if(dxToolMoved === 0) {
            let node_index = DiagramModel.getIndexByDiagramId(this.id);

            if(connect_mode) {
                console.log('self_connect node: ' + node_index);
                let connection = snap.create_connection(DiagramModel.getDrawableByIndex(node_index).select('.nodeCircle'), DiagramModel.getDrawableByIndex(node_index).select('.nodeCircle'));
                DiagramModel.addConnect(this.id, this.id, connection);
                let conn_data = {connectsFrom: node_index, connectsTo: node_index};
                modal_form.showModalDialog(modal_form.connection_modal, DiagramModel.getConnectsCount()-1, conn_data);
            }
            else {
                console.log('diagram ' + node_index + ' clicked');
                let node_data = {node_index: node_index};
                modal_form.showModalDialog(modal_form.node_info_modal, null, node_data);
            }
        }

        dxToolMoved = 0;
    };

    // Для теста визуализатора
    this.diagramHovered = function() {
        console.log('diagramHovered');
        let node_index = DiagramModel.getIndexByDiagramId(this.id);
        graphVisualizer.hoverNode(node_index);
    };

    this.diagramUnHovered = function() {
        graphVisualizer.clearHoverNode();
    };

    // ------------------ Выбор инструмента ------------------------
    this.toolClicked = function () {

        //console.log('toolClicked');

        switch(this.id) {
            case snap.select('#arrowTool').id:
                selectTool(controller.getToolType('arrowTool'));
                break;
            case snap.select('#connectTool').id:
                selectTool(controller.getToolType('connectTool'));
                break;
            case snap.select('#saveTool').id:
                selectTool(controller.getToolType('saveTool'));
                break;
            case snap.select('#variablesTool').id:
                selectTool(controller.getToolType('variablesTool'));
                break;
            case snap.select('#outputsTool').id:
                selectTool(controller.getToolType('outputsTool'));
                break;
            case snap.select('#playTool').id:
                selectTool(controller.getToolType('playTool'));
                break;
            case snap.select('#enterDataTool').id:
                selectTool(controller.getToolType('enterDataTool'));
                break;
        }
    };

    // Выделение инструмента цветом
    function selectTool(index) {

        console.log('select_tool: ' + index + ' | selected_tool_index = ' + selected_tool_index);

        if(selected_tool_index !== index) {
            let toolDrawable = null;

            switch (index) {
                case controller.ARROW_TOOL:
                    onArrowToolSelected();
                    toolDrawable = snap.select('#arrowTool');
                    break;
                case controller.CONNECT_TOOL:
                    onConnectToolSelected();
                    toolDrawable = snap.select('#connectTool');
                    break;
                case controller.SAVE_TOOL:
                    onSaveToolSelected();
                    toolDrawable = snap.select('#saveTool');
                    break;
                case controller.INPUT_VARS_TOOL:
                    onInputVarsSelected();
                    toolDrawable = snap.select('#variablesTool');
                    break;
                case controller.OUTPUT_VARS_TOOL:
                    onOutputVarsSelected();
                    toolDrawable = snap.select('#outputsTool');
                    break;
                case controller.PLAY_TOOL:
                    onPlayToolSelected();
                    toolDrawable = snap.select('#playTool');
                    break;
                case controller.ENTER_DATA_TOOL:
                    onEnterDataSelected();
                    toolDrawable = snap.select('#enterDataTool');
                    break;
            }

            if (selection_object) {
                unselectTool(selected_tool_index);
            }
            let t_x = toolDrawable.getBBox().x;
            let t_y = toolDrawable.getBBox().y;
            selection_object = snap.rect(t_x - 9, t_y - 4, 49, 39).attr({fill: "#b5b5b5"});
            selection_object.after(toolDrawable);
            selected_tool_index = index;
        }
    }

    this.selectTool = function(index) {
        selectTool(index);
    };

    // Выделение инструмента цветом при наведении мыши
    this.toolHovered = function() {
        //console.log('toolHovered');
        let toolDrawable = null;
        let tool_type;
        let tool_drawable_id = '';

        switch(this.id) {
            case snap.select('#arrowTool').id:
                tool_drawable_id = 'arrowTool';
                break;
            case snap.select('#connectTool').id:
                tool_drawable_id = 'connectTool';
                break;
            case snap.select('#saveTool').id:
                tool_drawable_id = 'saveTool';
                break;
            case snap.select('#variablesTool').id:
                tool_drawable_id = 'variablesTool';
                break;
            case snap.select('#outputsTool').id:
                tool_drawable_id = 'outputsTool';
                break;
            case snap.select('#playTool').id:
                tool_drawable_id = 'playTool';
                break;
            case snap.select('#enterDataTool').id:
                tool_drawable_id = 'enterDataTool';
                break;
        }

        toolDrawable = snap.select('#'+tool_drawable_id);
        tool_type = controller.getToolType(tool_drawable_id);

        let t_x = toolDrawable.getBBox().x;
        let t_y = toolDrawable.getBBox().y;

        if(tool_type !== selected_tool_index) {
            hover_object = snap.rect(t_x - 9, t_y - 4, 49, 39).attr({fill: "#e2e2e2"});
            hover_object.after(toolDrawable);
        }

        document.body.style.cursor = "pointer";
    };

    // Выделение инструмента цветом при наведении мыши
    this.toolUnHovered = function() {
        //console.log('toolUnHovered');
        if(hover_object) {
            //snap.select('#selection_object').remove();
            hover_object.remove();
            hover_object = null;
            document.body.style.cursor = "auto";
        }
    };


    // ----------- Функции выполняемые при выборе инструмента --------------

    function onArrowToolSelected() {
        //if(connect_mode) connectModeOff();
    }

    // Выбран инструмент 'Соединение'
    function onConnectToolSelected() {
        connectModeOn();
    }

    function onSaveToolSelected() {
        modal_form.showModalDialog(modal_form.save_diagram_modal);
    }

    function onInputVarsSelected() {
        modal_form.showModalDialog(modal_form.input_variables_modal);
    }

    function onOutputVarsSelected() {
        modal_form.showModalDialog(modal_form.output_variables_modal);
    }

    function onPlayToolSelected() {
        startDiscreteAuto();
    }

    function onEnterDataSelected() {
        modal_form_draggable.showModalDialog(modal_form_draggable.enter_data_modal);
    }

    this.chooseTool = function (index) {
        selectTool(index);
    };

    // Снимаем выделение инструмента
    function unselectTool(selection_index) {

        //console.log('unselectTool: ' + selection_index);

        switch(selection_index) {
            case 1:
                connectModeOff();
                break;
            case 5:
                stopDiscreteAuto();
                break;
        }

        selection_object.remove();
        selection_object = null;
    }

    function connectModeOn() {
        connect_mode = true;
        for(let i=0; i<controller.GetCountElements(); i++) {
            let diagramDrawable = controller.GetDrawableByIndex(i);
            diagramDrawable.attr({class: "connectable"});
            diagramDrawable.undrag();
            diagramDrawable.drag(controller.movingConn, controller.startMoveConn, controller.stopMoveConn);
            diagramDrawable.mouseover(controller.mouseoverConn);
            diagramDrawable.mouseout(controller.mouseoutConn)
        }
    }

    function connectModeOff() {
        connect_mode = false;
        for(let i=0; i<controller.GetCountElements(); i++) {
            let diagramDrawable = controller.GetDrawableByIndex(i);
            diagramDrawable.attr({class: "draggable"});
            diagramDrawable.undrag();
            diagramDrawable.drag(controller.moveDiagram, controller.startMoveDiagram, controller.stopMoveDiagram);
        }
    }
    // -----------------------------------------------------------------


    // ------------------============= Перемещение соединений ==============----------------
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

    this.connectionHover = function() {
        //console.log('connection hover');
        //console.log(JSON.stringify(this));
        //console.log('line_obj id: ' + this.select('.line_object').id);
        //console.log('hover conn: ' + DiagramModel.getConnectIndexById(this.select('.line_object').id));
        this.select('.line_hover_object').attr({opacity: 1});
        this.select('.line_hover_object').insertBefore(this.select('.line_object'));
    };

    this.connectionUnhover = function() {
        //console.log('connection unhover');
        this.select('.line_hover_object').attr({opacity: 0});
    };

    this.connectionClicked = function() {
        let conn_index = DiagramModel.getConnectIndexById(this.select('.line_object').id);
        //console.log('click on conn: ' + conn_index);
        let conn_data = DiagramModel.getConnectDataByIndex(conn_index);
        let node_from = conn_data.fromDrawableIndex;
        let node_to = conn_data.toDrawableIndex;
        //console.log('from: ' + node_from + ' | to: ' + node_to);
        let send_conn_data = {connectsFrom: node_from, connectsTo: node_to};
        modal_form.showModalDialog(modal_form.connection_modal, conn_index, send_conn_data);
    },

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

                connectNodes(node_from, node_to);

                let conn_data = {connectsFrom: node_from, connectsTo: node_to};

                modal_form.showModalDialog(modal_form.connection_modal, DiagramModel.getConnectsCount()-1, conn_data);

            }
        }

        node_to = null;
        node_from = null;
    };

    // ---------- Создаем связь между узлами -----------
    function connectNodes(node_from, node_to) {
        let drawable_from = DiagramModel.getDrawableByIndex(node_from);
        let drawable_to = DiagramModel.getDrawableByIndex(node_to);

        let node_data = DiagramModel.getDataByIndex(node_to);
        console.log('drawable_from data: ' + JSON.stringify(node_data));

        let removeConnIndex = -1;

        // Проверка создания противоположенно направленных связей между узлами
        let connectsToArr = node_data.connectsTo;
        for (let i = 0; i < connectsToArr.length; i++) {
            if (connectsToArr[i] === node_from) {
                console.log('connectsToArr[i]: ' + connectsToArr[i] + ' | node_from: ' + node_from);
                removeConnIndex = node_data.connectsToIndexes[i];
                console.log('delete conn: ' + removeConnIndex);
            }
        }

        let connection = snap.create_connection(drawable_from.select('.nodeCircle'), drawable_to.select('.nodeCircle'), 'black');

        if (removeConnIndex !== -1) {
            snap.split_double_connections(DiagramModel.getConnectByIndex(removeConnIndex), connection);
        }

        DiagramModel.addConnect(drawable_from.id, drawable_to.id, connection);
    }

    // --------------------------------------------------------------------------------------------------

    // ----------------- Сохраняем/Загружаем проект --------------------
    this.save_project_clicked = function() {
        let project_name = $('#ProjNameInput').val();
        console.log('save_project func: pName = ' + project_name);
        $.post("/getIsProjectNameUnique", {pName: project_name}, function(response) {
            if(response === 'true') {
                console.log('response = ' + response);
                let graph_data_save = DiagramModel.getAllData();
                let input_variables_save = DiagramModel.getInputVariables();
                let output_variables_save = DiagramModel.getOutputVariables();
                let connections_data_save = DiagramModel.getConnectsData();
                let program_variables_save = DiagramModel.getProgramVariablesData();

                console.log('graph_arr = ' + JSON.stringify(graph_data_save));
                console.log('connections_arr = ' + JSON.stringify(connections_data_save));

                let xPos, yPos;
                for(let id in graph_data_save) {
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

                let project_data = {graphData: JSON.stringify(graph_data_save),
                                    inputVariables: JSON.stringify(input_variables_save),
                                    outputVariables: JSON.stringify(output_variables_save),
                                    connectionsData: JSON.stringify(connections_data_save),
                                    startNodeIndex: DiagramModel.getStartDiagramIndex(),
                                    endNodeIndex: DiagramModel.getEndDiagramIndex(),
                                    programVariables: JSON.stringify(program_variables_save)};

                $.post("/saveProject", {pName: project_name, pData: JSON.stringify(project_data)}, onFileWriteSuccess);
            }
            else {
                $('#error_msg_save').text("Проект с таким названием уже существует");
            }
        });
    };


    this.load_project_clicked = function() {
        let project_name = $('#ProjSelect').val();
        $.post("/readProjectFile", {pFileName: project_name}, function(response) {

            if(response !== 'false') {
                //console.log(response);
                clearAll();

                let project_data = JSON.parse(response);
                project_data = JSON.parse(project_data.pData);

                let graph_data_load = JSON.parse(project_data.graphData);
                let input_variables_load = JSON.parse(project_data.inputVariables);
                let output_variables_load = JSON.parse(project_data.outputVariables);
                let connections_data_load = JSON.parse(project_data.connectionsData);
                let start_node_index = JSON.parse(project_data.startNodeIndex);
                let end_node_index = JSON.parse(project_data.endNodeIndex);
                try {
                    let program_variables = JSON.parse(project_data.programVariables);
                    DiagramModel.setProgramVariables(program_variables);
                }
                catch(error) {

                }

                console.log(connections_data_load);

                DiagramModel.setInputVariablesList(input_variables_load);
                DiagramModel.setOutputVariablesList(output_variables_load);
                DiagramModel.setStartDiagramIndex(start_node_index);
                DiagramModel.setEndDiagramIndex(end_node_index);


                for(let key in graph_data_load) {
                    //console.log('graph_data_load[key] = ' + graph_data_load[key]);
                    let xPos = graph_data_load[key].position[0];
                    let yPos = graph_data_load[key].position[1];

                    let diagramDrawable = createAutomationElementAtPos(xPos, yPos);
                    LoadDiagram(diagramDrawable, graph_data_load[key]);
                }


                for(let conn_index in connections_data_load) {
                    //console.log('---> conn_index = ' + conn_index);
                    //console.log(JSON.stringify(connections_data_load[conn_index]));
                    let node_from_index = connections_data_load[conn_index].fromDrawableIndex;
                    let node_to_index = connections_data_load[conn_index].toDrawableIndex;
                    connectNodes(node_from_index, node_to_index);
                    let inputVars = connections_data_load[conn_index].inputVariables;
                    let outputVars = connections_data_load[conn_index].outputVariables;
                    //console.log('node_from_index = ' + node_from_index);
                    //console.log('node_to_index = ' + node_to_index);
                    controller.setConnectionVariables(conn_index, inputVars, outputVars);
                }

                loadStartEndStates();
            }
            else {
                $('#err_msg_load').text("Ошибка загрузки проекта");
            }

        });
    };

    // Выделим начальное и конечное состояния после загрузки проекта
    function loadStartEndStates() {

        console.log('loadStartEndStates: start_index = ' + DiagramModel.getStartDiagramIndex() + ' | end_index = ' + DiagramModel.getEndDiagramIndex());

        console.log('----------------------');
        console.log(JSON.stringify(DiagramModel.getDrawableByIndex(DiagramModel.getStartDiagramIndex())));

        if(DiagramModel.getStartDiagramIndex() !== -1) {
            DiagramModel.getDrawableByIndex(DiagramModel.getStartDiagramIndex()).select('.nodeStateText').attr({visibility: 'visible', text: 'start'});
        }

        if(DiagramModel.getEndDiagramIndex() !== -1) {
            DiagramModel.getDrawableByIndex(DiagramModel.getEndDiagramIndex()).select('.nodeStateText').attr({visibility: 'visible', text: 'end'});
        }
    }


    function onFileWriteSuccess(response) {
        console.log('fw_response: ' + response);
        let err_msg_elem = $('#error_msg_save');
        if(response === 'true') {
            err_msg_elem.css("color", "green");
            err_msg_elem.text("Проект успешно сохранен");
            DiagramModel.current_project_name = $('#ProjNameInput').val();
            let projSel = document.getElementById('ProjSelect');
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
        let connections = DiagramModel.getConnects();
        for(let i=0; i<connections.length; i++) {
            connections[i].connection.line.remove();
            connections[i].connection.text_element.remove();
            connections[i].connection.arrow_line1.remove();
            connections[i].connection.arrow_line2.remove();
        }
        DiagramModel.clearConnects();

        // Удаляем объекты
        let diagramsCount = DiagramModel.getCountDiagrams();
        for(let i=0; i<diagramsCount; i++) {
            DiagramModel.removeDiagramByIndex(i);
        }
        DiagramModel.clearIndexes();
    }

    // -----------------------------------------------------------------


    // ------------------- Управление терминалом -----------------------
    function startDiscreteAuto() {
        console.log('startDiscreteAuto');
        discreteAuto = new DiscreteAuto();

        let graph_arr = DiagramModel.getAllData();
        let conn_arr = DiagramModel.getConnectsData();
        let inputs_arr = DiagramModel.getInputVariables();
        let outputs_arr = DiagramModel.getOutputVariables();

        if(discreteAuto.init(graph_arr, conn_arr, inputs_arr, outputs_arr)) {
            let playTool = snap.select('#playTool');
            let t_x = playTool.getBBox().x;
            let t_y = playTool.getBBox().y;
            playTool.remove();
            playTool = snap.image("img/stop-button.svg", t_x, t_y, 30, 30).attr({id: "playTool"});
            playTool.click(controller.toolClicked);
            playTool.hover(controller.toolHovered, controller.toolUnHovered);

            discreteAuto.start();
            terminal.sendToTerminal('Дискретный автомат был успешно запущен', terminal.SUCCESS_MSG_TYPE);
            terminal.sendToTerminal('Введите входное значение:');
            graphVisualizer.hoverNode(discreteAuto.getCurrentState());
        }
        else {
            let err_msg_list = discreteAuto.getErrorMsgs();
            for(let err_msg_key in err_msg_list) {
                terminal.sendToTerminal(err_msg_list[err_msg_key], terminal.ERROR_MSG_TYPE);
            }
            selectTool(getToolType('arrowTool'));
            discreteAuto.clearErrorMsgs();
            discreteAuto = null;
        }
    }

    function stopDiscreteAuto() {

        console.log('stopDiscreteAuto');

        if(discreteAuto !== null) {
            let playTool = snap.select('#playTool');
            let t_x = playTool.getBBox().x;
            let t_y = playTool.getBBox().y;
            playTool.remove();
            playTool = snap.image("img/play-button.svg", t_x, t_y, 30, 30).attr({id: "playTool"});
            playTool.click(controller.toolClicked);
            playTool.hover(controller.toolHovered, controller.toolUnHovered);

            discreteAuto.stop();
            graphVisualizer.clearHoverNode();
        }
    }

    this.sendTerminalCommand = function(_command) {
        if(discreteAuto !== null && discreteAuto.is_started) {
            terminal.sendToTerminal('lastState: ' + discreteAuto.getCurrentState());
            if(discreteAuto.sendInput(_command)) {
                terminal.sendToTerminal('currState: ' + discreteAuto.getCurrentState() + ' | currOutputKey: ' + discreteAuto.getCurrentOutputKey());
                terminal.sendToTerminal('out: ' + discreteAuto.getCurrentOutputValue());
                graphVisualizer.clearHoverNode();
                graphVisualizer.hoverNode(discreteAuto.getCurrentState());

                //console.log('end state = ' + DiagramModel.getEndDiagramIndex());

                if(discreteAuto.getCurrentState() === DiagramModel.getEndDiagramIndex()) {
                    terminal.sendToTerminal('Discrete automate is END at the state: ' + DiagramModel.getNodeTitleByIndex(discreteAuto.getCurrentState()), terminal.SUCCESS_MSG_TYPE);
                    stopDiscreteAuto();
                }

            }
            else {
                let err_msg_list = discreteAuto.getErrorMsgs();
                for(let err_msg_key in err_msg_list) {
                    terminal.sendToTerminal(err_msg_list[err_msg_key], terminal.ERROR_MSG_TYPE);
                }
                discreteAuto.clearErrorMsgs();
            }
        }
    };
    // -----------------------------------------------------------------


    // -------------------------- СЕТТЕРЫ ------------------------------
    this.setData = function(_drawableId, _data) {
        DiagramModel.setData(_drawableId, _data);
    };

    this.setConnectionVariables = function(_connIndex, _inputVariables, _outputVariables) {

        console.log('create_conn_text');
        let connection_text = '';

        let input_count = 0;
        for(let key_name in _inputVariables) {
            connection_text += _inputVariables[key_name] + ', ';
            input_count++;
        }
        if(input_count > 0) connection_text = connection_text.substring(0, connection_text.length - 2); // Удалим последнею запятую после переменной

        let output_vars_text = '';
        let output_count = 0;
        for(let key_name in _outputVariables) {
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
    };

    this.getToolType = function(drawable_id) {
        switch(drawable_id) {
            case 'arrowTool':
                return this.ARROW_TOOL;
            case 'connectTool':
                return this.CONNECT_TOOL;
            case 'saveTool':
                return this.SAVE_TOOL;
            case 'variablesTool':
                return this.INPUT_VARS_TOOL;
            case 'outputsTool':
                return this.OUTPUT_VARS_TOOL;
            case 'playTool':
                return this.PLAY_TOOL;
            case 'enterDataTool':
                return this.ENTER_DATA_TOOL;
            default:
                return -1;
        }
    };
}

// ------------------- Остальные методы ------------------------

var AddDiagram = function(_drawable, _data) {
    //console.log('AddDiagram: ');
    //console.log('_data: ' + _data);
    var cx = _drawable.select('.nodeTitle').attr("x");
    _drawable.select('.nodeTitle').attr({x: cx - 4, text: _data.title});

    if(DiagramModel.getCountDiagrams() === 0) {
        _drawable.select('.nodeStateText').attr({visibility : "visible"});
        DiagramModel.setStartDiagramIndex(0);
    }

    _drawable.click(controller.diagramClicked);

    // Тестим визуализатор графа
    //_drawable.hover(controller.diagramHovered, controller.diagramUnHovered);

    if(DiagramModel.getCountDiagrams() === 0) zero_state_node = _drawable;

    DiagramModel.addData(_drawable, _data);
};

var LoadDiagram = function(_drawable, _data) {
    //console.log('AddDiagram: ');
    //console.log('_data: ' + _data);
    var cx = _drawable.select('.nodeTitle').attr("x");
    _drawable.select('.nodeTitle').attr({x: cx - 4, text: _data.title});

    _drawable.click(controller.diagramClicked);

    if(DiagramModel.getCountDiagrams() === 0) zero_state_node = _drawable;

    DiagramModel.addData(_drawable, _data);
};