// Function to Skip TextNodes and anything else in there (e.g. comments)
function getFirstChild(el){
  var firstChild = el.firstChild;
  while(firstChild != null && firstChild.nodeType == 3){ // skip TextNodes
    firstChild = firstChild.nextSibling;
  }
  return firstChild;
}


// Create div container for widget
function hookUp() {
  var div1 = document.createElement("div");
  div1.setAttribute("id", "desktop-sidekick-feeder");
  div1.className = "feeder-widget";
  div1.innerHTML = '<h5 class="tweet-title">Latest Tweets:</h5>';

  // Get Reference element
  var div2 = document.getElementById("desktop-sidekick-1");

  // Get reference to the parent element
  var parentDiv = div2.parentNode;

  parentDiv.insertBefore(div1, div2);

}

// Don't mess with other window.onload functions
function myPluginLoadEvent(func) {
  // assign any pre-defined functions on 'window.onload' to a variable
  var oldOnLoad = window.onload;
  // if there is not any function hooked to it
  if (typeof window.onload != 'function') {
    // you can hook your function with it
    window.onload = func
  } else { // someone already hooked a function
    window.onload = function () {
      // call the function hooked already
      oldOnLoad();
      func();
    }
  }
}

// Get Json feed
function get_jsonp_feed() {
  // Use URL to return JSON data
  // Set Feed URL
  var feed_url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20FROM%20twitter.search.tweets%20WHERE%20q%3D%22%23Amazon%22%20AND%20lang%3D%22en%22%20AND%20consumer_key%3D%2208ZNcNfdoCgYTzR7qcW1HQ%22%20AND%20consumer_secret%3D%22PTMIdmhxAavwarH3r4aTnVF7iYbX6BRfykNBHIaB8%22%20AND%20access_token%3D%221181240586-JIgvJe4ev3NHdHnAqnovHINWfpo0qB2S2kZtVRI%22%20AND%20access_token_secret%3D%221nodv0LBsi7jS93e38KiW8cHOA5iUc6FT4L6De7kgk%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=?';

  // Set amount of tweets to return
  var feed_count = 15;
  $.ajax({
    url: feed_url,
    type: 'GET',
    dataType: 'jsonp',
    jsonp: 'callback',
    jsonpCallback: 'cbfunc',
    error: function(xhr, status, error) {
      alert(xhr.responseText);
    },
    success: function(data) {
      // We know that the data we want is contained inside statues
      var itemList = data.query.results.json.statuses;
      // Add UL to append li
      $('#desktop-sidekick-feeder').append('<ul class="fed-tweets"></ul>');
      // Loop through list of results
      for (var i = 0; i < feed_count; i++) {
        var screenName = itemList[i].user.screen_name;
        var createdDate = itemList[i].created_at;
        var tweetText = itemList[i].text;
        // not very sexy way to build put html on the page.
        $('#desktop-sidekick-feeder ul').append(
          '<li><span class="tweet-screenname">'+ screenName + '</span><span class="tweet-createddate">'+ createdDate + '</span><span class="tweet-text">'+ tweetText + '</span></li>');
      }
    }
  });
}

function slideWidget() {
  var slideCount = $('#desktop-sidekick-feeder ul li').length;
  var slideWidth = $('#desktop-sidekick-feeder ul li').width();
  var slideHeight = $('#desktop-sidekick-feeder ul li').height();
  var sliderUlWidth = slideCount * slideWidth;

  $('#desktop-sidekick-feeder').prepend(
    '<button class="control_next"></button><button class="control_prev"></button>'
  );

  $('#desktop-sidekick-feeder').css({ width: slideWidth, height: slideHeight });

  $('#desktop-sidekick-feeder ul').css({ width: sliderUlWidth, marginLeft: - slideWidth });

  $('#desktop-sidekick-feeder ul li:last-child').prependTo('#desktop-sidekick-feeder ul');

    function moveLeft() {
        $('#desktop-sidekick-feeder ul').animate({
            left: + slideWidth
        }, 200, function () {
            $('#desktop-sidekick-feeder ul li:last-child').prependTo('#desktop-sidekick-feeder ul');
            $('#desktop-sidekick-feeder ul').css('left', '');
        });
    };

    function moveRight() {
        $('#desktop-sidekick-feeder ul').animate({
            left: - slideWidth
        }, 200, function () {
            $('#desktop-sidekick-feeder ul li:first-child').appendTo('#desktop-sidekick-feeder ul');
            $('#desktop-sidekick-feeder ul').css('left', '');
        });
    };

    $('button.control_prev').click(function () {
        console.log("click prev");
        moveLeft();
    });

    $('button.control_next').click(function () {
        console.log("click next");
        moveRight();
    });

}

// ADD font library
WebFontConfig = {
  google: { families: [ 'Lato:100,300,300italic,500,700:latin' ] }
};

// From fonts.google.com
(function() {
  var wf = document.createElement('script');
  wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
    '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
  wf.type = 'text/javascript';
  wf.async = 'true';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(wf, s);
})();

// pass the function you want to call at 'window.onload', in the function defined above
myPluginLoadEvent(function(){
  console.log("hooked up");
  hookUp();
  get_jsonp_feed();
  slideWidget();
  addSliderControls();
});
