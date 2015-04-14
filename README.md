# ember-cli-jstree

Brings [jsTree](http://www.jstree.com/) functionality into your Ember app.

*Works with ember-cli <= 0.2.1.*

## Installation

Ember CLI addons can be installed with `npm`

	ember install:addon ember-cli-jstree

## Usage

Out of the box, the bare minimum you need on the template is `data`.
Run supported actions on the tree by registering it to your controller with the `actionReceiver` property.

````Handlebars
<div class="sample-tree">
    {{ember-jstree
        selectedNodes=jstreeSelectedNodes
        treeObject=jstreeObject
        data=data
        plugins=plugins
        themes=themes
        checkboxOptions=checkboxOptions
        contextmenuOptions=contextmenuOptions
        stateOptions=stateOptions
        typesOptions=typesOptions
    }}
</div>
````

## Event Handling

You can pass the `treeObject` (component property) to your controller. This property stores the container for
your jsTree.

````Javascript
_attachEvents: function() {
    var o = this.get('jstreeObject');
    o.on('select_node.jstree', function(e, data) {
        console.log(data);
    }.bind(this));
}.observes('jstreeObject')
````

### Selected nodes

Selected nodes are always available through the `selectedNodes` property

## Plugins

Plugins for your tree should be specified by a `plugins` string property. Multiple plugins should be
separated with commas.

````Handlebars
{{ember-jstree
    data=data
    plugins=plugins
}}
````

The following [plugins](http://www.jstree.com/plugins/) are currently supported. More on the way!

* Checkbox
* Contextmenu
* State
* Types
* Wholerow

### Configuring plugins

Send a hash containing the jsTree options through to the addon through the `<plugin name>Options` key.

In your **controller**:

````Javascript
jstreeStateOptionHash: {
    'key': 'ember-cli-jstree-dummy'
},
jstreeMenuOptionHash: {
    "show_at_node": false,
    "items" : {
        "reportClicked": {
            "label": "Report Clicked",
            "action": "contextMenuReportClicked"
        }
    }             
},
plugins: 'state,contextmenu',
actions: {
    jstreeMenuReportClicked: function() {
        this.transitionTo('item.view');
    }
}
````

In **Handlebars**:

````Handlebars
{{ember-jstree
    [...]
    plugins=plugins
    stateOptions=jstreeStateOptionHash
    contextmenuOptions=jstreeMenuOptionHash
    contextMenuReportClicked="jstreeMenuReportClicked"
}}
````

## Sending actions to jsTree

The `treeObject` you map to a controller property of your choice **is** the jsTree container object in the DOM.
You can send actions to it as specified by the API.

````Javascript
actions: {
    toggleNode: function(node) {
        var o = this.get('jstreeObject');
        if (null !== node) {
            o.jstree(true).toggle_node(node);
        }
    }
}

## Demo

Both dynamic (AJAX loaded) and static examples are in the dummy demo.

* Clone this repo: `git clone`
* Install packages: `npm install` then `bower install`
* Run `ember serve`
* Visit the sample app at http://localhost:4200.

