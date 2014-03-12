var mqttClient = require('mqtt');
var client = mqttClient.createClient(1883, 'www.yizhihe.cn'); 
var getUrl = require('./lib/getUrl');
var child = require('child_process');
var clc = require('cli-color');
var username = "fugreat@126.com";
var password = "fubaiwan";

client.subscribe('test/weixin/*'); 
client.on('message', function(topic, message){ 
    console.log(topic, message); 
    getUrl(username, password, message).then(function(urls) {
    play(urls);
    });  
});
/**
 * Open the song in the browser
 *
 * @param  {[string]} url
 */
function play(urls) {
    console.log(clc.green('开始播放！'));
    child.spawn.kill();
    var player = child.spawn('mplayer', urls.split(' '));
    player.stdout.pipe(process.stdout);
    process.stdin.setEncoding('utf8');
    //process.stdin.on('data', function(data) {
    //    player.stdin.write(data.replace('\n', ''));
    //})
    process.stdin.resume();
}

