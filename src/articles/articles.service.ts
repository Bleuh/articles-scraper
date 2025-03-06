import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ScrapeArticleDto, QuerySelectorAttr } from './dto/scrape-articles.dto';
import * as cheerio from 'cheerio';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOperator, FindOptionsWhere, Like, Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { FindAllDto } from './dto/find-all.dto';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article) private articleRepository: Repository<Article>,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) { }

  async findAll(findAllDto: FindAllDto) {

    const clone: FindAllDto = { ...findAllDto };
    delete findAllDto.searchLike;
    const cacheKey = JSON.stringify(findAllDto);

    const { searchLike } = clone;

    const cachedArticles = await this.cacheService.get(cacheKey);
    if (cachedArticles) {
      return cachedArticles;
    }

    const query = this.articleRepository
      .createQueryBuilder("article")
      .where("1=1");

    if (findAllDto.source) {
      query.andWhere("article.source = :source", { source: findAllDto.source });
    }

    if (findAllDto.title && !searchLike) {
      query.andWhere("MATCH(article.title) AGAINST (:title IN NATURAL LANGUAGE MODE)", { title: findAllDto.title });
    } else if (findAllDto.title && searchLike) {
      query.andWhere("article.title LIKE :title", { title: `%${findAllDto.title}%` });
    }

    query
      .orderBy("article.publishDate", findAllDto.dateOrder)
      .skip((findAllDto.page - 1) * findAllDto.limit)
      .take(findAllDto.limit);

    const [articles, total] = await query.getManyAndCount();

    if (!searchLike && total === 0) {
      return this.findAll({ ...findAllDto, searchLike: true });
    }

    this.cacheService.set(cacheKey, {
      total,
      page: findAllDto.page,
      limit: findAllDto.limit,
      totalPages: Math.ceil(total / findAllDto.limit),
      cached: true,
      articles,
    });

    return {
      total,
      page: findAllDto.page,
      limit: findAllDto.limit,
      totalPages: Math.ceil(total / findAllDto.limit),
      cached: false,
      articles,
    };
  }

  async saveArticle(articleData: Partial<Article>): Promise<Article> {
    const existingArticle = await this.articleRepository.findOneBy({ title: articleData.title });

    if (existingArticle) {
      throw new ConflictException('Un article avec ce titre existe déjà.');
    }

    const article = this.articleRepository.create(articleData);
    return this.articleRepository.save(article);
  }

  async saveArticles(articlesData: Partial<Article>[]): Promise<Article[]> {
    // Sa serait mieux par bulk insert
    let alreadyExist = 0;
    const articles: Article[] = [];
    for (const article of articlesData) {
      try {
        const inserted = await this.saveArticle(article);
        articles.push(inserted);
      } catch (error) {
        alreadyExist++;
      }
    }
    if (alreadyExist > 0)
      console.log(`Il y a ${alreadyExist} articles qui existent déjà.`);

    return this.articleRepository.save(articles);
  }

  async scrapeArticles(scrapeArticleDto: ScrapeArticleDto): Promise<(Partial<Article>)[]> {
    // Puppeteer ne fonctionne pas sur mon environnement de développement

    const response = await fetch(scrapeArticleDto.url);
    const html = await response.text();

    const $ = cheerio.load(html);

    const articles = $(scrapeArticleDto.container)
      .slice(0, scrapeArticleDto.numberOfArticles)
      .toArray();

    return articles.map((article): Partial<Article> => {
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

      return { title: result.title, link: result.link, source: result.source, publishDate: this.dateFormater(result.publishDate) };
    });
  }

  dateFormater(input: string): Date | null {
    if (!input || input === "") return null;
    const timestampStr = input.split(" ")[1];
    if (!timestampStr) return null;

    return new Date(Number(timestampStr) * 1000);
  }
}
