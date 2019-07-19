const Slimbot = require('slimbot');
const async = require('async');
var request = require("request");
const bot = new Slimbot('774505678:AAE9joL3A9b80Xv5tigE8h_mCiZA9j34sCY');
// Register listeners



bot.on('message', message => {
  var cardsText = message.text.match(/[^{\}]+(?=})/g);
  if(cardsText != null) {
    getCardImages(cardsText, function(cardImages, cardPrices) {
      try {
        var prices = "```\n";
        let i;
        for(i = 0; i < cardPrices.length; i++){
          prices = prices + cardPrices[i] + "\n";
        }
        prices = prices + "```";
        cardImages[0].caption = prices;
        if(cardImages.length > 1) {
          bot.sendMediaGroup(message.chat.id, JSON.stringify(cardImages), {reply_to_message_id: message.id});
        } else {
          bot.sendPhoto(message.chat.id, cardImages[0].media, {reply_to_message_id: message.id});
        }
      }catch (error){
        console.log(error);
      }

    });
  }
});

function getCardObjectFromURL(url, callback) {
  request(url, function(error, response, body) {
    return callback(JSON.parse(body));
  });
}

function getCardImages(cardsText, callback) {
  var cardImages = [];
  var cardPrices = [];
  let i;
  async.forEach(cardsText, function(currCard, callback) {
    let url = 'https://api.scryfall.com/cards/named?fuzzy=' + currCard;
    getCardObjectFromURL(url, function(card) {
      try {
        let cardObj = {
          type: "photo",
          media: card.image_uris.png.substring(0,85),
          caption: "",
          parse_mode: "Markdown"
        }
        cardPrices.push(currCard + ": $" + card.prices.usd);
        cardImages.push(cardObj);
        callback();
      } catch(error) {
        console.log(error);
        callback();
      }
    });
  }, function(err) {return callback(cardImages, cardPrices);});
}
https://img.scryfall.com/cards/png/front/2/5/25f2e4d0-effd-4e83-b7aa-1a0d8f120951.png?1562732870
bot.startPolling();
/** 
bot.on(/{(.*?)}/, msg => {
  var url = 'https://api.scryfall.com/cards/named?fuzzy=' + msg.text.match(regexRemoveBrackets);
  getCardObjectFromURL(url, function(card) {
    try {
      return msg.reply.photo(card.image_uris.png, {asReply: true, caption: "$" + card.prices.usd + " -- normal\n$" + card.prices.usd_foil + " -- foil"});
    } catch(error) {
      console.log(error);
    }
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
bot.on(/(show\s)?kitty*//**, msg => {
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
*/