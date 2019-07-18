const TeleBot = require("telebot");
const mtg = require("mtgsdk");
const bot = new TeleBot("774505678:AAE9joL3A9b80Xv5tigE8h_mCiZA9j34sCY");
const rp = require("request-promise");
var cheerio = require("cheerio");
var request = require("request");

function getCardObjectFromURL(url) {
  var card;
  request(url, function(error, response, body) {
    //console.log(error);
    //console.log(response);
    //console.log(body);
    card = JSON.parse(body);
    console.log(card);
  });
  return card;
}
bot.on(/{(.*?)}/, msg => {
  mtg.card
    .where({ name: msg.text.match(/[^{\}]+(?=})/)[0] })

    .then(results => {
      var i;
      var index = results.length - 1;
      for (i = 0; i < results.length; i++) {
        //msg.reply.text(results[i].name);
        if (
          results[i].name.toLowerCase() ==
          msg.text.match(/[^{\}]+(?=})/)[0].toLowerCase()
        ) {
          index = i;
        }
      }
      console.log(results[index].name);
      var url = "https://api.scryfall.com/cards/";
      var setCode = results[index].printings[0].toLowerCase();
      mtg.card
        .where({
          name: msg.text.match(/[^{\}]+(?=})/)[0].toLowerCase(),
          set: setCode
        })
        .then(results => {
          var i;
          var index = results.length - 1;
          for (i = 0; i < results.length; i++) {
            //msg.reply.text(results[i].name);
            if (
              results[i].name.toLowerCase() ==
              msg.text.match(/[^{\}]+(?=})/)[0].toLowerCase()
            ) {
              index = i;
            }
          }
          console.log(results[index].number);
          url += setCode + "/" + results[index].number;
          console.log(url);
          var card = getCardObjectFromURL(url);
          console.log(card);
          //return msg.reply.photo(card.image_uris.png);
        });
    })
    .catch(err => {
      console.log(err);
    });
});

bot.on(/^\/rulings (.+)$/, (msg, props) => {
  const card = props.match[1];
  mtg.card.where({ name: card }).then(results => {
    var rulings = results[results.length - 1].rulings;
    var result = "";
    var i;
    for (i = 0; i < rulings.length; i++) {
      result += rulings[i].date + ": " + rulings[i].text + "\n\n";
    }
    msg.reply.text(result);
  });
});

bot.on(/^\/set (.+)$/, (msg, props) => {
  const card = props.match[1];
  mtg.card
    .where({ name: card })
    .then(results => {
      msg.reply.text(results[results.length - 1].set);
    })
    .catch(err => {
      console.log(err);
    });
});
bot.on(/(show\s)?kitty*/, msg => {
  return msg.reply.photo(
    "https://i.ytimg.com/vi/pID_QuyUi98/maxresdefault.jpg"
  );
});

const INVALID_SETS = [
  "Masters Edition",
  "Masters Edition II",
  "Magic 2010",
  "Commander Theme Decks",
  "Masters Edition III",
  "Magic Online Deck Series",
  "Momir Basic Event Deck",
  "Masters Edition IV",
  "Duel Decks Mirrodin Pure vs New Phyrexia",
  "Vintage Masters",
  "Tempest Remastered",
  "Legendary Cube",
  "Treasure Chests",
  "You Make the Cube"
];
bot.on(/^\/price (.+)$/, (msg, props) => {
  const card = props.match[1];
  mtg.card
    .where({ name: card })
    .then(results => {
      var set = results[results.length - 1].setName;
      var i;
      for (i = 0; i < INVALID_SETS.length; i++) {
        if (INVALID_SETS[i] == set) {
          set = results[results.length - 2].setName;
        }
      }
      var urlSet = set.split(" ").join("-");
      var cardName = results[results.length - 1].name;
      var urlName = cardName.split(" ").join("-");
      var url = "https://shop.tcgplayer.com/magic/" + urlSet + "/" + urlName;
      console.log(url);
      rp(url)
        .then(function(html) {
          var $ = cheerio.load(html);
          msg.reply.text($(".price-point__data").html());
        })
        .catch(err => {
          msg.reply.text(url);
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
});

bot.start();
