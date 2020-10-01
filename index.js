const Slimbot = require('slimbot');
const async = require('async');
var request = require("request");
const bot = new Slimbot('774505678:AAE9joL3A9b80Xv5tigE8h_mCiZA9j34sCY');
// Register listeners

console.log("powered up!");

bot.on('message', message => {
  var cardsText = message.text.match(/[^{\}]+(?=})/g);
  if(cardsText != null) {
    getCardImages(cardsText, function(cardImages, cardPrices) {
      try {
	      if(cardImages[0].error){
		      console.log("error");
		      bot.sendMessage(message.chat.id, cardImages[0].error);
	      } else {

        var prices = "```\n";
        let i;
        for(i = 0; i < cardPrices.length; i++){
          prices = prices + cardPrices[i] + "\n";
        }
        prices = prices + "```";
        cardImages[0].caption = prices;
        if(cardImages.length > 1) {
          try {
		  console.log("sending media group");
		  bot.sendMediaGroup(message.chat.id, JSON.stringify(cardImages), {reply_to_message_id: message.id});
	  }catch(error){
		  console.log("error sending media group");
		  console.log(error);
	  }
        } else {
          try{
		  console.log("sending photo");
		  console.log(cardImages[0]);
		  bot.sendPhoto(message.chat.id, cardImages[0].media, cardImages[0].caption, {reply_to_message_id: message.id} );
	  }catch (error){
		  console.log("error sending photo\n");
		  console.log(error);
	  }
        }
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
	if(card.type == "ambiguous"){
		let cardObj={
			error: "Too ambiguous, be more specific please! tyvm"
			
		}
		cardImages.push(cardObj);
		callback();
	}
		else {

        let cardObj = {
          type: "photo",
          media: card.image_uris.png.split("?")[0],
          caption: "",
          parse_mode: "Markdown"
        }
        cardPrices.push(currCard + ": $" + card.prices.usd);
        cardImages.push(cardObj);
        callback();
		}
      } catch(error) {
        console.log(error);
	console.log(card.type);
        callback();
      }
    });
  }, function(err) {return callback(cardImages, cardPrices);});
}
https://img.scryfall.com/cards/png/front/2/5/25f2e4d0-effd-4e83-b7aa-1a0d8f120951.png?1562732870
bot.startPolling();
