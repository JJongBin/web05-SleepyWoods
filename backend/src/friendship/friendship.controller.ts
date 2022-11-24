import {
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/auth/user.service';
import { FriendshipService } from './friendship.service';

@Controller('friendship')
@UseGuards(AuthGuard('criticalGuard'))
export class FriendshipController {
  constructor(
    private readonly friendshipService: FriendshipService,
    private readonly userService: UserService
  ) {}

  @Get()
  async getFollowingList(@Req() req: any) {
    const userId = req.user.id;
    const followingList = await this.friendshipService.getFollowingList(userId);
    return followingList.map(following => {
      const { nickname, characterName } = following;
      return { nickname, characterName };
    });
  }

  // PUT friendship 요청
  @Put('/:targetNickname')
  async followFriend(
    @Req() req: any,
    @Param('targetNickname') targetNickname: string
  ) {
    const userId = req.user.id;
    const targetUserId = await this.userService.getUserIdByNickname(
      targetNickname
    );
    await this.friendshipService.followFriend(userId, targetUserId);

    return '팔로우 성공';
  }

  @Delete('/:targetNickname')
  async unfollowFriend(
    @Req() req: any,
    @Param('targetNickname') targetNickname: string
  ) {
    const userId = req.user.id;

    const targetUserId = await this.userService.getUserIdByNickname(
      targetNickname
    );
    await this.friendshipService.unfollowFriend(userId, targetUserId);

    return '팔로우 취소 성공';
  }
}