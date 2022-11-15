import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { socialPlatform } from './user.enum';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  test() {
    const api_url =
      'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' +
      process.env.NAVER_OAUTH_CLIENT_ID +
      '&redirect_uri=' +
      'http://localhost:3333/user/callback/naver' +
      '&state=' +
      'RANDOM_STATE';

    return (
      "<a href='" +
      api_url +
      "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>"
    );
  }

  @Get('callback/naver')
  async naverCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response
  ) {
    const access_token = await this.userService.naverOauth(code, state);
    const naverProfile = await this.userService.naverProfileSearch(
      access_token
    );
    const userData = await this.userService.findUser(
      socialPlatform.NAVER,
      naverProfile.id
    );
    if (userData == null) {
      return res.redirect('http://localhost:3333/user'); // 가입으로 보내요
    } else {
      return res.redirect('http://naver.com'); // 쿠기 생성해서 메인으로 보내요
    }
  }

  @Post()
  signUp(@Query('social') social: string, @Body() signupData: object) {
    this.userService.createUser({
      id: signupData['id'],
      nickname: signupData['nickname'],
      character_name: signupData['character_name'],
      email: 'rkd@@',
      social,
    });
  }
}

/**
 * sleepywoods/user post
 */
