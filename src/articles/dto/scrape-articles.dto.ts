export class QuerySelectorAttr {
  querySelector: string;
  attr: string;
}

export class ScrapeArticleDto {
  url: string;
  container: string;
  querySelector: {
    title: string | QuerySelectorAttr;
    link: string | QuerySelectorAttr;
    source: string | QuerySelectorAttr;
    publishDate: string | QuerySelectorAttr;
  };
  includeQuerySelectorOnNextSibling?: boolean;
  numberOfArticles: number;
}
