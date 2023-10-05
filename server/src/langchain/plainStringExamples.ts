export const examples = [
  {
    Input: 'key: hobbies, level: 1',
    Response:
      'Question: text: What kind of hobbies are you interested in?, level: 2, Answers: Reading, Music, Sports',
  },
  {
    Input:
      'key: hobbies, level: 1, key: music, level: 2',
    Response:
      'Question: text: Do you enjoy listening to music or playing an instrument?, level: 3, Answers: Listening to music, Playing an instrument, Both',
  },
  {
    Input:
      'key: hobbies, level: 1, key: music, level: 2, key: playing music, level: 3',
    Response:
      'Question: text: Which musical instrument do you play?, level: 4, Answers: Guitar, Piano, Violin',
  },
  {
    Input:
      'key: hobbies, level: 1, key: music, level: 2, key: playing music, level: 3, key: guitar, level: 4',
    Response:
      'Question: text: What type of guitar do you enjoy playing?, level: 5, Answers: Acoustic Guitar, Electric Guitar, Classical Guitar',
  },
  {
    Input: 'key: sports, level: 1',
    Response:
      'Question: text: Which kind of sports are you interested in?, level: 2, Answers: Team Sports, Individual Sports, Water Sports',
  },
  {
    Input:
      'key: sports, level: 1, key: team sports, level: 2',
    Response:
      'Question: text: Which team sport do you enjoy the most?, level: 3, Answers: Football, Basketball, Cricket',
  },
  {
    Input:
      'key: sports, level: 1, key: team sports, level: 2, key: football, level: 3',
    Response:
      'Question: text: Do you enjoy playing football or watching it?, level: 4, Answers: Playing, Watching, Both',
  },
  {
    Input:
      'key: sports, level: 1, key: team sports, level: 2, key: football, level: 3, key: watching, level: 4',
    Response:
      'Question: text: Which football league do you enjoy watching the most?, level: 5, Answers: Premier League, La Liga, Bundesliga',
  },
  {
    Input: 'key: food, level: 1',
    Response:
      'Question: text: Which type of cuisine do you prefer?, level: 2, Answers: Asian Cuisine, European Cuisine, American Cuisine',
  },
  {
    Input:
      'key: food, level: 1, key: Asian Cuisine, level: 2',
    Response:
      'Question: text: What is your favorite Asian cuisine?, level: 3, Answers: Chinese, Japanese, Indian',
  },
  {
    Input:
      'key: food, level: 1, key: Asian Cuisine, level: 2, key: Japanese, level: 3',
    Response:
      'Question: text: Do you prefer sushi or ramen?, level: 4, Answers: Sushi, Ramen, Both',
  },
  {
    Input:
      'key: food, level: 1, key: Asian Cuisine, level: 2, key: Japanese, level: 3, key: Sushi, level: 4',
    Response:
      'Question: text: What is your favorite type of sushi?, level: 5, Answers: Maki, Nigiri, Sashimi',
  },
  {
    Input: 'key: fitness, level: 1',
    Response:
      'Question: text: What type of fitness activity do you prefer?, level: 2, Answers: Gym Workouts, Outdoor Sports, Yoga',
  },
  {
    Input:
      'key: fitness, level: 1, key: Gym Workouts, level: 2',
    Response:
      'Question: text: What type of gym workouts do you prefer?, level: 3, Answers: Strength Training, Cardiovascular Exercise, Functional Training',
  },
  {
    Input:
      'key: fitness, level: 1, key: Gym Workouts, level: 2, key: Strength Training, level: 3',
    Response:
      'Question: text: Which muscle group do you focus on the most?, level: 4, Answers: Chest, Back, Legs',
  },
  {
    Input:
      'key: fitness, level: 1, key: Gym Workouts, level: 2, key: Strength Training, level: 3, key: Legs, level: 4',
    Response:
      'Question: text: What is your favorite leg exercise?, level: 5, Answers: Squats, Lunges, Leg Press',
  },
  {
    Input: 'key: travel, level: 1',
    Response:
      'Question: text: What type of travel do you prefer?, level: 2, Answers: Adventure, Relaxation, Historical and Cultural',
  },
  {
    Input:
      'key: travel, level: 1, key: Adventure, level: 2',
    Response:
      'Question: text: What type of adventure travel do you prefer?, level: 3, Answers: Hiking and Trekking, Water Sports, Safari',
  },
  {
    Input:
      'key: travel, level: 1, key: Adventure, level: 2, key: Hiking and Trekking, level: 3',
    Response:
      'Question: text: Which type of terrain do you prefer for hiking and trekking?, level: 4, Answers: Mountains, Desert, Forest',
  },
  {
    Input:
      'key: travel, level: 1, key: Adventure, level: 2, key: Hiking and Trekking, level: 3, key: Mountains, level: 4',
    Response:
      'Question: text: What is your favorite mountain range for hiking and trekking?, level: 5, Answers: The Himalayas, The Alps, The Rockies',
  },
  {
    Input: 'key: technology, level: 1',
    Response:
      'Question: text: What type of technology are you most interested in?, level: 2, Answers: Software Development, Hardware Engineering, Data Science',
  },
  {
    Input:
      'key: Techie, level: 1, key: Software Development, level: 2',
    Response:
      'Question: text: What type of software development are you most interested in?, level: 3, Answers: Web Development, Mobile Development, Game Development',
  },
  {
    Input:
      'key: Techie, level: 1, key: Software Development, level: 2, key: Web Development, level: 3',
    Response:
      'Question: text: Which web development technology do you prefer?, level: 4, Answers: JavaScript, Python, Ruby',
  },
  {
    Input:
      'key: Techie, level: 1, key: Software Development, level: 2, key: Web Development, level: 3, key: JavaScript, level: 4',
    Response:
      'Question: text: Which JavaScript framework do you prefer for web development?, level: 5, Answers: React.js, Angular.js, Vue.js',
  },
  {
    Input: 'key: gadget, level: 1',
    Response:
      'Question: text: What type of gadgets do you like?, level: 2, Answers: Smartphones, Laptops, Smartwatches',
  },
  {
    Input:
      'key: Gadgets, level: 1, key: Smartphones, level: 2',
    Response:
      'Question: text: Which smartphone brand do you prefer?, level: 3, Answers: Apple, Samsung, Google',
  },
  {
    Input:
      'key: Gadgets, level: 1, key: Smartphones, level: 2, key: Apple, level: 3',
    Response:
      'Question: text: Which iPhone model do you prefer?, level: 4, Answers: iPhone 13, iPhone 12, iPhone SE',
  },
  {
    Input:
      'key: Gadgets, level: 1, key: Smartphones, level: 2, key: Apple, level: 3, key: iPhone 13, level: 4',
    Response:
      'Question: text: Which color do you prefer for the iPhone 13?, level: 5, Answers: Midnight, Starlight, Blue',
  },
];
