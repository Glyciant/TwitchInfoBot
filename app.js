var express = require('express'),
    session = require('express-session'),
    app = express(),
    Discord = require('discord.js'),
    mybot = new Discord.Client(),
    needle = require('needle'),
    swig = require('swig'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    dateFormat = require('dateformat');


// Setup Stuff, for future use.
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/views/static'));
app.use(cookieParser());
app.use(session({secret: 'anything', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('view cache', false);
swig.setDefaults({cache: false});

app.locals = {

};

// Login
mybot.login("EMAIL", "PASSWORD").then(success).catch(err);
function success(token){ console.log("Login Successful!") }
function err(error){ console.log("Login Failed! Arguments: " + arguments) }

// Handle Messages
mybot.on('message', function(message) {
  // Useful Variables
  var sender = message.author,
      content = message.content,
      words = content.split(' '),
      date = new Date(),
    	fulldate = date.toUTCString().slice(0, -4);

  // Logging
  if (sender.id !== "149513636686069760") {
  	console.log("{MESSAGE} [" + fulldate + "] " + sender.username + " (" + sender.id + "): " + message.content)
	}

  // API
  if (words[0] == "!get") {
    if (words[1] == "channel") {
      needle.get("https://api.twitch.tv/kraken/channels/" + words[3], function(error, data) {
        var data = data.body
        if (words[2] == "mature") {
          mybot.reply(message, "API returned: " + data.mature);
          console.log("{RESPONSE} [" + fulldate + "] " + sender.username + " (" + sender.id + "): API/Channels/Mature Response Sent")
        }
        if (words[2] == "title" || words[2] == "status") {
          mybot.reply(message, "API returned: " + data.status);
          console.log("{RESPONSE} [" + fulldate + "] " + sender.username + " (" + sender.id + "): API/Channels/Title Response Sent")
        }
        if (words[2] == "type") {
          mybot.reply(message, "API returned: " + data.game);
          console.log("{RESPONSE} [" + fulldate + "] " + sender.username + " (" + sender.id + "): API/Channels/Type Response Sent")
        }
        if (words[2] == "followers") {
          mybot.reply(message, "API returned: " + data.followers);
          console.log("{RESPONSE} [" + fulldate + "] " + sender.username + " (" + sender.id + "): API/Channels/Followers Response Sent")
        }
        if (words[2] == "views") {
          mybot.reply(message, "API returned: " + data.views);
          console.log("{RESPONSE} [" + fulldate + "] " + sender.username + " (" + sender.id + "): API/Channels/Views Response Sent")
        }
        if (words[2] == "id") {
          mybot.reply(message, "API returned: " + data._id);
          console.log("{RESPONSE} [" + fulldate + "] " + sender.username + " (" + sender.id + "): API/Channels/ID Response Sent")
        }
        if (words[2] == "created") {
          mybot.reply(message, "API returned: " + dateFormat(data.created_at, "dddd, mmmm dS, yyyy, h:MM:ss TT"));
          console.log("{RESPONSE} [" + fulldate + "] " + sender.username + " (" + sender.id + "): API/Channels/Created Response Sent")
        }
        if (words[2] == "partner") {
          mybot.reply(message, "API returned: " + data.partner);
          console.log("{RESPONSE} [" + fulldate + "] " + sender.username + " (" + sender.id + "): API/Channels/Partner Response Sent")
        }
        if (words[2] == "logo") {
          mybot.reply(message, "API returned: " + data.logo);
          console.log("{RESPONSE} [" + fulldate + "] " + sender.username + " (" + sender.id + "): API/Channels/Logo Response Sent")
        }
        if (words[2] == "banner") {
          mybot.reply(message, "API returned: " + data.profile_banner);
          console.log("{RESPONSE} [" + fulldate + "] " + sender.username + " (" + sender.id + "): API/Channels/Banner Response Sent")
        }
        if (words[2] == "offline") {
          mybot.reply(message, "API returned: " + data.video_banner);
          console.log("{RESPONSE} [" + fulldate + "] " + sender.username + " (" + sender.id + "): API/Channels/Offline Response Sent")
        }
      })
    }
    if (words[1] == "user") {
      needle.get("https://api.twitch.tv/kraken/users/" + words[3], function(error, data) {
        if (words[2] == "type") {
          mybot.reply(message, "API returned: " + data.type);
          console.log("{RESPONSE} [" + fulldate + "] " + sender.username + " (" + sender.id + "): API/User/Type Response Sent")
        }
        if (words[2] == "bio") {
          mybot.reply(message, "API returned: " + data.bio);
          console.log("{RESPONSE} [" + fulldate + "] " + sender.username + " (" + sender.id + "): API/User/Bio Response Sent")
        }
      })
    }
  }
  // Ping
  if(words[0] == "ping") {
    mybot.reply(message, "pong");
		console.log("{RESPONSE} [" + fulldate + "] " + sender.username + " (" + sender.id + "): Pong Response Sent")
	}
  // Roulette
  if(words[0] == "!roulette") {
    var roulette = Math.floor(Math.random() * 3) + 1
    if (roulette == 1) {
      mybot.deleteMessage(message);
      mybot.reply(message, "BANG! You've been shot :(");
      console.log("{ROULETTE} [" + fulldate + "] " + sender.username + " (" + sender.id + "): Shot")
    }
    else {
      mybot.reply(message, "Silence. You live to tell your story.");
      console.log("{ROULETTE} [" + fulldate + "] " + sender.username + " (" + sender.id + "): Alive")
    }
  }
  // Love
  if (words[0] == "!love") {
		var love = Math.floor(Math.random() * 100) + 0
		mybot.reply(message, "There is " + love + "% love between " + words[1] + " and " + sender + " <3")
		console.log("{LOVE} [" + fulldate + "] " + sender.username + " (" + sender.id + "): " + love + "% with " + words[1])
	}
  // 8Ball
  if (words[0] == "!8ball") {
		var answer = Math.floor(Math.random() * 24) + 1
		if (answer == 1) { mybot.reply(message, "Yes!")}
		if (answer == 2) { mybot.reply(message, "No!")}
		if (answer == 3) { mybot.reply(message, "Huh? I... wasn't listening. :P")}
		if (answer == 4) { mybot.reply(message, "I could answer that, but I'd have to ban you forever.")}
		if (answer == 5) { mybot.reply(message, "The answer is unclear. Trust me, I double checked.")}
		if (answer == 6) { mybot.reply(message, "YesNoYesNoYesNoYesNoYesNoYesNoYesNo :P")}
		if (answer == 7) { mybot.reply(message, "So, you do think I'm clever?") }
		if (answer == 8) { mybot.reply(message, "It's a coin flip really... :\\ ")}
		if (answer == 9) { mybot.reply(message, "Today, it's a yes. Tommorow, it will be a no.")}
		if (answer == 10) { mybot.reply(message, "Maybe!")}
		if (answer == 11) { mybot.reply(message, "Leave it with me.") }
		if (answer == 12) { mybot.reply(message, "Ask the question to the nearest mirror three times, and the answer will appear.") }
		if (answer == 13) { mybot.reply(message, "Your answer has been posted and should arrive within the next 7 days.") }
		if (answer == 14) { mybot.reply(message, "Deal or no deal?") }
		if (answer == 15) { mybot.reply(message, "Probably not, sorry bud.") }
		if (answer == 16) { mybot.reply(message, "An answer to that question will cost £5. Are you paying by cash or card?") }
		if (answer == 17) { mybot.reply(message, "Ask again later.") }
		if (answer == 18) { mybot.reply(message, "Are you sure you'd like to know that answer? I don't think you are.") }
		if (answer == 19) { mybot.reply(message, "I doubt that.") }
		if (answer == 20) { mybot.reply(message, "Sure thing! I think...") }
		if (answer == 21) { mybot.reply(message, "Yes, the outlook is good.") }
		if (answer == 22) { mybot.reply(message, "I forgot the question, please repeat it.") }
		if (answer == 23) { mybot.reply(message, "I don't see why not.") }
		if (answer == 24) { mybot.reply(message, "Why would you ask that?") }
		console.log("{8Ball} [" + fulldate + "] " + sender.username + " (" + sender.id + "): Response" + answer + "sent.")
	}
  // Uptime
  if (words[0] == "!uptime") {
    mybot.reply(message, "TwitchInfoBot has been running for: " + mybot.uptime + " milliseconds.");
    console.log("{RESPONSE} [" + fulldate + "] " + sender.username + " (" + sender.id + "): Uptime Sent")
  }
  // Discord IDs
  if (words[0] == "!id") {
        mybot.reply(message, "Your ID is: " + sender.id);
				console.log("{RESPONSE} [" + fulldate + "] " + sender.username + " (" + sender.id + "): ID Sent")
	}
  // Introduction and Commands
  if (words[0] == "!twitchinfobot") {
    if (words[1] == "commands") {
      mybot.reply(message, "TwitchInfoBot Commands: https://docs.google.com/spreadsheets/d/1EjFa6aAuJYp31PeGd83C9HyvQpIzTXZ94RbQNtWvrSI/edit#gid=0")
      console.log("{RESPONSE} [" + fulldate + "] " + sender.username + " (" + sender.id + "): Commands Sent")
    }
    else {
      mybot.reply(message, "Hello! I'm TwitchInfoBot, a Discord bot that integrates the Twitch API and popular bot features. Type '!twitchinfobot commands' to get started.")
      console.log("{RESPONSE} [" + fulldate + "] " + sender.username + " (" + sender.id + "): Introduction Sent")
    }
  }
  // Invite System
  if (words[0] == "!invite") {
    if (message.channel.recipient !== undefined) {
      mybot.joinServer(words[1])
      mybot.reply(message, "Joined Server!")
      console.log("{JOIN} [" + fulldate + "] " + sender.username + " (" + sender.id + "): Joined Link: " + words[1])
    }
  }
})
