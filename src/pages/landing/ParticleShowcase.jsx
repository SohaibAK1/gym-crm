import { ParticleTextEffect } from '@/components/ui/particle-text-effect'

const GYM_WORDS = ["IRONHUB", "TRAIN", "STRONGER", "PERFORM", "GROW"]

export default function ParticleShowcase() {
  return <ParticleTextEffect words={GYM_WORDS} />
}
