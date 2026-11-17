export type Lang = "en" | "bn";
type L = { en: string; bn: string };
export type WorkflowField = { id: string; label: L; placeholder: L; required?: boolean; options?: L[] };
export type Workflow = { id: "business" | "image" | "video" | "audio"; title: L; hint: L; fields: WorkflowField[]; template: L[] };

const l = (en: string, bn: string): L => ({ en, bn });

export const WORKFLOWS: Workflow[] = [
  {
    id: "business",
    title: l("Business idea builder", "ব্যবসায়িক আইডিয়া তৈরি"),
    hint: l("Idea → plan → AI product", "আইডিয়া → পরিকল্পনা → এআই প্রোডাক্ট"),
    fields: [
      { id: "skill", label: l("Your skill or interest", "আপনার দক্ষতা বা আগ্রহ"), placeholder: l("e.g. tailoring, teaching, farming", "যেমন: দর্জি, শিক্ষকতা, কৃষি"), required: true },
      { id: "budget", label: l("Starting budget", "শুরুর বাজেট"), placeholder: l("e.g. ৳50,000", "যেমন: ৳৫০,০০০"), options: [l("Under ৳50,000", "৳৫০,০০০-এর কম"), l("৳50,000 – ৳5 Lakh", "৳৫০,০০০ – ৳৫ লাখ"), l("Over ৳5 Lakh", "৳৫ লাখের বেশি")] },
      { id: "customers", label: l("Who are your customers?", "আপনার গ্রাহক কারা?"), placeholder: l("e.g. students in Dhaka", "যেমন: ঢাকার শিক্ষার্থী") },
      { id: "location", label: l("City or district", "শহর বা জেলা"), placeholder: l("e.g. Dhaka", "যেমন: ঢাকা") },
    ],
    template: [l("3 idea options (one line each)", "৩টি আইডিয়া (প্রতিটি এক লাইনে)"), l("Best idea & why", "সেরা আইডিয়া ও কেন"), l("Target customers", "লক্ষ্য গ্রাহক"), l("AI product to build", "কোন এআই প্রোডাক্ট বানাবেন"), l("Automation opportunities", "অটোমেশনের সুযোগ"), l("Estimated BDT startup cost", "আনুমানিক শুরুর খরচ (৳)"), l("How AI HUB BD can help", "AI HUB BD কীভাবে সাহায্য করবে"), l("Next 3 steps", "পরবর্তী ৩টি ধাপ")],
  },
  {
    id: "image",
    title: l("Image prompt builder", "ইমেজ প্রম্পট তৈরি"),
    hint: l("Logo, product or social post", "লোগো, প্রোডাক্ট বা সোশ্যাল পোস্ট"),
    fields: [
      { id: "type", label: l("Image type", "ছবির ধরন"), placeholder: l("Logo", "লোগো"), required: true, options: [l("Logo", "লোগো"), l("Product photo", "প্রোডাক্ট ছবি"), l("Social media post", "সোশ্যাল মিডিয়া পোস্ট"), l("Poster", "পোস্টার")] },
      { id: "subject", label: l("What should it show?", "ছবিতে কী থাকবে?"), placeholder: l("e.g. a tea brand called Cha Bari", "যেমন: চা বাড়ি নামের চা ব্র্যান্ড"), required: true },
      { id: "style", label: l("Style", "স্টাইল"), placeholder: l("Modern", "আধুনিক"), options: [l("Modern & minimal", "আধুনিক ও মিনিমাল"), l("Traditional Bangladeshi", "ঐতিহ্যবাহী বাংলাদেশি"), l("Photorealistic", "বাস্তবধর্মী"), l("Playful cartoon", "কার্টুন")] },
      { id: "colors", label: l("Colours", "রং"), placeholder: l("e.g. green and gold", "যেমন: সবুজ ও সোনালি") },
    ],
    template: [l("3 ready-to-copy image prompts (subject, style, colours, lighting, composition)", "কপি করার উপযোগী ৩টি ইমেজ প্রম্পট (বিষয়, স্টাইল, রং, আলো, বিন্যাস)"), l("Recommended size/aspect ratio", "প্রস্তাবিত সাইজ/অনুপাত"), l("Text to place on the image (if any)", "ছবিতে বসানোর লেখা (যদি থাকে)"), l("What to avoid", "যা এড়িয়ে চলবেন"), l("How to create it at AI HUB BD", "AI HUB BD-তে কীভাবে বানাবেন")],
  },
  {
    id: "video",
    title: l("Video storyboard", "ভিডিও স্টোরিবোর্ড"),
    hint: l("Scenes, voiceover, captions", "দৃশ্য, ভয়েসওভার, ক্যাপশন"),
    fields: [
      { id: "product", label: l("Product or message", "প্রোডাক্ট বা বার্তা"), placeholder: l("e.g. new online bakery", "যেমন: নতুন অনলাইন বেকারি"), required: true },
      { id: "length", label: l("Length", "দৈর্ঘ্য"), placeholder: l("30 seconds", "৩০ সেকেন্ড"), options: [l("15 seconds", "১৫ সেকেন্ড"), l("30 seconds", "৩০ সেকেন্ড"), l("60 seconds", "৬০ সেকেন্ড")] },
      { id: "platform", label: l("Platform", "প্ল্যাটফর্ম"), placeholder: l("Facebook", "ফেসবুক"), options: [l("Facebook / Instagram Reels", "ফেসবুক / ইনস্টাগ্রাম রিলস"), l("YouTube", "ইউটিউব"), l("TikTok", "টিকটক"), l("TV / screen", "টিভি / স্ক্রিন")] },
      { id: "audience", label: l("Audience", "দর্শক"), placeholder: l("e.g. young families", "যেমন: তরুণ পরিবার") },
    ],
    template: [l("Hook (first 3 seconds)", "হুক (প্রথম ৩ সেকেন্ড)"), l("Storyboard table: Scene | Time | Visual | Voiceover | On-screen text", "স্টোরিবোর্ড টেবিল: দৃশ্য | সময় | ভিজ্যুয়াল | ভয়েসওভার | স্ক্রিনের লেখা"), l("Call to action", "কল টু অ্যাকশন"), l("Music mood", "মিউজিকের মুড"), l("Production tips for the AI HUB BD studio", "AI HUB BD স্টুডিওর প্রোডাকশন টিপস")],
  },
  {
    id: "audio",
    title: l("Audio jingle writer", "অডিও জিঙ্গেল লেখক"),
    hint: l("Jingle, radio ad or podcast intro", "জিঙ্গেল, রেডিও বিজ্ঞাপন বা পডকাস্ট ইন্ট্রো"),
    fields: [
      { id: "brand", label: l("Brand name", "ব্র্যান্ডের নাম"), placeholder: l("e.g. Cha Bari", "যেমন: চা বাড়ি"), required: true },
      { id: "format", label: l("Format", "ধরন"), placeholder: l("Jingle", "জিঙ্গেল"), options: [l("Jingle", "জিঙ্গেল"), l("Radio ad", "রেডিও বিজ্ঞাপন"), l("Podcast intro", "পডকাস্ট ইন্ট্রো")] },
      { id: "mood", label: l("Mood", "মেজাজ"), placeholder: l("Happy", "আনন্দময়"), options: [l("Happy & upbeat", "আনন্দময়"), l("Calm & trustworthy", "শান্ত ও বিশ্বস্ত"), l("Energetic", "উদ্যমী"), l("Emotional", "আবেগময়")] },
      { id: "message", label: l("Key message", "মূল বার্তা"), placeholder: l("e.g. fresh tea delivered in 20 minutes", "যেমন: ২০ মিনিটে তাজা চা") },
    ],
    template: [l("Lyrics or script with timing marks", "সময়সহ লিরিক্স বা স্ক্রিপ্ট"), l("Catchy tagline", "আকর্ষণীয় ট্যাগলাইন"), l("Voice style & tempo (BPM)", "কণ্ঠের ধরন ও টেম্পো (BPM)"), l("Instruments / sound design", "বাদ্যযন্ত্র / সাউন্ড ডিজাইন"), l("Short 10-second version", "১০ সেকেন্ডের ছোট সংস্করণ"), l("Recording tips at AI HUB BD", "AI HUB BD-তে রেকর্ডিং টিপস")],
  },
];

export function missingFields(w: Workflow, values: Record<string, string>) {
  return w.fields.filter((f) => f.required && !values[f.id]?.trim()).map((f) => f.id);
}

/** Builds the structured request sent to the concierge for a completed workflow. */
export function buildWorkflowPrompt(w: Workflow, values: Record<string, string>, lang: Lang) {
  const inputs = w.fields
    .filter((f) => values[f.id]?.trim())
    .map((f) => `- ${f.label[lang]}: ${values[f.id]!.trim()}`)
    .join("\n");
  const sections = w.template.map((s, i) => `${i + 1}. **${s[lang]}**`).join("\n");
  return `${lang === "bn" ? "ধাপে ধাপে কাজ" : "Guided workflow"}: ${w.title[lang]}\n\n${inputs}\n\n${lang === "bn" ? "এই কাঠামোয় বাংলায় উত্তর দিন:" : "Reply using exactly these sections:"}\n${sections}`;
}
