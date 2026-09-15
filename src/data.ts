import { Puzzle } from "./types";

export const PUZZLES: Puzzle[] = [
  { h: ["snake", "least", "every"], v: ["solve", "aware", "entry"] },
  { h: ["snake", "least", "their"], v: ["split", "aware", "enter"] },
  { h: ["snake", "under", "floor"], v: ["stuff", "audio", "error"] },
  { h: ["snake", "acute", "entry"], v: ["scale", "adult", "enemy"] },
  { h: ["about", "actor", "dance"], v: ["award", "often", "three"] },
  { h: ["about", "actor", "nurse"], v: ["again", "outer", "three"] }
];

export const WORDS: string[] = `about above abuse actor acute admit adopt adult after again agent agree ahead alarm album alert alike alive allow alone along alter among anger angle angry apart apple apply arena argue arise array aside asset atlas audio avoid award aware badly baker bases basic basis beach began begin being below bench birth black blade blame blind block blood board boost brain brand bread break breed brief bring broad broke brown build built bunch buyer carry catch cause chain chair chart cheap check chest chief child china chose civil claim class clean clear click clock close cloud coach coast could count court cover craft crane crash cream crime cross crowd crown curse curve cycle daily dance dated dealt death debut delay depth doubt dozen draft drama drawn dream dress drill drink drive drove dying early earth eight elite empty enemy enjoy enter entry equal error event every exact exist extra faith false fault fiber field fifth fifty fight final first fixed flash fleet floor fluid focus force forth found frame frank fraud fresh front fruit fully funny giant given glass globe going grace grade grain grand grant grass grave great green gross group grown guard guess guest guide happy heart heavy horse hotel house human ideal image imply index inner input issue juice joint judge known label large laser later laugh layer learn lease least leave legal level light limit lives local logic loose lower lucky lunch lying magic major maker march match maybe mayor meant media metal might minor minus mixed model money month moral motor mount mouse mouth movie music need never newly night noise north noted novel nurse occur ocean offer often order other ought outer owner paint panel paper party pause peace phase phone photo piece pilot pitch place plain plane plant plate point pound power press price pride prime print prior prize proof proud prove queen quick quiet quite radio raise range rapid reach ready refer right river roman rough round route royal rural scale scene scope score sense serve seven shall shape share sharp sheet shelf shell shift shine shirt shock shoot short sight since sixth skill slave sleep slice slide small smart smell smile smith smoke snake snow solid solve sorry sound south space spare speak speed spend spent spite split spoke sport staff stage stake stand start stare state steal steam steel stick still stock stone stood store storm story strip stuck study stuff style sugar suite super sweet table taken taste taxes teach teeth thank theft their theme there these thick thing think third those three threw throw tight times tired title total touch tough tower track trade train treat trial tried truck truly trust truth twice under until upper upset urban usage usual valid value video visit vital voice waste watch water wheel where which while white whole whose woman world worry worth would write wrong wrote yield young youth slate grape flame brick ember stars class`.split(/\s+/);

export const VALID: Set<string> = new Set(WORDS);

export const MAP: number[][][] = [
  [[0,0],[0,1],[0,2],[0,3],[0,4]],
  [[2,0],[2,1],[2,2],[2,3],[2,4]],
  [[4,0],[4,1],[4,2],[4,3],[4,4]],
  [[0,0],[1,0],[2,0],[3,0],[4,0]],
  [[0,2],[1,2],[2,2],[3,2],[4,2]],
  [[0,4],[1,4],[2,4],[3,4],[4,4]]
];

export const KEY_ROWS: string[] = ["qwertyuiop", "asdfghjkl", "↵zxcvbnm⌫"];

export const EPOCH: Date = new Date(2026, 0, 1);
