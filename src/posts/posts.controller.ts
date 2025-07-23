import { Controller, Get, Param, Post as HttpPost, Body, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostService } from './posts.service';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  getAll(@Query('page') page: number = 1) {
    return this.postService.paginate(page);
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.postService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpPost()
  create(@Body() body: { title: string; body: string }, @Request() req) {
    return this.postService.create(body.title, body.body, req.user.userId);
  }
}
