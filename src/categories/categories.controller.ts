import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Le produit a été créé avec succès.',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({ status: 403, description: "Vous n'avez pas l'autorisation" })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Toutes les catégories ont été récupérés avec succès.',
  })
  @ApiResponse({ status: 403, description: "Vous n'avez pas l'autorisation" })
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Get(':id/products')
  findProductsByCategoryId(@Param('id') id: string) {
    return this.categoriesService.findProductsByCategoryId(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatecategorytDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updatecategorytDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
