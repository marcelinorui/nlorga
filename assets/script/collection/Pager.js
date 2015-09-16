NL.Collection.Pager = NL.Collection.Pager || Backbone.Collection.extend({
	initialize: function (options) {
		this.on('collection:data-fetched', this.updatePager, this);
	},
	parse: function (response) {
		this.trigger('collection:data-fetched', response.pager);
		return response.data;
	},
	changeItemsPerPage: function (itemsPerPage) {
		var self = this;
		this.pager.currentPage = 1;
		this.pager.itemsPerPage = itemsPerPage;
		this.fetch().done(function () { self.trigger('collection:updated', self); });
	},
	goToPage: function (currentPage) {
		var self = this;
		this.pager.currentPage = currentPage;
		this.fetch().done(function () { self.trigger('collection:updated', self); });
	},
	fetch: function (options) {
		options = options || {};
		
		_.extend(options,{data:{
			currentPage: this.pager.currentPage,
			itemsPerPage: this.pager.itemsPerPage
		}});
		
		return Backbone.Collection.prototype.fetch.call(this, options);
	},
	updatePager: function (pager) {
		this.pager = pager;
	}
});