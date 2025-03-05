import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) { }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 25,
    @Query('dateOrder') dateOrder: 'ASC' | 'DESC' = 'DESC',
    @Query('source') source?: string,
    @Query('title') title?: string,
  ) {
    return this.articlesService.findAll({
      page: Number(page),
      limit: Number(limit),
      dateOrder,
      source,
      title,
    });
  }

  @Get('/scrape{/:number}')
  async scrapeArticles(@Param('number') number?: number) {
    // Peut-être ajouté à la query / environnement dans le futur.
    // Pour l'instant j'ajoute uniquement le nombre d'articles à scraper.
    const articles = await this.articlesService.scrapeArticles({
      url: 'https://news.ycombinator.com/',
      container: '.submission',
      querySelector: {
        title: '.title span.titleline a',
        link: {
          querySelector: '.title .titleline a',
          attr: 'href',
        },
        source: '.title .titleline .sitebit a .sitestr',
        publishDate: {
          querySelector: '.subtext .age',
          attr: 'title',
        },
      },
      includeQuerySelectorOnNextSibling: true,
      numberOfArticles: number ?? 10,
    });

    return this.articlesService.saveArticles(articles);
  }
}
