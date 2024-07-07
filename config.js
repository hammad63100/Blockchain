//const INITIAL_DIFFICULTY = 2;
const MINE_RATE = 1000; //1S = 1000   milli secomd

const GENESIS_DATA = {
    timestamp: 1,
    prevHash: '0x000',
    hash: '0x1234',
    data: [],
    nonce: 0,
    difficulty: 2
}

module.exports = { GENESIS_DATA, MINE_RATE };