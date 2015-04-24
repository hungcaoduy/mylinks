
var ItemRowTpl = require('./templates/itemRow.jade');
var ItemTableTpl = require('./templates/itemTable.jade');
var LayoutTpl = require('./templates/layout.jade');
var GridTpl = require('./templates/grid.jade');
// var Backgrid = require('backgrid.paginator');
var View = {};
View.Item = Marionette.ItemView.extend({
    template: ItemRowTpl,
    tagName: 'tr',
    triggers: {
    'click td a.js-show': 'item:show',
    'click td a.js-edit': 'item:edit',
    'click button.js-delete': 'item:delete'
    },
    events: {
    'click': 'highlightName'
    },
    highlightName: function(e) {
        this.$el.toggleClass('warning');
    },
    remove: function(){
        var self = this;
        this.$el.fadeOut(function(){
            Marionette.ItemView.prototype.remove.call(self);
        });
    },
    onRender: function() {
        // console.log('rendering childView', this.model);
    },
    serializeData: function() {
        var moment = require('moment');
        var options = require('scripts/common/config/options');
        var data = Backbone.Marionette.ItemView.prototype.serializeData.apply(this, arguments);
        data.effectiveDate = moment.utc(data.effectiveDate).local().format(options.dateFormat);
        return data;
    }
});

View.Items = Marionette.CompositeView.extend({
    // tagName: 'table',
    className: 'table table-hover',
    template: ItemTableTpl,
    childView: View.Item,
    childViewContainer: 'tbody',
    ui: {
        paginator: '.js-paginator'
    },
    initialize: function(options) {
        // this.listenTo('')
    },
    onRenderCollection: function() {
        this.showPaginator(this.collection);
    },
    showPaginator: function(collection) {
        var paginator = new Backgrid.Extension.Paginator({
            collection: collection
        });
        this.ui.paginator.empty();
        if (collection.length>0) {
            this.ui.paginator.append(paginator.render().$el);
        }
    }
});

View.Grid = Marionette.ItemView.extend({
    template: GridTpl,
    ui: {
        paginator: '.js-paginator',
        grid: '.js-grid'
    },
    onRender: function() {
        var columns = [
        {name: 'image', label: 'image', cell: 'string'},
        {name: 'title', label: 'title', cell: 'string'},
        {name: 'description', label: 'description', cell: 'string'}
        ];
        var grid = new Backgrid.Grid({columns: columns, collection: this.collection});

        var paginator = new Backgrid.Extension.Paginator({
            collection: this.collection
        });
        this.ui.paginator.empty();
        this.ui.grid.empty();
        if (this.collection.length>0) {
            this.ui.grid.append(grid.render().$el);
            this.ui.paginator.append(paginator.render().$el);
        }
    }
});

View.Layout = Marionette.LayoutView.extend({
    template: LayoutTpl,
    regions: {
        formRegion: '#form-region',
        panelRegion: '#panel-region',
        listRegion: '#list-region'
    },
    onBeforeShow: function() {
        console.log('layout showing');
    }
});

module.exports = View;
