NL.View.PagedTable = NL.View.PagedTable || Backbone.View.extend({
	bodyTemplate: null,
	footerTemplate: NL.Template['pager-template'],
	events: {
		'click ul.pagination li a': 'pagerClick',
		'change tfoot select': 'itemsPerPageChange'
	},
	initialize: function (options) {
		this.bodyTemplate = options.bodyTemplate;
		this.footerTemplate = options.footerTemplate || this.footerTemplate;
		
		this.collection = new NL.Collection.Pager(options.table.data);
		this.collection.updatePager(options.table.pager);
		this.collection.url = options.url;
		this.$table = this.$el.find('table');
		this.$header = this.$table.find('thead');
		this.$body = this.$table.find('tbody');
		this.$footer = this.$table.find('tfoot');

		this.columns = this.$header.find('th').length;
		this.collection.on('collection:updated', this.render, this);
		this.render(this.collection);
	},
	render: function () {
		this.$body.html('');
		var obj = this.collection.toJSON();
		for (var i = 0; i < obj.length; i++) {
			this.$body.append(this.bodyTemplate(obj[i]));
		}
		this.$footer.html('<tr><td colspan="' + this.columns + '">' + this.footerTemplate(this.collection.pager) + '</td></tr>');
	},
	pagerClick: function (e, self) {
		e.stopPropagation();
		var $click = $(e.currentTarget);
		var pagerData = $click.attr('data-pager');
		if (pagerData) {
			this.collection.goToPage(pagerData);
		}
	},
	itemsPerPageChange: function (e, self) {
		e.stopPropagation();
		this.collection.changeItemsPerPage($(e.currentTarget).find('option:selected').attr('value'));
	}
});