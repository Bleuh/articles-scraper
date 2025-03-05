import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModule } from './articles/articles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './articles/entities/article.entity';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql', // nom du service dans le docker-compose.yml, localhost si vous etes en local
      port: 3306,
      username: 'user',
      password: 'password',
      database: 'db',
      entities: [Article],
      synchronize: true,
    }),
    ArticlesModule
  ],
})
export class AppModule {}
