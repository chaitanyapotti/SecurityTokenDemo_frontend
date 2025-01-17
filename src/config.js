module.exports = {
  network: "rinkeby",
  etherPrice: 150,
  // api: "https://api-securitytoken.herokuapp.com",
  api: "https://api.securitytoken.two12.co",
  // api: "http://localhost:2020",
  tokens: {
    RIV: { address: "0xbc803eC37C23C49feca2a65eae88d674e8242F00", price: "10", name: "RIV-A", reserveType: "REGULAR" },
    LMD: { address: "0x9fa1041e8E231D826ee31Ca0DB379dAbF835Ec61", price: "1", name: "LMD-B", reserveType: "REGULAR" },
    MANA: { address: "0x0F8BBf584Ad0bF63a834A466025098926eA23608", price: "1", name: "LMD-C", reserveType: "AUTOMATED" },
    SNT: { address: "0x46F5dC92B06E7e928a25B635973a5558Dc2d22fA", price: "10", name: "SNT-A", reserveType: "LIT" }
  },
  ETH: "0x00eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  KyberNetworkProxy: "0xd1C404ff23b0B76F9520ef7730a2d0A4Abd3767d",
  owner: "0x43CE12056AA1E8372ab4aBF0C0cC658D2d41077f",
  ConversionRates: "0x4D99dCa452b1babdfDAC055F484e0586783aC29C",
  withdrawAddress: "0xfEF8a9dB4a79A343A0b9728943C04e712D5C56Ed"
};
