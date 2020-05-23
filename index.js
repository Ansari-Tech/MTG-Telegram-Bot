const Slimbot = require('slimbot');
const async = require('async');
var request = require("request");
const bot = new Slimbot('774505678:AAE9joL3A9b80Xv5tigE8h_mCiZA9j34sCY');
// Register listeners



bot.on('message', message => {
  var cardsText = message.text.match(/[^{\}]+(?=})/g);
	console.log(cardsText);
	if(cardsText != null) {
    getCardImages(cardsText, message, function(cardImages, cardPrices) {
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


//bot.on('inline_query', query => {
//	console.log(query);
//});


function getCardObjectFromURL(url, callback) {
	console.log(url);
	request(encodeURI(url), function(error, response, body) {
    return callback(JSON.parse(body));
  });
}

function getCardImages(cardsText, message, callback) {
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
	      
	let errorMsg = "Unable to find a card by the name of " + currCard + ".";
	console.log(errorMsg);
	bot.sendMessage(message.chat.id, errorMsg); 
        callback();
      }
    });
  }, function(err) {return callback(cardImages, cardPrices);});
}
