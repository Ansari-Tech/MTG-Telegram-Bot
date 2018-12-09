const TeleBot = require('telebot');
const mtg = require('mtgsdk')
const bot = new TeleBot('774505678:AAE9joL3A9b80Xv5tigE8h_mCiZA9j34sCY');
const rp = require('request-promise');
var cheerio = require('cheerio');


bot.on(/{(.*?)}/, (msg) => {
    mtg.card.where({name: msg.text.match(/[^{\}]+(?=})/)[0]})
    .then(results => {
        return msg.reply.photo(results[results.length -1].imageUrl);
    })
    .catch((err) => {
        console.log(err);
    })
});

bot.on(/^\/rulings (.+)$/, (msg, props) => {
    const card = props.match[1];
    mtg.card.where({name: card})
    .then(results => {
        var rulings = results[results.length -1].rulings
        var result = "";
        var i;
        for(i = 0; i < rulings.length; i++) {
            result += rulings[i].date + ": " + rulings[i].text + "\n\n"
        }
        msg.reply.text(result);
    })

});

bot.on(/^\/set (.+)$/, (msg, props) => {
    const card = props.match[1];
    mtg.card.where({name: card})
    .then(results => {
        msg.reply.text(results[results.length -1].setName);
    })
    .catch((err) => {
        console.log(err);
    })

});
bot.on(/(show\s)?kitty*/, (msg) => {
    return msg.reply.photo('https://i.ytimg.com/vi/pID_QuyUi98/maxresdefault.jpg');
});


bot.on(/^\/price (.+)$/, (msg, props) => {
    const card = props.match[1];
    mtg.card.where({name: card})
    .then(results => {
        var set = results[results.length -1].setName;
        var urlSet = set.split(' ').join('-');
        var cardName = results[results.length -1].name
        var urlName = cardName.split(' ').join('-');
        var url = "https://shop.tcgplayer.com/magic/" + urlSet + "/" + urlName
        rp(url)
        .then(function(html){
            var $ = cheerio.load(html);
            console.log($(".price-point__data").html());
            msg.reply.text($(".price-point__data").html());
        })
        .catch((err) => {
            console.log(err);
        })
        
    })
    .catch((err) => {
        console.log(err);
    })

});

bot.start();


