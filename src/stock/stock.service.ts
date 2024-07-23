import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class StockService {
  private readonly API_KEY = process.env.API_KEY;
  private readonly symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN'];

  constructor(private readonly httpService: HttpService) {}

  private async getDailyPrices(symbol: string) {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${this.API_KEY}`;
    console.log('url: ', url);
    const response = await lastValueFrom(this.httpService.get(url));
    return response.data['Time Series (Daily)'];
  }

  async findDailyHigherPriceBySymbol(symbol: string) {
    const data = await this.getDailyPrices(symbol);
    let highestPrice = 0;
    for (const key in data) {
      const closePrice = parseFloat(data[key]['4. close']);
      if (closePrice > highestPrice) {
        highestPrice = closePrice;
      }
    }
    return { symbol, highestPrice };
  }

  async findDailyHighestAveragePrice() {
    const results = await Promise.all(this.symbols.map(symbol => this.getDailyPrices(symbol)));

    let highestAveragePrice = 0;
    let highestSymbol = '';
    results.forEach((data, index) => {
      let total = 0;
      let count = 0;
      for (const key in data) {
        total += parseFloat(data[key]['4. close']);
        count++;
      }
      const averagePrice = total / count;
      if (averagePrice > highestAveragePrice) {
        highestAveragePrice = averagePrice;
        highestSymbol = this.symbols[index];
      }
    });
    return { symbol: highestSymbol, highestAveragePrice };
  }
}