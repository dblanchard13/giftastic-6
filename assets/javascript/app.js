/*Variables*/
var topic_list = ["Standard", "Animal", "Technology", "Construction", "Sexy", "Science", "Food", "Kids"];

/*Functions*/
function topicButtons(topic_list) {
	$("#topics").empty();
	for(i=0; i<topic_list.length; i++){
		var failButton = $("<button>");
		failButton.html(topic_list[i])
		failButton.attr("data_fail", topic_list[i]+" fail");
		failButton.attr("data_value", i);
		failButton.attr("class", "btn btn-hover btn-rounded gradient-orange gif-btn mt-2 pt-2");
		$("#topics").prepend($(failButton))
	}

}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

/*Script*/

topicButtons(topic_list);

$("#topic-search").on("click", function(event) {
	if($("topic-input") === null) {
		return
	}
	else {
		var userInput = $("#topic-input").val().trim();
		userInput = toTitleCase(userInput);
		topic_list.push(userInput);
		topicButtons(topic_list)
		}

	})

$(".gif-btn").on("click", function(event){
	event.preventDefault();
	$("#image_container").empty();
	var query = $(this).attr("data_fail");
	var queryURL = "http://api.giphy.com/v1/gifs/search?q=" +
        query + "&api_key=dc6zaTOxFJmzC&limit=12"
    $.ajax({
    	url: queryURL,
    	method: "GET"
    	}).done(function(response) {
    		var results = response.data;
    		console.log(response);
    		var count = 0;
    		for(var i=0; i<results.length/3; i++) {
    			$("#image_container").append($("<div class='row'>"));
    			for(var j=count; j<count+3; j++) {
    				var gifDiv = $("<div class='card card-hoverable col-md-4'>");
    				var rating = results[i].rating;
    				var p = $("<p>").text("Rating: "+rating);
    				var failImage = $("<img>");
    				failImage.attr("src", results[j].images.fixed_width_still.url);
    				gifDiv.append(p);
    				gifDiv.append(failImage);
    				$("#image_container").append(gifDiv)
	   			}
	   			count += 3;
    		}
    	})
});


