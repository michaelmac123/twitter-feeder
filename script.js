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

// Calculate Time from tweet converts from created_date
function parseTwitterDate(tdate) {
  var system_date = new Date(Date.parse(tdate));
  var user_date = new Date();

  var diff = Math.floor((user_date - system_date) / 1000);
  if (diff <= 1) {return "~just now";}
  if (diff < 20) {return "~" + diff + " seconds ago";}
  if (diff < 60) {return "~less than a minute ago";}
  if (diff <= 90) {return "~one minute ago";}
  if (diff <= 3540) {return "~" + Math.round(diff / 60) + " minutes ago";}
  if (diff <= 5400) {return "~ 1 hour ago";}
  if (diff <= 86400) {return "~" + Math.round(diff / 3600) + " hours ago";}
  if (diff <= 129600) {return "~1 day ago";}
  if (diff < 604800) {return "~" + Math.round(diff / 86400) + " days ago";}
  if (diff <= 777600) {return "~1 week ago";}
  return "on " + system_date;
}

// Create div container for widget
function addTwitterFeeder() {
  var el1 = document.createElement("div");
  el1.setAttribute("id", "desktop-sidekick-feeder");
  el1.className = "feeder-widget";

  // Add title content to widget
  var spanEl = '<span>Recent Tweets:</span>';
  el1.innerHTML = '<h5 class="tweet-title">' + spanEl + '</h5>';

  // Get Reference element
  var el2 = document.getElementById("desktop-sidekick-1");

  // Get reference to the parent element
  var parentElement = el2.parentNode;

  parentElement.insertBefore(el1, el2);
}

function addHr() {
  var el1 = document.createElement("hr");
  el1.className = "slot-hr desktop-ad-atf-hr";

  // Get Reference element
  var el2 = document.getElementById("desktop-sidekick-1");

  // Get reference to the parent element
  var parentElement = el2.parentNode;

  parentElement.insertBefore(el1, el2);
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
      $('#desktop-sidekick-feeder').append('<div id="feeder-window"></div>');
      $('#feeder-window').append('<ul class="fed-tweets"></ul>');
      // Loop through list of results
      for (var i = 0; i < feed_count; i++) {
        var userName = itemList[i].user.name;
        var screenName = itemList[i].user.screen_name;
        var today = Date();
        var createdDate = itemList[i].created_at
        var calculateDate = parseTwitterDate(itemList[i].created_at);
        var tweetWas = (today - createdDate);
        var tweetText = itemList[i].text;
        // not very sexy way to build put html on the page.
        var nameSpan = '<span class="tweet-username">'+userName+'</span>';
        var screenSpan = '<span class="tweet-screenname">&#64;'+ screenName + '</span>';
        var textSpan = '<span class="tweet-text">'+ tweetText + '</span>';
        var dateSpan = '<span class="tweet-createddate">'+ calculateDate + '</span>';
        $('#desktop-sidekick-feeder ul').append(
          '<li class="shown-tweet hidden">'+nameSpan+screenSpan+textSpan+dateSpan+'</li>');
      }
      slide('.shown-tweet');
    }
  });
}

function slide(element) {
  // Add prev/next buttons
  $('#desktop-sidekick-feeder').prepend(
    '<button class="control_next"><span></span></button><button class="control_prev"><span></span></button>'
  );

  var $slideElement = $(element);

  var i = 0;

  $(element+':first-child').addClass('active');
  $(element+':first-child').removeClass('hidden');

  $('button.control_next').on('click', function(){
    i = (i + 1) % $slideElement.length;
    $slideElement.removeClass('active').addClass('hidden').eq(i).addClass('active').removeClass('hidden');
  });

  $('button.control_prev').on('click', function(){
    i = (i - 1) % $slideElement.length;
    $slideElement.removeClass('active').addClass('hidden').eq(i).addClass('active').removeClass('hidden');
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
  addTwitterFeeder();
  get_jsonp_feed();
  addHr();
});