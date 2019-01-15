import constants from "./constants";

const formatFromWei = (input, precision = 0) => Math.round(parseFloat(input) * Math.pow(10, -18) * Math.pow(10, precision)) / Math.pow(10, precision);

const formatTokenPrice = (input, precision = 0) => parseFloat(parseFloat(input) * Math.pow(10, -18)).toPrecision(precision);

const formatRateToPrice = rate => significantDigits(1 / parseFloat(rate));

const formatCent = tokenPrice => {
  if (tokenPrice < 100) {
    return `${tokenPrice}¢`;
  }
  return `$${tokenPrice}`;
};

const Colors = i => {
  const Palette = [
    // "#ffb6c7",
    // "#ff839b",
    // "#e85b7d",
    "#94d1ff",
    "#4ca9fc",
    "#0968af",
    "#ffed85",
    "#ffe655",
    "#efcc00",
    "#d1b300",
    "#ad9400",
    "#af7000",
    "#d38200",
    "#f28f00",
    "#ffb052",
    "#ffc483",
    "#d585ff",
    "#c455ff",
    "#9d00ef",
    "#8900d1",
    "#7100ad"
  ];
  let greyHex;
  let greyInt;
  if (i > 15) {
    let hex;
    const excess = i - 15;
    for (let j = 0; j < excess; j += 1) {
      greyInt = Math.round((j + 1) * (256 / (excess + 1)));
      greyInt < 16 ? (hex = `0${greyInt.toString(16)}`) : (hex = greyInt.toString(16));
      greyHex = `#${hex}${hex}${hex}`;
      Palette.push(greyHex);
    }
  }
  const colorArray = Palette.splice(0, 6 + i);
  return colorArray;
};

const significantDigits = (number, perc = false, len = 2) => {
  let input = number;
  if (input === 0) return input;
  if (perc) {
    input *= 100;
  }
  let depth;
  if (input >= 1) {
    depth = 2;
  } else {
    depth = len - 1 + Math.ceil(Math.log10(1 / input));
  }
  const shift = Math.pow(10, depth);
  const roundedNum = Math.round(shift * input) / shift;
  return roundedNum;
};

const formatNumberToINRFormat = number => {
  let n1;
  let num;
  num = `${number}` || "";
  n1 = num.split(".");
  const n2 = n1[1] || null;
  n1 = n1[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
  num = n2 ? `${n1}.${n2}` : n1;
  return num;
};

const secondsToDhms = seconds => {
  const secs = Number(seconds) / 1000;
  const y = Math.floor(secs / (3600 * 24 * 365));
  const mo = Math.floor((secs % (3600 * 24 * 365)) / (30 * 24 * 3600));
  const d = Math.floor((secs % (30 * 24 * 3600)) / (24 * 3600));
  const h = Math.floor((secs % (3600 * 24)) / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor((secs % 3600) % 60);

  const yDisplay = y > 0 ? `${y}Y ` : "";
  const moDisplay = mo > 0 ? `${mo}M ` : "";
  const dDisplay = d > 0 ? `${d}D ` : "";
  const hDisplay = h > 0 ? `${h}H ` : "";
  const mDisplay = m > 0 ? `${m}m ` : "";
  const sDisplay = s > 0 ? `${s}s ` : "";

  if (y > 0) {
    return yDisplay + moDisplay + dDisplay;
  }
  if (m > 0) {
    return moDisplay + dDisplay + hDisplay;
  }
  if (d > 0) {
    return dDisplay + hDisplay + mDisplay;
  }
  if (h > 0) {
    return hDisplay + mDisplay + sDisplay;
  }
  if (m > 0) {
    return mDisplay + sDisplay;
  }
  if (s > 0) {
    return sDisplay;
  }
  // return yDisplay + moDisplay + dDisplay + hDisplay + mDisplay;
  return null;
};

const formatMoney = (amount, decimalCount = 2, decimal = ".", thousands = ",") =>
  `$${formatCurrencyNumber(amount, decimalCount, decimal, thousands)}`;

const formatCurrencyNumber = (amount, decimalCount = 2, decimal = ".", thousands = ",") => {
  try {
    let amt = amount;
    let decimals = decimalCount;
    decimals = Math.abs(decimals);
    decimals = isNaN(decimals) ? 2 : decimals;

    const negativeSign = amt < 0 ? "-" : "";

    const i = parseInt((amt = Math.abs(Number(amount) || 0).toFixed(decimals)), 10).toString();
    const j = i.length > 3 ? i.length % 3 : 0;

    return `${negativeSign +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${thousands}`) +
      (decimals
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimals)
            .slice(2)
        : "")}`;
  } catch (e) {
    console.log(e);
  }
  return null;
};

const getSignInStatusText = (signInStatusFlag, isIssuerOfProject) => {
  switch (signInStatusFlag) {
    case 0:
      return constants.METAMASK_NOT_INSTALLED;
    case 1:
      return constants.METAMASK_NOT_SIGNED_IN;
    case 2:
      return constants.METAMASK_WRONG_NETWORK;
    case 3:
      return constants.NOT_VAULT_MEMBER;
    case 4:
      return constants.NOT_VAULT_ISSUER;
    case 5:
      if (!isIssuerOfProject) return constants.NOT_VAULT_ISSUER;
      break;
    default:
      break;
  }
  return constants.FAILED;
};

const getEtherScanHashLink = (txHash, network = null) => {
  const localNetwork = network === null ? "main" : network;
  return network === "main" ? `https://etherscan.io/tx/${txHash}` : `https://${localNetwork}.etherscan.io/tx/${txHash}`;
};

const getEtherScanAddressLink = (address, network = null) => {
  const localNetwork = network === null ? "main" : network;
  return network === "main" ? `https://etherscan.io/address/${address}` : `https://${localNetwork}.etherscan.io/address/${address}`;
};

const bytesToHex = byteArray => {
  const strNum = toHexString(byteArray);
  const num = `0x${strNum}`;
  return num;
};

// eslint-disable-next-line
const toHexString = byteArray => Array.from(byteArray, byte => `0${(byte & 0xff).toString(16)}`.slice(-2)).join("");

export {
  formatFromWei,
  formatMoney,
  formatTokenPrice,
  formatCent,
  secondsToDhms,
  formatCurrencyNumber,
  significantDigits,
  formatNumberToINRFormat,
  Colors,
  getSignInStatusText,
  getEtherScanHashLink,
  getEtherScanAddressLink,
  formatRateToPrice,
  bytesToHex
};
