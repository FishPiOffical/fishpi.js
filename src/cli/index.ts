import FishPi from '..';

async function main() {
  let fish = new FishPi();
  let apiKey = await fish.login({
    username: 'username',
    passwd: 'password123456',
  });
  return apiKey;
}

main().then(console.log).catch(console.error);
