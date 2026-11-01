const fs = require('fs');
const path = require('path');

// Additional curated world-famous English + Korean quotes with Author names
const EXTRA_EN_QUOTES = [
  ["Stay hungry, stay foolish.", "늘 갈망하고, 우직하게 나아가라.", "스티브 잡스 (Steve Jobs)", "Stanford Commencement Speech (2005)"],
  ["Your time is limited, so don't waste it living someone else's life.", "당신의 시간은 유한하니, 남의 삶을 사느라 시간을 낭비하지 마라.", "스티브 잡스 (Steve Jobs)", "Stanford Commencement Speech (2005)"],
  ["Innovation distinguishes between a leader and a follower.", "혁신은 리더와 추종자를 구분 짓는다.", "스티브 잡스 (Steve Jobs)", "The Innovation Secrets of Steve Jobs"],
  ["The people who are crazy enough to think they can change the world are the ones who do.", "세상을 바꿀 수 있다고 생각할 만큼 미친 사람들이 결국 세상을 바꾼다.", "스티브 잡스 (Steve Jobs)", "Apple 'Think Different' Campaign (1997)"],
  ["Design is not just what it looks like and feels like. Design is how it works.", "디자인은 단지 어떻게 보이고 느껴지느냐의 문제가 아니다. 디자인은 어떻게 작동하느냐다.", "스티브 잡스 (Steve Jobs)", "The New York Times Interview (2003)"],
  ["Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.", "상상력은 지식보다 중요하다. 지식은 한계가 있지만 상상력은 세상의 모든 것을 끌어안는다.", "알베르트 아인슈타인 (Albert Einstein)", "Saturday Evening Post Interview (1929)"],
  ["Life is like riding a bicycle. To keep your balance, you must keep moving.", "인생은 자전거를 타는 것과 같다. 균형을 잡으려면 계속 움직여야 한다.", "알베르트 아인슈타인 (Albert Einstein)", "Letter to his son Eduard (1930)"],
  ["Strive not to be a success, but rather to be of value.", "성공한 사람이 되려고 애쓰지 말고, 가치 있는 사람이 되려고 애써라.", "알베르트 아인슈타인 (Albert Einstein)", "LIFE Magazine (1955)"],
  ["A person who never made a mistake never tried anything new.", "한 번도 실수해보지 않은 사람은 한 번도 새로운 것을 시도해보지 않은 사람이다.", "알베르트 아인슈타인 (Albert Einstein)", "Attributed"],
  ["Look deep into nature, and then you will understand everything better.", "자연을 깊이 들여다보라. 그러면 모든 것을 더 잘 이해하게 될 것이다.", "알베르트 아인슈타인 (Albert Einstein)", "Attributed"],
  ["I have no special talent. I am only passionately curious.", "나에게는 특별한 재능이 없다. 단지 열정적으로 호기심이 많을 뿐이다.", "알베르트 아인슈타인 (Albert Einstein)", "Letter to Carl Seelig (1952)"],
  ["Weakness of attitude becomes weakness of character.", "태도의 나약함은 곧 인격의 나약함이 된다.", "알베르트 아인슈타인 (Albert Einstein)", "Attributed"],
  ["Success is not final, failure is not fatal: it is the courage to continue that counts.", "성공은 최종적인 것이 아니며, 실패는 치명적인 것이 아니다. 중요한 것은 계속해 나가는 용기다.", "윈스턴 처칠 (Winston Churchill)", "Attributed"],
  ["If you're going through hell, keep going.", "지옥을 지나고 있다면, 멈추지 말고 계속 전진하라.", "윈스턴 처칠 (Winston Churchill)", "Attributed"],
  ["A pessimist sees the difficulty in every opportunity; an optimist sees the opportunity in every difficulty.", "비관주의자는 모든 기회에서 어려움을 보고, 낙관주의자는 모든 어려움에서 기회를 본다.", "윈스턴 처칠 (Winston Churchill)", "Attributed"],
  ["Never, never, never give up.", "절대로, 절대로, 절대로 포기하지 마라.", "윈스턴 처칠 (Winston Churchill)", "Harrow School Speech (1941)"],
  ["To improve is to change; to be perfect is to change often.", "발전한다는 것은 변화한다는 것이고, 완벽해진다는 것은 자주 변화한다는 것이다.", "윈스턴 처칠 (Winston Churchill)", "House of Commons Speech (1925)"],
  ["We make a living by what we get, but we make a life by what we give.", "우리는 얻는 것으로 생계를 유지하지만, 베푸는 것으로 인생을 만든다.", "윈스턴 처칠 (Winston Churchill)", "Attributed"],
  ["Kites rise highest against the wind, not with it.", "연은 바람을 순풍으로 탈 때가 아니라 역풍을 맞설 때 가장 높이 난다.", "윈스턴 처칠 (Winston Churchill)", "Attributed"],
  ["The best way to predict the future is to create it.", "미래를 예측하는 가장 좋은 방법은 미래를 직접 창조하는 것이다.", "피터 드러커 (Peter Drucker)", "Management Guide"],
  ["Management is doing things right; leadership is doing the right things.", "관리는 일을 올바르게 하는 것이고, 리더십은 올바른 일을 하는 것이다.", "피터 드러커 (Peter Drucker)", "Essential Drucker"],
  ["What gets measured gets improved.", "측정할 수 있는 것은 개선할 수 있다.", "피터 드러커 (Peter Drucker)", "Management Philosophy"],
  ["The most important thing in communication is hearing what isn't said.", "소통에서 가장 중요한 것은 말하지 않은 것까지 듣는 것이다.", "피터 드러커 (Peter Drucker)", "Attributed"],
  ["Culture eats strategy for breakfast.", "문화는 전략을 아침 식사 거리로 삼켜버린다.", "피터 드러커 (Peter Drucker)", "Attributed"],
  ["Price is what you pay. Value is what you get.", "가격은 당신이 지불하는 것이고, 가치는 당신이 얻는 것이다.", "워런 버핏 (Warren Buffett)", "Berkshire Hathaway Shareholder Letter (2008)"],
  ["It takes 20 years to build a reputation and five minutes to ruin it.", "명성을 쌓는 데는 20년이 걸리지만, 그것을 무너뜨리는 데는 단 5분이면 충분하다.", "워런 버핏 (Warren Buffett)", "Berkshire Hathaway Testimony (1991)"],
  ["Someone's sitting in the shade today because someone planted a tree a long time ago.", "오늘 누군가 그늘에 앉아 쉴 수 있는 것은 오래전에 누군가 나무를 심었기 때문이다.", "워런 버핏 (Warren Buffett)", "Of Permanent Value (1991)"],
  ["Risk comes from not knowing what you're doing.", "위험은 자신이 무엇을 하고 있는지 모르는 데서 온다.", "워런 버핏 (Warren Buffett)", "Forbes (1993)"],
  ["Be fearful when others are greedy, and greedy when others are fearful.", "남들이 탐욕스러울 때 두려워하고, 남들이 두려워할 때 탐욕스러워져라.", "워런 버핏 (Warren Buffett)", "Berkshire Hathaway Shareholder Letter (1986)"],
  ["The best investment you can make is an investment in yourself.", "당신이 할 수 있는 최고의 투자는 바로 자기 자신에게 하는 투자다.", "워런 버핏 (Warren Buffett)", "Commencement Advice"],
  ["The big money is not in the buying and the selling, but in the waiting.", "큰돈은 사고파는 데 있는 것이 아니라 기다리는 데 있다.", "찰리 멍거 (Charlie Munger)", "Poor Charlie's Almanack"],
  ["Spend each day trying to be a little wiser than you were when you woke up.", "매일 아침 일어났을 때보다 조금이라도 더 현명해지기 위해 하루를 보내라.", "찰리 멍거 (Charlie Munger)", "Poor Charlie's Almanack"],
  ["Knowing what you don't know is more useful than being brilliant.", "자신이 무엇을 모르는지 아는 것이 머리가 비상한 것보다 훨씬 유용하다.", "찰리 멍거 (Charlie Munger)", "Berkshire Hathaway Annual Meeting"],
  ["Invert, always invert: Turn a situation or problem upside down.", "뒤집어라, 언제나 뒤집어 생각하라. 상황이나 문제를 거꾸로 뒤집어 보라.", "찰리 멍거 (Charlie Munger)", "Poor Charlie's Almanack"],
  ["Take a simple idea and take it seriously.", "단순한 아이디어를 붙잡고, 그것을 진지하게 실행하라.", "찰리 멍거 (Charlie Munger)", "Poor Charlie's Almanack"],
  ["The best way to get what you want is to deserve what you want.", "원하는 것을 얻는 가장 확실한 방법은 원하는 것을 얻을 자격을 갖추는 것이다.", "찰리 멍거 (Charlie Munger)", "USC Law Commencement Speech (2007)"],
  ["Life is not fair; get used to it.", "인생이란 원래 공평하지 않다. 이 사실에 익숙해져라.", "빌 게이츠 (Bill Gates)", "Attributed High School Speech"],
  ["Your most unhappy customers are your greatest source of learning.", "가장 불만족한 고객이야말로 당신에게 가장 위대한 배움의 원천이다.", "빌 게이츠 (Bill Gates)", "Business @ the Speed of Thought (1999)"],
  ["We always overestimate the change that will occur in the next two years and underestimate the change that will occur in the next ten.", "우리는 늘 앞으로 2년 동안 일어날 변화는 과대평가하고, 앞으로 10년 동안 일어날 변화는 과소평가한다.", "빌 게이츠 (Bill Gates)", "The Road Ahead (1995)"],
  ["It's fine to celebrate success, but it is more important to heed the lessons of failure.", "성공을 자축하는 것도 좋지만, 실패의 교훈에 귀를 기울이는 것이 훨씬 더 중요하다.", "빌 게이츠 (Bill Gates)", "Attributed"],
  ["Whether you think you can, or you think you can't—you're right.", "할 수 있다고 생각하든, 할 수 없다고 생각하든, 당신의 생각이 맞다.", "헨리 포드 (Henry Ford)", "The Reader's Digest (1947)"],
  ["Failure is simply the opportunity to begin again, this time more intelligently.", "실패란 단지 더 현명하게 다시 시작할 수 있는 기회일 뿐이다.", "헨리 포드 (Henry Ford)", "My Life and Work (1922)"],
  ["Anyone who stops learning is old, whether at twenty or eighty. Anyone who keeps learning stays young.", "배움을 멈추는 사람은 스무 살이든 여든 살이든 늙은 것이다. 계속 배우는 사람은 언제나 젊다.", "헨리 포드 (Henry Ford)", "Attributed"],
  ["Coming together is a beginning; keeping together is progress; working together is success.", "함께 모이는 것은 시작이고, 함께 머무는 것은 진전이며, 함께 일하는 것은 성공이다.", "헨리 포드 (Henry Ford)", "Attributed"],
  ["Obstacles are those frightful things you see when you take your eyes off your goal.", "장애물이란 당신이 목표에서 눈을 떼었을 때 보이는 두려운 것들이다.", "헨리 포드 (Henry Ford)", "Attributed"],
  ["Genius is one percent inspiration and ninety-nine percent perspiration.", "천재는 1퍼센트의 영감과 99퍼센트의 땀으로 이루어진다.", "토머스 에디슨 (Thomas Edison)", "Harper's Monthly Magazine (1932)"],
  ["I have not failed. I've just found 10,000 ways that won't work.", "나는 실패한 것이 아니다. 단지 작동하지 않는 1만 가지 방법을 찾아냈을 뿐이다.", "토머스 에디슨 (Thomas Edison)", "Attributed"],
  ["Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.", "우리의 가장 큰 약점은 포기하는 데 있다. 성공으로 가는 가장 확실한 방법은 언제나 한 번 더 시도해 보는 것이다.", "토머스 에디슨 (Thomas Edison)", "Attributed"],
  ["Opportunity is missed by most people because it is dressed in overalls and looks like work.", "대부분의 사람이 기회를 놓치는 이유는 기회가 작업복을 입고 일감처럼 보이기 때문이다.", "토머스 에디슨 (Thomas Edison)", "Attributed"],
  ["All our dreams can come true, if we have the courage to pursue them.", "꿈을 추구할 용기만 있다면 우리의 모든 꿈은 이루어질 수 있다.", "월트 디즈니 (Walt Disney)", "Attributed"],
  ["The way to get started is to quit talking and begin doing.", "시작하는 방법은 말을 멈추고 행동을 시작하는 것이다.", "월트 디즈니 (Walt Disney)", "Attributed"],
  ["It's kind of fun to do the impossible.", "불가능한 일을 해내는 것은 꽤 즐거운 일이다.", "월트 디즈니 (Walt Disney)", "Attributed"],
  ["First, think. Second, believe. Third, dream. And finally, dare.", "첫째, 생각하라. 둘째, 믿어라. 셋째, 꿈꾸어라. 그리고 마지막으로 과감히 도전하라.", "월트 디즈니 (Walt Disney)", "Words of Wisdom (1957)"],
  ["It always seems impossible until it's done.", "어떤 일이든 이루어지기 전까지는 늘 불가능해 보인다.", "넬슨 만델라 (Nelson Mandela)", "Attributed"],
  ["The greatest glory in living lies not in never falling, but in rising every time we fall.", "삶에서 가장 큰 영광은 결코 넘어지지 않는 데 있는 것이 아니라, 넘어질 때마다 다시 일어서는 데 있다.", "넬슨 만델라 (Nelson Mandela)", "Long Walk to Freedom"],
  ["Education is the most powerful weapon which you can use to change the world.", "교육은 세상을 바꾸기 위해 사용할 수 있는 가장 강력한 무기다.", "넬슨 만델라 (Nelson Mandela)", "Speech at University of the Witwatersrand (2003)"],
  ["I never lose. I either win or learn.", "나는 결코 지지 않는다. 이기거나, 배우거나 둘 중 하나다.", "넬슨 만델라 (Nelson Mandela)", "Attributed"],
  ["May your choices reflect your hopes, not your fears.", "당신의 선택이 두려움이 아니라 당신의 희망을 반영하기를 바란다.", "넬슨 만델라 (Nelson Mandela)", "Attributed"],
  ["Live as if you were to die tomorrow. Learn as if you were to live forever.", "내일 죽을 것처럼 살아라. 영원히 살 것처럼 배워라.", "마하트마 간디 (Mahatma Gandhi)", "Attributed"],
  ["Happiness is when what you think, what you say, and what you do are in harmony.", "행복이란 당신이 생각하는 것과 말하는 것, 그리고 행동하는 것이 조화를 이룰 때 찾아온다.", "마하트마 간디 (Mahatma Gandhi)", "Attributed"],
  ["The future depends on what you do today.", "미래는 오늘 당신이 무엇을 하느냐에 달려 있다.", "마하트마 간디 (Mahatma Gandhi)", "Attributed"],
  ["Strength does not come from physical capacity. It comes from an indomitable will.", "힘은 신체적 능력에서 나오지 않는다. 꺾이지 않는 불굴의 의지에서 나온다.", "마하트마 간디 (Mahatma Gandhi)", "Young India (1920)"],
  ["The weak can never forgive. Forgiveness is the attribute of the strong.", "약한 자는 결코 용서할 수 없다. 용서는 강한 자의 특권이다.", "마하트마 간디 (Mahatma Gandhi)", "Young India (1931)"],
  ["In a gentle way, you can shake the world.", "부드러운 방식으로도 당신은 세상을 뒤흔들 수 있다.", "마하트마 간디 (Mahatma Gandhi)", "Attributed"],
  ["The only thing we have to fear is fear itself.", "우리가 두려워해야 할 유일한 것은 두려움 그 자체다.", "프랭클린 D. 루스벨트 (Franklin D. Roosevelt)", "First Inaugural Address (1933)"],
  ["Smooth seas do not make skillful sailors.", "잔잔한 바다는 유능한 뱃사람을 만들지 못한다.", "프랭클린 D. 루스벨트 (Franklin D. Roosevelt)", "Proverb / Attributed"],
  ["When you reach the end of your rope, tie a knot in it and hang on.", "밧줄의 끝에 다다랐을 때, 매듭을 묶고 끝까지 매달려 버텨라.", "프랭클린 D. 루스벨트 (Franklin D. Roosevelt)", "Attributed"],
  ["The future belongs to those who believe in the beauty of their dreams.", "미래는 자신의 꿈의 아름다움을 믿는 사람들의 것이다.", "엘리너 루스벨트 (Eleanor Roosevelt)", "Syndicated Column 'My Day' (1957)"],
  ["No one can make you feel inferior without your consent.", "당신의 동의 없이는 그 누구도 당신을 열등하게 느끼도록 만들 수 없다.", "엘리너 루스벨트 (Eleanor Roosevelt)", "This Is My Story (1937)"],
  ["Do one thing every day that scares you.", "매일 당신을 두렵게 하는 일을 하나씩 하라.", "엘리너 루스벨트 (Eleanor Roosevelt)", "Attributed"],
  ["Great minds discuss ideas; average minds discuss events; small minds discuss people.", "위대한 마음은 아이디어를 논하고, 평범한 마음은 사건을 논하며, 좁은 마음은 남을 험담한다.", "엘리너 루스벨트 (Eleanor Roosevelt)", "Attributed"],
  ["Yesterday is history, tomorrow is a mystery, today is a gift of God, which is why we call it the present.", "어제는 역사이고, 내일은 미스터리이며, 오늘은 선물이다. 그래서 우리는 현재(Present)를 선물이라고 부른다.", "엘리너 루스벨트 (Eleanor Roosevelt)", "Attributed / Bil Keane"],
  ["The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart.", "세상에서 가장 최고이고 아름다운 것들은 볼 수도 만질 수도 없다. 가슴으로 느껴야만 한다.", "헬렌 켈러 (Helen Keller)", "The Story of My Life (1903)"],
  ["Alone we can do so little; together we can do so much.", "혼자서 할 수 있는 일은 아주 적지만, 함께라면 아주 많은 일을 해낼 수 있다.", "헬렌 켈러 (Helen Keller)", "Attributed"],
  ["Optimism is the faith that leads to achievement. Nothing can be done without hope and confidence.", "낙관주의는 성취로 이어지는 믿음이다. 희망과 자신감 없이는 아무것도 이룰 수 없다.", "헬렌 켈러 (Helen Keller)", "Optimism (1903)"],
  ["Keep your face to the sunshine and you cannot see a shadow.", "햇빛을 향해 얼굴을 들면 그림자는 보이지 않는다.", "헬렌 켈러 (Helen Keller)", "Attributed"],
  ["Life is either a daring adventure or nothing at all.", "인생은 과감한 모험이거나, 아니면 아무것도 아니다.", "헬렌 켈러 (Helen Keller)", "The Open Door (1957)"],
  ["Although the world is full of suffering, it is full also of the overcoming of it.", "비록 세상이 고통으로 가득 차 있다 할지라도, 그것을 극복하는 힘으로도 가득 차 있다.", "헬렌 켈러 (Helen Keller)", "Optimism (1903)"],
  ["People will forget what you said, people will forget what you did, but people will never forget how you made them feel.", "사람들은 당신이 한 말과 행동은 잊어버릴지 몰라도, 당신이 그들에게 어떤 감정을 느끼게 했는지는 결코 잊지 않는다.", "마야 안젤루 (Maya Angelou)", "Attributed"],
  ["If you don't like something, change it. If you can't change it, change your attitude.", "무언가 마음에 들지 않는다면 바꿔라. 바꿀 수 없다면 당신의 태도를 바꿔라.", "마야 안젤루 (Maya Angelou)", "Wouldn't Take Nothing for My Journey Now (1993)"],
  ["We may encounter many defeats but we must not be defeated.", "우리는 수많은 패배를 마주할 수 있지만, 결코 패배자가 되어서는 안 된다.", "마야 안젤루 (Maya Angelou)", "Interview"],
  ["Nothing will work unless you do.", "당신이 움직이지 않으면 아무것도 작동하지 않는다.", "마야 안젤루 (Maya Angelou)", "Attributed"],
  ["Try to be a rainbow in someone's cloud.", "누군가의 먹구름 속에서 무지개가 되어주어라.", "마야 안젤루 (Maya Angelou)", "Letter to My Daughter (2008)"],
  ["Be yourself; everyone else is already taken.", "너 자신이 되어라. 다른 사람의 자리는 이미 다 차 있다.", "오스카 와일드 (Oscar Wilde)", "Attributed"],
  ["We are all in the gutter, but some of us are looking at the stars.", "우리 모두는 시궁창에 빠져 있지만, 그중 누군가는 별을 바라보고 있다.", "오스카 와일드 (Oscar Wilde)", "Lady Windermere's Fan (1892)"],
  ["To live is the rarest thing in the world. Most people exist, that is all.", "진정으로 살아간다는 것은 세상에서 가장 드문 일이다. 대다수의 사람들은 그저 존재할 뿐이다.", "오스카 와일드 (Oscar Wilde)", "The Soul of Man under Socialism (1891)"],
  ["Experience is simply the name we give our mistakes.", "경험이란 단지 우리가 저지른 실수에 붙이는 이름일 뿐이다.", "오스카 와일드 (Oscar Wilde)", "Lady Windermere's Fan (1892)"],
  ["Be kind, for everyone you meet is fighting a hard battle.", "친절하라, 당신이 만나는 모든 사람은 저마다 힘겨운 싸움을 하고 있으니.", "이언 매클래런 / 플라톤 귀속 (Ian Maclaren)", "The British Weekly (1897)"],
  ["The secret of getting ahead is getting started.", "앞서 나가는 비결은 지금 바로 시작하는 것이다.", "마크 트웨인 (Mark Twain)", "Attributed"],
  ["The two most important days in your life are the day you are born and the day you find out why.", "인생에서 가장 중요한 두 날은 당신이 태어난 날과 당신이 왜 태어났는지 깨닫는 날이다.", "마크 트웨인 (Mark Twain)", "Attributed"],
  ["Twenty years from now you will be more disappointed by the things that you didn't do than by the ones you did do.", "20년 뒤 당신은 했던 일보다 하지 않았던 일 때문에 더 크게 후회하게 될 것이다.", "마크 트웨인 (Mark Twain)", "Attributed / H. Jackson Brown Jr."],
  ["Kindness is the language which the deaf can hear and the blind can see.", "친절은 귀먹은 이도 들을 수 있고 눈먼 이도 볼 수 있는 언어다.", "마크 트웨인 (Mark Twain)", "Attributed"],
  ["Whenever you find yourself on the side of the majority, it is time to pause and reflect.", "어느 순간 자신이 다수의 편에 서 있음을 발견한다면, 잠시 멈추어 성찰해야 할 때다.", "마크 트웨인 (Mark Twain)", "Notebook (1904)"],
  ["Courage is resistance to fear, mastery of fear—not absence of fear.", "용기란 두려움이 없는 상태가 아니라, 두려움에 맞서고 두려움을 지배하는 것이다.", "마크 트웨인 (Mark Twain)", "Pudd'nhead Wilson (1894)"],
  ["If you tell the truth, you don't have to remember anything.", "진실을 말하면 아무것도 기억해 둘 필요가 없다.", "마크 트웨인 (Mark Twain)", "Notebook (1894)"],
  ["Give me six hours to chop down a tree and I will spend the first four sharpening the axe.", "나무를 베는 데 여섯 시간이 주어진다면, 나는 먼저 네 시간 동안 도끼를 갈겠다.", "에이브러햄 링컨 (Abraham Lincoln)", "Attributed"],
  ["Folks are usually about as happy as they make their minds up to be.", "사람들은 대개 자신이 마음먹은 만큼 행복해진다.", "에이브러햄 링컨 (Abraham Lincoln)", "Attributed"],
  ["Am I not destroying my enemies when I make friends of them?", "적을 친구로 만들 때, 나는 이미 적을 없애버린 것이 아닌가?", "에이브러햄 링컨 (Abraham Lincoln)", "Speech (1864)"],
  ["Whatever you are, be a good one.", "무엇이 되든, 훌륭한 사람이 되어라.", "에이브러햄 링컨 (Abraham Lincoln)", "Attributed"],
  ["I walk slowly, but I never walk backward.", "나는 천천히 걷지만, 결코 뒤로 걷지는 않는다.", "에이브러햄 링컨 (Abraham Lincoln)", "Attributed"],
  ["You have power over your mind - not outside events. Realize this, and you will find strength.", "당신은 외부의 사건이 아니라 당신 자신의 마음을 통제할 힘이 있다. 이를 깨달을 때 진정한 힘을 얻게 될 것이다.", "마르쿠스 아우렐리우스 (Marcus Aurelius)", "명상록 (Meditations)"],
  ["The happiness of your life depends upon the quality of your thoughts.", "당신 삶의 행복은 당신 생각의 질에 달려 있다.", "마르쿠스 아우렐리우스 (Marcus Aurelius)", "명상록 (Meditations)"],
  ["Waste no more time arguing about what a good man should be. Be one.", "좋은 사람이 어떠해야 하는지 논쟁하는 데 더 이상 시간을 낭비하지 마라. 그냥 그런 사람이 되어라.", "마르쿠스 아우렐리우스 (Marcus Aurelius)", "명상록 (Meditations 10.16)"],
  ["Very little is needed to make a happy life; it is all within yourself, in your way of thinking.", "행복한 삶을 만드는 데는 아주 적은 것만 필요하다. 모든 것은 당신의 내면, 곧 당신의 사고방식에 달려 있다.", "마르쿠스 아우렐리우스 (Marcus Aurelius)", "명상록 (Meditations)"],
  ["The impediment to action advances action. What stands in the way becomes the way.", "행동을 가로막는 장애물이 오히려 행동을 전진시킨다. 길을 막아서는 것이 곧 길이 된다.", "마르쿠스 아우렐리우스 (Marcus Aurelius)", "명상록 (Meditations 5.20)"],
  ["When you arise in the morning, think of what a precious privilege it is to be alive - to breathe, to think, to enjoy, to love.", "아침에 일어날 때, 숨 쉬고, 생각하고, 즐기고, 사랑하며 살아 있다는 것이 얼마나 소중한 특권인지 생각하라.", "마르쿠스 아우렐리우스 (Marcus Aurelius)", "명상록 (Meditations)"],
  ["We suffer more often in imagination than in reality.", "우리는 현실에서보다 상상 속에서 훨씬 더 자주 고통받는다.", "세네카 (Seneca)", "루킬리우스에게 보내는 편지 (Letters from a Stoic)"],
  ["Luck is what happens when preparation meets opportunity.", "운이란 준비가 기회와 만났을 때 일어나는 일이다.", "세네카 (Seneca)", "Attributed"],
  ["It is not that we have a short time to live, but that we waste a lot of it.", "우리가 살 시간이 짧은 것이 아니라, 우리가 그중 너무 많은 시간을 허비하는 것이다.", "세네카 (Seneca)", "생의 짧음에 관하여 (On the Shortness of Life)"],
  ["Difficulties strengthen the mind, as labor does the body.", "노동이 육체를 단련시키듯, 고난은 정신을 강하게 만든다.", "세네카 (Seneca)", "Letters from a Stoic"],
  ["If a man knows not to which port he sails, no wind is favorable.", "어느 항구로 항해하는지 모르는 사람에게는 어떤 바람도 순풍이 되지 않는다.", "세네카 (Seneca)", "Letters from a Stoic (Letter 71)"],
  ["Begin at once to live, and count each separate day as a separate life.", "지금 당장 살기 시작하라. 그리고 하루하루를 각각 하나의 독립된 생애로 여겨라.", "세네카 (Seneca)", "Letters from a Stoic"],
  ["It's not what happens to you, but how you react to it that matters.", "중요한 것은 당신에게 무슨 일이 일어나느냐가 아니라, 그 일에 당신이 어떻게 반응하느냐다.", "에픽테토스 (Epictetus)", "엥케이리디온 (Enchiridion)"],
  ["First say to yourself what you would be; and then do what you have to do.", "먼저 자신에게 어떤 사람이 되고 싶은지 말하라. 그런 다음 해야 할 일을 하라.", "에픽테토스 (Epictetus)", "담화록 (Discourses)"],
  ["No man is free who is not master of himself.", "자기 자신의 주인이 되지 못한 사람은 결코 자유롭지 못하다.", "에픽테토스 (Epictetus)", "Fragments"],
  ["He who has a why to live can bear almost any how.", "삶의 이유(Why)를 가진 사람은 거의 모든 방식(How)을 견뎌낼 수 있다.", "프리드리히 니체 (Friedrich Nietzsche)", "우상의 황혼 (Twilight of the Idols)"],
  ["That which does not kill us makes us stronger.", "나를 죽이지 못하는 고통은 나를 더 강하게 만든다.", "프리드리히 니체 (Friedrich Nietzsche)", "우상의 황혼 (Twilight of the Idols)"],
  ["And those who were seen dancing were thought to be insane by those who could not hear the music.", "춤추는 자들은 음악 소리를 듣지 못하는 사람들에게 미친 사람으로 보였다.", "프리드리히 니체 (Friedrich Nietzsche)", "Attributed"],
  ["You must have chaos within you to give birth to a dancing star.", "춤추는 별을 잉태하려면 내면에 반드시 혼돈을 지니고 있어야 한다.", "프리드리히 니체 (Friedrich Nietzsche)", "차라투스트라는 이렇게 말했다 (Thus Spoke Zarathustra)"],
  ["He who fights with monsters should look to it that he himself does not become a monster.", "괴물과 싸우는 사람은 그 싸움 속에서 스스로 괴물이 되지 않도록 조심해야 한다.", "프리드리히 니체 (Friedrich Nietzsche)", "선악의 저편 (Beyond Good and Evil)"],
  ["Everything can be taken from a man but one thing: the last of the human freedoms—to choose one's attitude in any given set of circumstances.", "인간에게서 모든 것을 빼앗아 갈 수 있어도 단 한 가지, 주어진 환경에서 자신의 태도를 선택할 자유만은 빼앗을 수 없다.", "빅터 프랭클 (Viktor E. Frankl)", "죽음의 수용소에서 (Man's Search for Meaning)"],
  ["Between stimulus and response there is a space. In that space is our power to choose our response.", "자극과 반응 사이에는 공간이 있다. 그 공간 안에 우리의 반응을 선택할 수 있는 힘이 있으며, 그 반응 속에 우리의 성장과 자유가 있다.", "빅터 프랭클 귀속 (Viktor Frankl / Stephen Covey)", "Man's Search for Meaning Context"],
  ["When we are no longer able to change a situation, we are challenged to change ourselves.", "더 이상 상황을 바꿀 수 없을 때, 우리는 우리 자신을 변화시키라는 도전에 직면한다.", "빅터 프랭클 (Viktor E. Frankl)", "죽음의 수용소에서 (Man's Search for Meaning)"],
  ["The bird fights its way out of the egg. The egg is the world. Who would be born must first destroy a world.", "새는 알에서 나오려고 투쟁한다. 알은 세계다. 태어나려는 자는 하나의 세계를 깨뜨려야 한다.", "헤르만 헤세 (Hermann Hesse)", "데미안 (Demian)"],
  ["Some of us think holding on makes us strong; but sometimes it is letting go.", "우리 중 누군가는 끝까지 붙잡고 있는 것이 우리를 강하게 만든다고 생각하지만, 때로는 놓아주는 것이 진정한 강함이다.", "헤르만 헤세 (Hermann Hesse)", "Attributed"],
  ["If you hate a person, you hate something in him that is part of yourself.", "당신이 누군가를 미워한다면, 그 사람 속에 비친 당신 자신의 일부분을 미워하는 것이다.", "헤르만 헤세 (Hermann Hesse)", "데미안 (Demian)"],
  ["It is only with the heart that one can see rightly; what is essential is invisible to the eye.", "마음으로 보아야만 제대로 볼 수 있다. 가장 중요한 것은 눈에 보이지 않는다.", "생텍쥐페리 (Antoine de Saint-Exupéry)", "어린 왕자 (The Little Prince)"],
  ["A goal without a plan is just a wish.", "계획 없는 목표는 단지 바램일 뿐이다.", "생텍쥐페리 (Antoine de Saint-Exupéry)", "Attributed"],
  ["If you want to build a ship, don't drum up the men to gather wood, divide the work, and give orders. Instead, teach them to yearn for the vast and endless sea.", "배를 만들고 싶다면 사람들을 모아 나무를 해오게 하고 일감을 나누고 명령을 내리지 마라. 대신 그들에게 저 넓고 끝없는 바다에 대한 동경을 심어주어라.", "생텍쥐페리 (Antoine de Saint-Exupéry)", "Citadelle (Attributed Paraphrase)"],
  ["Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.", "완벽함이란 더 이상 보탤 것이 없을 때가 아니라, 더 이상 뺄 것이 없을 때 이루어진다.", "생텍쥐페리 (Antoine de Saint-Exupéry)", "인간의 대지 (Wind, Sand and Stars)"],
  ["There is nothing noble in being superior to your fellow man; true nobility is being superior to your former self.", "타인보다 우수하다고 해서 고귀한 것이 아니다. 진정한 고귀함은 과거의 자신보다 우수해지는 것이다.", "어니스트 헤밍웨이 (Ernest Hemingway)", "True at First Light"],
  ["The world breaks everyone, and afterward, some are strong at the broken places.", "세상은 모든 사람을 부서뜨린다. 그러나 그 후 많은 이들은 바로 그 부서진 자리에서 더욱 강해진다.", "어니스트 헤밍웨이 (Ernest Hemingway)", "무기여 잘 있거라 (A Farewell to Arms)"],
  ["But man is not made for defeat. A man can be destroyed but not defeated.", "그러나 인간은 패배하도록 만들어지지 않았다. 인간은 파괴될 수는 있을지언정 패배하지는 않는다.", "어니스트 헤밍웨이 (Ernest Hemingway)", "노인과 바다 (The Old Man and the Sea)"],
  ["Courage is grace under pressure.", "용기란 압박 속에서도 잃지 않는 품위다.", "어니스트 헤밍웨이 (Ernest Hemingway)", "New Yorker Profile (1929)"],
  ["Do not go where the path may lead, go instead where there is no path and leave a trail.", "길이 이끄는 곳으로 가지 마라. 대신 길이 없는 곳으로 가서 발자취를 남겨라.", "랄프 왈도 에머슨 (Ralph Waldo Emerson)", "Attributed"],
  ["To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", "끊임없이 당신을 다른 무언가로 만들려 하는 세상에서 자기 자신으로 남는 것, 그것이 가장 위대한 성취다.", "랄프 왈도 에머슨 (Ralph Waldo Emerson)", "Attributed"],
  ["What lies behind us and what lies before us are tiny matters compared to what lies within us.", "우리 뒤에 있는 것과 우리 앞에 있는 것은 우리 내면에 있는 것에 비하면 아주 사소한 일이다.", "랄프 왈도 에머슨 (Ralph Waldo Emerson)", "Attributed / Oliver Wendell Holmes"],
  ["For every minute you are angry you lose sixty seconds of happiness.", "당신이 1분 동안 화를 낼 때마다 60초의 행복을 잃어버린다.", "랄프 왈도 에머슨 (Ralph Waldo Emerson)", "Attributed"],
  ["Write it on your heart that every day is the best day in the year.", "매일이 일 년 중 최고의 날임을 당신의 마음에 새겨라.", "랄프 왈도 에머슨 (Ralph Waldo Emerson)", "Society and Solitude"],
  ["The only person you are destined to become is the person you decide to be.", "당신이 되기로 운명 지어진 유일한 사람은 당신이 되기로 결심한 바로 그 사람이다.", "랄프 왈도 에머슨 (Ralph Waldo Emerson)", "Attributed"],
  ["Go confidently in the direction of your dreams! Live the life you've imagined.", "당신의 꿈이 향하는 방향으로 당당히 나아가라! 당신이 상상해 온 삶을 살아라.", "헨리 데이비드 소로 (Henry David Thoreau)", "월든 (Walden)"],
  ["Success usually comes to those who are too busy to be looking for it.", "성공은 대개 성공을 찾느라 한눈팔 겨를도 없이 바쁘게 몰두하는 사람에게 찾아온다.", "헨리 데이비드 소로 (Henry David Thoreau)", "Attributed"],
  ["It's not what you look at that matters, it's what you see.", "중요한 것은 무엇을 바라보느냐가 아니라, 그 안에서 무엇을 발견하느냐다.", "헨리 데이비드 소로 (Henry David Thoreau)", "Journal (1851)"],
  ["Love all, trust a few, do wrong to none.", "모두를 사랑하되, 소수만 신뢰하며, 누구에게도 해를 끼치지 마라.", "윌리엄 셰익스피어 (William Shakespeare)", "끝이 좋으면 다 좋아 (All's Well That Ends Well)"],
  ["We know what we are, but know not what we may be.", "우리는 현재의 우리가 누구인지는 알지만, 앞으로 우리가 어떤 존재가 될 수 있는지는 알지 못한다.", "윌리엄 셰익스피어 (William Shakespeare)", "햄릿 (Hamlet)"],
  ["Our doubts are traitors, and make us lose the good we oft might win, by fearing to attempt.", "우리의 의심은 반역자다. 시도하기를 두려워하게 만들어 우리가 얻을 수 있었던 좋은 것들을 잃게 만든다.", "윌리엄 셰익스피어 (William Shakespeare)", "자에는 자로 (Measure for Measure)"],
  ["It is not in the stars to hold our destiny but in ourselves.", "우리의 운명을 쥐고 있는 것은 저 하늘의 별이 아니라 바로 우리 자신이다.", "윌리엄 셰익스피어 (William Shakespeare)", "줄리어스 시저 (Julius Caesar Paraphrase)"],
  ["Brevity is the soul of wit.", "간결함은 지혜의 정수다.", "윌리엄 셰익스피어 (William Shakespeare)", "햄릿 (Hamlet)"],
  ["I've missed more than 9,000 shots in my career. I've failed over and over and over again in my life. And that is why I succeed.", "나는 선수 생활 동안 9,000번 이상 슛을 놓쳤다. 내 인생에서 거듭해서 실패하고 또 실패했다. 바로 그것이 내가 성공한 이유다.", "마이클 조던 (Michael Jordan)", "Nike Commercial (1997)"],
  ["Talent wins games, but teamwork and intelligence win championships.", "재능은 한 경기를 이기게 하지만, 팀워크와 지성은 챔피언십을 우승하게 한다.", "마이클 조던 (Michael Jordan)", "Rare Air (1993)"],
  ["Some people want it to happen, some wish it would happen, others make it happen.", "어떤 사람은 일이 일어나기를 원하고, 어떤 사람은 일어나기를 기도하지만, 어떤 사람은 직접 일어나게 만든다.", "마이클 조던 (Michael Jordan)", "Attributed"],
  ["Limits, like fears, are often just an illusion.", "한계란 두려움과 마찬가지로 대개 환상에 불과하다.", "마이클 조던 (Michael Jordan)", "Hall of Fame Speech (2009)"],
  ["The most important thing is to try and inspire people so that they can be great in whatever they want to do.", "가장 중요한 것은 사람들이 자신이 하고자 하는 어떤 일에서든 위대해질 수 있도록 노력하고 영감을 주는 것이다.", "코비 브라이언트 (Kobe Bryant)", "Interview"],
  ["Rest at the end, not in the middle.", "중간에 쉬지 말고, 끝까지 간 뒤에 쉬어라.", "코비 브라이언트 (Kobe Bryant)", "Mamba Mentality"],
  ["Don't count the days; make the days count.", "날짜를 세지 말고, 하루하루가 가치 있게 만들어라.", "무하마드 알리 (Muhammad Ali)", "Attributed"],
  ["He who is not courageous enough to take risks will accomplish nothing in life.", "위험을 감수할 만큼 용감하지 않은 사람은 인생에서 아무것도 성취하지 못할 것이다.", "무하마드 알리 (Muhammad Ali)", "Press Conference (1984)"],
  ["Impossible is not a fact. It's an opinion. Impossible is potential. Impossible is temporary. Impossible is nothing.", "불가능은 사실이 아니라 하나의 의견일 뿐이다. 불가능은 잠재력이고 일시적인 것이며, 불가능이란 없다.", "무하마드 알리 (Muhammad Ali)", "Adidas Campaign"],
  ["I hated every minute of training, but I said, 'Don't quit. Suffer now and live the rest of your life as a champion.'", "나는 훈련하는 매 순간이 싫었지만 스스로에게 말했다. '포기하지 마라. 지금 고통받고 남은 평생을 챔피언으로 살아라.'", "무하마드 알리 (Muhammad Ali)", "Attributed"],
  ["I fear not the man who has practiced 10,000 kicks once, but I fear the man who has practiced one kick 10,000 times.", "나는 1만 가지 발차기를 한 번씩 연습한 사람은 두렵지 않지만, 한 가지 발차기를 1만 번 연습한 사람은 두렵다.", "이소룡 (Bruce Lee)", "Attributed"],
  ["Knowing is not enough, we must apply. Willing is not enough, we must do.", "아는 것만으로는 충분하지 않다, 적용해야 한다. 의지만으로는 충분하지 않다, 실행해야 한다.", "이소룡 / 괴테 (Bruce Lee / Goethe)", "Striking Thoughts"],
  ["Be water, my friend.", "물이 되어라, 나의 친구여. 물은 찻잔에 담기면 찻잔이 되고, 주전자에 담기면 주전자가 된다.", "이소룡 (Bruce Lee)", "Pierre Berton Show Interview (1971)"],
  ["Mistakes are always forgivable, if one has the courage to admit them.", "실수를 인정할 용기만 있다면, 실수는 언제나 용서받을 수 있다.", "이소룡 (Bruce Lee)", "Striking Thoughts"],
  ["Do not pray for an easy life, pray for the strength to endure a difficult one.", "안락한 삶을 기도하지 말고, 힘든 삶을 견뎌낼 수 있는 강한 힘을 달라고 기도하라.", "이소룡 (Bruce Lee)", "Striking Thoughts"],
  ["Nothing is impossible, the word itself says 'I'm possible'!", "불가능한 일이란 없다. 불가능(Impossible)이라는 단어 자체가 '나는 가능하다(I'm possible)'라고 말하고 있지 않은가!", "오드리 헵번 (Audrey Hepburn)", "Attributed"],
  ["As you grow older, you will discover that you have two hands, one for helping yourself, the other for helping others.", "나이가 들면서 당신에게 두 손이 있다는 것을 깨닫게 될 것이다. 한 손은 자신을 돕는 손이고, 다른 한 손은 타인을 돕는 손이다.", "오드리 헵번 / 샘 레번슨 (Audrey Hepburn)", "In Memoriam: My Favorite Poem"],
  ["The most important thing is to enjoy your life—to be happy—it's all that matters.", "가장 중요한 것은 당신의 삶을 즐기는 것, 즉 행복해지는 것이다. 그것이 전부다.", "오드리 헵번 (Audrey Hepburn)", "Attributed"],
  ["Elegance is the only beauty that never fades.", "우아함은 결코 퇴색하지 않는 유일한 아름다움이다.", "오드리 헵번 (Audrey Hepburn)", "Attributed"],
  ["In order to be irreplaceable one must always be different.", "대체 불가능한 존재가 되려면 늘 남들과 달라야 한다.", "코코 샤넬 (Coco Chanel)", "Attributed"],
  ["Beauty begins the moment you decide to be yourself.", "아름다움은 당신이 자기 자신으로 살기로 결심하는 그 순간에 시작된다.", "코코 샤넬 (Coco Chanel)", "Attributed"],
  ["A girl should be two things: who and what she wants.", "사람은 두 가지 존재가 되어야 한다. 자신이 원하는 사람, 그리고 자신이 원하는 성취.", "코코 샤넬 (Coco Chanel)", "Attributed"],
  ["The first principle is that you must not fool yourself—and you are the easiest person to fool.", "제1원칙은 자기 자신을 속이지 말아야 한다는 것이다. 그리고 당신 자신이야말로 가장 속이기 쉬운 사람이다.", "리처드 파인만 (Richard Feynman)", "Caltech Commencement Address (1974)"],
  ["I would rather have questions that can't be answered than answers that can't be questioned.", "나는 의문을 제기할 수 없는 해답보다, 답할 수 없는 질문을 갖는 편을 택하겠다.", "리처드 파인만 (Richard Feynman)", "Attributed"],
  ["Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.", "당신이 가장 흥미를 느끼는 것을 가능한 한 가장 자유분방하고 거침없으며 독창적인 방식으로 치열하게 파고들어라.", "리처드 파인만 (Richard Feynman)", "Letter (1965)"],
  ["Somewhere, something incredible is waiting to be known.", "어딘가에, 믿을 수 없을 만큼 경이로운 무언가가 알려지기를 기다리고 있다.", "칼 세이건 (Carl Sagan)", "Newsweek (1977)"],
  ["We are made of star-stuff.", "우리는 모두 별의 물질로 만들어진 존재다.", "칼 세이건 (Carl Sagan)", "코스모스 (Cosmos, 1980)"],
  ["Look up at the stars and not down at your feet. Try to make sense of what you see, and wonder about what makes the universe exist.", "발밑을 내려다보지 말고 고개를 들어 별을 바라보라. 보이는 것을 이해하려 노력하고 우주가 왜 존재하는지 경이로워하라.", "스티븐 호킹 (Stephen Hawking)", "ABC News Interview (2010)"],
  ["Intelligence is the ability to adapt to change.", "지능이란 변화에 적응하는 능력이다.", "스티븐 호킹 (Stephen Hawking)", "Oxford Graduation Speech"],
  ["However difficult life may seem, there is always something you can do and succeed at.", "삶이 아무리 힘들어 보일지라도, 당신이 할 수 있고 또 성공할 수 있는 일은 언제나 존재한다.", "스티븐 호킹 (Stephen Hawking)", "Attributed"],
  ["Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.", "삶에서 두려워할 것은 아무것도 없다. 다만 이해해야 할 대상일 뿐이다. 지금이야말로 더 많이 이해함으로써 두려움을 줄여야 할 때다.", "마리 퀴리 (Marie Curie)", "Attributed"],
  ["Be less curious about people and more curious about ideas.", "사람들에 대한 호기심은 줄이고, 아이디어와 진리에 대해 더 많은 호기심을 가져라.", "마리 퀴리 (Marie Curie)", "Attributed"],
  ["You do not rise to the level of your goals. You fall to the level of your systems.", "당신은 목표의 수준까지 올라가는 것이 아니다. 당신이 구축한 시스템의 수준으로 떨어질 뿐이다.", "제임스 클리어 (James Clear)", "아주 작은 습관의 힘 (Atomic Habits)"],
  ["Every action you take is a vote for the type of person you wish to become.", "당신이 취하는 모든 행동은 당신이 되고자 하는 사람에게 던지는 한 표다.", "제임스 클리어 (James Clear)", "아주 작은 습관의 힘 (Atomic Habits)"],
  ["Habits are the compound interest of self-improvement.", "습관은 자기계발의 복리 이자다.", "제임스 클리어 (James Clear)", "아주 작은 습관의 힘 (Atomic Habits)"],
  ["Success is the product of daily habits—not once-in-a-lifetime transformations.", "성공은 일생일대의 극적인 변화가 아니라 매일의 작은 습관이 만들어낸 산물이다.", "제임스 클리어 (James Clear)", "아주 작은 습관의 힘 (Atomic Habits)"],
  ["Desire is a contract that you make with yourself to be unhappy until you get what you want.", "욕망이란 내가 원하는 것을 얻을 때까지 행복하지 않기로 자기 자신과 맺는 계약이다.", "나발 라비칸트 (Naval Ravikant)", "The Almanack of Naval Ravikant"],
  ["Play long-term games with long-term people.", "오래 함께할 사람들과 장기적인 게임을 하라.", "나발 라비칸트 (Naval Ravikant)", "The Almanack of Naval Ravikant"],
  ["Earn with your mind, not your time.", "시간을 팔아 돈을 벌지 말고, 지성과 생각으로 가치를 만들어라.", "나발 라비칸트 (Naval Ravikant)", "The Almanack of Naval Ravikant"],
  ["Easy choices, hard life. Hard choices, easy life.", "쉬운 선택을 하면 삶이 힘들어지고, 어려운 선택을 하면 삶이 편안해진다.", "예지 그레고르제크 / 나발 라비칸트 인용 (Jerzy Gregorek)", "The Almanack of Naval Ravikant"],
  ["A fit body, a calm mind, a house full of love. These things cannot be bought — they must be earned.", "건강한 신체, 평온한 마음, 사랑이 가득한 집. 이것들은 돈으로 살 수 없으며 스스로 가꾸어 얻어야만 한다.", "나발 라비칸트 (Naval Ravikant)", "The Almanack of Naval Ravikant"],
  ["People don't buy what you do; they buy why you do it.", "사람들은 당신이 '무엇'을 하는지를 사는 것이 아니라, 당신이 '왜' 그 일을 하는지를 산다.", "사이먼 시넥 (Simon Sinek)", "나는 왜 이 일을 하는가 (Start With Why)"],
  ["Vulnerability is not winning or losing; it's having the courage to show up and be seen when we have no control over the outcome.", "취약함이란 이기고 지는 문제가 아니다. 결과를 통제할 수 없을 때에도 모습을 드러내고 마주할 용기를 내는 것이다.", "브레네 브라운 (Brené Brown)", "Rising Strong"],
  ["Clear is kind. Unclear is unkind.", "명확하게 말하는 것이 친절한 것이다. 모호하게 돌려 말하는 것은 불친절한 것이다.", "브레네 브라운 (Brené Brown)", "Dare to Lead"],
  ["Most of the important things in the world have been accomplished by people who have kept on trying when there seemed to be no help at all.", "세상의 중요한 성취 대부분은 전혀 희망이 보이지 않을 때에도 끝까지 시도를 멈추지 않은 사람들에 의해 이루어졌다.", "데일 카네기 (Dale Carnegie)", "인간관계론 (How to Win Friends and Influence People)"],
  ["Inaction breeds doubt and fear. Action breeds confidence and courage.", "행동하지 않으면 의심과 두려움이 자라나고, 행동하면 자신감과 용기가 자라난다.", "데일 카네기 (Dale Carnegie)", "자기관리론 (How to Stop Worrying and Start Living)"],
  ["You can make more friends in two months by becoming interested in other people than you can in two years by trying to get other people interested in you.", "남들이 나에게 관심을 갖게 하려고 2년 동안 애쓰는 것보다, 내가 남들에게 진심으로 관심을 가질 때 단 두 달 만에 더 많은 친구를 사귈 수 있다.", "데일 카네기 (Dale Carnegie)", "인간관계론 (How to Win Friends and Influence People)"],
  ["Remember that happiness doesn't depend upon who you are or what you have; it depends solely upon what you think.", "행복은 당신이 누구인지 또는 무엇을 가졌는지에 달려 있지 않다는 것을 기억하라. 행복은 오직 당신이 어떻게 생각하느냐에 달려 있다.", "데일 카네기 (Dale Carnegie)", "How to Stop Worrying and Start Living"],
  ["Today is life—the only life you are sure of. Make the most of today.", "오늘이 바로 삶이다. 당신이 확신할 수 있는 유일한 삶이다. 오늘 하루를 최대한 누려라.", "데일 카네기 (Dale Carnegie)", "How to Stop Worrying and Start Living"],
  ["If you are distressed by anything external, the pain is not due to the thing itself, but to your estimate of it; and this you have the power to revoke at any moment.", "외부의 어떤 일로 괴로워한다면, 그 고통은 그 일 자체 때문이 아니라 그것에 대한 당신의 판단 때문이다. 그리고 당신에게는 언제든 그 판단을 거두어들일 힘이 있다.", "마르쿠스 아우렐리우스 (Marcus Aurelius)", "명상록 (Meditations)"],
  ["All we have to decide is what to do with the time that is given us.", "우리가 결정해야 할 유일한 것은 우리에게 주어진 시간을 어떻게 쓸 것인가 하는 점이다.", "J. R. R. 톨킨 (J. R. R. Tolkien)", "반지의 제왕 (The Fellowship of the Ring)"],
  ["Not all those who wander are lost.", "방랑하는 자라고 해서 모두 길을 잃은 것은 아니다.", "J. R. R. 톨킨 (J. R. R. Tolkien)", "반지의 제왕 (The Fellowship of the Ring)"],
  ["You are never too old to set another goal or to dream a new dream.", "또 다른 목표를 세우거나 새로운 꿈을 꾸기에 너무 늦은 나이란 결코 없다.", "C. S. 루이스 귀속 (C. S. Lewis / Les Brown)", "Attributed"],
  ["Humility is not thinking less of yourself, it's thinking of yourself less.", "겸손이란 자기 자신을 낮추어 비하하는 것이 아니라, 자기 자신에 대한 집착을 덜어내는 것이다.", "C. S. 루이스 귀속 (C. S. Lewis / Rick Warren)", "Attributed"],
  ["Hardships often prepare ordinary people for an extraordinary destiny.", "시련은 종종 평범한 사람들을 비범한 운명을 맞이할 수 있도록 준비시킨다.", "C. S. 루이스 (C. S. Lewis)", "Attributed"],
  ["Integrity is doing the right thing, even when no one is watching.", "진실성(무결성)이란 아무도 보지 않을 때에도 옳은 일을 행하는 것이다.", "C. S. 루이스 귀속 (C. S. Lewis / Charles Marshall)", "Attributed"],
  ["We are what we repeatedly do. Excellence, then, is not an act, but a habit.", "우리는 우리가 반복적으로 행하는 바가 만든 결과물이다. 그러므로 탁월함은 일회성 행동이 아니라 습관이다.", "윌 듀런트 / 아리스토텔레스 해설 (Will Durant)", "The Story of Philosophy (1926)"],
  ["It is the mark of an educated mind to be able to entertain a thought without accepting it.", "어떤 생각에 동의하지 않더라도 그 생각을 열린 마음으로 검토할 수 있는 것, 그것이 교양 있는 지성의 표지다.", "아리스토텔레스 귀속 (Aristotle)", "Attributed"],
  ["Knowing yourself is the beginning of all wisdom.", "네 자신을 아는 것이 모든 지혜의 시작이다.", "아리스토텔레스 귀속 (Aristotle)", "Attributed"],
  ["Patience is bitter, but its fruit is sweet.", "인내는 쓰지만 그 열매는 달다.", "장자크 루소 / 아리스토텔레스 (Jean-Jacques Rousseau)", "Classic Proverb"],
  ["Well begun is half done.", "시작이 반이다.", "아리스토텔레스 (Aristotle)", "Politics"],
  ["The roots of education are bitter, but the fruit is sweet.", "배움의 뿌리는 쓰지만 그 열매는 달콤하다.", "아리스토텔레스 / 이소크라테스 (Aristotle)", "Diogenes Laërtius"],
  ["Comparison is the thief of joy.", "비교는 기쁨을 훔쳐 가는 도둑이다.", "시어도어 루스벨트 귀속 (Theodore Roosevelt)", "Attributed"],
  ["Do what you can, with what you have, where you are.", "지금 당신이 있는 곳에서, 당신이 가진 것으로, 당신이 할 수 있는 일을 하라.", "시어도어 루스벨트 / 스콰이어 빌 와이드너 (Theodore Roosevelt)", "Autobiography (1913)"],
  ["Believe you can and you're halfway there.", "할 수 있다고 믿어라, 그러면 이미 절반은 온 것이다.", "시어도어 루스벨트 (Theodore Roosevelt)", "Attributed"],
  ["It is not the critic who counts; not the man who points out how the strong man stumbles... The credit belongs to the man who is actually in the arena.", "중요한 것은 비평가가 아니다. 강한 사람이 어떻게 비틀거렸는지 지적하는 사람도 아니다. 영예는 실제로 경기장 안에서 피와 땀과 먼지를 뒤집어쓰며 분투하는 사람의 몫이다.", "시어도어 루스벨트 (Theodore Roosevelt)", "Citizenship in a Republic Speech (1910)"],
  ["Speak softly and carry a big stick; you will go far.", "부드럽게 말하되 큰 몽둥이(실력)를 지녀라. 그러면 멀리 나아갈 수 있을 것이다.", "시어도어 루스벨트 (Theodore Roosevelt)", "Minnesota State Fair Speech (1901)"],
  ["Far and away the best prize that life has to offer is the chance to work hard at work worth doing.", "인생이 주는 단연 최고의 상은 할 만한 가치가 있는 일에 온 힘을 다해 몰두할 수 있는 기회다.", "시어도어 루스벨트 (Theodore Roosevelt)", "Labor Day Speech (1903)"],
  ["In three words I can sum up everything I've learned about life: it goes on.", "내가 삶에 대해 배운 모든 것은 단 세 단어로 요약할 수 있다. 삶은 계속된다는 것이다.", "로버트 프로스트 (Robert Frost)", "Attributed"],
  ["Two roads diverged in a wood, and I—I took the one less traveled by, And that has made all the difference.", "숲속에 두 갈래 길이 나 있었고, 나는 사람들이 적게 간 길을 택했다. 그리고 그것이 내 모든 것을 바꾸어 놓았다.", "로버트 프로스트 (Robert Frost)", "가지 않은 길 (The Road Not Taken, 1916)"],
  ["The best way out is always through.", "빠져나가는 가장 좋은 방법은 언제나 정면으로 돌파하는 것이다.", "로버트 프로스트 (Robert Frost)", "A Servant to Servants (1914)"],
  ["An investment in knowledge pays the best interest.", "지식에 대한 투자가 항상 최고의 이자를 지불한다.", "벤저민 프랭클린 (Benjamin Franklin)", "The Way to Wealth (1758)"],
  ["Tell me and I forget, teach me and I may remember, involve me and I learn.", "말해주면 잊어버리고, 가르쳐주면 기억할지 모르지만, 직접 참여하게 하면 배운다.", "벤저민 프랭클린 귀속 / 순자 (Benjamin Franklin)", "Attributed"],
  ["Energy and persistence conquer all things.", "열정적인 에너지와 끈기는 모든 것을 정복한다.", "벤저민 프랭클린 (Benjamin Franklin)", "Poor Richard's Almanack (1750)"],
  ["By failing to prepare, you are preparing to fail.", "준비를 게을리하는 것은 실패를 준비하는 것과 같다.", "벤저민 프랭클린 (Benjamin Franklin)", "Attributed"],
  ["Well done is better than well said.", "훌륭하게 해내는 것이 훌륭하게 말하는 것보다 낫다.", "벤저민 프랭클린 (Benjamin Franklin)", "Poor Richard's Almanack (1737)"],
  ["Lost time is never found again.", "잃어버린 시간은 결코 다시 찾을 수 없다.", "벤저민 프랭클린 (Benjamin Franklin)", "Poor Richard's Almanack (1747)"],
  ["Either write something worth reading or do something worth writing.", "읽을 가치가 있는 글을 쓰거나, 글로 쓸 가치가 있는 일을 하라.", "벤저민 프랭클린 (Benjamin Franklin)", "Poor Richard's Almanack (1738)"],
  ["Early to bed and early to rise makes a man healthy, wealthy, and wise.", "일찍 자고 일찍 일어나는 습관은 사람을 건강하고 부유하며 지혜롭게 만든다.", "벤저민 프랭클린 (Benjamin Franklin)", "Poor Richard's Almanack (1735)"],
  ["He that can have patience can have what he will.", "인내심을 가질 수 있는 사람은 자신이 원하는 무엇이든 얻을 수 있다.", "벤저민 프랭클린 (Benjamin Franklin)", "Poor Richard's Almanack (1736)"],
  ["Never leave that till tomorrow which you can do today.", "오늘 할 수 있는 일을 결코 내일로 미루지 마라.", "벤저민 프랭클린 (Benjamin Franklin)", "Poor Richard's Almanack (1749)"],
  ["Diligence is the mother of good luck.", "부지런함은 행운의 어머니다.", "벤저민 프랭클린 (Benjamin Franklin)", "Poor Richard's Almanack (1736)"],
  ["A penny saved is a penny earned.", "한 푼 아끼는 것이 한 푼 버는 것이다.", "벤저민 프랭클린 (Benjamin Franklin)", "Proverb"],
  ["Nothing is certain except death and taxes.", "이 세상에서 죽음과 세금을 제외하고 확실한 것은 아무것도 없다.", "벤저민 프랭클린 (Benjamin Franklin)", "Letter to Jean-Baptiste Le Roy (1789)"],
  ["Look at a stone cutter hammering away at his rock, perhaps a hundred times without as much as a crack showing in it. Yet at the hundred-and-first blow it will split in two, and I know it was not the last blow that did it, but all that had gone before.", "석공이 바위를 정으로 내리치는 모습을 보라. 백 번을 내리쳐도 금 하나 가지 않을 수 있다. 그러나 백한 번째 내리쳤을 때 바위가 두 동강 난다면, 그것은 마지막 한 번의 타격 때문이 아니라 그 이전에 가해진 모든 타격 덕분이다.", "제이콥 리스 (Jacob Riis)", "San Antonio Spurs Locker Room Quote"],
  ["Discipline equals freedom.", "자기 절제와 규율이 곧 진정한 자유를 만든다.", "조코 윌링크 (Jocko Willink)", "Extreme Ownership"],
  ["You can't connect the dots looking forward; you can only connect them looking backwards. So you have to trust that the dots will somehow connect in your future.", "앞을 내다보며 점들을 이을 수는 없다. 오직 뒤를 돌아볼 때만 점들을 이을 수 있다. 그러니 지금의 점들이 미래에 어떻게든 이어질 것이라고 믿어야 한다.", "스티브 잡스 (Steve Jobs)", "Stanford Commencement Speech (2005)"],
  ["Have the courage to follow your heart and intuition. They somehow already know what you truly want to become.", "당신의 가슴과 직관을 따를 용기를 가져라. 그것들은 당신이 진정으로 무엇이 되고 싶은지 이미 알고 있다.", "스티브 잡스 (Steve Jobs)", "Stanford Commencement Speech (2005)"],
  ["Quality is more important than quantity. One home run is much better than two doubles.", "양이 아니라 질이 더 중요하다. 2루타 두 개보다 홈런 한 방이 훨씬 낫다.", "스티브 잡스 (Steve Jobs)", "BusinessWeek (2006)"],
  ["I knew that if I failed I wouldn't regret that, but I knew the one thing I might regret is not trying.", "실패하더라도 후회하지 않을 것임을 알았지만, 시도조차 하지 않는다면 평생 후회할 것임을 알았다.", "제프 베조스 (Jeff Bezos)", "Interview"],
  ["Be stubborn on vision, but flexible on details.", "비전에 대해서는 고집스러울 만큼 확고하되, 세부적인 방법에서는 유연하라.", "제프 베조스 (Jeff Bezos)", "Amazon Leadership Philosophy"],
  ["Your brand is what other people say about you when you're not in the room.", "당신의 브랜드란 당신이 방을 나갔을 때 남아 있는 사람들이 당신에 대해 하는 말이다.", "제프 베조스 (Jeff Bezos)", "Attributed"],
  ["When something is important enough, you do it even if the odds are not in your favor.", "어떤 일이 충분히 중요하다면, 승산이 당신 편이 아니더라도 그 일을 해야 한다.", "일론 머스크 (Elon Musk)", "60 Minutes Interview (2012)"],
  ["Persistence is very important. You should not give up unless you are forced to give up.", "끈기는 매우 중요하다. 어쩔 수 없이 포기해야만 하는 상황이 아니라면 결코 포기해서는 안 된다.", "일론 머스크 (Elon Musk)", "Interview"],
  ["I think it is possible for ordinary people to choose to be extraordinary.", "나는 평범한 사람도 스스로 비범해지기를 선택할 수 있다고 믿는다.", "일론 머스크 (Elon Musk)", "Interview"],
  ["Don't compare yourself with anyone in this world... if you do so, you are insulting yourself.", "이 세상의 그 누구와도 자신을 비교하지 마라. 그렇게 하는 것은 자기 자신을 모욕하는 일이다.", "빌 게이츠 귀속 (Bill Gates)", "Attributed"],
  ["Done is better than perfect.", "완벽을 기하느라 끝내지 못하는 것보다 일단 완수하는 것이 낫다.", "셰릴 샌드버그 (Sheryl Sandberg)", "린 인 (Lean In)"],
  ["Fortune sides with him who dares.", "운명의 여신은 과감히 도전하는 자의 편을 든다.", "베르길리우스 (Virgil)", "아이네이스 (Aeneid)"],
  ["Action is the foundational key to all success.", "행동은 모든 성공의 가장 기초적인 열쇠다.", "파블로 피카소 (Pablo Picasso)", "Attributed"],
  ["Every child is an artist. The problem is how to remain an artist once he grows up.", "모든 아이는 예술가다. 문제는 어른이 된 뒤에도 어떻게 예술가로 남아 있느냐다.", "파블로 피카소 (Pablo Picasso)", "Attributed"],
  ["Inspiration exists, but it has to find you working.", "영감은 분명 존재한다. 하지만 영감은 당신이 일하고 있을 때에만 찾아온다.", "파블로 피카소 (Pablo Picasso)", "Attributed"],
  ["Everything you can imagine is real.", "당신이 상상할 수 있는 모든 것은 현실이 될 수 있다.", "파블로 피카소 (Pablo Picasso)", "Attributed"],
  ["Simplicity is the ultimate sophistication.", "단순함은 궁극의 정교함이다.", "레오나르도 다 빈치 귀속 (Leonardo da Vinci)", "Attributed"],
  ["Learning never exhausts the mind.", "배움은 결코 정신을 지치게 하지 않는다.", "레오나르도 다 빈치 (Leonardo da Vinci)", "Notebooks"],
  ["Iron rusts from disuse; stagnant water loses its purity... even so does inaction sap the vigor of the mind.", "쇠는 쓰지 않으면 녹이 슬고, 고인 물은 썩어 맑음을 잃듯, 게으름과 무위는 정신의 활력을 갉아먹는다.", "레오나르도 다 빈치 (Leonardo da Vinci)", "Notebooks"],
  ["Time stays long enough for anyone who will use it.", "시간은 그것을 제대로 활용하려는 사람에게는 충분히 오래 머물러 준다.", "레오나르도 다 빈치 (Leonardo da Vinci)", "Notebooks"],
  ["The greater danger for most of us lies not in setting our aim too high and falling short; but in setting our aim too low, and achieving our mark.", "우리 대부분에게 더 큰 위험은 목표를 너무 높게 잡아 미치지 못하는 것이 아니라, 목표를 너무 낮게 잡아 거기에 안주해 버리는 것이다.", "미켈란젤로 귀속 (Michelangelo)", "Attributed"],
  ["I am still learning.", "나는 아직도 배우고 있다 (Ancora imparo).", "미켈란젤로 (Michelangelo)", "Motto at age 87"],
  ["Great things are not done by impulse, but by a series of small things brought together.", "위대한 일은 충동적으로 이루어지는 것이 아니라, 작은 일들이 차곡차곡 모여서 이루어진다.", "빈센트 반 고흐 (Vincent van Gogh)", "Letter to Theo (1882)"],
  ["What would life be if we had no courage to attempt anything?", "무언가를 시도할 용기조차 없다면 삶이 대체 무엇이겠는가?", "빈센트 반 고흐 (Vincent van Gogh)", "Letter to Theo (1884)"],
  ["If you hear a voice within you say 'you cannot paint,' then by all means paint, and that voice will be silenced.", "내면에서 '너는 그림을 그릴 수 없어'라는 목소리가 들려오거든, 기어코 그림을 그려라. 그러면 그 목소리는 잠잠해질 것이다.", "빈센트 반 고흐 (Vincent van Gogh)", "Letter to Theo (1883)"],
  ["Normality is a paved road: It's comfortable to walk, but no flowers grow on it.", "평범함이란 잘 포장된 도로와 같다. 걷기에는 편하지만 그 위에는 꽃이 피지 않는다.", "빈센트 반 고흐 (Vincent van Gogh)", "Attributed"],
  ["Have no fear of perfection - you'll never reach it.", "완벽함에 대해 두려워하지 마라. 어차피 완벽함에는 결코 도달할 수 없으니 마음껏 시도하라.", "살바도르 달리 (Salvador Dalí)", "Attributed"],
  ["Music gives a soul to the universe, wings to the mind, flight to the imagination and life to everything.", "음악은 우주에 영혼을 불어넣고, 마음에 날개를 달아주며, 상상력에 비상을, 그리고 만물에 생명을 불어넣는다.", "플라톤 귀속 (Plato)", "Attributed"],
  ["Courage is knowing what not to fear.", "용기란 무엇을 두려워하지 말아야 하는지를 아는 것이다.", "플라톤 (Plato)", "라케스 (Laches)"],
  ["The measure of a man is what he does with power.", "한 인간의 진가는 그가 권력을 쥐었을 때 무엇을 하느냐로 드러난다.", "플라톤 / 피타코스 (Plato / Pittacus)", "Attributed"],
  ["Wise men speak because they have something to say; fools because they have to say something.", "현명한 사람은 할 말이 있어서 말하고, 어리석은 사람은 무언가 말해야 해서 말한다.", "플라톤 귀속 (Plato)", "Attributed"],
  ["The unexamined life is not worth living.", "성찰하지 않는 삶은 살 가치가 없다.", "소크라테스 (Socrates)", "소크라테스의 변명 (Apology)"],
  ["The secret of change is to focus all of your energy, not on fighting the old, but on building the new.", "변화의 비결은 모든 에너지를 과거와 싸우는 데 쓰는 것이 아니라, 새로운 것을 만드는 데 집중하는 것이다.", "소크라테스 캐릭터 / 댄 밀먼 (Dan Millman)", "Way of the Peaceful Warrior (1980)"],
  ["Education is the kindling of a flame, not the filling of a vessel.", "교육은 양동이를 채우는 것이 아니라 불꽃을 피워 올리는 것이다.", "플루타르코스 / 소크라테스 귀속 (Plutarch)", "On Listening to Lectures"],
  ["Wonder is the beginning of wisdom.", "경이로움을 느끼는 것이 지혜의 시작이다.", "소크라테스 / 플라톤 (Socrates)", "테아이테토스 (Theaetetus)"],
  ["To find yourself, think for yourself.", "자기 자신을 찾으려면 스스로 생각하라.", "소크라테스 귀속 (Socrates)", "Attributed"],
  ["Contentment is natural wealth, luxury is artificial poverty.", "자족하는 마음은 타고난 부유함이고, 사치는 인위적인 빈곤이다.", "소크라테스 귀속 (Socrates)", "Attributed"],
  ["No citizen has a right to be an amateur in the matter of physical training... what a disgrace it is for a man to grow old without ever seeing the beauty and strength of which his body is capable.", "신체 단련에 있어서 아마추어로 남을 권리는 누구에게도 없다. 자신의 육체가 도달할 수 있는 아름다움과 강인함을 한 번도 보지 못한 채 늙어가는 것은 얼마나 안타까운 일인가.", "소크라테스 / 크세노폰 (Socrates / Xenophon)", "회상록 (Memorabilia)"],
  ["Happiness depends upon ourselves.", "행복은 우리 자신에게 달려 있다.", "아리스토텔레스 (Aristotle)", "니코마코스 윤리학 (Nicomachean Ethics)"],
  ["He who has overcome his fears will truly be free.", "자신의 두려움을 극복한 사람만이 진정으로 자유로워질 것이다.", "아리스토텔레스 귀속 (Aristotle)", "Attributed"],
  ["Quality is not an act, it is a habit.", "품격과 탁월함은 일시적인 행동이 아니라 습관이다.", "아리스토텔레스 귀속 (Aristotle)", "Will Durant Summary"],
  ["Pleasure in the job puts perfection in the work.", "일에서 느끼는 즐거움이 그 결과물에 완벽함을 불어넣는다.", "아리스토텔레스 (Aristotle)", "Nicomachean Ethics Context"],
  ["Hope is a waking dream.", "희망은 깨어 있는 자의 꿈이다.", "아리스토텔레스 (Aristotle)", "Diogenes Laërtius"],
  ["A friend to all is a friend to none.", "모두에게 친구인 사람은 누구에게도 진정한 친구가 아니다.", "아리스토텔레스 (Aristotle)", "Nicomachean Ethics"],
  ["There is only one way to avoid criticism: do nothing, say nothing, and be nothing.", "비판을 피하는 방법은 단 하나뿐이다. 아무것도 하지 않고, 아무 말도 하지 않으며, 아무 존재도 되지 않는 것이다.", "엘버트 허버드 / 아리스토텔레스 오귀속 (Elbert Hubbard)", "The Philistine"],
  ["Everything has beauty, but not everyone sees it.", "모든 것에는 아름다움이 있지만, 모든 사람이 그것을 보지는 못한다.", "공자 귀속 (Confucius)", "Popular English Proverb"],
  ["It does not matter how slowly you go as long as you do not stop.", "멈추지 않는 한 얼마나 천천히 가는지는 중요하지 않다.", "공자 (Confucius)", "논어 자한편 재해석"],
  ["Our greatest glory is not in never falling, but in rising every time we fall.", "우리의 가장 큰 영광은 한 번도 넘어지지 않는 데 있는 것이 아니라, 넘어질 때마다 다시 일어서는 데 있다.", "올리버 골드스미스 / 공자 귀속 (Oliver Goldsmith)", "The Citizen of the World"],
  ["Real knowledge is to know the extent of one's ignorance.", "진정한 앎이란 자신이 얼마나 모르는지를 아는 것이다 (知之爲知之 不知爲不知 是知也).", "공자 (Confucius)", "논어 위정편 (Analects 2.17)"],
  ["When it is obvious that the goals cannot be reached, don't adjust the goals, adjust the action steps.", "목표에 도달할 수 없음이 분명해 보일 때, 목표를 수정하지 말고 행동 단계를 수정하라.", "공자 귀속 (Confucius)", "Attributed"],
  ["The man who moves a mountain begins by carrying away small stones.", "산을 옮기는 사람도 작은 돌멩이를 나르는 것부터 시작한다.", "공자 / 열자 우공이산 (Confucius)", "Proverb"],
  ["Life is really simple, but we insist on making it complicated.", "삶은 원래 아주 단순하지만, 우리는 기어이 그것을 복잡하게 만들려 고집한다.", "공자 귀속 (Confucius)", "Attributed"],
  ["Before you embark on a journey of revenge, dig two graves.", "복수의 여정을 떠나기 전에 무덤을 두 개 파라.", "일본 속담 / 공자 귀속 (Proverb)", "Classic Proverb"],
  ["Respect yourself and others will respect you.", "스스로를 존중하라, 그러면 다른 사람들도 당신을 존중할 것이다.", "공자 (Confucius)", "Analects Context"],
  ["Silence is a true friend who never betrays.", "침묵은 결코 배신하지 않는 진정한 친구다.", "공자 귀속 (Confucius)", "Attributed"],
  ["The journey of a thousand miles begins with a single step.", "천 리 길도 한 걸음부터 시작된다 (千里之行 始於足下).", "노자 (Laozi)", "도덕경 64장 (Tao Te Ching)"],
  ["Knowing others is intelligence; knowing yourself is true wisdom. Mastering others is strength; mastering yourself is true power.", "남을 아는 자는 지혜롭고, 자신을 아는 자는 밝다. 남을 이기는 자는 힘이 있고, 자신을 이기는 자는 진정으로 강하다 (知人者智 自知者明 勝人者有力 自勝者强).", "노자 (Laozi)", "도덕경 33장 (Tao Te Ching)"],
  ["Nature does not hurry, yet everything is accomplished.", "자연은 서두르지 않지만, 모든 것을 남김없이 이루어낸다.", "노자 귀속 (Laozi)", "Taoist Wisdom"],
  ["When I let go of what I am, I become what I might be.", "내가 현재의 나에 대한 집착을 내려놓을 때, 비로소 내가 될 수 있는 존재가 된다.", "노자 귀속 / 존 하이더 (Laozi / John Heider)", "The Tao of Leadership"],
  ["He who knows that enough is enough will always have enough.", "만족할 줄 아는 사람은 언제나 풍족하다 (知足之足 常足矣).", "노자 (Laozi)", "도덕경 46장 (Tao Te Ching)"],
  ["Care about what other people think and you will always be their prisoner.", "남들이 어떻게 생각하는지에 매달리면 당신은 영원히 그들의 포로가 될 것이다.", "노자 귀속 (Laozi)", "Tao Te Ching Paraphrase"],
  ["Appear weak when you are strong, and strong when you are weak.", "강할 때는 약한 듯이 보이고, 약할 때는 강한 듯이 보여라.", "손무 (Sun Tzu)", "손자병법 시계편 (The Art of War)"],
  ["Supreme excellence consists in breaking the enemy's resistance without fighting.", "최상의 승리는 싸우지 않고 적의 저항을 굴복시키는 것이다 (不戰而屈人之兵 善之善者也).", "손무 (Sun Tzu)", "손자병법 모공편 (The Art of War)"],
  ["In the midst of chaos, there is also opportunity.", "혼란의 한가운데에도 기회는 존재한다.", "손무 귀속 (Sun Tzu)", "The Art of War Context"],
  ["Victorious warriors win first and then go to war, while defeated warriors go to war first and then seek to win.", "승리하는 장수는 먼저 이겨놓고 싸움에 나서며, 패배하는 장수는 일단 싸움을 벌여놓고 승리를 구한다.", "손무 (Sun Tzu)", "손자병법 군형편 (The Art of War)"],
  ["Know the enemy and know yourself; in a hundred battles you will never be in peril.", "적을 알고 나를 알면 백 번 싸워도 위태롭지 않다 (知彼知己 百戰不殆).", "손무 (Sun Tzu)", "손자병법 모공편 (The Art of War)"],
  ["Opportunities multiply as they are seized.", "기회는 붙잡아 실행할수록 배가된다.", "손무 귀속 (Sun Tzu)", "The Art of War Paraphrase"],
  ["No wind favors he who has no destined port.", "목적지 항구가 없는 자에게는 어떤 바람도 순풍이 아니다.", "미셸 드 몽테뉴 (Michel de Montaigne)", "수상록 (Essays)"],
  ["He who fears he shall suffer, already suffers what he fears.", "고통받을까 봐 두려워하는 사람은 이미 자신이 두려워하는 그 고통을 겪고 있는 것이다.", "미셸 드 몽테뉴 (Michel de Montaigne)", "수상록 (Essays)"],
  ["My life has been full of terrible misfortunes most of which never happened.", "내 인생은 끔찍한 불행들로 가득 차 있었는데, 그중 대부분은 실제로 일어나지조차 않은 일들이었다.", "미셸 드 몽테뉴 귀속 (Michel de Montaigne)", "Attributed"],
  ["I think, therefore I am.", "나는 생각한다, 고로 존재한다 (Cogito, ergo sum).", "르네 데카르트 (René Descartes)", "방법서설 (Discourse on the Method, 1637)"],
  ["It is not enough to have a good mind; the main thing is to use it well.", "좋은 머리를 가지고 있는 것만으로는 충분하지 않다. 핵심은 그것을 올바르게 잘 사용하는 것이다.", "르네 데카르트 (René Descartes)", "방법서설 (Discourse on the Method)"],
  ["The reading of all good books is like a conversation with the finest minds of past centuries.", "모든 훌륭한 책을 읽는 것은 지난 세기 최고의 지성들과 대화를 나누는 것과 같다.", "르네 데카르트 (René Descartes)", "방법서설 (Discourse on the Method)"],
  ["All of humanity's problems stem from man's inability to sit quietly in a room alone.", "인류의 모든 불행은 인간이 방 안에 혼자 조용히 앉아 있지 못하는 데서 비롯된다.", "블레즈 파스칼 (Blaise Pascal)", "팡세 (Pensées)"],
  ["The heart has its reasons which reason knows nothing of.", "심장(마음)에는 이성이 전혀 알지 못하는 심장만의 이유가 있다.", "블레즈 파스칼 (Blaise Pascal)", "팡세 (Pensées)"],
  ["Kind words do not cost much. Yet they accomplish much.", "친절한 말은 비용이 거의 들지 않지만, 아주 많은 것을 이루어낸다.", "블레즈 파스칼 (Blaise Pascal)", "팡세 (Pensées)"],
  ["Man is only a reed, the weakest in nature, but he is a thinking reed.", "인간은 자연에서 가장 연약한 한 줄기 갈대에 불과하다. 그러나 인간은 생각하는 갈대다.", "블레즈 파스칼 (Blaise Pascal)", "팡세 (Pensées)"],
  ["Dare to know! Have the courage to use your own understanding.", "과감히 알려고 하라(Sapere aude)! 너 자신의 지성을 사용할 용기를 가져라.", "임마누엘 칸트 (Immanuel Kant)", "계몽이란 무엇인가 (What Is Enlightenment?, 1784)"],
  ["Act only according to that maxim whereby you can, at the same time, will that it should become a universal law.", "네 의지의 준칙이 언제나 동시에 보편적 입법의 원리가 될 수 있도록 행위하라.", "임마누엘 칸트 (Immanuel Kant)", "실천이성비판 (Critique of Practical Reason)"],
  ["Science is organized knowledge. Wisdom is organized life.", "과학은 체계화된 지식이고, 지혜는 체계화된 삶이다.", "임마누엘 칸트 귀속 / 허버트 스펜서 (Immanuel Kant / Will Durant)", "The Story of Philosophy"],
  ["Man must be disciplined, for he is by nature raw and wild.", "인간은 본성상 다듬어지지 않고 거칠기 때문에 반드시 수양과 훈육을 거쳐야 한다.", "임마누엘 칸트 (Immanuel Kant)", "교육학 강의 (Lectures on Pedagogy)"],
  ["Talent hits a target no one else can hit; Genius hits a target no one else can see.", "재능은 남들이 맞히지 못하는 과녁을 맞히지만, 천재는 남들이 보지도 못하는 과녁을 맞힌다.", "아르투어 쇼펜하우어 (Arthur Schopenhauer)", "의지와 표상으로서의 세계 (The World as Will and Representation)"],
  ["Mostly it is loss which teaches us about the worth of things.", "대개의 경우 우리에게 사물의 진정한 가치를 가르쳐 주는 것은 상실이다.", "아르투어 쇼펜하우어 (Arthur Schopenhauer)", "소품과 부록 (Parerga and Paralipomena)"],
  ["A man can be himself only so long as he is alone.", "인간은 오직 홀로 있을 때에만 온전히 자기 자신일 수 있다.", "아르투어 쇼펜하우어 (Arthur Schopenhauer)", "소품과 부록 (Parerga and Paralipomena)"],
  ["Change alone is eternal, perpetual, immortal.", "오직 변화만이 영원하고, 끊임없으며, 불멸한다.", "아르투어 쇼펜하우어 (Arthur Schopenhauer)", "Studies in Pessimism"],
  ["Life can only be understood backwards; but it must be lived forwards.", "삶은 오직 뒤를 돌아봄으로써만 이해될 수 있지만, 앞을 향해 살아가야만 한다.", "쇠렌 키르케고르 (Søren Kierkegaard)", "일기 (Journals, 1843)"],
  ["Anxiety is the dizziness of freedom.", "불안은 자유가 느끼는 현기증이다.", "쇠렌 키르케고르 (Søren Kierkegaard)", "불안의 개념 (The Concept of Anxiety)"],
  ["To dare is to lose one's footing momentarily. Not to dare is to lose oneself.", "과감히 도전한다는 것은 잠시 발밑의 중심을 잃는 것이다. 도전하지 않는다는 것은 자기 자신을 잃는 것이다.", "쇠렌 키르케고르 귀속 (Søren Kierkegaard)", "Attributed"],
  ["Nothing great in the world has ever been accomplished without passion.", "세상의 어떤 위대한 일도 열정 없이 이루어진 적은 없다.", "게오르크 빌헬름 프리드리히 헤겔 (G. W. F. Hegel)", "역사철학강의 (Philosophy of History)"],
  ["The owl of Minerva spreads its wings only with the falling of the dusk.", "미네르바의 부엉이는 황혼이 저물어야 비로소 날개를 편다.", "게오르크 빌헬름 프리드리히 헤겔 (G. W. F. Hegel)", "법철학 강요 (Elements of the Philosophy of Right)"],
  ["Man is condemned to be free; because once thrown into the world, he is responsible for everything he does.", "인간은 자유롭도록 선고받았다. 일단 세상에 던져진 이상 자신이 하는 모든 행동에 책임이 있기 때문이다.", "장폴 사르트르 (Jean-Paul Sartre)", "실존주의는 휴머니즘이다 (Existentialism Is a Humanism)"],
  ["In the depth of winter, I finally learned that within me there lay an invincible summer.", "한겨울의 한복판에서 나는 마침내 내 안에 꺾이지 않는 여름이 자리하고 있음을 깨달았다.", "알베르 카뮈 (Albert Camus)", "티파사의 귀환 (Return to Tipasa, 1954)"],
  ["The struggle itself toward the heights is enough to fill a man's heart. One must imagine Sisyphus happy.", "정상을 향한 투쟁 그 자체만으로도 인간의 마음을 채우기에 충분하다. 우리는 시시포스가 행복하다고 상상해야만 한다.", "알베르 카뮈 (Albert Camus)", "시시포스 신화 (The Myth of Sisyphus)"],
  ["Real generosity toward the future lies in giving all to the present.", "미래를 향한 진정한 관대함은 현재에 모든 것을 바치는 데 있다.", "알베르 카뮈 (Albert Camus)", "반항하는 인간 (The Rebel)"],
  ["Don't walk in front of me… I may not follow. Don't walk behind me… I may not lead. Walk beside me… just be my friend.", "내 앞에서 걷지 마라, 내가 따르지 않을지도 모른다. 내 뒤에서 걷지 마라, 내가 이끌지 않을지도 모른다. 다만 내 곁에서 걸으며 나의 친구가 되어주어라.", "알베르 카뮈 귀속 (Albert Camus)", "Attributed"],
  ["Freedom is nothing else but a chance to be better.", "자유란 더 나은 존재가 될 수 있는 기회, 그 이상도 이하도 아니다.", "알베르 카뮈 (Albert Camus)", "Resistance, Rebellion, and Death"],
  ["Everyone thinks of changing the world, but no one thinks of changing himself.", "모두가 세상을 바꾸려고 생각하지만, 정작 자기 자신을 바꾸려고 생각하는 사람은 없다.", "레프 톨스토이 (Leo Tolstoy)", "Three Methods of Reform (1900)"],
  ["The two most powerful warriors are patience and time.", "가장 강력한 두 전사는 인내와 시간이다.", "레프 톨스토이 (Leo Tolstoy)", "전쟁과 평화 (War and Peace)"],
  ["If you look for perfection, you'll never be content.", "완벽함만을 찾으려 한다면 결코 만족할 수 없을 것이다.", "레프 톨스토이 (Leo Tolstoy)", "안나 카레니나 (Anna Karenina)"],
  ["All happy families are alike; each unhappy family is unhappy in its own way.", "행복한 가정은 모두 엇비슷하고, 불행한 가정은 저마다 나름의 이유로 불행하다.", "레프 톨스토이 (Leo Tolstoy)", "안나 카레니나 (Anna Karenina)"],
  ["Wrong does not cease to be wrong because the majority share in it.", "다수가 동참한다고 해서 그릇된 일이 그릇되지 않은 일로 바뀌지는 않는다.", "레프 톨스토이 (Leo Tolstoy)", "참회록 (A Confession)"],
  ["The soul is healed by being with children.", "영혼은 아이들과 함께 있을 때 치유된다.", "표도르 도스토옙스키 (Fyodor Dostoevsky)", "백치 (The Idiot)"],
  ["The mystery of human existence lies not in just staying alive, but in finding something to live for.", "인간 존재의 비밀은 단지 살아남는 데 있는 것이 아니라, 무엇을 위해 살 것인가를 찾는 데 있다.", "표도르 도스토옙스키 (Fyodor Dostoevsky)", "카라마조프가의 형제들 (The Brothers Karamazov)"],
  ["Taking a new step, uttering a new word, is what people fear most.", "새로운 한 걸음을 내딛는 것, 새로운 한마디를 내뱉는 것, 그것이 사람들이 가장 두려워하는 일이다.", "표도르 도스토옙스키 (Fyodor Dostoevsky)", "죄와 벌 (Crime and Punishment)"],
  ["Pain and suffering are always inevitable for a large intelligence and a deep heart.", "고통과 고뇌는 넓은 지성과 깊은 마음을 지닌 이에게 언제나 피할 수 없는 필연이다.", "표도르 도스토옙스키 (Fyodor Dostoevsky)", "죄와 벌 (Crime and Punishment)"],
  ["No amount of guilt can change the past, and no amount of worrying can change the future.", "아무리 큰 죄책감도 과거를 바꿀 수 없고, 아무리 많은 걱정도 미래를 바꿀 수 없다.", "오마르 하이얌 귀속 (Omar Khayyam)", "Proverb"],
  ["Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.", "어제의 나는 똑똑해서 세상을 바꾸고 싶었다. 오늘의 나는 지혜로워져서 나 자신을 바꾸고 있다.", "잘랄루딘 루미 (Rumi)", "Masnavi Context"],
  ["The wound is the place where the Light enters you.", "상처는 바로 빛이 당신 안으로 들어오는 통로다.", "잘랄루딘 루미 (Rumi)", "Attributed Translation"],
  ["What you seek is seeking you.", "당신이 간절히 찾고 있는 그것 또한 당신을 찾고 있다.", "잘랄루딘 루미 (Rumi)", "Fihi Ma Fihi"],
  ["Raise your words, not voice. It is rain that grows flowers, not thunder.", "목소리를 높이지 말고 당신의 말의 격을 높여라. 꽃을 자라게 하는 것은 천둥이 아니라 비다.", "잘랄루딘 루미 (Rumi)", "Attributed"],
  ["Let yourself be silently drawn by the strange pull of what you really love. It will not lead you astray.", "당신이 진정으로 사랑하는 것이 끌어당기는 고요한 인력에 몸을 맡겨라. 그것은 결코 당신을 잘못된 길로 이끌지 않을 것이다.", "잘랄루딘 루미 (Rumi)", "Coleman Barks Translation"],
  ["Do not feel lonely, the entire universe is inside you.", "외로워하지 마라, 온 우주가 당신 안에 들어 있다.", "잘랄루딘 루미 (Rumi)", "Attributed"],
  ["When you do things from your soul, you feel a river moving in you, a joy.", "영혼 깊은 곳에서 우러나와 일을 할 때, 당신은 내면에 흐르는 강물 같은 기쁨을 느끼게 된다.", "잘랄루딘 루미 (Rumi)", "Attributed"],
  ["Peace comes from within. Do not seek it without.", "평화는 내면에서 비롯된다. 밖에서 그것을 찾으려 하지 마라.", "석가모니 귀속 (Buddha)", "Attributed"],
  ["Three things cannot be long hidden: the sun, the moon, and the truth.", "세 가지는 오랫동안 숨길 수 없다. 태양과 달, 그리고 진실이다.", "석가모니 귀속 (Buddha)", "Attributed"],
  ["Holding on to anger is like grasping a hot coal with the intent of throwing it at someone else; you are the one who gets burned.", "분노를 품고 있는 것은 남에게 던지려고 뜨거운 숯불을 손에 쥐고 있는 것과 같아서, 결국 화상을 입는 것은 자기 자신이다.", "석가모니 귀속 (Buddha)", "Visuddhimagga Paraphrase"],
  ["No one saves us but ourselves. No one can and no one may. We ourselves must walk the path.", "우리 자신 외에 그 누구도 우리를 구원하지 못한다. 우리는 스스로 그 길을 걸어가야만 한다.", "석가모니 (Buddha)", "법구경 165송 (Dhammapada)"],
  ["Drop by drop is the water pot filled. Likewise, the wise man, gathering it little by little, fills himself with good.", "물방울이 한 방울씩 모여 물항아리를 채우듯, 지혜로운 사람은 작은 선행을 조금씩 모아 자신을 선함으로 가득 채운다.", "석가모니 (Buddha)", "법구경 122송 (Dhammapada)"],
  ["Health is the greatest gift, contentment the greatest wealth, faithfulness the best relationship.", "건강은 가장 큰 선물이고, 자족함은 가장 큰 부유함이며, 신의는 최고의 인간관계다.", "석가모니 (Buddha)", "법구경 204송 (Dhammapada)"],
  ["Hatred does not cease by hatred, but only by love; this is the eternal rule.", "원한은 원한으로써 결코 사라지지 않고 오직 자비와 사랑으로써만 사라진다. 이것이 영원한 법칙이다.", "석가모니 (Buddha)", "법구경 5송 (Dhammapada)"],
  ["Better than a thousand hollow words, is one word that brings peace.", "공허한 말 천 마디보다 마음에 평화를 가져다주는 단 한마디가 더 낫다.", "석가모니 (Buddha)", "법구경 100송 (Dhammapada)"],
  ["Your work is to discover your world and then with all your heart give yourself to it.", "당신의 과업은 당신만의 소명을 발견하고, 온 마음을 다해 거기에 헌신하는 것이다.", "석가모니 귀속 (Buddha)", "Attributed"],
  ["Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.", "과거에 매이지 말고, 미래를 공상하지 말며, 오직 지금 이 순간에 마음을 집중하라.", "석가모니 (Buddha)", "전유경 (Bhaddekaratta Sutta Paraphrase)"],
  ["A jug fills drop by drop.", "항아리는 한 방울 한 방울의 물로 채워진다.", "석가모니 (Buddha)", "법구경 (Dhammapada)"],
  ["If you light a lamp for somebody, it will also brighten your path.", "누군가를 위해 등불을 밝히면, 그 빛은 당신이 가는 길도 함께 밝혀준다.", "불교 격언 / 니치렌 (Buddhist Proverb)", "Proverb"],
  ["Fall seven times, stand up eight.", "일곱 번 넘어져도 여덟 번 일어나라 (七顚八起).", "동양 격언 (Eastern Proverb)", "Proverb"],
  ["A smooth sea never made a skilled sailor.", "잔잔한 바다는 결코 유능한 항해사를 만들지 못한다.", "영국 속담 (English Proverb)", "Proverb"],
  ["Actions speak louder than words.", "행동은 말보다 더 큰 소리로 말한다.", "영국 속담 (English Proverb)", "Proverb"],
  ["Where there is a will, there is a way.", "뜻이 있는 곳에 길이 있다 (有志者事竟成).", "영국 속담 (English Proverb)", "Proverb"],
  ["Rome wasn't built in a day.", "로마는 하루아침에 이루어지지 않았다.", "서양 속담 (Western Proverb)", "Proverb"],
  ["Fortune favors the bold.", "행운은 용감한 자의 편이다.", "라틴 격언 (Latin Proverb)", "Proverb"],
  ["The pen is mightier than the sword.", "펜은 칼보다 강하다.", "에드워드 불워 리턴 (Edward Bulwer-Lytton)", "Richelieu (1839)"],
  ["Knowledge is power.", "아는 것이 힘이다 (Scientia potentia est).", "프랜시스 베이컨 (Francis Bacon)", "Meditationes Sacrae (1597)"],
  ["Reading maketh a full man; conference a ready man; and writing an exact man.", "독서는 충만한 사람을 만들고, 토론은 민첩한 사람을 만들며, 글쓰기는 정확한 사람을 만든다.", "프랜시스 베이컨 (Francis Bacon)", "학문에 관하여 (Of Studies, 1625)"],
  ["A wise man will make more opportunities than he finds.", "현명한 사람은 우연히 발견하는 기회보다 스스로 만들어내는 기회가 더 많다.", "프랜시스 베이컨 (Francis Bacon)", "수상록 (Essays)"],
  ["Hope is a good breakfast, but it is a bad supper.", "희망은 훌륭한 아침 식사지만, 형편없는 저녁 식사다 (시작할 때 희망은 좋지만 행동 없이 끝날 때까지 희망만 품어서는 안 된다).", "프랜시스 베이컨 (Francis Bacon)", "Apophthegms (1624)"],
  ["To err is human; to forgive, divine.", "실수하는 것은 인간이고, 용서하는 것은 신성한 일이다.", "알렉산더 포프 (Alexander Pope)", "비평론 (An Essay on Criticism, 1711)"],
  ["No man is an island, entire of itself.", "그 어떤 인간도 홀로 떨어져 존재하는 섬이 아니다.", "존 던 (John Donne)", "Devotions upon Emergent Occasions (1624)"],
  ["If winter comes, can spring be far behind?", "겨울이 오면 봄이 어찌 멀리 있겠는가?", "퍼시 비시 셸리 (Percy Bysshe Shelley)", "서풍부 (Ode to the West Wind, 1820)"],
  ["A thing of beauty is a joy forever.", "아름다운 것은 영원한 기쁨이다.", "존 키츠 (John Keats)", "엔디미온 (Endymion, 1818)"],
  ["I am the master of my fate, I am the captain of my soul.", "나는 내 운명의 주인이며, 내 영혼의 선장이다.", "윌리엄 어니스트 헨리 (William Ernest Henley)", "인빅투스 (Invictus, 1875)"],
  ["Success is stumbling from failure to failure with no loss of enthusiasm.", "성공이란 열정을 잃지 않고 실패에서 실패로 걸어가는 것이다.", "윈스턴 처칠 귀속 (Winston Churchill)", "Attributed"],
  ["The best time to plant a tree was 20 years ago. The second best time is now.", "나무를 심기에 가장 좋았던 때는 20년 전이다. 그리고 두 번째로 가장 좋은 때는 바로 지금이다.", "동양 격언 (Proverb)", "Proverb"]
];

async function main() {
  console.log("Fetching verified datasets...");
  const [aphorisms, gosa, foriText, dalsaja, csvText, daemoText, kingsText, quoteAppText] = await Promise.all([
    fetch('https://raw.githubusercontent.com/jjh2613/aphorisms/main/dist/quotes.json').then(r => r.json()),
    fetch('https://raw.githubusercontent.com/lhj715/korean-class-bot/main/data/gosaseongeo.json').then(r => r.json()),
    fetch('https://raw.githubusercontent.com/jeongsooooo-creator/fori/main/index.html').then(r => r.text()),
    fetch('https://raw.githubusercontent.com/dalmook/dalsaja/main/data.json').then(r => r.json()),
    fetch('https://raw.githubusercontent.com/bjo820633-afk/sajasunguh/main/sajasunguh.csv').then(r => r.text()),
    fetch('https://raw.githubusercontent.com/daemo8279/saja/main/index.html').then(r => r.text()),
    fetch('https://raw.githubusercontent.com/kingsmath/kingkorean4jaline/main/index.html').then(r => r.text()),
    fetch('https://raw.githubusercontent.com/chcknnbn/quote-app/main/src/lib/quotes.ts').then(r => r.text())
  ]);

  const englishQuotes = [];
  const hanjaQuotes = [];
  const seenEn = new Set();
  const seenHanja = new Set();

  // 1. Process jjh2613/aphorisms (339 items)
  for (const item of aphorisms) {
    const authorKo = item.author?.name?.ko || '';
    const authorEn = item.author?.name?.en || '';
    const authorStr = authorKo && authorEn && authorKo !== authorEn
      ? `${authorKo} (${authorEn})`
      : (authorKo || authorEn || '미상');
    const sourceTitle = item.source?.title || '';

    if (item.language === 'lzh' && item.original) {
      // Classical Chinese quote with Hanja original
      const key = item.original.trim();
      if (!seenHanja.has(key)) {
        seenHanja.add(key);
        hanjaQuotes.push({
          category: '한자명언',
          original: item.original.trim(),
          korean: item.text.ko.trim(),
          author: authorStr,
          note: `영문: ${item.text.en.trim()}${sourceTitle ? ` | 출전: ${sourceTitle}` : ''}`
        });
      }
    } else if (item.text?.en && item.text?.ko) {
      const key = item.text.en.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!seenEn.has(key)) {
        seenEn.add(key);
        const origNote = item.original && item.language !== 'en'
          ? `원문(${item.language}): ${item.original}${sourceTitle ? ` | 출전: ${sourceTitle}` : ''}`
          : (sourceTitle ? `출전: ${sourceTitle}` : '세계 명언');
        englishQuotes.push({
          category: '영어명언',
          original: item.text.en.trim(),
          korean: item.text.ko.trim(),
          author: authorStr,
          note: origNote
        });
      }
    }
  }

  // 2. Process EXTRA_EN_QUOTES
  for (const [en, ko, author, note] of EXTRA_EN_QUOTES) {
    const key = en.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!seenEn.has(key)) {
      seenEn.add(key);
      englishQuotes.push({
        category: '영어명언',
        original: en.trim(),
        korean: ko.trim(),
        author: author.trim(),
        note: note ? `출전: ${note.trim()}` : '세계 명언'
      });
    }
  }

  // 3. Process 사자성어 (Merge all 5 idiom datasets)
  const idiomMap = new Map();

  // 3a. sajasunguh.csv
  csvText.split('\n').slice(1).forEach(line => {
    const parts = line.trim().split(',');
    if (parts.length >= 3) {
      const reading = parts[0].trim();
      const meaning = parts[1].trim();
      const hanja = parts[2].trim();
      if (reading && hanja && meaning) {
        idiomMap.set(reading, { reading, hanja, meaning, huneum: '', detail: '', source: '한자 성어' });
      }
    }
  });

  // 3b. gosaseongeo.json
  gosa.forEach(it => {
    const k = it.word.trim();
    const prev = idiomMap.get(k) || {};
    idiomMap.set(k, {
      reading: k,
      hanja: (it.hanja || prev.hanja || '').trim(),
      meaning: (it.meaning || prev.meaning || '').trim(),
      huneum: prev.huneum || '',
      detail: it.example ? `예문: ${it.example.trim()}` : (prev.detail || ''),
      source: prev.source || '고사성어'
    });
  });

  // 3c. fori rawData
  const mFori = foriText.match(/const rawData = (\[[\s\S]*?\]);/);
  if (mFori) {
    const arr = eval(mFori[1]);
    arr.forEach(([hanja, reading, huneum, meaning, source]) => {
      const k = reading.trim();
      const prev = idiomMap.get(k) || {};
      idiomMap.set(k, {
        reading: k,
        hanja: (hanja || prev.hanja || '').trim(),
        meaning: (prev.meaning && prev.meaning.length > meaning.length ? prev.meaning : meaning).trim(),
        huneum: (huneum || prev.huneum || '').trim(),
        detail: prev.detail || '',
        source: (source && source !== 'easy' ? source : (prev.source || '고사성어')).trim()
      });
    });
  }

  // 3d. dalsaja
  ['초급', '중급', '고급'].forEach(lvl => {
    dalsaja[lvl]['학습하기'].forEach(it => {
      const k = it['사자성어'].trim();
      const prev = idiomMap.get(k) || {};
      const huneum = prev.huneum || (it.annotations ? it.annotations.map(a => `${a.character}(${a.meaning})`).join(' · ') : '');
      const detail = prev.detail || (it['유래'] ? `풀이: ${it['유래'].trim()}` : '');
      idiomMap.set(k, {
        reading: k,
        hanja: (prev.hanja || it['중국어'] || '').trim(),
        meaning: (prev.meaning && prev.meaning.length > it['뜻'].length ? prev.meaning : it['뜻']).trim(),
        huneum,
        detail,
        source: prev.source || '사자성어'
      });
    });
  });

  // 3e. daemo8279 QS
  const mDaemo = daemoText.match(/const QS=(\[[\s\S]*?\]);/);
  if (mDaemo) {
    const arr = eval(mDaemo[1]);
    arr.forEach(it => {
      const k = it.ans.trim();
      const prev = idiomMap.get(k) || {};
      idiomMap.set(k, {
        reading: k,
        hanja: (it.hj || prev.hanja || '').trim(),
        meaning: (prev.meaning && prev.meaning.length > it.m.length ? prev.meaning : it.m).trim(),
        huneum: prev.huneum || '',
        detail: prev.detail || '',
        source: prev.source || '사자성어'
      });
    });
  }

  // Convert idiomMap to hanjaQuotes
  for (const [, it] of idiomMap) {
    if (!it.hanja || !it.reading || !it.meaning) continue;
    const displayHanja = `${it.hanja} (${it.reading})`;
    if (seenHanja.has(it.hanja)) continue;
    seenHanja.add(it.hanja);

    const noteParts = [];
    if (it.huneum) noteParts.push(`훈음: ${it.huneum}`);
    if (it.detail) noteParts.push(it.detail);

    hanjaQuotes.push({
      category: '사자성어',
      original: displayHanja,
      korean: it.meaning,
      author: it.source || '고사성어 (故事成語)',
      note: noteParts.join(' | ') || `독음: ${it.reading}`
    });
  }

  console.log(`Collected English+Korean quotes: ${englishQuotes.length}`);
  console.log(`Collected Hanja+Idioms quotes: ${hanjaQuotes.length}`);
  console.log(`Total available: ${englishQuotes.length + hanjaQuotes.length}`);

  // Sort hanjaQuotes so '한자명언' comes first, then '사자성어' with rich notes (훈음 + 예문/풀이)
  hanjaQuotes.sort((a, b) => {
    if (a.category !== b.category) return a.category === '한자명언' ? -1 : 1;
    return b.note.length - a.note.length;
  });

  const selectedEn = englishQuotes.slice(0, 500);
  const selectedHanja = hanjaQuotes.slice(0, 500);

  // Interleave 500 English + 500 Hanja = 1000 quotes
  const final1000 = [];
  for (let i = 0; i < 500; i++) {
    if (selectedEn[i]) {
      final1000.push({
        id: final1000.length + 1,
        ...selectedEn[i],
        sent_count: 0,
        last_sent: ''
      });
    }
    if (selectedHanja[i]) {
      final1000.push({
        id: final1000.length + 1,
        ...selectedHanja[i],
        sent_count: 0,
        last_sent: ''
      });
    }
  }

  console.log(`Final dataset count: ${final1000.length}`);

  // Helper to escape CSV fields
  const escapeCsv = (val) => {
    const str = String(val ?? '').replace(/\r?\n/g, ' ');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headers = ['번호', '구분', '원문_또는_한자', '한국어_번역_뜻풀이', '인물_출전', '상세풀이_비고', '발송횟수', '최근발송일시'];
  const csvLines = [headers.join(',')];

  for (const row of final1000) {
    csvLines.push([
      row.id,
      escapeCsv(row.category),
      escapeCsv(row.original),
      escapeCsv(row.korean),
      escapeCsv(row.author),
      escapeCsv(row.note),
      row.sent_count,
      escapeCsv(row.last_sent)
    ].join(','));
  }

  const outDir = __dirname;
  // Write UTF-8 with BOM so Excel and Google Sheets open Korean/Hanja cleanly
  fs.writeFileSync(path.join(outDir, 'quotes_1000.csv'), '\uFEFF' + csvLines.join('\r\n'), 'utf8');
  fs.writeFileSync(path.join(outDir, 'quotes_1000.json'), JSON.stringify(final1000, null, 2), 'utf8');

  // Also generate QuotesData.gs for 1-click Google Sheets auto-population without CSV import if desired
  const compactRows = final1000.map(r => [r.id, r.category, r.original, r.korean, r.author, r.note, 0, '']);
  const gsContent = `/**
 * 1,000개의 명언/사자성어 내장 데이터 (QuotesData.gs)
 * CSV 파일을 직접 업로드하지 않고도, Apps Script에서 [초기 데이터 1,000개 자동 채우기]를 실행하면
 * 현재 스프레드시트에 1,000개의 명언이 한 번에 입력됩니다.
 */
function getInitialQuotesData_() {
  return ${JSON.stringify(compactRows)};
}
`;
  fs.writeFileSync(path.join(outDir, 'QuotesData.gs'), gsContent, 'utf8');
  console.log('Successfully generated quotes_1000.csv, quotes_1000.json, and QuotesData.gs!');
}

main().catch(console.error);
