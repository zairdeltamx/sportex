// cryptoPriceService.js
const fetchCryptoPrice = async () => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd'
    );
    const data = await response.json();
    const bnbPrice = data['binancecoin']['usd'];
    return bnbPrice;
  } catch (error) {
    console.error('Error fetching crypto price:', error);
    return null;
  }
};

export default fetchCryptoPrice;
