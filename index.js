var mqttClient = require('mqtt');
var client = mqttClient.createClient(1883, 'www.yizhihe.cn'); 
var getUrl = require('./lib/getUrl');
var child = require('child_process');
var clc = require('cli-color');
var username = "fugreat@126.com";
var password = "fubaiwan";
var player;
var session_url;
client.subscribe('test/weixin/*'); 
client.on('message', function(topic, message){ 
    console.log(topic, message); 
    if(message == 'ANS:停止'){
        if(player) {
        player.kill();
        }
    }
    else if(message == 'ANS:切'){
        if(session_url) {
            session_url.push(session_url.shift());
            player.kill();
            play(session_url);
        }
    }
    else if(message == 'ANS:-'){
        if(player) {
            player.stdin.write('9'); // 减小音量
        }
    }
    else if(message == 'ANS:+'){
        if(player) {
            player.stdin.write('0');//增大音量 
        }
    }
    else if(message == 'ANS:暂停'){
        if(player) {
            player.stdin.write('p');
        }
    }
    else {
        session_url = null;
        getUrl(username, password, message).then(function(urls) {
        session_url = urls.split(' ');
        if(player) {
            player.kill();
        }
        play(session_url);
        });  
    }
});
/**
 * Open the song in the browser
 *
 * @param  {[string]} url
 */
function play(urls) {
    console.log(clc.green('开始播放！'));
    player = child.spawn('mplayer', urls);
    player.stdout.pipe(process.stdout);
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', function(data) {
        player.stdin.write(data.replace('\n', ''));
    })
    process.stdin.resume();
}

