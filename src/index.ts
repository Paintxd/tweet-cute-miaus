import https from 'https';
import stream from 'stream';
import { Image } from './interfaces/image';
import { TwitterClient } from './twitterClient';

const getImageUrl = async (): Promise<string> => {
  let imageUrl: string;
  const options = {
    hostname: 'api.thecatapi.com',
    path: '/v1/images/search?size=full',
    headers: { 'x-api-key': process.env.CAT_API_KEY || 'DEMO-API-KEY' },
  };
  do {
    const resCatApi: Image = await new Promise((resolve, reject) => {
      https
        .get(options, (response) => {
          response.setEncoding('utf8');
          response.on('data', (data: string) => {
            resolve(JSON.parse(data)[0]);
          });
        })
        .on('error', (e) => {
          console.error(e);
          reject(e);
        })
        .end();
    });

    imageUrl = resCatApi.url;
  } while (imageUrl.includes('.gif'));

  return imageUrl;
};

const getImageBuffer = async (imageUrl: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    https
      .request(imageUrl, (response) => {
        const Stream = stream.Transform;
        const data = new Stream();

        response.on('data', (chunk: Buffer) => {
          data.push(chunk);
        });

        response.on('end', () => {
          resolve(data.read());
        });
      })
      .on('error', (e) => {
        console.error(e);
      })
      .end();
  });
};

(async () => {
  const imageUrl = await getImageUrl();
  const imageBuffer = await getImageBuffer(imageUrl);

  const twitterClient = new TwitterClient();
  twitterClient.postMedia(imageBuffer);
})();
