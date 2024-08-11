import { dates } from '/utils/dates';

const tickersArr = [];

const generateReportBtn = document.querySelector('.generate-report-btn');

generateReportBtn.addEventListener('click', fetchStockData);

document.getElementById('ticker-input-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const tickerInput = document.getElementById('ticker-input');
  if (tickerInput.value.length > 2) {
    generateReportBtn.disabled = false;
    const newTickerStr = tickerInput.value;
    tickersArr.push(newTickerStr.toUpperCase());
    tickerInput.value = '';
    renderTickers();
  } else {
    const label = document.getElementsByTagName('label')[0];
    label.style.color = 'red';
    label.textContent =
      'You must add at least one ticker. A ticker is a 3 letter or more code for a stock. E.g TSLA for Tesla.';
  }
});

function renderTickers() {
  const tickersDiv = document.querySelector('.ticker-choice-display');
  tickersDiv.innerHTML = '';
  tickersArr.forEach((ticker) => {
    const newTickerSpan = document.createElement('span');
    newTickerSpan.textContent = ticker;
    newTickerSpan.classList.add('ticker');
    tickersDiv.appendChild(newTickerSpan);
  });
}

const loadingArea = document.querySelector('.loading-panel');
const apiMessage = document.getElementById('api-message');

async function fetchStockData() {
  document.querySelector('.action-panel').style.display = 'none';
  loadingArea.style.display = 'flex';
  try {
    const stockData = await Promise.all(
      tickersArr.map(async (ticker) => {
        const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${
          dates.startDate
        }/${dates.endDate}?apiKey=${import.meta.env.VITE_POLYGON_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        const status = await response.status;
        if (status === 200) {
          apiMessage.innerText = 'Creating report...';
          delete data.request_id;
          return JSON.stringify(data);
        } else {
          loadingArea.innerText = 'There was an error fetching stock data.';
        }
      })
    );
    fetchReport(stockData.join(''));
  } catch (err) {
    loadingArea.innerText = 'There was an error fetching stock data.';
    console.error('error: ', err);
  }
}

async function fetchReport(data) {
  try {
    /*
      Challenge:
        1. Make a fetch request to the Worker url:
          - The method should be 'POST'
          - In the headers, the 'Content-Type' should be 'application/json'
          - Set the body of the request to an empty string for now
        2. Parse the response to a JavaScript object and assign it to a const
        3. Log the response to the console to test
    */

    const messages = [
      {
        role: 'system',
        content:
          'You are a trading guru. Given data on share prices over the past 3 days, write a report of no more than 150 words describing the stocks performance and recommending whether to buy, hold or sell. Use the examples provided between ### to set the style your response.',
      },
      {
        role: 'user',
        content: `${data}
                ###
                OK baby, hold on tight! You are going to haate this! Over the past three days, Tesla (TSLA) shares have plummetted. The stock opened at $223.98 and closed at $202.11 on the third day, with some jumping around in the meantime. This is a great time to buy, baby! But not a great time to sell! But I'm not done! Apple (AAPL) stocks have gone stratospheric! This is a seriously hot stock right now. They opened at $166.38 and closed at $182.89 on day three. So all in all, I would hold on to Tesla shares tight if you already have them - they might bounce right back up and head to the stars! They are volatile stock, so expect the unexpected. For APPL stock, how much do you need the money? Sell now and take the profits or hang on and wait for more! If it were me, I would hang on because this stock is on fire right now!!! Apple are throwing a Wall Street party and y'all invited!
                ###
                Apple (AAPL) is the supernova in the stock sky – it shot up from $150.22 to a jaw-dropping $175.36 by the close of day three. We’re talking about a stock that’s hotter than a pepper sprout in a chilli cook-off, and it’s showing no signs of cooling down! If you’re sitting on AAPL stock, you might as well be sitting on the throne of Midas. Hold on to it, ride that rocket, and watch the fireworks, because this baby is just getting warmed up! Then there’s Meta (META), the heartthrob with a penchant for drama. It winked at us with an opening of $142.50, but by the end of the thrill ride, it was at $135.90, leaving us a little lovesick. It’s the wild horse of the stock corral, bucking and kicking, ready for a comeback. META is not for the weak-kneed So, sugar, what’s it going to be? For AAPL, my advice is to stay on that gravy train. As for META, keep your spurs on and be ready for the rally.
                ###
                `,
      },
    ];

    const url = import.meta.env.VITE_CLOUD_FLARE_URL;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    const responseData = await response.json();
    console.log(responseData);

    renderReport(responseData.content);
  } catch (err) {
    console.error('error: ', err.message);
    loadingArea.innerText = 'Unable to access AI. Please refresh and try again';
  }

  /**
   * Challenge:
   * 1. Use the OpenAI API to generate a report advising
   * on whether to buy or sell the shares based on the data
   * that comes in as a parameter.
   *
   * 🎁 See hint.md for help!
   *
   * 🏆 Bonus points: use a try catch to handle errors.
   * **/
}

function renderReport(output) {
  loadingArea.style.display = 'none';
  const outputArea = document.querySelector('.output-panel');
  const report = document.createElement('p');
  outputArea.appendChild(report);
  report.textContent = output;
  outputArea.style.display = 'flex';
}
