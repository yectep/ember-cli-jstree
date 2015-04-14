/*jshint loopfunc: true */

import Ember from 'ember';
import InboundActions from 'ember-component-inbound-actions/inbound-actions';

/**
    ember-cli-jstree
**/
export default Ember.Component.extend(InboundActions, {
    // Properties for Ember communication
    actionReceiver: null,
    currentNode: null,
    selectedNodes: null,

    // Basic configuration objects
    data: null,
    plugins: null,
    themes: null,
    checkCallback: true,

    // Plugin option objects
    checkboxOptions: null,
    contextmenuOptions: null,
    typesOptions: null,

    selectionDidChange: null,
    treeObject: null,

    didInsertElement: function() {
        var configObject = {};
        var self = this;

        configObject["core"] = {
            "data": this.get('data'),
            "check_callback": this.get('checkCallback')
        };

        var themes = this.get('themes');
        if (themes && typeof themes === "object") {
            configObject["core"]["themes"] = themes;
        }

        var pluginsArray = this.get('plugins');
        if(pluginsArray) {
            pluginsArray = pluginsArray.replace(/ /g, '').split(',');
            configObject["plugins"] = pluginsArray;

            if (pluginsArray.indexOf("contextmenu") !== -1 ||
                pluginsArray.indexOf("dnd") !== -1 ||
                pluginsArray.indexOf("unique") !== -1) {
                // These plugins need core.check_callback
                configObject["core"]["check_callback"] = true;
            }
        }

        var checkboxOptions = this.get('checkboxOptions');
        if(checkboxOptions && pluginsArray.indexOf("checkbox") !== -1) {
            configObject["checkbox"] = checkboxOptions;
        }

        var stateOptions = this.get('stateOptions');
        if(stateOptions && pluginsArray.indexOf("state") !== -1) {
            configObject["checkbox"] = stateOptions;
        }

        var typesOptions = this.get('typesOptions');
        if(typesOptions && pluginsArray.indexOf("types") !== -1) {
            configObject["types"] = typesOptions;
        }

        var contextmenuOptions = this.get('contextmenuOptions');

        // This has eventually got to go. It's terrible.
        if (contextmenuOptions && pluginsArray.indexOf("contextmenu") !== -1) {
            // Remap action hash to functions and don't forget to pass node through
            if (typeof contextmenuOptions["items"] === "object") {
                var newMenuItems = {};
                for (var menuItem in contextmenuOptions["items"]) {
                    if (contextmenuOptions["items"].hasOwnProperty(menuItem)) {
                        // Copy over everything first
                        newMenuItems[menuItem] = contextmenuOptions["items"][menuItem];

                        // Only change it if it's a string. If a function, leave it
                        // This needs to be done so Ember can hijack the action and call it instead
                        if (typeof contextmenuOptions["items"][menuItem]["action"] === "string") {
                            var emberAction = contextmenuOptions["items"][menuItem]["action"];
                            newMenuItems[menuItem]["action"] = function() {
                                Ember.run(self, function() {
                                    var node = this.get('currentNode');
                                    this.send("contextmenuItemDidClick", emberAction, node);
                                });
                            };
                        }
                    }
                }

                // Wrap it up
                contextmenuOptions["items"] = function(node) {
                    Ember.run(self, function() {
                        this.set('currentNode', node);
                    });
                    return newMenuItems;
                };


            }
            
            // Pass options into the config object
            configObject["contextmenu"] = contextmenuOptions;
        }

        var treeObject = this.$().jstree(configObject);

        /**
            Event: changed.jstree
            Action: eventDidChange
            triggered when selection changes
        **/
        treeObject.on('changed.jstree', function (e, data) {
            var selectionChangedEventNames = ["model", "select_node", "deselect_node", "select_all", "deselect_all"];
            if (data.action && selectionChangedEventNames.indexOf(data.action) !== -1) {
                var selNodes = Ember.A(this.get('treeObject').jstree(true).get_selected(true));
                this.set('selectedNodes', selNodes);
            }
        }.bind(this));


        this.set('treeObject', treeObject);
    },

    actions: {
        contextmenuItemDidClick: function(actionName, node) {
            var t = this.get('treeObject');
            if (undefined !== actionName) {
                this.sendAction(actionName, node, t.jstree(true));
            }
        }
    }
});
