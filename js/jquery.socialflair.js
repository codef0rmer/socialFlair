(function($) {
  $.fn.extend({
    socialFlair : function(service, handler, options) { 
      var defaults = {

      };             
      var options = $.extend({}, defaults, options);

      return this.each(function() {
        var $ele = $(this), 
            followers = 0, 
            following = 0,
            access_token = null, 
            public_repos = 0;

        // Twitter API
        if (service === 'twitter' && handler !== undefined) {
          $(document).queue("ajaxRequests", function() {
            $.ajax({
              url : 'http://api.twitter.com/1/followers/ids.json?screen_name=' + handler + '&cursor=-1', 
              method : 'get', 
              dataType : 'jsonp', 
              success : function (data) {
                followers = data.ids.length;
              }
            });
          });
          $(document).queue("ajaxRequests", function() {
            $.ajax({
              url : 'https://api.twitter.com/1/friends/ids.json?cursor=-1&screen_name=' + handler, 
              method : 'get', 
              dataType : 'jsonp', 
              success : function (data) {
                following = data.ids.length;
                $ele.html(
                  "<a class='sfLink' href='http://twitter.com/#!/" + handler +"'><div class='sfTable sfTwitter'><div class='sfRow'>"
                  +" <div class='sfCell1'>"
                  +"  <img class='sfProfilePic' src='https://api.twitter.com/1/users/profile_image?screen_name=" + handler + "&size=normal' width='48px' height='48px' />"
                  +" </div>"
                  +" <div class='sfCell2'>"
                  +"  <div class='sfHandle'>" + truncateName(handler) + "</div>"
                  +"  <div class='sfFans'>"
                  +"	 <span class='following' alt='Following' title='Following'>" + following + "</span>"
                  +" 	 <span class='followers' alt='Followers' title='Followers'>" + followers + "</span>"
                  +"  </div>"
                  +"</div>"
                  +"</div></div>​</a>"
                );
              }
            });
          });
          $(document).dequeue("ajaxRequests");
          $(document).dequeue("ajaxRequests");
        } else if (service === 'github' && handler !== undefined) {
          // Github API
          $.ajax({
          url : 'https://api.github.com/users/' + handler, 
            method : 'get', 
            dataType : 'jsonp', 
            success : function (data) {
              followers = data.data.followers;
              public_repos = data.data.public_repos;
              $ele.html(
                "<a class='sfLink' href='" + data.data.html_url +"'><div class='sfTable sfGithub'><div class='sfRow'>"
                +" <div class='sfCell1'>"
                +"  <img class='sfProfilePic' src='" + data.data.avatar_url + "' width='48px' height='48px' />"
                +" </div>"
                +" <div class='sfCell2'>"
                +"  <div class='sfHandle'>" + truncateName(data.data.name) + "</div>"
                +"  <div class='sfFans'>"
                +"	 <span class='public_repos' alt='Public Repositories' title='Public Repositories'>" + public_repos + "</span>"
                +" 	 <span class='followers' alt='Followers' title='Followers'>" + followers + "</span>"
                + ( data.data.hireable === true ? "<span class='hireable'>Hire Me!</span>" : '' ) 
                +"  </div>"
                +"</div>"
                +"</div></div>​</a>"
              );
            }
          });
        } else if (service === 'facebook' && handler !== undefined) {
          // Facebook API
          $.ajax({
            url : 'https://graph.facebook.com/oauth/access_token?client_id=' + options.clientId + '&client_secret=' + options.clientSecret + '&grant_type=client_credentials', 
            method : 'get', 
            dataType : 'text', 
            success : function (data) {
              access_token = data;

              $.ajax({
                url : 'https://api.facebook.com/method/friends.get?uid=' + handler + '&' + access_token + '&format=json', 
                method : 'get', 
                dataType : 'jsonp', 
                success : function (data) {
                  following = data.length;

                  $.ajax({
                    url : 'https://graph.facebook.com/' + handler, 
                    method : 'get', 
                    dataType : 'jsonp', 
                    success : function (data) {
                      $ele.html(
                        "<a class='sfLink' href='" + data.link + "'><div class='sfTable sfFacebook'><div class='sfRow'>"
                        +" <div class='sfCell1'>"
                        +"  <img class='sfProfilePic' src='http://graph.facebook.com/" + handler + "/picture' width='48px' height='48px' />"
                        +" </div>"
                        +" <div class='sfCell2'>"
                        +"  <div class='sfHandle'>" + truncateName(data.name) + "</div>"
                        +"  <div class='sfFans'>"
                        +"	 <span class='following' alt='Friends' title='Friends'>" + following + "</span>"
                        +"  </div>"
                        +"</div>"
                        +"</div></div>​</a>"
                      );
                    }
                  });
                }
              });
            }
          });
        }
      })
    }
  })
})(jQuery);

function truncateName(handler) {
  return ( handler.length > 28 ? handler.substring(0, 28) + '...' : handler );
}
