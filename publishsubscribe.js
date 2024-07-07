const redis = require('redis');
const Blockchain = require('./blockchain');

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
};

class PubSub {
    constructor({blockchain}) {
        this.blockchain = blockchain;
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

        this.publisher.on('error', (err) => console.error('Redis Publisher Error:', err));
        this.subscriber.on('error', (err) => console.error('Redis Subscriber Error:', err));

        this.subscriber.subscribe(CHANNELS.TEST);
        this.subscriber.subscribe(CHANNELS.BLOCKCHAIN);

        this.subscriber.on('message', (channel, message) => this.handleMessage(channel, message));

        this.publisher.on('ready', () => {
            console.log('Publisher is ready');
        });

        this.subscriber.on('ready', () => {
            console.log('Subscriber is ready');
        });
    }

    handleMessage(channel, message) {
        console.log(`Message received.Channel: ${channel}, Message: ${message}`);
        try {
            const parsedMessage = JSON.parse(message);
            if (channel === CHANNELS.BLOCKCHAIN) {
                this.blockchain.replaceChain(parsedMessage);
            }
        } catch (error) {
            console.error(`Error parsing message: ${message}`);
            console.error(error);
        }
    }

    publish({ channel, message }) {
        if (message === undefined) {
            console.error(`Attempted to publish undefined message to channel: ${channel}`);
            return;
        }

        this.publisher.publish(channel, message, (err, reply) => {
            if (err) {
                console.error('Publish Error:', err);
            } else {
                console.log(`Message published to channel ${channel}: ${reply}`);
            }
        });
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain),
        });
    }
}

// const checkPubSub = new PubSub();

// setTimeout(
//     () => checkPubSub.publisher.publish(CHANNELS.TEST, 'Hello World'), 1000
// );

module.exports = PubSub;




// const redis = require('redis');
// const Blockchain = require('./blockchain');

// const CHANNELS = {
//     TEST: 'TEST',
//     BLOCKCHAIN: 'BLOCKCHAIN',
// };
// class PubSub {
//     constructor(blockchain) {
//         this.blockchain = blockchain;
//         this.publisher = redis.createClient();
//         this.subscriber = redis.createClient();

//         this.subscriber.subscribe(CHANNELS.TEST);
//         this.subscriber.subscribe(CHANNELS.BLOCKCHAIN);

//         this.subscriber.on('message',(channel, message) => this.handleMessage(channel, message));
//     } 
//     handleMessage(channel,message){
//         console.log(`Message received.channel: ${channel} Message:${message}`);
//         const parsedMessage = JSON.parse(message)
//         if(channel === CHANNELS.BLOCKCHAIN){
//             this.blockchain.replaceChain(parsedMessage);

//         }
//     }

//     publish({channel,message}){
//         this.publisher.publish(channel, message, (err, reply) => {
//             if (err) {
//                 console.error(`Error publishing message: ${err}`);
//             } else {
//                 console.log(`Message published to channel: ${channel}. Reply: ${reply}`);
//             }
//         });
//     }
//     broadcastChain(){
//         this.publish({
//             channel: CHANNELS.BLOCKCHAIN,
//             message: JSON.stringify(this.blockchain.chain),
//         });
//     }
// }

// // const checkPubSub = new PubSub();

// // setTimeout(
// //     () => checkPubSub.publisher.publish(CHANNELS.TEST, 'Hello World'),1000
// // );

// module.exports = PubSub;