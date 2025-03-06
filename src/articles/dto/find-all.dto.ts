export class FindAllDto {
  page: number = 1;
  limit: number = 10;
  dateOrder: 'ASC' | 'DESC' = 'DESC';
  source?: string;
  title?: string;
  searchLike?: boolean;
}