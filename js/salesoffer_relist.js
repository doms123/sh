$(document).ready(function() {
	TinyDatePicker(document.querySelector('.dateStart'));
	TinyDatePicker(document.querySelector('.dateEnd'));

	var url = $(location).attr('href');

	var segments = url.split( '/' );
	var action = segments[3];
	var id = segments[4];

});