import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";

@Controller("auth")
@ApiTags("auth")
export class AuthController{
  constructor(private readonly authService: AuthService) {
    
  }

  @Post("signup")
  async signUp(@Body() dto: SignUpDto){
    return this.authService.signUp(dto)
  }

  @Post("signin")
  async signIn(@Body() dto: LoginDto){
    return this.authService.signIn(dto)
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Returns a basic auth check response when JWT is valid.",
    schema: {
      example: { message: "Authenticated" },
    },
  })
  getProfile(){
    return { message: "Authenticated" }
  }
}
