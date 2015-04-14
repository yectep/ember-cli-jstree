import Ember from 'ember';

export default Ember.Controller.extend({
    jstreeActionReceiver: null,
    jstreeSelectedNodes: Ember.A(),
    jstreeObject: null,

    sortedSelectedNodes: Ember.computed.sort('jstreeSelectedNodes', function(a, b) {
        if (a.text > b.text) {
            return 1;
        } else if (a.text < b.text) {
            return -1;
        } else {
            return 0;
        }
    }),

    data: {
        'url' : function (node) {
            return node.id === '#' ? 
                '/ajax_data_roots.json' : 
                '/ajax_data_children.json';
        },
        'data' : function (node) {
            return { 'id' : node.id };
        }
    },

    lastItemClicked: '',
    treeReady: false,


    plugins: "wholerow",
    themes: {
        'name': 'default',
        'responsive': true
    },

    _attachEvents: function() {
        var o = this.get('jstreeObject');
        o.on('select_node.jstree', function(e, data) {
            console.log(data);
        }.bind(this));

        o.on('ready.jstree', function() {
            this.set('treeReady', true);
        }.bind(this));

    }.observes('jstreeObject'),

    actions: {

        handleTreeSelectionDidChange: function(data) {
            var selected = this.get('jsTreeActionReceiver').send('getSelected');
        },

        contextMenuReportClicked: function(node, tree) {
            var self = this;
            this.set('lastItemClicked', '"Report" item for node: <' + node.text + '> was clicked.');
        }
    }
    
});