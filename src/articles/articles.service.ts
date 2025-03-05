import { Injectable } from '@nestjs/common';
import { ScrapeArticleDto, QuerySelectorAttr } from './dto/scrape-articles.dto';
import * as cheerio from 'cheerio';

@Injectable()
export class ArticlesService {
  findAll() {
    return `This action returns all articles`;
  }

  async scrapeArticles(scrapeArticleDto: ScrapeArticleDto) {
    // Puppeteer ne fonctionne pas sur mon environnement de développement

    const response = await fetch(scrapeArticleDto.url);
    const html = await response.text();

    const $ = cheerio.load(html);

    const articles = $(scrapeArticleDto.container)
      .slice(0, scrapeArticleDto.numberOfArticles)
      .toArray();

    return articles.map((article) => {
      const nextSibling = $(article.nextSibling?.cloneNode(true));
      const result: Record<keyof ScrapeArticleDto["querySelector"], string> = { title: '', link: '', source: '', publishDate: '' };

      for (const element of Object.keys(result)) {
        if (scrapeArticleDto.querySelector[element] instanceof Object) {
          const { querySelector, attr } = scrapeArticleDto.querySelector[element] as QuerySelectorAttr;
          result[element] = $(article).find(querySelector).attr(attr) || (scrapeArticleDto.includeQuerySelectorOnNextSibling && nextSibling.find(querySelector).attr(attr)) || '';
        } else {
          result[element] = $(article).find(scrapeArticleDto.querySelector[element]).html() || (scrapeArticleDto.includeQuerySelectorOnNextSibling && nextSibling.find(scrapeArticleDto.querySelector[element]).html()) || '';
        }
      }

      return { title: result.title, link: result.link, source: result.source, publishDate: result.publishDate };
    });
  }
}
