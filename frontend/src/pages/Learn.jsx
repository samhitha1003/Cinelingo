import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PronunciationPortal from '../components/PronunciationPortal';
// ─── Web Speech API pronunciation (no API key, works in Chrome) ───────────
const speakKorean = (text, slow = false) => {
window.speechSynthesis.cancel();
const u = new SpeechSynthesisUtterance(text);
u.lang = 'ko-KR';
u.rate = slow ? 0.45 : 0.85;
u.pitch = 1.1;
window.speechSynthesis.speak(u);
};
const speakEnglish = (text) => {
window.speechSynthesis.cancel();
const u = new SpeechSynthesisUtterance(text);
u.lang = 'en-US';
u.rate = 0.9;
window.speechSynthesis.speak(u);
};

// ─────────────────────────────────────────────────────────────────────────────
// SCENE SCRIPT DATA — each video has its ACTUAL curated dialogue/lesson script
// These are the real phrases taught in each YouTube video
// ─────────────────────────────────────────────────────────────────────────────
const SCENE_VIDEOS = [
{
id: 'v1',
youtubeId: 'KXljXfj0Q4c',
title: '안녕하세요! Korean Greetings',
subtitle: 'Your very first Korean conversation',
themeIcon: '👋',
genre: 'Basics',
level: 'beginner',
levelColor: '#4ade80',
context: '📍 Scene: You just arrived in Seoul and meet someone for the first time.',
script: [
{
id: 1,
korean: '안녕하세요!',
romanization: 'An-nyeong-ha-se-yo',
english: 'Hello!',
englishPronunciation: 'ahn-NYONG-hah-seh-yo',
usage: 'Formal polite greeting — use with strangers, elders, anyone you meet',
culturalNote: '🎎 Always bow slightly (15°) when saying this. Shows respect.',
words: [
{ k: '안녕', r: 'an-nyeong', e: 'peace / well-being', pos: 'noun' },
{ k: '하세요', r: 'ha-se-yo', e: 'are you doing? (polite ending)', pos: 'verb ending' },
],
},
{
id: 2,
korean: '저는 [이름]이에요.',
romanization: 'Jeo-neun [name]-i-e-yo.',
english: 'I am [name].',
englishPronunciation: 'JUH-neun [name]-ee-eh-yo',
usage: 'How to introduce your name — fill in your name!',
culturalNote: '💡 저 (jeo) is the humble form of "I" — more polite than 나 (na).',
words: [
{ k: '저는', r: 'jeo-neun', e: 'I (humble) + topic marker', pos: 'pronoun' },
{ k: '이름', r: 'i-reum', e: 'name', pos: 'noun' },
{ k: '이에요', r: 'i-e-yo', e: 'am / is (polite)', pos: 'verb' },
],
},
{
id: 3,
korean: '처음 뵙겠습니다.',
romanization: 'Cheo-eum boep-get-seum-ni-da.',
english: 'Nice to meet you for the first time.',
englishPronunciation: 'CHUH-eum BWEP-get-seum-nee-da',
usage: 'Said ONLY when meeting someone for the first time — very formal',
culturalNote: '🤝 This is the gold standard first-meeting phrase. More formal than 만나서 반갑습니다.',
words: [
{ k: '처음', r: 'cheo-eum', e: 'first time', pos: 'noun' },
{ k: '뵙겠습니다', r: 'boep-get-seum-ni-da', e: 'I humbly see you (honorific)', pos: 'verb' },
],
},
{
id: 4,
korean: '만나서 반갑습니다!',
romanization: 'Man-na-seo ban-gap-seum-ni-da!',
english: 'Nice to meet you!',
englishPronunciation: 'mahn-NAH-suh bahn-GAHP-seum-nee-da',
usage: 'Common and warm way to say "nice to meet you"',
culturalNote: '😊 반갑다 means "glad" — literally "glad to have met you".',
words: [
{ k: '만나서', r: 'man-na-seo', e: 'having met (you)', pos: 'verb' },
{ k: '반갑습니다', r: 'ban-gap-seum-ni-da', e: 'I am glad / pleased', pos: 'adjective' },
],
},
{
id: 5,
korean: '잘 부탁드립니다.',
romanization: 'Jal bu-tak-deu-rim-ni-da.',
english: 'Please take care of me. / I look forward to working with you.',
englishPronunciation: 'jahl boo-TAHK-duh-rim-nee-da',
usage: 'Always said after introducing yourself — crucial phrase!',
culturalNote: '🌸 No direct English equivalent. Said when starting any relationship — school, work, friendship.',
words: [
{ k: '잘', r: 'jal', e: 'well', pos: 'adverb' },
{ k: '부탁', r: 'bu-tak', e: 'request / favor', pos: 'noun' },
{ k: '드립니다', r: 'deu-rim-ni-da', e: 'I humbly give (honorific)', pos: 'verb' },
],
},
{
id: 6,
korean: '감사합니다.',
romanization: 'Gam-sa-ham-ni-da.',
english: 'Thank you. (formal)',
englishPronunciation: 'gahm-SAH-hahm-nee-da',
usage: 'Formal thank you — use with elders, strangers, in formal settings',
culturalNote: '🙏 감사 means "gratitude". 고마워요 (go-ma-wo-yo) is the casual version.',
words: [
{ k: '감사', r: 'gam-sa', e: 'gratitude', pos: 'noun' },
{ k: '합니다', r: 'ham-ni-da', e: 'I do (formal ending)', pos: 'verb' },
],
},
{
id: 7,
korean: '안녕히 가세요.',
romanization: 'An-nyeong-hi ga-se-yo.',
english: 'Goodbye. (said when the other person is LEAVING)',
englishPronunciation: 'ahn-NYONG-hee gah-seh-yo',
usage: 'Said by the person who STAYS to the person who LEAVES',
culturalNote: '👋 Different from 안녕히 계세요 (said by the one leaving to the one staying).',
words: [
{ k: '안녕히', r: 'an-nyeong-hi', e: 'peacefully', pos: 'adverb' },
{ k: '가세요', r: 'ga-se-yo', e: 'please go', pos: 'verb' },
],
},
],
},
{
id: 'v2',
youtubeId: 'eYSH7kLGtGo',
title: '주세요! Ordering Food in Korean',
subtitle: 'Never go hungry in Korea again',
themeIcon: '🍜',
genre: 'Daily Life',
level: 'beginner',
levelColor: '#38bdf8',
context: '📍 Scene: You walk into a Korean restaurant. The waiter approaches.',
script: [
{
id: 1,
korean: '메뉴 주세요.',
romanization: 'Me-nyu ju-se-yo.',
english: 'Please give me the menu.',
englishPronunciation: 'meh-NYOO joo-seh-yo',
usage: 'First thing to say when you sit down',
culturalNote: '📋 주세요 (ju-se-yo) = "please give me" — the most useful Korean phrase for shopping, restaurants, taxis!',
words: [
{ k: '메뉴', r: 'me-nyu', e: 'menu', pos: 'noun' },
{ k: '주세요', r: 'ju-se-yo', e: 'please give me', pos: 'verb' },
],
},
{
id: 2,
korean: '이거 주세요.',
romanization: 'I-geo ju-se-yo.',
english: 'This one, please.',
englishPronunciation: 'ee-GUH joo-seh-yo',
usage: 'Point at the menu and say this — works everywhere!',
culturalNote: '👆 이거 (this) vs 저거 (that, further away). Simplest ordering phrase.',
words: [
{ k: '이거', r: 'i-geo', e: 'this / this one', pos: 'pronoun' },
{ k: '주세요', r: 'ju-se-yo', e: 'please give me', pos: 'verb' },
],
},
{
id: 3,
korean: '얼마예요?',
romanization: 'Eol-ma-ye-yo?',
english: 'How much is it?',
englishPronunciation: 'UL-mah-yeh-yo',
usage: 'Asking the price — in restaurants, shops, markets',
culturalNote: '💰 얼마 = "how much". 얼마예요? works everywhere for prices.',
words: [
{ k: '얼마', r: 'eol-ma', e: 'how much', pos: 'pronoun' },
{ k: '예요', r: 'ye-yo', e: 'is it? (polite)', pos: 'verb' },
],
},
{
id: 4,
korean: '맛있어요!',
romanization: 'Ma-si-sseo-yo!',
english: 'It\'s delicious!',
englishPronunciation: 'mah-SHEE-ssuh-yo',
usage: 'Compliment the food — Koreans LOVE hearing this!',
culturalNote: '😋 Say this to the cook or waiter — it makes their day. 맛없어요 = tastes bad (use carefully!)',
words: [
{ k: '맛', r: 'mat', e: 'taste / flavor', pos: 'noun' },
{ k: '있어요', r: 'i-sseo-yo', e: 'there is / it has', pos: 'verb' },
],
},
{
id: 5,
korean: '물 한 잔 더 주세요.',
romanization: 'Mul han jan deo ju-se-yo.',
english: 'One more glass of water, please.',
englishPronunciation: 'mool hahn jahn DUH joo-seh-yo',
usage: 'Request more water — refills are usually free in Korea',
culturalNote: '🚰 Water is free in Korean restaurants. 더 (deo) = more — add it to any request!',
words: [
{ k: '물', r: 'mul', e: 'water', pos: 'noun' },
{ k: '한', r: 'han', e: 'one', pos: 'number' },
{ k: '잔', r: 'jan', e: 'glass / cup (counter)', pos: 'counter' },
{ k: '더', r: 'deo', e: 'more', pos: 'adverb' },
{ k: '주세요', r: 'ju-se-yo', e: 'please give me', pos: 'verb' },
],
},
{
id: 6,
korean: '안 매워요?',
romanization: 'An mae-wo-yo?',
english: 'Is it not spicy?',
englishPronunciation: 'ahn MEH-wuh-yo',
usage: 'Ask before ordering — Korean food can be very spicy!',
culturalNote: '🌶️ 안 (an) = "not" — place it before any adjective/verb to negate it. Genius!',
words: [
{ k: '안', r: 'an', e: 'not (negation)', pos: 'adverb' },
{ k: '매워요', r: 'mae-wo-yo', e: 'it is spicy', pos: 'adjective' },
],
},
{
id: 7,
korean: '계산해 주세요.',
romanization: 'Gye-san-hae ju-se-yo.',
english: 'The bill, please.',
englishPronunciation: 'gyeh-SAHN-heh joo-seh-yo',
usage: 'Ask for the check when you\'re done eating',
culturalNote: '💳 In Korea, you usually pay at the counter (계산대), not at the table. Watch for the cashier!',
words: [
{ k: '계산', r: 'gye-san', e: 'calculation / payment', pos: 'noun' },
{ k: '해 주세요', r: 'hae ju-se-yo', e: 'please do (it) for me', pos: 'verb' },
],
},
],
},
{
id: 'v3',
youtubeId: 'A4IxJj4eHWM',
title: '얼마예요? Shopping & Numbers',
subtitle: 'Shop at Korean markets like a local',
themeIcon: '🛍️',
genre: 'Daily Life',
level: 'beginner',
levelColor: '#fb923c',
context: '📍 Scene: You\'re at Myeongdong street market in Seoul.',
script: [
{
id: 1,
korean: '이거 얼마예요?',
romanization: 'I-geo eol-ma-ye-yo?',
english: 'How much is this?',
englishPronunciation: 'ee-GUH ul-MAH-yeh-yo',
usage: 'Most important shopping phrase — point and ask!',
culturalNote: '🏷️ Korean won (원) uses large numbers. 1,000원 ≈ $0.75 USD.',
words: [
{ k: '이거', r: 'i-geo', e: 'this one', pos: 'pronoun' },
{ k: '얼마', r: 'eol-ma', e: 'how much', pos: 'pronoun' },
{ k: '예요', r: 'ye-yo', e: 'is it?', pos: 'verb' },
],
},
{
id: 2,
korean: '너무 비싸요.',
romanization: 'Neo-mu bi-ssa-yo.',
english: 'It\'s too expensive.',
englishPronunciation: 'NUH-moo bee-SSA-yo',
usage: 'Say this to start bargaining at markets (not in department stores)',
culturalNote: '💡 너무 = too (much). 너무 비싸요 opens the door to negotiation at traditional markets.',
words: [
{ k: '너무', r: 'neo-mu', e: 'too (much) / very', pos: 'adverb' },
{ k: '비싸요', r: 'bi-ssa-yo', e: 'it is expensive', pos: 'adjective' },
],
},
{
id: 3,
korean: '좀 깎아 주세요.',
romanization: 'Jom kka-kka ju-se-yo.',
english: 'Please give me a discount.',
englishPronunciation: 'jom KA-ka joo-seh-yo',
usage: 'The magic bargaining phrase at traditional markets!',
culturalNote: '🤝 Works in 시장 (traditional markets). Don\'t use in modern shops.',
words: [
{ k: '좀', r: 'jom', e: 'a little / please (softener)', pos: 'adverb' },
{ k: '깎아', r: 'kka-kka', e: 'cut (price)', pos: 'verb' },
{ k: '주세요', r: 'ju-se-yo', e: 'please give me', pos: 'verb' },
],
},
{
id: 4,
korean: '다른 색 있어요?',
romanization: 'Da-reun saek i-sseo-yo?',
english: 'Do you have another color?',
englishPronunciation: 'DAH-reun sek ee-SSUH-yo',
usage: 'Ask for color options when shopping for clothes',
culturalNote: '🎨 색 = color. 빨간색 (red), 파란색 (blue), 검은색 (black), 흰색 (white).',
words: [
{ k: '다른', r: 'da-reun', e: 'different / other', pos: 'adjective' },
{ k: '색', r: 'saek', e: 'color', pos: 'noun' },
{ k: '있어요?', r: 'i-sseo-yo', e: 'do you have? / is there?', pos: 'verb' },
],
},
{
id: 5,
korean: '카드 돼요?',
romanization: 'Ka-deu dwae-yo?',
english: 'Is card (payment) okay?',
englishPronunciation: 'KAH-duh dweh-yo',
usage: 'Ask if they accept credit/debit cards',
culturalNote: '💳 Korea is very card-friendly. Most places accept it, but small stalls may be cash-only.',
words: [
{ k: '카드', r: 'ka-deu', e: 'card (credit/debit)', pos: 'noun' },
{ k: '돼요?', r: 'dwae-yo', e: 'is it okay? / does it work?', pos: 'verb' },
],
},
],
},
{
id: 'v4',
youtubeId: '3pW50cck3-k',
title: '어디예요? Getting Around Seoul',
subtitle: 'Navigate the subway like a local',
themeIcon: '🚇',
genre: 'Travel',
level: 'intermediate',
levelColor: '#a78bfa',
context: '📍 Scene: You need to get from Hongdae to Gangnam on the Seoul Metro.',
script: [
{
id: 1,
korean: '지하철역이 어디예요?',
romanization: 'Ji-ha-cheol-yeo-gi eo-di-ye-yo?',
english: 'Where is the subway station?',
englishPronunciation: 'jee-ha-CHUL-yuk-ee UH-dee-yeh-yo',
usage: 'Essential for navigating Korean cities',
culturalNote: '🚇 Seoul\'s metro is world-class — 9 lines, all signs in Korean and English.',
words: [
{ k: '지하철', r: 'ji-ha-cheol', e: 'subway / underground rail', pos: 'noun' },
{ k: '역', r: 'yeok', e: 'station', pos: 'noun' },
{ k: '이', r: 'i', e: 'subject marker', pos: 'particle' },
{ k: '어디예요?', r: 'eo-di-ye-yo', e: 'where is it?', pos: 'question' },
],
},
{
id: 2,
korean: '왼쪽으로 가세요.',
romanization: 'Oen-jjo-geu-ro ga-se-yo.',
english: 'Go to the left.',
englishPronunciation: 'wen-JJOK-eu-ro gah-seh-yo',
usage: 'Giving or receiving directions',
culturalNote: '🗺️ Direction words: 왼쪽 (left), 오른쪽 (right), 직진 (straight ahead), 뒤 (behind).',
words: [
{ k: '왼쪽', r: 'oen-jjok', e: 'left side', pos: 'noun' },
{ k: '으로', r: 'eu-ro', e: 'towards / in the direction of', pos: 'particle' },
{ k: '가세요', r: 'ga-se-yo', e: 'please go', pos: 'verb' },
],
},
{
id: 3,
korean: '여기서 얼마나 걸려요?',
romanization: 'Yeo-gi-seo eol-ma-na geol-lyeo-yo?',
english: 'How long does it take from here?',
englishPronunciation: 'yuh-GEE-suh ul-MAH-nah gul-LYUH-yo',
usage: 'Ask travel time to a destination',
culturalNote: '⏱️ Useful before taking a taxi so you can estimate the fare.',
words: [
{ k: '여기서', r: 'yeo-gi-seo', e: 'from here', pos: 'adverb' },
{ k: '얼마나', r: 'eol-ma-na', e: 'how much / how long', pos: 'adverb' },
{ k: '걸려요?', r: 'geol-lyeo-yo', e: 'does it take?', pos: 'verb' },
],
},
{
id: 4,
korean: '갈아타야 해요?',
romanization: 'Ga-ra-ta-ya hae-yo?',
english: 'Do I need to transfer?',
englishPronunciation: 'gah-rah-TAH-ya heh-yo',
usage: 'Ask if you need to switch subway lines',
culturalNote: '🔄 Seoul metro requires transfers between lines. Look for 환승 (hwan-seung) signs.',
words: [
{ k: '갈아타야', r: 'ga-ra-ta-ya', e: 'must transfer', pos: 'verb' },
{ k: '해요?', r: 'hae-yo', e: 'do I have to? / should I?', pos: 'verb' },
],
},
{
id: 5,
korean: '택시 타고 갈까요?',
romanization: 'Taek-si ta-go gal-kka-yo?',
english: 'Shall we go by taxi?',
englishPronunciation: 'tek-SEE tah-go gahl-KAH-yo',
usage: 'Suggesting taxi as a travel option',
culturalNote: '🚕 Korean taxis are affordable and safe. Kakao Taxi app works like Uber.',
words: [
{ k: '택시', r: 'taek-si', e: 'taxi', pos: 'noun' },
{ k: '타고', r: 'ta-go', e: 'riding / taking', pos: 'verb' },
{ k: '갈까요?', r: 'gal-kka-yo', e: 'shall we go?', pos: 'verb' },
],
},
],
},
{
id: 'v5',
youtubeId: 'tLzxjZFR2BM',
title: '사랑해요 K-Drama Emotions',
subtitle: 'Feel everything in Korean',
themeIcon: '💕',
genre: 'K-Drama',
level: 'intermediate',
levelColor: '#e94560',
context: '📍 Scene: A confession scene from a K-Drama — rain, rooftop, feelings.',
script: [
{
id: 1,
korean: '보고 싶었어요.',
romanization: 'Bo-go si-peo-sseo-yo.',
english: 'I missed you. / I wanted to see you.',
englishPronunciation: 'BOH-go shee-PUH-ssuh-yo',
usage: 'Expressing that you missed someone',
culturalNote: '💭 보다 = to see. Koreans express "miss" as "wanting to see" — more vivid!',
words: [
{ k: '보고', r: 'bo-go', e: 'to see (and...)', pos: 'verb' },
{ k: '싶었어요', r: 'si-peo-sseo-yo', e: 'wanted to (past tense)', pos: 'verb' },
],
},
{
id: 2,
korean: '사랑해요.',
romanization: 'Sa-rang-hae-yo.',
english: 'I love you.',
englishPronunciation: 'sah-RAHNG-heh-yo',
usage: 'Romantic love — the K-Drama phrase',
culturalNote: '❤️ Koreans say this less casually than English speakers. Hearing it means a lot.',
words: [
{ k: '사랑', r: 'sa-rang', e: 'love', pos: 'noun' },
{ k: '해요', r: 'hae-yo', e: 'I do (polite)', pos: 'verb' },
],
},
{
id: 3,
korean: '괜찮아요?',
romanization: 'Gwaen-cha-na-yo?',
english: 'Are you okay?',
englishPronunciation: 'gwen-CHAH-nah-yo',
usage: 'Most versatile K-Drama phrase — concern for someone',
culturalNote: '🫂 Also means "it\'s okay / no worries" depending on context. K-Drama essential!',
words: [
{ k: '괜찮아요?', r: 'gwaen-cha-na-yo', e: 'are you okay? / it\'s alright', pos: 'adjective' },
],
},
{
id: 4,
korean: '왜 이랬어요?',
romanization: 'Wae i-raet-sseo-yo?',
english: 'Why did you do this?',
englishPronunciation: 'weh ee-RET-ssuh-yo',
usage: 'Confrontation scene — dramatic K-Drama moment',
culturalNote: '😤 왜 (why) + 이랬어요 (did you do like this). Classic K-Drama dialogue.',
words: [
{ k: '왜', r: 'wae', e: 'why', pos: 'adverb' },
{ k: '이랬어요?', r: 'i-raet-sseo-yo', e: 'did you do this? (past)', pos: 'verb' },
],
},
{
id: 5,
korean: '처음 만난 날부터였어요.',
romanization: 'Cheo-eum man-nan nal-bu-teo-yeo-sseo-yo.',
english: 'It was from the very first day we met.',
englishPronunciation: 'CHUH-eum mahn-NAHN nahl-boo-TUH-yuh-ssuh-yo',
usage: 'The ultimate K-Drama confession line',
culturalNote: '🎬 This type of sentence is why Korean learners fall in love with the language.',
words: [
{ k: '처음', r: 'cheo-eum', e: 'first', pos: 'noun' },
{ k: '만난', r: 'man-nan', e: 'met (past participle)', pos: 'verb' },
{ k: '날부터', r: 'nal-bu-teo', e: 'from the day', pos: 'noun+particle' },
{ k: '였어요', r: 'yeo-sseo-yo', e: 'it was (past)', pos: 'verb' },
],
},
],
},
{
id: 'v6',
youtubeId: 'oEU7WhNNKL8',
title: '회사에서 At the Korean Workplace',
subtitle: 'Speak professionally in Korean',
themeIcon: '💼',
genre: 'Business',
level: 'intermediate',
levelColor: '#34d399',
context: '📍 Scene: Your first day at a Korean company. The team leader introduces you.',
script: [
{
id: 1,
korean: '처음 뵙겠습니다. 잘 부탁드립니다.',
romanization: 'Cheo-eum boep-get-seum-ni-da. Jal bu-tak-deu-rim-ni-da.',
english: 'Nice to meet you for the first time. Please take care of me.',
englishPronunciation: 'CHUH-eum BWEP-get-seum-nee-da. jahl boo-TAHK-duh-rim-nee-da',
usage: 'Standard new employee / new relationship introduction',
culturalNote: '🏢 These two sentences together are mandatory in Korean business culture.',
words: [
{ k: '처음 뵙겠습니다', r: 'cheo-eum boep-get-seum-ni-da', e: 'nice to meet you (formal)', pos: 'phrase' },
{ k: '잘 부탁드립니다', r: 'jal bu-tak-deu-rim-ni-da', e: 'please look after me', pos: 'phrase' },
],
},
{
id: 2,
korean: '회의 있어요?',
romanization: 'Hoe-ui i-sseo-yo?',
english: 'Is there a meeting?',
englishPronunciation: 'hweh-YEE ee-SSUH-yo',
usage: 'Asking about meetings — daily office life',
culturalNote: '📅 Korean workplace culture involves many 회의 (meetings). 회의실 = meeting room.',
words: [
{ k: '회의', r: 'hoe-ui', e: 'meeting', pos: 'noun' },
{ k: '있어요?', r: 'i-sseo-yo', e: 'is there? / do you have?', pos: 'verb' },
],
},
{
id: 3,
korean: '마감이 언제예요?',
romanization: 'Ma-gam-i eon-je-ye-yo?',
english: 'When is the deadline?',
englishPronunciation: 'mah-GAHM-ee un-JEH-yeh-yo',
usage: 'Ask about deadlines for projects and reports',
culturalNote: '⏰ 마감 (deadline) and 야근 (overtime) are very common Korean workplace words.',
words: [
{ k: '마감', r: 'ma-gam', e: 'deadline / closing', pos: 'noun' },
{ k: '이', r: 'i', e: 'subject marker', pos: 'particle' },
{ k: '언제예요?', r: 'eon-je-ye-yo', e: 'when is it?', pos: 'question' },
],
},
{
id: 4,
korean: '수고하셨습니다!',
romanization: 'Su-go-ha-syeot-seum-ni-da!',
english: 'You worked hard! / Great job!',
englishPronunciation: 'soo-go-hah-SHYUT-seum-nee-da',
usage: 'Said at the end of a day or completing a task — you MUST learn this',
culturalNote: '🏆 수고 = toil/hard work. Saying this shows appreciation. Reply: 수고하셨습니다!',
words: [
{ k: '수고', r: 'su-go', e: 'hard work / effort', pos: 'noun' },
{ k: '하셨습니다', r: 'ha-syeot-seum-ni-da', e: 'you did (honorific past)', pos: 'verb' },
],
},
],
},
{
id: 'v7',
youtubeId: 'Lyio9VdVtJg',
title: '기분이 어때요? Expressing Emotions',
subtitle: 'Say how you really feel',
themeIcon: '😊',
genre: 'K-Drama',
level: 'beginner',
levelColor: '#f8d347',
context: '📍 Scene: Your Korean friend asks how your day was. Tell them everything.',
script: [
{
id: 1,
korean: '기분이 어때요?',
romanization: 'Gi-bun-i eo-ttae-yo?',
english: 'How are you feeling? / How\'s your mood?',
englishPronunciation: 'gee-BOON-ee uh-TEH-yo',
usage: 'Asking about someone\'s emotional state',
culturalNote: '💡 기분 (mood/feeling) is different from 건강 (health). This is more emotional.',
words: [
{ k: '기분', r: 'gi-bun', e: 'mood / feeling', pos: 'noun' },
{ k: '이', r: 'i', e: 'subject marker', pos: 'particle' },
{ k: '어때요?', r: 'eo-ttae-yo', e: 'how is it?', pos: 'question' },
],
},
{
id: 2,
korean: '너무 기뻐요!',
romanization: 'Neo-mu gi-ppeo-yo!',
english: 'I\'m so happy!',
englishPronunciation: 'NUH-moo gee-PPUH-yo',
usage: 'Expressing strong joy or happiness',
culturalNote: '😄 너무 literally means "too much" but Koreans use it to mean "so/very" — like 너무 좋아요 (so good!)',
words: [
{ k: '너무', r: 'neo-mu', e: 'so (very much)', pos: 'adverb' },
{ k: '기뻐요', r: 'gi-ppeo-yo', e: 'I am happy / joyful', pos: 'adjective' },
],
},
{
id: 3,
korean: '많이 피곤해요.',
romanization: 'Ma-ni pi-gon-hae-yo.',
english: 'I\'m very tired.',
englishPronunciation: 'mah-NEE pee-gon-HEH-yo',
usage: 'Expressing tiredness — very common phrase',
culturalNote: '😴 많이 = a lot/very. Add it before any emotion to intensify: 많이 슬퍼요 (very sad).',
words: [
{ k: '많이', r: 'ma-ni', e: 'a lot / very much', pos: 'adverb' },
{ k: '피곤해요', r: 'pi-gon-hae-yo', e: 'I am tired', pos: 'adjective' },
],
},
{
id: 4,
korean: '화났어요.',
romanization: 'Hwa-nat-sseo-yo.',
english: 'I got angry. / I\'m angry.',
englishPronunciation: 'hwah-NAHT-ssuh-yo',
usage: 'Expressing anger (polite form)',
culturalNote: '😠 화 = fire / anger. 화나다 = to get angry. Used widely in K-Dramas!',
words: [
{ k: '화났어요', r: 'hwa-nat-sseo-yo', e: 'got angry (past polite)', pos: 'verb' },
],
},
{
id: 5,
korean: '기운 내세요!',
romanization: 'Gi-un nae-se-yo!',
english: 'Cheer up! / Get your energy back!',
englishPronunciation: 'gee-UN neh-seh-yo',
usage: 'Encouraging someone who is feeling down',
culturalNote: '💪 기운 = energy/spirit. 내세요 = bring it out. Beautiful phrase!',
words: [
{ k: '기운', r: 'gi-un', e: 'energy / spirit', pos: 'noun' },
{ k: '내세요!', r: 'nae-se-yo', e: 'please bring out / show!', pos: 'verb' },
],
},
],
},
{
id: 'v8',
youtubeId: 'YBJZz2nKSBw',
title: '아이스 아메리카노! Korean Café',
subtitle: 'Order coffee like a Seoul local',
themeIcon: '☕',
genre: 'Daily Life',
level: 'beginner',
levelColor: '#fb923c',
context: '📍 Scene: You walk into a trendy café in Hongdae, Seoul.',
script: [
{
id: 1,
korean: '아이스 아메리카노 하나 주세요.',
romanization: 'A-i-seu a-me-ri-ka-no ha-na ju-se-yo.',
english: 'One iced americano, please.',
englishPronunciation: 'AH-ee-seu ah-meh-REE-ka-no HAH-nah joo-seh-yo',
usage: 'The most ordered drink in Korea — iced americano!',
culturalNote: '☕ Korea is obsessed with 아이스 아메리카노. It\'s a cultural phenomenon. Order with confidence!',
words: [
{ k: '아이스', r: 'a-i-seu', e: 'iced / cold', pos: 'adjective' },
{ k: '아메리카노', r: 'a-me-ri-ka-no', e: 'americano coffee', pos: 'noun' },
{ k: '하나', r: 'ha-na', e: 'one (native Korean number)', pos: 'number' },
{ k: '주세요', r: 'ju-se-yo', e: 'please give me', pos: 'verb' },
],
},
{
id: 2,
korean: '따뜻한 라떼 주세요.',
romanization: 'Dda-ddeu-tan ra-tte ju-se-yo.',
english: 'A hot latte, please.',
englishPronunciation: 'DDA-duh-tahn rah-TEH joo-seh-yo',
usage: 'Order a hot drink',
culturalNote: '🔥 따뜻하다 = warm/hot. 따뜻한 is the modifying form. Add it before any drink.',
words: [
{ k: '따뜻한', r: 'dda-ddeu-tan', e: 'warm / hot', pos: 'adjective' },
{ k: '라떼', r: 'ra-tte', e: 'latte', pos: 'noun' },
{ k: '주세요', r: 'ju-se-yo', e: 'please give me', pos: 'verb' },
],
},
{
id: 3,
korean: '테이크아웃이에요.',
romanization: 'Te-i-keu-a-ut-i-e-yo.',
english: 'It\'s takeout.',
englishPronunciation: 'teh-ee-kuh-ah-OOT-ee-eh-yo',
usage: 'Tell barista it\'s to go',
culturalNote: '🥤 Korean cafés always ask: 여기서 드세요? (eating here?) or 테이크아웃이에요? (takeout?)',
words: [
{ k: '테이크아웃', r: 'te-i-keu-a-ut', e: 'takeout / to go', pos: 'noun' },
{ k: '이에요', r: 'i-e-yo', e: 'it is', pos: 'verb' },
],
},
{
id: 4,
korean: '설탕 빼 주세요.',
romanization: 'Seol-tang bbae ju-se-yo.',
english: 'Please leave out the sugar.',
englishPronunciation: 'sul-TANG bbeh joo-seh-yo',
usage: 'Customize your drink — remove ingredients',
culturalNote: '🍭 빼다 = to take out / remove. Add 빼 주세요 after any ingredient to remove it.',
words: [
{ k: '설탕', r: 'seol-tang', e: 'sugar', pos: 'noun' },
{ k: '빼 주세요', r: 'bbae ju-se-yo', e: 'please take out / remove', pos: 'verb' },
],
},
],
},
{
id: 'v9',
youtubeId: '1Rxr2GvyvZs',
title: '살아남자! Squid Game Korean',
subtitle: 'Advanced survival Korean',
themeIcon: '🦑',
genre: 'K-Drama',
level: 'advanced',
levelColor: '#e94560',
context: '📍 Scene: 456 players. One game. Korean commands determine life or death.',
script: [
{
id: 1,
korean: '무궁화 꽃이 피었습니다.',
romanization: 'Mu-gung-hwa kko-chi pi-eot-seum-ni-da.',
english: 'The mugunghwa flower has bloomed.',
englishPronunciation: 'moo-GOONG-wha KO-chee pee-ut-SEUM-nee-da',
usage: 'The iconic Squid Game phrase — Korean "Red Light Green Light"',
culturalNote: '🌸 무궁화 = Korea\'s national flower. This is the Korean version of "Red light!"',
words: [
{ k: '무궁화', r: 'mu-gung-hwa', e: 'mugunghwa (national flower)', pos: 'noun' },
{ k: '꽃이', r: 'kko-chi', e: 'flower (subject)', pos: 'noun' },
{ k: '피었습니다', r: 'pi-eot-seum-ni-da', e: 'has bloomed (formal past)', pos: 'verb' },
],
},
{
id: 2,
korean: '살아남아야 해.',
romanization: 'Sa-ra-na-ma-ya hae.',
english: 'I have to survive.',
englishPronunciation: 'sah-rah-NAH-mah-yah heh',
usage: 'Expressing obligation — must do something',
culturalNote: '💪 ~야 해 = "have to / must do" — one of Korean\'s most important grammar patterns.',
words: [
{ k: '살아남아야', r: 'sa-ra-na-ma-ya', e: 'must survive', pos: 'verb' },
{ k: '해', r: 'hae', e: 'do / have to (casual)', pos: 'verb' },
],
},
{
id: 3,
korean: '포기하면 안 돼.',
romanization: 'Po-gi-ha-myeon an dwae.',
english: 'You must not give up.',
englishPronunciation: 'poh-gee-hah-MYUN ahn dweh',
usage: 'Saying something is not allowed / must not happen',
culturalNote: '🚫 ~면 안 돼 = "if you do X, it\'s not okay" = "you must not X". Essential pattern!',
words: [
{ k: '포기하면', r: 'po-gi-ha-myeon', e: 'if (you) give up', pos: 'verb' },
{ k: '안 돼', r: 'an dwae', e: 'not okay / must not', pos: 'expression' },
],
},
{
id: 4,
korean: '서로 믿어야 해요.',
romanization: 'Seo-ro mi-deo-ya hae-yo.',
english: 'We need to trust each other.',
englishPronunciation: 'SUH-ro mee-DUH-ya heh-yo',
usage: 'Expressing mutual trust and obligation',
culturalNote: '🤝 서로 = each other / mutually. 믿다 = to trust/believe. Critical K-Drama vocabulary.',
words: [
{ k: '서로', r: 'seo-ro', e: 'each other / mutually', pos: 'adverb' },
{ k: '믿어야', r: 'mi-deo-ya', e: 'must trust', pos: 'verb' },
{ k: '해요', r: 'hae-yo', e: 'have to (polite)', pos: 'verb' },
],
},
],
},
{
id: 'v10',
youtubeId: 'Q-rGIR3DdNk',
title: '사랑이에요 Crash Landing on You',
subtitle: 'Advanced romantic Korean',
themeIcon: '🪂',
genre: 'K-Drama',
level: 'advanced',
levelColor: '#a78bfa',
context: '📍 Scene: The rooftop confession. Ri Jung-hyeok and Yoon Se-ri.',
script: [
{
id: 1,
korean: '당신이 보고 싶을 거예요.',
romanization: 'Dang-sin-i bo-go si-peul geo-ye-yo.',
english: 'I think I\'ll miss you.',
englishPronunciation: 'dahng-SHIN-ee BOH-go shee-PEUL guh-yeh-yo',
usage: 'Expressing future longing — beautiful Korean sentence structure',
culturalNote: '🌧️ ~(으)ㄹ 것 같아요 = "I think it will be" — used for predictions and future feelings.',
words: [
{ k: '당신', r: 'dang-sin', e: 'you (formal/poetic)', pos: 'pronoun' },
{ k: '보고 싶을', r: 'bo-go si-peul', e: 'will want to see', pos: 'verb' },
{ k: '거예요', r: 'geo-ye-yo', e: 'I think it will be', pos: 'verb ending' },
],
},
{
id: 2,
korean: '당신을 잊을 수 없어요.',
romanization: 'Dang-sin-eul i-jeul su eop-sseo-yo.',
english: 'I can\'t forget you.',
englishPronunciation: 'dahng-SHIN-ul ee-JEUL soo up-SSUH-yo',
usage: 'Expressing inability — "cannot" structure',
culturalNote: '💔 ~(으)ㄹ 수 없어요 = "cannot do". ~(으)ㄹ 수 있어요 = "can do". Master this!',
words: [
{ k: '잊을 수 없어요', r: 'i-jeul su eop-sseo-yo', e: 'cannot forget', pos: 'verb phrase' },
],
},
{
id: 3,
korean: '운명이었던 것 같아요.',
romanization: 'Un-myeong-i-eot-deon geot ga-ta-yo.',
english: 'I think it was fate.',
englishPronunciation: 'oon-MYUNG-ee-ut-DUN gut gah-TAH-yo',
usage: 'Reflecting on fate and destiny',
culturalNote: '🌟 운명 (fate/destiny) is a core K-Drama concept. ~인 것 같아요 = "I think it is/was".',
words: [
{ k: '운명', r: 'un-myeong', e: 'fate / destiny', pos: 'noun' },
{ k: '이었던', r: 'i-eot-deon', e: 'which was (past-modifying)', pos: 'verb' },
{ k: '것 같아요', r: 'geot ga-ta-yo', e: 'I think it is', pos: 'expression' },
],
},
],
},
];

// ─── Colors ───────────────────────────────────────────────────────────────────
const GENRE_COLORS = {
Basics: '#4ade80', 'Daily Life': '#38bdf8', 'K-Drama': '#e94560',
Travel: '#fb923c', Education: '#a78bfa', Entertainment: '#f8d347', Business: '#34d399',
};
const LEVEL_LABEL = { beginner: '🌱 Beginner', intermediate: '⚡ Intermediate', advanced: '🔥 Advanced' };

// ─────────────────────────────────────────────────────────────────────────────
export default function Learn() {
const [practiceTarget, setPracticeTarget] = useState(null); // {line, accentColor}
const { user } = useAuth();
const navigate = useNavigate();

const [selected, setSelected] = useState(null);
const [mode, setMode] = useState('script'); // 'script' | 'shadow' | 'quiz'
const [expandedLine, setExpanded] = useState(null);
const [expandedWord, setExpandedWord] = useState(null);
const [learned, setLearned] = useState({});
const [search, setSearch] = useState('');
const [filterGenre, setFilter] = useState('all');
const [filterLevel, setFilterL] = useState('all');
const [speaking, setSpeaking] = useState(null);

// Shadow mode
const [shadowRec, setShadowRec] = useState(false);
const [shadowResult, setShadowResult] = useState(null);
const [shadowTarget, setShadowTarget] = useState(null);
const recRef = useRef(null);

// Quiz mode
const [quizIdx, setQuizIdx] = useState(0);
const [quizInput, setQuizInput] = useState('');
const [quizFeedback, setQuizFeedback] = useState(null);
const [quizScore, setQuizScore] = useState(0);

const genres = ['all', ...new Set(SCENE_VIDEOS.map(v => v.genre))];
const levels = ['all', 'beginner', 'intermediate', 'advanced'];

const filtered = SCENE_VIDEOS.filter(v => {
const m = v.title.toLowerCase().includes(search.toLowerCase()) ||
v.genre.toLowerCase().includes(search.toLowerCase());
const g = filterGenre === 'all' || v.genre === filterGenre;
const l = filterLevel === 'all' || v.level === filterLevel;
return m && g && l;
});

const totalLearned = Object.values(learned).filter(Boolean).length;
const totalLines = SCENE_VIDEOS.reduce((s,v)=>s+v.script.length,0);

// ── Speak handler ──────────────────────────────────────────────────────────
const handleSpeak = useCallback((text, id, slow = false) => {
setSpeaking(id);
speakKorean(text, slow);
setTimeout(() => setSpeaking(null), slow ? text.length * 120 + 300 : text.length * 80 + 200);
}, []);

// ── Shadow mode ────────────────────────────────────────────────────────────
const startShadow = (line) => {
setShadowTarget(line);
setShadowResult(null);
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SR) { alert('Use Chrome for voice recording!'); return; }
const r = new SR();
r.lang = 'ko-KR'; r.continuous = false;
r.onresult = (e) => {
const spoken = e.results[0][0].transcript;
const score = Math.min(100, Math.floor(
(spoken.length / line.korean.replace(/[\[\]]/g,'').length) * 80 + Math.random() * 20
));
setShadowResult({ spoken, score });
setShadowRec(false);
};
r.onend = () => setShadowRec(false);
recRef.current = r;
setShadowRec(true);
r.start();
};

// ── Quiz mode ─────────────────────────────────────────────────────────────
const checkQuiz = () => {
const line = selected.script[quizIdx];
const correct = quizInput.trim().toLowerCase().replace(/\s+/g,' ')
=== line.korean.trim().toLowerCase().replace(/\s+/g,' ');
if (correct) {
setQuizFeedback({ type: 'success', msg: '🎉 완벽해요! (Perfect!)' });
setQuizScore(s => s + 1);
setTimeout(() => {
setQuizInput('');
setQuizFeedback(null);
if (quizIdx + 1 < selected.script.length) setQuizIdx(i => i + 1);
}, 1500);
} else {
setQuizFeedback({ type: 'error', msg: `❌ Try again! Answer: ${line.korean}` });
speakKorean(line.korean);
}
};

const openVideo = (v) => {
setSelected(v);
setMode('script');
setExpanded(null);
setExpandedWord(null);
setQuizIdx(0);
setQuizInput('');
setQuizFeedback(null);
setShadowResult(null);
};

return (
<div style={{ minHeight:'100vh', background:'#08081a', color:'#fff',
fontFamily:"'DM Sans', system-ui, sans-serif" }}>
<style>{`
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes glow{0%,100%{box-shadow:0 0 0 rgba(233,69,96,0.3)}50%{box-shadow:0 0 22px rgba(233,69,96,0.6)}}
.scene-card:hover{transform:translateY(-5px)!important;border-color:var(--lvl)!important}
.word-chip:hover{background:rgba(255,255,255,0.1)!important;transform:scale(1.05)}
.line-row:hover{background:rgba(255,255,255,0.03)!important}
.spk-btn:hover{opacity:.8}
.spk-btn:active{transform:scale(.95)}
`}</style>

{/* Nav */}
<nav style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
padding:'14px 28px', background:'rgba(8,8,26,0.97)',
borderBottom:'1px solid rgba(255,255,255,0.07)',
position:'sticky', top:0, zIndex:100, backdropFilter:'blur(12px)' }}>
<div style={{ fontSize:'19px', fontWeight:'800', color:'#e94560', cursor:'pointer',
fontFamily:"'Syne',sans-serif" }} onClick={()=>navigate('/')}>🎬 CineLingo</div>
<div style={{ display:'flex', gap:'22px' }}>
{[['Learn','/learn'],['Game','/game'],['Leaderboard','/leaderboard'],['Profile','/profile']].map(([l,p])=>(
<span key={p} style={{ fontSize:'13px', cursor:'pointer',
color:p==='/learn'?'#e94560':'#666', fontWeight:p==='/learn'?'700':'400' }}
onClick={()=>navigate(p)}>{l}</span>
))}
</div>
<div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
<span style={{ fontSize:'12px', color:'#555', background:'rgba(255,255,255,0.04)',
padding:'5px 12px', borderRadius:'20px', border:'1px solid rgba(255,255,255,0.07)' }}>
✅ {totalLearned} / {totalLines} lines
</span>
<span style={{ color:'#555', fontSize:'13px' }}>👋 {user?.username}</span>
</div>
</nav>

{/* ═══════════════════════════════ VIDEO BROWSER ═══════════════════════════════ */}
{!selected && (
<div style={{ maxWidth:'1100px', margin:'0 auto', padding:'36px 24px',
animation:'fadeUp .4s ease' }}>

{/* Header */}
<div style={{ marginBottom:'32px' }}>
<div style={{ fontSize:'11px', color:'#e94560', fontWeight:'700',
letterSpacing:'3px', marginBottom:'8px' }}>DRAMA SCRIPT IMMERSION</div>
<h1 style={{ fontSize:'40px', fontWeight:'900', fontFamily:"'Syne',sans-serif",
margin:'0 0 8px', letterSpacing:'-1px' }}>
Choose Your Scene 🎬
</h1>
<p style={{ fontSize:'14px', color:'#555', margin:'0 0 6px' }}>
Each video = a real scene with its exact dialogue. Watch → Read → Speak → Master.
</p>
<p style={{ fontSize:'12px', color:'#333' }}>
Click 🔊 on any word to hear pronunciation instantly
</p>
</div>

{/* Search + Filters */}
<div style={{ display:'flex', gap:'10px', marginBottom:'24px', flexWrap:'wrap' }}>
<input value={search} onChange={e=>setSearch(e.target.value)}
placeholder="🔍 Search scenes..."
style={{ flex:1, minWidth:'200px', padding:'10px 16px',
background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)',
borderRadius:'10px', color:'#fff', fontSize:'14px', outline:'none',
fontFamily:'inherit' }}/>
<select value={filterGenre} onChange={e=>setFilter(e.target.value)}
style={{ padding:'10px 14px', background:'#13132a',
border:'1px solid rgba(255,255,255,0.09)', borderRadius:'10px',
color:'#ccc', fontSize:'13px', fontFamily:'inherit' }}>
{genres.map(g=><option key={g} value={g}>{g==='all'?'All Genres':g}</option>)}
</select>
<select value={filterLevel} onChange={e=>setFilterL(e.target.value)}
style={{ padding:'10px 14px', background:'#13132a',
border:'1px solid rgba(255,255,255,0.09)', borderRadius:'10px',
color:'#ccc', fontSize:'13px', fontFamily:'inherit' }}>
{levels.map(l=><option key={l} value={l}>
{l==='all'?'All Levels':LEVEL_LABEL[l]}
</option>)}
</select>
</div>

{/* How it's different */}
<div style={{ display:'flex', gap:'10px', marginBottom:'28px', flexWrap:'wrap' }}>
{[
['🎬','Watch the actual video'],
['📜','Read the REAL script from that video'],
['🔊','Click any word → instant pronunciation'],
['🎤','Shadow: record yourself speaking'],
['🧩','Quiz: fill in the missing Korean'],
].map(([icon,text])=>(
<div key={text} style={{ display:'flex', alignItems:'center', gap:'6px',
padding:'7px 14px', background:'rgba(255,255,255,0.02)',
border:'1px solid rgba(255,255,255,0.07)', borderRadius:'10px',
fontSize:'12px', color:'#555' }}>
<span>{icon}</span><span>{text}</span>
</div>
))}
</div>

{/* Grid */}
<div style={{ display:'grid',
gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))', gap:'16px' }}>
{filtered.map(v => (
<div key={v.id} className="scene-card"
style={{ '--lvl': v.levelColor,
background:'rgba(255,255,255,0.02)',
border:`1px solid ${v.levelColor}22`, borderRadius:'16px',
overflow:'hidden', cursor:'pointer', transition:'all .22s' }}
onClick={()=>openVideo(v)}>
{/* Thumbnail */}
<div style={{ position:'relative', paddingTop:'52%', background:'#111', overflow:'hidden' }}>
<img src={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`}
alt={v.title}
style={{ position:'absolute', inset:0, width:'100%', height:'100%',
objectFit:'cover', opacity:0.75 }}
onError={e=>{e.target.style.display='none';}} />
<div style={{ position:'absolute', inset:0,
background:`linear-gradient(0deg,rgba(8,8,26,0.85),transparent)` }}/>
<div style={{ position:'absolute', top:'10px', left:'10px', display:'flex', gap:'6px' }}>
<span style={{ fontSize:'10px', padding:'3px 9px', borderRadius:'8px',
background:`${GENRE_COLORS[v.genre]||'#888'}22`,
border:`1px solid ${GENRE_COLORS[v.genre]||'#888'}55`,
color:GENRE_COLORS[v.genre]||'#888', fontWeight:'700' }}>{v.genre}</span>
<span style={{ fontSize:'10px', padding:'3px 9px', borderRadius:'8px',
background:`${v.levelColor}22`, border:`1px solid ${v.levelColor}55`,
color:v.levelColor, fontWeight:'700' }}>{LEVEL_LABEL[v.level]}</span>
</div>
<div style={{ position:'absolute', bottom:'10px', right:'10px',
fontSize:'10px', color:'rgba(255,255,255,0.7)',
background:'rgba(0,0,0,0.6)', padding:'2px 8px', borderRadius:'6px' }}>
{v.script.length} lines · {v.script.reduce((s,l)=>s+l.words.length,0)} words
</div>
{/* Big icon overlay */}
<div style={{ position:'absolute', top:'50%', left:'50%',
transform:'translate(-50%,-50%)', fontSize:'40px',
filter:'drop-shadow(0 4px 12px rgba(0,0,0,0.8))' }}>
{v.themeIcon}
</div>
</div>
<div style={{ padding:'16px' }}>
<div style={{ fontSize:'16px', fontWeight:'800', marginBottom:'3px',
fontFamily:"'Syne',sans-serif", color:'#eee' }}>{v.title}</div>
<div style={{ fontSize:'12px', color:'#555', marginBottom:'10px' }}>{v.subtitle}</div>
<div style={{ fontSize:'11px', color:'#333',
background:'rgba(255,255,255,0.03)', borderRadius:'8px',
padding:'6px 10px', fontStyle:'italic' }}>
{v.context}
</div>
</div>
</div>
))}
</div>
</div>
)}

{/* ═══════════════════════════════ SCENE DETAIL ═══════════════════════════════ */}
{selected && (
<div style={{ maxWidth:'1000px', margin:'0 auto', padding:'24px',
animation:'fadeUp .35s ease' }}>

{/* Back */}
<button onClick={()=>setSelected(null)}
style={{ background:'transparent', border:'none', color:'#555',
fontSize:'13px', cursor:'pointer', fontFamily:'inherit',
marginBottom:'16px', padding:0, display:'flex', alignItems:'center', gap:'4px' }}>
← Back to Scenes
</button>

{/* Header */}
<div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px',
marginBottom:'24px' }}>
{/* Video embed */}
<div style={{ borderRadius:'14px', overflow:'hidden', aspectRatio:'16/9',
background:'#000' }}>
<iframe width="100%" height="100%"
src={`https://www.youtube.com/embed/${selected.youtubeId}?rel=0`}
title={selected.title} frameBorder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
allowFullScreen style={{ display:'block' }}/>
</div>
{/* Scene info */}
<div>
<div style={{ display:'flex', gap:'7px', flexWrap:'wrap', marginBottom:'10px' }}>
<span style={{ fontSize:'11px', padding:'3px 10px', borderRadius:'8px',
background:`${GENRE_COLORS[selected.genre]||'#888'}22`,
border:`1px solid ${GENRE_COLORS[selected.genre]||'#888'}44`,
color:GENRE_COLORS[selected.genre], fontWeight:'700' }}>
{selected.genre}
</span>
<span style={{ fontSize:'11px', padding:'3px 10px', borderRadius:'8px',
background:`${selected.levelColor}22`,
border:`1px solid ${selected.levelColor}44`,
color:selected.levelColor, fontWeight:'700' }}>
{LEVEL_LABEL[selected.level]}
</span>
</div>

<h2 style={{ fontSize:'22px', fontWeight:'900', margin:'0 0 4px',
fontFamily:"'Syne',sans-serif" }}>{selected.themeIcon} {selected.title}</h2>
<p style={{ fontSize:'13px', color:'#555', margin:'0 0 12px' }}>{selected.subtitle}</p>
<div style={{ fontSize:'12px', color:'#888', background:'rgba(255,255,255,0.03)',
border:'1px solid rgba(255,255,255,0.07)', borderRadius:'10px',
padding:'10px 14px', marginBottom:'16px', lineHeight:1.5 }}>
{selected.context}
</div>

{/* Stats */}
<div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px',
marginBottom:'16px' }}>
{[
['📜', selected.script.length, 'Lines'],
['🔤', selected.script.reduce((s,l)=>s+l.words.length,0), 'Words'],
['✅', Object.keys(learned).filter(k=>k.startsWith(selected.id)&&learned[k]).length, 'Learned'],
].map(([icon,n,label])=>(
<div key={label} style={{ background:'rgba(255,255,255,0.03)',
border:'1px solid rgba(255,255,255,0.07)', borderRadius:'10px',
padding:'10px', textAlign:'center' }}>
<div style={{ fontSize:'20px', fontWeight:'900',
fontFamily:"'Syne',sans-serif", color:selected.levelColor }}>
{icon} {n}
</div>
<div style={{ fontSize:'10px', color:'#444', marginTop:'2px' }}>{label}</div>
</div>
))}
</div>

{/* Pronunciation tip */}
<div style={{ fontSize:'11px', color:'#38bdf8', background:'rgba(56,189,248,0.06)',
border:'1px solid rgba(56,189,248,0.2)', borderRadius:'10px',
padding:'8px 12px', lineHeight:1.5 }}>
🔊 <strong>How to use:</strong> Click any Korean word or the speaker icon to hear pronunciation at natural or slow speed
</div>
</div>
</div>

{/* Mode Tabs */}
<div style={{ display:'flex', gap:'8px', marginBottom:'20px' }}>
{[
['script','📜 Script Mode','Read & Listen'],
['shadow','🎤 Shadow Mode','Record Yourself'],
['quiz','🧩 Quiz Mode','Fill the Gap'],
].map(([m,label,sub])=>(
<button key={m} onClick={()=>setMode(m)}
style={{ flex:1, padding:'12px', borderRadius:'12px', cursor:'pointer',
fontFamily:'inherit', border:`1px solid ${mode===m?selected.levelColor:'rgba(255,255,255,0.08)'}`,
background:mode===m?`${selected.levelColor}18`:'transparent',
color:mode===m?selected.levelColor:'#555', transition:'all .2s' }}>
<div style={{ fontSize:'13px', fontWeight:'800' }}>{label}</div>
<div style={{ fontSize:'10px', marginTop:'2px', opacity:0.7 }}>{sub}</div>
</button>
))}
</div>

{/* ════════════ SCRIPT MODE ════════════ */}
{mode === 'script' && (
<div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
{selected.script.map((line, idx) => {
const lineKey = `${selected.id}-${idx}`;
const isExpanded = expandedLine === idx;
const isLearned = learned[lineKey];
const isSpeaking = speaking === lineKey;
return (
<div key={idx}
style={{ background:isLearned?'rgba(74,222,128,0.05)':'rgba(255,255,255,0.02)',
border:`1px solid ${isLearned?'rgba(74,222,128,0.25)':'rgba(255,255,255,0.07)'}`,
borderRadius:'16px', overflow:'hidden', transition:'all .2s' }}>

{/* Line header — click to expand */}
<div className="line-row"
style={{ padding:'18px 20px', cursor:'pointer',
borderBottom:isExpanded?'1px solid rgba(255,255,255,0.07)':'none',
transition:'background .15s' }}
onClick={()=>setExpanded(isExpanded ? null : idx)}>

<div style={{ display:'flex', alignItems:'flex-start',
justifyContent:'space-between', gap:'16px' }}>
<div style={{ flex:1 }}>
{/* Line number */}
<div style={{ fontSize:'10px', color:'#333',
fontWeight:'700', marginBottom:'6px', letterSpacing:'1px' }}>
LINE {idx + 1}
</div>

{/* KOREAN — BIG */}
<div style={{ fontSize:'28px', fontWeight:'900',
fontFamily:"'Syne',sans-serif", color:'#fff',
marginBottom:'6px', lineHeight:1.3 }}>
{line.korean}
</div>

{/* Romanization — big and clear */}
<div style={{ fontSize:'16px', color:'#e94560',
fontWeight:'600', marginBottom:'5px', letterSpacing:'0.3px' }}>
{line.romanization}
</div>

{/* English pronunciation guide */}
<div style={{ fontSize:'14px', color:'#38bdf8',
fontWeight:'600', marginBottom:'8px' }}>
🗣 <em>{line.englishPronunciation}</em>
</div>

{/* English meaning — big */}
<div style={{ fontSize:'17px', color:'#4ade80',
fontWeight:'700' }}>
{line.english}
</div>
</div>

<div style={{ display:'flex', flexDirection:'column',
alignItems:'flex-end', gap:'8px', flexShrink:0 }}>
{/* Speaker buttons */}
<div style={{ display:'flex', gap:'6px' }}>
<button className="spk-btn"
onClick={e=>{e.stopPropagation();handleSpeak(line.korean,lineKey,false);}}
title="Normal speed"
style={{ padding:'8px 14px', borderRadius:'8px', border:'none',
background:isSpeaking?'rgba(74,222,128,0.2)':'rgba(233,69,96,0.12)',
color:isSpeaking?'#4ade80':'#e94560',
fontSize:'18px', cursor:'pointer',
animation:isSpeaking?'glow 1s ease infinite':'none' }}>
🔊
</button>
<button className="spk-btn"
onClick={e=>{e.stopPropagation();handleSpeak(line.korean,`${lineKey}-slow`,true);}}
title="Slow speed"
style={{ padding:'8px 14px', borderRadius:'8px', border:'none',
background:'rgba(56,189,248,0.1)', color:'#38bdf8',
fontSize:'14px', cursor:'pointer', fontWeight:'700',
fontFamily:'inherit' }}>
🐢
</button>
</div>

{/* Learned toggle */}
<button onClick={e=>{e.stopPropagation();setLearned(p=>({...p,[lineKey]:!p[lineKey]}));}}
style={{ padding:'6px 14px', borderRadius:'8px', cursor:'pointer',
fontSize:'11px', fontWeight:'800', fontFamily:'inherit',
border:`1px solid ${isLearned?'rgba(74,222,128,0.4)':'rgba(255,255,255,0.1)'}`,
background:isLearned?'rgba(74,222,128,0.12)':'rgba(255,255,255,0.04)',
color:isLearned?'#4ade80':'#555' }}>
{isLearned ? '✅ Learned' : 'Mark Learned'}
</button>

{/* ── Practice Pronunciation button ── */}
<button
onClick={e => {
e.stopPropagation();
setPracticeTarget({ line, accentColor: selected.levelColor });
}}
style={{
padding:'6px 14px', borderRadius:'8px', cursor:'pointer',
fontSize:'11px', fontWeight:'800', fontFamily:'inherit',
border:'1px solid rgba(56,189,248,0.35)',
background:'rgba(56,189,248,0.08)',
color:'#38bdf8',
}}>
🎤 Practice
</button>

{/* Expand indicator */}
<span style={{ fontSize:'18px', color:'#333' }}>
{isExpanded ? '▲' : '▼'}
</span>
</div>
</div>

{/* Usage chip */}
<div style={{ marginTop:'8px', fontSize:'12px', color:'#555',
fontStyle:'italic' }}>
💡 {line.usage}
</div>
</div>

{/* Expanded content */}
{isExpanded && (
<div style={{ padding:'20px' }}>

{/* Cultural note */}
<div style={{ background:'rgba(248,211,71,0.05)',
border:'1px solid rgba(248,211,71,0.2)', borderRadius:'12px',
padding:'14px 16px', marginBottom:'20px' }}>
<div style={{ fontSize:'13px', color:'#f8d347',
fontWeight:'700', marginBottom:'4px' }}>Cultural Note</div>
<div style={{ fontSize:'13px', color:'#888', lineHeight:1.6 }}>
{line.culturalNote}
</div>
</div>

{/* Word Breakdown */}
<div style={{ marginBottom:'8px', fontSize:'12px',
color:'#555', fontWeight:'700', letterSpacing:'1px' }}>
WORD BREAKDOWN — click each word to hear it
</div>
<div style={{ display:'flex', flexWrap:'wrap', gap:'10px' }}>
{line.words.map((w, wi) => {
const wkey = `${lineKey}-w${wi}`;
const isWExp = expandedWord === wkey;
const isWSpeaking = speaking === wkey;
return (
<div key={wi}
style={{ background:isWExp?'rgba(255,255,255,0.06)':'rgba(255,255,255,0.03)',
border:`1px solid ${isWExp?selected.levelColor:'rgba(255,255,255,0.1)'}`,
borderRadius:'14px', padding:'14px 18px', cursor:'pointer',
transition:'all .2s', minWidth:'120px' }}
onClick={()=>{
setExpandedWord(isWExp?null:wkey);
handleSpeak(w.k, wkey, false);
}}>

{/* Korean word — LARGE */}
<div style={{ fontSize:'26px', fontWeight:'900',
fontFamily:"'Syne',sans-serif", color:'#fff',
marginBottom:'6px', display:'flex', alignItems:'center', gap:'8px' }}>
{w.k}
<span style={{ fontSize:'16px', opacity: isWSpeaking ? 1 : 0.4 }}>🔊</span>
</div>

{/* Romanization */}
<div style={{ fontSize:'15px', color:'#e94560',
fontWeight:'600', marginBottom:'4px' }}>
{w.r}
</div>

{/* English pronunciation guide */}
<div style={{ fontSize:'12px', color:'#38bdf8',
fontWeight:'500', marginBottom:'4px', fontStyle:'italic' }}>
say it: {w.r.split('-').join('·')}
</div>

{/* Meaning */}
<div style={{ fontSize:'15px', color:'#4ade80',
fontWeight:'700', marginBottom:'4px' }}>
{w.e}
</div>

{/* Part of speech */}
<div style={{ fontSize:'10px', padding:'2px 8px',
background:'rgba(255,255,255,0.06)', borderRadius:'6px',
color:'#444', display:'inline-block' }}>
{w.pos}
</div>

{isWExp && (
<div style={{ marginTop:'10px', display:'flex', gap:'6px' }}>
<button className="spk-btn"
onClick={e=>{e.stopPropagation();speakKorean(w.k,false);}}
style={{ padding:'5px 12px', borderRadius:'7px',
background:'rgba(233,69,96,0.15)', border:'none',
color:'#e94560', fontSize:'12px', cursor:'pointer',
fontWeight:'700', fontFamily:'inherit' }}>
🔊 Normal
</button>
<button className="spk-btn"
onClick={e=>{e.stopPropagation();speakKorean(w.k,true);}}
style={{ padding:'5px 12px', borderRadius:'7px',
background:'rgba(56,189,248,0.12)', border:'none',
color:'#38bdf8', fontSize:'12px', cursor:'pointer',
fontWeight:'700', fontFamily:'inherit' }}>
🐢 Slow
</button>
</div>
)}
</div>
);
})}
</div>

{/* Hear full sentence */}
<div style={{ marginTop:'18px', display:'flex', gap:'10px',
alignItems:'center' }}>
<button className="spk-btn"
onClick={()=>handleSpeak(line.korean,`${lineKey}-full`,false)}
style={{ padding:'10px 22px', background:'linear-gradient(135deg,#e94560,#c73652)',
border:'none', borderRadius:'10px', color:'#fff',
fontSize:'14px', fontWeight:'800', cursor:'pointer',
fontFamily:'inherit', display:'flex', alignItems:'center', gap:'6px' }}>
🔊 Hear Full Sentence
</button>
<button className="spk-btn"
onClick={()=>handleSpeak(line.korean,`${lineKey}-slow2`,true)}
style={{ padding:'10px 22px', background:'rgba(56,189,248,0.12)',
border:'1px solid rgba(56,189,248,0.3)', borderRadius:'10px',
color:'#38bdf8', fontSize:'14px', fontWeight:'800',
cursor:'pointer', fontFamily:'inherit',
display:'flex', alignItems:'center', gap:'6px' }}>
🐢 Hear Slowly
</button>
</div>
</div>
)}
</div>
);
})}
</div>
)}

{/* ════════════ SHADOW MODE ════════════ */}
{mode === 'shadow' && (
<div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
<div style={{ background:'rgba(74,222,128,0.05)',
border:'1px solid rgba(74,222,128,0.2)', borderRadius:'14px',
padding:'16px 20px', marginBottom:'8px' }}>
<div style={{ fontSize:'14px', fontWeight:'800', color:'#4ade80', marginBottom:'4px' }}>
🎤 Shadow Mode — Speak each line after hearing it
</div>
<div style={{ fontSize:'13px', color:'#555', lineHeight:1.6 }}>
1. Press 🔊 to hear the Korean line.<br/>
2. Press 🎤 to record yourself repeating it.<br/>
3. Compare your pronunciation with the original.
</div>
</div>

{selected.script.map((line, idx) => (
<div key={idx}
style={{ background:'rgba(255,255,255,0.02)',
border:'1px solid rgba(255,255,255,0.07)', borderRadius:'16px',
padding:'20px' }}>

{/* Korean BIG */}
<div style={{ fontSize:'30px', fontWeight:'900',
fontFamily:"'Syne',sans-serif", color:'#fff', marginBottom:'6px' }}>
{line.korean}
</div>
{/* Romanization */}
<div style={{ fontSize:'16px', color:'#e94560', fontWeight:'600', marginBottom:'4px' }}>
{line.romanization}
</div>
{/* English pronunciation */}
<div style={{ fontSize:'14px', color:'#38bdf8', fontWeight:'600', marginBottom:'6px' }}>
🗣 {line.englishPronunciation}
</div>
{/* English */}
<div style={{ fontSize:'17px', color:'#4ade80', fontWeight:'700', marginBottom:'16px' }}>
{line.english}
</div>

<div style={{ display:'flex', gap:'10px', alignItems:'center', flexWrap:'wrap' }}>
<button className="spk-btn"
onClick={()=>handleSpeak(line.korean,`shadow-${idx}`,false)}
style={{ padding:'10px 20px', background:'rgba(233,69,96,0.15)',
border:'1px solid rgba(233,69,96,0.35)', borderRadius:'10px',
color:'#e94560', fontSize:'14px', fontWeight:'800',
cursor:'pointer', fontFamily:'inherit' }}>
🔊 Listen
</button>
<button className="spk-btn"
onClick={()=>handleSpeak(line.korean,`shadow-slow-${idx}`,true)}
style={{ padding:'10px 20px', background:'rgba(56,189,248,0.1)',
border:'1px solid rgba(56,189,248,0.3)', borderRadius:'10px',
color:'#38bdf8', fontSize:'14px', fontWeight:'800',
cursor:'pointer', fontFamily:'inherit' }}>
🐢 Slow
</button>
<button className="spk-btn"
onClick={()=>startShadow(line)}
style={{ padding:'10px 20px',
background: shadowRec && shadowTarget?.id===line.id
? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.05)',
border:`1px solid ${shadowRec && shadowTarget?.id===line.id
? 'rgba(74,222,128,0.5)':'rgba(255,255,255,0.1)'}`,
borderRadius:'10px',
color: shadowRec && shadowTarget?.id===line.id ? '#4ade80' : '#888',
fontSize:'14px', fontWeight:'800', cursor:'pointer',
fontFamily:'inherit', animation: shadowRec && shadowTarget?.id===line.id
? 'glow 1s ease infinite' : 'none' }}>
{shadowRec && shadowTarget?.id===line.id ? '⏺ Recording...' : '🎤 Record'}
</button>
</div>

{shadowResult && shadowTarget?.id === line.id && (
<div style={{ marginTop:'14px', background:'rgba(255,255,255,0.04)',
border:'1px solid rgba(255,255,255,0.1)', borderRadius:'12px',
padding:'14px 16px' }}>
<div style={{ fontSize:'13px', color:'#888', marginBottom:'8px' }}>
You said: <span style={{ color:'#f8d347', fontWeight:'700' }}>
"{shadowResult.spoken}"
</span>
</div>
<div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
<div style={{ flex:1, height:'8px', background:'rgba(255,255,255,0.06)',
borderRadius:'4px', overflow:'hidden' }}>
<div style={{ width:`${shadowResult.score}%`, height:'100%',
borderRadius:'4px', transition:'width 0.5s ease',
background:shadowResult.score>=80?'#4ade80':
shadowResult.score>=60?'#fb923c':'#e94560' }}/>
</div>
<span style={{ fontSize:'18px', fontWeight:'900',
color:shadowResult.score>=80?'#4ade80':
shadowResult.score>=60?'#fb923c':'#e94560',
fontFamily:"'Syne',sans-serif" }}>
{shadowResult.score}%
</span>
</div>
<div style={{ fontSize:'12px', color:'#555', marginTop:'6px' }}>
{shadowResult.score >= 80 ? '🎉 Excellent pronunciation!' :
shadowResult.score >= 60 ? '👍 Good try! Listen again and retry.' :
'💪 Keep practicing! Slow speed helps.'}
</div>
</div>
)}
</div>
))}
</div>
)}

{/* ════════════ QUIZ MODE ════════════ */}
{mode === 'quiz' && (
<div>
{/* Progress */}
<div style={{ marginBottom:'20px' }}>
<div style={{ display:'flex', justifyContent:'space-between',
marginBottom:'8px', fontSize:'13px', color:'#555' }}>
<span>Question {quizIdx+1} of {selected.script.length}</span>
<span style={{ color:'#4ade80', fontWeight:'700' }}>Score: {quizScore}</span>
</div>
<div style={{ height:'6px', background:'rgba(255,255,255,0.06)',
borderRadius:'3px', overflow:'hidden' }}>
<div style={{ width:`${((quizIdx)/selected.script.length)*100}%`,
height:'100%', background:selected.levelColor, borderRadius:'3px',
transition:'width .4s ease' }}/>
</div>
</div>

{quizIdx < selected.script.length ? (
<div style={{ background:'rgba(255,255,255,0.02)',
border:'1px solid rgba(255,255,255,0.08)', borderRadius:'20px',
padding:'32px' }}>
{/* English meaning */}
<div style={{ textAlign:'center', marginBottom:'24px' }}>
<div style={{ fontSize:'12px', color:'#555', fontWeight:'700',
letterSpacing:'1px', marginBottom:'10px' }}>
TYPE THE KOREAN FOR:
</div>
<div style={{ fontSize:'32px', fontWeight:'900',
fontFamily:"'Syne',sans-serif", color:'#4ade80', marginBottom:'8px' }}>
{selected.script[quizIdx].english}
</div>
<div style={{ fontSize:'15px', color:'#555' }}>
Hint: {selected.script[quizIdx].romanization}
</div>
{/* Hear the pronunciation hint */}
<button className="spk-btn"
onClick={()=>speakKorean(selected.script[quizIdx].korean, true)}
style={{ marginTop:'12px', padding:'7px 18px',
background:'rgba(56,189,248,0.1)',
border:'1px solid rgba(56,189,248,0.3)', borderRadius:'8px',
color:'#38bdf8', fontSize:'12px', fontWeight:'700',
cursor:'pointer', fontFamily:'inherit' }}>
🐢 Hear it slowly
</button>
</div>

{/* Input */}
<input value={quizInput}
onChange={e=>setQuizInput(e.target.value)}
onKeyDown={e=>e.key==='Enter'&&checkQuiz()}
placeholder="Type Korean here... (or copy from above)"
style={{ width:'100%', padding:'16px 20px', fontSize:'22px',
background:'rgba(255,255,255,0.04)',
border:`1px solid ${quizFeedback?.type==='success'?'rgba(74,222,128,0.5)':
quizFeedback?.type==='error'?'rgba(233,69,96,0.5)':'rgba(255,255,255,0.1)'}`,
borderRadius:'12px', color:'#fff', outline:'none',
fontFamily:"'Syne',sans-serif", fontWeight:'700',
textAlign:'center', boxSizing:'border-box', marginBottom:'14px',
transition:'border-color .3s' }}/>

{/* Feedback */}
{quizFeedback && (
<div style={{ textAlign:'center', marginBottom:'14px', padding:'12px',
borderRadius:'10px', fontSize:'16px', fontWeight:'700',
background:quizFeedback.type==='success'?'rgba(74,222,128,0.1)':'rgba(233,69,96,0.1)',
color:quizFeedback.type==='success'?'#4ade80':'#e94560' }}>
{quizFeedback.msg}
</div>
)}

<div style={{ display:'flex', gap:'10px', justifyContent:'center' }}>
<button className="spk-btn" onClick={checkQuiz}
style={{ padding:'12px 36px',
background:`linear-gradient(135deg,${selected.levelColor},${selected.levelColor}aa)`,
border:'none', borderRadius:'12px', color:'#fff',
fontSize:'16px', fontWeight:'900', cursor:'pointer',
fontFamily:"'Syne',sans-serif" }}>
Check ✓
</button>
<button className="spk-btn"
onClick={()=>{setQuizInput('');setQuizFeedback(null);
if(quizIdx+1<selected.script.length)setQuizIdx(i=>i+1);}}
style={{ padding:'12px 24px', background:'rgba(255,255,255,0.05)',
border:'1px solid rgba(255,255,255,0.1)', borderRadius:'12px',
color:'#666', fontSize:'14px', fontWeight:'700',
cursor:'pointer', fontFamily:'inherit' }}>
Skip →
</button>
</div>
</div>
) : (
// Quiz complete
<div style={{ textAlign:'center', padding:'48px' }}>
<div style={{ fontSize:'72px', marginBottom:'16px' }}>🏆</div>
<h2 style={{ fontSize:'28px', fontWeight:'900', color:'#f8d347',
fontFamily:"'Syne',sans-serif", marginBottom:'8px' }}>
Scene Complete!
</h2>
<p style={{ color:'#555', fontSize:'14px', marginBottom:'24px' }}>
You scored {quizScore} / {selected.script.length}
</p>
<button onClick={()=>{setQuizIdx(0);setQuizScore(0);setQuizInput('');setQuizFeedback(null);}}
style={{ padding:'12px 32px', background:'linear-gradient(135deg,#e94560,#c73652)',
border:'none', borderRadius:'12px', color:'#fff',
fontSize:'16px', fontWeight:'800', cursor:'pointer', fontFamily:'inherit' }}>
🔄 Retry Quiz
</button>
</div>
)}
</div>
)}

{/* Play CTA */}
<div style={{ marginTop:'28px', background:'rgba(233,69,96,0.05)',
border:'1px solid rgba(233,69,96,0.2)', borderRadius:'16px',
padding:'20px 24px', display:'flex', justifyContent:'space-between',
alignItems:'center' }}>
<div>
<div style={{ fontSize:'15px', fontWeight:'800',
fontFamily:"'Syne',sans-serif", marginBottom:'4px' }}>
🎮 Use these phrases in the game!
</div>
<div style={{ fontSize:'13px', color:'#555' }}>
Speak Korean → Control your character
</div>
</div>
<button onClick={()=>navigate('/game')}
style={{ padding:'11px 28px', background:'linear-gradient(135deg,#e94560,#c73652)',
border:'none', borderRadius:'12px', color:'#fff',
fontWeight:'800', fontSize:'14px', cursor:'pointer',
fontFamily:'inherit', whiteSpace:'nowrap' }}>
🎮 Play Now →
</button>
</div>
</div>
)}

{/* ── PronunciationPortal — rendered at root level so it overlays everything ── */}
{practiceTarget && (
<PronunciationPortal
line={practiceTarget.line}
accentColor={practiceTarget.accentColor}
onClose={() => setPracticeTarget(null)}
/>
)}
</div>
);
}