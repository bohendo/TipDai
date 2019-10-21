import { EntityRepository, Repository } from 'typeorm';

import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  async getByAddress(address: string): Promise<User> {
    let user = await this.findOne({ where: { address } });
    if (!user) {
      user = new User();
      user.address = address;
      user.balance = '0.00';
      await this.save(user);
      console.log(`Saved new user: ${JSON.stringify(user)}`);
    }
    return user;
  }

  async getByTwitterId(twitterId: string): Promise<User> {
    return this.findOne({ where: { twitterId } });
  }

  async getTwitterUser(twitterId: string, twitterName: string): Promise<User> {
    let user = await this.findOne({ where: { twitterId, twitterName } });
    if (!user) {
      user = new User();
      user.twitterId = twitterId;
      user.twitterName = twitterName;
      user.balance = '0.00';
      await this.save(user);
      console.log(`Saved new user: ${JSON.stringify(user)}`);
    }
    return user;
  }

}
