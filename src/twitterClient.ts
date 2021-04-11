import Twitter, { RequestParams } from 'twitter';

export class TwitterClient {
  private client: Twitter;

  constructor() {
    this.client = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });
  }

  postMedia = async (media: Buffer) => {
    this.client.post('media/upload', { media }, async (err, media) => {
      if (!err) {
        const status = {
          status: 'testando 123',
          media_ids: media.media_id_string,
        };
        await this.postTwet(status);
      }
    });
  };

  postTwet = async (status: RequestParams) => {
    this.client.post('statuses/update', status, (err, tweet) => {
      if (!err) {
        console.log(
          `Posted tweet - ${JSON.stringify({
            id: tweet.id,
            created_at: tweet.created_at,
            text: tweet.text,
          })}`,
        );
      }
    });
  };
}
