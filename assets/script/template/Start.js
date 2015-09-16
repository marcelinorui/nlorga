this.NL.Mixin = this.NL.Mixin || {};
this.NL.Model = this.NL.Model || {};
this.NL.View = this.NL.View || {};
this.NL.Collection = this.NL.Collection || {};
this.NL.Router = this.NL.Router || {};

toastr.options = {
    'closeButton': false,
    'debug': false,
    'newestOnTop': true,
    'progressBar': false,
    'positionClass': 'toast-bottom-full-width',
    'preventDuplicates': false,
    'showDuration': '1000',
    'hideDuration': '1000',
    'timeOut': '5000',
    'extendedTimeOut': '1000',
    'showEasing': 'swing',
    'hideEasing': 'swing',
    'showMethod': 'fadeIn',
    'hideMethod': 'fadeOut'
};

$(function(){	
	$(':checkbox').checkboxpicker();
});