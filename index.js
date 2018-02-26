const botBuilder = require('claudia-bot-builder');
const rp = require('minimal-request-promise');
const tgTem = botBuilder.telegramTemplate;

module.exports = botBuilder(function (message) {
  if (message.text.includes('location')){
       return new tgTem.Location(44.831115, 20.421277)
        .get();
  }

  if (message.text.includes('pause_works')) {
    return [
	  'Starting our Telegram pause between messages...',
	  new tgTem.Pause(2000).get(),
	  'Pause does work!'
	]
  }
   console.log(message.text);
  if (message.text.includes('streamer_online')) {
     console.log('before our request')
    return rp.get('https://api.twitch.tv/helix/streams?user_login=simalexan', {
	  headers: {
	  "Client-ID": "<YOUR CLIENT ID from TWITCH>"
	  }
	}).then(function(response){
	   console.log(response);
	   let streamBody = JSON.parse(response.body);
	   let isStreamerOnline = streamBody.data && streamBody.data.length > 0;
	   let streamerMessage = isStreamerOnline ? 'Yes it\'s ALIVE!' : 'NO, still dead...';
	   return new tgTem.Text(streamerMessage).get();
	})
  }

  if (message.text.toLowerCase().includes('twitter')){
	 return new tgTem.Text('My Twitter account is https://twitter.com/simalexan').get();
  }

  return new tgTem.Text('Hello, welcome to Simalexan\'s Twitch chatbot! Here\'s what i can help you with:')
    .addInlineKeyboard([
	  [{ text: 'Is Streamer online', callback_data: 'streamer_online'}],
	  [{ text: 'Go to my Twitch Account', url: 'https://twitch.tv/simalexan'  }],
	  [{ text: 'Show me your location', callback_data: 'location'}],
	  [{text: 'Show me how the Telegram pause works', callback_data: 'pause_works'}]
	]).get();
}, { platforms: ['telegram']});
