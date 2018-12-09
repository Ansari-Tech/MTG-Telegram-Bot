const TeleBot = require('telebot');
const mtg = require('mtgsdk')
const bot = new TeleBot('774505678:AAE9joL3A9b80Xv5tigE8h_mCiZA9j34sCY');
bot.on(/{(.*?)}/, (msg) => {
    mtg.card.where({name: msg.text.match(/[^{\}]+(?=})/)[0]})
    .then(results => {
        return msg.reply.photo(results[results.length -1].imageUrl);
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
bot.start();


