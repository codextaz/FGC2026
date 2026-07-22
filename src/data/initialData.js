export const VENUE_INFO = {
  name: "EVO Nketa 7 FGC Championship 2026",
  address: "2909 Nketa 7, Bulawayo",
  startDate: "2026-08-05",
  formattedDate: "August 5th - 7th, 2026",
  ecoCashNumber: "0778 614 213",
  ecoCashName: "Tasneem Kamwendo",
  ecoCashCode: "*151*2*2*0778614213*",
  entryFee: 5,
  practiceFeePerDay: 1,
  cashPrize: "$25",
  prizeDistribution: {
    first: "$15 (1st Place)",
    second: "$7 (2nd Place)",
    third: "$3 (3rd Place)"
  }
};

export const GAMES = [
  {
    id: "dbz",
    name: "Dragon Ball FighterZ",
    subtitle: "3v3 Tag Team Super-Saiyan Action",
    date: "August 5, 2026",
    time: "10:00 AM CAT",
    maxSpots: 15,
    genre: "Anime / 3v3 Tag",
    platform: "PS4 Pro / PC",
    color: "#ff5e00",
    gradient: "linear-gradient(135deg, #ff5e00 0%, #ff9900 100%)",
    bgClass: "game-dbz",
    rules: ["Double Elimination", "Best of 3 Games", "Finals Best of 5", "Default handicap 100%"],
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "guilty-gear",
    name: "Guilty Gear Strive",
    subtitle: "Heaven or Hell! High-Octane Anime Fighter",
    date: "August 6, 2026",
    time: "10:00 AM CAT",
    maxSpots: 15,
    genre: "2D Fighting",
    platform: "PS4 Pro / PC",
    color: "#e60039",
    gradient: "linear-gradient(135deg, #e60039 0%, #ff3366 100%)",
    bgClass: "game-gg",
    rules: ["Double Elimination", "Best of 3 Rounds", "Finals Best of 5", "Stage: Auto Select"],
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "tekken7",
    name: "Tekken 7",
    subtitle: "3D Martial Arts Arena Showdown",
    date: "August 7, 2026",
    time: "10:00 AM CAT",
    maxSpots: 15,
    genre: "3D Fighting",
    platform: "PS4 Pro / PC",
    color: "#00d2ff",
    gradient: "linear-gradient(135deg, #00d2ff 0%, #0072ff 100%)",
    bgClass: "game-tekken",
    rules: ["Double Elimination", "3/5 Rounds per Game", "Best of 3 Games", "Random Stage Select"],
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80"
  }
];

export const PRACTICE_DAYS = [
  { id: "2026-07-28", label: "Tue, Jul 28", time: "2:00 PM - 6:00 PM" },
  { id: "2026-07-29", label: "Wed, Jul 29", time: "2:00 PM - 6:00 PM" },
  { id: "2026-07-30", label: "Thu, Jul 30", time: "2:00 PM - 6:00 PM" },
  { id: "2026-07-31", label: "Fri, Jul 31", time: "2:00 PM - 6:00 PM" },
  { id: "2026-08-01", label: "Sat, Aug 01", time: "11:00 AM - 5:00 PM" },
  { id: "2026-08-02", label: "Sun, Aug 02", time: "1:00 PM - 5:00 PM" },
  { id: "2026-08-03", label: "Mon, Aug 03", time: "2:00 PM - 6:00 PM" },
  { id: "2026-08-04", label: "Tue, Aug 04", time: "2:00 PM - 7:00 PM (Final Warmup)" }
];

export const INITIAL_PLAYERS = [
  {
    id: "EVO-2026-001",
    gamerTag: "ShadowStriker",
    fullName: "Kelvin Ndlovu",
    phone: "0771 234 567",
    gameId: "dbz",
    practiceDates: ["2026-07-30", "2026-08-03", "2026-08-04"],
    totalFee: 8,
    ecoRef: "MP260722.1402.A12345",
    status: "Verified",
    registeredAt: "2026-07-20T10:15:00Z"
  },
  {
    id: "EVO-2026-002",
    gamerTag: "KazuyaKing",
    fullName: "Tinashe Moyo",
    phone: "0772 987 654",
    gameId: "tekken7",
    practiceDates: ["2026-08-01", "2026-08-02"],
    totalFee: 7,
    ecoRef: "MP260721.0911.B88219",
    status: "Verified",
    registeredAt: "2026-07-21T14:30:00Z"
  },
  {
    id: "EVO-2026-003",
    gamerTag: "SolBadguy_ZW",
    fullName: "Bheki Sibanda",
    phone: "0773 456 789",
    gameId: "guilty-gear",
    practiceDates: ["2026-08-04"],
    totalFee: 6,
    ecoRef: "MP260722.0830.C99120",
    status: "Verified",
    registeredAt: "2026-07-22T08:30:00Z"
  },
  {
    id: "EVO-2026-004",
    gamerTag: "CellGamesPro",
    fullName: "Farai Mpofu",
    phone: "0774 112 233",
    gameId: "dbz",
    practiceDates: [],
    totalFee: 5,
    ecoRef: "MP260722.1105.D77321",
    status: "Verified",
    registeredAt: "2026-07-22T11:05:00Z"
  },
  {
    id: "EVO-2026-005",
    gamerTag: "MishimaPower",
    fullName: "Bongani Dube",
    phone: "0775 667 788",
    gameId: "tekken7",
    practiceDates: ["2026-07-28", "2026-07-29", "2026-07-30", "2026-07-31"],
    totalFee: 9,
    ecoRef: "MP260722.1240.E44100",
    status: "Pending",
    registeredAt: "2026-07-22T12:40:00Z"
  }
];

export const INITIAL_BRACKETS = {
  "dbz": [
    { matchId: 1, round: "Quarter-Finals", player1: "ShadowStriker", player2: "CellGamesPro", score1: 0, score2: 0, winner: null },
    { matchId: 2, round: "Quarter-Finals", player1: "GohanMain", player2: "VegetaPrince", score1: 0, score2: 0, winner: null },
    { matchId: 3, round: "Quarter-Finals", player1: "TrunksSlash", player2: "BrolySmash", score1: 0, score2: 0, winner: null },
    { matchId: 4, round: "Quarter-Finals", player1: "PiccoloGod", player2: "BYE (Seed 1)", score1: 2, score2: 0, winner: "PiccoloGod" },
    { matchId: 5, round: "Semi-Finals", player1: "TBD", player2: "TBD", score1: 0, score2: 0, winner: null },
    { matchId: 6, round: "Semi-Finals", player1: "PiccoloGod", player2: "TBD", score1: 0, score2: 0, winner: null },
    { matchId: 7, round: "Grand Final", player1: "TBD", player2: "TBD", score1: 0, score2: 0, winner: null }
  ],
  "guilty-gear": [
    { matchId: 1, round: "Quarter-Finals", player1: "SolBadguy_ZW", player2: "KyKiske", score1: 0, score2: 0, winner: null },
    { matchId: 2, round: "Quarter-Finals", player1: "MayAnchor", player2: "Nagoriyuki", score1: 0, score2: 0, winner: null },
    { matchId: 3, round: "Quarter-Finals", player1: "Ramlethal", player2: "HappyChaos", score1: 0, score2: 0, winner: null },
    { matchId: 4, round: "Quarter-Finals", player1: "PotemkinBuster", player2: "BYE", score1: 2, score2: 0, winner: "PotemkinBuster" },
    { matchId: 5, round: "Semi-Finals", player1: "TBD", player2: "TBD", score1: 0, score2: 0, winner: null },
    { matchId: 6, round: "Semi-Finals", player1: "PotemkinBuster", player2: "TBD", score1: 0, score2: 0, winner: null },
    { matchId: 7, round: "Grand Final", player1: "TBD", player2: "TBD", score1: 0, score2: 0, winner: null }
  ],
  "tekken7": [
    { matchId: 1, round: "Quarter-Finals", player1: "KazuyaKing", player2: "MishimaPower", score1: 0, score2: 0, winner: null },
    { matchId: 2, round: "Quarter-Finals", player1: "BryanFury_ZW", player2: "PaulPhoenix", score1: 0, score2: 0, winner: null },
    { matchId: 3, round: "Quarter-Finals", player1: "JinKazama", player2: "HwoarangRider", score1: 0, score2: 0, winner: null },
    { matchId: 4, round: "Quarter-Finals", player1: "KingGrappler", player2: "BYE", score1: 2, score2: 0, winner: "KingGrappler" },
    { matchId: 5, round: "Semi-Finals", player1: "TBD", player2: "TBD", score1: 0, score2: 0, winner: null },
    { matchId: 6, round: "Semi-Finals", player1: "KingGrappler", player2: "TBD", score1: 0, score2: 0, winner: null },
    { matchId: 7, round: "Grand Final", player1: "TBD", player2: "TBD", score1: 0, score2: 0, winner: null }
  ]
};
