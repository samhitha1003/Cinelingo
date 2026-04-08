package com.cinelingo.backend.controllers;

import com.cinelingo.backend.models.Clip;
import com.cinelingo.backend.models.Vocabulary;
import com.cinelingo.backend.repositories.ClipRepository;
import com.cinelingo.backend.repositories.VocabularyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/seed")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class SeedController {

    private final ClipRepository clipRepository;
    private final VocabularyRepository vocabularyRepository;

    /**
     * POST /api/seed/clips
     * Wipes existing data and seeds 10 K-Drama/Korean clips with
     * tiered vocabulary: beginner words → intermediate sentences → advanced patterns
     */
    @PostMapping("/clips")
    public ResponseEntity<?> seedClips() {

        // ── Clear existing ──────────────────────────────────────────────────
        clipRepository.deleteAll();
        vocabularyRepository.deleteAll();

        List<Map<String, String>> seeded = new ArrayList<>();

        // ═══════════════════════════════════════════════════════════════════
        // VIDEO 1: KXljXfj0Q4c — Korean Greetings & Self-Introduction
        // ═══════════════════════════════════════════════════════════════════
        Clip v1 = saveClip("Korean Greetings & Self Introduction",
                "Korean with Oppa", "KXljXfj0Q4c", 0, 1, "Seoul",
                List.of("Greetings", "Beginner", "Daily Life"),
                List.of("이에요/예요 (to be)", "저는 (I am)", "반갑습니다 (Nice to meet)"),
                "Learn essential Korean greeting phrases used every day");
        // BEGINNER: Individual words
        seedVocab(v1.getId(), List.of(
                w("안녕하세요",   "an-nyeong-ha-se-yo",  "Hello (formal polite)",           "안녕하세요! 처음 뵙겠습니다.",            1),
                w("안녕",         "an-nyeong",            "Hi / Bye (casual)",               "친구야, 안녕!",                          1),
                w("감사합니다",   "gam-sa-ham-ni-da",    "Thank you (formal)",              "도와주셔서 감사합니다.",                  1),
                w("고마워",       "go-ma-wo",            "Thanks (casual)",                 "고마워, 친구야!",                        1),
                w("미안해요",     "mi-an-hae-yo",        "I'm sorry",                       "늦어서 미안해요.",                       1),
                w("괜찮아요",     "gwaen-cha-na-yo",     "It's okay / No worries",          "괜찮아요, 걱정하지 마세요.",             1),
                w("네",           "ne",                  "Yes",                             "네, 맞아요.",                            1),
                w("아니요",       "a-ni-yo",             "No",                              "아니요, 저는 학생이에요.",               1),
                w("저는",         "jeo-neun",            "I am / As for me",                "저는 한국어를 배우고 있어요.",           1),
                w("이름",         "i-reum",              "Name",                            "제 이름이 뭐예요?",                      1),
                // INTERMEDIATE: Sentences
                w("만나서 반갑습니다", "man-na-seo ban-gap-seum-ni-da", "Nice to meet you",  "안녕하세요! 만나서 반갑습니다.",         2),
                w("처음 뵙겠습니다",   "cheo-eum bwep-get-seum-ni-da", "First time meeting", "처음 뵙겠습니다, 잘 부탁드립니다.",     2),
                w("잘 부탁드립니다",   "jal bu-tak-deu-rim-ni-da",     "Please take care of me", "앞으로 잘 부탁드립니다.",           2),
                w("오랜만이에요",      "o-raen-ma-ni-e-yo",           "Long time no see",   "오랜만이에요! 잘 지냈어요?",            2),
                w("잘 지냈어요?",      "jal ji-naet-sseo-yo",         "Have you been well?", "오랜만이에요, 잘 지냈어요?",           2),
                // ADVANCED: Full conversation
                w("처음 뵙겠습니다, 저는 김민준입니다", "cheo-eum bwep-get-seum-ni-da, jeo-neun gim-min-jun-im-ni-da",
                        "Nice to meet you, I am Kim Minjun", "처음 뵙겠습니다, 저는 김민준입니다. 앞으로 잘 부탁드립니다!", 3)
        ));
        seeded.add(Map.of("title", v1.getTitle(), "id", v1.getId()));

        // ═══════════════════════════════════════════════════════════════════
        // VIDEO 2: eYSH7kLGtGo — Korean Restaurant & Food Ordering
        // ═══════════════════════════════════════════════════════════════════
        Clip v2 = saveClip("Ordering Food in Korean",
                "Korean Unnie", "eYSH7kLGtGo", 0, 1, "Seoul",
                List.of("Food", "Beginner", "Daily Life"),
                List.of("주세요 (please give)", "얼마예요? (how much?)", "맛있다 (delicious)"),
                "Essential phrases for ordering food at Korean restaurants");
        seedVocab(v2.getId(), List.of(
                // BEGINNER words
                w("밥",           "bap",               "Rice / Meal",              "밥 먹었어요?",                            1),
                w("물",           "mul",               "Water",                    "물 한 잔 주세요.",                        1),
                w("맛있어요",     "ma-si-sseo-yo",     "It's delicious",           "이 음식 정말 맛있어요!",                  1),
                w("맵다",         "maep-da",           "Spicy",                    "이거 많이 맵다!",                         1),
                w("달다",         "dal-da",            "Sweet",                    "이 떡볶이 달아요.",                       1),
                w("배고파요",     "bae-go-pa-yo",      "I'm hungry",               "배고파요, 밥 먹고 싶어요.",               1),
                w("배불러요",     "bae-bul-leo-yo",    "I'm full",                 "너무 배불러요, 더 못 먹겠어요.",          1),
                w("계산",         "gye-san",           "Bill / Payment",           "계산해 주세요.",                          1),
                w("얼마예요",     "eol-ma-ye-yo",      "How much is it?",          "이거 얼마예요?",                          1),
                w("주세요",       "ju-se-yo",          "Please give me",           "김치찌개 하나 주세요.",                   1),
                // INTERMEDIATE sentences
                w("뭐가 맛있어요?",        "mwo-ga ma-si-sseo-yo",         "What is delicious here?",    "여기 뭐가 제일 맛있어요?",                   2),
                w("이거 맵지 않아요?",      "i-geo maep-ji a-na-yo",        "Is this not spicy?",         "이거 맵지 않아요? 저 매운 거 못 먹어요.",   2),
                w("물 좀 더 주세요",        "mul jom deo ju-se-yo",         "Please give me more water",  "물 좀 더 주세요, 감사합니다.",               2),
                w("포장해 주세요",          "po-jang-hae ju-se-yo",         "Please pack it to go",       "다 못 먹겠어요, 포장해 주세요.",             2),
                w("카드 되나요?",           "ka-deu doe-na-yo",             "Do you accept cards?",       "혹시 카드 되나요, 아니면 현금만요?",         2),
                // ADVANCED
                w("삼겹살 이인분이랑 냉면 하나 주시겠어요?",
                        "sam-gyeop-sal i-in-bun-i-rang naeng-myeon ha-na ju-si-ge-sseo-yo",
                        "Could I have 2 portions of pork belly and 1 cold noodles?",
                        "저기요, 삼겹살 이인분이랑 냉면 하나 주시겠어요?", 3)
        ));
        seeded.add(Map.of("title", v2.getTitle(), "id", v2.getId()));

        // ═══════════════════════════════════════════════════════════════════
        // VIDEO 3: A4IxJj4eHWM — Korean Numbers & Shopping
        // ═══════════════════════════════════════════════════════════════════
        Clip v3 = saveClip("Korean Numbers & Shopping Phrases",
                "Talk To Me In Korean", "A4IxJj4eHWM", 0, 1, "Seoul",
                List.of("Shopping", "Numbers", "Beginner"),
                List.of("숫자 (numbers)", "이거 (this)", "저거 (that)"),
                "Count in Korean and shop like a local!");
        seedVocab(v3.getId(), List.of(
                w("하나",         "ha-na",             "One (Korean counting)",    "사과 하나 주세요.",                       1),
                w("둘",           "dul",               "Two",                      "커피 둘 주세요.",                         1),
                w("셋",           "set",               "Three",                    "볼펜 셋 필요해요.",                       1),
                w("이거",         "i-geo",             "This / This one",          "이거 얼마예요?",                          1),
                w("저거",         "jeo-geo",           "That / That one",          "저거 주세요.",                            1),
                w("비싸요",       "bi-ssa-yo",         "It's expensive",           "너무 비싸요, 깎아 주세요!",               1),
                w("싸요",         "ssa-yo",            "It's cheap",               "와, 이거 정말 싸요!",                     1),
                w("있어요",       "i-sseo-yo",         "There is / Have",          "이거 다른 색 있어요?",                    1),
                w("없어요",       "eop-sseo-yo",       "There isn't / Don't have", "죄송해요, 지금 없어요.",                  1),
                w("보여주세요",   "bo-yeo-ju-se-yo",   "Please show me",           "저거 좀 보여주세요.",                     1),
                // INTERMEDIATE
                w("이거 입어 봐도 돼요?",   "i-geo i-beo bwa-do dwae-yo",   "Can I try this on?",         "이거 입어 봐도 돼요?",                        2),
                w("다른 색 있어요?",         "da-reun saek i-sseo-yo",       "Do you have other colors?",  "이거 파란색 있어요? 다른 색 없어요?",         2),
                w("좀 더 싸게 해주세요",     "jom deo ssa-ge hae-ju-se-yo",  "Please make it a bit cheaper","이거 좀 더 싸게 해주세요, 많이 살게요.",      2),
                w("영수증 주세요",           "yeong-su-jeung ju-se-yo",      "Please give me the receipt", "혹시 영수증 주세요, 나중에 교환할 수도 있어서.", 2),
                // ADVANCED
                w("이 옷 사이즈가 좀 큰데 더 작은 거 있어요?",
                        "i ot sa-i-jeu-ga jom keun-de deo ja-geun geo i-sseo-yo",
                        "This clothing size is a bit big, do you have a smaller one?",
                        "이 옷 사이즈가 좀 큰데 더 작은 거 있어요?", 3)
        ));
        seeded.add(Map.of("title", v3.getTitle(), "id", v3.getId()));

        // ═══════════════════════════════════════════════════════════════════
        // VIDEO 4: 3pW50cck3-k — Korean Directions & Transportation
        // ═══════════════════════════════════════════════════════════════════
        Clip v4 = saveClip("Getting Around Seoul — Directions",
                "Eat Your Kimchi", "3pW50cck3-k", 0, 2, "Seoul",
                List.of("Directions", "Transportation", "Intermediate"),
                List.of("으로 (directional marker)", "에서 (from)", "까지 (until/to)"),
                "Navigate Seoul like a local using Korean directions");
        seedVocab(v4.getId(), List.of(
                w("왼쪽",         "wen-jjok",          "Left",                     "왼쪽으로 가세요.",                        1),
                w("오른쪽",       "o-reun-jjok",       "Right",                    "오른쪽에 편의점이 있어요.",               1),
                w("직진",         "jik-jin",           "Straight ahead",           "계속 직진하세요.",                        1),
                w("지하철",       "ji-ha-cheol",       "Subway",                   "지하철역이 어디예요?",                    1),
                w("버스",         "beo-seu",           "Bus",                      "이 버스 어디 가요?",                      1),
                w("택시",         "taek-si",           "Taxi",                     "택시 타고 갈까요?",                       1),
                w("역",           "yeok",              "Station",                  "가장 가까운 역이 어디예요?",               1),
                w("출구",         "chul-gu",           "Exit",                     "3번 출구로 나오세요.",                    1),
                w("근처",         "geun-cheo",         "Nearby",                   "근처에 편의점 있어요?",                   1),
                w("걸어서",       "geo-reo-seo",       "On foot / Walking",        "걸어서 10분이에요.",                      1),
                // INTERMEDIATE
                w("여기서 어떻게 가요?",      "yeo-gi-seo eo-tteo-ke ga-yo",     "How do I get there from here?", "강남역에서 어떻게 가요?",                    2),
                w("몇 번 출구로 나와요?",     "myeot beon chul-gu-ro na-wa-yo",  "Which exit do I come out of?",  "홍대입구역 몇 번 출구로 나와요?",           2),
                w("다음 역은 어디예요?",      "da-eum yeok-eun eo-di-ye-yo",     "What is the next station?",     "죄송한데 다음 역은 어디예요?",               2),
                w("갈아타야 해요?",           "ga-ra-ta-ya hae-yo",              "Do I need to transfer?",        "2호선으로 갈아타야 해요?",                   2),
                w("이 버스 시청 가나요?",     "i beo-seu si-cheong ga-na-yo",    "Does this bus go to City Hall?", "실례합니다, 이 버스 시청 가나요?",           2),
                // ADVANCED
                w("명동까지 가는 가장 빠른 방법이 뭐예요?",
                        "myeong-dong-kka-ji ga-neun ga-jang ppa-reun bang-beop-i mwo-ye-yo",
                        "What is the fastest way to get to Myeongdong?",
                        "지금 명동까지 가는 가장 빠른 방법이 뭐예요? 지하철이요, 아니면 버스요?", 3)
        ));
        seeded.add(Map.of("title", v4.getTitle(), "id", v4.getId()));

        // ═══════════════════════════════════════════════════════════════════
        // VIDEO 5: tLzxjZFR2BM — K-Drama Love Confession Scene
        // ═══════════════════════════════════════════════════════════════════
        Clip v5 = saveClip("K-Drama Romance Phrases",
                "Drama Korea", "tLzxjZFR2BM", 0, 2, "Seoul",
                List.of("Romance", "K-Drama", "Intermediate"),
                List.of("고 싶다 (want to)", "보고 싶다 (miss you)", "사랑해 (love you)"),
                "Express feelings and love in Korean like K-Drama characters!");
        seedVocab(v5.getId(), List.of(
                w("사랑해요",     "sa-rang-hae-yo",    "I love you (polite)",      "당신을 사랑해요.",                        1),
                w("보고 싶어요",  "bo-go si-peo-yo",   "I miss you",               "많이 보고 싶어요.",                       1),
                w("좋아해요",     "jo-a-hae-yo",       "I like you",               "나 사실 너 좋아해요.",                    1),
                w("예뻐요",       "ye-ppeo-yo",        "You're pretty/beautiful",  "오늘 정말 예뻐요.",                       1),
                w("잘생겼어요",   "jal-saeng-gyeo-sseo-yo", "Handsome",            "우리 오빠 진짜 잘생겼어요.",              1),
                w("함께",         "ham-kke",           "Together",                 "함께 있고 싶어요.",                       1),
                w("행복해요",     "haeng-bo-kae-yo",   "I'm happy",               "당신 덕분에 너무 행복해요.",              1),
                w("기다려요",     "gi-da-ryeo-yo",     "I wait / I'm waiting",     "매일 당신을 기다려요.",                   1),
                w("마음",         "ma-eum",            "Heart / Mind / Feelings",  "제 마음 알아요?",                         1),
                w("설레요",       "seol-le-yo",        "My heart flutters",        "당신을 볼 때마다 설레요.",                 1),
                // INTERMEDIATE
                w("나 너한테 빠진 것 같아",     "na neo-han-te ppa-jin geot ga-ta",   "I think I've fallen for you",  "나 너한테 빠진 것 같아, 어떡하지?",           2),
                w("오늘 저랑 데이트할래요?",    "o-neul jeo-rang de-i-teu-hal-lae-yo", "Would you like to date with me today?", "오늘 저랑 데이트할래요?",              2),
                w("저한테 관심 있어요?",        "jeo-han-te gwan-sim i-sseo-yo",       "Are you interested in me?",   "혹시 저한테 관심 있어요?",                    2),
                w("제가 많이 좋아하는 것 알아요?", "je-ga ma-ni jo-a-ha-neun geot a-ra-yo", "Do you know I like you a lot?", "저 사실 제가 많이 좋아하는 것 알아요?",  2),
                // ADVANCED
                w("처음 만난 날부터 너밖에 안 보였어",
                        "cheo-eum man-nan nal-bu-teo neo-ba-kke an bo-yeo-sseo",
                        "From the first day we met, I only saw you",
                        "솔직히 말하면, 처음 만난 날부터 너밖에 안 보였어.", 3)
        ));
        seeded.add(Map.of("title", v5.getTitle(), "id", v5.getId()));

        // ═══════════════════════════════════════════════════════════════════
        // VIDEO 6: oEU7WhNNKL8 — Korean Work & Office Expressions
        // ═══════════════════════════════════════════════════════════════════
        Clip v6 = saveClip("Korean Office & Work Expressions",
                "Korean Class 101", "oEU7WhNNKL8", 0, 2, "Seoul",
                List.of("Work", "Formal", "Intermediate"),
                List.of("합니다체 (formal speech)", "드리다 (give-honorific)", "-(으)ㄹ게요 (I will)"),
                "Professional Korean for the workplace and business");
        seedVocab(v6.getId(), List.of(
                w("회사",         "hoe-sa",            "Company",                  "저는 IT 회사에 다녀요.",                  1),
                w("일",           "il",                "Work",                     "일이 너무 많아요.",                       1),
                w("회의",         "hoe-ui",            "Meeting",                  "오늘 회의 있어요?",                       1),
                w("보고서",       "bo-go-seo",         "Report",                   "보고서 제출했어요?",                      1),
                w("야근",         "ya-geun",           "Overtime work",            "오늘도 야근해야 해요.",                   1),
                w("상사",         "sang-sa",           "Boss / Superior",          "우리 상사 무서워요.",                     1),
                w("동료",         "dong-nyo",          "Colleague",                "동료들이랑 점심 먹었어요.",               1),
                w("출근",         "chul-geun",         "Going to work",            "몇 시에 출근해요?",                       1),
                w("퇴근",         "toe-geun",          "Leaving work",             "몇 시에 퇴근해요?",                       1),
                w("연봉",         "yeon-bong",         "Annual salary",            "연봉 협상을 해야 해요.",                  1),
                // INTERMEDIATE
                w("이 자료 검토해 주시겠어요?",   "i ja-ryo geom-to-hae ju-si-ge-sseo-yo", "Could you review this material?", "바쁘시겠지만 이 자료 검토해 주시겠어요?",   2),
                w("회의실 예약했어요?",           "hoe-ui-sil ye-yak-haet-sseo-yo",        "Did you book the meeting room?",  "오후 3시 회의실 예약했어요?",               2),
                w("마감이 언제예요?",             "ma-gam-i eon-je-ye-yo",                 "When is the deadline?",           "이 프로젝트 마감이 언제예요?",             2),
                w("메일 확인해 드릴게요",         "me-il hwa-gin-hae deu-ril-ge-yo",       "I will check the email",          "지금 바로 메일 확인해 드릴게요.",           2),
                // ADVANCED
                w("이번 프로젝트 진행 상황을 보고드리겠습니다",
                        "i-beon peu-ro-jek-teu jin-haeng sang-hwang-eul bo-go-deu-ri-get-seum-ni-da",
                        "I will report on the progress of this project",
                        "팀장님, 이번 프로젝트 진행 상황을 보고드리겠습니다.", 3)
        ));
        seeded.add(Map.of("title", v6.getTitle(), "id", v6.getId()));

        // ═══════════════════════════════════════════════════════════════════
        // VIDEO 7: Lyio9VdVtJg — Korean Emotions & Feelings
        // ═══════════════════════════════════════════════════════════════════
        Clip v7 = saveClip("Expressing Emotions in Korean",
                "Sweet and Tasty TV", "Lyio9VdVtJg", 0, 1, "Seoul",
                List.of("Emotions", "Beginner", "K-Drama"),
                List.of("아/어요 ending", "너무 (too/very)", "정말 (really)"),
                "Express every emotion in Korean — happy, sad, angry and more");
        seedVocab(v7.getId(), List.of(
                w("기뻐요",       "gi-ppeo-yo",        "I'm happy / Joyful",       "오늘 시험 합격해서 기뻐요!",              1),
                w("슬퍼요",       "seul-peo-yo",       "I'm sad",                  "영화 보다가 슬퍼서 울었어요.",            1),
                w("화나요",       "hwa-na-yo",         "I'm angry",                "왜 화나요? 무슨 일 있어요?",              1),
                w("무서워요",     "mu-seo-wo-yo",      "I'm scared / Scary",       "혼자 있으면 무서워요.",                   1),
                w("피곤해요",     "pi-gon-hae-yo",     "I'm tired",                "오늘 너무 피곤해요.",                     1),
                w("심심해요",     "sim-sim-hae-yo",    "I'm bored",                "할 것도 없고 심심해요.",                  1),
                w("걱정돼요",     "geok-jeong-dwae-yo","I'm worried",              "시험 때문에 걱정돼요.",                   1),
                w("신나요",       "sin-na-yo",         "I'm excited / Fun",        "여행 가서 정말 신나요!",                  1),
                w("놀라워요",     "nol-la-wo-yo",      "Surprised / Amazing",      "이 소식 들었어요? 정말 놀라워요!",         1),
                w("부끄러워요",   "bu-kkeu-reo-wo-yo", "I'm embarrassed",          "칭찬받으면 부끄러워요.",                  1),
                // INTERMEDIATE
                w("기분이 어때요?",       "gi-bun-i eo-ttae-yo",       "How are you feeling?",       "오늘 기분이 어때요? 괜찮아요?",              2),
                w("왜 그렇게 우울해요?",  "wae geu-reo-ke u-ul-hae-yo", "Why are you so depressed?", "요즘 왜 그렇게 우울해 보여요?",              2),
                w("기운 내세요!",         "gi-un nae-se-yo",           "Cheer up!",                  "힘들겠지만 기운 내세요! 할 수 있어요!",      2),
                w("너무 많이 웃었어요",   "neo-mu ma-ni u-seo-sseo-yo", "I laughed so much",          "그 영화 너무 재밌어서 너무 많이 웃었어요.",  2),
                // ADVANCED
                w("요즘 이유도 모르게 자꾸 우울해지는데 어떻게 해야 할지 모르겠어요",
                        "yo-jeum i-yu-do mo-reu-ge ja-kku u-ul-hae-ji-neun-de eo-tteo-ke hae-ya hal-ji mo-reu-get-sseo-yo",
                        "Lately I keep feeling depressed for no reason and I don't know what to do",
                        "요즘 이유도 모르게 자꾸 우울해지는데 어떻게 해야 할지 모르겠어요.", 3)
        ));
        seeded.add(Map.of("title", v7.getTitle(), "id", v7.getId()));

        // ═══════════════════════════════════════════════════════════════════
        // VIDEO 8: YBJZz2nKSBw — Korean Cafe & Coffee Ordering
        // ═══════════════════════════════════════════════════════════════════
        Clip v8 = saveClip("Korean Cafe Culture & Coffee Ordering",
                "Arirang TV", "YBJZz2nKSBw", 0, 1, "Seoul",
                List.of("Cafe", "Food", "Beginner", "Daily Life"),
                List.of("으로 (with/using)", "드릴까요? (Shall I give?)", "아이스/따뜻한"),
                "Order coffee and enjoy cafe culture in Korean");
        seedVocab(v8.getId(), List.of(
                w("커피",         "keo-pi",            "Coffee",                   "커피 한 잔 할래요?",                      1),
                w("아이스",       "a-i-seu",           "Iced / Cold",              "아이스 아메리카노 주세요.",                1),
                w("따뜻한",       "dda-ddeu-tan",      "Hot / Warm",               "따뜻한 라떼 주세요.",                     1),
                w("카페",         "ka-pe",             "Cafe / Coffee shop",        "우리 카페 가서 얘기해요.",                1),
                w("케이크",       "ke-i-keu",          "Cake",                     "케이크도 하나 주세요.",                   1),
                w("테이크아웃",   "te-i-keu-a-ut",     "Takeout / To go",          "테이크아웃으로 할게요.",                  1),
                w("머그",         "meo-geu",           "Mug (for here)",           "머그컵으로 주세요.",                      1),
                w("설탕",         "seol-tang",         "Sugar",                    "설탕 빼 주세요.",                         1),
                w("디카페인",     "di-ka-pe-in",       "Decaf",                    "디카페인으로 해주세요.",                  1),
                w("사이즈",       "sa-i-jeu",          "Size",                     "사이즈 큰 걸로 주세요.",                  1),
                // INTERMEDIATE
                w("아이스 아메리카노 한 잔 주세요",     "a-i-seu a-me-ri-ka-no han jan ju-se-yo",      "Please give me one iced americano", "저기요, 아이스 아메리카노 한 잔 주세요.",        2),
                w("설탕이랑 시럽은 빼 주실 수 있어요?", "seol-tang-i-rang si-reop-eun bbae ju-sil su i-sseo-yo", "Can you leave out sugar and syrup?", "혹시 설탕이랑 시럽은 빼 주실 수 있어요?",  2),
                w("진동벨 있어요?",                     "jin-dong-bel i-sseo-yo",                       "Do you have a buzzer?",             "혹시 진동벨 있어요? 아니면 제 이름 불러줘요?", 2),
                // ADVANCED
                w("아이스 아메리카노 라지 사이즈로 하나, 그리고 카라멜 마끼아또 디카페인으로 하나 주세요",
                        "a-i-seu a-me-ri-ka-no la-ji sa-i-jeu-ro ha-na, geu-ri-go ka-ra-mel ma-kki-a-tto di-ka-pe-in-eu-ro ha-na ju-se-yo",
                        "One large iced americano, and one caramel macchiato decaf please",
                        "아이스 아메리카노 라지 사이즈 하나, 카라멜 마끼아또 디카페인으로 하나 주세요.", 3)
        ));
        seeded.add(Map.of("title", v8.getTitle(), "id", v8.getId()));

        // ═══════════════════════════════════════════════════════════════════
        // VIDEO 9: 1Rxr2GvyvZs — Squid Game Korean Survival
        // ═══════════════════════════════════════════════════════════════════
        Clip v9 = saveClip("Squid Game — Survival Korean",
                "Netflix Korea", "1Rxr2GvyvZs", 0, 3, "Seoul",
                List.of("K-Drama", "Advanced", "Thriller", "Squid Game"),
                List.of("-(으)면 안 돼요 (must not)", "아/어야 해요 (must do)", "빨리 (quickly)"),
                "Intense Korean from the iconic survival drama — advanced expressions");
        seedVocab(v9.getId(), List.of(
                w("살아남다",     "sa-ra-nam-da",      "To survive",               "살아남아야 해요!",                        1),
                w("도망가",       "do-mang-ga",        "Run away / Flee",          "빨리 도망가!",                            1),
                w("멈춰",         "meom-chwo",         "Stop!",                    "거기 멈춰!",                              1),
                w("숨어",         "su-meo",            "Hide!",                    "저기 뒤에 숨어!",                         1),
                w("조용히",       "jo-yong-hi",        "Quietly / Silence",        "조용히 해, 들켜!",                        1),
                w("위험해",       "wi-heom-hae",       "It's dangerous",           "거기 위험해, 가지 마!",                   1),
                w("죽으면 안 돼", "ju-geu-myeon an-dwae", "You must not die",     "절대 죽으면 안 돼!",                      1),
                w("믿어",         "mi-deo",            "Trust / Believe",          "날 믿어, 내가 지켜줄게.",                  1),
                w("함께",         "ham-kke",           "Together",                 "함께 살아남자.",                          1),
                w("포기하지 마",  "po-gi-ha-ji ma",    "Don't give up",            "절대 포기하지 마, 할 수 있어!",            1),
                // INTERMEDIATE
                w("우리 같이 살아남자",    "u-ri ga-chi sa-ra-nam-ja",       "Let's survive together",       "포기하지 마, 우리 같이 살아남자!",            2),
                w("이 게임 이길 수 있어?", "i ge-im i-gil su i-sseo",         "Can we win this game?",        "정말 이 게임 이길 수 있어? 너무 힘들어.",     2),
                w("서로 믿어야 해",        "seo-ro mi-deo-ya hae",            "We need to trust each other",  "지금은 서로 믿어야 해, 그래야 살 수 있어.",   2),
                w("돈이 전부가 아니야",    "don-i jeon-bu-ga a-ni-ya",        "Money isn't everything",       "돈이 전부가 아니야, 살아남는 게 더 중요해.", 2),
                // ADVANCED
                w("우리가 끝까지 살아남으려면 서로를 믿고 절대 포기하면 안 돼",
                        "u-ri-ga kkeut-kka-ji sa-ra-nam-eu-ryeo-myeon seo-ro-reul mit-go jeol-dae po-gi-ha-myeon an-dwae",
                        "For us to survive to the end, we must trust each other and never give up",
                        "우리가 끝까지 살아남으려면 서로를 믿고 절대 포기하면 안 돼.", 3)
        ));
        seeded.add(Map.of("title", v9.getTitle(), "id", v9.getId()));

        // ═══════════════════════════════════════════════════════════════════
        // VIDEO 10: Crash Landing on You — Romance & Drama
        // ═══════════════════════════════════════════════════════════════════
        Clip v10 = saveClip("Crash Landing on You — Love & Drama",
                "tvN Drama", "Q-rGIR3DdNk", 0, 2, "Seoul",
                List.of("K-Drama", "Romance", "Intermediate"),
                List.of("겠어요 (intention/conjecture)", "-(으)ㄹ 수 있어요 (can do)", "이미 (already)"),
                "Emotional Korean expressions from Crash Landing on You");
        seedVocab(v10.getId(), List.of(
                w("보호해줄게요", "bo-ho-hae-jul-ge-yo", "I will protect you",      "내가 꼭 보호해줄게요.",                   1),
                w("돌아가요",     "do-ra-ga-yo",        "Go back / Return",         "지금 당장 돌아가요.",                     1),
                w("여기",         "yeo-gi",             "Here",                     "여기가 어디예요?",                        1),
                w("거기",         "geo-gi",             "There",                    "거기 가지 마세요.",                       1),
                w("기억해요",     "gi-eo-kae-yo",       "Remember",                 "저 기억해요?",                            1),
                w("잊어버려요",   "i-jeo-beo-ryeo-yo",  "Forget",                   "다 잊어버려요, 과거는 중요하지 않아요.",  1),
                w("운명",         "un-myeong",          "Fate / Destiny",           "이게 우리의 운명인가요?",                 1),
                w("기다릴게요",   "gi-da-ril-ge-yo",    "I will wait",              "얼마든지 기다릴게요.",                    1),
                w("찾아올게요",   "cha-ja-ol-ge-yo",    "I will come find you",     "꼭 다시 찾아올게요.",                     1),
                w("처음",         "cheo-eum",           "First / Beginning",        "처음 만났을 때부터 알았어요.",             1),
                // INTERMEDIATE
                w("어디서 왔어요?",             "eo-di-seo wa-sseo-yo",          "Where did you come from?",      "도대체 어디서 왔어요? 여기는 어떻게?",        2),
                w("왜 저를 도와주는 거예요?",   "wae jeo-reul do-wa-ju-neun geo-ye-yo", "Why are you helping me?", "당신은 왜 저를 도와주는 거예요?",             2),
                w("다시는 보지 말아요",         "da-si-neun bo-ji ma-ra-yo",     "Don't see each other again",    "우리 이제 다시는 보지 말아요, 위험해요.",     2),
                w("당신을 잊을 수 없어요",      "dang-sin-eul i-jeul su eop-sseo-yo", "I can't forget you",       "아무리 노력해도 당신을 잊을 수 없어요.",      2),
                // ADVANCED
                w("당신을 처음 봤을 때부터 이미 내 마음속에 자리잡고 있었어요",
                        "dang-sin-eul cheo-eum bwat-seul ttae-bu-teo i-mi nae ma-eum-so-ge ja-ri-jap-go i-sseo-sseo-yo",
                        "From the first time I saw you, you had already taken a place in my heart",
                        "사실 당신을 처음 봤을 때부터 이미 내 마음속에 자리잡고 있었어요.", 3)
        ));
        seeded.add(Map.of("title", v10.getTitle(), "id", v10.getId()));

        return ResponseEntity.ok(Map.of(
                "message", "✅ Seeded " + seeded.size() + " clips with beginner/intermediate/advanced vocabulary!",
                "clips", seeded,
                "totalWords", "Each clip has ~15 words across 3 difficulty levels"
        ));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private Clip saveClip(String title, String movieName, String youtubeId,
                          int start, int difficulty, String accent,
                          List<String> genre, List<String> grammar, String description) {
        Clip clip = new Clip();
        clip.setTitle(title);
        clip.setMovieName(movieName);
        clip.setYoutubeId(youtubeId);
        clip.setYoutubeStart(start);
        clip.setVideoUrl("https://www.youtube.com/embed/" + youtubeId + "?start=" + start + "&rel=0");
        clip.setThumbnailUrl("https://img.youtube.com/vi/" + youtubeId + "/maxresdefault.jpg");
        clip.setDifficultyLevel(difficulty);
        clip.setAccentType(accent);
        clip.setGenre(genre);
        clip.setGrammarFocus(grammar);
        clip.setDescription(description);
        clip.setViewCount(0);
        clip.setCreatedAt(LocalDateTime.now());
        return clipRepository.save(clip);
    }

    private void seedVocab(String clipId, List<Map<String, Object>> words) {
        for (Map<String, Object> w : words) {
            Vocabulary vocab = new Vocabulary();
            vocab.setClipIds(List.of(clipId));
            vocab.setWord((String) w.get("word"));
            vocab.setPhonetic((String) w.get("phonetic"));
            vocab.setDifficultyLevel((int) w.get("difficulty"));
            vocab.setLanguage("korean");

            Vocabulary.Definition def = new Vocabulary.Definition();
            def.setMeaning((String) w.get("meaning"));
            def.setExampleSentence((String) w.get("example"));
            vocab.setDefinitions(List.of(def));




            vocabularyRepository.save(vocab);
        }
    }

    private Map<String, Object> w(String word, String phonetic, String meaning,
                                  String example, int difficulty) {
        return Map.of("word", word, "phonetic", phonetic,
                "meaning", meaning, "example", example, "difficulty", difficulty);
    }
}