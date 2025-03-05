import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  findAll() {
    return this.articlesService.findAll();
  }

  @Get("/scrape{/:number}")
  scrapeArticles(@Param('number') number?: number) {
    // Peut-être ajouté à la query / environnement dans le futur.
    // Pour l'instant j'ajoute uniquement le nombre d'articles à scraper.
    return this.articlesService.scrapeArticles({
      url: 'https://news.ycombinator.com/',
      container: '.submission',
      querySelector: {
        title: '.title span.titleline a',
        link: {
          querySelector: '.title .titleline a',
          attr: 'href'
        },
        source: '.title .titleline .sitebit a .sitestr',
        publishDate: {
          querySelector: '.subtext .age',
          attr: 'title'
        }
      },
      includeQuerySelectorOnNextSibling: true,
      numberOfArticles: number ?? 10
    });
  }
}
