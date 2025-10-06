# Key learning: 

1: signup(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('name') name: string,
  ) 
2: constructor(private readonly prisma: PrismaService) {}

3: @Global() decorator to make PrismaService globally available

4: pipes for validation and transformation
   parseIntPipe() to convert string to number

5: DTO can user class-validator for validation like @IsEmail(), @IsString(), @MinLength()