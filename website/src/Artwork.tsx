import { useId } from "react";
import type { Category } from "./booking";

function Person({
  x,
  y,
  shirt = "#c5d9b3",
  scale = 1,
}: {
  x: number;
  y: number;
  shirt?: string;
  scale?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="8" rx="12" ry="5" fill="#163e2c" opacity=".12" />
      <path
        d="m-5-27-3 30m13-30 4 30"
        stroke="#344c42"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d="M-8-55q8-6 16 0l3 29h-22z" fill={shirt} />
      <path
        d="m-9-51-8 21m26-21 7 20"
        stroke="#b98c69"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cy="-65" r="8" fill="#b98c69" />
      <path d="M-8-66q1-13 12-9l4 10-7-6z" fill="#28382e" />
    </g>
  );
}
function Tree({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cy="5" rx="36" ry="12" fill="#174e3b" opacity=".08" />
      <path d="M0 0q-9-65 2-126" fill="none" stroke="#a18d68" strokeWidth="8" />
      <path
        d="M2-124q-47-50-74-18 45-2 74 18M2-124q-21-71-52-46 38 18 52 46M2-124q16-75 43-52-33 20-43 52M2-124q62-44 77-7-43-8-77 7M2-124q-45-6-53 28 25-27 53-28M2-124q43 3 47 34-22-24-47-34"
        fill="#4f7960"
      />
      <path d="M2-124q-5-67 17-62-12 27-17 62" fill="#739272" />
    </g>
  );
}
export function HubArt() {
  const id = useId().replaceAll(":", "");
  return (
    <svg
      className="hub-art"
      viewBox="0 0 760 620"
      role="img"
      aria-label="Illustrated QUbe concept: forest-green and cream modular containers, sunny terraces, palms and students"
    >
      <defs>
        <linearGradient id={`${id}glass`} x1="0" x2="1" y2="1">
          <stop stopColor="#a8c6bb" />
          <stop offset="1" stopColor="#65887c" />
        </linearGradient>
        <pattern
          id={`${id}ribs`}
          width="15"
          height="15"
          patternUnits="userSpaceOnUse"
          patternTransform="skewY(18)"
        >
          <path d="M1 0v15" stroke="#fff" opacity=".13" strokeWidth="3" />
        </pattern>
      </defs>
      <circle cx="604" cy="112" r="53" fill="#f2e1b7" opacity=".7" />
      <path d="m38 407 294-180 385 191-283 170z" fill="#d4dfd0" />
      <path d="m44 426 291-165 368 178-271 155z" fill="#eae7da" />
      <path d="m360 394 84 37-213 132-77-38z" fill="#f8f6ec" />
      <ellipse
        cx="408"
        cy="447"
        rx="238"
        ry="82"
        fill="#193f2c"
        opacity=".09"
      />
      <Tree x={672} y={410} scale={1.1} />
      <Tree x={90} y={376} scale={0.9} />
      <path d="m132 311 235-137 281 105-232 143z" fill="#d7d8c5" />
      <path d="m132 311 284 111v135L132 444z" fill="#1d5944" />
      <path d="m416 422 232-143v132L416 557z" fill="#174737" />
      <path d="m132 311 284 111v135L132 444z" fill={`url(#${id}ribs)`} />
      <path d="m416 422 232-143v132L416 557z" fill={`url(#${id}ribs)`} />
      <path d="m153 335 102 40v83l-102-40z" fill="#a7bdb0" />
      <path d="m160 344 88 34v69l-88-34z" fill={`url(#${id}glass)`} />
      <path d="m161 405 87-29M204 359v71" stroke="#cddace" strokeWidth="3" />
      <path d="m275 381 112 44v105l-112-44z" fill="#d3dccb" />
      <path d="m281 389 100 39v93l-100-39z" fill={`url(#${id}glass)`} />
      <path d="m332 409 0 93" stroke="#d3dccb" strokeWidth="4" />
      <path d="m321 456 0 11" stroke="#f0edda" strokeWidth="3" />
      <path
        d="m448 423 79-49v88l-79 48zM543 364l79-49v88l-79 48z"
        fill="#8eafa2"
      />
      <path d="m487 400 0 88m95-147v86" stroke="#315c49" strokeWidth="4" />
      <path
        d="m132 311 284 111 232-143"
        fill="none"
        stroke="#eff0db"
        strokeWidth="7"
      />
      <path d="m245 219 165 63 199-118-166-61z" fill="#f5f1e3" />
      <path d="m245 219 165 63v112l-165-64z" fill="#e6dec9" />
      <path d="m410 282 199-118v112L410 394z" fill="#c7c8b0" />
      {Array.from({ length: 10 }, (_, i) => (
        <path
          key={i}
          d={`m${251 + i * 15} ${223 + i * 5.75}v102`}
          stroke="#bdb69e"
          opacity=".55"
          strokeWidth="2"
        />
      ))}
      <path d="m264 244 125 48v74l-125-48z" fill="#709286" />
      <path d="m270 251 113 43v61l-113-43z" fill={`url(#${id}glass)`} />
      <path d="m325 273 0 62" stroke="#e1ddcc" strokeWidth="3" />
      <path d="m438 282 145-87v78l-145 86z" fill="#78998a" />
      <path d="m485 254 0 78m47-105v77" stroke="#d8dcc8" strokeWidth="4" />
      <path
        d="m245 219 165 63 199-118"
        fill="none"
        stroke="#fffcf0"
        strokeWidth="6"
      />
      <path d="m300 190 78 29 118-69-77-29z" fill="#315c51" />
      <path
        d="m310 187 78 29m-54-43 78 29m-54-43 78 29m-32-57-119 69m155-55-119 69"
        stroke="#94aea1"
        strokeWidth="1.4"
      />
      <path
        d="m151 293 87-51 0 82-87-34"
        fill="none"
        stroke="#aebba6"
        strokeWidth="3"
      />
      {Array.from({ length: 6 }, (_, i) => (
        <path
          key={i}
          d={`m${155 + i * 15} ${291 - i * 8.8}v25`}
          stroke="#aebba6"
          strokeWidth="2"
        />
      ))}
      <g transform="translate(171 367) skewY(21)">
        <text fill="#edf2de" fontSize="25" fontWeight="800" letterSpacing="-1">
          QUbe
        </text>
        <text y="15" fill="#bfd3bf" fontSize="5.8" letterSpacing="1.4">
          YOUR SPACE BETWEEN CLASSES
        </text>
      </g>
      <path d="m404 558 44-27 33 13-45 28z" fill="#beb99f" />
      <path d="m404 558v10l32 13v-9m0 0 45-28v10l-45 27" fill="#d8d2bd" />
      <g transform="translate(565 462)">
        <path d="m-28-5 39-24 43 16-41 24z" fill="#b28e62" />
        <path
          d="M-23-3v19m68-25v19m-34-7v19"
          stroke="#7f7255"
          strokeWidth="4"
        />
        <path
          d="m-41 17 34 13 23-14-34-13zm27-57 35 13 23-14-35-12z"
          fill="#b39268"
        />
        <path
          d="m-35 21 0 14m44-11v14m-16-75v12m43-10v14"
          stroke="#8b7859"
          strokeWidth="3"
        />
      </g>
      <Person x={393} y={564} shirt="#c0cc95" scale={0.82} />
      <Person x={514} y={491} shirt="#e1b38f" scale={0.78} />
      <Person x={191} y={484} shirt="#f2ead5" scale={0.75} />
      <g fill="#6c8865">
        <ellipse cx="124" cy="445" rx="27" ry="12" />
        <ellipse cx="121" cy="432" rx="18" ry="15" />
        <ellipse cx="629" cy="431" rx="30" ry="13" />
        <ellipse cx="639" cy="418" rx="19" ry="17" />
      </g>
      <path
        d="m69 473 51 20m465 59 39-23m-364 55 35 13"
        stroke="#c2ccb9"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
export function SpaceArt({
  category,
  className = "",
}: {
  category: Category;
  className?: string;
}) {
  const id = useId().replaceAll(":", "");
  const colors = {
    rest: ["#e0e8dc", "#d6ddcc", "#b6c1aa"],
    focus: ["#e2ebed", "#d4e0e0", "#afc4c1"],
    group: ["#eee5d4", "#e4d8c1", "#c8b99e"],
    shower: ["#e2eae3", "#d4dfd4", "#adc5ba"],
  }[category];
  return (
    <svg
      viewBox="0 0 600 410"
      preserveAspectRatio="xMidYMid slice"
      className={`space-art ${className}`}
      role="img"
      aria-label={`Illustrative interior of a QUbe ${category === "rest" ? "rest pod with a daybed" : category === "focus" ? "focus booth with a desk and chair" : category === "group" ? "group study room with four seats" : "private shower suite"}`}
    >
      <defs>
        <linearGradient id={`${id}light`} x2="1" y2="1">
          <stop stopColor="#ffffff" stopOpacity=".45" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <pattern
          id={`${id}tile`}
          width="42"
          height="42"
          patternUnits="userSpaceOnUse"
        >
          <path d="M42 0H0v42" stroke="#b5c9bc" fill="none" strokeWidth="1" />
        </pattern>
      </defs>
      <path fill={colors[0]} d="M0 0h600v410H0z" />
      <path d="M0 0h600v288L203 245 0 307z" fill={colors[1]} />
      <path d="M0 0h204v246L0 308z" fill={colors[2]} opacity=".65" />
      <path d="m0 308 204-63 396 43v122H0z" fill="#e9e3d6" />
      <path
        d="m204 245 396 43M204 245 0 308"
        stroke="#9ba48f"
        strokeWidth="2"
        opacity=".4"
      />
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M0 ${335 + i * 28} 600 ${304 + i * 28}`}
          stroke="#d2c9b7"
          strokeWidth="1"
          opacity=".5"
        />
      ))}
      {category !== "shower" && (
        <>
          <path d="M34 51 154 69v147L34 236z" fill="#607e6c" />
          <path d="m41 59 106 16v134L41 227z" fill="#b8cbb9" />
          <path d="m46 158 96-37v83l-96 15z" fill="#a6bda7" />
          <path d="M91 68v149M39 143l109-2" stroke="#e7e7d7" strokeWidth="5" />
          <path d="m43 63 102 15v52L43 201z" fill={`url(#${id}light)`} />
        </>
      )}
      {category === "rest" && (
        <>
          <path d="m210 260 215 26 79 62-218-24z" fill="#b9c3ad" opacity=".7" />
          <path d="m212 203 197 22 86 70-202-25z" fill="#eee8d6" />
          <path d="m212 203 81 67v44l-81-67z" fill="#9baf94" />
          <path d="m293 270 202 25v44l-202-25z" fill="#829b7f" />
          <path d="m218 185 195 23 77 72-195-24z" fill="#f4f0e4" />
          <path
            d="m218 185 77 71v17l-77-70zm77 71 195 24v17l-195-24z"
            fill="#e2decd"
          />
          <path d="m245 202 47 5 32 28-48-6z" fill="#fcfaef" />
          <path d="m301 209 47 6 33 28-47-6z" fill="#e9e8dc" />
          <path d="m359 225 53 6 76 49-56-6z" fill="#526f51" />
          <path d="m432 274 56 6v25l-56-7z" fill="#456249" />
          <path
            d="m371 230 48 6m-35 7 48 6m-35 7 47 6"
            stroke="#79916b"
            strokeWidth="2"
          />
          <path d="m204 188 0-44 215 25v46" fill="#71856a" />
          <path d="m211 151 200 24" stroke="#8b9b80" strokeWidth="3" />
          <path d="m484 260 49 6 23 18-49-5z" fill="#bba278" />
          <path d="m488 268v38m60-28v38" stroke="#988866" strokeWidth="4" />
          <path d="m512 258 0-42" stroke="#6c725b" strokeWidth="3" />
          <path d="m496 215 5-21 22 2 10 23z" fill="#ece5ce" />
          <path d="m280 44 106 13v66l-106-13z" fill="#f3efdf" />
          <path d="m292 60 81 10v41l-81-10z" fill="#b4c0a4" />
          <path d="m292 94 36-21 45 38z" fill="#879d80" />
        </>
      )}
      {category === "focus" && (
        <>
          <path d="m178 228 245 26 95 61-252-25z" fill="#beb092" />
          <path d="m178 219 245 26 95 61-252-25z" fill="#d7c5a4" />
          <path
            d="m189 235 0 84m313-20v58m-232-68v55"
            stroke="#6f7969"
            strokeWidth="6"
          />
          <path d="m282 220 59 6 23 23-62-6z" fill="#66726a" />
          <path d="m282 220-2-54 60 7 1 53z" fill="#405a4f" />
          <path d="m285 171 50 6 1 42-49-5z" fill="#b7c9bc" />
          <path d="m378 247 37 4 19 12-38-4z" fill="#f9f7eb" />
          <path d="m380 241 37 4 18 12-37-4z" fill="#aebba4" />
          <path
            d="m439 243 0-55-29-17"
            fill="none"
            stroke="#455c4e"
            strokeWidth="4"
          />
          <path d="m391 169 19-6 19 11-17 8z" fill="#415c4c" />
          <ellipse
            cx="340"
            cy="353"
            rx="58"
            ry="14"
            fill="#a6b4a5"
            opacity=".3"
          />
          <path
            d="m327 316v34m-30 5 30-5 31 12m-31-12 28-12"
            fill="none"
            stroke="#4f6354"
            strokeWidth="4"
          />
          <path d="m283 298 71 7 29 26-72-8z" fill="#789483" />
          <path d="m280 250q0-8 9-7l64 8q8 1 9 11l-8 43-71-7z" fill="#5f7e6c" />
          <path d="m468 64 66 7v84l-66-7z" fill="#f2f2e7" />
          <path
            d="m479 83 41 5m-41 11 31 4m-31 11 36 4"
            stroke="#9aa995"
            strokeWidth="3"
          />
          <path d="M244 0v52" stroke="#5f705f" strokeWidth="3" />
          <path d="m213 67 13-23 34 4 17 29z" fill="#547665" />
        </>
      )}
      {category === "group" && (
        <>
          <path d="m266 47 224 23v100l-224-24z" fill="#728477" />
          <path d="m272 54 212 23v85l-212-22z" fill="#f4f2e5" />
          <path
            d="m290 83 46 5m-46 13 69 7m-69 12 51 5m52-34 48 5m-26-3 0 40m-27-22 56 6"
            stroke="#879a84"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path d="m179 228 170 20 117 82-174-20z" fill="#ae9b75" />
          <path d="m179 218 170 20 117 82-174-20z" fill="#c6b18a" />
          <path
            d="m195 232v66m248 23v61m-146-69v58m34-129v68"
            stroke="#6d7865"
            strokeWidth="6"
          />
          {[
            [207, 183],
            [318, 197],
            [244, 288],
            [367, 305],
          ].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <path
                d="m0 0 42 5v36L0 36z"
                fill={i < 2 ? "#728772" : "#6b8168"}
              />
              <path d="m0 36 42 5 24 19-43-4z" fill="#8c9b7c" />
              <path
                d="M3 40v43m58-26v40m-34-37v40"
                stroke="#6e7762"
                strokeWidth="4"
              />
            </g>
          ))}
          <path d="m284 254 44 5 28 19-44-4z" fill="#f3efdf" />
          <path d="m268 240 32 3 16 12-34-3z" fill="#688370" />
          <path d="m379 286 22 2v14l-22-2z" fill="#f4f0de" />
          <path d="M357 0v38" stroke="#7d8065" strokeWidth="3" />
          <path d="m321 57 17-24 36 4 22 28z" fill="#ded3b5" />
        </>
      )}
      {category === "shower" && (
        <>
          <path d="M0 0h600v288L203 245 0 307z" fill={`url(#${id}tile)`} />
          <path d="m49 268 150-42 104 28-157 46z" fill="#c5cdbd" />
          <path
            d="m49 268 97 32v9l-97-32zm97 32 157-46v9l-157 46z"
            fill="#a7b9ab"
          />
          <path d="m178 67 0 95m0-94 40 8" stroke="#6f8c7c" strokeWidth="5" />
          <path d="m199 80 37 4-17 10-34-4z" fill="#7e9988" />
          <path
            d="m83 68 0 211 62 20 0-216z"
            fill="#e3f0e8"
            opacity=".35"
            stroke="#8da99b"
            strokeWidth="3"
          />
          <path
            d="m145 83 126-35v213l-126 38z"
            fill="#d9ece2"
            opacity=".4"
            stroke="#8da99b"
            strokeWidth="3"
          />
          <path d="M245 150v34" stroke="#6a8b79" strokeWidth="4" />
          <path d="m363 57 99 12v114l-99-12z" fill="#8da696" />
          <path d="m369 64 87 10v101l-87-10z" fill="#c8d9ca" />
          <path d="m376 70 74 9-74 78z" fill="#e2eadc" opacity=".5" />
          <path d="m324 219 169 20 47 32-173-20z" fill="#eee8d8" />
          <path d="m333 227 164 21v75l-164-20z" fill="#a2b19b" />
          <path d="m366 251 0 56m63-49v56" stroke="#839c84" strokeWidth="2" />
          <ellipse cx="420" cy="240" rx="36" ry="12" fill="#b9c6b1" />
          <ellipse cx="420" cy="236" rx="36" ry="12" fill="#f9f6e9" />
          <path
            d="M425 226v-27l-15-2v9"
            stroke="#748d7c"
            strokeWidth="4"
            fill="none"
          />
          <path
            d="m525 160 35 4m-32 0v63l30 4v-64"
            stroke="#809583"
            strokeWidth="3"
            fill="#ede8d7"
          />
        </>
      )}
      {category !== "shower" && (
        <g transform="translate(535 217)">
          <path d="m-14 31 6 35 21 2 7-33z" fill="#d2c5a5" />
          <path d="m4 35 0-64" stroke="#66865e" strokeWidth="3" />
          <path
            d="M4 1q-36-32-30-46Q2-44 4 1M4 21q28-37 38-30 0 29-38 30M4-15q18-38 30-29 1 25-30 29M4 29q-30-7-32-24 24-5 32 24"
            fill="#718d63"
          />
        </g>
      )}
      <path fill={`url(#${id}light)`} d="M0 0h600v410H0z" />
    </svg>
  );
}
export function LocationArt() {
  return (
    <svg
      viewBox="0 0 600 340"
      className="location-art"
      role="img"
      aria-label="Illustrative location diagram showing a proposed QUbe hub near Qatar University Metro Station. Not a navigational map."
    >
      <path fill="#e4eadd" d="M0 0h600v340H0z" />
      <path
        d="M-50 287 650 34M94-30l220 400M405-30l176 370"
        stroke="#f9faf2"
        strokeWidth="25"
      />
      <path d="m0 111 600 60M0 195l600 66" stroke="#f7f8ef" strokeWidth="12" />
      <g fill="#ccd7c3">
        <rect
          x="57"
          y="32"
          width="73"
          height="47"
          rx="7"
          transform="rotate(-20 57 32)"
        />
        <rect
          x="303"
          y="46"
          width="87"
          height="58"
          rx="7"
          transform="rotate(-20 303 46)"
        />
        <rect x="35" y="232" width="69" height="62" rx="7" />
        <rect
          x="361"
          y="238"
          width="88"
          height="59"
          rx="7"
          transform="rotate(-20 361 238)"
        />
        <rect x="180" y="127" width="70" height="58" rx="7" />
      </g>
      <path d="M-20 330 620 95" stroke="#b48d72" strokeWidth="7" />
      <path
        d="m286 219 66-42 66-12"
        stroke="#174e3b"
        strokeWidth="3"
        strokeDasharray="5 6"
        fill="none"
      />
      <circle
        cx="286"
        cy="219"
        r="13"
        fill="#fbfcfa"
        stroke="#ad7c5e"
        strokeWidth="5"
      />
      <g transform="translate(410 127)">
        <circle r="31" fill="#174e3b" />
        <path
          d="m-13-8 13-7 13 7v16L0 15l-13-7zm0 0L0 0l13-8M0 0v15"
          fill="none"
          stroke="#e2f0e9"
          strokeWidth="2"
        />
      </g>
      <rect x="183" y="253" width="206" height="36" rx="18" fill="#fbfcfa" />
      <text
        x="286"
        y="276"
        textAnchor="middle"
        fontSize="12"
        fontFamily="sans-serif"
        fill="#4f6150"
      >
        Qatar University Metro Station
      </text>
      <rect x="365" y="64" width="98" height="26" rx="13" fill="#fbfcfa" />
      <text
        x="414"
        y="81"
        textAnchor="middle"
        fontSize="10"
        fontFamily="sans-serif"
        fill="#174e3b"
      >
        Proposed QUbe
      </text>
      <text x="20" y="320" fontSize="10" fontFamily="sans-serif" fill="#61725e">
        ILLUSTRATIVE LOCATION DIAGRAM
      </text>
    </svg>
  );
}
