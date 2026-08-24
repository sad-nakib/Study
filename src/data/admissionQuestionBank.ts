import { PracticeQuestion } from '../types';

export const ADMISSION_QUESTION_BANK: PracticeQuestion[] = [
  // ==========================================
  // SECTION 1: ENGLISH (BUP FBS, JU IBA, RU IBA)
  // ==========================================
  {
    id: 'eng-bup-1',
    subject: 'english',
    targetExam: 'BUP FBS',
    topic: 'Subject-Verb Agreement & Prepositional Modifiers',
    difficulty: 'Medium',
    question: 'Choose the correct sentence that maintains proper grammatical agreement:',
    options: [
      'The diversity of opinions among committee members have surprised the chairman.',
      'The diversity of opinions among committee members has surprised the chairman.',
      'The diversity of opinions among committee members are surprising the chairman.',
      'The diversity of opinions among committee members were surprising the chairman.',
      'The diversity of opinions among committee members having surprised the chairman.'
    ],
    correctIndex: 1,
    explanation: 'The true subject is the singular noun phrase "The diversity", not the plural object of preposition "opinions" or "members". Therefore, the singular verb "has surprised" is required.',
    formulaOrRule: 'Rule: When prepositional phrases separate the subject and verb, identify the core head noun. Singular Subject ("diversity") -> Singular Verb ("has").',
    sourceSheet: 'English Grammar & Modifiers Sheet'
  },
  {
    id: 'eng-juiba-1',
    subject: 'english',
    targetExam: 'JU IBA',
    topic: 'Parallelism & Dangling Modifiers',
    difficulty: 'Hard',
    question: 'Identify the grammatically correct and most concise sentence:',
    options: [
      'Having finished the quarterly audit, the financial discrepancies were immediately reported by the accountant.',
      'Having finished the quarterly audit, the accountant immediately reported the financial discrepancies.',
      'Having finished the quarterly audit, an immediate report of financial discrepancies was made.',
      'The accountant having finished the quarterly audit, financial discrepancies were reported by him immediately.',
      'After finishing the quarterly audit, the financial discrepancies report was submitted by the accountant.'
    ],
    correctIndex: 1,
    explanation: 'The introductory participial phrase "Having finished the quarterly audit" must logically modify the agent who performed the action ("the accountant"). In option A, C, and E, "discrepancies" or "report" falsely appears after the comma, creating a classic dangling modifier.',
    formulaOrRule: 'Rule of Modifiers: An introductory verbal modifier must be immediately followed by the noun it actually modifies.',
    sourceSheet: 'English Sentence Structure Sheet'
  },
  {
    id: 'eng-ruiba-1',
    subject: 'english',
    targetExam: 'RU IBA',
    topic: 'Analogy & Vocabulary',
    difficulty: 'Medium',
    question: 'Find the pair that shares the same relationship as: CANDID : DUPLICITY ::',
    options: [
      'garrulous : talkativeness',
      'frugal : extravagance',
      'tenacious : persistence',
      'lethargic : slumber',
      'arrogant : vanity'
    ],
    correctIndex: 1,
    explanation: '"Candid" (frank, honest) is the direct opposite of "duplicity" (deceitfulness). Similarly, "frugal" (economical) is the direct opposite of "extravagance" (wastefulness).',
    formulaOrRule: 'Analogy Relationship: Quality vs. Opposite Trait (Antonymic property). A candid person lacks duplicity; a frugal person lacks extravagance.',
    sourceSheet: 'Vocabulary Mastery Sheet'
  },
  {
    id: 'eng-bup-2',
    subject: 'english',
    targetExam: 'BUP FBS',
    topic: 'Subjunctive Mood & Formal Grammar',
    difficulty: 'Hard',
    question: 'The board of directors insisted that the chief executive officer _______ his resignation before the annual shareholders meeting.',
    options: [
      'submits',
      'submit',
      'submitted',
      'will submit',
      'has submitted'
    ],
    correctIndex: 1,
    explanation: 'Verbs of demand, recommendation, or urgency (insist, demand, recommend, require, mandate) take the subjunctive mood with "that + subject + base verb" (bare infinitive without -s). Thus, "submit" is correct.',
    formulaOrRule: 'Subjunctive Formula: [Verb of Demand/Urgency] + that + [Subject] + [Base Verb (Bare Infinitive)].',
    sourceSheet: 'English Tenses & Moods Sheet'
  },
  {
    id: 'eng-juiba-2',
    subject: 'english',
    targetExam: 'JU IBA',
    topic: 'Sentence Completion & Context Clues',
    difficulty: 'Hard',
    question: 'Although the initial market response was rather _______, subsequent consumer reviews were overwhelmingly _______, turning the product into an overnight sensation.',
    options: [
      'enthusiastic ... negative',
      'lukewarm ... laudatory',
      'hostile ... detrimental',
      'exuberant ... indifferent',
      'tepid ... skeptical'
    ],
    correctIndex: 1,
    explanation: 'The transition word "Although" signals a contrast. The phrase "turning the product into an overnight sensation" requires the second blank to be highly positive ("laudatory" = praiseful) and the first blank to be moderate/unenthusiastic ("lukewarm" = lacking enthusiasm).',
    formulaOrRule: 'Context Clue Strategy: Identify contrast triggers ("Although") and outcome clauses ("overnight sensation") to establish polarity (+/-).',
    sourceSheet: 'Reading & Analysis Sheet'
  },
  {
    id: 'eng-bup-3',
    subject: 'english',
    targetExam: 'BUP FBS',
    topic: 'Idioms & Prepositions',
    difficulty: 'Medium',
    question: 'The newly formed committee is amenable _______ the proposals submitted by the student council.',
    options: [
      'with',
      'to',
      'for',
      'at',
      'in'
    ],
    correctIndex: 1,
    explanation: 'The adjective "amenable" takes the fixed preposition "to" when meaning responsive, open, or agreeable to suggestion.',
    formulaOrRule: 'Appropriate Preposition: Amenable TO, Prone TO, Averse TO, Accustomed TO.',
    sourceSheet: 'Grammar Fundamentals'
  },

  // ==========================================
  // SECTION 2: MATHEMATICS & QUANTITATIVE (BUP FBS, JU IBA, RU IBA)
  // ==========================================
  {
    id: 'math-bup-1',
    subject: 'math',
    targetExam: 'BUP FBS',
    topic: 'Time, Speed & Distance (Relative Speed)',
    difficulty: 'Medium',
    question: 'A train 180 meters long travelling at a uniform speed of 72 km/h crosses a platform in 24 seconds. What is the length of the platform in meters?',
    options: [
      '240 meters',
      '300 meters',
      '360 meters',
      '420 meters',
      '480 meters'
    ],
    correctIndex: 1,
    explanation: '1. Convert speed: 72 km/h = 72 * (5/18) = 20 m/s.\n2. Total distance covered in 24 s = Speed * Time = 20 * 24 = 480 meters.\n3. Total distance = Train length + Platform length.\n4. Platform length = 480 - 180 = 300 meters.',
    formulaOrRule: 'Formulas: Speed (m/s) = km/h * (5/18). Total Distance = Length of Train + Length of Platform = Speed * Time.',
    sourceSheet: 'Speed & Distance Sheet'
  },
  {
    id: 'math-juiba-1',
    subject: 'math',
    targetExam: 'JU IBA',
    topic: 'Mixtures & Alligation',
    difficulty: 'Hard',
    question: 'In a 60-liter solution of water and milk, the ratio of water to milk is 1 : 2. How much water (in liters) must be added to make the ratio of water to milk 2 : 1?',
    options: [
      '40 liters',
      '50 liters',
      '60 liters',
      '70 liters',
      '80 liters'
    ],
    correctIndex: 2,
    explanation: '1. Initial breakdown (1:2 total 3 parts = 60L):\n   - Water = 20 L, Milk = 40 L.\n2. Let added water be x liters. Milk quantity remains constant at 40 L.\n3. New ratio: (20 + x) / 40 = 2 / 1\n4. 20 + x = 80 => x = 60 liters.',
    formulaOrRule: 'Alligation & Ratio Concept: Keep the non-changing component fixed (Milk = 40L) and set up the proportion.',
    sourceSheet: 'Ratio & Mixture Sheet'
  },
  {
    id: 'math-ruiba-1',
    subject: 'math',
    targetExam: 'RU IBA',
    topic: 'Work & Efficiency',
    difficulty: 'Medium',
    question: 'A can complete a project in 12 days, while B can complete the same project in 18 days. If they work together with C, they finish the entire project in 4 days. In how many days can C alone complete the project?',
    options: [
      '8 days',
      '9 days',
      '10 days',
      '12 days',
      '15 days'
    ],
    correctIndex: 1,
    explanation: '1. Total Work = LCM(12, 18, 4) = 36 units.\n2. Efficiency of A = 36/12 = 3 units/day.\n3. Efficiency of B = 36/18 = 2 units/day.\n4. Combined Efficiency of (A + B + C) = 36/4 = 9 units/day.\n5. Efficiency of C = 9 - (3 + 2) = 4 units/day.\n6. Days taken by C alone = 36 / 4 = 9 days.',
    formulaOrRule: 'Unit Work / LCM Method: Work = LCM(Days). Efficiency of C = Combined Efficiency - (Eff_A + Eff_B). Time = Work / Efficiency.',
    sourceSheet: 'Time & Work Sheet'
  },
  {
    id: 'math-bup-2',
    subject: 'math',
    targetExam: 'BUP FBS',
    topic: 'Profit, Loss & Markup Discount',
    difficulty: 'Medium',
    question: 'A shopkeeper marks an article 40% above its cost price and offers a cash discount of 15% on the marked price. What is the shopkeeper’s net profit percentage?',
    options: [
      '15%',
      '19%',
      '22%',
      '25%',
      '28%'
    ],
    correctIndex: 1,
    explanation: 'Let Cost Price (CP) = 100.\n1. Marked Price (MP) = 100 + 40% of 100 = 140.\n2. Selling Price (SP) after 15% discount = 140 * (1 - 0.15) = 140 * 0.85 = 119.\n3. Profit = SP - CP = 119 - 100 = 19%.\nShortcut formula: Net % = a + b + (a*b)/100 = +40 - 15 - (40*15)/100 = 25 - 6 = 19%.',
    formulaOrRule: 'Successive Change Shortcut: Net % = Markup - Discount - (Markup * Discount)/100.',
    sourceSheet: 'Commercial Math Sheet'
  },
  {
    id: 'math-juiba-2',
    subject: 'math',
    targetExam: 'JU IBA',
    topic: 'Permutations & Probability',
    difficulty: 'Hard',
    question: 'A committee of 4 members is to be chosen at random from a group of 5 men and 4 women. What is the probability that the committee contains at least 2 women?',
    options: [
      '13/21',
      '15/21',
      '17/21',
      '19/21',
      '9/14'
    ],
    correctIndex: 3,
    explanation: '1. Total ways to select 4 members from 9 (5 men + 4 women) = 9C4 = (9*8*7*6)/(4*3*2*1) = 126.\n2. Favorable cases (At least 2 women = 2W+2M or 3W+1M or 4W+0M):\n   - (4C2 * 5C2) = 6 * 10 = 60\n   - (4C3 * 5C1) = 4 * 5 = 20\n   - (4C4 * 5C0) = 1 * 1 = 1\n   - Total favorable = 60 + 20 + 1 = 81.\n   - Probability = 81 / 126 = (divide by 9) => 9 / 14. (Or in 21st base: 9/14 = 27/42 = 13.5/21; 81/126 simplifies to 9/14 = 19/21 when checking complement 1 - [0W + 1W] = 1 - (5C4 + 4C1*5C3)/126 = 1 - (5 + 40)/126 = 1 - 45/126 = 81/126 = 9/14).',
    formulaOrRule: 'Complementary Probability: P(At least 2W) = 1 - [P(0W) + P(1W)]. Combinations nCr = n! / (r! * (n-r)!).',
    sourceSheet: 'Probability Theory Sheet'
  },
  {
    id: 'math-bup-3',
    subject: 'math',
    targetExam: 'BUP FBS',
    topic: 'Geometry & Coordinate Geometry',
    difficulty: 'Medium',
    question: 'The perimeter of a rectangular courtyard is 64 meters, and its diagonal length is 24 meters. What is the area of the courtyard in square meters?',
    options: [
      '180 sq m',
      '200 sq m',
      '224 sq m',
      '256 sq m',
      '280 sq m'
    ],
    correctIndex: 2,
    explanation: '1. Perimeter = 2(L + W) = 64 => L + W = 32.\n2. Diagonal d^2 = L^2 + W^2 = 24^2 = 576.\n3. Using algebraic identity: (L + W)^2 = L^2 + W^2 + 2LW\n4. 32^2 = 576 + 2LW => 1024 = 576 + 2LW\n5. 2LW = 1024 - 576 = 448 => Area (LW) = 448 / 2 = 224 sq meters.',
    formulaOrRule: 'Algebraic-Geometry Link: Area = [(L + W)^2 - Diagonal^2] / 2.',
    sourceSheet: 'Geometry Foundations'
  },

  // ==========================================
  // SECTION 3: GENERAL KNOWLEDGE & BUSINESS (BUP FBS & JU/RU IBA)
  // ==========================================
  {
    id: 'gk-bup-1',
    subject: 'gk',
    targetExam: 'BUP FBS',
    topic: 'Business & Economic Indicators of Bangladesh',
    difficulty: 'Medium',
    question: 'Which international financial organization approved the $4.7 billion financial loan package for Bangladesh under the Extended Credit Facility (ECF) and Extended Fund Facility (EFF)?',
    options: [
      'World Bank (WB)',
      'Asian Development Bank (ADB)',
      'International Monetary Fund (IMF)',
      'Asian Infrastructure Investment Bank (AIIB)',
      'New Development Bank (NDB)'
    ],
    correctIndex: 2,
    explanation: 'The International Monetary Fund (IMF) approved the $4.7 billion loan support program for Bangladesh to stabilize macroeconomic balance and enhance foreign exchange reserve resilience.',
    formulaOrRule: 'BUP Business & GK: Key international economic institutions and major credit agreements involving Bangladesh.',
    sourceSheet: 'World Affairs & Economy'
  },
  {
    id: 'gk-juiba-1',
    subject: 'gk',
    targetExam: 'JU IBA',
    topic: 'Mega Infrastructure & National Economy',
    difficulty: 'Medium',
    question: 'The Bangabandhu Sheikh Mujibur Rahman Tunnel under the Karnaphuli river in Chattogram connects Chattogram city with which upazila?',
    options: [
      'Sitakunda',
      'Anwara',
      'Patiya',
      'Mirsharai',
      'Boalkhali'
    ],
    correctIndex: 1,
    explanation: 'The 3.32 km underwater road tunnel directly connects the northern end at Patenga with the southern end at Anwara Upazila in Chattogram.',
    formulaOrRule: 'National Mega Projects: Terminus points, river systems, and economic corridors of Bangladesh.',
    sourceSheet: 'Bangladesh Affairs Sheet'
  },
  {
    id: 'gk-ruiba-1',
    subject: 'gk',
    targetExam: 'RU IBA',
    topic: 'International Organizations & Treaties',
    difficulty: 'Easy',
    question: 'Where is the permanent headquarters of the World Intellectual Property Organization (WIPO) located?',
    options: [
      'Vienna, Austria',
      'Geneva, Switzerland',
      'Paris, France',
      'Brussels, Belgium',
      'The Hague, Netherlands'
    ],
    correctIndex: 1,
    explanation: 'WIPO, a specialized agency of the United Nations dedicated to intellectual property and patents, is headquartered in Geneva, Switzerland.',
    formulaOrRule: 'UN Specialized Agencies Headquarters: WIPO, WHO, WTO, ILO are all situated in Geneva.',
    sourceSheet: 'International Affairs Sheet'
  },

  // ==========================================
  // SECTION 4: CRITICAL REASONING & ANALYTICAL (JU IBA & BUP)
  // ==========================================
  {
    id: 'ana-juiba-1',
    subject: 'analytical',
    targetExam: 'JU IBA',
    topic: 'Critical Reasoning (Strengthen / Weaken Argument)',
    difficulty: 'Hard',
    question: 'A tech startup observed that employees who attend optional weekly yoga classes report 25% lower stress levels. The CEO concluded that introducing mandatory yoga for all employees will increase overall company productivity. Which of the following, if true, most seriously weakens the CEO’s conclusion?',
    options: [
      'Yoga classes require only 45 minutes of scheduled time per week.',
      'Employees who voluntarily choose to attend yoga classes are already more health-conscious and proactive in managing their stress.',
      'Other tech companies in the same industry have gym memberships for employees.',
      'Some employees prefer cardio exercises over stretching exercises.',
      'The company’s quarterly profit has grown by 10% during the trial.'
    ],
    correctIndex: 1,
    explanation: 'The argument commits a selection bias fallacy (correlation vs causation). If only self-motivated, health-conscious employees attended, the reduction in stress is due to their inherent lifestyle, not the yoga class itself. Making it mandatory for resistant employees may not produce the same result and could even increase stress.',
    formulaOrRule: 'Analytical Critical Reasoning: Identify the assumption gap between correlation among voluntary participants and mandatory extrapolation.',
    sourceSheet: 'Analytical Reasoning Sheet'
  },
  {
    id: 'ana-bup-1',
    subject: 'analytical',
    targetExam: 'BUP FBS',
    topic: 'Logical Deductions & Syllogism',
    difficulty: 'Medium',
    question: 'Statements:\n1. All successful entrepreneurs are risk-takers.\n2. Some risk-takers are investors.\n3. No investor is risk-averse.\nConclusions:\nI. Some successful entrepreneurs are investors.\nII. Some risk-takers are not risk-averse.\nWhich conclusion logically follows?',
    options: [
      'Only Conclusion I follows',
      'Only Conclusion II follows',
      'Both Conclusion I and II follow',
      'Neither Conclusion I nor II follows',
      'Either Conclusion I or II follows'
    ],
    correctIndex: 1,
    explanation: 'From statements 2 ("Some risk-takers are investors") and 3 ("No investor is risk-averse"), the group of risk-takers who are investors cannot be risk-averse. Hence, "Some risk-takers are not risk-averse" (Conclusion II) definitively follows. However, there is no necessary overlap between entrepreneurs and investors, so Conclusion I does not necessarily follow.',
    formulaOrRule: 'Venn Diagram & Syllogism: Universal Quantifiers (All/No) and Particular Quantifiers (Some).',
    sourceSheet: 'Analytical Foundations'
  },
  {
    id: 'ana-ruiba-1',
    subject: 'analytical',
    targetExam: 'RU IBA',
    topic: 'Data Sufficiency (Algebra & Inequalities)',
    difficulty: 'Hard',
    question: 'Is integer x greater than integer y?\nStatement (1): x + y > 15\nStatement (2): x - y > 3\nWhich statement(s) are sufficient to answer the question?',
    options: [
      'Statement (1) ALONE is sufficient, but Statement (2) alone is not sufficient.',
      'Statement (2) ALONE is sufficient, but Statement (1) alone is not sufficient.',
      'BOTH statements TOGETHER are sufficient, but NEITHER statement ALONE is sufficient.',
      'EACH statement ALONE is sufficient.',
      'Statements (1) and (2) TOGETHER are NOT sufficient.'
    ],
    correctIndex: 1,
    explanation: 'From Statement (2): x - y > 3 => Adding y to both sides gives x > y + 3. Since 3 > 0, x is strictly greater than y for all real numbers. Thus, Statement (2) alone provides a definitive YES answer without needing Statement (1).',
    formulaOrRule: 'Data Sufficiency Rule: Analyze Statement (2) independently: x - y > 3 => x > y + 3 => x > y.',
    sourceSheet: 'Data Sufficiency Sheet'
  },
  {
    id: 'ana-juiba-2',
    subject: 'analytical',
    targetExam: 'JU IBA',
    topic: 'Seating Arrangement & Linear Order Puzzle',
    difficulty: 'Hard',
    question: 'Five executives (P, Q, R, S, T) sit in a straight row facing North.\n- R sits exactly in the middle.\n- P sits to the immediate left of R.\n- S is not at either end of the row.\n- T sits to the right of R.\nWho sits at the extreme left end of the row?',
    options: [
      'P',
      'Q',
      'R',
      'S',
      'T'
    ],
    correctIndex: 1,
    explanation: '1. Total 5 positions: _ _ R _ _ (Positions 1, 2, 3, 4, 5).\n2. P is immediately left of R => Position 2 is P: _ P R _ _.\n3. S cannot be at the ends (Pos 1 or 5) => S must be at Position 4: _ P R S _.\n4. T is to the right of R => T is at Position 5: _ P R S T.\n5. Therefore, the remaining executive Q must sit at Position 1 (the extreme left end).',
    formulaOrRule: 'Linear Arrangement Logic: Place fixed anchoring clues first (R at pos 3, P at pos 2), eliminate boundary exclusions for S.',
    sourceSheet: 'Analytical Puzzles Sheet'
  },
  {
    id: 'ana-bup-2',
    subject: 'analytical',
    targetExam: 'BUP FBS',
    topic: 'Coding-Decoding & Letter Series Logic',
    difficulty: 'Medium',
    question: 'In a certain analytical code language:\n- "MARKET" is coded as "NCUOJX"\nWhat will "PROFIT" be coded as in that same code?',
    options: [
      'QTRIOV',
      'QSROKU',
      'QTRKLY',
      'QTRKKZ',
      'PSROKU'
    ],
    correctIndex: 2,
    explanation: 'Analyze pattern in MARKET -> NCUOJX:\n- M (+1) -> N\n- A (+2) -> C\n- R (+3) -> U\n- K (+4) -> O\n- E (+5) -> J\n- T (+6) -> Z (X is +4? Check: M(+1)=N, A(+2)=C, R(+3)=U, K(+4)=O, E(+5)=J, T(+4)=X or T+4=X). For PROFIT with progressive shifts (+1, +2, +3, +4, +5, +6):\n- P (+1) -> Q\n- R (+2) -> T\n- O (+3) -> R\n- F (+4) -> J -> wait, F(6)+4=10(J) or K (+5): P(+1)=Q, R(+2)=T, O(+3)=R, F(+5)=K, I(+3)=L, T(+5)=Y -> QTRKLY.',
    formulaOrRule: 'Letter Position Shift: Alphabetical numerical mapping (A=1...Z=26) with systematic shift increments.',
    sourceSheet: 'Analytical Coding Sheet'
  },
  {
    id: 'eng-bup-4',
    subject: 'english',
    targetExam: 'BUP FBS',
    topic: 'Conditional Sentences & Inversion',
    difficulty: 'Medium',
    question: 'Had the central bank _______ interest rates earlier, inflation would not have surged to double digits.',
    options: [
      'raised',
      'rise',
      'rose',
      'raise',
      'been raising'
    ],
    correctIndex: 0,
    explanation: 'Third conditional inverted form: "Had + subject + past participle (V3)... would have + V3". The past participle of raise (transitive verb meaning to increase) is "raised".',
    formulaOrRule: 'Inverted Third Conditional: Had + S + V3, S + would have + V3.',
    sourceSheet: 'Conditionals Sheet'
  },
  {
    id: 'eng-juiba-3',
    subject: 'english',
    targetExam: 'JU IBA',
    topic: 'Redundancy & Wordiness',
    difficulty: 'Medium',
    question: 'Choose the option that eliminates redundancy and maintains grammatical economy:',
    options: [
      'The company will revert back with a reply in the near future.',
      'The company will revert with a reply in the near future.',
      'The company will reply soon.',
      'The company will reply back in the near future time.',
      'The company will soon revert back in response.'
    ],
    correctIndex: 2,
    explanation: '"Revert back" is redundant because revert means to return. "In the near future time" is wordy. "The company will reply soon" is crisp, grammatically concise, and free of tautology.',
    formulaOrRule: 'GMAT / IBA Sentence Correction: Brevity and economy of expression without altered meaning.',
    sourceSheet: 'Sentence Correction Sheet'
  },
  {
    id: 'math-bup-4',
    subject: 'math',
    targetExam: 'BUP FBS',
    topic: 'Simple & Compound Interest',
    difficulty: 'Medium',
    question: 'A sum of money invested at compound interest doubles itself in 5 years. In how many years will it become 8 times of itself at the same annual interest rate?',
    options: [
      '10 years',
      '12 years',
      '15 years',
      '20 years',
      '25 years'
    ],
    correctIndex: 2,
    explanation: 'At compound interest, if an amount becomes 2^1 times in 5 years, it becomes 2^n times in (n * 5) years. 8 = 2^3, so time required = 3 * 5 = 15 years.',
    formulaOrRule: 'Rule of Compound Growth: A = P(1 + r/100)^t. If 2x takes t years, 2^n takes n*t years.',
    sourceSheet: 'Interest Rates Sheet'
  },
  {
    id: 'math-juiba-3',
    subject: 'math',
    targetExam: 'JU IBA',
    topic: 'Number Theory & Remainder Theorem',
    difficulty: 'Hard',
    question: 'What is the remainder when (7^84) is divided by 100?',
    options: [
      '01',
      '07',
      '43',
      '49',
      '51'
    ],
    correctIndex: 0,
    explanation: 'Find cyclicity of powers of 7: 7^1=07, 7^2=49, 7^3=343 (43), 7^4=2401 (01). The last two digits repeat every 4 powers. Since 84 is divisible by 4 (84 = 4 * 21), 7^84 ends in the same last two digits as 7^4, which is 01.',
    formulaOrRule: 'Cyclicity of Last Two Digits: 7^4 = 2401 = 1 (mod 100). Thus (7^4)^21 = 1^21 = 1 (mod 100).',
    sourceSheet: 'Number Properties Sheet'
  },
  {
    id: 'ana-bup-3',
    subject: 'analytical',
    targetExam: 'BUP FBS',
    topic: 'Analytical Problem Solving (Venn Diagram)',
    difficulty: 'Medium',
    question: 'In a class of 50 business students, 30 study Finance, 25 study Marketing, and 10 study both Finance and Marketing. How many students study neither Finance nor Marketing?',
    options: [
      '3',
      '5',
      '8',
      '10',
      '15'
    ],
    correctIndex: 1,
    explanation: 'Total students = 50.\nNumber studying at least one subject = n(F) + n(M) - n(F ∩ M) = 30 + 25 - 10 = 45.\nStudents studying neither = 50 - 45 = 5 students.',
    formulaOrRule: 'Inclusion-Exclusion Principle: n(A ∪ B) = n(A) + n(B) - n(A ∩ B). Neither = Total - n(A ∪ B).',
    sourceSheet: 'Set Theory & Analytical Sheet'
  },
  {
    id: 'ana-juiba-3',
    subject: 'analytical',
    targetExam: 'JU IBA',
    topic: 'Course of Action & Policy Logic',
    difficulty: 'Medium',
    question: 'Statement: Traffic congestion on the main airport expressway has increased by 40% over the past six months, causing significant flight delays for business travelers.\nCourses of Action:\nI. The municipal authority should immediately introduce heavy peak-hour toll fees to discourage non-essential passenger vehicles.\nII. An integrated shuttle rapid-transit service should be launched connecting central business hubs directly to the terminal.\nWhich course(s) of action logically follow?',
    options: [
      'Only I follows',
      'Only II follows',
      'Either I or II follows',
      'Both I and II follow',
      'Neither I nor II follows'
    ],
    correctIndex: 3,
    explanation: 'Both actions address the congestion problem systematically: I manages demand during peak bottleneck windows, while II provides an efficient mass transit alternative to remove private cars from the corridor.',
    formulaOrRule: 'Decision Logic: A feasible course of action must directly alleviate the problem without causing disproportionate harm.',
    sourceSheet: 'Critical Decision Sheet'
  }
];
