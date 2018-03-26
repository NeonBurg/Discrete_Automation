// SnapController.js

function Controller() {

    var dxToolMoved = 0;
    var firstTouch = false;

    // ------------------ Перемещение диаграммы ------------------
    this.moveDiagram = function(dx,dy, x, y) {
        this.attr({
            transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
        });
        if(firstTouch == true) dxToolMoved = dx;
        //console.log('dx = ')
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
        //console.log('x = ' + x + ' | y = ' + y);
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

}

var AddDiagram = function(_drawable, _data) {
    var cx = _drawable.select('.nodeTitle').attr("x");
    _drawable.select('.nodeTitle').attr({x: cx-4, text: _data.title});

    DiagramModel.addData(_drawable, _data);
}