import type { Team } from "../src/types";
import { getAICoachName, getAITacticsForTeam } from "./matchEngine";

export interface TeamStaticInfo {
  coachName: string;
  formation: string;
  stadiumName: string;
  stadiumCapacity: number;
  nickname: string;
  founded: number;
  rival: string;
}

const STATIC_TEAMS_MAP: Record<string, Partial<TeamStaticInfo>> = {
  "real madrid": {
    coachName: "Carlo Ancelotti",
    formation: "4-4-2",
    stadiumName: "Estádio Santiago Bernabéu",
    stadiumCapacity: 85000,
    nickname: "Merengues / Los Blancos",
    founded: 1902,
    rival: "Barcelona"
  },
  "barcelona": {
    coachName: "Hansi Flick",
    formation: "4-3-3",
    stadiumName: "Spotify Camp Nou",
    stadiumCapacity: 99354,
    nickname: "Culés / Barça",
    founded: 1899,
    rival: "Real Madrid"
  },
  "manchester city": {
    coachName: "Pep Guardiola",
    formation: "4-3-3",
    stadiumName: "Etihad Stadium",
    stadiumCapacity: 53400,
    nickname: "The Citizens / Sky Blues",
    founded: 1880,
    rival: "Manchester United"
  },
  "man city": {
    coachName: "Pep Guardiola",
    formation: "4-3-3",
    stadiumName: "Etihad Stadium",
    stadiumCapacity: 53400,
    nickname: "The Citizens / Sky Blues",
    founded: 1880,
    rival: "Manchester United"
  },
  "liverpool": {
    coachName: "Arne Slot",
    formation: "4-3-3",
    stadiumName: "Estádio Anfield",
    stadiumCapacity: 61276,
    nickname: "The Reds",
    founded: 1892,
    rival: "Manchester United"
  },
  "arsenal": {
    coachName: "Mikel Arteta",
    formation: "4-3-3",
    stadiumName: "Emirates Stadium",
    stadiumCapacity: 60700,
    nickname: "The Gunners",
    founded: 1886,
    rival: "Tottenham Hotspur"
  },
  "bayern": {
    coachName: "Vincent Kompany",
    formation: "4-2-3-1",
    stadiumName: "Allianz Arena",
    stadiumCapacity: 75000,
    nickname: "Bávaros / Die Roten",
    founded: 1900,
    rival: "Borussia Dortmund"
  },
  "paris saint-germain": {
    coachName: "Luis Enrique",
    formation: "4-3-3",
    stadiumName: "Estádio Parc des Princes",
    stadiumCapacity: 47929,
    nickname: "Les Parisiens / PSG",
    founded: 1970,
    rival: "Olympique de Marseille"
  },
  "psg": {
    coachName: "Luis Enrique",
    formation: "4-3-3",
    stadiumName: "Estádio Parc des Princes",
    stadiumCapacity: 47929,
    nickname: "Les Parisiens / PSG",
    founded: 1970,
    rival: "Olympique de Marseille"
  },
  "inter": {
    coachName: "Simone Inzaghi",
    formation: "3-5-2",
    stadiumName: "Estádio Giuseppe Meazza (San Siro)",
    stadiumCapacity: 80018,
    nickname: "Nerazzurri / Inter de Milão",
    founded: 1908,
    rival: "Milan"
  },
  "milan": {
    coachName: "Paulo Fonseca",
    formation: "4-2-3-1",
    stadiumName: "Estádio San Siro",
    stadiumCapacity: 80018,
    nickname: "Rossoneri / AC Milan",
    founded: 1899,
    rival: "Inter de Milão"
  },
  "juventus": {
    coachName: "Thiago Motta",
    formation: "4-2-3-1",
    stadiumName: "Allianz Stadium",
    stadiumCapacity: 41507,
    nickname: "La Vecchia Signora / Bianconeri",
    founded: 1897,
    rival: "Inter de Milão"
  },
  "chelsea": {
    coachName: "Enzo Maresca",
    formation: "4-2-3-1",
    stadiumName: "Stamford Bridge",
    stadiumCapacity: 40341,
    nickname: "The Blues",
    founded: 1905,
    rival: "Arsenal"
  },
  "manchester united": {
    coachName: "Rúben Amorim",
    formation: "3-4-3",
    stadiumName: "Estádio Old Trafford",
    stadiumCapacity: 74310,
    nickname: "The Red Devils",
    founded: 1878,
    rival: "Manchester City"
  },
  "man united": {
    coachName: "Rúben Amorim",
    formation: "3-4-3",
    stadiumName: "Estádio Old Trafford",
    stadiumCapacity: 74310,
    nickname: "The Red Devils",
    founded: 1878,
    rival: "Manchester City"
  },
  "atlético de madrid": {
    coachName: "Diego Simeone",
    formation: "5-3-2",
    stadiumName: "Estádio Cívitas Metropolitano",
    stadiumCapacity: 70460,
    nickname: "Colchoneros / Atleti",
    founded: 1903,
    rival: "Real Madrid"
  },
  "atletico de madrid": {
    coachName: "Diego Simeone",
    formation: "5-3-2",
    stadiumName: "Estádio Cívitas Metropolitano",
    stadiumCapacity: 70460,
    nickname: "Colchoneros / Atleti",
    founded: 1903,
    rival: "Real Madrid"
  },
  "leverkusen": {
    coachName: "Xabi Alonso",
    formation: "3-4-3",
    stadiumName: "BayArena",
    stadiumCapacity: 30210,
    nickname: "Werkself / Aspirinas",
    founded: 1904,
    rival: "FC Köln"
  },
  "dortmund": {
    coachName: "Nuri Şahin",
    formation: "4-2-3-1",
    stadiumName: "Signal Iduna Park",
    stadiumCapacity: 81365,
    nickname: "Aurinegros / BVB",
    founded: 1909,
    rival: "Schalke 04"
  },
  "palmeiras": {
    coachName: "Abel Ferreira",
    formation: "4-3-3",
    stadiumName: "Allianz Parque",
    stadiumCapacity: 43700,
    nickname: "Verdão / Alviverde",
    founded: 1914,
    rival: "Corinthians"
  },
  "flamengo": {
    coachName: "Filipe Luís",
    formation: "4-2-3-1",
    stadiumName: "Estádio do Maracanã",
    stadiumCapacity: 78838,
    nickname: "Mengão / Rubro-Negro",
    founded: 1895,
    rival: "Vasco da Gama"
  },
  "botafogo": {
    coachName: "Artur Jorge",
    formation: "4-2-3-1",
    stadiumName: "Estádio Nilton Santos",
    stadiumCapacity: 44661,
    nickname: "Fogão / Alvinegro",
    founded: 1904,
    rival: "Flamengo"
  },
  "são paulo": {
    coachName: "Luis Zubeldía",
    formation: "4-2-3-1",
    stadiumName: "Estádio do MorumBIS",
    stadiumCapacity: 66795,
    nickname: "Tricolor Paulista / Soberano",
    founded: 1930,
    rival: "Palmeiras"
  },
  "sao paulo": {
    coachName: "Luis Zubeldía",
    formation: "4-2-3-1",
    stadiumName: "Estádio do MorumBIS",
    stadiumCapacity: 66795,
    nickname: "Tricolor Paulista / Soberano",
    founded: 1930,
    rival: "Palmeiras"
  },
  "corinthians": {
    coachName: "Ramón Díaz",
    formation: "4-4-2",
    stadiumName: "Neo Química Arena",
    stadiumCapacity: 49205,
    nickname: "Timão / Alvinegro",
    founded: 1910,
    rival: "Palmeiras"
  },
  "grêmio": {
    coachName: "Renato Portaluppi",
    formation: "4-2-3-1",
    stadiumName: "Arena do Grêmio",
    stadiumCapacity: 55662,
    nickname: "Imortal / Tricolor Gaúcho",
    founded: 1903,
    rival: "Internacional"
  },
  "gremio": {
    coachName: "Renato Portaluppi",
    formation: "4-2-3-1",
    stadiumName: "Arena do Grêmio",
    stadiumCapacity: 55662,
    nickname: "Imortal / Tricolor Gaúcho",
    founded: 1903,
    rival: "Internacional"
  },
  "internacional": {
    coachName: "Roger Machado",
    formation: "4-2-3-1",
    stadiumName: "Estádio Beira-Rio",
    stadiumCapacity: 50842,
    nickname: "Colorado / Saci",
    founded: 1909,
    rival: "Grêmio"
  },
  "atlético mineiro": {
    coachName: "Gabriel Milito",
    formation: "3-4-3",
    stadiumName: "Arena MRV",
    stadiumCapacity: 44892,
    nickname: "Galo / Alvinegro",
    founded: 1908,
    rival: "Cruzeiro"
  },
  "atletico mineiro": {
    coachName: "Gabriel Milito",
    formation: "3-4-3",
    stadiumName: "Arena MRV",
    stadiumCapacity: 44892,
    nickname: "Galo / Alvinegro",
    founded: 1908,
    rival: "Cruzeiro"
  },
  "cruzeiro": {
    coachName: "Fernando Diniz",
    formation: "4-2-3-1",
    stadiumName: "Estádio do Mineirão",
    stadiumCapacity: 61846,
    nickname: "Raposa / Celeste",
    founded: 1921,
    rival: "Atlético Mineiro"
  },
  "vasco": {
    coachName: "Rafael Paiva",
    formation: "4-3-3",
    stadiumName: "Estádio de São Januário",
    stadiumCapacity: 21880,
    nickname: "Gigante da Colina / Cruzmaltino",
    founded: 1898,
    rival: "Flamengo"
  },
  "fluminense": {
    coachName: "Mano Menezes",
    formation: "4-2-3-1",
    stadiumName: "Estádio do Maracanã",
    stadiumCapacity: 78838,
    nickname: "Tricolor das Laranjeiras",
    founded: 1902,
    rival: "Flamengo"
  },
  "bahia": {
    coachName: "Rogério Ceni",
    formation: "4-4-2-D",
    stadiumName: "Arena Fonte Nova",
    stadiumCapacity: 48000,
    nickname: "Esquadrão de Aço / Tricolor",
    founded: 1931,
    rival: "Vitória"
  },
  "fortaleza": {
    coachName: "Juan Pablo Vojvoda",
    formation: "4-2-3-1",
    stadiumName: "Estádio Castelão",
    stadiumCapacity: 63903,
    nickname: "Leão do Pici / Tricolor de Aço",
    founded: 1918,
    rival: "Ceará"
  }
};

export function getTeamStaticInfo(team: Team, playerCoachName?: string): TeamStaticInfo {
  const normName = team.name.toLowerCase();
  
  // Find match in static database
  let foundKey = Object.keys(STATIC_TEAMS_MAP).find(key => normName.includes(key));
  if (!foundKey) {
    const normAbbr = team.abbreviation.toLowerCase();
    foundKey = Object.keys(STATIC_TEAMS_MAP).find(key => key.includes(normAbbr) || normAbbr.includes(key));
  }

  const staticData = foundKey ? STATIC_TEAMS_MAP[foundKey] : {};

  // Resolve Coach
  const coachName = playerCoachName || staticData.coachName || getAICoachName(team.id);

  // Resolve Formation
  const formation = staticData.formation || getAITacticsForTeam(team).formationName || "4-4-2";

  // Resolve Stadium Name
  let stadiumName = staticData.stadiumName;
  if (!stadiumName) {
    const suffixes = ["Estádio", "Arena", "Parque", "Stadium"];
    const suffix = suffixes[team.id % suffixes.length];
    if (suffix === "Estádio") {
      stadiumName = `Estádio Municipal de ${team.city || team.name}`;
    } else if (suffix === "Arena") {
      stadiumName = `Arena ${team.name}`;
    } else if (suffix === "Parque") {
      stadiumName = `Parque ${team.name}`;
    } else {
      stadiumName = `${team.name} Stadium`;
    }
  }

  // Resolve Stadium Capacity
  let stadiumCapacity = staticData.stadiumCapacity;
  if (!stadiumCapacity) {
    const seed = team.id * 777;
    const baseCap = {
      4: 55000,
      3: 35000,
      2: 15000,
      1: 5000
    }[team.clubLevel] || 15000;
    const offset = Math.floor(Math.abs(Math.sin(seed)) * {
      4: 30000,
      3: 18000,
      2: 15000,
      1: 8000
    }[team.clubLevel || 2]);
    stadiumCapacity = baseCap + offset;
  }

  // Resolve Nickname
  const nickname = staticData.nickname || `O Clube de ${team.city || team.name}`;

  // Resolve Founded
  const founded = staticData.founded || 1900 + (team.id % 120);

  // Resolve Rival
  const rival = staticData.rival || (team.id % 2 === 0 ? "Oponente Local" : "Rival Histórico");

  return {
    coachName,
    formation,
    stadiumName,
    stadiumCapacity,
    nickname,
    founded,
    rival
  };
}
