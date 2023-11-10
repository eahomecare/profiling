const {
  PrismaClient,
} = require('@prisma/client');
const prisma = new PrismaClient();

const newKeywords = {
  sports: [
    'Archery',
    'Air Racing',
    'Athletics',
    'Backstroke',
    'Badminton',
    'Baseball',
    'Basketball',
    'Benchpress',
    'Bicycle Motocross (BMX)',
    'Billiards',
    'Bodybuilding',
    'Bowling',
    'Boxing',
    'Camel Racing',
    'Canoy Slalom',
    'Chess',
    'Cricket',
    'Cycling',
    'Deadlifting',
    'Discus throw',
    'Diving',
    'Drifting',
    'Equestrian',
    'Fencing',
    'Football',
    'MMA',
    'Formula F1 Racing',
    'Gliding',
    'Golf',
    'Gymnastics',
    'Handball',
    'High Jump',
    'Hockey',
    'Horse Racing',
    'Javelin Throw',
    'Judo',
    'Kabaddi',
    'Karate',
    'Long Jump',
    'Marathon',
    'Modern Pentathlon',
    'Netball',
    'Powerlifting',
    'Rugby',
    'Sailing',
    'Shooting',
    'Wrestling',
    'Shot put',
    'Skateboarding',
    'Sport climbing',
    'Surfing',
    'Swimming',
    'Table Tennis',
    'Taekwondo',
    'Tennis',
    'Triple jump',
    'Triathlon',
    'Tug of War',
    'Volleyball',
    'Waterpolo',
    'Weightlifting',
  ],
  travel: [
    'trains',
    'cars',
    'bikes',
    'bullet train',
    'maglev',
    'locomotive',
    'bike rides',
    'maps',
    'borders',
    'internal antional jpurney',
    'breakfast drive',
    'drive',
    'inter state borders',
    'toll',
    'tyre',
    'flights',
    'ships',
    'rain',
    'boat',
    'waterways',
    'getway',
    'cold',
    'flight ticket prices',
    'one way trip',
    'return trip',
    'roadways',
    'railways',
    'pitstops',
    'tour',
    'fuel',
    'tourist spot',
    'journey',
    'food',
    'Restaurants',
    'humid',
    'hot',
    'parents',
    'mountains',
    'beach',
    'cities',
    'villages',
    'towns',
    'rivers',
    'streams',
    'kids',
    'birds',
    'animals',
    'wildlife',
    'safari',
    'sweets',
    'girlfriend',
    'pictures',
    'moments',
    'videos',
    'wife',
    'vlogging',
    'travel duration',
    'weekdays',
    'weekends',
    'friends',
    'family',
  ],
  technology: [
    'smartphone',
    'laptop',
    'AI',
    'cloud computing',
    'big data',
    'IoT',
    'blockchain',
    'virtual reality',
    'augmented reality',
    '5G',
    'quantum computing',
  ],
  gadget: [
    'smartwatch',
    'headphones',
    'VR headset',
    'drone',
    'fitness tracker',
    'smart home devices',
    'gaming console',
  ],
  food: [
    'pizza',
    'sushi',
    'pasta',
    'burger',
    'salad',
    'ice cream',
    'steak',
    'vegan',
    'gluten-free',
    'organic',
  ],
  music: [
    'rock',
    'pop',
    'jazz',
    'classical',
    'hip hop',
    'electronic',
    'country',
    'folk',
    'blues',
    'reggae',
  ],
  fitness: [
    'yoga',
    'pilates',
    'running',
    'weight training',
    'cycling',
    'swimming',
    'hiking',
    'crossfit',
    'aerobics',
    'dance',
  ],
  automobile: [
    'car',
    'motorcycle',
    'electric vehicle',
    'SUV',
    'truck',
    'sedan',
    'coupe',
    'convertible',
    'hybrid',
    'sports car',
  ],
};

async function deleteAllKeywords() {
  await prisma.$transaction(async (prisma) => {
    await prisma.agentSubmitKeywordsMapping.deleteMany(
      {},
    );

    await prisma.keyword.deleteMany({});
  });
  console.log(
    'All existing keywords and their references have been deleted.',
  );
}

async function addNewKeywords() {
  for (const category in newKeywords) {
    for (const value of newKeywords[category]) {
      await prisma.keyword.create({
        data: {
          category,
          value,
          level: 2,
        },
      });
    }
  }
  console.log('New keywords have been added.');
}

async function main() {
  await deleteAllKeywords();
  await addNewKeywords();
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
