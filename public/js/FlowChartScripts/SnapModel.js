var DiagramModel = {

    id_list: [],
    data: {},
    drawable: {},
    connects: [],
    input_variables: {},
    output_variables: {},

    setData: function(_drawableId, _data) {
        //this.data[_drawable.id] = {'title': _data.title, 'content': _data.content};

        //this.data[_drawableId] = {'title': _data.title, 'types': _data.types, 'names': _data.names};
        this.data[_drawableId].title = _data.title;
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
    },

    addConnect: function(_fromDrawableId, _toDrawableId, _connIndex) {
        this.data[_fromDrawableId].connectsTo.push(this.getIndexByDrawableId(_toDrawableId));
        this.data[_toDrawableId].connectsFrom.push(this.getIndexByDrawableId(_fromDrawableId));
        this.data[_fromDrawableId].connectsToIndexes.push(_connIndex);
    },

    delConnectByIndex: function(_index) {
        this.connects.splice(_index, 1);
    },

    getConnects: function() {
        return this.connects;
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

    // ---------------- INPUT Variables methods --------------------

    addInputVariable: function(name, value) {
        this.input_variables[name] = value;
    },

    setInputVariable: function(key_name, name, value) {
        delete this.input_variables[key_name];
        this.input_variables[name] = value;
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

    // --------------- OUTPUT Variables methods -------------------

    addOutputVariable: function(name, value) {
        this.output_variables[name] = value;
    },

    setOutputVariable: function(key_name, name, value) {
        delete this.output_variables[key_name];
        this.output_variables[name] = value;
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
    }
}