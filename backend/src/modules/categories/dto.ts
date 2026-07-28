import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @Matches(/^[a-z0-9][a-z0-9\-_]*$/, {
    message:
      'key must be lowercase and may only contain letters, numbers, hyphens and underscores',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  key: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  value: string;
}

export class UpdateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @Matches(/^[a-z0-9][a-z0-9\-_]*$/, {
    message:
      'key must be lowercase and may only contain letters, numbers, hyphens and underscores',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  key: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  value: string;
}
