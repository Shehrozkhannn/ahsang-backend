import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { PostService } from './posts/posts.service';
import { PostController } from './posts/posts.controller';

@Module({
  imports: [
     TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',       // Change if using a different host
      port: 5432,              // Default PostgreSQL port
      username: 'postgres',    // Your DB username
      password: '1234',        // Your DB password
      database: 'blog',        // Your DB name
      autoLoadEntities: true,  // Automatically load entity files
      synchronize: true,       // Auto-create tables (DEV ONLY)
    }),
     AuthModule,
     PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
