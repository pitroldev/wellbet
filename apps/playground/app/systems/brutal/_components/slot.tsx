"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Zap } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { B, BORDER, TWEEN, brl, seeded } from "./tokens";
import { Block, BrutalButton, MonoLabel } from "./primitives";

type Face = { sym: string; label: string; mult: number; bg: string; fg: string };
const FACES: Face[] = [
  { sym: "×2", label: "FREE BET", mult: 2, bg: B.green, fg: B.ink },
  { sym: "×5", label: "JACKPOT", mult: 5, bg: B.magenta, fg: "#FFFFFF" },
  { sym: "×1", label: "DE NOVO", mult: 1, bg: B.white, fg: B.ink },
  { sym: "×3", label: "BÔNUS", mult: 3, bg: B.blue, fg: "#FFFFFF" },
  { sym: "×0", label: "RED", mult: 0, bg: B.ink, fg: B.pink },
];

const STAKE = 20;

/**
 * Slot mecânico de 1 rolo. PARA SECO (sem mola): durante o giro trocamos a face
 * por render condicional + key num intervalo; ao parar, fixa o resultado.
 */
export function Slot() {
  const [spinning, setSpinning] = useState(false);
  const [faceIdx, setFaceIdx] = useState(2);
  const [frame, setFrame] = useState(0); // contador de quadros do giro (estado, seguro no render)
  const [result, setResult] = useState<number | null>(null);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!spinning) return;
    const id = setInterval(() => {
      setFrame((f) => f + 1);
      setFaceIdx((p) => (p + 1) % FACES.length);
    }, 70);
    return () => clearInterval(id);
  }, [spinning]);

  function spin() {
    if (spinning) return;
    setResult(null);
    setFrame(0);
    setSpinning(true);
    const r = run + 1;
    setRun(r);
    // resultado determinístico por execução
    const final = Math.floor(seeded(r * 3 + 1) * FACES.length);
    window.setTimeout(() => {
      setSpinning(false);
      setFaceIdx(final);
      setResult(final);
    }, 900);
  }

  const face = FACES[faceIdx];
  const won = result !== null && FACES[result].mult >= 2;
  const payout = result !== null ? STAKE * FACES[result].mult : 0;

  return (
    <Block bg={B.white} className="overflow-hidden">
      {won && <Confetti key={run} colors={[B.green, B.magenta, B.blue]} />}

      <div className="flex items-center justify-between px-4 py-3" style={{ background: B.ink }}>
        <span className="font-[family-name:var(--font-archivo)] text-base font-black uppercase tracking-wide text-white">
          SLOT // 1 ROLO
        </span>
        <MonoLabel style={{ color: B.pink }}>STAKE {brl(STAKE)}</MonoLabel>
      </div>

      <div className="grid place-items-center p-5">
        {/* janela do rolo */}
        <div
          className="grid h-36 w-full place-items-center overflow-hidden"
          style={{ border: BORDER, background: B.paper }}
        >
          {/* render condicional + key: troca seca, sem AnimatePresence em loop */}
          <motion.div
            key={spinning ? "spin-" + frame : "res-" + faceIdx}
            initial={{ y: spinning ? -18 : 0, opacity: spinning ? 0.4 : 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={TWEEN}
            className="grid w-[78%] place-items-center py-4"
            style={{ background: face.bg, color: face.fg, border: BORDER }}
          >
            <span className="font-[family-name:var(--font-archivo)] text-5xl font-black uppercase leading-none tabular-nums">
              {face.sym}
            </span>
            <span className="mt-1 font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-widest">
              {face.label}
            </span>
          </motion.div>
        </div>

        {/* resultado */}
        <div className="mt-4 h-10 w-full text-center">
          {result !== null && !spinning && (
            <motion.p
              key={run}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              className="font-[family-name:var(--font-mono)] text-lg font-bold uppercase tabular-nums"
              style={{ color: won ? B.ink : B.ink, opacity: won ? 1 : 0.7 }}
            >
              {won ? `GREEN +${brl(payout)}` : "RED // GIRA DE NOVO"}
            </motion.p>
          )}
        </div>

        <BrutalButton
          onClick={spin}
          disabled={spinning}
          bg={spinning ? B.white : B.magenta}
          fg={spinning ? B.ink : "#FFFFFF"}
          className="w-full"
          style={{ minHeight: 52 }}
        >
          {spinning ? (
            <>
              <Zap size={18} fill="currentColor" /> GIRANDO…
            </>
          ) : (
            <>
              <Play size={18} fill="currentColor" /> GIRAR ROLO
            </>
          )}
        </BrutalButton>
      </div>
    </Block>
  );
}
