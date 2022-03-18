import { CreateTypes } from 'canvas-confetti';
import React, { useCallback, useEffect, useRef } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';

interface ConfettiProps {
  fireFromParent: React.MutableRefObject<(() => void) | null>;
}

export default function Confetti({ fireFromParent }: ConfettiProps) {
  const instance = useRef<CreateTypes | null>(null);

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    makeShot(0.2, {
      spread: 60,
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, []);

  useEffect(() => {
    fireFromParent.current = fire;
  }, [fireFromParent, fire]);

  function makeShot(particleRatio: number, opts: object) {
    instance?.current &&
      instance.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(400 * particleRatio),
      });
  }

  const getInstance = (next: CreateTypes | null) => {
    instance.current = next;
  };

  return <ReactCanvasConfetti refConfetti={getInstance} className='canvas' />;
}
