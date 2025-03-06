import { Entity, PrimaryGeneratedColumn, Column, Unique, Index } from 'typeorm';

@Entity()
@Index("idx_fulltext_title", ["title"], { fulltext: true }) // Index fulltext sur le titre
@Unique(['title'])
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  @Index() // Index sur le lien pour éviter les doublons
  link: string;

  @Column()
  @Index() // Index pour trier les articles par source
  source: string;

  @Column({ type: 'timestamp', nullable: true })
  @Index() // Index pour trier les articles par date
  publishDate: Date | null;
}