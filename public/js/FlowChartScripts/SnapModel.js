var DiagramModel = {

    id_list: [],
    data: {},
    drawable: {},
    connects: [],
    variables_names: [],
    variables_values: [],

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

    addConnect2: function(_fromDrawableId, _toDrawableId, _connIndex) {
        this.data[_fromDrawableId].connectsTo.push(this.getIndexByDrawableId(_toDrawableId));
        this.data[_toDrawableId].connectsFrom.push(this.getIndexByDrawableId(_fromDrawableId));
        this.data[_fromDrawableId].connectsToIndexes.push(_connIndex);
    },

    addConnect: function(_index1, _index2, _type1, _type2) {
        this.connects.push({'firstConn': _index1, 'secondConn': _index2, 'firstNodeType': _type1, 'secondNodeType': _type2});
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

    addVariable: function(name, value) {
        this.variables_names.push(name);
        this.variables_values.push(value);
    },

    getVariablesNames: function() {
        return this.variables_names;
    },

    getVariablesValues: function() {
        return this.variables_values;
    },

    getVariablesCount: function() {
        return this.variables_names.length;
    }
}