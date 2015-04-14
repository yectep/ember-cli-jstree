import Ember from 'ember';

export default Ember.Controller.extend({
    jstreeActionReceiver: null,
    jstreeSelectedNodes: Ember.A(),
    jstreeBuffer: null,
    jsonifiedBuffer: '<No output>',

    sortedSelectedNodes: Ember.computed.sort('jstreeSelectedNodes', function(a, b) {
        if (a.text > b.text) {
            return 1;
        } else if (a.text < b.text) {
            return -1;
        } else {
            return 0;
        }
    }),

    data: [
        'Simple root node',
        {
            'id': 'scn',
            'text': 'Single child node',
            'type': 'single-child',
            'children': [
                'one child'
            ]
        },
        {
            'id': 'rn2',
            'text' : 'Root node 2',
            'state' : {
                'opened' : true,
                'selected' : true
            },
            'children' : [
                {
                  'text' : 'Child 1'
                },
                'Child 2'
            ]
        }
    ],

    lastItemClicked: '',
    treeReady: false,

    plugins: "checkbox, wholerow, state, types, contextmenu",
    themes: {
        'name': 'default',
        'responsive': true
    },

    checkboxOptions: {"keep_selected_style" : false},

    stateOptions: {
        'key': 'ember-cli-jstree-dummy'
    },

    typesOptions: {
        'single-child': {
            'max_children': '1'
        }
    },

    contextmenuOptions: {
        "show_at_node": false,
        "items" : {
            "reportClicked": {
                "label": "Report Clicked",
                "action": "contextMenuReportClicked"
            }
        }             
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

    _jsonifyBuffer: function() {
        var b = this.get('jstreeBuffer');

        if (null !== b) {
            this.set('jsonifiedBuffer', JSON.stringify(b));
        } else {
            this.set('jsonifiedBuffer', '<No output>');
        }
    }.observes('jstreeBuffer'),

    actions: {

        toggleNode: function(node) {
            var o = this.get('jstreeObject');
            if (null !== node) {
                o.jstree(true).toggle_node(node);
            }
        },

        refresh: function() {
            this.get('jstreeObject').jstree(true).refresh();
        },

        destroy: function() {
            this.get('jstreeObject').jstree(true).destroy();
        },

        getNode: function(nodeId) {
            this.set('jstreeBuffer', this.get('jstreeObject').jstree(true).get_node(nodeId));
        },

        handleGetNode: function(node) {
            this.set('jstreeBuffer', node);
        },

        contextMenuReportClicked: function(node, tree) {
            var self = this;
            this.set('lastItemClicked', '"Report" item for node: <' + node.text + '> was clicked.');
        },

        addChildByText: function(parentNode, nodeTitle) {
            if (typeof nodeTitle !== 'string') {
                nodeTitle = '';
            }

            var o = this.get('jstreeObject');
            var self = this;
            var newNodeId = o.jstree(true).create_node(parentNode, nodeTitle, 'last', function(newNode) {
                self.set('jstreeBuffer', {
                    'msg': 'Node created',
                    'node': newNode
                });
            });
        }
    }
    
});