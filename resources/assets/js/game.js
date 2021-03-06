var new_hint_visible = false;
var map;
var next_clue;

function make_hint_marker(d){
	if( typeof d.index == 'undefined' ) return false;
	var marker = new google.maps.Marker({
		icon: {
			url: d.last ? '/asset/images/chest.png' : '/asset/images/message-bottle-icon.png',
			scaledSize: new google.maps.Size(64, 64)
		},
		map: map,
		position: new google.maps.LatLng(d.lat, d.lng)
	});


	if(typeof(locations[d.id]) != 'undefined'){

		return;
	}
	marker.questions = d.questions;
	marker.index = d.index;
	marker.welcome_text = d.welcome_text;
	marker.clue = d.clue;
	marker.last = d.last;


	marker.addListener('click', function(){
		open_marker(marker);
	});

	return marker;
}

function open_marker(marker){

	$('.modal .modal-body').html('<p>'+marker.welcome_text+'</p>');
	$('.modal').modal('show')
	if(marker.questions.length){
		show_question(marker, 0);
	}
	else {
		if(marker.last){
			$('.modal .action-btn').addClass('hidden');
			$('.modal .action-btn').click(function(){
				opened_clue(marker);
			});
		}
		else {
			show_clue(marker);
		}
	}
}

function opened_clue(marker){
	$('.modal .action-btn').addClass('hidden');

	var last_was_key = false;
	var loaded = false;
	jQuery.each(locations, function(i, v){
		if(loaded) return;
		if(last_was_key){

			loaded = true;
			next_clue = v.clue;
		}
		else if(i == marker.index){
			last_was_key = true;
			return;
		}
	});

	if(!loaded){
		jQuery.get(
			urls.next_clue,
			{lat: marker.getPosition().lat(), lng: marker.getPosition().lng()},
			function(d){
				new_hint_visible = false;
				$('.modal').modal('show').find('.modal-body').html($('<div/>').html(d).text());
			}
		);
	}
	else {
		$('.modal .modal-body').html('').append(next_clue);
		$('.modal .action-btn').addClass('hidden');
	}
}

function show_clue(marker){
	$('.modal .action-btn').removeClass('hidden');
	if(marker.last)
		$('.modal .action-btn').text('Finish');
	else
		$('.modal .action-btn').text('View Next Clue');

	$('.modal .action-btn').unbind('click');
	$('.modal .action-btn').click(function(){
		opened_clue(marker);
	});
}

function opened_question(marker, i){
	$('.modal .modal-body').html('').append('<p>'+marker.questions[i].q+'</p>');
	
	if(marker.questions[i].solved){
		if(marker.questions.length > i + 1){
			show_question(marker, i+1);
		}
		else {
			show_clue(marker);

		}
	}
	else {

		var input = $('<input />').addClass('form-control').attr('type', 'text').appendTo($('.modal .modal-body'));
		$('<div class="alert alert-danger invalid-answer" role="alert">Answer not valid</div>').appendTo('.modal .modal-body').hide();
		
		$('.modal .action-btn').unbind('click');
		
		$('.modal .action-btn').click(function(){
			verify_answer(input.val(), marker, i);
		}).text('Submit');
	}
}

function show_question(marker, i){
	$('.modal .action-btn').removeClass('hidden');
	$('.modal .action-btn').text('Next');

	$('.modal .action-btn').unbind('click');
	$('.modal .action-btn').click(function(){
		opened_question(marker, i);
	});
}

function verify_answer(input, marker, question_index){
	jQuery.getJSON(
		urls.verify_answer,
		{
			qid: marker.questions[question_index].id,
			answer: input
		},
		function(d){
			if(d.success){
				$('.invalid-answer').hide();




				locations[marker.index].questions[question_index].solved = true;


				if( d.next_question ){
					locations[marker.index].questions[question_index+1] =  d.next_question;
					locations[marker.index].questions[question_index+1].solved = false;
					marker = locations[marker.index];
					opened_question(marker, question_index+1);
				}
				else {

					opened_clue(marker);
				}
			}
			else {
				$('.invalid-answer').show();
			}
		});
}

function initMap() {
	$('.pac-container').remove();

	// Specify features and elements to define styles.
	var styleArray=[{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2e5d4"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi","elementType":"labels.text","stylers":[{"hue":"#8100ff"},{"lightness":"64"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"lightness":"59"}]},{"featureType":"poi.park","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c5dac6"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"lightness":20},{"visibility":"on"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"visibility":"on"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"visibility":"on"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"visibility":"on"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#c5c6c6"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e4d7c6"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"}]},{"featureType":"transit.line","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.rail","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"color":"#acbcc9"}]}];
	
	// Create a map object and specify the DOM element for display.
	map = new google.maps.Map(document.getElementById('map'), {
		center: map_center,
		scrollwheel: true,
		// Apply the map style array to the map.
		styles: styleArray,
		zoom: 12
	});

	google.maps.event.trigger(map, 'resize');

	// Create the search box and link it to the UI element.
	var i = document.createElement('input');
	$(i)
		.addClass('controls')
		.attr('type', 'text')
		.attr('id', 'pac-input')
		.attr('placeholder', 'Search...');

	var searchBox = new google.maps.places.SearchBox(i);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(i);


	var searchMarkers = [];
	// Listen for the event fired when the user selects a prediction and retrieve
	// more details for that place.
	searchBox.addListener('places_changed', function() {
		var places = searchBox.getPlaces();

		if (places.length == 0) {
			return;
		}

		// Clear out the old searchMarkers.
		searchMarkers.forEach(function(marker) {
			marker.setMap(null);
		});
		searchMarkers = [];
		new_hint_visible = false;

		// For each place, get the icon, name and location.
		var bounds = new google.maps.LatLngBounds();
		places.forEach(function(place) {
			var icon = {
				url: place.icon,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(25, 25)
			};

			// Create a marker for each place.
			searchMarkers.push(new google.maps.Marker({
				map: map,
				icon: icon,
				title: place.name,
				position: place.geometry.location
			}));

			if (place.geometry.viewport) {
				// Only geocodes have viewport.
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}
		});
		map.fitBounds(bounds);
	});

	// Scan for treasure after changes made to map bounds
	map.addListener('idle', function(){
		if( new_hint_visible ) return;
		var location = {
			top: map.getBounds().getNorthEast().lat(),
			bottom: map.getBounds().getSouthWest().lat(),
			left: map.getBounds().getSouthWest().lng(),
			right: map.getBounds().getNorthEast().lng(),
			zoom: map.getZoom(),
		};

		// Request the server with current viewport to see if the target is in the area
		jQuery.getJSON(urls.location, location, function(d){
			if( typeof d.success == 'undefined' || false == d.success ) return;
			var marker = make_hint_marker(d)
			if( !marker ) return;

			if( typeof locations[marker.index] == 'undefined' ){
				locations[marker.index] = marker;
 				new_hint_visible = true;
 			}
		});



	})
}

jQuery(window).on('load', function(){
	if( 'undefined' != typeof google ){

		initMap();
		jQuery.each(locations, function(index, value){
			locations[index] = make_hint_marker(value);
		});
	}
	if('' != clue){
		$('.modal .modal-body').html('<p>'+clue+'</p>');
		$('.modal').modal('show');
	}
});