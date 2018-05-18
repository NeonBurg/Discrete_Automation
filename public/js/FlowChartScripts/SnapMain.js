// SnapMain.js

var snap = Snap("#editor");
var controller = new Controller();
var graphVisualizer = new GraphVisualizer();

// ------------- Размеры -------------
var scr_w = document.body.clientWidth;
var scr_h = document.body.clientHeight;

var leftSide_w = 240; // Ширина блока с выбором диаграмм

var cellSize = 20; // Размер клеток сетки
var horLinesAmount = scr_h * 2 / cellSize | 0;
var vertLinesAmount = (scr_w * 2 - leftSide_w) / cellSize | 0;

var toolsPadding = 30;
var rectTool_s = 30;

var menu_title_block_height = 50;
//------------------------------------

// --------- Структуры данных --------
var rectList = [];
// -----------------------------------


var zero_state_node = null;

var modal_form = new ModalForm();


// ---------------- Функции для создания графики -------------------

// Верхний блок меню с выбором инструмента
function createToolsMenuBlock() {
    let menuBlock = snap.rect(leftSide_w + 0.5, 0.5, scr_w - leftSide_w - 1, 40).attr({
        fill: "#d2d2d2",
        strokeWidth: 0.5,
        stroke: "#000"
    });

    let arrow_img = snap.image("/img/arrow.svg", leftSide_w + 10, 5, 30, 30).attr({id: "arrowTool"});

    let connect_img = snap.image("/img/connection.svg", leftSide_w + 60, 5, 30, 30).attr({id: "connectTool"});
    let save_img = snap.image("/img/save.svg", leftSide_w + 110, 5, 30, 30).attr({id: "saveTool"});
    let variables_img = snap.image("/img/variables.svg", leftSide_w + 160, 5, 30, 30).attr({id: "variablesTool"});
    let outputs_img = snap.image("/img/outputs.svg", leftSide_w + 210, 5, 30, 30).attr({id: "outputsTool"});
    let play_img = snap.image("img/play-button.svg", leftSide_w + 260, 5, 30, 30).attr({id: "playTool"});

    arrow_img.click(controller.toolClicked);
    connect_img.click(controller.toolClicked);
    save_img.click(controller.toolClicked);
    variables_img.click(controller.toolClicked);
    outputs_img.click(controller.toolClicked);
    play_img.click(controller.toolClicked);

    arrow_img.hover(controller.toolHovered, controller.toolUnHovered);
    connect_img.hover(controller.toolHovered, controller.toolUnHovered);
    save_img.hover(controller.toolHovered, controller.toolUnHovered);
    variables_img.hover(controller.toolHovered, controller.toolUnHovered);
    outputs_img.hover(controller.toolHovered, controller.toolUnHovered);
    play_img.hover(controller.toolHovered, controller.toolUnHovered);



/*arrow_img.hover(controller.toolHovered);
connect_img.hover(controller.toolHovered);
save_img.hover(controller.toolHovered);
variables_img.hover(controller.toolHovered);
outputs_img.hover(controller.toolHovered);
play_img.hover(controller.toolHovered);*/

controller.chooseTool(0);
}

// Левая сторона со списком инструментов
function createLeftToolsMenu() {
    let leftSideRect = snap.rect(0, 0, leftSide_w, scr_h).attr({fill: "#d2d2d2"});
    let menuBlock = snap.rect(toolsPadding / 2, toolsPadding / 2, leftSide_w - toolsPadding, menu_title_block_height).attr({fill: "#696969"});
    let menuTitle = snap.text(toolsPadding / 2 + 25, toolsPadding / 2 + 30, "Элементы автомата").attr({
        fill: "#ffffff",
        pointerEvents: "none"
    });
}

// Элементы автомата
function createAutomationElement(_elementBefore) {
    let cx = leftSide_w/2;
    let cy = menu_title_block_height+toolsPadding+rectTool_s;

    let graph_node = snap.circle(cx, cy, rectTool_s).attr({
        fill: '#ffffff',
        stroke: '#000',
        strokeWidth: 2,
        id: 'Graph_1',
    }).addClass("nodeCircle");
    let node_text = snap.text(cx-4, cy+4, "a").addClass("nodeTitle");
    let node_state_text = snap.text(cx+rectTool_s, cy+rectTool_s, "start").attr({visibility: "hidden"}).addClass("nodeStateText");

    //console.log('create element ' + DiagramModel.getCountDiagrams() + ': ' + graph_node.id);

    let ngroup = snap.group();
    ngroup.add(graph_node, node_text, node_state_text);
    ngroup.addClass('draggable');
    //ngroup.attr({class: 'draggable'});
    ngroup.drag(controller.moveDiagram, controller.startMoveDiagram, controller.stopMoveDiagram);

    if(_elementBefore) {
        _elementBefore.insertAfter(ngroup);
    }
}

function createAutomationElementAtPos(_xPos, _yPos) {

    let graph_node = snap.circle(_xPos, _yPos, rectTool_s).attr({
        fill: '#ffffff',
        stroke: '#000',
        strokeWidth: 2,
        id: 'Graph_1',
    }).addClass("nodeCircle");
    let node_text = snap.text(_xPos-4, _yPos+4, "a").addClass("nodeTitle");
    let node_state_text = snap.text(_xPos+rectTool_s, _yPos+rectTool_s, "start").attr({visibility: "hidden"}).addClass("nodeStateText");

    //console.log('create element ' + DiagramModel.getCountDiagrams() + ': ' + graph_node.id);

    let ngroup = snap.group();
    ngroup.add(graph_node, node_text, node_state_text);
    ngroup.attr({class: 'draggable'});
    ngroup.drag(controller.moveDiagram, controller.startMoveDiagram, controller.stopMoveDiagram);

    return ngroup;
}

// -----------------------------------------------------------------





// ------------------=============* Отрисовка графики *=============------------------
// Сетка
for (let i = 0; i < horLinesAmount; i++) {
    let y1 = i * cellSize;
    let horLine = snap.line(leftSide_w, y1, scr_w * 2, y1).attr({stroke: "#d2d2d2", strokeWidth: 1});
}
for (let i = 0; i < vertLinesAmount; i++) {
    let x1 = i * cellSize + leftSide_w;
    let vertLine = snap.line(x1, 0, x1, scr_h * 2).attr({stroke: "#d2d2d2", strokeWidth: 1});
}
createToolsMenuBlock();
createLeftToolsMenu();
createAutomationElement();

// Первый элемент блок схем (начало алгоритма)
//createStartAlgoRect();
// Второй элемент блок схем (квадрат)
//createSimpleRect();

// ------------------------------------------------------------------------------------


/*var circle = snap.circle(200, 300, 100).attr({fill:'#ffffff', stroke: '#000'});
var circle2 = snap.circle(300, 400, 100).attr({fill:'#ffffff', stroke: '#000'});

var ngroup2 = snap.group();
ngroup2.add(circle, circle2);

var path = "M" + 50 + "," + 50 + "," + 500 + "," + 500;
//var line = ngroup2.insertAfter(snap.path(path).attr({stroke: '#000', fill: "none"}));
var line = snap.path(path).attr({stroke: '#000', fill: "none"}).insertBefore(circle);*/

