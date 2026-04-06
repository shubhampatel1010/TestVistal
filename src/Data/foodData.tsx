export const greenFoodCategories: { id: FoodCategory; label: string; icon: string }[] = [
  { id: "animal_protein", label: "Animal Protein", icon: "🍗" },
  { id: "vegetable_protein", label: "Vegetable Protein", icon: "🌱" },
  { id: "dairy", label: "Dairy", icon: "🥛" },
  { id: "fats", label: "Healthy Fats", icon: "🥑" },
  { id: "nuts_seeds", label: "Nuts & Seeds", icon: "🌰" },
  { id: "vegetables", label: "Vegetables", icon: "🥦" },
];

export const greenFoods: GreenFood[] = [
  // ANIMAL PROTEIN
  { id: "eggs", name: "All Eggs", category: "animal_protein", icon: "🥚" },
  { id: "meats_poultry_game", name: "All Meats, Poultry & Game", category: "animal_protein", icon: "🍗" },
  { id: "cured_meats", name: "Natural & Cured Meats", category: "animal_protein", icon: "🥓", description: "Pancetta, parma ham, coppa etc" },
  { id: "sausages", name: "Natural & Cured Sausages", category: "animal_protein", icon: "🌭", description: "Salami, chorizo etc" },
  { id: "seafood", name: "Seafood", category: "animal_protein", icon: "🐟", description: "All except swordfish & tilefish" },

  // VEGETABLE PROTEIN
  { id: "protein_powder", name: "Protein Powder", category: "vegetable_protein", icon: "🥤" },
  { id: "tempeh", name: "Tempeh", category: "vegetable_protein", icon: "🧊" },
  { id: "plant_protein", name: "Plant/Whey Protein", category: "vegetable_protein", icon: "🥤" },

  // DAIRY
  { id: "cottage_cheese", name: "Cottage Cheese", category: "dairy", icon: "🧀" },
  { id: "cream", name: "Cream", category: "dairy", icon: "🥛" },
  { id: "cream_cheese", name: "Cream Cheese", category: "dairy", icon: "🧀" },
  { id: "greek_yoghurt", name: "Full-Cream Greek Yoghurt", category: "dairy", icon: "🥣" },
  { id: "full_cream_milk", name: "Full-Cream Milk", category: "dairy", icon: "🥛" },
  { id: "hard_cheeses", name: "Hard Cheeses", category: "dairy", icon: "🧀" },
  { id: "soft_cheeses", name: "Soft Cheeses", category: "dairy", icon: "🧀" },

  // FATS
  { id: "animal_fat", name: "Rendered Animal Fat", category: "fats", icon: "🥩" },
  { id: "avocado_oil", name: "Avocado Oil", category: "fats", icon: "🥑" },
  { id: "butter", name: "Butter", category: "fats", icon: "🧈" },
  { id: "cheese_firm", name: "Firm Natural Aged Cheeses", category: "fats", icon: "🧀" },
  { id: "coconut_oil", name: "Coconut Oil", category: "fats", icon: "🥥" },
  { id: "duck_fat", name: "Duck Fat", category: "fats", icon: "🦆" },
  { id: "ghee", name: "Ghee", category: "fats", icon: "🧈" },
  { id: "lard", name: "Lard", category: "fats", icon: "🥓" },
  { id: "macadamia_oil", name: "Macadamia Oil", category: "fats", icon: "🌰" },
  { id: "mayonnaise", name: "Mayonnaise (Full Fat Only)", category: "fats", icon: "🥫" },

  // NUTS & SEEDS
  { id: "almonds", name: "Almonds", category: "nuts_seeds", icon: "🌰" },
  { id: "flaxseeds", name: "Flaxseeds", category: "nuts_seeds", icon: "🌾" },
  { id: "macadamia_nuts", name: "Macadamia Nuts", category: "nuts_seeds", icon: "🌰" },
  { id: "pecan_nuts", name: "Pecan Nuts", category: "nuts_seeds", icon: "🌰" },
  { id: "pine_nuts", name: "Pine Nuts", category: "nuts_seeds", icon: "🌰" },
  { id: "pumpkin_seeds", name: "Pumpkin Seeds", category: "nuts_seeds", icon: "🎃" },
  { id: "sunflower_seeds", name: "Sunflower Seeds", category: "nuts_seeds", icon: "🌻" },
  { id: "walnuts", name: "Walnuts", category: "nuts_seeds", icon: "🌰" },

  // VEGETABLES
  { id: "leafy_greens", name: "Green Leafy Vegetables", category: "vegetables", icon: "🥬", description: "Spinach, cabbage, lettuce etc" },
  { id: "above_ground_vegetables", name: "Above-Ground Vegetables", category: "vegetables", icon: "🥦" },
  { id: "artichoke_hearts", name: "Artichoke Hearts", category: "vegetables", icon: "🌿" },
  { id: "asparagus", name: "Asparagus", category: "vegetables", icon: "🥬" },
  { id: "aubergine", name: "Aubergine", category: "vegetables", icon: "🍆" },
  { id: "avocado", name: "Avocado", category: "vegetables", icon: "🥑" },
  { id: "broccoli", name: "Broccoli", category: "vegetables", icon: "🥦" },
  { id: "brussels_sprouts", name: "Brussels Sprouts", category: "vegetables", icon: "🥬" },
  { id: "cabbage", name: "Cabbage", category: "vegetables", icon: "🥬" },
  { id: "cauliflower", name: "Cauliflower", category: "vegetables", icon: "🥦" },
  { id: "celery", name: "Celery", category: "vegetables", icon: "🥬" },
  { id: "courgettes", name: "Courgettes", category: "vegetables", icon: "🥒" },
  { id: "leeks", name: "Leeks", category: "vegetables", icon: "🧅" },
  { id: "mushrooms", name: "Mushrooms", category: "vegetables", icon: "🍄" },
  { id: "olives", name: "Olives", category: "vegetables", icon: "🫒" },
  { id: "onions", name: "Onions", category: "vegetables", icon: "🧅" },
  { id: "peppers", name: "Peppers", category: "vegetables", icon: "🫑" },
  { id: "pumpkin", name: "Pumpkin", category: "vegetables", icon: "🎃" },
  { id: "radishes", name: "Radishes", category: "vegetables", icon: "🥕" },
  { id: "sauerkraut", name: "Sauerkraut", category: "vegetables", icon: "🥬" },
  { id: "spring_onions", name: "Spring Onions", category: "vegetables", icon: "🧅" },
  { id: "tomatoes", name: "Tomatoes", category: "vegetables", icon: "🍅" },
];

export const orangeFoodCategories: { id: OrangeFoodCategory; label: string; icon: string }[] = [
  { id: "fruits", label: "Fruits", icon: "🍎" },
  { id: "nuts", label: "Nuts", icon: "🥜" },
  { id: "sweeteners", label: "Sweeteners", icon: "🍯" },
  { id: "vegetables", label: "Vegetables", icon: "🥕" },
];

export const orangeFoods: OrangeFood[] = [
  { id: "apples", name: "Apples", category: "fruits", limit: "1.5", icon: "🍎" },
  { id: "bananas", name: "Bananas", category: "fruits", limit: "1 small", icon: "🍌" },
  { id: "blackberries", name: "Blackberries", category: "fruits", limit: "3.5 C", icon: "🫐" },
  { id: "blueberries", name: "Blueberries", category: "fruits", limit: "1.5 C", icon: "🫐" },
  { id: "cherries", name: "Cherries (sweet)", category: "fruits", limit: "1 C", icon: "🍒" },
  { id: "clementines", name: "Clementines", category: "fruits", limit: "3", icon: "🍊" },
  { id: "figs", name: "Figs", category: "fruits", limit: "3 small", icon: "🟣" },
  { id: "gooseberries", name: "Gooseberries", category: "fruits", limit: "1.5 C", icon: "🫐" },
  { id: "grapes", name: "Grapes (green)", category: "fruits", limit: "under 1 C", icon: "🍇" },
  { id: "guavas", name: "Guavas", category: "fruits", limit: "2", icon: "🥝" },
  { id: "kiwi", name: "Kiwi Fruits", category: "fruits", limit: "3", icon: "🥝" },
  { id: "litchis", name: "Litchis", category: "fruits", limit: "1 g", icon: "🍒" },
  { id: "mangos", name: "Mangos (sliced)", category: "fruits", limit: "under 1 C", icon: "🥭" },
  { id: "nectarines", name: "Nectarines", category: "fruits", limit: "2", icon: "🍑" },
  { id: "oranges", name: "Oranges", category: "fruits", limit: "2", icon: "🍊" },
  { id: "pawpaw", name: "Pawpaw", category: "fruits", limit: "1", icon: "🥭" },
  { id: "peaches", name: "Peaches", category: "fruits", limit: "2", icon: "🍑" },
  { id: "pears", name: "Pears (Bartlett)", category: "fruits", limit: "1", icon: "🍐" },
  { id: "pineapple", name: "Pineapple (sliced)", category: "fruits", limit: "1 C", icon: "🍍" },
  { id: "plums", name: "Plums", category: "fruits", limit: "4", icon: "🟣" },
  { id: "pomegranate", name: "Pomegranate", category: "fruits", limit: "½", icon: "🍎" },
  { id: "prickly_pears", name: "Prickly Pears", category: "fruits", limit: "4", icon: "🍐" },
  { id: "quinoas", name: "Quinoas", category: "fruits", limit: "2", icon: "🌾" },
  { id: "raspberries", name: "Raspberries", category: "fruits", limit: "2 C", icon: "🍓" },
  { id: "strawberries", name: "Strawberries", category: "fruits", limit: "25", icon: "🍓" },
  { id: "watermelon", name: "Watermelon", category: "fruits", limit: "2 C", icon: "🍉" },

  { id: "cashews", name: "Cashews (raw)", category: "nuts", limit: "6 T", icon: "🥜" },
  { id: "chestnuts", name: "Chestnuts (raw)", category: "nuts", limit: "1 C", icon: "🌰" },

  { id: "honey", name: "Honey", category: "sweeteners", limit: "1 t", icon: "🍯" },

  { id: "butternut", name: "Butternut", category: "vegetables", limit: "1.5 C", icon: "🎃" },
  { id: "carrots", name: "Carrots", category: "vegetables", limit: "5", icon: "🥕" },
  { id: "sweet_potato", name: "Sweet Potato", category: "vegetables", limit: "0.5 C", icon: "🍠" },
  { id: "asparagus", name: "Asparagus", category: "vegetables", limit: "moderate", icon: "🥬" },
];

export const redFoodCategories: { id: RedFoodCategory; label: string; icon: string }[] = [
  { id: "grains_baked", label: "Baked Goods & Grain-Based Foods", icon: "🍞" },
  { id: "beverages", label: "Beverages", icon: "🥤" },
  { id: "dairy_related", label: "Dairy / Dairy Related", icon: "🍦" },
  { id: "fats", label: "Bad Fats", icon: "🧈" },
  { id: "fruit_veg", label: "Fruit & Vegetable Products", icon: "🧃" },
  { id: "general", label: "Processed / Fast Food", icon: "🍔" },
  { id: "meat", label: "Processed Meats", icon: "🥓" },
  { id: "starchy_vegetables", label: "Starchy Vegetables", icon: "🥔" },
  { id: "sweeteners", label: "Sweeteners", icon: "🍬" },
];

export const redFoods: RedFood[] = [

  // GRAINS & BAKED
  { id: "flours", name: "All Grain Flours", category: "grains_baked", reason: "Wheat, corn, rye, barley, rice flour etc", icon: "🌾" },
  { id: "bread", name: "All Forms of Bread", category: "grains_baked", reason: "High carb", icon: "🍞" },
  { id: "grains", name: "All Grains", category: "grains_baked", reason: "Wheat, oats, barley, rye, quinoa etc", icon: "🌾" },
  { id: "dried_beans", name: "Dried Beans", category: "grains_baked", reason: "High carb", icon: "🫘" },
  { id: "breaded_foods", name: "Breaded or Battered Foods", category: "grains_baked", reason: "High carb coating", icon: "🍗" },
  { id: "brans", name: "Brans", category: "grains_baked", reason: "Grain product", icon: "🌾" },
  { id: "breakfast_cereals", name: "Breakfast Cereals / Muesli / Granola", category: "grains_baked", reason: "High carb", icon: "🥣" },
  { id: "buckwheat", name: "Buckwheat", category: "grains_baked", reason: "Grain carb source", icon: "🌾" },
  { id: "cakes", name: "Cakes, Biscuits, Confectionery", category: "grains_baked", reason: "High sugar & carb", icon: "🍰" },
  { id: "corn_products", name: "Corn Products", category: "grains_baked", reason: "Popcorn, maize, polenta", icon: "🌽" },
  { id: "couscous", name: "Couscous", category: "grains_baked", reason: "Grain based carb", icon: "🍚" },
  { id: "crackers", name: "Crackers & Cracker Breads", category: "grains_baked", reason: "Refined carbs", icon: "🥨" },
  { id: "millet", name: "Millet", category: "grains_baked", reason: "Grain carb", icon: "🌾" },
  { id: "pasta", name: "Pasta & Noodles", category: "grains_baked", reason: "High carb", icon: "🍝" },
  { id: "rice", name: "Rice", category: "grains_baked", reason: "High carb", icon: "🍚" },
  { id: "rice_cakes", name: "Rice Cakes", category: "grains_baked", reason: "Refined carb", icon: "🍘" },
  { id: "sorghum", name: "Sorghum", category: "grains_baked", reason: "Grain carb", icon: "🌾" },
  { id: "spelt", name: "Spelt", category: "grains_baked", reason: "Grain carb", icon: "🌾" },
  { id: "thickeners", name: "Thickening Agents", category: "grains_baked", reason: "Gravy powder, maize starch, stock cubes", icon: "🥣" },

  // BEVERAGES
  { id: "beer", name: "Beer", category: "beverages", reason: "High carb alcohol", icon: "🍺" },
  { id: "cider", name: "Cider", category: "beverages", reason: "High sugar alcohol", icon: "🍎" },
  { id: "fizzy_drinks", name: "Fizzy Drinks", category: "beverages", reason: "Sugary soda drinks", icon: "🥤" },
  { id: "diet_drinks", name: "Diet / Zero / Lite Drinks", category: "beverages", reason: "Artificial sweeteners", icon: "🥤" },

  // DAIRY
  { id: "cheese_spreads", name: "Cheese Spreads", category: "dairy_related", reason: "Processed dairy", icon: "🧀" },
  { id: "coffee_creamers", name: "Coffee Creamers", category: "dairy_related", reason: "Artificial additives", icon: "☕" },
  { id: "almond_milk", name: "Commercial Almond Milk", category: "dairy_related", reason: "Often contains sugars", icon: "🥛" },
  { id: "condensed_milk", name: "Condensed Milk", category: "dairy_related", reason: "High sugar", icon: "🥛" },
  { id: "fat_free", name: "Fat-Free Products", category: "dairy_related", reason: "Low fat products discouraged", icon: "🥛" },
  { id: "ice_cream", name: "Ice Cream", category: "dairy_related", reason: "High sugar", icon: "🍨" },
  { id: "puddings", name: "Puddings", category: "dairy_related", reason: "High sugar", icon: "🍮" },
  { id: "reduced_fat_milk", name: "Reduced-Fat Milk", category: "dairy_related", reason: "Avoid low fat dairy", icon: "🥛" },
  { id: "rice_milk", name: "Rice Milk", category: "dairy_related", reason: "High carb", icon: "🥛" },
  { id: "soy_milk", name: "Soy Milk", category: "dairy_related", reason: "Unfermented soy", icon: "🥛" },

  // FATS
  { id: "seed_oils", name: "Seed Oils", category: "fats", reason: "Safflower, sunflower, canola, corn etc", icon: "🛢️" },
  { id: "chocolate", name: "Chocolate", category: "fats", reason: "High sugar", icon: "🍫" },
  { id: "commercial_sauces", name: "Commercial Sauces & Dressings", category: "fats", reason: "Hidden seed oils", icon: "🥫" },
  { id: "hydrogenated_oils", name: "Hydrogenated Oils & Margarine", category: "fats", reason: "Highly processed fats", icon: "🧈" },

  // FRUIT / VEG PRODUCTS
  { id: "fruit_juice", name: "Fruit Juice", category: "fruit_veg", reason: "Concentrated sugar", icon: "🧃" },
  { id: "vegetable_juice", name: "Vegetable Juice (commercial)", category: "fruit_veg", reason: "High sugar unless homemade green juice", icon: "🧃" },

  // GENERAL
  { id: "fast_food", name: "Fast Food", category: "general", reason: "Highly processed", icon: "🍔" },
  { id: "processed_food", name: "Processed Food", category: "general", reason: "Industrial food products", icon: "🍱" },
  { id: "added_sugar_foods", name: "Foods with Added Sugar", category: "general", reason: "Glucose, dextrose etc", icon: "🍬" },

  // MEAT
  { id: "unfermented_soy", name: "Unfermented Soy Protein", category: "meat", reason: "Vegetarian soy protein", icon: "🫘" },
  { id: "sugar_cured_meats", name: "Sugar-Cured Meats", category: "meat", reason: "Excess sugar curing", icon: "🥓" },
  { id: "vienna_sausages", name: "Vienna Sausages", category: "meat", reason: "Highly processed meat", icon: "🌭" },
  { id: "luncheon_meats", name: "Luncheon Meats", category: "meat", reason: "Processed meat", icon: "🥩" },

  // STARCHY VEGETABLES
  { id: "beetroots", name: "Beetroots", category: "starchy_vegetables", reason: "High carb vegetable", icon: "🥕" },
  { id: "legumes", name: "Legumes", category: "starchy_vegetables", reason: "High carb", icon: "🫘" },
  { id: "parsnips", name: "Parsnips", category: "starchy_vegetables", reason: "High carb", icon: "🥕" },
  { id: "peanuts", name: "Peanuts", category: "starchy_vegetables", reason: "Legume not nut", icon: "🥜" },
  { id: "peas", name: "Peas", category: "starchy_vegetables", reason: "High carb", icon: "🟢" },
  { id: "potatoes", name: "Potatoes", category: "starchy_vegetables", reason: "High starch", icon: "🥔" },

  // SWEETENERS
  { id: "agave", name: "Agave", category: "sweeteners", reason: "High fructose", icon: "🍯" },
  { id: "artificial_sweeteners", name: "Artificial Sweeteners", category: "sweeteners", reason: "Aspartame, sucralose etc", icon: "🧪" },
  { id: "cordials", name: "Cordials", category: "sweeteners", reason: "High sugar drinks", icon: "🥤" },
  { id: "dried_fruit", name: "Dried Fruit", category: "sweeteners", reason: "Concentrated sugar", icon: "🍇" },
  { id: "fructose", name: "Fructose", category: "sweeteners", reason: "Isolated sugar", icon: "🍬" },
  { id: "malt", name: "Malt", category: "sweeteners", reason: "Sugar derivative", icon: "🍯" },
  { id: "sugar", name: "Sugar", category: "sweeteners", reason: "All sugar forms", icon: "🍚" },
  { id: "stevia", name: "Stevia", category: "sweeteners", reason: "Artificial sweetener in program", icon: "🍃" },
  { id: "sugar_pickled", name: "Sugar-Coated / Pickled Foods", category: "sweeteners", reason: "Added sugar", icon: "🥒" },
  { id: "sweets", name: "Sweets", category: "sweeteners", reason: "Candy products", icon: "🍬" },
  { id: "syrups", name: "Syrups", category: "sweeteners", reason: "All sugar syrups", icon: "🍯" },
];