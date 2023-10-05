export const examples = [
  //hobbies
  //tree 1
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
    Input:
      'key: hobbies, level: 1, key: music, level: 2, key: playing music, level: 3, key: piano, level: 4',
    Response:
      'Question: text: What kind of piano music do you like playing?, level: 5, Answers: Classical, Jazz, Pop',
  },
  {
    Input:
      'key: hobbies, level: 1, key: music, level: 2, key: playing music, level: 3, key: violin, level: 4',
    Response:
      'Question: text: Do you play solo or in an ensemble?, level: 5, Answers: Solo, Orchestra, Chamber Music Group',
  },
  {
    Input:
      'key: hobbies, level: 1, key: music, level: 2, key: listening to music, level: 3',
    Response:
      'Question: text: What genre of music do you prefer listening to?, level: 4, Answers: Rock, Jazz, Classical',
  },
  {
    Input:
      'key: hobbies, level: 1, key: music, level: 2, key: listening to music, level: 3, key: rock, level: 4',
    Response:
      'Question: text: Who is your favorite rock band or artist?, level: 5, Answers: The Beatles, Led Zeppelin, Queen',
  },
  {
    Input:
      'key: hobbies, level: 1, key: reading, level: 2',
    Response:
      'Question: text: What type of books do you like reading?, level: 3, Answers: Fiction, Non-Fiction, Biographies',
  },
  {
    Input:
      'key: hobbies, level: 1, key: reading, level: 2, key: fiction, level: 3',
    Response:
      'Question: text: Which genre of fiction do you prefer?, level: 4, Answers: Mystery, Fantasy, Romance',
  },
  {
    Input:
      'key: hobbies, level: 1, key: reading, level: 2, key: fiction, level: 3, key: mystery, level: 4',
    Response:
      'Question: text: Who is your favorite mystery writer?, level: 5, Answers: Agatha Christie, Arthur Conan Doyle, Raymond Chandler',
  },
  {
    Input:
      'key: hobbies, level: 1, key: sports, level: 2',
    Response:
      'Question: text: Do you prefer playing sports or watching them?, level: 3, Answers: Playing, Watching, Both',
  },
  {
    Input:
      'key: hobbies, level: 1, key: sports, level: 2, key: playing, level: 3',
    Response:
      'Question: text: Which sport do you enjoy playing the most?, level: 4, Answers: Soccer, Basketball, Tennis',
  },
  {
    Input:
      'key: hobbies, level: 1, key: sports, level: 2, key: playing, level: 3, key: soccer, level: 4',
    Response:
      'Question: text: What position do you usually play in soccer?, level: 5, Answers: Forward, Midfielder, Defender',
  },
  {
    Input:
      'key: hobbies, level: 1, key: sports, level: 2, key: watching, level: 3',
    Response:
      'Question: text: Which sports league do you watch the most?, level: 4, Answers: NFL, NBA, FIFA World Cup',
  },
  {
    Input:
      'key: hobbies, level: 1, key: sports, level: 2, key: watching, level: 3, key: NBA, level: 4',
    Response:
      'Question: text: Which NBA team do you support?, level: 5, Answers: Los Angeles Lakers, Golden State Warriors, Boston Celtics',
  },
  {
    Input:
      'key: hobbies, level: 1, key: music, level: 2, key: listening to music, level: 3, key: jazz, level: 4',
    Response:
      'Question: text: Who is your favorite jazz artist?, level: 5, Answers: Miles Davis, Ella Fitzgerald, Duke Ellington',
  },
  {
    Input:
      'key: hobbies, level: 1, key: music, level: 2, key: listening to music, level: 3, key: classical, level: 4',
    Response:
      'Question: text: Do you prefer Baroque, Romantic, or Modern classical music?, level: 5, Answers: Baroque, Romantic, Modern',
  },
  {
    Input:
      'key: hobbies, level: 1, key: reading, level: 2, key: fiction, level: 3, key: fantasy, level: 4',
    Response:
      'Question: text: Who is your favorite fantasy author?, level: 5, Answers: J.R.R. Tolkien, George R.R. Martin, J.K. Rowling',
  },
  {
    Input:
      'key: hobbies, level: 1, key: reading, level: 2, key: fiction, level: 3, key: romance, level: 4',
    Response:
      'Question: text: Which romantic novel is your favorite?, level: 5, Answers: Pride and Prejudice, Outlander, The Notebook',
  },
  {
    Input:
      'key: hobbies, level: 1, key: reading, level: 2, key: non-fiction, level: 3',
    Response:
      'Question: text: Which non-fiction subject intrigues you the most?, level: 4, Answers: History, Science, Philosophy',
  },
  {
    Input:
      'key: hobbies, level: 1, key: reading, level: 2, key: biographies, level: 3',
    Response:
      'Question: text: Whose biography would you like to read?, level: 4, Answers: Historical Figures, Artists, Scientists',
  },
  {
    Input:
      'key: hobbies, level: 1, key: sports, level: 2, key: playing, level: 3, key: basketball, level: 4',
    Response:
      'Question: text: Do you play basketball casually or competitively?, level: 5, Answers: Casually, Competitively, Both',
  },
  {
    Input:
      'key: hobbies, level: 1, key: sports, level: 2, key: playing, level: 3, key: tennis, level: 4',
    Response:
      'Question: text: Do you prefer singles or doubles in tennis?, level: 5, Answers: Singles, Doubles',
  },
  {
    Input:
      'key: hobbies, level: 1, key: sports, level: 2, key: watching, level: 3, key: NFL, level: 4',
    Response:
      'Question: text: Which NFL team do you cheer for?, level: 5, Answers: Dallas Cowboys, New England Patriots, Green Bay Packers',
  },
  {
    Input:
      'key: hobbies, level: 1, key: sports, level: 2, key: watching, level: 3, key: FIFA World Cup, level: 4',
    Response:
      'Question: text: Which country do you support in the FIFA World Cup?, level: 5, Answers: Brazil, Germany, France',
  },

  //sports
  //tree 1
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
    Input:
      'key: sports, level: 1, key: team sports, level: 2, key: football, level: 3, key: playing, level: 4',
    Response:
      'Question: text: What position do you usually play in football?, level: 5, Answers: Forward, Midfielder, Defender',
  },
  {
    Input:
      'key: sports, level: 1, key: team sports, level: 2, key: basketball, level: 3',
    Response:
      'Question: text: Do you enjoy playing basketball or watching it?, level: 4, Answers: Playing, Watching, Both',
  },
  {
    Input:
      'key: sports, level: 1, key: team sports, level: 2, key: basketball, level: 3, key: watching, level: 4',
    Response:
      'Question: text: Which basketball league do you enjoy watching the most?, level: 5, Answers: NBA, EuroLeague, FIBA',
  },
  {
    Input:
      'key: sports, level: 1, key: team sports, level: 2, key: basketball, level: 3, key: playing, level: 4',
    Response:
      'Question: text: Which position do you prefer playing in basketball?, level: 5, Answers: Point Guard, Center, Small Forward',
  },
  {
    Input:
      'key: sports, level: 1, key: team sports, level: 2, key: cricket, level: 3',
    Response:
      'Question: text: Do you enjoy playing cricket or watching it?, level: 4, Answers: Playing, Watching, Both',
  },
  {
    Input:
      'key: sports, level: 1, key: team sports, level: 2, key: cricket, level: 3, key: watching, level: 4',
    Response:
      'Question: text: Which cricket format do you enjoy watching the most?, level: 5, Answers: Test, ODI, T20',
  },
  {
    Input:
      'key: sports, level: 1, key: team sports, level: 2, key: cricket, level: 3, key: playing, level: 4',
    Response:
      'Question: text: Which role do you prefer in cricket?, level: 5, Answers: Batsman, Bowler, All-rounder',
  },
  {
    Input:
      'key: sports, level: 1, key: individual sports, level: 2',
    Response:
      'Question: text: Which individual sport do you enjoy the most?, level: 3, Answers: Tennis, Boxing, Athletics',
  },
  {
    Input:
      'key: sports, level: 1, key: individual sports, level: 2, key: tennis, level: 3',
    Response:
      'Question: text: Who is your favorite tennis player?, level: 4, Answers: Rafael Nadal, Serena Williams, Novak Djokovic',
  },
  {
    Input:
      'key: sports, level: 1, key: individual sports, level: 2, key: boxing, level: 3',
    Response:
      'Question: text: Which boxing weight class do you follow the most?, level: 4, Answers: Heavyweight, Middleweight, Lightweight',
  },
  {
    Input:
      'key: sports, level: 1, key: individual sports, level: 2, key: athletics, level: 3',
    Response:
      'Question: text: Which athletics event do you enjoy the most?, level: 4, Answers: 100m Sprint, Marathon, Long Jump',
  },
  {
    Input:
      'key: sports, level: 1, key: water sports, level: 2',
    Response:
      'Question: text: Which water sport do you enjoy the most?, level: 3, Answers: Swimming, Surfing, Diving',
  },
  {
    Input:
      'key: sports, level: 1, key: water sports, level: 2, key: swimming, level: 3',
    Response:
      'Question: text: What type of swimming stroke do you prefer?, level: 4, Answers: Freestyle, Butterfly, Breaststroke',
  },
  {
    Input:
      'key: sports, level: 1, key: water sports, level: 2, key: surfing, level: 3',
    Response:
      'Question: text: Do you surf on longboards or shortboards?, level: 4, Answers: Longboards, Shortboards, Both',
  },
  {
    Input:
      'key: sports, level: 1, key: water sports, level: 2, key: diving, level: 3',
    Response:
      'Question: text: Do you prefer scuba diving or cliff diving?, level: 4, Answers: Scuba Diving, Cliff Diving, Both',
  },
  {
    Input:
      'key: sports, level: 1, key: individual sports, level: 2, key: tennis, level: 3, key: Rafael Nadal, level: 4',
    Response:
      'Question: text: Do you admire Rafael Nadal for his skills or sportsmanship?, level: 5, Answers: Skills, Sportsmanship, Both',
  },
  {
    Input:
      'key: sports, level: 1, key: individual sports, level: 2, key: boxing, level: 3, key: Heavyweight, level: 4',
    Response:
      'Question: text: Who is your favorite heavyweight boxer?, level: 5, Answers: Mike Tyson, Anthony Joshua, Tyson Fury',
  },
  {
    Input:
      'key: sports, level: 1, key: individual sports, level: 2, key: athletics, level: 3, key: 100m Sprint, level: 4',
    Response:
      'Question: text: Who is your favorite 100m sprinter?, level: 5, Answers: Usain Bolt, Carl Lewis, Yohan Blake',
  },
  {
    Input:
      'key: sports, level: 1, key: water sports, level: 2, key: swimming, level: 3, key: Freestyle, level: 4',
    Response:
      'Question: text: How often do you practice freestyle swimming?, level: 5, Answers: Daily, Weekly, Monthly',
  },
  {
    Input:
      'key: sports, level: 1, key: water sports, level: 2, key: surfing, level: 3, key: Longboards, level: 4',
    Response:
      'Question: text: Have you ever participated in a longboard surfing competition?, level: 5, Answers: Yes, No, Planning to',
  },
  {
    Input:
      'key: sports, level: 1, key: water sports, level: 2, key: diving, level: 3, key: Scuba Diving, level: 4',
    Response:
      'Question: text: Which is your favorite scuba diving spot?, level: 5, Answers: Great Barrier Reef, Maldives, Red Sea',
  },

  //food
  //tree 1
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
    Input:
      'key: food, level: 1, key: Asian Cuisine, level: 2, key: Japanese, level: 3, key: Ramen, level: 4',
    Response:
      'Question: text: What kind of ramen broth do you like?, level: 5, Answers: Shoyu, Tonkotsu, Miso',
  },
  {
    Input:
      'key: food, level: 1, key: Asian Cuisine, level: 2, key: Chinese, level: 3',
    Response:
      'Question: text: What is your favorite Chinese dish?, level: 4, Answers: Dim Sum, Peking Duck, Mapo Tofu',
  },
  {
    Input:
      'key: food, level: 1, key: Asian Cuisine, level: 2, key: Chinese, level: 3, key: Dim Sum, level: 4',
    Response:
      'Question: text: What type of Dim Sum do you love the most?, level: 5, Answers: Har Gow, Siu Mai, Char Siu Bao',
  },
  {
    Input:
      'key: food, level: 1, key: Asian Cuisine, level: 2, key: Indian, level: 3',
    Response:
      'Question: text: Which Indian dish do you crave for?, level: 4, Answers: Butter Chicken, Biryani, Samosa',
  },
  {
    Input:
      'key: food, level: 1, key: Asian Cuisine, level: 2, key: Indian, level: 3, key: Butter Chicken, level: 4',
    Response:
      'Question: text: Do you like your butter chicken with?, level: 5, Answers: Naan, Rice, Both',
  },
  {
    Input:
      'key: food, level: 1, key: European Cuisine, level: 2',
    Response:
      'Question: text: Which European cuisine do you lean towards?, level: 3, Answers: Italian, French, Spanish',
  },
  {
    Input:
      'key: food, level: 1, key: European Cuisine, level: 2, key: Italian, level: 3',
    Response:
      "Question: text: Pasta or Pizza?, level: 4, Answers: Pasta, Pizza, Can't Decide",
  },
  {
    Input:
      'key: food, level: 1, key: European Cuisine, level: 2, key: Italian, level: 3, key: Pasta, level: 4',
    Response:
      'Question: text: Which pasta sauce do you adore?, level: 5, Answers: Marinara, Alfredo, Pesto',
  },
  {
    Input:
      'key: food, level: 1, key: American Cuisine, level: 2',
    Response:
      "Question: text: What's your go-to American dish?, level: 3, Answers: Burger, Barbecue, Fried Chicken",
  },
  {
    Input:
      'key: food, level: 1, key: American Cuisine, level: 2, key: Burger, level: 3',
    Response:
      'Question: text: How do you like your burger?, level: 4, Answers: Well Done, Medium Rare, With Cheese',
  },
  {
    Input:
      'key: food, level: 1, key: American Cuisine, level: 2, key: Burger, level: 3, key: With Cheese, level: 4',
    Response:
      'Question: text: Which cheese on your burger?, level: 5, Answers: Cheddar, Swiss, Blue Cheese',
  },
  {
    Input:
      'key: food, level: 1, key: Asian Cuisine, level: 2, key: Chinese, level: 3, key: Peking Duck, level: 4',
    Response:
      'Question: text: Do you prefer the crispy skin or the meat of the Peking Duck?, level: 5, Answers: Crispy Skin, Meat, Both',
  },
  {
    Input:
      'key: food, level: 1, key: Asian Cuisine, level: 2, key: Chinese, level: 3, key: Mapo Tofu, level: 4',
    Response:
      'Question: text: Do you prefer your Mapo Tofu spicy or mild?, level: 5, Answers: Spicy, Mild, Moderate',
  },
  {
    Input:
      'key: food, level: 1, key: Asian Cuisine, level: 2, key: Indian, level: 3, key: Biryani, level: 4',
    Response:
      'Question: text: Which protein do you prefer in your Biryani?, level: 5, Answers: Chicken, Lamb, Vegetables',
  },
  {
    Input:
      'key: food, level: 1, key: Asian Cuisine, level: 2, key: Indian, level: 3, key: Samosa, level: 4',
    Response:
      "Question: text: What's your favorite type of Samosa filling?, level: 5, Answers: Potato and Peas, Meat, Lentils",
  },
  {
    Input:
      'key: food, level: 1, key: European Cuisine, level: 2, key: French, level: 3',
    Response:
      'Question: text: Which French dessert do you enjoy the most?, level: 4, Answers: Crème Brûlée, Macarons, Eclair',
  },
  {
    Input:
      'key: food, level: 1, key: European Cuisine, level: 2, key: French, level: 3, key: Crème Brûlée, level: 4',
    Response:
      "Question: text: Do you prefer a thick or thin caramelized top on your Crème Brûlée?, level: 5, Answers: Thick, Thin, Doesn't Matter",
  },
  {
    Input:
      'key: food, level: 1, key: European Cuisine, level: 2, key: Spanish, level: 3',
    Response:
      'Question: text: What is your go-to Spanish tapas?, level: 4, Answers: Patatas Bravas, Gambas al Ajillo, Tortilla Española',
  },
  {
    Input:
      'key: food, level: 1, key: European Cuisine, level: 2, key: Spanish, level: 3, key: Patatas Bravas, level: 4',
    Response:
      'Question: text: Do you prefer them spicy or not?, level: 5, Answers: Spicy, Not Spicy, Moderate',
  },
  {
    Input:
      'key: food, level: 1, key: American Cuisine, level: 2, key: Barbecue, level: 3',
    Response:
      'Question: text: Which type of BBQ sauce do you prefer?, level: 4, Answers: Sweet, Tangy, Smoky',
  },
  {
    Input:
      'key: food, level: 1, key: American Cuisine, level: 2, key: Barbecue, level: 3, key: Sweet, level: 4',
    Response:
      'Question: text: Do you like your sweet BBQ sauce with a hint of?, level: 5, Answers: Honey, Molasses, Maple Syrup',
  },
  {
    Input:
      'key: food, level: 1, key: American Cuisine, level: 2, key: Fried Chicken, level: 3',
    Response:
      'Question: text: How do you like your fried chicken?, level: 4, Answers: Crispy, Juicy, Extra Spicy',
  },
  {
    Input:
      'key: food, level: 1, key: American Cuisine, level: 2, key: Fried Chicken, level: 3, key: Crispy, level: 4',
    Response:
      'Question: text: Which part of the chicken do you prefer?, level: 5, Answers: Thigh, Drumstick, Wing',
  },
  {
    Input:
      'key: food, level: 1, key: European Cuisine, level: 2, key: Italian, level: 3, key: Pizza, level: 4',
    Response:
      'Question: text: What type of pizza crust do you prefer?, level: 5, Answers: Thin Crust, Deep Dish, Stuffed Crust',
  },
  {
    Input:
      'key: food, level: 1, key: European Cuisine, level: 2, key: French, level: 3, key: Macarons, level: 4',
    Response:
      'Question: text: Which macaron flavor is your favorite?, level: 5, Answers: Chocolate, Raspberry, Pistachio',
  },
  {
    Input:
      'key: food, level: 1, key: European Cuisine, level: 2, key: French, level: 3, key: Eclair, level: 4',
    Response:
      'Question: text: Do you prefer chocolate or vanilla filling in your eclair?, level: 5, Answers: Chocolate, Vanilla, Both',
  },
  {
    Input:
      'key: food, level: 1, key: European Cuisine, level: 2, key: Spanish, level: 3, key: Gambas al Ajillo, level: 4',
    Response:
      'Question: text: How spicy do you like your Gambas al Ajillo?, level: 5, Answers: Mild, Hot, Extra Hot',
  },
  {
    Input:
      'key: food, level: 1, key: European Cuisine, level: 2, key: Spanish, level: 3, key: Tortilla Española, level: 4',
    Response:
      'Question: text: Do you like your Tortilla Española with onion or without?, level: 5, Answers: With Onion, Without Onion, No Preference',
  },
  {
    Input:
      'key: food, level: 1, key: American Cuisine, level: 2, key: Barbecue, level: 3, key: Tangy, level: 4',
    Response:
      'Question: text: What tangy ingredient do you prefer in your BBQ sauce?, level: 5, Answers: Vinegar, Mustard, Lemon Juice',
  },
  {
    Input:
      'key: food, level: 1, key: American Cuisine, level: 2, key: Barbecue, level: 3, key: Smoky, level: 4',
    Response:
      'Question: text: What gives your smoky BBQ sauce its unique flavor?, level: 5, Answers: Hickory, Mesquite, Applewood',
  },
  {
    Input:
      'key: food, level: 1, key: American Cuisine, level: 2, key: Fried Chicken, level: 3, key: Juicy, level: 4',
    Response:
      'Question: text: Which marinating liquid makes your chicken juicy?, level: 5, Answers: Buttermilk, Yogurt, Brine',
  },
  {
    Input:
      'key: food, level: 1, key: American Cuisine, level: 2, key: Fried Chicken, level: 3, key: Extra Spicy, level: 4',
    Response:
      'Question: text: Which spice gives the kick to your spicy fried chicken?, level: 5, Answers: Cayenne Pepper, Jalapeno, Hot Sauce',
  },

  //fitness
  //tree 1
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
    Input:
      'key: fitness, level: 1, key: Gym Workouts, level: 2, key: Strength Training, level: 3, key: Chest, level: 4',
    Response:
      'Question: text: What is your favorite chest exercise?, level: 5, Answers: Bench Press, Push-ups, Dumbbell Flyes',
  },
  {
    Input:
      'key: fitness, level: 1, key: Gym Workouts, level: 2, key: Strength Training, level: 3, key: Back, level: 4',
    Response:
      'Question: text: What is your favorite back exercise?, level: 5, Answers: Deadlifts, Pull-ups, Bent Over Rows',
  },
  {
    Input:
      'key: fitness, level: 1, key: Gym Workouts, level: 2, key: Cardiovascular Exercise, level: 3',
    Response:
      'Question: text: Which cardiovascular activity do you engage in the most?, level: 4, Answers: Running, Cycling, Jump Rope',
  },
  {
    Input:
      'key: fitness, level: 1, key: Gym Workouts, level: 2, key: Cardiovascular Exercise, level: 3, key: Running, level: 4',
    Response:
      'Question: text: What type of running do you prefer?, level: 5, Answers: Sprinting, Marathon, Trail Running',
  },
  {
    Input:
      'key: fitness, level: 1, key: Gym Workouts, level: 2, key: Functional Training, level: 3',
    Response:
      'Question: text: Which functional movement do you find most challenging?, level: 4, Answers: Planks, Burpees, Kettlebell Swings',
  },
  {
    Input:
      'key: fitness, level: 1, key: Outdoor Sports, level: 2',
    Response:
      'Question: text: What type of outdoor sport do you enjoy the most?, level: 3, Answers: Football, Basketball, Tennis',
  },
  {
    Input:
      'key: fitness, level: 1, key: Outdoor Sports, level: 2, key: Football, level: 3',
    Response:
      'Question: text: Which football position would you play?, level: 4, Answers: Forward, Midfielder, Goalkeeper',
  },
  {
    Input:
      'key: fitness, level: 1, key: Yoga, level: 2',
    Response:
      'Question: text: Which style of yoga do you practice?, level: 3, Answers: Hatha, Vinyasa, Kundalini',
  },
  {
    Input:
      'key: fitness, level: 1, key: Yoga, level: 2, key: Hatha, level: 3',
    Response:
      'Question: text: What do you like most about Hatha yoga?, level: 4, Answers: Balance, Flexibility, Calmness',
  },
  {
    Input:
      'key: fitness, level: 1, key: Gym Workouts, level: 2, key: Cardiovascular Exercise, level: 3, key: Cycling, level: 4',
    Response:
      'Question: text: Do you prefer indoor cycling or outdoor biking?, level: 5, Answers: Indoor Cycling, Road Biking, Mountain Biking',
  },
  {
    Input:
      'key: fitness, level: 1, key: Gym Workouts, level: 2, key: Cardiovascular Exercise, level: 3, key: Jump Rope, level: 4',
    Response:
      'Question: text: How long do you typically jump rope for?, level: 5, Answers: 10 minutes, 30 minutes, More than an hour',
  },
  {
    Input:
      'key: fitness, level: 1, key: Gym Workouts, level: 2, key: Functional Training, level: 3, key: Planks, level: 4',
    Response:
      'Question: text: How long can you hold a plank?, level: 5, Answers: Less than a minute, 1-3 minutes, More than 5 minutes',
  },
  {
    Input:
      'key: fitness, level: 1, key: Gym Workouts, level: 2, key: Functional Training, level: 3, key: Burpees, level: 4',
    Response:
      'Question: text: How many burpees can you do in a minute?, level: 5, Answers: Less than 20, 20-40, More than 40',
  },
  {
    Input:
      'key: fitness, level: 1, key: Gym Workouts, level: 2, key: Functional Training, level: 3, key: Kettlebell Swings, level: 4',
    Response:
      'Question: text: What weight kettlebell do you typically use?, level: 5, Answers: Less than 20 lbs, 20-40 lbs, More than 40 lbs',
  },
  {
    Input:
      'key: fitness, level: 1, key: Outdoor Sports, level: 2, key: Basketball, level: 3',
    Response:
      'Question: text: What position do you play in basketball?, level: 4, Answers: Point Guard, Center, Forward',
  },
  {
    Input:
      'key: fitness, level: 1, key: Outdoor Sports, level: 2, key: Tennis, level: 3',
    Response:
      'Question: text: Do you prefer singles or doubles in tennis?, level: 4, Answers: Singles, Doubles',
  },
  {
    Input:
      'key: fitness, level: 1, key: Yoga, level: 2, key: Vinyasa, level: 3',
    Response:
      'Question: text: What do you find most rewarding about Vinyasa yoga?, level: 4, Answers: Flow, Breath, Movement',
  },
  {
    Input:
      'key: fitness, level: 1, key: Yoga, level: 2, key: Kundalini, level: 3',
    Response:
      'Question: text: What aspect of Kundalini yoga do you appreciate the most?, level: 4, Answers: Spiritual Awakening, Physical Postures, Breathwork',
  },

  //travel
  //tree 1
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
    Input:
      'key: travel, level: 1, key: Adventure, level: 2, key: Hiking and Trekking, level: 3, key: Desert, level: 4',
    Response:
      'Question: text: Which desert region would you prefer to trek in?, level: 5, Answers: Sahara, Mojave, Arabian Desert',
  },
  {
    Input:
      'key: travel, level: 1, key: Adventure, level: 2, key: Hiking and Trekking, level: 3, key: Forest, level: 4',
    Response:
      'Question: text: Which forest terrain would you like to explore?, level: 5, Answers: Amazon Rainforest, Black Forest, Redwood National Park',
  },
  {
    Input:
      'key: travel, level: 1, key: Adventure, level: 2, key: Water Sports, level: 3',
    Response:
      'Question: text: Which water sport activity excites you the most?, level: 4, Answers: Surfing, Scuba Diving, Kayaking',
  },
  {
    Input:
      'key: travel, level: 1, key: Adventure, level: 2, key: Water Sports, level: 3, key: Surfing, level: 4',
    Response:
      'Question: text: Which surfing destination do you dream of?, level: 5, Answers: Gold Coast, Bali, North Shore of Oahu',
  },
  {
    Input:
      'key: travel, level: 1, key: Adventure, level: 2, key: Water Sports, level: 3, key: Scuba Diving, level: 4',
    Response:
      'Question: text: What type of marine environment do you love for scuba diving?, level: 5, Answers: Coral Reefs, Shipwrecks, Caves',
  },
  {
    Input:
      'key: travel, level: 1, key: Adventure, level: 2, key: Water Sports, level: 3, key: Kayaking, level: 4',
    Response:
      'Question: text: Which type of water body do you prefer for kayaking?, level: 5, Answers: Rivers, Lakes, Sea',
  },
  {
    Input:
      'key: travel, level: 1, key: Adventure, level: 2, key: Safari, level: 3',
    Response:
      'Question: text: Which region would you like to go on a safari?, level: 4, Answers: Africa, India, Australia',
  },
  {
    Input:
      'key: travel, level: 1, key: Adventure, level: 2, key: Safari, level: 3, key: Africa, level: 4',
    Response:
      'Question: text: Which African country is your top choice for a safari?, level: 5, Answers: Kenya, South Africa, Tanzania',
  },
  {
    Input:
      'key: travel, level: 1, key: Relaxation, level: 2',
    Response:
      'Question: text: What relaxation destination do you dream of?, level: 3, Answers: Beach Resorts, Mountain Retreats, Spa Towns',
  },
  {
    Input:
      'key: travel, level: 1, key: Relaxation, level: 2, key: Beach Resorts, level: 3',
    Response:
      'Question: text: Which beach destination attracts you the most?, level: 4, Answers: Maldives, Caribbean, Mediterranean Coast',
  },
  {
    Input:
      'key: travel, level: 1, key: Historical and Cultural, level: 2',
    Response:
      'Question: text: What type of historical and cultural sites interest you?, level: 3, Answers: Ancient Ruins, Historic Cities, Museums and Galleries',
  },
  {
    Input:
      'key: travel, level: 1, key: Historical and Cultural, level: 2, key: Ancient Ruins, level: 3',
    Response:
      'Question: text: Which of these ancient ruins would you love to visit?, level: 4, Answers: Machu Picchu, The Acropolis, Pyramids of Egypt',
  },
  {
    Input:
      'key: travel, level: 1, key: Relaxation, level: 2, key: Mountain Retreats, level: 3',
    Response:
      'Question: text: What kind of mountain retreat environment do you prefer?, level: 4, Answers: Snowy Peaks, Green Valleys, Mountain Lakes',
  },
  {
    Input:
      'key: travel, level: 1, key: Relaxation, level: 2, key: Spa Towns, level: 3',
    Response:
      "Question: text: Which region's spa towns attract you the most?, level: 4, Answers: European, Asian, North American",
  },
  {
    Input:
      'key: travel, level: 1, key: Relaxation, level: 2, key: Spa Towns, level: 3, key: European, level: 4',
    Response:
      'Question: text: Which European spa town would you like to visit?, level: 5, Answers: Baden-Baden, Karlovy Vary, Bath',
  },
  {
    Input:
      'key: travel, level: 1, key: Historical and Cultural, level: 2, key: Historic Cities, level: 3',
    Response:
      "Question: text: Which era's historic cities fascinate you?, level: 4, Answers: Medieval, Renaissance, Ancient",
  },
  {
    Input:
      'key: travel, level: 1, key: Historical and Cultural, level: 2, key: Historic Cities, level: 3, key: Medieval, level: 4',
    Response:
      'Question: text: Which medieval city would you love to visit?, level: 5, Answers: Carcassonne, Dubrovnik, Bruges',
  },
  {
    Input:
      'key: travel, level: 1, key: Historical and Cultural, level: 2, key: Museums and Galleries, level: 3',
    Response:
      'Question: text: Which kind of art attracts you the most?, level: 4, Answers: Classical, Modern, Indigenous',
  },
  {
    Input:
      'key: travel, level: 1, key: Historical and Cultural, level: 2, key: Museums and Galleries, level: 3, key: Classical, level: 4',
    Response:
      'Question: text: Which famous classical art museum would you visit?, level: 5, Answers: The Louvre, The Uffizi, The Prado',
  },

  //technology
  //tree 1
  {
    Input: 'key: technology, level: 1',
    Response:
      'Question: text: What type of technology are you most interested in?, level: 2, Answers: Software Development, Hardware Engineering, Data Science',
  },
  {
    Input:
      'key: technology, level: 1, key: Software Development, level: 2',
    Response:
      'Question: text: What type of software development are you most interested in?, level: 3, Answers: Web Development, Mobile Development, Game Development',
  },
  {
    Input:
      'key: technology, level: 1, key: Software Development, level: 2, key: Web Development, level: 3',
    Response:
      'Question: text: Which web development technology do you prefer?, level: 4, Answers: JavaScript, Python, Ruby',
  },
  {
    Input:
      'key: technology, level: 1, key: Software Development, level: 2, key: Web Development, level: 3, key: JavaScript, level: 4',
    Response:
      'Question: text: Which JavaScript framework do you prefer for web development?, level: 5, Answers: React.js, Angular.js, Vue.js',
  },
  {
    Input:
      'key: technology, level: 1, key: Software Development, level: 2, key: Web Development, level: 3, key: Python, level: 4',
    Response:
      'Question: text: Which Python framework do you prefer for web development?, level: 5, Answers: Django, Flask, Pyramid',
  },
  {
    Input:
      'key: technology, level: 1, key: Software Development, level: 2, key: Web Development, level: 3, key: Ruby, level: 4',
    Response:
      'Question: text: Which Ruby framework do you use for web development?, level: 5, Answers: Ruby on Rails, Sinatra, Hanami',
  },
  {
    Input:
      'key: technology, level: 1, key: Software Development, level: 2, key: Mobile Development, level: 3',
    Response:
      'Question: text: Which mobile development platform do you prefer?, level: 4, Answers: iOS, Android, Cross-Platform',
  },
  {
    Input:
      'key: technology, level: 1, key: Software Development, level: 2, key: Mobile Development, level: 3, key: iOS, level: 4',
    Response:
      'Question: text: Which tool do you prefer for iOS development?, level: 5, Answers: Swift, Objective-C, SwiftUI',
  },
  {
    Input:
      'key: technology, level: 1, key: Software Development, level: 2, key: Mobile Development, level: 3, key: Android, level: 4',
    Response:
      'Question: text: Which language do you prefer for Android development?, level: 5, Answers: Java, Kotlin, C++',
  },
  {
    Input:
      'key: technology, level: 1, key: Software Development, level: 2, key: Mobile Development, level: 3, key: Cross-Platform, level: 4',
    Response:
      'Question: text: Which cross-platform framework do you prefer?, level: 5, Answers: Flutter, React Native, Xamarin',
  },
  {
    Input:
      'key: technology, level: 1, key: Software Development, level: 2, key: Game Development, level: 3',
    Response:
      'Question: text: Which game development platform do you prefer?, level: 4, Answers: Unity, Unreal Engine, Godot',
  },
  {
    Input:
      'key: technology, level: 1, key: Software Development, level: 2, key: Game Development, level: 3, key: Unity, level: 4',
    Response:
      'Question: text: What do you like most about Unity?, level: 5, Answers: User-Friendly Interface, Asset Store, Scripting with C#',
  },
  {
    Input:
      'key: technology, level: 1, key: Software Development, level: 2, key: Game Development, level: 3, key: Unreal Engine, level: 4',
    Response:
      'Question: text: What attracts you to Unreal Engine?, level: 5, Answers: Advanced Graphics, Blueprints System, Marketplace',
  },
  {
    Input:
      'key: technology, level: 1, key: Software Development, level: 2, key: Game Development, level: 3, key: Godot, level: 4',
    Response:
      'Question: text: Why do you choose Godot for game development?, level: 5, Answers: Open Source, Lightweight, Scripting with GDScript',
  },
  {
    Input:
      'key: technology, level: 1, key: Hardware Engineering, level: 2',
    Response:
      'Question: text: What aspect of hardware engineering intrigues you?, level: 3, Answers: Microelectronics, Robotics, Computer Architecture',
  },
  {
    Input:
      'key: technology, level: 1, key: Data Science, level: 2',
    Response:
      'Question: text: What sub-field of data science are you most interested in?, level: 3, Answers: Machine Learning, Big Data, Data Visualization',
  },
  {
    Input:
      'key: technology, level: 1, key: Hardware Engineering, level: 2, key: Microelectronics, level: 3',
    Response:
      'Question: text: What do you focus on in microelectronics?, level: 4, Answers: Semiconductor Manufacturing, Integrated Circuits, MEMS',
  },
  {
    Input:
      'key: technology, level: 1, key: Hardware Engineering, level: 2, key: Microelectronics, level: 3, key: Semiconductor Manufacturing, level: 4',
    Response:
      'Question: text: Which semiconductor material do you often work with?, level: 5, Answers: Silicon, Gallium Nitride, Germanium',
  },
  {
    Input:
      'key: technology, level: 1, key: Hardware Engineering, level: 2, key: Microelectronics, level: 3, key: Integrated Circuits, level: 4',
    Response:
      'Question: text: What type of integrated circuits are you interested in?, level: 5, Answers: Analog, Digital, Mixed Signal',
  },
  {
    Input:
      'key: technology, level: 1, key: Hardware Engineering, level: 2, key: Microelectronics, level: 3, key: MEMS, level: 4',
    Response:
      'Question: text: Which application of MEMS interests you the most?, level: 5, Answers: Sensors, Actuators, Resonators',
  },
  {
    Input:
      'key: technology, level: 1, key: Hardware Engineering, level: 2, key: Robotics, level: 3',
    Response:
      'Question: text: What field of robotics do you focus on?, level: 4, Answers: Autonomous Robots, Industrial Robots, Humanoid Robots',
  },
  {
    Input:
      'key: technology, level: 1, key: Hardware Engineering, level: 2, key: Robotics, level: 3, key: Autonomous Robots, level: 4',
    Response:
      'Question: text: What application for autonomous robots interests you?, level: 5, Answers: Drones, Self-driving Cars, Home Assistants',
  },
  {
    Input:
      'key: technology, level: 1, key: Hardware Engineering, level: 2, key: Robotics, level: 3, key: Industrial Robots, level: 4',
    Response:
      'Question: text: What role do you see industrial robots playing?, level: 5, Answers: Manufacturing, Packaging, Quality Control',
  },
  {
    Input:
      'key: technology, level: 1, key: Hardware Engineering, level: 2, key: Computer Architecture, level: 3',
    Response:
      'Question: text: Which component of computer architecture intrigues you?, level: 4, Answers: CPU Design, Memory Management, Input/Output Systems',
  },
  {
    Input:
      'key: technology, level: 1, key: Data Science, level: 2, key: Machine Learning, level: 3',
    Response:
      'Question: text: Which ML algorithm do you often use?, level: 4, Answers: Neural Networks, Decision Trees, SVMs',
  },
  {
    Input:
      'key: technology, level: 1, key: Data Science, level: 2, key: Machine Learning, level: 3, key: Neural Networks, level: 4',
    Response:
      'Question: text: What type of neural networks do you work with?, level: 5, Answers: Convolutional NN, Recurrent NN, Generative Adversarial NN',
  },
  {
    Input:
      'key: technology, level: 1, key: Data Science, level: 2, key: Big Data, level: 3',
    Response:
      'Question: text: Which big data technology do you use most?, level: 4, Answers: Hadoop, Spark, Kafka',
  },
  {
    Input:
      'key: technology, level: 1, key: Data Science, level: 2, key: Data Visualization, level: 3',
    Response:
      'Question: text: Which data visualization tool do you prefer?, level: 4, Answers: Tableau, PowerBI, D3.js',
  },

  //gadget
  //tree 1
  {
    Input: 'key: gadget, level: 1',
    Response:
      'Question: text: What type of gadgets do you like?, level: 2, Answers: Smartphones, Laptops, Smartwatches',
  },
  {
    Input:
      'key: gadget, level: 1, key: Smartphones, level: 2',
    Response:
      'Question: text: Which smartphone brand do you prefer?, level: 3, Answers: Apple, Samsung, Google',
  },
  {
    Input:
      'key: gadget, level: 1, key: Smartphones, level: 2, key: Apple, level: 3',
    Response:
      'Question: text: Which iPhone model do you prefer?, level: 4, Answers: iPhone 13, iPhone 12, iPhone SE',
  },
  {
    Input:
      'key: gadget, level: 1, key: Smartphones, level: 2, key: Apple, level: 3, key: iPhone 13, level: 4',
    Response:
      'Question: text: Which color do you prefer for the iPhone 13?, level: 5, Answers: Midnight, Starlight, Blue',
  },
  {
    Input:
      'key: gadget, level: 1, key: Laptops, level: 2',
    Response:
      'Question: text: Which laptop brand do you prefer?, level: 3, Answers: Apple (MacBook), Dell, Lenovo',
  },
  {
    Input:
      'key: gadget, level: 1, key: Smartwatches, level: 2',
    Response:
      'Question: text: Which smartwatch brand do you like?, level: 3, Answers: Apple (Apple Watch), Samsung (Galaxy Watch), Fitbit',
  },
  {
    Input:
      'key: gadget, level: 1, key: Laptops, level: 2, key: Apple (MacBook), level: 3',
    Response:
      'Question: text: Which MacBook model do you prefer?, level: 4, Answers: MacBook Air, MacBook Pro, MacBook',
  },
  {
    Input:
      'key: gadget, level: 1, key: Laptops, level: 2, key: Dell, level: 3',
    Response:
      'Question: text: Which Dell laptop series do you like?, level: 4, Answers: XPS, Inspiron, Alienware',
  },
  {
    Input:
      'key: gadget, level: 1, key: Smartwatches, level: 2, key: Apple (Apple Watch), level: 3',
    Response:
      'Question: text: Which Apple Watch series do you prefer?, level: 4, Answers: Series 7, Series 6, SE',
  },
  {
    Input:
      'key: gadget, level: 1, key: Smartwatches, level: 2, key: Samsung (Galaxy Watch), level: 3',
    Response:
      'Question: text: Which Galaxy Watch model do you like?, level: 4, Answers: Galaxy Watch 4, Galaxy Watch 3, Galaxy Watch Active 2',
  },
  {
    Input:
      'key: gadget, level: 1, key: Smartphones, level: 2, key: Samsung, level: 3',
    Response:
      'Question: text: Which Samsung smartphone series do you prefer?, level: 4, Answers: Galaxy S, Galaxy Note, Galaxy Z Fold',
  },
  {
    Input:
      'key: gadget, level: 1, key: Smartphones, level: 2, key: Google, level: 3',
    Response:
      'Question: text: Which Google Pixel model do you like the most?, level: 4, Answers: Pixel 6, Pixel 6 Pro, Pixel 5a',
  },
  {
    Input:
      'key: gadget, level: 1, key: Laptops, level: 2, key: Lenovo, level: 3',
    Response:
      'Question: text: Which Lenovo laptop series do you prefer?, level: 4, Answers: ThinkPad, Yoga, Legion',
  },
  {
    Input:
      'key: gadget, level: 1, key: Smartwatches, level: 2, key: Fitbit, level: 3',
    Response:
      'Question: text: Which Fitbit model do you like the most?, level: 4, Answers: Fitbit Charge, Fitbit Versa, Fitbit Luxe',
  },
  {
    Input:
      'key: gadget, level: 1, key: Smartphones, level: 2, key: Apple, level: 3, key: iPhone 12, level: 4',
    Response:
      'Question: text: Which feature of the iPhone 12 do you like most?, level: 5, Answers: Dual-Camera System, Ceramic Shield, 5G Capabilities',
  },
  {
    Input:
      'key: gadget, level: 1, key: Smartphones, level: 2, key: Apple, level: 3, key: iPhone SE, level: 4',
    Response:
      'Question: text: What attracts you to the iPhone SE?, level: 5, Answers: Affordable Price, Compact Size, Powerful Chip',
  },
  {
    Input:
      'key: gadget, level: 1, key: Laptops, level: 2, key: Apple (MacBook), level: 3, key: MacBook Pro, level: 4',
    Response:
      'Question: text: Which feature of the MacBook Pro do you value most?, level: 5, Answers: M1 Chip, Retina Display, Touch Bar',
  },
  {
    Input:
      'key: gadget, level: 1, key: Laptops, level: 2, key: Apple (MacBook), level: 3, key: MacBook, level: 4',
    Response:
      'Question: text: What do you like about the standard MacBook?, level: 5, Answers: Portability, Sleek Design, Fan-less System',
  },
  {
    Input:
      'key: gadget, level: 1, key: Laptops, level: 2, key: Dell, level: 3, key: Inspiron, level: 4',
    Response:
      'Question: text: What do you seek in the Inspiron series?, level: 5, Answers: Value for Money, Versatility, Array of Options',
  },
  {
    Input:
      'key: gadget, level: 1, key: Laptops, level: 2, key: Dell, level: 3, key: Alienware, level: 4',
    Response:
      'Question: text: Why do you prefer Alienware laptops?, level: 5, Answers: Gaming Performance, RGB Lighting, Unique Design',
  },
  {
    Input:
      'key: gadget, level: 1, key: Smartwatches, level: 2, key: Apple (Apple Watch), level: 3, key: Series 6, level: 4',
    Response:
      'Question: text: What do you appreciate most about the Apple Watch Series 6?, level: 5, Answers: Blood Oxygen App, Always-On Display, ECG App',
  },
  {
    Input:
      'key: gadget, level: 1, key: Smartwatches, level: 2, key: Apple (Apple Watch), level: 3, key: SE, level: 4',
    Response:
      'Question: text: Why would you choose the Apple Watch SE?, level: 5, Answers: Affordable Price, Comprehensive Features, Fall Detection',
  },
  {
    Input:
      'key: gadget, level: 1, key: Smartwatches, level: 2, key: Samsung (Galaxy Watch), level: 3, key: Galaxy Watch 3, level: 4',
    Response:
      'Question: text: What stands out to you in the Galaxy Watch 3?, level: 5, Answers: Rotating Bezel, Classic Design, Health Monitoring',
  },
  {
    Input:
      'key: gadget, level: 1, key: Smartwatches, level: 2, key: Samsung (Galaxy Watch), level: 3, key: Galaxy Watch Active 2, level: 4',
    Response:
      'Question: text: Why do you prefer the Galaxy Watch Active 2?, level: 5, Answers: Sleek Design, Fitness Features, Digital Touch Bezel',
  },
  {
    Input:
      'key: gadget, level: 1, key: Smartphones, level: 2, key: Samsung, level: 3, key: Galaxy Note, level: 4',
    Response:
      'Question: text: What appeals to you in the Galaxy Note series?, level: 5, Answers: S Pen, Large Display, Multitasking Features',
  },
  {
    Input:
      'key: gadget, level: 1, key: Smartphones, level: 2, key: Samsung, level: 3, key: Galaxy Z Fold, level: 4',
    Response:
      'Question: text: Why would you choose a Galaxy Z Fold phone?, level: 5, Answers: Foldable Screen, Unique Experience, Multitasking Capabilities',
  },
  {
    Input:
      'key: gadget, level: 1, key: Smartphones, level: 2, key: Google, level: 3, key: Pixel 6, level: 4',
    Response:
      "Question: text: What's your favorite feature of the Google Pixel 6?, level: 5, Answers: Camera Capabilities, Pure Android Experience, Google Assistant Integration",
  },
  {
    Input:
      'key: gadget, level: 1, key: Smartphones, level: 2, key: Google, level: 3, key: Pixel 5a, level: 4',
    Response:
      'Question: text: Why would you opt for the Pixel 5a?, level: 5, Answers: Affordable Price, Compact Size, Reliable Camera',
  },
  {
    Input:
      'key: gadget, level: 1, key: Laptops, level: 2, key: Lenovo, level: 3, key: Yoga, level: 4',
    Response:
      'Question: text: What attracts you to the Lenovo Yoga series?, level: 5, Answers: 2-in-1 Flexibility, Touchscreen Features, Premium Build',
  },
  {
    Input:
      'key: gadget, level: 1, key: Laptops, level: 2, key: Lenovo, level: 3, key: Legion, level: 4',
    Response:
      "Question: text: Why do you like Lenovo's Legion series?, level: 5, Answers: Gaming Performance, Cooling System, RGB Lighting",
  },
  {
    Input:
      'key: gadget, level: 1, key: Smartwatches, level: 2, key: Fitbit, level: 3, key: Fitbit Versa, level: 4',
    Response:
      'Question: text: What stands out to you in the Fitbit Versa series?, level: 5, Answers: Versatile Design, Comprehensive Health Tracking, Long Battery Life',
  },
  {
    Input:
      'key: gadget, level: 1, key: Smartwatches, level: 2, key: Fitbit, level: 3, key: Fitbit Luxe, level: 4',
    Response:
      'Question: text: Why would you choose Fitbit Luxe?, level: 5, Answers: Sleek Design, Stress Management, Sleep Tracking',
  },

  //music
  //tree 1
  {
    Input: 'key: music, level: 1',
    Response:
      'Question: text: What type of music do you prefer?, level: 2, Answers: Classical, Rock, Jazz',
  },
  {
    Input:
      'key: music, level: 1, key: Classical, level: 2',
    Response:
      'Question: text: Which classical composer do you admire the most?, level: 3, Answers: Beethoven, Mozart, Bach',
  },
  {
    Input:
      'key: music, level: 1, key: Classical, level: 2, key: Beethoven, level: 3',
    Response:
      'Question: text: Which of Beethoven’s works is your favorite?, level: 4, Answers: Symphony No.5, Moonlight Sonata, Für Elise',
  },
  {
    Input:
      'key: music, level: 1, key: Classical, level: 2, key: Beethoven, level: 3, key: Symphony No.5, level: 4',
    Response:
      'Question: text: Do you enjoy the entire symphony or a specific movement?, level: 5, Answers: Entire Symphony, First Movement, Second Movement',
  },
  {
    Input:
      'key: music, level: 1, key: Rock, level: 2',
    Response:
      'Question: text: Which rock band do you admire the most?, level: 3, Answers: The Beatles, Led Zeppelin, Pink Floyd',
  },
  {
    Input:
      'key: music, level: 1, key: Rock, level: 2, key: The Beatles, level: 3',
    Response:
      'Question: text: Which Beatles’ album is your favorite?, level: 4, Answers: Abbey Road, The White Album, Sgt. Pepper’s Lonely Hearts Club Band',
  },
  {
    Input:
      'key: music, level: 1, key: Rock, level: 2, key: The Beatles, level: 3, key: Abbey Road, level: 4',
    Response:
      'Question: text: Which song from Abbey Road do you love the most?, level: 5, Answers: Come Together, Here Comes the Sun, Something',
  },
  {
    Input:
      'key: music, level: 1, key: Jazz, level: 2',
    Response:
      'Question: text: Which jazz artist do you admire the most?, level: 3, Answers: Miles Davis, Ella Fitzgerald, Louis Armstrong',
  },
  {
    Input:
      'key: music, level: 1, key: Jazz, level: 2, key: Miles Davis, level: 3',
    Response:
      'Question: text: Which of Miles Davis’s albums is your favorite?, level: 4, Answers: Kind of Blue, Bitches Brew, Birth of the Cool',
  },
  {
    Input:
      'key: music, level: 1, key: Jazz, level: 2, key: Miles Davis, level: 3, key: Kind of Blue, level: 4',
    Response:
      'Question: text: Which track from Kind of Blue do you love the most?, level: 5, Answers: So What, Freddie Freeloader, Blue in Green',
  },
  {
    Input:
      'key: music, level: 1, key: Classical, level: 2, key: Mozart, level: 3',
    Response:
      'Question: text: Which of Mozart’s works is your favorite?, level: 4, Answers: Symphony No. 40, The Magic Flute, Requiem',
  },
  {
    Input:
      'key: music, level: 1, key: Classical, level: 2, key: Bach, level: 3',
    Response:
      'Question: text: Which of Bach’s compositions do you admire the most?, level: 4, Answers: The Brandenburg Concertos, The Well-Tempered Clavier, Mass in B Minor',
  },
  {
    Input:
      'key: music, level: 1, key: Rock, level: 2, key: Led Zeppelin, level: 3',
    Response:
      'Question: text: Which Led Zeppelin album is your favorite?, level: 4, Answers: Led Zeppelin IV, Physical Graffiti, Houses of the Holy',
  },
  {
    Input:
      'key: music, level: 1, key: Rock, level: 2, key: Pink Floyd, level: 3',
    Response:
      'Question: text: Which Pink Floyd album do you enjoy the most?, level: 4, Answers: Dark Side of the Moon, The Wall, Wish You Were Here',
  },
  {
    Input:
      'key: music, level: 1, key: Jazz, level: 2, key: Ella Fitzgerald, level: 3',
    Response:
      'Question: text: Which Ella Fitzgerald song do you love the most?, level: 4, Answers: Summertime, Cry Me a River, Dream a Little Dream of Me',
  },
  {
    Input:
      'key: music, level: 1, key: Jazz, level: 2, key: Louis Armstrong, level: 3',
    Response:
      'Question: text: Which Louis Armstrong song resonates with you the most?, level: 4, Answers: What a Wonderful World, Hello, Dolly!, When the Saints Go Marching In',
  },
  {
    Input:
      'key: music, level: 1, key: Classical, level: 2, key: Mozart, level: 3, key: Symphony No. 40, level: 4',
    Response:
      'Question: text: What part of Symphony No. 40 do you find the most captivating?, level: 5, Answers: First Movement, Second Movement, Finale',
  },
  {
    Input:
      'key: music, level: 1, key: Classical, level: 2, key: Mozart, level: 3, key: The Magic Flute, level: 4',
    Response:
      'Question: text: Who is your favorite character from The Magic Flute?, level: 5, Answers: Tamino, Pamina, Queen of the Night',
  },
  {
    Input:
      'key: music, level: 1, key: Classical, level: 2, key: Mozart, level: 3, key: Requiem, level: 4',
    Response:
      'Question: text: Which section of the Requiem resonates most with you?, level: 5, Answers: Dies Irae, Lacrimosa, Kyrie Eleison',
  },
  {
    Input:
      'key: music, level: 1, key: Classical, level: 2, key: Bach, level: 3, key: The Brandenburg Concertos, level: 4',
    Response:
      'Question: text: Which of the Brandenburg Concertos do you prefer?, level: 5, Answers: No. 1 in F Major, No. 3 in G Major, No. 5 in D Major',
  },
  {
    Input:
      'key: music, level: 1, key: Classical, level: 2, key: Bach, level: 3, key: The Well-Tempered Clavier, level: 4',
    Response:
      'Question: text: Do you have a preference between Book I and Book II of The Well-Tempered Clavier?, level: 5, Answers: Book I, Book II, Both are excellent',
  },
  {
    Input:
      'key: music, level: 1, key: Classical, level: 2, key: Bach, level: 3, key: Mass in B Minor, level: 4',
    Response:
      'Question: text: Which section of the Mass in B Minor do you find the most touching?, level: 5, Answers: Kyrie, Gloria, Credo',
  },
  {
    Input:
      'key: music, level: 1, key: Rock, level: 2, key: Led Zeppelin, level: 3, key: Led Zeppelin IV, level: 4',
    Response:
      'Question: text: What song from Led Zeppelin IV stands out to you the most?, level: 5, Answers: Stairway to Heaven, Black Dog, Rock and Roll',
  },
  {
    Input:
      'key: music, level: 1, key: Rock, level: 2, key: Led Zeppelin, level: 3, key: Physical Graffiti, level: 4',
    Response:
      'Question: text: Which side of the Physical Graffiti double album do you enjoy more?, level: 5, Answers: First LP, Second LP',
  },
  {
    Input:
      'key: music, level: 1, key: Rock, level: 2, key: Led Zeppelin, level: 3, key: Houses of the Holy, level: 4',
    Response:
      'Question: text: Which track from Houses of the Holy is your go-to?, level: 5, Answers: The Rain Song, No Quarter, Over the Hills and Far Away',
  },
  {
    Input:
      'key: music, level: 1, key: Rock, level: 2, key: Pink Floyd, level: 3, key: Dark Side of the Moon, level: 4',
    Response:
      'Question: text: Which track from Dark Side of the Moon takes you on a journey?, level: 5, Answers: Time, Money, Us and Them',
  },
  {
    Input:
      'key: music, level: 1, key: Rock, level: 2, key: Pink Floyd, level: 3, key: The Wall, level: 4',
    Response:
      'Question: text: Which part of The Wall do you connect with most?, level: 5, Answers: Another Brick in the Wall, Comfortably Numb, Hey You',
  },
  {
    Input:
      'key: music, level: 1, key: Rock, level: 2, key: Pink Floyd, level: 3, key: Wish You Were Here, level: 4',
    Response:
      'Question: text: What song from Wish You Were Here speaks to you the most?, level: 5, Answers: Shine On You Crazy Diamond, Welcome to the Machine, Have a Cigar',
  },
  {
    Input:
      'key: music, level: 1, key: Jazz, level: 2, key: Ella Fitzgerald, level: 3, key: Summertime, level: 4',
    Response:
      'Question: text: What emotion does Summertime evoke in you?, level: 5, Answers: Joy, Nostalgia, Relaxation',
  },
  {
    Input:
      'key: music, level: 1, key: Jazz, level: 2, key: Ella Fitzgerald, level: 3, key: Cry Me a River, level: 4',
    Response:
      'Question: text: How do you feel when you listen to Cry Me a River?, level: 5, Answers: Empathetic, Melancholic, Enthralled',
  },
  {
    Input:
      'key: music, level: 1, key: Jazz, level: 2, key: Ella Fitzgerald, level: 3, key: Dream a Little Dream of Me, level: 4',
    Response:
      'Question: text: What setting do you imagine when you hear Dream a Little Dream of Me?, level: 5, Answers: Romantic Dinner, Cozy Bedroom, Starry Night Outdoors',
  },
  {
    Input:
      'key: music, level: 1, key: Jazz, level: 2, key: Louis Armstrong, level: 3, key: What a Wonderful World, level: 4',
    Response:
      'Question: text: What does What a Wonderful World make you appreciate?, level: 5, Answers: Nature, Human Connections, Life in General',
  },
  {
    Input:
      'key: music, level: 1, key: Jazz, level: 2, key: Louis Armstrong, level: 3, key: Hello, Dolly!, level: 4',
    Response:
      'Question: text: How does Hello, Dolly! make you feel?, level: 5, Answers: Jubilant, Sentimental, Energized',
  },
  {
    Input:
      'key: music, level: 1, key: Jazz, level: 2, key: Louis Armstrong, level: 3, key: When the Saints Go Marching In, level: 4',
    Response:
      'Question: text: What setting do you envision when you listen to When the Saints Go Marching In?, level: 5, Answers: A Parade, A Church, A Festival',
  },

  //automobile
  //tree 1
  {
    Input: 'key: automobile, level: 1',
    Response:
      'Question: text: What type of automobile interests you the most?, level: 2, Answers: Cars, Motorcycles, Trucks',
  },
  {
    Input:
      'key: automobile, level: 1, key: Cars, level: 2',
    Response:
      'Question: text: Which car segment are you interested in?, level: 3, Answers: Sedan, SUV, Sports Car',
  },
  {
    Input:
      'key: automobile, level: 1, key: Cars, level: 2, key: Sedan, level: 3',
    Response:
      'Question: text: Which brand of sedan do you prefer?, level: 4, Answers: Toyota, Honda, BMW',
  },
  {
    Input:
      'key: automobile, level: 1, key: Cars, level: 2, key: Sedan, level: 3, key: Toyota, level: 4',
    Response:
      'Question: text: Which model of Toyota sedan do you prefer?, level: 5, Answers: Camry, Corolla, Avalon',
  },
  {
    Input:
      'key: automobile, level: 1, key: Cars, level: 2, key: SUV, level: 3',
    Response:
      'Question: text: Which brand of SUV do you prefer?, level: 4, Answers: Jeep, Ford, Mercedes',
  },
  {
    Input:
      'key: automobile, level: 1, key: Cars, level: 2, key: SUV, level: 3, key: Jeep, level: 4',
    Response:
      'Question: text: Which model of Jeep SUV do you like?, level: 5, Answers: Wrangler, Cherokee, Grand Cherokee',
  },
  {
    Input:
      'key: automobile, level: 1, key: Motorcycles, level: 2',
    Response:
      'Question: text: Which type of motorcycle are you interested in?, level: 3, Answers: Cruiser, Sport, Touring',
  },
  {
    Input:
      'key: automobile, level: 1, key: Motorcycles, level: 2, key: Cruiser, level: 3',
    Response:
      'Question: text: Which brand of cruiser motorcycles do you prefer?, level: 4, Answers: Harley-Davidson, Indian, Honda',
  },
  {
    Input:
      'key: automobile, level: 1, key: Motorcycles, level: 2, key: Cruiser, level: 3, key: Harley-Davidson, level: 4',
    Response:
      'Question: text: Which model of Harley cruiser do you like?, level: 5, Answers: Fat Boy, Softail, Roadster',
  },
  {
    Input:
      'key: automobile, level: 1, key: Trucks, level: 2',
    Response:
      "Question: text: What's your primary use for a truck?, level: 3, Answers: Hauling, Off-roading, Work",
  },
  {
    Input:
      'key: automobile, level: 1, key: Trucks, level: 2, key: Hauling, level: 3',
    Response:
      'Question: text: Which brand of hauling trucks do you prefer?, level: 4, Answers: Ford, Chevrolet, Dodge',
  },
  {
    Input:
      'key: automobile, level: 1, key: Trucks, level: 2, key: Hauling, level: 3, key: Ford, level: 4',
    Response:
      'Question: text: Which model of Ford hauling truck do you prefer?, level: 5, Answers: F-150, Ranger, F-350',
  },
  {
    Input:
      'key: automobile, level: 1, key: Cars, level: 2, key: Sedan, level: 3, key: Honda, level: 4',
    Response:
      'Question: text: Which model of Honda sedan do you prefer?, level: 5, Answers: Civic, Accord, Insight',
  },
  {
    Input:
      'key: automobile, level: 1, key: Cars, level: 2, key: Sedan, level: 3, key: BMW, level: 4',
    Response:
      'Question: text: Which model of BMW sedan do you prefer?, level: 5, Answers: 3-Series, 5-Series, 7-Series',
  },
  {
    Input:
      'key: automobile, level: 1, key: Cars, level: 2, key: SUV, level: 3, key: Ford, level: 4',
    Response:
      'Question: text: Which model of Ford SUV do you like?, level: 5, Answers: Escape, Bronco, Explorer',
  },
  {
    Input:
      'key: automobile, level: 1, key: Cars, level: 2, key: SUV, level: 3, key: Mercedes, level: 4',
    Response:
      'Question: text: Which model of Mercedes SUV do you prefer?, level: 5, Answers: GLA, GLC, GLE',
  },
  {
    Input:
      'key: automobile, level: 1, key: Motorcycles, level: 2, key: Sport, level: 3',
    Response:
      'Question: text: Which brand of sport motorcycles do you prefer?, level: 4, Answers: Yamaha, Kawasaki, Ducati',
  },
  {
    Input:
      'key: automobile, level: 1, key: Motorcycles, level: 2, key: Sport, level: 3, key: Yamaha, level: 4',
    Response:
      'Question: text: Which model of Yamaha sport motorcycle do you like?, level: 5, Answers: YZF-R1, MT-10, YZF-R6',
  },
  {
    Input:
      'key: automobile, level: 1, key: Motorcycles, level: 2, key: Touring, level: 3',
    Response:
      'Question: text: Which brand of touring motorcycles do you prefer?, level: 4, Answers: Honda, BMW, Suzuki',
  },
  {
    Input:
      'key: automobile, level: 1, key: Motorcycles, level: 2, key: Touring, level: 3, key: Honda, level: 4',
    Response:
      'Question: text: Which model of Honda touring motorcycle do you prefer?, level: 5, Answers: Gold Wing, ST1300, CTX1300',
  },
  {
    Input:
      'key: automobile, level: 1, key: Trucks, level: 2, key: Off-roading, level: 3',
    Response:
      'Question: text: Which brand of off-roading trucks do you prefer?, level: 4, Answers: Jeep, Toyota, Land Rover',
  },
  {
    Input:
      'key: automobile, level: 1, key: Trucks, level: 2, key: Off-roading, level: 3, key: Jeep, level: 4',
    Response:
      'Question: text: Which model of Jeep off-roading truck do you like?, level: 5, Answers: Gladiator, Wrangler Rubicon, Comanche',
  },
  {
    Input:
      'key: automobile, level: 1, key: Trucks, level: 2, key: Work, level: 3',
    Response:
      'Question: text: Which brand of work trucks do you prefer?, level: 4, Answers: GMC, Ram, Isuzu',
  },
  {
    Input:
      'key: automobile, level: 1, key: Trucks, level: 2, key: Work, level: 3, key: GMC, level: 4',
    Response:
      'Question: text: Which model of GMC work truck do you prefer?, level: 5, Answers: Sierra 1500, Sierra 2500HD, Sierra 3500HD',
  },
];
