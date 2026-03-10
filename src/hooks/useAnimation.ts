import { useState, useCallback, useRef } from 'react';

interface AnimationOptions {
  duration?: number;
  easing?: string;
  onComplete?: () => void;
}

/**
 * 动画管理 Hook
 * 提供游戏内各种动画效果
 */
export const useAnimation = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | null>(null);

  /**
   * 骰子滚动动画
   */
  const animateDice = useCallback(async (onRollComplete: () => void) => {
    setIsAnimating(true);
    
    // 模拟骰子滚动效果 (0.5 秒)
    let rolls = 0;
   const maxRolls = 10;
    
   return new Promise<void>((resolve) => {
     const animate = () => {
        rolls++;
       if (rolls < maxRolls) {
          // 随机显示骰子点数
         const tempD1 = Math.floor(Math.random() * 6) + 1;
         const tempD2 = Math.floor(Math.random() * 6) + 1;
         onRollComplete();
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
         resolve();
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
      setTimeout(() => {
       if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        setIsAnimating(false);
       resolve();
      }, 500);
    });
  }, []);

  /**
   * 玩家移动动画
   */
  const animatePlayerMove = useCallback(async (
    from: number,
   to: number,
   onStepComplete: (position: number) => void,
    options?: AnimationOptions
  ) => {
   const duration = options?.duration || 300; // 每格 300ms
    setIsAnimating(true);
    
   const steps = to > from ? to - from : (24 - from + to);
    
    for (let i = 0; i < steps; i++) {
      await new Promise(resolve => setTimeout(resolve, duration));
     const newPosition = (from + i + 1) % 24;
     onStepComplete(newPosition);
    }
    
    setIsAnimating(false);
  }, []);

  /**
   * HP 变化动画
   */
  const animateHPChange = useCallback(async (
    from: number,
   to: number,
   onUpdate: (value: number) => void,
    options?: AnimationOptions
  ) => {
   const duration = options?.duration || 500;
   const startTime = Date.now();
    setIsAnimating(true);
    
   return new Promise<void>((resolve) => {
     const animate = () => {
       const elapsed = Date.now() - startTime;
       const progress = Math.min(elapsed / duration, 1);
        
        // 使用缓动函数
       const eased = 1 - Math.pow(1 - progress, 3); // cubic ease out
        
       const currentValue = Math.round(from + (to - from) * eased);
       onUpdate(currentValue);
        
       if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          options?.onComplete?.();
         resolve();
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
    });
  }, []);

  /**
   * 建造厕所动画
   */
  const animateConstruction = useCallback(async (
   onComplete: () => void,
    options?: AnimationOptions
  ) => {
    setIsAnimating(true);
    
    // 模拟锤子敲击 3 次
   const hammerCount = 3;
   const hammerDuration = 200;
    
    for (let i = 0; i < hammerCount; i++) {
      await new Promise(resolve => setTimeout(resolve, hammerDuration));
    }
    
    setIsAnimating(false);
    options?.onComplete?.();
   onComplete();
  }, []);

  /**
   * 清理动画
   */
  const cleanup = useCallback(() => {
   if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsAnimating(false);
  }, []);

  return {
   isAnimating,
    animateDice,
    animatePlayerMove,
    animateHPChange,
    animateConstruction,
    cleanup,
  };
};
