from konlpy.tag import Okt

# Okt = Open Korean Text
# Best tagger for informal Korean (K-Drama dialogue)
okt = Okt()

def analyze_korean_text(text: str):
    """
    Break Korean sentence into morphemes
    Ex: "학교에 가요" →
    [('학교', 'Noun'), ('에', 'Josa'), ('가요', 'Verb')]
    """
    morphemes = okt.pos(text)
    return morphemes

def extract_vocabulary(text: str):
    """
    Extract only meaningful words (nouns, verbs, adjectives)
    Filter out particles (은/는/이/가/을/를)
    """
    morphemes = okt.pos(text)
    
    vocabulary = []
    for word, pos in morphemes:
        # Only keep content words
        if pos in ['Noun', 'Verb', 'Adjective', 'Adverb']:
            vocabulary.append({
                "word": word,
                "type": pos,
                "isHonorific": word.endswith('요') 
                               or word.endswith('니다')
            })
    
    return vocabulary

def detect_speech_level(text: str):
    """
    Detect formal vs informal Korean
    존댓말 (formal) vs 반말 (informal)
    """
    formal_endings = ['습니다','니다','세요','십시오']
    informal_endings = ['야','아','어','해','봐']
    
    if any(text.endswith(e) for e in formal_endings):
        return "formal"  # 존댓말
    elif any(text.endswith(e) for e in informal_endings):
        return "informal"  # 반말
    return "neutral"

def extract_particles(text: str):
    """
    Extract Korean particles (조사)
    은/는 → topic marker
    이/가 → subject marker
    을/를 → object marker
    에/에서 → location marker
    """
    morphemes = okt.pos(text)
    particles = []
    
    for word, pos in morphemes:
        if pos == 'Josa':  # particle
            particles.append({
                "particle": word,
                "function": get_particle_function(word)
            })
    
    return particles

def get_particle_function(particle: str):
    particle_map = {
        '은': 'topic marker',
        '는': 'topic marker',
        '이': 'subject marker',
        '가': 'subject marker',
        '을': 'object marker',
        '를': 'object marker',
        '에': 'location/time marker',
        '에서': 'action location marker',
        '로': 'direction marker',
        '와': 'and/with',
        '과': 'and/with',
    }
    return particle_map.get(particle, 'particle')