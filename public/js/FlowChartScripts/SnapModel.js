var DiagramModel = {

    id_list: [],
    data: {},
    drawable: {},
    connects: [],
    input_variables: {},
    output_variables: {},
    current_project_name: '',
    current_project_index: -1,
    start_diagram_index: -1,
    end_diagram_index: -1,

    setData: function(_drawableId, _data) {
        //this.data[_drawable.id] = {'title': _data.title, 'content': _data.content};

        //this.data[_drawableId] = {'title': _data.title, 'types': _data.types, 'names': _data.names};
        this.data[_drawableId].title = _data.title;
    },

    setStartDiagramIndex: function(_diagramIndex) {
        this.start_diagram_index = _diagramIndex;
    },

    setEndDiagramIndex: function(_diagramIndex) {
        this.end_diagram_index = _diagramIndex;
    },

    addData: function(_drawable, _data) {
        this.data[_drawable.id] = {'title': _data.title, 'connectsFrom': [], 'connectsTo':[], 'connectsToIndexes':[]};
        this.drawable[_drawable.id] = _drawable;
        this.id_list.push(_drawable.id);
    },

    getDataById: function(_id) {
        return this.data[_id];
    },

    getDataByIndex: function(_index) {
        return this.data[this.id_list[_index]];
    },

    getIndexByDrawableId: function(_drawableId) {
        for(var i=0; i<this.id_list.length; i++) {
            if(this.id_list[i] == _drawableId) {
                return i;
            }
        }
    },

    getAllData: function() {
        return this.data;
    },

    getDrawableById: function(_id) {
        return this.drawable[_id];
    },

    getDrawableByIndex: function(_index) {
        return this.drawable[this.id_list[_index]];
    },

    getNodeTitleByIndex: function(_index) {
        return this.getDataByIndex(_index).title;
    },

    getCountDiagrams: function() {
        return this.id_list.length;
    },

    removeDiagramByIndex: function(_index) {
        this.drawable[this.id_list[_index]].remove();
        this.drawable[this.id_list[_index]] = null;
        this.id_list[_index] = null;
        //this.id_list.splice(_index, 1);
    },

    clearIndexes: function() {
        this.id_list = new Array();
        this.connects = new Array();
        this.data = {};
        this.input_variables = {};
        this.output_variables = {};
    },

    getIndexByTitle: function(_title) {
        for(var i=0; i<this.id_list.length; i++) {
            if(this.data[this.id_list[i]].title == _title) return i;
        }
        return -1;
    },

    getIndexByDiagramId: function(_id) {
        for(var i=0; i<this.id_list.length; i++) {
            if(this.id_list[i] == _id) return i;
        }
        return -1;
    },

    addConnect: function(_fromDrawableId, _toDrawableId, _connection) {
        this.data[_fromDrawableId].connectsTo.push(this.getIndexByDrawableId(_toDrawableId));
        this.data[_toDrawableId].connectsFrom.push(this.getIndexByDrawableId(_fromDrawableId));

        this.connects.push({'connection' : _connection, 'inputVariables' : '', 'outputVariables' : '', 'fromDrawableIndex' : this.getIndexByDiagramId(_fromDrawableId), 'toDrawableIndex' : this.getIndexByDiagramId(_toDrawableId)});
        //this.connects.push({'connection' : _connection});
        this.data[_fromDrawableId].connectsToIndexes.push(this.connects.length-1);
    },

    delConnectByIndex: function(_index) {
        this.connects.splice(_index, 1);
    },

    getConnectDataByIndex: function(_index) {
        return this.connects[_index];
    },

    getConnectsData : function() {
        let connects_data = [];
        for(let key in this.connects) {
            connects_data.push({'inputVariables' : this.connects[key].inputVariables,
                            'outputVariables' : this.connects[key].outputVariables,
                            'fromDrawableIndex' : this.connects[key].fromDrawableIndex,
                            'toDrawableIndex' : this.connects[key].toDrawableIndex});
        }
        return connects_data;
    },

    getConnectByIndex: function(_index) {
        return this.connects[_index].connection;
    },

    getConnectsCount: function() {
        return this.connects.length;
    },

    getConnects: function() {
        return this.connects;
    },

    clearConnects: function() {
        this.connects.splice(0, this.connects.length);
    },

    getStartDiagramIndex: function() {
        return this.start_diagram_index;
    },

    getEndDiagramIndex: function() {
        return this.end_diagram_index;
    },

    // ---------------- INPUT Variables methods --------------------

    addInputVariable: function(name, value) {
        this.input_variables[name] = value;
    },

    setInputVariable: function(key_name, name, value) {
        //console.log('set_input_variable: key_name=' + key_name + ' | name='+name+' | value='+value);
        delete this.input_variables[key_name];
        this.input_variables[name] = value;
    },

    setInputVariablesList: function(input_variables_list) {
        this.input_variables = input_variables_list;
    },

    getInputVariableValue: function(key_name) {
        return this.input_variables[key_name];
    },

    getInputVariables: function() {
        return this.input_variables;
    },

    getInputVariablesCount: function() {
        //return this.input_variables_names.length;
        return Object.keys(this.input_variables).length;
    },

    removeInputVariable: function(key_name) {
        delete this.input_variables[key_name];
    },

    clearInputVariables: function() {
          this.input_variables = {};
    },

    // --------------- OUTPUT Variables methods -------------------

    addOutputVariable: function(name, value) {
        this.output_variables[name] = value;
    },

    setOutputVariable: function(key_name, name, value) {
        delete this.output_variables[key_name];
        this.output_variables[name] = value;
    },

    setOutputVariablesList: function(output_variables_list) {
        this.output_variables = output_variables_list;
    },

    getOutputVariableValue: function(key_name) {
        return this.output_variables[key_name];
    },

    getOutputVariables: function() {
        return this.output_variables;
    },

    getOutputVariablesCount: function() {
        //return this.input_variables_names.length;
        return Object.keys(this.output_variables).length;
    },

    removeOutputVariable: function(key_name) {
        delete this.output_variables[key_name];
    },

    clearOutputVariables: function() {
        this.output_variables = {};
    }
}