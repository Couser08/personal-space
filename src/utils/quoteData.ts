export interface DailyQuote {
  id: number;
  text: string;
  author: string;
  hinglishMeaning: string;
}

export const DAILY_QUOTES: DailyQuote[] = [
  {
    id: 1,
    text: "Small steps every day lead to big changes over time.",
    author: "James Clear",
    hinglishMeaning: "Roz ke chhote-chhote kadam hi aage chalkar badi kamiyabi bante hain."
  },
  {
    id: 2,
    text: "Focus on the process, not just the outcome.",
    author: "Atomic Habits",
    hinglishMeaning: "Sirf result ki chinta mat karo, roz ke seekhne aur mehnat ke process par dhyan do."
  },
  {
    id: 3,
    text: "Peace comes from within. Do not seek it without.",
    author: "Buddha",
    hinglishMeaning: "Asli sukoon aur shanti aapke andar se aati hai, bahar ki cheezon mein mat dhundho."
  },
  {
    id: 4,
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    hinglishMeaning: "Aage badhne ka sabse bada raaz yahi hai ki pehla kadam bina ruke shuru kar do."
  },
  {
    id: 5,
    text: "Calm mind brings inner strength and self-confidence.",
    author: "Dalai Lama",
    hinglishMeaning: "Shaant dimaag se hi andar ki taqat aur zabardast confidence banta hai."
  },
  {
    id: 6,
    text: "Do what you can, with what you have, where you are.",
    author: "Theodore Roosevelt",
    hinglishMeaning: "Jo resources aaj tumhare paas hain, wahin se apna best dena shuru karo."
  },
  {
    id: 7,
    text: "Consistency is more important than perfection.",
    author: "Marcus Aurelius",
    hinglishMeaning: "Perfect hone se zyada zaroori hai roz lagataar discipline ke sath lage rehna."
  },
  {
    id: 8,
    text: "Your only limit is your mind.",
    author: "Ancient Wisdom",
    hinglishMeaning: "Tumhari asal seema sirf tumhari soch hai, agar dimaag maan le toh sab mumkin hai."
  },
  {
    id: 9,
    text: "Breathe. Let go. And remind yourself that this very moment is the only one you know you have for sure.",
    author: "Oprah Winfrey",
    hinglishMeaning: "Gahri saans lo aur purani fikar chhod do, present moment hi sabse keemti hai."
  },
  {
    id: 10,
    text: "Action is the foundational key to all success.",
    author: "Pablo Picasso",
    hinglishMeaning: "Sirf sochte rehne se kuch nahi hota, action lena hi kamyabi ki asli chaabi hai."
  },
  {
    id: 11,
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi",
    hinglishMeaning: "Zindagi pure dil se jiyo aur seekhna kabhi mat roko."
  },
  {
    id: 12,
    text: "Simplicity is the soul of efficiency.",
    author: "Austin Freeman",
    hinglishMeaning: "Cheezon ko simple rakhna hi sabse tezi aur achhe tareeqe se kaam karne ka tarika hai."
  },
  {
    id: 13,
    text: "In the middle of every difficulty lies opportunity.",
    author: "Albert Einstein",
    hinglishMeaning: "Har mushkil ke andar hi ek naya mauka aur rasta chhupa hota hai."
  },
  {
    id: 14,
    text: "Quiet the mind, and the soul will speak.",
    author: "Ma Jaya Sati Bhagavati",
    hinglishMeaning: "Jab dimaag shaant hota hai, tabhi sahi faisle aur clarity milti hai."
  },
  {
    id: 15,
    text: "Great things are done by a series of small things brought together.",
    author: "Vincent Van Gogh",
    hinglishMeaning: "Bade kaam hamesha chhote-chhote tasks ko jod kar hi poore hote hain."
  },
  {
    id: 16,
    text: "Patience is not the ability to wait, but the ability to keep a good attitude while waiting.",
    author: "Joyce Meyer",
    hinglishMeaning: "Sabr ka matlab sirf rukna nahi, balki rukte waqt positive mindset rakhna hai."
  },
  {
    id: 17,
    text: "You don't have to be extreme, just consistent.",
    author: "Mindful Living",
    hinglishMeaning: "Ek din mein sab kuch badalne ki zaroorat nahi, bas roz thoda-thoda karte raho."
  },
  {
    id: 18,
    text: "A garden requires patient labor and attention. Plants do not grow merely to satisfy ambitions.",
    author: "Liberty Hyde Bailey",
    hinglishMeaning: "Kamyabi poudhe ki tarah hai, usse roz paani aur dekhbhal chahiye, jaldbazi nahi."
  },
  {
    id: 19,
    text: "He who has a why to live can bear almost any how.",
    author: "Friedrich Nietzsche",
    hinglishMeaning: "Agar aapka maqsad (Why) saaf hai, toh koi bhi mushkil aapko rok nahi sakti."
  },
  {
    id: 20,
    text: "Rest when you're weary. Refresh and renew yourself, your body, your mind.",
    author: "Ralph Marston",
    hinglishMeaning: "Thak jao toh break lo aur recharge karo, par haar mat maano."
  }
];

export function getDailyQuote(): DailyQuote {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  const quoteIndex = dayOfYear % DAILY_QUOTES.length;
  return DAILY_QUOTES[quoteIndex];
}
