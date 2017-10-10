// You should try to get in the habit of wrapping your JS code inside document.ready blocks
// or an IIFE (Immediately Invoked Function Expression) so as to prevent your variables from
// implicitly being placed on the global scope. - this is mainly an issue because it becomes
// much more likely that you'll have variable collisions.

/*Variables*/

/*Default list of strings to populate the page on load*/
var topic_list = ["Standard", "Animal", "Technology", "Construction", "Sexy", "Science", "Food", "Kids"];

/*Functions*/
/*Takes a list of strings and created buttons which are appended to the "#topics"
div.*/
function topicButtons(topic_list) {
	$("#topics").empty();
	for(i=0; i<topic_list.length; i++){
		var failButton = $("<button>");
		failButton.html(topic_list[i])
		failButton.attr("data_fail", topic_list[i]+" fail");
		failButton.attr("data_value", i);
		failButton.attr("class", "btn btn-hover btn-rounded gradient-orange gif-btn mt-2 pt-2");
		$("#topics").append($(failButton));
	}

}
/*Takes a string and formats it to title case.*/
function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

/*Script*/

/*Appends list of buttons for predefined failure topics.*/
topicButtons(topic_list);

/*On click, will taking the user input, format to title case, and  append " fail" 
to the string and add it  to the topic_list. The topicButtons function is then 
called.*/

$(document).on('click', '#topic-search', function(event) {
  // This if condition will never be true since the topic-input is
  // in the html on page load and you never remove it. I think you
  // were meaning to check if the user had actually typed some text
  // in the input to prevent blank buttons from being created -
  // and for that case you'd want this if to check if 
  // `$("#topic-input").val().trim()` was a false-y value (eg empty string, null, or undefined).
	if($("topic-input") === null) {
		return
	}
	else {
		var userInput = $("#topic-input").val().trim();
    // I think you'd actually want this preventDefault to run
    //  regardless of the value of topic-input.
		event.preventDefault();

		userInput = toTitleCase(userInput);
		topic_list.push(userInput);
		topicButtons(topic_list)
		}

	})
/*Sets buttons such that on adding a new button or refresh it will clear the 
image-container div, then call the giphy api for a set of 12 images related to the 
topic with the additional keyword "fail" a loop runs creating the cards that will 
display the rating and the still version of the gif. The animated version source 
url is also appended to be used to switch to the animated version on click in a 
separate callback function. The image is appended to the card div and displayed. 
3 card divs are appended to a row before anew row is added to the image-container 
div.*/
$(document).on("click", ".gif-btn", function(event) {
  // You actually don't need to call preventDefault here. The only reason you
  // need it in the handler above is due to that button being the submit action
  // for a form. And form's default submit action causes the page to reload.
	// event.preventDefault();
	$("#image_container").empty();
	var query = $(this).attr("data_fail");
	var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        query + "&api_key=dc6zaTOxFJmzC&limit=12"
    $.ajax({
    	url: queryURL,
    	method: "GET"
    	}).done(function(response) {
    		var results = response.data;
        // Best to keep console.log statements out of your production code.
    		// console.log(response);
    		var count = 0;
    		for(var i=0; i<results.length/3; i++) {
    			$("#image_container").append($("<div class='row'>"));
    			for(var j=count; j<count+3; j++) {
    				var gifDiv = $("<div class='card card-hoverable mr-2 col-md-4'>");
    				var rating = results[i].rating;
    				var p = $("<p>").text("Rating: "+rating);
    				var failImage = $("<img>");
    				failImage.attr("src", results[j].images.fixed_height_still.url);
    				failImage.attr("gif_still", results[j].images.fixed_height_still.url);
    				failImage.attr("gif_animated", results[j].images.fixed_height.url);
    				failImage.attr("state", "still");
    				failImage.attr("class", "gif img-responsive");
    				gifDiv.append(p);
    				gifDiv.append(failImage);
    				$("#image_container").append(gifDiv)
	   			}
	   			count += 3;
    		}
    	})
});
/*Sets the states for the images to switch between still and animated URLs*/
$(document).on("click", ".gif", function(event) {
	var imageState = $(this).attr("state");
	var newState = (imageState === "still") ? "animated" : "still"
	$(this).attr("src", $(this).attr("gif_"+newState))
	$(this).attr("state", newState)

})
