import { useEffect } from "react";
import "./App.css";
import { celebrationColors } from "./color.ts";

interface Particle {
  x: number;
  y: number;
  r: number;
  d: number;
  color: string;
  tilt: number;
  tiltAngleIncremental: number;
  tiltAngle: number;
  xVelocity: number;
  yVelocity: number;
  gravity: number;
  rotation: number;
  rotationSpeed: number;
  originalSize: number;
  startDelay: number;
}

interface Coordinates {
  x: number;
  y: number;
}

function App() {
  const fire = () => {
    document.querySelectorAll(".canvas").forEach((e) => e.remove());

    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "0";
    canvas.classList.add("canvas");
    const context = canvas.getContext("2d");

    if (context) {
      const confettiCount = 300;
      const particles: Particle[] = [];

      const coordinates = (): Coordinates => {
        let x = Math.random() * canvas.width;
        let y = -15;

        return {
          x,
          y,
        };
      };

      for (let i = 0; i < confettiCount; i++) {
        const { x, y } = coordinates();
        const determineYVelocity = () => {
          return Math.random() * 1 + 1; // random value between 1 and 2
        };

        particles.push({
          x,
          y,
          r: Math.random() * 25 + 2,
          originalSize: Math.random() * 15 + 2,
          d: Math.random() * confettiCount,
          color:
            celebrationColors[
              Math.floor(Math.random() * celebrationColors.length)
            ],
          tilt: Math.floor(Math.random() * 8) - 8,
          tiltAngleIncremental: Math.random() * 0.08 + 0.07,
          tiltAngle: Math.random() * Math.PI * 2,
          xVelocity: Math.random() * 2 - 1, // random value between -1 and 1
          yVelocity: determineYVelocity(), // random value between -3 and -1
          gravity: Math.random() * 0.02 + 0.01, // random value between 0.01 and 0.02
          rotation: Math.random() * 360, // random initial rotation
          rotationSpeed: Math.random() * 10 - 5, // how quickly this particle will rotate
          startDelay: Math.random() * 1000, // random delay between 0 and 1000 milliseconds
        });
      }

      const render = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
          context.save();
          context.translate(p.x, p.y);
          context.rotate((p.rotation * Math.PI) / 180);
          context.fillStyle = p.color;

          // Adjust the height based on the rotation
          let height =
            Math.abs(Math.cos((p.rotation * Math.PI) / 180)) * p.originalSize;

          context.fillRect(
            -p.originalSize / 2,
            -height / 2,
            p.originalSize,
            height
          );

          context.restore();
        });
      };

      const update = () => {
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          // Decrease startDelay
          p.startDelay -= 1;

          // Skip this iteration if startDelay is not yet 0
          if (p.startDelay > 0) {
            continue;
          }
          p.tiltAngle += p.tiltAngleIncremental * 2;
          p.tilt = Math.sin(p.tiltAngle) * 15;

          // Update the position based on the velocity
          p.x += p.xVelocity;
          p.y += p.yVelocity;

          // Apply gravity
          p.yVelocity += p.gravity;

          // Update rotation
          p.rotation += p.rotationSpeed;

          // Remove the particle when it moves off the canvas
          if (p.y >= canvas.height || p.x < 0 || p.x > canvas.width) {
            particles.splice(i, 1);
          }
        }
      };

      let animationId: number | null = null;

      const confetti = () => {
        render();
        update();
        animationId = requestAnimationFrame(confetti);

        if (particles.length === 0) {
          if (animationId !== null) {
            cancelAnimationFrame(animationId);
          }
        }
      };

      confetti();
    }
  };

  useEffect(() => {
    fire();
  }, []);

  return <></>;
}

export default App;
