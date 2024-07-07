const hexToBinary = require("hex-to-binary");
const { GENESIS_DATA, MINE_RATE } = require("./config");
const cryptoHash = require("./crypto-hash");


class Block {
    constructor(timestamp, prevHash, hash, data, nonce, difficulty) {
        this.timestamp = timestamp;
        this.prevHash = prevHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    static genesis() {
        const { timestamp, prevHash, hash, data, nonce, difficulty } = GENESIS_DATA;
        return new this(timestamp, prevHash, hash, data, nonce, difficulty);
    }


    static mineBlock({ prevBlock, data }) {
        let hash, timestamp;
        const prevHash = prevBlock.hash;
        let { difficulty } = prevBlock;
        let nonce = 0;
        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({ orignalBlock: prevBlock, timestamp })
            hash = cryptoHash(timestamp, prevHash, data, nonce, difficulty);
        } while (hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty));

        return new this(timestamp, prevHash, hash, data, nonce, difficulty);
    }

    static adjustDifficulty({ orignalBlock, timestamp }) {
        const { difficulty } = orignalBlock;
        if (difficulty < 1) return 1;
        const difference = timestamp - orignalBlock.timestamp;
        if (difference > MINE_RATE) return difficulty - 1;
        return difficulty + 1;

    }

}

module.exports = Block;
// const block1 = new Block("2/09/22", "0x12", "0xacb", "Hello");
// const genesisBlock = Block.genesis();

// console.log(genesisBlock);
//console.log(block1);

// const result = Block.mineBlock(block1,"block2");
// console.log(result);