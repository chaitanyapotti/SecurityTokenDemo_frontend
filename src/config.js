module.exports = {
  network: "rinkeby",
  etherPrice: 150,
  api: "https://api-securitytoken.herokuapp.com",
  // api: "http://localhost:2020",
  tokens: {
    RIV: { address: "0xbc803eC37C23C49feca2a65eae88d674e8242F00", price: "10", name: "RIV-A" },
    LMD: { address: "0x9fa1041e8E231D826ee31Ca0DB379dAbF835Ec61", price: "1", name: "LMD-B" }
  },
  ETH: "0x00eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  KyberNetworkProxy: "0xd1C404ff23b0B76F9520ef7730a2d0A4Abd3767d",
  owner: "0x43CE12056AA1E8372ab4aBF0C0cC658D2d41077f",
  ConversionRates: "0x4D99dCa452b1babdfDAC055F484e0586783aC29C",
  withdrawAddress: "0xfEF8a9dB4a79A343A0b9728943C04e712D5C56Ed"
};
