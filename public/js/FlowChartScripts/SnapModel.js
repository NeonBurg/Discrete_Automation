var DiagramModel = {

    id_list: [],
    data: {},
    drawable: {},
    typeList: [],
    nameList: [],
    inptFormats: [],
    connects: [],

    setData: function(_drawableId, _data) {
        //this.data[_drawable.id] = {'title': _data.title, 'content': _data.content};

        //this.data[_drawableId] = {'title': _data.title, 'types': _data.types, 'names': _data.names};
        this.data[_drawableId].title = _data.title;
        this.data[_drawableId].types = _data.types;
        this.data[_drawableId].names = _data.names;
        this.data[_drawableId].formats = _data.formats;
    },

    addData: function(_drawable, _data) {
        this.data[_drawable.id] = {'title': _data.title, 'types': _data.types, 'names': _data.names, 'formats': _data.formats, 'connectsFrom': [], 'connectsTo':[], 'connectsToIndexes':[]};
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

    getTypes: function(_id) {
        return this.data[_id].types;
    },

    getNames: function(_id) {
        return this.data[_id].names;
    },

    getFormats: function(_id) {
        return this.data[_id].formats;
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

    getCountInputs: function(_id) {
        return this.data[_id].types.length;
    },

    getIndexByNodeId: function(_nodeId) {
        for(var i=0; i<this.id_list.length; i++) {
            if(this.drawable[this.id_list[i]].select('.to').id == _nodeId
                || this.drawable[this.id_list[i]].select('.from').id == _nodeId) return i;
        }
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
    }
}