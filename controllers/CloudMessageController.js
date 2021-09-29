const FCM = require('fcm-node');
const serverKey = 'AAAAuzG7AYk:APA91bEticr8-1Zt4PiwIxEwWWTviT7b3Jr0s9mj_picJmmUtz3JavO4KrKzy-B-iVsTfLonScsxwo6k-Uvn3t6O94NICNRmygGFy0Yv-OdFuIbHoCQmHjE_HGHFj8QMrujA5EYSKdJa'; //put your server key here
const fcm = new FCM(serverKey);

//notify user from unread message with firebase
exports.unreadMessage = function (message, FCM_KEY) {

    let payloadOK = {
        to: FCM_KEY,
        data: { //some data object (optional)
            room: message.room
        },
        priority: 'high',
        content_available: true,
        notification: { //notification object
            title: message.from.name, body: message.content, sound: "default", badge: "1"
        }
    };

    return fcm.send(payloadOK, function (err, response) {
        if (err) {
            console.log("Something has gone wrong!" + err);
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
};
