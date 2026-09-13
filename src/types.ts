export type CategoryId = 'all' | 'combo' | 'decks' | 'visuals' | 'engines' | 'snacks';

export interface PortionOption {
  id: 'regular' | 'medium' | 'jumbo';
  name: string;
  description: string;
  readingTimeModifier: string;
  badge: string;
}

export interface CondimentOption {
  id: string;
  name: string;
  description: string;
  biasTarget: string;
}

export interface FileFormatOption {
  id: 'html' | 'md' | 'bundle';
  name: string;
  extension: string;
  description: string;
}

export interface MenuItem {
  id: string;
  title: string;
  subtitle: string;
  foodName: string;
  foodType: 'burger' | 'fries' | 'combo' | 'drink' | 'dessert' | 'nuggets';
  categoryId: CategoryId;
  priceDisplay: string;
  originalPrice: string;
  cognitiveCalories: number; // e.g. 150 kkal = 15 minutes of focus
  estimatedMinutes: number;
  description: string;
  tasteNotes: string; // Analogi rasa dengan konsep bias
  includedBiases: string[];
  cognitiveNutrition: {
    protein: string;   // Pemahaman Teori
    carbs: string;     // Kerangka Kerja Praktis
    fat: string;       // Kompleksitas
    fiber: string;     // Nilai Manfaat
  };
  filePath: string;
  fileName: string;
  fileSize: string;
  featured?: boolean;
  popularRank?: number;
  availablePortions: PortionOption[];
  availableCondiments: CondimentOption[];
  rawHtmlContent?: string;
}

export interface OrderItemCustomization {
  portion: PortionOption;
  selectedCondiments: string[];
  format: FileFormatOption;
  spiceLevel: 'mild' | 'medium' | 'spicy';
  customNotes?: string;
}

export interface CartItem {
  cartItemId: string;
  item: MenuItem;
  customization: OrderItemCustomization;
  quantity: number;
  addedAt: Date;
}

export interface BiasAnalogy {
  id: string;
  restaurantElement: string;
  fastFoodTactic: string;
  biasConcept: string;
  scientificTerm: string;
  explanation: string;
  realWorldExample: string;
  practicalTakeaway: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  suggestedMenuId?: string;
  biasVerdict?: string;
  ngeyelScore?: number;
  isNudgeAlert?: boolean;
  moodAtTime?: 'calm' | 'suspicious' | 'impatient' | 'boiling';
  actionType?: 'download_all' | 'open_cart';
}

