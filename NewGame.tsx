import { useState } from "react";
import { Button } from "@/components/ui/button";
import { teams } from "@/lib/teams";
import { useLocation } from "wouter";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { useGame } from "@/contexts/GameContext";
import { TeamLogo } from "@/components/TeamLogo";
import { getTeamStaticInfo } from "@/lib/teamInfo";
import { 
  User, 
  Globe, 
  Calendar, 
  Flame, 
  Shield, 
  Coins, 
  Award, 
  Trophy, 
  Target, 
  ArrowLeft, 
  ArrowRight, 
  Check,
  Briefcase
} from "lucide-react";

type Language = "pt" | "en";

const translations = {
  pt: {
    title: "Escolha seu Time",
    selectTeam: "Selecione um time para começar",
    start: "Avançar",
    back: "Voltar",
    season: "Temporada 2026",
    coachTitle: "Perfil do Treinador",
    coachSub: "Defina a identidade, estilo de jogo e histórico profissional do seu comandante.",
    coachName: "Nome do Treinador",
    coachNationality: "Nacionalidade",
    coachAge: "Idade",
    coachStyle: "Filosofia de Jogo (DNA)",
    coachFormation: "Esquema Favorito",
    coachBackground: "Licença / Histórico",
    startCareer: "Iniciar Carreira",
    perk: "Atributo Especial",
    perkDesc: "Este histórico dará vantagens permanentes na sua carreira.",
    step1: "Clube",
    step2: "Treinador",
    placeholderName: "Ex: Abel Ferreira",
    offensive: "Ataque Total",
    offensiveDesc: "Pressão alta e transições agressivas com muitos homens na área adversária.",
    tiki_taka: "Tiki-Taka",
    tiki_takaDesc: "Controle absoluto da posse de bola, passes curtos de aproximação e paciência extrema.",
    gegenpressing: "Gegenpressing",
    gegenpressingDesc: "Pressão sufocante e imediata logo após perder a bola para recuperá-la no campo adversário.",
    park_the_bus: "Ferrolho Defensivo",
    park_the_busDesc: "Defesa extremamente compacta em bloco baixo, atraindo o adversário para contra-ataques letais.",
    pro_license: "Licença Pro Continental",
    pro_licenseDesc: "Formação de elite reconhecida mundialmente. Respeito imediato dos atletas (+5 de Moral inicial).",
    ex_player: "Ex-Jogador Internacional",
    ex_playerDesc: "Grande carisma e liderança. O elenco se recupera 30% mais rápido de derrotas e ganha mais moral em vitórias.",
    phys_ed: "Cientista do Esporte",
    phys_edDesc: "Foco no rendimento biológico. Seus atletas ganham +20% de eficiência de recuperação física diária.",
    negotiator: "Negociador Ambicioso",
    negotiatorDesc: "Mestre em finanças. Garante +15% de verba para transferências e maior facilidade para reduzir exigências salariais."
  },
  en: {
    title: "Choose Your Team",
    selectTeam: "Select a team to start",
    start: "Continue",
    back: "Back",
    season: "Season 2026",
    coachTitle: "Create Coach Profile",
    coachSub: "Define your commander's identity, tactical philosophy, and professional background.",
    coachName: "Manager Name",
    coachNationality: "Nationality",
    coachAge: "Age",
    coachStyle: "Tactical Style (DNA)",
    coachFormation: "Favorite Formation",
    coachBackground: "License / Background",
    startCareer: "Start Career",
    perk: "Special Perk",
    perkDesc: "This background gives permanent benefits to your career.",
    step1: "Club",
    step2: "Coach",
    placeholderName: "E.g. Pep Guardiola",
    offensive: "All-Out Attack",
    offensiveDesc: "High pressure and aggressive transitions with multiple men inside the opponent box.",
    tiki_taka: "Tiki-Taka",
    tiki_takaDesc: "Absolute control of possession, short triangular passes, and supreme patience.",
    gegenpressing: "Gegenpressing",
    gegenpressingDesc: "Suffocating immediate counter-press right after losing the ball to win it high up the pitch.",
    park_the_bus: "Park the Bus",
    park_the_busDesc: "Extremely compact defensive low-block, baiting opponents before executing lethal counter-attacks.",
    pro_license: "Continental Pro License",
    pro_licenseDesc: "World-recognized elite credential. Commands immediate dressing room respect (+5 initial Morale).",
    ex_player: "International Ex-Player",
    ex_playerDesc: "Great charisma and leadership. Squad recovers 30% faster from defeats and gets higher morale boost from wins.",
    phys_ed: "Sport Scientist",
    phys_edDesc: "Focus on biological performance. Squad gains +20% daily physical recovery efficiency.",
    negotiator: "Ambitious Negotiator",
    negotiatorDesc: "Financial mastermind. Grants +15% starting transfer budget and makes players accept lower wage demands."
  }
};

const NATIONALITIES = [
  "Brasil", "Portugal", "Argentina", "Espanha", "Itália", "Alemanha", "França", "Inglaterra", "Uruguai"
];

const FORMATIONS = ["4-3-3", "4-4-2", "4-2-3-1", "3-5-2", "5-3-2"];

export default function NewGame() {
  const [language, setLanguage] = useState<Language>("pt");
  const [step, setStep] = useState<'choose_team' | 'create_coach'>('choose_team');
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [, navigate] = useLocation();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { setSelectedTeam, setCoachProfile } = useGame();
  const t = translations[language];

  // Coach creation state variables
  const [coachName, setCoachName] = useState("");
  const [coachNationality, setCoachNationality] = useState("Brasil");
  const [coachAge, setCoachAge] = useState(45);
  const [coachStyle, setCoachStyle] = useState<'tiki_taka' | 'gegenpressing' | 'park_the_bus' | 'offensive'>('offensive');
  const [coachFormation, setCoachFormation] = useState("4-3-3");
  const [coachBackground, setCoachBackground] = useState<'pro_license' | 'ex_player' | 'phys_ed' | 'negotiator'>('pro_license');

  const selectedTeam = teams.find((team) => team.id === selectedTeamId);

  const handleNextStep = () => {
    if (selectedTeam) {
      const staticInfo = getTeamStaticInfo(selectedTeam);
      // Auto pre-populate coach name based on chosen team's real coach, or leave empty/generic
      if (!coachName) {
        setCoachName(staticInfo.coachName || "");
      }
      setCoachFormation(staticInfo.formation || "4-3-3");
      setStep('create_coach');
    }
  };

  const handleStartCareer = () => {
    if (selectedTeam) {
      setCoachProfile({
        name: coachName.trim() || (language === "pt" ? "Treinador Customizado" : "Custom Manager"),
        nationality: coachNationality,
        age: Number(coachAge) || 45,
        tacticalStyle: coachStyle,
        favoriteFormation: coachFormation,
        background: coachBackground,
      });
      setSelectedTeam(selectedTeam);
      navigate("/game");
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isDarkMode ? "bg-gray-950 text-white" : "bg-slate-50 text-slate-900"
    }`}>
      
      {/* Absolute Header Tools */}
      <div className="absolute top-6 right-6 flex items-center gap-3 z-50">
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full border transition-all ${
            isDarkMode
              ? "bg-gray-800 text-yellow-400 border-gray-700 hover:bg-gray-700"
              : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100 shadow-sm"
          }`}
          title="Toggle Theme"
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>
        <div className="flex rounded-md border border-gray-300 dark:border-gray-700 overflow-hidden shadow-sm bg-white dark:bg-gray-800">
          <button
            onClick={() => setLanguage("pt")}
            className={`px-3 py-1.5 text-xs font-bold transition-all ${
              language === "pt"
                ? "bg-indigo-600 text-white"
                : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            PT
          </button>
          <button
            onClick={() => setLanguage("en")}
            className={`px-3 py-1.5 text-xs font-bold transition-all ${
              language === "en"
                ? "bg-indigo-600 text-white"
                : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Progress Wizard Header */}
      <div className={`py-5 border-b flex justify-center items-center gap-8 ${
        isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
            step === 'choose_team' 
              ? "bg-indigo-600 text-white" 
              : "bg-emerald-500 text-white"
          }`}>
            {step === 'choose_team' ? "1" : <Check className="w-4 h-4" />}
          </div>
          <span className={`text-sm font-bold ${step === 'choose_team' ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500"}`}>
            {t.step1}
          </span>
        </div>

        <div className="w-16 h-[2px] bg-slate-300 dark:bg-slate-700"></div>

        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
            step === 'create_coach' 
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" 
              : "bg-slate-200 dark:bg-gray-800 text-gray-500"
          }`}>
            2
          </div>
          <span className={`text-sm font-bold ${step === 'create_coach' ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500"}`}>
            {t.step2}
          </span>
        </div>
      </div>

      {/* STEP 1: Choose Your Team */}
      {step === 'choose_team' && (
        <div className="flex-1 flex flex-col lg:flex-row gap-8 p-8 max-w-7xl mx-auto w-full">
          {/* Teams List */}
          <div className="flex-1 overflow-y-auto pr-2">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">{t.title}</h1>
            <p className={`mb-8 text-sm ${isDarkMode ? "text-gray-400" : "text-slate-500"}`}>{t.selectTeam}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {teams.map((team) => {
                const isSelected = selectedTeamId === team.id;
                return (
                  <button
                    key={team.id}
                    onClick={() => setSelectedTeamId(team.id)}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-between text-center relative overflow-hidden group ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/10 dark:bg-indigo-950/20 shadow-lg shadow-indigo-500/10"
                        : isDarkMode
                        ? "border-gray-800 bg-gray-900/60 hover:border-gray-700 hover:bg-gray-900"
                        : "border-slate-200 bg-white hover:border-slate-400 shadow-sm"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                        <Check className="w-3. h-3" />
                      </div>
                    )}
                    <div className="w-16 h-16 my-2 transform group-hover:scale-105 transition-transform">
                      <TeamLogo teamId={team.id} fallbackName={team.name} />
                    </div>
                    <div className="mt-3">
                      <div className="font-extrabold text-base tracking-tight">{team.abbreviation}</div>
                      <div className={`text-xs mt-0.5 font-medium ${isDarkMode ? "text-gray-400" : "text-slate-500"}`}>{team.name}</div>
                      <div className={`text-[10px] mt-1.5 uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                        isDarkMode ? "bg-gray-800 text-gray-400" : "bg-slate-100 text-slate-500"
                      }`}>{team.city}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Team Details Sidebar */}
          <div className="w-full lg:w-96 flex-shrink-0">
            {selectedTeam ? (
              <div className={`p-6 rounded-2xl border sticky top-8 transition-all ${
                isDarkMode
                  ? "bg-gray-900 border-gray-800 shadow-xl shadow-black/30"
                  : "bg-white border-slate-200 shadow-lg shadow-slate-200/50"
              }`}>
                <div className="flex items-center gap-4 border-b pb-4 mb-5 dark:border-gray-800 border-slate-100">
                  <div className="w-14 h-14">
                    <TeamLogo teamId={selectedTeam.id} fallbackName={selectedTeam.name} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight">{selectedTeam.name}</h2>
                    <p className={`text-xs font-semibold ${isDarkMode ? "text-gray-400" : "text-slate-500"}`}>{selectedTeam.city}</p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mt-1">{t.season}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <span className={`text-xs uppercase font-extrabold tracking-wider ${isDarkMode ? "text-gray-500" : "text-slate-400"}`}>Finanças</span>
                    <div className="font-black text-xl text-emerald-600 dark:text-emerald-400 mt-0.5">
                      R$ {(selectedTeam.balance / 1000).toFixed(1)}M
                    </div>
                  </div>

                  <div>
                    <span className={`text-xs uppercase font-extrabold tracking-wider ${isDarkMode ? "text-gray-500" : "text-slate-400"}`}>Objetivo da Diretoria</span>
                    <p className="text-sm font-semibold mt-0.5 dark:text-gray-300 text-slate-700">{selectedTeam.objective}</p>
                  </div>

                  <div>
                    <span className={`text-xs uppercase font-extrabold tracking-wider ${isDarkMode ? "text-gray-500" : "text-slate-400"}`}>Jogadores Principais</span>
                    <div className="space-y-2 max-h-56 overflow-y-auto mt-2 pr-1 border-t pt-2 dark:border-gray-800 border-slate-100">
                      {selectedTeam.players.slice(0, 10).map((player) => (
                        <div key={player.id} className="text-xs flex justify-between items-center py-1">
                          <span className="font-bold">{player.name}</span>
                          <div className="flex items-center gap-2">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              isDarkMode ? "bg-gray-800 text-gray-300" : "bg-slate-100 text-slate-600"
                            }`}>{player.position}</span>
                            <span className="font-black text-indigo-600 dark:text-indigo-400">{player.overall}</span>
                          </div>
                        </div>
                      ))}
                      <div className={`text-[10px] text-center pt-2 font-bold ${isDarkMode ? "text-gray-400" : "text-slate-500"}`}>
                        + {selectedTeam.players.length - 10} jogadores no elenco
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleNextStep}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
                >
                  <span>{t.start}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className={`p-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center h-80 ${
                isDarkMode ? "border-gray-800 text-gray-500" : "border-slate-300 text-slate-400"
              }`}>
                <Briefcase className="w-12 h-12 mb-3" />
                <p className="font-semibold">{t.selectTeam}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 2: Create Coach Profile */}
      {step === 'create_coach' && (
        <div className="flex-1 flex flex-col lg:flex-row gap-8 p-8 max-w-7xl mx-auto w-full">
          {/* Main Coach Form Panel */}
          <div className="flex-1 space-y-8 pr-2 pb-12">
            <div>
              <button 
                onClick={() => setStep('choose_team')}
                className={`flex items-center gap-1 text-xs font-bold mb-4 uppercase tracking-wider transition-colors hover:text-indigo-600 ${
                  isDarkMode ? "text-gray-400" : "text-slate-500"
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.back}</span>
              </button>
              <h1 className="text-4xl font-extrabold tracking-tight">{t.coachTitle}</h1>
              <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-slate-500"}`}>{t.coachSub}</p>
            </div>

            {/* Part A: Personal Details */}
            <div className={`p-6 rounded-2xl border grid grid-cols-1 md:grid-cols-2 gap-6 ${
              isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className="space-y-1">
                <label className="text-xs font-extrabold uppercase tracking-wider text-indigo-500">{t.coachName}</label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-gray-400"><User className="w-4 h-4" /></span>
                  <input
                    type="text"
                    value={coachName}
                    onChange={(e) => setCoachName(e.target.value)}
                    placeholder={t.placeholderName}
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold ${
                      isDarkMode 
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" 
                        : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-extrabold uppercase tracking-wider text-indigo-500">{t.coachNationality}</label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-gray-400"><Globe className="w-4 h-4" /></span>
                  <select
                    value={coachNationality}
                    onChange={(e) => setCoachNationality(e.target.value)}
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold appearance-none ${
                      isDarkMode 
                        ? "bg-gray-800 border-gray-700 text-white" 
                        : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  >
                    {NATIONALITIES.map((nat) => (
                      <option key={nat} value={nat}>{nat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-extrabold uppercase tracking-wider text-indigo-500">{t.coachAge}</label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-gray-400"><Calendar className="w-4 h-4" /></span>
                  <input
                    type="number"
                    min="30"
                    max="80"
                    value={coachAge}
                    onChange={(e) => setCoachAge(Number(e.target.value))}
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold ${
                      isDarkMode 
                        ? "bg-gray-800 border-gray-700 text-white" 
                        : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-extrabold uppercase tracking-wider text-indigo-500">{t.coachFormation}</label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-gray-400"><Target className="w-4 h-4" /></span>
                  <select
                    value={coachFormation}
                    onChange={(e) => setCoachFormation(e.target.value)}
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold appearance-none ${
                      isDarkMode 
                        ? "bg-gray-800 border-gray-700 text-white" 
                        : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  >
                    {FORMATIONS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Part B: Tactical Style (DNA) */}
            <div className="space-y-3">
              <h3 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
                <Flame className="w-5 h-5 text-indigo-500" />
                <span>{t.coachStyle}</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'offensive', name: t.offensive, desc: t.offensiveDesc, color: "text-amber-500", border: "hover:border-amber-500 active:border-amber-500/20", activeBg: "border-amber-500 bg-amber-500/5" },
                  { id: 'tiki_taka', name: t.tiki_taka, desc: t.tiki_takaDesc, color: "text-sky-500", border: "hover:border-sky-500 active:border-sky-500/20", activeBg: "border-sky-500 bg-sky-500/5" },
                  { id: 'gegenpressing', name: t.gegenpressing, desc: t.gegenpressingDesc, color: "text-purple-500", border: "hover:border-purple-500 active:border-purple-500/20", activeBg: "border-purple-500 bg-purple-500/5" },
                  { id: 'park_the_bus', name: t.park_the_bus, desc: t.park_the_busDesc, color: "text-emerald-500", border: "hover:border-emerald-500 active:border-emerald-500/20", activeBg: "border-emerald-500 bg-emerald-500/5" }
                ].map((style) => {
                  const isSelected = coachStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      onClick={() => setCoachStyle(style.id as any)}
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all relative ${
                        isSelected 
                          ? style.activeBg + " border-2" 
                          : isDarkMode 
                          ? "border-gray-800 bg-gray-900/40 " + style.border 
                          : "border-slate-200 bg-white " + style.border
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                      <div>
                        <div className={`font-black text-sm uppercase tracking-wide flex items-center gap-1.5 ${style.color}`}>
                          <span>{style.name}</span>
                        </div>
                        <p className={`text-xs mt-1.5 leading-relaxed ${isDarkMode ? "text-gray-400" : "text-slate-500"}`}>
                          {style.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Part C: License & Experience */}
            <div className="space-y-3">
              <h3 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-500" />
                <span>{t.coachBackground}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'pro_license', name: t.pro_license, desc: t.pro_licenseDesc, icon: <Trophy className="w-4 h-4 text-amber-500" />, activeBg: "border-amber-500 bg-amber-500/5" },
                  { id: 'ex_player', name: t.ex_player, desc: t.ex_playerDesc, icon: <User className="w-4 h-4 text-sky-500" />, activeBg: "border-sky-500 bg-sky-500/5" },
                  { id: 'phys_ed', name: t.phys_ed, desc: t.phys_edDesc, icon: <Flame className="w-4 h-4 text-emerald-500" />, activeBg: "border-emerald-500 bg-emerald-500/5" },
                  { id: 'negotiator', name: t.negotiator, desc: t.negotiatorDesc, icon: <Coins className="w-4 h-4 text-indigo-500" />, activeBg: "border-indigo-500 bg-indigo-500/5" }
                ].map((bg) => {
                  const isSelected = coachBackground === bg.id;
                  return (
                    <button
                      key={bg.id}
                      onClick={() => setCoachBackground(bg.id as any)}
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all relative hover:border-indigo-500 ${
                        isSelected 
                          ? bg.activeBg + " border-2" 
                          : isDarkMode 
                          ? "border-gray-800 bg-gray-900/40" 
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                      <div>
                        <div className="font-extrabold text-sm flex items-center gap-2 dark:text-white text-slate-900">
                          {bg.icon}
                          <span>{bg.name}</span>
                        </div>
                        <p className={`text-xs mt-1.5 leading-relaxed ${isDarkMode ? "text-gray-400" : "text-slate-500"}`}>
                          {bg.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Coach Creation Summary Sidebar */}
          <div className="w-full lg:w-96 flex-shrink-0">
            {selectedTeam && (
              <div className={`p-6 rounded-2xl border sticky top-8 transition-all flex flex-col justify-between ${
                isDarkMode
                  ? "bg-gray-900 border-gray-800 shadow-xl shadow-black/30"
                  : "bg-white border-slate-200 shadow-lg shadow-slate-200/50"
              }`}>
                <div>
                  <div className="text-center pb-5 border-b dark:border-gray-800 border-slate-100 flex flex-col items-center">
                    <div className="w-16 h-16 mb-2">
                      <TeamLogo teamId={selectedTeam.id} fallbackName={selectedTeam.name} />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight">{selectedTeam.name}</h2>
                    <span className="text-xs font-extrabold uppercase text-indigo-500 mt-1">{t.season}</span>
                  </div>

                  <div className="space-y-4 py-5">
                    <h3 className="text-xs uppercase font-extrabold text-gray-500 tracking-wider">Visualização do Contrato</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm border-b pb-1 dark:border-gray-800 border-slate-100">
                        <span className="text-gray-400 font-bold">{t.coachName}</span>
                        <span className="font-extrabold truncate max-w-[180px]">{coachName.trim() || (language === "pt" ? "Personalizado" : "Custom")}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-b pb-1 dark:border-gray-800 border-slate-100">
                        <span className="text-gray-400 font-bold">{t.coachNationality}</span>
                        <span className="font-extrabold">{coachNationality}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-b pb-1 dark:border-gray-800 border-slate-100">
                        <span className="text-gray-400 font-bold">{t.coachAge}</span>
                        <span className="font-extrabold">{coachAge}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-b pb-1 dark:border-gray-800 border-slate-100">
                        <span className="text-gray-400 font-bold">{t.coachFormation}</span>
                        <span className="font-extrabold">{coachFormation}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <h4 className="text-xs uppercase font-extrabold text-indigo-500 tracking-wider mb-2">{t.perk}</h4>
                      <div className={`p-3 rounded-xl border flex gap-3 items-start ${
                        isDarkMode ? "bg-gray-850 border-gray-800 text-gray-300" : "bg-slate-50 border-slate-150 text-slate-700"
                      }`}>
                        <Shield className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-extrabold text-xs dark:text-white text-slate-800">
                            {coachBackground === 'pro_license' ? t.pro_license : 
                             coachBackground === 'ex_player' ? t.ex_player : 
                             coachBackground === 'phys_ed' ? t.phys_ed : t.negotiator}
                          </div>
                          <p className="text-[10px] mt-1 leading-relaxed">
                            {coachBackground === 'pro_license' ? t.pro_licenseDesc : 
                             coachBackground === 'ex_player' ? t.ex_playerDesc : 
                             coachBackground === 'phys_ed' ? t.phys_edDesc : t.negotiatorDesc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleStartCareer}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold h-12 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 mt-4"
                >
                  <span>{t.startCareer}</span>
                  <Check className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
