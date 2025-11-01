# Upcomming Events

Need to implement the upcoming events feature that you see on

https://www.jointheleague.org/coding-programs/tech-club/

The upcoming events feature is implemented in a PHP extension plug-in that is
just reading files from a web service that runs this program:

https://github.com/league-infrastructure/snipserver

Currently, the PHP extension is fetching this URL:

https://snips.jtlapp.net/leaguesync/meetups/the-league-tech-club.html

And inserting the HTML into the current page. Instead, I'd like to have a Javascript program that reads:

https://snips.jtlapp.net/leaguesync/meetups.json

and then generates the events on the page. 