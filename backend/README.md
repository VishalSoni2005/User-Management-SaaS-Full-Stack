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

review points

i: service layer not contain req or response
ii: configure methods
iii: CLEAN arch and SOLID principle
iv: user req, res on controller only not on service layer
v"   async signup(dto: Signup, res: Response) {
    this.logger.info(
      `Signup attempt for email: ${dto.email}`,
      AuthService.name,
      'signup',
    );

## Swagger/ OPENAPI documentations: 
used on controllers and dtos mainly

1: IN DTO we only need @ApiProperty() decorator
2: In controllers we can use {
  i:  @ApiOperation()
  ii: @ApiBody()
  iii: @ApiOkResponse()
}

3: 
4: 
