/*!
 * jQuery socialFlair - Stackoverflow like User Flairs to showcase your
 * Social Profiles
 * ---------------------------------------------------------------------
 *
 * This is a simple jQuery plugin which lets you embed social flairs
 * into your personal website or blog.
 *
 * Licensed under Mozilla Public License
 *
 * @version        1.0.0
 * @since          2012.05.01
 * @author         Amit Gharat a.k.a. codef0rmer
 * @blog           http://goo.gl/frl5a
 * @twitter        twitter.com/codef0rmer
 *
 * Usage:
 * ---------------------------------------------------------------------
 * Twitter Flair:
 *    $(ele).socialFlair('twitter', 'twitterUsername', {});
 *
 * Github Flair:
 *    $(ele).socialFlair('github', 'githubUsername', {});
 *
 * Facebook Flair:
 *    Create an App and get the details here: https://developers.facebook.com/apps
 *    $(ele).socialFlair('facebook', 'facebookUsername', {clientId : clientId, clientSecret : clientSecrete});
 *
 */
(function($) {
  $.fn.extend({
    socialFlair : function(service, handler, options) {
      var defaults = {

      };
      options = $.extend({}, defaults, options);

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
                  "<a class='sfLink' href='http://twitter.com/#!/" + handler +"'><div class='sfTable sfTwitter'><div class='sfRow'>" +
                  " <div class='sfCell1'>" +
                  "  <img class='sfProfilePic' src='https://api.twitter.com/1/users/profile_image?screen_name=" + handler + "&size=normal' width='48px' height='48px' />" +
                  " </div>"+
                  " <div class='sfCell2'>" +
                  "  <div class='sfHandle'>" + truncateName(handler) + "</div>" +
                  "  <div class='sfFans'>"+
                  " <span class='following' alt='Following' title='Following'>" + following + "</span>" +
                  " <span class='followers' alt='Followers' title='Followers'>" + followers + "</span>" +
                  "  </div>" +
                  "</div>" +
                  "</div></div>​</a>"
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
                "<a class='sfLink' href='" + data.data.html_url +"'><div class='sfTable sfGithub'><div class='sfRow'>" +
                " <div class='sfCell1'>" +
                "  <img class='sfProfilePic' src='" + data.data.avatar_url + "' width='48px' height='48px' />" +
                " </div>" +
                " <div class='sfCell2'>" +
                "  <div class='sfHandle'>" + truncateName(data.data.name || data.data.login) + "</div>" +
                "  <div class='sfFans'>" +
                "   <span class='public_repos' alt='Public Repositories' title='Public Repositories'>" + public_repos + "</span>" +
                "   <span class='followers' alt='Followers' title='Followers'>" + followers + "</span>" +
                 ( data.data.hireable === true ? "<span class='hireable'>Hire Me!</span>" : '' ) +
                "  </div>" +
                "</div>" +
                "</div></div>​</a>"
              );
            }
          });
        } else if (service === 'bitbucket' && handler !== undefined) {
          // BitBucket API
          $.ajax({
            url : 'https://api.bitbucket.org/1.0/users/' + handler + '/followers',
            method : 'get',
            dataType : 'jsonp',
            success : function (data) {
              var followers = data.count;
              $.ajax({
                url : 'https://api.bitbucket.org/1.0/users/' + handler,
                method : 'get',
                dataType : 'jsonp',
                success : function (data) {
                  var public_repos = data.repositories.length;
                  $ele.html(
                    "<a class='sfLink' href='https://bitbucket.org/" + data.user.username +"'><div class='sfTable sfBitbucket'><div class='sfRow'>" +
                    " <div class='sfCell1'>" +
                    "  <img class='sfProfilePic' src='" + data.user.avatar + "' width='48px' height='48px' />" +
                    " </div>" +
                    " <div class='sfCell2'>" +
                    "  <div class='sfHandle'>" + truncateName(data.user.username) + "</div>" +
                    "  <div class='sfFans'>" +
                    "   <span class='public_repos' alt='Public Repositories' title='Public Repositories'>" + public_repos + "</span>" +
                    "   <span class='followers' alt='Followers' title='Followers'>" + followers + "</span>" +
                    "  </div>" +
                    "</div>" +
                    "</div></div>​</a>"
                  );
                }
              });
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
                dataType : 'json',
                success : function (data) {
                  following = data.length;

                  $.ajax({
                    url : 'https://graph.facebook.com/' + handler,
                    method : 'get',
                    dataType : 'json',
                    success : function (data) {
                      $ele.html(
                        "<a class='sfLink' href='" + data.link + "'><div class='sfTable sfFacebook'><div class='sfRow'>" +
                        " <div class='sfCell1'>" +
                        "  <img class='sfProfilePic' src='http://graph.facebook.com/" + handler + "/picture' width='48px' height='48px' />" +
                        " </div>" +
                        " <div class='sfCell2'>" +
                        "  <div class='sfHandle'>" + truncateName(data.name) + "</div>" +
                        "  <div class='sfFans'>" +
                        "   <span class='following' alt='Friends' title='Friends'>" + following + "</span>" +
                        "  </div>" +
                        "</div>" +
                        "</div></div>​</a>"
                      );
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
})(jQuery);

function truncateName(handler) {
  return ( handler.length > 28 ? handler.substring(0, 28) + '...' : handler );
}
