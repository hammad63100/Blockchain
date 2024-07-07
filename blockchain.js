const Block = require('./block');
const cryptoHash = require('./crypto-hash');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
        console.log('Genesis block:', this.chain[0]);
    }

    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            prevBlock: this.chain[this.chain.length - 1],
            data
        });
        this.chain.push(newBlock);
        console.log('Added new block:', newBlock);
    }

    replaceChain(chain) {
        console.log('Incoming chain:', chain)
        if (chain.length <= this.chain.length) {
            console.error("The incoming chain must be longer");
            
            return;
        }
        if (!Blockchain.isValidChain(chain)) {
            console.error("The incoming chain is not valid");
            return;
        }
        console.log("Replacing chain with", chain);
        this.chain = chain;
    }

    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }
        for (let i = 1; i < chain.length; i++) {
            const { timestamp, prevHash, hash, nonce, difficulty, data } = chain[i];
            const lastDifficulty = chain[i - 1].difficulty;
            const realLastHash = chain[i - 1].hash;

            if (prevHash !== realLastHash) return false;

            const validatedHash = cryptoHash(timestamp, prevHash, nonce, difficulty, data);
            if (hash !== validatedHash) return false;

            if (lastDifficulty - difficulty > 1) return false;
            if (Math.abs(lastDifficulty - difficulty) > 1) return false;
        }
        return true;
    }
}

const blockchain = new Blockchain();
// blockchain.addBlock({ data: "Block1" });

const result = Blockchain.isValidChain(blockchain.chain);
console.log('Blockchain:', blockchain.chain);
console.log('Is valid chain:', result);

module.exports = Blockchain;
