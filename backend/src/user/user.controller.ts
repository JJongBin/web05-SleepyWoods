import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { socialPlatform } from './user.enum';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('login')
  loginRedirect(@Query('social') social: socialPlatform, @Res() res: Response) {
    const socialOauthUrl = {
      naver: `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NAVER_OAUTH_CLIENT_ID}&redirect_uri=${process.env.SERVER_URL}/user/callback/naver&state=RANDOM_STATE`,
      kakao: `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_REST_API_KEY}&redirect_uri=${process.env.SERVER_URL}/user/callback/kakao&response_type=code`,
      google: `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/userinfo.profile&response_type=code&redirect_uri=${process.env.SERVER_URL}/user/callback/google&client_id=${process.env.GOOGLE_OAUTH_CLIENT_ID}`,
    };
    res.redirect(socialOauthUrl[social]);
  }

  @Get('callback/:social')
  async socialCallback(
    @Query('code') code: string,
    @Param('social') social: socialPlatform,
    @Res() res: Response
  ) {
    const access_token = await this.userService.socialOauth(social, code);
    const userSocialProfile = await this.userService.socialProfileSearch(
      social,
      access_token
    );
    console.log(userSocialProfile);
    const userData = await this.userService.findUser(
      social,
      userSocialProfile.id
    );

    if (!userData) {
      return res.redirect(process.env.CLIENT_URL + '/signup'); // 가입으로 보내요
    } else {
      return res.redirect(process.env.CLIENT_URL); // 쿠기 생성해서 메인으로 보내요
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
